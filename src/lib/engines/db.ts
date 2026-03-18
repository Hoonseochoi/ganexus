import { Pool, type QueryResultRow } from "pg";

const connectionString = process.env.NEON_DATABASE_URL;
const DB_QUERY_SLOW_MS = Number(process.env.DB_QUERY_SLOW_MS ?? 200);

if (!connectionString) {
  // 실제 런타임에서는 .env.local 에서 설정해야 함
  console.warn("[db] NEON_DATABASE_URL 환경 변수가 설정되지 않았습니다.");
}

export const pool = new Pool({
  connectionString,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 10_000, // 10 seconds timeout to handle cold starts
});

function compactSql(sql: string): string {
  return sql.replace(/\s+/g, " ").trim().slice(0, 220);
}

/** Postgres 에러 코드: relation does not exist (테이블 미생성 시) */
export const PG_CODE_RELATION_NOT_EXIST = "42P01";

export function isRelationNotFound(err: unknown): boolean {
  return (
    err !== null &&
    typeof err === "object" &&
    "code" in err &&
    (err as { code?: string }).code === PG_CODE_RELATION_NOT_EXIST
  );
}

/** Postgres: column does not exist (메타 컬럼 미추가 시) */
export function isColumnNotFound(err: unknown): boolean {
  if (err === null || typeof err !== "object" || !("message" in err)) return false;
  const msg = String((err as { message?: unknown }).message ?? "");
  return msg.includes("does not exist") || (err as { code?: string }).code === "42703";
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await pool.connect();
  const startedAt = Date.now();
  try {
    const result = await client.query<T>(text, params);
    const elapsedMs = Date.now() - startedAt;
    if (elapsedMs >= DB_QUERY_SLOW_MS) {
      console.warn(`[db] slow query ${elapsedMs}ms :: ${compactSql(text)}`);
    }
    return result.rows;
  } catch (err) {
    const elapsedMs = Date.now() - startedAt;
    console.error(`[db] query failed after ${elapsedMs}ms :: ${compactSql(text)}`);
    throw err;
  } finally {
    client.release();
  }
}

