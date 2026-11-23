import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { GrievanceType } from '@/lib/types';
import { Copy, CheckCircle2, FileQuestion, HelpCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface NewGrievanceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewGrievanceModal: React.FC<NewGrievanceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, currentUser, t } = useApp();

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
          ownerId: currentUser?.id,
          grievanceType,
          subject:
            subject ||
            (grievanceType === 'unanswered_gov'
              ? lang === 'en'
                ? 'Government Portal Unanswered Follow-up'
                : 'शासकीय पोर्टल प्रलंबित पाठपुरावा'
              : lang === 'en'
              ? 'Direct Industrial Complaint'
              : 'थेट औद्योगिक तक्रार'),
          businessName,
          district,
          contactPhone,
          originalGrievanceLink:
            grievanceType === 'unanswered_gov'
              ? originalGrievanceLink
              : originalGrievanceLink || undefined,
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

  const handleResetAndClose = () => {
    setIssuedTrackingId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={
        lang === 'en'
          ? 'Register Grievance & Escalation'
          : lang === 'hi'
          ? 'शिकायत निवारण एवं समाधान सहायता'
          : 'तक्रार निवारण व पाठपुरावा नोंद'
      }
      subtitle={
        lang === 'en'
          ? 'File an unanswered government portal grievance, a direct industrial problem, or a website assistance request.'
          : lang === 'hi'
          ? 'लंबित सरकारी पोर्टल शिकायत, प्रत्यक्ष औद्योगिक समस्या अथवा पोर्टल सहायता हेतु शिकायत दर्ज करें।'
          : 'प्रलंबित शासकीय तक्रार पाठपुरावा, थेट औद्योगिक अडचण किंवा पोर्टल सहाय्यासाठी तक्रार नोंदवा.'
      }
      maxWidth="md"
    >
      {issuedTrackingId ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-emerald-100 text-[#136938] rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">
            {lang === 'en'
              ? 'Grievance Registered Successfully!'
              : lang === 'hi'
              ? 'शिकायत सफलतापूर्वक दर्ज की गई!'
              : 'तक्रार नोंद यशस्वी!'}
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto mb-4">
            {lang === 'en'
              ? 'Your grievance has been submitted to local BJP Udyog Aghadi coordinators for follow-up.'
              : lang === 'hi'
              ? 'आपकी शिकायत भाजपा उद्योग अघाड़ी के स्थानीय समन्वयकों को भेज दी गई है।'
              : 'आपली तक्रार भाजप उद्योग आघाडीच्या स्थानिक समन्वयकांकडे पाठवण्यात आली आहे.'}
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-sm mx-auto mb-6">
            <div className="text-[11px] text-slate-500 font-semibold mb-1">
              {lang === 'en'
                ? 'Independent Udyog Setu Tracking ID:'
                : lang === 'hi'
                ? 'उद्योग सेतु स्वतंत्र ट्रैकिंग आईडी:'
                : 'उद्योग सेतू स्वतंत्र ट्रॅकिंग आयडी:'}
            </div>
            <div className="text-lg font-mono font-bold text-[#E35914] flex items-center justify-center gap-2">
              <span>{issuedTrackingId}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 rounded hover:bg-slate-200 text-slate-600 transition-colors"
                title="Copy ID"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
          </div>

          <Button variant="primary" size="md" onClick={handleResetAndClose}>
            {lang === 'en' ? 'Close & View Status' : lang === 'hi' ? 'बंद करें एवं स्थिति देखें' : 'बंद करा व स्थिती पहा'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Grievance Type Selector */}
          <div>
            <label className="block font-bold text-slate-800 mb-1.5">
              {lang === 'en'
                ? 'Select Grievance Category'
                : lang === 'hi'
                ? 'शिकायत की श्रेणी चुनें'
                : 'तक्रारीचा प्रकार निवडा'}{' '}
              *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Type 1: Unanswered Gov Grievance */}
              <button
                type="button"
                onClick={() => setGrievanceType('unanswered_gov')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  grievanceType === 'unanswered_gov'
                    ? 'border-[#E35914] bg-orange-50 text-[#E35914] ring-2 ring-orange-200'
                    : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <FileQuestion className="w-3.5 h-3.5 text-[#E35914]" />
                  <span>
                    {lang === 'en'
                      ? 'Unanswered Gov Portal'
                      : lang === 'hi'
                      ? 'लंबित सरकारी शिकायत'
                      : 'प्रलंबित शासकीय तक्रार'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">
                  {lang === 'en'
                    ? 'Pending on Aaple Sarkar / MIDC (Gov Link required)'
                    : lang === 'hi'
                    ? 'आपले सरकार / MIDC पोर्टल पर लंबित (लिंक अनिवार्य)'
                    : 'आपले सरकार / MIDC पोर्टलवरील अनुत्तरित तक्रार (लिंक आवश्यक)'}
                </span>
              </button>

              {/* Type 2: Direct Industrial Grievance */}
              <button
                type="button"
                onClick={() => setGrievanceType('direct_industrial')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  grievanceType === 'direct_industrial'
                    ? 'border-[#136938] bg-emerald-50 text-[#136938] ring-2 ring-emerald-200'
                    : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-[#136938]" />
                  <span>
                    {lang === 'en'
                      ? 'Direct Industrial Issue'
                      : lang === 'hi'
                      ? 'प्रत्यक्ष औद्योगिक समस्या'
                      : 'थेट औद्योगिक तक्रार'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">
                  {lang === 'en'
                    ? 'Power, roads, infrastructure, zoning (No gov link needed)'
                    : lang === 'hi'
                    ? 'बिजली, सड़क, बुनियादी ढांचा (सरकारी लिंक आवश्यक नहीं)'
                    : 'एमआयडीसी, वीज, रस्ते, स्थानिक अडचण (शासकीय लिंकची गरज नाही)'}
                </span>
              </button>

              {/* Type 3: Website Issue */}
              <button
                type="button"
                onClick={() => setGrievanceType('website_issue')}
                className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  grievanceType === 'website_issue'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200'
                    : 'border-slate-200 text-slate-700 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>
                    {lang === 'en'
                      ? 'Portal Support'
                      : lang === 'hi'
                      ? 'पोर्टल सहायता'
                      : 'पोर्टल सहाय्य / तक्रार'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-normal">
                  {lang === 'en'
                    ? 'Registration, directory profile or tech issues'
                    : lang === 'hi'
                    ? 'पंजीकरण, प्रोफाइल या तकनीकी समस्या'
                    : 'उद्योग सेतू नोंदणी, प्रोफाइल किंवा तांत्रिक अडचणींबाबत'}
                </span>
              </button>
            </div>
          </div>

          {/* Subject field */}
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en'
                ? 'Grievance Subject / Issue Title'
                : lang === 'hi'
                ? 'शिकायत का विषय / शीर्षक'
                : 'तक्रारीचा विषय'}{' '}
              *
            </label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={
                grievanceType === 'unanswered_gov'
                  ? lang === 'en'
                    ? 'e.g. MSEDCL 11 KV HT industrial electricity connection pending...'
                    : lang === 'hi'
                    ? 'उदा. महावितरण 11 KV HT औद्योगिक विद्युत कनेक्शन लंबित...'
                    : 'उदा. महावितरण ११ केव्ही उच्च दाब वीज जोडणी प्रलंबित...'
                  : grievanceType === 'direct_industrial'
                  ? lang === 'en'
                    ? 'e.g. Chakan MIDC Phase 2 internal roads and street lights in disrepair...'
                    : lang === 'hi'
                    ? 'उदा. चाकण एमआईडीसी चरण 2 आंतरिक सड़कें एवं स्ट्रीट लाइट्स समस्या...'
                    : 'उदा. चाकण एमआयडीसी टप्पा २ मधील मुख्य अंतर्गत रस्ते व पथदिवे दुरवस्था...'
                  : lang === 'en'
                  ? 'e.g. Difficulty updating enterprise profile in business directory...'
                  : lang === 'hi'
                  ? 'उदा. उद्योग डायरेक्टरी में कंपनी प्रोफाइल अपडेट करने में समस्या...'
                  : 'उदा. उद्योग डिरेक्टरीमध्ये कंपनी प्रोफाइल अपडेट करताना अडचण...'
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                {lang === 'en' ? 'Enterprise / Business Name' : lang === 'hi' ? 'उद्योग / संस्था का नाम' : 'उद्योग / आस्थापनेचे नाव'} *
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
                {lang === 'en' ? 'District' : lang === 'hi' ? 'जिला' : 'जिल्हा'} *
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

          {/* Conditional Gov Link for Unanswered Gov Grievance */}
          {grievanceType === 'unanswered_gov' ? (
            <div className="bg-orange-50/70 p-3 rounded-xl border border-orange-200 space-y-3">
              <div>
                <label className="block font-bold text-orange-950 mb-1">
                  {lang === 'en'
                    ? 'Original Government Grievance Link (Aaple Sarkar / MIDC / MSEDCL)'
                    : lang === 'hi'
                    ? 'मूल सरकारी शिकायत लिंक (Aaple Sarkar / MIDC / महावितरण)'
                    : 'मूळ शासकीय तक्रार लिंक (Aaple Sarkar / MIDC / महावितरण)'}{' '}
                  *
                </label>
                <input
                  type="url"
                  required
                  value={originalGrievanceLink}
                  onChange={(e) => setOriginalGrievanceLink(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-orange-300 focus:border-[#E35914] focus:outline-none font-mono text-xs bg-white"
                  placeholder="https://aaplesarkar.mahaonline.gov.in/en/Grievance/Track/..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {lang === 'en' ? 'Original Token / Reference No. (if known)' : lang === 'hi' ? 'मूल टोकन / संदर्भ संख्या (यदि उपलब्ध हो)' : 'मूळ संदर्भ / टोकन क्रमांक (असल्यास)'}
                  </label>
                  <input
                    type="text"
                    value={originalReferenceNo}
                    onChange={(e) => setOriginalReferenceNo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white"
                    placeholder={lang === 'en' ? 'e.g. AS-2026-992144' : 'उदा. AS-2026-992144'}
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    {lang === 'en' ? 'Original Filing Date (if known)' : lang === 'hi' ? 'आवेदन दाखिल करने की तिथि (यदि उपलब्ध हो)' : 'मूळ अर्ज तारीख (असल्यास)'}
                  </label>
                  <input
                    type="date"
                    value={originalFilingDate}
                    onChange={(e) => setOriginalFilingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#136938] flex-shrink-0" />
              <span>
                {lang === 'en'
                  ? 'External government portal link is optional for this category. Local BJP Udyog Aghadi office-bearers will take up the issue directly.'
                  : lang === 'hi'
                  ? 'इस श्रेणी के लिए बाहरी सरकारी लिंक अनिवार्य नहीं है। भाजपा उद्योग अघाड़ी के स्थानीय पदाधिकारी सीधे संज्ञान लेंगे।'
                  : 'या प्रकारच्या तक्रारीसाठी बाह्य शासकीय पोर्टल लिंक अनिवार्य नाही. भाजप उद्योग आघाडीचे स्थानिक पदाधिकारी थेट दखल घेतील.'}
              </span>
            </div>
          )}

          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en'
                ? 'Detailed Explanation & Action Needed'
                : lang === 'hi'
                ? 'विस्तृत विवरण एवं अपेक्षित समाधान'
                : 'सविस्तर अडचण व अपेक्षित मदत'}{' '}
              *
            </label>
            <textarea
              required
              rows={4}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={
                lang === 'en'
                  ? 'Detail the specific issue, department involved, officials contacted, and what remains unresolved...'
                  : lang === 'hi'
                  ? 'समस्या का स्पष्ट विवरण, संबंधित विभाग, पूर्व संपर्क और क्या कार्य शेष है...'
                  : 'नेमकी काय अडचण आहे, कोणत्या विभागाशी संबंधित आहे, कोणाशी संपर्क झाला व काय कृती बाकी आहे...'
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
                : lang === 'en'
                ? 'Register Grievance Follow-up'
                : lang === 'hi'
                ? 'शिकायत फॉलो-अप दर्ज करें'
                : 'तक्रार पाठपुरावा नोंदवा'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
