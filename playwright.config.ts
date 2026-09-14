import { defineConfig, devices } from "@playwright/test";
import path from "path";
import { config } from "./config/config";

const authFile = path.resolve(process.cwd(), "auth/storageState.json");

export default defineConfig({
  testDir: "./tests",
  timeout: config.timeout.test,
  expect: { timeout: config.timeout.expect },
  fullyParallel: true,
  workers: process.env.CI ? 2 : 2,
  retries: process.env.CI ? 1 : 0,
  forbidOnly: !!process.env.CI,
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["allure-playwright", { resultsDir: "allure-results" }],
  ],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: config.timeout.action,
    navigationTimeout: config.timeout.navigation,
  },
  projects: [
    {
      name: "setup",
      testMatch: "**/*.setup.ts",
      use: { baseURL: config.ui.baseURL },
    },
    {
      name: "web",
      testDir: "./tests/ui",
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], baseURL: config.ui.baseURL, storageState: authFile },
    },
    {
      name: "mobile",
      testDir: "./tests/ui",
      dependencies: ["setup"],
      use: { ...devices["Pixel 7"], baseURL: config.ui.baseURL, storageState: authFile },
    },
    {
      name: "api",
      testDir: "./tests/api",
      use: { baseURL: config.api.baseURL },
    },
     {
    name: "cross-layer",
    testDir: "./tests/e2e",
    dependencies: ["setup"],
    fullyParallel: false,
    workers: 1,
    use: {
      ...devices["Desktop Chrome"],
      storageState: authFile,
      baseURL: config.ui.baseURL
    }
  },
  ],
  outputDir: "test-results",
});