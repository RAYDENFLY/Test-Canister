import { test, expect } from '@playwright/test';

// Test skeleton for Create Account flow.
// Selectors match data-testid attributes in TopNavigation.tsx.

test.describe('Create Account modal', () => {
  test.beforeEach(async ({ page }) => {
    // adjust URL to your dev server if different
    await page.goto('http://localhost:5000');
  });

  test('opens modal and validates fields live', async ({ page }) => {
    // open login dropdown
    await page.getByTestId('button-login').click();
    await expect(page.getByTestId('login-dropdown')).toBeVisible();

    // open create modal
    await page.getByTestId('button-signup').click();
    const modal = page.getByTestId('create-account-modal');
    await expect(modal).toBeVisible();

    const name = modal.getByTestId('create-name');
    const email = modal.getByTestId('create-email');
    const submit = modal.getByTestId('create-submit');

    // type short name -> expect validation
    await name.fill('A');
    // blurred to trigger touched state
    await name.blur();
    await expect(modal.getByText(/min 2 chars/i)).toBeVisible();

    // fix name
    await name.fill('Alice Example');
    await expect(modal.getByText(/min 2 chars/i)).not.toBeVisible();

    // invalid email
    await email.fill('bad-email');
    await email.blur();
    await expect(modal.getByText(/valid email/i)).toBeVisible();

    // normalized valid email
    await email.fill('User+tag@Example.COM');
    await email.blur();
    await expect(modal.getByText(/valid email/i)).not.toBeVisible();

    // submit should be enabled
    await expect(submit).toBeEnabled();

    // click submit — in test mode the handler is simulated
    await submit.click();

    // success message should appear
    await expect(modal.getByText(/Account created \(test mode\)/i)).toBeVisible();
  });
});
