import { Page, expect } from "@playwright/test";
import { deflateSync } from "node:zlib";

export const VIEWPORTS = [375, 768, 1024, 1440];

/** Number of cascade cards currently visible on screen. */
export const visibleCards = (page: Page) =>
  page.locator(".cascade-slot").evaluateAll(
    (slots) =>
      slots.filter((s) => {
        const style = getComputedStyle(s);
        const rect = s.getBoundingClientRect();
        const onScreen = rect.top < window.innerHeight - 40 && rect.bottom > 40;
        return style.visibility === "visible" && Number(style.opacity) > 0.05 && onScreen;
      }).length,
  );

/** Scroll to the given offset in viewport heights from the top of the cascade section. */
export async function scrollIntoCascade(page: Page, viewportsFromStart: number) {
  await page.evaluate((vh) => {
    const top = document.querySelector(".cascade")!.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + vh * window.innerHeight, behavior: "instant" });
  }, viewportsFromStart);
  await page.waitForTimeout(150);
}

export async function login(page: Page) {
  await page.goto("/admin/");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("admin123");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.getByRole("heading", { name: "Content Manager" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Shrines" })).toBeVisible();
}

function crc32(buf: Buffer): number {
  let crc = ~0;
  for (const byte of buf) {
    let c = (crc ^ byte) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return ~crc >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const body = Buffer.concat([Buffer.from(type), data]);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  body.copy(out, 4);
  out.writeUInt32BE(crc32(body), 8 + data.length);
  return out;
}

/** A tiny valid 8x8 PNG of one colour, for upload tests. */
export function pngBuffer(color: [number, number, number]): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(8, 0);
  header.writeUInt32BE(8, 4);
  header[8] = 8;
  header[9] = 2;
  const row = Buffer.concat([Buffer.from([0]), Buffer.from(Array(8).fill(color).flat())]);
  const raw = Buffer.concat(Array(8).fill(row));
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([signature, pngChunk("IHDR", header), pngChunk("IDAT", deflateSync(raw)), pngChunk("IEND", Buffer.alloc(0))]);
}
