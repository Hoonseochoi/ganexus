import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const vaultPath = process.argv[2];
if (!vaultPath) {
  console.error("Usage: node scripts/mcp/inspect-proxy-tools.mjs <vaultPath>");
  process.exit(2);
}

const transport = new StdioClientTransport({
  command: "cmd.exe",
  args: ["/d", "/s", "/c", `C:\\PROGRA~1\\nodejs\\node.exe scripts\\mcp\\obsidian-cursor-proxy.mjs ${vaultPath}`],
});

const client = new Client(
  { name: "ga-nexus-proxy-inspector", version: "0.0.0" },
  { capabilities: {} },
);

try {
  await client.connect(transport);
  const res = await client.listTools();
  console.log(JSON.stringify(res, null, 2));
} finally {
  await client.close().catch(() => {});
}

