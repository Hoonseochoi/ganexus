import { query, pool, isColumnNotFound } from "./db";

/** 사번을 안전한 스키마 이름으로 변환 (t_ + 영숫자·언더스코어만) */
export function schemaNameFromEmployeeCode(employeeCode: string): string {
  const safe = employeeCode.replace(/[^a-zA-Z0-9]/g, "_").replace(/^_+|_+$/g, "") || "tenant";
  return `t_${safe}`.toLowerCase();
}

/** 지점명에 해당하는 관리자의 tenant_schema 조회 (public.profiles) */
export async function getTenantSchemaForBranch(branchName: string): Promise<string | null> {
  try {
    const rows = await query<{ tenant_schema: string }>(
      "select tenant_schema from public.profiles where branch_name = $1 and role = 'admin' and tenant_schema is not null limit 1",
      [branchName],
    );
    return rows[0]?.tenant_schema ?? null;
  } catch (err) {
    if (isColumnNotFound(err)) return null;
    throw err;
  }
}

/** 관리자 회원가입 시 해당 사번으로 전용 스키마·테이블 생성 후 public.profiles.tenant_schema 설정 */
export async function createTenantForAdmin(params: {
  employeeCode: string;
  branchName: string;
  fullName: string;
  phoneNumber: string;
  company?: string | null;
  email?: string | null;
  profileId: string; // public.profiles.id (방금 삽입된 admin의 id)
}): Promise<string> {
  const schema = schemaNameFromEmployeeCode(params.employeeCode);

  const client = await pool.connect();
  try {
    await client.query(`create schema if not exists ${schema}`);

    await client.query(`
      create table if not exists ${schema}.schedules (
        id uuid not null default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        description text,
        category text check (category in ('dealer', 'internal', 'personal', 'leave', 'etc')) default 'etc',
        dealer_name text,
        location text,
        instructor text,
        target_audience text,
        manager_name text,
        start_at timestamptz not null,
        end_at timestamptz not null,
        is_all_day boolean default false,
        created_by uuid not null,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);

    await client.query(`
      create table if not exists ${schema}.profiles (
        id uuid not null default gen_random_uuid() primary key,
        login_id text not null,
        full_name text,
        branch_name text,
        birth_date varchar(6),
        phone_number text,
        is_approved boolean default false,
        role text check (role in ('admin', 'manager', 'agent')),
        manager_code text,
        company text,
        email text,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);

    await client.query(`
      create table if not exists ${schema}.invite_codes (
        id uuid default gen_random_uuid() primary key,
        code text unique not null,
        branch_name text not null,
        created_by uuid not null,
        max_uses int,
        used_count int default 0,
        expires_at timestamptz,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);

    await client.query(`
      create table if not exists ${schema}.notices (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        title text not null,
        body text,
        image_url text,
        created_by uuid not null,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);

    await client.query(`
      create table if not exists ${schema}.branch_memos (
        id uuid default gen_random_uuid() primary key,
        branch_name text not null,
        content text not null,
        created_by uuid not null,
        created_at timestamptz default timezone('utc'::text, now())
      )
    `);

    await client.query(`
      create table if not exists ${schema}.notice_reads (
        id uuid default gen_random_uuid() primary key,
        notice_id uuid not null,
        profile_id uuid not null,
        read_at timestamptz default timezone('utc'::text, now()),
        unique(notice_id, profile_id)
      )
    `);

    await client.query(
      `insert into ${schema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`,
      [
        params.profileId,
        params.employeeCode,
        params.fullName,
        params.branchName,
        params.phoneNumber,
        params.company ?? null,
        params.email ?? null,
      ],
    );

    await client.query(
      `update public.profiles set tenant_schema = $1 where login_id = $2`,
      [schema, params.employeeCode],
    );
  } finally {
    client.release();
  }

  return schema;
}

/** public.profiles에 추가된 매니저/에이전트를 해당 지점 tenant 스키마의 profiles에 동기화 */
export async function addProfileToTenant(params: {
  tenantSchema: string;
  profileId: string;
  loginId: string;
  fullName: string | null;
  branchName: string | null;
  phoneNumber: string | null;
  role: "admin" | "manager" | "agent" | null;
  isApproved: boolean;
  managerCode?: string | null;
}): Promise<void> {
  await query(
    `insert into ${params.tenantSchema}.profiles (id, login_id, full_name, branch_name, phone_number, role, is_approved, manager_code)
     values ($1, $2, $3, $4, $5, $6, $7, $8)
     on conflict (id) do update set login_id = excluded.login_id, full_name = excluded.full_name, branch_name = excluded.branch_name, phone_number = excluded.phone_number, role = excluded.role, is_approved = excluded.is_approved, manager_code = excluded.manager_code`,
    [
      params.profileId,
      params.loginId,
      params.fullName,
      params.branchName,
      params.phoneNumber,
      params.role,
      params.isApproved,
      params.managerCode ?? null,
    ],
  );
}
