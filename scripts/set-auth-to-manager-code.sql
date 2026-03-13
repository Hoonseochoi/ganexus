-- 지금 쓰는 계정 하나를 "매니저코드 / 매니저코드" 로그인으로 바꾸기
-- ⚠️ 아래 'YOUR_MANAGER_CODE' 와 'CURRENT_LOGIN_ID' 를 실제 값으로 바꾼 뒤 네온 SQL 에디터에서 실행하세요.
-- 예: admin(121202739) 을 매니저코드 MANAGER-01 로 쓰려면
--     매니저코드 = 'MANAGER-01', 현재로그인ID = '121202739'

-- 1) auth_users: login_id, password 를 매니저코드로 변경 (해당 계정만)
update public.auth_users
set
  login_id = 'YOUR_MANAGER_CODE',
  password = 'YOUR_MANAGER_CODE',
  must_change_password = true
where login_id = 'CURRENT_LOGIN_ID';

-- 2) profiles: 같은 계정의 login_id 도 매니저코드로 맞추기 (세션/조회용)
update public.profiles
set login_id = 'YOUR_MANAGER_CODE'
where login_id = 'CURRENT_LOGIN_ID';

-- ========== [실행용] admin(121202739) 을 매니저코드로 바꾸기 ==========
-- 'MANAGER-01' 을 원하는 매니저코드로 바꾼 뒤 아래 두 개를 네온 SQL에서 실행하세요.

UPDATE public.auth_users
SET login_id = 'MANAGER-01', password = 'MANAGER-01', must_change_password = true
WHERE login_id = '121202739';

UPDATE public.profiles
SET login_id = 'MANAGER-01'
WHERE login_id = '121202739';

-- 실행 후 /manager-login 에서 ID·PW 모두 매니저코드(예: MANAGER-01)로 로그인하면 됩니다.
