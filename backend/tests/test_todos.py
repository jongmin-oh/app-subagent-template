import pytest

MISSING = "00000000-0000-0000-0000-000000000000"


@pytest.fixture
def alice(sign_in):
    return sign_in("alice@example.com")


@pytest.fixture
def bob(sign_in):
    return sign_in("bob@example.com")


def test_requires_token(client):
    assert client.get("/todos").status_code == 401
    assert client.get("/todos", headers={"Authorization": "Bearer nope"}).status_code == 401


def test_crud_happy_path(client, alice):
    assert client.get("/todos", headers=alice).json() == []

    first = client.post("/todos", json={"title": "milk"}, headers=alice)
    assert first.status_code == 201
    assert first.json()["title"] == "milk"
    assert first.json()["done"] is False
    client.post("/todos", json={"title": "eggs"}, headers=alice)

    listed = client.get("/todos", headers=alice).json()
    assert [t["title"] for t in listed] == ["milk", "eggs"]

    todo_id = first.json()["id"]
    patched = client.patch(f"/todos/{todo_id}", json={"title": "oat milk", "done": True}, headers=alice)
    assert patched.status_code == 200
    assert patched.json()["title"] == "oat milk"
    assert patched.json()["done"] is True

    assert client.delete(f"/todos/{todo_id}", headers=alice).status_code == 204
    assert [t["title"] for t in client.get("/todos", headers=alice).json()] == ["eggs"]


def test_patch_with_only_done_keeps_title(client, alice):
    todo = client.post("/todos", json={"title": "milk"}, headers=alice).json()

    patched = client.patch(f"/todos/{todo['id']}", json={"done": True}, headers=alice).json()

    assert patched["title"] == "milk"
    assert patched["done"] is True


def test_patch_with_only_title_keeps_done(client, alice):
    todo = client.post("/todos", json={"title": "milk"}, headers=alice).json()
    client.patch(f"/todos/{todo['id']}", json={"done": True}, headers=alice)

    patched = client.patch(f"/todos/{todo['id']}", json={"title": " soy "}, headers=alice).json()

    assert patched["title"] == "soy"
    assert patched["done"] is True


def test_title_is_trimmed(client, alice):
    created = client.post("/todos", json={"title": "  milk  "}, headers=alice)

    assert created.json()["title"] == "milk"


@pytest.mark.parametrize("title", ["", "   ", "x" * 201])
def test_invalid_title_is_rejected(client, alice, title):
    assert client.post("/todos", json={"title": title}, headers=alice).status_code == 422
    assert client.get("/todos", headers=alice).json() == []


def test_blank_title_on_patch_is_rejected(client, alice):
    todo = client.post("/todos", json={"title": "milk"}, headers=alice).json()

    assert client.patch(f"/todos/{todo['id']}", json={"title": "  "}, headers=alice).status_code == 422


def test_users_cannot_touch_each_others_todos(client, alice, bob):
    todo = client.post("/todos", json={"title": "secret"}, headers=alice).json()

    assert client.get("/todos", headers=bob).json() == []
    assert client.patch(f"/todos/{todo['id']}", json={"done": True}, headers=bob).status_code == 404
    assert client.delete(f"/todos/{todo['id']}", headers=bob).status_code == 404

    [still] = client.get("/todos", headers=alice).json()
    assert still["title"] == "secret"
    assert still["done"] is False


def test_missing_todo_is_404(client, alice):
    assert client.patch(f"/todos/{MISSING}", json={"done": True}, headers=alice).status_code == 404
    assert client.delete(f"/todos/{MISSING}", headers=alice).status_code == 404


def test_malformed_id_is_422(client, alice):
    assert client.delete("/todos/not-a-uuid", headers=alice).status_code == 422
