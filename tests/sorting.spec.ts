import { test, expect, Page } from '@playwright/test';

const PASSWORD = 'secret_sauce';

// Read the product names, in the order they appear on the page
async function getNames(page: Page): Promise<string[]> {
  return page.getByTestId('inventory-item-name').allTextContents();
}

// Read the product prices as numbers, e.g. "$29.99" -> 29.99
async function getPrices(page: Page): Promise<number[]> {
  const prices = await page.getByTestId('inventory-item-price').allTextContents();
  return prices.map((price) => Number(price.replace('$', '')));
}

test.describe('Product sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('username').fill('standard_user');
    await page.getByTestId('password').fill(PASSWORD);
    await page.getByTestId('login-button').click();
    await expect(page.getByTestId('title')).toHaveText('Products');
  });

  test('products are sorted A to Z by default', async ({ page }) => {
    const names = await getNames(page);
    expect(names).toEqual([...names].sort());
  });

  test('sort by name Z to A', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('za');

    const names = await getNames(page);
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by price low to high', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('lohi');

    const prices = await getPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async ({ page }) => {
    await page.getByTestId('product-sort-container').selectOption('hilo');

    const prices = await getPrices(page);
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
