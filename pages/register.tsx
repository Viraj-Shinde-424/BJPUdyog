import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import { useApp } from '@/lib/context/AppContext';
import {
  ShieldCheck,
  Building2,
  Sparkles,
  User,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  ArrowRight,
  Briefcase,
  HelpCircle,
  Building,
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { lang, currentUser, t } = useApp();

  // Form State
  const [fullName, setFullName] = useState(currentUser?.fullName || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsappPhone, setWhatsappPhone] = useState(currentUser?.whatsappPhone || currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');

  // Role Selection: 'padadhikari' vs 'business'
  const [registrantType, setRegistrantType] = useState<'padadhikari' | 'business'>('business');
  const [businessStage, setBusinessStage] = useState<'existing' | 'aspiring'>('existing');

  // Padadhikari specific fields
  const [officeBearerTitle, setOfficeBearerTitle] = useState(
    lang === 'en'
      ? 'District Convener, BJP Udyog Aghadi'
      : lang === 'hi'
      ? 'जिला संयोजक, भाजपा उद्योग अघाड़ी'
      : 'जिल्हा संयोजक, भाजप उद्योग आघाडी'
  );
  const [officeBearerScope, setOfficeBearerScope] = useState(
    lang === 'en' ? 'Pune District' : lang === 'hi' ? 'पुणे जिला' : 'पुणे जिल्हा (Pune District)'
  );

  // Business specific fields
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState('Foundry & Metallurgy');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli / Chakan');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [optInDirectory, setOptInDirectory] = useState(true);

  const [loading, setLoading] = useState(false);
  const [registeredSuccess, setRegisteredSuccess] = useState<any | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isPadadhikari = registrantType === 'padadhikari';

    try {
      const res = await fetch('/api/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName: fullName,
          businessName:
            businessName ||
            (isPadadhikari
              ? `${fullName} - उद्योग संपर्क`
              : lang === 'en'
              ? 'Proposed New Enterprise'
              : 'प्रस्तावित नवीन उद्योग'),
          sector,
          district,
          taluka,
          phone,
          whatsappPhone: whatsappPhone || phone,
          email,
          address,
          description,
          optInDirectory,
          userCategory: isPadadhikari
            ? 'padadhikari'
            : businessStage === 'aspiring'
            ? 'business_aspiring'
            : 'business_existing',
          isOfficeBearerClaim: isPadadhikari,
          officeBearerTitle: isPadadhikari ? officeBearerTitle : undefined,
          officeBearerScope: isPadadhikari ? officeBearerScope : undefined,
          isAspiring: businessStage === 'aspiring',
        }),
      });

      const data = await res.json();
      if (data.success && data.business) {
        setRegisteredSuccess(data.business);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'Official Member Registration | BJP Udyog Setu'
            : lang === 'hi'
            ? 'आधिकारिक सदस्य पंजीकरण | भाजपा उद्योग सेतु'
            : 'अधिकृत सदस्य नोंदणी | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {registeredSuccess ? (
            <Card className="max-w-2xl mx-auto p-8 sm:p-12 text-center bg-white shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200 animate-fadeIn">
              <div className="w-20 h-20 bg-emerald-50 text-[#136938] rounded-3xl flex items-center justify-center mx-auto mb-5 border-2 border-emerald-200 shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
                {lang === 'en'
                  ? 'Registration Successful!'
                  : lang === 'hi'
                  ? 'पंजीकरण सफलतापूर्वक संपन्न हुआ!'
                  : 'नोंदणी यशस्वीरीत्या पूर्ण झाली!'}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
                {registrantType === 'padadhikari'
                  ? lang === 'en'
                    ? 'Your office-bearer registration has been submitted to state coordinators for verification. Your official digital profile has been created.'
                    : lang === 'hi'
                    ? 'आपका पदाधिकारी पंजीकरण राज्य समन्वयकों को सत्यापन हेतु प्रेषित कर दिया गया है।'
                    : 'आपली पदाधिकारी नोंदणी भाजप उद्योग आघाडी समन्वयकांकडे पडताळणीसाठी पाठवली आहे. आपले अधिकृत डिजिटल प्रोफाईल तयार झाले आहे.'
                  : lang === 'en'
                  ? 'Your enterprise has been successfully registered in the BJP Udyog Setu Network & Directory.'
                  : lang === 'hi'
                  ? 'आपका उद्योग भाजपा उद्योग सेतु नेटवर्क एवं डायरेक्टरी में सफलतापूर्वक पंजीकृत हो गया है।'
                  : 'आपला उद्योग भाजप उद्योग सेतू नेटवर्क व डिरेक्टरीमध्ये यशस्वीपणे नोंदवला गेला आहे.'}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto mb-8 text-left text-sm space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">
                    {lang === 'en' ? 'Registered Name:' : lang === 'hi' ? 'पंजीकृत नाम:' : 'नोंदणी नाव:'}
                  </span>
                  <strong className="text-slate-900 font-bold">{fullName}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">
                    {lang === 'en' ? 'Enterprise / Business:' : lang === 'hi' ? 'उद्योग / संस्था:' : 'उद्योग / आस्थापना:'}
                  </span>
                  <strong className="text-slate-900 font-bold">{registeredSuccess.businessName}</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
                  <span className="text-slate-500 font-medium">
                    {lang === 'en' ? 'Location & District:' : lang === 'hi' ? 'स्थान एवं जिला:' : 'स्थान व जिल्हा:'}
                  </span>
                  <span className="font-semibold text-slate-800">
                    {registeredSuccess.district} ({registeredSuccess.taluka || 'महाराष्ट्र'})
                  </span>
                </div>
                {registrantType === 'padadhikari' && (
                  <div className="pt-1 text-[#E35914] font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>
                      {lang === 'en' ? 'Designation: ' : lang === 'hi' ? 'पदनाम: ' : 'पदाधिकारी पदनाम: '}
                      {officeBearerTitle} ({officeBearerScope})
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3.5">
                <Link href={`/card/${registeredSuccess.digitalCardSlug}`}>
                  <Button variant="primary" size="lg">
                    {lang === 'en' ? 'View Digital Business Card' : lang === 'hi' ? 'डिजिटल बिजनेस कार्ड देखें' : 'डिजिटल बिझनेस कार्ड पहा'}
                  </Button>
                </Link>
                <Link href="/network/directory">
                  <Button variant="outlined" size="lg">
                    {lang === 'en' ? 'Browse Directory' : lang === 'hi' ? 'उद्योग डायरेक्टरी देखें' : 'उद्योग डिरेक्टरी पहा'}
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="inverted" size="lg">
                    {lang === 'en' ? 'Home' : lang === 'hi' ? 'मुख्य पृष्ठ' : 'मुख्य पृष्ठ'}
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            /* CENTERED REGISTRATION FORM ONLY (NO LEFT SIDE CONTENT) */
            <div className="max-w-3xl xl:max-w-4xl mx-auto">
              {/* Form Title & Top Banner */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-[#E35914] text-xs font-bold border border-orange-200 mb-3 shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-[#E35914] animate-pulse" />
                  <span>
                    {lang === 'en'
                      ? 'Maharashtra Industry Coordination Desk'
                      : lang === 'hi'
                      ? 'महाराष्ट्र उद्योग समन्वय मंच'
                      : 'महाराष्ट्र उद्योग समन्वय मंच'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {lang === 'en'
                    ? 'BJP Udyog Setu Member Registration'
                    : lang === 'hi'
                    ? 'भाजपा उद्योग सेतु सदस्यता पंजीकरण'
                    : 'भाजपा उद्योग सेतू सदस्य नोंदणी'}
                </h1>
                <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
                  {lang === 'en'
                    ? 'Fill out the form in order below to join the state network as an Office-Bearer or Enterprise Owner.'
                    : lang === 'hi'
                    ? 'नीचे दिए गए क्रमबद्ध फॉर्म में विवरण दर्ज कर भाजपा उद्योग सेतु नेटवर्क से जुड़ें।'
                    : 'खालील क्रमवार फॉर्म भरून भाजप उद्योग आघाडी नेटवर्कमध्ये सहभागी व्हा.'}
                </p>
              </div>

              {/* Form Card */}
              <Card className="p-6 sm:p-10 bg-white shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* STEP 1: PERSONAL & CONTACT INFORMATION */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#E35914] flex items-center justify-center font-bold text-sm">
                        १
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {lang === 'en'
                          ? 'Personal & Contact Details'
                          : lang === 'hi'
                          ? 'व्यक्तिगत एवं संपर्क विवरण'
                          : 'व्यक्तिगत व संपर्क माहिती'}
                      </h2>
                    </div>

                    {/* Full Name (FIRST FIELD AS REQUESTED) */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        {lang === 'en' ? 'Full Name' : lang === 'hi' ? 'पूरा नाम' : 'पूर्ण नाव'} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={
                          lang === 'en'
                            ? 'e.g. Anand Prabhakar Kulkarni'
                            : 'उदा. आनंद प्रभाकर कुलकर्णी'
                        }
                        className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:ring-2 focus:ring-orange-100 focus:outline-none bg-white font-medium shadow-2xs transition-all"
                      />
                    </div>

                    {/* Contact Numbers & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                          {lang === 'en' ? 'Mobile Number' : lang === 'hi' ? 'मोबाइल नंबर' : 'मोबाईल क्रमांक'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                          <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98220 11223"
                            className="w-full text-sm sm:text-base pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:ring-2 focus:ring-orange-100 focus:outline-none bg-white font-mono shadow-2xs transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                          {lang === 'en' ? 'WhatsApp Number' : lang === 'hi' ? 'व्हाट्सएप नंबर' : 'व्हॉट्सॲप क्रमांक'}
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-emerald-600 absolute left-3.5 top-4" />
                          <input
                            type="tel"
                            value={whatsappPhone}
                            onChange={(e) => setWhatsappPhone(e.target.value)}
                            placeholder="+91 98220 11223"
                            className="w-full text-sm sm:text-base pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#136938] focus:ring-2 focus:ring-emerald-100 focus:outline-none bg-white font-mono shadow-2xs transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        {lang === 'en' ? 'Email Address' : lang === 'hi' ? 'ईमेल आईडी' : 'ईमेल पत्ता'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-4" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="anand@kulkarnicastings.in"
                          className="w-full text-sm sm:text-base pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:ring-2 focus:ring-orange-100 focus:outline-none bg-white shadow-2xs transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* STEP 2: ROLE SELECTION FIELD (PADADHIKARI VS BUSINESS MEN RADIO) */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#E35914] flex items-center justify-center font-bold text-sm">
                        २
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {lang === 'en'
                          ? 'Select Your Role'
                          : lang === 'hi'
                          ? 'अपनी भूमिका चुनें'
                          : 'आपली भूमिका निवडा (Role)'}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* OPTION 1: PADADHIKARI (COMPACT SAME SIZE AS STAGE SELECTOR) */}
                      <label
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          registrantType === 'padadhikari'
                            ? 'bg-white border-[#E35914] text-[#E35914] ring-2 ring-orange-100 font-bold shadow-2xs'
                            : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="registrantType"
                            value="padadhikari"
                            checked={registrantType === 'padadhikari'}
                            onChange={() => setRegistrantType('padadhikari')}
                            className="w-4 h-4 text-[#E35914] focus:ring-[#E35914]"
                          />
                          <span className="text-sm font-bold text-slate-900">
                            {lang === 'en'
                              ? 'Office-Bearer (पदाधिकारी)'
                              : lang === 'hi'
                              ? 'पदाधिकारी (Padadhikari)'
                              : 'पदाधिकारी (Padadhikari)'}
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-white bg-[#E35914] px-2 py-0.5 rounded-full flex-shrink-0">
                          {lang === 'en' ? 'Special' : 'विशेष नोंदणी'}
                        </span>
                      </label>

                      {/* OPTION 2: BUSINESS MEN (COMPACT SAME SIZE AS STAGE SELECTOR) */}
                      <label
                        className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between gap-3 transition-all ${
                          registrantType === 'business'
                            ? 'bg-white border-slate-900 text-slate-900 ring-2 ring-slate-200 font-bold shadow-2xs'
                            : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="radio"
                            name="registrantType"
                            value="business"
                            checked={registrantType === 'business'}
                            onChange={() => setRegistrantType('business')}
                            className="w-4 h-4 text-slate-900 focus:ring-slate-900"
                          />
                          <span className="text-sm font-bold text-slate-900">
                            {lang === 'en'
                              ? 'Business Men / MSME'
                              : lang === 'hi'
                              ? 'उद्योजक (Business Men)'
                              : 'उद्योजक (Business Men)'}
                          </span>
                        </div>
                        <span className="text-[10px] bg-slate-200 text-slate-700 font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                          MSME
                        </span>
                      </label>
                    </div>

                    {/* CONDITIONAL SUB-FIELDS FOR PADADHIKARI */}
                    {registrantType === 'padadhikari' && (
                      <div className="bg-orange-50/80 border border-orange-200 p-5 rounded-2xl space-y-4 animate-fadeIn">
                        <div className="flex items-center gap-2 font-bold text-sm text-orange-950">
                          <ShieldCheck className="w-5 h-5 text-[#E35914]" />
                          <span>
                            {lang === 'en'
                              ? 'Office-Bearer Title & Organizational Scope'
                              : lang === 'hi'
                              ? 'पदाधिकारी पदनाम एवं संगठनात्मक कार्यक्षेत्र'
                              : 'पदाधिकारी पदनाम व संघटनात्मक कार्यक्षेत्र तपशील'}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                              {lang === 'en' ? 'Designation / Title *' : 'भाजप उद्योग आघाडी पदनाम *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={officeBearerTitle}
                              onChange={(e) => setOfficeBearerTitle(e.target.value)}
                              placeholder="उदा. जिल्हा संयोजक, तालुका अध्यक्ष..."
                              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-300 focus:border-[#E35914] focus:outline-none bg-white font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">
                              {lang === 'en' ? 'Organizational Scope *' : 'संघटनात्मक कार्यक्षेत्र (Scope) *'}
                            </label>
                            <input
                              type="text"
                              required
                              value={officeBearerScope}
                              onChange={(e) => setOfficeBearerScope(e.target.value)}
                              placeholder="उदा. पुणे जिल्हा, चाकण क्लस्टर, महाराष्ट्र राज्य..."
                              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-orange-300 focus:border-[#E35914] focus:outline-none bg-white font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CONDITIONAL SUB-FIELDS FOR BUSINESS MEN (EXISTING VS ASPIRING) */}
                    {registrantType === 'business' && (
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 animate-fadeIn">
                        <label className="block text-xs sm:text-sm font-bold text-slate-800">
                          {lang === 'en'
                            ? 'Select Your Enterprise Stage *'
                            : lang === 'hi'
                            ? 'व्यवसाय का चरण चुनें *'
                            : 'आपल्या व्यवसायाचा टप्पा निवडा *'}
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label
                            className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                              businessStage === 'existing'
                                ? 'bg-white border-[#136938] text-[#136938] ring-2 ring-emerald-100 font-bold shadow-2xs'
                                : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="businessStage"
                              value="existing"
                              checked={businessStage === 'existing'}
                              onChange={() => setBusinessStage('existing')}
                              className="w-4 h-4 text-[#136938] focus:ring-[#136938]"
                            />
                            <span className="text-sm">
                              {lang === 'en'
                                ? 'Existing Enterprise'
                                : lang === 'hi'
                                ? 'वर्तमान में कार्यरत उद्योग'
                                : 'सुरू असलेला व्यवसाय (Existing Enterprise)'}
                            </span>
                          </label>

                          <label
                            className={`p-3.5 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                              businessStage === 'aspiring'
                                ? 'bg-white border-[#E35914] text-[#E35914] ring-2 ring-orange-100 font-bold shadow-2xs'
                                : 'bg-white/70 border-slate-200 text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="businessStage"
                              value="aspiring"
                              checked={businessStage === 'aspiring'}
                              onChange={() => setBusinessStage('aspiring')}
                              className="w-4 h-4 text-[#E35914] focus:ring-[#E35914]"
                            />
                            <span className="text-sm">
                              {lang === 'en'
                                ? 'Aspiring (Starting New)'
                                : lang === 'hi'
                                ? 'नया व्यवसाय शुरू करने वाले'
                                : 'नवीन व्यवसाय सुरू करू इच्छिणारे (Aspiring)'}
                            </span>
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* STEP 3: BUSINESS & LOCATION DETAILS */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 text-[#E35914] flex items-center justify-center font-bold text-sm">
                        ३
                      </div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        {lang === 'en'
                          ? 'Enterprise & Location Details'
                          : lang === 'hi'
                          ? 'उद्योग एवं स्थान विवरण'
                          : 'उद्योग व स्थान तपशील'}
                      </h2>
                    </div>

                    {/* Business Name */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        {businessStage === 'aspiring' && registrantType === 'business'
                          ? lang === 'en'
                            ? 'Proposed Enterprise / Venture Name *'
                            : 'प्रस्तावित नवीन उद्योग / व्यवसाय नाव *'
                          : lang === 'en'
                          ? 'Enterprise / Company Name *'
                          : 'कंपनी / उद्योगाचे नाव *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder={
                          businessStage === 'aspiring' && registrantType === 'business'
                            ? lang === 'en'
                              ? 'e.g. Proposed Smart Agro Foods...'
                              : 'उदा. प्रस्तावित स्मार्ट ॲग्रो फूड्स...'
                            : lang === 'en'
                            ? 'e.g. Kulkarni Castings Pvt Ltd'
                            : 'उदा. कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड'
                        }
                        className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white font-medium shadow-2xs"
                      />
                    </div>

                    {/* Industry Sector Dropdown */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        {lang === 'en' ? 'Industry Sector' : 'उद्योग क्षेत्र'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={sector}
                        onChange={(e) => setSector(e.target.value)}
                        className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white font-medium shadow-2xs"
                      >
                        <option value="Foundry & Metallurgy">फाउंड्री व धातू उद्योग (Foundry & Metallurgy)</option>
                        <option value="Auto & Engineering">ऑटोमोटिव्ह व इंजिनिअरिंग (Auto & Engineering)</option>
                        <option value="Plastics & Polymers">प्लास्टिक व पॉलिमर्स (Plastics & Polymers)</option>
                        <option value="Food Processing">अन्न प्रक्रिया व कृषी उद्योग (Food Processing)</option>
                        <option value="Electronics & IT">इलेक्ट्रॉनिक्स व आयटी (Electronics & IT)</option>
                        <option value="Textiles & Garments">कापड व वस्त्रोद्योग (Textiles & Garments)</option>
                        <option value="Chemicals & Pharma">केमिकल्स व फार्मा (Chemicals & Pharma)</option>
                        <option value="Renewable Energy">सौर ऊर्जा व अपारंपरिक ऊर्जा (Renewable Energy)</option>
                        <option value="General Manufacturing">इतर उत्पादन व सेवा (General Manufacturing)</option>
                      </select>
                    </div>

                    {/* District & Taluka */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                          {lang === 'en' ? 'District' : lang === 'hi' ? 'जिला' : 'जिल्हा'} <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white font-medium shadow-2xs"
                        >
                          <option value="Pune">पुणे (Pune)</option>
                          <option value="Mumbai City">मुंबई शहर (Mumbai City)</option>
                          <option value="Mumbai Suburban">मुंबई उपनगर (Mumbai Suburban)</option>
                          <option value="Thane">ठाणे (Thane)</option>
                          <option value="Raigad">रायगड (Raigad)</option>
                          <option value="Nashik">नाशिक (Nashik)</option>
                          <option value="Chhatrapati Sambhajinagar">छत्रपती संभाजीनगर</option>
                          <option value="Nagpur">नागपूर (Nagpur)</option>
                          <option value="Kolhapur">कोल्हापूर (Kolhapur)</option>
                          <option value="Solapur">सोलापूर (Solapur)</option>
                          <option value="Sangli">सांगली (Sangli)</option>
                          <option value="Satara">सातारा (Satara)</option>
                          <option value="Ahmednagar">अहिल्यानगर (Ahmednagar)</option>
                          <option value="Amravati">अमरावती (Amravati)</option>
                          <option value="Nanded">नांदेड (Nanded)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                          {lang === 'en' ? 'Taluka / Industrial MIDC Area' : 'तालुका / औद्योगिक वसाहत (MIDC)'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={taluka}
                          onChange={(e) => setTaluka(e.target.value)}
                          placeholder="उदा. चाकण एमआयडीसी, हवेली, भोसरी..."
                          className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white font-medium shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Address & Description */}
                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        {lang === 'en' ? 'Factory / Office Address' : 'कारखाना / कार्यालयाचा पूर्ण पत्ता'}
                      </label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="उदा. प्लॉट क्र. ई-४५, चाकण एमआयडीसी टप्पा २, पुणे"
                        className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white font-medium shadow-2xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm sm:text-base font-bold text-slate-800 mb-1.5">
                        {lang === 'en' ? 'Business Profile & Products Summary' : 'मुख्य उत्पादने व व्यवसायाचे संक्षिप्त स्वरूप'}
                      </label>
                      <textarea
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="उदा. एसजी व ग्रे आयर्न कास्टिंग्स, ऑटो कम्पोनंट्स आणि सीएनसी मशिनिंग क्षमता..."
                        className="w-full text-sm sm:text-base px-4 py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white font-medium shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* STEP 4: DIRECTORY CONSENT (OPT-IN) */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/80 transition-colors">
                      <input
                        type="checkbox"
                        checked={optInDirectory}
                        onChange={(e) => setOptInDirectory(e.target.checked)}
                        className="w-5 h-5 text-[#E35914] rounded mt-0.5 focus:ring-[#E35914]"
                      />
                      <div>
                        <span className="font-bold text-sm sm:text-base text-slate-900 block">
                          {lang === 'en'
                            ? 'Opt-in to Public Business Directory & Digital Card'
                            : 'सार्वजनिक उद्योग डिरेक्टरी व डिजिटल बिझनेस कार्डमध्ये सहभागी व्हा (Opt-in)'}
                        </span>
                        <span className="text-xs sm:text-sm text-slate-500 leading-relaxed block mt-0.5">
                          {lang === 'en'
                            ? 'Generate a verified digital visiting card and allow verified buyers & suppliers in Maharashtra to connect directly with your business.'
                            : 'आपले डिजिटल कार्ड तयार होईल आणि महाराष्ट्रातील इतर उद्योजक B2B पुरवठ्यासाठी आपल्याशी थेट संपर्क साधू शकतील.'}
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <div className="pt-4 border-t border-slate-200">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="w-full justify-center text-base sm:text-lg py-4 font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
                      icon={<ArrowRight className="w-5 h-5" />}
                    >
                      {loading
                        ? lang === 'en'
                          ? 'Registering...'
                          : 'नोंदणी प्रक्रिया सुरू आहे...'
                        : lang === 'en'
                        ? 'Complete Official Registration'
                        : 'अधिकृत नोंदणी पूर्ण करा'}
                    </Button>
                    <p className="text-center text-xs text-slate-400 mt-3">
                      {lang === 'en'
                        ? 'Your data is secured in the official database of BJP Udyog Aghadi, Maharashtra.'
                        : 'आपली माहिती भाजप उद्योग आघाडीच्या सुरक्षित डाटाबेसमध्ये सुरक्षित व गोपनीय ठेवली जाते.'}
                    </p>
                  </div>
                </form>
              </Card>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
}
