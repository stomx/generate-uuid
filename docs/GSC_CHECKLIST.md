# Google Search Console Checklist

다국어 SEO 구현 검증을 위한 Google Search Console 체크리스트

## 1. 초기 설정

### 1.1 속성 추가
- [ ] `uuid.stomx.net` 도메인 속성 추가
- [ ] DNS TXT 레코드 또는 HTML 파일로 소유권 확인
- [ ] 속성 유형: 도메인 속성 (권장) 또는 URL 접두어

### 1.2 사용자 및 권한
- [ ] 소유자 권한 확인
- [ ] 필요시 추가 사용자 초대

## 2. Sitemap 제출

### 2.1 Sitemap 제출
- [ ] `https://uuid.stomx.net/sitemap.xml` 제출
- [ ] "Sitemap" 메뉴에서 제출 상태 확인
- [ ] 색인 생성 상태 모니터링 (발견된 URL / 색인 생성된 URL)

### 2.2 Sitemap 검증 항목
- [ ] 영어 페이지 7개 포함 확인
  - `/generate/v7/`
  - `/generate/v4/`
  - `/generate/v1/`
  - `/validate/`
  - `/parse/`
  - `/` (redirect to `/generate/v7/`)
  - `/generate/` (redirect to `/generate/v7/`)
- [ ] 한국어 페이지 7개 포함 확인
  - `/ko/generate/v7/`
  - `/ko/generate/v4/`
  - `/ko/generate/v1/`
  - `/ko/validate/`
  - `/ko/parse/`
  - `/ko/` (redirect to `/ko/generate/v7/`)
  - `/ko/generate/` (redirect to `/ko/generate/v7/`)
- [ ] 각 URL에 올바른 `lastmod` 날짜 포함 확인
- [ ] 모든 URL이 `https://` 프로토콜 사용 확인
- [ ] Trailing slash 일관성 확인 (모든 URL이 `/`로 종료)

## 3. URL 검사 (URL Inspection)

### 3.1 영어 페이지 검사
각 영어 페이지에 대해 URL 검사 수행:
- [ ] `/generate/v7/` 검사
- [ ] `/validate/` 검사
- [ ] `/parse/` 검사

**검증 항목:**
- [ ] 색인 생성 상태: "URL이 Google에 등록되어 있음"
- [ ] Canonical URL: 자기 참조 (예: `https://uuid.stomx.net/generate/v7/`)
- [ ] HTML `lang` 속성: `en`
- [ ] hreflang 태그 존재 확인 (en, ko, x-default)

### 3.2 한국어 페이지 검사
각 한국어 페이지에 대해 URL 검사 수행:
- [ ] `/ko/generate/v7/` 검사
- [ ] `/ko/validate/` 검사
- [ ] `/ko/parse/` 검사

**검증 항목:**
- [ ] 색인 생성 상태: "URL이 Google에 등록되어 있음"
- [ ] Canonical URL: 자기 참조 (예: `https://uuid.stomx.net/ko/generate/v7/`)
- [ ] HTML `lang` 속성: `ko`
- [ ] hreflang 태그 존재 확인 (en, ko, x-default)

### 3.3 공통 검증 항목
- [ ] 모바일 사용 가능 여부: "페이지를 모바일에서 사용할 수 있음"
- [ ] 페이지 리소스 로드 성공 확인
- [ ] robots.txt 차단 없음 확인
- [ ] noindex 태그 없음 확인

## 4. hreflang 검증

### 4.1 International Targeting
"레거시 도구 및 보고서" > "국제 타겟팅" 메뉴에서:
- [ ] hreflang 오류 없음 확인
- [ ] hreflang 경고 확인 및 해결

### 4.2 hreflang 구성 검증
각 페이지가 다음 hreflang 태그를 포함하는지 확인:
```html
<link rel="alternate" hreflang="en" href="https://uuid.stomx.net/[path]/" />
<link rel="alternate" hreflang="ko" href="https://uuid.stomx.net/ko/[path]/" />
<link rel="alternate" hreflang="x-default" href="https://uuid.stomx.net/[path]/" />
```

**검증 방법:**
- [ ] URL 검사 > "HTML 보기" 에서 hreflang 태그 확인
- [ ] 외부 도구 사용 (예: hreflang Tags Testing Tool)

### 4.3 hreflang 쌍 검증
- [ ] 영어 페이지 → 한국어 페이지 상호 참조 확인
- [ ] 한국어 페이지 → 영어 페이지 상호 참조 확인
- [ ] x-default가 올바른 기본 언어(영어) 가리킴 확인

## 5. 색인 생성 커버리지

### 5.1 색인 생성 보고서
"페이지 색인 생성" 메뉴에서:
- [ ] "색인 생성됨" 상태 페이지 수 확인 (목표: 14개)
- [ ] 오류가 있는 페이지 0개 확인
- [ ] 경고가 있는 페이지 확인 및 해결

### 5.2 색인 생성 제외 사유
다음 항목이 없는지 확인:
- [ ] "noindex 태그로 인해 제외됨" - 없어야 함
- [ ] "Canonical 태그로 인해 제외됨" - redirect 페이지만 허용
- [ ] "404 오류" - 없어야 함
- [ ] "소프트 404" - 없어야 함
- [ ] "중복된 페이지, 사용자가 선택한 표준 페이지 아님" - 없어야 함

## 6. 모바일 사용성

"모바일 사용성" 메뉴에서:
- [ ] 오류가 없는 페이지 100% 확인
- [ ] 텍스트가 너무 작음 - 없어야 함
- [ ] 클릭 가능한 요소가 너무 가까움 - 없어야 함
- [ ] 콘텐츠 너비가 화면 너비보다 큼 - 없어야 함
- [ ] 뷰포트가 설정되지 않음 - 없어야 함

## 7. Core Web Vitals

"환경" > "Core Web Vitals" 메뉴에서:
- [ ] LCP (Largest Contentful Paint): "양호" 상태
- [ ] FID (First Input Delay): "양호" 상태
- [ ] CLS (Cumulative Layout Shift): "양호" 상태
- [ ] 모바일 및 데스크톱 모두 "양호" 상태 확인

**목표 지표:**
- LCP: < 2.5초
- FID: < 100ms
- CLS: < 0.1

## 8. 실적 분석

### 8.1 검색 실적 보고서
"실적" 메뉴에서 다음 지표 모니터링:
- [ ] 총 클릭수 추이
- [ ] 총 노출수 추이
- [ ] 평균 CTR (클릭률)
- [ ] 평균 게재순위

### 8.2 언어별 트래픽
- [ ] 페이지 필터로 영어 페이지 `/generate/*`, `/validate`, `/parse` 실적 확인
- [ ] 페이지 필터로 한국어 페이지 `/ko/*` 실적 확인
- [ ] 국가별 필터로 한국 vs 기타 국가 트래픽 비교

### 8.3 검색어 분석
- [ ] "uuid generator" 등 영어 키워드 순위 확인
- [ ] "uuid 생성" 등 한국어 키워드 순위 확인
- [ ] 브랜드 검색 vs 일반 검색 비율

## 9. 강화 기능 (Enhancements)

### 9.1 구조화된 데이터
"강화 기능" 메뉴에서:
- [ ] WebSite 구조화된 데이터 인식 확인
- [ ] 오류 및 경고 확인 및 해결
- [ ] 리치 결과 테스트 도구로 추가 검증

### 9.2 빵 부스러기 (Breadcrumbs)
필요시:
- [ ] Breadcrumb 구조화된 데이터 추가 검토
- [ ] 검색 결과 미리보기 확인

## 10. 보안 및 수동 조치

### 10.1 보안 문제
"보안 및 수동 조치" > "보안 문제" 메뉴에서:
- [ ] 보안 문제 없음 확인
- [ ] 해킹된 콘텐츠 없음
- [ ] 멀웨어 없음

### 10.2 수동 조치
"보안 및 수동 조치" > "수동 조치" 메뉴에서:
- [ ] 수동 조치 없음 확인
- [ ] 스팸 정책 위반 없음
- [ ] 품질 가이드라인 준수

## 11. 링크 분석

### 11.1 외부 링크
"링크" 메뉴에서:
- [ ] 상위 외부 링크 사이트 확인
- [ ] 스팸성 백링크 disavow 검토

### 11.2 내부 링크
- [ ] 상위 내부 링크 페이지 확인
- [ ] 링크 구조 최적화 여부 검토

## 12. 설정 검증

### 12.1 크롤링 설정
- [ ] robots.txt 파일 확인 (GSC 도구 사용)
- [ ] Sitemap 경로 확인
- [ ] URL 매개변수 설정 (필요시)

### 12.2 속성 설정
- [ ] 선호 도메인 설정 (www vs non-www)
- [ ] 크롤링 속도 설정 (자동 권장)

## 13. 지속적인 모니터링

### 일일 점검 (배포 직후 2주간)
- [ ] 색인 생성 커버리지 확인
- [ ] 오류 보고서 확인
- [ ] Core Web Vitals 모니터링

### 주간 점검
- [ ] 검색 실적 추이 분석
- [ ] 새로운 경고 및 오류 확인
- [ ] 언어별 트래픽 비교

### 월간 점검
- [ ] 검색어 순위 변동 분석
- [ ] 백링크 프로필 검토
- [ ] Core Web Vitals 트렌드 분석

## 14. 문제 해결

### 색인 생성 안 되는 경우
1. [ ] URL 검사로 상세 오류 확인
2. [ ] robots.txt 차단 여부 확인
3. [ ] Canonical 태그 올바른지 확인
4. [ ] Sitemap 재제출
5. [ ] "색인 생성 요청" 수동 제출

### hreflang 오류 해결
1. [ ] hreflang 쌍이 상호 참조하는지 확인
2. [ ] URL이 정확한지 확인 (trailing slash 포함)
3. [ ] HTTP vs HTTPS 프로토콜 일치 확인
4. [ ] 외부 hreflang 검증 도구 사용

### Core Web Vitals 개선
1. [ ] PageSpeed Insights로 상세 분석
2. [ ] 이미지 최적화 (WebP, lazy loading)
3. [ ] JavaScript 번들 크기 축소
4. [ ] 서버 응답 시간 개선 (CDN 사용)

## 15. 참고 자료

- [Google Search Console 도움말](https://support.google.com/webmasters)
- [hreflang 구현 가이드](https://developers.google.com/search/docs/advanced/crawling/localized-versions)
- [Sitemap 프로토콜](https://www.sitemaps.org/)
- [Core Web Vitals 가이드](https://web.dev/vitals/)
- [구조화된 데이터 가이드](https://developers.google.com/search/docs/advanced/structured-data/intro-structured-data)

## 변경 이력

- 2026-01-18: 초기 버전 작성 - 다국어 SEO 구현 검증용
