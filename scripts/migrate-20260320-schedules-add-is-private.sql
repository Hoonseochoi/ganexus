-- schedules 테이블에 is_private 컬럼 추가
-- Neon 콘솔 또는 psql에서 실행 후 로컬 서버 재시작

ALTER TABLE public.schedules
  ADD COLUMN IF NOT EXISTS is_private boolean NOT NULL DEFAULT false;

-- 인덱스: 나만보기 필터링 성능 (선택)
CREATE INDEX IF NOT EXISTS idx_schedules_is_private
  ON public.schedules (is_private)
  WHERE is_private = true;
