import { test, expect } from '@playwright/test';

test.describe('UUID Validator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Validator 탭으로 이동
    await page.click('[data-testid="tab-validator"]');
  });

  test('입력 필드가 표시되어야 함', async ({ page }) => {
    const input = page.locator('[data-testid="uuid-input"]');
    await expect(input).toBeVisible();
  });

  test('유효한 UUID 입력 시 VALID 표시', async ({ page }) => {
    const input = page.locator('[data-testid="uuid-input"]');
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');

    // 결과 영역의 [VALID] 확인 (data-testid 사용)
    await expect(page.getByTestId('validation-result').getByText('[VALID]')).toBeVisible();
  });

  test('유효하지 않은 UUID 입력 시 INVALID 표시', async ({ page }) => {
    const input = page.locator('[data-testid="uuid-input"]');
    await input.fill('invalid-uuid');
    await input.press('Enter');

    // 결과 영역의 [INVALID] 확인
    await expect(page.getByTestId('validation-result').getByText('[INVALID]')).toBeVisible();
  });

  test('다양한 형식의 UUID 검증', async ({ page }) => {
    const input = page.locator('[data-testid="uuid-input"]');
    const resultArea = page.getByTestId('validation-result');

    // 하이픈 없는 형식
    await input.fill('550e8400e29b41d4a716446655440000');
    await input.press('Enter');
    await expect(resultArea.getByText('[VALID]')).toBeVisible();

    // 중괄호 형식
    await input.clear();
    await input.fill('{550e8400-e29b-41d4-a716-446655440000}');
    await input.press('Enter');
    await expect(resultArea.getByText('[VALID]')).toBeVisible();

    // URN 형식
    await input.clear();
    await input.fill('urn:uuid:550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');
    await expect(resultArea.getByText('[VALID]')).toBeVisible();
  });

  test('버전 정보가 올바르게 표시되어야 함', async ({ page }) => {
    const input = page.locator('[data-testid="uuid-input"]');

    // v4 UUID - exact match로 검색
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await expect(page.getByText('v4', { exact: true })).toBeVisible();

    // v1 UUID - exact match로 검색
    await input.clear();
    await input.fill('550e8400-e29b-11d4-a716-446655440000');
    await expect(page.getByText('v1', { exact: true })).toBeVisible();
  });
});
