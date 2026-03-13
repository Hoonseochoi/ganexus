# 버튼 UI 통일 플랜 (EclipseButton)

## 목표
- 추가·확인·작성·저장·로그인 등 **모든 CTA/보조 버튼**을 **EclipseButton** 스타일로 통일
- 마그네틱 풀 + 이클립스 호버 효과로 세련된 인터랙션 제공
- 메리츠 브랜드(primary) 컬러 반영

## 기술 스택
- **컴포넌트**: EclipseButton (framer-motion 기반, `motion/react` → `framer-motion` 호환)
- **유틸**: `cn()` = clsx + tailwind-merge (`@/lib/utils`)
- **아이콘**: lucide-react (Loader2, 필요 시 Trash2 등)
- **경로**: `app/components/ui/EclipseButton.tsx` (공통 UI 컴포넌트)

## Variant 매핑 (GA_NEXUS)
| Variant      | 용도                     | 스타일 (프로젝트 반영)     |
|-------------|--------------------------|----------------------------|
| **primary** | 로그인, 저장, 추가, 작성, 확인, 제출 | bg-primary / hover 시 흰색 이클립스 |
| **outline** | 취소, 닫기, 보조 액션    | 테두리 + 호버 시 채움       |
| **ghost**   | 메뉴, Today, 낮은 강조  | 투명 + 호버 시 배경         |
| **destructive** | 거절, 삭제            | 빨간 계열                   |

## Size 매핑
| Size     | 용도           | 적용 예                    |
|----------|----------------|----------------------------|
| default  | 일반 폼 버튼   | 로그인, 저장, 일정 추가    |
| sm       | 테이블/인라인  | 승인/거절, Copy 옆 버튼    |
| lg       | 강조 CTA       | (필요 시)                  |
| icon     | 아이콘만       | 햄버거, >>, 닫기 등        |

## 버튼 위치별 교체 목록

### 1. 인증·온보딩
| 파일 | 현재 | EclipseButton |
|------|------|----------------|
| `app/login/page.tsx` | 로그인 버튼, 비밀번호 변경 버튼 | primary, default, isLoading |

### 2. 에이전트 신청
| 파일 | 현재 | EclipseButton |
|------|------|----------------|
| `app/apply/page.tsx` | 다음/이전, 제출 버튼 | primary / outline, default |

### 3. Admin
| 파일 | 현재 | EclipseButton |
|------|------|----------------|
| `app/admin/branch/page.tsx` | 저장하고 메인으로 이동 | primary, default, isLoading |
| `app/admin/approvals/page.tsx` | 승인, 거절 | primary sm / destructive sm |
| `app/admin/invite-codes/page.tsx` | + 새 초대 코드 생성 | primary, default, isLoading |
| `app/admin/schedules/page.tsx` | 일정 등록, 저장 등 | primary, default |

### 4. 공통 컴포넌트
| 파일 | 현재 | EclipseButton |
|------|------|----------------|
| `app/admin/_components/AdminPageHeader.tsx` | 뒤로가기(←) | icon 또는 outline icon |
| `app/components/DesktopShell.tsx` | 햄버거, 백드롭 닫기 | ghost icon (햄버거는 기존 유지 가능) |
| `app/components/CalendarMonthNav.tsx` | 좌/우, Today | ghost sm |
| `app/components/RightPanelCollapseWrapper.tsx` | >> 닫기 | ghost icon |
| `app/components/CalendarGridClient.tsx` | 퀵일정 취소/추가, + 버튼 | outline / primary, sm |
| `app/components/RightPanel.tsx` | 확인했어요, 작성, 저장, 취소 등 | primary / outline |
| `app/components/CopyCodeButton.tsx` | Copy (내부 버튼) | outline sm (선택) |

### 5. 제외 또는 유지
- **CopyCodeButton 내부**: 애니메이션 연출이 달라 EclipseButton 적용 시 효과가 겹칠 수 있음 → 유지 또는 outline sm만 적용
- **좌측 패널 네비 링크/버튼** (Dashboard, Main Calendar 등): 링크 스타일 유지 또는 ghost

## 구현 단계
1. **의존성**: `lucide-react` 설치, `@/lib/utils`에 `cn()` 추가
2. **EclipseButton**: `app/components/ui/EclipseButton.tsx` 생성 (framer-motion, primary=메리츠 primary 컬러)
3. **교체 순서**:  
   - Admin 공통(AdminPageHeader 뒤로가기) → 로그인/비밀번호 변경 → Admin 각 페이지(저장, 추가, 승인/거절) → 우측 패널·캘린더 버튼 → 나머지

## 주의사항
- `type="submit"` 유지: 폼 제출 버튼은 `type="submit"` 전달
- `disabled` / `isLoading`: 기존 로직 유지, EclipseButton의 `isLoading`과 연동
- 아이콘 전용 버튼은 `text` 없이 `size="icon"` + `leftIcon` 또는 children으로 아이콘만 전달

---

## 적용 완료 (1차)
- **의존성**: `lucide-react` 설치, `src/lib/utils.ts`에 `cn()` 추가
- **EclipseButton**: `app/components/ui/EclipseButton.tsx` (framer-motion, primary=메리츠 primary)
- **교체 완료**: 로그인(2), AdminPageHeader 뒤로가기, 지점 저장, 초대 코드 생성, 승인/거절, 일정 등록/삭제, 에이전트 신청(2)

## 적용 완료 (2차)
- **RightPanel**: 메모 "작성" → primary; NoticePopup 닫기(×) → ghost icon; 저장/취소 → primary + outline; 이미지 제거 → destructive sm; 확인했어요/수정 → outline + ghost; 목록 보기 → ghost sm
- **CalendarGridClient**: 퀵일정 취소/추가 → outline sm + primary sm; 셀 하단 + 버튼 → outline icon
- **CalendarMonthNav**: 이전/다음/Today → ghost icon + ghost sm
- **DesktopShell**: 햄버거 → ghost icon (3바 children)
- **RightPanelCollapseWrapper**: >> 닫기 → outline icon
- **CopyCodeButton**: 내부 Copy → EclipseButton outline sm
