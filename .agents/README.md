# 🤖 GA_NEXUS 에이전트 시스템

## 구조

```
.agents/
├── run.mjs                  ← 파이프라인 실행기 (전체 자동화)
├── feature-agent.md         ← 코드 작성 에이전트
├── db-agent.md              ← DB 마이그레이션 에이전트
├── qa-agent.md              ← 품질 검증 에이전트
├── deploy-agent.md          ← Git push 에이전트
├── skills/
│   └── neon-postgres/       ← Neon DB 레퍼런스 (자동 참조)
│       └── SKILL.md
└── workspace/               ← 에이전트 간 인계 파일 (git 제외)
    ├── task.json            ← 작업 명세
    ├── feature_result.json  ← feature-agent 결과
    ├── db_result.json       ← db-agent 결과
    ├── qa_result.json       ← qa-agent 결과
    └── deploy_result.json   ← deploy-agent 결과
```

## 사용법

### 방법 1 — 자동 파이프라인 (권장)
```bash
node .agents/run.mjs "작업 내용"
```
예시:
```bash
node .agents/run.mjs "반복 일정 기능 추가"
node .agents/run.mjs "관리자 승인 알림 뱃지 추가"
node .agents/run.mjs "schedules 테이블에 color 컬럼 추가"
```

### 방법 2 — Claude Code 직접 (CLAUDE.md 오케스트레이터)
```bash
claude "CLAUDE.md 읽고 반복 일정 기능 추가해줘. push까지 해줘"
```

### 방법 3 — 에이전트 개별 실행 (디버깅용)
```bash
# feature-agent만 실행
claude ".agents/feature-agent.md 읽고 task.json의 feature 항목 실행해"

# qa-agent만 실행 (빌드 확인)
claude ".agents/qa-agent.md 읽고 타입체크와 빌드 검증해"

# deploy-agent만 실행
claude ".agents/deploy-agent.md 읽고 qa_result.json 확인 후 push해"
```

## 파이프라인 흐름

```
사용자 명령
    ↓
task.json 작성 (오케스트레이터)
    ↓
[feature-agent] 코드 작성
    → feature_result.json
    ↓
[db-agent] DB 변경 시에만 실행
    → db_result.json
    ↓
[qa-agent] 타입체크 + 빌드
    → qa_result.json
    ↓ (passed일 때만)
[deploy-agent] git push
    → deploy_result.json
    ↓
최종 결과 요약 출력
```

## 에이전트 역할 경계

| 에이전트 | 할 수 있는 것 | 할 수 없는 것 |
|---|---|---|
| feature-agent | 코드 작성, 파일 생성/수정 | 빌드, DB, git |
| db-agent | SQL 마이그레이션 실행 | 코드 수정, git |
| qa-agent | 타입체크, 빌드, 단순 오류 수정 | 로직 변경, git |
| deploy-agent | git add/commit/push | 코드 수정, DB |

## workspace 파일 포맷

각 result.json의 `status` 값:
- `"done"` / `"passed"` / `"deployed"` → 성공
- `"failed"` → 실패, 파이프라인 중단
- `"skipped"` → 해당 에이전트 불필요로 스킵
- `"partial"` → qa-agent 전용, 경고만 있고 빌드는 성공
