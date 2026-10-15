# Umbra Design System (Dark)

토큰 코드: `src/theme/styles.css` — 색상·간격·라운드·타이포는 여기 값만 사용 (하드코딩 금지).

## 원칙
- 배경은 순수 검정 대신 보라빛 블랙(`#09080D`). 표면이 밝을수록 위 레이어.
- 보라색은 브랜드·강조·선택 상태에만.
- 깊이는 그림자 대신 **표면 밝기 + 1px 보더**. 최상위 강조에만 보라 글로우.
- 서체는 Pretendard 단일. 큰 제목은 자간 좁게, 본문은 넉넉한 행간.
- 최소 터치 영역 44 CSS px. 텍스트 대비 WCAG AA (일반 텍스트 4.5:1, 큰 텍스트·아이콘·컨트롤 3:1).
- 의미를 색으로만 전달하지 않습니다. 상태색에는 아이콘이나 텍스트를 함께 씁니다.
- `prefers-reduced-motion`을 따릅니다. 단, 로딩 스피너는 멈추면 오류처럼 보이므로 예외입니다.
- 모든 컨트롤에 보이는 레이블 또는 `aria-label`을 둡니다. 아이콘 전용 버튼도 마찬가지입니다.

## 토큰 이름 규칙
- 두 단계로 나눕니다. **base**는 원시 값(`--color-violet-400`), **functional**은 용도(`--color-surface`, `--color-line-strong`)입니다.
- 화면 코드는 functional 토큰만 씁니다. base 토큰은 functional 토큰 정의와 브랜드 그라데이션에만 씁니다.
- 새 토큰은 `--{분류}-{용도}[-{변형}][-{상태}]` 순서로 짓습니다. 예: `--color-success-tint`, `--color-line-strong`.
- 상태 접미사는 `rest / pressed / focus / disabled / selected` 중에서 고릅니다. 모바일은 hover가 없으므로 hover 전용 토큰을 만들지 않습니다.
- 한 화면에서만 쓰는 값은 토큰으로 만들지 않습니다.

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
  - Primary는 버튼 묶음당 1개, 화면당 거의 1개만 씁니다. 나머지는 Secondary/Ghost로 내립니다.
  - Danger는 되돌릴 수 없는 동작에만 쓰고, 확인 모달을 거치게 합니다.
  - 기본 크기는 M44입니다. L52는 화면 하단 주요 CTA에만, S36은 터치 영역을 44px로 확보할 때만 씁니다.
- **입력**: 배경 surface, 보더 line → 오류 시 danger 보더 + 아래 danger 메시지.
- **토글**: 켜짐 brand 그라데이션, 꺼짐 lineStrong. **체크박스/라디오**: 선택 violet500(라디오 링 violet400).
- **칩**: 선택 시 violet 20% 배경 + violet400 보더 + violet100 글자, 미선택 lineStrong 보더 + textSecondary.
- **탭바**: 선택 textBrand, 미선택 textTertiary.
- **토스트/모달/바텀시트**: e2/e3 규칙 적용.

## 상태
- **focus**: 키보드 포커스에만 `:focus-visible` 링(2px `brand-text`, offset 2px)을 보입니다. 터치 탭에는 보이지 않습니다.
- **pressed**: 터치 피드백은 배경을 한 단계 밝은 표면으로 바꿉니다(예: surface → raised).
- **disabled**: 투명도 50%. 이유를 알려야 하면 비활성화 대신 누를 수 있게 두고 누르면 안내합니다.
- **loading**: 예상 대기가 1초를 넘을 때만 스피너를 보입니다. 화면당 스피너 1개. 버튼 안 로딩은 레이블을 유지하고 중복 탭을 막으며 `aria-busy`를 둡니다. 스피너에는 "불러오는 중"처럼 무엇을 하는지 레이블을 붙입니다.
- **empty**: 데이터가 없을 때 제목(필수) + 짧은 설명 + 다음 동작 버튼 1개(권장). 제목은 짧은 문장, 버튼은 동사로 씁니다(예: "추가하기"). 좁은 영역에서는 제목만 둡니다.

## 웹·하이브리드 적용

- Tailwind CSS 4의 `@theme` 토큰과 공통 CSS를 사용합니다. Ionic React는 기본 의존성이 아니며 도입 시 React Router 호환성을 확인합니다.
- Pretendard는 `@font-face`로 굵기별 로드하고, React DOM에서는 CSS `font-weight`로 지정합니다.
- `viewport-fit=cover`와 `--safe-*` 변수를 사용합니다. SystemBars의 `--safe-area-inset-*`가 있으면 우선 사용하고 CSS `env()`를 fallback으로 사용합니다.
- `100dvh`로 화면 높이를 처리하고 하단 탭·시트에는 bottom safe area를 반영합니다.
- 버튼·탭에서만 텍스트 선택·길게 누르기 메뉴·탭 하이라이트를 억제합니다. 입력과 본문 복사, 키보드 포커스는 유지합니다.
- 모달은 HTML `dialog`를 사용해 포커스 격리·Escape 닫기를 제공하고, 닫을 때 이전 포커스를 복원합니다.
- `div` 대신 `header`, `nav`, `main`, `button`, `a` 같은 의미 있는 요소를 씁니다.

## 참고 레퍼런스
웹 중심 레퍼런스이므로 모바일 관례(iOS HIG, Material 3)와 충돌하면 모바일 관례를 따릅니다.

| 레퍼런스 | 가져온 것 | 확인 범위 (2026-10-15) |
|---|---|---|
| [GitHub Primer](https://primer.style) | 토큰 이름 체계(base/functional, 블록 순서), 버튼 사용 규칙(Primary 1개, Danger는 확인 뒤) | token-names, Button 페이지 확인. 접근성·포커스 페이지는 내용이 없어 확인 못 함 |
| [Atlassian](https://atlassian.design) | 대비 수치, 색 단독 금지, reduced motion, 스피너 1초 규칙, empty 상태 구성 | accessibility, spinner, empty-state 확인. focus-ring·design-tokens 페이지는 내용을 읽지 못해 확인 못 함 |
| [Meta Astryx](https://astryx.atmeta.com) | 테마 = CSS 변수 덮어쓰기, `--{분류}-{용도}` 이름, Tailwind 4 `@theme` 연결 | theme, styling-libraries 문서 확인. 우리는 단일 다크 테마라 light/dark 짝 값과 레이어 구성은 도입하지 않음 |

모바일과 충돌해 바꾼 점: hover 상태 없음, 포커스 링은 키보드에만, disabled 대신 누를 수 있는 상태(Primer `inactive`)는 이유 안내가 필요할 때만 사용.
