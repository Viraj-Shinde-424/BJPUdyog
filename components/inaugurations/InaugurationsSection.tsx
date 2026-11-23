import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { InaugurationInvitation } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Calendar,
  Clock,
  MapPin,
  UserCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { NewInvitationModal } from './NewInvitationModal';

export const InaugurationsSection: React.FC = () => {
  const { lang, currentUser, t } = useApp();
  const [invitations, setInvitations] = useState<InaugurationInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchInvitations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/inaugurations?userId=${currentUser?.id || ''}`);
      const data = await res.json();
      if (data.invitations) {
        setInvitations(data.invitations);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, [currentUser]);

  const handleRespond = async (id: string, status: 'accepted' | 'declined') => {
    const notes = prompt(
      status === 'accepted'
        ? 'स्वीकृती शेरा व तारीख नोंदवा (उदा. उपस्थित राहण्यास सहमती दर्शविली आहे):'
        : 'नकार शेरा नोंदवा:'
    );
    if (notes === null) return;

    try {
      const res = await fetch('/api/inaugurations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status,
          responseNotes: notes,
          responderName: currentUser?.fullName || 'समन्वयक कक्ष',
        }),
      });

      const data = await res.json();
      if (data.success) {
        fetchInvitations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {t('inauguration', 'title')}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('inauguration', 'subtitle')}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => setModalOpen(true)}
        >
          {t('inauguration', 'postBtn')}
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-xs text-slate-400">निमंत्रणे लोड होत आहेत...</div>
      ) : invitations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
          अद्याप कोणतेही निमंत्रण नोंदवलेले नाही.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {invitations.map((inv) => {
            const isAccepted = inv.status === 'accepted';
            const isDeclined = inv.status === 'declined';
            const isPending = inv.status === 'pending';

            return (
              <Card key={inv.id} className="p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        inv.invitationType === 'inaugurate'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {inv.invitationType === 'inaugurate'
                        ? t('inauguration', 'typeInaugurate')
                        : t('inauguration', 'typeAttend')}
                    </span>

                    {/* Status Badge */}
                    {isAccepted && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#136938] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t('inauguration', 'statusAccepted')}</span>
                      </span>
                    )}
                    {isDeclined && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{t('inauguration', 'statusDeclined')}</span>
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
                        <AlertCircle className="w-3.5 h-3.5 text-[#F59E0B]" />
                        <span>{t('inauguration', 'statusPending')}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug mb-1">
                    {inv.businessName}
                  </h3>

                  <div className="text-xs font-semibold text-[#E35914] mb-3">
                    {lang === 'en' ? 'Intended Dignitary: ' : 'निमंत्रित अतिथी: '}
                    <span className="text-slate-900">{inv.intendedGuestName}</span>
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-600 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.eventDate}</span>
                      <span className="text-slate-300">•</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{inv.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{inv.venue}</span>
                    </div>
                  </div>

                  {inv.description && (
                    <p className="text-xs text-slate-500 leading-relaxed mb-3">
                      {inv.description}
                    </p>
                  )}

                  {/* Response Notes (Visible under My requests) */}
                  {inv.responseNotes && (
                    <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-lg text-xs text-emerald-900 mb-3">
                      <div className="font-bold text-[11px] mb-0.5">
                        {lang === 'en' ? 'Response from Secretariat:' : 'नेते / समन्वय कक्षाकडून शेरा:'}
                      </div>
                      <p>{inv.responseNotes}</p>
                      {inv.respondedBy && (
                        <div className="text-[10px] text-emerald-700 mt-1">
                          — {inv.respondedBy}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Accept / Decline actions for Coordinator / Leader */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    नोंदणीकर्ता: {inv.senderName}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRespond(inv.id, 'accepted')}
                      className="py-1 px-2.5 text-xs"
                    >
                      स्वीकारा
                    </Button>
                    <Button
                      variant="outlined"
                      size="sm"
                      onClick={() => handleRespond(inv.id, 'declined')}
                      className="py-1 px-2.5 text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                    >
                      नाकारा
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <NewInvitationModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchInvitations();
        }}
      />
    </div>
  );
};
