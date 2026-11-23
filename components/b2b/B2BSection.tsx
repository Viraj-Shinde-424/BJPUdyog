import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useApp } from '@/lib/context/AppContext';
import { B2BPost, PostType, ResourceCategory } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import {
  Tag,
  MessageSquare,
  Send,
  Plus,
  Filter,
  Package,
  Layers,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageCircle,
  Search,
  ShoppingCart,
  CheckCircle2,
  Building2,
  Building,
  User,
  ExternalLink,
  LayoutGrid,
  List,
  ArrowRight,
} from 'lucide-react';
import { NewPostModal } from './NewPostModal';
import { localizeB2BPost, localizeSector } from '@/lib/i18n/dataLocalizer';

export const B2BSection: React.FC = () => {
  const router = useRouter();
  const { lang, currentUser, t } = useApp();
  const [posts, setPosts] = useState<B2BPost[]>([]);
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedConversations, setExpandedConversations] = useState<Record<string, boolean>>({});
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [submittingReply, setSubmittingReply] = useState<Record<string, boolean>>({});
  const [contactModalPost, setContactModalPost] = useState<B2BPost | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedSector !== 'all') params.set('sector', selectedSector);
      if (selectedType !== 'all') params.set('type', selectedType);
      if (searchQuery.trim()) params.set('q', searchQuery.trim());

      const res = await fetch(`/api/b2b?${params.toString()}`);
      const data = await res.json();
      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedSector, selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  const toggleConversation = (postId: string) => {
    setExpandedConversations((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleSendReply = async (postId: string) => {
    const text = replyTexts[postId];
    if (!text || !text.trim()) return;

    setSubmittingReply((prev) => ({ ...prev, [postId]: true }));

    try {
      const res = await fetch('/api/b2b/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          authorId: currentUser?.id,
          message: text.trim(),
        }),
      });

      const data = await res.json();
      if (data.success && data.reply) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                replies: [...p.replies, data.reply],
              };
            }
            return p;
          })
        );
        setReplyTexts((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingReply((prev) => ({ ...prev, [postId]: false }));
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

  // Resource categories without bracketed words
  const resourceCategoryLabels: Record<ResourceCategory, { mr: string; hi: string; en: string }> = {
    raw_material: { mr: 'कच्चा माल', hi: 'कच्चा माल', en: 'Raw Material' },
    machinery: { mr: 'मशिनरी व उपकरणे', hi: 'मशीनरी एवं उपकरण', en: 'Machinery & Equipment' },
    services: { mr: 'उत्पादन सेवा व जॉब वर्क', hi: 'उत्पादन सेवा एवं जॉब वर्क', en: 'Job Work & Services' },
    space: { mr: 'जागा व गोडाऊन', hi: 'स्थान एवं गोदाम', en: 'Industrial Space & Shed' },
    general: { mr: 'इतर संसाधने', hi: 'अन्य संसाधन', en: 'General Resources' },
  };

  // Post Type without brackets and without updates
  const typeConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    requirement: {
      label: lang === 'en' ? 'Tenders' : lang === 'hi' ? 'निविदा' : 'निविदा',
      bg: 'bg-orange-50 border-orange-300',
      text: 'text-[#E35914]',
      icon: ShoppingCart,
    },
    offer: {
      label: lang === 'en' ? 'Suppliers' : lang === 'hi' ? 'आपूर्तिकर्ता' : 'पुरवठादार',
      bg: 'bg-emerald-50 border-emerald-300',
      text: 'text-[#136938]',
      icon: Package,
    },
  };

  return (
    <div className="space-y-6">
      {/* Header and Publish Action (Identical to Samvad and Grievance Header Style) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-7 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
              {lang === 'en' ? 'B2B Business Network' : 'B2B उद्योग नेटवर्क'}
            </h2>
            <span className="text-xs bg-orange-100 text-[#D95F1A] px-3 py-1 rounded-full font-extrabold border border-orange-200">
              B2B Marketplace
            </span>
          </div>
          <p className="text-sm text-slate-600 font-medium mt-1.5 leading-relaxed max-w-3xl">
            {lang === 'en'
              ? 'Post material tenders or explore verified suppliers across Maharashtra industrial clusters.'
              : 'कच्च्या मालाच्या निविदा मांडा किंवा महाराष्ट्रातील अधिकृत पुरवठादार शोधा आणि थेट संपर्क साधा.'}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          className="px-6 py-3 text-sm font-bold shadow-sm rounded-xl flex-shrink-0 bg-[#D95F1A] hover:bg-[#B84A0E]"
          icon={<Plus className="w-4 h-4" />}
          onClick={() => router.push('/b2b/post')}
        >
          {lang === 'en' ? 'Post Tender / Supply' : 'नवीन निविदा / पुरवठा नोंदवा'}
        </Button>
      </div>

      {/* 2. Top Filter & Search Bar (Harmonized with Udyog Samvad) */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
        {/* Row 1: Search input + Post count badge + Grid/List View Switcher (TOP) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                lang === 'en'
                  ? 'Search tenders, suppliers, raw materials or machinery...'
                  : 'कच्चा माल, मशिनरी, निविदा किंवा पुरवठादार शोधा...'
              }
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-slate-300 focus:border-[#D95F1A] focus:ring-1 focus:ring-[#D95F1A]/20 focus:outline-none bg-slate-50/50 font-medium"
            />
          </form>

          <div className="flex items-center justify-between sm:justify-end gap-2.5 w-full sm:w-auto">
            <div className="text-xs sm:text-sm text-slate-700 font-bold whitespace-nowrap bg-slate-100 px-3.5 py-2 rounded-xl">
              <span className="text-[#D95F1A] font-black">{posts.length}</span>{' '}
              <span>{lang === 'en' ? 'posts available' : 'निविदा/पोस्ट्स उपलब्ध'}</span>
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

        {/* Row 2: Type Dropdown + Category/Sector Dropdown to the right (BOTTOM) */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            {/* 1. Combobox Dropdown for Tenders and Suppliers */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#D95F1A]" />
                <span>{lang === 'en' ? 'Filter by:' : 'निवडा:'}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 bg-white text-slate-800 shadow-2xs focus:border-[#D95F1A] focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                >
                  <option value="all">
                    {lang === 'en' ? 'All Posts' : 'सर्व पोस्ट्स (All)'}
                  </option>
                  <option value="requirement">
                    {lang === 'en' ? 'Tenders' : 'निविदा (Requirements)'}
                  </option>
                  <option value="offer">
                    {lang === 'en' ? 'Suppliers' : 'पुरवठादार (Offers)'}
                  </option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* 2. Category / Sector Dropdown (TO THE RIGHT OF THE DROPDOWN) */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-xs sm:text-sm font-bold text-slate-700 whitespace-nowrap flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#136938]" />
                <span>{lang === 'en' ? 'Category / Sector:' : 'उद्योग क्षेत्र:'}</span>
              </label>
              <div className="relative">
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="appearance-none pl-3.5 pr-8 py-2.5 rounded-xl text-xs sm:text-sm font-bold border border-slate-300 bg-white text-slate-800 shadow-2xs focus:border-[#D95F1A] focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer"
                >
                  <option value="all">
                    {lang === 'en' ? 'All Categories / Sectors' : 'सर्व उद्योग क्षेत्रे (All Sectors)'}
                  </option>
                  {sectors
                    .filter((s) => s !== 'all')
                    .map((sec) => (
                      <option key={sec} value={sec}>
                        {localizeSector(sec, lang)}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feed List (Grid Showcase vs Clean List Like Udyog Samvad) */}
      {loading ? (
        <div className="text-center py-12 text-xs sm:text-sm text-slate-400">
          {lang === 'en'
            ? 'Loading B2B posts...'
            : lang === 'hi'
            ? 'B2B पोस्ट लोड हो रहे हैं...'
            : 'B2B पोस्ट्स लोड होत आहेत...'}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-500 p-6">
          <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="font-semibold text-slate-700">
            {lang === 'en'
              ? 'No posts found matching criteria.'
              : lang === 'hi'
              ? 'इस मानदंड से मेल खाती कोई पोस्ट उपलब्ध नहीं है।'
              : 'या निकषांसाठी कोणतीही पोस्ट उपलब्ध नाही.'}
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => router.push('/b2b/post')}
          >
            {lang === 'en'
              ? 'Create New Post'
              : lang === 'hi'
              ? 'नई निविदा / आपूर्ति दर्ज करें'
              : 'नवीन निविदा / पुरवठा नोंदवा'}
          </Button>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" : "space-y-4"}>
          {posts.map((rawPost) => {
            const post = localizeB2BPost(rawPost, lang);
            const config = typeConfig[post.postType] || typeConfig.offer;
            const TypeIcon = config.icon;
            const isExpanded = !!expandedConversations[post.id];
            const isRequirement = post.postType === 'requirement';
            const resourceLabel = post.resourceCategory
              ? resourceCategoryLabels[post.resourceCategory]?.[lang === 'en' ? 'en' : lang === 'hi' ? 'hi' : 'mr']
              : null;

            return (
              <div
                key={post.id}
                className={`border bg-white rounded-2xl overflow-hidden shadow-xs hover:border-[#D95F1A]/70 hover:shadow-lg transition-all duration-300 flex flex-col justify-between ${
                  isRequirement ? 'border-t-4 border-t-[#E35914]' : 'border-t-4 border-t-[#136938]'
                } ${isExpanded ? 'ring-2 ring-[#D95F1A]/30' : ''}`}
              >
                {/* Clean Initial Card Face (Like Udyog Samvad Minimalist Aesthetic) */}
                <div
                  onClick={() => toggleConversation(post.id)}
                  className="p-5 flex-1 flex flex-col justify-between cursor-pointer group"
                >
                  <div>
                    {/* Top Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${config.bg} ${config.text}`}
                      >
                        <TypeIcon className="w-3.5 h-3.5" />
                        <span>{config.label}</span>
                      </span>

                      {resourceLabel && (
                        <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-semibold border border-slate-200">
                          {resourceLabel}
                        </span>
                      )}

                      <span className="text-xs bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg font-semibold border border-slate-200">
                        {post.sector}
                      </span>
                    </div>

                    {/* Prominent, Legible Title */}
                    <h3 className="text-[15px] sm:text-base font-extrabold text-slate-900 group-hover:text-[#D95F1A] transition-colors leading-snug line-clamp-2 mb-2">
                      {post.title}
                    </h3>

                    {/* Single Line: Supplier / Tenderer Info */}
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 truncate">
                      <span className="truncate">{post.authorName} ({post.authorBusinessName})</span>
                      {post.isOfficeBearer && (
                        <span className="flex-shrink-0">
                          <OfficeBearerBadge
                            scope={post.officeBearerTitle}
                            showScope={true}
                          />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom Bar: District/Date + Responses count + Action arrow */}
                  <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between text-xs">
                    <span className="text-xs text-slate-400">
                      {post.district} • {new Date(post.createdAt).toLocaleDateString(lang === 'en' ? 'en-IN' : 'mr-IN')}
                    </span>

                    <div className="flex items-center gap-2.5">
                      <span className="text-xs text-slate-500 inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg font-semibold">
                        <MessageSquare className="w-3.5 h-3.5 text-[#E35914]" />
                        <span>{post.replies.length} {t('b2b', 'replyCount')}</span>
                      </span>

                      <div className="flex items-center gap-1 font-bold text-[#D95F1A] text-xs group-hover:translate-x-1 transition-transform">
                        <span>
                          {isExpanded
                            ? lang === 'en' ? 'Close' : 'बंद करा'
                            : lang === 'en' ? 'Details' : 'तपशील'}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED CONTENT: ONLY SHOWN WHEN USER CLICKS */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-slate-50/40 space-y-4 animate-fadeIn">
                    {/* Full Description */}
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {lang === 'en' ? 'Full Requirements & Specifications' : 'सविस्तर तपशील व अटी'}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-xl border border-slate-200">
                        {post.content}
                      </p>
                    </div>

                    {/* Direct Contact Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setContactModalPost(post)}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all shadow-xs ${
                            isRequirement
                              ? 'bg-[#E35914] hover:bg-[#C84B0E]'
                              : 'bg-[#136938] hover:bg-[#0E522C]'
                          }`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>
                            {isRequirement
                              ? lang === 'en' ? 'Contact Tender Creator' : 'निविदाकाराशी संपर्क साधा'
                              : lang === 'en' ? 'Contact Supplier' : 'पुरवठादाराशी संपर्क साधा'}
                          </span>
                        </button>
                      </div>

                      <span className="text-xs text-slate-400">
                        {lang === 'en' ? 'Direct phone & WhatsApp coordination' : 'थेट फोन व व्हॉट्सॲप समन्वय'}
                      </span>
                    </div>

                    {/* Discussion & Quotation Replies Thread */}
                    <div className="pt-3 border-t border-slate-200 bg-white p-4 rounded-xl border space-y-3">
                      <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <MessageSquare className="w-4 h-4 text-[#E35914]" />
                          <span>{lang === 'en' ? 'Direct Discussions & Quotations' : 'थेट संवाद व कोटेशन्स'}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {post.replies.length} {lang === 'en' ? 'responses' : 'प्रतिसाद'}
                        </span>
                      </div>

                      {post.replies.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">
                          {lang === 'en'
                            ? 'No replies yet. Be the first to submit a proposal or connect.'
                            : 'अद्याप कोणताही प्रतिसाद नाही. पहिले कोटेशन किंवा प्रश्न येथे मांडा.'}
                        </p>
                      ) : (
                        <div className="space-y-2.5">
                          {post.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-3 rounded-xl border text-xs ${
                                reply.isOfficeBearer
                                  ? 'bg-orange-50/70 border-orange-200'
                                  : 'bg-slate-50 border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                  <span>{reply.authorName}</span>
                                  {reply.isOfficeBearer && (
                                    <OfficeBearerBadge
                                      scope={reply.officeBearerTitle}
                                      showScope={true}
                                    />
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(reply.createdAt).toLocaleDateString(lang === 'en' ? 'en-IN' : 'mr-IN')}
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed">
                                {reply.message}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Reply Box */}
                      <div className="flex items-center gap-2 pt-2">
                        <input
                          type="text"
                          value={replyTexts[post.id] || ''}
                          onChange={(e) =>
                            setReplyTexts((prev) => ({
                              ...prev,
                              [post.id]: e.target.value,
                            }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSendReply(post.id);
                            }
                          }}
                          placeholder={
                            lang === 'en'
                              ? 'Write a reply, query or offer...'
                              : 'आपला प्रतिसाद किंवा कोटेशन येथे टाईप करा...'
                          }
                          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#E35914] focus:outline-none bg-slate-50"
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Send className="w-3.5 h-3.5" />}
                          disabled={submittingReply[post.id]}
                          onClick={() => handleSendReply(post.id)}
                        >
                          {lang === 'en' ? 'Send' : 'पाठवा'}
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

      {/* New Post Modal */}
      <NewPostModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          fetchPosts();
        }}
      />

      {/* Direct Contact Modal */}
      {contactModalPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {lang === 'en' ? 'Direct Industrial Connect' : 'थेट औद्योगिक संपर्क'}
              </h3>
              <button
                onClick={() => setContactModalPost(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <div className="font-bold text-slate-900 text-base">
                {contactModalPost.authorName}
              </div>
              <div className="text-xs text-slate-500">
                {contactModalPost.authorBusinessName}
              </div>
              <div className="text-xs text-[#E35914] font-medium mt-1">
                {contactModalPost.district} • {contactModalPost.sector}
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <a
                href={`tel:${contactModalPost.contactPhone || '+919822011223'}`}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#136938] text-white text-xs font-bold shadow-xs hover:bg-[#0E522C] transition-colors"
              >
                <Phone className="w-4 h-4" />
                <span>
                  {lang === 'en' ? 'Call Now: ' : 'कॉल करा: '}
                  {contactModalPost.contactPhone || '+91 98220 11223'}
                </span>
              </a>

              <a
                href={`https://wa.me/${(contactModalPost.contactWhatsapp || '+919822011223').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `नमस्कार, मी भाजप उद्योग सेतू पोर्टलवर आपली पोस्ट पाहिली: ${contactModalPost.title}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {lang === 'en' ? 'Connect on WhatsApp' : 'व्हॉट्सॲपवर संपर्क साधा'}
                </span>
              </a>
            </div>

            <button
              onClick={() => setContactModalPost(null)}
              className="w-full text-center text-xs text-slate-400 hover:text-slate-600 pt-1 font-semibold"
            >
              {lang === 'en' ? 'Close' : 'बंद करा'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
