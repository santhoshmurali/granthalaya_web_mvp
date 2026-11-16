#!/usr/bin/env bash
# Stop the containers (data volumes are kept; add -v to docker compose down to erase them).
set -euo pipefail
cd "$(dirname "$0")/.."
docker compose down
