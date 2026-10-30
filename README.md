# App Subagent Template

React + Vite SPA를 Capacitor 8로 감싼 웹·iOS·Android 앱과 FastAPI/AWS Lambda 백엔드 템플릿입니다.
React Router 7, TanStack Query 5, Zustand 5, Tailwind CSS 4를 사용합니다.

Google 로그인, 앱 JWT 발급·복원, 사용자 조회·로그아웃을 지원합니다. UI는 Mobile UI Design System MCP에서 제공하는 HTML + Tailwind CSS v4 컴포넌트·토큰(`#7c4dff`, 라이트/다크/시스템 테마)·아이콘을 사용합니다.

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

## 새 앱 시작하기

템플릿을 클론한 뒤 한 번 실행합니다. 스택 이름, 번들 ID, 표시 이름이 한 번에 바뀝니다. 백엔드의 Lambda 이름과 JWT 시크릿 경로(`/<slug>/JWT_SECRET`)는 스택 이름에서 파생됩니다.

```bash
scripts/new-app.sh <slug> <bundle-id> "<Display Name>"
# 예: scripts/new-app.sh idea-box com.example.ideabox "Idea Box"
```

Google OAuth 클라이언트 ID는 바꾸지 않습니다. 나머지는 직접 합니다.

1. Google Cloud에서 웹·iOS·Android OAuth 클라이언트 생성 ([설정 가이드](docs/frontend-stack.md))
2. 웹 클라이언트 ID를 `backend/samconfig.toml`의 `GoogleWebClientId`와 `mobile/.env.local`에, iOS 클라이언트 ID를 `mobile/.env.local`과 `Info.plist` URL scheme에 입력
3. JWT 시크릿 생성:
   ```bash
   aws ssm put-parameter --name /<slug>/JWT_SECRET --type SecureString --value "$(openssl rand -hex 32)" --region ap-northeast-2
   ```
4. `cd backend && ./run.sh`로 테스트, DB 마이그레이션(`alembic upgrade head`), 스키마 드리프트 검사(`alembic check`), 배포를 한 번에 합니다. 배포하는 AWS 자격 증명에 `dsql:DbConnectAdmin`과 `cloudformation:DescribeStacks` 권한이 필요합니다.
5. `mobile/.env.local`의 `VITE_API_URL`을 배포 출력의 `FunctionUrl`로 설정합니다. 로컬 백엔드 서버는 없으므로 `npm run dev`도 배포된 백엔드를 씁니다.

[프론트엔드 스택·OAuth·플랫폼 설정](docs/frontend-stack.md), [개발 규칙](CLAUDE.md)을 참고하세요.
