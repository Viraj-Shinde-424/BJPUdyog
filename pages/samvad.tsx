import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SamvadSection } from '@/components/samvad/SamvadSection';
import { useApp } from '@/lib/context/AppContext';

export default function SamvadRootPage() {
  const { lang } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Udyog Sanvad & Events | BJP Udyog Setu'
            : lang === 'hi'
            ? 'उद्योग संवाद एवं कार्यक्रम | भाजपा उद्योग सेतु'
            : 'उद्योग संवाद व परिषद मंच | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-[1440px] 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 xl:py-8">
          <SamvadSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
