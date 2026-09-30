from pydantic import BaseModel


class GoogleLoginRequest(BaseModel):
    id_token: str


class User(BaseModel):
    id: str
    email: str
    name: str


class LoginResponse(BaseModel):
    access_token: str
    user: User
