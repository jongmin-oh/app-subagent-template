from datetime import datetime
from typing import Annotated
from uuid import UUID

from pydantic import BaseModel, StringConstraints

Title = Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=200)]


class Todo(BaseModel):
    id: UUID
    title: str
    done: bool
    created_at: datetime


class TodoCreate(BaseModel):
    title: Title


class TodoUpdate(BaseModel):
    title: Title | None = None
    done: bool | None = None
