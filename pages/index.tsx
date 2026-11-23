import React from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HomeVideoHero } from '@/components/home/HomeVideoHero';
import { HeroSearch } from '@/components/home/HeroSearch';
import { LeadershipSection } from '@/components/home/LeadershipSection';
import { ResourcesGrid } from '@/components/home/ResourcesGrid';
import { useApp } from '@/lib/context/AppContext';

export default function HomePage() {
  const { lang, t } = useApp();

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'BJP Udyog Setu | Maharashtra Industry Coordination & Guidance'
            : 'भाजपा उद्योग सेतू | महाराष्ट्र उद्योग माहिती व मार्गदर्शन मंच'}
        </title>
        <meta
          name="description"
          content="BJP Udyog Setu - महाराष्ट्रातील एमएसएमई, उद्योग मार्गदर्शन, सरकारी योजना, परवाने आणि थेट उद्योग नेटवर्क."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1">
          {/* 1. Official Video Showcase (Directly below navbar, H.264 Universal Compatible, Fully visible above the fold) */}
          <HomeVideoHero />

          {/* 2. Hero with search and guidance tools */}
          <HeroSearch />

          {/* 2. Leadership Section (Modi, Fadnavis, Chavan - portraits, verified designations, preselected meeting modal) */}
          <LeadershipSection />

          {/* 3. Resources Grid (Udyog Saarthi, Subsidy Mentor, Samvad, DPR & Forms, MIDC, MAITRI, Aaple Sarkar, Digital Card) */}
          <ResourcesGrid />
        </main>

        {/* 4. Compact Footer with essential links and independent guidance platform disclosure */}
        <Footer />
      </div>
    </>
  );
}
