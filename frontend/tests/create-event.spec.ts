import { test, expect } from '@playwright/test';

test('User should be able to login with correct credentials', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  const emailInput = await page.locator('input#E-mail-text-input');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEnabled();
  await page.fill('input#E-mail-text-input', 'testuser@gmail.com');

  const passwordInput = await page.locator('input#Password-text-input');
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toBeEnabled();
  await page.fill('input#Password-text-input', 'TestPassword123.');

  const loginButton = await page.locator('button#Login-button');
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();

  const loginRequestPromise = page.waitForResponse(req => req.url().includes('/authorization/Auth/Login'));
  await loginButton.click();
  const loginRequest = await loginRequestPromise;
  expect(loginRequest.status()).toBe(200);
});

test('User should not be able to login with wrong password', async ({ page }) => {
  await page.goto('http://localhost:4200/login');

  const emailInput = await page.locator('input#E-mail-text-input');
  await expect(emailInput).toBeVisible();
  await expect(emailInput).toBeEnabled();
  await page.fill('input#E-mail-text-input', 'wrong@email.com');

  const passwordInput = await page.locator('input#Password-text-input');
  await expect(passwordInput).toBeVisible();
  await expect(passwordInput).toBeEnabled();
  await page.fill('input#Password-text-input', 'WrongPassword123.');

  const loginButton = await page.locator('button#Login-button');
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();

  const loginRequestPromise = page.waitForResponse(req => req.url().includes('/authorization/Auth/Login'));
  await loginButton.click();
  const loginRequest = await loginRequestPromise;
  expect(loginRequest.status()).toBe(200);
});
