import { Browser, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import { config } from "../config/config";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";

export class AuthHelper {
  private readonly authFile = path.resolve(process.cwd(), "auth/storageState.json");

  constructor(private readonly browser: Browser) {}

  async validateOrCreateSession(): Promise<void> {
    fs.mkdirSync(path.dirname(this.authFile), { recursive: true });

    if (await this.isSessionActive()) {
      console.log("Existing authentication session is active.");
      return;
    }

    await this.createSession();
  }

  private async isSessionActive(): Promise<boolean> {
    if (!fs.existsSync(this.authFile)) return false;

    try {
      const context = await this.browser.newContext({ storageState: this.authFile });
      const page = await context.newPage();
      const homePage = new HomePage(page);

      await homePage.open();

      const active = await homePage.welcomeUser
        .filter({ hasText: `Welcome ${config.ui.username}` })
        .isVisible()
        .catch(() => false);

      await context.close();
      return active;
    } catch {
      return false;
    }
  }

  private async createSession(): Promise<void> {
    const context = await this.browser.newContext();
    const page = await context.newPage();

    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.open();
    await homePage.openLogin();
    await loginPage.expectVisible();
    await loginPage.login(config.ui.username, config.ui.password);

    await expect(homePage.welcomeUser).toHaveText(`Welcome ${config.ui.username}`, { timeout: 15000 });

    await context.storageState({ path: this.authFile });
    await context.close();

    console.log("New authentication session created.");
  }
}