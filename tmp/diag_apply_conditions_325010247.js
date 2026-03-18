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

function normalizeName(v) {
  return (v || "").replace(/\s+/g, "").trim().toLowerCase();
}

(async () => {
  const conn = getConn();
  const c = new Client({ connectionString: conn });
  await c.connect();

  const code = "325010247";

  const registry = await c.query(`
    select manager_code, manager_name, branch_name, is_active, claimed_profile_id, claimed_at, updated_at
    from public.manager_code_registry
    where manager_code = $1
  `, [code]);

  const profileCandidates = await c.query(`
    select id, login_id, full_name, branch_name, role, is_approved, manager_code, invite_code, created_at
    from public.profiles
    where manager_code = $1 or login_id = $1 or full_name = (select manager_name from public.manager_code_registry where manager_code = $1 limit 1)
    order by created_at desc
    limit 20
  `, [code]);

  const auth = await c.query(`
    select login_id, role, must_change_password, branch_name, invite_code, created_at
    from public.auth_users
    where login_id = $1
  `, [code]);

  const inviteRows = await c.query(`
    select id, code, branch_name, used_count, max_uses, expires_at, created_at
    from public.invite_codes
    where branch_name = (select branch_name from public.manager_code_registry where manager_code = $1 limit 1)
    order by created_at desc
    limit 10
  `, [code]);

  const managerName = registry.rows[0]?.manager_name ?? null;
  const branchName = registry.rows[0]?.branch_name ?? null;

  const latestByNameBranch = await c.query(`
    select id, login_id, full_name, branch_name, role, is_approved, manager_code, invite_code, created_at
    from public.profiles
    where full_name = $1 and branch_name = $2
    order by created_at desc
    limit 10
  `, [managerName, branchName]);

  let tenantRows = [];
  try {
    const tenant = await c.query(`
      select id, login_id, full_name, branch_name, role, is_approved, manager_code, created_at
      from t_121202730.profiles
      where manager_code = $1 or login_id = $1 or (full_name = $2 and branch_name = $3)
      order by created_at desc
      limit 20
    `, [code, managerName, branchName]);
    tenantRows = tenant.rows;
  } catch (e) {
    tenantRows = [{ error: String(e.message || e) }];
  }

  const evalInfo = {
    manager_code: code,
    manager_name: managerName,
    branch_name: branchName,
    registry_exists: registry.rows.length > 0,
    code_match: registry.rows.length > 0,
    branch_match_possible: !!branchName,
    claimed_profile_id: registry.rows[0]?.claimed_profile_id ?? null,
  };

  console.log("=== eval summary ===");
  console.log(JSON.stringify(evalInfo, null, 2));
  console.log("=== registry row ===");
  console.log(JSON.stringify(registry.rows, null, 2));
  console.log("=== profiles (code/login/name) ===");
  console.log(JSON.stringify(profileCandidates.rows, null, 2));
  console.log("=== profiles by exact name+branch ===");
  console.log(JSON.stringify(latestByNameBranch.rows, null, 2));
  console.log("=== auth by login_id ===");
  console.log(JSON.stringify(auth.rows, null, 2));
  console.log("=== recent invites for registry branch ===");
  console.log(JSON.stringify(inviteRows.rows, null, 2));
  console.log("=== tenant t_121202730 profiles ===");
  console.log(JSON.stringify(tenantRows, null, 2));

  await c.end();
})();
