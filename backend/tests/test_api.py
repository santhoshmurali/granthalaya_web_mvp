"""API tests: seed content, auth, CRUD and image upload."""
import io

from PIL import Image


def png_bytes(size=(40, 30)) -> bytes:
    buffer = io.BytesIO()
    Image.new("RGB", size, "orange").save(buffer, "PNG")
    return buffer.getvalue()


def test_seed_content(client):
    shrines = client.get("/api/shrines").json()
    assert len(shrines) == 13
    assert all(s["images"] for s in shrines)
    for slug in ("home", "about", "founder"):
        assert client.get(f"/api/pages/{slug}").status_code == 200
    assert "| Category |" in client.get("/api/pages/founder").json()["body"]
    assert client.get("/api/pages/missing").status_code == 404


def test_seeded_images_are_served(client):
    image = client.get("/api/shrines").json()[0]["images"][0]
    response = client.get(f"/media/{image}")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/jpeg"


def test_admin_routes_require_login(client):
    assert client.post("/api/news", json={"title": "x"}).status_code == 401
    assert client.put("/api/pages/about", json={"title": "x"}).status_code == 401
    assert client.post("/api/uploads", files={"file": ("a.png", png_bytes())}).status_code == 401
    assert client.get("/api/me").status_code == 401


def test_login_rejects_bad_password(client):
    response = client.post("/api/login", json={"username": "admin", "password": "wrong"})
    assert response.status_code == 401


def test_login_logout(client):
    assert client.post("/api/login", json={"username": "admin", "password": "admin123"}).status_code == 200
    assert client.get("/api/me").json() == {"username": "admin"}
    client.post("/api/logout")
    assert client.get("/api/me").status_code == 401


def test_news_crud(admin):
    created = admin.post("/api/news", json={"kind": "alert", "title": "Closed", "body": "Today"}).json()
    assert admin.get("/api/news?kind=alert").json()[0]["title"] == "Closed"
    admin.put(f"/api/news/{created['id']}", json={"kind": "news", "title": "Open", "body": ""})
    assert "Closed" not in [n["title"] for n in admin.get("/api/news?kind=alert").json()]
    assert admin.get("/api/news?kind=news").json()[0]["title"] == "Open"
    assert admin.delete(f"/api/news/{created['id']}").status_code == 204
    assert admin.delete(f"/api/news/{created['id']}").status_code == 404


def test_news_rejects_bad_kind(admin):
    assert admin.post("/api/news", json={"kind": "spam", "title": "x"}).status_code == 422


def test_shrine_crud_unique_slug(admin):
    first = admin.post("/api/shrines", json={"title": "New Shrine"}).json()
    second = admin.post("/api/shrines", json={"title": "New Shrine"}).json()
    assert first["slug"] == "new-shrine" and second["slug"] == "new-shrine-2"
    updated = admin.put(f"/api/shrines/{first['id']}", json={"title": "Renamed", "summary": "s"}).json()
    assert updated["title"] == "Renamed" and updated["slug"] == "new-shrine"
    assert admin.delete(f"/api/shrines/{first['id']}").status_code == 204
    assert admin.get("/api/shrines/new-shrine").status_code == 404


def test_page_update(admin):
    admin.put("/api/pages/about", json={"title": "About Us", "body": "Hello"})
    assert admin.get("/api/pages/about").json()["title"] == "About Us"


def test_upload_image_and_replace_on_shrine(admin):
    name = admin.post("/api/uploads", files={"file": ("pic.png", png_bytes())}).json()["file"]
    assert admin.get(f"/media/{name}").status_code == 200
    shrine = admin.get("/api/shrines").json()[0]
    admin.put(f"/api/shrines/{shrine['id']}", json={**shrine, "images": [name]})
    assert admin.get(f"/api/shrines/{shrine['slug']}").json()["images"] == [name]


def test_upload_rejects_non_image(admin):
    response = admin.post("/api/uploads", files={"file": ("a.txt", b"not an image")})
    assert response.status_code == 400


def test_login_with_non_ascii_credentials_is_401_not_500(client):
    response = client.post("/api/login", json={"username": "ராம்", "password": "pässword"})
    assert response.status_code == 401


def test_upload_truncated_image_is_400(admin):
    truncated = png_bytes((200, 200))[:60]
    assert admin.post("/api/uploads", files={"file": ("a.png", truncated)}).status_code == 400


def test_news_created_at_has_utc_offset(admin):
    created = admin.post("/api/news", json={"title": "t"}).json()
    assert created["created_at"].endswith(("Z", "+00:00"))
    assert admin.get("/api/news").json()[0]["created_at"].endswith(("Z", "+00:00"))
