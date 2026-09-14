import { APIRequestContext, expect, request, test as base } from "@playwright/test";
import { config } from "../config/config";
import { CartPage } from "../pages/CartPage";
import { HomePage } from "../pages/HomePage";
import { LoginPage } from "../pages/LoginPage";
import { ProductPage } from "../pages/ProductPage";
type Fixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  apiRequest: APIRequestContext;
};
export const test = base.extend<Fixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  apiRequest: async ({ }, use) => {
    const context = await request.newContext({
      baseURL: config.api.baseURL,
      extraHTTPHeaders: { "Content-Type": "application/json" },
    });
    await use(context);
    await context.dispose();
  },
});
export { expect };