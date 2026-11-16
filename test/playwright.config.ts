import { defineConfig } from "@playwright/test";
import os from "node:os";
import path from "node:path";

const RUN_DIR = path.join(os.tmpdir(), "granthalaya-e2e");
const PORT = 8099;
const EXTERNAL_URL = process.env.E2E_BASE_URL; // e.g. a running Docker stack; skips the local server

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  fullyParallel: false,
  reporter: [["list"]],
  use: { baseURL: EXTERNAL_URL ?? `http://localhost:${PORT}`, headless: true },
  webServer: EXTERNAL_URL ? undefined : {
    command: `rm -rf ${RUN_DIR} && mkdir -p ${RUN_DIR} && cd ../backend && DATABASE_URL=sqlite:///${RUN_DIR}/e2e.db UPLOAD_DIR=${RUN_DIR}/uploads uv run uvicorn app.main:app --port ${PORT}`,
    url: `http://localhost:${PORT}/api/shrines`,
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
