import { test, expect } from '@playwright/test';

test.describe('UUID Parser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Parser 탭으로 이동
    await page.click('[data-testid="tab-parser"]');
  });

  test('입력 필드가 표시되어야 함', async ({ page }) => {
    await expect(
      page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]')
    ).toBeVisible();
  });

  test('v4 UUID 파싱 시 SUCCESS 표시', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    await input.fill('550e8400-e29b-41d4-a716-446655440000');

    await page.click('button:has-text("[ PARSE ]")');

    await expect(page.locator('text=SUCCESS')).toBeVisible();
  });

  test('v7 UUID 파싱 시 타임스탬프 추출', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    // v7 UUID
    await input.fill('01936b2a-8e5f-7c5e-8b5d-123456789abc');

    await page.click('button:has-text("[ PARSE ]")');

    await expect(page.locator('text=SUCCESS')).toBeVisible();
    await expect(page.locator('text=TIMESTAMP')).toBeVisible();
  });

  test('유효하지 않은 UUID 입력 시 에러 표시', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    await input.fill('invalid-uuid');

    await page.click('button:has-text("[ PARSE ]")');

    await expect(page.locator('text=[ERROR]')).toBeVisible();
  });

  test('지원하지 않는 버전 입력 시 에러 표시', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    // v5 UUID
    await input.fill('550e8400-e29b-51d4-a716-446655440000');

    await page.click('button:has-text("[ PARSE ]")');

    await expect(page.locator('text=[ERROR]')).toBeVisible();
  });

  test('Enter 키로 파싱 실행', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');

    await expect(page.locator('text=SUCCESS')).toBeVisible();
  });
});
