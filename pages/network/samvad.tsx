import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SamvadSection } from '@/components/samvad/SamvadSection';
import { useApp } from '@/lib/context/AppContext';

export default function SamvadPage() {
  const { lang, t } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Industry Samvad | BJP Udyog Setu'
            : 'उद्योग संवाद व परिषद | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <SamvadSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
