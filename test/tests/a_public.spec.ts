import { expect, test } from "@playwright/test";
import { scrollIntoCascade, visibleCards } from "./helpers";

test("landing shows highlight text and link to About", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Replica of Mantralayam");
  await expect(page.locator(".hero-summary")).toContainText("temple founded upon sacred books");
  await page.locator(".hero").getByRole("link", { name: "About Granthalaya" }).click();
  await expect(page).toHaveURL(/\/about\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("About Granthalaya");
});

test("shrine cards cascade up from the bottom and then all disappear", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".cascade-slot")).toHaveCount(13);
  await scrollIntoCascade(page, 0);
  expect(await visibleCards(page)).toBe(0);

  await scrollIntoCascade(page, 2.2);
  const midway = await visibleCards(page);
  expect(midway).toBeGreaterThanOrEqual(2);
  expect(midway).toBeLessThan(13);

  await scrollIntoCascade(page, 7.4);
  expect(await visibleCards(page)).toBeGreaterThanOrEqual(10);

  await page.evaluate(() => {
    const section = document.querySelector(".cascade")!;
    window.scrollTo({ top: section.getBoundingClientRect().bottom + window.scrollY - window.innerHeight, behavior: "instant" });
  });
  await page.waitForTimeout(150);
  expect(await visibleCards(page)).toBe(0);
});

test("a shrine card links to its place on the shrines page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".cascade-slot")).toHaveCount(13);
  await scrollIntoCascade(page, 0.9);
  await page.locator(".cascade-slot").first().getByRole("link", { name: /Visit this shrine/ }).click();
  await expect(page).toHaveURL(/\/about\/shrines\/#sri-dvaraka-krishna-sri-rukmini/);
  await expect(page.locator('article[id^="sri-dvaraka-krishna-sri-rukmini"]')).toBeInViewport();
});

test("founder teaser links to the founder page", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".founder-teaser img")).toBeVisible();
  await page.getByRole("link", { name: /Read more about the founder/ }).click();
  await expect(page).toHaveURL(/\/about\/founder\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Amman H. Sathiyanathan");
  await expect(page.locator("table")).toBeVisible();
  await expect(page.locator(".gallery img").first()).toBeVisible();
});

test("About menu groups the three pages", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "About" }).click();
  for (const name of ["About Granthalaya", "Shrines", "About Founder"]) {
    await expect(page.locator(".dropdown-menu").getByRole("link", { name })).toBeVisible();
  }
  await page.locator(".dropdown-menu").getByRole("link", { name: "Shrines" }).click();
  await expect(page).toHaveURL(/\/about\/shrines\/$/);
  await expect(page.locator("article.shrine")).toHaveCount(13);
  await page.evaluate(() => document.querySelectorAll("img").forEach((img) => (img.loading = "eager")));
  await page.waitForLoadState("networkidle");
  const broken = await page.locator("article.shrine img").evaluateAll((els) => els.filter((i) => !(i as HTMLImageElement).naturalWidth).length);
  expect(broken).toBe(0);
});

test("About Granthalaya page has content and reference images", async ({ page }) => {
  await page.goto("/about/");
  await expect(page.getByRole("heading", { name: "How the Granthalaya began" })).toBeVisible();
  await expect(page.locator(".gallery img")).toHaveCount(3);
  await page.waitForLoadState("networkidle");
  const broken = await page.locator(".gallery img").evaluateAll((els) => els.filter((i) => !(i as HTMLImageElement).naturalWidth).length);
  expect(broken).toBe(0);
});

test("news page lists the seeded alert and the banner shows it", async ({ page }) => {
  await page.goto("/news/");
  await expect(page.locator(".news-alert").first()).toContainText("Visiting hours");
  await expect(page.locator(".alert-banner")).toContainText("Visiting hours");
});

test("reduced motion shows static cards", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".cascade-static .cascade-card")).toHaveCount(13);
  await expect(page.locator(".cascade")).toHaveCount(0);
});

test("keyboard focus is visible on links", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Tab");
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).toBe("solid");
});

test("nav marks the current page and Escape closes the About menu", async ({ page }) => {
  await page.goto("/news/");
  await expect(page.getByRole("link", { name: "News and Alerts" })).toHaveAttribute("aria-current", "page");
  await page.getByRole("button", { name: "About" }).click();
  await expect(page.locator(".dropdown-menu")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".dropdown-menu")).toHaveCount(0);
});

test("hero portrait is framed and sharp, not stretched full-bleed", async ({ page }) => {
  await page.goto("/");
  const niche = page.locator(".hero-niche img");
  await expect(niche).toBeVisible();
  const { naturalWidth, width } = await niche.evaluate((i: HTMLImageElement) => ({ naturalWidth: i.naturalWidth, width: i.clientWidth }));
  expect(naturalWidth).toBeGreaterThanOrEqual(width);
});
