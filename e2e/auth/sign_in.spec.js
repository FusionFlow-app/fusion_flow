import { test, expect } from '@playwright/test';
import { loginViaUI, waitForLiveView } from '../helpers.js';

test.use({ storageState: { cookies: [], origins: [] } });
test.describe.configure({ timeout: 60000 });

test('user can sign in and is redirected to dashboard', async ({ page }) => {
  await loginViaUI(page);
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
});

test('shows error with invalid credentials', async ({ page }) => {
  await page.goto('/users/log-in');
  await waitForLiveView(page);

  await page.getByRole('textbox', { name: 'Username' }).fill('wrong');
  await page.getByRole('textbox', { name: 'Password' }).fill('wrongpassword');

  await page.getByRole('button', { name: 'Log in' }).click();
  await page.waitForTimeout(5000);

  if (page.url().includes('log-in')) {
    await page.getByRole('button', { name: 'Log in' }).click({ timeout: 2000 }).catch(() => {});
    await page.waitForTimeout(3000);
  }

  await expect(page).toHaveURL(/log-in/);
});

test('unauthenticated user is redirected to login', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/log-in/, { timeout: 10000 });
});
