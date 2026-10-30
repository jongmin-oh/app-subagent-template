from uuid import UUID

from fastapi import APIRouter

from app.deps import CurrentUser
from app.schemas.todos import Todo, TodoCreate, TodoUpdate
from app.services import todos

router = APIRouter()

UNAUTHORIZED = {401: {"description": "Missing or invalid access token"}}
NOT_FOUND = {404: {"description": "Todo not found"}}


@router.get("/todos", response_model=list[Todo], responses=UNAUTHORIZED)
def list_todos(user: CurrentUser) -> list[Todo]:
    return todos.list_todos(user.id)


@router.post("/todos", response_model=Todo, status_code=201, responses=UNAUTHORIZED)
def create_todo(body: TodoCreate, user: CurrentUser) -> Todo:
    return todos.create_todo(user.id, body)


@router.patch("/todos/{todo_id}", response_model=Todo, responses={**UNAUTHORIZED, **NOT_FOUND})
def update_todo(todo_id: UUID, body: TodoUpdate, user: CurrentUser) -> Todo:
    return todos.update_todo(user.id, todo_id, body)


@router.delete("/todos/{todo_id}", status_code=204, responses={**UNAUTHORIZED, **NOT_FOUND})
def delete_todo(todo_id: UUID, user: CurrentUser) -> None:
    todos.delete_todo(user.id, todo_id)
