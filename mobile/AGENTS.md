# React + Capacitor 작업 지침

이 디렉터리는 React SPA를 Vite로 빌드하고 Capacitor 8로 iOS·Android에 담는 앱입니다. 웹과 앱은 같은 `dist/`를 사용합니다.
상세 스택·환경·플랫폼 설정은 `../docs/frontend-stack.md`, 디자인은 `design-system.md`를 따릅니다.

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
