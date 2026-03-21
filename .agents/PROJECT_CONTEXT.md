# 🧠 GA_NEXUS 프로젝트 컨텍스트 (누적 기억)

> 에이전트가 작업 완료 시 자동 갱신. 모든 에이전트는 작업 전 반드시 이 파일을 읽는다.

---

## ⚠️ 가장 중요한 사실들 (먼저 읽기)

1. **환경변수 이름은 `NEON_DATABASE_URL`** — `DATABASE_URL` 아님. 틀리면 DB 연결 안 됨
2. **스키마가 3개** — `public`, `t_121202730`, `t_319000430`. 컬럼 추가 마이그레이션은 **3개 스키마 모두** 실행해야 함. `public`에만 하면 tenant 스키마에서 쿼리 실패
2. **DB 쿼리는 `query()` 헬퍼 함수 사용** — `pool` 직접 안 씀. `src/lib/engines/db.ts`에서 import
3. **인증은 `getCurrentUser()`** — `is_approved` 직접 체크 안 함. 이 함수가 세션+프로필 한번에 반환
4. **세션 쿠키 이름: `ga_session`** — middleware도 이걸 체크함
5. **RightPanel.tsx는 1315줄** — 건드릴 때 매우 신중하게. 전체 읽고 수정할 것
6. **VAPID 키는 이미 생성 완료** — .env.local + Vercel 환경변수 등록 필요. web-push 패키지 설치됨
7. **푸시 API 예외**: `app/api/push/`, `app/api/cron/` 경로는 `getCurrentUser()` 대신 `cookies()` + Pool 직접 사용 (기술 부채, 추후 통일 예정)

---

## 📐 확립된 코드 패턴

### DB 연결 (실제 패턴)
```typescript
// ✅ 이렇게 써라
import { query } from "@/src/lib/engines/db";
const rows = await query<MyType>(
  "SELECT * FROM public.schedules WHERE branch_name = $1",
  [branchName]
);

// ❌ 이렇게 쓰지 마라 (Pool 직접 import)
import { pool } from "@/src/lib/engines/db";
const { rows } = await pool.query(...);
```

### API Route 인증 (실제 패턴)
```typescript
// ✅ 모든 API route는 이 패턴으로 시작
import { getCurrentUser } from "@/src/lib/engines/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 });
  }
  // user.role, user.profile.branch_name, user.profile.id 사용 가능
}
```

### 컴포넌트 패턴 (실제 구조)
```typescript
// 클라이언트 컴포넌트: memo + Base 패턴 사용
const MyComponent = memo(MyComponentBase);
export default MyComponent;
function MyComponentBase({ ...props }) { ... }

// EclipseButton — 프로젝트 전용 버튼 (shadcn Button 아님)
import { EclipseButton } from "@/app/components/ui/EclipseButton";
<EclipseButton variant="primary" | "outline" | "ghost" | "destructive" size="sm" | "icon" />

// Avatar
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
```

### 스케줄 카테고리 (실제 값)
```typescript
type ScheduleCategory = "dealer" | "internal" | "personal" | "leave" | "etc";
// dealer = 딜러 교육, internal = 내부 교육, personal = 개인, leave = 월차, etc = 기타
```

---

## 🗂️ 실제 파일 구조 & 역할

### 핵심 엔진 (`src/lib/engines/`)
| 파일 | 역할 |
|---|---|
| `db.ts` | Pool 싱글턴 + `query()` 헬퍼. 슬로우 쿼리 경고 포함 |
| `auth.ts` | `getCurrentUser()` — 세션→프로필 한번에 반환 |
| `session.ts` | `createSession()`, `destroyCurrentSession()`, `getCurrentSession()` |
| `schedules.ts` | `createSchedule()`, `listSchedulesForBranch()` |
| `managers.ts` | 매니저 관리 |
| `memos.ts` | 메모 CRUD |
| `notices.ts` | 공지사항 CRUD |
| `tenant.ts` | 테넌트(지점) 관련 |

### 핵심 컴포넌트 (`app/components/`)
| 파일 | 역할 | 크기 |
|---|---|---|
| `CalendarGridClient.tsx` | 캘린더 그리드. memo 적용. 퀵일정 추가 팝업 포함. any 타입 제거 완료 | 433줄 |
| `RightPanel.tsx` | re-export 쉼 (하위 호환용) | 3줄 |
| `right-panel/index.tsx` | RightPanel 메인 | ~150줄 |
| `right-panel/ScheduleDetailPopup.tsx` | 일정 상세/수정/삭제 팝업 | ~280줄 |
| `right-panel/NoticePopup.tsx` | 공지사항 팝업 | ~200줄 |
| `right-panel/ScheduleList.tsx` | 일정 목록 렌더링 | ~100줄 |
| `right-panel/MemoSection.tsx` | 메모 입력+목록 | ~120줄 |
| `right-panel/types.ts` | 공유 타입 + 포맷 유틸리티 | ~90줄 |
| `DraggableSchedulePill.tsx` | 드래그 가능한 일정 pill |  |
| `CalendarCellDropZone.tsx` | 드롭 존 |  |
| `DesktopShell.tsx` | 데스크톱 3패널 레이아웃 쉘 |  |
| `MobileCalendarShell.tsx` | 모바일 전용 쉘 |  |
| `RightPanelCollapseWrapper.tsx` | `useRightPanel()` 훅 제공 |  |

### API Routes (`app/api/`)
| 경로 | 메서드 | 설명 |
|---|---|---|
| `/api/schedules` | GET, POST | 일정 조회/생성 |
| `/api/schedules/[id]` | GET, PATCH, DELETE | 일정 단건 |
| `/api/memos` | GET, POST | 메모 |
| `/api/memos/[id]` | PUT, DELETE | 메모 수정/삭제 |
| `/api/notices` | GET, POST | 공지사항 |
| `/api/auth/login` | POST | 로그인 |
| `/api/auth/logout` | POST | 로그아웃 |
| `/api/auth/profile` | GET | 현재 유저 프로필 |
| `/api/admin/managers` | GET | 매니저 목록 (is_instructor 포함) |
| `/api/admin/approvals` | - | 가입 승인 |
| `/api/agent/apply` | POST | 에이전트 지원 |
| `/api/invite/validate` | POST | 초대코드 검증 |
| `/api/push/vapid-public-key` | GET | VAPID 공개키 반환 |
| `/api/push/subscribe` | POST | 푸시 알림 구독 저장 |
| `/api/push/unsubscribe` | POST | 푸시 알림 구독 해제 |
| `/api/cron/daily-push` | POST | 매일 18시 다음날 일정 자동 발송 (Vercel Cron) |
| `/api/cron/cleanup-push` | POST | 주간 push 구독 정리 (매주 월 02:00 UTC, 30일 이상 레코드 삭제) |
| `/api/admin/push/send` | POST | 어드민 수동 전체 발송 |
| `/api/admin/analytics` | GET | 통계 데이터 (월차추이, 카테고리분포, 교육현황) admin only |
| `/api/schedules/[id]/participants` | GET, POST, DELETE | RSVP 참석 여부 관리 |

---

## 🗄️ 실제 DB 테이블 (public 스키마)

| 테이블 | 주요 컬럼 | 비고 |
|---|---|---|
| `auth_users` | login_id, password_hash, role | 로그인 전용 |
| `profiles` | id, login_id, full_name, branch_name, birth_date, phone_number, is_approved, role | |
| `sessions` | id, user_login_id, expires_at, revoked_at | 세션 관리 |
| `schedules` | id, branch_name, title, description, category, start_at, end_at, is_all_day, creator_profile_id, is_private, recurrence_rule 등 | |
| `invite_codes` | id, code, created_by, is_used, expires_at | |
| `notices` | id, title, body, image_url, created_by | |
| `memos` | id, user_login_id, content, target_date | |
| `schedule_edit_logs` | id, schedule_id, modified_by, changed_fields(jsonb) | 수정이력 |
| `push_subscriptions` | id, user_id FK→profiles, endpoint, p256dh, auth, created_at | UNIQUE(user_id, endpoint). web-push VAPID 구독 정보 |
| `schedule_participants` | id, schedule_id FK→schedules(CASCADE), profile_id FK→profiles(CASCADE), status(attending/declined/tentative), created_at | UNIQUE(schedule_id, profile_id). TASK-018d RSVP 기능 |


---

## 🔐 인증/권한 흐름 (실제 구현)

```
요청
  → middleware.ts: ga_session 쿠키 없으면 /login 리다이렉트
  → PUBLIC_PATHS는 통과: /, /login, /apply, /api/auth/*, /api/invite/*, /api/agent/*
  → API route: getCurrentUser() 호출
      → getCurrentSession(): ga_session 쿠키 → sessions 테이블 검증
      → auth_users + profiles 동시 조회
      → { loginId, role, profile } 반환
  → role 기반 접근 제어 (admin > manager > agent)
```

**주의**: middleware.ts는 `is_approved` 체크 안 함 — 쿠키 존재만 확인.
`is_approved` 체크는 각 페이지/API에서 직접 처리.

---

## 🔗 컴포넌트 의존 관계

```
DesktopShell
  └── CalendarPageClientShell (또는 직접 구성)
        ├── CalendarMonthNav
        ├── CalendarGridClient ← memo(CalendarGridClientBase)
        │     ├── CalendarCellDropZone (드롭존)
        │     ├── DraggableSchedulePill (드래그 pill)
        │     ├── EclipseButton (퀵추가 버튼)
        │     └── ScheduleAddScheduler (일정추가 폼)
        ├── RightPanel ← memo(RightPanelBase) — 1315줄
        │     ├── ScheduleDetailPopup (일정 상세/수정)
        │     ├── NoticePopup (공지 팝업)
        │     ├── ScheduleAddScheduler (일정추가 폼)
        │     └── EclipseButton
        └── LeftPanelBranchMembers
RightPanelCollapseWrapper → useRightPanel() 훅 (setOpen)
MobileCalendarShell → 모바일 전용
OnboardingShell → 가입/승인 플로우
```

### CalendarGridClient 핵심 props
```typescript
cells: CellData[]          // 캘린더 셀 데이터
eventsByDay: Record<string, ScheduleItem[]>  // 날짜별 일정
year, month: number
isAdmin: boolean
columns: 5 | 7             // 주5일 or 주7일
selectedDateStr: string | null
onDateSelect?: (dateISO: string | null) => void
```

### CalendarGridClient 중요 패턴
- `fetchAddMeta()` — 모듈 레벨 캐시 (TTL 5분). 퀵일정 추가 시 유저명+교육자 목록 캐싱
- `notifyCalendarMonthDataChanged()` — 일정 변경 후 캘린더 갱신 신호
- `requestIdleCallback` 으로 워밍업

---

## ⚠️ 알려진 주의사항 / 기술 부채

- RightPanel.tsx → right-panel/ 폴더로 분리 완료 (TASK-015)
- CalendarGridClient `any` 타입 제거 완료 (TASK-015)
- manager-login 경로(`/manager-login`)가 PUBLIC_PATHS에 없어서 미들웨어 이슈 가능성
- 푸시 API (`/api/push/*`, `/api/cron/*`)가 `getCurrentUser()` 대신 `cookies()`+Pool 직접 사용 → 추후 통일 필요
- iOS Safari는 PWA 홈화면 추가 + Safari 17.4+ 이상에서만 Web Push 지원. 구형 iOS는 알림 안 옴
- **반복 일정 v1 한계**: 단일 occurrence 편집 미지원. 수정/삭제 시 해당 원본 recurrence_rule 일정 전체에 적용됨
- **컬럼 추가 시 tenant 스키마 필수**: `ALTER TABLE public.schedules ADD COLUMN ...` 만 하면 `t_121202730`, `t_319000430` 쿼리 실패. 마이그레이션 파일에 3개 스키마 모두 포함할 것
- **PDF 한글 폰트**: `public/fonts/NotoSansKR-Regular.ttf` 없으면 PDF 한글 깨짐 (폰트 파일 배치 필요)
- **expandRecurringSchedules()**: id가 `originalId_YYYYMMDD` 형태 → DB에 없는 가상 ID이므로 수정/삭제 시 원본 ID 파싱 필요
- **recharts/@react-pdf/renderer**: dynamic import 필수 (번들 사이즈, SSR 이슈)

---

## 🚫 하지 않기로 결정한 것들

| 결정 | 이유 |
|---|---|
| ORM 없음 | `query()` 헬퍼로 충분, 복잡도 증가 방지 |
| Supabase Auth 없음 | 자체 세션 구현 (sessions 테이블) |
| `any` 타입 금지 | strict 모드, 단 기존 코드의 any는 점진적 제거 |
| Tailwind v3 혼용 금지 | v4 문법 통일 |

---

## 📋 완료된 작업 이력

| 날짜 | Task ID | 작업 내용 | 주요 변경 | DB 변경 |
|---|---|---|---|---|
| 2026-03-20 | TASK-012 | 관리자 승인 대기 알림 뱃지 | AdminSettingsMenu.tsx — 30초 폴링, 설정 버튼 + 매니저 승인 항목에 빨간 뱃지 | 없음 |
| 2026-03-20 | TASK-013 | PWA 푸시 알림 전체 구현 | sw.js, PushNotificationPrompt, /api/push/*, /api/cron/daily-push, /api/admin/push/send, /admin/push, vercel.json | push_subscriptions 테이블 생성 |
| 2026-03-20 | TASK-014 | 뒤로가기 버튼 통일 | BackButton 신규(back-button.tsx), AdminPageHeader 교체, admin/push에 헤더 추가 | 없음 |
| 2026-03-20 | TASK-015 | RightPanel 분리 + 주간일정 인라인(우측패널) | right-panel/ 폴더 6파일, CalendarPageClientShell 주간일정 토글(w-440 우측슬롯), WeeklyScheduleClient onClose prop | 없음 |
| 2026-03-20 | TASK-016 | 최적화 9종 | lazy load, any제거, next/image, ScheduleList memo, 메모 디바운스, 공지 TTL캐시, cleanup-push cron | 없음 |
| 2026-03-20 | TASK-017 | 나만보기 UI 완성 | ScheduleAddScheduler 상단 [나만보기] 토글 버튼, DraggableSchedulePill fuchsia 컬러+Lock 아이콘, ScheduleList fuchsia 보더+[나만] 뱃지, CalendarGridClient is_private 전달 | schedules.is_private 컬럼(기존 코드에 이미 반영, DB에 없으면 ADD COLUMN IF NOT EXISTS 실행 필요) |
| 2026-03-20 | TASK-017p | 나만보기 pill 스타일 개선 | DraggableSchedulePill: 블랙배경+흰글씨+끝에 노란 자물쇠(yellow-400)로 최종 확정 | 없음 |
| 2026-03-20 | TASK-017b | 나만보기 캘린더 미표시 버그 수정 | month-view.ts CalendarScheduleItem+mapScheduleItem에 is_private 추가(근본원인), ScheduleDetailPopup 헤더 [나만보기] 뱃지 | 없음 |
| 2026-03-21 | TASK-018 | 5개 기능 구현(통계/반복일정/PDF/RSVP/충돌감지) | +16개 파일. analytics.ts, AnalyticsDashboard, CalendarPdfExport, RsvpSection, rrule-helpers, /admin/analytics 페이지, participants API, ScheduleAddScheduler 충돌경고+반복UI, ScheduleDetailPopup RSVP섹션 | recurrence_rule 컬럼(schedules), schedule_participants 테이블 신규 |

---

### WeeklyScheduleClient 인라인 패널 패턴
```typescript
// onClose prop이 있으면 compact 헤더 + "← 캘린더" 버튼 표시
// CalendarPageClientShell에서 showWeekly state로 토글
// 날짜 클릭 시 자동으로 showWeekly = false
<WeeklyScheduleClient onClose={() => setShowWeekly(false)} />
```

### 공지 TTL 캐시 패턴 (right-panel/index.tsx)
```typescript
// 모듈 레벨 5분 캐시. 저장/수정 후 noticeCacheEntry = null로 무효화
let noticeCacheEntry: NoticeCache | null = null;
```

### 나만보기(is_private) 패턴
```typescript
// DB 컬럼: schedules.is_private boolean DEFAULT false
// 없으면: ALTER TABLE public.schedules ADD COLUMN IF NOT EXISTS is_private boolean DEFAULT false;
// API 필터 (route.ts GET): !s.is_private || s.created_by === profileId
// UI 토글: ScheduleAddScheduler 상단 [나만보기] 버튼 → isPrivate state
// 시각화:
//   - DraggableSchedulePill (캘린더 pill): 블랙배경(bg-slate-900) + 흰글씨 + 끝에 노란 자물쇠(text-yellow-400)
//   - ScheduleList (우측패널 목록): border-fuchsia-400 bg-fuchsia-50 + [나만] 뱃지(fuchsia)
//   - ScheduleDetailPopup 헤더: 블랙 pill + 노란 Lock 아이콘 [나만보기] 뱃지
// ⚠️ 주의: is_private는 CalendarScheduleItem(month-view.ts)에도 반드시 포함해야 함
//   mapScheduleItem()에서 누락되면 eventsByDay로 전달 시 필드가 사라짐 → 표시 안됨
```

### 반복 일정 패턴 (TASK-018b)
```typescript
// DB 컬럼: schedules.recurrence_rule TEXT DEFAULT NULL (RRULE 포맷)
// 예: "FREQ=WEEKLY;BYDAY=MO;UNTIL=20261231T000000Z"
// 서버사이드 확장: expandRecurringSchedules() in schedules.ts
//   → 가상 ScheduleRow 생성, id = `${originalId}_${YYYYMMDD}`
// 수정/삭제 시 원본 ID 파싱: id.split('_')[0]
// ⚠️ 단일 occurrence 편집 미지원 (v1 한계)
```

### RSVP 패턴 (TASK-018d)
```typescript
// DB: schedule_participants(schedule_id, profile_id, status)
// status: 'attending' | 'declined' | 'tentative'
// API: GET/POST/DELETE /api/schedules/[id]/participants
// UI: RsvpSection 컴포넌트 → ScheduleDetailPopup 내 렌더링
// currentUserProfileId prop 필요: page.tsx → CalendarPageClientShell → ScheduleDetailPopup
```

### 통계 대시보드 패턴 (TASK-018a)
```typescript
// 엔진: src/lib/engines/analytics.ts
// API: GET /api/admin/analytics?year=YYYY&month=MM (admin only)
// 페이지: /admin/analytics (서버 컴포넌트)
// 차트: recharts dynamic import (AnalyticsDashboard.tsx)
// 차트 3종: 월차 인원 추이(LineChart), 카테고리 분포(PieChart), 교육 현황(BarChart)
```

*마지막 갱신: 2026-03-21*
