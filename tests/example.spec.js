// const { test, expect } = require('@playwright/test');

// test('Проверка текстов интерфейса RSS', async ({ page }) => {
//   // Переходим на вашу веб-страницу
//   const localServerUrl = 'http://localhost:8080';

//   await page.goto(localServerUrl);

//   await page.waitForLoadState('domcontentloaded');
//   // Предположим, что у вас есть логика, которая загружает, проверяет и отображает тексты интерфейса.

//   // Проверка успешной загрузки RSS
//   await expect(page).toHaveText('.feedback', 'Тексты интерфейса: RSS успешно загружен');

//   // Проверка, что RSS уже существует
//   await expect(page).toHaveText('.feedback', 'Тексты интерфейса: RSS уже существует');

//   // Проверка, что текст не пустой
//   await expect(page).toHaveText('.feedback', 'Тексты интерфейса: Не должно быть пустым');

//   // Проверка, что ссылка является валидным URL
//   await expect(page).toHaveText('.feedback', 'Тексты интерфейса: Ссылка должна быть валидным URL');

//   // Проверка, что ресурс не содержит валидный RSS
//   await expect(page).toHaveText('.feedback', 'Тексты интерфейса: Ресурс не содержит валидный RSS');

//   // Проверка, что текст "Просмотр" отображается
//   await expect(page).toHaveText('.feedback', 'Просмотр');

//   // Проверка, что текст об ошибке сети отображается
//   await expect(page).toHaveText('.feedback', 'Ошибка сети');
// });
