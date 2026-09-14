import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config/config";
export class DatabaseClient {
  readonly client: SupabaseClient;
  constructor() {
    this.client = createClient(config.db.url, config.db.key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
}