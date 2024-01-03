import { test, expect } from '@playwright/test';

test('Danylo test', async ({ page }) => {
  await page.goto('http://localhost:4200/');

  // Locate the button with id "loginButton" and click it
  const loginButton = await page.locator('#loginButton');
  await expect(loginButton).toBeVisible();
  await loginButton.click();

  const element = await page.locator('#haveAccText');

  // Check if the element has the expected text
  await expect(element).toHaveText('Dont have an account yet?');
});
