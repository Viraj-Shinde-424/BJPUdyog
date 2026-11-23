import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StartupSaarthiView } from '@/components/startup/StartupSaarthiView';
import { useApp } from '@/lib/context/AppContext';

export default function StartupSaarthiPage() {
  const router = useRouter();
  const { lang, t } = useApp();
  const initialQuery = (router.query.q as string) || '';

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Udyog Saarthi — AI Startup & Clearance Advisor'
            : 'उद्योग सारथी — AI स्टार्टअप व परवाना मार्गदर्शक'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StartupSaarthiView initialQuery={initialQuery} />
        </main>
        <Footer />
      </div>
    </>
  );
}
