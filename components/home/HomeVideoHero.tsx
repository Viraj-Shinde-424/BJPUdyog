import React from 'react';
import { useApp } from '@/lib/context/AppContext';

export const HomeVideoHero: React.FC = () => {
  const { t } = useApp();

  return (
    <section className="relative w-full h-[calc(100vh-115px)] min-h-[450px] max-h-[780px] overflow-hidden bg-[#070D1E] flex flex-col justify-end items-center pb-12 sm:pb-16 px-4">
      {/* 1. TRUE LANDSCAPE 1920x1080 ROTATED H.264 VIDEO RUNNING SILENTLY ON AUTO */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/bjp-udyog-horizontal.mp4" type="video/mp4; codecs=avc1.640029, mp4a.40.2" />
        <source src="/videos/bjp-udyog-horizontal.mp4" type="video/mp4" />
        Your browser does not support HTML5 video playback.
      </video>

      {/* 2. GRADIENT OVERLAY (FOCUSED ON BOTTOM FOR PRISTINE LEGIBILITY) */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#070D1E]/95 via-[#070D1E]/45 to-black/20 z-10" />

      {/* 3. BOTTOM-ALIGNED TEXT WITH EXACT SIZED FONT & POSTRING STYLING AS SHOWN IN IMAGE */}
      <div className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        {/* HEADING: Vibrant Saffron / Orange font with exact bold Poppins scale */}
        <h1 className="text-[#FF7A1A] font-black font-['Poppins',sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-[34px] tracking-tight leading-snug text-center max-w-4xl drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
          {t('videoHero', 'heading')}
        </h1>

        {/* SUBTITLE: Crisp white text, centered two-line balanced presence */}
        <p className="mt-2.5 sm:mt-3 text-white/95 text-xs sm:text-sm md:text-base font-normal text-center max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
          {t('videoHero', 'subtitle')}
        </p>
      </div>
    </section>
  );
};
