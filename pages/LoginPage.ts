import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  readonly modal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.modal = page.getByRole("dialog", { name: "Log in" });
    this.usernameInput = this.modal.locator("#loginusername");
    this.passwordInput = this.modal.locator("#loginpassword");
    this.loginButton = this.modal.getByRole("button", { name: "Log in" });
  }

  async expectVisible(): Promise<void> {
    await expect(this.modal).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async loginExpectError(username: string, password: string): Promise<string> {
    const dialogPromise = this.page.waitForEvent("dialog");
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    const dialog = await dialogPromise;
    const message = dialog.message();
    await dialog.accept();
    return message;
  }
}