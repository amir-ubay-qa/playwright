import { test, expect } from "@playwright/test";
import { LoginPage } from "../component/login-page-pom";
import { InventoryPage } from "../component/inventory-page-pom";
require("dotenv").config();

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
});

test("Verify inventory page can be accessed", async ({ page }) => {
  const inventoryPage = new InventoryPage(page);
  await inventoryPage.goto();
  await expect(page).toHaveURL(
    `${process.env.PLAYWRIGHT_BASE_URL}/inventory.html`
  );
});

test("Verify inventory page contains all items", async ({ page }) => {
  const inventoryItems = page.locator('[data-test="inventory-item-name"]');
  await expect(inventoryItems).toHaveCount(6);
});

test("Verify user can add item to cart", async ({ page }) => {
  const inventory = [
    "Sauce Labs Backpack",
    "Sauce Labs Bike Light",
    "Sauce Labs Bolt T-shirt",
    "Sauce Labs Fleece Jacket",
    "Sauce Labs Onesie",
    "Test.allTheThings() T-Shirt (red)",
  ];

  const inventoryPage = new InventoryPage(page);

  for (const item of inventory) {
    await inventoryPage.addToCart(item);
  }

  await inventoryPage.verifyCartBadgeCount(inventory.length);
});

test("Verify shopping cart can be accessed", async ({ page }) => {
  const shoppingCartLink = await page.locator(
    '[data-test="shopping-cart-link"]'
  );
  await shoppingCartLink.click();
  await expect(page).toHaveURL("https://www.saucedemo.com/cart.html");
});

test("Verify back to inventory from checkout page", async ({ page }) => {
  const shoppingCartLink = await page.locator(
    '[data-test="shopping-cart-link"]'
  );
  await shoppingCartLink.click();
  const backToInventoryLink = await page.locator(
    '[data-test="continue-shopping"]'
  );
  await backToInventoryLink.click();
  await expect(page).toHaveURL("https://www.saucedemo.com/inventory.html");
});
