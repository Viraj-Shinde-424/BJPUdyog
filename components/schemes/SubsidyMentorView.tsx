import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { SchemeMatch } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Award,
  Search,
  ExternalLink,
  Calendar,
  AlertTriangle,
  Building,
  HelpCircle,
  Sparkles,
  ServerOff,
  Filter,
} from 'lucide-react';

export const SubsidyMentorView: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const { lang, t } = useApp();
  const [query, setQuery] = useState(initialQuery || '');
  const [matches, setMatches] = useState<SchemeMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSourceUnavailable, setIsSourceUnavailable] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fallbackLinks, setFallbackLinks] = useState<{ label: string; url: string }[]>([]);
  const [filterLevel, setFilterLevel] = useState<'all' | 'State' | 'Central'>('all');

  const executeSearch = async (searchQuery: string, simulateUnavailable = false) => {
    setLoading(true);
    setIsSourceUnavailable(false);
    setErrorMessage('');

    try {
      const url = `/api/schemes?q=${encodeURIComponent(searchQuery)}${
        simulateUnavailable ? '&simulateUnavailable=true' : ''
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.isSourceUnavailable) {
        setIsSourceUnavailable(true);
        setErrorMessage(data.errorMessage);
        setMatches([]);
        setFallbackLinks(data.fallbackLinks || []);
      } else {
        setMatches(data.matches || []);
        setFallbackLinks(data.fallbackLinks || []);
      }
    } catch (err: any) {
      console.error(err);
      setIsSourceUnavailable(true);
      setErrorMessage('सर्व्हर संप्रेषण त्रुटी.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    executeSearch(query);
  }, []);

  const filteredMatches = matches.filter((m) => {
    if (filterLevel === 'all') return true;
    if (filterLevel === 'State') return m.level.includes('State');
    if (filterLevel === 'Central') return m.level.includes('Central');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Plain Language Search */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#136938] mb-3">
            <Award className="w-3.5 h-3.5 text-[#136938]" />
            <span>महाराष्ट्र व केंद्र शासन औद्योगिक योजना शोध</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {t('schemes', 'title')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('schemes', 'subtitle')}
          </p>
        </div>

        {/* Search bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeSearch(query);
          }}
          className="mt-4 flex flex-col sm:flex-row gap-2"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#136938] absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="उदा. सोलर सबसिडी, PSI 2019, CMEGP, क्लस्टर विकास अनुदान..."
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#136938] focus:outline-none bg-[#F8FAFC]"
            />
          </div>
          <Button
            type="submit"
            variant="secondary"
            size="md"
            disabled={loading}
            className="flex-shrink-0"
          >
            {loading ? 'शोधत आहे...' : 'योजना शोधा'}
          </Button>
        </form>

        {/* Quick Test Queries & Source Simulation Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400">चाचणी शोधा:</span>
            <button
              type="button"
              onClick={() => {
                const q = 'क्लस्टर विकास योजना MSICDS';
                setQuery(q);
                executeSearch(q);
              }}
              className="text-[11px] text-[#136938] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold"
            >
              बाह्य शोध: क्लस्टर विकास (MSICDS)
            </button>
            <button
              type="button"
              onClick={() => {
                const q = 'सोलर रूफटॉप MEDA';
                setQuery(q);
                executeSearch(q);
              }}
              className="text-[11px] text-[#136938] bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-200 font-semibold"
            >
              बाह्य शोध: सोलर सबसिडी
            </button>
            <button
              type="button"
              onClick={() => {
                const q = 'nonexistentxyz1234';
                setQuery(q);
                executeSearch(q);
              }}
              className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-0.5 rounded border border-slate-200 font-medium"
            >
              ० निकाल चाचणी (Zero Matches)
            </button>
          </div>

          {/* Simulate Source Unavailable (Testing distinct state) */}
          <button
            type="button"
            onClick={() => executeSearch(query, true)}
            className="text-[11px] text-rose-700 hover:text-rose-900 underline flex items-center gap-1 font-semibold"
          >
            <ServerOff className="w-3 h-3" />
            <span>स्रोत अनुपलब्ध स्थिती चाचणी (Simulate 503)</span>
          </button>
        </div>
      </div>

      {/* Filter by Jurisdiction */}
      {!isSourceUnavailable && matches.length > 0 && (
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">शासन स्तर:</span>
          {(['all', 'State', 'Central'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                filterLevel === lvl
                  ? 'bg-[#136938] text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {lvl === 'all'
                ? 'सर्व योजना'
                : lvl === 'State'
                ? 'महाराष्ट्र राज्य शासन'
                : 'केंद्र शासन'}
            </button>
          ))}
        </div>
      )}

      {/* CASE 1: Source Unavailable State (Explicitly Distinguished) */}
      {isSourceUnavailable && (
        <div className="bg-rose-50/80 border-2 border-rose-300 rounded-2xl p-6 text-xs text-rose-950 space-y-4">
          <div className="flex items-start gap-3">
            <ServerOff className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-base text-rose-900 mb-1">
                {t('schemes', 'sourceUnavailable')}
              </h3>
              <p className="leading-relaxed text-rose-800">
                {t('schemes', 'sourceUnavailableSub')}
              </p>
              <div className="mt-1 font-mono text-[11px] text-rose-600">
                एरर तपशील: {errorMessage}
              </div>
            </div>
          </div>

          {/* Fallback Direct Official Links */}
          <div className="pt-3 border-t border-rose-200">
            <h4 className="font-bold text-xs text-rose-900 mb-2">
              थेट अधिकृत सरकारी पोर्टल्स वापरा (Fallback Links):
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {fallbackLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-white border border-rose-200 hover:border-rose-400 text-slate-800 flex items-center justify-between font-semibold"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CASE 2: Zero Matches State (Explicitly Distinguished) */}
      {!isSourceUnavailable && !loading && filteredMatches.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {t('schemes', 'zeroMatches')}
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            {t('schemes', 'zeroMatchesSub')}
          </p>

          <div className="pt-4 max-w-lg mx-auto text-left">
            <div className="text-[11px] font-bold text-slate-600 mb-2">
              पर्यायी अधिकृत सरकारी योजना निर्देशिका:
            </div>
            <div className="space-y-1.5">
              {fallbackLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-between text-xs"
                >
                  <span>{link.label}</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CASE 3: Active Matches List */}
      {!isSourceUnavailable && !loading && filteredMatches.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredMatches.map((scheme) => (
            <Card
              key={scheme.id}
              className={`p-5 flex flex-col justify-between ${
                !scheme.isCurated ? 'border-2 border-emerald-300 bg-emerald-50/20' : ''
              }`}
            >
              <div>
                {/* Header Tag & Level */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        scheme.level.includes('State')
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {scheme.level}
                    </span>

                    {/* Discovered beyond portal curated list badge */}
                    {!scheme.isCurated && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#136938] bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        <span>बाह्य शोधित योजना (Dynamic Discovery)</span>
                      </span>
                    )}
                  </div>

                  {/* Verified Date */}
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 flex-shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {t('schemes', 'sourceChecked')}: {scheme.sourceCheckedAt}
                    </span>
                  </span>
                </div>

                {/* Scheme Title & Dept */}
                <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-1">
                  {lang === 'en'
                    ? scheme.nameEn
                    : lang === 'hi'
                    ? scheme.nameHi
                    : scheme.nameMr}
                </h3>
                <div className="text-xs text-slate-500 font-medium mb-3 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    {lang === 'en'
                      ? scheme.departmentEn
                      : lang === 'hi'
                      ? scheme.departmentHi
                      : scheme.departmentMr}
                  </span>
                </div>

                {/* Why it may fit the user's business */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs mb-3 space-y-1">
                  <div className="font-bold text-slate-900">
                    {t('schemes', 'whyFitLabel')}
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    {lang === 'en'
                      ? scheme.whyFitEn
                      : lang === 'hi'
                      ? scheme.whyFitHi
                      : scheme.whyFitMr}
                  </p>
                </div>

                {/* Subsidy Benefit Highlights */}
                <div className="text-xs text-emerald-900 bg-emerald-50/80 border border-emerald-200 p-2.5 rounded-lg font-medium mb-4">
                  <strong>अनुदान / लाभ: </strong>
                  <span>
                    {lang === 'en'
                      ? scheme.subsidyBenefitEn
                      : lang === 'hi'
                      ? scheme.subsidyBenefitHi
                      : scheme.subsidyBenefitMr}
                  </span>
                </div>
              </div>

              {/* Official Details & Application Link */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  स्रोत: {scheme.sourceAuthority}
                </span>
                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#136938] hover:text-[#0E522B] bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-300 transition-colors"
                >
                  <span>{t('schemes', 'applyOfficial')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
