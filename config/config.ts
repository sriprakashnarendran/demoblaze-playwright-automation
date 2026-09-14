import * as dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(
    process.cwd(),
    ".env",
  ),
});

const requireEnv = (
  name: string,
): string => {
  const value =
    process.env[name];

  if (!value) {
    throw new Error(
      `${name} is missing in .env`,
    );
  }

  return value;
};

export const config = {
  ui: {
    baseURL:
      process.env.BASE_URL ??
      "https://www.demoblaze.com",

    username:
      requireEnv(
        "UI_USERNAME",
      ),

    password:
      requireEnv(
        "UI_PASSWORD",
      ),
  },

  api: {
    baseURL:
      process.env.API_URL ??
      "https://api.demoblaze.com",
  },

  timeout: {
    test: 60_000,

    expect: 10_000,

    action: 15_000,

    navigation: 30_000,
  },
} as const;