# 우측 패널 기능 구현 플랜

## 1. 개요

- **우측 패널**: 오늘 일정 리스트·세부 내용(기본) + 하단 메모 + 우측 상단 공지사항 박스(미리보기)
- **공지사항**: 박스 클릭 시 팝업 → 글쓰기·이미지 첨부·확인한 사람 체크(프로필 아이콘, 호버/클릭 시 이름 드롭다운)

---

## 2. 데이터베이스 스키마

### 2.1 메모 (branch_memos)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| branch_name | text | 지점(지점별 메모) |
| content | text | 메모 내용 |
| created_by | uuid FK → profiles(id) | 작성자 |
| created_at | timestamptz | 작성 일시 |

- 지점별 메모 목록 조회, 작성자명은 `profiles.full_name` 조인으로 표시.

### 2.2 공지사항 (notices)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| branch_name | text | 지점 |
| title | text | 제목(미리보기용) |
| body | text | 본문 |
| image_url | text nullable | 첨부 이미지 URL (업로드 API 연동) |
| created_by | uuid FK → profiles(id) | 작성자 |
| created_at | timestamptz | 작성 일시 |

- 최신 1건만 사용하거나, “최신 공지 1건을 우측 상단에 미리보기”로 할지 선택 가능. (권장: 최신 1건만 상단 노출, 필요 시 목록/히스토리 확장)

### 2.3 공지 확인 (notice_reads)

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid PK | |
| notice_id | uuid FK → notices(id) | 공지 |
| profile_id | uuid FK → profiles(id) | 확인한 사람 |
| read_at | timestamptz | 확인 시각 |

- UNIQUE(notice_id, profile_id)로 중복 방지.
- 팝업에서 “확인한 사람” 목록 = 이 테이블 + profiles 조인(이름, 프로필 아이콘용).

---

## 3. API 설계

### 3.1 메모

- `GET /api/memos`  
  - 쿼리: `?date=YYYY-MM-DD` (선택, 기본값: 오늘)  
  - 본인 지점(branch_name) 메모 목록, 작성자명 포함.
- `POST /api/memos`  
  - body: `{ content }`  
  - 로그인 사용자, 본인 지점에 메모 생성.

### 3.2 공지사항

- `GET /api/notices`  
  - 본인 지점의 최신 공지 1건 (미리보기용: title, body 앞부분, image_url 등).
- `GET /api/notices/[id]`  
  - 공지 상세 (팝업용).  
  - 선택: 동일 지점 공지 목록(여러 건) 지원 시 `GET /api/notices`를 목록으로 하고, “대표 공지”는 클라이언트에서 최신 1건 사용.
- `POST /api/notices`  
  - body: `{ title, body, imageUrl? }`  
  - Admin(또는 Admin+Manager)만 허용.
- `PATCH /api/notices/[id]`  
  - 수정 (Admin 등).
- 이미지 첨부:  
  - `POST /api/notices/upload`  
    - multipart/form-data 이미지 업로드 → 저장(로컬 또는 스토리지) 후 URL 반환.  
  - 또는 클라이언트에서 base64로 보내고 서버에서 저장 후 URL 반환 (간단 구현용).

### 3.3 공지 확인

- `POST /api/notices/[id]/read`  
  - 현재 사용자를 해당 공지의 “확인함”으로 등록 (notice_reads insert).
- `GET /api/notices/[id]/reads`  
  - 해당 공지를 확인한 사람 목록 (profile_id, full_name, read_at) — 팝업 내 “확인한 사람” 프로필 아이콘·이름 드롭다운용.

---

## 4. UI 구조 (우측 패널)

### 4.1 데스크톱 우측 패널 (기본)

1. **상단: 공지사항 박스**  
   - 우측 상단 한 칸.  
   - 최신 공지 제목(또는 본문 앞부분) 텍스트 미리보기.  
   - 클릭 시 → 공지 팝업 오픈.

2. **중단: 오늘의 일정**  
   - 기본값: “TODAY”(오늘 날짜)의 일정 리스트.  
   - 각 일정: 제목, 시간(또는 종일), 시간순서 배치 (시간이없거나 동일하면 작성순 ) 필요 시 세부 내용(description) 토글/펼치기.  
   - 일정 없을 때: “오늘 일정이 없습니다” 등 안내 문구.

3. **하단: 메모**  
   - 메모 목록: 작성자 이름, 작성 일시(날짜·시간), 내용.  
   - 메모 입력 필드 + “작성” 버튼 (로그인 사용자만).  
   - 스크롤 가능하도록 영역 제한.

### 4.2 공지사항 팝업

- **표시**: 제목, 본문, 첨부 이미지(있을 경우).
- **기능**  
  - **글쓰기**: Admin(또는 역할에 따라)만 “글쓰기/수정” 버튼 노출.  
    - 폼: 제목, 본문, 이미지 첨부(파일 선택 → 업로드 후 URL 반영).
  - **확인한 사람**  
    - “확인한 사람” 영역: 프로필 아이콘(또는 이니셜) 나열.  
    - 호버: 툴팁에 이름(및 확인 시각).  
    - 클릭: 이름 드롭다운(이름 + 확인 시각 목록).  
  - “확인했어요” 버튼: 클릭 시 `POST /api/notices/[id]/read` 호출 후 목록 갱신.
- 팝업 닫기: 오버레이/닫기 버튼.

---

## 5. 구현 순서 (권장)

| 단계 | 내용 |
|------|------|
| 1 | 스키마: `branch_memos`, `notices`, `notice_reads` 테이블 추가 (neon-schema.sql + 마이그레이션/시드) |
| 2 | 엔진: `src/lib/engines/memos.ts`, `src/lib/engines/notices.ts` (CRUD + 읽음 처리) |
| 3 | API: 메모 GET/POST, 공지 GET/GET[id]/POST/PATCH, 공지 읽음 POST, 읽은 사람 GET |
| 4 | 이미지: 공지 이미지 업로드 API (경로 저장 또는 스토리지 연동) |
| 5 | 우측 패널 컴포넌트 분리: `RightPanel` (오늘 일정 + 메모 + 공지 박스), `NoticePopup` |
| 6 | 메인 페이지: 우측 패널에 “오늘 일정” 데이터 전달, 메모·공지 클라이언트에서 fetch |
| 7 | 공지 팝업: 글쓰기/수정 폼, 이미지 첨부, 확인한 사람(프로필 아이콘, 호버/클릭 이름 드롭다운) |
| 8 | 모바일: 우측 슬라이드 패널에도 동일 구조 반영(오늘 일정·메모·공지 미리보기) |

---

## 6. 결정 필요 사항 (컨펌)

1. **공지 “1건 vs 여러 건”**  
   - A: 우측 상단에는 “최신 공지 1건”만 미리보기.  
   - B: 공지 목록을 보여주고, 클릭 시 해당 건 팝업.  
   → 제안: **A (최신 1건)**로 진행 후, 필요 시 B로 확장.

2. **이미지 저장 위치**  
   - A: Next.js `public/uploads` 등 로컬 경로 (배포 시 읽기 전용).  
   - B: Vercel Blob / S3 등 외부 스토리지 (URL만 DB에 저장).  
   → 제안: **A (로컬 `public/uploads`)** 로 먼저 구현. 나중에 B로 전환 가능.

3. **공지 작성 권한**  
   - Admin만 / Admin + Manager / 모든 지점 멤버 중 하나.  
   → 제안: **Admin만** 작성·수정.

4. **메모 권한**  
   - 지점 내 모든 승인된 사용자(Admin, Agent 등)가 읽기·작성.  
   → 제안: **동일 지점 로그인 사용자** 모두 읽기·작성.

위 플랜과 결정 사항 컨펌해 주시면, 이 순서대로 구현 진행하겠습니다.
