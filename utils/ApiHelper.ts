import { APIResponse, expect } from "@playwright/test";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { randomUUID } from "crypto";
import { apiConfig } from "../config/apiConfig";
import { apiErrorSchema, productResponseSchema } from "../models/apiSchemas";
import { ApiClient } from "./ApiClient";

export class ApiHelper {
  constructor(private readonly api: ApiClient) {}

  private encode(value: string): string {
    return Buffer.from(value, "utf8").toString("base64");
  }

  private async body(response: APIResponse): Promise<unknown> {
    const text = await response.text();
    if (!text.trim()) return "";
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  private async attachResponse(name: string, response: APIResponse, body: unknown): Promise<void> {
    await allure.attachment(`${name} - Status`, String(response.status()), ContentType.TEXT);
    const attachment = typeof body === "string" ? body : JSON.stringify(body, null, 2);
    await allure.attachment(
      `${name} - Body`,
      attachment,
      typeof body === "string" ? ContentType.TEXT : ContentType.JSON,
    );
  }

  private async validate(name: string, response: APIResponse): Promise<unknown> {
    const body = await this.body(response);
    await this.attachResponse(name, response, body);
    expect(response.status()).toBe(apiConfig.defaults.expectedStatus);
    const error = apiErrorSchema.safeParse(body);
    if (error.success) throw new Error(`API Error: ${error.data.errorMessage}`);
    return body;
  }

  async signup(username: string, password: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.signup, {
      username,
      password: this.encode(password),
    });
    await this.validate(apiConfig.allure.signup, response);
  }

  async login(username: string, password: string): Promise<string> {
    const response = await this.api.post(apiConfig.endpoints.login, {
      username,
      password: this.encode(password),
    });
    const body = String(await this.validate(apiConfig.allure.login, response));
    const token = body.match(new RegExp(`${apiConfig.response.authToken}:\\s*([^"]+)`))?.[1]?.trim();
    if (!token) throw new Error(`Auth token not found: ${body}`);
    return token;
  }

  async expectLoginFailure(username: string, password: string, expectedMessage?: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.login, {
      username,
      password: this.encode(password),
    });
    const body = await this.body(response);
    await this.attachResponse("Invalid Login Response", response, body);
    expect(response.status()).toBe(apiConfig.defaults.expectedStatus);
    const error = apiErrorSchema.parse(body);
    expect(error.errorMessage).toBeTruthy();
    if (expectedMessage) expect(error.errorMessage).toContain(expectedMessage);
  }

  async getProduct(productId: number, productName: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.product, {
      id: String(productId),
    });
    const body = await this.validate(apiConfig.allure.product, response);
    const product = productResponseSchema.parse(body);
    expect(product.id).toBe(productId);
    expect(product.title).toBe(productName);
    expect(product.price).toBeGreaterThan(0);
  }

  async addToCart(token: string, productId: number): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.addToCart, {
      id: randomUUID(),
      cookie: token,
      prod_id: productId,
      flag: apiConfig.defaults.flag,
    });
    await this.validate(apiConfig.allure.addToCart, response);
  }

  async validateCart(token: string, productId: number): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.viewCart, {
      cookie: token,
      flag: apiConfig.defaults.flag,
    });
    const body = await this.validate(apiConfig.allure.viewCart, response);
    const items = this.cartItems(body);
    expect(items.length, `Cart is empty: ${JSON.stringify(body)}`).toBeGreaterThan(0);
    expect(items.some((item) => Number(this.productId(item)) === Number(productId))).toBeTruthy();
  }

  async cleanup(token: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.deleteCart, {
      cookie: token,
    });
    await this.validate(apiConfig.allure.deleteCart, response);
  }

  async waitForCartProduct(
    token: string,
    productId: number,
    timeout = apiConfig.defaults.pollingTimeout,
  ): Promise<void> {
    const start = Date.now();
    let attempts = 0;
    while (Date.now() - start < timeout) {
      attempts++;
      const response = await this.api.post(apiConfig.endpoints.viewCart, {
        cookie: token,
        flag: apiConfig.defaults.flag,
      });
      const body = await this.body(response);
      const items = this.cartItems(body);
      const found = items.some((item) => Number(this.productId(item)) === Number(productId));
      if (found) {
        await allure.attachment(
          "Cart Synchronization",
          `Product ${productId} found after ${attempts} attempt(s)`,
          ContentType.TEXT,
        );
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, apiConfig.defaults.pollingInterval));
    }
    throw new Error(
      `Product ${productId} was not available after ${attempts} attempts within ${timeout}ms`,
    );
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
  }

  private cartItems(body: unknown): Record<string, unknown>[] {
    if (Array.isArray(body)) {
      return body.filter((item): item is Record<string, unknown> => this.isRecord(item));
    }
    if (!this.isRecord(body)) return [];
    for (const key of apiConfig.response.cartKeys) {
      const value = body[key];
      if (Array.isArray(value)) {
        return value.filter((item): item is Record<string, unknown> => this.isRecord(item));
      }
    }
    return this.productId(body) !== undefined ? [body] : [];
  }

  private productId(item: Record<string, unknown>): unknown {
    return item.prod_id ?? item.prodId ?? item.productId ?? item.product_id ?? item.id;
  }
}