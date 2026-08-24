import type { Metadata, Viewport } from 'next';
import '../src/index.css';
import StyledComponentsRegistry from '../src/lib/next/StyledComponentsRegistry';
import Providers from '../src/components/app/Providers';

const SITE_URL = 'https://developer-pino.info';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: '허정연 - 프론트엔드 포트폴리오',
  description:
    '프론트엔드 개발자 허정연의 포트폴리오. React · TypeScript 기반 프로젝트, 오픈소스 UI 라이브러리, 기술 블로그를 확인하실 수 있습니다.',
  authors: [{ name: '허정연' }],
  keywords: [
    '프론트엔드', 'Frontend Developer', 'React', 'TypeScript',
    '포트폴리오', 'Portfolio', 'UI Library', 'Open Source', '허정연',
  ],
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    type: 'website',
    siteName: '허정연 포트폴리오',
    title: '허정연 - 프론트엔드 포트폴리오',
    description: '프론트엔드 개발자 허정연의 포트폴리오',
    locale: 'ko_KR',
    alternateLocale: ['en_US'],
    url: SITE_URL,
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '허정연 - 프론트엔드 포트폴리오',
    description: '프론트엔드 개발자 허정연의 포트폴리오.',
    images: ['/og-image.png'],
  },
  other: {
    'msapplication-TileColor': '#1d1d1f',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&display=swap"
          rel="stylesheet"
        />
        {/* 페인트 전에 저장된 테마를 배경색에 먼저 반영 — 다크 사용자의 흰 화면 깜빡임 방지.
            React 상태는 하이드레이션 직후 ThemeContext가 맞춘다. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=localStorage.getItem('portfolio_dark_mode')==='true';document.documentElement.dataset.theme=d?'dark':'light';document.documentElement.style.backgroundColor=d?'#000':'#fff';}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
