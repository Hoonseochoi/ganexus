const fs = require('fs');
const { Client } = require('pg');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const line = envContent.split('\n').find(l => l.startsWith('NEON_DATABASE_URL='));
const connectionString = line.split('=').slice(1).join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // 모든 스키마에서 schedule_edit_logs 컬럼 목록 조회
  const res = await client.query(`
    SELECT table_schema, column_name
    FROM information_schema.columns
    WHERE table_name = 'schedule_edit_logs'
    ORDER BY table_schema, ordinal_position
  `);

  console.log("=== schedule_edit_logs 컬럼 목록 ===");
  if (res.rows.length === 0) {
    console.log("schedule_edit_logs 테이블이 조회되지 않음.");
  }
  let lastSchema = null;
  for (const row of res.rows) {
    if (row.table_schema !== lastSchema) {
      console.log(`\n[스키마: ${row.table_schema}]`);
      lastSchema = row.table_schema;
    }
    console.log("  -", row.column_name);
  }

  await client.end();
}
run().catch(console.error);
