import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useApp } from '@/lib/context/AppContext';
import {
  Compass,
  Award,
  FileText,
  Building,
  ExternalLink,
  Download,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export default function ResourcesPage() {
  const { lang, t } = useApp();

  const dprTemplates = [
    {
      title: 'Detailed Project Report (DPR) Template - Foundry & Engineering',
      desc: 'MSME कर्ज, सबसिडी आणि बँक मूल्यांकनासाठी अधिकृत DPR फॉरमॅट व आर्थिक अंदाज पत्रक.',
      size: '1.4 MB DOCX',
      link: '#',
    },
    {
      title: 'MIDC Land Allotment Application Form & Annexures',
      desc: 'एमआयडीसी औद्योगिक भूखंड मागणी अर्ज व आवश्यक कागदपत्र चेकलिस्ट.',
      size: '820 KB PDF',
      link: 'https://midc.maharashtra.gov.in/land-bank',
    },
    {
      title: 'Consent to Establish (CTE) Environmental Dossier Checklist',
      desc: 'MPCB लाल व नारिंगी श्रेणी उद्योगांसाठी प्रदूषण नियंत्रण हमीपत्र व चिमणी डिझाइन फॉरमॅट.',
      size: '650 KB PDF',
      link: 'https://www.mpcb.gov.in/',
    },
    {
      title: 'Package Scheme of Incentives (PSI 2019) Claim Form',
      desc: 'उद्योग संचालनालय महाराष्ट्र - व्हॅट / जीएसटी परतावा व भांडवली सबसिडी मागणी फॉर्म.',
      size: '1.1 MB PDF',
      link: 'https://di.maharashtra.gov.in/',
    },
  ];

  const officialPortals = [
    {
      name: 'MIDC (महाराष्ट्र औद्योगिक विकास महामंडळ)',
      desc: 'औद्योगिक भूखंड, पायाभूत सुविधा, पाणी व वीज पुरवठा परवाने.',
      url: 'https://midc.maharashtra.gov.in/',
    },
    {
      name: 'MAITRI (महाराष्ट्र उद्योग व्यापार गुंतवणूक सुविधा केंद्र)',
      desc: '१६ शासकीय विभागांच्या परवान्यांसाठी एकच खिडकी (Single Window Clearance).',
      url: 'https://maitri.maharashtra.gov.in/',
    },
    {
      name: 'आपले सरकार (Aaple Sarkar Portal)',
      desc: 'महाराष्ट्र शासनाचे ऑनलाइन सेवा हमी (RTS) आणि तक्रार निवारण पोर्टल.',
      url: 'https://aaplesarkar.mahaonline.gov.in/',
    },
    {
      name: 'उद्यम नोंदणी (Ministry of MSME)',
      desc: 'केंद्र शासनाचे मोफत आधार व पॅन आधारित MSME नोंदणी पोर्टल.',
      url: 'https://udyamregistration.gov.in/',
    },
    {
      name: 'MPCB (महाराष्ट्र प्रदूषण नियंत्रण मंडळ)',
      desc: 'जल व वायू प्रदूषण संमती, बायोमेडिकल व ई-कचरा परवाने.',
      url: 'https://www.mpcb.gov.in/',
    },
    {
      name: 'महावितरण औद्योगिक वीज ग्राहक सेवा',
      desc: 'नवीन HT/LT औद्योगिक वीज जोडणी, वीज भार मंजुरी व बिलिंग सेवा.',
      url: 'https://www.mahadiscom.in/',
    },
  ];

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Resources, DPR & Forms | BJP Udyog Setu'
            : 'शासकीय साधने, DPR व प्रपत्रे | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Main Top Banner */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
                {lang === 'en' ? 'Official Resources & DPR Repository' : 'शासकीय साधने, DPR व अधिकृत प्रपत्रे'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                उद्योग उभारणी, बँक कर्ज व सरकारी परवान्यांसाठी लागणारी प्रमाणित प्रपत्रे आणि अधिकृत पोर्टल्स.
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/resources/startup-saarthi">
                <Button variant="primary" size="sm" icon={<Compass className="w-3.5 h-3.5" />}>
                  उद्योग सारथी AI
                </Button>
              </Link>
              <Link href="/resources/subsidy-mentor">
                <Button variant="secondary" size="sm" icon={<Award className="w-3.5 h-3.5" />}>
                  सब्सिडी मेंटॉर
                </Button>
              </Link>
            </div>
          </div>

          {/* DPR & Forms Section */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E35914]" />
              <span>DPR व प्रमाणित प्रपत्रे (DPR & Statutory Forms)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dprTemplates.map((dpr, idx) => (
                <Card key={idx} className="p-4 flex flex-col justify-between hover:border-slate-300">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {dpr.title}
                      </h3>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 flex-shrink-0">
                        {dpr.size}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {dpr.desc}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#136938]" />
                      <span>प्रमाणित फॉरमॅट</span>
                    </span>
                    <a
                      href={dpr.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-[#E35914] hover:text-[#C84B0E] flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>डाऊनलोड / उघडा</span>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Official Government Portals Links */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Building className="w-4 h-4 text-[#136938]" />
              <span>अधिकृत शासकीय पोर्टल्स (MIDC, MAITRI, Aaple Sarkar)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {officialPortals.map((portal, idx) => (
                <Card key={idx} className="p-4 flex flex-col justify-between hover:border-slate-300">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight mb-1">
                      {portal.name}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {portal.desc}
                    </p>
                  </div>
                  <a
                    href={portal.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#136938] hover:text-[#0E522B]"
                  >
                    <span>पोर्टल उघडा</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
