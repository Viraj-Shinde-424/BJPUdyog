import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Sparkles, Phone } from 'lucide-react';

interface RegisterBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RegisterBusinessModal: React.FC<RegisterBusinessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { lang, currentUser, t } = useApp();

  // Radio button selection: 'padadhikari' vs 'business'
  const [registrantType, setRegistrantType] = useState<'padadhikari' | 'business'>('business');
  const [businessStage, setBusinessStage] = useState<'existing' | 'aspiring'>('existing');

  const [ownerName, setOwnerName] = useState(currentUser?.fullName || '');
  const [businessName, setBusinessName] = useState('');
  const [sector, setSector] = useState('Foundry & Metallurgy');
  const [district, setDistrict] = useState('Pune');
  const [taluka, setTaluka] = useState('Haveli / Chakan');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [whatsappPhone, setWhatsappPhone] = useState(currentUser?.phone || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [optInDirectory, setOptInDirectory] = useState(true);

  // Padadhikari specific
  const [officeBearerTitle, setOfficeBearerTitle] = useState('जिल्हा संयोजक, भाजप उद्योग आघाडी');
  const [officeBearerScope, setOfficeBearerScope] = useState('पुणे जिल्हा (Pune District)');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isPadadhikari = registrantType === 'padadhikari';

    try {
      const res = await fetch('/api/directory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName,
          businessName: businessName || (isPadadhikari ? `${ownerName} - उद्योग संपर्क` : 'प्रस्तावित नवीन उद्योग'),
          sector,
          district,
          taluka,
          phone,
          whatsappPhone,
          email,
          address,
          description,
          optInDirectory,
          userCategory: isPadadhikari
            ? 'padadhikari'
            : businessStage === 'aspiring'
            ? 'business_aspiring'
            : 'business_existing',
          isOfficeBearerClaim: isPadadhikari,
          officeBearerTitle: isPadadhikari ? officeBearerTitle : undefined,
          officeBearerScope: isPadadhikari ? officeBearerScope : undefined,
          isAspiring: businessStage === 'aspiring',
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert(
          registrantType === 'padadhikari'
            ? 'पदाधिकारी नोंदणी यशस्वी! डिरेक्टरी व पडताळणी कक्षाकडे माहिती अद्ययावत झाली.'
            : 'व्यवसाय यशस्वीरीत्या नोंदवला गेला! डिरेक्टरी अद्ययावत झाली.'
        );
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={lang === 'en' ? 'Register Profile' : 'अधिकृत उद्योग व पदाधिकारी नोंदणी'}
      subtitle={
        lang === 'en'
          ? 'Register as an Office-Bearer or Business Owner / Aspiring Entrepreneur.'
          : 'पदाधिकारी अथवा विद्यमान/नवीन उद्योजक म्हणून नोंदणी करा.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* RADIO BUTTON SELECTOR WITH PADADHIKARI PROMINENTLY HIGHLIGHTED */}
        <div>
          <label className="block font-bold text-slate-800 mb-2">
            आपली भूमिका निवडा (Role) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* PADADHIKARI OPTION - HIGHLIGHTED */}
            <label
              className={`rounded-xl p-3 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                registrantType === 'padadhikari'
                  ? 'border-[#E35914] bg-orange-50/80 ring-2 ring-orange-200 shadow-xs'
                  : 'border-orange-300 bg-orange-50/20 hover:border-[#E35914]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="modalRegistrantType"
                    value="padadhikari"
                    checked={registrantType === 'padadhikari'}
                    onChange={() => setRegistrantType('padadhikari')}
                    className="text-[#E35914] focus:ring-[#E35914]"
                  />
                  <span className="font-extrabold text-xs text-slate-900">
                    पदाधिकारी (Padadhikari)
                  </span>
                </div>
                <span className="text-[10px] font-bold text-white bg-[#E35914] px-1.5 py-0.2 rounded-full">
                  विशेष
                </span>
              </div>
              <p className="text-[10px] text-slate-600 pl-4">
                भाजप उद्योग आघाडी पदाधिकारी नोंदणी
              </p>
            </label>

            {/* BUSINESS MEN / ASPIRING OPTION */}
            <label
              className={`rounded-xl p-3 cursor-pointer border-2 transition-all flex flex-col justify-between ${
                registrantType === 'business'
                  ? 'border-slate-800 bg-slate-50 ring-2 ring-slate-200'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <input
                    type="radio"
                    name="modalRegistrantType"
                    value="business"
                    checked={registrantType === 'business'}
                    onChange={() => setRegistrantType('business')}
                    className="text-slate-900 focus:ring-slate-900"
                  />
                  <span className="font-bold text-xs text-slate-900">
                    उद्योजक / नवीन व्यवसाय
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 bg-slate-100 px-1 rounded">
                  Business
                </span>
              </div>
              <p className="text-[10px] text-slate-500 pl-4">
                विद्यमान अथवा नवीन उद्योग सुरू करणारे
              </p>
            </label>
          </div>
        </div>

        {/* Business Stage Sub-selection */}
        {registrantType === 'business' && (
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center gap-3 text-[11px]">
            <span className="font-semibold text-slate-700">स्थिती:</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="modalBusinessStage"
                checked={businessStage === 'existing'}
                onChange={() => setBusinessStage('existing')}
                className="text-[#E35914]"
              />
              <span>विद्यमान उद्योग (Operating)</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer text-[#E35914]">
              <input
                type="radio"
                name="modalBusinessStage"
                checked={businessStage === 'aspiring'}
                onChange={() => setBusinessStage('aspiring')}
                className="text-[#E35914]"
              />
              <span className="font-medium">नवीन सुरू करायचा आहे (Want to Start)</span>
            </label>
          </div>
        )}

        {/* Padadhikari Highlighted Box */}
        {registrantType === 'padadhikari' && (
          <div className="bg-orange-50/80 border border-orange-300 p-3 rounded-xl space-y-2">
            <div className="text-[11px] font-bold text-[#E35914] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>पदाधिकारी पदनाम व संघटना कार्यक्षेत्र</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                  पदनाम (Designation) *
                </label>
                <input
                  type="text"
                  required
                  value={officeBearerTitle}
                  onChange={(e) => setOfficeBearerTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-orange-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-0.5">
                  कार्यक्षेत्र / Scope (उदा. पुणे जिल्हा) *
                </label>
                <input
                  type="text"
                  required
                  value={officeBearerScope}
                  onChange={(e) => setOfficeBearerScope(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-orange-300 text-xs bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Name and Business Name */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en' ? "Full Name" : 'उद्योजक / पदाधिकाऱ्याचे नाव'} *
            </label>
            <input
              type="text"
              required
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder="उदा. आनंद कुलकर्णी"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {businessStage === 'aspiring'
                ? 'प्रस्तावित उद्योग नाव *'
                : 'उद्योग / व्यवसायाचे नाव *'}
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder="उदा. कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड"
            />
          </div>
        </div>

        {/* Location & Sector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              जिल्हा (District) *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder="उदा. Pune"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              तालुका / शहर (Taluka / City) *
            </label>
            <input
              type="text"
              required
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder="उदा. हवेली / चाकण"
            />
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              उद्योग क्षेत्र (Sector) *
            </label>
            <select
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            >
              <option value="Foundry & Metallurgy">Foundry & Metallurgy</option>
              <option value="Auto & Engineering">Auto & Engineering</option>
              <option value="Plastics & Polymers">Plastics & Polymers</option>
              <option value="Food Processing">Food Processing</option>
              <option value="Electronics & IT">Electronics & IT</option>
              <option value="Textiles">Textiles & Garments</option>
            </select>
          </div>
        </div>

        {/* Important Contact Details */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
          <div className="font-bold text-slate-800 text-[11px] mb-2 flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-[#136938]" />
            <span>महत्त्वाचे संपर्क तपशील *</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                मोबाईल फोन *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                placeholder="+91 98220 12345"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                व्हॉट्सअॅप *
              </label>
              <input
                type="tel"
                required
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                placeholder="+91 98220 12345"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-700 mb-1">
                ईमेल पत्ता
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                placeholder="info@biz.in"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            पत्ता / औद्योगिक वसाहत
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder="उदा. प्लॉट बी-४२, चाकण एमआयडीसी टप्पा २, पुणे"
          />
        </div>

        {/* Directory Opt-in */}
        <div className="bg-orange-50/70 p-2.5 rounded-xl border border-orange-200">
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={optInDirectory}
              onChange={(e) => setOptInDirectory(e.target.checked)}
              className="mt-0.5 text-[#E35914] focus:ring-[#E35914]"
            />
            <span className="font-bold text-slate-900 text-[11px]">
              सार्वजनिक डिरेक्टरीमध्ये नाव प्रसिद्ध करण्यास संमती द्या (Opt-in)
            </span>
          </label>
        </div>

        <div className="pt-2 border-t border-slate-200 flex items-center justify-end gap-2">
          <Button type="button" variant="outlined" onClick={onClose} size="sm">
            रद्द करा
          </Button>
          <Button type="submit" variant="primary" disabled={loading} size="sm">
            {loading ? 'नोंदणी होत आहे...' : 'नोंदणी पूर्ण करा'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
