import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { DocumentItem, StartupGuidance } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileQuestion,
  EyeOff,
  ExternalLink,
  Upload,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Send,
  MessageSquare,
  FileText,
} from 'lucide-react';

export const StartupSaarthiView: React.FC<{ initialQuery?: string }> = ({ initialQuery = '' }) => {
  const { lang, t } = useApp();
  const [query, setQuery] = useState(
    initialQuery || 'पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?'
  );
  const [guidance, setGuidance] = useState<StartupGuidance | any | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [activeUploadDocKey, setActiveUploadDocKey] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState<Record<string, boolean>>({});

  const handleSearch = async (searchQuery: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/startup-advisor?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.guidance) {
        setGuidance(data.guidance);
        // Add to chat history
        setChatHistory([
          { sender: 'user', text: searchQuery },
          {
            sender: 'ai',
            text:
              lang === 'en'
                ? `Here are the official compliance steps and required checklist for ${data.guidance.sector} in ${data.guidance.district}.`
                : `${data.guidance.district} मध्ये ${data.guidance.sector} सुरू करण्यासाठी अधिकृत शासकीय परवान्यांची क्रमवार यादी व कागदपत्रांची चेकलिस्ट खालीलप्रमाणे आहे.`,
          },
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatHistory((prev) => [...prev, { sender: 'user', text: userText }]);

    // Simulated intelligent assistant response with official source grounding
    setTimeout(() => {
      let aiReply = '';
      const lower = userText.toLowerCase();

      if (lower.includes('chimney') || lower.includes('चिमणी') || lower.includes('stack')) {
        aiReply =
          lang === 'en'
            ? 'For stack height calculations under MPCB norms: minimum 30 meters height with acoustic enclosures and bag filter dust collectors is mandatory. Official guidelines: https://www.mpcb.gov.in/'
            : 'MPCB नियमांनुसार फाउंड्री चिमणीची किमान उंची ३० मीटर असावी व बॅग फिल्टर धूळ नियंत्रक यंत्रणा अनिवार्य आहे. अधिकृत स्रोत: https://www.mpcb.gov.in/';
      } else if (lower.includes('power') || lower.includes('वीज') || lower.includes('tariff')) {
        aiReply =
          lang === 'en'
            ? 'Industrial HT-1 continuous tariff applies. Load sanction over 100 kVA requires dedicated 11/22 kV feeder line agreement with MSEDCL. Official portal: https://www.mahadiscom.in/'
            : 'इंडक्शन फर्नेससाठी HT-1 कंटिन्युअस दर लागू होतो. १०० केव्हीए पेक्षा जास्त भारासाठी महावितरणकडे ११/२२ केव्ही स्वतंत्र फिडर लाइन करार लागतो. अधिकृत पोर्टल: https://www.mahadiscom.in/';
      } else {
        aiReply =
          lang === 'en'
            ? 'Under Maharashtra Single Window (MAITRI), consolidated application form (CAF) covers MIDC, MPCB and Labour NOCs simultaneously within 30 days statutory service guarantee (RTS).'
            : 'महाराष्ट्र शासन ‘मैत्री’ (MAITRI) एक खिडकी योजनेअंतर्गत MIDC, MPCB आणि कामगार सुरक्षा परवाने एकत्रितपणे ३० दिवसांच्या सेवा हमी (RTS) कायद्यांतर्गत प्राप्त करता येतात.';
      }

      setChatHistory((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    }, 600);
  };

  // Document validation and replacement handler
  const handleValidateDoc = async (
    docKey: string,
    simulatedFileName: string,
    actionType: 'validate' | 'replace' = 'replace'
  ) => {
    setUploadLoading((prev) => ({ ...prev, [docKey]: true }));

    try {
      const res = await fetch('/api/startup-advisor/validate-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docKey,
          fileName: simulatedFileName,
          fileSize: 420000,
          mimeType: 'application/pdf',
          action: actionType,
        }),
      });

      const data = await res.json();
      if (data.success && data.document) {
        // Update document in checklist
        setGuidance((prev: any) => ({
          ...prev,
          checklist: prev.checklist.map((doc: DocumentItem) =>
            doc.key === docKey ? data.document : doc
          ),
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadLoading((prev) => ({ ...prev, [docKey]: false }));
    }
  };

  const getStatusBadge = (status: DocumentItem['status']) => {
    switch (status) {
      case 'present':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#136938] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{t('startupAdvisor', 'statusPresent')}</span>
          </span>
        );
      case 'needs_correction':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
            <AlertTriangle className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>{t('startupAdvisor', 'statusCorrection')}</span>
          </span>
        );
      case 'missing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>{t('startupAdvisor', 'statusMissing')}</span>
          </span>
        );
      case 'unreadable':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2.5 py-0.5 rounded-full">
            <EyeOff className="w-3.5 h-3.5" />
            <span>{t('startupAdvisor', 'statusUnreadable')}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Header (Public: visitors can ask before signing in) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-[#C84B0E] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E35914]" />
            <span>सार्वजनिक AI मार्गदर्शक • लॉगिन अनिवार्य नाही (Public)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
            {t('startupAdvisor', 'title')}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t('startupAdvisor', 'subtitle')}
          </p>
        </div>

        {/* Search input field */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(query);
          }}
          className="mt-4 flex flex-col sm:flex-row gap-2"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#E35914] absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="उदा. पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?"
              className="w-full text-xs sm:text-sm pl-10 pr-3 py-2.5 rounded-xl border border-slate-300 focus:border-[#E35914] focus:outline-none bg-[#F8FAFC]"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="flex-shrink-0"
          >
            {loading ? 'शोधत आहे...' : 'मार्गदर्शन मिळवा'}
          </Button>
        </form>

        {/* Quick Sample Query Chip */}
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="text-slate-400">जलद निवड:</span>
          <button
            type="button"
            onClick={() => {
              const q = 'पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?';
              setQuery(q);
              handleSearch(q);
            }}
            className="text-[11px] text-[#E35914] hover:underline bg-orange-50 px-2 py-0.5 rounded border border-orange-200 font-medium"
          >
            {t('startupAdvisor', 'sampleQueryBtn')}
          </button>
        </div>
      </div>

      {guidance && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content: Ordered Steps & Document Checklist */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ordered Steps to Setup */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[#E35914]" />
                  <span>{t('startupAdvisor', 'stepsTitle')}</span>
                </h3>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-semibold border border-slate-200">
                  {guidance.sector} • {guidance.district}
                </span>
              </div>

              <div className="space-y-4">
                {guidance.orderedSteps.map((step: any) => (
                  <div
                    key={step.stepNumber}
                    className="p-3.5 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-slate-300 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                        {lang === 'en'
                          ? step.titleEn
                          : lang === 'hi'
                          ? step.titleHi
                          : step.titleMr}
                      </h4>
                      <a
                        href={step.officialPortal}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#E35914] hover:underline flex items-center gap-1 font-semibold flex-shrink-0"
                      >
                        <span>{step.authority}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {lang === 'en'
                        ? step.descriptionEn
                        : lang === 'hi'
                        ? step.descriptionHi
                        : step.descriptionMr}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Document Checklist & AI Preparation Check (Requirement 7) */}
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#136938]" />
                    <span>{t('startupAdvisor', 'checklistTitle')}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    खाजगी PDF, JPG किंवा PNG फाईल्सची सामग्री व वाचनीयता तपासा.
                  </p>
                </div>

                {/* AI Preparation Check Badge */}
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-950 bg-orange-100 border border-orange-300 px-3 py-1 rounded-full flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-[#E35914]" />
                  <span>{t('startupAdvisor', 'aiCheckBadge')}</span>
                </span>
              </div>

              {/* Checklist Items */}
              <div className="space-y-4">
                {guidance.checklist.map((doc: DocumentItem) => {
                  const isLoading = !!uploadLoading[doc.key];

                  return (
                    <div
                      key={doc.key}
                      className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-2xs space-y-2.5"
                    >
                      {/* Doc Header: Name & Status */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                              {lang === 'en'
                                ? doc.nameEn
                                : lang === 'hi'
                                ? doc.nameHi
                                : doc.nameMr}
                            </h4>
                            {doc.required ? (
                              <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                अनिवार्य
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                सशर्त (Conditional)
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                            <span>प्राधिकरण: {doc.sourceAuthority}</span>
                            <span>•</span>
                            <a
                              href={doc.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#E35914] hover:underline flex items-center gap-0.5"
                            >
                              <span>अधिकृत स्रोत लिंक</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        {/* Status Badge: Present, Missing, Needs correction, or Unreadable */}
                        <div className="flex-shrink-0">{getStatusBadge(doc.status)}</div>
                      </div>

                      {/* File Details if uploaded */}
                      {doc.uploadedFileName && (
                        <div className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-200 flex items-center justify-between">
                          <span>अपलोड फाईल: {doc.uploadedFileName}</span>
                          {doc.uploadedFileSize && (
                            <span>{Math.round(doc.uploadedFileSize / 1024)} KB</span>
                          )}
                        </div>
                      )}

                      {/* Specific Reason & Next Action */}
                      {doc.reason && (
                        <div className="bg-slate-50/90 rounded-lg p-2.5 border border-slate-200 text-xs space-y-1">
                          <div className="text-slate-800">
                            <strong className="text-slate-900">तपासणी शेरा: </strong>
                            <span>
                              {lang === 'en'
                                ? doc.reason.en
                                : lang === 'hi'
                                ? doc.reason.hi
                                : doc.reason.mr}
                            </span>
                          </div>
                          {doc.nextAction && (
                            <div className="text-orange-950 font-medium">
                              <strong className="text-[#E35914]">पुढील कृती: </strong>
                              <span>
                                {lang === 'en'
                                  ? doc.nextAction.en
                                  : lang === 'hi'
                                  ? doc.nextAction.hi
                                  : doc.nextAction.mr}
                              </span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Document Replacement & Recheck Action (Requirement 7) */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        {doc.status !== 'present' ? (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isLoading}
                            onClick={() =>
                              handleValidateDoc(
                                doc.key,
                                `${doc.key}_signed_certified_2026.pdf`,
                                'replace'
                              )
                            }
                            icon={<Upload className="w-3.5 h-3.5" />}
                          >
                            {isLoading
                              ? 'तपासत आहे...'
                              : lang === 'en'
                              ? 'Upload Corrected File & Recheck'
                              : 'सुधारित फाईल अपलोड करून पुन्हा तपासा'}
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="sm"
                            disabled={isLoading}
                            onClick={() =>
                              handleValidateDoc(
                                doc.key,
                                `${doc.key}_rechecked_verified.pdf`,
                                'validate'
                              )
                            }
                            icon={<RefreshCw className="w-3.5 h-3.5" />}
                          >
                            {isLoading ? 'पडताळणी...' : 'पुन्हा तपासा (Recheck)'}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Right column: Interactive Chat & Official Source Links */}
          <div className="space-y-6">
            {/* Interactive Chatbot */}
            <Card className="p-5 flex flex-col h-[520px]">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <MessageSquare className="w-4 h-4 text-[#E35914]" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-900">
                  AI उद्योग सल्लागार चॅट (Follow-up)
                </h4>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs">
                {chatHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      item.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                        item.sender === 'user'
                          ? 'bg-[#E35914] text-white rounded-br-none shadow-xs'
                          : 'bg-slate-100 text-slate-800 rounded-bl-none border border-slate-200'
                      }`}
                    >
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="pt-2 border-t border-slate-100 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="उदा. चिमणी उंचीचे निकष काय आहेत?..."
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  पाठवा
                </Button>
              </form>
            </Card>

            {/* Official Source Links Group */}
            <Card className="p-5">
              <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider mb-3">
                अधिकृत शासकीय स्रोत (Official Links)
              </h4>
              <div className="space-y-2 text-xs">
                {guidance.officialSources.map((source: any, i: number) => (
                  <a
                    key={i}
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between border border-slate-200 transition-colors"
                  >
                    <span className="font-medium line-clamp-1">{source.name}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
