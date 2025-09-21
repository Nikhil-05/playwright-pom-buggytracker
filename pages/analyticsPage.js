// analyticsPage.js
export class AnalyticsPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.viewFullAnalyticsLink = page.getByRole('link', { name: 'View Full Analytics' });
  }

  async getFullAnalyticsLink() {
    return await this.viewFullAnalyticsLink.getAttribute('href');
  }
}
