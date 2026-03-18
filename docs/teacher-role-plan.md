### Teacher / Instructor Role Plan

이 문서는 **교육자(진행자) 역할 관리 및 일정 색상 연동**을 위한 설계·구현 계획입니다.

---

### 1. 데이터 모델 / DB 설계

- **profiles 테이블 확장**
  - `is_instructor boolean` : 교육자 여부 플래그 (기본값 false)
  - `instructor_color text` : 교육자 대표 색상 (예: `#2563eb`, `#fbbf24`)
- **마이그레이션 전략**
  - Neon 스키마에는 직접 마이그레이션 필요.
  - 애플리케이션 레벨에서는 `isColumnNotFound` 패턴 활용:
    - 컬럼이 없을 경우에도 기존 로직이 깨지지 않고, 단순히 교육자 기능만 비활성화되도록 처리.

---

### 2. API 레이어 설계

- **`/api/admin/managers` 확장**
  - `GET /api/admin/managers`
    - 응답 `Member` 타입에 아래 필드 추가:
      - `is_instructor: boolean`
      - `instructor_color: string | null`
  - `PATCH /api/admin/managers` (또는 동일 라우트에서 서브 액션 처리)
    - 요청 바디 예시:
      - `{ memberId, isInstructor, instructorColor }`
    - 역할:
      - 특정 프로필의 `is_instructor`, `instructor_color` 를 업데이트.
- **엔진 레이어 함수**
  - `src/lib/engines/tenant.ts` 또는 별도 엔진 모듈에 유틸 추가:
    - `setInstructorForProfile({ profileId, isInstructor, instructorColor })`
    - `listInstructorsForBranch({ branchName })` : 활성화된 교육자 목록 조회용.

---

### 3. 멤버 관리 UI (교육자 관리)

- **대상 파일**
  - `app/admin/members/page.tsx`

- **UI 변화**
  - 각 멤버 행 오른쪽에:
    - **교육자 토글 버튼 + 색상 뱃지** 추가.
      - 기본 상태: 회색 아이콘 (교육자 아님)
      - 활성 상태: 선택된 색상을 나타내는 작은 원형 뱃지 + 교육자 아이콘
  - 버튼 클릭 시 작은 팝업/모달:
    - 상태 1: 교육자 아님
      - 체크박스(교육자 활성화)
      - 색상 선택 (프리셋 + 컬러 피커)
      - [저장] 버튼
    - 상태 2: 이미 교육자
      - 현재 색상 표시
      - 색상 수정 UI
      - “교육자에서 제외” 버튼
      - [저장] 버튼
  - 저장 시:
    - `/api/admin/managers` PATCH 호출 → `is_instructor`, `instructor_color` 업데이트
    - 로컬 상태 `members` 갱신

---

### 4. 일정 데이터와 교육자 연결

- **기존 구조**
  - `schedules` 테이블에 `instructor text` 컬럼 존재.
  - 현재는 주로 수동 문자열 기반(예: `"최훈서"`, `"안지현"`)으로 사용 중.

- **연결 방식**
  - 일정 조회 시:
    - `schedules.instructor` 와 `profiles.full_name` 를 매핑.
    - `profiles.is_instructor = true` 인 레코드에서
      - `full_name` 이 `schedules.instructor` 와 일치하면
      - 해당 프로필의 `instructor_color` 를 가져와 함께 반환.
  - 구현 위치:
    - `src/lib/engines/schedules.ts` 의 조회 함수에서:
      - `profiles` 와 `left join` 하여 `instructor_color` (예: `p_instructor_color`) 를 가져오도록 확장.
      - 컬럼이 없을 경우(`isColumnNotFound`)에는 기존 로직으로 폴백.
  - 애플리케이션 레벨 타입:
    - `ScheduleRow` 또는 확장 타입에
      - `instructor_color?: string | null` 필드 추가.

---

### 5. 색상 적용 규칙

- **우선순위**
  1. `instructor_color` (교육자 색상) 가 존재하면 최우선 사용.
  2. 없으면 기존 카테고리 색상(`dealer/internal/personal/leave/etc`) 사용.

- **변경 대상 컴포넌트**
  - `DraggableSchedulePill`
    - 현재: `instructor === "최훈서"/"안지현"` 기준으로 색 결정.
    - 변경:
      - `schedule.instructor_color` 우선 → 없으면 기존 CATEGORY 색상.
      - 텍스트 포맷: `일정 / 교육자 / 시간`.
  - `RightPanel` (우측 일정 리스트)
    - `colorClass` 계산 시:
      - `schedule.instructor_color` 우선 반영.
      - 없으면 기존 카테고리 색상 유지.
  - `MobileCalendarShell` (모바일 상세 리스트)
    - 동일하게 `instructor_color` 우선 적용.

- **기존 하드코딩(최훈서/안지현) 처리**
  - 초기 단계:
    - 이 두 사람의 `profiles` 레코드에
      - `is_instructor = true`
      - `instructor_color = (파랑/노랑)` 을 기본값으로 설정.
  - 색상 결정 로직에서는 더 이상 이름 비교를 하지 않고,
    - 오직 `instructor_color` 값만 사용하도록 리팩터링.

---

### 6. 일정 추가 / 수정 UI 확장

- **일정 추가 (`ScheduleAddScheduler`)**
  - 현재: `dealer` 카테고리일 때 진행자(최훈서/안지현)를 하드코딩된 버튼으로 선택.
  - 변경:
    - 서버에서 **활성화된 교육자 목록**(이름 + 색상)을 불러와 상태에 저장.
    - UI:
      - 교육자 섹션에서 `is_instructor = true` 인 프로필만 버튼/체크로 표시.
      - 선택 시 `instructor` 필드에 해당 교육자의 `full_name` 설정.
    - 저장 시:
      - `POST /api/schedules` 바디에 `instructor` 포함.

- **일정 수정 (`ScheduleDetailPopup`)**
  - 상단에 “시간 수정” 또는 “일정 시간/날짜 변경” 버튼:
    - 클릭하면 모달/섹션 내에 mini 캘린더 + 시간 선택 UI 표시.
    - 변경 후 [저장] 시 `PATCH /api/schedules/[id]` 로 `startAt`, `endAt`, `isAllDay` 갱신.
  - 진행자 체크 UI:
    - 현재 설정된 `instructor` 를 기준으로 버튼 선택 상태 표시.
    - 다른 교육자로 변경 가능, 또는 “교육자 미지정” 옵션 제공.
    - 저장 시 `instructor` 필드 포함해서 PATCH 전송.

---

### 7. 단계별 구현 순서

1. **DB 컬럼 및 엔진 레이어 준비**
   - `profiles.is_instructor`, `profiles.instructor_color` 컬럼을 사용하는 코드 추가 (`tenant` 엔진, `isColumnNotFound` 대응).
2. **`/api/admin/managers` 확장 및 프로필 업데이트 함수 구현**
3. **멤버 관리 UI에 교육자 토글 + 색상 선택 팝업 추가**
4. **`schedules` 조회 시 `instructor_color` 조인 및 타입 확장**
5. **DraggableSchedulePill / RightPanel / MobileCalendarShell 에 색상 로직 통합 (`instructor_color` 기준)**
6. **ScheduleAddScheduler 를 동적 교육자 목록 기반으로 변경**
7. **ScheduleDetailPopup 에 시간 수정 + 교육자 선택 UI 추가 및 PATCH 확장**

이 순서대로 구현하면,
1) 멤버 단위로 교육자/색상을 관리하고,  
2) 일정 단위에서 교육자를 선택하며,  
3) 캘린더/리스트에서 교육자 색상이 일관되게 반영되는 구조를 완성할 수 있습니다.

지금 상태를 정확히 정리하면 이렇게입니다.

새로 추가하는 dealer 일정에서, 일정 추가 폼의 진행자(최훈서/안지현)를 선택하면:
DB의 instructor 필드에 그 이름이 들어가고,
캘린더에서는 일정 / 진행자 / 시간 형식 + 진행자 색(파랑/노랑)으로 표시되도록 이미 연결해 둔 상태입니다.
문제 구간은:
(1) 예전에 만든 일정들 → instructor 가 비어 있고 creator_full_name 만 있어서, 여전히 “최훈서”가 노출되는 경우
(2) “수정 화면에서 진행자를 바꾸는 UI”가 아직 없기 때문에, 기존 일정의 진행자를 안지현으로 바꿨다고 생각해도 실제로는 instructor 값이 안 바뀌고 있는 경우입니다.
지금 막 정리한 teacher-role-plan.md 기준으로, 멤버 관리에서 교육자를 지정하고, 그 색을 기준으로 일정 추가/수정·캘린더 표시가 완전히 일치하도록 만드는 전체 기능을 이제부터 단계별로 구현해 나갈 예정입니다. 그 과정을 거치면 “안지현 선택 → 최훈서로 나오는” 혼선 없이, 교육자·색상·일정이 모두 한 소스로 관리되게 됩니다.