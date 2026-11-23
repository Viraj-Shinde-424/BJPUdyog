import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import { useApp } from '@/lib/context/AppContext';
import { db } from '@/lib/db/store';
import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Building2,
  ArrowLeft,
} from 'lucide-react';

export default function DigitalCardPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { lang, t } = useApp();

  const [business, setBusiness] = React.useState<any | null>(null);

  React.useEffect(() => {
    if (slug) {
      fetch('/api/directory?all=true')
        .then((res) => res.json())
        .then((data) => {
          const match = data.businesses?.find((b: any) => b.digitalCardSlug === slug);
          if (match) {
            setBusiness(match);
          } else if (data.businesses && data.businesses.length > 0) {
            setBusiness(data.businesses[0]);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [slug]);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('डिजिटल कार्ड लिंक क्लिपबोर्डवर कॉपी झाली!');
    }
  };

  if (!business) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />
        <div className="flex-1 flex items-center justify-center p-8 text-xs text-slate-400">
          डिजिटल कार्ड लोड होत आहे...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{business.businessName} | Verified Digital Card | BJP Udyog Setu</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1 max-w-xl w-full mx-auto px-4 py-10">
          <div className="mb-4">
            <Link
              href="/network/directory"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>डिरेक्टरीकडे परत जा</span>
            </Link>
          </div>

          {/* Digital Card Canvas */}
          <div className="bg-white rounded-3xl border-2 border-slate-200/90 shadow-xl overflow-hidden">
            {/* Saffron & Green Accent Header Bar */}
            <div className="h-3 bg-gradient-to-r from-[#E35914] via-amber-400 to-[#136938]" />

            <div className="p-6 sm:p-8">
              {/* Card Top Brand */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden bg-white p-0.5 border border-slate-200 shadow-2xs">
                    <Image
                      src="/images/bjp-logo.png"
                      alt="BJP Udyog Logo"
                      width={30}
                      height={30}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-extrabold text-xs tracking-tight text-slate-900 block leading-tight">
                      भाजपा उद्योग सेतू
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium block">
                      सत्यापित डिजिटल व्यवसाय कार्ड
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl text-slate-600 hover:text-[#E35914] hover:bg-orange-50 border border-slate-200 transition-colors"
                  title="Share Card"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Owner and Business Info */}
              <div className="mt-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-2xl rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md border-4 border-white ring-2 ring-orange-100">
                  {business.ownerName ? business.ownerName[0] : 'U'}
                </div>

                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {business.ownerName}
                </h1>

                {/* Proposed small outlined पदाधिकारी label beside verified names in profile/card */}
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  {business.isOfficeBearer && (
                    <OfficeBearerBadge
                      scope={business.officeBearerScope}
                      showScope={true}
                    />
                  )}
                  <span className="text-xs text-slate-500 font-medium">
                    {business.sector}
                  </span>
                </div>

                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h2 className="font-extrabold text-sm text-slate-900 mb-0.5">
                    {business.businessName}
                  </h2>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {business.description}
                  </p>
                </div>
              </div>

              {/* Details & Coordinates */}
              <div className="mt-6 space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200">
                  <Phone className="w-4 h-4 text-[#136938] flex-shrink-0" />
                  <a href={`tel:${business.phone}`} className="font-semibold hover:text-[#136938]">
                    {business.phone}
                  </a>
                </div>

                {business.email && (
                  <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200">
                    <Mail className="w-4 h-4 text-[#E35914] flex-shrink-0" />
                    <a href={`mailto:${business.email}`} className="font-semibold hover:text-[#E35914] truncate">
                      {business.email}
                    </a>
                  </div>
                )}

                <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200">
                  <MapPin className="w-4 h-4 text-[#E35914] flex-shrink-0" />
                  <span className="truncate">{business.address || business.district}</span>
                </div>

                {business.udyamNumber && (
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[#136938] font-semibold text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>उद्यम नोंदणी क्रमांक:</span>
                    </div>
                    <span className="font-mono text-[11px]">{business.udyamNumber}</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-3">
                <a href={`tel:${business.phone}`} className="w-full">
                  <Button variant="secondary" size="md" className="w-full" icon={<Phone className="w-4 h-4" />}>
                    कॉल करा
                  </Button>
                </a>
                <button onClick={handleShare} className="w-full">
                  <Button variant="outlined" size="md" className="w-full" icon={<Share2 className="w-4 h-4" />}>
                    कार्ड शेअर करा
                  </Button>
                </button>
              </div>

              {/* Verified Platform Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400">
                भाजपा उद्योग आघाडी, महाराष्ट्र • अधिकृत डिजिटल डिरेक्टरी नोंद
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  return {
    props: {},
  };
}

