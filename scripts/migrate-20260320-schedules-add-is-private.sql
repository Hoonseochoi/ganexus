-- schedules 테이블에 is_private 컬럼 추가
-- ⚠️  public이 아닌 각 테넌트 스키마(t_xxx)에 적용해야 함
-- Neon SQL Editor에서 실행 후 로컬 서버 재시작

-- 1) 기존 모든 테넌트 스키마에 자동 적용
DO $$
DECLARE
  schema_name text;
BEGIN
  FOR schema_name IN
    SELECT DISTINCT tenant_schema
    FROM public.profiles
    WHERE tenant_schema IS NOT NULL
  LOOP
    EXECUTE format(
      'ALTER TABLE %I.schedules ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false',
      schema_name
    );
    RAISE NOTICE 'is_private 추가됨: %.schedules', schema_name;
  END LOOP;
END $$;

-- 2) public.schedules에도 혹시 있다면 추가
ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;
