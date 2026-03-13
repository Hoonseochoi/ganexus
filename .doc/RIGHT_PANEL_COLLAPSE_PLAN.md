# 우측 패널 닫기(>>) 플랜

## 요구사항
- 우측 패널 **중간 부분 엣지 모서리**에 **>>** 아이콘 배치
- **>>** 클릭 시 우측 패널이 **우측으로 밀려나서 닫히는** 모션
- **<< 탭 없음** — 대신 **캘린더에서 날짜 클릭 시** 패널이 다시 열리고, 캘린더가 왼쪽(<< 쪽)으로 밀리며 패널이 생성되는 모션

## 구현 방안

### 1. 상태 관리
- **DesktopRightPanelProvider** (Client): `open` / `setOpen` 상태를 컨텍스트로 제공. 데스크톱 영역(section + Wrapper)을 감싼다.

### 2. RightPanelCollapseWrapper
- **역할**: 우측 패널 열림/닫힘 + ">>" 버튼만. << 탭 제거.
- **동작**:
  - **열림**: wrapper `w-80`, 내부 `translateX(0)`. 캘린더가 왼쪽으로 밀리면서 패널이 나타나는 모션.
  - **닫힘**: ">>" 클릭 시 wrapper `w-0` + 내부 `translateX(100%)` 로 우측으로 밀려나가며 닫힘.
  - **다시 열기**: 캘린더 **날짜 셀 클릭** 시 `setOpen(true)` → 패널 열림 + 캘린더가 왼쪽으로 밀리는 모션.

### 3. RightPanel
- 수정 없음.

### 4. page.tsx
- 데스크톱에서 `DesktopRightPanelProvider` 로 section + RightPanelCollapseWrapper 감싸기.
- section에 `transition-[flex-basis] duration-300 ease-out` 추가.

### 5. CalendarGridClient
- `useRightPanel()` 훅 사용. 날짜 셀 클릭 시 `router.push` 후 `rightPanel?.setOpen(true)` 호출.

### 6. 모바일
- 우측 패널 닫기/열기는 **데스크톱(lg)에서만** 적용.

## 파일 변경 요약
| 파일 | 변경 |
|------|------|
| `app/components/RightPanelCollapseWrapper.tsx` | RightPanelContext, DesktopRightPanelProvider, << 탭 제거, 컨텍스트 기반 open |
| `app/components/CalendarGridClient.tsx` | useRightPanel(), 날짜 클릭 시 setOpen(true) |
| `app/page.tsx` | DesktopRightPanelProvider 적용, section transition |
