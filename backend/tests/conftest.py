import tempfile
from datetime import UTC, datetime, timedelta

import jwt
import pixeltable_pgserver
import psycopg
import pytest
from fastapi.testclient import TestClient

from main import app
from scripts.dev_db import apply_schema

JWT_SECRET = "test-secret-test-secret-test-secret"


@pytest.fixture(scope="session")
def database_url():
    # unix 소켓 경로 길이 제한(macOS 104자) 때문에 pytest의 tmp_path 대신 짧은 임시 경로를 쓴다.
    server = pixeltable_pgserver.get_server(tempfile.mkdtemp(), cleanup_mode="delete")
    apply_schema(server.get_uri())
    yield server.get_uri()
    server.cleanup()


@pytest.fixture(autouse=True)
def db(database_url, monkeypatch):
    monkeypatch.setenv("DATABASE_URL", database_url)
    monkeypatch.setenv("JWT_SECRET", JWT_SECRET)
    with psycopg.connect(database_url, autocommit=True) as conn:
        tables = [r[0] for r in conn.execute("SELECT tablename FROM pg_tables WHERE schemaname = 'public'")]
        conn.execute(f"TRUNCATE {', '.join(tables)} CASCADE")
    return database_url


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def sign_in(db):
    def _sign_in(email: str) -> dict[str, str]:
        with psycopg.connect(db) as conn:
            user_id = conn.execute(
                "INSERT INTO users (google_sub, email, name) VALUES (%s, %s, 'Test User') RETURNING id::text",
                (f"sub-{email}", email),
            ).fetchone()[0]
        token = jwt.encode({"sub": user_id, "exp": datetime.now(UTC) + timedelta(hours=1)}, JWT_SECRET, "HS256")
        return {"Authorization": f"Bearer {token}"}

    return _sign_in
