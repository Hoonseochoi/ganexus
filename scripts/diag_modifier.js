const fs = require('fs');
const { Client } = require('pg');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const line = envContent.split('\n').find(l => l.startsWith('NEON_DATABASE_URL='));
const connectionString = line.split('=').slice(1).join('=').trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');

async function run() {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // schedule_edit_logs 실제 데이터 확인
  const logs = await client.query(`
    SELECT table_schema, id, modified_by, modifier_name
    FROM (
      SELECT 't_121202730' AS table_schema, id, modified_by::text, modifier_name
      FROM t_121202730.schedule_edit_logs
      LIMIT 5
    ) q
  `);
  console.log("=== schedule_edit_logs 데이터 ===");
  console.table(logs.rows);

  // public.profiles 확인
  const profiles = await client.query(`
    SELECT id::text, full_name, login_id FROM public.profiles LIMIT 10
  `);
  console.log("\n=== public.profiles ===");
  console.table(profiles.rows);

  // t_121202730.profiles 있는지 확인
  const tenantProfilesExists = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 't_121202730' AND table_name = 'profiles'
    )
  `);
  console.log("\n=== t_121202730.profiles 존재 여부:", tenantProfilesExists.rows[0].exists);

  if (tenantProfilesExists.rows[0].exists) {
    const tenantProfiles = await client.query(`
      SELECT id::text, full_name FROM t_121202730.profiles LIMIT 10
    `);
    console.log("=== t_121202730.profiles 데이터 ===");
    console.table(tenantProfiles.rows);
  }

  await client.end();
}

run().catch(console.error);
