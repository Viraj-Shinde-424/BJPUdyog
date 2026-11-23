import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { SamvadCategory, OrganizerType, SamvadTopicType } from '@/lib/types';
import {
  CalendarRange,
  MessageSquare,
  PartyPopper,
  Building,
  User,
  Factory,
  Award,
  CheckCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Users,
  FileText,
  ChevronDown,
} from 'lucide-react';

const PADADHIKARI_OPTIONS = [
  {
    id: 'leader-fadnavis',
    name: 'मा. देवेंद्र फडणवीस',
    title: 'मुख्यमंत्री, महाराष्ट्र राज्य',
    badge: 'महाराष्ट्र शासन नेतृत्व',
  },
  {
    id: 'leader-chavan',
    name: 'मा. रवींद्र चव्हाण',
    title: 'मंत्री, महाराष्ट्र शासन व उद्योग आघाडी नेतृत्व',
    badge: 'उद्योग आघाडी नेतृत्व',
  },
  {
    id: 'user-sunil-gaikwad',
    name: 'श्री. सुनील गायकवाड',
    title: 'जिल्हा संयोजक, भाजप उद्योग आघाडी, पुणे',
    badge: 'जिल्हा संयोजक',
  },
  {
    id: 'user-satish-deshmukh',
    name: 'ॲड. सतीश देशमुख',
    title: 'प्रदेश कायदेशीर व उद्योग सल्लागार',
    badge: 'प्रदेश सल्लागार',
  },
  {
    id: 'custom',
    name: 'इतर स्थानिक पदाधिकारी',
    title: 'तालुका / जिल्हा संयोजक किंवा समन्वयक',
    badge: 'स्थानिक पदाधिकारी',
  },
];

const SECTORS = [
  'Plastics & Polymers',
  'Foundry & Metallurgy',
  'Auto & Engineering',
  'Textiles & Garments',
  'Electronics & Electrical',
  'Chemicals & Pharmaceuticals',
  'Agro & Food Processing',
  'Packaging & Paper',
  'All Industry Sectors',
];

export const NewSamvadForm: React.FC = () => {
  const router = useRouter();
  const { lang, currentUser } = useApp();

  const [category, setCategory] = useState<SamvadCategory>('event');
  const [organizerType, setOrganizerType] = useState<OrganizerType>('association');
  const [associationName, setAssociationName] = useState(
    lang === 'en'
      ? 'Maharashtra Plastic Manufacturers Association (MPMA)'
      : 'महाराष्ट्र प्लास्टिक मॅन्युफॅक्चरर्स असोसिएशन (MPMA)'
  );

  // Individual Personal Dignitary Invitation fields
  const [selectedPadadhikariKey, setSelectedPadadhikariKey] = useState('leader-fadnavis');
  const [customPadadhikariName, setCustomPadadhikariName] = useState('');
  const [customPadadhikariTitle, setCustomPadadhikariTitle] = useState('');
  const [invitationType, setInvitationType] = useState<'inaugurate' | 'attend'>('inaugurate');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Plastics & Polymers');
  const [scheduledDate, setScheduledDate] = useState('2026-12-15T10:00');
  const [locationOrLink, setLocationOrLink] = useState(
    lang === 'en' ? 'Udyog Bhavan, Pune / Online' : 'उद्योग भवन, पुणे / ऑनलाइन'
  );
  const [loading, setLoading] = useState(false);
  const [successTopicId, setSuccessTopicId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedPad = PADADHIKARI_OPTIONS.find((p) => p.id === selectedPadadhikariKey);
      const isCustom = selectedPadadhikariKey === 'custom';
      const invitedName = isCustom ? customPadadhikariName || 'स्थानिक पदाधिकारी' : selectedPad?.name;
      const invitedTitle = isCustom ? customPadadhikariTitle || 'भाजप उद्योग आघाडी' : selectedPad?.title;

      const res = await fetch('/api/samvad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: currentUser?.id || 'user-anand-kulkarni',
          category,
          organizerType,
          associationName: organizerType === 'association' ? associationName : undefined,
          isPersonalInvitation: organizerType === 'individual',
          invitedOfficeBearerId: organizerType === 'individual' ? selectedPadadhikariKey : undefined,
          invitedOfficeBearerName: organizerType === 'individual' ? invitedName : undefined,
          invitedOfficeBearerTitle: organizerType === 'individual' ? invitedTitle : undefined,
          invitationType: organizerType === 'individual' ? invitationType : undefined,
          invitationStatus: organizerType === 'individual' ? 'pending' : undefined,
          title,
          description,
          sector,
          topicType: category === 'discussion' ? 'open_discussion' : 'scheduled_session',
          scheduledDate: category !== 'discussion' ? new Date(scheduledDate).toISOString() : undefined,
          locationOrLink: category !== 'discussion' ? locationOrLink : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.topic) {
        setSuccessTopicId(data.topic.id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (successTopicId) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-8 sm:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#136938] flex items-center justify-center mx-auto mb-5 shadow-inner">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#136938] border border-emerald-200 uppercase tracking-wider">
            {lang === 'en' ? 'Topic Registered Successfully' : 'संवाद / कार्यक्रम यशस्वीरित्या नोंदवला'}
          </span>

          <h2 className="text-2xl font-black text-slate-900 mt-3 mb-2">
            {lang === 'en' ? 'Event & Samvad Proposed!' : 'आपला कार्यक्रम / संवाद मंचावर समाविष्ट झाला!'}
          </h2>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
            {organizerType === 'individual'
              ? 'आपले निमंत्रण संबंधित नेते व पदाधिकाऱ्यांच्या अधिकृत कार्यालयाकडे पाठवण्यात आले असून स्थिती "माझ्या विनंत्या" मध्ये दिसेल.'
              : 'आपला संवाद सत्र महाराष्ट्रातील संबंधित उद्योग असोसिएशन व प्रतिनिधींसाठी खुला करण्यात आला आहे.'}
          </p>

          <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-orange-200/80 mb-8 text-left text-xs space-y-1.5">
            <div className="font-bold text-slate-800 text-sm">{title}</div>
            <div className="text-slate-500">
              {sector} • {locationOrLink}
            </div>
            {organizerType === 'individual' && (
              <div className="text-[11px] font-semibold text-[#D95F1A]">
                निमंत्रित नेते: {PADADHIKARI_OPTIONS.find((p) => p.id === selectedPadadhikariKey)?.name} (
                {invitationType === 'inaugurate' ? 'उद्घाटक म्हणून' : 'प्रमुख उपस्थिती'})
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/samvad">
              <Button variant="primary" size="lg" className="w-full sm:w-auto font-bold bg-[#D95F1A] hover:bg-[#B84A0E]">
                <span>{lang === 'en' ? 'Go to Udyog Sanvad Platform' : 'उद्योग संवाद मंचावर जा'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Button
              variant="outlined"
              size="lg"
              className="w-full sm:w-auto font-bold"
              onClick={() => {
                setSuccessTopicId(null);
                setTitle('');
                setDescription('');
              }}
            >
              <span>{lang === 'en' ? 'Propose Another Event' : 'आणखी एक कार्यक्रम जोडा'}</span>
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
          href="/samvad"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-[#D95F1A] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'en' ? 'Back to Udyog Sanvad' : 'उद्योग संवाद मंचाकडे परत जा'}</span>
        </Link>

        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          {lang === 'en' ? 'Ministerial & Association Dialogue' : 'अधिकृत मंत्री व असोसिएशन संवाद'}
        </span>
      </div>

      {/* Main Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/90 text-blue-800 text-xs font-bold mb-2">
              <CalendarRange className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Propose Event, Discussion or Inauguration' : 'नवीन कार्यक्रम, संवाद किंवा उद्घाटन प्रस्ताव'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {lang === 'en'
                ? 'Propose Industry Samvad & Dignitary Invitation'
                : 'उद्योग संवाद, परिषद व उद्घाटन निमंत्रण नोंदणी अर्ज'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {lang === 'en'
                ? 'Host policy conferences, sector roundtables, factory visits or invite state leadership to inaugurate your enterprise.'
                : 'औद्योगिक गोलमेज परिषद, क्षेत्रीय धोरण चर्चा किंवा आपल्या नवीन युनिटच्या उद्घाटनासाठी भाजप नेते व पदाधिकाऱ्यांना अधिकृत निमंत्रण पाठवा.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Category Selection */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
              १
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Select Purpose & Event Format' : 'कार्यक्रमाचे स्वरूप व वर्गवारी निवडा'}
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setCategory('event')}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                category === 'event'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-xs'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <CalendarRange className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold">{lang === 'en' ? 'Conference / Event' : 'परिषद व संमेलन'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('discussion')}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                category === 'discussion'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-xs'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold">{lang === 'en' ? 'Policy Discussion' : 'धोरणात्मक चर्चा'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('inauguration')}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                category === 'inauguration'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-xs'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <PartyPopper className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold">{lang === 'en' ? 'Unit Inauguration' : 'प्रकल्प उद्घाटन'}</span>
            </button>

            <button
              type="button"
              onClick={() => setCategory('factory_tour')}
              className={`p-3.5 rounded-2xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                category === 'factory_tour'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-800 shadow-xs'
                  : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
              }`}
            >
              <Factory className="w-5 h-5 text-blue-600" />
              <span className="text-xs font-bold">{lang === 'en' ? 'Factory Tour' : 'औद्योगिक भेट'}</span>
            </button>
          </div>

          {/* Organizer Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              {lang === 'en' ? 'Initiated By *' : 'प्रस्तावक स्वरूप *'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrganizerType('association')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  organizerType === 'association'
                    ? 'border-[#D95F1A] bg-orange-50/80 text-[#D95F1A] shadow-xs'
                    : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm mb-1">
                  <Building className="w-4 h-4 text-[#D95F1A]" />
                  <span>{lang === 'en' ? 'Industrial Association' : 'औद्योगिक संघटना (Association)'}</span>
                </div>
                <p className="text-xs text-slate-600 font-normal">
                  {lang === 'en'
                    ? 'Organized under chamber of commerce or sector association.'
                    : 'उद्योग संघटना, चेंबर ऑफ कॉमर्स किंवा क्लस्टर बॉडीतर्फे आयोजित.'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setOrganizerType('individual')}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  organizerType === 'individual'
                    ? 'border-[#136938] bg-emerald-50/80 text-[#136938] shadow-xs'
                    : 'border-slate-200 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 font-black text-sm mb-1">
                  <User className="w-4 h-4 text-[#136938]" />
                  <span>{lang === 'en' ? 'Enterprise Owner (Personal Invite)' : 'वैयक्तिक उद्योग मालक (विशिष्ट नेते निमंत्रण)'}</span>
                </div>
                <p className="text-xs text-slate-600 font-normal">
                  {lang === 'en'
                    ? 'Directly invite a specific minister or BJP office-bearer to plant inauguration.'
                    : 'आपल्या कारखान्याच्या उद्घाटन किंवा भेटीसाठी विशिष्ट नेत्यांना थेट निमंत्रित करा.'}
                </p>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Association or Dignitary Specific Fields */}
        {organizerType === 'association' ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
                २
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {lang === 'en' ? 'Association Credentials' : 'उद्योग संघटना माहिती'}
              </h2>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Association / Organization Name *' : 'संघटना किंवा चेंबरचे अधिकृत नाव *'}
              </label>
              <input
                type="text"
                required
                value={associationName}
                onChange={(e) => setAssociationName(e.target.value)}
                placeholder="उदा. महाराष्ट्र प्लास्टिक मॅन्युफॅक्चरर्स असोसिएशन (MPMA) / पुणे डिस्ट्रिक्ट मॅन्युफॅक्चरर्स चेंबर"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 outline-none"
              />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-emerald-200 shadow-sm p-6 sm:p-8 bg-gradient-to-b from-emerald-50/30 to-white">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-emerald-100">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-[#136938] font-black text-xs flex items-center justify-center">
                २
              </div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                {lang === 'en' ? 'Select Dignitary / BJP Leader to Invite' : 'निमंत्रित करावयाचे नेते / पदाधिकारी निवडा'}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {lang === 'en' ? 'Select Hon. Dignitary *' : 'माननीय नेते / पदाधिकारी निवडा *'}
                </label>
                {/* Clean Dropdown Menu with 5 Key Leaders */}
                <div className="relative">
                  <select
                    id="padadhikari-select"
                    value={selectedPadadhikariKey}
                    onChange={(e) => setSelectedPadadhikariKey(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-3 rounded-xl border border-slate-300 bg-white text-sm font-medium text-slate-800 focus:border-[#136938] focus:ring-2 focus:ring-emerald-100 outline-none shadow-xs transition-all cursor-pointer hover:border-slate-400"
                  >
                    {PADADHIKARI_OPTIONS.map((pad) => (
                      <option key={pad.id} value={pad.id} className="py-2 text-slate-800 font-medium">
                        {pad.name} — {pad.title}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500">
                    <ChevronDown className="w-4 h-4 text-slate-600" />
                  </div>
                </div>

                {/* Selected Leader Preview Badge / Info Card */}
                {selectedPadadhikariKey !== 'custom' && (
                  <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-2.5 shadow-2xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                      {PADADHIKARI_OPTIONS.find((p) => p.id === selectedPadadhikariKey)?.name.replace(/^(मा\.|श्री\.|ॲड\.)\s*/, '').charAt(0) || 'ने'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-xs sm:text-sm text-slate-900">
                          {PADADHIKARI_OPTIONS.find((p) => p.id === selectedPadadhikariKey)?.name}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-[#136938] border border-emerald-200">
                          {PADADHIKARI_OPTIONS.find((p) => p.id === selectedPadadhikariKey)?.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 truncate mt-0.5">
                        {PADADHIKARI_OPTIONS.find((p) => p.id === selectedPadadhikariKey)?.title}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {selectedPadadhikariKey === 'custom' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">स्थानिक पदाधिकाऱ्यांचे नाव *</label>
                    <input
                      type="text"
                      required
                      value={customPadadhikariName}
                      onChange={(e) => setCustomPadadhikariName(e.target.value)}
                      placeholder="उदा. श्री. विकास पाटील"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">पदनाम किंवा जिल्हा *</label>
                    <input
                      type="text"
                      required
                      value={customPadadhikariTitle}
                      onChange={(e) => setCustomPadadhikariTitle(e.target.value)}
                      placeholder="उदा. तालुका संयोजक, चाकण एमआयडीसी"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Role: Inaugurate vs Guest */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  {lang === 'en' ? 'Invitation Role *' : 'निमंत्रण उद्देश / भूमिका *'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setInvitationType('inaugurate')}
                    className={`py-2.5 px-4 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                      invitationType === 'inaugurate'
                        ? 'border-[#D95F1A] bg-orange-100 text-[#D95F1A]'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    🎉 उद्घाटक म्हणून (To Inaugurate)
                  </button>
                  <button
                    type="button"
                    onClick={() => setInvitationType('attend')}
                    className={`py-2.5 px-4 rounded-xl border-2 text-center text-xs font-bold transition-all ${
                      invitationType === 'attend'
                        ? 'border-emerald-600 bg-emerald-100 text-emerald-800'
                        : 'border-slate-200 text-slate-700 bg-white'
                    }`}
                  >
                    🛡️ प्रमुख पाहुणे / उपस्थिती (Guest of Honour)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Event Specifications & Schedule */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
            <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center">
              ३
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {lang === 'en' ? 'Event Details, Date & Venue' : 'कार्यक्रमाचा तपशील, वेळ व स्थळ'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Event / Discussion Title *' : 'कार्यक्रमाचे किंवा संवादाचे शीर्षक *'}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="उदा. महाराष्ट्र प्लास्टिक उद्योग परिषद - ईपीआर नियमावली व रिसायकलिंग धोरण"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {lang === 'en' ? 'Detailed Description & Agenda *' : 'सविस्तर विषयपत्रिका व उद्देश *'}
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="कार्यक्रमाचा मुख्य उद्देश, अपेक्षित प्रतिनिधी संख्या, चर्चेचे मुख्य मुद्दे व सरकारकडून अपेक्षित मार्गदर्शन तपशीलवार लिहा."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-900 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">उद्योग क्षेत्र निवडा *</label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none"
                >
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">अपेक्षित तारीख व वेळ *</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-semibold text-slate-900 bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">स्थळ किंवा ऑनलाइन लिंक *</label>
                <input
                  type="text"
                  required
                  value={locationOrLink}
                  onChange={(e) => setLocationOrLink(e.target.value)}
                  placeholder="उदा. उद्योग भवन, पुणे किंवा MIDC हॉल"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link href="/samvad" className="w-full sm:w-auto">
            <Button type="button" variant="outlined" size="lg" className="w-full font-bold">
              {lang === 'en' ? 'Cancel' : 'रद्द करा'}
            </Button>
          </Link>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading || !title.trim() || !description.trim()}
            className="w-full sm:w-auto font-black px-10 py-3.5 rounded-2xl bg-blue-700 hover:bg-blue-800 text-white shadow-lg"
          >
            {loading ? (
              <span>{lang === 'en' ? 'Registering...' : 'नोंदवत आहे...'}</span>
            ) : (
              <span className="flex items-center gap-2">
                <span>{organizerType === 'individual' ? 'निमंत्रण पाठवा' : 'कार्यक्रम संवाद नोंदवा'}</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};