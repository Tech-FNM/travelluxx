import { Client } from "ssh2";

const conn = new Client();

const config = {
  host: "198.38.90.25",
  port: 22,
  username: "travellu3",
  password: "Admin1122@@",
  readyTimeout: 30000,
  keepaliveInterval: 10000
};

// dist/server.cjs is pre-built and committed to git; only the Next.js pages (.next/) are built on the server
const commands = [
  "cd public_html",
  "pkill -f 'vite build' || true",
  "pkill -f 'esbuild' || true",
  "git reset --hard",
  "git pull origin main",
  "npm install --prefer-offline",
  // The pages are rendered by Next.js, and .next/ is NOT in git, so it must be built here.
  // If the build fails we exit before touching the running server, so the site stays up.
  "echo 'Building Next.js pages...'",
  "npm run next:build || { echo 'NEXT BUILD FAILED - old server left running'; exit 1; }",
  "echo 'Killing process running on port 3000...'",
  "fuser -k 3000/tcp || kill -9 $(lsof -t -i:3000) || true",
  "sleep 2",
  "echo 'Starting server...'",
  "NODE_ENV=production nohup npm start > server.log 2>&1 &",
  "sleep 3",
  "echo 'Server status check:'",
  "curl -I http://localhost:3000 || true"
];

conn.on("ready", () => {
  console.log("🔓 SSH Connection established!");
  
  conn.shell((err, stream) => {
    if (err) { console.error("Shell error:", err); conn.end(); return; }
    
    stream.on("close", () => {
      console.log("🔒 Connection closed.");
      conn.end();
    });
    
    stream.on("data", (data) => {
      process.stdout.write(data.toString());
    });

    stream.stderr.on("data", (data) => {
      process.stderr.write(data.toString());
    });

    const fullCommand = commands.join("\n") + "\nexit\n";
    stream.end(fullCommand);
  });
});

conn.on("error", (err) => {
  console.error("SSH Connection error:", err.message);
});

conn.connect(config);
