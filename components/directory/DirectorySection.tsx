import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Business } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  CreditCard,
  Plus,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { RegisterBusinessModal } from './RegisterBusinessModal';
import { localizeBusiness, localizeSector } from '@/lib/i18n/dataLocalizer';

export const DirectorySection: React.FC = () => {
  const { lang, currentUser, t } = useApp();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBusinesses = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/directory?sector=${selectedSector}&district=${selectedDistrict}`);
      const data = await res.json();
      if (data.businesses) {
        setBusinesses(data.businesses);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [selectedSector, selectedDistrict]);

  const sectors = [
    'all',
    'Foundry & Metallurgy',
    'Auto & Engineering',
    'Plastics & Polymers',
    'Food Processing',
    'Electronics & IT',
  ];

  return (
    <div className="space-y-6">
      {/* Header & Primary Action (One primary action per screen) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            {lang === 'en'
              ? 'Maharashtra Business Directory'
              : lang === 'hi'
              ? 'महाराष्ट्र उद्योग डायरेक्टरी'
              : 'महाराष्ट्र उद्योग डिरेक्टरी'}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === 'en'
              ? 'Opt-in verified MSMEs, manufacturing units and office-bearer enterprises.'
              : lang === 'hi'
              ? 'पंजीकृत एवं सत्यापित एमएसएमई, विनिर्माण इकाइयां एवं पदाधिकारी उद्यम।'
              : 'नोंदणीकृत व सत्यापित एमएसएमई, उत्पादन युनिट्स आणि पदाधिकारी उद्योग.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          {lang === 'en'
            ? 'Register Business'
            : lang === 'hi'
            ? 'उद्योग पंजीकृत करें (Opt-in)'
            : 'उद्योग नोंदवा (Opt-in)'}
        </Button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-100/70 p-2.5 rounded-xl border border-slate-200 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 font-semibold px-2">
          <Filter className="w-3.5 h-3.5" />
          <span>
            {lang === 'en' ? 'Filter Sector:' : lang === 'hi' ? 'उद्योग क्षेत्र:' : 'उद्योग क्षेत्र:'}
          </span>
        </div>
        {sectors.map((sec) => (
          <button
            key={sec}
            onClick={() => setSelectedSector(sec)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              selectedSector === sec
                ? 'bg-[#E35914] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200'
            }`}
          >
            {localizeSector(sec, lang)}
          </button>
        ))}
      </div>

      {/* Business Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">
          {lang === 'en'
            ? 'Loading directory data...'
            : lang === 'hi'
            ? 'जानकारी लोड हो रही है...'
            : 'माहिती लोड होत आहे...'}
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          {lang === 'en'
            ? 'No businesses found.'
            : lang === 'hi'
            ? 'कोई उद्योग नहीं मिला।'
            : 'कोणताही उद्योग सापडला नाही.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {businesses.map((rawBiz: any) => {
            const biz = localizeBusiness(rawBiz, lang);
            return (
            <Card key={biz.id} className="p-5 flex flex-col justify-between hover:border-slate-300">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {biz.businessName}
                    </h3>
                    <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                      <span>{biz.ownerName}</span>
                      {/* Proposed small outlined पदाधिकारी label beside verified names in directory */}
                      {biz.isOfficeBearer && (
                        <OfficeBearerBadge
                          scope={biz.officeBearerScope}
                          showScope={true}
                        />
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200 flex-shrink-0">
                    {biz.sector}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                  {biz.description}
                </p>

                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#E35914] flex-shrink-0" />
                    <span className="truncate">{biz.address || biz.district}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span>{biz.phone}</span>
                  </div>
                  {biz.udyamNumber && (
                    <div className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-[#136938]" />
                      <span>{lang === 'en' ? 'Udyam' : 'उद्यम'}: {biz.udyamNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Digital Card Link */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/card/${biz.digitalCardSlug}`}
                  className="text-xs text-[#E35914] hover:text-[#C84B0E] font-semibold flex items-center gap-1"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>
                    {lang === 'en'
                      ? 'View Digital Card'
                      : lang === 'hi'
                      ? 'डिजिटल कार्ड देखें'
                      : 'डिजिटल कार्ड पहा'}
                  </span>
                </Link>
                {biz.website && (
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                  >
                    <span>{lang === 'en' ? 'Website' : 'वेबसाइट'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Card>
            );
          })}
        </div>
      )}

      {/* Register Business Modal */}
      <RegisterBusinessModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchBusinesses();
        }}
      />
    </div>
  );
};
