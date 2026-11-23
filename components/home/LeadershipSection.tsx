import React, { useState } from 'react';
import Image from 'next/image';
import { useApp } from '@/lib/context/AppContext';
import { Button } from '@/components/ui/Button';
import { MeetingRequestModal } from '@/components/leadership/MeetingRequestModal';
import { Calendar, ShieldCheck, Quote, Building2, CheckCircle2 } from 'lucide-react';

export const LeadershipSection: React.FC = () => {
  const { lang, t } = useApp();
  const [selectedLeaderKey, setSelectedLeaderKey] = useState<
    'narendra-modi' | 'devendra-fadnavis' | 'ravindra-chavan' | null
  >(null);
  const [modalOpen, setModalOpen] = useState(false);

  const leaders = [
    {
      key: 'narendra-modi' as const,
      name: t('leadership', 'modiName'),
      designation:
        lang === 'en'
          ? 'Hon. Prime Minister of India'
          : lang === 'hi'
          ? 'माननीय प्रधानमंत्री, भारत सरकार'
          : 'मा. पंतप्रधान, भारत सरकार',
      image: '/images/leadership/narendra-modi.jpg',
      badge:
        lang === 'en'
          ? 'National Leadership'
          : lang === 'hi'
          ? 'राष्ट्रीय नेतृत्व'
          : 'राष्ट्रीय नेतृत्व',
      quote:
        lang === 'en'
          ? 'Empowering MSMEs, driving Make in India, and building a self-reliant Atmanirbhar Bharat.'
          : lang === 'hi'
          ? 'आत्मनिर्भर भारत, मेक इन इंडिया और स्थानीय उद्योगों का वैश्विक सशक्तिकरण।'
          : 'आत्मनिर्भर भारत, मेक इन इंडिया आणि देशातील एमएसएमई उद्योगांचे जागतिक सक्षमीकरण.',
      scope:
        lang === 'en'
          ? 'National Industrial Policy, Export Promotion & MSME Capital Schemes'
          : lang === 'hi'
          ? 'राष्ट्रीय औद्योगिक नीति, निर्यात प्रोत्साहन एवं एमएसएमई पूंजीगत योजनाएं'
          : 'राष्ट्रीय औद्योगिक धोरण, निर्यात सक्षमीकरण व केंद्रीय एमएसएमई योजना',
    },
    {
      key: 'devendra-fadnavis' as const,
      name: t('leadership', 'fadnavisName'),
      designation:
        lang === 'en'
          ? 'Hon. Chief Minister, Maharashtra'
          : lang === 'hi'
          ? 'माननीय मुख्यमंत्री, महाराष्ट्र राज्य'
          : 'मा. मुख्यमंत्री, महाराष्ट्र राज्य',
      image: '/images/leadership/devendra-fadnavis.jpg',
      badge:
        lang === 'en'
          ? 'State Leadership'
          : lang === 'hi'
          ? 'महाराष्ट्र शासन नेतृत्व'
          : 'महाराष्ट्र शासन नेतृत्व',
      quote:
        lang === 'en'
          ? "Accelerating Maharashtra's historic march towards a $1 Trillion industrial economy."
          : lang === 'hi'
          ? 'मैग्नेटिक महाराष्ट्र २.० और राज्य की १ ट्रिलियन डॉलर अर्थव्यवस्था की ओर ऐतिहासिक गति।'
          : 'मॅग्नेटिक महाराष्ट्र २.० आणि राज्याची १ ट्रिलियन डॉलर अर्थव्यवस्थेच्या दिशेने ऐतिहासिक वाटचाल.',
      scope:
        lang === 'en'
          ? 'Magnetic Maharashtra, Industrial Infrastructure, Cluster Parks & Single Window'
          : lang === 'hi'
          ? 'बुनियादी ढांचा, औद्योगिक क्लस्टर्स, त्वरित परवाने एवं पूंजीगत प्रोत्साहन'
          : 'औद्योगिक पायाभूत सुविधा, क्लस्टर विकास, परवाने सुलभीकरण व राज्य धोरणे',
    },
    {
      key: 'ravindra-chavan' as const,
      name: t('leadership', 'chavanName'),
      designation:
        lang === 'en'
          ? 'Hon. Minister & Industry Aghadi Leadership'
          : lang === 'hi'
          ? 'माननीय मंत्री एवं उद्योग आघाडी नेतृत्व'
          : 'मा. मंत्री, महाराष्ट्र शासन व उद्योग आघाडी नेतृत्व',
      image: '/images/leadership/ravindra-chavan.jpg',
      badge:
        lang === 'en'
          ? 'Industry Aghadi Liaison'
          : lang === 'hi'
          ? 'उद्योग समन्वय व संवाद'
          : 'उद्योग समन्वय व संवाद',
      quote:
        lang === 'en'
          ? 'Direct resolution of local industry association issues, MIDC grievances, and entrepreneur welfare.'
          : lang === 'hi'
          ? 'स्थानीय उद्योग संघों के प्रश्नों, एमआईडीसी समस्याओं का त्वरित समाधान और उद्यमी कल्याण।'
          : 'स्थानिक उद्योग संघटनांचे प्रश्न, एमआयडीसी समस्यांचे थेट निवारण व उद्योजक कल्याण.',
      scope:
        lang === 'en'
          ? 'Association Redressal, MPCB/MSEDCL Coordination & Delegation Meetings'
          : lang === 'hi'
          ? 'एसोसिएशन समन्वय, वीज व प्रदूषण निवारण एवं प्रतिनिधिमंडल संवाद'
          : 'स्थानिक असोसिएशन समन्वय, वीज/प्रदूषण प्रश्न व थेट शिष्टमंडळ संवाद',
    },
  ];

  const handleOpenMeeting = (leaderKey: 'narendra-modi' | 'devendra-fadnavis' | 'ravindra-chavan') => {
    setSelectedLeaderKey(leaderKey);
    setModalOpen(true);
  };

  return (
    <section className="py-12 sm:py-16 xl:py-20 bg-white border-b border-slate-200">
      <div className="max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Dignified Section Header */}
        <div className="text-center max-w-3xl xl:max-w-4xl mx-auto mb-10 xl:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200/80 text-[11px] font-bold text-[#D95F1A] mb-3 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>
              {lang === 'en'
                ? 'Leadership & Policy Guidance • BJP Udyog Setu'
                : lang === 'hi'
                ? 'सर्वोच्च नेतृत्व एवं धोरण दिशा • भाजपा उद्योग सेतु'
                : 'सर्वोच्च नेतृत्व व धोरण दिशा • भाजपा उद्योग सेतू'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {lang === 'en'
              ? 'Leadership & State Industry Coordination'
              : lang === 'hi'
              ? 'सर्वोच्च नेतृत्व एवं उद्योग समन्वय'
              : 'सर्वोच्च नेतृत्व व उद्योग समन्वय'}
          </h2>

          <p className="mt-2 text-xs sm:text-sm xl:text-base text-slate-600 leading-relaxed font-normal max-w-2xl xl:max-w-3xl mx-auto">
            {lang === 'en'
              ? "Official leadership coordination platform driving Atmanirbhar Bharat and Maharashtra's $1 Trillion industrial economy."
              : lang === 'hi'
              ? 'आत्मनिर्भर भारत और महाराष्ट्र की १ ट्रिलियन डॉलर अर्थव्यवस्था के निर्माण के लिए अधिकृत नेतृत्व मंच।'
              : 'विकसित भारत आणि $१ ट्रिलियन समृद्ध महाराष्ट्राच्या उभारणीसाठी अधिकृत नेतृत्व समन्वय मंच.'}
          </p>
        </div>

        {/* 3 Executive Leadership Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 xl:gap-8 max-w-[1440px] 2xl:max-w-[1600px] mx-auto mb-8 xl:mb-10">
          {leaders.map((leader) => (
            <div
              key={leader.key}
              className="bg-white rounded-2xl border border-slate-200 hover:border-orange-300 p-6 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Dignitary Profile Row */}
                <div className="flex items-center gap-3.5 mb-4">
                  {/* Circular Portrait with Prestige Rings */}
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-orange-300 bg-[#D95F1A] p-0.5 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={leader.image}
                        alt={leader.name}
                        fill
                        className="object-cover object-top"
                        sizes="64px"
                        priority
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100/90 text-[#D95F1A] border border-orange-200/80">
                      {leader.badge}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 leading-tight mt-1 group-hover:text-[#D95F1A] transition-colors">
                      {leader.name}
                    </h3>
                    <div className="text-xs text-[#136938] font-bold mt-0.5 leading-snug">
                      {leader.designation}
                    </div>
                  </div>
                </div>

                {/* Quote Box */}
                <div className="bg-[#FAF7F2] p-3 rounded-xl border border-orange-100/80 mb-4">
                  <div className="flex gap-2">
                    <Quote className="w-3.5 h-3.5 text-[#D95F1A] flex-shrink-0 mt-0.5 opacity-70" />
                    <p className="text-[11.5px] italic text-slate-700 leading-relaxed font-medium">
                      "{leader.quote}"
                    </p>
                  </div>
                </div>

                {/* Scope & Focus */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    {lang === 'en' ? 'Core Focus & Scope' : 'मुख्य धोरण व व्याप्ती'}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {leader.scope}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3.5 border-t border-slate-100">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full font-bold shadow-none py-2.5 rounded-xl bg-[#D95F1A] hover:bg-[#B84A0E] flex items-center justify-center gap-1.5"
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  onClick={() => handleOpenMeeting(leader.key)}
                >
                  <span>
                    {lang === 'en'
                      ? 'Request Official Meeting'
                      : lang === 'hi'
                      ? 'शिष्टमंडल / बैठक अनुरोध'
                      : 'शिष्टमंडळ / बैठक विनंती'}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Administrative Protocol Notice */}
        <div className="bg-[#FAF7F2] border border-orange-200/60 rounded-xl py-3 px-4 max-w-3xl mx-auto flex items-center justify-center gap-2 text-center text-xs text-slate-600">
          <CheckCircle2 className="w-4 h-4 text-[#136938] flex-shrink-0" />
          <span>
            {lang === 'en'
              ? 'All delegation and industry meeting requests are routed through verified administrative protocols.'
              : lang === 'hi'
              ? 'सभी शिष्टमंडल एवं उद्योग बैठक अनुरोध अधिकृत प्रशासनिक एवं संगठनात्मक प्रोटोकॉल के तहत संसाधित किए जाते हैं।'
              : 'सर्व शिष्टमंडळ व उद्योग भेट विनंत्या अधिकृत शासकीय व संघटनात्मक प्रोटोकॉलनुसार हाताळल्या जातात.'}
          </span>
        </div>
      </div>

      {modalOpen && selectedLeaderKey && (
        <MeetingRequestModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          preselectedLeaderKey={selectedLeaderKey}
        />
      )}
    </section>
  );
};