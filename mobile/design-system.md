# Umbra Design System (Dark)

**값의 유일한 기준은 `src/theme/styles.css`입니다.** 색상·간격·라운드·타이포·그라데이션 값과 컴포넌트 스타일은 거기서만 정의하고 거기서 읽습니다. 이 문서는 값을 적지 않고, 토큰·클래스 이름과 사용 규칙만 적습니다.

- 코드에 없는 토큰·변형·컴포넌트는 문서에 먼저 쓰지 않습니다. 필요하면 `styles.css`와 컴포넌트에 만든 뒤 여기에 이름과 규칙을 추가합니다.
- 이 문서와 코드가 다르면 코드가 맞습니다. 문서를 고칩니다.

## 원칙
- 표면이 밝을수록 위 레이어입니다: `background` → `surface` → `raised` → `overlay` → `modal`.
- 보라색(`primary`, `brand-text`, `violet-*`, `--brand-gradient`)은 브랜드·강조·선택 상태에만 씁니다.
- 깊이는 그림자 대신 표면 밝기 + 1px 보더(`line`, `line-strong`)로 나타냅니다. 최상위 강조만 `.glow`.
- 서체는 Pretendard 하나만 씁니다.
- 터치 영역은 `--touch-target` 이상으로 합니다.
- 텍스트 대비는 WCAG AA를 지킵니다(일반 텍스트 4.5:1, 큰 텍스트·아이콘·컨트롤 3:1).
- 의미를 색으로만 전달하지 않습니다. 상태색(`success`, `warning`, `danger`, `info`)에는 아이콘이나 텍스트를 함께 씁니다.
- `prefers-reduced-motion`을 따릅니다. 로딩 스피너만 예외입니다.
- 모든 컨트롤에 보이는 레이블 또는 `aria-label`을 둡니다.

## 토큰 이름 규칙
- **base**는 원시 값(`--color-violet-400`), **functional**은 용도(`--color-surface`)입니다. 화면 코드는 functional을 우선 씁니다.
- 새 토큰은 `--{분류}-{용도}[-{변형}][-{상태}]` 순서로 짓습니다. 예: `--color-success-tint`.
- hover 전용 토큰은 만들지 않습니다(모바일).
- 한 화면에서만 쓰는 값은 토큰으로 만들지 않습니다.

## 컴포넌트 사용 규칙
- **Button** (`src/components/Button.tsx`, `primary` · `secondary` · `danger`)
  - `primary`는 버튼 묶음당 1개, 화면당 거의 1개만 씁니다. 나머지는 `secondary`.
  - `danger`는 되돌릴 수 없는 동작에만 쓰고, `Modal`로 한 번 확인받습니다.
  - 텍스트형 동작은 `.text-button`, 아이콘만 있으면 `.icon-button` + `aria-label`.
- **Chip** (`src/components/Chip.tsx`): 필터·선택용. 선택 상태는 `aria-pressed`로 표시합니다.
- **Modal** (`src/components/Modal.tsx`): 확인·짧은 입력용. 하단에서 올라오는 선택지는 `sheet`.
- **Toast** (`src/components/Toast.tsx`): 짧은 완료 알림용. 사용자가 꼭 읽어야 하는 오류에는 쓰지 않습니다.
- **입력**: 오류는 입력 아래 `.danger-text`로 무엇이 틀렸는지 적습니다.
- **탭바**: 선택 탭은 `.active`.

## 상태
- **focus**: 키보드 포커스에만 링을 보입니다(`:focus-visible`).
- **disabled**: 이유를 알려야 하면 비활성화 대신 누를 수 있게 두고 누르면 안내합니다.
- **loading**: 예상 대기가 1초를 넘을 때만 스피너를 보입니다. 화면당 하나만 두고, "불러오는 중"처럼 하는 일을 레이블로 붙입니다. 버튼 안에서 로딩할 때는 레이블을 유지하고 중복 탭을 막습니다.
- **empty**: 제목(필수) + 짧은 설명 + 다음 동작 버튼 1개(권장). 버튼 문구는 동사로 씁니다(예: "추가하기"). 좁은 영역에는 제목만 둡니다.

## 구현 규칙
- 화면 높이는 `100dvh`를 씁니다. safe area는 `--safe-*` 변수만 씁니다(상세: `docs/frontend-stack.md`).
- 텍스트 선택과 길게 누르기 메뉴는 버튼·탭에서만 막습니다. 입력과 본문은 복사할 수 있게 둡니다.
- 모달은 HTML `dialog`로 만듭니다. 닫을 때 이전 포커스를 복원합니다.
- `div` 대신 `header`, `nav`, `main`, `button`, `a` 같은 의미 있는 요소를 씁니다.

## 참고 레퍼런스
웹 중심 레퍼런스이므로 모바일 관례(iOS HIG, Material 3)와 충돌하면 모바일 관례를 따릅니다.

| 레퍼런스 | 가져온 것 | 확인 범위 (2026-10-15) |
|---|---|---|
| [GitHub Primer](https://primer.style) | 토큰 이름 체계, 버튼 사용 규칙 | token-names, Button 확인. 접근성·포커스 페이지는 확인 못 함 |
| [Atlassian](https://atlassian.design) | 대비 수치, 색 단독 금지, reduced motion, 스피너 1초 규칙, empty 구성 | accessibility, spinner, empty-state 확인. focus-ring·design-tokens는 확인 못 함 |
| [Meta Astryx](https://astryx.atmeta.com) | 테마 = CSS 변수, `--{분류}-{용도}` 이름, Tailwind 4 `@theme` 연결 | theme, styling-libraries 확인. light/dark 짝 값은 단일 다크 테마라 도입하지 않음 |
