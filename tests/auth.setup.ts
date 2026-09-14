import { test as setup, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

import { config } from "../config/config";

const authFile = path.resolve(
  process.cwd(),
  "./auth/storageState.json",
);

setup("authenticate", async ({ page }) => {
  fs.mkdirSync(path.dirname(authFile), {
    recursive: true,
  });

  await page.goto(config.ui.baseURL);

  await page
    .getByRole("link", {
      name: "Log in",
    })
    .click();

  const loginModal = page.getByRole("dialog", {
    name: "Log in",
  });

  await loginModal
    .locator("#loginusername")
    .fill(config.ui.username);

  await loginModal
    .locator("#loginpassword")
    .fill(config.ui.password);

  await loginModal
    .getByRole("button", {
      name: "Log in",
    })
    .click();

  const welcomeUser = page.locator("#nameofuser");

  await expect(welcomeUser).toHaveText(
    `Welcome ${config.ui.username}`,
    {
      timeout: 15000,
    },
  );

  await page.context().storageState({
    path: authFile,
  });

  console.log(
    `Authentication storage state saved: ${authFile}`,
  );
});