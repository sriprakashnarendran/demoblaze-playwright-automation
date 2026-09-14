[![Playwright Tests](https://github.com/sriprakashnarendran/demoblaze-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/sriprakashnarendran/demoblaze-playwright-automation/actions/workflows/playwright.yml)

Demoblaze Playwright Automation Framework



Playwright + TypeScript automation framework covering Web UI, API, Mobile Web, Database Integration, Cross-Layer E2E, CI/CD, Allure Reporting, Code Quality, and Playwright MCP.

Tech Stack

Playwright + TypeScript

Page Object Model

Custom Fixtures

Playwright APIRequestContext

Supabase PostgreSQL

Zod API Schema Validation

Allure + Playwright HTML Reports

GitHub Actions

ESLint + Prettier

Playwright MCP

Architecture

                    Playwright + TypeScript
                            |
        ---------------------------------------------
        |                    |                      |
       UI                   API                Cross-Layer
        |                    |                      |
   Page Objects          ApiHelper               API <-> UI
        |                    |
     BasePage            ApiClient
        |                    |
        ----------- Custom Fixtures ---------------
                            |
                 -----------------------
                 |                     |
             Config                Test Data
                 |                     |
          config/apiConfig       TestDataService
                                       |
                                 DatabaseClient
                                       |
                                  Supabase DB

Project Structure

config/      -> Environment and API configuration
fixtures/    -> Custom Playwright fixtures
models/      -> Zod schemas / API models
pages/       -> Page Object Model classes
utils/       -> API, Auth, DB and Test Data helpers
tests/ui/    -> Web and Mobile UI tests
tests/api/   -> API tests
tests/e2e/   -> Cross-layer tests
.github/     -> GitHub Actions workflow
.vscode/     -> Playwright MCP configuration

Test Coverage

Area

Coverage

Web

Login, Product, Cart, Checkout, Negative Login

API

Login, Product, Cart, Negative Tests, Schema Validation

Mobile Web

Pixel 7 device emulation

Database

Supabase-driven test data

Cross-Layer

API -> UI -> API validation

CI/CD

Parallel GitHub Actions execution

Code Quality

TypeScript, ESLint, Prettier

Reporting

Individual + Combined Allure reports

Authentication

Playwright storageState is used to reuse authenticated sessions.

auth/storageState.json

The setup project validates or regenerates the authenticated state before dependent UI projects execute.

Cross-Layer Flow

API Login
   |
API Get Product
   |
UI Validate Product
   |
API Add To Cart
   |
API Poll Cart
   |
UI Validate API-Added Product
   |
API Validate Same Cart
   |
UI Checkout
   |
API Cleanup

Cross-layer tests run with 1 worker because they use shared account/cart state.

Running Tests

All Tests

npx playwright test

Individual Suites

npx playwright test --project=web
npx playwright test --project=mobile
npx playwright test --project=api
npx playwright test --project=cross-layer --workers=1

Code Quality

npm run typecheck
npm run lint
npm run format:check

Fix formatting:

npm run format

Fix ESLint issues where supported:

npm run lint:fix

CI/CD

GitHub Actions runs a quality gate first:

TypeScript
   |
ESLint
   |
Prettier
   |
-----------------------------------------
|           |           |               |
Web       Mobile       API         Cross-Layer
2 workers  2 workers   2 workers      1 worker
|           |           |               |
-----------------------------------------
                    |
            Combined Allure Report

Independent suites run in parallel, while the shared-state Cross-Layer suite is isolated with one worker.

Reports

Each suite produces its own report artifacts:

playwright-report-web
playwright-report-mobile
playwright-report-api
playwright-report-cross-layer

allure-results-web
allure-results-mobile
allure-results-api
allure-results-cross-layer

After all suites complete, CI merges the Allure results and generates:

combined-allure-report

This provides one final Allure report containing Web + Mobile + API + Cross-Layer results while retaining individual suite reports for debugging.

Local Reports

npx playwright show-report
npm run allure:generate
npm run allure:open

Database Integration

Test
 |
TestDataService
 |
DatabaseClient
 |
Supabase PostgreSQL

Test data is maintained outside test logic for better reuse and maintainability.

Playwright MCP

Playwright MCP is configured in:

.vscode/mcp.json

It is used as a development/debugging aid and is not required for CI execution.

Environment Variables

BASE_URL=https://www.demoblaze.com
API_URL=https://api.demoblaze.com
UI_USERNAME=<username>
UI_PASSWORD=<password>
SUPABASE_URL=<supabase-url>
SUPABASE_SECRET_KEY=<supabase-secret-key>

Sensitive values are stored in .env locally and GitHub Secrets in CI.

Future Enhancements

Visual regression testing

Accessibility baselining

Native mobile automation with Appium

Multi-environment execution

Dockerized execution

Performance testing

Assignment Scope

Demonstrating framework architecture, Web, API, Mobile Web, DB Integration, Cross-Layer E2E, CI/CD, code-quality gates, reporting, and MCP integration.

Author

Sri Prakash Narendran

GitHub: sriprakashnarendran
Repository: demoblaze-playwright-automation
