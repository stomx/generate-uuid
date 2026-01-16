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
    // 타임스탬프 키 확인 (첫 번째 일치하는 요소)
    await expect(page.getByText('타임스탬프', { exact: true }).first()).toBeVisible();
  });

  test('유효하지 않은 UUID 입력 시 에러 표시', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    await input.fill('invalid-uuid');

    await page.click('button:has-text("[ PARSE ]")');

    // 결과 영역의 [ERROR] 확인 (히스토리에도 [ERROR]가 있을 수 있음)
    await expect(page.getByText('[ERROR]').first()).toBeVisible();
  });

  test('지원하지 않는 버전 입력 시 에러 표시', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    // v5 UUID
    await input.fill('550e8400-e29b-51d4-a716-446655440000');

    await page.click('button:has-text("[ PARSE ]")');

    // 결과 영역의 [ERROR] 확인
    await expect(page.getByText('[ERROR]').first()).toBeVisible();
  });

  test('Enter 키로 파싱 실행', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');

    await expect(page.locator('text=SUCCESS')).toBeVisible();
  });
});

test.describe('UUID Parser 히스토리', () => {
  test.beforeEach(async ({ page }) => {
    // localStorage 초기화
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.click('[data-testid="tab-parser"]');
  });

  test('파싱 후 히스토리에 추가되어야 함', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    const panel = page.locator('#panel-parser');

    // 초기 상태 - 빈 히스토리
    await expect(panel.getByText('[0]')).toBeVisible();

    // UUID 파싱
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');

    // 히스토리 카운트 증가
    await expect(panel.getByText('[1]')).toBeVisible();
  });

  test('히스토리 Clear All 버튼이 동작해야 함', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    const panel = page.locator('#panel-parser');

    // UUID 파싱하여 히스토리 추가
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');
    await expect(panel.getByText('[1]')).toBeVisible();

    // Clear All 클릭
    await panel.getByRole('button', { name: /clear/i }).click();

    // 히스토리 초기화됨
    await expect(panel.getByText('[0]')).toBeVisible();
    await expect(panel.getByText('No parse history yet')).toBeVisible();
  });

  test('히스토리 개별 삭제가 동작해야 함', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    const panel = page.locator('#panel-parser');

    // UUID 파싱
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');
    await expect(panel.getByText('[1]')).toBeVisible();

    // [RM] 버튼 클릭
    await panel.getByLabel('히스토리에서 삭제').click();

    // 히스토리 비워짐
    await expect(panel.getByText('[0]')).toBeVisible();
  });

  test('히스토리가 페이지 리로드 후에도 유지되어야 함', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    const panel = page.locator('#panel-parser');

    // UUID 파싱
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');
    await expect(panel.getByText('[1]')).toBeVisible();

    // 페이지 리로드
    await page.reload();
    await page.click('[data-testid="tab-parser"]');

    // 히스토리 유지됨
    await expect(page.locator('#panel-parser').getByText('[1]')).toBeVisible();
  });

  test('성공/에러 결과 모두 히스토리에 추가되어야 함', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    const panel = page.locator('#panel-parser');

    // 유효한 UUID
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');
    await expect(panel.getByText('[1]')).toBeVisible();

    // 무효한 UUID
    await input.clear();
    await input.fill('invalid-uuid');
    await input.press('Enter');
    await expect(panel.getByText('[2]')).toBeVisible();
  });

  test('히스토리에 [PARSED] 상태가 표시되어야 함', async ({ page }) => {
    const input = page.locator('input[placeholder="파싱할 UUID를 입력하세요..."]');
    const panel = page.locator('#panel-parser');

    // 유효한 UUID 파싱
    await input.fill('550e8400-e29b-41d4-a716-446655440000');
    await input.press('Enter');

    // 히스토리에 [PARSED] 표시 확인
    await expect(panel.getByText('[PARSED]')).toBeVisible();
  });
});
