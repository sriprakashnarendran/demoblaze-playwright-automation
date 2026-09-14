import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";
export class CartPage extends BasePage {
  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly successMessage: Locator;
  readonly okButton: Locator;
  constructor(page: Page) {
    super(page);
    this.placeOrderButton = page.getByRole("button", { name: "Place Order" });
    this.orderModal = page.getByRole("dialog", { name: "Place order" });
    this.nameInput = this.orderModal.locator("#name");
    this.countryInput = this.orderModal.locator("#country");
    this.cityInput = this.orderModal.locator("#city");
    this.cardInput = this.orderModal.locator("#card");
    this.monthInput = this.orderModal.locator("#month");
    this.yearInput = this.orderModal.locator("#year");
    this.purchaseButton = this.orderModal.getByRole("button", { name: "Purchase" });
    this.successMessage = page.locator(".sweet-alert").getByRole("heading");
    this.okButton = page.getByRole("button", { name: "OK", exact: true });
  }
  async expectProduct(productName: string): Promise<void> {
    await expect(this.page.getByRole("cell", { name: productName, exact: true }).first()).toBeVisible();
  }
  async openPlaceOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await expect(this.orderModal).toBeVisible();
  }
  async checkout(
    name: string,
    country: string,
    city: string,
    card: string,
    month: string,
    year: string,
  ): Promise<void> {
    await this.nameInput.fill(name);
    await this.countryInput.fill(country);
    await this.cityInput.fill(city);
    await this.cardInput.fill(card);
    await this.monthInput.fill(month);
    await this.yearInput.fill(year);
    await this.purchaseButton.click();
  }
  async expectPurchaseSuccessful(expectedMessage: string): Promise<void> {
    await expect(this.successMessage).toBeVisible();
    await expect(this.successMessage).toHaveText(expectedMessage);
  }
  async closePurchaseConfirmation(): Promise<void> {
    await this.okButton.click();
  }
}
