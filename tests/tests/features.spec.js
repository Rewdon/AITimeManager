import { test, expect } from '@playwright/test';

async function verifyToast(page, type, expectedText = null, timeout = 15000) {
  const toast = page.locator(`[data-testid="toast"][data-type="${type}"]`).first();
  await expect(toast).toBeVisible({ timeout });
  
  if (expectedText) {
    await expect(toast.locator('p')).toContainText(expectedText, { timeout });
  }
  
  try {
    await toast.locator('[data-testid="toast-close-btn"]').click({ timeout: 1000 });
  } catch (e) {}
  await expect(toast).not.toBeVisible();
}

test.describe('Testy dodatkowych funkcji - AI, Notatki, Kalendarz', () => {

  test('Generowanie Strategii Dnia przez AI', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    const taskName = `Zadanie dla AI ${Date.now()}`;

    const taskInput = page.getByRole('textbox', { name: 'Co masz do zrobienia? (np.' });
    await expect(taskInput).toBeVisible();
    await taskInput.fill(taskName);
    await taskInput.press('Enter');

    await verifyToast(page, 'success');

    await page.getByRole('button', { name: 'Generuj Plan Dnia' }).click();

    const loadingText = page.getByText('Analizuję Twój kalendarz i zadania...');
    await expect(loadingText).toBeVisible({ timeout: 60000 });
    await expect(loadingText).not.toBeVisible({ timeout: 60000 });
    
    await verifyToast(page, 'success', 'Strategia AI została wygenerowana!', 15000);

    const taskCard = page.locator('div.group').filter({ hasText: taskName });
    await taskCard.hover();
    await taskCard.getByRole('button', { name: 'Usuń' }).click();
    
    await verifyToast(page, 'success');
  });


  test('Szybkie Notatki i ich usuwanie', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    const noteText = `Testowa notatka ${Date.now()}`;

    const noteInput = page.getByRole('textbox', { name: 'Wpisz i wciśnij Enter...' });
    await expect(noteInput).toBeVisible();
    await noteInput.fill(noteText);
    await noteInput.press('Enter');

    await verifyToast(page, 'success');
    await expect(page.getByText(noteText)).toBeVisible();

    const noteCard = page.locator('div.group').filter({ hasText: noteText });
    
    await noteCard.hover();
    
    await noteCard.locator('button.absolute').click();

    await verifyToast(page, 'success');
    await expect(page.getByText(noteText)).not.toBeVisible();
  });


  test('Dodawanie wydarzenia w Kalendarzu', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    await page.locator('a[href="/dashboard/calendar"]').first().click();
    await expect(page).toHaveURL(/.*\/dashboard\/calendar/);

    const eventName = `Wydarzenie testowe ${Date.now()}`;

    await page.locator('button.bg-primary').filter({ has: page.locator('.lucide-plus') }).first().click();

    const titleInput = page.getByRole('textbox').first();
    await expect(titleInput).toBeVisible(); 
    await titleInput.fill(eventName);
    
    await page.locator('input[type="time"]').fill('12:00');
    await page.getByRole('spinbutton').fill('45');

    await page.getByRole('button', { name: 'Dodaj' }).click();

    await verifyToast(page, 'success');
    await expect(page.getByText(eventName)).toBeVisible();

    const eventCard = page.locator('div.group').filter({ hasText: eventName });
    await eventCard.click();
    await eventCard.getByRole('button').click(); 
    
    await verifyToast(page, 'success');
    await expect(page.getByText(eventName)).not.toBeVisible();
  });
});