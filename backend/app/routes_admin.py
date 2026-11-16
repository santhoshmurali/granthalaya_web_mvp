"""Content-manager endpoints; every route requires a logged-in admin."""
import re

from fastapi import APIRouter, Depends, HTTPException, UploadFile
from sqlalchemy import select
from sqlalchemy.orm import Session

from app import config
from app.auth import require_admin
from app.db import get_session
from app.images import save_upload
from app.models import News, Page, Shrine
from app.schemas import NewsIn, NewsOut, PageIn, PageOut, ShrineIn, ShrineOut

router = APIRouter(prefix="/api", tags=["admin"], dependencies=[Depends(require_admin)])


def make_unique_slug(session: Session, title: str) -> str:
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")[:80] or "shrine"
    slug, counter = base, 2
    while session.scalar(select(Shrine).where(Shrine.slug == slug)):
        slug, counter = f"{base}-{counter}", counter + 1
    return slug


def get_or_404(session: Session, model, key):
    row = session.get(model, key)
    if row is None:
        raise HTTPException(404, f"{model.__name__} not found")
    return row


@router.post("/news", response_model=NewsOut, status_code=201)
def create_news(data: NewsIn, session: Session = Depends(get_session)):
    row = News(**data.model_dump())
    session.add(row)
    session.commit()
    return row


@router.put("/news/{news_id}", response_model=NewsOut)
def update_news(news_id: int, data: NewsIn, session: Session = Depends(get_session)):
    row = get_or_404(session, News, news_id)
    for field, value in data.model_dump().items():
        setattr(row, field, value)
    session.commit()
    return row


@router.delete("/news/{news_id}", status_code=204)
def delete_news(news_id: int, session: Session = Depends(get_session)):
    session.delete(get_or_404(session, News, news_id))
    session.commit()


@router.post("/shrines", response_model=ShrineOut, status_code=201)
def create_shrine(data: ShrineIn, session: Session = Depends(get_session)):
    row = Shrine(slug=make_unique_slug(session, data.title), **data.model_dump())
    session.add(row)
    session.commit()
    return row


@router.put("/shrines/{shrine_id}", response_model=ShrineOut)
def update_shrine(shrine_id: int, data: ShrineIn, session: Session = Depends(get_session)):
    row = get_or_404(session, Shrine, shrine_id)
    for field, value in data.model_dump().items():
        setattr(row, field, value)
    session.commit()
    return row


@router.delete("/shrines/{shrine_id}", status_code=204)
def delete_shrine(shrine_id: int, session: Session = Depends(get_session)):
    session.delete(get_or_404(session, Shrine, shrine_id))
    session.commit()


@router.put("/pages/{slug}", response_model=PageOut)
def update_page(slug: str, data: PageIn, session: Session = Depends(get_session)):
    row = get_or_404(session, Page, slug)
    for field, value in data.model_dump().items():
        setattr(row, field, value)
    session.commit()
    return row


@router.post("/uploads", status_code=201)
def upload_image(file: UploadFile):
    return {"file": save_upload(file, config.UPLOAD_DIR)}
