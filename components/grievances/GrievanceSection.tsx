import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '@/lib/context/AppContext';
import { Grievance, GrievanceStatus, GrievanceType } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import {
  AlertCircle,
  Clock,
  ShieldCheck,
  Search,
  ExternalLink,
  Plus,
  Send,
  Lock,
  ArrowUpRight,
  UserCheck,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  AlertTriangle,
  HelpCircle,
  Building2,
  ArrowLeft,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';
import { NewGrievanceModal } from './NewGrievanceModal';
import { EscalationModal } from './EscalationModal';
import { localizeGrievance } from '@/lib/i18n/dataLocalizer';

export const GrievanceSection: React.FC = () => {
  const router = useRouter();
  const { lang, currentUser, t } = useApp();
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [searchTrackingId, setSearchTrackingId] = useState('');
  const [activeGrievance, setActiveGrievance] = useState<Grievance | null>(null);
  const [isRestrictedView, setIsRestrictedView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [updateText, setUpdateText] = useState('');

  const fetchGrievances = async () => {
    // Strict Privacy Requirement: If not logged in, DO NOT load or display any sample grievance list
    if (!currentUser) {
      setGrievances([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/grievances?userId=${currentUser.id}&role=${currentUser.role || ''}`);
      const data = await res.json();
      if (data.grievances) {
        setGrievances(data.grievances);
        if (data.grievances.length > 0 && !activeGrievance) {
          loadGrievanceDetails(data.grievances[0].trackingId);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadGrievanceDetails = async (trId: string) => {
    if (!trId.trim()) return;
    try {
      const res = await fetch(
        `/api/grievances/${encodeURIComponent(trId.trim())}?userId=${currentUser?.id || ''}&role=${currentUser?.role || ''}`
      );
      const data = await res.json();
      if (data.grievance) {
        setActiveGrievance(data.grievance);
        setIsRestrictedView(data.isRestrictedView || false);
      } else {
        alert(
          lang === 'en'
            ? 'Grievance ID not found'
            : lang === 'hi'
            ? 'शिकायत आईडी नहीं मिली'
            : 'तक्रार आयडी सापडला नाही'
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, [currentUser]);

  const handleTakeUpCase = async () => {
    if (!activeGrievance) return;
    try {
      const res = await fetch(`/api/grievances/${activeGrievance.trackingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'take_up',
          officeBearerId: currentUser?.id,
          officeBearerName: currentUser?.fullName || (lang === 'en' ? 'Sunil Gaikwad (Pune District Convener)' : 'सुनील गायकवाड (पुणे जिल्हा संयोजक)'),
        }),
      });

      const data = await res.json();
      if (data.success && data.grievance) {
        setActiveGrievance(data.grievance);
        fetchGrievances();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddUpdate = async () => {
    if (!activeGrievance || !updateText.trim()) return;
    try {
      const res = await fetch(`/api/grievances/${activeGrievance.trackingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_update',
          officeBearerId: currentUser?.id,
          officeBearerName: currentUser?.fullName || 'सुनील गायकवाड',
          updateNotes: updateText.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.grievance) {
        setActiveGrievance(data.grievance);
        setUpdateText('');
        fetchGrievances();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const isStaffUser = ['office_bearer', 'state_office_bearer', 'coordinator', 'admin'].includes(currentUser?.role || '');

  const typeConfig: Record<GrievanceType, { label: string; icon: any; bg: string; text: string }> = {
    unanswered_gov: {
      label:
        lang === 'en'
          ? 'Unanswered Gov Grievance'
          : lang === 'hi'
          ? 'लंबित सरकारी शिकायत'
          : 'शासकीय पाठपुरावा',
      icon: FileQuestion,
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-[#E35914]',
    },
    direct_industrial: {
      label:
        lang === 'en'
          ? 'Direct Industrial Grievance'
          : lang === 'hi'
          ? 'प्रत्यक्ष औद्योगिक समस्या'
          : 'थेट औद्योगिक तक्रार',
      icon: AlertTriangle,
      bg: 'bg-emerald-50 border-emerald-200',
      text: 'text-[#136938]',
    },
    website_issue: {
      label:
        lang === 'en'
          ? 'Website / Portal Support'
          : lang === 'hi'
          ? 'पोर्टल सहायता'
          : 'पोर्टल सहाय्य',
      icon: HelpCircle,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-700',
    },
  };

  const statusLabel = (st: GrievanceStatus) => {
    if (st === 'referred_to_state') {
      return lang === 'en' ? 'Referred to State' : lang === 'hi' ? 'राज्य स्तर पर प्रेषित' : 'राज्य स्तरावर वर्ग';
    }
    if (st === 'under_review') {
      return lang === 'en' ? 'Under Review' : lang === 'hi' ? 'समीक्षाधीन' : 'विचाराधीन (Under Review)';
    }
    if (st === 'action_taken') {
      return lang === 'en' ? 'Action Taken' : lang === 'hi' ? 'कार्रवाई की गई' : 'कार्यवाही झाली';
    }
    if (st === 'resolved') {
      return lang === 'en' ? 'Resolved' : lang === 'hi' ? 'समाधान पूर्ण' : 'निवारण झाले';
    }
    return lang === 'en' ? 'Submitted' : lang === 'hi' ? 'दाखिल' : 'नोंदणीकृत';
  };

  return (
    <div className="space-y-6">
      {/* Header and Primary Action (Enlarged & Prominent) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {t('grievances', 'title')}
            </h2>
            <span className="text-xs bg-orange-100 text-[#D95F1A] px-3 py-1 rounded-full font-extrabold border border-orange-200">
              {lang === 'en' ? 'Follow-up & Redressal' : lang === 'hi' ? 'फॉलो-अप एवं निवारण' : 'पाठपुरावा व निवारण'}
            </span>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Track unanswered government portal grievances, submit direct industrial complaints, or get platform support.'
              : lang === 'hi'
              ? 'लंबित सरकारी पोर्टल शिकायतों का समाधान, प्रत्यक्ष औद्योगिक समस्याएं एवं पोर्टल सहायता प्राप्त करें।'
              : 'प्रलंबित शासकीय तक्रार पाठपुरावा करा, थेट औद्योगिक अडचणी मांडा किंवा उद्योग सेतू पोर्टल साहाय्य मिळवा.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="px-6 py-3 text-sm font-bold shadow-sm rounded-xl flex-shrink-0"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push('/grievances/new')}
        >
          {t('grievances', 'submitBtn')}
        </Button>
      </div>

      {/* Tracking ID Search Bar (Taller, spacious, and prominent) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full">
          <Search className="w-5 h-5 text-[#D95F1A] absolute left-4 top-3.5" />
          <input
            type="text"
            value={searchTrackingId}
            onChange={(e) => setSearchTrackingId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                loadGrievanceDetails(searchTrackingId);
              }
            }}
            placeholder={t('grievances', 'trackPlaceholder')}
            className="w-full text-sm sm:text-base pl-12 pr-4 py-3 sm:py-3.5 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-2 focus:ring-[#D95F1A]/20 focus:outline-none bg-slate-50/50 font-mono transition-all"
          />
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => loadGrievanceDetails(searchTrackingId)}
          className="w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-bold rounded-xl flex-shrink-0 shadow-sm"
        >
          {t('grievances', 'trackBtn')}
        </Button>
      </div>

      {/* Main Grid: Cases List & Details Timeline */}
      <div className={`grid grid-cols-1 ${currentUser && grievances.length > 0 ? 'lg:grid-cols-3' : 'grid-cols-1'} gap-6`}>
        {/* Left column: Cases list (Shown ONLY when user is logged in and has cases) */}
        {currentUser && grievances.length > 0 && (
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
              {lang === 'en' ? 'My Grievance Cases' : 'माझे नोंदणीकृत तक्रार अर्ज'}
            </div>

            {grievances.map((rawG) => {
              const g = localizeGrievance(rawG, lang);
              const grvType = g.grievanceType || 'unanswered_gov';
              const typeInfo = typeConfig[grvType] || typeConfig.unanswered_gov;
              const TypeIcon = typeInfo.icon;

              const isUnansweredGov = grvType === 'unanswered_gov';

              return (
                <div
                  key={g.id}
                  onClick={() => loadGrievanceDetails(g.trackingId)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    isUnansweredGov ? 'border-l-4 border-l-[#E35914]' : 'border-l-4 border-l-[#136938]'
                  } ${
                    activeGrievance?.trackingId === g.trackingId
                      ? 'border-[#E35914] bg-orange-50/50 shadow-md ring-2 ring-orange-200'
                      : 'border-slate-200 bg-white hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs sm:text-sm font-bold text-[#E35914] bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                      {g.trackingId}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        g.status === 'referred_to_state'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : g.status === 'under_review'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {statusLabel(g.status)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mb-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border ${typeInfo.bg} ${typeInfo.text}`}>
                      <TypeIcon className="w-3.5 h-3.5" />
                      <span>{typeInfo.label}</span>
                    </span>
                  </div>

                  <h4 className="font-extrabold text-[15px] sm:text-base text-slate-900 line-clamp-1 mb-1.5">
                    {g.subject || g.businessName}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {g.explanation}
                  </p>
                  <div className="mt-3 pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
                    {g.district} • {new Date(g.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Right column: Active Grievance Detailed View & Strict Private Timeline */}
        <div className={currentUser && grievances.length > 0 ? 'lg:col-span-2' : 'w-full'}>
          {activeGrievance ? (() => {
            const currentG = localizeGrievance(activeGrievance, lang);
            return (
            <Card className="p-6 space-y-6">
              {/* Header Details */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#E35914] bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-lg">
                      {currentG.trackingId}
                    </span>

                    {/* Grievance Type Badge */}
                    {(() => {
                      const grvType = currentG.grievanceType || 'unanswered_gov';
                      const typeInfo = typeConfig[grvType] || typeConfig.unanswered_gov;
                      const TypeIcon = typeInfo.icon;
                      return (
                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${typeInfo.bg} ${typeInfo.text}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          <span>{typeInfo.label}</span>
                        </span>
                      );
                    })()}

                    {currentG.isEscalatedToState && (
                      <span className="text-[11px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                        {lang === 'en'
                          ? 'Escalated to State'
                          : lang === 'hi'
                          ? 'राज्य स्तर पर प्रेषित'
                          : 'राज्य स्तरावर वर्ग (Escalated to State)'}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-500">
                    {lang === 'en' ? 'Date Filed: ' : lang === 'hi' ? 'दाखिल तिथि: ' : 'नोंद दिनांक: '}
                    {new Date(currentG.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Subject & Business Info */}
                <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                  {currentG.subject || currentG.businessName}
                </h3>
                <div className="text-xs sm:text-sm text-slate-600 font-semibold mt-1 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{currentG.businessName} • {currentG.district}</span>
                </div>

                {/* Government Grievance Reference Links (or Direct Industrial Notice) */}
                {activeGrievance.originalGrievanceLink ? (
                  <div className="mt-3.5 bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs sm:text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-slate-500 block text-xs">
                          {t('grievances', 'govLink')}:
                        </span>
                        <a
                          href={activeGrievance.originalGrievanceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E35914] hover:underline font-mono break-all flex items-center gap-1"
                        >
                          <span>{activeGrievance.originalGrievanceLink}</span>
                          <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                        </a>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/80 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-500">{t('grievances', 'govRefNo')}: </span>
                        <strong className="text-slate-800">{activeGrievance.originalReferenceNo || 'N/A'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500">{t('grievances', 'filingDate')}: </span>
                        <strong className="text-slate-800">{activeGrievance.originalFilingDate || 'N/A'}</strong>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3.5 bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl text-xs sm:text-sm text-emerald-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#136938] flex-shrink-0" />
                    <span>
                      {lang === 'en'
                        ? 'Direct Industrial Complaint / Portal Assistance — No external portal link required. Monitored directly by BJP Udyog Aghadi coordinators.'
                        : lang === 'hi'
                        ? 'प्रत्यक्ष औद्योगिक शिकायत / पोर्टल सहायता — बाहरी सरकारी लिंक आवश्यक नहीं। भाजपा उद्योग अघाड़ी द्वारा सीधा फॉलो-अप।'
                        : 'थेट उद्योग तक्रार / पोर्टल साहाय्य — बाह्य शासकीय पोर्टल लिंक आवश्यक नाही. भाजप उद्योग आघाडीद्वारे थेट पाठपुरावा.'}
                    </span>
                  </div>
                )}

                {/* Unanswered Explanation */}
                <div className="mt-4">
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1.5">
                    {lang === 'en'
                      ? 'Grievance Details & Action Needed:'
                      : lang === 'hi'
                      ? 'शिकायत का विस्तृत विवरण एवं अपेक्षित कार्रवाई:'
                      : 'तक्रारीचा सविस्तर तपशील व अपेक्षित तोडगा:'}
                  </h4>
                  <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-white border border-slate-200 p-4 rounded-xl whitespace-pre-line">
                    {activeGrievance.explanation}
                  </p>
                </div>
              </div>

              {/* Action Buttons for Office Bearers */}
              {isStaffUser && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    {!activeGrievance.assignedOfficeBearerId ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={handleTakeUpCase}
                        icon={<UserCheck className="w-4 h-4" />}
                      >
                        {t('grievances', 'takeUpBtn')}
                      </Button>
                    ) : (
                      <div className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>
                          {lang === 'en' ? 'Case Assigned To: ' : lang === 'hi' ? 'मामला सौंपा गया: ' : 'केस हाताळणी: '}
                          {activeGrievance.assignedOfficeBearerName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Local-to-State Escalation Trigger (Pune to Maharashtra) */}
                  {!activeGrievance.isEscalatedToState && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setEscalateModalOpen(true)}
                      icon={<ArrowUpRight className="w-4 h-4" />}
                    >
                      {t('grievances', 'escalateBtn')}
                    </Button>
                  )}
                </div>
              )}

              {/* Strict Private Timeline (Restricted to owner & authorized staff) */}
              <div className="pt-5 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#E35914]" />
                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                      {t('grievances', 'timelineTitle')}
                    </h4>
                  </div>
                  <span className="text-xs sm:text-sm text-slate-500 font-semibold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{lang === 'en' ? 'Confidential' : lang === 'hi' ? 'गोपनीय' : 'गोपनीय'}</span>
                  </span>
                </div>

                {/* Privacy Restriction Banner */}
                {isRestrictedView ? (
                  <div className="bg-amber-50 border border-amber-200 p-4 sm:p-5 rounded-2xl text-sm text-amber-900 flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-bold text-sm sm:text-base mb-1">
                        {lang === 'en' ? 'Restricted Access' : lang === 'hi' ? 'सीमित पहुंच (Restricted Access)' : 'प्रवेश मर्यादित (Restricted Access)'}
                      </div>
                      <p className="leading-relaxed text-xs sm:text-sm">
                        {t('grievances', 'privacyNotice')}
                      </p>
                      <p className="mt-1 text-xs text-amber-700">
                        {lang === 'en'
                          ? 'Please sign in with the original business owner or authorized staff account to inspect the confidential resolution notes.'
                          : lang === 'hi'
                          ? 'टाइमलाइन देखने हेतु शिकायतकर्ता उद्योग स्वामी अथवा अधिकृत पदाधिकारी खाते से लॉगिन करें।'
                          : 'टाइमलाइन पाहण्यासाठी तक्रारदार मूळ उद्योग मालक किंवा अधिकृत पदाधिकारी खात्यातून लॉगिन करा.'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Security Notice for authorized viewers */}
                    <div className="bg-slate-50 border border-slate-200 p-3 sm:p-3.5 rounded-xl text-xs sm:text-sm text-slate-700 font-medium flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#136938] flex-shrink-0" />
                      <span>{t('grievances', 'privacyNotice')}</span>
                    </div>

                    {/* Timeline items */}
                    <div className="border-l-2 border-slate-200 ml-3 pl-4 sm:pl-5 space-y-4 py-2">
                      {activeGrievance.updates.map((up) => (
                        <div key={up.id} className="relative">
                          <div className="absolute -left-[21px] sm:-left-[25px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#E35914] border-2 border-white ring-2 ring-orange-100" />
                          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-600 mb-1.5">
                            <span className="font-extrabold text-slate-900 text-sm sm:text-base">{up.authorName}</span>
                            <span className="text-xs text-slate-400">{new Date(up.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="text-sm sm:text-base text-slate-800 bg-slate-50 p-3.5 sm:p-4 rounded-xl border border-slate-200 leading-relaxed font-normal">
                            {up.updateNotes}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Update Box for Staff / Owner */}
                    <div className="flex items-center gap-2.5 pt-2">
                      <input
                        type="text"
                        value={updateText}
                        onChange={(e) => setUpdateText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddUpdate();
                        }}
                        placeholder={
                          lang === 'en'
                            ? 'Add a progress note or case resolution update...'
                            : lang === 'hi'
                            ? 'शिकायत फॉलो-अप पर नई टिप्पणी / स्थिति दर्ज करें...'
                            : 'तक्रारीच्या पाठपुराव्याची नवीन स्थिती / शेरा लिहा...'
                        }
                        className="w-full text-xs sm:text-sm px-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-slate-50/50 font-medium"
                      />
                      <Button
                        variant="primary"
                        size="md"
                        onClick={handleAddUpdate}
                        className="px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold rounded-xl flex-shrink-0 shadow-sm"
                        icon={<Send className="w-4 h-4" />}
                      >
                        {t('grievances', 'addUpdateBtn')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            );
          })() : !currentUser ? (
            /* GUEST VIEW: NO SAMPLE GRIEVANCES! Clean, Official Confidential Desk Guidance */
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center flex-shrink-0 text-[#D95F1A]">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      {lang === 'en'
                        ? 'Confidential & Secure Industrial Grievance Desk'
                        : 'गोपनीय व सुरक्षित औद्योगिक तक्रार निवारण कक्ष'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                      {lang === 'en'
                        ? '100% private and protected. Individual grievances are never exposed publicly.'
                        : '१००% सुरक्षित व गोपनीय. कोणत्याही उद्योजकाची तक्रार सार्वजनिकरीत्या दाखवली जात नाही.'}
                    </p>
                  </div>
                </div>
                <span className="self-start sm:self-auto text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'Statutory Privacy Protected' : 'शासकीय गोपनीयता संरक्षण'}</span>
                </span>
              </div>

              {/* 3 Guidance Columns (Enlarged & Prominent Sample Cards) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#D95F1A] flex items-center justify-center mb-3 font-black text-base">
                      १
                    </div>
                    <h4 className="font-black text-base sm:text-lg text-slate-900 mb-2">
                      {lang === 'en' ? 'Track by Tracking ID' : 'ट्रॅकिंग आयडीने सद्यस्थिती'}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {lang === 'en'
                        ? 'Enter your grievance tracking number (e.g. BUS-GRV-2026-0814) in the search bar above to see official notes and status.'
                        : 'आपला ट्रॅकिंग क्रमांक (उदा. BUS-GRV-2026-0814) वरील शोधपट्टीमध्ये टाकून तात्काळ सद्यस्थिती व समन्वयक शेरा तपासा.'}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#136938] flex items-center justify-center mb-3 font-black text-base">
                      २
                    </div>
                    <h4 className="font-black text-base sm:text-lg text-slate-900 mb-2">
                      {lang === 'en' ? 'Register New Grievance' : 'नवीन तक्रार पाठपुरावा नोंदवा'}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {lang === 'en'
                        ? 'Have an unanswered government portal grievance or direct industrial issue? Click the orange button above.'
                        : 'शासकीय पोर्टलवरील अनुत्तरित तक्रार किंवा थेट औद्योगिक अडचण मांडण्यासाठी वरील "+ तक्रार पाठपुरावा नोंदवा" बटणाचा वापर करा.'}
                    </p>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between shadow-2xs hover:shadow-md transition-shadow">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3 font-black text-base">
                      ३
                    </div>
                    <h4 className="font-black text-base sm:text-lg text-slate-900 mb-2">
                      {lang === 'en' ? 'Sign In to View All Cases' : 'सर्व अर्ज पाहण्यासाठी लॉगिन करा'}
                    </h4>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                      {lang === 'en'
                        ? 'Log in to your enterprise profile to access your complete history of submitted grievances and updates.'
                        : 'आपल्या उद्योजक खात्यात लॉगिन केल्यास आपल्या सर्व नोंदणीकृत तक्रारी आणि अधिकाऱ्यांचे शेरे थेट उपलब्ध होतील.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Call to action bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="text-xs sm:text-sm text-slate-600 font-medium">
                  आपले सरकार, महावितरण किंवा एमआयडीसी संदर्भातील प्रलंबित प्रकरणे भाजप उद्योग सेतूमार्फत संबंधित विभागांकडे वर्ग केली जातात.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const loginBtn = document.querySelector('[aria-label="Account Login or Registration menu"]') as HTMLElement;
                    if (loginBtn) loginBtn.click();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
                >
                  {lang === 'en' ? 'Sign In to View My Grievances' : 'माझे अर्ज पाहण्यासाठी लॉगिन करा'}
                </button>
              </div>
            </div>
          ) : (
            /* Logged-in with 0 cases */
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-500 p-6 space-y-3">
              <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-semibold text-slate-700">
                {lang === 'en'
                  ? 'You have not submitted any grievances yet.'
                  : 'आपल्या खात्यावर अद्याप कोणतीही तक्रार नोंदवलेली नाही.'}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/grievances/new')}
              >
                {lang === 'en' ? 'Register New Grievance' : 'नवीन तक्रार पाठपुरावा नोंदवा'}
              </Button>
            </div>
          )}
        </div>
      </div>

      <NewGrievanceModal
        isOpen={newModalOpen}
        onClose={() => {
          setNewModalOpen(false);
          fetchGrievances();
        }}
      />

      {activeGrievance && (
        <EscalationModal
          isOpen={escalateModalOpen}
          onClose={() => setEscalateModalOpen(false)}
          grievanceId={activeGrievance.id}
          trackingId={activeGrievance.trackingId}
          onSuccess={() => {
            fetchGrievances();
            loadGrievanceDetails(activeGrievance.trackingId);
          }}
        />
      )}
    </div>
  );
};
