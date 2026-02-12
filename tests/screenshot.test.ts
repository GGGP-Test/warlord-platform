import { test, expect } from '@playwright/test';

test('capture signup page', async ({ page }) => {
  await page.goto('http://localhost:5000/auth/signup/TEST.html');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'signup.png' });

  await page.fill('#email-input', 'test@example.com');
  await page.click('#email-next-btn');
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'signup_password.png' });
});
