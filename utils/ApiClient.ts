import {
  APIRequestContext,
  APIResponse,
} from "@playwright/test";

import { randomUUID } from "crypto";

export class ApiClient {
  constructor(
    private readonly request: APIRequestContext,
  ) {}

  static encodePassword(
    password: string,
  ): string {
    return Buffer
      .from(password, "utf8")
      .toString("base64");
  }

  static extractAuthToken(
    loginResponseBody: string,
  ): string {
    const match =
      loginResponseBody.match(
        /Auth_token:\s*([^"]+)/,
      );

    if (!match?.[1]) {
      throw new Error(
        `Unable to extract Auth_token from response: ${loginResponseBody}`,
      );
    }

    return match[1].trim();
  }

  async signup(
    username: string,
    password: string,
  ): Promise<APIResponse> {
    return this.request.post(
      "/signup",
      {
        data: {
          username,
          password:
            ApiClient.encodePassword(
              password,
            ),
        },
      },
    );
  }

  async login(
    username: string,
    password: string,
  ): Promise<APIResponse> {
    return this.request.post(
      "/login",
      {
        data: {
          username,
          password:
            ApiClient.encodePassword(
              password,
            ),
        },
      },
    );
  }

  async getProduct(
    productId: number,
  ): Promise<APIResponse> {
    return this.request.post(
      "/view",
      {
        data: {
          id: String(productId),
        },
      },
    );
  }

  async addToCart(
    authToken: string,
    productId: number,
  ): Promise<APIResponse> {
    return this.request.post(
      "/addtocart",
      {
        data: {
          id: randomUUID(),
          cookie: authToken,
          prod_id: productId,
          flag: true,
        },
      },
    );
  }

  async viewCart(
    authToken: string,
  ): Promise<APIResponse> {
    return this.request.post(
      "/viewcart",
      {
        data: {
          cookie: authToken,
          flag: true,
        },
      },
    );
  }

  async deleteCart(
    authToken: string,
  ): Promise<APIResponse> {
    return this.request.post(
      "/deletecart",
      {
        data: {
          cookie: authToken,
        },
      },
    );
  }
}