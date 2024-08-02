import { expect, type Locator, type Page } from "@playwright/test";
require("dotenv").config();

export class InventoryPage {
  readonly page: Page;
  readonly shoppingCartLink: Locator;
  readonly shoppingCartBadge: Locator;
  readonly itemImages: Locator;
  readonly itemNames: Locator;
  readonly itemDescriptions: Locator;
  readonly itemPrices: Locator;
  readonly itemAddToCartButtons: Locator;
  readonly item: Locator;

  constructor(page: Page) {
    this.page = page;
    this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
    this.shoppingCartBadge = page.locator('[data-test="shopping-cart-badge"]');
    this.itemImages = page.locator('[data-test="item_img"]');
    this.itemNames = page.locator('[data-test="item_name"]');
    this.itemDescriptions = page.locator('[data-test="item_description"]');
    this.itemPrices = page.locator('[data-test="item_price"]');
    this.itemAddToCartButtons = page.getByRole("button", {
      name: "Add to cart",
    });
    this.item = page.locator('[data-test="inventory-item"]');
  }

  async addToCart(item: string) {
    await this.item
      .filter({ hasText: item })
      .getByRole("button", { name: "Add to cart" })
      .first()
      .click();
  }

  async goto() {
    await this.page.goto(`${process.env.PLAYWRIGHT_BASE_URL}/inventory.html`);
  }

  async verifyCartBadgeCount(count: number) {
    await expect(this.shoppingCartBadge).toHaveText(count.toString());
  }

  async clickCart() {
    await this.shoppingCartLink.click();
  }
}
