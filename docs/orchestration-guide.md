# GA_NEXUS 오케스트레이션 시스템 가이드

## 1. 지금 실제로 어떻게 돌아가고 있나?

### 솔직한 현실

"서브에이전트가 병렬로 나눠서 일한다"기보다는 **Claude Code 하나가 CLAUDE.md를 읽고 전체를 직접 처리**하는 구조다.

```
사용자
  └─▶ claude "CLAUDE.md 읽고 XXX 해줘. push까지"
          │
          ▼
    Claude Code (오케스트레이터 역할)
          │  ① task.json 작성
          │  ② feature 코드 직접 작성
          │  ③ DB 필요 시 마이그레이션
          │  ④ tsc 타입체크
          │  ⑤ git commit & push
          ▼
    Vercel 자동 배포
```

서브에이전트 지시서(feature-agent.md 등)는 **규칙 문서**처럼 동작한다.
Claude Code가 그 파일들을 읽고 역할 경계와 규칙을 따르는 방식이다.

---

### 진짜 서브에이전트가 동작하는 경우

`node .agents/run.mjs "작업내용"` 을 실행할 때만 실제로 에이전트가 순서대로 분리 실행된다.

```
run.mjs 실행
  │
  ├─▶ [feature-agent] claude --model claude-opus-4-6 ...
  │       └─ feature_result.json 생성
  │
  ├─▶ [db-agent] claude --model claude-sonnet-4-6 ...  (requires_db_change=true일 때만)
  │       └─ db_result.json 생성
  │
  ├─▶ [qa-agent] claude --model claude-sonnet-4-6 ...
  │       └─ qa_result.json 생성
  │
  └─▶ [deploy-agent] claude --model claude-haiku-4-5-20251001 ...
          └─ deploy_result.json 생성
```

---

## 2. 에이전트별 역할 정리

| 에이전트 | 지시서 | 담당 모델 | 역할 | 하면 안 되는 것 |
|---|---|---|---|---|
| **오케스트레이터** | `CLAUDE.md` | Sonnet 4.6 | task.json 작성, 흐름 총괄 | 없음 |
| **feature-agent** | `.agents/feature-agent.md` | Opus 4.6 | 컴포넌트·API 코드 작성 | 빌드, DB, git |
| **db-agent** | `.agents/db-agent.md` | Sonnet 4.6 | SQL 마이그레이션 실행 | 코드 수정, git |
| **qa-agent** | `.agents/qa-agent.md` | Sonnet 4.6 | 타입체크·빌드 검증 | 로직 변경, git |
| **deploy-agent** | `.agents/deploy-agent.md` | Haiku 4.5 | git commit·push | 코드 수정, DB |

### 모델 배분 전략 (비용 최적화)
- Opus → 가장 비싸지만 코드 품질이 중요한 feature에 투자
- Sonnet → 구조적인 분석·SQL·빌드 검증에 적합
- Haiku → git 명령어만 치면 되는 deploy에 최저 비용

---

## 3. 에이전트 간 인계 프로토콜

`workspace/` 폴더의 JSON 파일들이 에이전트 간 통신 수단이다.

```
.agents/workspace/
  ├── task.json           ← 오케스트레이터가 작성 (작업 명세)
  ├── feature_result.json ← feature-agent가 작성
  ├── db_result.json      ← db-agent가 작성 (or skipped)
  ├── qa_result.json      ← qa-agent가 작성
  └── deploy_result.json  ← deploy-agent가 작성
```

각 result.json의 `status` 값:
- `"done"` / `"passed"` / `"deployed"` → 성공, 다음 단계 진행
- `"failed"` → 즉시 파이프라인 중단
- `"skipped"` → 해당 에이전트 불필요
- `"partial"` → 경고만 있고 빌드 성공 (qa 전용, 배포는 진행)

---

## 4. 실패 처리 규칙

```
feature 실패  → 1회 재시도 → 그래도 실패 시 중단, 사용자 보고
qa 빌드 실패  → feature-agent 재호출 (최대 2회)
db 마이그레이션 실패 → 즉시 중단, 롤백 안내 (ROLLBACK SQL은 주석으로 준비됨)
deploy 실패   → qa까지 완료 상태로 보고, 수동 push 안내
```

---

## 5. 사용법 요약

```bash
# 방법 1: Claude Code에 직접 (현재 주로 쓰는 방식)
claude "CLAUDE.md 읽고 [작업 내용]. push까지"

# 방법 2: 자동 파이프라인 (run.mjs, 진짜 에이전트 분리 실행)
node .agents/run.mjs "반복 일정 기능 추가"

# 방법 3: 에이전트 개별 실행 (디버깅)
claude ".agents/qa-agent.md 읽고 타입체크와 빌드 검증해"
```

---

## 6. GA_NEXUS 핵심 코딩 규칙 (모든 에이전트 공통)

- 주석·UI 텍스트·로그 → **한국어**
- TypeScript strict, `any` 금지
- Tailwind CSS v4 (v3 문법 혼용 금지)
- DB: `pg` 직접 사용, ORM 없음
- 컴포넌트 → `app/components/`, 비즈니스 로직 → `src/lib/engines/`
- 환경변수 → `.env.local` (절대 하드코딩 금지)
- 모든 API에 `is_approved` 권한 체크 필수

---

## 7. 추가하면 좋을 것들 (추천)

### 즉시 효과 있는 것

#### A. `rollback-agent.md`
지금은 배포 후 문제가 생기면 수동으로 되돌려야 한다.
```
역할: git revert 또는 이전 커밋으로 빠르게 롤백
트리거: "롤백해줘", "이전 버전으로 되돌려줘"
```

#### B. task.json에 `priority` 필드 추가
```json
{
  "priority": "high | medium | low",
  "affects_auth": false,     // 인증 흐름 건드리면 true → qa 더 꼼꼼히
  "affects_db": false        // 이미 requires_db_change로 있지만 명시화
}
```

#### C. qa-agent 체크리스트에 보안 항목 강화
```
□ SQL 파라미터 바인딩 확인 (인젝션 방지)
□ 인증 없는 API 엔드포인트 없는지
□ 민감 정보(전화번호, 생년월일) 응답에서 필요한 것만 내려가는지
```

---

### 중기적으로 필요한 것

#### D. `hotfix` 작업 경로 문서화
긴급 수정은 qa 스킵하고 바로 deploy 해야 할 때가 있다.
지금은 규칙이 없어서 매번 판단이 달라진다.
```
hotfix 조건 정의:
- UI 텍스트 오타 → qa 스킵 허용
- 로그인 불가 버그 → qa 필수
- DB 데이터 수정 → 별도 승인 필요
```

#### E. `feature-agent.md`에 프로젝트 패턴 레퍼런스 추가
지금은 "RightPanel.tsx 참고"처럼 파일명만 나와 있다.
자주 쓰는 패턴 코드 스니펫을 직접 넣으면 일관성이 높아진다.
```
- fetch + TanStack Query 패턴
- 모달/팝업 공통 구조
- 날짜 포맷 유틸리티 함수
```

#### F. `MEMORY.md` 또는 `decisions.md`에 설계 결정 기록
왜 이렇게 만들었는지 기록이 없으면 나중에 같은 고민을 반복하게 된다.
```
예시:
- approvals 페이지를 invite-codes로 통합한 이유: 초대코드 기반 자동승인으로 흐름 단순화
- pg 직접 사용한 이유: Neon 연결 풀링 커스텀 필요, ORM 오버헤드 회피
```

---

### 장기적으로 고려할 것

#### G. 브랜치 전략
지금은 `main`에 직접 push한다.
트래픽이 늘거나 여러 기능을 동시에 개발하면 문제가 생긴다.
```
제안:
feat/* → main PR (소규모라면 지금처럼 직접 push도 무방)
```

#### H. 환경변수 목록 문서화
`.env.local.example` 파일이 없으면 새 환경 세팅할 때마다 삽질한다.
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_BASE_URL=
```

---

## 8. 현재 시스템의 한계 (알고 있어야 할 것)

| 한계 | 영향 | 해결 방향 |
|---|---|---|
| run.mjs가 실제로 거의 안 쓰임 | 에이전트 분리 효과 미미 | Claude Code에서 직접 처리가 더 빠름 |
| workspace/*.json이 gitignore됨 | 작업 이력 추적 불가 | 필요하면 docs/task-history/ 별도 관리 |
| qa-agent가 빌드를 항상 돌리지 않음 | 타입체크만으로 빌드 오류 못 잡는 경우 있음 | 중요 변경 시 npm run build 명시 요청 |
| 에이전트가 모델을 직접 선택 못 함 | Claude Code 세션 모델이 고정 | run.mjs 경유 시에만 모델 분리됨 |
