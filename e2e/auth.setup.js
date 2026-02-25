import { test as setup, expect } from '@playwright/test';
import { loginViaUI } from './helpers.js';

const authFile = 'e2e/.auth/user.json';

setup('authenticate', async ({ page }) => {
  await loginViaUI(page);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  await page.context().storageState({ path: authFile });
});
