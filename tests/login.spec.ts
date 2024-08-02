import { test, expect } from "@playwright/test";
import { LoginPage } from "../component/login-page-pom";
require("dotenv").config();

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});

test("Verify login page can be accessed", async ({ page }) => {
  await expect(page).toHaveTitle("Swag Labs");
});

test("Login with correct credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login("standard_user", "secret_sauce");
  await expect(page).toHaveURL(
    `${process.env.PLAYWRIGHT_BASE_URL}/inventory.html`
  );
});

test("Login with incorrect credentials", async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.login("standard_user", "incorrect_password");
  await loginPage.verifyLoginFailed();
});
