import { test, expect } from '@playwright/test';

test.describe('Language Toggle', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Desktop에서만 실행 (언어 토글 버튼은 헤더에 있음)
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
  });

  test('영어 페이지에서 KO 버튼 클릭 시 한국어로 전환', async ({ page }) => {
    await page.goto('/generate/v7');

    // HTML lang 속성 확인
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');

    // KO 버튼 클릭 (aria-label로 정확히 선택)
    const koBtn = page.getByRole('button', { name: '한국어로 전환' });
    await expect(koBtn).toBeVisible();
    await koBtn.click();

    // URL이 /ko/generate/v7로 변경되었는지 확인
    await expect(page).toHaveURL('/ko/generate/v7/');

    // HTML lang 속성이 ko로 변경되었는지 확인
    const htmlLangAfter = await page.getAttribute('html', 'lang');
    expect(htmlLangAfter).toBe('ko');

    // 이제 EN 버튼이 보여야 함
    const enBtn = page.getByRole('button', { name: 'Switch to English' });
    await expect(enBtn).toBeVisible();
  });

  test('한국어 페이지에서 EN 버튼 클릭 시 영어로 전환', async ({ page }) => {
    await page.goto('/ko/validate');

    // HTML lang 속성 확인
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('ko');

    // EN 버튼 클릭 (aria-label로 정확히 선택)
    const enBtn = page.getByRole('button', { name: 'Switch to English' });
    await expect(enBtn).toBeVisible();
    await enBtn.click();

    // URL이 /validate로 변경되었는지 확인
    await expect(page).toHaveURL('/validate/');

    // HTML lang 속성이 en으로 변경되었는지 확인
    const htmlLangAfter = await page.getAttribute('html', 'lang');
    expect(htmlLangAfter).toBe('en');

    // 이제 KO 버튼이 보여야 함
    const koBtn = page.getByRole('button', { name: '한국어로 전환' });
    await expect(koBtn).toBeVisible();
  });

  test('언어 전환 시 현재 경로 유지 - parse 페이지', async ({ page }) => {
    await page.goto('/parse');

    // KO 버튼 클릭
    await page.getByRole('button', { name: '한국어로 전환' }).click();
    await page.waitForURL('/ko/parse/');
    await expect(page).toHaveURL('/ko/parse/');

    // EN 버튼 클릭하여 다시 돌아가기
    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.waitForURL('/parse/');
    await expect(page).toHaveURL('/parse/');
  });

  test('언어 전환 시 현재 경로 유지 - v4 페이지', async ({ page }) => {
    await page.goto('/generate/v4');

    await page.getByRole('button', { name: '한국어로 전환' }).click();
    await page.waitForURL('/ko/generate/v4/');
    await expect(page).toHaveURL('/ko/generate/v4/');

    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.waitForURL('/generate/v4/');
    await expect(page).toHaveURL('/generate/v4/');
  });

  test('언어 전환 시 현재 경로 유지 - v1 페이지', async ({ page }) => {
    await page.goto('/generate/v1');

    await page.getByRole('button', { name: '한국어로 전환' }).click();
    await page.waitForURL('/ko/generate/v1/');
    await expect(page).toHaveURL('/ko/generate/v1/');

    await page.getByRole('button', { name: 'Switch to English' }).click();
    await page.waitForURL('/generate/v1/');
    await expect(page).toHaveURL('/generate/v1/');
  });

  test('언어 토글 버튼 aria-label 확인', async ({ page }) => {
    await page.goto('/generate/v7');

    // 영어 페이지의 KO 버튼 aria-label
    const koBtn = page.getByRole('button', { name: '한국어로 전환' });
    const koAriaLabel = await koBtn.getAttribute('aria-label');
    expect(koAriaLabel).toBe('한국어로 전환');

    // 한국어로 전환
    await koBtn.click();
    await expect(page).toHaveURL('/ko/generate/v7/');

    // 한국어 페이지의 EN 버튼 aria-label
    const enBtn = page.getByRole('button', { name: 'Switch to English' });
    const enAriaLabel = await enBtn.getAttribute('aria-label');
    expect(enAriaLabel).toBe('Switch to English');
  });

  test('브라우저 뒤로가기/앞으로가기 시 언어 컨텍스트 유지', async ({ page }) => {
    await page.goto('/generate/v7');

    // 한국어로 전환
    await page.getByRole('button', { name: '한국어로 전환' }).click();
    await expect(page).toHaveURL('/ko/generate/v7/');

    // 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL('/generate/v7/');
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');

    // 앞으로가기
    await page.goForward();
    await expect(page).toHaveURL('/ko/generate/v7/');
    const htmlLangKo = await page.getAttribute('html', 'lang');
    expect(htmlLangKo).toBe('ko');
  });

  test('한국어 루트(/) 리다이렉트 확인', async ({ page }) => {
    await page.goto('/ko');

    // /ko/generate/v7로 리다이렉트되어야 함
    await expect(page).toHaveURL('/ko/generate/v7/');

    // HTML lang이 ko여야 함
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('ko');
  });

  test('영어 루트(/) 리다이렉트 확인', async ({ page }) => {
    await page.goto('/');

    // /generate/v7로 리다이렉트되어야 함
    await expect(page).toHaveURL('/generate/v7/');

    // HTML lang이 en이어야 함
    const htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('en');
  });

  test('새로고침 후 언어 유지', async ({ page }) => {
    await page.goto('/ko/validate');

    // HTML lang 확인
    let htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('ko');

    // 새로고침
    await page.reload();

    // 여전히 한국어여야 함
    await expect(page).toHaveURL('/ko/validate/');
    htmlLang = await page.getAttribute('html', 'lang');
    expect(htmlLang).toBe('ko');
  });
});
