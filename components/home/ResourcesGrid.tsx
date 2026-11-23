import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  Award,
  MessageSquare,
  ExternalLink,
  Building,
  ArrowRight,
  CheckCircle2,
  FileText,
  Sparkles,
} from 'lucide-react';

export const ResourcesGrid: React.FC = () => {
  const { lang, t } = useApp();

  return (
    <section className="py-12 sm:py-16 xl:py-20 bg-[#F8FAFC] border-b border-slate-200">
      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-10 xl:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80 text-[11px] font-bold text-[#D95F1A] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? 'Innovation & Resources Hub • BJP Udyog Setu'
                : lang === 'hi'
                ? 'उद्योग साधने एवं शासकीय दालन • भाजपा उद्योग सेतु'
                : 'उद्योग साधने व शासकीय दालन • भाजपा उद्योग सेतू'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {lang === 'en'
              ? 'Enterprise Innovation Hub & Services'
              : lang === 'hi'
              ? 'उद्योग साधने एवं शासकीय एक-खिड़की दालन'
              : 'उद्योग साधने व शासकीय एक-खिडकी दालन'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm xl:text-base text-slate-600 leading-relaxed font-normal max-w-2xl xl:max-w-3xl mx-auto">
            {lang === 'en'
              ? 'AI-powered compliance navigator, smart subsidy finder, direct ministerial roundtables, and official single-window gateways.'
              : lang === 'hi'
              ? 'एआई परवाने मार्गदर्शक, सब्सिडी नेविगेटर, मंत्री संवाद और आधिकारिक सरकारी एक-खिड़की पोर्टल्स।'
              : 'कृत्रिम बुद्धिमत्ता (AI) परवाने सल्लागार, सबसिडी नेव्हिगेटर, थेट मंत्री संवाद आणि शासकीय एक-खिडकी दालन.'}
          </p>
        </div>

        {/* 3 Core Flagship Innovation Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 mb-12 xl:mb-14">
          {/* 1. Udyog Saarthi (AI Startup Advisor) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-orange-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-orange-50 text-[#D95F1A] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-orange-100/90 text-[#D95F1A] border border-orange-200">
                  {lang === 'en' ? 'AI 24/7 Advisor' : lang === 'hi' ? '२४/७ एआई सलाहकार' : '२४/७ AI सल्लागार'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#D95F1A] transition-colors">
                {t('resources', 'saarthiTitle')}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                {t('resources', 'saarthiDesc')}
              </p>

              {/* Micro-Features */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ परवाने चेकलिस्ट
                </span>
                <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ MPCB प्रदूषण नियमावली
                </span>
                <span className="text-[10.5px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ Udyam व DISH परवानग्या
                </span>
              </div>
            </div>

            <Link href="/resources/startup-saarthi">
              <Button
                variant="primary"
                size="md"
                className="w-full font-bold shadow-none py-2.5 rounded-xl bg-[#D95F1A] hover:bg-[#B84A0E] flex items-center justify-center gap-1.5"
              >
                <span>{t('resources', 'saarthiAction')}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            </Link>
          </div>

          {/* 2. Subsidy Mentor (Scheme Discovery) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#136938] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-[#136938] border border-emerald-200">
                  {lang === 'en' ? '35+ Government Schemes' : lang === 'hi' ? '३५+ सरकारी योजनाएं' : '३५+ शासकीय योजना'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-[#136938] transition-colors">
                {t('resources', 'subsidyTitle')}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                {t('resources', 'subsidyDesc')}
              </p>

              {/* Micro-Features */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10.5px] bg-emerald-50 text-[#136938] px-2 py-0.5 rounded-md font-semibold">
                  ✓ २५% ते ३५% भांडवली सबसिडी
                </span>
                <span className="text-[10.5px] bg-emerald-50 text-[#136938] px-2 py-0.5 rounded-md font-semibold">
                  ✓ CMEGP ₹५० लाख कर्ज
                </span>
                <span className="text-[10.5px] bg-emerald-50 text-[#136938] px-2 py-0.5 rounded-md font-semibold">
                  ✓ PSI 2019 व्याज सवलत
                </span>
              </div>
            </div>

            <Link href="/resources/subsidy-mentor">
              <Button
                variant="secondary"
                size="md"
                className="w-full font-bold shadow-none py-2.5 rounded-xl bg-[#136938] hover:bg-[#0E522B] text-white flex items-center justify-center gap-1.5"
              >
                <span>{t('resources', 'subsidyAction')}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            </Link>
          </div>

          {/* 3. Samvad Platform (Ministerial Dialogue & Events) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center transition-transform group-hover:scale-105">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100/90 text-blue-800 border border-blue-200">
                  {lang === 'en' ? 'Direct Dialogue' : lang === 'hi' ? 'सीधा संवाद' : 'थेट संवाद'}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors">
                {t('resources', 'samvadTitle')}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                {t('resources', 'samvadDesc')}
              </p>

              {/* Micro-Features */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                <span className="text-[10.5px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ मंत्री व सचिव गोलमेज
                </span>
                <span className="text-[10.5px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ नवीन युनिट उद्घाटन आमंत्रण
                </span>
                <span className="text-[10.5px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-medium">
                  ✓ असोसिएशन शिष्टमंडळ
                </span>
              </div>
            </div>

            <Link href="/samvad">
              <Button
                variant="tertiary"
                size="md"
                className="w-full font-bold shadow-none py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5"
              >
                <span>{t('resources', 'samvadAction')}</span>
                <ArrowRight className="w-4 h-4 ml-0.5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Official Government Single-Window & Licensing Portals (Clean Full Width) */}
        <div className="w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#D95F1A]" />
                <span>
                  {lang === 'en'
                    ? 'Official Government Single-Window & Licensing Portals'
                    : lang === 'hi'
                    ? 'शासकीय सिंगल-विंडो एवं लाइसेंस अधिकृत पोर्टल्स'
                    : 'शासकीय एक-खिडकी व परवाने अधिकृत पोर्टल्स'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {lang === 'en'
                  ? 'Direct authenticated links to Maharashtra & Central Government statutory industrial portals'
                  : lang === 'hi'
                  ? 'महाराष्ट्र एवं केंद्र शासन के वैधानिक औद्योगिक पोर्टल्स के आधिकारिक दुवे'
                  : 'महाराष्ट्र व केंद्र शासनाच्या वैधानिक औद्योगिक पोर्टल्सचे अधिकृत व थेट दुवे'}
              </p>
            </div>
            <span className="self-start sm:self-auto text-[11px] text-[#136938] font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Verified Portals' : 'सत्यापित शासकीय दुवे'}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs mb-5">
            <a
              href="https://midc.maharashtra.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#D95F1A] flex items-center justify-between border border-slate-200 hover:border-orange-300 transition-all group shadow-2xs"
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  <span>MIDC Industrial Portal</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  औद्योगिक भूखंड वाटप व पायाभूत सुविधा
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D95F1A] transition-colors flex-shrink-0 ml-2" />
            </a>

            <a
              href="https://maitri.maharashtra.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#D95F1A] flex items-center justify-between border border-slate-200 hover:border-orange-300 transition-all group shadow-2xs"
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  <span>MAITRI Single Window</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  १६ शासकीय विभागांचे एकत्रित परवाने
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D95F1A] transition-colors flex-shrink-0 ml-2" />
            </a>

            <a
              href="https://aaplesarkar.mahaonline.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#D95F1A] flex items-center justify-between border border-slate-200 hover:border-orange-300 transition-all group shadow-2xs"
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  <span>Aaple Sarkar Redressal</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  शासकीय तक्रार निवारण व सेवा हक्क
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D95F1A] transition-colors flex-shrink-0 ml-2" />
            </a>

            <a
              href="https://udyamregistration.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#D95F1A] flex items-center justify-between border border-slate-200 hover:border-orange-300 transition-all group shadow-2xs"
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  <span>Udyam MSME Portal</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  केंद्रीय एमएसएमई प्रमाणपत्र नोंदणी
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D95F1A] transition-colors flex-shrink-0 ml-2" />
            </a>

            <a
              href="https://www.mahadiscom.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#D95F1A] flex items-center justify-between border border-slate-200 hover:border-orange-300 transition-all group shadow-2xs"
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  <span>MSEDCL Industrial Power</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  औद्योगिक उच्च दाब वीज जोडणी व दर
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D95F1A] transition-colors flex-shrink-0 ml-2" />
            </a>

            <a
              href="https://mpcb.gov.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3.5 rounded-xl bg-slate-50 hover:bg-orange-50 text-slate-800 hover:text-[#D95F1A] flex items-center justify-between border border-slate-200 hover:border-orange-300 transition-all group shadow-2xs"
            >
              <div>
                <div className="font-bold flex items-center gap-1.5 text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  <span>MPCB Pollution Control</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  पर्यावरण संमती पत्र व प्रदूषण नियंत्रण
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#D95F1A] transition-colors flex-shrink-0 ml-2" />
            </a>
          </div>

          {/* DPR & Forms Download Center Banner */}
          <Link
            href="/resources"
            className="p-4 rounded-xl bg-orange-50/90 hover:bg-orange-100 text-[#D95F1A] flex items-center justify-between border border-orange-200 font-bold transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4 text-[#D95F1A]" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                  DPR & शासकीय अर्ज नमुने डाऊनलोड केंद्र
                </div>
                <div className="text-[11px] text-slate-500 font-normal">
                  प्रकल्प अहवाल (DPR), सबसिडी प्रपत्रे, परवाने चेकलिस्ट आणि औद्योगिक मार्गदर्शक नमुने
                </div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform flex-shrink-0 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};