import { APIResponse, expect } from "@playwright/test";
import * as allure from "allure-js-commons";
import { ContentType } from "allure-js-commons";
import { randomUUID } from "crypto";
import { ApiClient } from "./ApiClient";

export class ApiHelper {
  constructor(private readonly api: ApiClient) {}

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
    expect(response.status()).toBe(200);
    if (body && typeof body === "object" && body.errorMessage) throw new Error(`API Error: ${body.errorMessage}`);
    return body;
  }

  async signup(username: string, password: string): Promise<void> {
    const response = await this.api.post("/signup", { username, password: this.encode(password) });
    await this.validate("Signup Response", response);
  }

  async login(username: string, password: string): Promise<string> {
    const response = await this.api.post("/login", { username, password: this.encode(password) });
    const body = String(await this.validate("Login Response", response));
    const token = body.match(/Auth_token:\s*([^"]+)/)?.[1]?.trim();
    if (!token) throw new Error(`Auth token not found: ${body}`);
    return token;
  }

  async getProduct(productId: number, productName: string): Promise<void> {
    const response = await this.api.post("/view", { id: String(productId) });
    const body = await this.validate("Product Response", response);
    expect(String(body.title)).toContain(productName);
  }

  async addToCart(token: string, productId: number): Promise<void> {
    const response = await this.api.post("/addtocart", { id: randomUUID(), cookie: token, prod_id: productId, flag: true });
    await this.validate("Add To Cart Response", response);
  }

  async validateCart(token: string, productId: number): Promise<void> {
    const response = await this.api.post("/viewcart", { cookie: token, flag: true });
    const body = await this.validate("View Cart Response", response);
    const items = this.cartItems(body);
    expect(items.length, `Cart is empty: ${JSON.stringify(body)}`).toBeGreaterThan(0);
    expect(items.some((item: any) => Number(this.productId(item)) === Number(productId))).toBeTruthy();
  }

  async cleanup(token: string): Promise<void> {
    const response = await this.api.post("/deletecart", { cookie: token });
    await this.validate("Delete Cart Response", response);
  }

  private cartItems(body: any): any[] {
    if (Array.isArray(body)) return body;
    if (!body || typeof body !== "object") return [];
    for (const key of ["Items", "items", "cart", "Cart", "products"]) if (Array.isArray(body[key])) return body[key];
    return this.productId(body) !== undefined ? [body] : [];
  }

  private productId(item: any): unknown {
    return item?.prod_id ?? item?.prodId ?? item?.productId ?? item?.product_id ?? item?.id;
  }
}