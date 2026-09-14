import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
export class ProductPage extends BasePage {
  readonly addToCartLink: Locator;
  constructor(page: Page) {
    super(page);
    this.addToCartLink = page.getByRole("link", { name: "Add to cart" });
  }
  async expectProduct(productName: string): Promise<void> {
    await expect(this.page.getByRole("heading", { name: productName, exact: true })).toBeVisible();
  }
  async addToCart(): Promise<void> {
    const dialogPromise = this.page.waitForEvent("dialog");
    await this.addToCartLink.click();
    const dialog = await dialogPromise;
    expect(dialog.message()).toContain("Product added");
    await dialog.accept();
  }
}