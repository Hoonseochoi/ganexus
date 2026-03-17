# 일정 수정 이력 데이터 플로우

현재 접속 가능한 `GA_NEXUS` 환경에서 구현되어 있는 **[일정] -> [편집] -> [수정] -> [수정이력 조회]** 의 풀 스택 파이프라인 매핑입니다.

어느 부분에서 문제가 발생했었는지 파악하실 수 있도록 관련된 모든 단계의 코드 스크립트 위치 및 DB 스키마 로직을 도식화했습니다.

## 1. 일정 수정 파이프라인 (Data Write)

사용자가 **일정 편집 팝업에서 "저장" 버튼**을 클릭할 때 발생하는 플로우입니다.

```mermaid
sequenceDiagram
    participant UI as 프론트엔드 (RightPanel.tsx)
    participant API as Next.js API (api/schedules/[id]/route.ts)
    participant Auth as 인증 모듈 (auth.ts)
    participant Engine as 비즈니스 로직 (schedules.ts)
    participant DB as Neon DB (PostgreSQL)

    Note over UI: 1. 사용자가 제목/설명 등의 항목 수정 후 <br/>[저장] 버튼 클릭

    UI->>API: PATCH /api/schedules/{id} <br/> body: { title, description ... }
    
    API->>Auth: getCurrentUser()
    Auth-->>API: 리턴: user (현재 로그인한 유저)
    
    Note over API: 2. user.profile.id (수정자 고유 UUID) 추출<br/>(이전에는 이 코드가 누락되어 일정 원작자가 수정자로 찍히는 버그 발생)
    
    API->>Engine: updateSchedule({ id, modifiedBy, title ... })
    
    Engine->>DB: 현재 스케줄(수정 전) 데이터 조회<br/>(SELECT ... FROM tenant_지점.schedules)
    DB-->>Engine: 리턴: before (수정 전 데이터)
    
    Engine->>DB: 스케줄 수정 쿼리 실행<br/>(UPDATE tenant_지점.schedules SET ...)
    DB-->>Engine: 리턴: after (수정 후 데이터)
    
    Note over Engine: 3. JSON 비교 로직 (before vs after) 실행<br/>변경된 필드(changed_fields) 산출
    
    alt 변경된 필드(changed_fields)가 있을 경우
        Engine->>Engine: insertScheduleEditLog(before, after) 호출
        
        Engine->>DB: 4. 로그 저장: INSERT INTO <br/>public.schedule_edit_logs (수정 내역)
        Note left of DB: 바로 여기서 500 에러 대거 발생!<br/>본래 코드에 public 스키마 명시가 없어<br/>tenant_... 내부에서 테이블을 찾다가 실패.
        
        DB-->>Engine: 저장 성공
    end
    
    Engine-->>API: 리턴: 수정된 schedule Row
    API-->>UI: 200 OK (수정 성공)
```


## 2. 수정 이력 조회 파이프라인 (Data Read)

팝업이 다시 열려서 **"수정 이력"** 섹션을 렌더링하기 위해 동작하는 플로우입니다.

```mermaid
sequenceDiagram
    participant UI as 프론트엔드 (RightPanel.tsx)
    participant API as Next.js API (api/schedules/[id]/logs/route.ts)
    participant Engine as 비즈니스 로직 (schedules.ts)
    participant DB as Neon DB (public 스키마)

    Note over UI: 일정 클릭 시<br/>팝업 하단에 이력을 표시하기 위해<br/>loadLogs() 를 자동으로 실행합니다.

    UI->>API: GET /api/schedules/{id}/logs <br/>(⚠️ 브라우저 캐시 방지를 위해 cache: 'no-store' 적용)
    
    Note over API: ⚠️ API 엔드포인트 자체에도 강제로 실시간 응답을<br/> 반환하도록 export const dynamic = 'force-dynamic' 적용
    
    API->>Engine: getScheduleEditLogs({ scheduleId, branchName })
    
    Engine->>DB: SELECT * FROM public.schedule_edit_logs <br/>WHERE schedule_id = id
    
    DB-->>Engine: 리턴: Array (수정이력 리스트)
    Engine-->>API: 리턴: Array (수정이력 리스트)
    
    API-->>UI: 리턴 json: { logs: [...] }
    
    Note over UI: 컴포넌트 내부 State 갱신 -> 렌더링 정상 완료
```

---

## 핵심 체크 포인트 요약

현재 로직에서 **"왜 이력이 안 남았거나, 남아도 화면에 뜨지 않았던 것인지"** 체크하는 주요 3대 방어선입니다.

1. **DB 계층 (public vs tenant 스키마):**
   - 사용자 테이블 등은 지점(Branch)에 따른 별도의 테넌트 스키마(`tenant_GA4_7`)에 있습니다. 
   - 그러나 수정 로그 테이블인 `schedule_edit_logs`는 예외적으로 공통 경로인 **`public`** 영역에 만들어져 있습니다! 
   - *문제점:* 코드가 `tenant_GA4_7.schedule_edit_logs` 에서 읽고 쓰려 했기 때문에 조용히 실패했습니다. (현재 코드는 명시적으로 `public.schedule_edit_logs` 를 참조하도록 고쳐졌습니다.)
2. **비즈니스 엔진 (schedules.ts 내부 비교 로직):**
   - JavaScript의 [Date](file:///c:/Users/chlgn/OneDrive/Desktop/GA_NEXUS/app/components/RightPanel.tsx#47-57) 객체(시작일, 종료일) 비교 시 단순 `!==` 연산자를 사용해 무조건 값이 "다르다"고 인식하거나 객체 직렬화가 깨지는 버그를 가지고 있었습니다. 
   - (현재는 타임스탬프 `.getTime()` 비교법을 적용하여 안전해졌습니다.)
3. **프론트엔드/API 캐싱 계층 (Next.js App Router):**
   - 처음 코드가 고장나서 빈 빈열(`[]`)을 반환했을 때, Next.js의 내장 브라우저 캐싱과 API 라우트 캐싱이 이를 영원히 기억했습니다.
   - DB는 정상적으로 수정되어 로그가 쌓여도 요청 시 **'캐시된 빈 배열'**만 뱉고 있었습니다.
   - (현재 `cache: 'no-store'` 와 `force-dynamic` 로 캐싱을 터트려 매 요청 다시 DB를 불러오게 고쳐졌습니다.)
