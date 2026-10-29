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
    app/         # App.tsx의 명시적 라우트, 화면, NativeLifecycle
    components/
    theme/       # styles.css: Mobile UI Design System MCP 테마·토큰(--ds-*)·Tailwind CSS v4
    api/         # openapi.json에서 생성된 타입 + API 클라이언트
  public/
    THIRD_PARTY_NOTICES.txt # MCP 라이선스 고지문 (빌드 시 dist/에 포함)
  __tests__/     # Vitest + React Testing Library
  capacitor.config.ts # appId, webDir: dist, 네이티브 플러그인 설정
  ios/          # Capacitor iOS 프로젝트 (SPM)
  android/      # Capacitor Android 프로젝트
backend/         # FastAPI
  app/
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
   cd mobile && npx openapi-typescript ../docs/openapi.json -o src/api/schema.d.ts
   ```
3. 프론트에 필요한 필드나 엔드포인트는 백엔드와 스펙에 먼저 추가합니다.

## DB 스키마 문서: docs/db-schema.md

모든 DB 테이블의 스키마를 `docs/db-schema.md`에 항상 최신으로 유지합니다. 테이블·컬럼·키·인덱스를 추가·변경·삭제할 때마다 같은 작업 안에서 이 문서도 함께 수정합니다.

## 명령어

```bash
# 백엔드
cd backend && uvicorn main:app --reload          # 로컬 실행
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
