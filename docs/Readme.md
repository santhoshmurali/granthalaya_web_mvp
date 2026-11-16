# Sri Raghavendra Granthalaya Website (MVP)

A website for Sri Raghavendra Granthalaya and its founder, Amman Sathiyanathan. Public pages plus a password-protected content manager.

## Stack
- Frontend: Next.js (TypeScript), static export, served by FastAPI
- Backend: FastAPI + SQLAlchemy, managed with `uv`
- Database: PostgreSQL (Docker); SQLite for local runs and unit tests
- One Docker image (Node build stage, then Python), plus Postgres via docker compose

## Layout
```
backend/    FastAPI app (app/), seed data and logic (db/), pytest tests (tests/)
frontend/   Next.js project (app/, components/, lib/)
content/    Source content: docx translation, founder markdown, images
test/       Playwright E2E tests, Postgres compose file for backend tests
scripts/    start_mac.sh, stop_mac.sh
docs/       Readme.md, help.md
plan/       PLAN.md (specification)
```

## Pages
| URL | Content |
| --- | --- |
| `/` | Highlight, cascading shrine cards, founder teaser, news |
| `/about/` | About Granthalaya |
| `/about/shrines/` | All shrines (each has an anchor, `#slug`) |
| `/about/founder/` | About the founder |
| `/news/` | News and alerts |
| `/admin/` | Content manager (default `admin` / `admin123`) |

## Run
`scripts/start_mac.sh` then open http://localhost:8000. See `help.md` for local development and tests.

## Status
Implemented and tested: 11 backend tests (SQLite and Postgres), 21 Playwright tests (375/768/1024/1440 px, reduced motion, admin flows), Docker image build and run.
