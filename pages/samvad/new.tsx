import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewSamvadForm } from '@/components/samvad/NewSamvadForm';
import { useApp } from '@/lib/context/AppContext';

export default function NewSamvadPage() {
  const { lang } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Propose Industry Event / Samvad | BJP Udyog Setu'
            : lang === 'hi'
            ? 'उद्योग संवाद एवं कार्यक्रम प्रस्ताव | भाजपा उद्योग सेतु'
            : 'उद्योग संवाद व परिषद प्रस्ताव नोंदणी | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1">
          <NewSamvadForm />
        </main>
        <Footer />
      </div>
    </>
  );
}