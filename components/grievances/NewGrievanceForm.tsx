import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { GrievanceType } from '@/lib/types';
import {
  AlertCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileQuestion,
  AlertTriangle,
  Building2,
  Lock,
  Phone,
  Calendar,
  HelpCircle,
} from 'lucide-react';

const DISTRICTS = [
  'Pune',
  'Mumbai City',
  'Mumbai Suburban',
  'Thane',
  'Palghar',
  'Raigad',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Nagpur',
  'Kolhapur',
  'Solapur',
  'Satara',
  'Sangli',
  'Ahmednagar',
  'Jalgaon',
  'Amravati',
  'Nanded',
];

export const NewGrievanceForm: React.FC = () => {
  const router = useRouter();
  const { lang, currentUser } = useApp();

  const [grievanceType, setGrievanceType] = useState<GrievanceType>('unanswered_gov');
  const [subject, setSubject] = useState('');
  const [businessName, setBusinessName] = useState(
    lang === 'en' ? 'Kulkarni Castings Pvt Ltd' : 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड'
  );
  const [district, setDistrict] = useState('Pune');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98220 11223');
  const [originalGrievanceLink, setOriginalGrievanceLink] = useState(
    'https://aaplesarkar.mahaonline.gov.in/en/Grievance/Track/AS-2026-992144'
  );
  const [originalReferenceNo, setOriginalReferenceNo] = useState('AS-2026-992144');
  const [originalFilingDate, setOriginalFilingDate] = useState('2026-08-15');
  const [explanation, setExplanation] = useState(
    lang === 'en'
      ? 'Applied on Aaple Sarkar portal 3 months ago for MSEDCL 11 KV HT industrial power connection for our new induction furnace unit at Chakan MIDC Phase 2. The regional office and subdivision have not resolved the delay and physical power connection remains pending.'
      : lang === 'hi'
      ? 'चाकण एमआईडीसी चरण 2 में हमारी नई इंडक्शन फर्नेस इकाई हेतु 11 KV HT औद्योगिक विद्युत कनेक्शन के लिए 3 माह पूर्व आपले सरकार पोर्टल पर आवेदन किया गया था। क्षेत्रीय कार्यालय और उपप्रभाग द्वारा अभी तक वास्तविक विद्युत संयोजन लंबित रखा गया है।'
      : 'चाकण एमआयडीसी टप्पा २ येथील नवीन इंडक्शन फर्नेस युनिटसाठी महावितरण (MSEDCL) कडे ११ केव्ही उच्च दाब (HT) औद्योगिक वीज भारासाठी ३ महिन्यांपूर्वी आपले सरकार पोर्टलवर अर्ज केला होता. क्षेत्रीय कार्यालय आणि उपविभाग यांच्यात टोलवाटोलवी होत असून प्रत्यक्ष वीज जोडणीचे काम प्रलंबित आहे.'
  );
  const [loading, setLoading] = useState(false);
  const [issuedTrackingId, setIssuedTrackingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: currentUser?.id || 'user-anand-kulkarni',
          grievanceType,
          subject:
            subject ||
            (grievanceType === 'unanswered_gov'
              ? lang === 'en'
                ? 'Government Portal Unanswered Follow-up'
                : 'शासकीय पोर्टल प्रलंबित पाठपुरावा'
              : grievanceType === 'website_issue'
              ? lang === 'en'
                ? 'Website / Portal Technical Assistance'
                : 'संकेतस्थळ / पोर्टल तांत्रिक साहाय्य'
              : lang === 'en'
              ? 'Direct Industrial Complaint'
              : 'थेट औद्योगिक तक्रार'),
          businessName,
          district,
          contactPhone,
          originalGrievanceLink:
            grievanceType === 'unanswered_gov' ? originalGrievanceLink : originalGrievanceLink || undefined,
          originalReferenceNo: originalReferenceNo || undefined,
          originalFilingDate: originalFilingDate || undefined,
          explanation,
        }),
      });

      const data = await res.json();
      if (data.success && data.grievance) {
        setIssuedTrackingId(data.grievance.trackingId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (issuedTrackingId) {
      navigator.clipboard.writeText(issuedTrackingId);
      alert(
        lang === 'en'
          ? 'Tracking ID copied to clipboard!'
          : lang === 'hi'
          ? 'ट्रैकिंग आईडी कॉपी हो गया!'
          : 'ट्रॅकिंग आयडी कॉपी झाला!'
      );
    }
  };

  if (issuedTrackingId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 uppercase tracking-wider">
            {lang === 'en' ? 'Grievance Registered' : 'तक्रार पाठपुरावा यशस्वीरित्या नोंदवला'}
          </span>

          <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">
            {lang === 'en' ? 'Grievance Tracking ID Issued!' : 'आपला तक्रार ट्रॅकिंग आयडी तयार झाला आहे!'}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            {lang === 'en'
              ? 'Your case is now assigned to the regional BJP Udyog Aghadi coordination cell. Save this ID to track private timeline updates.'
              : 'आपली केस भाजप उद्योग आघाडी विभागीय समन्वय कक्षाकडे पाठवण्यात आली आहे. टाइमलाइन प्रगती पाहण्यासाठी हा आयडी जपून ठेवा.'}
          </p>

          <div className="bg-[#FAF7F2] p-5 rounded-2xl border-2 border-dashed border-orange-300 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-slate-500 uppercase">
                {lang === 'en' ? 'Official Tracking ID' : 'अधिकृत ट्रॅकिंग आयडी'}
              </div>
              <div className="text-xl font-black text-[#D95F1A] font-mono tracking-wider mt-0.5">
                {issuedTrackingId}
              </div>
            </div>

            <Button
              type="button"
              variant="outlined"
              size="sm"
              onClick={handleCopy}
              className="flex items-center gap-1.5 font-bold"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Copy ID' : 'कॉपी करा'}</span>
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={`/grievances`}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold bg-[#D95F1A] hover:bg-[#B84A0E]">
                <span>{lang === 'en' ? 'Track Timeline Now' : 'तक्रार टाइमलाइन पहा'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Button
              variant="outlined"
              size="lg"
              className="w-full sm:w-auto font-bold"
              onClick={() => {
                setIssuedTrackingId(null);
                setSubject('');
              }}
            >
              <span>{lang === 'en' ? 'Register Another Grievance' : 'आणखी एक तक्रार नोंदवा'}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {/* Top Breadcrumb & Return Action */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/grievances"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#D95F1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to Grievance Redressal' : 'तक्रार निवारण मंचाकडे परत जा'}</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1.5">
          <Lock className="w-3 h-3 text-[#D95F1A]" />
          <span>{lang === 'en' ? 'Confidential Redressal Desk' : 'गोपनीय शासकीय पाठपुरावा कक्ष'}</span>
        </span>
      </div>

      {/* Main Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-bold mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Register Grievance Follow-up' : 'शासकीय व औद्योगिक तक्रार पाठपुरावा नोंदणी'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'en'
                ? 'Register Grievance Follow-up & Redressal'
                : 'औद्योगिक तक्रार निवारण व पाठपुरावा अर्ज'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {lang === 'en'
                ? 'Support for industrial issues pending on Aaple Sarkar, MIDC, MPCB or MSEDCL portals with dedicated office-bearer escalation.'
                : 'आपले सरकार, MIDC, महावितरण किंवा प्रदूषण नियंत्रण मंडळाकडे प्रलंबित राहिलेल्या औद्योगिक तक्रारींचा अधिकृत पाठपुरावा मिळवा.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Grievance Type */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
              १
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Select Grievance Category' : 'तक्रारीचा प्रकार निवडा'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            <button
              type="button"
              onClick={() => setGrievanceType('unanswered_gov')}
              className={`p-4 text-left rounded-2xl border-2 transition-all flex flex-col justify-between ${
                grievanceType === 'unanswered_gov'
                  ? 'border-amber-600 bg-amber-50/80 text-amber-900 shadow-xs ring-1 ring-amber-600'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 font-bold text-sm">
                  <span className="flex items-center gap-2">
                    <FileQuestion className="w-4 h-4 text-amber-600" />
                    <span>शासकीय पोर्टलवर प्रलंबित</span>
                  </span>
                  {grievanceType === 'unanswered_gov' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  आपले सरकार, MIDC किंवा MSEDCL पोर्टलवर आधीच दाखल केलेली परंतु वेळेत न सुटलेली केस.
                </p>
              </div>
              <span className="mt-3 text-[10px] font-semibold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded w-fit">
                शासकीय लिंक आवश्यक
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGrievanceType('direct_industrial')}
              className={`p-4 text-left rounded-2xl border-2 transition-all flex flex-col justify-between ${
                grievanceType === 'direct_industrial'
                  ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs ring-1 ring-emerald-600'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 font-bold text-sm">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-emerald-600" />
                    <span>थेट औद्योगिक अडचण</span>
                  </span>
                  {grievanceType === 'direct_industrial' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  एमआयडीसी पायाभूत सुविधा, रस्ते, पाणी, वीज खंडित होणे किंवा स्थानिक प्रशासकीय अडचण.
                </p>
              </div>
              <span className="mt-3 text-[10px] font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded w-fit">
                थेट संघटना पाठपुरावा
              </span>
            </button>

            <button
              type="button"
              onClick={() => setGrievanceType('website_issue')}
              className={`p-4 text-left rounded-2xl border-2 transition-all flex flex-col justify-between ${
                grievanceType === 'website_issue'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-900 shadow-xs ring-1 ring-blue-600'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 font-bold text-sm">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    <span>संकेतस्थळ / पोर्टल अडचण</span>
                  </span>
                  {grievanceType === 'website_issue' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  उद्योग सेतू पोर्टल, लॉगिन, फॉर्म भरणे, कागदपत्र अपलोड किंवा तांत्रिक मदतीबाबत तक्रार.
                </p>
              </div>
              <span className="mt-3 text-[10px] font-semibold text-blue-800 bg-blue-100/70 px-2 py-0.5 rounded w-fit">
                पोर्टल टेक्निकल टीम साहाय्य
              </span>
            </button>
          </div>
        </div>

        {/* Step 2: Original Government Portal Details (if applicable) */}
        {grievanceType === 'unanswered_gov' && (
          <div className="bg-white rounded-3xl border border-amber-200 shadow-sm p-6 sm:p-8 bg-gradient-to-b from-amber-50/20 to-white">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-amber-100">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
                २
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {lang === 'en' ? 'Original Portal Reference & Submission Info' : 'मूळ शासकीय तक्रार संदर्भ व दाखल माहिती'}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    मूळ शासकीय संदर्भ / टोकन क्रमांक *
                  </label>
                  <input
                    type="text"
                    required
                    value={originalReferenceNo}
                    onChange={(e) => setOriginalReferenceNo(e.target.value)}
                    placeholder="उदा. AS-2026-992144 / MIDC-GRV-8821"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 font-mono text-sm font-bold text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    मूळ अर्ज दाखल केल्याची तारीख *
                  </label>
                  <input
                    type="date"
                    required
                    value={originalFilingDate}
                    onChange={(e) => setOriginalFilingDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  मूळ शासकीय तक्रार लिंक (Aaple Sarkar / MIDC Tracking URL)
                </label>
                <div className="relative">
                  <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="url"
                    value={originalGrievanceLink}
                    onChange={(e) => setOriginalGrievanceLink(e.target.value)}
                    placeholder="https://aaplesarkar.mahaonline.gov.in/..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Grievance Explanation */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
              {grievanceType === 'unanswered_gov' ? '३' : '२'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Grievance Subject & Description' : 'तक्रारीचा विषय व सविस्तर स्पष्टीकरण'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {grievanceType === 'website_issue'
                  ? 'तक्रार / तांत्रिक अडचणीचा मुख्य विषय *'
                  : 'तक्रारीचा मुख्य विषय (Subject) *'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={
                  grievanceType === 'website_issue'
                    ? 'उदा. प्रोफाइल अपडेट करताना त्रुटी किंवा कागदपत्र अपलोड न होणे'
                    : 'उदा. चाकण एमआयडीसी टप्पा २ मधील ११ केव्ही उच्च दाब वीज जोडणी प्रलंबित'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-600 text-sm font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {grievanceType === 'website_issue'
                  ? 'संकेतस्थळावरील तांत्रिक अडचण / अभिप्राय (सविस्तर माहिती) *'
                  : 'काय अनुत्तरित राहिले आहे? (सविस्तर माहिती व अडचण) *'}
              </label>
              <textarea
                required
                rows={5}
                value={explanation}
                onChange={(e) => setExplanation(e.target.value)}
                placeholder={
                  grievanceType === 'website_issue'
                    ? 'संकेतस्थळावर कोणती तांत्रिक समस्या आली? कोणत्या पानावर त्रुटी दिसली? काय अपेक्षित होते? सविस्तर लिहा.'
                    : 'संबंधित शासकीय कार्यालयात कोणती समस्या आली? किती दिवस प्रलंबित आहे? उत्पादनावर काय परिणाम होत आहे? स्पष्ट लिहा.'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-amber-600 text-sm font-medium text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Step 4: Enterprise Identity */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 font-black text-xs flex items-center justify-center">
              {grievanceType === 'unanswered_gov' ? '४' : '३'}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Enterprise Identity & Contact' : 'उद्योगाचे नाव व संपर्क'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">उद्योगाचे नाव *</label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">जिल्हा / औद्योगिक क्षेत्र *</label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">संपर्क फोन *</label>
              <input
                type="text"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link href="/grievances" className="w-full sm:w-auto">
            <Button type="button" variant="outlined" size="lg" className="w-full font-bold">
              {lang === 'en' ? 'Cancel' : 'रद्द करा'}
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !explanation.trim()}
            className="w-full sm:w-auto font-black px-10 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white shadow-lg"
          >
            {loading ? (
              <span>{lang === 'en' ? 'Registering...' : 'नोंदवत आहे...'}</span>
            ) : (
              <span className="flex items-center gap-2">
                <span>तक्रार पाठपुरावा नोंदवा</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};