-- auth_users 에 들어가는 매니저 계정은 모두 id=매니저코드, pw=매니저코드 로 맞추기
-- (에이전트는 계속 폰번호/생년월일, 매니저만 매니저코드/매니저코드)
-- ⚠️ 실행 전 백업 권장.
--
-- ※ profiles에 role='manager' 인 행이 있을 때만 적용됩니다.
-- ※ admin 한 계정만 매니저코드로 바꾸려면 set-auth-to-manager-code.sql 를 사용하세요.

-- 1) profiles 에 manager_code 컬럼 없으면 추가
alter table if exists public.profiles
  add column if not exists manager_code text;

-- 2) role='manager' 인데 manager_code 가 비어 있으면, 기존 login_id 기준으로 코드 부여
--    (원하면 아래 값으로 직접 수정 가능)
update public.profiles
set manager_code = coalesce(nullif(trim(manager_code), ''), 'MGR-' || login_id)
where role = 'manager';

-- 3) auth_users: 매니저인 계정은 login_id, password 를 profiles.manager_code 로 통일
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

-- 4) profiles.login_id 도 매니저코드로 맞춤 (세션/조회 일치)
update public.profiles p
set login_id = p.manager_code
where p.role = 'manager'
  and p.manager_code is not null
  and p.manager_code <> '';

-- 실행 후: 매니저는 모두 /manager-login 에서 ID·PW = 매니저코드 로 로그인 가능.
-- 새 매니저는 관리자 화면 "매니저 등록"으로만 추가되며, 그때도 auth에 id/pw = 매니저코드로 들어감.
