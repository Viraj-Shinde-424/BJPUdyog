import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { SamvadCategory, OrganizerType, SamvadTopicType } from '@/lib/types';
import { CalendarRange, MessageSquare, PartyPopper, Building, User, Factory, Award, CheckCircle } from 'lucide-react';

interface NewSamvadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PADADHIKARI_OPTIONS = [
  {
    id: 'leader-fadnavis',
    name: 'मा. देवेंद्र फडणवीस',
    title: 'मुख्यमंत्री, महाराष्ट्र राज्य',
  },
  {
    id: 'leader-chavan',
    name: 'मा. रवींद्र चव्हाण',
    title: 'मंत्री, महाराष्ट्र शासन व उद्योग आघाडी नेतृत्व',
  },
  {
    id: 'user-sunil-gaikwad',
    name: 'श्री. सुनील गायकवाड',
    title: 'जिल्हा संयोजक, भाजप उद्योग आघाडी, पुणे',
  },
  {
    id: 'user-satish-deshmukh',
    name: 'ॲड. सतीश देशमुख',
    title: 'प्रदेश कायदेशीर व उद्योग सल्लागार',
  },
  {
    id: 'custom',
    name: 'इतर स्थानिक पदाधिकारी',
    title: 'तालुका / जिल्हा संयोजक किंवा समन्वयक',
  },
];

export const NewSamvadModal: React.FC<NewSamvadModalProps> = ({ isOpen, onClose }) => {
  const { lang, currentUser } = useApp();

  const [category, setCategory] = useState<SamvadCategory>('event');
  const [organizerType, setOrganizerType] = useState<OrganizerType>('association');
  const [associationName, setAssociationName] = useState(
    lang === 'en'
      ? 'Maharashtra Plastic Manufacturers Association (MPMA)'
      : 'महाराष्ट्र प्लास्टिक मॅन्युफॅक्चरर्स असोसिएशन (MPMA)'
  );

  // Individual Personal Dignitary Invitation fields
  const [selectedPadadhikariKey, setSelectedPadadhikariKey] = useState('leader-chavan');
  const [customPadadhikariName, setCustomPadadhikariName] = useState('');
  const [customPadadhikariTitle, setCustomPadadhikariTitle] = useState('');
  const [invitationType, setInvitationType] = useState<'inaugurate' | 'attend'>('inaugurate');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sector, setSector] = useState('Plastics & Polymers');
  const [topicType, setTopicType] = useState<SamvadTopicType>('scheduled_session');
  const [scheduledDate, setScheduledDate] = useState('2026-12-15T10:00');
  const [locationOrLink, setLocationOrLink] = useState(
    lang === 'en' ? 'Udyog Bhavan, Pune / Online' : 'उद्योग भवन, पुणे / ऑनलाइन'
  );
  const [loading, setLoading] = useState(false);

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
          creatorId: currentUser?.id,
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
      if (data.success) {
        setTitle('');
        setDescription('');
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        lang === 'en'
          ? 'Propose Event, Discussion, Factory Tour or Inauguration'
          : lang === 'hi'
          ? 'नया कार्यक्रम, चर्चा, फैक्ट्री टूर अथवा उद्घाटन प्रस्तुत करें'
          : 'नवीन कार्यक्रम, चर्चा, फॅक्टरी टूर किंवा उद्घाटन मांडा'
      }
      subtitle={
        lang === 'en'
          ? 'Post an industrial conference, factory tour, advocacy discussion or inauguration.'
          : lang === 'hi'
          ? 'सम्मेलन, फैक्ट्री टूर, नीतिगत चर्चा अथवा उद्घाटन समारोह की घोषणा करें।'
          : 'परिषद, फॅक्टरी व्हिजिट, चर्चा किंवा उद्घाटन सोहळा प्रसिद्ध करा.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Category Selection: 4 Categories */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            {lang === 'en' ? 'Select Category' : lang === 'hi' ? 'श्रेणी चुनें' : 'श्रेणी निवडा'} *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              {
                id: 'event',
                label: 'कार्यक्रम / परिषद',
                hi: 'कार्यक्रम / सम्मेलन',
                en: 'Event',
                icon: CalendarRange,
              },
              {
                id: 'discussion',
                label: 'चर्चा मंच / पोस्ट',
                hi: 'चर्चा मंच / पोस्ट',
                en: 'Discussion',
                icon: MessageSquare,
              },
              {
                id: 'factory_tour',
                label: 'फॅक्टरी टूर',
                hi: 'फैक्ट्री टूर',
                en: 'Factory Tour',
                icon: Factory,
              },
              {
                id: 'inauguration',
                label: 'उद्घाटन सोहळा',
                hi: 'उद्घाटन समारोह',
                en: 'Inauguration',
                icon: PartyPopper,
              },
            ].map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as SamvadCategory)}
                  className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    category === cat.id
                      ? 'border-[#E35914] bg-orange-50 text-[#E35914] ring-2 ring-orange-200 font-bold'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] leading-tight">
                    {lang === 'en' ? cat.en : lang === 'hi' ? cat.hi : cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Organizer Type (Individual vs Association) */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            {lang === 'en' ? 'Organized By' : lang === 'hi' ? 'आयोजक का प्रकार' : 'आयोजक स्वरूप'} *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrganizerType('association')}
              className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                organizerType === 'association'
                  ? 'border-[#136938] bg-emerald-50 text-[#136938] ring-2 ring-emerald-200'
                  : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>
                {lang === 'en'
                  ? 'Industry Association'
                  : lang === 'hi'
                  ? 'औद्योगिक संगठन (Association)'
                  : 'औद्योगिक संघटना (Association)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setOrganizerType('individual')}
              className={`p-2.5 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                organizerType === 'individual'
                  ? 'border-[#E35914] bg-orange-50 text-[#E35914] ring-2 ring-orange-200'
                  : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
              }`}
            >
              <User className="w-4 h-4" />
              <span>
                {lang === 'en'
                  ? 'Individual Leader / Owner'
                  : lang === 'hi'
                  ? 'व्यक्तिगत (Individual)'
                  : 'वैयक्तिक (Individual)'}
              </span>
            </button>
          </div>
        </div>

        {/* Association Name if association is selected */}
        {organizerType === 'association' && (
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en'
                ? 'Industrial Association / Chamber Name'
                : lang === 'hi'
                ? 'औद्योगिक संगठन / चेंबर का नाम'
                : 'औद्योगिक संघटना / चेंबरचे नाव'}{' '}
              *
            </label>
            <input
              type="text"
              required
              value={associationName}
              onChange={(e) => setAssociationName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={
                lang === 'en'
                  ? 'e.g. Maharashtra Plastic Manufacturers Association (MPMA) or Pune Foundry Forum'
                  : 'उदा. महाराष्ट्र प्लास्टिक मॅन्युफॅक्चरर्स असोसिएशन (MPMA) किंवा पुणे फाउंड्री असोसिएशन'
              }
            />
          </div>
        )}

        {/* INDIVIDUAL INITIATIVE: PERSONAL PADADHIKARI INVITATION SECTION */}
        {organizerType === 'individual' && (
          <div className="bg-orange-50/70 border border-orange-200 p-3.5 rounded-2xl space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#E35914] animate-pulse" />
              <span className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                {lang === 'en'
                  ? '📩 Personal Padadhikari Invitation (विशिष्ट पदाधिकारी निमंत्रण)'
                  : '📩 विशिष्ट पदाधिकारी वैयक्तिक निमंत्रण'}
              </span>
            </div>
            <p className="text-[11px] text-orange-900 leading-relaxed">
              {lang === 'en'
                ? 'Individual initiatives allow enterprise owners to invite a specific BJP Padadhikari for plant inauguration, factory tour, or event.'
                : 'वैयक्तिक पुढाकारातून उद्योजक आपल्या उद्योगाच्या उद्घाटनासाठी किंवा फॅक्टरी व्हिजिटसाठी भाजप उद्योग आघाडीच्या विशिष्ट पदाधिकाऱ्यांना थेट निमंत्रण पाठवू शकतात.'}
            </p>

            {/* Select Padadhikari */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {lang === 'en'
                  ? 'Select Dignitary / Padadhikari to Invite *'
                  : 'आमंत्रित करावयाचे पदाधिकारी निवडा *'}
              </label>
              <select
                value={selectedPadadhikariKey}
                onChange={(e) => setSelectedPadadhikariKey(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-orange-300 bg-white font-medium focus:border-[#E35914] focus:outline-none"
              >
                {PADADHIKARI_OPTIONS.map((pad) => (
                  <option key={pad.id} value={pad.id}>
                    {pad.name} — {pad.title}
                  </option>
                ))}
              </select>
            </div>

            {/* If Custom Padadhikari */}
            {selectedPadadhikariKey === 'custom' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    {lang === 'en' ? 'Padadhikari Name' : 'पदाधिकाऱ्यांचे नाव'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customPadadhikariName}
                    onChange={(e) => setCustomPadadhikariName(e.target.value)}
                    placeholder="उदा. श्री. विकास जोशी"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                    {lang === 'en' ? 'Designation / Area' : 'पदनाम / कार्यक्षेत्र'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customPadadhikariTitle}
                    onChange={(e) => setCustomPadadhikariTitle(e.target.value)}
                    placeholder="उदा. तालुका संयोजक, भाजप उद्योग आघाडी"
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Invitation Type (Inaugurate vs Attend) */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                {lang === 'en' ? 'Invitation Role *' : 'निमंत्रणाचे स्वरूप *'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInvitationType('inaugurate')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    invitationType === 'inaugurate'
                      ? 'border-[#E35914] bg-white text-[#E35914] ring-2 ring-orange-200'
                      : 'border-slate-200 text-slate-600 bg-white/70'
                  }`}
                >
                  🎀 {lang === 'en' ? 'To Inaugurate' : 'उद्घाटक म्हणून (To Inaugurate)'}
                </button>
                <button
                  type="button"
                  onClick={() => setInvitationType('attend')}
                  className={`p-2 rounded-xl border text-xs font-bold transition-all text-center ${
                    invitationType === 'attend'
                      ? 'border-[#136938] bg-white text-[#136938] ring-2 ring-emerald-200'
                      : 'border-slate-200 text-slate-600 bg-white/70'
                  }`}
                >
                  🤝 {lang === 'en' ? 'Guest of Honour / To Attend' : 'प्रमुख पाहुणे / उपस्थिती'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {lang === 'en'
              ? 'Event / Discussion Title'
              : lang === 'hi'
              ? 'कार्यक्रम / चर्चा का शीर्षक'
              : 'कार्यक्रमाचे किंवा चर्चेचे शीर्षक'}{' '}
            *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder={
              category === 'inauguration'
                ? lang === 'en'
                  ? 'e.g. Grand Inauguration of New CNC & Induction Furnace Facility...'
                  : lang === 'hi'
                  ? 'उदा. नई सीएनसी एवं फर्नेस इकाई का भव्य उद्घाटन समारोह...'
                  : 'उदा. नवीन सीएनसी व फर्नेस युनिटचे भव्य उद्घाटन सोहळा...'
                : lang === 'en'
                ? 'e.g. Maharashtra Plastic Industry Conference & Extended Producer Responsibility (EPR)...'
                : lang === 'hi'
                ? 'उदा. महाराष्ट्र प्लास्टिक उद्योग सम्मेलन एवं EPR नीति...'
                : 'उदा. महाराष्ट्र प्लास्टिक उद्योग परिषद व EPR धोरण...'
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en' ? 'Industry Sector' : lang === 'hi' ? 'उद्योग क्षेत्र' : 'उद्योग क्षेत्र'} *
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            >
              <option value="Plastics & Polymers">Plastics & Polymers</option>
              <option value="Foundry & Metallurgy">Foundry & Metallurgy</option>
              <option value="Auto & Engineering">Auto & Engineering</option>
              <option value="Food Processing">Food Processing</option>
              <option value="Electronics & IT">Electronics & IT</option>
            </select>
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en' ? 'Location / Industrial Area' : lang === 'hi' ? 'स्थान / औद्योगिक क्षेत्र' : 'जिल्हा / औद्योगिक क्षेत्र'}
            </label>
            <input
              type="text"
              value={locationOrLink}
              onChange={(e) => setLocationOrLink(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={lang === 'en' ? 'e.g. Chakan MIDC, Pune or Auto Cluster' : 'उदा. चाकण एमआयडीसी, पुणे किंवा ऑटो क्लस्टर'}
            />
          </div>
        </div>

        {category !== 'discussion' && (
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200">
            <label className="block font-bold text-amber-900 mb-1">
              {lang === 'en' ? 'Date & Time' : lang === 'hi' ? 'कार्यक्रम की तिथि एवं समय' : 'कार्यक्रमाचा दिनांक व वेळ'} *
            </label>
            <input
              type="datetime-local"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-amber-300 bg-white"
            />
          </div>
        )}

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {lang === 'en'
              ? 'Description & Key Agenda'
              : lang === 'hi'
              ? 'विवरण एवं मुख्य एजेंडा'
              : 'पार्श्वभूमी, रूपरेषा व मुख्य चर्चा मुद्दे'}{' '}
            *
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder={
              lang === 'en'
                ? 'Objective of event, attending dignitaries, key policy topics, or issues to address...'
                : lang === 'hi'
                ? 'कार्यक्रम का उद्देश्य, आमंत्रित अतिथि, एजेंडा अथवा नीतिगत विषय...'
                : 'कार्यक्रमाचा मुख्य उद्देश, उपस्थित मान्यवर, अजेंडा अथवा धोरणात्मक विषय...'
            }
          />
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <Button type="button" variant="outlined" onClick={onClose} size="sm">
            {lang === 'en' ? 'Cancel' : lang === 'hi' ? 'रद्द करें' : 'रद्द करा'}
          </Button>
          <Button type="submit" variant="primary" disabled={loading} size="sm">
            {loading
              ? lang === 'en'
                ? 'Submitting...'
                : lang === 'hi'
                ? 'दर्ज हो रहा है...'
                : 'नोंद होत आहे...'
              : category === 'inauguration'
              ? lang === 'en'
                ? 'Publish Inauguration'
                : lang === 'hi'
                ? 'उद्घाटन प्रकाशित करें'
                : 'उद्घाटन प्रसिद्ध करा'
              : lang === 'en'
              ? 'Submit Event / Topic'
              : lang === 'hi'
              ? 'कार्यक्रम / चर्चा प्रस्तुत करें'
              : 'कार्यक्रम मांडा'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
