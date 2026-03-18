import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const vaultPath = process.argv[2];
if (!vaultPath) {
  console.error("Usage: node scripts/mcp/inspect-obsidian-tools.mjs <vaultPath>");
  process.exit(2);
}

const transport = new StdioClientTransport({
  command: "cmd.exe",
  // Vault 경로를 따옴표로 감싸면 일부 환경에서 그대로 전달되어 경로 해석이 깨질 수 있어
  // 공백이 없는 절대경로는 따옴표 없이 전달한다.
  args: ["/d", "/s", "/c", `C:\\PROGRA~1\\nodejs\\npx.cmd -y mcp-obsidian ${vaultPath}`],
});

const client = new Client(
  { name: "ga-nexus-obsidian-inspector", version: "0.0.0" },
  { capabilities: {} },
);

try {
  await client.connect(transport);
  const res = await client.listTools();
  console.log(JSON.stringify(res, null, 2));
} finally {
  await client.close().catch(() => {});
}

