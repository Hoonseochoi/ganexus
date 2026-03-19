# 매니저 초대 & 승인 통합 페이지 플랜

## 📋 목표

현재 **초대코드 관리**와 **승인 목록**이 분리되어 있는 것을 **한 페이지로 통합**하고, 
초대 URL 원클릭을 통한 **자동 승인 + 자동 로그인** 기능 추가

---

## 🔄 현재 프로세스 vs 개선된 프로세스

### ❌ 현재 프로세스 (3단계)

```
1. 관리자: /admin/invite-codes 에서 초대코드 생성 및 공유
   └─ 초대코드 (예: MERITZ7-ABC123) 복사 후 매니저에게 전달

2. 매니저: /apply 페이지 접근
   ├─ 초대코드 입력
   ├─ 생년월일 입력
   └─ 신청 완료

3. 관리자: /admin/approvals 에서 승인 처리
   ├─ 승인/거절 선택
   └─ 매니저 자동 활성화 (pending-approval → 대시보드)
```

### ✅ 개선된 프로세스 (2단계)

```
1. 관리자: /admin/invite-codes (통합) 에서 초대코드 생성
   ├─ 초대코드 생성
   ├─ 자동으로 URL 생성: /apply?code=MERITZ7-ABC123
   ├─ URL 복사 버튼으로 매니저에게 공유
   └─ 같은 페이지에서 승인 대기 목록 표시

2. 매니저: URL 클릭 → /apply?code=MERITZ7-ABC123
   ├─ 지점명 자동 설정 (고정값)
   ├─ 상세 정보 입력 (이름, 생년월일, 휴대폰)
   ├─ 제출
   └─ 자동 승인 (코드가 유효하면 즉시 승인)
      └─ 자동 로그인
        └─ 비밀번호 변경 페이지로 이동
```

---

## 📐 개선된 UILayout

### 1️⃣ 상단: 초대코드 관리 섹션

```
┌─────────────────────────────────────────────────────┐
│ 매니저 초대 & 승인 관리                              │
│ 매니저를 신청자를 초대하고 승인합니다               │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 🔗 초대코드 생성                                     │
│  [+ 새 초대 코드 생성] 버튼                          │
│                                                     │
│ 📋 생성된 초대코드 리스트                             │
│  ├─ 코드: MERITZ7-ABC123                           │
│  │  지점: 서울강남지점 · 생성: 2026-03-19 14:30   │
│  │  사용: 0/활용 가능                              │
│  │  [복사] [URL 복사] [삭제]                        │
│  │                                                 │
│  ├─ 코드: MERITZ7-DEF456                           │
│  │  지점: 서울강남지점 · 생성: 2026-03-18 10:15   │
│  │  사용: 2/활용 가능                              │
│  │  [복사] [URL 복사] [삭제]                        │
│  └─ ...                                            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2️⃣ 하단: 승인 대기 목록 섹션

```
┌─────────────────────────────────────────────────────┐
│ ⏳ 승인 대기 목록                    총 3명          │
├─────────────────────────────────────────────────────┤
│                                                     │
│ 👤 김철수                                           │
│    생년월일: 880115 · 휴대폰: 010-1234-5678       │
│    신청일: 2026-03-19 14:30                       │
│    [승인] [거절]                                   │
│                                                     │
│ 👤 이영희                                           │
│    생년월일: 900320 · 휴대폰: 010-9876-5432       │
│    신청일: 2026-03-19 13:15                       │
│    [승인] [거절]                                   │
│                                                     │
│ 👤 박민준                                           │
│    생년월일: 950712 · 휴대폰: 010-5555-5555       │
│    신청일: 2026-03-19 12:00                       │
│    [승인] [거절]                                   │
│                                                     │
│ (승인 대기자가 없으면)                             │
│ "현재 승인 대기 중인 매니저가 없습니다."            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ 구현 계획

### Phase 1: 페이지 통합 (admin/invite-codes)

#### 1-1. 페이지 수정: `/admin/invite-codes/page.tsx`

**변경사항:**
- 초대코드 관리 섹션 (기존)
- **NEW:** 초대코드별 "URL 복사" 버튼 추가
  - 형식: `https://domain.com/apply?code=MERITZ7-ABC123`
  - 또는 상대경로: `/apply?code=MERITZ7-ABC123`
- **NEW:** 승인 대기 목록 섹션 (approvals 페이지에서 가져옴)
  - 동일한 승인/거절 로직
  - 매니저 정보 표시

**상태 관리 추가:**
```typescript
const [codes, setCodes] = useState<InviteCode[]>([]);
const [agents, setAgents] = useState<PendingAgent[]>([]);  // ← NEW
const [loading, setLoading] = useState(true);
const [agentsLoading, setAgentsLoading] = useState(true);   // ← NEW
const [error, setError] = useState<string | null>(null);
const [agentError, setAgentError] = useState<string | null>(null);  // ← NEW
```

**추가 함수:**
```typescript
// 초대코드 URL 생성
const generateInviteUrl = (code: string): string => {
  return `${window.location.origin}/apply?code=${code}`;
};

// 초대코드 URL 복사
const handleCopyUrlToClipboard = async (code: string) => {
  const url = generateInviteUrl(code);
  try {
    await navigator.clipboard.writeText(url);
    // 토스트 메시지: "URL이 복사되었습니다!"
  } catch {
    // 토스트 에러: "복사 실패"
  }
};

// 승인 대기 목록 로드 (approvals 페이지에서 로직 가져옴)
const loadPendingAgents = async () => {
  // /api/admin/pending-agents 호출
};

// 승인/거절 처리 (기존 approvals 로직)
const handleApproveAgent = async (profileId: string) => {
  // /api/admin/approvals 호출
};
```

---

### Phase 2: 자동 승인 로직 추가

#### 2-1. API 수정: `/api/agent/apply/route.ts`

**현재 로직:**
```
1. 초대코드 검증
2. 프로필 생성 (is_approved = false)
3. auth_users 생성
4. 응답: { autoApproved: boolean, ... }
```

**개선된 로직:**
```
1. 초대코드 검증
2. 초대코드의 brand_name 가져오기 (고정값)
3. 프로필 생성 (is_approved = false)
4. auth_users 생성
5. [NEW] URL 파라미터에 code가 있으면:
   ├─ 자동 승인: UPDATE is_approved = true
   ├─ 매니저코드 할당 (필요 시)
   ├─ 테넌트 스키마에 동기화
   └─ autoApproved = true 반환
6. 응답 반환
```

**핵심 코드:**
```typescript
// URL 파라미터에서 code 가져오기
const codeFromUrl = req.nextUrl.searchParams.get('code');

// autoApprove 로직
if (codeFromUrl) {
  // 초대코드 유효성 재확인
  const inviteValid = await validateInviteCode(codeFromUrl);
  
  if (inviteValid) {
    // 자동 승인 처리
    await query(
      `UPDATE public.profiles SET is_approved = true WHERE id = $1`,
      [profileId]
    );
    
    // 테넌트 스키마에 동기화
    await addProfileToTenant({...});
    
    autoApproved = true;
  }
}
```

---

### Phase 3: 매니저 가입 플로우 개선

#### 3-1. 페이지 수정: `/app/apply/page.tsx`

**URL 파라미터 활용:**
```typescript
// /apply?code=MERITZ7-ABC123 에서 code 파라미터 추출
const { searchParams } = useSearchParams();
const codeFromUrl = searchParams.get('code');

// 초대코드 자동 입력 및 검증
useEffect(() => {
  if (codeFromUrl) {
    setInviteCode(codeFromUrl);
    setIsUrlDirectAccess(true);  // URL 직접 접근 플래그
    // 자동으로 코드 검증 시작
    handleValidateCode();
  }
}, [codeFromUrl]);
```

**Step 표시 수정:**

Case 1: URL code 있을 때 (매니저 직접 초대)
```
Step: [정보 입력] → 제출 → [완료]
- Step 0 (코드 입력) 스킵
- Step 1: 필수 정보 (이름, 생년월일, 휴대폰)
  └─ 지점명: 자동 설정 (readonly)
  └─ 매니저코드: 필드 없음
- Step 2: 완료
```

Case 2: 수동 코드 입력 (에이전트 가입)
```
Step: [코드 입력] → [정보 입력] → [완료]
- Step 0: 초대코드 입력
- Step 1: 기본 정보 입력
  └─ 지점명: 자동 설정 (readonly)
  └─ 매니저코드: 필수 입력
- Step 2: 완료
```

**Step 1 UI 조건부 렌더링:**

```typescript
// URL code 있음: 매니저 초대
if (codeFromUrl && currentStep === 1) {
  return (
    <form onSubmit={handleSubmit}>
      {/* 지점명 (readonly) */}
      <input type="text" value={branchName} readOnly />
      
      {/* 필수 정보 */}
      <input name="fullName" placeholder="이름" required />
      <input name="birthDate" placeholder="생년월일 (YYMMDD)" required />
      <input name="phoneNumber" placeholder="휴대폰" required />
      
      {/* ✗ 매니저코드 필드 없음 */}
      
      <button type="submit">제출</button>
    </form>
  );
}

// URL code 없음: 에이전트 가입
if (!codeFromUrl && currentStep === 1) {
  return (
    <form onSubmit={handleSubmit}>
      {/* 지점명 (readonly) */}
      <input type="text" value={branchName} readOnly />
      
      {/* 필수 정보 */}
      <input name="fullName" placeholder="이름" required />
      <input name="birthDate" placeholder="생년월일 (YYMMDD)" required />
      <input name="phoneNumber" placeholder="휴대폰" required />
      
      {/* ✓ 매니저코드 필드 (필수) */}
      <input name="managerCode" placeholder="배정 매니저코드" required />
      
      <button type="submit">제출</button>
    </form>
  );
}
```

**submit 핸들러 수정:**

```typescript
const handleSubmit = async (e?: FormEvent) => {
  e?.preventDefault();
  
  // Case 1: URL code 있음 (매니저코드 미포함)
  if (isUrlDirectAccess && codeFromUrl) {
    const res = await fetch("/api/agent/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: codeFromUrl,
        fullName,
        birthDate,
        phoneNumber
        // ✗ managerCode 미포함
      })
    });
  }
  
  // Case 2: 수동 코드 입력 (매니저코드 포함)
  else {
    const res = await fetch("/api/agent/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: inviteCode,
        fullName,
        birthDate,
        phoneNumber,
        managerCode  // ✓ 포함
      })
    });
  }
  
  const data = await res.json();
  
  if (!res.ok) {
    setError(data.message);
    return;
  }
  
  // 응답 처리
  if (data.autoApproved) {
    // 자동 승인: 로그인 + 비번 변경
    setAutoApproved(true);
    setDone(true);
    setCurrentStep(2);
  } else {
    // 수동 승인: 대기 페이지
    setCurrentStep(2);
    // 또는 /pending-approval 페이지로 리다이렉트
  }
};
```

**제출 후 플로우:**

**Case 1: URL code 파라미터 있을 때 (자동 승인)**
```
1. /api/agent/apply POST 호출
   ├─ code 파라미터 포함 (URL에서 받음)
   ├─ managerCode 미포함 (검증 X)
   └─ request: { 
       code: "MERITZ7-ABC123",
       fullName: "김철수",
       birthDate: "880115",
       phoneNumber: "01012345678"
     }

2. Backend: 초대코드만으로 검증
   ├─ 초대코드 유효성 확인
   ├─ 초대코드의 branch_name 확인
   ├─ 프로필 생성
   └─ 자동 승인 (is_approved = true)
      └─ response: { autoApproved: true, ... }

3. Frontend: 자동 로그인 + 비번 변경
   ├─ 세션 생성
   ├─ auth 쿠키 설정
   └─ /auth/change-password 이동
      └─ 메시지: "메니저 등록이 완료되었습니다. 비밀번호를 설정해주세요."
         └─ 비밀번호 변경 후 대시보드(/) 진입
```

**Case 2: 초대코드 수동 입력 (매니저 배정 후 가입)**
```
1. /api/agent/apply POST 호출
   ├─ code 파라미터 미포함
   ├─ managerCode 포함 (필수)
   └─ request: { 
       code: "MERITZ7-ABC123",
       fullName: "김철수",
       birthDate: "880115",
       phoneNumber: "01012345678",
       managerCode: "MGR-XXXXX"
     }

2. Backend: 초대코드 + 매니저코드 검증
   ├─ 초대코드 유효성 확인
   ├─ 매니저코드 검증 (필수)
   ├─ 프로필 생성
   └─ 자동 승인 여부: 매니저가 auto_approve 설정한 경우에만
      └─ response: { autoApproved: boolean, ... }

3a. autoApproved = true
    └─ 자동 로그인 + 비번 변경 페이지

3b. autoApproved = false
    └─ /pending-approval
       └─ 매니저 승인 대기
```

#### 3-2. 새 페이지: `/auth/change-password/page.tsx` (수정)

**현재 상태:** 
- 이미 있는 페이지
- 로그인 후 must_change_password = true 인 경우만 접근 가능

**개선 사항:**
- 자동 로그인된 상태에서도 접근 가능
- 비밀번호 변경 후 대시보드(/) 로 이동

---

## 📝 API 변경사항

### 1. POST /api/agent/apply (수정)

**요청:** (변경)

**Case 1: URL 초대코드로 가입 (매니저 직접 초대)**
```json
{
  "code": "MERITZ7-ABC123",        // 필수: 초대코드
  "fullName": "김철수",             // 필수: 이름
  "birthDate": "880115",           // 필수: 생년월일 (YYMMDD)
  "phoneNumber": "01012345678"     // 필수: 휴대폰
}
```
- ✗ managerCode 없음 (검증 X)
- ✓ 초대코드만으로 충분
- ✓ 자동 승인 처리

**Case 2: 초대코드 + 매니저 배정 (에이전트 가입)**
```json
{
  "code": "MERITZ7-ABC123",        // 필수: 초대코드
  "fullName": "김철수",             // 필수: 이름
  "birthDate": "880115",           // 필수: 생년월일 (YYMMDD)
  "phoneNumber": "01012345678",    // 필수: 휴대폰
  "managerCode": "MGR-XXXXX"       // 필수: 배정 매니저 코드
}
```
- ✓ managerCode 포함 (검증 필수)
- ✓ 매니저 배정 후 승인 대기 또는 자동 승인

**응답:** (변경)
```json
{
  "autoApproved": true,               // ← MODIFIED: 초대코드만으로 자동 승인
  "requiresPasswordChange": true,     // ← NEW: 비밀번호 변경 필요
  "message": "매니저 등록이 완료되었습니다."
}
```

**Backend 로직:**
```typescript
// URL 파라미터에서 code 추출 (프론트에서는 body에 포함)
const { code, fullName, birthDate, phoneNumber, managerCode } = req.body;

// Case 1: 매니저코드 없음 → 초대코드 검증만
if (!managerCode) {
  // 초대코드 검증
  const invite = await validateInviteCode(code);
  
  if (invite) {
    // 프로필 생성
    const profile = await createProfile({
      code,
      fullName,
      birthDate,
      phoneNumber,
      branchName: invite.branch_name  // 초대코드 지점
    });
    
    // 자동 승인
    await query(
      `UPDATE public.profiles SET is_approved = true WHERE id = $1`,
      [profile.id]
    );
    
    autoApproved = true;
  }
}

// Case 2: 매니저코드 있음 → 매니저 검증 + 승인 정책 확인
else {
  // 초대코드 검증
  const invite = await validateInviteCode(code);
  
  // 매니저코드 검증
  const manager = await validateManagerCode(managerCode);
  
  if (invite && manager) {
    // 프로필 생성
    const profile = await createProfile({
      code,
      fullName,
      birthDate,
      phoneNumber,
      branchName: invite.branch_name,
      managerCode: managerCode
    });
    
    // 매니저의 auto_approve 설정에 따라 결정
    const managerAutoApprove = manager.auto_approve ?? false;
    
    if (managerAutoApprove) {
      await query(
        `UPDATE public.profiles SET is_approved = true WHERE id = $1`,
        [profile.id]
      );
      autoApproved = true;
    } else {
      autoApproved = false;  // 승인 대기
    }
  }
}

return { autoApproved, message: "..." };
```

### 2. GET /api/admin/pending-agents (기존, 페이지에서 사용)

**응답:**
```json
{
  "agents": [
    {
      "id": "uuid",
      "login_id": "code",
      "full_name": "김철수",
      "branch_name": "서울강남지점",
      "birth_date": "880115",
      "phone_number": "01012345678",
      "created_at": "2026-03-19T14:30:00Z"
    }
  ]
}
```

---

## 🗂️ 파일 변경 목록

### 생성/수정될 파일

| 파일 | 타입 | 설명 |
|------|------|------|
| [admin/invite-codes/page.tsx](app/admin/invite-codes/page.tsx) | 수정 | 초대코드 + 승인 목록 통합 |
| [admin/invite-codes/_components/InviteCodesList.tsx](app/admin/invite-codes/_components/InviteCodesList.tsx) | 신규 | 초대코드 리스트 컴포넌트 (분리) |
| [admin/invite-codes/_components/PendingManagersList.tsx](app/admin/invite-codes/_components/PendingManagersList.tsx) | 신규 | 승인 대기 매니저 리스트 컴포넌트 |
| [apply/page.tsx](app/apply/page.tsx) | 수정 | URL 파라미터 code 자동 처리 |
| [api/agent/apply/route.ts](app/api/agent/apply/route.ts) | 수정 | 자동 승인 로직 추가 |
| [auth/change-password/page.tsx](app/auth/change-password/page.tsx) | 수정 | 자동 로그인 상태 처리 |
| [admin/approvals/page.tsx](app/admin/approvals/page.tsx) | 삭제 | invite-codes 페이지로 통합 |

---

## 🔐 보안 고려사항

### 1. 초대코드 URL 공유

**잠재적 위험:**
- URL이 노출되면 누구나 초대코드 사용 가능

**방지 방법:**
- 초대코드에 max_uses 제한 (예: 1회)
- 초대코드 만료 설정 (예: 7일)
- 사용된 초대코드는 재사용 불가

**현재 구현:**
```typescript
// 초대코드 생성 시
POST /api/admin/invite-codes
{
  maxUses: 1,        // 1회 사용만 가능
  expiresAt: "+7d"   // 7일 후 만료
}

// 검증 시
if (invite.used_count >= invite.max_uses) {
  ❌ "초대코드 사용 횟수 초과"
}
if (new Date(invite.expires_at) < now) {
  ❌ "만료된 초대코드"
}
```

### 2. 지점명 고정값 처리

**현재: 초대코드로부터 branch_name 자동 추출**
```typescript
// 초대코드 테이블에 branch_name 저장됨
const invite = await query(
  `SELECT branch_name FROM public.invite_codes WHERE code = $1`,
  [code]
);
const branchName = invite.branch_name;  // 관리자가 지정한 값
```

**보안:**
- 사용자가 지점명 변경 불가 (UI에서 readonly)
- 백엔드에서도 검증

### 3. 자동 승인의 안전성

**검증 필수:**
1. 초대코드 유효성 확인
2. 초대코드 만료 여부 확인
3. 초대코드 사용 횟수 확인
4. 사용자 정보의 완전성 확인

```typescript
// 자동 승인 전 검증
const validations = [
  inviteCodeExists,
  !isExpired,
  usedCountLtMaxUses,
  fullNameProvided,
  birthDateProvided,
  phoneNumberProvided
];

if (validations.every(v => v)) {
  autoApproved = true;
}
```

---

## 📊 데이터 플로우

### 초대코드 생성 → URL 생성 → 매니저 가입 → 자동 승인

```
관리자
  │
  └─ POST /api/admin/invite-codes
     └─ Response: { code: "MERITZ7-ABC123", ... }
        └─ Frontend: /apply?code=MERITZ7-ABC123 생성
           └─ "URL 복사" 버튼 제공
              └─ 매니저에게 URL 공유

매니저
  │
  └─ URL 클릭: /apply?code=MERITZ7-ABC123
     └─ Frontend: 코드 파라미터 감지
        └─ 자동으로 Step 1 (정보 입력)로 이동
           └─ 지점명: 자동 설정 (readonly)
           └─ 정보 입력: 이름, 생년월일, 휴대폰
              └─ POST /api/agent/apply
                 └─ Backend: 자동 승인 처리
                    └─ is_approved = true
                    └─ 테넌트 동기화
                       └─ Response: { autoApproved: true, ... }
                          └─ Frontend: 자동 로그인 + 비번 변경 페이지 이동

관리자 (선택사항)
  └─ /admin/invite-codes 에서 실시간 승인 현황 확인
     └─ 자동 승인된 매니저: 목록에 표시 안함
     └─ 수동 승인 필요한 매니저: 승인/거절 버튼
```

---

## ✅ 구현 체크리스트

### Phase 1: 페이지 통합
- [ ] `/admin/invite-codes/page.tsx` 수정
  - [ ] 초대코드 URL 생성 로직
  - [ ] URL 복사 버튼
  - [ ] 승인 대기 목록 추가
  - [ ] 승인/거절 핸들러 추가

### Phase 2: 자동 승인
- [ ] `/api/agent/apply/route.ts` 수정
  - [ ] URL 파라미터 code 감지
  - [ ] autoApproved 플래그 추가
  - [ ] 자동 승인 로직 구현

### Phase 3: 매니저 가입 플로우
- [ ] `/apply/page.tsx` 수정
  - [ ] 초대코드 자동 감지 및 검증
  - [ ] Step 0 스킵 로직
  - [ ] 지점명 자동 설정 (readonly)
  - [ ] autoApproved 처리

### Phase 4: 비밀번호 변경
- [ ] `/auth/change-password/page.tsx` 수정
  - [ ] 자동 로그인 상태 지원
  - [ ] 변경 후 대시보드 이동

### Phase 5: 테스트 및 정리
- [ ] `/admin/approvals/page.tsx` 삭제 또는 리다이렉트
- [ ] 전체 플로우 테스트
- [ ] 에러 케이스 처리
- [ ] 토스트 메시지 추가

---

## 🎯 예상 효과

✅ **UX 개선:**
- 관리자: 초대코드 생성 + URL 복사 + 승인 관리를 한 페이지에서 처리
- 매니저(URL 모드): URL 원클릭 → 필수정보만 입력 → 자동 승인 → 즉시 사용
- 에이전트(코드 모드): 코드 입력 → 정보 입력 → 수동 승인

✅ **프로세스 단순화:**
- **URL 직접 접근:** 2단계 (정보 입력 → 완료)
  - 기존 3단계 → URL 모드는 2단계로 단축
- **매니저코드 불필요:** URL 접근 시는 검증 자체가 불필요
  - 초대코드 유효성만으로 충분
- 지점명은 자동 설정되므로 수동 입력 제거

✅ **자동화:**
- 초대코드 유효성 검증 (URL 모드)
- 지점명 자동 설정 (변경 불가)
- 매니저코드 검증 비활성화 (URL 모드)
- 자동 승인 (초대코드만으로 승인)
- 자동 로그인 + 비번 변경

✅ **보안:**
- 초대코드 1회 사용 제한 (재사용 불가)
- 초대코드 만료 설정 (시간 제한)
- 지점명 고정값 (변경 불가)
- 매니저코드 검증 스킵 (신뢰할 수 있는 링크만 사용)

✅ **두 가지 가입 방식 지원:**
1. **URL 초대 (매니저 공식 초대):** 자동 승인 + 즉시 활성화
   - /apply?code=MERITZ7-ABC123 링크 클릭
   - 필수 정보만 입력
   - 자동 승인 후 비번 설정 페이지

2. **코드 입력 (에이전트 일반 가입):** 수동 승인 필요
   - /apply 페이지에서 코드 수동 입력
   - 매니저코드 배정 필수값
   - 매니저 승인 대기
