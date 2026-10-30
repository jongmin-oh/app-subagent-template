import psycopg


def test_me_returns_signed_in_user(client, sign_in):
    resp = client.get("/me", headers=sign_in("a@example.com"))

    assert resp.status_code == 200
    assert resp.json()["email"] == "a@example.com"


def test_me_without_token_is_unauthorized(client):
    assert client.get("/me").status_code == 401


def test_me_with_garbage_token_is_unauthorized(client):
    resp = client.get("/me", headers={"Authorization": "Bearer not-a-jwt"})

    assert resp.status_code == 401


def test_me_for_deleted_user_is_unauthorized(client, sign_in, db):
    headers = sign_in("gone@example.com")
    with psycopg.connect(db) as conn:
        conn.execute("DELETE FROM users")

    assert client.get("/me", headers=headers).status_code == 401
