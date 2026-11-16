"""FastAPI app: JSON API, uploaded media and the static Next.js site."""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from app import auth, config, routes_admin, routes_public
from app.db import Base, SessionLocal, engine
from db.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    Base.metadata.create_all(engine)
    with SessionLocal() as session:
        seed_if_empty(session)
    yield


app = FastAPI(title="Sri Raghavendra Granthalaya", lifespan=lifespan)
app.include_router(auth.router)
app.include_router(routes_public.router)
app.include_router(routes_admin.router)
config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/media", StaticFiles(directory=config.UPLOAD_DIR), name="media")
if config.STATIC_SITE_DIR.exists():
    app.mount("/", StaticFiles(directory=config.STATIC_SITE_DIR, html=True), name="site")
