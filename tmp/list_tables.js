const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_VgqIuE8fl1jW@ep-steep-rain-a1ouck44-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function run() {
  try {
    const res = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    fs.writeFileSync('tmp/tables.json', JSON.stringify(res.rows, null, 2), 'utf8');
    console.log('Results written to tmp/tables.json');
  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

run();
