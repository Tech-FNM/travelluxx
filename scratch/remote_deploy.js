import { Client } from "ssh2";

const conn = new Client();

const config = {
  host: "198.38.90.25",
  port: 22,
  username: "travellu3",
  password: "Admin1122@@"
};

const commands = [
  "cd public_html",
  "echo 'Killing process running on port 3000...'",
  "fuser -k 3000/tcp || kill -9 $(lsof -t -i:3000) || true",
  "echo 'Starting server...'",
  "nohup npm start > server.log 2>&1 &",
  "sleep 3",
  "echo 'Server status check:'",
  "curl -I http://localhost:3000 || true"
];

conn.on("ready", () => {
  console.log("🔓 SSH Connection established successfully!");
  
  conn.shell((err, stream) => {
    if (err) throw err;
    
    stream.on("close", () => {
      console.log("🔒 Stream closed. Connection closed.");
      conn.end();
    });
    
    stream.on("data", (data) => {
      process.stdout.write(data.toString());
    });
    
    // Send all commands sequentially
    const fullCommand = commands.join("\n") + "\nexit\n";
    stream.end(fullCommand);
  });
}).connect(config);
