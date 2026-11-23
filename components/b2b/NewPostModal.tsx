import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { PostType, ResourceCategory } from '@/lib/types';
import { ShoppingCart, Package, Layers, Phone, MessageCircle } from 'lucide-react';

interface NewPostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPostModal: React.FC<NewPostModalProps> = ({ isOpen, onClose }) => {
  const { lang, currentUser, t } = useApp();

  const [postType, setPostType] = useState<PostType>('requirement');
  const [resourceCategory, setResourceCategory] = useState<ResourceCategory>('raw_material');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sector, setSector] = useState('Foundry & Metallurgy');
  const [district, setDistrict] = useState('Pune');
  const [businessName, setBusinessName] = useState(
    lang === 'en' ? 'Kulkarni Castings Pvt Ltd' : 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड'
  );
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '+91 98220 11223');
  const [contactWhatsapp, setContactWhatsapp] = useState(currentUser?.whatsappPhone || '+91 98220 11223');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/b2b', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorId: currentUser?.id,
          postType,
          resourceCategory: postType !== 'update' ? resourceCategory : undefined,
          title,
          content,
          sector,
          district,
          businessName,
          contactPhone,
          contactWhatsapp,
          tags: [sector, resourceCategory],
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTitle('');
        setContent('');
        onClose();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resourceCategories: { id: ResourceCategory; label: string }[] = [
    {
      id: 'raw_material',
      label:
        lang === 'en'
          ? 'Raw Material'
          : lang === 'hi'
          ? 'कच्चा माल (Raw Material)'
          : 'कच्चा माल (Raw Material)',
    },
    {
      id: 'machinery',
      label:
        lang === 'en'
          ? 'Machinery & Tools'
          : lang === 'hi'
          ? 'मशीनरी एवं उपकरण'
          : 'मशिनरी व उपकरणे',
    },
    {
      id: 'services',
      label:
        lang === 'en'
          ? 'Job Work & Services'
          : lang === 'hi'
          ? 'जॉब वर्क एवं सेवाएं'
          : 'जॉब वर्क व सेवा',
    },
    {
      id: 'space',
      label:
        lang === 'en'
          ? 'Shed / Warehouse'
          : lang === 'hi'
          ? 'शेड एवं गोदाम'
          : 'जागा व गोडाऊन',
    },
    {
      id: 'general',
      label:
        lang === 'en'
          ? 'General Resources'
          : lang === 'hi'
          ? 'अन्य संसाधन'
          : 'इतर संसाधने',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        lang === 'en'
          ? 'Publish B2B Post / Tender & Supply'
          : lang === 'hi'
          ? 'नवीन B2B निविदा अथवा पुरवठा नोंदवा'
          : 'नवीन B2B निविदा अथवा पुरवठा नोंदवा'
      }
      subtitle={
        lang === 'en'
          ? 'Post tenders for materials you need or publish supplier offers.'
          : lang === 'hi'
          ? 'आवश्यक सामग्री हेतु निविदा जारी करें अथवा पुरवठादार प्रस्ताव दर्ज करें।'
          : 'आपल्याला आवश्यक साहित्यासाठी निविदा प्रसिद्ध करा किंवा पुरवठादार क्षमता नोंदवा.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {/* Post Type Selector: Tenders vs Suppliers */}
        <div>
          <label className="block font-bold text-slate-800 mb-1.5">
            {lang === 'en' ? 'Select Post Type' : lang === 'hi' ? 'पोस्ट प्रकार चुनें' : 'पोस्ट प्रकार निवडा'} *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setPostType('requirement')}
              className={`p-3 text-left rounded-xl border font-semibold transition-all flex flex-col gap-1 ${
                postType === 'requirement'
                  ? 'border-[#E35914] bg-orange-50/80 text-[#E35914] ring-2 ring-orange-200'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <ShoppingCart className="w-4 h-4" />
                <span>
                  {lang === 'en' ? 'Tenders' : 'निविदा'}
                </span>
              </div>
              <span className="text-[11px] font-normal text-slate-500">
                {lang === 'en'
                  ? 'Publish material procurement or work requirement'
                  : 'कच्चा माल किंवा कामाची आवश्यकता निविदा स्वरूपात मांडा'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('offer')}
              className={`p-3 text-left rounded-xl border font-semibold transition-all flex flex-col gap-1 ${
                postType === 'offer'
                  ? 'border-[#136938] bg-emerald-50/80 text-[#136938] ring-2 ring-emerald-200'
                  : 'border-slate-200 text-slate-700 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-sm">
                <Package className="w-4 h-4" />
                <span>
                  {lang === 'en' ? 'Suppliers' : 'पुरवठादार'}
                </span>
              </div>
              <span className="text-[11px] font-normal text-slate-500">
                {lang === 'en'
                  ? 'Available machinery, raw materials and products'
                  : 'उपलब्ध मशिनरी, कच्चा माल व उत्पादने'}
              </span>
            </button>
          </div>
        </div>

        {/* Resource Category selector */}
        {postType !== 'update' && (
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en' ? 'Resource Category' : lang === 'hi' ? 'संसाधन श्रेणी' : 'संसाधनाचा प्रकार'} *
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {resourceCategories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setResourceCategory(cat.id)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border text-center transition-all ${
                    resourceCategory === cat.id
                      ? 'border-[#E35914] bg-orange-100 text-[#E35914]'
                      : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {postType === 'requirement'
              ? lang === 'en'
                ? 'What resource do you need? (Headline) *'
                : lang === 'hi'
                ? 'आपको किस सामग्री की आवश्यकता है? (शीर्षक) *'
                : 'आपल्याला नेमके कोणते संसाधन हवे आहे? (शीर्षक) *'
              : lang === 'en'
              ? 'Post Headline / Offer Title *'
              : lang === 'hi'
              ? 'पोस्ट शीर्षक *'
              : 'पोस्ट शीर्षक *'}
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder={
              postType === 'requirement'
                ? lang === 'en'
                  ? 'e.g. Requirement for 25 tons monthly casting scrap and pig iron in Chakan...'
                  : lang === 'hi'
                  ? 'उदा. चाकण कारखाने के लिए 25 टन कास्टिंग स्क्रैप एवं पिग आयरन की आवश्यकता...'
                  : 'उदा. चाकण कारखान्यासाठी दरमहा २५ टन कास्टिंग स्क्रॅप व पिग आयर्न हवे आहे...'
                : lang === 'en'
                ? 'e.g. Available monthly capacity of 50 Tons SG Iron castings...'
                : lang === 'hi'
                ? 'उदा. 50 टन SG आयरन कास्टिंग क्षमता उपलब्ध...'
                : 'उदा. ५० टन SG Iron कास्टिंग्स क्षमता उपलब्ध...'
            }
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en' ? 'Industry Sector' : lang === 'hi' ? 'उद्योग क्षेत्र' : 'उद्योग क्षेत्र'} *
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
            </select>
          </div>
          <div>
            <label className="block font-medium text-slate-700 mb-1">
              {lang === 'en'
                ? 'District / Industrial Estate'
                : lang === 'hi'
                ? 'जिला / औद्योगिक क्षेत्र'
                : 'जिल्हा / औद्योगिक वसाहत'}{' '}
              *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
              placeholder={lang === 'en' ? 'e.g. Chakan MIDC, Pune' : 'उदा. Chakan MIDC, Pune'}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {lang === 'en' ? 'Business / Company Name' : lang === 'hi' ? 'उद्योग / कंपनी का नाम' : 'उद्योग / व्यवसायाचे नाव'} *
          </label>
          <input
            type="text"
            required
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder={lang === 'en' ? 'e.g. Kulkarni Castings Pvt Ltd' : 'उदा. कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड'}
          />
        </div>

        {/* Direct Contact Details for Suppliers/Buyers */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
          <div className="font-bold text-slate-800 text-[11px] flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#E35914]" />
            <span>
              {lang === 'en'
                ? 'Direct Connect Details for Buyers & Suppliers'
                : lang === 'hi'
                ? 'आपूर्तिकर्ताओं एवं खरीदारों के लिए सीधा संपर्क विवरण'
                : 'पुरवठादार / ग्राहकांसाठी थेट संपर्क माहिती (Direct Connect Details)'}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] text-slate-600 mb-0.5">
                {lang === 'en' ? 'Direct Phone *' : lang === 'hi' ? 'कॉल फोन नंबर *' : 'कॉल फोन नंबर *'}
              </label>
              <input
                type="tel"
                required
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-[#E35914] bg-white font-mono"
                placeholder="+91 98220 11223"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-600 mb-0.5">
                {lang === 'en' ? 'WhatsApp Number' : lang === 'hi' ? 'व्हाट्सएप नंबर' : 'व्हॉट्सॲप नंबर'}
              </label>
              <input
                type="tel"
                value={contactWhatsapp}
                onChange={(e) => setContactWhatsapp(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 focus:border-[#E35914] bg-white font-mono"
                placeholder="+91 98220 11223"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-medium text-slate-700 mb-1">
            {lang === 'en' ? 'Details & Specifications' : lang === 'hi' ? 'विस्तृत विवरण एवं शर्तें' : 'सविस्तर तपशील, प्रमाण व अटी'} *
          </label>
          <textarea
            required
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:border-[#E35914] focus:outline-none"
            placeholder={
              postType === 'requirement'
                ? lang === 'en'
                  ? 'Specify technical grade, monthly volume (tons/units), delivery location, timeline, and commercial terms...'
                  : lang === 'hi'
                  ? 'आवश्यक ग्रेड, मात्रा (टन/संख्या), डिलीवरी स्थान एवं भुगतान शर्तें लिखें...'
                  : 'आवश्यक कच्च्या मालाचा ग्रेड, प्रमाण (टन/नग), नियमितता, डिलिव्हरी ठिकाण व पेमेंट अटी नमूद करा...'
                : lang === 'en'
                ? 'Specify technical specifications, pricing, supply capacity, and terms...'
                : lang === 'hi'
                ? 'सामग्री, तकनीकी मानक, दरें एवं संपर्क जानकारी...'
                : 'कच्चा माल, तांत्रिक निकष, दर, संपर्क माहिती...'
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
                ? 'Publishing...'
                : lang === 'hi'
                ? 'पोस्ट हो रहा है...'
                : 'पोस्ट होत आहे...'
              : postType === 'requirement'
              ? lang === 'en'
                ? 'Publish Requirement'
                : lang === 'hi'
                ? 'मांग प्रकाशित करें'
                : 'मागणी प्रसिद्ध करा'
              : t('b2b', 'publishBtn')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
