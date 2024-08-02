import { expect, type Locator, type Page } from "@playwright/test";
require("dotenv").config();

export class CheckoutPage {
  readonly page: Page;
  readonly continueShoppingLink: Locator;
  readonly checkoutButton: Locator;
  readonly checkoutItems: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly summaryInfo: Locator;
  readonly checkoutCompleteMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.continueShoppingLink = page.locator('[data-test="continue-shopping"]');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.checkoutItems = page.locator('[data-test="inventory-item"]');
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.summaryInfo = page.locator('[data-test="summary_info"]');
    this.checkoutCompleteMessage = page.locator(
      '[data-test="checkout-complete-container"]'
    );
  }

  async goto() {
    await this.page.goto(`${process.env.PLAYWRIGHT_BASE_URL}/cart.html`);
  }

  async backToInventory() {
    await this.continueShoppingLink.click();
  }

  async removeItem(item: string) {
    await this.checkoutItems
      .filter({ hasText: item })
      .getByRole("button", { name: "Remove" })
      .first()
      .click();
  }

  async finish() {
    await this.finishButton.click();
  }

  async verifySummaryInfo(item: string) {
    await expect(this.summaryInfo).toHaveText(item);
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async enterInfo(firstName: string, lastName: string, zipCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zipCode);
    await this.continueButton.click();
  }

  async verifyCheckoutCompleteMessage() {
    await expect(this.checkoutCompleteMessage).toBeVisible();
  }
}
