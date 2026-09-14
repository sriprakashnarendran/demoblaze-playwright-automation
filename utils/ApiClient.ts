import { APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async get(endpoint: string): Promise<APIResponse> {
    return this.request.get(endpoint);
  }

  async post(endpoint: string, data?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.post(endpoint, { data });
  }

  async put(endpoint: string, data?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.put(endpoint, { data });
  }

  async patch(endpoint: string, data?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.patch(endpoint, { data });
  }

  async delete(endpoint: string, data?: Record<string, unknown>): Promise<APIResponse> {
    return this.request.delete(endpoint, { data });
  }
}
