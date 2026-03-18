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
  const c = new Client({ connectionString: conn });
  await c.connect();

  const p = await c.query(`
    select id, manager_code, branch_name
    from public.profiles
    where login_id = '325010247'
    order by created_at desc
    limit 1
  `);

  if (!p.rows[0]) {
    console.log('no profile found');
    await c.end();
    return;
  }

  const r = await c.query(`
    update public.manager_code_registry
    set claimed_profile_id = $2,
        claimed_at = timezone('utc'::text, now()),
        updated_at = timezone('utc'::text, now())
    where manager_code = $1
      and branch_name = $3
      and is_active = true
      and claimed_profile_id is null
    returning manager_code, claimed_profile_id, claimed_at
  `, [p.rows[0].manager_code || '325010247', p.rows[0].id, p.rows[0].branch_name]);

  console.log(JSON.stringify({ profile: p.rows[0], claimResult: r.rows }, null, 2));
  await c.end();
})();
