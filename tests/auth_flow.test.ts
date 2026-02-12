import { test, expect } from '@playwright/test';

test.describe('Warlord Signup Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5000/auth/signup/TEST.html');
  });

  test('branding is correct', async ({ page }) => {
    await expect(page).toHaveTitle(/Sign Up - Warlord/);
    await expect(page.locator('.brand-word')).toHaveText('Warlord');
    await expect(page.locator('#main-heading')).toContainText('Get started');
  });

  test('blocks personal emails', async ({ page }) => {
    await page.fill('#email-input', 'test@gmail.com');
    const nextBtn = page.locator('#email-next-btn');
    // Wait for the button to be visible/enabled
    await page.waitForTimeout(500);
    await nextBtn.click();

    const error = page.locator('#email-error');
    await expect(error).toBeVisible();
    await expect(error).toContainText('Please use your business email');
  });

  test('next button appears for business email', async ({ page }) => {
    await page.fill('#email-input', 'admin@warlord.com');
    const nextBtnContainer = page.locator('#email-next-btn-container');
    await expect(nextBtnContainer).toHaveClass(/show/);
  });

  test('shows login link when domain is registered', async ({ page }) => {
    await page.evaluate(() => {
      // @ts-ignore
      const db = firebase.firestore();
      // Mock the get method for domainClaims
      const originalCollection = db.collection.bind(db);
      // @ts-ignore
      db.collection = (name) => {
        if (name === 'domainClaims') {
          return {
            doc: (id) => ({
              get: async () => ({
                exists: id === 'alreadyregistered.com',
                data: () => ({ status: 'verified' })
              })
            })
          };
        }
        return originalCollection(name);
      };
    });

    await page.fill('#email-input', 'admin@alreadyregistered.com');
    await page.click('#email-next-btn');

    const inlineError = page.locator('#inline-error');
    await expect(inlineError).toBeVisible();
    await expect(inlineError).toContainText('This domain is already registered, Login?');
  });
});
