# 프로젝트 개요

<!-- TODO: 앱이 무엇을 하는지 2~3줄로 적어주세요 -->
[앱 이름] — [한 줄 설명]

## 개발 수칙

모든 에이전트는 아래 수칙을 다른 규칙보다 우선합니다.

1. **항상 MVP를 유지합니다.** 뭐든지 최소한으로 개발합니다. 요청받지 않은 기능을 염려하거나 마음대로 확장하지 않습니다.
2. **에러 처리는 하지 않습니다.** 최초 코드 작성 시 에러 처리를 넣지 않고, 에러가 실제로 발생하면 그때 처리합니다.
3. **복잡한 것보다 심플한 것이 우선입니다.** 이 앱의 목표 중 하나는 심플한 화면 구성과 UX입니다.
4. **애매한 것은 스스로 판단해서 작성하지 않습니다.** 애매한 것은 무조건 확인 질문을 던집니다.
   - 메인 세션: 작업을 시작하거나 위임하기 전에 사용자에게 질문합니다.
   - 서브에이전트: 사용자에게 직접 물을 수 없으므로, 애매한 부분은 작성하지 말고 멈춘 뒤 최종 보고에 질문을 적어 메인에게 넘깁니다. 메인이 사용자에게 확인한 뒤 다시 위임합니다.

## 코딩 행동 지침

> 아래 지침이 위 개발 수칙과 충돌하면 개발 수칙을 따릅니다.
Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 스택

- **모바일**: Expo (React Native, TypeScript, Expo Router)
- **백엔드**: FastAPI (Python 3.12) → AWS Lambda (Mangum 어댑터) + Lambda Function URL
- **인프라**: AWS SAM
- **DB**: <!-- TODO: DynamoDB / RDS(Postgres) 등 -->

## 폴더 구조

```
mobile/          # Expo 앱 (frontend 에이전트 담당)
  app/           # Expo Router 화면
  components/
  theme/         # 디자인 토큰 (색상, 간격, 타이포)
  api/           # openapi.json에서 생성된 타입 + API 클라이언트
backend/         # FastAPI (backend 에이전트 담당)
  app/
    routers/
    schemas/     # Pydantic 모델
    services/
  handler.py     # Lambda 엔트리포인트 (Mangum)
  tests/
infra/           # IaC (backend 에이전트 담당)
docs/
  spec.md        # 기능 요구사항, 우선순위
  openapi.json   # ★ 프론트-백엔드 계약 파일
  db-schema.md   # ★ DB 테이블 스키마 문서 (backend 에이전트 담당)
```

## 역할 분담

메인 세션이 PM 역할을 합니다: 기능을 작은 작업으로 쪼개고, 아래 서브에이전트에 위임하고, 결과를 통합합니다.

| 에이전트 | 담당 폴더 | 하는 일 |
|---|---|---|
| `backend` | `backend/`, `infra/` | API, 비즈니스 로직, DB, Lambda 배포 설정 |
| `frontend` | `mobile/` | 화면, 컴포넌트, API 연동, 디자인 토큰 준수 |
| `tester` | `backend/tests/`, `mobile/__tests__/` | 테스트 작성·실행으로 동작 검증 |
| `reviewer` | 없음 (읽기 전용) | 코드 리뷰: 규칙 준수, 계약 일치, 보안, 설계 |

**원칙**
- 한 작업에서 한 에이전트는 자기 담당 폴더만 수정합니다.
- 같은 파일을 두 에이전트가 동시에 수정하지 않습니다.
- 기능 하나의 기본 순서: `backend` → (openapi.json 갱신) → `frontend` → `tester` + `reviewer`
- `tester`와 `reviewer`는 수정하는 파일이 겹치지 않으므로 병렬로 실행합니다.
- `tester`/`reviewer`가 찾은 문제는 메인이 `backend`/`frontend`에 다시 맡겨 고칩니다.

## 프론트-백엔드 계약: docs/openapi.json

프론트와 백엔드는 서로 직접 대화하지 않으므로, 이 파일이 유일한 기준입니다.

1. `backend`가 엔드포인트를 추가·변경하면 반드시 스펙을 다시 내보냅니다:
   ```bash
   cd backend && python -c "import json; from app.main import app; print(json.dumps(app.openapi(), indent=2))" > ../docs/openapi.json
   ```
2. `frontend`는 스펙에서 타입을 생성해서 씁니다. 타입을 손으로 작성하지 않습니다:
   ```bash
   cd mobile && npx openapi-typescript ../docs/openapi.json -o api/schema.d.ts
   ```
3. 스펙에 없는 필드나 엔드포인트가 필요하면 `frontend`는 직접 만들지 말고 메인에게 보고합니다.

## DB 스키마 문서: docs/db-schema.md

`backend`는 모든 DB 테이블의 스키마를 `docs/db-schema.md`에 항상 최신으로 유지합니다. 테이블·컬럼·키·인덱스를 추가·변경·삭제할 때마다 같은 작업 안에서 이 문서도 함께 수정합니다.

## 명령어

```bash
# 백엔드
cd backend && uvicorn app.main:app --reload      # 로컬 실행
cd backend && pytest                              # 테스트
cd backend && ruff check . && ruff format .      # 린트/포맷

# 모바일
cd mobile && npx expo start                       # 개발 서버
cd mobile && npm test                             # 테스트 (jest-expo + RNTL)
cd mobile && npx tsc --noEmit && npx eslint .    # 타입체크/린트
```

## 코딩 규칙

- **Python**: 타입 힌트 필수, 요청/응답은 모두 Pydantic 스키마, 라우터에 비즈니스 로직 넣지 않기(services로 분리)
- **TypeScript**: `strict` 모드, `any` 금지, 색상·간격은 `theme/`의 토큰만 사용 (하드코딩 금지)
- **Lambda**: 핸들러 밖에서 무거운 초기화 피하기(콜드 스타트), 환경변수는 `.env`가 아닌 IaC에서 주입
- **비밀값**: 코드·커밋에 절대 포함하지 않기

## 완료 기준 (Definition of Done)

- [ ] 관련 테스트 통과
- [ ] 린트/타입체크 통과
- [ ] API 변경 시 `docs/openapi.json` 갱신됨
- [ ] DB 스키마 변경 시 `docs/db-schema.md` 갱신됨
- [ ] `reviewer` 리뷰에서 치명적 이슈 없음
