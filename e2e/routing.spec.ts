import { test, expect } from '@playwright/test';

test.describe('Page Routing', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
  });

  test('루트 경로가 /generate/v7로 리다이렉트', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/generate\/v7/);
  });

  test('/generate/v7 접속 시 V7 버전이 선택됨', async ({ page }) => {
    await page.goto('/generate/v7');
    await expect(page.locator('text=output.v7')).toBeVisible();
    await expect(page.locator('button:has-text("V7")')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  test('/generate/v4 접속 시 V4 버전이 선택됨', async ({ page }) => {
    await page.goto('/generate/v4');
    await expect(page.locator('text=output.v4')).toBeVisible();
    await expect(page.locator('button:has-text("V4")')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  test('/generate/v1 접속 시 V1 버전이 선택됨', async ({ page }) => {
    await page.goto('/generate/v1');
    await expect(page.locator('text=output.v1')).toBeVisible();
    await expect(page.locator('button:has-text("V1")')).toHaveAttribute(
      'aria-checked',
      'true'
    );
  });

  test('/validate 접속 시 Validator 패널이 표시됨', async ({ page }) => {
    await page.goto('/validate');
    await expect(page.locator('#panel-validator')).toBeVisible();
    await expect(page.locator('text=[ VALIDATE ]')).toBeVisible();
  });

  test('/parse 접속 시 Parser 패널이 표시됨', async ({ page }) => {
    await page.goto('/parse');
    await expect(page.locator('#panel-parser')).toBeVisible();
    await expect(page.locator('text=[ PARSE ]')).toBeVisible();
  });
});

test.describe('Tab Navigation Links', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
    await page.goto('/generate/v7');
  });

  test('Generate 탭에서 Validate 탭으로 링크 이동', async ({ page }) => {
    const validateTab = page.locator('a:has-text("Validate")');
    await validateTab.click();
    await expect(page).toHaveURL(/\/validate/);
    await expect(page.locator('#panel-validator')).toBeVisible();
  });

  test('Validate 탭에서 Parse 탭으로 링크 이동', async ({ page }) => {
    await page.goto('/validate');
    const parseTab = page.locator('a:has-text("Parse")');
    await parseTab.click();
    await expect(page).toHaveURL(/\/parse/);
    await expect(page.locator('#panel-parser')).toBeVisible();
  });

  test('Parse 탭에서 Generate 탭으로 링크 이동', async ({ page }) => {
    await page.goto('/parse');
    const generateTab = page.locator('a:has-text("Generate")');
    await generateTab.click();
    await expect(page).toHaveURL(/\/generate\/v7/);
    await expect(page.locator('#panel-generator')).toBeVisible();
  });
});

test.describe('Version Selector Links', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
    await page.goto('/generate/v7');
  });

  test('V1 버튼 클릭 시 URL 변경', async ({ page }) => {
    await page.click('button:has-text("V1")');
    await expect(page).toHaveURL(/\/generate\/v1/);
  });

  test('V4 버튼 클릭 시 URL 변경', async ({ page }) => {
    await page.click('button:has-text("V4")');
    await expect(page).toHaveURL(/\/generate\/v4/);
  });

  test('V7 버튼 클릭 시 URL 변경', async ({ page }) => {
    await page.goto('/generate/v1');
    await page.click('button:has-text("V7")');
    await expect(page).toHaveURL(/\/generate\/v7/);
  });
});

test.describe('Keyboard Navigation Updates URL', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
    await page.goto('/generate/v7');
  });

  test('Alt+2로 Validate 탭 이동 시 URL 변경', async ({ page }) => {
    await page.keyboard.press('Alt+2');
    await expect(page).toHaveURL(/\/validate/);
  });

  test('Alt+3으로 Parse 탭 이동 시 URL 변경', async ({ page }) => {
    await page.keyboard.press('Alt+3');
    await expect(page).toHaveURL(/\/parse/);
  });

  test('Alt+1으로 Generate 탭 이동 시 URL 변경', async ({ page }) => {
    await page.goto('/validate');
    await page.keyboard.press('Alt+1');
    await expect(page).toHaveURL(/\/generate\/v7/);
  });

  test('Alt+Q로 V1 버전 변경 시 URL 변경', async ({ page }) => {
    await page.keyboard.press('Alt+q');
    await expect(page).toHaveURL(/\/generate\/v1/);
  });

  test('Alt+W로 V4 버전 변경 시 URL 변경', async ({ page }) => {
    await page.keyboard.press('Alt+w');
    await expect(page).toHaveURL(/\/generate\/v4/);
  });

  test('Alt+E로 V7 버전 변경 시 URL 변경', async ({ page }) => {
    await page.goto('/generate/v1');
    await page.keyboard.press('Alt+e');
    await expect(page).toHaveURL(/\/generate\/v7/);
  });

  test('입력 필드에서도 Alt+1/2/3 단축키가 작동해야 함', async ({ page }) => {
    // Validator 탭으로 이동
    await page.goto('/validate');

    // 입력 필드에 포커스
    const input = page.locator('#panel-validator input').first();
    await input.focus();

    // Alt+1 누르면 Generate 탭으로 이동
    await page.keyboard.press('Alt+1');

    // URL이 /generate/v7으로 변경되어야 함
    await expect(page).toHaveURL(/\/generate\/v7/);
  });
});

test.describe('Browser Navigation', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
  });

  test('브라우저 뒤로가기로 이전 페이지 복원', async ({ page }) => {
    await page.goto('/generate/v7');
    await page.goto('/validate');
    await page.goto('/parse');

    // 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL(/\/validate/);
    await expect(page.locator('#panel-validator')).toBeVisible();

    // 다시 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL(/\/generate\/v7/);
  });

  test('브라우저 앞으로가기로 다음 페이지 복원', async ({ page }) => {
    await page.goto('/generate/v7');
    await page.goto('/validate');

    // 뒤로가기
    await page.goBack();
    await expect(page).toHaveURL(/\/generate\/v7/);

    // 앞으로가기
    await page.goForward();
    await expect(page).toHaveURL(/\/validate/);
    await expect(page.locator('#panel-validator')).toBeVisible();
  });
});
