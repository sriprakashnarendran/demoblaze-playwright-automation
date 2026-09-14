import { test as setup } from "@playwright/test";
import { AuthHelper } from "../utils/AuthHelper";

setup("validate or create authentication session", async ({ browser }) => {
  const auth = new AuthHelper(browser);
  await auth.validateOrCreateSession();
});