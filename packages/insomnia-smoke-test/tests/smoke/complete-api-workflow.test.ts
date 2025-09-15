import { expect } from '@playwright/test';

import { loadFixture } from '../../playwright/paths';
import { test } from '../../playwright/test';

test.describe('Complete API Workflow', () => {
  test('End-to-end API development workflow', async ({ app, page }) => {
    test.slow(process.platform === 'darwin' || process.platform === 'win32', 'Slow app start on these platforms');
    const statusTag = page.locator('[data-testid="response-status-tag"]:visible');

    const text = await loadFixture('complete-api-workflow.yaml');
    await app.evaluate(async ({ clipboard }, text) => clipboard.writeText(text), text);

    await page.getByLabel('Import').click();
    await page.locator('[data-test-id="import-from-clipboard"]').click();
    await page.getByRole('button', { name: 'Scan' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Import' }).click();

    await page.getByLabel('Complete API Workflow Test').click();

    // Test GET request - use simpler selectors and wait for response
    await page.getByText('Get User').click();
    await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
    await expect.soft(statusTag).toBeVisible({ timeout: 10000 });
    await expect.soft(statusTag).toContainText('200 OK');

    // Test POST request
    await page.getByText('Create New User').click();
    await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
    await expect.soft(statusTag).toBeVisible({ timeout: 10000 });
    await expect.soft(statusTag).toContainText('201 Created');

    // Test PUT request
    await page.getByText('Update User').click();
    await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
    await expect.soft(statusTag).toBeVisible({ timeout: 10000 });
    await expect.soft(statusTag).toContainText('200 OK');

    // Test DELETE request
    await page.getByText('Delete User').click();
    await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
    await expect.soft(statusTag).toBeVisible({ timeout: 10000 });
    await expect.soft(statusTag).toContainText('200 OK');
  });

  test('Environment variable workflow with dynamic testing', async ({ app, page }) => {
    test.slow(process.platform === 'darwin' || process.platform === 'win32', 'Slow app start on these platforms');
    const statusTag = page.locator('[data-testid="response-status-tag"]:visible');

    const text = await loadFixture('complete-api-workflow.yaml');
    await app.evaluate(async ({ clipboard }, text) => clipboard.writeText(text), text);

    await page.getByLabel('Import').click();
    await page.locator('[data-test-id="import-from-clipboard"]').click();
    await page.getByRole('button', { name: 'Scan' }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Import' }).click();

    await page.getByLabel('Complete API Workflow Test').click();

    // Test GET request works with current variables
    await page.getByText('Get User').click();
    await page.getByTestId('request-pane').getByRole('button', { name: 'Send' }).click();
    await expect.soft(statusTag).toBeVisible({ timeout: 10000 });
    await expect.soft(statusTag).toHaveText('200 OK');
  });
});
