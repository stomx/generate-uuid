import { test, expect } from '@playwright/test';

test.describe('404 Error Pages', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    // Skip mobile tests for desktop-specific features
    test.skip(testInfo.project.name === 'mobile', 'Desktop tests only');
  });

  test.describe('English 404 Page', () => {
    test('존재하지 않는 영어 페이지 접근 시 404 표시', async ({ page }) => {
      await page.goto('/non-existent-page/');

      // Check for 404 error indicators (use .first() to avoid strict mode violation)
      await expect(page.locator('h1').filter({ hasText: '404' })).toBeVisible();
      await expect(page.locator('text=Page Not Found').first()).toBeVisible();
    });

    test('영어 404 페이지에 lang="en" 속성 존재', async ({ page }) => {
      await page.goto('/this-does-not-exist/');

      const htmlElement = page.locator('html');
      await expect(htmlElement).toHaveAttribute('lang', 'en');
    });

    test('영어 404 페이지에 ASCII 아트 표시', async ({ page }) => {
      await page.goto('/invalid-route/');

      const asciiArt = page.locator('pre', { hasText: 'ERROR  404' });
      await expect(asciiArt).toBeVisible();
    });

    test('영어 404에서 Generator로 돌아가기 링크 작동', async ({ page }) => {
      await page.goto('/broken-link/');

      const returnLink = page.getByRole('link', { name: /Return to Generator/ });
      await expect(returnLink).toBeVisible();
      await returnLink.click();

      await page.waitForURL('/generate/v7/');
      await expect(page).toHaveURL('/generate/v7/');
    });

    test('영어 404에서 Validator 링크 작동', async ({ page }) => {
      await page.goto('/missing-page/');

      const validatorLink = page.getByRole('link', { name: 'Validator' });
      await expect(validatorLink).toBeVisible();
      await validatorLink.click();

      await page.waitForURL('/validate/');
      await expect(page).toHaveURL('/validate/');
    });

    test('영어 404에서 Parser 링크 작동', async ({ page }) => {
      await page.goto('/not-here/');

      const parserLink = page.getByRole('link', { name: 'Parser' });
      await expect(parserLink).toBeVisible();
      await parserLink.click();

      await page.waitForURL('/parse/');
      await expect(page).toHaveURL('/parse/');
    });

    test('영어 404에 HTTP 상태 코드 표시', async ({ page }) => {
      await page.goto('/error-route/');

      await expect(page.locator('text=HTTP/1.1 404 Not Found')).toBeVisible();
    });
  });

  test.describe('Korean 404 Page (Production Only)', () => {
    // Note: Korean 404 page requires production build
    // Development mode uses root not-found.tsx for all 404s
    // Run these tests with: npm run build && npx serve out

    test.skip('한국어 404는 프로덕션 빌드에서만 테스트 가능', () => {
      // Static /ko/404.html is only generated and served in production
      // Development server always uses app/not-found.tsx (English)
      //
      // To test Korean 404:
      // 1. npm run build
      // 2. npx serve out
      // 3. Navigate to http://localhost:3000/ko/non-existent-page/
      //
      // Verification checklist:
      // - HTML has lang="ko"
      // - Text is in Korean (페이지를 찾을 수 없습니다)
      // - ASCII art has Korean text (오류  404)
      // - Links point to /ko/* URLs
    });
  });

  test.describe('404 Page Styling', () => {
    test('404 페이지가 Terminal Noir 스타일 사용', async ({ page }) => {
      await page.goto('/style-test-404/');

      // Check for dark background
      const body = page.locator('body');
      const bgColor = await body.evaluate((el) =>
        window.getComputedStyle(el).backgroundColor
      );

      // Dark background (should be #0a0a0b or similar)
      expect(bgColor).toMatch(/rgb\(10,\s*10,\s*11\)/);
    });

    test('404 페이지에 fade-in 애니메이션 적용', async ({ page }) => {
      await page.goto('/animation-test/');

      const container = page.locator('.container').first();
      await expect(container).toBeVisible();

      // Container should have animation
      const animation = await container.evaluate((el) =>
        window.getComputedStyle(el).animation
      );
      expect(animation).toContain('fadeInUp');
    });
  });
});
