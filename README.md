# App Subagent Template

React + Vite SPA를 Capacitor 8로 감싼 웹·iOS·Android 앱과 FastAPI/AWS Lambda 백엔드 템플릿입니다.
React Router 7, TanStack Query 5, Zustand 5, Tailwind CSS 4를 사용합니다.

Google 로그인, 앱 JWT 발급·복원, 사용자 조회·로그아웃을 지원합니다. 홈·탐색·활동·MY 화면의 할 일·컬렉션·알림·설정은 기존 로컬 데모이며 서버 저장이나 실제 푸시·생체 인증 기능은 없습니다.

Node.js 22.12+에서 시작합니다:

```bash
cd mobile
npm ci
cp .env.example .env.local
# .env.local에 API URL과 Google OAuth 클라이언트 ID 입력
npm run dev
```

```bash
npm test
npm run lint
npm run build
npm run sync
npm run ios      # macOS + Xcode 26+
npm run android  # Android Studio
```

[프론트엔드 스택·OAuth·플랫폼 설정](docs/frontend-stack.md), [개발 규칙](CLAUDE.md), [디자인 시스템](mobile/design-system.md)을 참고하세요.
