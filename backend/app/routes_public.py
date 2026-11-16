"""Read-only endpoints used by the public site."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_session
from app.models import News, Page, Shrine
from app.schemas import NewsOut, PageOut, ShrineOut

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/news", response_model=list[NewsOut])
def list_news(kind: str | None = None, session: Session = Depends(get_session)):
    query = select(News).order_by(News.created_at.desc(), News.id.desc())
    if kind:
        query = query.where(News.kind == kind)
    return session.scalars(query).all()


@router.get("/shrines", response_model=list[ShrineOut])
def list_shrines(session: Session = Depends(get_session)):
    return session.scalars(select(Shrine).order_by(Shrine.sort_order, Shrine.id)).all()


@router.get("/shrines/{slug}", response_model=ShrineOut)
def get_shrine(slug: str, session: Session = Depends(get_session)):
    shrine = session.scalar(select(Shrine).where(Shrine.slug == slug))
    if shrine is None:
        raise HTTPException(404, "Shrine not found")
    return shrine


@router.get("/pages/{slug}", response_model=PageOut)
def get_page(slug: str, session: Session = Depends(get_session)):
    page = session.get(Page, slug)
    if page is None:
        raise HTTPException(404, "Page not found")
    return page
