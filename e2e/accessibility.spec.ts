import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test.beforeEach(async ({}, testInfo) => {
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
  });

  test('Generator 탭에 critical 접근성 위반이 없어야 함', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast']) // 대비 문제는 별도 이슈로 처리
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('Validator 탭에 critical 접근성 위반이 없어야 함', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Alt+2');
    await expect(page.locator('#panel-validator')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('Parser 탭에 critical 접근성 위반이 없어야 함', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Alt+3');
    await expect(page.locator('#panel-parser')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .disableRules(['color-contrast'])
      .analyze();

    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical'
    );

    expect(criticalViolations).toEqual([]);
  });

  test('키보드 네비게이션으로 주요 기능에 접근 가능해야 함', async ({ page }) => {
    await page.goto('/');

    // Tab을 여러 번 눌러서 interactive element에 도달
    let foundInteractive = false;
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab');
      const activeElement = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? el.tagName.toLowerCase() : null;
      });
      if (['button', 'a', 'input', 'select'].includes(activeElement || '')) {
        foundInteractive = true;
        break;
      }
    }

    expect(foundInteractive).toBe(true);
  });

  test('스크린 리더 announcement 영역이 존재해야 함', async ({ page }) => {
    await page.goto('/');

    // aria-live 영역 확인
    const liveRegion = page.locator('[role="status"][aria-live="assertive"]');
    await expect(liveRegion).toBeAttached();
  });

  test('모든 이미지에 alt 텍스트가 있어야 함', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.locator('img:not([alt])').count();
    expect(imagesWithoutAlt).toBe(0);
  });
});
