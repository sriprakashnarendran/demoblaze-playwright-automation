import * as allure from "allure-js-commons";
import { config } from "../../config/config";
import { test } from "../../fixtures/testFixtures";
import { ApiClient } from "../../utils/ApiClient";
import { ApiHelper } from "../../utils/ApiHelper";
import { data } from "../../utils/TestData";


test("@e2e Cross Layer - API and UI purchase flow", async ({ apiRequest, homePage, productPage, cartPage }) => {
  await allure.epic("Demoblaze");
  await allure.feature("Cross Layer Integration");
  await allure.story("API UI Alternate Flow");
  await allure.severity("critical");
  const api = new ApiHelper(new ApiClient(apiRequest));
  const token = await allure.step("API - Login with UI user", () => api.login(config.ui.username, config.ui.password));

  await allure.step("API - Get product", () => api.getProduct(data.products.id, data.products.name));
  await allure.step("UI - Open application", () => homePage.open());
  await allure.step("UI - Validate authenticated user", () => homePage.expectLoggedIn(config.ui.username));
  await allure.step("UI - Open product", () => homePage.selectProduct(data.products.name));
  await allure.step("UI - Validate product", () => productPage.expectProduct(data.products.name));
  await allure.step("API - Add product to cart", () => api.addToCart(token, data.products.id));
  await allure.step("UI - Open cart", () => homePage.openCart());
  await allure.step("UI - Validate API added product", () => cartPage.expectProduct(data.products.name));
  await allure.step("API - Validate product in cart", () => api.validateCart(token, data.products.id));
  await allure.step("UI - Open Place Order", () => cartPage.openPlaceOrder());
  await allure.step("UI - Complete checkout", () => cartPage.checkout(data.checkout.name, data.checkout.country, data.checkout.city, data.checkout.card, data.checkout.month, data.checkout.year));
  await allure.step("UI - Validate purchase", () => cartPage.expectPurchaseSuccessful(data.expected.purchaseSuccess));
  await allure.step("UI - Close confirmation", () => cartPage.closePurchaseConfirmation());
  await allure.step("API - Cleanup cart", () => api.cleanup(token));
});