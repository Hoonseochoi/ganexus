### Manager Pre-Approval Runbook

### 1. 현재 적용 상태

- CSV 기반 사전등록 테이블 생성/적재 완료
- 적용 배치 정보:
  - source: manager_code.csv
  - total: 105
  - inserted: 105
  - updated: 0

### 2. 관련 파일

- API 즉시승인 분기: app/api/agent/apply/route.ts
- CSV import 스크립트: scripts/import_manager_codes.js
- DDL SQL: scripts/migrate-add-manager-code-registry.sql
- npm 스크립트: package.json (import:manager-codes)

### 3. 운영 적용 커맨드

```bash
npm run import:manager-codes
```

기본 CSV 경로는 public/manager_code.csv 입니다.

다른 파일로 적재하려면:

```bash
node scripts/import_manager_codes.js ./some/path/manager_code.csv
```

### 4. 가입 동작 요약

매니저 가입 신청 시(apply API):

1. 초대코드 유효성 확인
2. manager_code_registry 에서 manager_code 매칭
3. 아래 조건 만족 시 즉시 승인
   - manager_code 일치
   - manager_name(가입 이름) 일치
   - branch_name 일치
   - is_active = true
   - claimed_profile_id is null
4. 즉시 승인 시:
   - profiles.is_approved = true
   - manager_code_registry 에 claimed_profile_id/claimed_at 기록
   - tenant_schema 있으면 tenant profiles 즉시 동기화

조건 미충족 시 기존과 동일하게 승인대기(is_approved = false)

### 5. 정책(현재 구현 기본값)

- 매칭 기준: manager_code + branch_name + manager_name
- 이름 일치(full_name)는 강제하지 않음
- 이미 claim된 manager_code는 즉시승인 불가(409)
- tenant_schema 없는 지점은 즉시승인은 유지하고 tenant 동기화는 건너뜀(로그 기록)

### 8. 비밀번호 찾기 API

- 엔드포인트: /api/auth/manager-reset-password
- 요청값: managerCode, fullName, branchName, newPassword
- 동작: 3개 식별값이 기존 가입 이력과 모두 일치하면 비밀번호 재설정

### 6. 점검 쿼리 예시

```sql
select manager_code, manager_name, branch_name, is_active, claimed_profile_id, claimed_at
from public.manager_code_registry
order by branch_name, manager_code;
```

```sql
select login_id, full_name, branch_name, role, is_approved, manager_code
from public.profiles
where role = 'manager'
order by created_at desc
limit 50;
```

### 7. 롤백 가이드

즉시승인 기능만 임시 해제하려면:

- app/api/agent/apply/route.ts 에서 registry 매칭 분기를 제거/비활성화
- 테이블 데이터는 유지(감사용)

테이블 자체 롤백:

```sql
drop table if exists public.manager_code_registry;
```

주의: 운영에서 drop 전에는 claimed 이력 보존 필요 여부를 먼저 확인하세요.
