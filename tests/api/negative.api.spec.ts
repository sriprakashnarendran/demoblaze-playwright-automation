import { test } from "@playwright/test";
import * as allure from "allure-js-commons";
import { ApiClient } from "../../utils/ApiClient";
import { ApiHelper } from "../../utils/ApiHelper";

test(
  "@api @negative API - invalid user login",
  async ({ request }) => {
    await allure.epic("Demoblaze");
    await allure.feature("API");
    await allure.story("Negative Authentication");
    await allure.severity("normal");

    const api = new ApiHelper(
      new ApiClient(request),
    );

    const username =
      `invalid_user_${Date.now()}`;

    await allure.step(
      "Attempt login using invalid user",
      async () => {
        await api.expectLoginFailure(
          username,
          "Invalid@123",
          "User does not exist",
        );
      },
    );
  },
);