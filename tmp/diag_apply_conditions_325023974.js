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

  const input = {
    managerCode: "325023974",
    fullName: "주기쁨",
    inviteCode: "GA47-RNL5LG",
  };

  const invite = (await c.query(`select id, code, branch_name from public.invite_codes where code = $1`, [input.inviteCode])).rows[0] || null;
  const registry = (await c.query(`select manager_code, manager_name, branch_name, is_active, claimed_profile_id, claimed_at from public.manager_code_registry where manager_code = any($1::text[])`, [[input.managerCode, input.managerCode.replace(/\D/g,"")]])).rows;

  const latestProfiles = (await c.query(`
    select id, login_id, full_name, branch_name, role, is_approved, manager_code, invite_code, created_at
    from public.profiles
    where full_name = $1 or manager_code in ('325023974','MGR-325023974') or login_id in ('325023974','MGR-325023974')
    order by created_at desc
    limit 10
  `, [input.fullName])).rows;

  const evals = registry.map(r => ({
    manager_code: r.manager_code,
    manager_name: r.manager_name,
    branch_name: r.branch_name,
    is_active: r.is_active,
    claimed_profile_id: r.claimed_profile_id,
    branch_match: !!invite && r.branch_name === invite.branch_name,
    name_match: normalizeName(r.manager_name) === normalizeName(input.fullName),
  }));

  console.log("=== invite ===");
  console.log(JSON.stringify(invite, null, 2));
  console.log("=== registry rows ===");
  console.log(JSON.stringify(registry, null, 2));
  console.log("=== condition eval ===");
  console.log(JSON.stringify(evals, null, 2));
  console.log("=== latest profiles ===");
  console.log(JSON.stringify(latestProfiles, null, 2));

  await c.end();
})();
