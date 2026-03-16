## 브랜치 멤버 그룹핑 설계 (지점 + 초대코드 기준)

### 1. 목표

- **Admin 관점에서 “브랜치 멤버”를 일관되게 조회**할 수 있게 만든다.
- 동일 지점에 속한 사람들뿐 아니라, **같은 초대코드로 가입한 사람들**도 같은 멤버 그룹으로 묶는다.
- 가입/승인 플로우에서 사용하는 테이블(`auth_users`, `profiles`, `invite_codes`) 사이의 **관계와 동기화 규칙**을 명확히 한다.

---

### 2. 스키마 확장

#### 2.1 auth_users

```sql
create table if not exists public.auth_users (
  login_id text primary key,
  password text not null,
  role text check (role in ('admin', 'manager')) not null,
  must_change_password boolean default true,
  created_at timestamptz default timezone('utc'::text, now()),
  -- 소속 지점(예: GA4-7지점) 및 가입 시 사용한 초대코드
  branch_name text,
  invite_code text
);

alter table if exists public.auth_users add column if not exists branch_name text;
alter table if exists public.auth_users add column if not exists invite_code text;
```

- `branch_name`:
  - 이 계정이 기본적으로 속한 지점명.
  - 예: `GA4-7지점`.
- `invite_code`:
  - 이 계정이 **처음 가입할 때 사용한 초대코드**.
  - 같은 초대코드로 들어온 계정들끼리는 “같은 그룹”으로 간주할 수 있다.

#### 2.2 profiles

```sql
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
  created_at timestamptz default timezone('utc'::text, now()),
  -- 가입 시 사용한 초대코드 (있다면)
  invite_code text
);

alter table if exists public.profiles add column if not exists invite_code text;
```

- `profiles.invite_code`:
  - 향후 분석/필터링 및 브랜치 멤버 조회 시 사용.
  - UI/리포트 레벨에서 초대코드 단위로 멤버를 그룹화할 때도 활용 가능.

---

### 3. 가입 플로우에서의 값 세팅

#### 3.1 매니저 가입 (/api/agent/apply)

- 초대코드 검증 후, `invite_codes.branch_name`과 `code`를 함께 사용하여 `auth_users`와 `profiles`를 채운다.

```ts
await query(
  `
    insert into public.auth_users (login_id, password, role, must_change_password, branch_name, invite_code)
    values ($1, $2, 'manager', true, $3, $4)
    on conflict (login_id)
    do update set role = 'manager',
                 must_change_password = true,
                 password = $2,
                 branch_name = $3,
                 invite_code = $4
  `,
  [managerCodeTrimmed, managerCodeTrimmed, invite.branch_name, code],
);

await query(
  `
    insert into public.profiles (login_id, full_name, branch_name, birth_date, phone_number, role, is_approved, manager_code, invite_code)
    values ($1, $2, $3, $4, $5, 'manager', false, $1, $6)
    on conflict (login_id)
    do update set full_name = excluded.full_name,
                branch_name = excluded.branch_name,
                birth_date = excluded.birth_date,
                phone_number = excluded.phone_number,
                role = 'manager',
                manager_code = excluded.manager_code,
                invite_code = excluded.invite_code
  `,
  [managerCodeTrimmed, fullName, invite.branch_name, birthDate, phoneDigits, code],
);
```

- 결과:
  - `auth_users.branch_name` = 초대코드에서 온 지점명.
  - `auth_users.invite_code` = 사용한 초대코드 문자열.
  - `profiles.branch_name` = 초대코드 지점명.
  - `profiles.invite_code` = 사용한 초대코드 문자열.

#### 3.2 Admin / Agent 등 다른 플로우

- Admin 온보딩(/api/admin/profile):
  - `branch_name`만 의미가 있고, `invite_code`는 `null` 로 둘 수 있다.
- 에이전트 가입/승인 플로우:
  - 동일하게 `invite.branch_name`, `code`를 사용해 `auth_users` / `profiles`에 값을 넣는 패턴을 따르는 것이 일관적이다.

---

### 4. 기존 “멤버 관리”에 멤버가 안 보이던 이유

#### 4.1 이전 쿼리 구조

```ts
export async function listAllBranchMembers(branchName: string): Promise<ManagerRow[]> {
  const schema = (await getTenantSchemaForBranch(branchName)) ?? "public";
  try {
    const rows = await query<ManagerRow>(
      `
        select id, full_name, branch_name, phone_number, role, created_at
        from ${schema}.profiles
        where branch_name = $1
        order by case role when 'admin' then 1 when 'manager' then 2 else 3 end, created_at asc
      `,
      [branchName],
    );
    return rows;
  } catch (err) {
    if (isRelationNotFound(err)) {
      const rows = await query<ManagerRow>(`
        select id, full_name, branch_name, phone_number, role, created_at
        from public.profiles
        where branch_name = $1
          and role in ('admin', 'manager')
        order by case role when 'admin' then 1 when 'manager' then 2 else 3 end, created_at asc
      `, [branchName]);
      return rows;
    }
    throw err;
  }
}
```

- 문제점:
  - `branch_name = $1` 조건만 보고 있어서,
    - 가입 시 `branch_name`이 비었거나 엉뚱하게 들어간 경우 → 리스트에서 누락.
  - fallback 쿼리는 `role in ('admin', 'manager')`만 허용:
    - `agent` 역할은 **절대 멤버로 잡히지 않음**.
  - 초대코드(`invite_code`) 정보는 전혀 고려하지 않음.

#### 4.2 실제 현상

- 멤버들이 가입은 했는데:
  - `branch_name`이 정확히 맞지 않거나,
  - `role = 'agent'` 인 경우,
  - 또는 tenant 스키마/퍼블릭 스키마 사이에서 분산되어 있는 경우
- → `listAllBranchMembers`의 조건에 걸리지 않아
  **멤버 관리 UI에는 안 보이는 현상**이 발생했다.

---

### 5. 개선된 브랜치 멤버 조회 로직

#### 5.1 설계 의도

- 브랜치 멤버는 다음 두 조건 중 하나라도 만족하면 포함한다:
  1. `profiles.branch_name` 이 Admin 지점명과 동일
  2. 이 지점에서 발급된 초대코드를 사용해 가입 (`profiles.invite_code` 가 해당 지점 초대코드들 중 하나)
- AND 조건:
  - `is_approved = true` 인 멤버만(승인 대기자는 제외)
  - `role in ('admin', 'manager', 'agent')`

#### 5.2 구현된 쿼리 (src/lib/engines/managers.ts)

```ts
export type ManagerRow = {
  id: string;
  full_name: string | null;
  branch_name: string | null;
  phone_number: string | null;
  role: "admin" | "manager" | "agent" | null;
  created_at: string;
};

export async function listAllBranchMembers(branchName: string): Promise<ManagerRow[]> {
  // 멤버 관리는 전역 public.profiles 기준으로 조회한다.
  const rows = await query<ManagerRow>(
    `
      select id, full_name, branch_name, phone_number, role, created_at
      from public.profiles
      where
        is_approved = true
        and role in ('admin', 'manager', 'agent')
        and (
          branch_name = $1
          or invite_code in (
            select code from public.invite_codes where branch_name = $1
          )
        )
      order by
        case role
          when 'admin' then 1
          when 'manager' then 2
          else 3
        end,
        created_at asc
    `,
    [branchName],
  );
  return rows;
}
```

- 특징:
  - Admin의 `profile.branch_name`을 기준으로, 해당 지점에 속한 초대코드 전체를 서브쿼리에서 가져온다.
  - 그 초대코드 중 하나로 가입한 멤버라면, `branch_name`이 약간 어긋나 있어도 멤버로 인정.
  - `admin → manager → agent` 순으로 정렬.

---

### 6. 요약

- `auth_users`와 `profiles`에 **소속 지점(`branch_name`)과 초대코드(`invite_code`) 컬럼을 추가**하여,
  - 로그인 계정 레벨에서 지점/초대코드 정보를 함께 유지한다.
- 가입 플로우(특히 `/api/agent/apply`)에서,
  - 초대코드 기반으로 `branch_name`, `invite_code`를 **auth_users + profiles에 동시에 세팅**한다.
- 브랜치 멤버 조회 함수(`listAllBranchMembers`)는
  - `branch_name = 지점명` 또는
  - `invite_code ∈ (해당 지점 초대코드들)`
  - 조건을 사용해 멤버를 묶고,
  - `is_approved = true` 이면서 `admin/manager/agent` 역할을 가진 사용자만 반환하도록 변경했다.

이 설계를 통해, **같은 초대코드를 사용한 사람들**이 자연스럽게 **같은 브랜치 멤버 그룹**으로 묶이고,  
이전에 멤버 관리 화면에 보이지 않던 가입자들도 안정적으로 포함될 수 있다.

