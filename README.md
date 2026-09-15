[![Playwright Tests](https://github.com/sriprakashnarendran/demoblaze-playwright-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/sriprakashnarendran/demoblaze-playwright-automation/actions/workflows/playwright.yml)

# Demoblaze Playwright Automation Framework

A scalable automation framework for **Web, Mobile Web, API, Database, and Cross-Layer testing** of the Demoblaze application using Playwright with TypeScript.

The framework is designed with focus on:

- Maintainability
- Reusability
- Test isolation
- Reliability
- CI/CD readiness
- Code quality
- Reporting
- Cross-layer validation

---

## Tech Stack

- Playwright + TypeScript
- Node.js
- Zod
- Supabase PostgreSQL
- Allure Report
- GitHub Actions
- ESLint
- Prettier
- Playwright MCP

---

# Test Coverage

| Test Area | Coverage |
|---|---|
| Web | Login, Negative Login, Product Selection, Cart, Checkout |
| Mobile Web | Login, Product Selection, Cart, Checkout using Pixel 7 emulation |
| API | Authentication, Product, Cart, Negative Scenarios |
| API Contract | Response schema validation using Zod |
| Database | External test-data retrieval from Supabase PostgreSQL |
| Cross-Layer | API and Web business-state validation |
| CI/CD | Automated execution through GitHub Actions |
| Reporting | Individual suite reports and Combined Allure Report |

---

# Test Plan

## Objective

The objective of this automation framework is to validate the major business flows of the Demoblaze application across:

- Web
- Mobile Web
- API
- Database-driven test data
- Cross-Layer scenarios

The framework also validates integration between the different application layers while maintaining reusable components, externalized test data, automated execution, and centralized reporting.

---

## Scope

### Web

Web automation validates the major customer journey through the browser.

Scenarios covered:

- Valid login
- Invalid login
- Product selection
- Add product to cart
- Cart validation
- Checkout
- Purchase confirmation

---

### Mobile Web

The critical customer journey is also validated using **Pixel 7 browser emulation**.

Scenarios covered:

- Login
- Product selection
- Add product to cart
- Cart validation
- Checkout
- Purchase confirmation

> Mobile coverage in this framework represents **Mobile Web testing** using browser/device emulation and not native Android or iOS application automation.

---

### API

API automation validates the major Demoblaze backend operations.

Scenarios covered:

- Valid authentication
- Invalid authentication
- Product retrieval
- Product response validation
- Product schema validation
- Add product to cart
- View cart
- Cart cleanup

---

### Database

Supabase PostgreSQL is used as an external test-data source.

The framework retrieves required purchase data through the test-data service instead of hardcoding test data throughout the test scripts.

---

### Cross-Layer

The Cross-Layer scenario validates that a business state created through the API is correctly reflected in the Web application.

```text
API Login
    ↓
Synchronize API Token with Browser Session
    ↓
Add Product through API
    ↓
Validate Product through API
    ↓
Open Cart through Web
    ↓
Validate Same Product through Web
    ↓
Cleanup through API
```

---

# Test Scenarios

| Area | Scenario | Expected Result |
|---|---|---|
| Web | Login with valid credentials | User successfully logs in |
| Web | Login with invalid credentials | Appropriate login error is displayed |
| Web | Select a product | Correct product details are displayed |
| Web | Add selected product to cart | Product is successfully added |
| Web | Complete checkout | Purchase confirmation is displayed |
| Mobile Web | Login using Pixel 7 emulation | User successfully logs in |
| Mobile Web | Select and add product | Product is successfully added |
| Mobile Web | Complete checkout | Purchase confirmation is displayed |
| API | Login with valid credentials | Authentication token is returned |
| API | Login with invalid credentials | Expected API error is returned |
| API | Retrieve product details | Correct product information is returned |
| API | Validate product response schema | Response matches the expected Zod schema |
| API | Add product to cart | Product is added successfully |
| API | Validate cart | Added product is available in cart |
| API | Cleanup cart | Cart data is removed successfully |
| Database | Retrieve purchase test data | Required test data is returned from Supabase |
| Cross-Layer | Add product through API and validate through Web | Same business state is reflected in Web |

---

# Framework Architecture

The framework architecture shows how the major automation components interact with the application and external systems.

```text
                         ┌──────────────────────────┐
                         │ Playwright + TypeScript  │
                         └─────────────┬────────────┘
                                       │
                 ┌─────────────────────┼─────────────────────┐
                 ↓                     ↓                     ↓
          ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
          │     Web     │       │ Mobile Web  │       │     API     │
          │    Tests    │       │    Tests    │       │    Tests    │
          └──────┬──────┘       └──────┬──────┘       └──────┬──────┘
                 │                     │                     │
                 ↓                     ↓                     ↓
          ┌────────────────┐    ┌────────────────┐    ┌────────────────┐
          │  Page Objects  │    │  Page Objects  │    │   ApiHelper    │
          └──────┬─────────┘    └──────┬─────────┘    └──────┬─────────┘
                 │                     │                     ↓
                 └────────────┬────────┘              ┌────────────────┐
                              ↓                       │   ApiClient     │
                       ┌─────────────┐                └──────┬─────────┘
                       │  BasePage   │                       │
                       └──────┬──────┘                       ↓
                              ↓                      ┌─────────────────┐
                    ┌─────────────────┐              │ Demoblaze API  │
                    │ Demoblaze Web   │              └─────────────────┘
                    └─────────────────┘


                         ┌───────────────────┐
                         │ Cross-Layer E2E   │
                         └─────────┬─────────┘
                                   │
                         ┌─────────┴─────────┐
                         ↓                   ↓
                 ┌───────────────┐   ┌────────────────┐
                 │ Demoblaze API│   │ Demoblaze Web │
                 └───────────────┘   └────────────────┘


                         ┌───────────────────┐
                         │ TestDataService   │
                         └─────────┬─────────┘
                                   ↓
                         ┌───────────────────┐
                         │ DatabaseClient    │
                         └─────────┬─────────┘
                                   ↓
                         ┌───────────────────┐
                         │ Supabase DB       │
                         └───────────────────┘
```

### Architecture Summary

The framework consists of four primary automation areas:

**Web and Mobile Web**

```text
Test
 ↓
Page Object
 ↓
BasePage
 ↓
Demoblaze Web
```

**API**

```text
API Test
   ↓
ApiHelper
   ↓
ApiClient
   ↓
Demoblaze API
```

**Database**

```text
Test
   ↓
TestDataService
   ↓
DatabaseClient
   ↓
Supabase PostgreSQL
```

**Cross-Layer**

```text
Cross-Layer Test
        ↓
   API Interaction
        ↓
 Business State
        ↓
    Web Validation
```

---

# Framework Design

The internal framework follows a layered design.

Each layer has a specific responsibility so that test scenarios remain independent from low-level implementation details.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                           TEST LAYER                                │
│                                                                     │
│      Web Tests     Mobile Web Tests     API Tests     E2E Tests     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    BUSINESS / ACTION LAYER                          │
│                                                                     │
│      HomePage          LoginPage          ProductPage               │
│      CartPage          ApiHelper          TestDataService            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                          CORE LAYER                                 │
│                                                                     │
│      BasePage         ApiClient         DatabaseClient               │
│      AuthHelper       Custom Test Fixtures                           │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    CONFIGURATION / MODEL LAYER                      │
│                                                                     │
│         config.ts         apiConfig.ts         apiSchemas.ts         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SYSTEMS                              │
│                                                                     │
│       Demoblaze Web       Demoblaze API       Supabase DB           │
└─────────────────────────────────────────────────────────────────────┘
```

### Design Flow

```text
Test Scenario
     ↓
Business / Action Layer
     ↓
Reusable Core Components
     ↓
Configuration / Models
     ↓
Application / API / Database
```

This design keeps test files focused on **business scenarios**, while reusable implementation details remain in dedicated framework components.

---

# Design Decisions

## Separation of Web, Mobile Web, API and Cross-Layer Tests

Each test type validates a different application layer and is therefore maintained separately.

```text
Web Tests
    ↓
Browser Application

Mobile Web Tests
    ↓
Responsive Browser Application

API Tests
    ↓
Backend Services

Cross-Layer Tests
    ↓
API ↔ Web Validation
```

### Why

This provides:

- Independent execution
- Easier maintenance
- Better failure analysis
- Better CI parallelization
- Clear suite-level reporting

---

## Page-Based Web Design

Browser locators and application actions are maintained in dedicated Page Object classes.

```text
Test
 ↓
Page Object
 ↓
BasePage
 ↓
Browser
```

### Why

Keeping locators outside test cases prevents duplication.

If a locator changes, it can generally be updated in one Page Object instead of modifying multiple test cases.

Tests therefore remain focused on business behavior.

---

## API Client and API Helper Separation

API implementation is divided into two responsibilities.

```text
API Test
    ↓
ApiHelper
    ↓
ApiClient
    ↓
Demoblaze API
```

### ApiClient

Handles generic HTTP communication such as:

- GET
- POST
- PUT
- PATCH
- DELETE

### ApiHelper

Handles Demoblaze-specific business operations such as:

- Login
- Signup
- Product validation
- Cart operations
- API response validation
- Error handling

### Why

This avoids mixing generic HTTP implementation with application-specific business logic.

It also improves reusability and maintainability.

---

# Fixtures and Setup

The framework uses **Playwright built-in fixtures, custom test fixtures, and an authentication setup project**.

| Type | Used | Why |
|---|---|---|
| Built-in Fixtures | `page`, `browser`, `playwright` | Browser/page management and API context creation |
| Custom Test Fixtures | `homePage`, `loginPage`, `productPage`, `cartPage`, `apiRequest` | Reusable Page Objects and API request context are injected directly into tests |
| Authentication Setup | `auth.setup.ts` with `AuthHelper` | Validates or creates the authenticated session before dependent tests execute |
| Storage State | `auth/storageState.json` | Reuses authenticated browser state and avoids repeated UI login |

### Fixture Flow

```text
Playwright Built-in Fixtures
            ↓
      Custom Test Fixtures
            ↓
  Web / Mobile / API Tests
```

### Authentication Flow

```text
auth.setup.ts
      ↓
 AuthHelper
      ↓
Check Existing Session
      ↓
    Valid?
   ↙     ↘
 Yes      No
  ↓        ↓
Reuse    Login
           ↓
     Save Storage State
           ↓
     Dependent Tests
```

### Why

Custom fixtures reduce repeated object creation inside test files.

Authentication is handled separately because login does not need to be performed before every test.

Storage state allows authenticated tests to reuse the same valid session.

---

# Authentication Strategy

Authentication is managed using Playwright storage state.

```text
Authentication Setup
        ↓
Validate Existing Session
        ↓
       Valid?
      ↙     ↘
    Yes      No
     ↓        ↓
   Reuse    Login
              ↓
        Save Storage State
              ↓
        Dependent Tests
```

### Why

Without storage state:

```text
Test 1 → Login
Test 2 → Login
Test 3 → Login
Test 4 → Login
```

With storage state:

```text
Authentication Setup
        ↓
  Authenticated State
        ↓
 ┌──────┼──────┐
 ↓      ↓      ↓
Test 1 Test 2 Test 3
```

This reduces duplicate authentication steps and improves execution efficiency.

---

# API Schema Validation

Zod is used to validate API response contracts.

```text
API Response
     ↓
HTTP Status Validation
     ↓
Zod Schema Validation
     ↓
Business Validation
```

### Why

HTTP status validation alone does not guarantee that the API response structure is correct.

For example, a response may return HTTP `200` but contain:

- Missing fields
- Incorrect field types
- Unexpected response structure

Schema validation detects such contract issues early.

---

# Database-Driven Test Data

Supabase PostgreSQL is used as an external test-data source.

```text
Test
 ↓
TestDataService
 ↓
DatabaseClient
 ↓
Supabase PostgreSQL
```

### Why

Externalizing test data:

- Reduces hardcoded values
- Separates data from test logic
- Improves maintainability
- Allows data changes without changing test implementation

---

# Cross-Layer Design

The Cross-Layer test validates the same business state across API and Web layers.

```text
API Authentication
        ↓
Synchronize Browser Token
        ↓
API Add Product to Cart
        ↓
API Validate Product
        ↓
Web Open Cart
        ↓
Web Validate Same Product
        ↓
API Cleanup
```

### Why

Web tests validate the browser layer.

API tests validate the backend layer.

Cross-Layer testing confirms that business state created through the API is correctly reflected through the Web application.

This provides stronger end-to-end validation.

---

# Authentication Synchronization

The API token is synchronized with the browser session during Cross-Layer execution.

```text
API Login
   ↓
Authentication Token
   ↓
Browser Cookie
   ↓
Same User Session
   ↓
API and Web Validation
```

### Why

Without token synchronization, the API and browser could operate with different authenticated sessions.

That could result in API cart data being created for one session while the UI displays data for another session.

---

# Synchronization Strategy

The framework uses condition-based polling instead of unnecessary fixed waits.

```text
Check Expected State
        ↓
     Available?
      ↙     ↘
    Yes      No
     ↓        ↓
 Continue   Wait
              ↓
          Check Again
```

### Why

A fixed wait such as:

```text
Wait 5 seconds
```

does not guarantee that the expected state is available after exactly five seconds.

Polling waits for the actual condition and continues immediately when the expected state becomes available.

This improves both reliability and execution efficiency.

---

# Parallel Execution Strategy

Independent suites can execute in parallel.

State-sensitive Cross-Layer execution uses controlled worker execution.

```text
                         CI Execution
                              ↓
           ┌──────────────────┼──────────────────┐
           ↓                  ↓                  ↓
          Web             Mobile Web            API
       2 Workers           2 Workers          2 Workers
           │                  │                  │
           └──────────────────┼──────────────────┘
                              ↓
                         Cross-Layer
                          1 Worker
```

### Why

Web, Mobile Web, and API tests are suitable for parallel execution when they are independent.

Cross-Layer scenarios manipulate shared business state such as authentication and cart data.

Using one worker reduces the chance of race conditions and shared-state conflicts.

---

# Project Structure

```text
demoblaze_qa_automation/
│
├── auth/
│   └── storageState.json
│
├── config/
│   ├── config.ts
│   └── apiConfig.ts
│
├── fixtures/
│   └── testFixtures.ts
│
├── models/
│   └── apiSchemas.ts
│
├── pages/
│   ├── BasePage.ts
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   └── CartPage.ts
│
├── utils/
│   ├── ApiClient.ts
│   ├── ApiHelper.ts
│   ├── AuthHelper.ts
│   ├── DatabaseClient.ts
│   └── TestDataService.ts
│
├── tests/
│   ├── auth.setup.ts
│   │
│   ├── ui/
│   │   ├── login.spec.ts
│   │   ├── login.negative.spec.ts
│   │   └── purchase.spec.ts
│   │
│   ├── api/
│   │   ├── purchase.api.spec.ts
│   │   └── negative.api.spec.ts
│   │
│   └── e2e/
│       └── crosslayer.e2e.spec.ts
│
├── .github/
│   └── workflows/
│       └── playwright.yml
│
├── .vscode/
│   └── mcp.json
│
├── eslint.config.mjs
├── .prettierrc.json
├── .prettierignore
├── .env.example
├── .gitignore
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── README.md
```

---

# Environment Configuration

Create a `.env` file locally.

Required environment variables:

```text
BASE_URL=
API_URL=
UI_USERNAME=
UI_PASSWORD=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
```

Sensitive credentials are not committed to source control.

GitHub Actions uses repository secrets for CI execution.

---

# Installation

Install dependencies:

```bash
npm ci
```

Install Playwright browsers:

```bash
npx playwright install
```

---

# Test Execution

## Run All Tests

```bash
npm test
```

## Web

```bash
npm run test:web
```

## Mobile Web

```bash
npm run test:mobile
```

## API

```bash
npm run test:api
```

## Cross-Layer

```bash
npx playwright test --project=cross-layer --workers=1
```

---

# Code Quality

The framework uses TypeScript, ESLint, and Prettier as code-quality gates.

```text
Source Code
    ↓
TypeScript
    ↓
ESLint
    ↓
Prettier
    ↓
Automation Execution
```

Run TypeScript validation:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

Run Prettier validation:

```bash
npm run format:check
```

Run all quality checks:

```bash
npm run check
```

---

# CI/CD

GitHub Actions is used for automated code-quality validation, test execution, and reporting.

```text
                      GitHub Repository
                              ↓
                       GitHub Actions
                              ↓
                       Quality Checks
                              ↓
               TypeScript → ESLint → Prettier
                              ↓
          ┌───────────────────┼───────────────────┐
          ↓                   ↓                   ↓
         Web              Mobile Web             API
      2 Workers           2 Workers           2 Workers
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ↓
                         Cross-Layer
                          1 Worker
                              ↓
                       Allure Results
                              ↓
                       Merge Results
                              ↓
                  Combined Allure Report
                              ↓
                         CI Artifacts
```

The CI pipeline provides both:

- Individual suite reports
- Combined execution report

---

# Reporting

The framework provides:

- Playwright HTML Report
- Individual Allure results
- Combined Allure Report
- Failure screenshots
- Playwright traces based on configuration
- Execution video based on Playwright configuration

---

## Playwright HTML Report

Open the Playwright report:

```bash
npm run report
```

---

## Allure Report

Generate the Allure report:

```bash
npm run allure:generate
```

Open the Allure report:

```bash
npm run allure:open
```

---

## CI Report Artifacts

The CI pipeline maintains individual artifacts for each test suite.

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

The individual Allure results are merged to generate:

```text
combined-allure-report
```

---

# Reporting Strategy

The reporting strategy provides two levels of visibility.

## Individual Reports

Individual reports help identify failures within a specific suite.

```text
Web
   ↓
Web Report

Mobile Web
   ↓
Mobile Report

API
   ↓
API Report

Cross-Layer
   ↓
Cross-Layer Report
```

## Combined Report

All suite results are merged into one centralized report.

```text
Web Results ──────────────┐
Mobile Web Results ───────┤
API Results ──────────────┼──→ Combined Allure Report
Cross-Layer Results ──────┘
```

This provides a consolidated execution view for reviewers and stakeholders.

---

# Execution Evidence

## Automation Execution Video

The execution video demonstrates the automation framework execution and reporting.

Recommended video coverage:

```text
Framework Overview
      ↓
Web Execution
      ↓
Mobile Web Execution
      ↓
API Execution
      ↓
Cross-Layer Execution
      ↓
Allure Report
      ↓
GitHub Actions
```

**Execution Video:**  
`<ADD_EXECUTION_VIDEO_LINK>`

---

## Allure Report

**Execution Report:**  
`<ADD_ALLURE_REPORT_LINK>`

---

## GitHub Actions

**Latest CI Execution:**  
`<ADD_GITHUB_ACTIONS_RUN_LINK>`

---

# Playwright MCP

Playwright MCP is included as an optional development aid.

It can assist with:

- Browser exploration
- Locator discovery
- Debugging
- Development productivity

```text
Developer
   ↓
Playwright MCP
   ↓
Browser Exploration
   ↓
Locator / Debugging Support
```

MCP is not required for the actual automation execution or CI pipeline.

The framework remains independently executable through Playwright.

---

# Key Framework Benefits

- Web automation
- Mobile Web automation
- API automation
- Negative scenario validation
- API contract validation
- Database-driven external test data
- Cross-Layer API and Web validation
- Reusable browser authentication
- Reusable Page Objects
- Reusable API abstraction
- Custom test fixtures
- Condition-based polling
- Parallel execution for independent suites
- Controlled execution for shared-state scenarios
- TypeScript quality validation
- ESLint validation
- Prettier formatting validation
- GitHub Actions CI/CD
- Individual execution reports
- Combined Allure reporting
- Externalized environment configuration

---

# Future Enhancements

Potential enhancements include:

- Additional negative scenarios
- Additional boundary-value scenarios
- Expanded API schema validation
- Accessibility testing
- Visual regression testing
- Dedicated users for parallel state-sensitive scenarios
- Automated test-data lifecycle management
- Allure history and trend reporting
- Environment-specific configuration
- Extended browser coverage

---

# Assignment Scope

The framework demonstrates:

**Web + Mobile Web + API + Database + Cross-Layer Testing + CI/CD + Reporting + Code Quality**

The implementation focuses on:

- Maintainability
- Reusability
- Test isolation
- Framework design
- Authentication reuse
- Synchronization
- API contract validation
- Database-driven test data
- Parallel execution
- Reporting
- CI readiness

---

# Author

**Sri Prakash Narendran** 