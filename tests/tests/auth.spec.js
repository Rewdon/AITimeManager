import { test, expect } from '@playwright/test';

async function verifyToast(page, type, expectedText = null, timeout = 15000) {
  const toast = page.locator(`[data-testid="toast"][data-type="${type}"]`).first();
  await expect(toast).toBeVisible({ timeout });
  
  if (expectedText) {
    await expect(toast.locator('p')).toContainText(expectedText, { timeout });
  }

  try {
    await toast.locator('[data-testid="toast-close-btn"]').click({ timeout: 1000 });
  } catch (e) {
  }
  await expect(toast).not.toBeVisible();
}

test.describe('Pełny test autoryzacji użytkownika - rejestracja + logowanie + błędne logowanie', () => {

  test('Rejestracja użytkownika, i weryfikacja wejścia na dashboard', async ({ page, request }) => {
    const uniqueEmail = `testowy.${Date.now()}@mail.com`;

    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Wypróbuj za darmo' }).click();
    await page.getByRole('textbox', { name: 'Jan Kowalski' }).fill('Testowy User');
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill(uniqueEmail);
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.getByRole('button', { name: 'Utwórz konto' }).click();

    await verifyToast(page, 'success', 'Konto zostało pomyślnie utworzone!');
    await expect(page).toHaveURL(/.*\/dashboard/);

    const heading = page.getByRole('heading', { name: 'Dzień dobry! 👋' });
    await expect(heading).toBeVisible();
  
    const response = await request.delete('http://localhost:5000/api/auth/test-cleanup', {
      data: { email: uniqueEmail }
    });

    if (response.ok()) {
      console.log(`Usunięto użytkownika ${uniqueEmail} przez API.`);
    } else {
      console.log(`Nie udało się usunąć użytkownika ${uniqueEmail}.`);
    }
  });


  test('Logowanie użytkownika, i weryfikacja wejścia na dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();

    await verifyToast(page, 'success', 'Zalogowano pomyślnie!');
    await expect(page).toHaveURL(/.*\/dashboard/);

    const heading = page.getByRole('heading', { name: 'Dzień dobry! 👋' });
    await expect(heading).toBeVisible();
  });

  test('Błędne logowanie użytkownika, i weryfikacja komunikatu o błędzie', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('zlehaslo');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();

    await verifyToast(page, 'error', 'Nieprawidłowy adres email lub hasło');
  });
});