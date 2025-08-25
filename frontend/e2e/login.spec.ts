import { testWithII } from '@dfinity/internet-identity-playwright';

testWithII('should sign in with a new user', async ({ page, iiPage }) => {
  await page.goto('http://127.0.0.1:5000/');
  // open the modal using the top-level login button, then click the II button inside the modal
  await page.click('[data-tid=login-button]');
  await iiPage.signInWithNewIdentity({ selector: '[data-testid=button-ii-login]' });
  await page.waitForURL('**/dashboard', { timeout: 20000 });
});
