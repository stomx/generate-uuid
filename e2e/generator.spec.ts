import { test, expect } from '@playwright/test';

test.describe('UUID Generator', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Desktop에서만 실행 (mobile은 mobile.spec.ts에서 테스트)
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
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

  test('UUID 생성 시 자동으로 클립보드에 복사', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // UUID 생성
    await page.click('[data-testid="generate-btn"]');
    await page.waitForTimeout(200);

    // 생성된 UUID 확인
    const uuidDisplay = page.locator('[data-testid="uuid-display"]');
    const uuidText = await uuidDisplay.textContent();

    // 클립보드 내용 확인
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // 클립보드에 UUID가 복사되었는지 확인
    expect(clipboardText).toContain(uuidText?.trim().split('\n')[0].trim());
  });

  test('개별 UUID 클릭 시 해당 UUID만 복사', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);

    // Count를 5로 설정하여 여러 UUID 생성
    await page.click('[role="combobox"]');
    await page.click('[role="option"]:has-text("5")');

    // 생성
    await page.click('[data-testid="generate-btn"]');
    await page.waitForTimeout(200);

    // 두 번째 UUID의 실제 UUID 값만 추출 (버튼 내 두 번째 span)
    const uuidButtons = page.locator('[data-testid="uuid-display"] button');
    const secondUuidSpan = uuidButtons.nth(1).locator('span').nth(1); // UUID 값이 있는 span
    const secondUuid = await secondUuidSpan.textContent();
    await uuidButtons.nth(1).click();

    // 클립보드 확인
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());

    // 개별 UUID만 복사되었는지 확인
    expect(clipboardText).toBe(secondUuid?.trim());
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

test.describe('Keyboard Shortcuts', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
    await page.goto('/');
  });

  test('Alt+Q/W/E로 버전 전환이 작동해야 함', async ({ page }) => {
    // Alt+Q → V1
    await page.keyboard.press('Alt+q');
    await expect(page.locator('text=output.v1')).toBeVisible();

    // Alt+W → V4
    await page.keyboard.press('Alt+w');
    await expect(page.locator('text=output.v4')).toBeVisible();

    // Alt+E → V7
    await page.keyboard.press('Alt+e');
    await expect(page.locator('text=output.v7')).toBeVisible();
  });

  test('Alt+N으로 UUID 생성이 작동해야 함', async ({ page }) => {
    const uuidDisplay = page.locator('[data-testid="uuid-display"]');
    const firstUuid = await uuidDisplay.textContent();

    await page.keyboard.press('Alt+n');
    await page.waitForTimeout(100);

    const newUuid = await uuidDisplay.textContent();
    expect(newUuid).not.toBe(firstUuid);
  });

  test('Enter 키로 UUID 생성이 작동해야 함', async ({ page }) => {
    const uuidDisplay = page.locator('[data-testid="uuid-display"]');
    const firstUuid = await uuidDisplay.textContent();

    await page.keyboard.press('Enter');
    await page.waitForTimeout(100);

    const newUuid = await uuidDisplay.textContent();
    expect(newUuid).not.toBe(firstUuid);
  });

  test('Alt+1/2/3으로 탭 전환이 작동해야 함', async ({ page }) => {
    // Alt+2 → Validator 탭
    await page.keyboard.press('Alt+2');
    await expect(page.locator('#panel-validator')).toBeVisible();

    // Alt+3 → Parser 탭
    await page.keyboard.press('Alt+3');
    await expect(page.locator('#panel-parser')).toBeVisible();

    // Alt+1 → Generator 탭
    await page.keyboard.press('Alt+1');
    await expect(page.locator('#panel-generator')).toBeVisible();
  });

  test('입력 필드에서도 단축키가 작동해야 함', async ({ page }) => {
    // Validator 탭으로 이동
    await page.keyboard.press('Alt+2');
    await expect(page.locator('#panel-validator')).toBeVisible();

    // 입력 필드에 포커스
    const input = page.locator('#panel-validator input').first();
    await input.focus();

    // Alt+1 누르면 탭이 변경되어야 함 (입력 필드 내에서도 단축키 우선)
    await page.keyboard.press('Alt+1');

    // Generator 탭으로 이동해야 함
    await expect(page.locator('#panel-generator')).toBeVisible();
  });
});
