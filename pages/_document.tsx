import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="mr">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Mukta:wght@300;400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="bg-[#F8FAFC] text-[#111827] antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
