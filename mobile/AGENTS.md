# React + Capacitor 작업 지침

이 디렉터리는 React SPA를 Vite로 빌드하고 Capacitor 8로 iOS·Android에 담는 앱입니다. 웹과 앱은 같은 `dist/`를 사용합니다.
상세 스택·환경·플랫폼 설정은 `../docs/frontend-stack.md`를 따르고, UI 디자인·컴포넌트·토큰·아이콘은 `.mcp.json`의 `mobile-ui-design-system` MCP 서버에서 가져와 사용합니다.

## 디자인 시스템 (Mobile UI Design System MCP)

1. `get_design_spec`으로 제품 정책(`mobile-app-only`, 최소 48px 터치 영역, 상단 앱바, 하단 내비게이션, safe-area)과 사용 가능한 컴포넌트/아이콘 이름을 확인합니다.
2. `get_component`로 필요한 HTML/Tailwind 컴포넌트를 가져와 상태·이벤트·내비게이션을 연결합니다.
3. `get_icon`으로 공식 Lucide SVG(`data-icon-source="lucide"`)와 라이선스 고지를 가져옵니다.
4. `get_design_tokens`로 `--ds-*` 색상·간격·타입 토큰(기본 강조색 `#7c4dff`, 라이트·다크·시스템 테마)을 확인합니다.
5. 전체 파일이 필요하면 `get_design_system`을 호출하며, `THIRD_PARTY_NOTICES.txt`를 함께 배포합니다.

## 스택과 구조

- TypeScript strict, React DOM, Vite 8, React Router 7, TanStack Query 5, Zustand 5, Tailwind CSS 4.
- Node.js 22.12+를 사용합니다. 의존성은 `npm ci`, 변경 시 `npm install` 후 lockfile을 함께 갱신합니다.
- `src/main.tsx`는 브라우저 진입점, `src/app/App.tsx`는 명시적 라우트입니다. 라우터 import는 `react-router`에서 하고, Declarative 모드를 기본으로 씁니다.
- 화면은 `src/app/`, 공용 UI는 `src/components/`, 서버 계약·인증은 `src/api/`에 둡니다.
- `src/` 안의 모듈은 상대 경로(`./`, `../`) 대신 `@/` 별칭으로 import합니다. 예: `import Home from "@/app/Home"`.
- 서버 상태는 TanStack Query, 공유 클라이언트 상태는 Zustand, 지역 상태는 React state를 사용합니다.

## 네이티브 연동

- Capacitor API를 추가할 때 설치된 메이저 버전에 맞는 공식 문서를 확인합니다: https://capacitorjs.com/docs
- 공식 플러그인은 8.x 호환 버전을 사용합니다. 서드파티 플러그인은 Capacitor peer dependency를 따로 확인합니다.
- 웹/앱 분기는 `Capacitor.isNativePlatform()`, OS 분기는 `Capacitor.getPlatform()`을 사용합니다.
- SystemBars는 core 내장입니다. `viewport-fit=cover`, CSS safe area와 함께 적용하며 inset을 두 번 더하지 않습니다.
- Android backButton은 열린 dialog → 앱 라우트 뒤로가기 → 루트 종료 순서로 처리하고 리스너를 해제합니다.
- iOS/Android 프로젝트는 버전 관리합니다. 플러그인·웹 변경 후 빌드하고 sync합니다.
- iOS는 SPM, macOS + Xcode 26+가 필요합니다. Android는 Android Studio에서 빌드합니다.
- Google 로그인 및 토큰 저장은 기존 `src/api/google.ts`, `token.ts`를 사용합니다. 네이티브 JWT를 Preferences에 저장하지 않습니다.
- `VITE_*`는 공개 빌드 설정이며 비밀값을 담지 않습니다. 환경변수를 바꾸면 재빌드합니다.

## 명령어 (mobile/에서)

```bash
npm ci
npm run dev
npm run api:types
npm run typecheck
npm run lint
npm test
npm run build
npm run sync
npm run ios
npm run android
```

완료 전 타입체크·린트·관련 테스트·빌드를 실행하고, 네이티브 SDK나 OAuth 설정이 없어 확인하지 못한 동작은 구분해 보고합니다.
OTA는 Capgo/Capawesome 중 선택 후 구성합니다. 플러그인·권한·네이티브 코드 변경은 새 바이너리가 필요합니다.
