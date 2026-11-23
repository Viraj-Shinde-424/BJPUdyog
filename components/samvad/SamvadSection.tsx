import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '@/lib/context/AppContext';
import { SamvadTopic, SamvadCategory, OrganizerType } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import {
  MessageSquare,
  Users,
  Calendar,
  Send,
  Plus,
  CheckCircle2,
  MapPin,
  ChevronDown,
  ChevronUp,
  Tag,
  Search,
  Building,
  User,
  Sparkles,
  CalendarRange,
  PartyPopper,
  Factory,
  Filter,
  Award,
  Check,
  XCircle,
  Clock,
  LayoutGrid,
  List,
  ArrowRight,
  X,
} from 'lucide-react';
import { NewSamvadModal } from './NewSamvadModal';
import { localizeSamvadTopic, localizeSector } from '@/lib/i18n/dataLocalizer';

export const SamvadSection: React.FC = () => {
  const router = useRouter();
  const { lang, currentUser, t } = useApp();
  const [topics, setTopics] = useState<SamvadTopic[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrganizerType, setSelectedOrganizerType] = useState<string>('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedTopics, setExpandedTopics] = useState<Record<string, boolean>>({});
  const [selectedDetailTopic, setSelectedDetailTopic] = useState<SamvadTopic | null>(null);
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>({});
  const [registering, setRegistering] = useState<Record<string, boolean>>({});

  // Padadhikari invitation response state
  const [respondingTopicId, setRespondingTopicId] = useState<string | null>(null);
  const [responseStatus, setResponseStatus] = useState<'accepted' | 'declined'>('accepted');
  const [responseText, setResponseText] = useState('');
  const [submittingResponse, setSubmittingResponse] = useState(false);

  const fetchTopics = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSector !== 'all') params.set('sector', selectedSector);
      if (selectedCategory !== 'all') params.set('category', selectedCategory);
      if (selectedOrganizerType !== 'all') params.set('organizerType', selectedOrganizerType);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/samvad?${params.toString()}`);
      const data = await res.json();
      if (data.topics) {
        setTopics(data.topics);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, [selectedCategory, selectedOrganizerType, selectedSector]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchTopics();
  };

  const handleRegister = async (topicId: string) => {
    const userId = currentUser?.id || 'user-anand-kulkarni';
    setRegistering((prev) => ({ ...prev, [topicId]: true }));

    try {
      const res = await fetch('/api/samvad/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId, userId }),
      });

      const data = await res.json();
      if (data.success && data.topic) {
        setTopics((prev) =>
          prev.map((tp) => (tp.id === topicId ? data.topic : tp))
        );
        setSelectedDetailTopic((prev) => (prev?.id === topicId ? data.topic : prev));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRegistering((prev) => ({ ...prev, [topicId]: false }));
    }
  };

  const handleSendMessage = async (topicId: string) => {
    const text = messageInputs[topicId];
    if (!text || !text.trim()) return;

    try {
      const res = await fetch('/api/samvad/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          authorId: currentUser?.id,
          message: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        setTopics((prev) =>
          prev.map((tp) => {
            if (tp.id === topicId) {
              return {
                ...tp,
                messages: [...tp.messages, data.message],
              };
            }
            return tp;
          })
        );
        setSelectedDetailTopic((prev) =>
          prev?.id === topicId
            ? { ...prev, messages: [...prev.messages, data.message] }
            : prev
        );
        setMessageInputs((prev) => ({ ...prev, [topicId]: '' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTopic = (id: string) => {
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRespondInvitation = async (topicId: string) => {
    setSubmittingResponse(true);
    try {
      const res = await fetch('/api/samvad/respond-invitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          status: responseStatus,
          responseNotes:
            responseText.trim() ||
            (responseStatus === 'accepted'
              ? 'आपले निमंत्रण स्वीकारले असून भाजप उद्योग आघाडीच्या वतीने नियोजित वेळेत उपस्थित राहू.'
              : 'पूर्वनियोजित बैठकांमुळे उपस्थित राहता येत नाही. नवीन उपक्रमास मनःपूर्वक शुभेच्छा.'),
          responderName: currentUser?.fullName || 'मा. रवींद्र चव्हाण',
          responderTitle: currentUser?.officeBearerTitle || 'प्रदेश समन्वयक व मंत्री',
        }),
      });
      const data = await res.json();
      if (data.success && data.topic) {
        setTopics((prev) => prev.map((t) => (t.id === topicId ? data.topic : t)));
        setSelectedDetailTopic((prev) => (prev?.id === topicId ? data.topic : prev));
        setRespondingTopicId(null);
        setResponseText('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingResponse(false);
    }
  };

  const sectors = [
    'all',
    'Foundry & Metallurgy',
    'Auto & Engineering',
    'Plastics & Polymers',
    'Food Processing',
    'Electronics & IT',
  ];

  const categoryConfig: Record<string, { label: string; icon: any; bg: string; text: string }> = {
    event: {
      label: lang === 'en' ? 'Event' : 'कार्यक्रम',
      icon: CalendarRange,
      bg: 'bg-indigo-50 border-indigo-200',
      text: 'text-indigo-800',
    },
    discussion: {
      label: lang === 'en' ? 'Discussion' : 'चर्चा मंच',
      icon: MessageSquare,
      bg: 'bg-amber-50 border-amber-300',
      text: 'text-amber-900',
    },
    factory_tour: {
      label: lang === 'en' ? 'Factory Tour' : 'फॅक्टरी टूर',
      icon: Factory,
      bg: 'bg-teal-50 border-teal-200',
      text: 'text-teal-800',
    },
    inauguration: {
      label: lang === 'en' ? 'Inauguration' : 'उद्घाटन सोहळा',
      icon: PartyPopper,
      bg: 'bg-purple-50 border-purple-200',
      text: 'text-purple-800',
    },
  };

  return (
    <div className="space-y-6">
      {/* Header and Primary Action (Enlarged & Prominent) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {lang === 'en'
                ? 'Industry Samvad, Events & Factory Tours'
                : 'उद्योग संवाद, परिषद व फॅक्टरी टूर्स'}
            </h2>
            <span className="text-xs bg-orange-100 text-[#D95F1A] px-3 py-1 rounded-full font-extrabold border border-orange-200">
              Udyog Samvad
            </span>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Conferences, factory tours, policy discussions and inaugurations across Maharashtra industrial sectors.'
              : 'महाराष्ट्रातील औद्योगिक परिषदा, फॅक्टरी टूर्स, चर्चासत्रे आणि उद्घाटन सोहळे एकाच व्यासपीठावर.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="px-6 py-3 text-sm font-bold shadow-sm rounded-xl flex-shrink-0"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push('/samvad/propose')}
        >
          {lang === 'en' ? 'Propose Event / Samvad' : 'नवीन कार्यक्रम / संवाद मांडा'}
        </Button>
      </div>

      {/* TOP FILTER & CATEGORY CONTROL BAR (SEARCH ON TOP, OPTIONS BELOW) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        {/* Row 1: Search input + Session count & View switcher (TOP) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Search events, topics, associations or venues...'
                  : 'संवाद, विषय, संघटना किंवा ठिकाण शोधा...'
              }
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-1 focus:ring-[#D95F1A]/20 focus:outline-none bg-slate-50/50 font-medium"
            />
          </form>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
            <div className="text-xs sm:text-sm text-slate-700 font-bold whitespace-nowrap bg-slate-100 px-3.5 py-2 rounded-xl">
              <span className="text-[#D95F1A] font-black">{topics.length}</span>{' '}
              <span>{lang === 'en' ? 'sessions available' : 'सत्रे उपलब्ध'}</span>
            </div>

            {/* Interactive View Switcher (Grid Showcase vs Clean List) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#D95F1A] shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="कार्ड व्ह्यू (Grid Showcase)"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-white text-[#D95F1A] shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="यादी व्ह्यू (List View)"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2: Distinct Filter Chips + Category & Sector Dropdowns (BOTTOM) */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              type="button"
              onClick={() => setSelectedOrganizerType('all')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                selectedOrganizerType === 'all'
                  ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-900/10'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 border border-slate-200'
              }`}
            >
              <span>{lang === 'en' ? 'All Sessions' : 'सर्व औद्योगिक सत्रे'}</span>
              <span
                className={`text-[11px] font-extrabold px-2 py-0.2 rounded-full ${
                  selectedOrganizerType === 'all'
                    ? 'bg-white/20 text-white'
                    : 'bg-white text-slate-600 border border-slate-200'
                }`}
              >
                {topics.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrganizerType('association')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                selectedOrganizerType === 'association'
                  ? 'bg-[#136938] text-white shadow-sm ring-2 ring-emerald-600/20'
                  : 'bg-emerald-50 text-[#136938] border border-emerald-200 hover:bg-emerald-100/70'
              }`}
            >
              <Building className="w-4 h-4" />
              <span>{lang === 'en' ? 'Industrial Associations' : 'औद्योगिक संघटना आयोजित'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedOrganizerType('individual')}
              className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                selectedOrganizerType === 'individual'
                  ? 'bg-[#D95F1A] text-white shadow-sm ring-2 ring-orange-500/20'
                  : 'bg-orange-50 text-[#D95F1A] border border-orange-200 hover:bg-orange-100/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{lang === 'en' ? 'Individual Initiatives' : 'वैयक्तिक पुढाकार व निमंत्रणे'}</span>
            </button>
          </div>

          {/* Right Controls: Category Dropdown & Sector Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full md:w-auto">
            {/* Category Dropdown */}
            <div className="relative w-full sm:min-w-[185px]">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#D95F1A] focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="all">{lang === 'en' ? 'All Categories' : 'सर्व वर्गवारी (All Categories)'}</option>
                <option value="event">{lang === 'en' ? '📅 Events & Conferences' : '📅 कार्यक्रम व परिषद'}</option>
                <option value="discussion">{lang === 'en' ? '💬 Discussions & Posts' : '💬 चर्चासत्रे व पोस्ट्स'}</option>
                <option value="factory_tour">{lang === 'en' ? '🏭 Factory Tours' : '🏭 फॅक्टरी टूर्स'}</option>
                <option value="inauguration">{lang === 'en' ? '🎀 Inaugurations' : '🎀 उद्घाटने'}</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* Sector Dropdown */}
            <div className="relative w-full sm:min-w-[160px]">
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="w-full appearance-none pl-3.5 pr-8 py-2.5 text-xs sm:text-sm font-semibold rounded-xl border border-slate-300 bg-white text-slate-800 focus:border-[#D95F1A] focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="all">{lang === 'en' ? 'All Sectors' : 'सर्व उद्योग क्षेत्रे'}</option>
                {sectors.filter((s) => s !== 'all').map((sec) => (
                  <option key={sec} value={sec}>
                    {sec}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH EVENT CARDS LIST / SHOWCASE GRID */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">
            {lang === 'en' ? 'Loading events...' : 'कार्यक्रम लोड होत आहेत...'}
          </div>
        ) : topics.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 p-6">
            <CalendarRange className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">
              {lang === 'en' ? 'No events or sessions found matching criteria.' : 'या निकषांसाठी कोणताही कार्यक्रम सापडला नाही.'}
            </p>
            <Button
              variant="primary"
              size="sm"
              className="mt-4"
              onClick={() => router.push('/samvad/propose')}
            >
              {lang === 'en' ? 'Propose New Topic' : 'नवीन कार्यक्रम मांडा'}
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
            {topics.map((rawTopic) => {
              const topic = localizeSamvadTopic(rawTopic, lang);
              const isRegistered = currentUser && topic.registeredUserIds.includes(currentUser.id);
              const isExpanded = !!expandedTopics[topic.id];
              const category = topic.category || 'discussion';
              const catInfo = categoryConfig[category] || categoryConfig.discussion;
              const CatIcon = catInfo.icon;
              const isAssociation = topic.organizerType === 'association';
              const isPersonal = topic.isPersonalInvitation || topic.organizerType === 'individual';

              return (
                <div
                  key={topic.id}
                  className={`border bg-white rounded-2xl overflow-hidden shadow-xs hover:border-[#D95F1A]/70 hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                    isExpanded ? 'ring-2 ring-[#D95F1A]/30' : ''
                  }`}
                >
                  {/* Clean Initial Card Face (Luma / Minimalist Aesthetic - Zero Description Clutter) */}
                  <div
                    onClick={() => toggleTopic(topic.id)}
                    className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Prominent, Legible Title */}
                      <h3 className="text-[15px] sm:text-base font-extrabold text-slate-900 group-hover:text-[#D95F1A] transition-colors leading-snug line-clamp-2">
                        {topic.title}
                      </h3>
                    </div>

                    {/* Bottom Bar: Host info + Action arrow (Reduced distance to title) */}
                    <div className="border-t border-slate-100 pt-2 mt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 text-slate-600">
                          {isAssociation ? (
                            <Building className="w-3 h-3 text-[#136938]" />
                          ) : (
                            <User className="w-3 h-3 text-[#D95F1A]" />
                          )}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 truncate">
                          {topic.associationName || topic.creatorName}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 font-bold text-[#D95F1A] text-xs flex-shrink-0 group-hover:translate-x-1 transition-transform">
                        <span>{isRegistered ? 'नोंदणी झाली ✓' : (isExpanded ? 'बंद करा' : 'तपशील')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>

                    {/* EXPANDED CONTENT: ONLY OPENED ON DEMAND WHEN USER CLICKS */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/40 space-y-4 animate-fadeIn">
                        {/* Registration CTA & Status Banner */}
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">
                              {lang === 'en' ? 'Session Participation' : 'कार्यक्रमातील सहभाग नोंदणी'}
                            </span>
                            <span className="text-[11px] text-slate-500">
                              {isRegistered
                                ? lang === 'en'
                                  ? 'You are successfully registered for this session.'
                                  : 'आपली या सत्रासाठी सहभाग नोंदणी पूर्ण झाली आहे.'
                                : lang === 'en'
                                ? 'Click below to confirm your attendance and receive updates.'
                                : 'उपस्थिती निश्चित करण्यासाठी नोंदणी करा.'}
                            </span>
                          </div>

                          <div>
                            {isRegistered ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#136938] bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{lang === 'en' ? 'Registered' : 'सहभागी नोंदणी झाली'}</span>
                              </span>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                disabled={registering[topic.id]}
                                onClick={() => handleRegister(topic.id)}
                              >
                                {registering[topic.id]
                                  ? lang === 'en' ? 'Registering...' : 'नोंदणी होत आहे...'
                                  : lang === 'en' ? 'Register to Join' : 'सहभागी व्हा'}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* PERSONAL DIGNITARY INVITATION & OFFICIAL RESPONSE DESK */}
                        {(topic.isPersonalInvitation || topic.invitedOfficeBearerName) && (
                          <div className="bg-gradient-to-r from-orange-50/90 via-amber-50/60 to-white border-2 border-orange-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3.5">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-orange-200/70">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-lg bg-orange-100 text-[#E35914] flex items-center justify-center font-bold">
                                  <Award className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                                    {lang === 'en'
                                      ? 'Personal Dignitary Invitation (वैयक्तिक पदाधिकारी निमंत्रण पत्र)'
                                      : 'वैयक्तिक पदाधिकारी निमंत्रण पत्र व समन्वय'}
                                  </h4>
                                  <span className="text-[10px] text-slate-500">
                                    {lang === 'en'
                                      ? 'Individual enterprise owner directly invited an official BJP Padadhikari'
                                      : 'उद्योजकांकडून भाजप उद्योग आघाडीच्या विशिष्ट पदाधिकाऱ्यांना थेट अधिकृत निमंत्रण'}
                                  </span>
                                </div>
                              </div>

                              {/* Invitation Status Badge */}
                              <div className="self-start sm:self-center">
                                {topic.invitationStatus === 'accepted' ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#136938] bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shadow-2xs">
                                    <Check className="w-3.5 h-3.5" />
                                    <span>{lang === 'en' ? 'Invitation Accepted' : 'निमंत्रण स्वीकृत (Accepted)'}</span>
                                  </span>
                                ) : topic.invitationStatus === 'declined' ? (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full shadow-2xs">
                                    <XCircle className="w-3.5 h-3.5" />
                                    <span>{lang === 'en' ? 'Declined due to Schedule' : 'व्यस्ततेमुळे उपस्थित राहण्यास असमर्थ'}</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full shadow-2xs">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>{lang === 'en' ? 'Awaiting Padadhikari Response' : 'पदाधिकारी प्रतिसाद प्रलंबित'}</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                              <div className="bg-white/95 p-3 rounded-xl border border-orange-100 shadow-2xs">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                  {lang === 'en' ? 'Invited Dignitary' : 'आमंत्रित विशिष्ट पदाधिकारी'}
                                </span>
                                <span className="font-bold text-slate-900 text-sm block mt-0.5">
                                  {topic.invitedOfficeBearerName || 'मा. पदाधिकारी'}
                                </span>
                                <span className="text-[11px] text-[#E35914] font-medium block mt-0.5">
                                  {topic.invitedOfficeBearerTitle || 'भाजप उद्योग आघाडी'}
                                </span>
                              </div>

                              <div className="bg-white/95 p-3 rounded-xl border border-orange-100 shadow-2xs">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                  {lang === 'en' ? 'Invitation Role' : 'निमंत्रण स्वरूप'}
                                </span>
                                <span className="font-bold text-slate-900 text-xs sm:text-sm block mt-0.5">
                                  {topic.invitationType === 'inaugurate'
                                    ? lang === 'en' ? 'To Inaugurate (उद्घाटक)' : '🎀 उद्घाटक म्हणून सस्नेह निमंत्रण'
                                    : lang === 'en' ? 'Guest of Honour / To Attend' : '🤝 प्रमुख पाहुणे / उपस्थिती'}
                                </span>
                                <span className="text-[11px] text-slate-500 block mt-0.5">
                                  {lang === 'en' ? 'Sent by: ' : 'निमंत्रक: '}
                                  <span className="font-semibold text-slate-700">{topic.creatorName}</span>
                                </span>
                              </div>

                              <div className="bg-white/95 p-3 rounded-xl border border-orange-100 shadow-2xs flex flex-col justify-between">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 block uppercase">
                                    {lang === 'en' ? 'Response Status' : 'प्रतिसाद स्थिती'}
                                  </span>
                                  <span className="font-bold text-slate-800 text-xs mt-0.5 block">
                                    {topic.invitationStatus === 'accepted'
                                      ? lang === 'en' ? 'Confirmed & Scheduled' : 'नियोजित वेळेत उपस्थिती निश्चित'
                                      : topic.invitationStatus === 'declined'
                                      ? lang === 'en' ? 'Regret communicated' : 'असमर्थता कळवली आहे'
                                      : lang === 'en' ? 'Under Secretariat Review' : 'कार्यालयीन समन्वयात'}
                                  </span>
                                </div>

                                {/* Quick Action Button for Office-Bearers / Testing */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setRespondingTopicId(respondingTopicId === topic.id ? null : topic.id);
                                    setResponseText(topic.invitationResponseNotes || '');
                                  }}
                                  className="mt-2 text-[11px] font-bold text-[#E35914] hover:text-orange-700 underline text-left flex items-center gap-1"
                                >
                                  <span>{lang === 'en' ? '✍️ Update / Respond as Padadhikari' : '✍️ पदाधिकारी म्हणून प्रतिसाद नोंदवा'}</span>
                                </button>
                              </div>
                            </div>

                            {/* Padadhikari Response Box if accepted or with note */}
                            {topic.invitationResponseNotes && (
                              <div className="bg-emerald-50/90 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-950 space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold flex items-center gap-1.5 text-[#136938]">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>{lang === 'en' ? 'Official Dignitary Remark:' : 'पदाधिकाऱ्यांचा अधिकृत शेरा व संदेश:'}</span>
                                  </span>
                                  {topic.invitationRespondedAt && (
                                    <span className="text-[10px] text-emerald-700">
                                      {new Date(topic.invitationRespondedAt).toLocaleDateString(lang === 'en' ? 'en-IN' : 'mr-IN')}
                                    </span>
                                  )}
                                </div>
                                <p className="italic text-emerald-900 leading-relaxed font-serif pl-5 border-l-2 border-[#136938]">
                                  &ldquo;{topic.invitationResponseNotes}&rdquo;
                                </p>
                              </div>
                            )}

                            {/* Responsive Quick Action Form (When Padadhikari Clicks Update) */}
                            {respondingTopicId === topic.id && (
                              <div className="bg-white p-3.5 rounded-xl border border-orange-300 space-y-3 animate-fadeIn">
                                <div className="text-xs font-bold text-slate-800">
                                  {lang === 'en' ? 'Record Official Dignitary Response' : 'अधिकृत पदाधिकारी प्रतिसाद नोंदवा:'}
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setResponseStatus('accepted')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                      responseStatus === 'accepted'
                                        ? 'bg-emerald-600 text-white border-emerald-600'
                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    ✅ {lang === 'en' ? 'Accept Invitation' : 'स्वीकारा (Accept)'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setResponseStatus('declined')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                                      responseStatus === 'declined'
                                        ? 'bg-rose-600 text-white border-rose-600'
                                        : 'bg-slate-50 text-slate-700 border-slate-200'
                                    }`}
                                  >
                                    ❌ {lang === 'en' ? 'Decline' : 'असमर्थता (Decline)'}
                                  </button>
                                </div>
                                <textarea
                                  rows={2}
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  placeholder={
                                    responseStatus === 'accepted'
                                      ? 'उदा. निमंत्रण स्वीकारले आहे. मी आणि भाजप उद्योग आघाडीचे पदाधिकारी नियोजित वेळेत उपस्थित राहू...'
                                      : 'उदा. अन्य पूर्वनियोजित शासकीय दौऱ्यामुळे उपस्थित राहण्यास असमर्थ...'
                                  }
                                  className="w-full text-xs p-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="outlined"
                                    size="sm"
                                    onClick={() => setRespondingTopicId(null)}
                                  >
                                    {lang === 'en' ? 'Cancel' : 'रद्द करा'}
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="primary"
                                    size="sm"
                                    disabled={submittingResponse}
                                    onClick={() => handleRespondInvitation(topic.id)}
                                  >
                                    {submittingResponse
                                      ? lang === 'en' ? 'Saving...' : 'नोंद होत आहे...'
                                      : lang === 'en' ? 'Submit Response' : 'प्रतिसाद सबमिट करा'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Full Description & Agenda */}
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            {lang === 'en' ? 'Agenda & Context' : 'अजेंडा व सविस्तर माहिती'}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200">
                            {topic.description}
                          </p>
                        </div>

                        {/* Date, Time & Location Card */}
                        {topic.scheduledDate && (
                          <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl text-xs text-amber-950 flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-1.5 font-bold">
                              <Calendar className="w-4 h-4 text-amber-700" />
                              <span>
                                {new Date(topic.scheduledDate).toLocaleString(
                                  lang === 'en' ? 'en-IN' : 'mr-IN',
                                  { dateStyle: 'full', timeStyle: 'short' }
                                )}
                              </span>
                            </div>
                            {topic.locationOrLink && (
                              <div className="flex items-center gap-1.5 font-medium">
                                <MapPin className="w-4 h-4 text-amber-700" />
                                <span>{topic.locationOrLink}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Threaded Discussion Forum & Office-Bearer Responses */}
                        <div className="pt-2 bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                          <div className="text-xs font-bold text-slate-800 flex items-center justify-between pb-1 border-b border-slate-100">
                            <div className="flex items-center gap-1.5">
                              <MessageSquare className="w-4 h-4 text-[#E35914]" />
                              <span>{lang === 'en' ? 'Discussion & Official Communication' : 'चर्चा, प्रश्न व अधिकृत संवाद'}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">
                              {topic.messages.length} {lang === 'en' ? 'messages' : 'संदेश'}
                            </span>
                          </div>

                          {topic.messages.length === 0 ? (
                            <p className="text-xs text-slate-400 italic py-1">
                              {lang === 'en'
                                ? 'No messages in this discussion yet. Be the first to post!'
                                : 'अद्याप कोणताही संदेश नाही. आपले मत किंवा प्रश्न येथे मांडा.'}
                            </p>
                          ) : (
                            <div className="space-y-2.5">
                              {topic.messages.map((msg) => (
                                <div
                                  key={msg.id}
                                  className={`p-3 rounded-xl border text-xs ${
                                    msg.isOfficeBearer
                                      ? 'bg-orange-50/80 border-orange-200'
                                      : 'bg-slate-50 border-slate-200'
                                  }`}
                                >
                                  <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                      <span>{msg.authorName}</span>
                                      {msg.isOfficeBearer && (
                                        <OfficeBearerBadge
                                          scope={msg.officeBearerTitle}
                                          showScope={true}
                                        />
                                      )}
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {new Date(msg.createdAt).toLocaleDateString(
                                        lang === 'en' ? 'en-IN' : 'mr-IN'
                                      )}
                                    </span>
                                  </div>
                                  <p className="text-slate-700 leading-relaxed">
                                    {msg.message}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Message Contribution Input Box */}
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                            <input
                              type="text"
                              value={messageInputs[topic.id] || ''}
                              onChange={(e) =>
                                setMessageInputs((prev) => ({
                                  ...prev,
                                  [topic.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSendMessage(topic.id);
                                }
                              }}
                              placeholder={
                                lang === 'en'
                                  ? 'Write your feedback, question or reply...'
                                  : 'आपला संदेश, प्रश्न किंवा अभिप्राय येथे लिहा...'
                              }
                              className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#E35914] focus:outline-none bg-slate-50"
                            />
                            <Button
                              variant="primary"
                              size="sm"
                              icon={<Send className="w-3.5 h-3.5" />}
                              onClick={() => handleSendMessage(topic.id)}
                            >
                              {lang === 'en' ? 'Post' : 'पाठवा'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              );
            })}
            </div>
          )}
        </div>

      {/* New Samvad Modal */}
      <NewSamvadModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchTopics();
        }}
      />
    </div>
  );
};
