import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface EscalationModalProps {
  isOpen: boolean;
  onClose: () => void;
  grievanceId: string;
  trackingId: string;
  onSuccess: () => void;
}

export const EscalationModal: React.FC<EscalationModalProps> = ({
  isOpen,
  onClose,
  grievanceId,
  trackingId,
  onSuccess,
}) => {
  const { lang, currentUser, stateEscalationEnabled, setStateEscalationEnabled, t } = useApp();

  const [reason, setReason] = useState(
    lang === 'en'
      ? 'Requires policy intervention from Energy Ministry and state-level load enhancement approval.'
      : lang === 'hi'
      ? 'महावितरण सबस्टेशन लोड वृद्धि एवं ऊर्जा मंत्रालय स्तर पर नीतिगत निर्णय अपेक्षित है।'
      : 'महावितरण सबस्टेशन लोड वाढ व ऊर्जा मंत्रालय स्तरावरील धोरण निर्णय आवश्यक आहे.'
  );
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<any | null>(null);

  const handleEscalate = async (forceEnableOverride?: boolean) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/grievances/escalate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grievanceId,
          senderId: currentUser?.id,
          senderName:
            currentUser?.fullName ||
            (lang === 'en'
              ? 'Sunil Gaikwad (Pune District Convener)'
              : 'सुनील गायकवाड (पुणे जिल्हा संयोजक)'),
          senderDistrict: 'Pune',
          reason,
          ...(forceEnableOverride !== undefined && { forceEnable: forceEnableOverride }),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMsg(
          data.error ||
            (lang === 'en' ? 'Referral unsuccessful.' : lang === 'hi' ? 'रेफरल विफल रहा।' : 'रेफरल अयशस्वी.')
        );
      } else {
        setSuccessResult(data);
        onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStateFlag = (enabled: boolean) => {
    setStateEscalationEnabled(enabled);
    setErrorMsg(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('escalation', 'modalTitle')}
      subtitle={
        lang === 'en'
          ? `Tracking ID: ${trackingId} • Test Scenario: Pune District to Maharashtra State`
          : lang === 'hi'
          ? `ट्रैकिंग आईडी: ${trackingId} • परीक्षण परिदृश्य: पुणे जिला से महाराष्ट्र राज्य`
          : `ट्रॅकिंग आयडी: ${trackingId} • चाचणी: पुणे जिल्हा ते महाराष्ट्र राज्य`
      }
      maxWidth="md"
    >
      {successResult ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-100 text-[#136938] rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {lang === 'en'
              ? 'Escalation to State Office-Bearer Successful!'
              : lang === 'hi'
              ? 'राज्य स्तर पर रेफरल सफल!'
              : 'राज्य स्तरावर रेफरल यशस्वी!'}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
            {lang === 'en'
              ? 'The case has been escalated to Maharashtra State BJP Udyog Aghadi. Referral log and timestamps are securely archived.'
              : lang === 'hi'
              ? 'यह मामला महाराष्ट्र राज्य भाजपा उद्योग अघाड़ी को अग्रसारित कर दिया गया है। ऑडिट लॉग सुरक्षित दर्ज है।'
              : 'सदर केस महाराष्ट्र राज्य भाजप उद्योग आघाडीकडे वर्ग करण्यात आली आहे. पाठपुरावा नोंदी वेळेसह सुरक्षित ठेवल्या आहेत.'}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1 mb-5">
            <div>
              <strong>{lang === 'en' ? 'Sender:' : lang === 'hi' ? 'प्रेषक:' : 'प्रेषक:'}</strong>{' '}
              {successResult.escalation?.senderName} ({successResult.escalation?.senderDistrict})
            </div>
            <div>
              <strong>{lang === 'en' ? 'Target:' : lang === 'hi' ? 'लक्ष्य:' : 'लक्ष्य:'}</strong>{' '}
              {successResult.escalation?.targetJurisdiction}
            </div>
            <div>
              <strong>{lang === 'en' ? 'Timestamp:' : lang === 'hi' ? 'समय:' : 'वेळ:'}</strong>{' '}
              {new Date(successResult.escalation?.escalatedAt).toLocaleString()}
            </div>
            <div>
              <strong>{lang === 'en' ? 'Reason:' : lang === 'hi' ? 'कारण:' : 'कारण:'}</strong>{' '}
              {successResult.escalation?.reason}
            </div>
          </div>

          <Button variant="primary" size="sm" onClick={onClose}>
            {lang === 'en' ? 'Close' : lang === 'hi' ? 'बंद करें' : 'बंद करा'}
          </Button>
        </div>
      ) : (
        <div className="space-y-4 text-xs">
          {/* Active / Inactive State Banner */}
          {!stateEscalationEnabled ? (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-900 flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-[#F59E0B] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-0.5">
                  {lang === 'en'
                    ? 'State Routing Inactive'
                    : lang === 'hi'
                    ? 'राज्य स्तरीय रूटिंग वर्तमान में निष्क्रिय (Inactive)'
                    : 'राज्यस्तरीय राउटिंग सध्या निष्क्रिय (Inactive)'}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t('escalation', 'inactiveNotice')}
                </p>
                <div className="mt-2 pt-2 border-t border-amber-200 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">
                    {lang === 'en' ? 'Enable for test demo:' : lang === 'hi' ? 'परीक्षण हेतु सक्रिय करें:' : 'चाचणीसाठी सक्रिय करा:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleStateFlag(true)}
                    className="text-[10px] font-bold text-[#E35914] bg-white border border-orange-300 px-2 py-0.5 rounded shadow-2xs hover:bg-orange-50"
                  >
                    {lang === 'en' ? 'Enable Config' : 'सक्रिय करा (Enable Config)'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-emerald-900 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-[#136938] flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-bold mb-0.5">
                  {lang === 'en'
                    ? 'State Routing Active'
                    : lang === 'hi'
                    ? 'राज्य स्तरीय रूटिंग सक्रिय है'
                    : 'राज्यस्तरीय राउटिंग सक्रिय आहे'}
                </div>
                <p className="text-[11px] leading-relaxed">
                  {t('escalation', 'activeNotice')}
                </p>
                <div className="mt-2 pt-2 border-t border-emerald-200 flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-600">
                    {lang === 'en' ? 'Set inactive for test:' : lang === 'hi' ? 'निष्क्रिय स्थिति परीक्षण हेतु:' : 'निष्क्रिय स्थिती चाचणीसाठी:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleToggleStateFlag(false)}
                    className="text-[10px] font-bold text-slate-700 bg-white border border-slate-300 px-2 py-0.5 rounded shadow-2xs hover:bg-slate-100"
                  >
                    {lang === 'en' ? 'Set Inactive' : 'निष्क्रिय करा (Set Inactive)'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
            <div>
              <span className="text-slate-500">
                {lang === 'en' ? 'Local Office-Bearer Sender: ' : lang === 'hi' ? 'स्थानीय प्रेषक: ' : 'स्थानिक प्रेषक: '}
              </span>
              <strong>{currentUser?.fullName || (lang === 'en' ? 'Sunil Gaikwad' : 'सुनील गायकवाड')}</strong>{' '}
              ({lang === 'en' ? 'Pune District Convener' : 'पुणे जिल्हा संयोजक'})
            </div>
            <div>
              <span className="text-slate-500">
                {lang === 'en' ? 'Target Hierarchy: ' : lang === 'hi' ? 'लक्ष्य स्तर: ' : 'लक्ष्य स्तर: '}
              </span>
              <strong>
                {lang === 'en'
                  ? 'Maharashtra State BJP Udyog Aghadi'
                  : 'महाराष्ट्र राज्य भाजप उद्योग आघाडी'}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">
                {lang === 'en' ? 'Case Tracking ID: ' : lang === 'hi' ? 'प्रकरण आईडी: ' : 'प्रकरण: '}
              </span>
              <span className="font-mono font-bold">{trackingId}</span>
            </div>
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {t('escalation', 'reasonLabel')} *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={
                lang === 'en'
                  ? 'Explain why state-level ministerial or policy escalation is required...'
                  : lang === 'hi'
                  ? 'मंत्रालय स्तर पर किस नीतिगत निर्णय अथवा हस्तक्षेप की आवश्यकता है...'
                  : 'मंत्रालय पातळीवर कोणत्या धोरणात्मक हस्तक्षेपाची गरज आहे...'
              }
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <Button type="button" variant="outlined" onClick={onClose} size="sm">
              {lang === 'en' ? 'Cancel' : lang === 'hi' ? 'रद्द करें' : 'रद्द करा'}
            </Button>
            <Button
              type="button"
              variant="primary"
              disabled={loading}
              onClick={() => handleEscalate()}
              size="sm"
            >
              {loading
                ? lang === 'en'
                  ? 'Processing...'
                  : lang === 'hi'
                  ? 'प्रक्रिया जारी है...'
                  : 'प्रक्रिया सुरू आहे...'
                : t('escalation', 'confirmBtn')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};
