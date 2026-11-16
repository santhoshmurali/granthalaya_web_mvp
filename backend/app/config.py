"""Runtime settings read from environment variables."""
import os
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent.parent
REPO_DIR = BACKEND_DIR.parent

DATABASE_URL = os.environ.get("DATABASE_URL", f"sqlite:///{BACKEND_DIR}/data/granthalaya.db")
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
SECRET_KEY = os.environ.get("SECRET_KEY", "local-development-secret")
UPLOAD_DIR = Path(os.environ.get("UPLOAD_DIR", BACKEND_DIR / "data" / "uploads"))
STATIC_SITE_DIR = Path(os.environ.get("STATIC_SITE_DIR", REPO_DIR / "frontend" / "out"))
CONTENT_DIR = Path(os.environ.get("CONTENT_DIR", REPO_DIR / "content" / "static"))
SESSION_COOKIE = "granthalaya_session"
SESSION_MAX_AGE_SECONDS = 8 * 3600
