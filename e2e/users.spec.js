import { test, expect } from '@playwright/test';
import { waitForLiveView } from './helpers.js';

test.describe('Users (admin)', () => {
  test('displays users page with invite section', async ({ page }) => {
    await page.goto('/users');
    await waitForLiveView(page);

    await expect(page.getByRole('heading', { name: 'Users', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Invite link' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Generate invite link' })).toBeVisible();
  });

  test('generate invite shows invite URL', async ({ page }) => {
    await page.goto('/users');
    await waitForLiveView(page);

    await page.getByRole('button', { name: 'Generate invite link' }).click();
    await expect(page.locator('input#invite-url')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('input#invite-url')).toHaveValue(/\/users\/register\//);
  });

  test('lists all users in table', async ({ page }) => {
    await page.goto('/users');
    await waitForLiveView(page);

    await expect(page.getByText('All users')).toBeVisible();
    await expect(page.getByRole('table')).toBeVisible();
  });
});
