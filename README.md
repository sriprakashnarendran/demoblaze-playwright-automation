# Demoblaze Playwright TypeScript Framework

## Scope
- 2 UI tests: stored-session validation and purchase flow.
- Same UI tests run on Desktop Chrome and Pixel 7 mobile emulation.
- UI credentials are used only by global setup.
- 1 API E2E test: signup -> login -> get product -> add cart -> view cart -> completion/cleanup -> validate.
- Demoblaze API passwords are Base64 encoded by ApiClient.
- Demoblaze has no dedicated public checkout endpoint; actual Purchase is validated in UI, while API validates the cart lifecycle.

## Install
```bash
npm install
npx playwright install chromium
```

## Run
```bash
npm test
npm run test:ui
npm run test:web
npm run test:mobile
npm run test:api
```

## Reports
```bash
npm run report
npm run allure:generate
npm run allure:open
```
Allure CLI requires Java.
