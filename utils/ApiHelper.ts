
import { APIResponse, expect } from "@playwright/test";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { randomUUID } from "crypto";
import { apiConfig } from "../config/apiconfig";
import { ApiClient } from "./ApiClient";
export class ApiHelper {
  constructor(private readonly api: ApiClient) { }
  private encode(value: string): string {
    return Buffer.from(value, "utf8").toString("base64");
  }
  private async body(response: APIResponse): Promise<any> {
    const text = await response.text();
    if (!text.trim()) return "";
    try { return JSON.parse(text); } catch { return text; }
  }
  private async validate(name: string, response: APIResponse): Promise<any> {
    const body = await this.body(response);
    await allure.attachment(`${name} - Status`, String(response.status()), ContentType.TEXT);
    await allure.attachment(`${name} - Body`, typeof body === "string" ? body : JSON.stringify(body, null, 2), typeof body === "string" ? ContentType.TEXT : ContentType.JSON);
    expect(response.status()).toBe(apiConfig.defaults.expectedStatus);
    if (body && typeof body === "object" && body.errorMessage) throw new Error(`API Error: ${body.errorMessage}`);
    return body;
  }
  async signup(username: string, password: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.signup, { username, password: this.encode(password) });
    await this.validate(apiConfig.allure.signup, response);
  }
  async login(username: string, password: string): Promise<string> {
    const response = await this.api.post(apiConfig.endpoints.login, { username, password: this.encode(password) });
    const body = String(await this.validate(apiConfig.allure.login, response));
    const token = body.match(new RegExp(`${apiConfig.response.authToken}:\\s*([^"]+)`))?.[1]?.trim();
    if (!token) throw new Error(`Auth token not found: ${body}`);
    return token;
  }
  async getProduct(productId: number, productName: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.product, { id: String(productId) });
    const body = await this.validate(apiConfig.allure.product, response);
    expect(String(body.title)).toContain(productName);
  }
  async addToCart(token: string, productId: number): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.addToCart, { id: randomUUID(), cookie: token, prod_id: productId, flag: apiConfig.defaults.flag });
    await this.validate(apiConfig.allure.addToCart, response);
  }
  async validateCart(token: string, productId: number): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.viewCart, { cookie: token, flag: apiConfig.defaults.flag });
    const body = await this.validate(apiConfig.allure.viewCart, response);
    const items = this.cartItems(body);
    expect(items.length, `Cart is empty: ${JSON.stringify(body)}`).toBeGreaterThan(0);
    expect(items.some((item: any) => Number(this.productId(item)) === Number(productId))).toBeTruthy();
  }
  async cleanup(token: string): Promise<void> {
    const response = await this.api.post(apiConfig.endpoints.deleteCart, { cookie: token });
    await this.validate(apiConfig.allure.deleteCart, response);
  }
  async waitForCartProduct(token: string, productId: number, timeout = apiConfig.defaults.pollingTimeout): Promise<void> {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const response = await this.api.post(apiConfig.endpoints.viewCart, { cookie: token, flag: apiConfig.defaults.flag });
      const body = await this.body(response);
      const items = this.cartItems(body);
      if (items.some((item: any) => Number(this.productId(item)) === Number(productId))) return;
      await new Promise(resolve => setTimeout(resolve, apiConfig.defaults.pollingInterval));
    }
    throw new Error(`Product ${productId} was not available in cart within ${timeout}ms`);
  }
  private cartItems(body: any): any[] {
    if (Array.isArray(body)) return body;
    if (!body || typeof body !== "object") return [];
    for (const key of apiConfig.response.cartKeys) if (Array.isArray(body[key])) return body[key];
    return this.productId(body) !== undefined ? [body] : [];
  }
  private productId(item: any): unknown {
    return item?.prod_id ?? item?.prodId ?? item?.productId ?? item?.product_id ?? item?.id;
  }
}

