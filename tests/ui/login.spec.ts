import * as allure from "allure-js-commons";
import { config } from "../../config/config";
import { test } from "../../fixtures/testFixtures";
test("@smoke UI E2E - validate authenticated storage session", async ({ homePage }) => {
  await allure.epic("Demoblaze");
  await allure.feature("Authentication");
  await allure.story("Stored Session Validation");
  await allure.severity("critical");

  await allure.step("Open Demoblaze home page", async () => {
    await homePage.open();
  });

  await allure.step("Validate stored session user", async () => {
    await homePage.expectLoggedIn(config.ui.username);
  });
  
});