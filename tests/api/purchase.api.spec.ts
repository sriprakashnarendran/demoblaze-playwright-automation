import {
  APIResponse,
  expect,
  request,
  test,
} from "@playwright/test";

import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";

import { config } from "../../config/config";
import { ApiClient } from "../../utils/ApiClient";
import { data } from "../../utils/TestData";

test(
  "@api API E2E - signup login add product validate cart and cleanup",
  async () => {
    await allure.epic("Demoblaze");
    await allure.feature("API");
    await allure.story(
      "Signup Login Product Cart",
    );
    await allure.severity("critical");

    const apiContext =
      await request.newContext({
        baseURL: config.api.baseURL,

        extraHTTPHeaders: {
          "Content-Type":
            "application/json",
          Accept:
            "application/json",
        },
      });

    const apiClient =
      new ApiClient(apiContext);

    const uniqueValue =
      Date.now();

    const username =
      `apiuser_${uniqueValue}`;

    const password =
      `Api@${uniqueValue}`;

    let authToken = "";

    try {
      await allure.step(
        "Create unique API user",
        async () => {
          const response =
            await apiClient.signup(
              username,
              password,
            );

          const body =
            await getResponseBody(
              response,
            );

          await attachResponse(
            "Signup Response",
            response,
            body,
          );

          expect(
            response.status(),
          ).toBe(200);
        },
      );

      await allure.step(
        "Login using API user",
        async () => {
          const response =
            await apiClient.login(
              username,
              password,
            );

          const body =
            await response.text();

          await allure.attachment(
            "Login Response",
            body,
            ContentType.TEXT,
          );

          expect(
            response.status(),
          ).toBe(200);

          expect(
            body,
          ).toContain(
            "Auth_token:",
          );

          authToken =
            ApiClient.extractAuthToken(
              body,
            );

          expect(
            authToken,
          ).toBeTruthy();
        },
      );

      await allure.step(
        `Get product: ${data.products.name}`,
        async () => {
          const response =
            await apiClient.getProduct(
              data.products.id,
            );

          const body =
            await getResponseBody(
              response,
            );

          await attachResponse(
            "Product Response",
            response,
            body,
          );

          expect(
            response.status(),
          ).toBe(200);

          expect(
            body,
          ).toBeTruthy();

          if (
            body &&
            typeof body ===
              "object" &&
            "title" in body
          ) {
            expect(
              String(body.title),
            ).toContain(
              data.products.name,
            );
          }
        },
      );

      await allure.step(
        "Add product to cart",
        async () => {
          const response =
            await apiClient.addToCart(
              authToken,
              data.products.id,
            );

          const body =
            await getResponseBody(
              response,
            );

          await attachResponse(
            "Add To Cart Response",
            response,
            body,
          );

          expect(
            response.status(),
          ).toBe(200);

          expect(
            body,
          ).not.toEqual(
            expect.objectContaining({
              errorMessage:
                expect.any(String),
            }),
          );
        },
      );

      await allure.step(
        "View cart and validate added product",
        async () => {
          const response =
            await apiClient.viewCart(
              authToken,
            );

          const body =
            await getResponseBody(
              response,
            );

          await attachResponse(
            "View Cart Response",
            response,
            body,
          );

          expect(
            response.status(),
          ).toBe(200);

          expect(
            body,
          ).not.toEqual(
            expect.objectContaining({
              errorMessage:
                expect.any(String),
            }),
          );

          const cartItems =
            normalizeCartItems(
              body,
            );

          expect(
            cartItems.length,
            `Cart is empty. Response: ${JSON.stringify(body)}`,
          ).toBeGreaterThan(0);

          const cartProduct =
            cartItems.find(
              (item) =>
                Number(
                  getProductId(
                    item,
                  ),
                ) ===
                Number(
                  data.products.id,
                ),
            );

          expect(
            cartProduct,
            `Product ${data.products.id} not found in cart.`,
          ).toBeDefined();
        },
      );

      await allure.step(
        "Call delete cart endpoint",
        async () => {
          const response =
            await apiClient.deleteCart(
              authToken,
            );

          const body =
            await getResponseBody(
              response,
            );

          await attachResponse(
            "Delete Cart Response",
            response,
            body,
          );

          expect(
            response.status(),
          ).toBe(200);
        },
      );
    } finally {
      await apiContext.dispose();
    }
  },
);

async function getResponseBody(
  response: APIResponse,
): Promise<any> {
  const text =
    await response.text();

  if (!text.trim()) {
    return "";
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function normalizeCartItems(
  body: any,
): any[] {
  if (Array.isArray(body)) {
    return body;
  }

  if (
    body &&
    typeof body ===
      "object"
  ) {
    if (
      Array.isArray(body.Items)
    ) {
      return body.Items;
    }

    if (
      Array.isArray(body.items)
    ) {
      return body.items;
    }

    if (
      Array.isArray(body.cart)
    ) {
      return body.cart;
    }

    if (
      Array.isArray(body.Cart)
    ) {
      return body.Cart;
    }

    if (
      Array.isArray(
        body.products,
      )
    ) {
      return body.products;
    }

    if (
      body.prod_id !==
        undefined ||
      body.prodId !==
        undefined ||
      body.productId !==
        undefined
    ) {
      return [body];
    }
  }

  return [];
}

function getProductId(
  item: any,
): unknown {
  if (
    !item ||
    typeof item !==
      "object"
  ) {
    return undefined;
  }

  return (
    item.prod_id ??
    item.prodId ??
    item.productId ??
    item.product_id ??
    item.id
  );
}

async function attachResponse(
  name: string,
  response: APIResponse,
  body: any,
): Promise<void> {
  await allure.attachment(
    `${name} - Status`,
    String(
      response.status(),
    ),
    ContentType.TEXT,
  );

  const attachmentBody =
    typeof body === "string"
      ? body
      : JSON.stringify(
          body,
          null,
          2,
        );

  await allure.attachment(
    `${name} - Body`,
    attachmentBody,
    typeof body === "string"
      ? ContentType.TEXT
      : ContentType.JSON,
  );
}