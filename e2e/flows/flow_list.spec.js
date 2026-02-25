import { test, expect } from '@playwright/test';
import { waitForLiveView, clickAndWaitForNavigation } from '../helpers.js';

test.describe('Flow List', () => {
  test('displays the flows page', async ({ page }) => {
    await page.goto('/flows');
    await waitForLiveView(page);

    await expect(page.getByRole('heading', { name: 'My Flows' })).toBeVisible();
    await expect(page.getByText('Flows available')).toBeVisible();
  });

  test('creates a new flow and navigates to editor', async ({ page }) => {
    await page.goto('/flows');
    await waitForLiveView(page);

    await clickAndWaitForNavigation(
      page,
      page.getByRole('button', { name: 'New Flow' }),
      /\/flows\/.+/,
    );
  });

  test('navigates to flow editor when clicking a flow', async ({ page }) => {
    await page.goto('/flows');
    await waitForLiveView(page);

    await clickAndWaitForNavigation(
      page,
      page.getByRole('button', { name: 'New Flow' }),
      /\/flows\/.+/,
    );

    await page.goto('/flows');
    await waitForLiveView(page);

    const firstFlow = page.locator('ul[role="list"] li a').first();
    await expect(firstFlow).toBeVisible({ timeout: 5000 });
    await firstFlow.click();
    await expect(page).toHaveURL(/\/flows\/.+/, { timeout: 10000 });
  });
});
