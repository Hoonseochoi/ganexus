const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

async function main() {
  let connectionString = process.env.NEON_DATABASE_URL;

  // Next.js에서는 .env.local 을 로드하지만, 단독 node 실행 시에는 수동으로 읽어준다.
  if (!connectionString) {
    try {
      const envPath = path.join(__dirname, "..", ".env.local");
      const raw = fs.readFileSync(envPath, "utf8");
      for (const line of raw.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) continue;
        const [key, ...rest] = trimmed.split("=");
        if (key === "NEON_DATABASE_URL") {
          connectionString = rest.join("=").trim();
          break;
        }
      }
    } catch (e) {
      // ignore, 아래에서 에러 메시지 출력
    }
  }

  if (!connectionString) {
    console.error("[seed-admin] NEON_DATABASE_URL 환경 변수가 없습니다.");
    process.exit(1);
  }

  const client = new Client({ connectionString });
  try {
    await client.connect();

    await client.query(`
      create table if not exists public.auth_users (
        login_id text primary key,
        password text not null,
        role text check (role in ('admin', 'manager', 'agent')) not null,
        must_change_password boolean default true,
        created_at timestamptz default timezone('utc'::text, now())
      );

      insert into public.auth_users (login_id, password, role, must_change_password)
      values ('121202739', '121202739', 'admin', true)
      on conflict (login_id) do nothing;
    `);

    await client.query(`
      create table if not exists public.sessions (
        id uuid default gen_random_uuid() primary key,
        user_login_id text not null,
        created_at timestamptz default timezone('utc'::text, now()),
        expires_at timestamptz,
        revoked_at timestamptz
      );
    `);

    await client.query(`
      create table if not exists public.profiles (
        id uuid not null default gen_random_uuid() primary key,
        login_id text not null unique,
        full_name text,
        branch_name text,
        birth_date varchar(6),
        phone_number text,
        is_approved boolean default false,
        role text check (role in ('admin', 'manager', 'agent')),
        created_at timestamptz default timezone('utc'::text, now())
      );
    `);

    await client.query(`
      create table if not exists public.invite_codes (
        id uuid default gen_random_uuid() primary key,
        code text unique not null,
        branch_name text not null,
        created_by uuid references public.profiles(id) not null,
        max_uses int,
        used_count int default 0,
        expires_at timestamptz,
        created_at timestamptz default timezone('utc'::text, now())
      );
    `);

    await client.query(`
      create table if not exists public.schedules (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        description text,
        category text check (category in ('education', 'vacation', 'hq', 'etc')) default 'etc',
        start_at timestamptz not null,
        end_at timestamptz not null,
        is_all_day boolean default false,
        created_by uuid references public.profiles(id) not null,
        created_at timestamptz default timezone('utc'::text, now())
      );
    `);

    await client.query(`
      create table if not exists public.branch_memos (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        content text not null,
        created_by uuid references public.profiles(id) not null,
        created_at timestamptz default timezone('utc'::text, now())
      );
    `);

    await client.query(`
      create table if not exists public.notices (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        body text,
        image_url text,
        created_by uuid references public.profiles(id) not null,
        created_at timestamptz default timezone('utc'::text, now())
      );
    `);

    await client.query(`
      create table if not exists public.notice_reads (
        id uuid default gen_random_uuid() primary key,
        notice_id uuid references public.notices(id) on delete cascade not null,
        profile_id uuid references public.profiles(id) on delete cascade not null,
        read_at timestamptz default timezone('utc'::text, now()),
        unique(notice_id, profile_id)
      );
    `);

    console.log("[seed-admin] auth_users, sessions, profiles, invite_codes, schedules, branch_memos, notices, notice_reads 테이블 및 초기 Admin(121202739) 시드를 완료했습니다.");
  } catch (err) {
    console.error("[seed-admin] 오류:", err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

main();

