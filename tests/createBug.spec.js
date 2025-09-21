// createBug.spec.js
import { test } from '@playwright/test';
import { BugPage } from '../pages/bugPage';
import { AnalyticsPage } from '../pages/analyticsPage';
import { bugData } from '../data/bugData';

test('Create a Bug', async ({ page }) => {
  await page.goto('https://projects.hackerearth.com/p9/');

  const bugPage = new BugPage(page);
  await bugPage.initModalHandler();

  await bugPage.createBug(bugData);
  await bugPage.verifyTicket(bugData.title, bugData.description);

  await page.goto('https://projects.hackerearth.com/p9/analytics.html');
  const analyticsPage = new AnalyticsPage(page);
  const link = await analyticsPage.getFullAnalyticsLink();
  console.log(link);
});
