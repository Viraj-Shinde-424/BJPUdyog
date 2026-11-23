import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewPostForm } from '@/components/b2b/NewPostForm';
import { useApp } from '@/lib/context/AppContext';

export default function NewB2BPage() {
  const { lang } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Post Industrial Tender / Supply | BJP Udyog Setu'
            : lang === 'hi'
            ? 'नवीन B2B निविदा अथवा पुरवठा नोंदणी | भाजपा उद्योग सेतु'
            : 'नवीन B2B निविदा अथवा पुरवठा नोंदणी | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1">
          <NewPostForm />
        </main>
        <Footer />
      </div>
    </>
  );
}