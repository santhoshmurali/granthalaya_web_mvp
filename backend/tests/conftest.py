"""Test fixtures: fresh SQLite database and upload folder per test."""
import os
import tempfile

TEST_DIR = tempfile.mkdtemp()
os.environ["DATABASE_URL"] = os.environ.get("TEST_DATABASE_URL", f"sqlite:///{TEST_DIR}/test.db")
os.environ["UPLOAD_DIR"] = f"{TEST_DIR}/uploads"
os.environ["STATIC_SITE_DIR"] = f"{TEST_DIR}/no-site"

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.db import Base, engine  # noqa: E402
from app.main import app  # noqa: E402


@pytest.fixture
def client():
    Base.metadata.drop_all(engine)
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture
def admin(client):
    client.post("/api/login", json={"username": "admin", "password": "admin123"})
    return client
