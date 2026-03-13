# GA NEXUS 진행 로그

## 2026-03-12 – 세션 & Admin 온보딩

- Neon에 `sessions` 테이블 추가 및 `auth_users`/`profiles` 스키마 정리 (`login_id` 기준).
- `src/lib/engines/session.ts`에서 세션 생성/조회/종료 유틸 구현 및 `ga_session` HttpOnly 쿠키 발급.
- `app/api/auth/login`에 세션 연동, `app/api/auth/logout` 라우트 추가.
- `middleware.ts`로 로그인 보호(쿠키 없으면 `/login` 리다이렉트) 적용.
- `src/lib/engines/auth.ts`에서 현재 유저 조회 헬퍼(`getCurrentUser`) 추가.
- `app/api/admin/profile` + `app/admin/branch/page.tsx`로 Admin 지점 설정 플로우 구축.

## 2026-03-12 – Admin 초대 코드 관리

- `neon-schema.sql`의 `invite_codes` 테이블을 기반으로, 지점별 초대 코드 발급/조회 API 구현.
- `app/api/admin/invite-codes`:
  - `GET`: 현재 Admin의 `profiles.branch_name` 기준 초대 코드 리스트 반환.
  - `POST`: 지점명을 기반으로 `PREFIX-XXXXXX` 형태의 랜덤 코드 생성 후 저장.
- `app/admin/invite-codes/page.tsx`:
  - 초대 코드 리스트 테이블 + “+ 새 초대 코드 생성” 버튼 UI 구현.
  - 사용 횟수/최대 사용 횟수, 생성 시각, 만료일(있다면)까지 함께 표시.

## 2026-03-12 – 에이전트 온보딩 플로우

- 초대 코드 검증 API: `POST /api/invite/validate` (코드 유효성, 만료, 사용 가능 횟수 체크).
- 에이전트 신청 API: `POST /api/agent/apply`
  - 초대 코드/성함/생년월일/휴대폰 정보를 받아 `auth_users`에 에이전트 계정 생성(초기 PW = 생년월일) 및
    `profiles`에 `role='agent'`, `is_approved=false` 프로필 upsert.
  - 사용된 초대 코드의 `used_count` 증가.
- 온보딩 UI: `app/apply/page.tsx`
  - Step 1: 초대 코드 입력 및 `/api/invite/validate`로 유효성 검사.
  - Step 2: 기본 정보 입력(성함, 자동 지점, 생년월일, 휴대폰 + 개인정보 동의).
  - Step 3: 신청 완료 메시지 및 승인 대기 안내.
- 승인 대기 페이지: `app/pending-approval/page.tsx`
  - 로그인은 되었으나 `is_approved=false`인 에이전트용 안내 화면.

## 2026-03-12 – Admin 승인 대시보드

- 대기 중인 에이전트 조회 API: `GET /api/admin/pending-agents`
  - Admin 본인 지점(`profiles.branch_name`) 기준으로 `is_approved = false` 프로필 목록 반환.
- 승인/거절 API: `POST /api/admin/approvals`
  - body: `{ profileId, action: 'approve' | 'reject' }`. 본인 지점 신청만 처리.
  - 승인: `profiles.is_approved = true`로 갱신.
  - 거절: 해당 `auth_users` 삭제 후 `profiles` 삭제(목록에서 제외, 재신청 가능).
- Admin 승인 페이지: `app/admin/approvals/page.tsx`
  - 승인 대기 목록 테이블, 행별 승인/거절 버튼, 초대 코드 관리 링크.

## 2026-03-12 – 일정 API (Neon schedules 연동)

- `neon-schema.sql`의 `schedules` 테이블을 사용하는 일정 엔진 추가: `src/lib/engines/schedules.ts`
  - 지점별 일정 조회(`listSchedulesForBranch`), 생성(`createSchedule`), 수정(`updateSchedule`), 삭제(`deleteSchedule`) 유틸 구현.
- 일정 REST API:
  - `GET /api/schedules`: 현재 로그인한 유저의 `profiles.branch_name` 기준 일정 리스트 반환, `from`/`to`(ISO 문자열) 쿼리로 기간 필터 지원.
  - `POST /api/schedules`: Admin 전용 일정 생성 API. 제목/시간/카테고리/종일 여부를 받아 `schedules`에 insert.
  - `PATCH /api/schedules/[id]`: Admin 전용 일정 수정 API. 같은 지점(branch)의 일정만 수정 가능.
  - `DELETE /api/schedules/[id]`: Admin 전용 일정 삭제 API. 같은 지점(branch)의 일정만 삭제.

## 2026-03-12 – 엔진/컴포넌트 리팩터링 & UX 통일

- **공통 Admin UI**
  - `app/admin/_components/AdminPageHeader.tsx`: 뒤로가기 버튼 + "GA NEXUS 관리자 설정" + 제목/설명, 선택적 `rightSlot`(예: 초대 코드 관리 링크).
  - `ADMIN_ERROR_CLASS`: 에러 배너 스타일 통일용 상수.
  - 지점 정보 설정(`/admin/branch`), 에이전트 승인(`/admin/approvals`), 일정 관리(`/admin/schedules`)에서 위 컴포넌트·상수 사용.
- **엔진 정리**
  - `src/lib/engines/db.ts`: Postgres 에러 코드 `42P01`(relation does not exist) 상수 및 `isRelationNotFound(err)` 헬퍼 추가.
  - `src/lib/engines/schedules.ts`: `listSchedulesForBranch`에서 `isRelationNotFound` 사용으로 에러 처리·타입 정리.
- **일정 관리 UX**
  - 일정 등록 성공 시 "일정이 등록되었습니다. 메인 캘린더에서 확인할 수 있습니다." 메시지 표시 후 3초 뒤 자동 제거.

## 2026-03-12 – 우측 패널 · 메모 · 공지사항

- **DB 스키마**
  - `branch_memos`: 지점별 메모(작성자, 일시, 내용).
  - `notices`: 공지(제목, 본문, image_url). Admin만 작성.
  - `notice_reads`: 공지별 확인한 사람(profile_id, read_at). UNIQUE(notice_id, profile_id).
- **엔진**
  - `src/lib/engines/memos.ts`: 지점별 메모 목록(날짜 필터), 생성. 작성자명은 profiles 조인.
  - `src/lib/engines/notices.ts`: 최신 공지 조회, ID별 조회, 생성/수정, 읽음 처리, 확인한 사람 목록.
- **API**
  - `GET/POST /api/memos`: 목록(쿼리 `date`), 작성. 같은 지점 로그인 사용자.
  - `GET /api/notices`: 최신 공지 1건(미리보기). `POST`: Admin 전용 공지 작성.
  - `GET/PATCH /api/notices/[id]`: 공지 상세, 수정(Admin).
  - `POST /api/notices/[id]/read`: 확인했어요. `GET /api/notices/[id]/reads`: 확인한 사람 목록.
  - `POST /api/notices/upload`: Admin 전용 이미지 업로드 → `public/uploads/notices/` 저장, URL 반환.
- **우측 패널** (`app/components/RightPanel.tsx`)
  - 상단: 공지사항 박스(텍스트 미리보기). 클릭 시 공지 팝업.
  - 중단: 오늘(TODAY) 일정 리스트 및 세부(시간, 종일, 설명).
  - 하단: 메모 목록(작성자 이름, 작성 일시) + 메모 입력 폼.
- **공지 팝업** (같은 파일 내 `NoticePopup`)
  - 보기: 제목, 본문, 이미지, 확인한 사람(프로필 아이콘, 호버 시 이름·시각, "목록 보기" 클릭 시 드롭다운), "확인했어요" 버튼.
  - Admin: 글쓰기/수정(제목, 본문, 이미지 첨부), 저장.
- 메인 페이지 데스크톱·모바일 우측 패널에 `RightPanel` 연동. 시드 스크립트에 `branch_memos`, `notices`, `notice_reads` 테이블 생성 추가. `public/uploads/` gitignore 추가.

## 2026-03-12 – 우측 패널·캘린더 UX 및 좌측 오버레이

- **우측 패널**
  - 일정추가 버튼을 공지사항 박스 **위**로 이동(세로 배치). 일정추가 → 공지사항 순.
- **드래그 앤 드롭**
  - 일정 드래그 시 `application/json` + `text/plain` 이중 setData로 브라우저 호환성 확보.
  - `CalendarCellDropZone`에서 drop 시 `text/plain` 폴백으로 payload 파싱.
  - `PATCH /api/schedules/[id]`: Next 15+ 대응으로 `params` Promise 처리 (`await params`).
- **캘린더 헤더**
  - "2026년 3월" 제거. **26.03** 형식(YY.MM)을 TODAY 자리(중앙 버튼)에 표시.
  - `CalendarMonthNav` (client): 좌/우 화살표로 전월·다음월 이동. 쿼리 `?year=&month=` 반영.
  - 페이지에서 `searchParams`로 `year`, `month` 읽어 해당 달 캘린더·일정 조회. 클릭 시 해당 달로 이동.
- **서치 이벤트**
  - 가로폭 약 30% 감소: `w-64` → `w-44 max-w-[180px]`.
- **좌측 패널 오버레이**
  - `DesktopShell` (client): 좌측 패널을 **기본 숨김**, 클릭 시 캘린더를 **가리며** 옆으로 슬라이드 인(오버레이).
  - 캘린더 좌측 상단에 **3단 바(햄버거)** 아이콘 추가. 클릭 시 좌측 패널 토글.
  - 좌측 패널 숨김 시 해당 공간은 **메인 캘린더가 확장**되어 사용.
- **기타**
  - 우측 패널 "오늘 일정"은 **실제 오늘 날짜** 기준으로만 표시(다른 달 보기 시 빈 목록).
  - `isToday` 계산 시 표시 중인 연·월과 실제 오늘 날짜 비교하도록 수정.

## 2026-03-12 – 날짜 선택·캘린더 DnD·좌측패널 닫기·월~금만 표시

- **날짜 클릭 → 우측 패널**
  - 캘린더 셀 클릭 시 URL에 `date=YYYY-MM-DD` 반영. 우측 패널에 **해당 날짜 일정** 표시.
  - `searchParams.date`로 선택 날짜 유지. 선택 없으면 오늘(현재 달일 때) 또는 빈 목록.
  - 우측 패널 제목: "오늘의 일정" 또는 "YYYY년 M월 D일 일정" (선택 날짜에 따라).
- **캘린더에서 드래그 앤 드롭**
  - `DraggableSchedulePill`: 그리드 내 일정 칩을 Admin이 드래그 가능.
  - `CalendarGridClient`: 날짜 클릭 처리 + 그리드/헤더 렌더. 캘린더 셀에서도 일정 드래그 후 다른 날짜 셀에 드롭 시 날짜만 변경 (기존 DropZone 로직 재사용).
- **좌측 패널 자동 닫기**
  - 패널 열린 상태에서 **백드롭**(반투명 영역) 클릭 시 닫기.
  - 패널 **밖으로 마우스 나감**(`onMouseLeave`) 시에도 자동 닫기.
- **토·일 숨김, 월~금 5열**
  - 모든 캘린더(데스크톱·모바일)에서 **일·토 숨김**. **월~금만** 5열 그리드로 표시.
  - 해당 월의 월~금만 `daysToShow`로 계산, 첫 주 빈 칸 오프셋 후 5열 배치. 빈 공간은 셀 확장.
- **기타**
  - `eventsByDateStr`로 날짜별 일정 맵 구성. 우측 패널에 선택 날짜(또는 오늘) 일정 전달.
  - 모바일 우측 패널에도 동일하게 선택 날짜/일정 반영.

## 2026-03-12 – 드래그앤드롭 날짜 보정 · 선택 날짜 테두리

- **드래그 앤 드롭 날짜가 한 칸 밀리던 문제**
  - 원인: 날짜를 UTC 기준(`YYYY-MM-DDT00:00:00.000Z`)으로만 처리해 타임존에 따라 로컬 날짜가 하루 밀림.
  - `CalendarCellDropZone.tsx`: 드롭한 셀의 `dateISO`를 로컬 연·월·일로 파싱 후, **로컬 시간**으로 `new Date(y, m-1, d, ...)` 생성. 종일 일정은 해당 로컬 날짜 00:00~23:59:59.999를 `toISOString()`으로 저장. 시간 지정 일정은 기존 `start_at`/`end_at`의 **로컬** 시·분·초를 새 로컬 날짜에 적용 후 저장.
  - `app/page.tsx`: 셀의 `dateISO`를 **로컬 날짜** 문자열로 생성 (`c.day` 기준 `YYYY-MM-DD`). `eventsByDateStr` 키도 일정의 **로컬** 날짜(`getFullYear/getMonth/getDate`)로 통일. 셀 클릭 시 URL `date`와 우측 패널·일정 목록이 같은 로컬 날짜 기준으로 맞도록 수정.
- **다른 날짜 클릭 시 TODAY / 선택 날짜 테두리**
  - `CalendarGridClient`에 `selectedDateStr`, `todayStr` props 추가.
  - 빨간 테두리: **선택된 날짜** 셀(`cell.dateISO === selectedDateStr`) 또는, 오늘이면서 “선택된 날짜가 없거나 오늘인 경우”에만 적용.
  - 다른 날짜를 클릭하면 TODAY 셀은 기본(회색) 그리드로, 클릭한 날짜 셀만 빨간 테두리로 표시.
  - 데스크톱·모바일 그리드 모두 `selectedDateStr`, `todayStr` 전달.

## 2026-03-12 – 전역 폰트 통일 (Pretendard / Plus Jakarta Sans)

- **적용 원칙**
  - **캘린더 섹션의 달력 숫자 파트**: **Plus Jakarta Sans** (플러스 자카르타 산스)
  - **나머지 모든 공간**: **Pretendard** (프리텐다드)
- **구현**
  - `app/globals.css`: 폰트 로드(Pretendard Variable jsDelivr, Plus Jakarta Sans Google Fonts)를 `@import "tailwindcss"` 위에서 수행. `@theme`에 `--font-sans`(Pretendard), `--font-calendar`(Plus Jakarta Sans) 정의. `body { font-family: var(--font-sans); }` 적용.
  - `app/layout.tsx`: body에 `font-sans` 적용.
  - `CalendarGridClient.tsx`: 요일 헤더 그리드·날짜 셀 숫자 span에 `font-calendar` 적용.
  - `CalendarMonthNav.tsx`: 달 라벨(26.03) 버튼에 `font-calendar` 적용.

## 2026-03-13 – 일정 카테고리 UX 확장 (색상, 우측 패널, 등록 폼)

- **캘린더 카테고리 색상**
  - `DraggableSchedulePill.tsx`: `ScheduleItem`에 `category` 필드를 추가하고, `dealer/internal/personal/leave/etc`별로 좌측 보더·배경색을 다르게 적용하는 `CATEGORY_CLASSES` 매핑 추가.
  - `CalendarGridClient.tsx`: 일자 셀에 렌더되는 일정 칩에 `category`를 함께 전달해 카테고리별 색상이 적용되도록 변경.
- **우측 패널 리스트/상세 구조 준비**
  - `RightPanel.tsx`: `todaySchedules`의 타입을 새 카테고리(`dealer/internal/personal/leave/etc`)와 메타 필드(`dealer_name/location/instructor/target_audience/manager_name`)를 포함하도록 확장하고, 리스트 아이템을 카테고리별 색상(border-l-4 색상)과 `title + sub(대상자/교육자/장소/월차 · 시간/종일)` 형식으로 재구성.
  - `app/page.tsx`: `RightPanel`으로 넘기는 일정 객체에 카테고리와 메타 필드(있을 경우)를 함께 전달하도록 매핑 로직 수정.
- **Admin 일정 등록 폼 – 카테고리별 필드/라벨**
  - `app/admin/schedules/page.tsx`: 카테고리를 1행 라디오형(칩 스타일)으로 배치하고, 대리점/사내/개인/월차/기타별로 다른 입력 필드 세트를 노출.
  - 대리점 일정일 때 상단 제목 라벨을 `대리점명`으로 표시하고, 월차일 때는 `매니저명`으로 표시(하단 별도 매니저명 필드는 제거).
  - 제목, 날짜 라벨 옆에 작은 레드 텍스트 `**필수`를 추가해 필수 필드 시각적으로 표시.

## 2026-03-13 – 매니저 리스트 좌측 패널 연동

- `src/lib/engines/managers.ts`: 지점별 매니저(또는 관리자) 목록을 조회하는 `listManagersForBranch(branchName)` 유틸 추가. `profiles` 테이블에서 `branch_name`과 `role in ('admin','manager')` 기준으로 조회.
- `app/api/admin/managers/route.ts`: Admin 전용 매니저 리스트 API(`GET /api/admin/managers`) 구현. 현재 로그인한 Admin의 `profiles.branch_name` 기준으로 매니저 목록 반환.
- `app/components/BranchMembersCard.tsx`: 좌측(모바일) `Branch Members` 섹션을 실제 매니저 데이터로 렌더링하는 카드 컴포넌트 추가. 로딩/에러/빈 상태 처리 포함.
- `app/page.tsx`: 모바일 섹션의 기존 더미 `Branch Members` 카드(Sarah Chen 등)를 `BranchMembersCard`로 교체하여, 등록된 매니저가 좌측 패널에서 바로 보이도록 변경.

## 2026-03-13 – Admin 최초 로그인 온보딩 멀티스텝 UI

- `app/components/OnboardingShell.tsx`: 멀티스텝 온보딩 공통 셸 컴포넌트 추가. 상단 스텝 인디케이터·프로그레스 바, 중앙 카드 컨텐츠, 하단 이전/다음/시작하기 버튼을 포함하며 framer-motion으로 단계 전환 애니메이션 적용.
- `app/admin/onboarding/page.tsx`: Admin 최초 로그인용 3단계 온보딩 페이지 구현.
  - Step1: 이름/지점 입력 후 `/api/admin/profile`로 저장.
  - Step2: `/api/admin/invite-codes`를 호출해 초대코드 생성 및 카드 내 표시.
  - Step3: 설정 요약(이름/지점/초대코드) 안내 후 “캘린더로 이동” 버튼으로 `/`로 이동.

## 2026-03-13 – 초대코드 온보딩(/apply) 멀티스텝 리디자인

- `app/apply/page.tsx`: 기존 단일 카드 3단계 UI를 `OnboardingShell` 기반 3스텝 온보딩으로 리팩터링.
  - Step1: 초대코드 입력 후 `/api/invite/validate`로 검증, 지점명(branchName) 확인.
  - Step2: 성함·자동 지점·생년월일·휴대폰·매니저 코드 + 개인정보 동의 입력 후 `/api/agent/apply`로 제출.
  - Step3: 승인 대기 안내(“승인이 되면 접속이 가능합니다” 메시지) 화면 표시.

## 2026-03-13 – 우측 패널 일정 상세 팝업

- `app/components/RightPanel.tsx`: 오늘/선택 날짜 일정 리스트 아이템을 클릭하면 카테고리별 세부 정보(교육자, 장소, 대상자, 월차 안내 등)와 전체 메모를 볼 수 있는 `ScheduleDetailPopup` 모달을 띄우도록 구현.
  - 리스트 카드는 버튼으로 변경되어 클릭 시 `selectedSchedule` 상태를 설정하고, 별도의 오버레이 팝업에서 일정 시간 구간(종일 여부 포함)과 카테고리별 필드를 표시.
