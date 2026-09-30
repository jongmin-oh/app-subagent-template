import os
from functools import lru_cache
from typing import Any

import boto3
import psycopg
from psycopg.rows import dict_row


@lru_cache
def _dsql_client() -> Any:
    return boto3.client("dsql")


def connect() -> psycopg.Connection:
    # ponytail: 요청마다 새 연결. 지연이 문제되면 연결 재사용(토큰 15분, 연결 1시간 만료 고려)
    host = os.environ["DSQL_ENDPOINT"]
    return psycopg.connect(
        host=host,
        user="admin",
        dbname="postgres",
        password=_dsql_client().generate_db_connect_admin_auth_token(host),
        sslmode="require",
        row_factory=dict_row,
    )
