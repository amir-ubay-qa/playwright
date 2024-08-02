import { test, expect } from "@playwright/test";
import { LoginPage } from "../component/login-page-pom";
import { InventoryPage } from "../component/inventory-page-pom";
import { CheckoutPage } from "../component/checkout-page-pom";
require("dotenv").config();

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  const inventoryPage = new InventoryPage(page);
  await loginPage.goto();
  await loginPage.login("standard_user", "secret_sauce");
  await inventoryPage.addToCart("Sauce Labs Backpack");
  await inventoryPage.clickCart();
});

test("Verify checkout page can be accessed", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.goto();
  await expect(page).toHaveURL(`${process.env.PLAYWRIGHT_BASE_URL}/cart.html`);
});

test("Verify item is added to cart", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await expect(checkoutPage.checkoutItems).toContainText("Sauce Labs Backpack");
});

test("Verify item in cart can be removed", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.removeItem("Sauce Labs Backpack");
  await expect(checkoutPage.checkoutItems).toHaveCount(0);
});

test("Verify checkout can be completed", async ({ page }) => {
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.checkout();
  await checkoutPage.enterInfo("John", "Doe", "12345");
  await checkoutPage.finish();
  await checkoutPage.verifyCheckoutCompleteMessage();
});
