import { test, expect } from '@playwright/test';

// 모바일 프로젝트에서만 실행
test.describe('Mobile', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // chromium 프로젝트에서는 스킵 (mobile 프로젝트만 실행)
    test.skip(testInfo.project.name !== 'mobile', 'Mobile tests only run on mobile project');
    await page.goto('/');
  });

  test('모바일에서 레이아웃이 깨지지 않아야 함', async ({ page }) => {
    // 수평 스크롤 없음 확인
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test('모바일에서 탭 전환이 작동해야 함', async ({ page }) => {
    // 탭 버튼 클릭
    const tabs = page.locator('[role="tab"]');

    // Validator 탭 클릭
    await tabs.nth(1).click();
    await expect(page.locator('#panel-validator')).toBeVisible();

    // Parser 탭 클릭
    await tabs.nth(2).click();
    await expect(page.locator('#panel-parser')).toBeVisible();

    // Generator 탭 클릭
    await tabs.nth(0).click();
    await expect(page.locator('#panel-generator')).toBeVisible();
  });

  test('모바일에서 UUID 생성이 작동해야 함', async ({ page }) => {
    const uuidDisplay = page.locator('[data-testid="uuid-display"]');
    const firstUuid = await uuidDisplay.textContent();

    // 생성 버튼 클릭
    await page.click('[data-testid="generate-btn"]');
    await page.waitForTimeout(100);

    const newUuid = await uuidDisplay.textContent();
    expect(newUuid).not.toBe(firstUuid);
  });

  test('모바일에서 버전 선택이 작동해야 함', async ({ page }) => {
    // V1 선택
    await page.click('[data-testid="version-v1"]');
    await expect(page.locator('text=output.v1')).toBeVisible();

    // V7 선택
    await page.click('[data-testid="version-v7"]');
    await expect(page.locator('text=output.v7')).toBeVisible();
  });

  test('모바일에서 축약 레이블이 표시되어야 함', async ({ page }) => {
    // 모바일에서 버튼에 "GEN" 표시 확인 (GENERATE 대신)
    const generateBtn = page.locator('[data-testid="generate-btn"]');
    const btnText = await generateBtn.textContent();

    // 모바일에서는 짧은 텍스트가 보여야 함 (15자 이하)
    expect(btnText?.length).toBeLessThanOrEqual(15);
  });

  test('모바일에서 옵션 패널이 작동해야 함', async ({ page }) => {
    // Count combobox 클릭
    await page.click('[role="combobox"]');

    // 옵션 선택
    await page.click('[role="option"]:has-text("10")');

    // combobox에 10이 표시되어야 함
    await expect(page.locator('[role="combobox"]')).toHaveText('10');
  });
});
