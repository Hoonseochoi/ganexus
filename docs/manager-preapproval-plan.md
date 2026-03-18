### Manager Pre-Approval Plan (CSV 기반 즉시 승인)

이 문서는 다음 목표를 위한 구현 계획입니다.

- public/manager_code.csv 에 있는 매니저 사전등록 정보와 가입 신청 정보를 매칭
- 매칭 성공 시 승인 대기 없이 즉시 승인
- 해당 지점 테넌트(캘린더 스키마)가 이미 생성된 경우 즉시 멤버 등록 완료

---

### 1. 현재 상태 요약

- 매니저 가입 신청은 app/api/agent/apply/route.ts 에서 처리되고, 현재는 항상 is_approved = false 로 저장됨.
- 승인/거절은 app/api/admin/approvals/route.ts 에서 관리자 수동 처리.
- 지점 멤버 동기화는 addProfileToTenant 로 수행됨.
- 지점 테넌트 스키마는 관리자 가입 시 createTenantForAdmin 으로 생성됨.
- CSV 컬럼은 다음 4개:
  - 매니저코드
  - 매니저명
  - 직책
  - 지점명

---

### 2. 데이터 모델 (Neon)

신규 테이블: public.manager_code_registry

권장 컬럼:

- id uuid primary key default gen_random_uuid()
- manager_code text not null unique
- manager_name text not null
- position_title text null
- branch_name text not null
- is_active boolean not null default true
- imported_at timestamptz not null default now()
- import_batch_id text null
- source_filename text null
- claimed_profile_id uuid null
- claimed_at timestamptz null
- created_at timestamptz not null default now()
- updated_at timestamptz not null default now()

권장 인덱스:

- unique(manager_code)
- index on (branch_name)
- partial index on (is_active) where is_active = true

의도:

- manager_code 를 단일 진실 소스로 관리
- 가입 완료된 코드(claimed_*)를 기록해 재사용/중복 가입 통제

---

### 3. CSV 적재 전략

#### 3.1 파이프라인

1. CSV 파싱 스크립트 추가 (scripts/import_manager_codes.js)
2. UTF-8 BOM/한글 헤더 대응
3. 컬럼 매핑
   - 매니저코드 -> manager_code (trim)
   - 매니저명 -> manager_name (trim)
   - 직책 -> position_title
   - 지점명 -> branch_name
4. upsert 적재
   - conflict target: manager_code
   - 업데이트: manager_name, position_title, branch_name, is_active, updated_at
5. 적재 로그 출력
   - insert count
   - update count
   - duplicate/invalid row count

#### 3.2 데이터 정합성 규칙

- manager_code 는 숫자 문자열 그대로 저장 (선행 0 보존)
- 공백/제어문자 trim
- 빈 manager_code 또는 branch_name 은 적재 제외
- 같은 manager_code 가 CSV 내부 중복이면 마지막 row 우선 또는 에러 처리 (정책 결정 필요)

---

### 4. 가입 즉시 승인 플로우

대상: app/api/agent/apply/route.ts

현재 로직:

- 초대코드 검증
- auth_users/profiles 생성
- profiles.is_approved = false

변경 로직(신규 분기):

1. 초대코드로 확정된 branch_name 확보
2. manager_code_registry 에서 manager_code 조회
3. 매칭 조건 검증
   - manager_code 일치 (필수)
   - registry.branch_name == invite.branch_name (필수)
   - registry.is_active = true (필수)
   - registry.claimed_profile_id is null (기본 정책)
   - manager_name == fullName 필수 일치 (공백 제거 기준)
4. 매칭 성공 시:
   - profiles.is_approved = true 로 저장
   - auth_users.role = manager, must_change_password = true 유지
   - public.profiles.role = manager, manager_code = 입력코드
   - manager_code_registry.claimed_profile_id / claimed_at 업데이트
5. 지점 테넌트 멤버 동기화
   - getTenantSchemaForBranch(branch_name) 조회
   - tenant schema 있으면 addProfileToTenant 즉시 실행
   - tenant schema 없으면 보류 상태 기록 후 재시도 전략 적용
6. 응답 메시지
   - 즉시 승인 성공: 바로 로그인 가능 메시지
   - 매칭 실패: 기존과 동일하게 승인 대기 메시지

---

### 5. 캘린더(지점 스키마) 생성 조건 처리

요구사항 핵심:

- 지점 캘린더가 생성된 경우 즉시 로그인/멤버 등록 가능해야 함.

처리 규칙:

- tenant_schema 존재 시: 즉시 addProfileToTenant 실행
- tenant_schema 미존재 시: 가입은 가능하되 아래 중 하나 정책 적용

정책 A:
- 즉시 승인은 유지
- tenant profile 동기화는 지연 작업(배치/재시도)

정책 B:
- tenant 미생성 지점은 즉시 승인 불가
- 기존 승인 대기로 폴백

현재 적용: 정책 A

---

### 6. 보안/운영 가드

- 같은 manager_code 중복 가입 방지
  - manager_code_registry.claimed_* 확인
  - public.auth_users.login_id unique 충돌 처리
- branch mismatch 차단
  - invite.branch_name 과 registry.branch_name 불일치 시 즉시승인 금지
- 감사 로그
  - 즉시 승인 여부, 매칭 결과, 실패 사유를 debug_logs 또는 별도 audit 테이블에 기록
- 재처리 API(관리자용)
  - tenant 동기화 실패 건을 수동 재시도할 수 있는 엔드포인트 고려

---

### 7. 마이그레이션/배포 순서

1. Neon DDL 적용 (manager_code_registry 생성)
2. CSV import 스크립트 배포 및 1차 적재
3. apply 라우트 즉시승인 분기 배포
4. 스테이징 검증
   - 매칭 성공 케이스
   - 매칭 실패 케이스
   - branch mismatch 케이스
   - 중복 가입 케이스
5. 운영 반영
6. 운영 모니터링

---

### 8. 테스트 시나리오

- 정상 즉시 승인
  - CSV에 코드 존재, branch 일치, invite 유효
- 코드 불일치
  - CSV 미등록 코드 -> 승인 대기
- branch 불일치
  - CSV branch 와 invite branch 다름 -> 승인 대기
- 이미 사용된 코드
  - claimed_profile_id 존재 -> 가입 차단 또는 대기 (정책)
- tenant 동기화 검증
  - 즉시 승인 후 해당 tenant_schema.profiles 에 매니저 row 생성 확인

---

### 9. 결정 필요 사항 (사용자 확인)

1. 매칭 조건에 이름 일치까지 강제할지
   - 옵션 A: manager_code + branch_name 만 사용
   - 옵션 B: manager_code + branch_name + fullName 모두 일치
   - 현재 적용: 옵션 B
2. 이미 사용된 manager_code 재사용 정책
   - 옵션 A: 완전 차단
   - 옵션 B: 동일 인물 재가입만 허용
   - 현재 적용: 옵션 A
3. tenant_schema 없는 지점 처리
   - 옵션 A: 즉시 승인 후 tenant 동기화 지연
   - 옵션 B: 즉시 승인하지 않고 대기
   - 현재 적용: 옵션 A
4. CSV 갱신 주기
   - 수동 업로드
   - 주기 배치
5. 직책(position_title) 활용 여부
   - 저장만 할지
   - role 매핑에 사용할지
6. 코드 형식 검증
   - 숫자만 허용할지
   - 문자열 전체 허용할지

---

### 10. 구현 파일 범위 (예정)

- 신규
   - scripts/import_manager_codes.js
  - docs/manager-preapproval-runbook.md
- 수정
  - app/api/agent/apply/route.ts
   - app/api/auth/manager-reset-password/route.ts
   - app/manager-login/page.tsx
  - src/lib/engines/tenant.ts (필요 시 보조 유틸)
  - src/lib/engines/db.ts 또는 migration SQL 파일

---

### 12. 비밀번호 찾기(매니저)

- 매니저 로그인 하단에 "비밀번호를 잊으셨나요?" 버튼 추가
- 입력값:
   - 매니저 코드
   - 이름
   - 지점명
   - 새 비밀번호
- 검증 조건:
   - manager_code + full_name + branch_name 모두 일치
   - 기존 가입 이력(approved manager profile + auth_users) 존재
- 성공 시:
   - auth_users.password 갱신
   - must_change_password = false

---

### 11. 참고

- CSV 원본: public/manager_code.csv
- 현재 매니저 가입 API: app/api/agent/apply/route.ts
- 현재 승인 API: app/api/admin/approvals/route.ts
- tenant 동기화 함수: src/lib/engines/tenant.ts (addProfileToTenant)
