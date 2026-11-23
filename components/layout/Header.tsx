import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useApp } from '@/lib/context/AppContext';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import {
  Menu,
  X,
  ChevronDown,
  User,
  Lock,
  LogOut,
  FileText,
  CreditCard,
  Shield,
  SlidersHorizontal,
  UserPlus,
  ShoppingCart,
  MessageSquare,
  AlertCircle,
  Building2,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const router = useRouter();
  const {
    lang,
    setLang,
    currentUser,
    setLoginModalOpen,
    setActiveLoginTab,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    const current = router?.pathname || router?.asPath || '';
    if (!current) return false;
    if (path === '/' && (current === '/' || current === '')) return true;
    if (path !== '/' && current === path) return true;
    if (path === '/register' && current.startsWith('/register')) return true;
    if (path === '/b2b' && (current.startsWith('/b2b') || current.startsWith('/network/b2b'))) return true;
    if (path === '/samvad' && (current.startsWith('/samvad') || current.startsWith('/network/samvad'))) return true;
    if (path === '/grievances' && (current.startsWith('/grievances') || current.startsWith('/requests/grievances'))) return true;
    return false;
  };

  // The EXACT 4 Main Navigation Options requested by user
  const mainNavLinks = [
    {
      href: '/register',
      label:
        lang === 'en'
          ? 'Registration'
          : lang === 'hi'
          ? 'पंजीकरण (Registration)'
          : 'नोंदणी (Registration)',
      icon: UserPlus,
    },
    {
      href: '/b2b',
      label:
        lang === 'en'
          ? 'B2B Business'
          : lang === 'hi'
          ? 'B2B उद्योग'
          : 'B2B उद्योग',
      icon: Building2,
    },
    {
      href: '/samvad',
      label:
        lang === 'en'
          ? 'Udyog Samvad'
          : lang === 'hi'
          ? 'उद्योग संवाद'
          : 'उद्योग संवाद',
      icon: MessageSquare,
    },
    {
      href: '/grievances',
      label:
        lang === 'en'
          ? 'Grievance'
          : lang === 'hi'
          ? 'तक्रार निवारण'
          : 'तक्रार निवारण',
      icon: AlertCircle,
    },
  ];

  // The 3 leaders accurately designated
  const leaders = [
    {
      key: 'narendra-modi',
      name:
        lang === 'en'
          ? 'Shri. Narendra Modi'
          : lang === 'hi'
          ? 'श्री. नरेंद्र मोदी'
          : 'मा. नरेंद्र मोदी',
      role:
        lang === 'en'
          ? 'Hon. Prime Minister'
          : lang === 'hi'
          ? 'मा. पंतप्रधान, भारत सरकार'
          : 'मा. पंतप्रधान, भारत सरकार',
      image: '/images/leadership/narendra-modi.jpg',
    },
    {
      key: 'devendra-fadnavis',
      name:
        lang === 'en'
          ? 'Shri. Devendra Fadnavis'
          : lang === 'hi'
          ? 'श्री. देवेंद्र फडणवीस'
          : 'मा. देवेंद्र फडणवीस',
      role:
        lang === 'en'
          ? 'Hon. Chief Minister, MH'
          : lang === 'hi'
          ? 'मा. मुख्यमंत्री, महाराष्ट्र राज्य'
          : 'मा. मुख्यमंत्री, महाराष्ट्र राज्य',
      image: '/images/leadership/devendra-fadnavis.jpg',
    },
    {
      key: 'ravindra-chavan',
      name:
        lang === 'en'
          ? 'Shri. Ravindra Chavan'
          : lang === 'hi'
          ? 'श्री. रवींद्र चव्हाण'
          : 'मा. रवींद्र चव्हाण',
      role:
        lang === 'en'
          ? 'Hon. Minister, Aghadi'
          : lang === 'hi'
          ? 'मा. मंत्री / आघाडी नेतृत्व'
          : 'मा. मंत्री / आघाडी नेतृत्व',
      image: '/images/leadership/ravindra-chavan.jpg',
    },
  ];

  const handleOpenLogin = (tab: 'entrepreneur' | 'officer') => {
    setActiveLoginTab(tab);
    setLoginModalOpen(true);
    setAuthDropdownOpen(false);
  };

  const LanguageSwitcher: React.FC<{ className?: string }> = ({ className = '' }) => (
    <div className={`flex items-center bg-white/95 p-0.5 sm:p-1 rounded-full border border-slate-300 text-[11px] sm:text-xs font-bold shadow-2xs ${className}`}>
      <button
        type="button"
        onClick={() => setLang('mr')}
        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all duration-150 ${
          lang === 'mr'
            ? 'bg-[#D95F1A] text-white shadow-2xs font-extrabold'
            : 'text-slate-700 hover:text-[#D95F1A]'
        }`}
        title="मराठी भाषा निवडा"
      >
        मराठी
      </button>
      <button
        type="button"
        onClick={() => setLang('hi')}
        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all duration-150 ${
          lang === 'hi'
            ? 'bg-[#D95F1A] text-white shadow-2xs font-extrabold'
            : 'text-slate-700 hover:text-[#D95F1A]'
        }`}
        title="हिंदी भाषा चुनें"
      >
        हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all duration-150 ${
          lang === 'en'
            ? 'bg-[#D95F1A] text-white shadow-2xs font-extrabold'
            : 'text-slate-700 hover:text-[#D95F1A]'
        }`}
        title="Select English Language"
      >
        English
      </button>
    </div>
  );

  return (
    <header className="w-full bg-white relative z-40">
      {/* 1. TOP HAIRLINE TRICOLOR ACCENT */}
      <div className="h-[3px] bg-gradient-to-r from-[#D95F1A] via-amber-400 to-[#136938] w-full" />

      {/* 2. OFFICIAL EXECUTIVE MASTHEAD & DIGNITARIES BAR */}
      <div className="bg-[#FAF7F2] border-b border-[#EDE6D8] px-3 sm:px-6 lg:px-8 py-2 sm:py-3 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-2.5 sm:gap-3 lg:gap-6">
          
          {/* TOP ON MOBILE / LEFT ON DESKTOP: Government Seal & Mobile Language Switcher */}
          <div className="w-full lg:w-auto flex items-center justify-between gap-2 text-xs sm:text-[13px] text-slate-800">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-2.5 w-2.5 relative flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
              </span>
              <span className="font-extrabold text-slate-900 tracking-tight text-[11px] sm:text-xs md:text-[13px] truncate">
                {lang === 'en'
                  ? 'Government of Maharashtra • BJP Udyog Aghadi Official Portal'
                  : lang === 'hi'
                  ? 'महाराष्ट्र शासन • भाजपा उद्योग अघाड़ी आधिकारिक मंच'
                  : 'महाराष्ट्र शासन • भाजप उद्योग आघाडी अधिकृत मंच'}
              </span>
              <span className="hidden xl:inline-block text-[11px] bg-emerald-100/90 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold shadow-2xs whitespace-nowrap">
                ● {lang === 'en' ? 'Verified State Portal' : 'अधिकृत डिजिटल सेतू'}
              </span>
            </div>

            {/* Mobile Language Switcher */}
            <div className="lg:hidden flex-shrink-0">
              <LanguageSwitcher />
            </div>
          </div>

          {/* DIGNITARIES STRIP & DESKTOP LANGUAGE SELECTOR */}
          <div className="w-full lg:w-auto flex items-center justify-between lg:justify-end gap-3 sm:gap-6">
            {/* The 3 Distinguished Leaders */}
            <div className="w-full lg:w-auto flex items-center justify-between sm:justify-center lg:justify-end gap-2.5 sm:gap-5 lg:gap-6 overflow-x-auto no-scrollbar py-0.5">
              {leaders.map((leader) => (
                <div
                  key={leader.key}
                  className="flex items-center gap-2 sm:gap-3 group cursor-default flex-shrink-0"
                >
                  {/* Noticeably Enlarged & Crisp Portrait */}
                  <div className="relative w-10 h-10 sm:w-12 sm:h-12 lg:w-13 lg:h-13 rounded-full overflow-hidden ring-2 ring-orange-400/80 shadow-md bg-orange-100 border-2 border-white flex-shrink-0 group-hover:scale-105 group-hover:ring-orange-500 transition-all duration-200">
                    <Image
                      src={leader.image}
                      alt={leader.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 640px) 44px, 56px"
                      priority
                    />
                  </div>
                  {/* Prominent & Legible Typography */}
                  <div className="flex flex-col text-left">
                    <span className="font-black text-[11px] sm:text-xs lg:text-[13.5px] text-slate-900 leading-tight group-hover:text-[#D95F1A] transition-colors whitespace-nowrap">
                      {leader.name}
                    </span>
                    <span className="text-[9px] sm:text-[10px] lg:text-[11.5px] font-bold text-[#D95F1A] leading-tight mt-0.5 whitespace-nowrap">
                      {leader.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Language Switcher */}
            <div className="hidden lg:flex items-center gap-3">
              <div className="h-8 w-px bg-slate-300" />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* 3. MAIN EXECUTIVE GLASSMORPHIC STICKY NAVBAR */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-[68px]">
            
            {/* LEFT: Official Logo & Portal Identity */}
            <Link
              href="/"
              className="flex items-center gap-2 sm:gap-3 group flex-shrink-0 transition-transform duration-200 hover:opacity-95 max-w-[65%] sm:max-w-none"
            >
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 flex-shrink-0 flex items-center justify-center p-0.5 bg-orange-50/50 rounded-xl border border-orange-100 group-hover:border-orange-300 transition-colors">
                <Image
                  src="/images/bjp-logo.png"
                  alt="BJP Lotus Emblem"
                  width={42}
                  height={42}
                  priority
                  className="object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <span className="text-base sm:text-xl lg:text-[22px] font-black text-slate-900 tracking-tight leading-none group-hover:text-[#D95F1A] transition-colors truncate">
                    {lang === 'en' ? 'BJP Udyog Setu' : lang === 'hi' ? 'भाजपा उद्योग सेतु' : 'भाजपा उद्योग सेतू'}
                  </span>
                  <span className="text-[9px] sm:text-[10px] bg-gradient-to-r from-amber-50 to-orange-50 text-[#D95F1A] border border-orange-200/80 font-bold px-1.5 sm:px-2 py-0.5 rounded-full shadow-2xs whitespace-nowrap">
                    {lang === 'en' ? 'Maharashtra' : 'महाराष्ट्र'}
                  </span>
                </div>
                <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-semibold text-slate-500 leading-tight mt-0.5 hidden md:block truncate">
                  {lang === 'en'
                    ? 'Maharashtra Industry Information, Coordination & Guidance Platform'
                    : lang === 'hi'
                    ? 'महाराष्ट्र उद्योग सूचना, समन्वय एवं मार्गदर्शन मंच'
                    : 'महाराष्ट्र उद्योग माहिती, समन्वय व मार्गदर्शन मंच'}
                </span>
              </div>
            </Link>

            {/* CENTER: BESPOKE FLOATING SEGMENTED CAPSULE DOCK */}
            <nav className="hidden lg:flex items-center justify-center bg-slate-100/90 p-1.5 rounded-full border border-slate-200/90 shadow-2xs gap-1 backdrop-blur-sm">
              {mainNavLinks.map((link) => {
                const active = isActive(link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 lg:px-4 py-1.5 rounded-full font-bold text-xs lg:text-[13px] flex items-center gap-1.5 transition-all duration-200 nav-pill-hover ${
                      active
                        ? 'bg-gradient-to-r from-[#D95F1A] to-[#B84A0E] text-white shadow-xs'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-white/90'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-white' : 'text-[#D95F1A]'}`} />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* RIGHT: EXECUTIVE AUTHENTICATION & PROFILE BUTTON */}
            <div className="relative flex items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                onClick={() => setAuthDropdownOpen(!authDropdownOpen)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold transition-all duration-150 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm tracking-wide btn-press ${
                  currentUser
                    ? 'bg-orange-50/90 hover:bg-orange-100/80 text-[#D95F1A] border border-orange-200 shadow-2xs'
                    : 'bg-gradient-to-r from-[#D95F1A] via-orange-600 to-[#B84A0E] hover:from-[#B84A0E] hover:to-[#963806] text-white shadow-xs hover:shadow-md border border-orange-400/30'
                }`}
                aria-label="Account Login or Registration menu"
              >
                <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-xs ${currentUser ? 'bg-orange-200/80 text-[#D95F1A]' : 'bg-white/20 text-white'}`}>
                  <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span className="truncate max-w-[85px] sm:max-w-none">
                  {currentUser
                    ? currentUser.fullName.split(' ')[0]
                    : lang === 'en'
                    ? 'Login'
                    : 'लॉगिन'}
                </span>
                <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-80" />
              </button>

              {/* ACCOUNT DROPDOWN MENU */}
              {authDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white text-slate-800 rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-slideDown">
                  {currentUser ? (
                    /* Authenticated Menu */
                    <div>
                      <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/80">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{currentUser.fullName}</span>
                          {currentUser.isOfficeBearer && <OfficeBearerBadge />}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">{currentUser.email}</div>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/requests"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="px-4 py-2 hover:bg-orange-50/50 flex items-center gap-2 text-slate-700 font-semibold transition-colors"
                        >
                          <FileText className="w-4 h-4 text-[#D95F1A]" />
                          <span>माझे अर्ज व तक्रारी (My Requests)</span>
                        </Link>

                        <Link
                          href="/card/kulkarni-castings-pune"
                          onClick={() => setAuthDropdownOpen(false)}
                          className="px-4 py-2 hover:bg-emerald-50/50 flex items-center gap-2 text-slate-700 font-semibold transition-colors"
                        >
                          <CreditCard className="w-4 h-4 text-[#136938]" />
                          <span>माझे डिजिटल व्हिजिटिंग कार्ड</span>
                        </Link>

                        {['admin', 'coordinator', 'office_bearer', 'state_office_bearer'].includes(
                          currentUser.role
                        ) && (
                          <Link
                            href="/admin/coordinator"
                            onClick={() => setAuthDropdownOpen(false)}
                            className="px-4 py-2 hover:bg-orange-50 flex items-center gap-2 text-[#D95F1A] font-bold transition-colors"
                          >
                            <Shield className="w-4 h-4" />
                            <span>समन्वयक कक्ष (Staff Management)</span>
                          </Link>
                        )}

                        <div className="border-t border-slate-100 my-1 pt-1">
                          <button
                            onClick={() => {
                              setAuthDropdownOpen(false);
                              setLoginModalOpen(true);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-600 text-xs transition-colors"
                          >
                            <div className="flex items-center gap-2">
                              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                              <span>भूमिका बदला (Switch User)</span>
                            </div>
                            <span className="text-[10px] text-[#D95F1A] font-bold bg-orange-50 px-1.5 py-0.5 rounded">डेमो</span>
                          </button>
                        </div>

                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={async () => {
                              await logout();
                              setAuthDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-bold transition-colors"
                          >
                            <LogOut className="w-4 h-4 text-rose-500" />
                            <span>बाहेर पडा (Sign Out)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Guest / Unauthenticated Menu */
                    <div>
                      <div className="px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {lang === 'en' ? 'Official Platform Access' : 'अधिकृत खाते प्रवेश'}
                      </div>

                      <button
                        onClick={() => handleOpenLogin('entrepreneur')}
                        className="w-full text-left px-4 py-2.5 hover:bg-orange-50/70 flex items-center gap-2.5 text-slate-800 font-bold transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#D95F1A] flex items-center justify-center flex-shrink-0">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>{lang === 'en' ? 'Sign In / Login' : 'प्रवेश करा (Login)'}</div>
                          <div className="text-[10px] font-normal text-slate-500">
                            {lang === 'en' ? 'For registered MSMEs & members' : 'नोंदणीकृत उद्योग व सभासदांसाठी'}
                          </div>
                        </div>
                      </button>

                      <Link
                        href="/register"
                        onClick={() => setAuthDropdownOpen(false)}
                        className="w-full text-left px-4 py-2.5 hover:bg-emerald-50/70 flex items-center gap-2.5 text-slate-800 font-bold border-t border-slate-100 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-[#136938] flex items-center justify-center flex-shrink-0">
                          <UserPlus className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div>{lang === 'en' ? 'New Registration' : 'नवीन नोंदणी (Register)'}</div>
                          <div className="text-[10px] font-normal text-slate-500">
                            {lang === 'en' ? 'Join Maharashtra MSME Network' : 'महाराष्ट्र उद्योग नेटवर्कशी जोडा'}
                          </div>
                        </div>
                      </Link>

                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button
                          onClick={() => handleOpenLogin('officer')}
                          className="w-full text-left px-4 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-600 text-xs font-semibold transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#D95F1A]" />
                          <span>{lang === 'en' ? 'Office-Bearer & Staff Portal' : 'पदाधिकारी व समन्वयक कक्ष'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors ml-0.5"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 text-[#D95F1A]" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 4. MOBILE NAVIGATION DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 pt-3 pb-5 shadow-lg animate-slideDown">
          <div className="flex flex-col gap-1.5 text-sm font-semibold">
            {mainNavLinks.map((link) => {
              const active = isActive(link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl flex items-center gap-2.5 transition-all ${
                    active
                      ? 'bg-gradient-to-r from-[#D95F1A] to-[#B84A0E] text-white font-bold shadow-xs'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#D95F1A]'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
