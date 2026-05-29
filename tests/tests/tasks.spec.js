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

test.describe('Testy zarządzania zadaniami - dodawanie, edycja, statusy i AI', () => {

  test('Dodawanie zadania z opcją AUTO (AI)', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    await page.getByRole('link', { name: 'Zadania' }).click();

    const uniqueTaskName = `Zadanie AI ${Date.now()}`;
    await page.getByPlaceholder('Co masz do zrobienia?').fill(uniqueTaskName);
    
    await page.getByRole('button', { name: 'Opcje zaawansowane' }).click();
    await page.getByRole('button', { name: 'Dodaj Zadanie' }).click();
    
    await verifyToast(page, 'success', null, 30000);
    
    const taskCard = page.getByText(uniqueTaskName);
    await expect(taskCard).toBeVisible();

    await page.getByRole('button', { name: 'Usuń' }).first().click();
    await verifyToast(page, 'success');
  });


  test('Ręczna edycja parametrów zadania', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    await page.getByRole('link', { name: 'Zadania' }).click();
    const taskToEdit = `Do edycji ${Date.now()}`;

    await page.getByPlaceholder('Co masz do zrobienia?').fill(taskToEdit);
    await page.getByPlaceholder('Co masz do zrobienia?').press('Enter');
    
    await verifyToast(page, 'success');

    await page.getByRole('button', { name: 'Edytuj' }).first().click();
    await page.locator('form').filter({ hasText: 'Tytuł TypACTIVEPASSIVE Czas (' }).locator('input[type="text"]').fill('Zaktualizowana nazwa zadania');
    await page.locator('textarea').fill('Testowy opis');
    await page.getByRole('combobox').nth(2).selectOption('high');
    await page.getByRole('spinbutton').fill('30');
    await page.getByRole('combobox').nth(1).selectOption('PASSIVE');
    await page.getByRole('button', { name: 'Zapisz zmiany' }).click();

    await verifyToast(page, 'success');

    const updatedTask = page.getByText('Zaktualizowana nazwa zadania');
    await expect(updatedTask).toBeVisible();

    await page.getByRole('button', { name: 'Usuń' }).first().click();
    await verifyToast(page, 'success');
  });


  test('Cykl życia zadania (To Do -> In Progress -> Done)', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    await page.getByRole('link', { name: 'Zadania' }).click();

    const taskName = `Test cyklu ${Date.now()}`;
    
    await page.getByPlaceholder('Co masz do zrobienia?').fill(taskName);
    await page.getByPlaceholder('Co masz do zrobienia?').press('Enter');
    await verifyToast(page, 'success');
    
    const taskContainer = page.locator('div').filter({ hasText: taskName }).first();

    await taskContainer.getByRole('button', { name: 'Rozpocznij' }).first().click();
    await verifyToast(page, 'success');
    await expect(taskContainer.getByText('W trakcie')).toBeVisible();

    await taskContainer.getByRole('button', { name: 'Oznacz jako zrobione' }).first().click();
    await verifyToast(page, 'success');
    
    await expect(page.getByText(taskName)).not.toBeVisible();
  });

  test('Inteligentne sortowanie (Smart Sort)', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.getByRole('button', { name: 'Zaloguj się' }).click();
    await page.getByRole('textbox', { name: 'twoj@email.com' }).fill('test@test.pl');
    await page.getByRole('textbox', { name: '••••••••' }).fill('test1234');
    await page.locator('form').getByRole('button', { name: 'Zaloguj się' }).click();
    
    await expect(page).toHaveURL(/.*\/dashboard/);

    await page.getByRole('link', { name: 'Zadania' }).click();

    const task1 = `Niski priorytet ${Date.now()}`;
    const task2 = `Wysoki priorytet ${Date.now()}`;
    
    const taskInput = page.getByRole('textbox', { name: 'Co masz do zrobienia? (np.' });
    await expect(taskInput).toBeVisible();

    await taskInput.fill(task1);
    await taskInput.press('Enter');
    await verifyToast(page, 'success');

    await taskInput.fill(task2);
    await taskInput.press('Enter');
    await verifyToast(page, 'success');

    await page.getByRole('button', { name: 'Optymalizuj AI' }).click();

    const card1 = page.locator('div.group').filter({ hasText: task1 });
    await card1.hover();
    await card1.locator('.hover\\:bg-danger-background').click();
    await verifyToast(page, 'success');

    const card2 = page.locator('div.group').filter({ hasText: task2 });
    await card2.hover();
    await card2.locator('.hover\\:bg-danger-background').click();
    await verifyToast(page, 'success');
  });
});