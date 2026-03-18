import { spawn } from "node:child_process";

const vaultPath = process.argv[2];
if (!vaultPath) {
  console.error("Usage: node scripts/mcp/dump-obsidian-raw-tools.mjs <vaultPath>");
  process.exit(2);
}

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
      console.log("[from-server]", JSON.stringify(msg, null, 2));
    } catch {
      // eslint-disable-next-line no-console
      console.log("[from-server:nonjson]", line);
    }
  }
});

function send(msg) {
  child.stdin.write(`${JSON.stringify(msg)}\n`);
}

const initId = 1;
send({
  jsonrpc: "2.0",
  id: initId,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "ga-nexus-raw-dump", version: "0.0.0" },
  },
});

// MCP 관례: initialized 알림 후 tools/list
setTimeout(() => {
  send({ jsonrpc: "2.0", method: "notifications/initialized", params: {} });
  send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
}, 300);

setTimeout(() => {
  child.kill();
}, 2000);

