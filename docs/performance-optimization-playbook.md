# GA_NEXUS 성능 최적화 플레이북

이 문서는 현재 코드베이스 기준으로, 로딩/반응 속도를 체감 가능하게 개선하기 위한 우선순위 실행 가이드입니다.

## 실행 TODO 현황 (2026-03-19)

### 완료
- [x] 스케줄 조회 서버 메모리 캐시 추가 (짧은 TTL)
- [x] 일정 생성/수정/삭제 시 캐시 무효화 연결
- [x] DB 느린 쿼리 로깅 추가 (`DB_QUERY_SLOW_MS` 기준)
- [x] 데스크톱 월 전환 인접 월 prefetch 추가
- [x] 모바일 월 전환 인접 월 prefetch 추가
- [x] 일정 추가 팝업 메타 데이터 클라이언트 캐시(TTL 5분) 추가
- [x] `/api/schedules` 계열 응답 시간 헤더(`Server-Timing`, `X-Response-Time`) 추가
- [x] 캘린더 월 데이터 조회 클라이언트 캐시 적용
- [x] 월 캐시 무효화 이벤트 연결 (생성/수정/삭제/드래그 이동 후 현재 월 재로드)
- [x] schedules 인덱스 후보 EXPLAIN/ANALYZE 실측 완료
- [x] cold start 운영정책 확인 완료 (운영 project `suspend_timeout_seconds = 0`)
- [x] 빌드 검증 완료 (`npm run build` 통과)

### 다음 작업
- [ ] Data API 파일럿 대상 1개 경로 선정 후 A/B 측정
- [ ] 배포 후 월 캐시 hit 비율과 `/api/schedules` p95 수치 재측정
- [ ] schedules row 수 증가 시점 기준으로 인덱스 재평가 임계치 정의

## 0) 현재 상태 요약

프로젝트에서 이미 잘하고 있는 부분:
- Neon 연결에 pooler 엔드포인트 사용 중
- 월 조회 범위를 월 +/- 7일로 제한 중
- 일부 API 응답에 짧은 캐시 헤더(`private, max-age=15~30`) 적용 중

그럼에도 느리게 느껴질 수 있는 구간:
- 월 전환 시 서버 렌더 + DB 조회 + 데이터 가공이 한 번에 발생
- 캘린더 컴포넌트에서 날짜별 데이터 가공/렌더 비용 누적
- 배포 후 warm/cached 상태 기준 p95가 실제로 얼마나 내려갔는지 아직 재측정 전

현재 운영 확인 사항:
- Neon 운영 project `ganexus`는 `suspend_timeout_seconds = 0` 으로 확인되어 scale-to-zero cold start는 현재 운영 병목이 아님
- 운영 tenant `t_121202730.schedules` 실데이터는 13건이며, 대표 월 조회 EXPLAIN ANALYZE 실행 시간은 약 0.129ms
- 현재 크기에서는 `schedules` 추가 인덱스보다 클라이언트 월 캐시와 렌더 비용 절감이 우선순위가 높음

## 1) 결론: 연결 방식 전략 (Data API 포함)

현재 상태에서는 전체를 Neon Data API로 바꾸는 것보다, 아래 전략이 더 유리합니다.

- 캘린더/스케줄 핵심 경로: 기존 Postgres(pooler) 유지
- 단순 읽기/모바일 친화 API: 선택적으로 Data API 도입
- 성능 체감 개선 1순위: 연결 방식 변경보다 cold start, 쿼리, 캐싱, 렌더 최적화

Data API가 유리한 경우:
- 단순 CRUD 위주
- 클라이언트/엣지에서 HTTP 기반 접근이 필요한 경우
- 인증/RLS를 API 경계에서 관리하고 싶은 경우

Data API가 불리할 수 있는 경우:
- 고빈도/복잡 조인/복잡 트랜잭션
- 요청당 페이로드가 크고 왕복이 잦은 경우

## 2) 우선순위 로드맵

### P0 (바로 적용, 1일 내)

1. 성능 계측부터 고정
- API 응답 시간, DB 쿼리 시간, 클라이언트 렌더 시간 계측 추가
- 목표: 병목을 감으로 추정하지 않고 수치로 확인

2. 캘린더 조회 API 캐시 정책 점검
- 사용자별 데이터는 `private` 유지
- 월 이동이 잦은 화면은 재요청을 줄이기 위해 클라이언트 캐시 병행

3. 느린 쿼리 인덱스 확인
- `schedules` 조회 조건(지점 + 기간)에 맞는 인덱스 재점검

### P1 (단기, 2~4일)

1. 클라이언트 캐시 도입
- 월 단위 조회 결과를 메모리 캐시
- 같은 월 재방문 시 네트워크 재요청 생략

2. 월 전환 UX 최적화
- 클릭 즉시 로딩 상태 표시
- 이전 데이터 유지 + 백그라운드 리패치로 체감 속도 개선

3. 데이터 가공 비용 절감
- 날짜 파싱/그룹핑 로직을 메모화
- 동일 데이터로 불필요한 재계산 방지

### P2 (중기, 1~2주)

1. Neon cold start 운영전략 확정
- Free 플랜: 주기적 헬스 체크로 완화
- Paid 플랜: scale-to-zero 비활성화 여부 검토

2. Data API 선택 도입
- notices/memos 같은 단순 읽기 경로부터 A/B 테스트
- 핵심 일정 경로는 기존 방식 유지 후 성능 비교

## 3) DB 최적화 체크리스트

### 3-1. 인덱스

핵심 조회 패턴은 다음 조건입니다.
- branch_name = ?
- end_at >= from
- start_at <= to
- soft delete 정렬/필터

검토할 인덱스 예시:

```sql
CREATE INDEX IF NOT EXISTS idx_schedules_branch_start
ON public.schedules (branch_name, start_at);

CREATE INDEX IF NOT EXISTS idx_schedules_branch_end
ON public.schedules (branch_name, end_at);

CREATE INDEX IF NOT EXISTS idx_schedules_branch_start_active
ON public.schedules (branch_name, start_at)
WHERE is_soft_deleted = false;
```

주의:
- 인덱스 추가 전/후 `EXPLAIN ANALYZE`로 실제 개선 확인
- 인덱스가 많아지면 쓰기 성능 저하 가능
- 2026-03-19 실측 기준 운영 tenant `t_121202730.schedules` 는 13건, 대표 조회 쿼리는 seq scan + 정렬로도 약 0.129ms라서 인덱스 추가 이득이 사실상 없음
- 따라서 현재는 인덱스를 보류하고, row 수 증가나 `/api/schedules` p95 상승이 확인될 때 재평가하는 편이 맞음

### 3-2. 쿼리 로깅

- 쿼리 래퍼에서 실행 시간(ms) 기록
- 느린 쿼리 기준선(예: 200ms 이상) 별도 로그 분리
- 월별/지점별 요청량과 함께 저장

## 4) Next.js 서버/라우팅 최적화

1. 서버에서 하는 일 최소화
- 월 전환마다 꼭 필요한 데이터만 조회
- 불필요한 변환/정렬 중복 제거

2. 캐시 전략 분리
- 일정: 짧은 TTL + 클라이언트 캐시
- 공지/메모: 상대적으로 긴 TTL 가능

3. 네트워크 왕복 최소화
- 같은 화면에서 필요한 데이터를 가능한 묶어서 조회
- 화면 진입 시점과 사용자 상호작용 시점 요청을 분리

## 5) 프론트엔드 렌더 최적화

1. 월 단위 데이터 캐시
- key 예시: `branch + year + month`
- 캐시 hit 시 즉시 렌더, miss 시 fetch

2. 계산 메모화
- 날짜별 그룹핑, 선택일 목록 계산을 `useMemo`로 고정
- 이벤트 핸들러 `useCallback`으로 불필요 리렌더 완화

3. 리스트 렌더 비용 제어
- 카드 컴포넌트 `memo` 적용
- 키 안정성 보장

4. 체감 성능 UX
- 월 이동 버튼 클릭 즉시 pending 표시
- 스켈레톤/낙관적 표시 적용

## 6) Data API 도입 가이드 (선택)

원칙:
- 핵심 경로(캘린더): 기존 pooler 기반 유지
- 비핵심/단순 조회: Data API 후보

도입 순서:
1. 대상 API 선정 (예: notices 조회)
2. 응답 시간/오류율/코드 복잡도 비교
3. 일정 경로 대비 운영 안정성 확인
4. 효과가 명확할 때만 확대

## 7) 실행 체크리스트 (실무용)

### Day 1
- 쿼리 시간 로깅 추가
- API 응답 시간 로깅 추가
- 캘린더 월 이동 체감 시간 측정 포인트 추가

### Day 2
- 인덱스 적용 후보 EXPLAIN 비교
- 클라이언트 월 캐시 적용
- 로딩 UX(버튼 pending + 스켈레톤) 적용

### Day 3
- 배포 후 수치 비교
- p95 응답시간, 첫 로드 시간, 월 전환 시간 비교
- 필요 시 Data API 파일럿 1개 경로 적용

## 8) 목표 지표 (권장)

- 월 전환 체감 시간: 1.0s 이하
- `/api/schedules` p95: 300ms 이하 (warm 기준)
- 첫 요청 cold start: 현 수준 측정 후 별도 관리
- 캐시 hit 비율: 60% 이상

## 9) 지금 바로 적용할 추천안

1. 연결 방식은 현재(pooler) 유지
2. 쿼리/응답 시간 계측 먼저 추가
3. 캘린더 월 캐시 + 렌더 메모화 적용
4. 인덱스 EXPLAIN 검증 후 반영
5. Data API는 단순 읽기 엔드포인트만 파일럿

---

필요하면 이 문서를 기준으로 바로 작업 가능한 TODO 이슈 목록(파일 단위)까지 분해해서 추가할 수 있습니다.
