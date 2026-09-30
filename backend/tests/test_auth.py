import sys
import time
from pathlib import Path
from types import SimpleNamespace
from typing import Self

import jwt
import pytest
from cryptography.hazmat.primitives.asymmetric import rsa
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.services import auth
from main import app

CLIENT_ID = "test-client-id"
GOOGLE_KEY = rsa.generate_private_key(public_exponent=65537, key_size=2048)
SECRET = "test-secret-at-least-32-bytes-long!"
USER_ID = "11111111-1111-1111-1111-111111111111"


class FakeConn:
    def __init__(self) -> None:
        self.params: list[tuple] = []
        self.user_exists = True

    def __enter__(self) -> Self:
        return self

    def __exit__(self, *_: object) -> None:
        pass

    def execute(self, _sql: str, params: tuple) -> SimpleNamespace:
        self.params.append(params)
        if len(params) == 3:  # upsert: (google_sub, email, name)
            row = {"id": USER_ID, "email": params[1], "name": params[2]}
        else:
            row = (
                {"id": USER_ID, "email": "a@example.com", "name": "Alice"}
                if self.user_exists
                else None
            )
        return SimpleNamespace(fetchone=lambda: row)


@pytest.fixture
def db(monkeypatch: pytest.MonkeyPatch) -> FakeConn:
    conn = FakeConn()
    monkeypatch.setenv("GOOGLE_WEB_CLIENT_ID", CLIENT_ID)
    auth._jwt_secret.cache_clear()
    auth._google_jwks.cache_clear()
    monkeypatch.setattr(auth, "_jwt_secret", lambda: SECRET)
    jwks = SimpleNamespace(
        get_signing_key_from_jwt=lambda _: SimpleNamespace(key=GOOGLE_KEY.public_key())
    )
    monkeypatch.setattr(auth, "_google_jwks", lambda: jwks)
    monkeypatch.setattr(auth, "connect", lambda: conn)
    return conn


client = TestClient(app)


def google_token(**overrides: object) -> str:
    claims = {
        "iss": "https://accounts.google.com",
        "aud": CLIENT_ID,
        "sub": "google-123",
        "email": "a@example.com",
        "name": "Alice",
        "exp": int(time.time()) + 600,
    }
    claims.update(overrides)
    claims = {k: v for k, v in claims.items() if v is not None}
    return jwt.encode(claims, GOOGLE_KEY, algorithm="RS256")


def test_login_ok(db: FakeConn) -> None:
    res = client.post("/auth/google", json={"id_token": google_token()})
    assert res.status_code == 200
    body = res.json()
    assert set(body) == {"access_token", "user"}
    assert body["user"] == {"id": USER_ID, "email": "a@example.com", "name": "Alice"}
    assert (
        jwt.decode(body["access_token"], SECRET, algorithms=["HS256"])["sub"] == USER_ID
    )
    assert db.params[0] == ("google-123", "a@example.com", "Alice")


@pytest.mark.parametrize(
    "overrides",
    [{"aud": "other"}, {"iss": "https://evil.com"}, {"exp": int(time.time()) - 600}],
    ids=["aud", "iss", "expired"],
)
def test_login_invalid_token(db: FakeConn, overrides: dict) -> None:
    res = client.post("/auth/google", json={"id_token": google_token(**overrides)})
    assert res.status_code == 401
    assert db.params == []


def test_login_without_name_saves_empty(db: FakeConn) -> None:
    res = client.post("/auth/google", json={"id_token": google_token(name=None)})
    assert res.status_code == 200
    assert db.params[0] == ("google-123", "a@example.com", "")
    assert res.json()["user"]["name"] == ""


def test_login_without_email_is_unauthorized(db: FakeConn) -> None:
    res = client.post("/auth/google", json={"id_token": google_token(email=None)})
    assert res.status_code == 401
    assert db.params == []


def test_me_ok(db: FakeConn) -> None:
    token = client.post("/auth/google", json={"id_token": google_token()}).json()[
        "access_token"
    ]
    res = client.get("/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json() == {"id": USER_ID, "email": "a@example.com", "name": "Alice"}
    assert db.params[-1] == (USER_ID,)


def test_me_returns_unauthorized_when_user_no_longer_exists(db: FakeConn) -> None:
    token = jwt.encode({"sub": USER_ID, "exp": int(time.time()) + 600}, SECRET)
    db.user_exists = False
    assert client.get("/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


@pytest.mark.parametrize(
    "headers", [{}, {"Authorization": "Bearer garbage"}], ids=["none", "bad"]
)
def test_me_unauthorized(db: FakeConn, headers: dict) -> None:
    assert client.get("/me", headers=headers).status_code == 401
