#!/usr/bin/env bash
# Build and start the app and Postgres in Docker, then print the URL.
set -euo pipefail
cd "$(dirname "$0")/.."
[ -f .env ] || cp .env.example .env
docker compose up --build -d
PORT=$(grep -E '^APP_PORT=' .env | cut -d= -f2 || true)
echo "Granthalaya is starting at http://localhost:${PORT:-8000}  (content manager: /admin/, admin / admin123)"
