"""로컬 개발용 Postgres를 띄우고 docs/db-schema.md의 DDL을 적용한 뒤 DATABASE_URL을 출력합니다.

사용법: DATABASE_URL=$(../.venv/bin/python scripts/dev_db.py)   종료: scripts/dev_db.py --stop
"""

import re
import sys
from pathlib import Path

import pixeltable_pgserver
import psycopg

BACKEND_DIR = Path(__file__).resolve().parents[1]
SCHEMA_DOC = BACKEND_DIR.parent / "docs" / "db-schema.md"
DATA_DIR = BACKEND_DIR / ".local-db"


def apply_schema(url: str) -> None:
    blocks = re.findall(r"```sql\n(.*?)```", SCHEMA_DOC.read_text(), re.DOTALL)
    with psycopg.connect(url, autocommit=True) as conn:
        for block in blocks:
            # DSQL 전용 문법이라 일반 Postgres에서는 동기 인덱스로 바꿔 실행한다.
            conn.execute(block.replace("INDEX ASYNC", "INDEX"))


if __name__ == "__main__":
    server = pixeltable_pgserver.get_server(DATA_DIR, cleanup_mode=None)
    if "--stop" in sys.argv:
        server.stop()
    else:
        apply_schema(server.get_uri())
        print(server.get_uri())
