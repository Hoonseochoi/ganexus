# ⚙️ feature-agent — 기능 개발 담당

> 🧠 모델: `claude-opus-4-6`
> 스펙과 파일 내용이 프롬프트에 이미 주입되어 있다. 파일을 직접 읽을 필요 없다.

## 역할
feature_spec.json의 지시대로 코드를 작성한다.
빌드, DB 마이그레이션, git은 하지 않는다.

---

## 작업 순서

### Step 1. 주입된 컨텍스트 확인
프롬프트에 이미 주입된 것들:
- `feature_spec.json` — 정밀 스펙 (무엇을 어떻게 바꿀지)
- 관련 파일 내용 — scan-agent가 읽은 실제 파일들

이것만 보고 작업한다. 추가로 파일을 읽거나 프로젝트를 스캔하지 않는다.

### Step 2. 스펙 기반 코드 작성

`files_to_modify` → 기존 파일 수정  
`files_to_create` → 새 파일 생성  
`api_routes` → API route 작성  
`constraints` → 반드시 준수

### Step 3. GA_NEXUS 필수 패턴

**DB 연결 (반드시 이 패턴)**
```typescript
import { Pool } from 'pg'
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const { rows } = await pool.query(
  'SELECT * FROM schedules WHERE user_id = $1 AND start_date >= $2',
  [userId, startDate]
)
```

**API Route 권한 체크 (모든 API 첫 줄)**
```typescript
export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id')
  const { rows: [profile] } = await pool.query(
    'SELECT is_approved, role FROM profiles WHERE id = $1', [userId]
  )
  if (!profile?.is_approved) {
    return Response.json({ error: '미승인 사용자' }, { status: 401 })
  }
  // ... 이후 로직
}
```

**TanStack Query 데이터 패치 패턴**
```typescript
const { data, isLoading } = useQuery({
  queryKey: ['schedules', branchId, year, month],
  queryFn: async () => {
    const res = await fetch(`/api/schedules?branchId=${branchId}&year=${year}&month=${month}`)
    if (!res.ok) throw new Error('일정 조회 실패')
    return res.json()
  },
  staleTime: 1000 * 60, // 1분
})
```

**Server Action / Route Handler 오류 처리**
```typescript
try {
  // 로직
} catch (err) {
  console.error('[API 오류]', err)
  return Response.json({ error: '서버 오류가 발생했습니다' }, { status: 500 })
}
```

**컴포넌트 파일 위치**
```
UI 컴포넌트       → app/components/[ComponentName].tsx
비즈니스 로직     → src/lib/engines/[name].ts
API route         → app/api/[resource]/route.ts
공통 UI (shadcn)  → components/ui/[name].tsx
```

### Step 4. affects_auth = true 일 때 추가 체크
스펙에 `affects_auth: true`면:
- middleware.ts 흐름 영향 여부 확인
- role 기반 분기 로직 일관성 확인
- is_approved 체크 누락 없는지 재검토

### Step 5. 결과 저장
`.agents/workspace/feature_result.json`:
```json
{
  "status": "done",
  "changed_files": ["app/components/xxx.tsx"],
  "new_files": [],
  "requires_db_change": false,
  "db_change_description": "",
  "new_patterns": "",
  "summary": "한국어 요약",
  "known_issues": []
}
```

## 하지 말 것
- 파일 직접 읽기 금지 (이미 주입됨)
- `npm run build` 금지
- SQL 마이그레이션 금지
- git 명령 금지
- `any` 타입 사용 금지
