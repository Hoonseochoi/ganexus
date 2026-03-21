# 🤖 GA_NEXUS 에이전트 파이프라인 — 전체 스펙

> 버전: v3 | 마지막 갱신: 2026-03-21

---

## 파이프라인 흐름도

```
사용자 입력 (task_input.txt 또는 CLI 인수)
        │
        ▼
┌──────────────────────────────────────────────┐
│  Phase 0 — orchestrator (Opus)               │
│  PROJECT_CONTEXT.md만 읽고 분석              │
│  → orchestration_plan.json                   │
└──────────────────────┬───────────────────────┘
                       │
        ▼
┌──────────────────────────────────────────────┐
│  Phase 1 — scan-agent (Haiku)                │
│  orchestration_plan의 scan_targets 파일 읽기 │
│  → scan_result.json                          │
└──────────────────────┬───────────────────────┘
                       │
        ▼
┌──────────────────────────────────────────────┐
│  Phase 2 — spec-writer (Opus)                │
│  scan 결과 보고 정밀 스펙 작성               │
│  → feature_spec.json                         │
└──────────────────────┬───────────────────────┘
                       │
        ▼
┌──────────────────────────────────────────────┐
│  Phase 3 — feature-agent (Opus)              │
│  스펙 + 파일내용 주입받아 코드 작성          │
│  → feature_result.json                       │
└──────────────────────┬───────────────────────┘
                       │
        ▼
┌──────────────────────────────────────────────┐
│  Phase 4 — 병렬 검증                         │
│  ├── qa-agent (Sonnet) → qa_result.json      │
│  └── db-agent (Sonnet) → db_result.json      │
│       (requires_db_change=true 일 때만)       │
└──────────────────────┬───────────────────────┘
                       │
        ▼
┌──────────────────────────────────────────────┐
│  Phase 5 — deploy-agent (Haiku)              │
│  git add / commit / push                     │
│  → deploy_result.json                        │
│  실패 시 → rollback-agent (Haiku) 자동 실행  │
└──────────────────────┬───────────────────────┘
                       │
        ▼
Phase 6 — 기억 저장
  PROJECT_CONTEXT.md 갱신
  Obsidian 작업로그 기록
```

---

## 에이전트별 상세 스펙

### 🧠 orchestrator (= spec-writer 겸용)
| 항목 | 내용 |
|---|---|
| **모델** | `claude-opus-4-6` |
| **파일** | `orchestrator-plan.md` |
| **실행 방식** | `spawnSync` (동기) |
| **타임아웃** | 360초 |
| **입력** | `PROJECT_CONTEXT.md` |
| **출력 (Phase 0)** | `workspace/orchestration_plan.json` |
| **출력 (Phase 2)** | `workspace/feature_spec.json` |
| **권한** | 파일 읽기만 (코드 수정 없음) |
| **금지** | 실제 코드 파일 직접 읽기 |

**역할 요약**: 작업 요청을 분석해 "어떤 파일을 스캔해야 하는지"와 "feature-agent가 실행할 정밀 스펙"을 결정하는 두뇌. 전체 컨텍스트를 가장 잘 이해하는 가장 비싼 모델 사용.

---

### 🔍 scan-agent
| 항목 | 내용 |
|---|---|
| **모델** | `claude-haiku-4-5-20251001` |
| **파일** | `scan-agent.md` |
| **실행 방식** | `spawnSync` (동기) |
| **타임아웃** | 360초 |
| **입력** | `workspace/orchestration_plan.json` (scan_targets) |
| **출력** | `workspace/scan_result.json` |
| **권한** | 파일 읽기만 |
| **금지** | 코드 수정, 판단, 제안 |

**역할 요약**: 판단 없이 빠르게 읽고 요약하는 역할. 파일 전체 내용을 `content`에 원본 그대로 저장. 가장 저렴한 모델로 비용 절감.

**출력 포맷**:
```json
{
  "file_contents": [{ "path": "...", "content": "원본 전체", "summary": "..." }],
  "folder_structures": [{ "path": "...", "files": [], "summary": "..." }],
  "key_types": ["중요 TS 타입들"],
  "potential_conflicts": ["영향받을 파일들"]
}
```

---

### ⚙️ feature-agent
| 항목 | 내용 |
|---|---|
| **모델** | `claude-opus-4-6` |
| **파일** | `feature-agent.md` |
| **실행 방식** | `spawnSync` (동기) |
| **타임아웃** | 360초 |
| **입력** | `feature_spec.json` + scan_result의 파일 내용 (프롬프트 직접 주입) |
| **출력** | `workspace/feature_result.json` + 실제 코드 파일 수정/생성 |
| **권한** | 파일 읽기/쓰기/생성 |
| **금지** | `npm run build`, SQL 마이그레이션, git 명령, `any` 타입, 추가 파일 직접 읽기 |

**역할 요약**: 스펙대로만 코드를 작성. 이미 주입된 파일 내용만 보고 작업. 고품질 코드를 위해 가장 비싼 Opus 모델 사용.

**출력 포맷**:
```json
{
  "status": "done | failed",
  "changed_files": [],
  "new_files": [],
  "requires_db_change": false,
  "db_change_description": "",
  "summary": "한국어 요약",
  "known_issues": []
}
```

---

### ✅ qa-agent
| 항목 | 내용 |
|---|---|
| **모델** | `claude-sonnet-4-6` |
| **파일** | `qa-agent.md` |
| **실행 방식** | `runParallel` (비동기, db-agent와 동시 실행) |
| **hotfix 모드** | `spawnSync` (동기) + `claude-haiku` 모델로 빌드만 빠르게 |
| **타임아웃** | 360초 |
| **입력** | `feature_result.json`, `feature_spec.json` |
| **출력** | `workspace/qa_result.json` |
| **권한** | 파일 읽기/쓰기, `npx tsc --noEmit`, `npm run build` 실행 |
| **금지** | 비즈니스 로직 수정, `next.config.mjs` 수정, `npm install`, git 명령 |

**자동 수정 가능 범위**: import 경로 오류, 오타 수준의 단순 오류만

**체크리스트**:
- `any` 타입 없는지
- 한국어 주석/메시지
- 환경변수 하드코딩 없음
- DB 쿼리 파라미터 바인딩
- `is_approved` 권한 체크
- 3패널 레이아웃 구조 유지

**출력 포맷**:
```json
{
  "status": "passed | failed | partial",
  "tsc": "clean | errors",
  "build": "success | failed",
  "checklist_passed": true,
  "issues_found": [],
  "auto_fixed": [],
  "requires_feature_retry": false
}
```

---

### 🗄️ db-agent
| 항목 | 내용 |
|---|---|
| **모델** | `claude-sonnet-4-6` |
| **파일** | `db-agent.md` |
| **실행 방식** | `runParallel` (비동기, qa-agent와 동시 실행) |
| **실행 조건** | `feature_result.requires_db_change === true` 일 때만 |
| **입력** | `feature_result.json`, `PROJECT_CONTEXT.md` |
| **출력** | `workspace/db_result.json` + `scripts/migrate-YYYYMMDD-*.sql` |
| **권한** | SQL 실행 (`node -e` 방식), 마이그레이션 파일 쓰기 |
| **금지** | 코드 수정, git 명령 |

**긴급 중단 조건**:
- 기존 데이터 손실 가능성
- 프로덕션 `DROP` / `TRUNCATE` 요청
- `DATABASE_URL` 미인식

**출력 포맷**:
```json
{
  "status": "done | failed | skipped",
  "migration_file": "scripts/migrate-xxx.sql",
  "changes": [],
  "verified": true,
  "summary": "한국어 요약"
}
```

---

### 🚀 deploy-agent
| 항목 | 내용 |
|---|---|
| **모델** | `claude-haiku-4-5-20251001` |
| **파일** | `deploy-agent.md` |
| **실행 방식** | `spawnSync` (동기) |
| **실행 조건** | `--dry-run` 플래그 없을 때만 |
| **입력** | `qa_result.json`, `feature_result.json` |
| **출력** | `workspace/deploy_result.json` |
| **권한** | `git add`, `git commit`, `git push` |
| **금지** | `git push --force`, main 브랜치 rebase, `.env.local` add, QA 실패 시 push |

**절대 준수**: QA `status === "failed"` 이면 즉시 중단.

**출력 포맷**:
```json
{
  "status": "deployed | failed | error",
  "commit_hash": "abc1234",
  "commit_message": "feat: ...",
  "pushed_to": "origin/main",
  "files_committed": []
}
```

---

### ⏪ rollback-agent
| 항목 | 내용 |
|---|---|
| **모델** | `claude-haiku-4-5-20251001` |
| **파일** | `rollback-agent.md` |
| **실행 조건** | `deploy_result.status === "failed" | "error"` 일 때 자동 트리거 |
| **입력** | `deploy_result.json`, `feature_result.json` |
| **출력** | `workspace/rollback_result.json` |
| **권한** | `git push` (재시도), `git reset --soft`, `git stash` |
| **금지** | `git push --force`, `git reset --hard`, 코드 수정, `.env.local` 관련 |

**복구 전략**:
- push만 실패 → `git push` 재시도
- 커밋이 문제 → `git reset --soft HEAD~1`
- 작업 디렉토리 오염 → `git stash`

---

## 실행 옵션

```bash
# 기본 실행
node .agents/run.mjs "작업 내용"

# hotfix 모드 — QA 경량화 (Haiku로 빌드만), 빠른 배포
node .agents/run.mjs "긴급 수정" --hotfix

# dry-run — 코드만 작성, git push 없음
node .agents/run.mjs "실험적 작업" --dry-run
```

---

## workspace 파일 전체 목록

| 파일 | 생성 주체 | 소비 주체 |
|---|---|---|
| `orchestration_plan.json` | orchestrator | scan-agent, spec-writer |
| `scan_result.json` | scan-agent | spec-writer |
| `feature_spec.json` | spec-writer | feature-agent |
| `feature_result.json` | feature-agent | qa-agent, db-agent, deploy-agent, rollback-agent |
| `db_result.json` | db-agent | deploy-agent |
| `qa_result.json` | qa-agent | deploy-agent |
| `deploy_result.json` | deploy-agent | rollback-agent |
| `rollback_result.json` | rollback-agent | (최종) |

> 모든 workspace 파일은 `.gitignore`에서 제외됨. 파이프라인 시작 시 전부 초기화.

---

## 모델 선택 근거

| 모델 | 사용 에이전트 | 이유 |
|---|---|---|
| `claude-opus-4-6` | orchestrator, feature-agent | 복잡한 판단·고품질 코드 필요 |
| `claude-sonnet-4-6` | qa-agent, db-agent | 패턴 체크·구조적 작업, 판단 불필요 |
| `claude-haiku-4-5-20251001` | scan-agent, deploy-agent, rollback-agent | 단순 읽기/git 명령, 비용 최소화 |
