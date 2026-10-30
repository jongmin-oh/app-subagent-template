#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")"

PYTHON="${PYTHON:-../.venv/bin/python}"

# 백엔드 테스트 + DB 마이그레이션 + 빌드 + 배포
"$PYTHON" -m pytest -q
# 앞 마이그레이션은 새 코드 배포 전에 스키마를 맞춘다(스택이 아직 없는 첫 배포만 allow_missing_stack으로 건너뜀). 뒤 마이그레이션은 DB를 반드시 찾아야 하므로 플래그가 없다.
"$PYTHON" -m alembic -x allow_missing_stack=true upgrade head
# 모델 변경에 마이그레이션이 빠졌으면 배포 전에 멈춘다(읽기 전용, 스택이 없는 첫 배포는 건너뜀).
"$PYTHON" -m alembic -x allow_missing_stack=true check
sam build
sam deploy --no-confirm-changeset --no-fail-on-empty-changeset
"$PYTHON" -m alembic upgrade head
