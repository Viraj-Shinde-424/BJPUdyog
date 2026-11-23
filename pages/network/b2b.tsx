import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { B2BSection } from '@/components/b2b/B2BSection';
import { useApp } from '@/lib/context/AppContext';

export default function B2BPage() {
  const { lang, t } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Udyog B2B Network | BJP Udyog Setu'
            : 'उद्योग B2B नेटवर्क | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <B2BSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
