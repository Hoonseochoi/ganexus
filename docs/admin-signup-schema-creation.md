# 관리자 회원가입 시 스키마 생성 로직

## 📋 개요

새로운 관리자가 회원가입할 때 다음 단계를 통해 **전용 테넌트 스키마**가 생성됩니다:

1. **Public 스키마**에 인증 정보 및 프로필 저장
2. **전용 테넌트 스키마** (t_[사번]) 생성
3. 테넌트 스키마 내 **7개의 테이블** 자동 생성
4. 관리자 정보 동기화

---

## 🔄 회원가입 플로우

```
관리자 회원가입 양식 작성
    ↓
/api/auth/admin-signup (POST)
    ↓
1. 유효성 검증 (사번, 이름, 지점, 휴대폰, 이메일)
    ↓
2. 사번 중복 체크 (public.auth_users)
    ↓
3. public.auth_users 에 인증 데이터 삽입
    ↓
4. public.profiles 에 프로필 삽입
    ↓
5. createTenantForAdmin() 함수 호출
    ├─ 스키마 이름 생성 (t_[사번])
    ├─ 스키마 생성
    ├─ 7개 테이블 생성
    ├─ 관리자 정보 동기화
    └─ public.profiles.tenant_schema 업데이트
```

---

## 📊 생성되는 데이터베이스 구조

### 1️⃣ 스키마 이름 규칙

```typescript
// 사번을 안전한 스키마 이름으로 변환
schemaNameFromEmployeeCode(employeeCode: string): string
  - 영숫자·언더스코어만 허용
  - 접두어 "t_" + 사번
  - 예: 사번 "121202730" → 스키마 "t_121202730"
```

### 2️⃣ Public 스키마 (기존)

#### public.auth_users

| 칼럼 | 타입 | 설명 |
|------|------|------|
| `login_id` | text (PK) | 사번 |
| `password` | text | 비밀번호 (초기: 사번과 동일) |
| `role` | text | 역할 ('admin', 'manager', 'agent') |
| `must_change_password` | boolean | 비밀번호 변경 필수 여부 (true) |
| `created_at` | timestamptz | 생성 일시 |

**생성 데이터 예시:**
```sql
INSERT INTO public.auth_users 
  (login_id, password, role, must_change_password)
VALUES ('121202730', '121202730', 'admin', true);
```

#### public.profiles

| 칼럼 | 타입 | 설명 |
|------|------|------|
| `id` | uuid (PK) | 프로필 ID |
| `login_id` | text | 사번 |
| `full_name` | text | 이름 |
| `branch_name` | text | 지점명 |
| `phone_number` | text | 휴대폰 번호 |
| `role` | text | 역할 ('admin') |
| `is_approved` | boolean | 승인 여부 (true) |
| `company` | text | 회사명 |
| `email` | text | 이메일 |
| **`tenant_schema`** | text | ⭐ 할당된 스키마 이름 |
| `created_at` | timestamptz | 생성 일시 |

**생성 데이터 예시:**
```sql
INSERT INTO public.profiles 
  (login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
VALUES ('121202730', '홍길동', '서울지점', '01012345678', 'admin', true, 'GA Corp', 'hong@example.com');
-- 이후 tenant_schema 업데이트됨
UPDATE public.profiles SET tenant_schema = 't_121202730' WHERE login_id = '121202730';
```

---

### 3️⃣ 테넌트 스키마 생성

#### 스키마: `t_121202730`

테넌트별로 **독립적인 스키마** 생성 (t_121202730과 동일 구조)

---

## 📋 테넌트 스키마 내 7개 테이블

### 테이블 1: `t_121202730.schedules`

**일정 데이터 저장**

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK |
| `branch_name` | text | - | 지점명 |
| `title` | text | - | 일정 제목 |
| `description` | text | NULL | 설명 |
| `category` | text | 'etc' | 카테고리 (dealer, internal, personal, leave, etc) |
| `dealer_name` | text | NULL | 대리점명 (category='dealer'일 때) |
| `location` | text | NULL | 장소 |
| `instructor` | text | NULL | 강사명 |
| `target_audience` | text | NULL | 대상 |
| `manager_name` | text | NULL | 매니저명 (category='leave'일 때) |
| `start_at` | timestamptz | - | 시작 시간 |
| `end_at` | timestamptz | - | 종료 시간 |
| `is_all_day` | boolean | false | 종일 여부 |
| `created_by` | uuid | - | 생성자 ID |
| `creator_name` | text | NULL | 생성자 이름 |
| `created_at` | timestamptz | now() | 생성 일시 |
| `is_soft_deleted` | boolean | false | 소프트 삭제 여부 |

---

### 테이블 2: `t_121202730.profiles`

**지점별 사용자 정보 저장** (public.profiles와 동기화)

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK (public.profiles.id와 동일) |
| `login_id` | text | - | 사번/이메일 |
| `full_name` | text | NULL | 이름 |
| `branch_name` | text | NULL | 지점명 |
| `birth_date` | varchar(6) | NULL | 생년월일 (YYMMDD) |
| `phone_number` | text | NULL | 휴대폰 번호 |
| `is_approved` | boolean | false | 승인 여부 |
| `role` | text | NULL | 역할 (admin, manager, agent) |
| `manager_code` | text | NULL | 매니저 코드 |
| `company` | text | NULL | 회사명 |
| `email` | text | NULL | 이메일 |
| `created_at` | timestamptz | now() | 생성 일시 |
| `is_instructor` | boolean | false | 강사 여부 |
| `instructor_color` | text | NULL | 강사 표시 색상 |

**초기 생성 데이터:**
```sql
INSERT INTO t_121202730.profiles 
  (id, login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
VALUES 
  (uuid_from_public_profiles, '121202730', '홍길동', '서울지점', '01012345678', 
   'admin', true, 'GA Corp', 'hong@example.com');
```

---

### 테이블 3: `t_121202730.invite_codes`

**초대 코드 관리**

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK |
| `code` | text | - | 초대 코드 (UNIQUE) |
| `branch_name` | text | - | 지점명 |
| `created_by` | uuid | - | 생성자 ID |
| `max_uses` | int | NULL | 최대 사용 횟수 |
| `used_count` | int | 0 | 사용 횟수 |
| `expires_at` | timestamptz | NULL | 만료 시간 |
| `created_at` | timestamptz | now() | 생성 일시 |

---

### 테이블 4: `t_121202730.notices`

**공지사항 관리**

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK |
| `branch_name` | text | - | 지점명 |
| `title` | text | - | 제목 |
| `body` | text | NULL | 본문 |
| `image_url` | text | NULL | 이미지 URL |
| `created_by` | uuid | - | 작성자 ID |
| `author_name` | text | NULL | 작성자 이름 |
| `created_at` | timestamptz | now() | 생성 일시 |

---

### 테이블 5: `t_121202730.branch_memos`

**지점 메모 관리**

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK |
| `branch_name` | text | - | 지점명 |
| `content` | text | - | 메모 내용 |
| `created_by` | uuid | - | 작성자 ID |
| `author_name` | text | NULL | 작성자 이름 |
| `created_at` | timestamptz | now() | 생성 일시 |

---

### 테이블 6: `t_121202730.schedule_edit_logs`

**일정 수정 이력 추적**

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK |
| `schedule_id` | uuid | - | 일정 ID (FK) |
| `branch_name` | text | - | 지점명 |
| `modified_by` | uuid | - | 수정자 ID |
| `modifier_name` | text | NULL | 수정자 이름 |
| `changed_fields` | jsonb | - | 변경된 필드 (JSON) |
| `created_at` | timestamptz | now() | 생성 일시 |

**예시 데이터:**
```json
{
  "changed_fields": {
    "title": { "old": "기존 제목", "new": "새 제목" },
    "start_at": { "old": "2024-01-01T10:00:00Z", "new": "2024-01-02T10:00:00Z" }
  }
}
```

---

### 테이블 7: `t_121202730.notice_reads`

**공지사항 읽음 여부 추적**

| 칼럼 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `id` | uuid | gen_random_uuid() | PK |
| `notice_id` | uuid | - | 공지사항 ID (FK) |
| `profile_id` | uuid | - | 사용자 ID (FK) |
| `read_at` | timestamptz | now() | 읽은 시간 |
| **UNIQUE** | (notice_id, profile_id) | - | 같은 공지사항은 한 번만 기록 |

---

## 🔗 t_121202730과의 비교

### 스키마 구조 동일성

**모든 새로운 관리자의 스키마는 t_121202730과 정확히 같은 테이블과 칼럼을 가집니다.**

| 항목 | t_121202730 | 새 관리자 (예: t_123456789) |
|------|-----------|-----------|
| 스키마 이름 규칙 | t_ + 사번 | t_ + 사번 |
| 테이블 개수 | 7개 | 7개 (동일) |
| 테이블 명 | schedules, profiles, invite_codes, notices, branch_memos, schedule_edit_logs, notice_reads | 동일 |
| 칼럼 정의 | 미리 정의됨 | 동일 생성됨 |
| 데이터 격리 | 독립된 스키마 | 독립된 스키마 |
| 관리자 정보 | t_121202730 스키마 내 profiles에 저장 | 새 스키마 내 profiles에 저장 |

---

## 🛠️ 핵심 코드

### createTenantForAdmin() 함수

**파일:** `src/lib/engines/tenant.ts`

```typescript
export async function createTenantForAdmin(params: {
  employeeCode: string;         // 사번 (예: "121202730")
  branchName: string;            // 지점명
  fullName: string;              // 이름
  phoneNumber: string;           // 휴대폰 번호
  company?: string | null;       // 회사명
  email?: string | null;         // 이메일
  profileId: string;             // public.profiles.id
}): Promise<string> {
  // 1. 스키마 이름 생성: t_121202730
  const schema = schemaNameFromEmployeeCode(params.employeeCode);
  
  // 2. 데이터베이스 연결
  const client = await pool.connect();
  
  try {
    // 3. 스키마 생성
    await client.query(`create schema if not exists ${schema}`);
    
    // 4. 7개 테이블 생성
    // - schedules
    // - profiles
    // - invite_codes
    // - notices
    // - branch_memos
    // - schedule_edit_logs
    // - notice_reads
    
    // 5. 관리자 프로필 정보 삽입
    await client.query(
      `insert into ${schema}.profiles 
       (id, login_id, full_name, branch_name, phone_number, role, is_approved, company, email)
       values ($1, $2, $3, $4, $5, 'admin', true, $6, $7)`,
      [params.profileId, params.employeeCode, params.fullName, params.branchName, 
       params.phoneNumber, params.company ?? null, params.email ?? null]
    );
    
    // 6. public.profiles에 스키마 정보 저장
    await client.query(
      `update public.profiles set tenant_schema = $1 where login_id = $2`,
      [schema, params.employeeCode]
    );
  } finally {
    client.release();
  }
  
  return schema; // 예: "t_121202730"
}
```

### 관리자 회원가입 라우트

**파일:** `app/api/auth/admin-signup/route.ts`

```typescript
export async function POST(req: NextRequest) {
  // 1. 요청 데이터 파싱
  const { employeeCode, fullName, branchName, phoneNumber, email, company } = body;
  
  // 2. 검증 및 중복 체크
  
  // 3. public.auth_users에 인증 데이터 삽입
  await query(
    `insert into public.auth_users 
     (login_id, password, role, must_change_password)
     values ($1, $2, 'admin', true)`,
    [employeeCode, employeeCode]  // ID/PW 동일
  );
  
  // 4. public.profiles에 프로필 삽입
  const profileId = (await query(...))[0].id;
  
  // 5. 전용 테넌트 스키마 및 테이블 생성
  await createTenantForAdmin({
    employeeCode,
    branchName,
    fullName,
    phoneNumber,
    company,
    email,
    profileId
  });
  
  return { status: "ok", message: "가입이 완료되었습니다." };
}
```

---

## 📌 주요 특징

### ✅ 다중 테넌트 아키텍처
- 각 관리자마다 **독립된 스키마** (t_[사번])
- 완벽한 데이터 격리 (한 지점의 데이터가 다른 지점에 영향 없음)
- 지점별 매니저/에이전트 독립 관리

### ✅ 자동 초기화
- 회원가입 시 필요한 모든 테이블 자동 생성
- 별도의 마이그레이션 작업 불필요
- 즉시 사용 가능한 상태로 생성

### ✅ 데이터 동기화
- `public.profiles`: 전사 통합 사용자 정보
- `t_[사번].profiles`: 지점별 사용자 정보
- 매니저/에이전트 승인 시 자동 동기화

### ✅ 감시 및 추적
- `schedule_edit_logs`: 일정 변경 이력
- `notice_reads`: 공지사항 확인 여부
- `branch_memos`: 지점 메모 기록

---

## 🔍 초기 로그인 절차

1. **회원가입 완료 후** → ID: 사번, PW: 사번
2. **첫 로그인** → `auth.must_change_password = true` 확인
3. **비밀번호 변경 강제** → 새로운 비밀번호 설정
4. **대시보드 진입** → 완전히 활성화된 관리자 계정

---

## 📝 SQL 쿼리 예시

### 새 관리자의 스키마 확인
```sql
-- 새로 생성된 스키마와 테이블 확인
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name LIKE 't_%';

-- 특정 스키마의 테이블 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 't_121202730';

-- 관리자가 할당받은 스키마 확인
SELECT login_id, full_name, branch_name, tenant_schema 
FROM public.profiles 
WHERE role = 'admin' AND tenant_schema IS NOT NULL;
```

### 데이터 동기화 확인
```sql
-- public.profiles와 tenant 스키마의 프로필 데이터 비교
SELECT p1.login_id, p1.full_name, p2.full_name as tenant_name
FROM public.profiles p1
LEFT JOIN t_121202730.profiles p2 ON p1.id = p2.id
WHERE p1.role IN ('manager', 'agent');
```
