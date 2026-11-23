import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Compass,
  Award,
  ArrowRight,
  UserPlus,
  MessageSquare,
  AlertCircle,
  Building2,
  Users,
  ShieldCheck,
  ShoppingCart,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const HeroSearch: React.FC = () => {
  const router = useRouter();
  const { lang, t } = useApp();
  const [searchMode, setSearchMode] = useState<'guidance' | 'schemes'>('guidance');
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'guidance') {
      router.push(
        `/resources/startup-saarthi?q=${encodeURIComponent(
          query || 'पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?'
        )}`
      );
    } else {
      router.push(`/resources/subsidy-mentor?q=${encodeURIComponent(query || 'सोलर सबसिडी')}`);
    }
  };

  const handleQuickPrompt = (promptText: string, mode: 'guidance' | 'schemes') => {
    setSearchMode(mode);
    setQuery(promptText);
    if (mode === 'guidance') {
      router.push(`/resources/startup-saarthi?q=${encodeURIComponent(promptText)}`);
    } else {
      router.push(`/resources/subsidy-mentor?q=${encodeURIComponent(promptText)}`);
    }
  };

  const quickChips = [
    {
      label:
        lang === 'en'
          ? '⚡ Solar Rooftop Subsidy'
          : lang === 'hi'
          ? '⚡ सोलर रूफटॉप सब्सिडी'
          : '⚡ सोलर रूफटॉप सबसिडी',
      query: 'एमएसएमई सोलर रूफटॉप सबसिडी व सवलती',
      mode: 'schemes' as const,
    },
    {
      label:
        lang === 'en'
          ? '🏭 Pune Foundry Permits'
          : lang === 'hi'
          ? '🏭 पुणे फाउंड्री अनुमतियां'
          : '🏭 पुण्यात फाउंड्री परवाने',
      query: 'पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?',
      mode: 'guidance' as const,
    },
    {
      label:
        lang === 'en'
          ? '💰 CMEGP ₹50 Lakh Loan'
          : lang === 'hi'
          ? '💰 CMEGP ५० लाख ऋण'
          : '💰 CMEGP ५० लाख कर्ज',
      query: 'CMEGP उद्योग कर्ज व भांडवली अनुदान',
      mode: 'schemes' as const,
    },
    {
      label:
        lang === 'en'
          ? '🏢 Chakan MIDC Power Issue'
          : lang === 'hi'
          ? '🏢 चाकण एमआईडीसी बिजली शिकायत'
          : '🏢 चाकण एमआयडीसी वीज तक्रार',
      query: 'एमआयडीसी वीज पुरवठा व पायाभूत सुविधा',
      mode: 'guidance' as const,
    },
    {
      label:
        lang === 'en'
          ? '📋 Udyam MSME Registration'
          : lang === 'hi'
          ? '📋 उद्यम एमएसएमई पंजीकरण'
          : '📋 उद्यम एमएसएमई नोंदणी',
      query: 'उद्यम नोंदणी व एमएसएमई प्रमाणपत्र प्रक्रिया',
      mode: 'guidance' as const,
    },
  ];

  const quickActionCards = [
    {
      title:
        lang === 'en'
          ? 'Business Registration'
          : lang === 'hi'
          ? 'नया उद्योग पंजीकरण'
          : 'नवीन उद्योग नोंदणी',
      subtitle:
        lang === 'en'
          ? 'Directory & Office-Bearer Contact'
          : lang === 'hi'
          ? 'डायरेक्टरी एवं पदाधिकारी संपर्क'
          : 'डिरेक्टरी व अधिकृत संपर्क',
      desc:
        lang === 'en'
          ? 'Register your enterprise in the official state directory and connect with regional leadership.'
          : lang === 'hi'
          ? 'राज्य उद्योग डायरेक्टरी में अपना उद्यम पंजीकृत करें और क्षेत्रीय पदाधिकारियों से जुड़ें।'
          : 'राज्य उद्योग डिरेक्टरीमध्ये आपल्या उद्योगाची नोंदणी करा आणि विभागीय पदाधिकाऱ्यांशी थेट संपर्क साधा.',
      badge: lang === 'en' ? 'Official Portal' : 'अधिकृत नोंदणी',
      href: '/register',
      icon: UserPlus,
      color: 'border-orange-200 hover:border-[#D95F1A]',
      accentBg: 'bg-orange-50 text-[#D95F1A]',
      badgeBg: 'bg-orange-100 text-[#D95F1A]',
    },
    {
      title:
        lang === 'en'
          ? 'Grievance Redressal'
          : lang === 'hi'
          ? 'शिकायत निवारण एवं पाठपुरावा'
          : 'तक्रार निवारण व पाठपुरावा',
      subtitle:
        lang === 'en'
          ? 'MIDC, MSEDCL & MPCB Follow-up'
          : lang === 'hi'
          ? 'एमआईडीसी, बिजली व प्रदूषण समाधान'
          : 'एमआयडीसी, वीज व प्रदूषण निवारण',
      desc:
        lang === 'en'
          ? 'Track unanswered government portal grievances with private timeline tracking and escalation.'
          : lang === 'hi'
          ? 'सरकारी पोर्टल्स पर लंबित शिकायतों का सुरक्षित टाइमलाइन के साथ आधिकारिक पाठपुरावा करें।'
          : 'शासकीय पोर्टलवर प्रलंबित औद्योगिक तक्रारींचा सुरक्षित टाइमलाइन व अधिकृत पाठपुरावा मिळवा.',
      badge: lang === 'en' ? 'Direct Redressal' : 'थेट पाठपुरावा',
      href: '/grievances',
      icon: AlertCircle,
      color: 'border-amber-200 hover:border-amber-600',
      accentBg: 'bg-amber-50 text-amber-700',
      badgeBg: 'bg-amber-100 text-amber-800',
    },
    {
      title:
        lang === 'en'
          ? 'B2B Marketplace'
          : lang === 'hi'
          ? 'B2B उद्योग बाजारपेठ'
          : 'B2B उद्योग बाजारपेठ',
      subtitle:
        lang === 'en'
          ? 'Raw Materials, Machinery & Orders'
          : lang === 'hi'
          ? 'कच्चा माल, मशीनरी एवं व्यापार'
          : 'कच्चा माल, मशीनरी व थेट ऑर्डर्स',
      desc:
        lang === 'en'
          ? 'Post buyer requirements, discover verified industrial suppliers, and negotiate verified deals.'
          : lang === 'hi'
          ? 'कच्चे माल की मांग पोस्ट करें, स्थानीय आपूर्तिकर्ताओं से जुड़ें और सीधे ऑर्डर प्राप्त करें।'
          : 'कच्च्या मालाची मागणी पोस्ट करा, स्थानिक उत्पादक शोधा आणि थेट औद्योगिक ऑर्डर्स मिळवा.',
      badge: lang === 'en' ? 'Verified Trade' : 'स्थानिक व्यापार',
      href: '/b2b',
      icon: ShoppingCart,
      color: 'border-emerald-200 hover:border-[#136938]',
      accentBg: 'bg-emerald-50 text-[#136938]',
      badgeBg: 'bg-emerald-100 text-[#136938]',
    },
    {
      title:
        lang === 'en'
          ? 'Udyog Sanvad & Events'
          : lang === 'hi'
          ? 'उद्योग संवाद एवं सम्मेलन'
          : 'उद्योग संवाद व परिषद',
      subtitle:
        lang === 'en'
          ? 'Ministerial Meets & Sector Sessions'
          : lang === 'hi'
          ? 'मंत्री संवाद एवं क्षेत्रीय गोलमेज'
          : 'मंत्री भेट व क्षेत्रीय गोलमेज परिषद',
      desc:
        lang === 'en'
          ? 'Participate in industrial roundtables, policy consultations, and invite dignitaries to unit inaugurations.'
          : lang === 'hi'
          ? 'क्षेत्रीय औद्योगिक सम्मेलनों, उद्घाटन कार्यक्रमों और मंत्रियों से संवाद में भाग लें।'
          : 'औद्योगिक गोलमेज परिषदा, नवीन युनिट उद्घाटन आमंत्रण आणि मंत्री महोदयांशी थेट संवाद साधा.',
      badge: lang === 'en' ? 'Minister Dialogue' : 'मंत्री थेट संवाद',
      href: '/samvad',
      icon: MessageSquare,
      color: 'border-blue-200 hover:border-blue-600',
      accentBg: 'bg-blue-50 text-blue-700',
      badgeBg: 'bg-blue-100 text-blue-800',
    },
  ];

  const trustMetrics = [
    {
      value: '५,०००+',
      label:
        lang === 'en'
          ? 'Registered MSMEs'
          : lang === 'hi'
          ? 'पंजीकृत एमएसएमई उद्योग'
          : 'नोंदणीकृत एमएसएमई उद्योग',
      subtext: lang === 'en' ? 'Statewide Network' : 'सर्व विभागीय नेटवर्क',
      icon: Building2,
      color: 'text-[#D95F1A]',
      bg: 'bg-orange-50',
    },
    {
      value: '३६',
      label:
        lang === 'en'
          ? 'Maharashtra Districts'
          : lang === 'hi'
          ? 'महाराष्ट्र के सभी ३६ जिले'
          : 'महाराष्ट्र सर्व ३६ जिल्हे',
      subtext: lang === 'en' ? '100% Coverage' : '१००% थेट कव्हरेज',
      icon: Users,
      color: 'text-[#136938]',
      bg: 'bg-emerald-50',
    },
    {
      value: '३५+',
      label:
        lang === 'en'
          ? 'Government Schemes'
          : lang === 'hi'
          ? 'सुलभ शासकीय योजनाएं'
          : 'सुलभ शासकीय सबसिडी व योजना',
      subtext: lang === 'en' ? 'Subsidies & Grants' : 'भांडवली व व्याज सबसिडी',
      icon: Award,
      color: 'text-amber-700',
      bg: 'bg-amber-50',
    },
    {
      value: '३५०+',
      label:
        lang === 'en'
          ? 'Active Office-Bearers'
          : lang === 'hi'
          ? 'सक्रिय उद्योग पदाधिकारी'
          : 'सक्रिय उद्योग पदाधिकारी',
      subtext: lang === 'en' ? 'Direct Guidance' : 'थेट मार्गदर्शन व सहकार्य',
      icon: ShieldCheck,
      color: 'text-slate-800',
      bg: 'bg-slate-100',
    },
  ];

  return (
    <div id="search-section" className="bg-[#FAF7F2] border-b border-[#E8E2D5] py-10 sm:py-14 xl:py-16 scroll-mt-6">
      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Executive Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-8 xl:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80 text-[11px] font-bold text-[#D95F1A] mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? 'Official Industry Coordination Platform • BJP Udyog Setu'
                : lang === 'hi'
                ? 'महाराष्ट्र राज्य औद्योगिक सहायता एवं समन्वय मंच • भाजपा उद्योग सेतु'
                : 'महाराष्ट्र राज्य औद्योगिक सहाय्य व समन्वय मंच • भाजपा उद्योग सेतू'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-[30px] xl:text-[34px] font-bold text-slate-900 tracking-tight leading-snug">
            {lang === 'en' ? (
              <>
                What are you looking for in your{' '}
                <span className="text-[#D95F1A]">
                  Enterprise
                </span>
                ?
              </>
            ) : lang === 'hi' ? (
              <>
                आपके{' '}
                <span className="text-[#D95F1A]">
                  उद्योग के लिए
                </span>{' '}
                आप क्या खोज रहे हैं?
              </>
            ) : (
              <>
                तुमच्या{' '}
                <span className="text-[#D95F1A]">
                  उद्योगासाठी
                </span>{' '}
                काय शोधत आहात?
              </>
            )}
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm xl:text-base text-slate-600 leading-relaxed max-w-2xl xl:max-w-3xl mx-auto font-normal">
            {lang === 'en'
              ? 'Instant AI compliance guidance, 35+ Central & Maharashtra state government subsidies, and verified industrial networking.'
              : lang === 'hi'
              ? 'एआई अनुपालन मार्गदर्शन, केंद्र व महाराष्ट्र शासन की ३५+ सब्सिडी योजनाएं और सत्यापित औद्योगिक नेटवर्क।'
              : 'कृत्रिम बुद्धिमत्ता (AI) परवाने मार्गदर्शन, केंद्र व महाराष्ट्र शासनाच्या ३५+ सबसिडी योजना आणि अधिकृत औद्योगिक नेटवर्क.'}
          </p>
        </div>

        {/* Smart Search Mode Segmented Control */}
        <div className="flex justify-center mb-5 xl:mb-6">
          <div className="inline-flex flex-col sm:flex-row p-1 sm:p-1.5 rounded-xl bg-white border border-slate-200/90 shadow-xs gap-1 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setSearchMode('guidance')}
              className={`flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 xl:py-2.5 rounded-lg text-xs sm:text-sm xl:text-[14.5px] font-bold transition-all ${
                searchMode === 'guidance'
                  ? 'bg-[#D95F1A] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>
                {lang === 'en'
                  ? 'AI Startup & Regulatory Advisor'
                  : lang === 'hi'
                  ? 'उद्योग सारथी (अनुमतियां व परवाने)'
                  : 'उद्योग सारथी (परवाने व कागदपत्रे)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSearchMode('schemes')}
              className={`flex items-center justify-center gap-2 px-3.5 sm:px-5 py-2 xl:py-2.5 rounded-lg text-xs sm:text-sm xl:text-[14.5px] font-bold transition-all ${
                searchMode === 'schemes'
                  ? 'bg-[#136938] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Award className="w-4 h-4 xl:w-5 xl:h-5" />
              <span>
                {lang === 'en'
                  ? 'Govt Subsidies & Schemes'
                  : lang === 'hi'
                  ? 'सब्सिडी मेंटॉर (सरकारी योजनाएं)'
                  : 'सब्सिडी मेंटॉर (शासकीय योजना)'}
              </span>
            </button>
          </div>
        </div>

        {/* Flagship Omni-Search Console */}
        <form onSubmit={handleSearch} className="max-w-3xl xl:max-w-4xl mx-auto mb-4">
          <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center rounded-2xl bg-white border-2 border-slate-200 focus-within:border-[#D95F1A] shadow-md p-1.5 sm:p-2 xl:p-2.5 gap-2 sm:gap-0 transition-all">
            <div className="flex items-center flex-1 min-w-0">
              <div className="pl-2.5 sm:pl-3.5 pr-2 text-slate-400 flex items-center justify-center flex-shrink-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#D95F1A]" />
              </div>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  searchMode === 'guidance'
                    ? lang === 'en'
                      ? 'e.g., What documents are required to set up a foundry in Pune?'
                      : lang === 'hi'
                      ? 'उदा. पुणे में फाउंड्री शुरू करने के लिए कौन से दस्तावेज लगेंगे?'
                      : 'उदा. पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?'
                    : lang === 'en'
                      ? 'e.g., Solar rooftop subsidy, CMEGP loan, PSI 2019 capital incentives...'
                      : lang === 'hi'
                      ? 'उदा. सोलर रूफटॉप सब्सिडी, CMEGP उद्योग ऋण, PSI 2019 प्रोत्साहन...'
                      : 'उदा. सोलर रूफटॉप सबसिडी, CMEGP ५० लाख कर्ज, PSI 2019 व्याज सवलत...'
                }
                className="w-full py-2 sm:py-2.5 xl:py-3 px-2 text-xs sm:text-sm xl:text-base text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400 font-medium"
              />
            </div>

            <Button
              type="submit"
              size="md"
              variant={searchMode === 'guidance' ? 'primary' : 'secondary'}
              className="py-2.5 px-5 sm:px-6 xl:px-8 rounded-xl text-xs sm:text-sm xl:text-base font-bold shadow-xs whitespace-nowrap bg-[#D95F1A] hover:bg-[#B84A0E] flex items-center justify-center"
            >
              <span className="flex items-center gap-1.5">
                <span>{t('hero', 'searchBtn')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Button>
          </div>
        </form>

        {/* Curated Fast-Action Query Chips */}
        <div className="flex items-center justify-start sm:justify-center gap-2 max-w-3xl xl:max-w-4xl mx-auto mb-8 sm:mb-10 overflow-x-auto no-scrollbar py-1">
          <span className="text-[11px] xl:text-xs font-bold text-slate-500 mr-0.5 whitespace-nowrap flex-shrink-0">
            {lang === 'en' ? 'Quick Searches:' : lang === 'hi' ? 'त्वरित खोज:' : 'त्वरित शोध:'}
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickPrompt(chip.query, chip.mode)}
              className="px-3 py-1 rounded-full bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-[11px] xl:text-xs font-semibold text-slate-700 hover:text-[#D95F1A] transition-all shadow-2xs hover:shadow-xs whitespace-nowrap flex-shrink-0"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* 4 Flagship Gateway Pillars (Executive Card Architecture) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6 max-w-[1440px] 2xl:max-w-[1600px] mx-auto mb-10 xl:mb-14">
          {quickActionCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Link
                key={i}
                href={card.href}
                className={`bg-white rounded-2xl p-5 xl:p-6 border ${card.color} shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <div className={`w-10 h-10 xl:w-12 xl:h-12 rounded-xl ${card.accentBg} flex items-center justify-center transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5 xl:w-6 xl:h-6" />
                    </div>
                    <span className={`text-[10px] xl:text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-base xl:text-lg font-bold text-slate-900 group-hover:text-[#D95F1A] transition-colors leading-snug">
                    {card.title}
                  </h3>
                  <div className="text-[11px] xl:text-xs font-semibold text-slate-500 mt-0.5 mb-2">
                    {card.subtitle}
                  </div>
                  <p className="text-xs xl:text-sm text-slate-600 leading-relaxed font-normal">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs xl:text-sm font-bold text-[#D95F1A]">
                  <span>
                    {lang === 'en' ? 'Access Portal' : lang === 'hi' ? 'प्रवेश करें' : 'सविस्तर पहा'}
                  </span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Live State Impact & Verified Telemetry Ribbon */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 xl:p-6 shadow-xs max-w-[1440px] 2xl:max-w-[1600px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {trustMetrics.map((metric, i) => {
              const Icon = metric.icon;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center justify-center text-center px-3 ${i > 0 ? 'pt-3 sm:pt-0' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-7 h-7 rounded-lg ${metric.bg} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${metric.color}`} />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {metric.value}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 leading-tight">
                    {metric.label}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                    {metric.subtext}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};