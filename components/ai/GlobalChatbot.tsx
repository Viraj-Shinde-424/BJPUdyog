import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context/AppContext';
import { Language } from '@/lib/types';
import {
  MessageSquare,
  Sparkles,
  X,
  Minimize2,
  Maximize2,
  Send,
  Compass,
  Award,
  ExternalLink,
  Copy,
  Check,
  Bot,
  User,
  RefreshCw,
  Globe,
  ChevronDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  category?: 'schemes' | 'startup_guidance' | 'general';
  sources?: { title: string; url: string; department: string }[];
  suggestedPrompts?: string[];
  timestamp: string;
}

export const GlobalChatbot: React.FC = () => {
  const { lang, setLang } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'all' | 'schemes' | 'guidance'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialWelcomeText = {
    mr: `नमस्कार! मी **उद्योग सारथी AI** — भाजप उद्योग आघाडी, महाराष्ट्राचा अधिकृत डिजिटल सल्लागार.\n\nमी आपल्याला खालील विषयांवर थेट मार्गदर्शन करू शकतो:\n* **शासकीय योजना व सबसिडी**: PSI 2019, CMEGP (₹50 लाख कर्ज), सोलर रूफटॉप, अन्न प्रक्रिया इ.\n* **नवीन उद्योग सुरू करण्याची प्रक्रिया**: MIDC जागा, MPCB प्रदूषण परवाने, MAITRI सिंगल विंडो, फॅक्टरी लायसन्स.\n\nआपल्या उद्योगाबद्दल कोणताही प्रश्न विचारा!`,
    hi: `नमस्ते! मैं **उद्योग सारथी AI** — भाजपा उद्योग अघाड़ी, महाराष्ट्र का आधिकारिक डिजिटल सलाहकार।\n\nमैं आपको निम्न विषयों पर तुरंत सहायता प्रदान कर सकता हूँ:\n* **सरकारी योजनाएं एवं सब्सिडी**: PSI 2019, CMEGP (₹50 लाख तक ऋण), सोलर रूफटॉप, फूड प्रोसेसिंग आदि।\n* **उद्योग स्थापना प्रक्रिया**: MIDC प्लॉट, MPCB प्रदूषण अनापत्ति, MAITRI सिंगल विंडो, फैक्ट्री लाइसेंस।\n\nअपने उद्योग से संबंधित कोई भी प्रश्न पूछें!`,
    en: `Hello! I am **Udyog Saarthi AI** — the official industrial and schemes advisor of BJP Udyog Aghadi, Maharashtra.\n\nI can help you explore:\n* **Government Schemes & Subsidies**: PSI 2019, CMEGP (up to ₹50L loans), Solar incentives, PMFME.\n* **Step-by-step Startup Guidance**: MIDC land allotment, MPCB clearances, MAITRI single-window, DISH licenses.\n\nAsk any question about starting or expanding your enterprise!`,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: initialWelcomeText[lang] || initialWelcomeText.mr,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        { title: 'MAITRI Maharashtra Single Window', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
        { title: 'MIDC Official Portal', url: 'https://midc.maharashtra.gov.in', department: 'MIDC' },
      ],
      suggestedPrompts: [
        lang === 'en' ? 'What documents are required to start a foundry in Pune?' : 'पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?',
        lang === 'en' ? 'Solar Rooftop Subsidies for MSME' : 'सोलर रूफटॉप सबसिडी व सवलती',
        lang === 'en' ? 'CMEGP ₹50 Lakh loan eligibility' : 'CMEGP ५० लाख कर्ज व सबसिडी पात्रता',
      ],
    },
  ]);

  // Update welcome message if language switches while only welcome message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'msg-welcome') {
      setMessages([
        {
          id: 'msg-welcome',
          sender: 'assistant',
          text: initialWelcomeText[lang] || initialWelcomeText.mr,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: [
            { title: 'MAITRI Maharashtra Single Window', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
            { title: 'MIDC Official Portal', url: 'https://midc.maharashtra.gov.in', department: 'MIDC' },
          ],
          suggestedPrompts: [
            lang === 'en' ? 'What documents are required to start a foundry in Pune?' : 'पुण्यात फाउंड्री सुरू करण्यासाठी कोणती कागदपत्रे लागतील?',
            lang === 'en' ? 'Solar Rooftop Subsidies for MSME' : 'सोलर रूफटॉप सबसिडी व सवलती',
            lang === 'en' ? 'CMEGP ₹50 Lakh loan eligibility' : 'CMEGP ५० लाख कर्ज व सबसिडी पात्रता',
          ],
        },
      ]);
    }
  }, [lang]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isMinimized]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          lang,
          mode: activeMode,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        const assistantMsg: ChatMessage = {
          id: `msg-assistant-${Date.now()}`,
          sender: 'assistant',
          text: data.answer,
          category: data.category,
          sources: data.sources || [],
          suggestedPrompts: data.suggestedPrompts || [],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text:
          lang === 'en'
            ? 'Sorry, unable to connect to the AI service right now. Please try again or check official portals.'
            : 'क्षमस्व, AI सर्व्हरशी संपर्क होऊ शकला नाही. कृपया पुन्हा प्रयत्न करा किंवा अधिकृत पोर्टल तपासा.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderFormattedMarkdown = (content: string) => {
    // Clean and split lines for rich structured presentation
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="text-sm font-black text-slate-900 mt-2 mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-[#E35914] rounded-full inline-block" />
            <span>{line.replace('### ', '')}</span>
          </h4>
        );
      }
      if (line.startsWith('#### ')) {
        return (
          <h5 key={idx} className="text-xs font-bold text-slate-800 mt-2 mb-1">
            {line.replace('#### ', '')}
          </h5>
        );
      }
      if (line.startsWith('- **') || line.startsWith('* **')) {
        const parts = line.replace(/^[-*]\s+/, '').split('**:');
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 leading-relaxed my-0.5">
            <strong className="text-slate-900 font-bold">{parts[0].replace(/\*\*/g, '')}:</strong>
            <span>{parts[1] || ''}</span>
          </li>
        );
      }
      if (line.match(/^\d+\.\s+\*\*/)) {
        return (
          <div key={idx} className="text-xs text-slate-800 leading-relaxed my-1 pl-1">
            <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>') }} />
          </div>
        );
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-600 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: line.replace(/^[-*]\s+/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
          </li>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed my-0.5">
          <span dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>') }} />
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating Action Trigger Button (Bottom Right) */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex items-center gap-3">
          {/* Animated Pill Tooltip on wide screens */}
          <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full border border-orange-200 shadow-lg text-xs font-bold text-slate-800 animate-float-slow">
            <span className="w-2 h-2 rounded-full bg-[#136938] animate-pulse" />
            <span>{lang === 'en' ? 'AI Udyog Saarthi • Ask Schemes & Startup Steps' : 'AI उद्योग सारथी • विचारा काहीही'}</span>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#E35914] via-[#F26419] to-amber-500 text-white shadow-2xl shadow-orange-500/40 hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-orange-400/25 cursor-pointer"
            aria-label="Open AI Udyog Saarthi Chatbot"
          >
            {/* Ambient Pulse Ring */}
            <span className="absolute -inset-1 rounded-full bg-orange-400/30 animate-ping opacity-60 pointer-events-none" />

            <div className="relative flex flex-col items-center justify-center">
              <Bot className="w-6 h-6 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-[9px] font-black tracking-tight leading-none mt-0.5 uppercase">AI सारथी</span>
            </div>
          </button>
        </div>
      )}

      {/* Slide-up Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-32px)] sm:w-[430px] rounded-3xl bg-white/95 backdrop-blur-2xl border-2 border-slate-200 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[calc(100vh-48px)]'
          }`}
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 text-white p-3.5 sm:p-4 flex items-center justify-between border-b border-slate-700/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#E35914] to-amber-400 flex items-center justify-center text-white shadow-md shadow-orange-500/30 flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm text-white tracking-tight leading-none">
                    उद्योग सारथी AI
                  </h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-slate-300 mt-0.5 leading-none">
                  {lang === 'en'
                    ? 'AI Schemes & Startup Navigator'
                    : '२४/७ उद्योग व शासकीय योजना मार्गदर्शक'}
                </p>
              </div>
            </div>

            {/* Header Controls: Language Switcher & Window actions */}
            <div className="flex items-center gap-1.5">
              {/* Language Switch Pills */}
              <div className="inline-flex rounded-lg bg-slate-800/90 p-0.5 border border-slate-700 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setLang('mr')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    lang === 'mr' ? 'bg-[#E35914] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  मराठी
                </button>
                <button
                  type="button"
                  onClick={() => setLang('hi')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    lang === 'hi' ? 'bg-[#E35914] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिंदी
                </button>
                <button
                  type="button"
                  onClick={() => setLang('en')}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    lang === 'en' ? 'bg-[#E35914] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Minimize */}
              <button
                type="button"
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title={isMinimized ? 'Expand' : 'Minimize'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Mode Switcher Filter Bar */}
              <div className="bg-slate-100/90 px-3 py-2 border-b border-slate-200/90 flex items-center justify-between gap-1 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveMode('all')}
                  className={`px-2.5 py-1 rounded-full transition-all ${
                    activeMode === 'all'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white/70'
                  }`}
                >
                  {lang === 'en' ? 'All Topics' : 'सर्व विषय'}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('schemes')}
                  className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    activeMode === 'schemes'
                      ? 'bg-[#136938] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white/70'
                  }`}
                >
                  <Award className="w-3 h-3 text-emerald-500" />
                  <span>{lang === 'en' ? 'Schemes & Subsidies' : 'शासकीय योजना'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMode('guidance')}
                  className={`px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                    activeMode === 'guidance'
                      ? 'bg-[#E35914] text-white shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 bg-white/70'
                  }`}
                >
                  <Compass className="w-3 h-3 text-orange-500" />
                  <span>{lang === 'en' ? 'Startup Steps' : 'उद्योग उभारणी'}</span>
                </button>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 ${
                      msg.sender === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {msg.sender === 'assistant' && (
                      <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#E35914] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs relative group ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#E35914] to-[#F26419] text-white font-medium rounded-tr-xs'
                          : 'bg-white border border-slate-200 text-slate-800 rounded-tl-xs'
                      }`}
                    >
                      {msg.sender === 'assistant' ? (
                        <div>
                          {renderFormattedMarkdown(msg.text)}

                          {/* Sources list if available */}
                          {msg.sources && msg.sources.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 block mb-1">
                                {lang === 'en' ? 'Official Government Sources:' : 'अधिकृत शासकीय स्रोत:'}
                              </span>
                              <div className="flex flex-wrap gap-1.5">
                                {msg.sources.map((s, si) => (
                                  <a
                                    key={si}
                                    href={s.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-50 hover:bg-orange-50 text-[10px] font-semibold text-slate-700 hover:text-[#E35914] border border-slate-200 hover:border-orange-200 transition-colors"
                                  >
                                    <span>{s.title}</span>
                                    <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Suggested prompt chips */}
                          {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                            <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                              {msg.suggestedPrompts.map((p, pi) => (
                                <button
                                  key={pi}
                                  type="button"
                                  onClick={() => handleSendMessage(p)}
                                  className="text-[10px] font-medium text-slate-700 bg-orange-50 hover:bg-orange-100 text-[#E35914] px-2 py-1 rounded-full border border-orange-200 transition-colors text-left"
                                >
                                  👉 {p}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* Copy Action */}
                          <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                            <span>{msg.timestamp}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyText(msg.text, msg.id)}
                              className="opacity-70 group-hover:opacity-100 flex items-center gap-1 hover:text-[#E35914] transition-colors"
                              title="Copy Answer"
                            >
                              {copiedId === msg.id ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-600 font-bold">कॉपी झाले</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>कॉपी करा</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-xs leading-relaxed">{msg.text}</p>
                          <span className="text-[10px] text-orange-200 block text-right mt-1">
                            {msg.timestamp}
                          </span>
                        </div>
                      )}
                    </div>

                    {msg.sender === 'user' && (
                      <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                ))}

                {/* Thinking loader */}
                {loading && (
                  <div className="flex gap-2.5 items-start">
                    <div className="w-7 h-7 rounded-xl bg-orange-100 text-[#E35914] flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 animate-spin" />
                    </div>
                    <div className="bg-white border border-slate-200 rounded-2xl p-3 text-xs text-slate-600 shadow-xs flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E35914] animate-bounce" />
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce delay-100" />
                      <span className="w-2 h-2 rounded-full bg-[#136938] animate-bounce delay-200" />
                      <span className="font-semibold text-slate-700 ml-1">
                        {lang === 'en'
                          ? 'Searching official government databases...'
                          : 'अधिकृत शासकीय डेटाबेस शोधत आहे...'}
                      </span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 bg-white border-t border-slate-200/90">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={
                      lang === 'en'
                        ? 'Ask anything (e.g. foundry steps, CMEGP subsidy...)'
                        : 'कोणताही प्रश्न विचारा (उदा. फाउंड्री परवाने, CMEGP सबसिडी...)'
                    }
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-[#E35914] focus:ring-2 focus:ring-orange-100 focus:outline-none bg-slate-50 focus:bg-white transition-all font-medium text-slate-900 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || loading}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-[#E35914] to-[#F26419] text-white shadow-md shadow-orange-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200 flex items-center justify-center cursor-pointer"
                    aria-label="Send query"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
                  <span>भाजप उद्योग आघाडी • अधिकृत AI मार्गदर्शक</span>
                  <span className="font-mono">महाराष्ट्र व केंद्र शासन</span>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
