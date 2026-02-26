import { test, expect } from '@playwright/test';
import { waitForLiveView, loginViaUI } from './helpers.js';

test.describe('Register with invite', () => {
  test('new user cannot access flows (redirect to dashboard)', async ({ browser }) => {
    const adminContext = await browser.newContext({ storageState: 'e2e/.auth/user.json' });
    const adminPage = await adminContext.newPage();
    await adminPage.goto('/users');
    await waitForLiveView(adminPage);
    await adminPage.getByRole('button', { name: 'Generate invite link' }).click();
    await expect(adminPage.locator('input#invite-url')).toBeVisible({ timeout: 5000 });
    const inviteUrl = await adminPage.locator('input#invite-url').inputValue();
    await adminContext.close();

    const guestContext = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const guestPage = await guestContext.newPage();
    await guestPage.goto(inviteUrl);
    await waitForLiveView(guestPage);
    const username = 'e2euser' + Date.now();
    const email = 'e2e' + Date.now() + '@example.com';
    await guestPage.getByLabel('Username').fill(username);
    await guestPage.getByLabel('Email').fill(email);
    await guestPage.getByLabel('Password', { exact: true }).first().fill('password123');
    await guestPage.getByLabel('Confirm password').fill('password123');
    await guestPage.getByRole('button', { name: 'Create account' }).click();
    await expect(guestPage).toHaveURL(/\/users\/log-in/, { timeout: 10000 });

    await loginViaUI(guestPage, username, 'password123');
    await expect(guestPage).not.toHaveURL(/log-in/, { timeout: 10000 });

    await guestPage.goto('/flows');
    await waitForLiveView(guestPage);
    await expect(guestPage).toHaveURL(/\//);
    await guestContext.close();
  });
});

test.describe('Register with invite (no auth)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('invalid token redirects to log-in when not logged in', async ({ page }) => {
    await page.goto('/users/register/invalid-token');
    await waitForLiveView(page);

    await expect(page).toHaveURL(/\/users\/log-in/);
  });
});
