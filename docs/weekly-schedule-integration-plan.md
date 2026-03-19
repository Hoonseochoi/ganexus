# 주간일정 메뉴/화면 통합 계획

## 1) 요구사항 요약
- 관리자 설정 메뉴 개편
- 모바일 캘린더 상단 `Today` 버튼을 `주간일정` 버튼으로 교체
- 웹 캘린더 상단 `Search events...` 위치를 `주간일정` 버튼으로 교체
- 신규 `주간일정` 화면 추가
- 주간일정은 기본 로드 범위를 오늘 기준 앞뒤 3일(총 7일)로 시작
- 타임라인 상단/하단 당김(스크롤) 시 3일 단위 추가 로드
- 일자별 일정 세부내용(시간, 제목, 설명, 강사, 장소, 대상, 담당) 표시

## 2) 현재 프로젝트 적합성 점검
- Typescript: 사용 중 (`tsconfig.json` 존재)
- Tailwind: 사용 중 (Tailwind v4 계열 패키지 및 `@import "tailwindcss"` 적용)
- shadcn 구조: 완전 기본 구조(`/components/ui`)는 미구성 상태였고, 실제 UI 컴포넌트는 `app/components/ui`에 주로 존재

## 3) 폴더 구조 정리 가이드
- 이번 작업에서 신규 기본 경로 `components/ui`를 생성해 타임라인 컴포넌트를 배치
- 이유:
  - shadcn 예제/외부 컴포넌트 템플릿의 기본 import 경로와 호환성이 높음
  - 공용 UI 컴포넌트를 `app` 라우트 코드와 분리해 재사용성이 좋아짐
  - 향후 CLI 자동 생성 컴포넌트와 충돌이 줄어듦

## 4) 구현 단계
1. `components/ui/timeline-component.tsx` 추가
2. `components/ui/demo.tsx` 추가
3. `app/weekly-schedule/page.tsx` 및 `app/components/WeeklyScheduleClient.tsx` 추가
4. 관리자 설정 메뉴 항목 개편
5. 모바일/웹 캘린더 상단 버튼 라우팅 교체
6. `app/globals.css`에 `tw-animate-css` import + `fade-in` 애니메이션 추가
7. 의존성 설치 (`tw-animate-css`)

## 5) 데이터/상태/컨텍스트 설계
- 데이터 소스: 기존 `GET /api/schedules?from=YYYY-MM-DD&to=YYYY-MM-DD`
- 상태:
  - `rangeStart`, `rangeEnd`: 현재 로드된 날짜 범위
  - `eventsByDate`: 일자별 일정 캐시
  - `initialLoading`, `loadingPrev`, `loadingNext`: 로딩 상태
- 추가 로드 방식:
  - 상/하단 sentinel + `IntersectionObserver`
  - 위/아래 스크롤 끝 진입 시 3일 단위 확장

## 6) 질문 체크리스트 (추가 논의 권장)
- 주간일정의 기준일은 항상 오늘인지, 선택한 날짜 기준으로 열릴지?
- 소프트 삭제 일정은 기본 숨김 처리할지, 현재처럼 표시하되 흐리게 처리할지?
- 시간 정렬 기준은 시작시간 고정인지, 카테고리 우선순위를 둘지?
- 모바일에서 당김 로드 임계값(민감도) 조정이 필요한지?
- 일정 상세 클릭 시 수정/삭제까지 진입할지, 읽기 전용으로 둘지?

## 7) 추가로 하면 좋은 것
1. 주간일정 상단에 날짜 점프(달력 피커) 제공
2. 카테고리 필터(교육/내부/월차/기타) 추가
3. 강사/담당자 검색 추가
4. 무한 스크롤 로드 실패 시 재시도 버튼 제공
5. 주간일정 페이지에 URL 파라미터(`?center=YYYY-MM-DD`) 지원
6. 성능 최적화를 위한 가상 스크롤(아이템 수가 커질 때) 도입

## 8) Unsplash 이미지 자산 제안 (선택)
- 본 타임라인 UI는 필수 이미지 의존성이 없음
- 필요 시 상단 배너/빈 상태 카드에 아래 이미지 활용 가능
  - https://images.unsplash.com/photo-1497366754035-f200968a6e72
  - https://images.unsplash.com/photo-1461749280684-dccba630e2f6
  - https://images.unsplash.com/photo-1504384308090-c894fdcc538d
