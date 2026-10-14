# Umbra Design System (Dark)

토큰 코드: `src/theme/styles.css` — 색상·간격·라운드·타이포는 여기 값만 사용 (하드코딩 금지).

## 원칙
- 배경은 순수 검정 대신 보라빛 블랙(`#09080D`). 표면이 밝을수록 위 레이어.
- 보라색은 브랜드·강조·선택 상태에만.
- 깊이는 그림자 대신 **표면 밝기 + 1px 보더**. 최상위 강조에만 보라 글로우.
- 서체는 Pretendard 단일. 큰 제목은 자간 좁게, 본문은 넉넉한 행간.
- 최소 터치 영역 44 CSS px. 텍스트 대비 WCAG AA.

## 컬러
| 토큰 | 값 | 용도 |
|---|---|---|
| background | #09080D | 화면 배경 |
| surface | #110F18 | 카드 |
| raised | #18151F | 떠 있는 카드 |
| overlay | #211D2B | 메뉴·시트 |
| line / lineStrong | #2B2638 / #3A3449 | 보더, 비활성 컨트롤 |
| text / textSecondary / textTertiary | #F5F3FA / #ABA5BB / #716B82 | 본문 / 보조 / 힌트·비활성 |
| textBrand | #B294FF | 링크, 선택된 탭 |
| primary (violet 500) | #7C4DFF | 브랜드 |
| success / warning / danger / info | #3DD68C / #F5B94A / #FF5E78 / #62B8FF | 상태 (배경은 10% 투명도) |

- 그라데이션 brand: `#7C4DFF → #A45CFF → #D07BFF` (135°). Primary 버튼, 켜진 토글.

## 타이포 (size/lineHeight · weight)
Display 34/42 Bold -2.5% · Title1 28/36 Bold -2% · Title2 22/30 SemiBold · Title3 18/26 SemiBold · Body1 16/24 · Body2 14/22 · Caption 12/18 Medium · Overline 11/16 SemiBold +8% 대문자

## 간격 · 라운드
- Spacing (4px): 2xs 4 · xs 8 · sm 12 · md 16 · lg 20 · xl 24 · 2xl 32 · 3xl 48
- Radius: xs 6 · sm 10 · md 14 · lg 20 · xl 28 · full

## Elevation
| 레벨 | 배경 | 보더 | 그림자 |
|---|---|---|---|
| e1 카드 | raised | line | 없음 |
| e2 메뉴·시트 | overlay | lineStrong | 0 8 24 rgba(0,0,0,.45) |
| e3 모달 | #2A2536 | lineStrong | 0 20 48 rgba(0,0,0,.6) |
| glow 강조 | raised | violet400 50% | violet500 35% 글로우 |

## 컴포넌트 규칙
- **버튼**: 높이 L52 / M44 / S36. Primary(브랜드 그라데이션, 흰 글자) · Secondary · Outline · Ghost · Danger · Disabled.
- **입력**: 배경 surface, 보더 line → 오류 시 danger 보더 + 아래 danger 메시지.
- **토글**: 켜짐 brand 그라데이션, 꺼짐 lineStrong. **체크박스/라디오**: 선택 violet500(라디오 링 violet400).
- **칩**: 선택 시 violet 20% 배경 + violet400 보더 + violet100 글자, 미선택 lineStrong 보더 + textSecondary.
- **탭바**: 선택 textBrand, 미선택 textTertiary.
- **토스트/모달/바텀시트**: e2/e3 규칙 적용.

## 웹·하이브리드 적용

- Tailwind CSS 4의 `@theme` 토큰과 공통 CSS를 사용합니다. Ionic React는 기본 의존성이 아니며 도입 시 React Router 호환성을 확인합니다.
- Pretendard는 `@font-face`로 굵기별 로드하고, React DOM에서는 CSS `font-weight`로 지정합니다.
- `viewport-fit=cover`와 `--safe-*` 변수를 사용합니다. SystemBars의 `--safe-area-inset-*`가 있으면 우선 사용하고 CSS `env()`를 fallback으로 사용합니다.
- `100dvh`로 화면 높이를 처리하고 하단 탭·시트에는 bottom safe area를 반영합니다.
- 버튼·탭에서만 텍스트 선택·길게 누르기 메뉴·탭 하이라이트를 억제합니다. 입력과 본문 복사, 키보드 포커스는 유지합니다.
- 모달은 HTML `dialog`를 사용해 포커스 격리·Escape 닫기를 제공하고, 닫을 때 이전 포커스를 복원합니다.
