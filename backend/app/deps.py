from typing import Annotated

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.schemas.auth import User
from app.services import auth

bearer = HTTPBearer()


def current_user(credentials: Annotated[HTTPAuthorizationCredentials, Depends(bearer)]) -> User:
    return auth.get_user_by_token(credentials.credentials)


CurrentUser = Annotated[User, Depends(current_user)]
