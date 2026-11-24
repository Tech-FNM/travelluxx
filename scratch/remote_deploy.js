// Deploys the site to the production server.
//
//   node scratch/remote_deploy.js               build locally, upload the build, restart
//   node scratch/remote_deploy.js --skip-build  reuse the .next folder that is already here
//   node scratch/remote_deploy.js --dry-run     print what would run on the server, change nothing
//
// Commit and push first: the server takes its code from GitHub (origin/main).
//
// Why the build runs on this machine and not on the server: the hosting container allows only
// about 64 threads and very little memory, so `next build` cannot run there, and `git pull`
// only works with pack.threads=1. The server just receives the finished .next folder.
import { Client } from "ssh2";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const conn = new Client();

const config = {
  host: "198.38.90.25",
  port: 22,
  username: "travellu3",
  password: "Admin1122@@",
  readyTimeout: 30000,
  keepaliveInterval: 10000
};

function fail(message) {
  console.error(`\n✖ ${message}`);
  process.exit(1);
}

const git = (...args) => spawnSync("git", args, { cwd: root, encoding: "utf8" }).stdout.trim();

// ---------------------------------------------------------------- 1. local checks + build
const head = git("rev-parse", "HEAD");
if (head !== git("rev-parse", "origin/main")) {
  fail("Your latest commit is not on GitHub yet. Run `git push origin main`, then deploy again.");
}
if (git("status", "--porcelain", "--", "pages", "src", "public", "server.ts", "next.config.mjs", "package.json")) {
  console.warn("⚠ You have uncommitted changes. They will be in the uploaded pages, but not in the code the server pulls from GitHub.");
}

if (!process.argv.includes("--skip-build")) {
  console.log("① Building the site locally...");
  const build = spawnSync("npx next build", { cwd: root, stdio: "inherit", shell: true });
  if (build.status !== 0) fail("The local build failed. Nothing was deployed.");
}
if (!fs.existsSync(path.join(root, ".next", "BUILD_ID"))) fail("There is no .next build to upload.");

// Turbopack loads some server packages through hashed aliases in .next/node_modules. Those are
// symlinks into this machine's node_modules, so they are recreated on the server instead of uploaded.
const linkCommands = [];
const aliasDir = path.join(root, ".next", "node_modules");
const collectAliases = (dir, prefix) => {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (name.startsWith("@") && !fs.lstatSync(full).isSymbolicLink()) {
      collectAliases(full, `${prefix}${name}/`);
      continue;
    }
    const link = `${prefix}${name}`;
    // "node_modules/<package>", wherever this machine's node_modules really lives.
    const real = fs.realpathSync(full).split(path.sep).join("/");
    const target = real.slice(real.lastIndexOf("/node_modules/") + 1);
    const up = "../".repeat(1 + link.split("/").length);
    linkCommands.push(
      `[ -e "${target}" ] || abort "dependency ${target} is missing on the server"`,
      `mkdir -p "$(dirname ".next.new/node_modules/${link}")" && ln -sfn "${up}${target}" ".next.new/node_modules/${link}"`
    );
  }
};
if (fs.existsSync(aliasDir)) collectAliases(aliasDir, "");

// ---------------------------------------------------------------- 2. what runs on the server
// Plain bash. Nothing in here uses ${...} so it can live in a template string.
const remoteScript = (bytes) => `#!/bin/bash
say() { echo; echo "== $*"; }
PREV=""
abort() {
  echo; echo "DEPLOY ABORTED: $*"
  if [ -n "$PREV" ] && [ "$(git rev-parse HEAD)" != "$PREV" ]; then
    git reset --hard "$PREV" > /dev/null && echo "Code on the server was put back to the previous commit."
  fi
  echo "The running site was not restarted."
  exit 1
}

cd "$HOME/public_html" || abort "public_html not found"

# Node: nvm has no default version on this server, so "node" is not on PATH in a plain shell.
# Use the same Node the running app uses, else the newest one installed.
LISTENER=$(lsof -t -i:3000 2> /dev/null | head -1)
NODE_BIN=""
[ -n "$LISTENER" ] && NODE_BIN=$(dirname "$(readlink "/proc/$LISTENER/exe" 2> /dev/null)" 2> /dev/null)
if [ ! -x "$NODE_BIN/npm" ]; then
  NODE_BIN=$(ls -d "$HOME"/.nvm/versions/node/*/bin 2> /dev/null | sort -V | tail -1)
fi
[ -x "$NODE_BIN/npm" ] && export PATH="$NODE_BIN:$PATH"
command -v npm > /dev/null || abort "npm is not available on the server"
echo "using node $(node -v) from $NODE_BIN"
[ "$(stat -c %s "$HOME/next-build.tgz" 2> /dev/null)" = "${bytes}" ] || abort "the build upload is incomplete"

# A copy of the app that lost the port keeps running and wastes the container's small thread
# allowance (git and npm then fail with "unable to create thread"). Stop those; keep the live one.
for p in $(pgrep -x -f "node dist/server.cjs"); do
  [ "$p" = "$LISTENER" ] || { kill "$p" 2> /dev/null && echo "stopped an idle duplicate of the app (pid $p)"; }
done

say "1/5 Backing up live data files"
# Bookings and settings saved on the live site are written to JSON files that are tracked in git,
# so the reset below wipes them. Keep a timestamped copy outside the web root first.
BK="../deploy_backups/$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BK" && cp -p *.json "$BK"/ || abort "backup failed"
echo "$(ls "$BK" | wc -l) JSON files copied to $BK"

say "2/5 Updating code from GitHub"
PREV=$(git rev-parse HEAD)
git config pack.threads 1
git reset --hard || abort "git reset failed"
git pull origin main || abort "git pull failed"
[ "$(git rev-parse HEAD)" = "${head}" ] || abort "the server pulled commit $(git rev-parse --short HEAD), but the uploaded build was made from ${head.slice(0, 7)}"

say "3/5 Installing dependencies"
npm install --prefer-offline --no-audit --no-fund || abort "npm install failed"

say "4/5 Unpacking the uploaded build"
rm -rf .next.new && mkdir .next.new || abort "cannot create .next.new"
tar -xzf "$HOME/next-build.tgz" -C .next.new --strip-components=1 || abort "cannot unpack the uploaded build"
[ -f .next.new/BUILD_ID ] || abort "the uploaded build is incomplete"
${linkCommands.join("\n")}
rm -rf .next.old
[ -d .next ] && mv .next .next.old
mv .next.new .next || abort "cannot activate the new build"
rm -f "$HOME/next-build.tgz"
echo "build $(cat .next/BUILD_ID) is in place"

say "5/5 Restarting the app"
listening() { [ -n "$(lsof -t -i:3000 2> /dev/null)" ]; }
healthy() { curl -s --max-time 8 http://127.0.0.1:3000/ 2> /dev/null | grep -q "__NEXT_DATA__"; }
http_code() { curl -s -o /dev/null -w '%{http_code}' --max-time 8 http://127.0.0.1:3000/; }
# Stops EVERY copy of the app first: a copy that failed to get the port lingers and uses up the
# container's small thread allowance. The hosting panel supervises "npm start" in this folder and
# normally brings one copy back within a few seconds; if it does not, one is started by hand.
start_app() {
  pkill -f "node dist/server.cjs" > /dev/null 2>&1
  for i in $(seq 1 15); do sleep 2; listening && return 0; done
  echo "the hosting panel did not restart the app within 30s, starting it manually"
  nohup npm start > server.log 2>&1 < /dev/null &
  for i in $(seq 1 15); do sleep 2; listening && return 0; done
  return 1
}
start_app
for i in $(seq 1 10); do healthy && break; sleep 2; done

if ! healthy; then
  echo; echo "THE NEW VERSION IS NOT SERVING PAGES (homepage answered HTTP $(http_code)). Last log lines:"
  tail -n 12 "$HOME"/persistent_app_*.log 2> /dev/null
  tail -n 12 server.log 2> /dev/null
  echo; echo "Rolling back to the previous version..."
  git reset --hard "$PREV" > /dev/null
  rm -rf .next
  [ -d .next.old ] && mv .next.old .next
  start_app
  for i in $(seq 1 10); do [ "$(http_code)" = "200" ] && break; sleep 2; done
  if [ "$(http_code)" != "200" ]; then
    # The previous version may need the dependencies it was installed with.
    npm install --prefer-offline --no-audit --no-fund > /dev/null 2>&1
    start_app
    for i in $(seq 1 10); do [ "$(http_code)" = "200" ] && break; sleep 2; done
  fi
  echo "previous version answers with HTTP $(http_code)"
  exit 1
fi

echo
echo "DEPLOYED: commit $(git log -1 --format='%h %s' | cut -c1-70), build $(cat .next/BUILD_ID)"
`;

// ---------------------------------------------------------------- 3. upload + run
// Runs one remote command, optionally feeding it input, and resolves with its exit code.
function remote(command, feed) {
  return new Promise((resolve, reject) => {
    conn.exec(command, (err, stream) => {
      if (err) return reject(err);
      stream.on("close", (code) => resolve(code));
      stream.on("data", (data) => process.stdout.write(data.toString()));
      stream.stderr.on("data", (data) => process.stderr.write(data.toString()));
      if (feed) feed(stream);
      else stream.end();
    });
  });
}

conn.on("ready", async () => {
  try {
    console.log("② Uploading the build...");
    let bytes = 0;
    let tarFailed = false;
    const uploadCode = await remote('cat > "$HOME/next-build.tgz"', (stream) => {
      // Relative paths and stdout only, so this works with both GNU tar and Windows' built-in tar.
      const tar = spawn(
        "tar",
        ["-czf", "-", "--exclude=.next/cache", "--exclude=.next/dev", "--exclude=.next/node_modules", "--exclude=.next/trace", "--exclude=.next/trace-build", ".next"],
        { cwd: root, stdio: ["ignore", "pipe", "inherit"] }
      );
      tar.stdout.on("data", (chunk) => { bytes += chunk.length; });
      tar.stdout.pipe(stream);
      tar.on("error", (e) => fail(`Could not run tar: ${e.message}`));
      tar.on("close", (tarCode) => { if (tarCode !== 0) tarFailed = true; });
    });
    if (uploadCode !== 0 || bytes === 0 || tarFailed) fail("Uploading the build failed. Nothing was changed on the server.");
    console.log(`   ${(bytes / 1024 / 1024).toFixed(1)} MB uploaded`);

    await remote('cat > "$HOME/.deploy_remote.sh"', (stream) => stream.end(remoteScript(bytes)));

    console.log("③ Updating the server...");
    const code = await remote('bash -l "$HOME/.deploy_remote.sh"');
    conn.end();
    if (code !== 0) fail("The deploy did not complete. See the messages above.");
    console.log("\n✔ Deploy finished.");
  } catch (e) {
    conn.end();
    fail(`Deploy error: ${e.message}`);
  }
});

conn.on("error", (err) => fail(`SSH connection error: ${err.message}`));

if (process.argv.includes("--dry-run")) {
  // Shows exactly what would run on the server, without connecting to it.
  console.log(remoteScript(0));
} else {
  console.log("Connecting to the server...");
  conn.connect(config);
}
