"""Signed-cookie login for the content manager."""
import secrets

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response
from itsdangerous import BadSignature, URLSafeTimedSerializer

from app import config
from app.schemas import LoginIn

router = APIRouter(prefix="/api", tags=["auth"])
signer = URLSafeTimedSerializer(config.SECRET_KEY, salt="session")


def require_admin(granthalaya_session: str | None = Cookie(default=None)) -> str:
    """Dependency: return the username or raise 401."""
    try:
        return signer.loads(granthalaya_session or "", max_age=config.SESSION_MAX_AGE_SECONDS)
    except BadSignature:
        raise HTTPException(401, "Login required")


@router.post("/login")
def login(credentials: LoginIn, response: Response):
    user_ok = secrets.compare_digest(credentials.username.encode(), config.ADMIN_USERNAME.encode())
    pass_ok = secrets.compare_digest(credentials.password.encode(), config.ADMIN_PASSWORD.encode())
    if not (user_ok and pass_ok):
        raise HTTPException(401, "Invalid username or password")
    response.set_cookie(
        config.SESSION_COOKIE, signer.dumps(credentials.username),
        httponly=True, samesite="lax", max_age=config.SESSION_MAX_AGE_SECONDS,
    )
    return {"username": credentials.username}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(config.SESSION_COOKIE)
    return {"ok": True}


@router.get("/me")
def me(username: str = Depends(require_admin)):
    return {"username": username}
