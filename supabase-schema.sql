-- GA_NEXUS Supabase 기본 스키마
-- profiles / invite_codes / schedules 및 RLS 정책

-- 1) profiles 테이블
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  branch_name text,
  birth_date varchar(6),
  phone_number text,
  is_approved boolean default false,
  role text check (role in ('admin', 'manager', 'agent')),
  created_at timestamptz default timezone('utc'::text, now())
);

alter table public.profiles enable row level security;

-- 자기 자신 프로필 조회/수정 허용
create policy if not exists "profiles_select_own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy if not exists "profiles_update_own"
  on public.profiles
  for update
  using (auth.uid() = id);


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

alter table public.invite_codes enable row level security;

-- 관리자만 초대 코드 관리
create policy if not exists "invite_codes_admin_only_select"
  on public.invite_codes
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy if not exists "invite_codes_admin_only_insert"
  on public.invite_codes
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create policy if not exists "invite_codes_admin_only_update"
  on public.invite_codes
  for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );


-- 3) schedules 테이블
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

alter table public.schedules enable row level security;

-- 승인된(profiles.is_approved = true) 사용자만 자신 지점(branch_name)의 일정 조회
create policy if not exists "schedules_select_approved_same_branch"
  on public.schedules
  for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_approved = true
        and p.branch_name = schedules.branch_name
    )
  );

-- 일정 생성: 승인된 사용자만, 자신의 지점으로만 생성
create policy if not exists "schedules_insert_approved_same_branch"
  on public.schedules
  for insert
  with check (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.is_approved = true
        and p.branch_name = branch_name
    )
  );

-- 일정 수정/삭제: 본인이 만든 일정만
create policy if not exists "schedules_update_own"
  on public.schedules
  for update
  using (created_by = auth.uid());

create policy if not exists "schedules_delete_own"
  on public.schedules
  for delete
  using (created_by = auth.uid());

