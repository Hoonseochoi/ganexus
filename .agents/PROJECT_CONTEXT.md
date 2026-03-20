# 🧠 GA_NEXUS 프로젝트 컨텍스트 (누적 기억)

> 에이전트가 작업 완료 시 자동 갱신. 모든 에이전트는 작업 전 반드시 이 파일을 읽는다.

---

## ⚠️ 가장 중요한 사실들 (먼저 읽기)

1. **환경변수 이름은 `NEON_DATABASE_URL`** — `DATABASE_URL` 아님. 틀리면 DB 연결 안 됨
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
| `CalendarGridClient.tsx` | 캘린더 그리드. memo 적용. 퀵일정 추가 팝업 포함 | 433줄 |
| `RightPanel.tsx` | 우측 패널. 일정/메모/공지/수정이력 포함 | **1315줄** ⚠️ |
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
| `/api/admin/push/send` | POST | 어드민 수동 전체 발송 |

---

## 🗄️ 실제 DB 테이블 (public 스키마)

| 테이블 | 주요 컬럼 | 비고 |
|---|---|---|
| `auth_users` | login_id, password_hash, role | 로그인 전용 |
| `profiles` | id, login_id, full_name, branch_name, birth_date, phone_number, is_approved, role | |
| `sessions` | id, user_login_id, expires_at, revoked_at | 세션 관리 |
| `schedules` | id, branch_name, title, description, category, start_at, end_at, is_all_day, creator_profile_id 등 | |
| `invite_codes` | id, code, created_by, is_used, expires_at | |
| `notices` | id, title, body, image_url, created_by | |
| `memos` | id, user_login_id, content, target_date | |
| `schedule_edit_logs` | id, schedule_id, modified_by, changed_fields(jsonb) | 수정이력 |
| `push_subscriptions` | id, user_id FK→profiles, endpoint, p256dh, auth, created_at | UNIQUE(user_id, endpoint). web-push VAPID 구독 정보 |


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

- RightPanel.tsx 1315줄 → 분리 필요하지만 아직 미착수
- `any` 타입이 CalendarGridClient 일부에 남아있음 (managers fetch 부분)
- manager-login 경로(`/manager-login`)가 PUBLIC_PATHS에 없어서 미들웨어 이슈 가능성
- 푸시 API (`/api/push/*`, `/api/cron/*`)가 `getCurrentUser()` 대신 `cookies()`+Pool 직접 사용 → 추후 통일 필요
- iOS Safari는 PWA 홈화면 추가 + Safari 17.4+ 이상에서만 Web Push 지원. 구형 iOS는 알림 안 옴

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

---

*마지막 갱신: 2026-03-20*
