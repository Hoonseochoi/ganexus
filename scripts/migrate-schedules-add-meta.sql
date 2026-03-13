-- schedules 테이블에 메타 컬럼 추가 및 category 체크 변경
-- Neon 콘솔 또는 psql에서 실행 후 앱 재시작

-- 1) 메타 컬럼 추가
ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS dealer_name text,
  ADD COLUMN IF NOT EXISTS location text,
  ADD COLUMN IF NOT EXISTS instructor text,
  ADD COLUMN IF NOT EXISTS target_audience text,
  ADD COLUMN IF NOT EXISTS manager_name text;

-- 2) 기존 category 제약 제거
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN (
    SELECT c.conname
    FROM pg_constraint c
    JOIN pg_class t ON c.conrelid = t.oid
    WHERE t.relname = 'schedules'
      AND c.contype = 'c'
      AND pg_get_constraintdef(c.oid) LIKE '%category%'
  ) LOOP
    EXECUTE format('ALTER TABLE public.schedules DROP CONSTRAINT IF EXISTS %I', r.conname);
  END LOOP;
END $$;

-- 3) 기존 데이터 category 매핑 (education->dealer, vacation->leave, hq->internal, etc->etc)
UPDATE public.schedules
SET category = CASE category
  WHEN 'education' THEN 'dealer'
  WHEN 'vacation' THEN 'leave'
  WHEN 'hq' THEN 'internal'
  ELSE 'etc'
END
WHERE category IN ('education', 'vacation', 'hq', 'etc');

-- 4) 새 category 제약 추가 (이미 있으면 무시)
DO $$
BEGIN
  ALTER TABLE public.schedules
    ADD CONSTRAINT schedules_category_check
    CHECK (category IN ('dealer', 'internal', 'personal', 'leave', 'etc'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
