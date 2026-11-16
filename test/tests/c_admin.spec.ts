import { expect, test } from "@playwright/test";
import { login, pngBuffer } from "./helpers";

test("admin API rejects anonymous writes", async ({ request }) => {
  expect((await request.post("/api/news", { data: { title: "x" } })).status()).toBe(401);
  expect((await request.put("/api/pages/about", { data: { title: "x" } })).status()).toBe(401);
});

test("wrong password is rejected and /admin shows only the login", async ({ page }) => {
  await page.goto("/admin/");
  await page.getByLabel("Username").fill("admin");
  await page.getByLabel("Password").fill("nope");
  await page.getByRole("button", { name: "Log in" }).click();
  await expect(page.locator(".notice-error")).toHaveText("Invalid username or password");
  await expect(page.getByRole("tab", { name: "Shrines" })).toHaveCount(0);
});

test("post, edit and delete an alert", async ({ page }) => {
  await login(page);
  const form = page.getByRole("form", { name: "News form" });
  await form.getByLabel("Type").selectOption("alert");
  await form.getByLabel("Title").fill("Temple closed Friday");
  await form.getByLabel("Details").fill("Maintenance work");
  await form.getByRole("button", { name: "Publish" }).click();
  await expect(page.getByText("Temple closed Friday")).toBeVisible();

  await page.goto("/news/");
  await expect(page.locator(".alert-banner")).toContainText("Temple closed Friday");

  await page.goto("/admin/");
  await page.getByRole("button", { name: "Edit Temple closed Friday" }).click();
  await page.getByRole("form", { name: "News form" }).getByLabel("Title").fill("Temple open Friday");
  await page.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByText("Temple open Friday")).toBeVisible();

  await page.getByRole("button", { name: "Delete Temple open Friday" }).click();
  await expect(page.getByText("Temple open Friday")).toHaveCount(0);
});

test("add a shrine with an image, replace the image, then delete it", async ({ page }) => {
  await login(page);
  await page.getByRole("tab", { name: "Shrines" }).click();
  await page.getByRole("button", { name: "Add shrine" }).click();
  const form = page.getByRole("form", { name: "Shrine form" });
  await form.getByLabel("Title").fill("Test Shrine of Lamps");
  await form.getByLabel("Short summary").fill("A shrine added by the content manager.");
  await form.getByLabel("Full description").fill("First paragraph.\n\nSecond paragraph.");
  await form.getByLabel("Display order").fill("0");
  await form.getByLabel("Add image").setInputFiles({ name: "red.png", mimeType: "image/png", buffer: pngBuffer([200, 30, 30]) });
  await expect(form.locator(".thumb img")).toHaveCount(1);
  const firstSrc = await form.locator(".thumb img").getAttribute("src");
  await form.getByRole("button", { name: "Save shrine" }).click();
  await expect(page.getByText("Shrine saved")).toBeVisible();

  await page.goto("/about/shrines/");
  const shrine = page.locator("#test-shrine-of-lamps");
  await expect(shrine).toContainText("Second paragraph.");
  await expect(shrine.locator("img")).toHaveAttribute("src", firstSrc!);

  await page.goto("/admin/");
  await page.getByRole("tab", { name: "Shrines" }).click();
  await page.getByRole("button", { name: "Edit Test Shrine of Lamps" }).click();
  await page.getByLabel("Replace image 1").setInputFiles({ name: "blue.png", mimeType: "image/png", buffer: pngBuffer([30, 30, 200]) });
  await expect(page.locator(".thumb img")).not.toHaveAttribute("src", firstSrc!);
  await page.getByRole("button", { name: "Save shrine" }).click();
  await expect(page.getByText("Shrine saved")).toBeVisible();

  await page.goto("/");
  await expect(page.locator(".cascade-slot")).toHaveCount(14);

  await page.goto("/admin/");
  await page.getByRole("tab", { name: "Shrines" }).click();
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Test Shrine of Lamps" }).click();
  await expect(page.getByText("Test Shrine of Lamps")).toHaveCount(0);
});

test("edit the landing highlight", async ({ page }) => {
  await login(page);
  await page.getByRole("tab", { name: "Pages" }).click();
  const form = page.getByRole("form", { name: "Page form" });
  await form.getByLabel("Short summary").fill("An edited highlight summary.");
  await form.getByRole("button", { name: "Save page" }).click();
  await expect(page.getByText("Page saved")).toBeVisible();
  await page.goto("/");
  await expect(page.locator(".hero-summary")).toHaveText("An edited highlight summary.");
});

test("logout returns to the login form", async ({ page }) => {
  await login(page);
  await page.getByRole("button", { name: /Log out/ }).click();
  await expect(page.getByRole("form", { name: "Login" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("form", { name: "Login" })).toBeVisible();
});
