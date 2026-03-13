## GA NEXUS 온보딩 플로우 리디자인 플랜 (Admin / 초대코드 진입)

### 1. 목표

- **Admin 최초 로그인 플로우**를 멀티스텝 온보딩 UI로 재구성해,  
  이름·지점 설정 → 초대코드 생성 → 캘린더 진입까지 한 번에 안내.
- **초대코드로 들어오는 에이전트 플로우**를 같은 디자인 톤(멀티스텝 카드 + 프로그레스 바)으로 통일.
- shadcn + Tailwind + framer-motion 스타일의 `OnboardingForm` 패턴을 GA NEXUS에 맞게 경량화하여 재사용.

---

### 2. 현재 구조 정리 (요약)

- Admin:
  - `/login` → 세션 생성 →  
    **최초 로그인 시** `/admin/branch`(지점 설정)으로 리다이렉트 →  
    `/admin/invite-codes`에서 초대코드 생성 →  
    `/`(캘린더) 진입.
- 에이전트:
  - `/apply` 페이지에서 초대코드 검증 → 기본 정보 입력 → 신청 완료/승인 대기.

이 흐름은 기능적으로는 분리되어 있고 UI 일관성이 부족함.  
→ **Admin 최초 로그인 플로우를 하나의 멀티스텝 온보딩 카드로**,  
→ `/apply`도 동일한 카드 패턴으로 정리.

---

### 3. UI/컴포넌트 설계 (멀티스텝 온보딩 기반)

#### 3.1 공통 멀티스텝 셸 컴포넌트

- 파일 위치:
  - `app/components/OnboardingShell.tsx` (또는 `app/components/ui/onboarding-shell.tsx`)
- 역할:
  - 상단 **step indicator + progress bar** (framer-motion 애니메이션).
  - 중앙 **Card** 컨테이너 (shadcn Card 스타일 참고).
  - 하단 **Back / Next / 완료(시작하기)** 버튼 row.
- props (예시):
  - `steps: { id: string; title: string }[]`
  - `currentStep: number`
  - `onStepChange: (idx: number) => void`
  - `onNext: () => void`
  - `onPrev: () => void`
  - `onSubmit?: () => void`
  - `isSubmitting?: boolean`
  - `isNextDisabled?: boolean`
- 내부는 제공해준 `OnboardingForm` 구조에서 **필요한 부분만 추출**:
  - framer-motion의 `AnimatePresence` / `motion.div` 기반 step 전환 애니메이션.
  - `cn` 유틸은 이미 `src/lib/utils.ts`에 있으므로 재사용.

#### 3.2 Admin 최초 로그인 온보딩 폼

- 경로: `app/admin/onboarding/page.tsx` (또는 `/admin/first-login`).
- 스텝 구성:
  1. **기본 정보 입력**  
     - 필드: 이름 (`full_name`), 지점명(`branch_name`)  
     - 완료 시 `/api/admin/profile` 또는 `/api/admin/branch`에 patch/생성.
  2. **초대코드 생성**  
     - 서버에서 지점명 기반 초대코드 자동 생성 API 호출: `POST /api/admin/invite-codes`  
     - 코드 문자열과 사용법을 카드 내에 표시 (복사 버튼 포함).
  3. **시작하기**  
     - 간단한 안내 문구 + “시작하기” 버튼 → `/`(캘린더)로 `router.push("/")`.

- UX 디테일:
  - 각 step은 `OnboardingShell`의 Card 내부 `CardHeader / CardContent / CardFooter` 구조로 구현.
  - 필수 입력은 Label 옆에 작은 레드 텍스트 `**필수` 패턴 재사용.
  - API 에러는 카드 상단에 작은 에러 배너(기존 `ADMIN_ERROR_CLASS` 스타일 참고)로 노출.

#### 3.3 초대코드 진입(에이전트) 온보딩 폼

- 경로: 기존 `/apply`를 리팩터링.
- 스텝 구성:
  1. **초대코드 입력**  
     - 필드: 초대코드.  
     - `POST /api/invite/validate` 호출. 성공 시 다음 스텝으로 이동.  
     - 실패 메시지는 카드 내부에 표시.
  2. **기본 정보 입력**  
     - 필드: 이름, 자동 지점(초대코드에서 채워줌 또는 텍스트), 휴대폰, 매니저 코드.  
     - 개인정보 동의 체크박스(기존 플로우 유지).  
     - 제출 시 `POST /api/agent/apply`.
  3. **승인 대기 안내**  
     - “승인이 되면 접속이 가능합니다” 텍스트 +  
       현재 지점명/매니저명/연락처 일부 등 요약 정보 표시.

- UI:
  - 같은 `OnboardingShell` 컴포넌트 재사용 (steps/validation만 다름).
  - 버튼 레이블:
    - Step1/2: “다음”
    - 마지막 Step3: “완료” or “확인”.

---

### 4. 라우팅 & 리다이렉트 설계

#### 4.1 Admin 최초 로그인 감지

- `middleware.ts` 또는 `app/api/auth/login` 응답에서:
  - 로그인 성공 후 현재 프로필에서:
    - `role === "admin"` 이고
    - `full_name` 또는 `branch_name`이 비어 있으면  
      → `/admin/onboarding`으로 `redirect`.
- 이후 온보딩이 끝나면:
  - 프로필에 `full_name` / `branch_name` 저장 완료 시  
    - `/admin/onboarding` 완료 스텝에서 “시작하기” 클릭 시 `/`로 이동.

#### 4.2 에이전트 초대코드 진입

- 기존 `/apply`는 유지하되:
  - 새 멀티스텝 UI로 전면 교체.
  - 성공 시 `/pending-approval`로 이동 (기존 플로우와 동일).

---

### 5. 구현 상세 플랜 (단계별)

#### 5.1 준비 및 의존성

- 이미 Tailwind / TypeScript / lucide-react / cn 유틸 존재 확인.
- 추가 확인:
  - `framer-motion`는 이미 설치되어 있음 (`package.json`에 있음).
  - shadcn 방식 컴포넌트:
    - `Button`, `Card`, `Input`, `Label`, `RadioGroup`, `Checkbox`, `Select`, `Textarea`는 현재 코드베이스에서 유사 스타일의 `EclipseButton`·폼 인풋이 있으나, 새 온보딩에서는 **기존 디자인 톤에 맞추되 필요 최소한만 참고**:
      - 버튼은 `EclipseButton`(또는 기존 버튼) 재사용.
      - Card/Label/Input 등은 현재 Admin UI에서 사용하는 스타일 클래스 조합으로 구현 (shadcn 코드를 그대로 다 들여오지 않고, 필요한 유틸만 참조).

> 결론: shadcn CLI 전체 셋업 대신, 제공된 샘플 코드를 **디자인 레퍼런스**로만 보고, GA NEXUS 기존 컴포넌트(EclipseButton, AdminPageHeader, globals.css 테마)를 그대로 활용.

#### 5.2 공통 OnboardingShell 컴포넌트 생성

1. `app/components/OnboardingShell.tsx` 생성.
2. props에 steps, currentStep, navigation 핸들러 정의.
3. 상단 프로그레스 바 + step indicator, 중앙 children 슬롯, 하단 버튼 영역 구현.
4. framer-motion `AnimatePresence`/`motion.div`로 step 전환 애니메이션 추가.

#### 5.3 Admin 온보딩 페이지 구현

1. `app/admin/onboarding/page.tsx` 생성 (`"use client"`).
2. 내부에서:
   - steps: `[{id:"profile", title:"기본 정보"}, {id:"invite", title:"초대코드"}, {id:"done", title:"시작하기"}]`.
   - 상태:
     - `fullName`, `branchName`, `inviteCode`, `inviteGenerating`, `error`, `submitting`.
3. Step 별 UI:
   - Step1: 이름/지점명 인풋 + “다음” (유효성: 둘 다 비어있지 않아야).
   - Step2: 초대코드 자동 생성 버튼 + 생성된 초대코드 표시/복사.
   - Step3: 안내 문구 + “시작하기(캘린더로 이동)” 버튼 (`router.push("/")`).
4. API 연동:
   - Step1 완료 시 `/api/admin/profile` 또는 `/api/admin/branch` 호출로 프로필/지점 저장.
   - Step2에서 `/api/admin/invite-codes` POST로 코드 생성.

#### 5.4 에이전트 온보딩(/apply) 리팩터링

1. 기존 `app/apply/page.tsx` 내용을 백업 후, 멀티스텝 구조로 재구성.
2. steps:
   - `[{id:"code", title:"초대코드 입력"}, {id:"info", title:"기본 정보"}, {id:"done", title:"신청 완료"}]`.
3. Step1:
   - 초대코드 인풋 + “다음” 버튼 → `/api/invite/validate` 호출.
4. Step2:
   - 이름, 자동 지점명, 휴대폰, 매니저 코드, 개인정보 동의 체크.
   - “신청하기”로 `/api/agent/apply` 호출.
5. Step3:
   - “승인이 되면 접속이 가능합니다” 멘트 + 간단 요약.

---

### 6. 진행시 프로그래스 기록 규칙

- 실제 구현을 시작할 때마다 `.doc/GA_NEXUS_PROGRESS.md`에 섹션 추가:
  - 날짜 + 제목 (예: `2026-03-13 – 온보딩 멀티스텝 UI`).
  - Bullet로 어떤 라우트/컴포넌트가 추가·수정되었는지 간단 정리.

- 예시 기록 포맷:

> - `app/components/OnboardingShell.tsx` 추가 – 멀티스텝 카드/프로그레스 공통 컴포넌트  
> - `app/admin/onboarding/page.tsx` – Admin 최초 로그인용 3단계 온보딩 플로우 구현  
> - `app/apply/page.tsx` – 초대코드/정보입력/완료 3단계로 UI 리디자인

