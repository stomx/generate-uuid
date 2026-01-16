import { test, expect } from '@playwright/test';

test.describe('UUID Generator', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('페이지 로드 시 UUID가 표시되어야 함', async ({ page }) => {
    const uuidDisplay = page.locator('[data-testid="uuid-display"]');
    await expect(uuidDisplay).toBeVisible();

    const content = await uuidDisplay.textContent();
    expect(content).toBeTruthy();
    // UUID 형식 검증 (36자)
    expect(content!.length).toBeGreaterThanOrEqual(36);
  });

  test('GENERATE 버튼 클릭 시 새 UUID 생성', async ({ page }) => {
    const generateBtn = page.locator('[data-testid="generate-btn"]');
    const uuidDisplay = page.locator('[data-testid="uuid-display"]');

    // 첫 번째 UUID 저장
    const firstUuid = await uuidDisplay.textContent();

    // 새로 생성
    await generateBtn.click();
    await page.waitForTimeout(100);

    // UUID가 변경되었는지 확인
    const newUuid = await uuidDisplay.textContent();
    expect(newUuid).not.toBe(firstUuid);
  });

  test('복사 버튼 클릭 시 클립보드에 복사', async ({ page, context }) => {
    // 클립보드 권한 부여
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // 아이콘 복사 버튼 (aria-label로 식별)
    const copyBtn = page.locator('button[aria-label="전체 복사"]');
    await copyBtn.click();

    // 복사 성공 시 버튼 배경색이 accent-mint로 변경됨 (bg-accent-mint 클래스)
    await expect(copyBtn).toHaveClass(/bg-accent-mint/);
  });

  test('버전 탭 전환이 작동해야 함', async ({ page }) => {
    // V1 선택
    await page.click('button:has-text("V1")');
    await expect(page.locator('text=output.v1')).toBeVisible();

    // V7 선택
    await page.click('button:has-text("V7")');
    await expect(page.locator('text=output.v7')).toBeVisible();

    // V4 선택
    await page.click('button:has-text("V4")');
    await expect(page.locator('text=output.v4')).toBeVisible();
  });
});
