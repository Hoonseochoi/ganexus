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

  const q1 = await c.query(`
    select id, login_id, full_name, branch_name, role, is_approved, manager_code, invite_code, created_at
    from public.profiles
    where branch_name = 'GA4-7지점'
      and (
        manager_code = '325023974'
        or login_id = '325023974'
        or invite_code = 'GA47-RNL5LG'
        or full_name = '주기쁨'
      )
    order by created_at desc
  `);

  const q2 = await c.query(`
    select code, branch_name, used_count, max_uses, expires_at
    from public.invite_codes
    where code = 'GA47-RNL5LG'
  `);

  const q3 = await c.query(`
    select login_id, role, must_change_password, branch_name, invite_code, created_at
    from public.auth_users
    where branch_name = 'GA4-7지점' and invite_code = 'GA47-RNL5LG'
    order by created_at desc
    limit 10
  `);

  console.log('=== profiles candidate rows ===');
  console.log(JSON.stringify(q1.rows, null, 2));
  console.log('=== invite code row ===');
  console.log(JSON.stringify(q2.rows, null, 2));
  console.log('=== auth rows by invite ===');
  console.log(JSON.stringify(q3.rows, null, 2));

  await c.end();
})();
