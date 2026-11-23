import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { GrievanceSection } from '@/components/grievances/GrievanceSection';
import { InaugurationsSection } from '@/components/inaugurations/InaugurationsSection';
import { useApp } from '@/lib/context/AppContext';
import {
  Calendar,
  AlertCircle,
  PartyPopper,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export default function RequestsPage() {
  const router = useRouter();
  const { lang, currentUser, t } = useApp();
  const [activeTab, setActiveTab] = useState<'grievances' | 'meetings' | 'inaugurations'>('grievances');
  const [meetings, setMeetings] = useState<any[]>([]);

  useEffect(() => {
    if (router.query.tab === 'meetings' || router.query.tab === 'inaugurations' || router.query.tab === 'grievances') {
      setActiveTab(router.query.tab);
    }
  }, [router.query.tab]);

  useEffect(() => {
    fetch(`/api/leadership/meetings?requesterId=${currentUser?.id || ''}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.meetings) setMeetings(data.meetings);
      })
      .catch((e) => console.error(e));
  }, [currentUser]);

  const getMeetingStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#136938] bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>स्वीकारले (Approved / Scheduled)</span>
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
            <XCircle className="w-3.5 h-3.5" />
            <span>नाकारले (Declined)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>प्रलंबित (Pending Review)</span>
          </span>
        );
    }
  };

  return (
    <>
      <Head>
        <title>
          {lang === 'en'
            ? 'My Requests & Grievances | BJP Udyog Setu'
            : 'माझ्या विनंत्या व तक्रारी | भाजपा उद्योग सेतू'}
        </title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1 max-w-[1440px] 2xl:max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6 xl:py-8 space-y-6">
          {/* Executive Service Tab Cards (Replaces old toggle button with spacious, modern executive cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4">
            {/* Tab 1: Grievance Redressal */}
            <button
              type="button"
              onClick={() => setActiveTab('grievances')}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                activeTab === 'grievances'
                  ? 'bg-gradient-to-br from-orange-50/90 to-white border-[#D95F1A] shadow-md ring-2 ring-[#D95F1A]/20'
                  : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === 'grievances'
                      ? 'bg-[#D95F1A] text-white shadow-xs'
                      : 'bg-orange-100 text-[#D95F1A] group-hover:bg-[#D95F1A] group-hover:text-white'
                  }`}
                >
                  <ShieldAlert className="w-5 h-5" />
                </div>
                {activeTab === 'grievances' ? (
                  <span className="text-[11px] font-bold text-[#D95F1A] bg-orange-100/90 border border-orange-200 px-2.5 py-0.5 rounded-full">
                    {lang === 'en' ? 'Active Service' : 'सक्रिय विभाग'}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {lang === 'en' ? 'Click to view' : 'पाहण्यासाठी क्लिक करा'}
                  </span>
                )}
              </div>
              <div className="font-black text-sm sm:text-base text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                {lang === 'en' ? 'Grievance Redressal' : 'शासकीय तक्रार निवारण सहाय्य'}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                {lang === 'en'
                  ? 'Unanswered gov & direct industrial follow-up'
                  : 'प्रलंबित शासकीय तक्रार व औद्योगिक अडचणी पाठपुरावा'}
              </div>
            </button>

            {/* Tab 2: Leadership Meetings */}
            <button
              type="button"
              onClick={() => setActiveTab('meetings')}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                activeTab === 'meetings'
                  ? 'bg-gradient-to-br from-orange-50/90 to-white border-[#D95F1A] shadow-md ring-2 ring-[#D95F1A]/20'
                  : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === 'meetings'
                      ? 'bg-[#D95F1A] text-white shadow-xs'
                      : 'bg-amber-100 text-amber-700 group-hover:bg-[#D95F1A] group-hover:text-white'
                  }`}
                >
                  <Calendar className="w-5 h-5" />
                </div>
                {activeTab === 'meetings' ? (
                  <span className="text-[11px] font-bold text-[#D95F1A] bg-orange-100/90 border border-orange-200 px-2.5 py-0.5 rounded-full">
                    {lang === 'en' ? 'Active Service' : 'सक्रिय विभाग'}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {lang === 'en' ? 'Click to view' : 'पाहण्यासाठी क्लिक करा'}
                  </span>
                )}
              </div>
              <div className="font-black text-sm sm:text-base text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                {lang === 'en' ? 'Leader Meetings' : 'नेतृत्व भेट विनंत्या'}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                {lang === 'en'
                  ? 'High-level meetings with ministers & leadership'
                  : 'मा. मुख्यमंत्री व वरिष्ठ नेतृत्व भेट समन्वय'}
              </div>
            </button>

            {/* Tab 3: Inaugurations */}
            <button
              type="button"
              onClick={() => setActiveTab('inaugurations')}
              className={`p-4 sm:p-5 rounded-2xl text-left border transition-all relative overflow-hidden group ${
                activeTab === 'inaugurations'
                  ? 'bg-gradient-to-br from-orange-50/90 to-white border-[#D95F1A] shadow-md ring-2 ring-[#D95F1A]/20'
                  : 'bg-white border-slate-200 hover:border-orange-300 hover:bg-slate-50/60 shadow-2xs'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeTab === 'inaugurations'
                      ? 'bg-[#D95F1A] text-white shadow-xs'
                      : 'bg-emerald-100 text-[#136938] group-hover:bg-[#D95F1A] group-hover:text-white'
                  }`}
                >
                  <PartyPopper className="w-5 h-5" />
                </div>
                {activeTab === 'inaugurations' ? (
                  <span className="text-[11px] font-bold text-[#D95F1A] bg-orange-100/90 border border-orange-200 px-2.5 py-0.5 rounded-full">
                    {lang === 'en' ? 'Active Service' : 'सक्रिय विभाग'}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-400 font-medium">
                    {lang === 'en' ? 'Click to view' : 'पाहण्यासाठी क्लिक करा'}
                  </span>
                )}
              </div>
              <div className="font-black text-sm sm:text-base text-slate-900 group-hover:text-[#D95F1A] transition-colors">
                {lang === 'en' ? 'Inauguration Invitations' : 'उद्घाटन व सोहळा निमंत्रणे'}
              </div>
              <div className="text-xs text-slate-500 font-medium mt-1 line-clamp-1">
                {lang === 'en'
                  ? 'Factory tours, plant inaugurations & guests'
                  : 'फॅक्टरी टूर, युनिट विस्तार व सोहळा निमंत्रणे'}
              </div>
            </button>
          </div>

          {/* Grievances tab */}
          {activeTab === 'grievances' && <GrievanceSection />}

          {/* Leader Meetings tab */}
          {activeTab === 'meetings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {lang === 'en' ? 'Leadership Meeting Requests' : 'नेतृत्व भेट विनंत्यांचा पाठपुरावा'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    पंतप्रधान, मुख्यमंत्री अथवा प्रदेश नेतृत्वाकडे नोंदवलेल्या भेट विनंत्यांची सद्यस्थिती.
                  </p>
                </div>
                <Link href="/#leadership">
                  <Button variant="primary" size="sm">
                    नवीन भेट विनंती करा
                  </Button>
                </Link>
              </div>

              {meetings.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-xs text-slate-500">
                  कोणतीही भेट विनंती नोंदवलेली नाही.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {meetings.map((m) => (
                    <Card key={m.id} className="p-5 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-[#E35914] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                            {m.trackingId}
                          </span>
                          {getMeetingStatusBadge(m.status)}
                        </div>

                        <h4 className="font-bold text-sm text-slate-900 mb-1">
                          {m.leaderName}
                        </h4>

                        <div className="text-xs text-slate-600 mb-3 space-y-1">
                          <div>
                            <span className="text-slate-400">प्रतिनिधी / संस्था: </span>
                            <strong>{m.representativeName}</strong> ({m.businessName})
                          </div>
                          <div>
                            <span className="text-slate-400">अपेक्षित कालावधी: </span>
                            <span>{m.preferredTimeframe}</span>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed mb-3">
                          <strong className="block text-slate-800 mb-0.5">भेटीचा उद्देश:</strong>
                          <p>{m.purpose}</p>
                        </div>

                        {m.coordinatorNotes && (
                          <div className="bg-amber-50/70 border border-amber-200 p-2.5 rounded-lg text-xs text-amber-900 mb-2">
                            <strong>समन्वयक शेरा: </strong>
                            <span>{m.coordinatorNotes}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>नोंद: {new Date(m.createdAt).toLocaleDateString()}</span>
                        <span>सदस्य संख्या: {m.delegationSize}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Inaugurations tab */}
          {activeTab === 'inaugurations' && <InaugurationsSection />}
        </main>

        <Footer />
      </div>
    </>
  );
}
