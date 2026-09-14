import { DatabaseClient } from "./DatabaseClient";
export interface PurchaseData {
  products: {
    name: string;
    id: number;
  };
  checkout: {
    name: string;
    country: string;
    city: string;
    card: string;
    month: string;
    year: string;
  };
  expected: {
    purchaseSuccess: string;
  };
}
export class TestDataService {
  private readonly db = new DatabaseClient();
  async getPurchaseData(scenario = "purchase_default"): Promise<PurchaseData> {
    const { data, error } = await this.db.client.from("test_data").select("data").eq("scenario", scenario).eq("active", true).single();
    if (error) throw new Error(`Unable to get test data: ${error.message}`);
    if (!data) throw new Error(`Test data not found for scenario: ${scenario}`);
    return data.data as PurchaseData;
  }
}