# Demoblaze Playwright Automation Framework

Playwright + TypeScript automation framework for **UI, API, Mobile and Cross-Layer E2E testing** of Demoblaze.

## Tech Stack

- Playwright
- TypeScript
- Page Object Model
- Custom Fixtures
- APIRequestContext
- Allure Report
- Playwright HTML Report
- GitHub Actions
- Jenkins
- Playwright MCP

## Project Structure

```text
demoblaze_qa_automation/
├── auth/                 # Storage state
├── config/               # Environment configuration
├── fixtures/             # Custom fixtures
├── pages/                # Page Objects
├── utils/                # API/Auth helpers
├── testdata/             # Test data & expected values
├── tests/
│   ├── auth.setup.ts
│   ├── ui/               # UI tests
│   ├── api/              # API tests
│   └── e2e/              # API + UI cross-layer tests
├── .github/workflows/    # GitHub Actions
├── .vscode/mcp.json      # Playwright MCP
├── playwright.config.ts
└── package.json
```

## Architecture

```text
                         Playwright
                             │
                    ┌────────┴────────┐
                    │      Setup      │
                    │   AuthHelper    │
                    └────────┬────────┘
                             │
                      storageState.json
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
             Web           Mobile       Cross-Layer
        Desktop Chrome     Pixel 7        API ↔ UI
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                     Custom Fixtures
                             │
                     Page Objects
                             │
                      Demoblaze UI

                  API Tests / Cross-Layer
                             │
                             ▼
                         ApiHelper
                             │
                         ApiClient
                             │
                       apiRequest
                             │
                             ▼
                      Demoblaze API
```

## Authentication

Authentication uses Playwright `storageState`.

```text
Check storageState
       │
   ┌───┴───┐
   ▼       ▼
 Valid   Missing/Expired
   │       │
 Reuse   UI Login
           │
           ▼
      Save New State
```

`AuthHelper` handles session validation and creation, keeping `auth.setup.ts` minimal.

## Test Execution

Projects:

```text
setup
├── web        → Desktop Chrome
├── mobile     → Pixel 7
└── cross-layer → API + UI

api            → API tests
```

Run all tests:

```bash
npx playwright test
```

Run individually:

```bash
npx playwright test --project=web
npx playwright test --project=mobile
npx playwright test --project=api
npx playwright test --project=cross-layer
```

## Cross-Layer E2E

Cross-layer testing performs API and UI operations using the same application user.

```text
API Login
   ↓
API Get Product
   ↓
UI Validate Product
   ↓
API Add To Cart
   ↓
UI Validate API Added Product
   ↓
API Validate Cart
   ↓
UI Checkout
   ↓
UI Validate Purchase
   ↓
API Cleanup
```

A dedicated `apiRequest` fixture uses:

```text
UI  → https://www.demoblaze.com
API → https://api.demoblaze.com
```

Cross-layer tests use a single worker to prevent shared cart/session conflicts.

## Framework Design

```text
Tests
  ↓
Fixtures
  ↓
Pages / Helpers
  ↓
BasePage / ApiClient
  ↓
Playwright
  ↓
Demoblaze UI + API
```

- **Page Objects** → UI locators and actions
- **ApiClient** → Generic HTTP methods
- **ApiHelper** → API business operations
- **AuthHelper** → Authentication/session handling
- **TestData** → Input and expected data
- **Fixtures** → Reusable Page Objects and API context

## Reports

Playwright HTML:

```bash
npx playwright show-report
```

Allure:

```bash
allure generate allure-results --clean -o allure-report
allure open allure-report
```

Failures retain **screenshots, videos and traces**.

## CI/CD

Supported through:

- GitHub Actions


CI flow:

```text
Git Push / PR
     ↓
Install Dependencies
     ↓
Install Browsers
     ↓
Run Tests
     ↓
Playwright + Allure Reports
```

Credentials are managed through environment variables / CI secrets and are not hardcoded in tests.

## Author

**Sri Prakash Narendran**

Playwright + TypeScript QA Automation Framework