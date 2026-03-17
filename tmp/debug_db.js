const { Pool } = require('pg');
require('dotenv').config();

// Use the connection string from environment if available, 
// otherwise we might need to look at src/lib/engines/db.ts
const connectionString = process.env.NEON_DATABASE_URL;
if (!connectionString) {
  console.error("NEON_DATABASE_URL not found in environment.");
  process.exit(1);
}

async function debug() {
  const pool = new Pool({ connectionString });
  try {
    const branches = await pool.query("SELECT schema_name FROM information_schema.schemata WHERE schema_name LIKE 'branch_%'");
    const schema = branches.rows[0]?.schema_name || 'public';
    console.log(`Using schema: ${schema}`);

    console.log("\n--- Targeted Records ---");
    const records = await pool.query(`
      SELECT s.id, s.title, s.category, s.created_by, s.manager_name,
             p.full_name as profile_name, p.avatar_url
      FROM ${schema}.schedules s
      LEFT JOIN public.profiles p ON s.created_by::text = p.id::text
      WHERE s.title LIKE '%어센틱%' OR s.title LIKE '%안지현%' OR s.manager_name LIKE '%안지현%'
    `);
    console.table(records.rows);

    if (records.rows.length > 0) {
      console.log("\n--- Sample Profile ID ---");
      console.log("Created By from Schedule:", records.rows[0].created_by);
      
      const profile = await pool.query("SELECT id, full_name FROM public.profiles WHERE id::text = $1", [records.rows[0].created_by]);
      console.log("Found profile in public.profiles:", profile.rows);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await pool.end();
  }
}

debug();
