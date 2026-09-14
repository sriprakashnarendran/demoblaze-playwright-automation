[![Playwright Tests](https://github.com/sriprakashnarendran/demoblaze-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/sriprakashnarendran/demoblaze-playwright-automation/actions/workflows/playwright.yml)

Demoblaze Playwright Automation Framework

Playwright + TypeScript automation framework covering **Web UI, API, Mobile Web, Database Integration, Cross-Layer E2E, CI/CD, Allure Reporting, Code Quality, and Playwright MCP**.

## Tech Stack

- Playwright + TypeScript
- Page Object Model
- Custom Fixtures
- Playwright APIRequestContext
- Supabase PostgreSQL
- Zod API Schema Validation
- Allure + Playwright HTML Reports
- GitHub Actions
- ESLint + Prettier
- Playwright MCP

## Architecture

```text
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
```

## Project Structure

```text
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
```

## Test Coverage

| Area         | Coverage                                                |
| ------------ | ------------------------------------------------------- |
| Web          | Login, Product, Cart, Checkout, Negative Login          |
| API          | Login, Product, Cart, Negative Tests, Schema Validation |
| Mobile Web   | Pixel 7 device emulation                                |
| Database     | Supabase-driven test data                               |
| Cross-Layer  | API -> UI -> API validation                             |
| CI/CD        | Parallel GitHub Actions execution                       |
| Code Quality | TypeScript, ESLint, Prettier                            |
| Reporting    | Individual + Combined Allure reports                    |

## Authentication

Playwright `storageState` is used to reuse authenticated sessions.

```text
auth/storageState.json
```

The setup project validates or regenerates authentication before dependent UI projects execute.

## Cross-Layer Flow

```text
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
```

Cross-layer tests run with **1 worker** because they use shared account/cart state.

## Running Tests

```bash
npx playwright test
```

### Individual Suites

```bash
npx playwright test --project=web
npx playwright test --project=mobile
npx playwright test --project=api
npx playwright test --project=cross-layer --workers=1
```

## Code Quality

```bash
npm run typecheck
npm run lint
npm run format:check
```

Auto-fix:

```bash
npm run lint:fix
npm run format
```

## CI/CD

```text
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
```

Independent suites execute in parallel while Cross-Layer execution is isolated with one worker.

## Individual & Combined Reports

Each suite produces individual artifacts:

```text
playwright-report-web
playwright-report-mobile
playwright-report-api
playwright-report-cross-layer

allure-results-web
allure-results-mobile
allure-results-api
allure-results-cross-layer
```

After execution, GitHub Actions merges all Allure results and generates:

```text
combined-allure-report
```

The combined report contains:

```text
Web + Mobile + API + Cross-Layer
```

Individual reports remain available for debugging.

### Local Reports

```bash
npx playwright show-report
npm run allure:generate
npm run allure:open
```

## Database Integration

```text
Test
 |
TestDataService
 |
DatabaseClient
 |
Supabase PostgreSQL
```

Test data is maintained separately from test logic for better reuse and maintainability.

## Playwright MCP

Configured in:

```text
.vscode/mcp.json
```

MCP supports development, debugging, exploration, and locator identification while CI execution remains independent.

## Environment Variables

```env
BASE_URL=https://www.demoblaze.com
API_URL=https://api.demoblaze.com
UI_USERNAME=<username>
UI_PASSWORD=<password>
SUPABASE_URL=<supabase-url>
SUPABASE_SECRET_KEY=<supabase-secret-key>
```

Sensitive values are maintained through `.env` locally and GitHub Secrets in CI.

## Future Enhancements

- Visual Regression Testing
- Accessibility Testing
- Native Mobile Automation using Appium
- Multi-Environment Execution
- Dockerized Execution
- Performance Testing

## Assignment Scope

Demonstrating Web, API, Mobile Web, Database Integration, Cross-Layer E2E, CI/CD, code-quality gates, reporting, and Playwright MCP integration.

## Author

**Sri Prakash Narendran**
