"""Pydantic request/response models."""
from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


class Out(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class LoginIn(BaseModel):
    username: str
    password: str


class NewsIn(BaseModel):
    kind: Literal["news", "alert"] = "news"
    title: str = Field(min_length=1, max_length=200)
    body: str = ""


class NewsOut(Out, NewsIn):
    id: int
    created_at: datetime

    @field_validator("created_at")
    @classmethod
    def assume_utc(cls, value: datetime) -> datetime:
        """SQLite returns naive datetimes; they are stored as UTC."""
        return value if value.tzinfo else value.replace(tzinfo=timezone.utc)


class ShrineIn(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    summary: str = ""
    body: str = ""
    images: list[str] = []
    sort_order: int = 0


class ShrineOut(Out, ShrineIn):
    id: int
    slug: str


class PageIn(BaseModel):
    title: str = Field(min_length=1, max_length=300)
    summary: str = ""
    body: str = ""
    images: list[str] = []


class PageOut(Out, PageIn):
    slug: str
