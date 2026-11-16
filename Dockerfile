# Stage 1: build the static Next.js site
FROM node:22-slim AS frontend
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: FastAPI app serving the API, uploads and the static site
FROM python:3.12-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv
WORKDIR /app/backend
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev
COPY backend/ ./
COPY content/static /app/content/static
COPY --from=frontend /frontend/out /app/frontend/out
ENV CONTENT_DIR=/app/content/static \
    STATIC_SITE_DIR=/app/frontend/out \
    UPLOAD_DIR=/data/uploads
VOLUME /data
EXPOSE 8000
CMD ["uv", "run", "--no-sync", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
