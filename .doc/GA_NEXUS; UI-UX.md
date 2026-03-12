## 🎨 1. 시각적 경험 (UI/UX) 디테일: "Executive Modern"


### A. 3단 레이아웃의 고도화

- **L-Panel (The Hub)**:
    
    - **Personalization**: 상단에 "안녕하세요, [홍길동]님" 프로필 영역 배치.
        
    - **Live Status Indicator**: 지점원 목록 옆에 현재 '사무실 근무', '외근', '월차' 상태를 작은 점(Indicator)으로 표시.
        
- **Main (Glassmorphism Calendar)**:
    
    - 달력 배경에 은은한 그라데이션을 넣고, 각 일정 카드(Event Card)는 반투명한 유리 느낌(Glassmorphism) 적용.
        
    - **오늘 날짜**는 강렬한 포인트 컬러로 하이라이트.
        
- **R-Panel (Contextual Sidebar)**:
    
    - 일정이 없는 날을 클릭하면 **"오늘의 지점 명언"**이나 **"이번 달 목표 달성률"** 그래프를 노출해 빈 공간을 활용.
        

### B. Micro-Interactions (감성 디테일)

- **Framer Motion** 활용: 사이드바가 열릴 때 부드럽게 슬라이드되고, 캘린더 카드를 드래그할 때 쫀득한 애니메이션 효과 적용.
    
- **Skeleton Screens**: 데이터 로딩 시 빈 화면 대신 UI 형태의 회색 박스가 먼저 나타나게 하여 체감 속도 향상.
    

---

## 🔐 2. 가입 및 승인 프로세스: "Seamless Onboarding"

에이전트에게는 간편함을, 지점장에게는 통제권을 주는 핵심 로직입니다.

### A. 에이전트 가입 신청서 (The Application)

신청서는 최대한 입력을 최소화하되, 전문적인 느낌을 줍니다.

1. **초대 코드 검증**: 코드가 맞아야 다음 단계(정보 입력)로 넘어가는 인터랙티브 폼.
    
2. **정보 입력**:
    
    - **성함**: (실명)
        
    - **지점**: (초대 코드에 의해 자동 고정/노출)
        
    - **생년월일**: `YYMMDD` 6자리 (보안 확인용)
        
    - **휴대폰 번호**: 자동 하이픈 생성 기능 포함
        
3. **동의 섹션**: `[필수] 개인정보 수집 및 지점 일정 공유 동의` (세련된 토글 버튼이나 체크박스).
    

### B. 지점장 승인 대시보드 (Admin Approval)

- **신규 신청 알림**: 상단 종 모양 아이콘에 빨간 배지 노출.
    
- **Quick Approve**: 신청자의 정보를 카드 형태로 리스트업하고, 스와이프하거나 클릭 한 번으로 승인/거절.
    
- **권한 설정**: 승인 시 에이전트의 등급(일반 에이전트 / 팀장 / 총무)을 바로 지정.
    

---

## 🚀 3. 핵심 킬러 기능 (The "Wow" Points)

### ① 실시간 QR 교육 체크인

- **로직**: 지점장이 우측 패널에서 특정 교육의 'QR 생성' 클릭 -> 대형 TV나 태블릿에 QR 노출 -> 에이전트가 본인 앱의 스캐너로 인식.
    
- **결과**: 수파베이스 `Participants` 테이블에 실시간으로 `checked_in: true` 업데이트. 지점장 화면에는 실시간 참석 인원 카운트가 올라감.
    

### ② "오늘의 부재자" 자동 브리핑

- 매일 아침 8시 30분, 카카오 알림톡으로 **"오늘 [김OO, 이OO] 매니저님이 월차입니다. 급한 용무는 [박OO] 대리에게 연락주세요."** 메시지 자동 발송.
    

### ③ 개인화된 '나의 일정' 위젯

- 전체 지점 일정 중 내가 '참석'으로 표시된 일정과 나의 월차 일정만 따로 모아볼 수 있는 전용 뷰 제공.
    

---

## 🛠️ 4. 데이터베이스 고도화 (Supabase)

에이전트의 상세 정보를 담기 위해 `profiles` 테이블을 더 정교하게 구성합니다.

SQL

```
-- profiles 테이블 예시
create table public.profiles (
  id uuid references auth.users not null primary key,
  full_name text,
  branch_name text,
  birth_date varchar(6),
  phone_number text,
  is_approved boolean default false, -- 지점장 승인 여부
  role text check (role in ('admin', 'manager', 'agent')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

---

## 📝 5. 단계별 실행 계획 (Roadmap)

|**단계**|**목표**|**주요 작업**|
|---|---|---|
|**1단계**|**기반 다지기**|Supabase 프로젝트 생성, 구글 OAuth(Admin용) 설정, DB 스키마 설계|
|**2단계**|**온보딩 구축**|초대 코드 생성 로직 및 에이전트 가입 신청 페이지 구현|
|**3단계**|**메인 캘린더**|FullCalendar 연동, 일정 CRUD(생성/읽기/수정/삭제) 개발|
|**4단계**|**관리자 기능**|승인 대기 리스트, QR 체크인 시스템, 권한 제어(RLS) 적용|
|**5단계**|**자동화 & 알림**|카카오톡 메시지 API 연동 및 데이터 시각화 차트 추가|
[[GA_NEXUS; 가입 및 운영]][[GA_NEXUS ; PROCESS]]