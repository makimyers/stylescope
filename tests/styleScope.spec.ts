import { test, expect } from '@playwright/test';

test('should render the app, change font size, and update color', async ({ page }) => {
  // Navigate to your app
  await page.goto('http://localhost:5173');

  // Click on the visibility toggle button
  await page.click('.toggle');
 
});