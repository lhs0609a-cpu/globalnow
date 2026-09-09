import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'GLOBALNOW — 세계 상황과 의사결정',
    template: '%s · GLOBALNOW',
  },
  description:
    '사업자·글로벌 CEO·투자자를 위한 세계 상황판. 지정학, 무역, 산업, 시장의 변화를 모니터하고 원문 근거와 사업 영향을 검토하세요.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'GLOBALNOW — 세계 상황과 의사결정',
    description:
      '세계의 변화, 내 사업과 투자의 관심 지역, 판단에 필요한 근거를 한곳에서.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'GLOBALNOW',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GLOBALNOW — 세계 상황과 의사결정',
    description: '사업자·CEO·투자자를 위한 세계 상황 모니터와 의사결정 브리프.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0b0d13' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fa' },
  ],
};

/**
 * 첫 페인트 전에 테마를 확정한다.
 *
 * 저장된 값을 읽기 전에 화면이 한 번 그려지면 라이트 사용자에게 검은 화면이
 * 번쩍인다. 그래서 블로킹 스크립트로 <html> 에 먼저 심는다.
 */
const themeScript = `(function(){try{var t=localStorage.getItem('gn-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';}document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />

        {/* 본문·UI 서체 */}
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        {/* 편집용 세리프 — 라틴 원문 제목·워드마크에만 쓰므로 latin 서브셋만 */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-canvas text-slate-100 antialiased">
        <a href="#main" className="skip-link surface px-3 py-2 t-label">
          본문 바로가기
        </a>
        {children}
      </body>
    </html>
  );
}
