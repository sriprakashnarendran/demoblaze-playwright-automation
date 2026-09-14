import * as allure from "allure-js-commons";
import { test } from "../../fixtures/testFixtures";
import { TestDataService } from "../../utils/TestDataService";
test("@regression UI E2E - add product to cart and checkout", async ({ homePage, productPage, cartPage }) => {
  const data = await new TestDataService().getPurchaseData();
  await allure.epic("Demoblaze");
  await allure.feature("Purchase");
  await allure.story("Add Product And Checkout");
  await allure.severity("critical");
  await allure.step("Open Demoblaze home page", () => homePage.open());
  await allure.step(`Select product: ${data.products.name}`, () => homePage.selectProduct(data.products.name));
  await allure.step("Validate selected product", () => productPage.expectProduct(data.products.name));
  await allure.step("Add product to cart", () => productPage.addToCart());
  await allure.step("Open cart", () => homePage.openCart());
  await allure.step("Validate product in cart", () => cartPage.expectProduct(data.products.name));
  await allure.step("Open Place Order", () => cartPage.openPlaceOrder());
  await allure.step("Enter checkout details and purchase", () =>
    cartPage.checkout(
      data.checkout.name,
      data.checkout.country,
      data.checkout.city,
      data.checkout.card,
      data.checkout.month,
      data.checkout.year,
    ),
  );
  await allure.step("Validate successful purchase", async () => {
    await cartPage.expectPurchaseSuccessful(data.expected.purchaseSuccess);
    await cartPage.closePurchaseConfirmation();
  });
});
