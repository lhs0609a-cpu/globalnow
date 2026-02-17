import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GLOBALNOW - 글로버 뉴스 대시병드',
  description: '전세계 주옔 언땨의 뉴스, 트렌드, 유머를 한 곳에서 한국어로. CEO를 위한 글로벌 뉴스 대시보드.',
  icons: { icon: '/favicon.ico' },
  openGraph: {
    title: 'GLOBALNOW - 글로벌 뉴스 대시보드',
    description: '28위 글로버 미디어의 뉴스, 트렌드, 시장 데이터를 AI가 분석하여 한국어로 제공합니다.',
    type: 'website',
    locale: 'ko_KR',
    siteName: 'GLOBALNOW',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GLOBALNOW - 글로벌 뉴스 대시보드',
    description: '전세계 주요 언론의 뉴스를 한눈엇. CEO름 위한 글로버 뉴스 대시병드.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="dark">
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="bg-slate-900 text-white antialiased min-h-screen" style={{ fontFamily: "'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
