# 프로젝트 개요

<!-- TODO: 앱이 무엇을 하는지 2~3줄로 적어주세요 -->
[앱 이름] — [한 줄 설명]

## 스택

- **프론트엔드**: React SPA + TypeScript strict + Vite 8 → 웹 / Capacitor 8 (iOS·Android)
- **라우팅·상태·스타일**: React Router 7 (`react-router`), TanStack Query 5, Zustand 5, Tailwind CSS 4
- **UI**: `mobile-ui-design-system` MCP(`get_design_spec` → `get_component` → `get_icon` → `get_design_tokens` → `get_design_system`)의 HTML + Tailwind CSS v4 + `--ds-*` 토큰(기본 강조색 `#7c4dff`, 라이트·다크·시스템 테마), `THIRD_PARTY_NOTICES.txt` 함께 배포
- **개발 환경**: Node.js 22.12+, iOS 빌드는 macOS + Xcode 26+. 상세: `docs/frontend-stack.md`
- **백엔드**: FastAPI (Python 3.13) → AWS Lambda (Mangum 어댑터) + Lambda Function URL
- **인프라**: AWS SAM
- **DB**: <!-- TODO: DynamoDB / RDS(Postgres) 등 -->

## 폴더 구조

```
mobile/          # React SPA + Capacitor 앱
  src/
    app/         # App.tsx(라우터·Layout), NativeLifecycle
    features/    # 기능별 폴더. <name>/ 안에 index.ts, api.ts, use*.ts, *.tsx
      auth/      # AuthProvider, useAuth, SignIn, Google 로그인
      account/   # 내 정보 화면
      todos/     # 할 일 (참조 구현)
    components/  # 기능과 무관한 공용 UI (Button, Modal, Screen)
    lib/         # http.ts(API_URL, authedFetch), token.ts, schema.d.ts(openapi에서 생성)
    theme/       # styles.css: Mobile UI Design System MCP 테마·토큰(--ds-*)·Tailwind CSS v4
  public/
    THIRD_PARTY_NOTICES.txt # MCP 라이선스 고지문 (빌드 시 dist/에 포함)
  __tests__/     # Vitest + React Testing Library
  capacitor.config.ts # appId, webDir: dist, 네이티브 플러그인 설정
  ios/          # Capacitor iOS 프로젝트 (SPM)
  android/      # Capacitor Android 프로젝트
backend/         # FastAPI
  app/
    deps.py      # CurrentUser (인증 의존성)
    routers/
    schemas/     # Pydantic 모델
    services/
  main.py        # FastAPI 앱 + Lambda 엔트리포인트 (Mangum, main.lambda_handler)
  template.yml   # AWS SAM 템플릿 (Lambda, Function URL, DB 리소스)
  run.sh         # sam build + deploy
  tests/         # 백엔드 테스트
docs/
  frontend-stack.md # 프론트엔드 스택·설정 가이드
  spec.md        # 기능 요구사항, 우선순위 (기능 정의 시 작성)
  openapi.json   # ★ 프론트-백엔드 계약 파일
  db-schema.md   # ★ DB 테이블 스키마 문서
```

## 프론트-백엔드 계약: docs/openapi.json

프론트와 백엔드 사이의 유일한 기준입니다.

1. 엔드포인트를 추가·변경하면 반드시 스펙을 다시 내보냅니다:
   ```bash
   cd backend && python -c "import json; from main import app; print(json.dumps(app.openapi(), indent=2))" > ../docs/openapi.json
   ```
2. 프론트는 스펙에서 타입을 생성해서 씁니다. 타입을 손으로 작성하지 않습니다:
   ```bash
   cd mobile && npx openapi-typescript ../docs/openapi.json -o src/lib/schema.d.ts
   ```
3. 프론트에 필요한 필드나 엔드포인트는 백엔드와 스펙에 먼저 추가합니다.

## 프론트 구조 규칙

1. 의존 방향은 `app → features → components | lib`입니다. `components/`·`lib/`는 `features/`·`app/`를 import하지 않고, `features/`는 `app/`을 import하지 않습니다.
2. 다른 feature는 `@/features/<name>`(index.ts)로만 import합니다. `@/features/<name>/<file>` 딥 임포트는 금지이고, feature 안에서는 `./`를 씁니다.
3. feature 안에서 서버 호출은 `api.ts`, 서버 상태는 `use*.ts`, UI는 `*.tsx`에 둡니다. 컴포넌트는 `fetch`를 직접 부르지 않고, 타입은 `@/lib/schema`에서 가져옵니다.

규칙 1·2는 `mobile/eslint.config.js`의 `no-restricted-imports`가 강제하며 `npm run lint`가 위반을 잡습니다. `features/` 아래 새 폴더는 자동으로 적용됩니다.

새 feature 추가 순서:

1. `features/<name>/`에 `api.ts`, `use<Name>.ts`, `<Name>Screen.tsx`를 만듭니다.
2. 밖에서 쓸 것만 `index.ts`로 export합니다.
3. `app/App.tsx`에 라우트를 추가합니다.
4. `__tests__/<name>.test.tsx`에 테스트를 추가합니다.
5. `cd mobile && npm run typecheck && npm run lint && npm test`로 확인합니다.

## DB 스키마 문서: docs/db-schema.md

모든 DB 테이블의 스키마를 `docs/db-schema.md`에 항상 최신으로 유지합니다. 테이블·컬럼·키·인덱스를 추가·변경·삭제할 때마다 같은 작업 안에서 이 문서도 함께 수정합니다.

## 명령어

```bash
# 백엔드
cd backend && uvicorn main:app --reload          # 로컬 실행 (AWS 설정 필요)
# AWS 없이 로컬 실행: 로컬 Postgres 시작 + docs/db-schema.md DDL 적용 (종료: scripts/dev_db.py --stop)
cd backend && export DATABASE_URL=$(../.venv/bin/python scripts/dev_db.py)
cd backend && JWT_SECRET=local-dev-secret-at-least-32-bytes uvicorn main:app --reload
cd backend && pytest                              # 테스트
cd backend && ruff check . && ruff format .      # 린트/포맷

# 프론트엔드 (Node.js 22.12+)
cd mobile && npm ci                               # 잠금 버전 설치
cd mobile && npm run dev                          # 브라우저 개발
cd mobile && npm test                             # Vitest + React Testing Library
cd mobile && npm run typecheck && npm run lint     # 타입체크/린트
cd mobile && npm run sync                         # 빌드 + cap sync
cd mobile && npm run ios                          # Xcode (Mac 필수)
cd mobile && npm run android                      # Android Studio
```

## Git

커밋·푸시는 요청받았을 때만 합니다. 브랜치는 만들지 않고 `main`에 합니다.
