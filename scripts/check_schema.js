const { Client } = require('pg');
const fs = require('fs');

async function main() {
  const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_VgqIuE8fl1jW@ep-steep-rain-a1ouck44-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  });
  await client.connect();
  const res = await client.query(`
    SELECT table_schema, table_name
    FROM information_schema.tables 
    WHERE table_name = 'schedule_edit_logs';
  `);
  fs.writeFileSync('schema2.json', JSON.stringify(res.rows, null, 2));
  await client.end();
}

main().catch(console.error);
