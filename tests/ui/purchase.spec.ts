import * as allure from "allure-js-commons";

import { test } from "../../fixtures/testFixtures";

import { data } from "../../utils/TestData";

test(
  "@regression UI E2E - add product to cart and checkout",
  async ({ homePage, productPage, cartPage }) => {
    await allure.epic("Demoblaze");
    await allure.feature("Purchase");
    await allure.story("Add Product And Checkout");
    await allure.severity("critical");

    await allure.step("Open Demoblaze home page", async () => {
      await homePage.open();
    });

    await allure.step(`Select product: ${data.products.name}`, async () => {
      await homePage.selectProduct(data.products.name);
    });

    await allure.step("Validate selected product", async () => {
      await productPage.expectProduct(data.products.name);
    });

    await allure.step("Add product to cart", async () => {
      await productPage.addToCart();
    });

    await allure.step("Open cart", async () => {
      await homePage.openCart();
    });

    await allure.step("Validate product in cart", async () => {
      await cartPage.expectProduct(data.products.name);
    });

    await allure.step("Open Place Order", async () => {
      await cartPage.openPlaceOrder();
    });

    await allure.step(
      "Enter checkout details and purchase",
      async () => {
        await cartPage.checkout(
          data.checkout.name,
          data.checkout.country,
          data.checkout.city,
          data.checkout.card,
          data.checkout.month,
          data.checkout.year,
        );
      },
    );

    await allure.step("Validate successful purchase", async () => {
      await cartPage.expectPurchaseSuccessful();
      await cartPage.closePurchaseConfirmation();
    });
  },
);
