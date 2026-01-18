#!/bin/bash

# Build Verification Script for UUID Generator
# Verifies that all expected pages are generated correctly in the /out directory

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

echo "════════════════════════════════════════════════════════"
echo "  UUID Generator - Build Verification"
echo "════════════════════════════════════════════════════════"
echo ""

# Function to check if file exists
check_file() {
  local file=$1
  local description=$2
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

  if [ -f "$file" ]; then
    echo -e "${GREEN}✓${NC} $description"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}Missing: $file${NC}"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    return 1
  fi
}

# Function to check if directory exists
check_dir() {
  local dir=$1
  local description=$2
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

  if [ -d "$dir" ]; then
    echo -e "${GREEN}✓${NC} $description"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}Missing: $dir${NC}"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    return 1
  fi
}

# Function to check file content
check_content() {
  local file=$1
  local pattern=$2
  local description=$3
  TOTAL_CHECKS=$((TOTAL_CHECKS + 1))

  if [ ! -f "$file" ]; then
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}File not found: $file${NC}"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    return 1
  fi

  if grep -q "$pattern" "$file"; then
    echo -e "${GREEN}✓${NC} $description"
    PASSED_CHECKS=$((PASSED_CHECKS + 1))
    return 0
  else
    echo -e "${RED}✗${NC} $description"
    echo -e "  ${RED}Pattern not found: $pattern${NC}"
    FAILED_CHECKS=$((FAILED_CHECKS + 1))
    return 1
  fi
}

# Check if out directory exists
if [ ! -d "out" ]; then
  echo -e "${RED}Error: /out directory not found. Please run 'npm run build' first.${NC}"
  exit 1
fi

echo "1. Directory Structure"
echo "──────────────────────────────────────────────────────"
check_dir "out" "Build output directory"
check_dir "out/_next" "Next.js assets directory"
check_dir "out/generate" "Generate pages directory"
check_dir "out/ko" "Korean pages directory"
check_dir "out/ko/generate" "Korean generate pages directory"
echo ""

echo "2. English Pages (Root)"
echo "──────────────────────────────────────────────────────"
check_file "out/index.html" "Root page (index.html)"
check_file "out/generate/v7/index.html" "Generate V7 page"
check_file "out/generate/v4/index.html" "Generate V4 page"
check_file "out/generate/v1/index.html" "Generate V1 page"
check_file "out/validate/index.html" "Validate page"
check_file "out/parse/index.html" "Parse page"
check_file "out/404.html" "404 error page"
echo ""

echo "3. Korean Pages (/ko)"
echo "──────────────────────────────────────────────────────"
check_file "out/ko/index.html" "Korean root page"
check_file "out/ko/generate/v7/index.html" "Korean Generate V7 page"
check_file "out/ko/generate/v4/index.html" "Korean Generate V4 page"
check_file "out/ko/generate/v1/index.html" "Korean Generate V1 page"
check_file "out/ko/validate/index.html" "Korean Validate page"
check_file "out/ko/parse/index.html" "Korean Parse page"
echo ""

echo "4. Static Assets"
echo "──────────────────────────────────────────────────────"
check_file "out/sitemap.xml" "Sitemap"
check_file "out/robots.txt" "Robots.txt"
check_file "out/favicon.ico" "Favicon"
check_file "out/icon.png" "App icon"
check_file "out/apple-icon.png" "Apple icon"
check_file "out/og-image.jpg" "OG image"
echo ""

echo "5. HTML Lang Attributes"
echo "──────────────────────────────────────────────────────"
check_content "out/generate/v7/index.html" '<html lang="en"' "English page has lang=\"en\""
check_content "out/ko/generate/v7/index.html" '<html lang="ko"' "Korean page has lang=\"ko\""
echo ""

echo "6. Canonical URLs"
echo "──────────────────────────────────────────────────────"
check_content "out/generate/v7/index.html" '<link rel="canonical" href="https://uuid.stomx.net/generate/v7/"' "English canonical URL (self-referencing)"
check_content "out/ko/generate/v7/index.html" '<link rel="canonical" href="https://uuid.stomx.net/ko/generate/v7/"' "Korean canonical URL (self-referencing)"
echo ""

echo "7. Hreflang Tags"
echo "──────────────────────────────────────────────────────"
check_content "out/generate/v7/index.html" 'hrefLang="en"' "English page has hrefLang=\"en\""
check_content "out/generate/v7/index.html" 'hrefLang="ko"' "English page has hrefLang=\"ko\""
check_content "out/generate/v7/index.html" 'hrefLang="x-default"' "English page has hrefLang=\"x-default\""
check_content "out/ko/generate/v7/index.html" 'hrefLang="en"' "Korean page has hrefLang=\"en\""
check_content "out/ko/generate/v7/index.html" 'hrefLang="ko"' "Korean page has hrefLang=\"ko\""
check_content "out/ko/generate/v7/index.html" 'hrefLang="x-default"' "Korean page has hrefLang=\"x-default\""
echo ""

echo "8. Sitemap Content"
echo "──────────────────────────────────────────────────────"
check_content "out/sitemap.xml" '<loc>https://uuid.stomx.net/generate/v7/</loc>' "Sitemap contains English v7 page"
check_content "out/sitemap.xml" '<loc>https://uuid.stomx.net/ko/generate/v7/</loc>' "Sitemap contains Korean v7 page"
check_content "out/sitemap.xml" '<loc>https://uuid.stomx.net/validate/</loc>' "Sitemap contains English validate page"
check_content "out/sitemap.xml" '<loc>https://uuid.stomx.net/ko/validate/</loc>' "Sitemap contains Korean validate page"
echo ""

echo "9. Meta Tags"
echo "──────────────────────────────────────────────────────"
check_content "out/generate/v7/index.html" '<meta property="og:locale" content="en_US"' "English page has og:locale=\"en_US\""
check_content "out/ko/generate/v7/index.html" '<meta property="og:locale" content="ko_KR"' "Korean page has og:locale=\"ko_KR\""
check_content "out/generate/v7/index.html" '<meta name="description"' "English page has meta description"
check_content "out/ko/generate/v7/index.html" '<meta name="description"' "Korean page has meta description"
echo ""

echo "10. Build Artifacts"
echo "──────────────────────────────────────────────────────"
# Check if any CSS files exist (they have hashed names)
TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
CSS_FILES=$(find out/_next/static/chunks -name "*.css" 2>/dev/null | wc -l)
if [ "$CSS_FILES" -gt 0 ]; then
  echo -e "${GREEN}✓${NC} CSS files generated ($CSS_FILES files)"
  PASSED_CHECKS=$((PASSED_CHECKS + 1))
else
  echo -e "${RED}✗${NC} CSS files generated"
  echo -e "  ${RED}No CSS files found in out/_next/static/chunks/${NC}"
  FAILED_CHECKS=$((FAILED_CHECKS + 1))
fi
check_dir "out/_next/static/chunks" "JavaScript chunks directory"
echo ""

# Summary
echo "════════════════════════════════════════════════════════"
echo "  Summary"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Total checks: $TOTAL_CHECKS"
echo -e "${GREEN}Passed: $PASSED_CHECKS${NC}"

if [ $FAILED_CHECKS -gt 0 ]; then
  echo -e "${RED}Failed: $FAILED_CHECKS${NC}"
  echo ""
  echo -e "${RED}✗ Build verification FAILED${NC}"
  echo -e "${YELLOW}Please fix the issues above and rebuild.${NC}"
  exit 1
else
  echo -e "${RED}Failed: 0${NC}"
  echo ""
  echo -e "${GREEN}✓ Build verification PASSED${NC}"
  echo -e "${GREEN}All checks completed successfully!${NC}"
  exit 0
fi
