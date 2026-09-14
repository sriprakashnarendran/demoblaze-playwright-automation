import * as allure from "allure-js-commons";
import { expect, test } from "../../fixtures/testFixtures";

test.use({
  storageState: {
    cookies: [],
    origins: [],
  },
});

test("@ui @negative invalid login should display error", async ({ homePage, loginPage }) => {
  await allure.epic("Demoblaze");
  await allure.feature("Authentication");
  await allure.story("Invalid Login");
  await allure.severity("normal");

  await allure.step("Open application", async () => {
    await homePage.open();
  });

  await allure.step("Open login modal", async () => {
    await homePage.openLogin();
    await loginPage.expectVisible();
  });

  const message = await allure.step("Attempt invalid login", async () =>
    loginPage.loginExpectError(`invalid_${Date.now()}`, "Invalid@123"),
  );

  await allure.step("Validate login error", async () => {
    expect(message).toContain("User does not exist");
  });
});