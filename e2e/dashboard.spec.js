import { test, expect } from '@playwright/test';
import { waitForLiveView, clickAndWaitForNavigation } from './helpers.js';

test.describe('Dashboard', () => {
  test('displays dashboard heading and stats cards', async ({ page }) => {
    await page.goto('/');
    await waitForLiveView(page);

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Total Workflows')).toBeVisible();
    await expect(page.getByText('Total Processed Nodes')).toBeVisible();
    await expect(page.getByText('Active Integrations')).toBeVisible();
  });

  test('shows recent workflows section', async ({ page }) => {
    await page.goto('/');
    await waitForLiveView(page);

    await expect(page.getByText('Recent Workflows')).toBeVisible();
  });

  test('navigates to flows page via Manage Flows button', async ({ page }) => {
    await page.goto('/');
    await waitForLiveView(page);

    await clickAndWaitForNavigation(
      page,
      page.getByRole('link', { name: 'Manage Flows' }),
      /\/flows/,
    );
    await expect(page.getByRole('heading', { name: 'My Flows' })).toBeVisible();
  });

  test('sidebar has navigation links', async ({ page }) => {
    await page.goto('/');
    await waitForLiveView(page);

    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'My Flows' })).toBeVisible();
  });
});
