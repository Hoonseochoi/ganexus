const fs = require("fs");
const path = require("path");
const { Client } = require("pg");

function getConn() {
  if (process.env.NEON_DATABASE_URL) return process.env.NEON_DATABASE_URL;
  const p = path.join(process.cwd(), ".env.local");
  const raw = fs.readFileSync(p, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const [k, ...rest] = t.split("=");
    if (k === "NEON_DATABASE_URL") return rest.join("=").trim();
  }
  return null;
}

(async () => {
  const conn = getConn();
  if (!conn) throw new Error("NEON_DATABASE_URL not found");
  const c = new Client({ connectionString: conn });
  await c.connect();
  const code = "325023974";

  const registry = await c.query(`
    select manager_code, manager_name, branch_name, is_active, claimed_profile_id, claimed_at
    from public.manager_code_registry
    where manager_code = $1
  `, [code]);

  const profiles = await c.query(`
    select id, login_id, full_name, branch_name, role, is_approved, manager_code, invite_code, created_at
    from public.profiles
    where manager_code = $1 or login_id = $1
    order by created_at desc
  `, [code]);

  const auth = await c.query(`
    select login_id, role, must_change_password, branch_name, invite_code, created_at
    from public.auth_users
    where login_id = $1
  `, [code]);

  console.log("=== manager_code_registry ===");
  console.log(JSON.stringify(registry.rows, null, 2));
  console.log("=== profiles by code/login_id ===");
  console.log(JSON.stringify(profiles.rows, null, 2));
  console.log("=== auth_users by login_id ===");
  console.log(JSON.stringify(auth.rows, null, 2));

  await c.end();
})();
