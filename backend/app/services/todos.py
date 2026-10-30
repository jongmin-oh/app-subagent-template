from uuid import UUID

from fastapi import HTTPException

from app.schemas.todos import Todo, TodoCreate, TodoUpdate
from app.services.db import connect


def _not_found() -> HTTPException:
    return HTTPException(status_code=404, detail="Todo not found")


def list_todos(user_id: str) -> list[Todo]:
    with connect() as conn:
        rows = conn.execute(
            "SELECT id, title, done, created_at FROM todos WHERE user_id = %s ORDER BY created_at",
            (user_id,),
        ).fetchall()
    return [Todo(**row) for row in rows]


def create_todo(user_id: str, body: TodoCreate) -> Todo:
    with connect() as conn:
        row = conn.execute(
            "INSERT INTO todos (user_id, title) VALUES (%s, %s) RETURNING id, title, done, created_at",
            (user_id, body.title),
        ).fetchone()
    return Todo(**row)


def update_todo(user_id: str, todo_id: UUID, body: TodoUpdate) -> Todo:
    with connect() as conn:
        row = conn.execute(
            """
            UPDATE todos SET title = COALESCE(%s, title), done = COALESCE(%s, done)
            WHERE id = %s AND user_id = %s
            RETURNING id, title, done, created_at
            """,
            (body.title, body.done, todo_id, user_id),
        ).fetchone()
    if row is None:
        raise _not_found()
    return Todo(**row)


def delete_todo(user_id: str, todo_id: UUID) -> None:
    with connect() as conn:
        row = conn.execute(
            "DELETE FROM todos WHERE id = %s AND user_id = %s RETURNING id",
            (todo_id, user_id),
        ).fetchone()
    if row is None:
        raise _not_found()
