const fs = require('fs');
const { Client } = require('pg');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const connectionStringLine = envContent.split('\n').find(line => line.startsWith('NEON_DATABASE_URL='));
const connectionString = connectionStringLine.split('=')[1].trim().replace(/^"|"$/g, '').replace(/^'|'$/g, '');

async function runMigration() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // 1. Get all unique tenant schemas and their associated branch names
    const res = await client.query(`
      SELECT DISTINCT tenant_schema, branch_name 
      FROM public.profiles 
      WHERE tenant_schema IS NOT NULL
    `);
    
    const tenants = res.rows;
    console.log("Found tenants mapping:", tenants);

    for (const t of tenants) {
      const { tenant_schema, branch_name } = t;

      // 2. Create the table in the tenant schema
      console.log(`Creating schedule_edit_logs in ${tenant_schema}...`);
      await client.query(`
        CREATE TABLE IF NOT EXISTS ${tenant_schema}.schedule_edit_logs (
          id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
          schedule_id uuid NOT NULL,
          branch_name text NOT NULL,
          modified_by uuid NOT NULL,
          changed_fields jsonb NOT NULL,
          created_at timestamptz DEFAULT timezone('utc'::text, now())
        );
      `);

      // 3. Migrate data from public to tenant for this specific branch
      console.log(`Migrating data for branch '${branch_name}' into ${tenant_schema}...`);
      
      // Copy over without violating unique constraints. Here id is uuid but coming from existing rows, so we insert the exact same rows.
      // Use ON CONFLICT DO NOTHING to ensure idempotency.
      await client.query(`
        INSERT INTO ${tenant_schema}.schedule_edit_logs (id, schedule_id, branch_name, modified_by, changed_fields, created_at)
        SELECT id, schedule_id, branch_name, modified_by, changed_fields, created_at
        FROM public.schedule_edit_logs
        WHERE branch_name = $1
        ON CONFLICT (id) DO NOTHING;
      `, [branch_name]);
    }

    // 4. Verification Check
    for (const t of tenants) {
      const countRes = await client.query(`SELECT COUNT(*) FROM ${t.tenant_schema}.schedule_edit_logs`);
      console.log(`[Verification] ${t.tenant_schema}.schedule_edit_logs has ${countRes.rows[0].count} logs.`);
    }

    // 5. Instead of dropping the public table immediately, let's rename it so we don't lose data by mistake
    console.log("Renaming public.schedule_edit_logs to public.schedule_edit_logs_backup...");
    await client.query(`ALTER TABLE IF EXISTS public.schedule_edit_logs RENAME TO schedule_edit_logs_backup`);

    console.log("Migration completed successfully!");

  } catch (err) {
    console.error("Migration Error:", err);
  } finally {
    await client.end();
  }
}

runMigration();
