import { expect, test } from "@playwright/test";
import { VIEWPORTS } from "./helpers";

const PAGES = ["/", "/about/", "/about/shrines/", "/about/founder/", "/news/", "/admin/"];

for (const width of VIEWPORTS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    for (const path of PAGES) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  });
}

test("mobile menu opens and reaches the About links", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/");
  await page.getByRole("button", { name: "Toggle menu" }).click();
  await page.getByRole("button", { name: "About" }).click();
  await page.getByRole("link", { name: "About Founder" }).click();
  await expect(page).toHaveURL(/\/about\/founder\/$/);
});

test("cascade card text is not clipped on a phone", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto("/");
  await expect(page.locator(".cascade-slot")).toHaveCount(13);
  const clipped = await page.locator(".cascade-card-text").evaluateAll((els) => els.map((el) => el.scrollHeight - el.clientHeight));
  expect(clipped).toHaveLength(13);
  for (const overflow of clipped) expect(overflow).toBeLessThanOrEqual(1);
});
