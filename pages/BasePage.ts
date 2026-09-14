import { Locator, Page } from "@playwright/test";
export class BasePage {
  protected readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }
  async goto(url = "/"): Promise<void> {
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }
  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }
  async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? "";
  }
  async isVisible(locator: Locator): Promise<boolean> {
    return locator.isVisible();
  }
}