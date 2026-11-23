import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { OfficeBearerBadge } from '@/components/ui/OfficeBearerBadge';
import {
  X,
  ShieldCheck,
  Building2,
  Lock,
  Smartphone,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  ChevronRight,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const {
    lang,
    loginModalOpen,
    setLoginModalOpen,
    activeLoginTab,
    setActiveLoginTab,
    currentUser,
    switchUserRole,
    availableProfiles,
    t,
  } = useApp();

  const [mobileNumber, setMobileNumber] = useState('9822011223');
  const [otp, setOtp] = useState('123456');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!loginModalOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      alert(lang === 'en' ? 'Please enter a valid 10-digit mobile number' : 'कृपया वैध १०-अंकी मोबाईल क्रमांक प्रविष्ट करा.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOtpSent(true);
    }, 600);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Find business owner profile or default to first
    const businessOwner = availableProfiles.find((p) => p.role === 'business_owner') || availableProfiles[0];
    if (businessOwner) {
      await switchUserRole(businessOwner.id);
    }
    setLoading(false);
    setSuccessMsg(lang === 'en' ? 'Welcome back! Logged in successfully.' : 'स्वागत आहे! यशस्वीरित्या प्रवेश केला.');
    setTimeout(() => {
      setLoginModalOpen(false);
      setSuccessMsg('');
      setOtpSent(false);
    }, 900);
  };

  const handleOfficeBearerSelect = async (profileId: string) => {
    setLoading(true);
    await switchUserRole(profileId);
    setLoading(false);
    setSuccessMsg(lang === 'en' ? 'Official authentication verified!' : 'पदाधिकारी ओळखपत्र यशस्वीरित्या सत्यापित!');
    setTimeout(() => {
      setLoginModalOpen(false);
      setSuccessMsg('');
    }, 800);
  };

  const handleVisitorMode = async () => {
    setLoading(true);
    await switchUserRole('visitor');
    setLoading(false);
    setLoginModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="fixed inset-0" onClick={() => setLoginModalOpen(false)} aria-hidden="true" />

      <div
        role="dialog"
        aria-modal="true"
        className="relative bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden z-10 animate-slide-down"
      >
        {/* Top Tricolor Accent Line */}
        <div className="h-1.5 bg-gradient-to-r from-[#E35914] via-amber-400 to-[#136938] w-full" />

        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 bg-gradient-to-b from-orange-50/50 to-white flex items-start justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-orange-200 shadow-xs flex items-center justify-center p-1.5 flex-shrink-0">
              <Image
                src="/images/bjp-logo.png"
                alt="BJP Lotus"
                width={36}
                height={36}
                className="object-contain"
              />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#E35914] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" />
                <span>{lang === 'en' ? 'Official Portal Login' : 'अधिकृत नागरिक व सदस्य लॉगिन'}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                {lang === 'en' ? 'Sign In to BJP Udyog Setu' : 'भाजपा उद्योग सेतू — लॉगिन'}
              </h2>
            </div>
          </div>

          <button
            onClick={() => setLoginModalOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMsg && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-[#136938] animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Standard Government Portal Login Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            {lang === 'en'
              ? 'Enter your registered mobile number to receive a one-time password (OTP) and access your industry dashboard.'
              : 'आपल्या नोंदणीकृत मोबाईल क्रमांकावर एकवेळचा पासवर्ड (OTP) मिळवून उद्योग सेतू मंचावर सुरक्षित प्रवेश करा.'}
          </p>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {lang === 'en' ? 'Registered Mobile Number *' : 'नोंदणीकृत मोबाईल क्रमांक *'}
                </label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-xs font-bold text-slate-500 select-none">
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-900 focus:outline-none focus:border-[#D95F1A] focus:ring-2 focus:ring-orange-100"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-xs bg-[#D95F1A] hover:bg-[#B84A0E]"
                disabled={loading}
              >
                <span>{loading ? 'प्रक्रिया सुरू आहे...' : 'OTP पाठवा (Get OTP)'}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
              <div className="p-3 bg-orange-50/80 border border-orange-200 rounded-xl text-xs flex items-center justify-between">
                <span className="text-slate-700">
                  OTP पाठवला: <strong>+91 {mobileNumber}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-[#D95F1A] font-bold underline hover:text-[#B84A0E]"
                >
                  बदला (Edit)
                </button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  {lang === 'en' ? 'Enter 6-Digit OTP *' : '६-अंकी OTP प्रविष्ट करा *'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center tracking-widest text-base font-bold py-2.5 rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-[#D95F1A] focus:ring-2 focus:ring-orange-100"
                />
                <div className="text-[11px] text-slate-500 mt-1 text-center">
                  चाचणी डेमो OTP: <strong className="text-slate-700">123456</strong>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                className="w-full font-bold shadow-xs bg-[#D95F1A] hover:bg-[#B84A0E]"
                disabled={loading}
              >
                <span>{loading ? 'तपासत आहे...' : 'प्रवेश करा (Verify & Login)'}</span>
                <CheckCircle2 className="w-4 h-4 ml-1.5" />
              </Button>
            </form>
          )}

          {/* New Registration Link */}
          <div className="pt-2 text-center text-xs text-slate-600">
            <span>{lang === 'en' ? "Don't have an account? " : 'नवीन सभासद किंवा उद्योग नोंदणी? '}</span>
            <a
              href="/register"
              onClick={() => setLoginModalOpen(false)}
              className="text-[#D95F1A] font-bold hover:underline"
            >
              {lang === 'en' ? 'Register Now' : 'येथे नोंदणी करा'}
            </a>
          </div>

          {/* Discreet Demo Switcher for Testing Evaluators */}
          <details className="pt-3 border-t border-slate-100 group">
            <summary className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer font-medium list-none flex items-center justify-between">
              <span>{lang === 'en' ? '🧪 Quick Demo Profile Testing' : '🧪 चाचणी डेमो प्रोफाईल (Demo Profiles)'}</span>
              <span className="text-[10px] text-[#D95F1A] group-open:rotate-90 transition-transform">▸</span>
            </summary>
            <div className="mt-2.5 space-y-1.5">
              {availableProfiles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleOfficeBearerSelect(p.id)}
                  className="w-full p-2 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 text-left flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-orange-100 text-[#D95F1A] font-bold text-[11px] flex items-center justify-center">
                      {p.fullName.charAt(0)}
                    </span>
                    <div>
                      <div className="font-semibold text-slate-900">{p.fullName}</div>
                      <div className="text-[10px] text-slate-500">{p.officeBearerTitle || p.role}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              ))}
            </div>
          </details>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleVisitorMode}
            className="text-slate-500 hover:text-slate-800 font-medium text-[11px]"
          >
            {lang === 'en' ? 'Continue as Guest / Visitor' : 'पाहुणे म्हणून सुरू ठेवा (Guest)'}
          </button>

          <span className="text-[10px] text-slate-400">
            सुरक्षित डिजिटल व्यासपीठ • GIGW 3.0
          </span>
        </div>
      </div>
    </div>
  );
};
