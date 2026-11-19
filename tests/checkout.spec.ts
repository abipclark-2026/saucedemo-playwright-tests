import { test, expect } from '@playwright/test';

const PASSWORD = 'secret_sauce';

test('standard user can buy a backpack end to end', async ({ page }) => {
  // Log in
  await page.goto('/');
  await page.getByTestId('username').fill('standard_user');
  await page.getByTestId('password').fill(PASSWORD);
  await page.getByTestId('login-button').click();

  // Add an item and check the cart count
  await page.getByTestId('add-to-cart-sauce-labs-backpack').click();
  await expect(page.getByTestId('shopping-cart-badge')).toHaveText('1');

  // Go to the cart and start checkout
  await page.getByTestId('shopping-cart-link').click();
  await page.getByTestId('checkout').click();

  // Enter shipping details
  await page.getByTestId('firstName').fill('Test');
  await page.getByTestId('lastName').fill('User');
  await page.getByTestId('postalCode').fill('92054');
  await page.getByTestId('continue').click();

  // Finish and confirm the order
  await page.getByTestId('finish').click();
  await expect(page.getByTestId('complete-header')).toHaveText('Thank you for your order!');
});