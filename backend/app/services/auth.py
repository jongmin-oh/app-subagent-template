import os
from datetime import UTC, datetime, timedelta
from functools import lru_cache

import boto3
import jwt
from fastapi import HTTPException

from app.schemas.auth import User
from app.services.db import connect

GOOGLE_ISSUERS = ["accounts.google.com", "https://accounts.google.com"]
JWT_SECRET_NAME = "/backend-template/JWT_SECRET"
TOKEN_TTL = timedelta(days=30)


@lru_cache
def _google_jwks() -> jwt.PyJWKClient:
    return jwt.PyJWKClient("https://www.googleapis.com/oauth2/v3/certs")


@lru_cache
def _jwt_secret() -> str:
    resp = boto3.client("ssm").get_parameter(Name=JWT_SECRET_NAME, WithDecryption=True)
    return resp["Parameter"]["Value"]


def _unauthorized() -> HTTPException:
    return HTTPException(status_code=401, detail="Invalid token")


def _verify_google_token(id_token: str) -> dict:
    try:
        key = _google_jwks().get_signing_key_from_jwt(id_token).key
        return jwt.decode(
            id_token,
            key,
            algorithms=["RS256"],
            audience=os.environ["GOOGLE_WEB_CLIENT_ID"],
            issuer=GOOGLE_ISSUERS,
            options={"require": ["exp", "iss", "aud", "sub", "email"]},
        )
    except jwt.PyJWTError as e:
        raise _unauthorized() from e


def _upsert_user(google_sub: str, email: str, name: str) -> User:
    with connect() as conn:
        row = conn.execute(
            """
            INSERT INTO users (google_sub, email, name) VALUES (%s, %s, %s)
            ON CONFLICT (google_sub) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name
            RETURNING id::text, email, name
            """,
            (google_sub, email, name),
        ).fetchone()
    return User(**row)


def login_with_google(id_token: str) -> tuple[str, User]:
    claims = _verify_google_token(id_token)
    user = _upsert_user(claims["sub"], claims["email"], claims.get("name", ""))
    exp = datetime.now(UTC) + TOKEN_TTL
    token = jwt.encode({"sub": user.id, "exp": exp}, _jwt_secret(), algorithm="HS256")
    return token, user


def get_user_by_token(access_token: str) -> User:
    try:
        claims = jwt.decode(
            access_token,
            _jwt_secret(),
            algorithms=["HS256"],
            options={"require": ["exp", "sub"]},
        )
    except jwt.PyJWTError as e:
        raise _unauthorized() from e
    with connect() as conn:
        row = conn.execute(
            "SELECT id::text, email, name FROM users WHERE id = %s", (claims["sub"],)
        ).fetchone()
    if row is None:
        raise _unauthorized()
    return User(**row)
