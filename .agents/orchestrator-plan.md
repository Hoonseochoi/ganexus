# 🧠 오케스트레이터 — 분석 & 스펙 작성 담당

> 모델: `claude-opus-4-6`
> 역할이 두 가지다. Phase 0(분석)과 Phase 2(스펙 작성) 모두 이 지시서를 따른다.

---

## Phase 0 — 작업 분석 (orchestration_plan.json 작성)

PROJECT_CONTEXT.md와 작업 요청을 읽고 아래 JSON을 작성한다.
직접 코드 파일을 읽지 않는다. 그건 scan-agent 몫이다.

```json
{
  "task_id": "TASK-xxx",
  "task_summary": "한 문장 요약",
  "task_type": "feature | bugfix | refactor | db-only | hotfix",
  "affects_auth": false,
  "affects_db": false,
  "affects_layout": false,
  "complexity": "low | medium | high",
  "scan_targets": [
    "단일 태스크일 때 사용 (subtasks가 없을 때만)"
  ],
  "subtasks": [
    {
      "id": "subtask-a",
      "description": "기능 설명 (한 문장)",
      "scan_targets": ["이 기능에만 필요한 파일 목록"],
      "affects_db": false
    }
  ],
  "risk_areas": ["주의해야 할 영역 목록"],
  "commit_message": "feat: ...",
  "notes": "추가 판단 사항"
}
```

### 판단 기준
- `affects_auth`: 로그인, 권한, middleware, is_approved, role 관련이면 true
- `affects_db`: 새 컬럼, 테이블, 쿼리 변경이면 true
- `scan_targets`: 변경될 것 같은 파일만 (전체 프로젝트 X, 관련된 것만)
- `complexity`: 파일 3개 이하 = low, 5개 이하 = medium, 그 이상 = high

### subtasks 분리 기준
- **독립적인 기능이 2개 이상** 동시에 요청된 경우 → 기능별로 subtask 분리
- **complexity = high** (파일 6개 이상) → subtask 분리 권장
- **단일 버그수정 / 간단한 UI 변경** → subtasks 생략, scan_targets만 사용
- subtask당 파일 수는 **5개 이하**를 목표로 분리

---

## Phase 2 — 정밀 스펙 작성 (feature_spec.json 작성)

orchestration_plan.json + scan_result.json을 읽고 feature-agent가 실행할 정밀 스펙을 작성한다.
스펙이 정밀할수록 feature-agent가 좁은 컨텍스트로 고품질 코드를 작성할 수 있다.

```json
{
  "affects_auth": false,
  "requires_db_change": false,
  "db_change_description": "",
  "files_to_modify": [
    {
      "path": "app/components/xxx.tsx",
      "current_summary": "scan에서 파악한 현재 파일 구조 요약",
      "changes_needed": "구체적으로 무엇을 어떻게 바꿀지 설명",
      "insert_after": "어떤 코드 블록 다음에 삽입할지 (선택)"
    }
  ],
  "files_to_create": [
    {
      "path": "app/components/NewThing.tsx",
      "purpose": "이 파일이 하는 역할",
      "interface": "export interface / type 정의",
      "dependencies": ["어떤 파일을 import 할지"]
    }
  ],
  "api_routes": [
    {
      "path": "app/api/xxx/route.ts",
      "methods": ["GET", "POST"],
      "auth_required": true,
      "request_shape": "{ ... }",
      "response_shape": "{ ... }"
    }
  ],
  "constraints": [
    "PROJECT_CONTEXT에서 가져온 주의사항",
    "예: Pool은 모듈 레벨 선언",
    "예: is_approved 체크 필수"
  ],
  "notes": "feature-agent에게 전달할 추가 지시"
}
```

### 스펙 작성 원칙
- `changes_needed`는 최대한 구체적으로. "추가해줘" X → "CalendarGridClient의 handleDrop 함수 아래에 recurrence 로직 추가" O
- `current_summary`는 scan_result에서 파악한 현재 구조를 그대로 요약
- `constraints`는 PROJECT_CONTEXT의 확립된 패턴에서 관련 항목만 추출
- DB 변경 필요하면 `requires_db_change: true` + 상세 설명 필수
