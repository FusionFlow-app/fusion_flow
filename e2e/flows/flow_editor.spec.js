import { test, expect } from '@playwright/test';
import { waitForLiveView, clickAndWaitForNavigation } from '../helpers.js';

const GRID_SIZE = 24;

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

  test('snaps node to grid on drag end', async ({ page }) => {
    await addNodeViaContextMenu(page, 'Logger');

    const node = page.locator('custom-node').first();
    await expect(node).toBeVisible({ timeout: 5000 });

    const startPosition = await getNodeTranslate(node);
    const box = await node.boundingBox();
    expect(box).not.toBeNull();

    const startX = box.x + box.width / 2;
    const startY = box.y + box.height / 2;

    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 137, startY + 111);
    await page.mouse.up();

    await waitForNodeSnap(page, node, GRID_SIZE);

    const endPosition = await getNodeTranslate(node);
    expect(isSnapped(endPosition.x, GRID_SIZE)).toBeTruthy();
    expect(isSnapped(endPosition.y, GRID_SIZE)).toBeTruthy();
    expect(Math.abs(endPosition.x - startPosition.x) + Math.abs(endPosition.y - startPosition.y)).toBeGreaterThan(0.5);
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

async function getNodeTranslate(locator) {
  return await locator.evaluate((el) => {
    const parseTransform = (transform) => {
      if (!transform || transform === 'none') return null;
      const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
      if (translateMatch) {
        return { x: parseFloat(translateMatch[1]), y: parseFloat(translateMatch[2]) };
      }
      const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
      if (matrixMatch) {
        const values = matrixMatch[1].split(',').map(value => parseFloat(value.trim()));
        if (values.length >= 6) {
          return { x: values[4], y: values[5] };
        }
      }
      const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);
      if (matrix3dMatch) {
        const values = matrix3dMatch[1].split(',').map(value => parseFloat(value.trim()));
        if (values.length >= 16) {
          return { x: values[12], y: values[13] };
        }
      }
      return null;
    };

    let current = el;
    while (current && current !== document.body) {
      const transform = current.style.transform || window.getComputedStyle(current).transform;
      const parsed = parseTransform(transform);
      if (parsed) return parsed;
      current = current.parentElement;
    }

    const rect = el.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  });
}

async function waitForNodeSnap(page, locator, gridSize) {
  const handle = await locator.elementHandle();
  if (!handle) throw new Error('Node element handle not found.');

  await page.waitForFunction(
    ([el, grid]) => {
      const parseTransform = (transform) => {
        if (!transform || transform === 'none') return null;
        const translateMatch = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (translateMatch) {
          return { x: parseFloat(translateMatch[1]), y: parseFloat(translateMatch[2]) };
        }
        const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
        if (matrixMatch) {
          const values = matrixMatch[1].split(',').map(value => parseFloat(value.trim()));
          if (values.length >= 6) {
            return { x: values[4], y: values[5] };
          }
        }
        const matrix3dMatch = transform.match(/matrix3d\(([^)]+)\)/);
        if (matrix3dMatch) {
          const values = matrix3dMatch[1].split(',').map(value => parseFloat(value.trim()));
          if (values.length >= 16) {
            return { x: values[12], y: values[13] };
          }
        }
        return null;
      };

      const isSnapped = (value) => {
        const rounded = Math.round(value * 100) / 100;
        const remainder = ((rounded % grid) + grid) % grid;
        return remainder < 0.5 || Math.abs(remainder - grid) < 0.5;
      };

      let current = el;
      let position = null;
      while (current && current !== document.body) {
        const transform = current.style.transform || window.getComputedStyle(current).transform;
        position = parseTransform(transform);
        if (position) break;
        current = current.parentElement;
      }

      if (!position) return false;
      return isSnapped(position.x) && isSnapped(position.y);
    },
    [handle, gridSize],
    { timeout: 5000 }
  );
}

function isSnapped(value, gridSize) {
  const rounded = Math.round(value * 100) / 100;
  const remainder = ((rounded % gridSize) + gridSize) % gridSize;
  return remainder < 0.5 || Math.abs(remainder - gridSize) < 0.5;
}
