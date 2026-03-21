BEGIN;

-- 1. schedules 테이블에 recurrence_rule 컬럼 추가
ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS recurrence_rule TEXT DEFAULT NULL;

-- 2. schedule_participants 테이블 신규 생성
CREATE TABLE IF NOT EXISTS public.schedule_participants (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
  profile_id  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status      VARCHAR(20) NOT NULL DEFAULT 'attending'
                CHECK (status IN ('attending', 'declined', 'tentative')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(schedule_id, profile_id)
);

-- ROLLBACK:
-- DROP TABLE IF EXISTS public.schedule_participants;
-- ALTER TABLE public.schedules DROP COLUMN IF EXISTS recurrence_rule;

COMMIT;
