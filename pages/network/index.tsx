import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DirectorySection } from '@/components/directory/DirectorySection';
import { B2BSection } from '@/components/b2b/B2BSection';
import { SamvadSection } from '@/components/samvad/SamvadSection';
import { useApp } from '@/lib/context/AppContext';
import { Building2, Layers, MessageSquare } from 'lucide-react';

export default function NetworkPage() {
  const router = useRouter();
  const { lang, t } = useApp();
  const initialTab = (router.query.tab as string) || 'directory';
  const [activeTab, setActiveTab] = useState<'directory' | 'b2b' | 'samvad'>('directory');

  React.useEffect(() => {
    if (router.query.tab === 'b2b' || router.query.tab === 'samvad' || router.query.tab === 'directory') {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Network & B2B | BJP Udyog Setu'
            : 'उद्योग नेटवर्क व B2B | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Sub Navigation Tabs (Pill-shaped active navigation) */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div className="inline-flex p-1 rounded-full bg-slate-200/80 border border-slate-300">
              <button
                onClick={() => setActiveTab('directory')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'directory'
                    ? 'bg-[#E35914] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>{t('nav', 'directory')}</span>
              </button>
              <button
                onClick={() => setActiveTab('b2b')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'b2b'
                    ? 'bg-[#E35914] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{t('nav', 'b2b')}</span>
              </button>
              <button
                onClick={() => setActiveTab('samvad')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTab === 'samvad'
                    ? 'bg-[#E35914] text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{t('nav', 'samvad')}</span>
              </button>
            </div>
          </div>

          {activeTab === 'directory' && <DirectorySection />}
          {activeTab === 'b2b' && <B2BSection />}
          {activeTab === 'samvad' && <SamvadSection />}
        </main>

        <Footer />
      </div>
    </>
  );
}
