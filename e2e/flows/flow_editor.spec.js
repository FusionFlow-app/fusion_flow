import { test, expect } from '@playwright/test';
import { waitForLiveView, clickAndWaitForNavigation } from '../helpers.js';

test.describe('Flow Editor', () => {
  test.describe.configure({ timeout: 60000 });

  test.beforeEach(async ({ page }) => {
    await page.goto('/flows');
    await waitForLiveView(page);

    await clickAndWaitForNavigation(
      page,
      page.getByRole('button', { name: 'New Flow' }),
      /\/flows\/.+/,
    );

    await waitForLiveView(page);
  });

  test('displays flow editor header with flow name', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Run Flow' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Flows' })).toBeVisible();
  });

  test('displays node sidebar with categories', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.getByText('Nodes')).toBeVisible();
    await expect(page.getByText('Flow Control')).toBeVisible();
    await expect(page.getByText('Utility')).toBeVisible();
  });

  test('displays rete editor canvas', async ({ page }) => {
    await expect(page.locator('#rete-container')).toBeVisible();
    await expect(page.locator('#rete')).toBeVisible();
  });

  test('navigates back to flows list', async ({ page }) => {
    await page.getByRole('link', { name: 'Flows' }).click();
    await expect(page).toHaveURL(/\/flows$/, { timeout: 10000 });
  });

  test('opens dependencies modal', async ({ page }) => {
    await page.getByRole('button', { name: 'Dependencies' }).click();
    await expect(page.getByText('Project Dependencies')).toBeVisible({ timeout: 5000 });
  });

  test.describe('Context Menu', () => {
    test('shows Undo, Redo and Create Node on empty canvas right-click', async ({ page }) => {
      const rete = page.locator('#rete');
      await rete.click({ button: 'right' });

      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await expect(menu.getByText('Undo')).toBeVisible();
      await expect(menu.getByText('Redo')).toBeVisible();
      await expect(menu.getByText('Create Node')).toBeVisible();
    });

    test('does not show Copy, Paste or Delete on empty canvas', async ({ page }) => {
      const rete = page.locator('#rete');
      await rete.click({ button: 'right' });

      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await expect(menu.getByText('Copy')).not.toBeVisible();
      await expect(menu.getByText('Paste')).not.toBeVisible();
      await expect(menu.getByText('Delete')).not.toBeVisible();
    });

    test('closes context menu on Escape', async ({ page }) => {
      const rete = page.locator('#rete');
      await rete.click({ button: 'right' });

      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await page.keyboard.press('Escape');
      await expect(menu).not.toBeVisible({ timeout: 3000 });
    });

    test('closes context menu on left-click outside', async ({ page }) => {
      const rete = page.locator('#rete');
      await rete.click({ button: 'right' });

      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await page.locator('header').click();
      await expect(menu).not.toBeVisible({ timeout: 3000 });
    });

    test('Create Node option triggers create node modal', async ({ page }) => {
      const rete = page.locator('#rete');
      await rete.click({ button: 'right' });

      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await menu.getByText('Create Node').click();
      await expect(menu).not.toBeVisible({ timeout: 3000 });
    });

    test('second right-click replaces the context menu', async ({ page }) => {
      const rete = page.locator('#rete');

      await rete.click({ button: 'right', position: { x: 50, y: 50 } });
      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await rete.click({ button: 'right', position: { x: 300, y: 300 }, force: true });
      await expect(menu).toHaveCount(1);
      await expect(menu).toBeVisible();
    });

    test('shows Copy and Delete when a node is selected', async ({ page }) => {
      await addNodeViaContextMenu(page, 'Logger');

      const node = page.locator('custom-node').first();
      await expect(node).toBeVisible({ timeout: 5000 });
      await node.click();

      const rete = page.locator('#rete');
      await rete.click({ button: 'right', force: true });
      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await expect(menu.getByText('Copy')).toBeVisible();
      await expect(menu.getByText('Delete')).toBeVisible();
    });

    test('copy and paste duplicates a node', async ({ page }) => {
      await addNodeViaContextMenu(page, 'Logger');

      const node = page.locator('custom-node').first();
      await expect(node).toBeVisible({ timeout: 5000 });
      await node.click();

      const rete = page.locator('#rete');
      await rete.click({ button: 'right', force: true });
      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });
      await menu.getByText('Copy').click();

      await rete.click({ button: 'right', position: { x: 200, y: 200 }, force: true });
      await expect(menu).toBeVisible({ timeout: 3000 });
      await expect(menu.getByText('Paste')).toBeVisible();
      await menu.getByText('Paste').click();

      await expect(page.locator('custom-node')).toHaveCount(2, { timeout: 5000 });
    });

    test('copy with Ctrl+C and paste with Ctrl+V', async ({ page }) => {
      await addNodeViaContextMenu(page, 'Logger');

      const node = page.locator('custom-node').first();
      await expect(node).toBeVisible({ timeout: 5000 });
      await node.click();

      await page.keyboard.press('Control+c');
      await page.keyboard.press('Control+v');

      await expect(page.locator('custom-node')).toHaveCount(2, { timeout: 5000 });
    });

    test('Paste is not shown when nothing has been copied', async ({ page }) => {
      await addNodeViaContextMenu(page, 'Logger');

      const rete = page.locator('#rete');
      await rete.click({ button: 'right', force: true });
      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });

      await expect(menu.getByText('Paste')).not.toBeVisible();
    });

    test('Delete removes selected node via context menu', async ({ page }) => {
      await addNodeViaContextMenu(page, 'Logger');

      const node = page.locator('custom-node').first();
      await expect(node).toBeVisible({ timeout: 5000 });
      await node.click();

      const rete = page.locator('#rete');
      await rete.click({ button: 'right', force: true });
      const menu = page.locator('.fixed.z-\\[200\\]');
      await expect(menu).toBeVisible({ timeout: 3000 });
      await menu.getByText('Delete').click();

      await expect(page.locator('custom-node')).toHaveCount(0, { timeout: 5000 });
    });
  });
});

async function addNodeViaContextMenu(page, nodeName) {
  const rete = page.locator('#rete');
  await rete.click({ button: 'right' });

  const menu = page.locator('.fixed.z-\\[200\\]');
  await expect(menu).toBeVisible({ timeout: 3000 });
  await menu.getByText('Create Node').click();

  const modal = page.locator('[phx-click=close_create_node_modal]').first();
  await expect(modal).toBeVisible({ timeout: 5000 });

  await page.locator(`[phx-click=create_node_from_modal][phx-value-name="${nodeName}"]`).click();
  await page.waitForTimeout(1000);
}
