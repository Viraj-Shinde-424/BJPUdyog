import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useApp } from '@/lib/context/AppContext';
import { ExternalLink, ShieldAlert, PhoneCall, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { lang, t } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t-4 border-[#D95F1A] mt-16">
      {/* Statutory Disclosure Banner */}
      <div className="bg-slate-950 py-3 px-4 sm:px-6 lg:px-8 xl:px-10 border-b border-slate-800">
        <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto flex items-start sm:items-center gap-2.5 text-xs text-slate-400">
          <ShieldAlert className="w-4 h-4 text-[#F59E0B] flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-relaxed">
            <strong className="text-slate-300">
              {lang === 'en'
                ? 'Statutory Disclosure: '
                : lang === 'hi'
                ? 'वैधानिक प्रकटीकरण: '
                : 'वैधानिक प्रकटन: '}
            </strong>
            {t('brand', 'disclosure')}
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-10 xl:py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Organization & Contact */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/bjp-logo.png"
                  alt="BJP Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm leading-tight">
                  {t('brand', 'title')}
                </h3>
                <p className="text-[11px] text-orange-400 font-semibold">
                  {t('brand', 'party')}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-4 font-normal">
              {t('footer', 'aboutDesc')}
            </p>

            <div className="text-xs text-slate-400 space-y-1.5 bg-slate-800/60 p-3 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <PhoneCall className="w-3.5 h-3.5 text-[#D95F1A]" />
                <span>हेल्पलाइन: 1800-209-BJP (8378)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>contact@bjpudyogsetu.org</span>
              </div>
              <div className="flex items-start gap-2 text-slate-400 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                <span>कमल प्रभा, प्रदेश कार्यालय, नरिमन पॉईंट, मुंबई</span>
              </div>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              {t('footer', 'quickLinks')}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-white transition-colors text-orange-400 font-semibold">
                  {lang === 'en' ? 'Registration' : 'अधिकृत नोंदणी (Registration)'}
                </Link>
              </li>
              <li>
                <Link href="/b2b" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'B2B Business' : 'B2B उद्योग नेटवर्क'}
                </Link>
              </li>
              <li>
                <Link href="/samvad" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Udyog Sanvad & Events' : 'उद्योग संवाद व परिषद'}
                </Link>
              </li>
              <li>
                <Link href="/grievances" className="hover:text-white transition-colors">
                  {lang === 'en' ? 'Grievance Redressal' : 'तक्रार निवारण व पाठपुरावा'}
                </Link>
              </li>
              <li>
                <Link href="/resources/startup-saarthi" className="hover:text-white transition-colors">
                  उद्योग सारथी (AI Startup Advisor)
                </Link>
              </li>
              <li>
                <Link href="/resources/subsidy-mentor" className="hover:text-white transition-colors">
                  सब्सिडी मेंटॉर (Government Schemes)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Maharashtra Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              {lang === 'en' ? 'Official Portals' : 'शासकीय एक-खिडकी पोर्टल्स'}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://midc.maharashtra.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center justify-between text-slate-300"
                >
                  <span>MIDC Industrial Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://maitri.maharashtra.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center justify-between text-slate-300"
                >
                  <span>MAITRI Single Window</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://aaplesarkar.mahaonline.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center justify-between text-slate-300"
                >
                  <span>Aaple Sarkar Redressal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://udyamregistration.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center justify-between text-slate-300"
                >
                  <span>Udyam Registration Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.mpcb.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center justify-between text-slate-300"
                >
                  <span>MPCB Pollution Control</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Coordination & Verification Desk */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              प्रशासकीय समन्वय कक्ष
            </h4>
            <div className="space-y-2 text-xs">
              <Link
                href="/admin/coordinator"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 block transition-colors"
              >
                <div className="font-bold text-slate-200">समन्वयक कक्ष (Staff Queue)</div>
                <div className="text-[10px] text-slate-400 mt-0.5">पदाधिकारी सत्यापन व बैठक व्यवस्थापन</div>
              </Link>
              <Link
                href="/card/kulkarni-castings-pune"
                className="p-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 block transition-colors"
              >
                <div className="font-bold text-slate-200">डिजिटल व्हिजिटिंग कार्ड</div>
                <div className="text-[10px] text-slate-400 mt-0.5">उद्योजकांचे डिजिटल कार्ड प्रोफाईल</div>
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <div>{t('footer', 'copyright')}</div>
          <div className="mt-2 sm:mt-0 flex gap-4">
            <Link href="/" className="hover:text-slate-400">
              गोपनीयता धोरण
            </Link>
            <Link href="/" className="hover:text-slate-400">
              वापर अटी
            </Link>
            <Link href="/admin/coordinator" className="hover:text-slate-400">
              समन्वयक कक्ष
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
