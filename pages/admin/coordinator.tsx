import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import { useApp } from '@/lib/context/AppContext';
import {
  ShieldCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
  Check,
} from 'lucide-react';

export default function CoordinatorQueuePage() {
  const { lang, currentUser } = useApp();
  const [meetings, setMeetings] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/leadership/meetings');
      const data = await res.json();
      if (data.meetings) setMeetings(data.meetings);

      const userRes = await fetch('/api/auth/current-user');
      const userData = await userRes.json();
      if (userData.allProfiles) setProfiles(userData.allProfiles);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateMeeting = async (id: string, status: string) => {
    const notes = prompt('समन्वय शेरा / सूचना नोंदवा:');
    if (notes === null) return;

    try {
      const res = await fetch('/api/leadership/meetings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, coordinatorNotes: notes }),
      });
      const data = await res.json();
      if (data.success) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleVerifyOfficeBearer = async (userId: string) => {
    const title = prompt('सत्यापित पदाधिकारी पदनाम (उदा. जिल्हा संयोजक / सचिव):', 'जिल्हा संयोजक, भाजप उद्योग आघाडी');
    if (!title) return;
    const scope = prompt('कार्यक्षेत्र / Scope (उदा. पुणे जिल्हा / महाराष्ट्र राज्य):', 'पुणे जिल्हा');
    if (!scope) return;

    try {
      const res = await fetch('/api/auth/verify-office-bearer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, title, scope }),
      });
      const data = await res.json();
      if (data.success) {
        alert('पदाधिकारी जबाबदारी यशस्वीरित्या सत्यापित झाली!');
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Head>
        <title>समन्वयक कक्ष व केस व्यवस्थापन | भाजपा उद्योग सेतू</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Header />

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E35914]" />
                <span>अधिकृत केस व्यवस्थापन व समन्वयक कक्ष</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900">
                नेतृत्व भेट विनंती रांग (Coordinator Queue) व पदाधिकारी पडताळणी
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                नेत्यांकडे आलेल्या भेट विनंत्यांची तपासणी, वेळ वाटप व पदाधिकाऱ्यांचे प्रमाणीकरण.
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              लॉगिन: <strong>{currentUser?.fullName}</strong> ({currentUser?.role})
            </div>
          </div>

          {/* Section 1: Leadership Meeting Requests Queue */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#E35914]" />
              <span>नेतृत्व भेट विनंत्या (Leader Meeting Queue)</span>
            </h2>

            {loading ? (
              <div className="text-xs text-slate-400 py-6">लोड होत आहे...</div>
            ) : meetings.length === 0 ? (
              <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-500">
                कोणतीही भेट विनंती प्रलंबित नाही.
              </div>
            ) : (
              <div className="space-y-3">
                {meetings.map((m) => (
                  <Card key={m.id} className="p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#E35914] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {m.trackingId}
                        </span>
                        <span className="font-bold text-xs text-slate-900">
                          {m.leaderName}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-amber-50 text-amber-800 border-amber-300">
                        {m.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600 mb-3">
                      <div>
                        <span className="text-slate-400">संघटना / उद्योग: </span>
                        <strong>{m.businessName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">प्रतिनिधी: </span>
                        <span>{m.representativeName} ({m.designation})</span>
                      </div>
                      <div>
                        <span className="text-slate-400">संपर्क: </span>
                        <span>{m.contactPhone}</span>
                      </div>
                    </div>

                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed mb-3">
                      <strong>भेटीचा उद्देश: </strong>
                      <span>{m.purpose}</span>
                    </div>

                    {m.coordinatorNotes && (
                      <div className="text-xs text-amber-900 bg-amber-50/70 p-2 rounded-lg border border-amber-200 mb-3">
                        <strong>सद्य शेरा: </strong>
                        <span>{m.coordinatorNotes}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                      <span className="text-[11px] text-slate-400">
                        कालावधी: {m.preferredTimeframe} • सदस्य: {m.delegationSize}
                      </span>

                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateMeeting(m.id, 'approved')}
                          className="py-1 px-3 text-xs"
                        >
                          मंजूर करा (Approve)
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateMeeting(m.id, 'scheduled')}
                          className="py-1 px-3 text-xs"
                        >
                          वेळ निश्चित करा (Schedule)
                        </Button>
                        <Button
                          variant="outlined"
                          size="sm"
                          onClick={() => handleUpdateMeeting(m.id, 'declined')}
                          className="py-1 px-3 text-xs text-rose-700 border-rose-300 hover:bg-rose-50"
                        >
                          नाकारा
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Office-Bearer Verification Desk */}
          <div>
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#136938]" />
              <span>पदाधिकारी प्रमाणीकरण डेस्क (Office-Bearer Role Verification)</span>
            </h2>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                    <tr>
                      <th className="p-3">नाव व संपर्क</th>
                      <th className="p-3">सध्याची भूमिका</th>
                      <th className="p-3">पदाधिकारी पदनाम व क्षेत्र</th>
                      <th className="p-3">सत्यापन स्थिती</th>
                      <th className="p-3 text-right">प्रशासकीय कृती</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {profiles.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-medium text-slate-900">
                          <div>{p.fullName}</div>
                          <div className="text-[10px] text-slate-400">{p.email} • {p.phone}</div>
                        </td>
                        <td className="p-3 text-slate-600">{p.role}</td>
                        <td className="p-3 text-slate-700">
                          {p.officeBearerTitle ? (
                            <div>
                              <div className="font-semibold">{p.officeBearerTitle}</div>
                              <div className="text-[10px] text-slate-500">{p.officeBearerScope}</div>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">नोंद नाही</span>
                          )}
                        </td>
                        <td className="p-3">
                          {p.officeBearerVerified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#136938] bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              <span>सत्यापित</span>
                            </span>
                          ) : p.isOfficeBearer ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full">
                              <Clock className="w-3 h-3" />
                              <span>पडताळणी प्रलंबित</span>
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          {!p.officeBearerVerified && (
                            <Button
                              variant="outlined"
                              size="sm"
                              onClick={() => handleVerifyOfficeBearer(p.id)}
                              className="py-1 px-2.5 text-xs text-[#E35914] border-orange-300"
                            >
                              सत्यापित करा
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
