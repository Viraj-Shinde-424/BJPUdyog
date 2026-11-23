import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Copy } from 'lucide-react';

interface MeetingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedLeaderKey?: 'narendra-modi' | 'devendra-fadnavis' | 'ravindra-chavan';
}

export const MeetingRequestModal: React.FC<MeetingRequestModalProps> = ({
  isOpen,
  onClose,
  preselectedLeaderKey = 'devendra-fadnavis',
}) => {
  const { lang, currentUser, t } = useApp();

  const leaders = [
    {
      key: 'narendra-modi',
      name: t('leadership', 'modiName'),
      role: t('leadership', 'modiRole'),
    },
    {
      key: 'devendra-fadnavis',
      name: t('leadership', 'fadnavisName'),
      role: t('leadership', 'fadnavisRole'),
    },
    {
      key: 'ravindra-chavan',
      name: t('leadership', 'chavanName'),
      role: t('leadership', 'chavanRole'),
    },
  ];

  const [leaderKey, setLeaderKey] = useState(preselectedLeaderKey);
  const [businessName, setBusinessName] = useState(
    lang === 'en' ? 'Kulkarni Castings Pvt Ltd' : 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड'
  );
  const [representativeName, setRepresentativeName] = useState(currentUser?.fullName || 'आनंद कुलकर्णी');
  const [designation, setDesignation] = useState(lang === 'en' ? 'Director / Representative' : 'संचालक / प्रतिनिधी');
  const [sector, setSector] = useState('Foundry & Metallurgy');
  const [district, setDistrict] = useState('Pune');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98220 11223');
  const [email, setEmail] = useState(currentUser?.email || 'anand@kulkarnicastings.in');
  const [purpose, setPurpose] = useState(
    lang === 'en'
      ? 'Delegation meeting regarding industrial electricity tariff concessions and environmental clearances.'
      : lang === 'hi'
      ? 'औद्योगिक विद्युत दरों में छूट एवं पर्यावरणीय स्वीकृति सुलभीकरण हेतु शिष्टमंडल भेंट।'
      : 'औद्योगिक वीज दर आणि पर्यावरण अनुमती सुलभीकरणासाठी शिष्टमंडळ भेट'
  );
  const [delegationSize, setDelegationSize] = useState('3');
  const [preferredTimeframe, setPreferredTimeframe] = useState(
    lang === 'en' ? 'Within next 2 weeks' : 'पुढील २ आठवड्यांत'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTrackingId, setSubmittedTrackingId] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedLeaderKey) {
      setLeaderKey(preselectedLeaderKey);
    }
    if (currentUser) {
      setRepresentativeName(currentUser.fullName);
      setPhone(currentUser.phone);
      setEmail(currentUser.email);
    }
  }, [preselectedLeaderKey, currentUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedLeader = leaders.find((l) => l.key === leaderKey);

    try {
      const res = await fetch('/api/leadership/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaderKey,
          leaderName: selectedLeader?.name,
          businessName,
          representativeName,
          designation,
          industrySector: sector,
          district,
          contactPhone: phone,
          contactEmail: email,
          purpose,
          delegationSize: Number(delegationSize),
          preferredTimeframe,
        }),
      });

      const data = await res.json();
      if (data.success && data.meeting) {
        setSubmittedTrackingId(data.meeting.trackingId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = () => {
    if (submittedTrackingId) {
      navigator.clipboard.writeText(submittedTrackingId);
      alert(
        lang === 'en'
          ? 'Tracking ID copied to clipboard!'
          : lang === 'hi'
          ? 'ट्रैकिंग आईडी कॉपी हो गया!'
          : 'ट्रॅकिंग आयडी कॉपी झाला!'
      );
    }
  };

  const handleReset = () => {
    setSubmittedTrackingId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleReset}
      title={t('meetingModal', 'title')}
      subtitle={t('meetingModal', 'subtitle')}
      maxWidth="lg"
    >
      {submittedTrackingId ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-100 text-[#136938] rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {t('meetingModal', 'successTitle')}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
            {t('meetingModal', 'successMsg')}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto mb-6">
            <div className="text-[11px] text-slate-500 font-semibold mb-1">
              {t('meetingModal', 'trackingLabel')}
            </div>
            <div className="text-lg font-mono font-bold text-[#E35914] flex items-center justify-center gap-2">
              <span>{submittedTrackingId}</span>
              <button
                onClick={handleCopyId}
                className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-2">
              {lang === 'en'
                ? 'Track status anytime under "My Requests" tab.'
                : lang === 'hi'
                ? 'अपनी विनती की स्थिति "मेरी विनंतियां" टैब में कभी भी जांचें।'
                : 'आपल्या विनंतीची स्थिती "माझ्या विनंत्या" टॅबमध्ये कधीही तपासा.'}
            </p>
          </div>

          <Button variant="primary" onClick={handleReset} size="md">
            {lang === 'en' ? 'Close & Track Request' : lang === 'hi' ? 'बंद करें एवं ट्रैक करें' : 'बंद करा व ट्रॅक करा'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Preselected Leader Radio Selector */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              {t('meetingModal', 'selectedLeader')} *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {leaders.map((leader) => (
                <label
                  key={leader.key}
                  className={`border rounded-xl p-2.5 cursor-pointer flex flex-col transition-all ${
                    leaderKey === leader.key
                      ? 'border-[#E35914] bg-orange-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="leader"
                    value={leader.key}
                    checked={leaderKey === leader.key}
                    onChange={() => setLeaderKey(leader.key as any)}
                    className="sr-only"
                  />
                  <span className="font-bold text-slate-900 text-xs">
                    {leader.name}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                    {leader.role}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'businessName')} *
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'repName')} *
              </label>
              <input
                type="text"
                required
                value={representativeName}
                onChange={(e) => setRepresentativeName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'designation')} *
              </label>
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'sector')} *
              </label>
              <input
                type="text"
                required
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'district')} *
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'phone')} *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'email')} *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {t('meetingModal', 'purpose')} *
            </label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={
                lang === 'en'
                  ? 'e.g. Industrial grievances, delegation presentation, or state policy reform...'
                  : lang === 'hi'
                  ? 'उदा. औद्योगिक समस्याएं, प्रतिनिधिमंडल ज्ञापन अथवा नीतिगत सुधार...'
                  : 'उदा. औद्योगिक समस्या, नवीन प्रकल्प निवेदन किंवा धोरण सुधारणा...'
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'delegationSize')}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={delegationSize}
                onChange={(e) => setDelegationSize(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {t('meetingModal', 'preferredTime')}
              </label>
              <input
                type="text"
                value={preferredTimeframe}
                onChange={(e) => setPreferredTimeframe(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outlined" onClick={onClose} size="sm">
              {t('meetingModal', 'cancelBtn')}
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting} size="sm">
              {isSubmitting
                ? lang === 'en'
                  ? 'Submitting...'
                  : lang === 'hi'
                  ? 'जमा हो रहा है...'
                  : 'नोंद होत आहे...'
                : t('meetingModal', 'submitBtn')}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
