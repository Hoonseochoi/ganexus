-- 매니저 로그인 ID/PW를 "매니저 코드"로 전환하기 위한 가이드 스크립트
-- ⚠️ 실행 전 반드시 본인 네온 DB를 백업한 뒤 진행하세요.
-- ⚠️ 실제 매니저 코드 값(예: MANAGER-0001)은 사용자가 직접 정의해야 합니다.

-- 1) (옵션) profiles 에 manager_code 컬럼 추가
alter table if exists public.profiles
  add column if not exists manager_code text;

-- 2) (예시) 현재 등록된 매니저 프로필에 매니저 코드 채우기
--    - 아래 update 구문은 예시입니다.
--    - 각 매니저별 실제 매니저 코드를 알고 있다면, 개별적으로 update 하세요.
--    - 예: 김지점 매니저에게 MANAGER-GANGNAM-01 코드를 부여
-- update public.profiles
-- set manager_code = 'MANAGER-GANGNAM-01'
-- where role = 'manager' and full_name = '김지점';

-- 3) auth_users.login_id / password / role 를 manager_code 및 'manager' 로 맞추기
--    - manager_code 가 비어있지 않은 매니저만 대상으로 함
--    - role 도 'manager' 로 통일 (에이전트 신청 후 전환한 계정은 auth_users.role 이 'agent' 일 수 있음)
update public.auth_users au
set
  login_id = p.manager_code,
  password = p.manager_code,
  must_change_password = true,
  role = 'manager'
from public.profiles p
where au.login_id = p.login_id
  and p.role = 'manager'
  and p.manager_code is not null
  and p.manager_code <> '';

-- 4) profiles.login_id 도 manager_code 와 동기화
update public.profiles p
set login_id = p.manager_code
where p.role = 'manager'
  and p.manager_code is not null
  and p.manager_code <> '';

-- 5) (선택) 이미 login_id 는 manager_code 로 바뀌었는데 role 만 아직 'agent' 인 계정 보정
--    - 3단계를 이미 실행한 뒤 profiles.role = 'manager' 인데 auth_users.role 이 'agent' 인 경우 실행
update public.auth_users au
set role = 'manager'
from public.profiles p
where au.login_id = p.login_id
  and p.role = 'manager'
  and au.role <> 'manager';

-- 참고:
-- - 이후 새로 생성하는 매니저 계정은,
--   auth_users.login_id / password / role / profiles.login_id 를 모두 동일한 manager_code(및 role='manager') 로 넣어주면
--   /manager-login 페이지에서 "ID / PW = 매니저 코드" 방식으로 로그인할 수 있습니다.

