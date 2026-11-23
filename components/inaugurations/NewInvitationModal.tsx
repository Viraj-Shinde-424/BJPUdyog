import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { InvitationType } from '@/lib/types';

interface NewInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewInvitationModal: React.FC<NewInvitationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, currentUser, t } = useApp();

  const [businessName, setBusinessName] = useState('कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड');
  const [eventDate, setEventDate] = useState('2026-12-25');
  const [eventTime, setEventTime] = useState('सकाळी ११:००');
  const [venue, setVenue] = useState('प्लॉट बी-४२, चाकण एमआयडीसी टप्पा २, पुणे');
  const [district, setDistrict] = useState('Pune');
  const [intendedGuestName, setIntendedGuestName] = useState('मा. देवेंद्र फडणवीस');
  const [invitationType, setInvitationType] = useState<InvitationType>('inaugurate');
  const [description, setDescription] = useState('नवीन स्वयंचलित मोल्डिंग लाईन व ऊर्जा-कार्यक्षम फर्नेस उद्घाटन समारंभ');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/inaugurations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: currentUser?.id,
          businessName,
          eventDate,
          eventTime,
          venue,
          district,
          intendedGuestName,
          intendedGuestKey: 'leader',
          invitationType,
          description,
        }),
      });

      const data = await res.json();
      if (data.success) {
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
      title={lang === 'en' ? 'Send Inauguration Invitation' : 'नवीन निमंत्रण पाठवा'}
      subtitle={
        lang === 'en'
          ? 'Invite state dignitaries or office-bearers to inaugurate or attend.'
          : 'नेते व पदाधिकाऱ्यांना युनिट उद्घाटन किंवा कार्यक्रमास उपस्थित राहण्यासाठी निमंत्रण पाठवा.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
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
            {t('inauguration', 'intendedGuest')} *
          </label>
          <input
            type="text"
            required
            value={intendedGuestName}
            onChange={(e) => setIntendedGuestName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder="उदा. मा. देवेंद्र फडणवीस / मा. रवींद्र चव्हाण / जिल्हा संयोजक..."
          />
        </div>

        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            {lang === 'en' ? 'Invitation Purpose' : 'निमंत्रणाचे स्वरूप'} *
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setInvitationType('inaugurate')}
              className={`py-2 px-3 text-center rounded-lg border font-semibold transition-all ${
                invitationType === 'inaugurate'
                  ? 'border-[#E35914] bg-orange-50 text-[#E35914] shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {t('inauguration', 'typeInaugurate')}
            </button>
            <button
              type="button"
              onClick={() => setInvitationType('attend')}
              className={`py-2 px-3 text-center rounded-lg border font-semibold transition-all ${
                invitationType === 'attend'
                  ? 'border-[#E35914] bg-orange-50 text-[#E35914] shadow-xs'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              {t('inauguration', 'typeAttend')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {t('inauguration', 'eventDate')} *
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {t('inauguration', 'eventTime')} *
            </label>
            <input
              type="text"
              required
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {t('inauguration', 'venue')} *
          </label>
          <input
            type="text"
            required
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
          />
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {lang === 'en' ? 'Event Brief / Significance' : 'कार्यक्रमाचा तपशील व स्वरूप'}
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
          />
        </div>

        <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
          <Button type="button" variant="outlined" onClick={onClose} size="sm">
            रद्द करा
          </Button>
          <Button type="submit" variant="primary" disabled={loading} size="sm">
            {loading ? 'पाठवत आहे...' : 'निमंत्रण पाठवा'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
