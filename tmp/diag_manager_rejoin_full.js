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

  const adminBranch = await c.query(`
    select id, login_id, full_name, branch_name, tenant_schema
    from public.profiles
    where role = 'admin' and branch_name = 'GA4-7지점'
    order by created_at asc
  `);

  const registry = await c.query(`
    select manager_code, manager_name, branch_name, is_active, claimed_profile_id, claimed_at, updated_at
    from public.manager_code_registry
    where manager_code in ('325023974', 'MGR-325023974')
    order by manager_code
  `);

  const profiles = await c.query(`
    select id, login_id, full_name, branch_name, role, is_approved, manager_code, invite_code, created_at
    from public.profiles
    where branch_name = 'GA4-7지점'
      and (
        full_name = '주기쁨'
        or manager_code in ('325023974', 'MGR-325023974')
        or login_id in ('325023974', 'MGR-325023974')
      )
    order by created_at desc
  `);

  const auth = await c.query(`
    select login_id, role, must_change_password, branch_name, invite_code, created_at
    from public.auth_users
    where login_id in ('325023974', 'MGR-325023974')
    order by created_at desc
  `);

  const invites = await c.query(`
    select id, code, branch_name, used_count, max_uses, expires_at, created_at
    from public.invite_codes
    where branch_name = 'GA4-7지점'
    order by created_at desc
    limit 10
  `);

  let tenantRows = [];
  try {
    const tenant = await c.query(`
      select id, login_id, full_name, branch_name, role, is_approved, manager_code, created_at
      from t_121202730.profiles
      where branch_name = 'GA4-7지점'
        and (
          full_name = '주기쁨'
          or manager_code in ('325023974', 'MGR-325023974')
          or login_id in ('325023974', 'MGR-325023974')
        )
      order by created_at desc
    `);
    tenantRows = tenant.rows;
  } catch (e) {
    tenantRows = [{ error: String(e.message || e) }];
  }

  console.log('=== admin for GA4-7 ===');
  console.log(JSON.stringify(adminBranch.rows, null, 2));
  console.log('=== manager_code_registry ===');
  console.log(JSON.stringify(registry.rows, null, 2));
  console.log('=== public.profiles relevant ===');
  console.log(JSON.stringify(profiles.rows, null, 2));
  console.log('=== public.auth_users relevant ===');
  console.log(JSON.stringify(auth.rows, null, 2));
  console.log('=== recent invites GA4-7 ===');
  console.log(JSON.stringify(invites.rows, null, 2));
  console.log('=== t_121202730.profiles relevant ===');
  console.log(JSON.stringify(tenantRows, null, 2));

  await c.end();
})();
