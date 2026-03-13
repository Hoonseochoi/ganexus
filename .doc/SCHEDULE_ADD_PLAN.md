# 일정 추가(일정 등록) 개선 플랜

## 목표
- 일정 등록 시 **카테고리별 체크 항목**(대리점/사내/개인/월차/기타)과 **제목 자동완성**, **최소 입력(제목만)** 지원
- **종일 설정·종료 시간 제거**, **시작 시간만** 선택(또는 날짜만)
- 우측 패널: **일정명(title) + sub(대상자, 시간)** 표시, **클릭 시 상세 보기** 모달
- **카테고리별 색상** 적용 (캘린더 칩, 우측 패널 리스트)

---

## 1. 카테고리 및 스키마

### 1.1 카테고리 정의 (5종, 색상)
| 코드 | 라벨 | 색상(예시) |
|------|------|------------|
| `dealer` | 대리점일정 | 예: primary/청색 계열 |
| `internal` | 사내일정 | 예: 보라/인디고 |
| `personal` | 개인일정 | 예: 초록/에메랄드 |
| `leave` | 월차 | 예: 주황/앰버 |
| `etc` | 기타 | 예: 슬레이트 그레이 |

### 1.2 카테고리별 입력 필드
- **대리점일정**: 대리점명, 교육시작 시간, 장소, 교육자, 메모
- **사내일정**: 대상자, 일정명, 시간, 장소, 메모
- **개인일정**: 일정명, 시간, 장소, 메모
- **월차**: 매니저명 (일정명/시간은 선택)
- **기타**: 일정명, 메모 등 최소

공통: **일정명(title)**, **날짜 + 시작 시간**(또는 날짜만), **메모(description)**.  
추가 메타는 DB에 JSON/컬럼으로 저장.

### 1.3 DB 스키마 변경 (neon-schema.sql / 마이그레이션)

**옵션 A – 기존 category 값 매핑 + 메타 컬럼**
- `category` enum 확장: `'education'|'vacation'|'hq'|'etc'` → `'dealer'|'internal'|'personal'|'leave'|'etc'`
  - 기존 데이터: `education`→`dealer`, `vacation`→`leave`, `hq`→`internal`, `etc`→`etc` (마이그레이션 스크립트)
- `schedules` 테이블에 선택 컬럼 추가:
  - `dealer_name` text (대리점명)
  - `location` text (장소)
  - `instructor` text (교육자)
  - `target_audience` text (대상자)
  - `manager_name` text (매니저명, 월차용)
- **등록 규칙 완화**: `end_at` 없으면 `end_at = start_at` 또는 당일 23:59:59로 설정. **제목만 필수**.

**옵션 B – 메타 JSONB 한 컬럼**
- `meta` jsonb default '{}'
- 키: `dealerName`, `location`, `instructor`, `targetAudience`, `managerName` 등

권장: **옵션 A** (쿼리/인덱스/타입 단순, 기존 코드 수정량 적음).

### 1.4 API 변경

- **POST /api/schedules**
  - 필수: `title`, `startAt` (또는 `date` + `startTime` 조합)
  - 선택: `endAt`(없으면 `startAt`과 동일 또는 당일 끝으로), `category`, `description`, `dealerName`, `location`, `instructor`, `targetAudience`, `managerName`
  - 검증: `title`만 있어도 등록 가능. `endAt` 없으면 서버에서 `endAt = startAt` 처리.

- **GET /api/schedules**
  - 응답에 `dealer_name`, `location`, `instructor`, `target_audience`, `manager_name` 포함 (엔진/라우트에서 select 추가).

- **PATCH /api/schedules/[id]**
  - 위 메타 필드 수정 가능하도록 body/엔진 확장.

---

## 2. 일정 등록 UI (Admin 일정 추가)

### 2.1 진입점
- 우측 패널 **「일정추가」** 클릭 → `/admin/schedules` (기존 유지).

### 2.2 캘린더 설정·자동완성
- **제목(일정명)** 입력란에 **자동완성**:
  - 같은 지점(branch)에서 기존에 등록한 **title** 목록을 GET /api/schedules 등으로 조회 후, 제목 문자열 리스트로 저장.
  - 입력 시 해당 리스트 기반 **datalist** 또는 자동완성 드롭다운 추천 (예: "대리점 교육").
- 구현: `app/admin/schedules/page.tsx`에서 기존 일정 로드 시 `titles = schedules.map(s => s.title)` 등으로 추출, 제목 input에 `<datalist id="schedule-titles">` 또는 소규모 autocomplete 컴포넌트 연결.

### 2.3 카테고리 선택 + 동적 폼
- 상단에 **카테고리 선택** (라디오 또는 셀렉트): 대리점일정, 사내일정, 개인일정, 월차, 기타.
- **카테고리별로 표시할 입력 필드만** 노출:
  - **대리점**: 일정명, 날짜, 시작 시간, 대리점명, 장소, 교육자, 메모
  - **사내**: 일정명, 날짜, 시작 시간, 대상자, 장소, 메모
  - **개인**: 일정명, 날짜, 시작 시간, 장소, 메모
  - **월차**: 일정명(선택), 날짜, 매니저명
  - **기타**: 일정명, 날짜, 시작 시간(선택), 메모
- **종일 설정·종료 시간 제거**: 시작 시간만 선택. 종료 시간 입력란 제거. (서버에서 `endAt = startAt` 또는 당일 23:59 처리.)

### 2.4 등록 규칙
- **제목만 입력되어 있어도 일정 등록 가능** (날짜/시간은 기본값: 당일 00:00 또는 현재 시각 등).
- 버튼/유효성: 제목이 비어 있지 않으면 「일정 등록」 버튼 활성화. 기존 EclipseButton + Admin 스타일 유지.

### 2.5 UI 일관성
- `AdminPageHeader`, `EclipseButton`, `ADMIN_ERROR_CLASS`, 기존 인풋 스타일(rounded-lg, border-slate-200, focus:ring-primary 등) 그대로 사용.

---

## 3. 우측 패널 표시

### 3.1 리스트 아이템
- **일정명** → `title` (메인 텍스트)
- **sub** → `대상자`(있으면) + `시간`(시작 시간 또는 "종일")
  - 예: `target_audience` + `formatTime(start_at)` 또는 "종일"
  - 월차 등 대상자 없으면 시간만.
- **카테고리별 색상**: 각 일정 카드/칩 좌측 border 또는 배경색을 카테고리 색으로 구분 (위 1.1 표 참고).

### 3.2 클릭 시 상세 보기
- 리스트 항목 클릭 → **상세 모달** 오픈.
- 모달 내용: **전체 일정 내용** (일정명, 카테고리, 날짜/시간, 대리점명/대상자/장소/교육자/매니저명/메모 등 해당 카테고리에 맞게 전부 표시).
- 닫기 버튼 등은 공지 팝업(`NoticePopup`)과 동일한 패턴(EclipseButton, 배경 클릭 시 닫기).

---

## 4. 캘린더 그리드

### 4.1 칩 색상
- `DraggableSchedulePill`(또는 일정 칩 렌더링하는 부분)에 `category` 전달.
- `category` → 색상 매핑 함수로 좌측 border / 배경색 적용 (대리점/사내/개인/월차/기타 5색).

### 4.2 퀵 추가(캘린더 셀 내)
- 기존처럼 제목 + 내용으로 등록 시, **카테고리 기본값** `etc` 유지하거나, 간단한 셀렉트 추가 가능 (플랜에서는 선택 사항).

---

## 5. 구현 순서 제안

1. **DB·엔진·API**
   - `neon-schema.sql` (또는 마이그레이션): `schedules.category` enum 변경, `dealer_name`, `location`, `instructor`, `target_audience`, `manager_name` 컬럼 추가.
   - `src/lib/engines/schedules.ts`: 타입·create·update·list에 메타 필드 반영. `endAt` 없을 때 기본값 처리.
   - `app/api/schedules/route.ts`: POST는 제목+startAt만 필수, endAt 선택. PATCH/GET에 메타 필드 포함.

2. **Admin 일정 등록 페이지**
   - 카테고리 5종 + 카테고리별 동적 폼.
   - 제목 자동완성(datalist 또는 소규모 autocomplete).
   - 종일/종료 시간 제거, 제목만 있어도 등록 가능하도록 유효성 수정.

3. **우측 패널**
   - 일정 리스트: title + sub(대상자, 시간), 카테고리별 색상.
   - 일정 클릭 시 상세 모달 컴포넌트 추가 및 연동.

4. **캘린더**
   - `DraggableSchedulePill` 등에 category 색상 매핑 적용.

5. **통합 테스트**
   - 대리점/사내/개인/월차/기타 각각 등록 → 리스트/캘린더 색상·상세 보기 확인.
   - 제목만 입력 후 등록 가능 여부 확인.

---

## 6. 버튼/UI 정리
- 모든 버튼·폼 스타일은 **기존 EclipseButton, Admin 인풋, RightPanel 스타일**을 그대로 따름.
- 새로 추가하는 모달은 **NoticePopup**과 동일한 패턴(오버레이 + 중앙 박스 + EclipseButton 닫기/확인).

이 플랜대로 진행하면 「일정 등록」 진입부터 우측 패널·캘린더까지 요구사항이 반영된다.
