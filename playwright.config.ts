import { defineConfig } from "@playwright/test";
import { existsSync } from "node:fs";

const localChrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync(localChrome) ? localChrome : undefined);

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  workers: 1,
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI },
  use: {
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1440, height: 1100 },
    launchOptions: { executablePath },
    headless: true,
  },
});
