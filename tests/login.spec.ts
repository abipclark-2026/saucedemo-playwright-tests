import { test, expect } from '@playwright/test';

// saucedemo's public demo accounts, listed on its login page.
const PASSWORD = 'secret_sauce';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('standard user can log in and see the products page', async ({ page }) => {
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByTestId('title')).toHaveText('Products');
    await expect(page.getByTestId('inventory-item')).toHaveCount(6);
  });

  test('locked out user sees an error message', async ({ page }) => {
    await page.getByTestId('username').fill('locked_out_user');
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();

    await expect(page.getByTestId('error')).toContainText('this user has been locked out');
    await expect(page).not.toHaveURL(/inventory\.html/);
  });
});
