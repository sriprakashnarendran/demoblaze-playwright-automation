import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
export class HomePage extends BasePage {
  readonly loginLink: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly welcomeUser: Locator;
  constructor(page: Page) {
    super(page);
    this.loginLink = page.getByRole("link", { name: "Log in" });
    this.logoutLink = page.getByRole("link", { name: "Log out" });
    this.cartLink = page.getByRole("link", { name: "Cart", exact: true });
    this.welcomeUser = page.locator("#nameofuser");
  }
  async open(): Promise<void> {
    await this.goto("/");
  }
  async openLogin(): Promise<void> {
    await this.loginLink.click();
  }
  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
  async selectProduct(productName: string): Promise<void> {
    await this.page.getByRole("link", { name: productName, exact: true }).click();
  }
  async expectLoggedIn(username: string): Promise<void> {
    await expect(this.welcomeUser).toHaveText(`Welcome ${username}`);
  }
}
