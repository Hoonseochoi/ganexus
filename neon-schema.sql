-- GA_NEXUS Neon Postgres 스키마
-- Supabase 의존성을 제거한 auth_users / profiles / invite_codes / schedules / sessions 정의

-- 0) 내부 로그인용 auth_users 테이블
create table if not exists public.auth_users (
  login_id text primary key,
  password text not null,
  role text check (role in ('admin', 'manager')) not null,
  must_change_password boolean default true,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 초기 Admin 계정(121202739 / 121202739) 시드
insert into public.auth_users (login_id, password, role, must_change_password)
values ('121202739', '121202739', 'admin', true)
on conflict (login_id) do nothing;

-- 세션 테이블: 로그인 세션 관리
create table if not exists public.sessions (
  id uuid default gen_random_uuid() primary key,
  user_login_id text not null,
  created_at timestamptz default timezone('utc'::text, now()),
  expires_at timestamptz,
  revoked_at timestamptz
);

-- 1) profiles 테이블
create table if not exists public.profiles (
  id uuid not null default gen_random_uuid() primary key,
  login_id text not null unique,
  full_name text,
  branch_name text,
  birth_date varchar(6),
  phone_number text,
  is_approved boolean default false,
  role text check (role in ('admin', 'manager')),
  manager_code text,
  created_at timestamptz default timezone('utc'::text, now())
);


-- 2) invite_codes 테이블
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


create table if not exists public.schedules (
  id uuid default gen_random_uuid() primary key,
  branch_name text not null,
  title text not null,
  description text,
  -- 카테고리: 대리점/사내/개인/월차/기타
  category text check (category in ('dealer', 'internal', 'personal', 'leave', 'etc')) default 'etc',
  -- 메타 필드
  dealer_name text,
  location text,
  instructor text,
  target_audience text,
  manager_name text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  is_all_day boolean default false,
  created_by uuid references public.profiles(id) not null,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 4) branch_memos: 지점별 메모 (작성자, 일시, 내용)
create table if not exists public.branch_memos (
  id uuid default gen_random_uuid() primary key,
  branch_name text not null,
  content text not null,
  created_by uuid references public.profiles(id) not null,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 5) notices: 공지사항 (제목, 본문, 이미지 URL)
create table if not exists public.notices (
  id uuid default gen_random_uuid() primary key,
  branch_name text not null,
  title text not null,
  body text,
  image_url text,
  created_by uuid references public.profiles(id) not null,
  created_at timestamptz default timezone('utc'::text, now())
);

-- 6) notice_reads: 공지 확인한 사람
create table if not exists public.notice_reads (
  id uuid default gen_random_uuid() primary key,
  notice_id uuid references public.notices(id) on delete cascade not null,
  profile_id uuid references public.profiles(id) on delete cascade not null,
  read_at timestamptz default timezone('utc'::text, now()),
  unique(notice_id, profile_id)
);

-- 관리자 회원가입용 프로필 확장 (현재 회사, 이메일)
alter table if exists public.profiles add column if not exists company text;
alter table if exists public.profiles add column if not exists email text;

-- 관리자별 전용 스키마(테이블) 라우팅: 해당 지점 데이터가 저장된 스키마명
alter table if exists public.profiles add column if not exists tenant_schema text;

-- RLS 는 Supabase 의 auth.uid() 대신
-- 애플리케이션 레이어(Next.js)에서 역할/승인 상태를 체크하는 방식으로 처리한다.

