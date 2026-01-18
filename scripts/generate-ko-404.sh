#!/bin/bash

# Generate Korean 404 page for static export
# Next.js static export doesn't automatically generate /ko/404.html

set -e

# Color codes
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Generating Korean 404 page...${NC}"

# Create Korean 404.html
cat > out/ko/404.html << 'EOF'
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>404 - 페이지를 찾을 수 없습니다 | UUID Generator</title>
    <meta name="description" content="요청하신 페이지를 찾을 수 없습니다. UUID Generator로 돌아가세요." />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="icon" href="/favicon.ico" sizes="48x48" type="image/x-icon" />
    <link rel="icon" href="/icon.png" sizes="32x32" type="image/png" />
    <link rel="apple-touch-icon" href="/apple-icon.png" sizes="180x180" type="image/png" />
    <style>
      body {
        background-color: #0a0a0b;
        color: #e8e8e8;
        margin: 0;
        padding: 0;
        font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
      }
      * { box-sizing: border-box; }
      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 1rem;
        text-align: center;
      }
      .content { max-width: 28rem; }
      .ascii-art {
        color: #ff6b6b;
        font-size: 0.75rem;
        line-height: 1.25;
        margin: 0 0 1.5rem 0;
        overflow-x: auto;
      }
      h1 {
        font-size: 1.5rem;
        font-weight: 700;
        margin: 0 0 0.75rem 0;
      }
      .bracket { color: #ff6b6b; }
      .error-code { color: #e8e8e8; }
      p {
        color: #9ca3af;
        font-size: 0.875rem;
        margin: 0 0 1.5rem 0;
      }
      .btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        margin: 1rem 0;
        font-size: 0.875rem;
        border: 2px solid #4ade80;
        color: #4ade80;
        text-decoration: none;
        transition: all 0.2s;
      }
      .btn:hover {
        background-color: #4ade80;
        color: #0a0a0b;
      }
      .links {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        font-size: 0.75rem;
        margin: 0.75rem 0;
      }
      .links a {
        color: #9ca3af;
        text-decoration: none;
        transition: color 0.2s;
      }
      .links a:hover { color: #06b6d4; }
      .separator { color: rgba(156, 163, 175, 0.3); }
      .status {
        margin-top: 1.5rem;
        font-size: 0.625rem;
        color: rgba(156, 163, 175, 0.5);
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .container {
        animation: fadeInUp 0.3s ease-out forwards;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <!-- ASCII Art Error -->
        <pre class="ascii-art">╔══════════════════════════════╗
║         오류  404            ║
║    페이지를  찾을  수  없음   ║
╚══════════════════════════════╝</pre>

        <!-- Error Message -->
        <h1>
          <span class="bracket">[</span>
          <span class="error-code">404</span>
          <span class="bracket">]</span>
          페이지를 찾을 수 없습니다
        </h1>

        <p>
          요청하신 URL은 이 서버에 존재하지 않습니다.
        </p>

        <!-- Navigation Options -->
        <a href="/ko/generate/v7/" class="btn">
          → Generator로 돌아가기
        </a>

        <div class="links">
          <a href="/ko/validate/">Validator</a>
          <span class="separator">|</span>
          <a href="/ko/parse/">Parser</a>
        </div>

        <!-- Status Code -->
        <div class="status">
          <code>HTTP/1.1 404 Not Found</code>
        </div>
      </div>
    </div>
  </body>
</html>
EOF

echo -e "${GREEN}✓${NC} Korean 404 page created at out/ko/404.html"
