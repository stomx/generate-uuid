# Google AdSense 설정 가이드

UUID 생성기에 Google AdSense 광고를 통합하는 방법을 안내합니다.

## 🎨 디자인 특징

광고 배너는 터미널 스타일 UI와 자연스럽게 조화를 이루도록 디자인되었습니다:

- **터미널 스타일 프레임**: ASCII 보더와 시스템 메시지 형식
- **네온 액센트**: 민트 그린(#39FF14) 강조 색상
- **CRT 효과**: 스캔라인 오버레이
- **위치**: 푸터 위, 사용성을 해치지 않는 위치
- **레이지 로딩**: Intersection Observer로 성능 최적화

## 📋 설정 단계

### 1. Google AdSense 계정 생성

1. [Google AdSense](https://www.google.com/adsense/) 접속
2. 계정 생성 및 사이트 등록
3. 승인 대기 (보통 1-2일 소요)

### 2. 광고 단위 생성

1. AdSense 대시보드 → **광고** → **광고 단위 기준**
2. **디스플레이 광고** 선택
3. 광고 단위 이름 설정 (예: "UUID Generator Footer Banner")
4. 광고 크기:
   - **반응형** 선택 (권장)
   - 또는 **가로형 배너** (예: 728x90, 320x50)
5. **만들기** 클릭

### 3. 광고 코드 복사

생성된 광고 단위에서 다음 정보를 복사합니다:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1234567890123456"></script>
<ins class="adsbygoogle"
     data-ad-client="ca-pub-1234567890123456"
     data-ad-slot="9876543210"></ins>
```

여기서:
- `ca-pub-1234567890123456`: 클라이언트 ID
- `9876543210`: 광고 슬롯 ID

### 4. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성합니다:

```bash
# .env.local
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-1234567890123456
NEXT_PUBLIC_ADSENSE_SLOT_ID=9876543210
```

**중요**:
- `.env.local` 파일은 Git에 커밋하지 마세요 (이미 .gitignore에 포함됨)
- 실제 AdSense ID로 교체하세요

### 5. 로컬 테스트

```bash
npm run dev
```

개발 서버를 실행하고 http://localhost:3000 에서 확인합니다.

**참고**:
- 개발 환경에서는 광고가 즉시 표시되지 않을 수 있습니다
- AdSense는 localhost에서 광고를 제공하지 않을 수 있습니다
- 실제 도메인에 배포한 후 테스트하세요

### 6. 프로덕션 배포

#### GitHub Pages 배포 시

GitHub Secrets에 환경 변수를 추가합니다:

1. GitHub 저장소 → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 다음 시크릿 추가:
   - Name: `ADSENSE_CLIENT_ID`, Value: `ca-pub-1234567890123456`
   - Name: `ADSENSE_SLOT_ID`, Value: `9876543210`

#### Vercel 배포 시

1. Vercel 대시보드 → 프로젝트 선택
2. **Settings** → **Environment Variables**
3. 다음 변수 추가:
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID`: `ca-pub-1234567890123456`
   - `NEXT_PUBLIC_ADSENSE_SLOT_ID`: `9876543210`
4. **Save** 후 재배포

#### Netlify 배포 시

1. Netlify 대시보드 → 사이트 선택
2. **Site settings** → **Environment variables**
3. 변수 추가 (Vercel과 동일)
4. **Save** 후 재배포

## 🎯 광고 위치 커스터마이징

광고 위치를 변경하려면 `app/page.tsx`를 수정하세요:

```tsx
{/* 현재 위치: 푸터 위 */}
{process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
  <div className="pt-4 shrink-0">
    <AdBanner
      adClient={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
      adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ''}
      className="max-w-2xl mx-auto"
    />
  </div>
)}
```

## 🎨 스타일 커스터마이징

배너 스타일을 변경하려면 `components/common/AdBanner.tsx`를 수정하세요.

터미널 테마 변수는 `app/globals.css`에 정의되어 있습니다:

```css
:root {
  --accent-mint: #39FF14;
  --accent-amber: #FFB000;
  --bg-surface: #111113;
  --border-dashed: #333336;
}
```

## 🚀 성능 최적화

### 지연 로딩 (Delayed Loading)

광고 배너는 **3초 지연 후 표시**되어 다음과 같이 최적화됩니다:

1. **페이지 로드**: 광고 없이 콘텐츠 우선 로드
2. **3초 대기**: 사용자가 콘텐츠를 먼저 확인
3. **광고 표시**: 부드러운 fadeIn 애니메이션과 함께 표시

**성능 이점**:
- ✅ **초기 페이지 로드 속도 개선**
- ✅ **사용자 경험 향상** (콘텐츠 우선)
- ✅ **Core Web Vitals 점수 향상**
- ✅ **불필요한 네트워크 요청 방지**

### 지연 시간 설정

`app/page.tsx`에서 지연 시간을 조정할 수 있습니다:

```tsx
<AdBanner
  adClient={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
  adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || ''}
  delay={3}  // 3초 지연 (기본값)
/>
```

**커스터마이징**:
- `delay={1}`: 1초 지연 (빠른 표시)
- `delay={3}`: 3초 지연 (기본값, 권장)
- `delay={5}`: 5초 지연 (느린 표시)

## 📊 광고 성능 모니터링

1. AdSense 대시보드 → **보고서**
2. 다음 지표를 확인:
   - **페이지 조회수**
   - **클릭수**
   - **CTR (클릭률)**
   - **예상 수익**

## ⚠️ 주의사항

1. **광고 정책 준수**: Google AdSense 정책을 반드시 준수하세요
2. **자가 클릭 금지**: 본인의 광고를 클릭하지 마세요
3. **콘텐츠 품질**: 유용한 콘텐츠를 제공하세요
4. **트래픽**: 자연스러운 트래픽을 유도하세요

## 🔧 문제 해결

### 광고가 표시되지 않는 경우

1. **환경 변수 확인**:
   ```bash
   echo $NEXT_PUBLIC_ADSENSE_CLIENT_ID
   ```

2. **브라우저 콘솔 확인**:
   - F12 → Console 탭
   - AdSense 관련 오류 메시지 확인

3. **AdSense 승인 상태 확인**:
   - AdSense 대시보드에서 계정 상태 확인

4. **광고 차단기 비활성화**:
   - AdBlock 등의 확장 프로그램 비활성화

### "Ad loading..." 메시지가 계속 표시되는 경우

1. 네트워크 연결 확인
2. AdSense 스크립트 로드 확인
3. 광고 슬롯 ID 정확성 확인

## 📚 추가 리소스

- [Google AdSense 도움말](https://support.google.com/adsense/)
- [AdSense 정책](https://support.google.com/adsense/answer/48182)
- [최적화 가이드](https://support.google.com/adsense/answer/9713)
