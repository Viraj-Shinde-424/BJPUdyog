import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DirectorySection } from '@/components/directory/DirectorySection';
import { useApp } from '@/lib/context/AppContext';

export default function DirectoryPage() {
  const { lang, t } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Business Directory | BJP Udyog Setu'
            : 'उद्योग डिरेक्टरी | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DirectorySection />
        </main>
        <Footer />
      </div>
    </>
  );
}
