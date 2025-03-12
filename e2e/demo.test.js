import { expect, test } from '@playwright/test';

test('home page has expected h1', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1')).toBeVisible();
});



import { authenticateUser } from './setup';

test('Login with magic link', async ({ page }) => {
  await authenticateUser("test@example.com");

  await page.goto('/dashboard');
  await expect(page.getByText("Welcome, Test User")).toBeVisible();
});