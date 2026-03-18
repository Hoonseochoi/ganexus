-- manager_code.csv 기반 즉시승인을 위한 사전등록 테이블
create table if not exists public.manager_code_registry (
  id uuid primary key default gen_random_uuid(),
  manager_code text not null,
  manager_name text not null,
  position_title text,
  branch_name text not null,
  is_active boolean not null default true,
  imported_at timestamptz not null default timezone('utc'::text, now()),
  import_batch_id text,
  source_filename text,
  claimed_profile_id uuid,
  claimed_at timestamptz,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint manager_code_registry_manager_code_uniq unique (manager_code)
);

create index if not exists idx_manager_code_registry_branch_name
  on public.manager_code_registry (branch_name);

create index if not exists idx_manager_code_registry_is_active
  on public.manager_code_registry (is_active)
  where is_active = true;

create index if not exists idx_manager_code_registry_claimed_profile_id
  on public.manager_code_registry (claimed_profile_id);
