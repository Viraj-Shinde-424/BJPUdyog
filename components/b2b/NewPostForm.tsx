import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { PostType, ResourceCategory } from '@/lib/types';
import {
  ShoppingCart,
  Package,
  Layers,
  Phone,
  MessageCircle,
  Building2,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Info,
  ShieldCheck,
  Tag,
  FileText,
} from 'lucide-react';

export const NewPostForm: React.FC = () => {
  const router = useRouter();
  const { lang, currentUser } = useApp();

  const [postType, setPostType] = useState<PostType>('requirement');
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory>('raw_material');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sector, setSector] = useState('Foundry & Metallurgy');
  const [district, setDistrict] = useState('Pune');
  const [businessName, setBusinessName] = useState(
    lang === 'en' ? 'Kulkarni Castings Pvt Ltd' : 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड'
  );
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98220 11223');
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.whatsappPhone || '+91 98220 11223');
  const [loading, setLoading] = useState(false);
  const [successPostId, setSuccessPostId] = useState<string | null>(null);

  const resourceCategories: { id: ResourceCategory; label: string; icon: string }[] = [
    {
      id: 'raw_material',
      label: lang === 'en' ? 'Raw Material' : lang === 'hi' ? 'कच्चा माल' : 'कच्चा माल (Raw Material)',
      icon: '⚙️',
    },
    {
      id: 'machinery',
      label: lang === 'en' ? 'Machinery & Tools' : lang === 'hi' ? 'मशीनरी एवं उपकरण' : 'मशिनरी व उपकरणे',
      icon: '🏭',
    },
    {
      id: 'services',
      label: lang === 'en' ? 'Job Work & Services' : lang === 'hi' ? 'जॉब वर्क एवं सेवाएं' : 'जॉब वर्क व सेवा',
      icon: '🔧',
    },
    {
      id: 'space',
      label: lang === 'en' ? 'Shed / Warehouse' : lang === 'hi' ? 'शेड एवं गोदाम' : 'जागा व गोडाऊन',
      icon: '🏢',
    },
    {
      id: 'general',
      label: lang === 'en' ? 'General Resources' : lang === 'hi' ? 'अन्य संसाधन' : 'इतर संसाधने',
      icon: '📦',
    },
  ];

  const SECTORS = [
    'Foundry & Metallurgy',
    'Plastics & Polymers',
    'Auto & Engineering',
    'Textiles & Garments',
    'Electronics & Electrical',
    'Chemicals & Pharmaceuticals',
    'Agro & Food Processing',
    'Packaging & Paper',
    'Other Manufacturing',
  ];

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser?.id || 'user-anand-kulkarni',
          postType,
          resourceCategory: postType !== 'update' ? resourceCategory : undefined,
          title,
          content,
          sector,
          district,
          businessName,
          contactPhone,
          contactWhatsapp,
          tags: [sector, resourceCategory],
        }),
      });

      const data = await res.json();
      if (data.success && data.post) {
        setSuccessPostId(data.post.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (successPostId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#136938] flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#136938] border border-emerald-200 uppercase tracking-wider">
            {lang === 'en' ? 'Published Successfully' : 'यशस्वीरित्या प्रसिद्ध'}
          </span>

          <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">
            {lang === 'en' ? 'B2B Post Live on Network!' : 'आपली B2B पोस्ट यशस्वीरित्या प्रसिद्ध झाली!'}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            {lang === 'en'
              ? 'Your post is now visible to verified MSMEs, industrial suppliers, and office-bearers across Maharashtra.'
              : 'आपली पोस्ट आता महाराष्ट्रातील सर्व नोंदणीकृत एमएसएमई उद्योजक, पुरवठादार व पदाधिकाऱ्यांना उपलब्ध झाली आहे.'}
          </p>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-orange-200/80 mb-8 text-left text-xs space-y-1.5">
            <div className="font-bold text-slate-800 text-sm">{title}</div>
            <div className="text-slate-500">
              {businessName} • {district} ({sector})
            </div>
            <div className="text-[11px] font-semibold text-[#D95F1A]">
              प्रकार: {postType === 'requirement' ? 'निविदा / मागणी (Tender)' : 'पुरवठादार क्षमता (Supplier)'}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/b2b">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold bg-[#D95F1A] hover:bg-[#B84A0E]">
                <span>{lang === 'en' ? 'View B2B Marketplace' : 'B2B बाजारपेठेत जा'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Button
              variant="outlined"
              size="lg"
              className="w-full sm:w-auto font-bold"
              onClick={() => {
                setSuccessPostId(null);
                setTitle('');
                setContent('');
              }}
            >
              <span>{lang === 'en' ? 'Post Another Requirement' : 'आणखी एक पोस्ट नोंदवा'}</span>
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
          href="/b2b"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#D95F1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to B2B Marketplace' : 'B2B बाजारपेठेकडे परत जा'}</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {lang === 'en' ? 'Maharashtra Verified Network' : 'महाराष्ट्र अधिकृत उद्योग नेटवर्क'}
        </span>
      </div>

      {/* Main Page Title Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/90 text-[#D95F1A] text-xs font-bold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Post New Tender or Supply' : 'नवीन निविदा किंवा पुरवठा क्षमता नोंदवा'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'en' ? 'Publish Industrial Tender / Supply Offer' : 'नवीन B2B निविदा किंवा पुरवठा क्षमता नोंदणी अर्ज'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {lang === 'en'
                ? 'Directly connect with 5,000+ verified MSMEs, industrial suppliers, and regional trade bodies in Maharashtra.'
                : 'कच्च्या मालाची मागणी, निविदा किंवा अतिरिक्त पुरवठा क्षमता महाराष्ट्रातील ५,०००+ नोंदणीकृत उद्योजकांसाठी अधिकृतपणे प्रसिद्ध करा.'}
            </p>
          </div>
        </div>
      </div>

      {/* Structured Comprehensive Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Post Type Selection */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-[#D95F1A] font-black text-xs flex items-center justify-center">
              १
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Select Post Type & Category' : 'पोस्ट प्रकार व वर्गवारी निवडा'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setPostType('requirement')}
              className={`p-4 text-left rounded-2xl border-2 transition-all flex flex-col justify-between ${
                postType === 'requirement'
                  ? 'border-[#D95F1A] bg-orange-50/70 text-[#D95F1A] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black text-base">
                    <ShoppingCart className="w-5 h-5 text-[#D95F1A]" />
                    <span>{lang === 'en' ? 'Tender / Requirement' : 'निविदा / मागणी (Tender)'}</span>
                  </div>
                  {postType === 'requirement' && <CheckCircle2 className="w-5 h-5 text-[#D95F1A]" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {lang === 'en'
                    ? 'Publish material procurement, contract job-work or equipment needed for your factory.'
                    : 'आपल्या कारखान्यासाठी आवश्यक कच्चा माल, जॉब-वर्क किंवा मशिनरी मागणी निविदा स्वरूपात प्रसिद्ध करा.'}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPostType('offer')}
              className={`p-4 text-left rounded-2xl border-2 transition-all flex flex-col justify-between ${
                postType === 'offer'
                  ? 'border-[#136938] bg-emerald-50/70 text-[#136938] shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 font-black text-base">
                    <Package className="w-5 h-5 text-[#136938]" />
                    <span>{lang === 'en' ? 'Supplier / Capacity Offer' : 'पुरवठादार / क्षमता ऑफर (Supplier)'}</span>
                  </div>
                  {postType === 'offer' && <CheckCircle2 className="w-5 h-5 text-[#136938]" />}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">
                  {lang === 'en'
                    ? 'Advertise available production capacity, manufactured goods, raw materials or warehouse space.'
                    : 'आपल्या उद्योगातील उत्पादने, अतिरिक्त उत्पादन क्षमता, कच्चा माल किंवा गोडाऊन जागा उपलब्धतेची माहिती द्या.'}
                </p>
              </div>
            </button>
          </div>

          {/* Resource Category Pill Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {lang === 'en' ? 'Resource Category *' : 'संसाधनाचा प्रकार निवडा *'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {resourceCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setResourceCategory(cat.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all text-center flex items-center justify-center gap-1.5 ${
                    resourceCategory === cat.id
                      ? 'border-[#D95F1A] bg-orange-100 text-[#D95F1A] shadow-xs ring-1 ring-[#D95F1A]'
                      : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span className="line-clamp-1">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 2: Tender / Offer Details */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-[#D95F1A] font-black text-xs flex items-center justify-center">
              २
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Specifications & Details' : 'तपशील व तांत्रिक अटी'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {postType === 'requirement'
                  ? lang === 'en'
                    ? 'Tender / Requirement Headline *'
                    : 'निविदा / मागणीचे मुख्य शीर्षक *'
                  : lang === 'en'
                  ? 'Supply / Offer Headline *'
                  : 'पुरवठादार ऑफरचे मुख्य शीर्षक *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  postType === 'requirement'
                    ? 'उदा. चाकण कारखान्यासाठी दरमहा २५ टन कास्टिंग स्क्रॅप व पिग आयर्न हवे आहे'
                    : 'उदा. ५० टन SG Iron व ग्रे आयर्न कास्टिंग्स मासिक उत्पादन क्षमता उपलब्ध'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-2 focus:ring-orange-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Detailed Description & Terms *' : 'सविस्तर माहिती, प्रमाण व अटी *'}
              </label>
              <textarea
                required
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  postType === 'requirement'
                    ? 'आवश्यक कच्चा माल किंवा कामाचे तपशील, तांत्रिक निकष (IS Standards), मासिक प्रमाण, पेमेंट अटी व अपेक्षित डिलिव्हरी कालावधी स्पष्ट लिहा.'
                    : 'आपल्या उत्पादनांचे ग्रेड, मासिक क्षमता, टेस्ट सर्टिफिकेट्स, मशिनरी तपशील व स्थानिक पुरवठा अटी लिहा.'
                }
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-2 focus:ring-orange-100 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Sector & Regional Location */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-[#D95F1A] font-black text-xs flex items-center justify-center">
              ३
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Sector & District Classification' : 'उद्योग क्षेत्र व जिल्हा निवड'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Industry Sector *' : 'उद्योग क्षेत्र निवडा *'}
              </label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-2 focus:ring-orange-100 text-sm font-semibold text-slate-900 bg-white outline-none transition-all"
              >
                {SECTORS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Maharashtra District *' : 'महाराष्ट्र जिल्हा निवडा *'}
              </label>
              <select
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-2 focus:ring-orange-100 text-sm font-semibold text-slate-900 bg-white outline-none transition-all"
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 4: Enterprise Identity & Official Direct Connect */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-orange-100 text-[#D95F1A] font-black text-xs flex items-center justify-center">
              ४
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Enterprise Verification & Contact Details' : 'उद्योग नाव व अधिकृत संपर्क तपशील'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Business / Enterprise Name *' : 'उद्योगाचे नाव *'}
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] text-sm font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Official Phone *' : 'अधिकृत संपर्क फोन *'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] text-sm font-medium text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'WhatsApp Business Phone' : 'व्हॉट्सॲप संपर्क क्रमांक'}
              </label>
              <div className="relative">
                <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={contactWhatsapp}
                  onChange={(e) => setContactWhatsapp(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] text-sm font-medium text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#FAF7F2] p-3.5 rounded-2xl border border-orange-200/80 flex items-center gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-[#D95F1A] flex-shrink-0" />
            <span>
              {lang === 'en'
                ? 'Your post will carry verified MSME credentials and will be protected from spam.'
                : 'आपली पोस्ट अधिकृत एमएसएमई पडताळणीसह प्रसिद्ध केली जाईल व अनावश्यक कॉल्सपासून सुरक्षित ठेवली जाईल.'}
            </span>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link href="/b2b" className="w-full sm:w-auto">
            <Button type="button" variant="outlined" size="lg" className="w-full font-bold">
              {lang === 'en' ? 'Cancel' : 'रद्द करा'}
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !title.trim() || !content.trim()}
            className="w-full sm:w-auto font-black px-10 py-3.5 rounded-2xl bg-[#D95F1A] hover:bg-[#B84A0E] text-white shadow-lg"
          >
            {loading ? (
              <span>{lang === 'en' ? 'Publishing Post...' : 'प्रसिद्ध करत आहे...'}</span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{postType === 'requirement' ? 'निविदा प्रसिद्ध करा' : 'पुरवठादार ऑफर प्रसिद्ध करा'}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};