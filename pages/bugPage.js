// bugPage.js
import { expect } from '@playwright/test';

export class BugPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;

    // Locators
    this.createBugBtn = page.getByRole('button', { name: 'Create Bug' });
    this.titleInput = page.locator('#title');
    this.descriptionInput = page.locator('#description');
    this.priorityDropdown = page.locator('#priority');
    this.statusDropdown = page.locator('#status');
    this.assigneeDropdown = page.locator('#assignee');
    this.deadlinePicker = page.locator('#deadline');
    this.tagsDropdown = page.locator('#tags');
    this.createTicketBtn = page.locator('button.ant-btn-primary', { hasText: 'Create Ticket' });

    // Global modal locator
    this.annoyingModal = page.locator('div.ant-modal-title', { hasText: 'An annnoying Modal to hinder you' });
    this.annoyingModalClose = page.locator('button[aria-label="Close"]').nth(1);
  }

  async initModalHandler() {
    await this.page.addLocatorHandler(
      this.annoyingModal,
      async () => await this.annoyingModalClose.click()
    );
  }

  async safeAction(action) {
    try {
      await action();
    } catch (e) {
      await action(); // Retry once if modal interrupts
    }
  }

  async createBug({ title, description, priority, status, assignee, deadline, tags }) {
    await this.safeAction(() => this.createBugBtn.click());
    await this.safeAction(() => this.titleInput.fill(title));
    await this.safeAction(() => this.descriptionInput.fill(description));

    await this.safeAction(async () => {
        await this.priorityDropdown.click();
        await this.page.locator('.ant-select-item.ant-select-item-option', { hasText: priority }).click();
    });

    await this.safeAction(async () => {
        await this.statusDropdown.click();
        await this.page.locator('.ant-select-item-option-content', { hasText: status }).click();
    });

    await this.safeAction(async () => {
        await this.assigneeDropdown.click();
        await this.page.locator('.ant-select-item-option-content', { hasText: assignee }).click();
    });

    await this.safeAction(async () => {
        await this.deadlinePicker.click();
        await this.page.locator('.ant-picker-cell-inner', { hasText: deadline }).click();
    });

    await this.safeAction(async () => {
        await this.tagsDropdown.click();
        await this.page.locator('.ant-select-item-option-content', { hasText: tags }).click();
    });

    await this.safeAction(async () => {
        await this.createTicketBtn.click();
    });
}

  ticketLocatorByTitle(title) {
    return this.page.locator('.ant-typography', { hasText: title });
  }

  async verifyTicket(title, description) {
    const ticket = this.ticketLocatorByTitle(title);
    await expect(ticket).toBeVisible({ timeout: 15_000 });
    await ticket.hover();
    await this.page.locator('.anticon-edit').nth(0).click();

    await expect(this.titleInput).toHaveAttribute('value', title);
    await expect(this.descriptionInput).toHaveText(description);

    await this.page.locator('button span', { hasText: 'Cancel' }).nth(0).click();
  }
}
