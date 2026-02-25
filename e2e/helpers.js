import { expect } from '@playwright/test';

export async function waitForLiveView(page, timeout = 15000) {
  await page.waitForFunction(() => window.liveSocket?.isConnected(), { timeout });
}

export async function loginViaUI(page, username = 'admin', password = 'admin') {
  await page.goto('/users/log-in');
  await waitForLiveView(page);

  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);

  await page.getByRole('button', { name: 'Log in' }).click();

  try {
    await expect(page).not.toHaveURL(/log-in/, { timeout: 10000 });
  } catch {
    await page.getByRole('button', { name: 'Log in' }).click({ timeout: 2000 }).catch(() => {});
    await expect(page).not.toHaveURL(/log-in/, { timeout: 15000 });
  }
}

export async function clickAndWaitForNavigation(page, locator, urlPattern, timeout = 15000) {
  await locator.click();
  try {
    await expect(page).toHaveURL(urlPattern, { timeout: Math.floor(timeout / 2) });
  } catch {
    await locator.click({ timeout: 2000 }).catch(() => {});
    await expect(page).toHaveURL(urlPattern, { timeout: Math.floor(timeout / 2) });
  }
}
