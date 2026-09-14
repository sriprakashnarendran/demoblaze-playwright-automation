# Demoblaze Playwright Automation Framework

Playwright + TypeScript framework for **UI, API, Mobile, Database and Cross-Layer E2E testing** of Demoblaze.

## Tech Stack

* Playwright + TypeScript
* Page Object Model
* Custom Fixtures
* APIRequestContext
* Supabase PostgreSQL
* Allure + Playwright HTML Report
* GitHub Actions
* Playwright MCP

## Project Structure

```text
demoblaze_qa_automation/
├── auth/
├── config/
│   ├── config.ts
│   └── apiConfig.ts
├── fixtures/
├── pages/
├── utils/
│   ├── ApiClient.ts
│   ├── ApiHelper.ts
│   ├── AuthHelper.ts
│   ├── DatabaseClient.ts
│   └── TestDataService.ts
├── tests/
│   ├── auth.setup.ts
│   ├── ui/
│   ├── api/
│   └── e2e/
├── .github/workflows/
├── .vscode/mcp.json
└── playwright.config.ts
```

## Architecture

```text
                    Playwright
                        │
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
       UI              API          Cross-Layer
        │               │               │
    Page Objects     ApiHelper        API ↔ UI
        │               │               │
        ▼           ApiClient           ▼
 Demoblaze UI           │        Demoblaze UI/API
                        ▼
                  Demoblaze API

                 TestDataService
                        │
                 DatabaseClient
                        │
                        ▼
               Supabase PostgreSQL
```

## Authentication

Authentication uses Playwright `storageState`.

```text
Check Session
     ↓
Valid? ── Yes → Reuse
     │
     No
     ↓
UI Login
     ↓
Save storageState
```

`AuthHelper` handles session validation, login and state creation.

## Test Data

Test data is stored in Supabase PostgreSQL.

```text
Test
 ↓
TestDataService
 ↓
DatabaseClient
 ↓
Supabase
```

Example:

```ts
const data = await new TestDataService()
  .getPurchaseData("purchase_default");
```

Configuration is separated as:

```text
.env          → URLs, credentials, DB secrets
config.ts     → Environment and timeouts
apiConfig.ts  → API endpoints and constants
Supabase      → Test data and expected values
```

## Test Execution

```bash
npx playwright test
```

Individual projects:

```bash
npx playwright test --project=web
npx playwright test --project=mobile
npx playwright test --project=api
npx playwright test --project=cross-layer
```

Cross-layer:

```bash
npx playwright test --project=cross-layer --workers=1
```

## Cross-Layer Flow

```text
API Login
   ↓
API Get Product
   ↓
UI Validate Product
   ↓
API Add To Cart
   ↓
Wait For Cart Product
   ↓
UI Validate Cart
   ↓
API Validate Cart
   ↓
UI Checkout
   ↓
UI Validate Purchase
   ↓
API Cleanup
```

A dedicated `apiRequest` fixture keeps endpoints separated:

```text
UI  → https://www.demoblaze.com
API → https://api.demoblaze.com
```

`waitForCartProduct()` polls the API before UI validation to reduce intermittent cross-layer failures.

## Framework Design

* **Page Objects** → UI actions and locators
* **ApiClient** → Generic HTTP methods
* **ApiHelper** → API business logic
* **AuthHelper** → Authentication and storage state
* **DatabaseClient** → Supabase connection
* **TestDataService** → Database test-data retrieval
* **Fixtures** → Reusable UI/API objects

## Reports

Playwright:

```bash
npx playwright show-report
```

Allure:

```bash
allure generate allure-results --clean -o allure-report
allure open allure-report
```

Failures retain screenshots, videos, traces and API attachments.

## CI/CD

Supported with:

* GitHub Actions

'''''''*****Can extend for Jenkins,Buildkite,AWS*****'''''''''

Secrets are stored in environment variables / CI credentials and are not hardcoded.

## Author

**Sri Prakash Narendran**

Playwright + TypeScript QA Automation Framework
