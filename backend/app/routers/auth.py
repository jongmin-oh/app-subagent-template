from typing import Annotated

from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.auth import GoogleLoginRequest, LoginResponse, User
from app.services import auth

router = APIRouter()
bearer = HTTPBearer()


@router.post(
    "/auth/google",
    response_model=LoginResponse,
    responses={401: {"description": "Invalid Google ID token"}},
)
def login_google(body: GoogleLoginRequest) -> LoginResponse:
    token, user = auth.login_with_google(body.id_token)
    return LoginResponse(access_token=token, user=user)


@router.get(
    "/me",
    response_model=User,
    responses={401: {"description": "Missing or invalid access token"}},
)
def me(credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)]) -> User:
    return auth.get_user_by_token(credentials.credentials)
