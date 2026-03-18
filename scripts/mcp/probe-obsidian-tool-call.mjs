import { spawn } from "node:child_process";

const vaultPath = process.argv[2];
if (!vaultPath) {
  console.error("Usage: node scripts/mcp/probe-obsidian-tool-call.mjs <vaultPath>");
  process.exit(2);
}
const sampleNotePath = process.argv[3];

const child = spawn("cmd.exe", ["/d", "/s", "/c", `C:\\PROGRA~1\\nodejs\\npx.cmd -y mcp-obsidian ${vaultPath}`], {
  stdio: ["pipe", "pipe", "pipe"],
});

child.stderr.setEncoding("utf8");
child.stdout.setEncoding("utf8");
child.stderr.on("data", (d) => process.stderr.write(d));

let buf = "";
child.stdout.on("data", (chunk) => {
  buf += chunk;
  while (true) {
    const idx = buf.indexOf("\n");
    if (idx === -1) break;
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    try {
      const msg = JSON.parse(line);
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(msg, null, 2));
    } catch {
      // eslint-disable-next-line no-console
      console.log(line);
    }
  }
});

function send(msg) {
  child.stdin.write(`${JSON.stringify(msg)}\n`);
}

send({
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "ga-nexus-probe", version: "0.0.0" },
  },
});

setTimeout(() => {
  send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });
  send({ jsonrpc: "2.0", id: 2, method: "tools/call", params: { name: "search_notes", arguments: { query: "test" } } });
  send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "search_notes", arguments: { name: "test" } } });
  send({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "search_notes", arguments: "test" } });

  if (sampleNotePath) {
    send({ jsonrpc: "2.0", id: 5, method: "tools/call", params: { name: "read_notes", arguments: { paths: [sampleNotePath] } } });
    send({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "read_notes", arguments: { path: sampleNotePath } } });
    send({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "read_notes", arguments: { notes: [sampleNotePath] } } });
  }
}, 300);

setTimeout(() => child.kill(), 2500);

