import { defineConfig } from '@playwright/test';
import { testWithII } from '@dfinity/internet-identity-playwright';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10_000,
  },
});
