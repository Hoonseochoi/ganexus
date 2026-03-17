const fs = require('fs');
const { Client } = require('pg');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const line = envContent.split('\n').find(l => l.startsWith('NEON_DATABASE_URL='));
const connectionString = line.split('=').slice(1).join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // 1. 테넌트 스키마 목록 조회
  const schemasRes = await client.query(`
    SELECT nspname AS s FROM pg_namespace
    WHERE nspname LIKE 't\\_%' OR nspname LIKE 'tenant\\_%' ESCAPE '\\'
  `);
  const schemas = schemasRes.rows.map(r => r.s);
  console.log("Tenant schemas:", schemas);

  for (const schema of schemas) {
    // schedule_edit_logs 존재 확인
    const logsExist = (await client.query(
      `SELECT EXISTS(SELECT FROM information_schema.tables WHERE table_schema=$1 AND table_name='schedule_edit_logs')`,
      [schema]
    )).rows[0].exists;

    if (!logsExist) { console.log(`Skip ${schema}: no schedule_edit_logs`); continue; }

    // profiles 위치 파악
    const profilesInTenant = (await client.query(
      `SELECT EXISTS(SELECT FROM information_schema.tables WHERE table_schema=$1 AND table_name='profiles')`,
      [schema]
    )).rows[0].exists;

    const profilesSchema = profilesInTenant ? schema : 'public';
    console.log(`\n[${schema}] profiles schema: ${profilesSchema}`);

    // 로그 데이터 샘플 확인
    const sample = await client.query(`SELECT id, modified_by, modifier_name FROM ${schema}.schedule_edit_logs LIMIT 3`);
    console.log("Sample logs:", sample.rows);

    // 프로필 샘플 확인
    const prof = await client.query(`SELECT id, full_name FROM ${profilesSchema}.profiles LIMIT 3`);
    console.log("Sample profiles:", prof.rows);

    // 백필 실행 - UUID 캐스팅 없이 텍스트로 비교
    const res = await client.query(`
      UPDATE ${schema}.schedule_edit_logs l
      SET modifier_name = p.full_name
      FROM ${profilesSchema}.profiles p
      WHERE l.modified_by::text = p.id::text
        AND (l.modifier_name IS NULL OR l.modifier_name = '')
    `);
    console.log(`  → ${res.rowCount}개 행 업데이트됨`);
  }

  await client.end();
  console.log("\n완료!");
}

run().catch(e => { console.error(e.message); process.exit(1); });
