import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { NewGrievanceForm } from '@/components/grievances/NewGrievanceForm';
import { useApp } from '@/lib/context/AppContext';

export default function NewRequestGrievancePage() {
  const { lang } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Register Grievance Follow-up | BJP Udyog Setu'
            : lang === 'hi'
            ? 'शिकायत निवारण एवं पाठपुरावा पंजीकरण | भाजपा उद्योग सेतु'
            : 'तक्रार निवारण व पाठपुरावा अर्ज | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <main className="flex-1">
          <NewGrievanceForm />
        </main>
        <Footer />
      </div>
    </>
  );
}