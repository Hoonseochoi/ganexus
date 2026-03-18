import { z } from "zod";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const vaultPath = process.argv[2];
if (!vaultPath) {
  console.error("Usage: node scripts/mcp/obsidian-cursor-proxy.mjs <vaultPath>");
  process.exit(2);
}

// Upstream: mcp-obsidian (schema가 빈 상태라 Cursor가 tools를 숨김)
const upstreamTransport = new StdioClientTransport({
  command: "cmd.exe",
  args: ["/d", "/s", "/c", `C:\\PROGRA~1\\nodejs\\npx.cmd -y mcp-obsidian ${vaultPath}`],
});

const upstream = new Client(
  { name: "ga-nexus-obsidian-upstream", version: "0.0.0" },
  { capabilities: {} },
);

await upstream.connect(upstreamTransport);

const server = new McpServer({ name: "obsidian-cursor-proxy", version: "0.0.0" });

// Cursor 호환 스키마로 재정의 (inputSchema는 반드시 type: "object" 여야 함)
server.tool(
  "search_notes",
  "노트 파일명을 검색합니다(대소문자 무시, 부분일치/정규식 가능). 결과는 노트 경로 목록입니다.",
  { query: z.string().describe("검색어(파일명 일부 또는 정규식)") },
  async ({ query }) => {
    return await upstream.callTool({ name: "search_notes", arguments: { query } });
  },
);

server.tool(
  "read_notes",
  "여러 노트의 내용을 읽습니다. paths는 볼트 루트 기준 상대경로 배열입니다.",
  {
    paths: z
      .array(z.string())
      .min(1)
      .describe('볼트 루트 기준 상대경로 배열 (예: "Hoonseo\\\\GA_NEXUS ; PROCESS.md")'),
  },
  async ({ paths }) => {
    return await upstream.callTool({ name: "read_notes", arguments: { paths } });
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);

// 프로세스 종료 시 upstream도 정리
const shutdown = async () => {
  await server.close().catch(() => {});
  await upstream.close().catch(() => {});
  process.exit(0);
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

