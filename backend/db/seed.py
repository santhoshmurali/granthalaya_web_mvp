"""Seed the database from content/static on first start (only when empty)."""
import json
import re
import shutil
from pathlib import Path

from sqlalchemy import select
from sqlalchemy.orm import Session

from app import config
from app.models import News, Page, Shrine

SEED_DIR = Path(__file__).parent / "seed_data"
IMAGE_FOLDERS = ["About Shrines", "Landing Page - Shrines", "About Granthalaya",
                 "Landing Page - About Granthalaya", "About Founder"]

HOME_SUMMARY = (
    "Sri Raghavendra Granthalaya is a temple founded upon sacred books, a living replica of "
    "Mantralayam rising near Poondi Lake in Tiruvallur. Begun by Amman Sathiyanathan at the "
    "prompting of Guru Raja, it brings the saint's story to life in stone, with the mantra: "
    "within Granthalaya there shall be a Mantralayam."
)
FOUNDER_SUMMARY = (
    "Amman H. Sathiyanathan has spent over four decades researching and writing about Sri "
    "Raghavendra Swamy, authoring dozens of books, penning devotional hymns and founding the "
    "trusts that serve readers, students and the hungry."
)
ABOUT_IMAGES = ["IMG-20170315-WA0021.jpg", "Rayar Brindhavana.jpg", "Nijaroopar.jpg"]
FOUNDER_IMAGES = ["About Author.jpg"]
FIRST_ALERT = ("Visiting hours", "Please check this page for alerts about timings and special events.")


def safe_name(original: str) -> str:
    """Web-friendly file name: 'SRI VARAHA SWAMI.jpg' -> 'sri-varaha-swami.jpg'."""
    stem, suffix = Path(original).stem, Path(original).suffix.lower()
    return re.sub(r"[^a-z0-9]+", "-", stem.lower()).strip("-") + suffix


def copy_images() -> None:
    """Copy every source image into the upload folder under its safe name."""
    config.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    for folder in IMAGE_FOLDERS:
        for source in (config.CONTENT_DIR / "images" / folder).glob("*.jpg"):
            shutil.copyfile(source, config.UPLOAD_DIR / safe_name(source.name))


def founder_markdown() -> str:
    """Founder source markdown without its H1 and with 'Page N:' prefixes removed."""
    text = (config.CONTENT_DIR / "amman_h_sathiyanathan.md").read_text(encoding="utf-8")
    text = re.sub(r"\A# .*\n+", "", text)
    return re.sub(r"^## Page \d+: ", "## ", text, flags=re.MULTILINE)


def seed_pages(session: Session) -> None:
    about = (SEED_DIR / "about.md").read_text(encoding="utf-8")
    session.add_all([
        Page(slug="home", title="A Replica of Mantralayam, Fragrant with Devotion",
             summary=HOME_SUMMARY, images=[safe_name("Rayar Brindhavana.jpg")]),
        Page(slug="about", title="About Granthalaya", summary="", body=about,
             images=[safe_name(name) for name in ABOUT_IMAGES]),
        Page(slug="founder", title="Amman H. Sathiyanathan", summary=FOUNDER_SUMMARY,
             body=founder_markdown(), images=[safe_name(name) for name in FOUNDER_IMAGES]),
    ])


def seed_shrines(session: Session) -> None:
    shrines = json.loads((SEED_DIR / "shrines.json").read_text(encoding="utf-8"))
    for order, item in enumerate(shrines, start=1):
        slug = re.sub(r"[^a-z0-9]+", "-", item["title"].lower()).strip("-")[:80]
        images = [safe_name(name) for name in item["images"]]
        session.add(Shrine(slug=slug, title=item["title"], summary=item["summary"],
                           body=item["body"], images=images, sort_order=order))


def seed_if_empty(session: Session) -> None:
    if session.scalar(select(Page.slug).limit(1)) is not None:
        return
    copy_images()
    seed_pages(session)
    seed_shrines(session)
    session.add(News(kind="alert", title=FIRST_ALERT[0], body=FIRST_ALERT[1]))
    session.commit()
