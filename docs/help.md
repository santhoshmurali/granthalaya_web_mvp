# Help

## Run with Docker (app + Postgres)
```
scripts/start_mac.sh      # builds, starts, prints the URL
scripts/stop_mac.sh       # stops (data volumes are kept)
```
Open http://localhost:8000. On first start the database is seeded from `content/`.

## Run locally without Docker (SQLite)
```
cd frontend && npm install && npm run build      # creates frontend/out
cd ../backend && uv run uvicorn app.main:app --port 8000
```
Data lives in `backend/data/` (git-ignored). Delete it to re-seed.

## Use the content manager
1. Open `/admin/` and log in (`admin` / `admin123`).
2. **News and Alerts**: choose News or Alert, add a title and details, Publish. Alerts also show in the banner at the top of every page. Use Edit or Delete on the list.
3. **Shrines**: Add shrine, or Edit an existing one. Fill title, short summary (landing card), full description (blank line between paragraphs) and display order. Under Images, use "Replace image N" to swap a picture, Remove to delete it, or "Add image". The first image is the card cover.
4. **Pages**: pick Landing highlight, About Granthalaya or About Founder. Content is markdown. Images work the same as for shrines.

Changes appear on the public site immediately (pages read live from the API).

## Tests
```
cd backend && uv run pytest                                   # SQLite
docker compose -f test/docker-compose.test.yml up -d --wait   # Postgres run:
TEST_DATABASE_URL=postgresql+psycopg://test:test@localhost:5433/test uv run pytest
cd frontend && npm run build
cd ../test && npm install && npx playwright install chromium && npx playwright test
```
The E2E run starts its own server with a fresh SQLite database.

## Design notes
Palette: palm-leaf paper, kumkum red (actions), marigold, Tungabhadra green (news), black-stone footer; all text pairs 6:1 or better. Fonts (Marcellus headings, Hind body) are bundled with `@fontsource`, no runtime Google call. Hero portrait sits in an arched temple-niche frame; shrine cards stack like folios and the top card leaves first. Tokens live at the top of `frontend/app/globals.css`.

## Lessons learnt
- `ui-ux-pro-max` design-system search returned off-brief results (blue SaaS, purple "church") for a temple; use its UX checklists, pick palette and type from the subject.
- `pkill -f <pattern>` can match your own shell command line and kill it. Use `pkill -f "[u]vicorn ..."`.
- A scroll-driven card is "visible" to CSS long before it is on screen; E2E checks must test the bounding box, not just `visibility`.
- Lazy-loaded images report `naturalWidth` 0 until scrolled into view; force `loading=eager` before checking for broken images.
- TypeScript 6+ rejects `baseUrl`; use `paths` alone.
- Keep the sticky header a fixed height (the cascade pins below it); a wrapping brand name broke the offset on phones.
