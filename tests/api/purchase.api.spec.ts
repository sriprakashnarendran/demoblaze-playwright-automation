import { test } from "@playwright/test";
import * as allure from "allure-js-commons";
import { ApiClient } from "../../utils/ApiClient";
import { ApiHelper } from "../../utils/ApiHelper";
import { data } from "../../utils/TestData";

test("@api API E2E - complete purchase flow", async ({ request }) => {
  await allure.epic("Demoblaze");
  await allure.feature("API");
  await allure.story("Signup Login Product Cart");
  await allure.severity("critical");

  const api = new ApiHelper(new ApiClient(request));
  const unique = Date.now();
  const username = `apiuser_${unique}`;
  const password = `Api@${unique}`;

  await allure.step("Signup", () => api.signup(username, password));
  const token = await allure.step("Login", () => api.login(username, password));
  await allure.step("Get Product", () => api.getProduct(data.products.id, data.products.name));
  await allure.step("Add To Cart", () => api.addToCart(token, data.products.id));
  await allure.step("Validate Cart", () => api.validateCart(token, data.products.id));
  await allure.step("Cleanup Cart", () => api.cleanup(token));
});