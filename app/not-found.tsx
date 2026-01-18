import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found | UUID Generator',
  description: 'The requested page could not be found. Return to UUID Generator.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootNotFound() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Critical inline CSS for 404 page */}
        <style dangerouslySetInnerHTML={{__html: `
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
        `}} />
      </head>
      <body>
        <div className="container">
          <div className="content">
            {/* ASCII Art Error */}
            <pre className="ascii-art">
{`╔══════════════════════════════╗
║         ERROR  404           ║
║    PAGE  NOT  FOUND          ║
╚══════════════════════════════╝`}
            </pre>

            {/* Error Message */}
            <h1>
              <span className="bracket">[</span>
              <span className="error-code">404</span>
              <span className="bracket">]</span>
              {' '}Page Not Found
            </h1>

            <p>
              The requested URL does not exist on this server.
            </p>

            {/* Navigation Options */}
            <Link href="/generate/v7/" className="btn">
              → Return to Generator
            </Link>

            <div className="links">
              <Link href="/validate/">Validator</Link>
              <span className="separator">|</span>
              <Link href="/parse/">Parser</Link>
            </div>

            {/* Status Code */}
            <div className="status">
              <code>HTTP/1.1 404 Not Found</code>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
