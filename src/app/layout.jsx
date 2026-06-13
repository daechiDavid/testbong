/* eslint-disable react-refresh/only-export-components */
import '../index.css';
import { Providers } from './providers';

export const metadata = {
  title: '학급 대시보드 | 붕쌤',
  description: '초등교사용 학급 대시보드 - 출석, 학생관리, 학습, 일정, 학급도구를 한곳에서',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  userScalable: false,
  themeColor: '#FF6F0F',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/svg+xml"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏫</text></svg>"
        />
      </head>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
