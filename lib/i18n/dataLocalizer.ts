import { Language, Business, B2BPost, SamvadTopic, Grievance, SchemeMatch } from '@/lib/types';

// Sector Translations
export const sectorTranslations: Record<string, Record<Language, string>> = {
  'Foundry & Metallurgy': {
    mr: 'फाउंड्री व धातू उद्योग',
    hi: 'फाउंड्री एवं धातु उद्योग',
    en: 'Foundry & Metallurgy',
  },
  'Auto & Engineering': {
    mr: 'ऑटो व अभियांत्रिकी उद्योग',
    hi: 'ऑटो एवं इंजीनियरिंग उद्योग',
    en: 'Auto & Engineering',
  },
  'Plastics & Polymers': {
    mr: 'प्लास्टिक व पॉलिमर उद्योग',
    hi: 'प्लास्टिक एवं पॉलिमर उद्योग',
    en: 'Plastics & Polymers',
  },
  'Food Processing': {
    mr: 'अन्न प्रक्रिया उद्योग',
    hi: 'खाद्य प्रसंस्करण उद्योग',
    en: 'Food Processing',
  },
  'Electronics & IT': {
    mr: 'इलेक्ट्रॉनिक्स व माहिती तंत्रज्ञान',
    hi: 'इलेक्ट्रॉनिक्स एवं आईटी',
    en: 'Electronics & IT',
  },
};

export const resourceCategoryTranslations: Record<string, Record<Language, string>> = {
  raw_material: {
    mr: 'कच्चा माल (Raw Material)',
    hi: 'कच्चा माल (Raw Material)',
    en: 'Raw Material',
  },
  machinery: {
    mr: 'यंत्रसामग्री व उपकरणे',
    hi: 'यंत्रसामग्री एवं उपकरण',
    en: 'Machinery & Equipment',
  },
  services: {
    mr: 'औद्योगिक सेवा व जॉबवर्क',
    hi: 'औद्योगिक सेवाएं एवं जॉबवर्क',
    en: 'Services & Jobwork',
  },
  space: {
    mr: 'जागा व औद्योगिक शेड',
    hi: 'भूमि एवं औद्योगिक शेड',
    en: 'Industrial Space & Sheds',
  },
  general: {
    mr: 'सामान्य माहिती',
    hi: 'सामान्य जानकारी',
    en: 'General',
  },
};

export const postTypeTranslations: Record<string, Record<Language, string>> = {
  offer: {
    mr: 'विक्री / उत्पादन क्षमता (Offer)',
    hi: 'बिक्री / उपलब्धता (Offer)',
    en: 'Available for Sale / Supply (Offer)',
  },
  requirement: {
    mr: 'खरेदी मागणी (Requirement)',
    hi: 'खरीद मांग (Requirement)',
    en: 'Buyer Requirement (Demand)',
  },
  update: {
    mr: 'उद्योग अपडेट (Update)',
    hi: 'उद्योग अपडेट (Update)',
    en: 'Industry Update',
  },
};

export const districtTranslations: Record<string, Record<Language, string>> = {
  Pune: { mr: 'पुणे', hi: 'पुणे', en: 'Pune' },
  Nashik: { mr: 'नाशिक', hi: 'नासिक', en: 'Nashik' },
  Kolhapur: { mr: 'कोल्हापूर', hi: 'कोल्हापुर', en: 'Kolhapur' },
  Solapur: { mr: 'सोलापूर', hi: 'सोलापुर', en: 'Solapur' },
  'Chhatrapati Sambhajinagar': {
    mr: 'छत्रपती संभाजीनगर',
    hi: 'छत्रपति संभाजीनगर',
    en: 'Chhatrapati Sambhajinagar',
  },
  Thane: { mr: 'ठाणे', hi: 'ठाणे', en: 'Thane' },
  Nagpur: { mr: 'नागपूर', hi: 'नागपुर', en: 'Nagpur' },
  Mumbai: { mr: 'मुंबई', hi: 'मुंबई', en: 'Mumbai' },
};

export function localizeSector(sector: string, lang: Language): string {
  if (sector === 'all') {
    return lang === 'en' ? 'All Sectors' : lang === 'hi' ? 'सभी क्षेत्र' : 'सर्व क्षेत्रे';
  }
  return sectorTranslations[sector]?.[lang] || sector;
}

export function localizeCategory(category: string, lang: Language): string {
  if (category === 'all') {
    return lang === 'en' ? 'All Categories' : lang === 'hi' ? 'सभी श्रेणियां' : 'सर्व श्रेणी';
  }
  return resourceCategoryTranslations[category]?.[lang] || category;
}

export function localizePostType(type: string, lang: Language): string {
  if (type === 'all') {
    return lang === 'en' ? 'All Types' : lang === 'hi' ? 'सभी प्रकार' : 'सर्व प्रकार';
  }
  return postTypeTranslations[type]?.[lang] || type;
}

export function localizeDistrict(district: string, lang: Language): string {
  return districtTranslations[district]?.[lang] || district;
}

// Businesses Localization Dictionary
const businessData: Record<string, Record<Language, { name: string; desc: string; addr: string; ownerName?: string }>> = {
  'biz-kulkarni-castings': {
    mr: {
      name: 'कुलकर्णी कास्टिंग्स प्रायव्हेट लिमिटेड',
      desc: 'ऑटोमोटिव्ह आणि पंप उद्योगांसाठी उच्च दर्जाचे एसजी आयर्न व ग्रे आयर्न कास्टिंग्स उत्पादन.',
      addr: 'प्लॉट बी-४२, चाकण औद्योगिक क्षेत्र, टप्पा २, पुणे - ४१०५०१',
      ownerName: 'आनंद कुलकर्णी',
    },
    hi: {
      name: 'कुलकर्णी कास्टिंग्स प्राइवेट लिमिटेड',
      desc: 'ऑटोमोटिव और पंप उद्योगों के लिए उच्च गुणवत्ता वाले एसजी आयरन और ग्रे आयरन कास्टिंग्स निर्माण।',
      addr: 'प्लॉट बी-४२, चाकण औद्योगिक क्षेत्र, फेज २, पुणे - ४१०५०१',
      ownerName: 'आनंद कुलकर्णी',
    },
    en: {
      name: 'Kulkarni Castings Pvt Ltd',
      desc: 'Specialized in precision SG Iron and Grey Iron castings for automotive and pump industries.',
      addr: 'Plot B-42, Chakan Industrial Area, Phase II, Pune - 410501',
      ownerName: 'Anand Kulkarni',
    },
  },
  'biz-gaikwad-auto': {
    mr: {
      name: 'गायकवाड ऑटो कम्पोनंट्स',
      desc: 'ओईएम उत्पादकांसाठी हाय-प्रिसिजन टर्न्ड पार्ट्स, स्टॅम्पिंग डायज आणि सब-असेम्ब्लीज.',
      addr: 'एमआयडीसी भोसरी, सेक्टर ७, पिंपरी-चिंचवड, पुणे - ४११०२६',
      ownerName: 'सुनील गायकवाड',
    },
    hi: {
      name: 'गायकवाड ऑटो कंपोनेंट्स',
      desc: 'ओईएम निर्माताओं के लिए उच्च परिशुद्धता टर्नड पार्ट्स, स्टैम्पिंग डाइज और सब-असेंबली।',
      addr: 'एमआईडीसी भोसरी, सेक्टर ७, पीसीएमसी, पुणे - ४११०२६',
      ownerName: 'सुनील गायकवाड',
    },
    en: {
      name: 'Gaikwad Auto Components',
      desc: 'High-precision turned parts, stamping dies and sub-assemblies for OEMs.',
      addr: 'MIDC Bhosari, Sector 7, PCMC, Pune - 411026',
      ownerName: 'Sunil Gaikwad',
    },
  },
  'biz-mahajan-polymers': {
    mr: {
      name: 'महाजन पॉलिमर इंडस्ट्रीज',
      desc: 'औद्योगिक ब्लो-मोल्डेड कंटेनर्स, क्रेट्स आणि पुनर्वापर केलेले इको-पॉलिमर ग्रॅन्यूल्स.',
      addr: 'शेंद्रा एमआयडीसी, छत्रपती संभाजीनगर - ४३१००७',
      ownerName: 'प्रशांत महाजन',
    },
    hi: {
      name: 'महाजन पॉलिमर इंडस्ट्रीज',
      desc: 'औद्योगिक ब्लो-मोल्डेड कंटेनर, क्रेट्स और पुनर्नवीनीकरण पर्यावरण-अनुकूल पॉलिमर ग्रैन्यूल्स।',
      addr: 'शेंद्रा एमआईडीसी, छत्रपति संभाजीनगर - ४३१००७',
      ownerName: 'प्रशांत महाजन',
    },
    en: {
      name: 'Mahajan Polymer Industries',
      desc: 'Industrial blow-moulded containers, crates, and recycled eco-polymer granules.',
      addr: 'Shendra MIDC, Chhatrapati Sambhajinagar - 431007',
      ownerName: 'Prashant Mahajan',
    },
  },
  'biz-desai-ev': {
    mr: {
      name: 'देसाई ईव्ही टेक सोल्युशन्स',
      desc: 'ऑटोमोटिव्ह इलेक्ट्रिक वाहन बॅटरी ट्रे एन्क्लोजर्स, वायरिंग हार्नेस आणि थर्मल व्यवस्थापन युनिट्स.',
      addr: 'प्लॉट ए-१८, तळेगाव एमआयडीसी टप्पा-१, पुणे - ४१०५०७',
      ownerName: 'विनायक देसाई',
    },
    hi: {
      name: 'देसाई ईवी टेक सॉल्यूशंस',
      desc: 'ऑटोमोटिव इलेक्ट्रिक वाहन बैटरी ट्रे एनक्लोजर, वायरिंग हार्नेस और थर्मल प्रबंधन इकाइयां।',
      addr: 'प्लॉट ए-१८, तालेगांव एमआईडीसी फेज-१, पुणे - ४१०५०७',
      ownerName: 'विनायक देसाई',
    },
    en: {
      name: 'Desai EV Tech Solutions',
      desc: 'Automotive electric vehicle battery tray enclosures, wiring harnesses and thermal management units.',
      addr: 'Plot A-18, Talegaon MIDC Phase-1, Pune - 410507',
      ownerName: 'Vinayak Desai',
    },
  },
  'biz-sahyadri-agro': {
    mr: {
      name: 'सह्याद्री ॲग्रो पॅक प्रा. लि.',
      desc: 'मल्टी-लेयर बॅरिअर व्हॅक्यूम पॅकेजिंग पाऊचेस, सुकामेवा पाऊचेस आणि कृषी शीतगृह क्रेट्स.',
      addr: 'प्लॉट सी-३, अंबड एमआयडीसी, नाशिक - ४२२०१०',
      ownerName: 'सौ. सुवर्णा पाटील',
    },
    hi: {
      name: 'सह्याद्री एग्रो पैक प्रा. लि.',
      desc: 'मल्टी-लेयर बैरियर वैक्यूम पैकेजिंग पाउच, सूखे मेवे के पाउच और कृषि कोल्ड स्टोरेज क्रेट्स।',
      addr: 'प्लॉट सी-३, अंबड एमआईडीसी, नासिक - ४२२०१०',
      ownerName: 'सौ. सुवर्णा पाटिल',
    },
    en: {
      name: 'Sahyadri Agro Pack Pvt Ltd',
      desc: 'Multi-layer barrier vacuum packaging pouches, dry food pouches, and agricultural cold storage crates.',
      addr: 'Plot C-3, Ambad MIDC, Nashik - 422010',
      ownerName: 'Mrs. Suvarna Patil',
    },
  },
  'biz-solapur-textile': {
    mr: {
      name: 'सोलापूर टेक्सटाइल क्लस्टर प्रा. लि.',
      desc: 'रूफटॉप सोलर ऊर्जेवर आधारित उच्च दर्जाचे टेरी टॉवेल्स आणि औद्योगिक कापड उत्पादन क्लस्टर.',
      addr: 'प्लॉट ७२, सोलापूर एमआयडीसी, छत्रपती संभाजी रोड, सोलापूर - ४१३००६',
      ownerName: 'रमेश शहा',
    },
    hi: {
      name: 'सोलापुर टेक्सटाइल क्लस्टर प्रा. लि.',
      desc: 'रूफटॉप सोलर ऊर्जा पर आधारित उच्च गुणवत्ता वाले टेरी टॉवेल्स और औद्योगिक कपड़ा बुनाई क्लस्टर।',
      addr: 'प्लॉट ७२, सोलापुर एमआईडीसी, सोलापुर - ४१३००६',
      ownerName: 'रमेश शाह',
    },
    en: {
      name: 'Solapur Textile Cluster Pvt Ltd',
      desc: 'Integrated terry towel and industrial fabric weaving with dedicated green energy rooftop solar infrastructure.',
      addr: 'Plot 72, Solapur MIDC, Solapur - 413006',
      ownerName: 'Ramesh Shah',
    },
  },
  'biz-mauli-precision': {
    mr: {
      name: 'माऊली प्रिसिजन लेझर वर्क्स',
      desc: 'उच्च क्षमतेचे फायबर लेझर कटिंग, सीएनसी हायड्रॉलिक बेंडिंग आणि वेल्डेड औद्योगिक फेब्रिकेशन.',
      addr: 'सेक्टर १०, पीसीएमसी औद्योगिक क्षेत्र, भोसरी, पुणे - ४११०२६',
      ownerName: 'संदीप थोरात',
    },
    hi: {
      name: 'माऊली प्रिसिजन लेजर वर्क्स',
      desc: 'उच्च क्षमता फाइबर लेजर कटिंग, सीएनसी हाइड्रोलिक बेंडिंग और वेल्डेड औद्योगिक फैब्रिकेशन।',
      addr: 'सेक्टर १०, भोसरी, पुणे - ४११०२६',
      ownerName: 'संदीप थोरात',
    },
    en: {
      name: 'Mauli Precision Laser Works',
      desc: 'High-power fiber laser cutting, precision CNC hydraulic press braking, and welded industrial enclosures.',
      addr: 'Sector 10, Bhosari, Pune - 411026',
      ownerName: 'Sandeep Thorat',
    },
  },
  'biz-mahalakshmi-foundry': {
    mr: {
      name: 'महालक्ष्मी फाउंड्री वर्क्स',
      desc: 'मँगनीज स्टील, हाय-क्रोम अलॉय व कास्ट आयर्न पंप घटकांचे इन-हाउस स्पेक्ट्रोमीटर चाचणीसह उत्पादन.',
      addr: 'प्लॉट ८८, शिरोली एमआयडीसी, कोल्हापूर - ४१६१२२',
      ownerName: 'बाजीराव घोरपडे',
    },
    hi: {
      name: 'महालक्ष्मी फाउंड्री वर्क्स',
      desc: 'मैंगनीज स्टील, हाई-क्रोम अलॉय और कास्ट आयरन पंप कंपोनेंट्स का इन-हाउस स्पेक्ट्रोमीटर टेस्टिंग के साथ निर्माण।',
      addr: 'प्लॉट ८८, शिरोली एमआईडीसी, कोल्हापुर - ४१६१२२',
      ownerName: 'बाजीराव घोरपड़े',
    },
    en: {
      name: 'Mahalakshmi Foundry Works',
      desc: 'Manganese steel, high-chrome alloy, and cast iron pump components with in-house spectrometer testing.',
      addr: 'Plot 88, Shiroli MIDC, Kolhapur - 416122',
      ownerName: 'Bajirao Ghorpade',
    },
  },
};

export function localizeBusiness<T extends Business>(biz: T, lang: Language): T {
  const loc = businessData[biz.id]?.[lang];
  return {
    ...biz,
    businessName: loc?.name || biz.businessName,
    description: loc?.desc || biz.description,
    address: loc?.addr || biz.address,
    district: localizeDistrict(biz.district, lang),
    sector: localizeSector(biz.sector, lang),
  };
}

// B2B Posts Localization Dictionary
const b2bPostData: Record<string, Record<Language, { title: string; content: string; replies?: string[] }>> = {
  'b2b-post-1': {
    mr: {
      title: 'उच्च दर्जाचे SG Iron & Grey Iron कास्टिंग्स उपलब्ध',
      content: 'चाकण एमआयडीसी युनिटमध्ये मासिक ५० टन अतिरिक्त फाउंड्री क्षमता उपलब्ध आहे. ऑटोमोटिव्ह ग्रेड ४००/१५ आणि ५००/७ कास्टिंग्स स्पर्धात्मक दरात तयार करून मिळतील.',
      replies: [
        'आमच्या भोसरी ऑटो क्लस्टरमधील २ कंपन्यांना महिन्याला १५ टन हायड्रॉलिक व्हॉल्व्ह कास्टिंग्सची आवश्यकता आहे. आपण तांत्रिक रेखाचित्रे (drawings) पाठवू शकता का?',
      ],
    },
    hi: {
      title: 'उच्च गुणवत्ता वाले एसजी आयरन और ग्रे आयरन कास्टिंग्स उपलब्ध',
      content: 'चाकण एमआईडीसी इकाई में मासिक ५० टन अतिरिक्त फाउंड्री क्षमता उपलब्ध है। ऑटोमोटिव ग्रेड ४००/१५ और ५००/७ कास्टिंग्स प्रतिस्पर्धी दरों पर तैयार मिलेंगे।',
      replies: [
        'हमारे भोसरी ऑटो क्लस्टर की २ कंपनियों को महीने में १५ टन हाइड्रोलिक वॉल्व कास्टिंग्स की आवश्यकता है। क्या आप तकनीकी रेखाचित्र भेज सकते हैं?',
      ],
    },
    en: {
      title: 'High Quality SG Iron & Grey Iron Castings Available',
      content: 'Monthly 50 tonnes excess foundry capacity available at Chakan MIDC unit. Automotive Grade 400/15 and 500/7 castings manufactured at competitive rates.',
      replies: [
        '2 companies in our Bhosari Auto Cluster require 15 tonnes of hydraulic valve castings monthly. Can you share technical drawings?',
      ],
    },
  },
  'b2b-post-2': {
    mr: {
      title: 'औद्योगिक ग्रेड रिसायकल्ड PP आणि HDPE ग्रॅन्यूल्स खरेदी करायचे आहेत',
      content: 'दरमहा २५ टन उच्च दर्जाचे रिप्रोसेस्ड पॉलिप्रॉपिलीन (PP) आणि HDPE ग्रॅन्यूल्स नियमित पुरवठादाराकडून हवे आहेत. MFI रेंज ५ ते १० असावी. पुरवठादारांनी त्वरित कोटेशन पाठवावे.',
      replies: [
        'आमच्या पिंपरी औद्योगिक परिसरातील सहयोगी रिसायकलिंग युनिटकडे हा मटेरियल ग्रेड उपलब्ध आहे. मी संपर्क क्रमांक इनबॉक्स केला आहे.',
      ],
    },
    hi: {
      title: 'औद्योगिक ग्रेड रीसाइकल्ड पीपी और एचडीपीई ग्रैन्यूल्स खरीदना चाहते हैं',
      content: 'प्रति माह २५ टन उच्च गुणवत्ता वाले पुनर्चक्रित पॉलीप्रोपाइलीन (PP) और HDPE ग्रैन्यूल्स नियमित आपूर्तिकर्ता से चाहिए। एमएफआई रेंज ५ से १० होनी चाहिए।',
      replies: [
        'हमारी पिंपरी औद्योगिक क्षेत्र की सहयोगी रीसाइक्लिंग इकाई के पास यह सामग्री ग्रेड उपलब्ध है। मैंने संपर्क विवरण इनबॉक्स किया है।',
      ],
    },
    en: {
      title: 'Looking to Purchase Industrial Grade Recycled PP & HDPE Granules',
      content: 'Monthly requirement of 25 tonnes high-grade reprocessed Polypropylene (PP) and HDPE granules from regular suppliers. MFI range 5-10. Immediate quotes invited.',
      replies: [
        'Our partner recycling unit in Pimpri industrial zone has this material grade available. Contact details shared in inbox.',
      ],
    },
  },
  'b2b-post-3': {
    mr: {
      title: 'CNC व्हर्टिकल मशीनिंग सेंटर (VMC) व कुशल जॉब वर्क क्षमता हवी आहे',
      content: 'ऑटोमोटिव्ह ब्रास आणि स्टील व्हॉल्व्ह बॉडी मिलिंग कामासाठी मासिक ३००० तासांची VMC क्षमता हवी आहे. पिंपरी-चिंचवड किंवा चाकण परिसरातील पुरवठादारांनी संपर्क साधावा.',
    },
    hi: {
      title: 'सीएनसी वर्टिकल मशीनिंग सेंटर (VMC) एवं कुशल जॉब वर्क क्षमता चाहिए',
      content: 'ऑटोमोटिव ब्रास और स्टील वॉल्व बॉडी मिलिंग के लिए मासिक ३००० घंटे की VMC क्षमता आवश्यक है। पिंपरी-चिंचवड़ या चाकण क्षेत्र के आपूर्तिकर्ता संपर्क करें।',
    },
    en: {
      title: 'CNC Vertical Machining Center (VMC) & Precision Jobwork Capacity Needed',
      content: 'Requirement for 3000 monthly VMC machining hours for automotive brass and steel valve body milling. Suppliers in PCMC or Chakan region contact immediately.',
    },
  },
  'b2b-post-4': {
    mr: {
      title: 'ऑटोमोटिव्ह ईव्ही बॅटरी ट्रेसाठी अल्युमिनियम डाय-कास्टिंग व्हेंडर हवा',
      content: 'नवीन ईव्ही कमर्शियल व्हेईकल मालिकेसाठी महिन्याला ५००० नग प्रिसिजन अल्युमिनियम हाय-प्रेशर डाय-कास्टिंग ट्रे आवश्यक आहेत. ISO 9001 / IATF 16949 प्रमाणित पुरवठादारांनी तातडीने संपर्क साधावा.',
    },
    hi: {
      title: 'ऑटोमोटिव ईवी बैटरी ट्रे के लिए एल्युमिनियम डाई-कास्टिंग वेंडर चाहिए',
      content: 'नई ईवी कमर्शियल वाहन सीरीज हेतु प्रतिमाह ५००० नग प्रिसिजन एल्युमिनियम हाई-प्रेशर डाई-कास्टिंग ट्रे की आवश्यकता है। प्रमाणित वेंडर तुरंत संपर्क करें।',
    },
    en: {
      title: 'Aluminium Die-Casting Vendor Needed for Automotive EV Battery Trays',
      content: 'Requirement for 5,000 monthly units of precision aluminium high-pressure die-cast trays for new EV commercial vehicle line. ISO 9001 / IATF 16949 certified suppliers contact immediately.',
    },
  },
  'b2b-post-5': {
    mr: {
      title: 'अन्न प्रक्रिया व शेतीमाल पॅकेजिंगसाठी फूड-ग्रेड मल्टी-लेयर पाऊचेस उपलब्ध',
      content: 'नाशिक, मराठवाडा व पश्चिम महाराष्ट्रातील ड्रायफ्रूट्स, मसाले, आणि प्रक्रिया उद्योगांसाठी हाय-बॅरिअर फूड-ग्रेड व्हॅक्यूम पाऊचेस आणि लेमिनेटेड रोल्स उपलब्ध. थेट कारखान्यातून घाऊक दर.',
    },
    hi: {
      title: 'खाद्य प्रसंस्करण व कृषि उत्पाद पैकेजिंग हेतु फूड-ग्रेड मल्टी-लेयर पाउच उपलब्ध',
      content: 'नासिक, मराठवाड़ा और पश्चिमी महाराष्ट्र के मसाला, ड्राईफ्रूट्स और खाद्य प्रसंस्करण उद्योग हेतु हाई-बैरियर फूड-ग्रेड वैक्यूम पाउच उपलब्ध। सीधे फैक्ट्री से थोक दर।',
    },
    en: {
      title: 'Food-Grade Multi-Layer Vacuum Pouches Available for Agro & Food Processing',
      content: 'High-barrier food-grade vacuum pouches and laminated rolls available for spices, dry fruits, and food processing units across Nashik and Maharashtra. Factory wholesale rates.',
    },
  },
};

export function localizeB2BPost(post: B2BPost, lang: Language): B2BPost {
  const loc = b2bPostData[post.id]?.[lang];
  return {
    ...post,
    title: loc?.title || post.title,
    content: loc?.content || post.content,
    sector: localizeSector(post.sector, lang),
    district: localizeDistrict(post.district, lang),
    resourceCategory: post.resourceCategory,
    replies: post.replies.map((rep, idx) => {
      const repLoc = loc?.replies?.[idx];
      return {
        ...rep,
        message: repLoc || rep.message,
      };
    }),
  };
}

// Grievances Localization Dictionary
const grievanceData: Record<string, Record<Language, { title: string; dept: string; exp: string; trackingCode?: string }>> = {
  'grv-001': {
    mr: {
      title: 'चाकण फेज-२ औद्योगिक वीज पुरवठा वारंवार खंडित होणे व व्होल्टेज अस्थिरता',
      dept: 'महावितरण (MSEDCL)',
      exp: 'गेल्या ३ महिन्यांपासून चाकण एमआयडीसी फेज-२ मध्ये आठवड्यातून ३ दिवस अनियोजित वीज कपात होते. फाउंड्री फर्नेस अचानक बंद पडल्याने वितळलेला कच्चा माल वाया जाऊन लाखो रुपयांचे नुकसान होत आहे.',
    },
    hi: {
      title: 'चाकण फेज-२ औद्योगिक बिजली आपूर्ति में बार-बार रुकावट एवं वोल्टेज अस्थिरता',
      dept: 'महावितरण (MSEDCL)',
      exp: 'पिछले ३ महीनों से चाकण एमआईडीसी फेज-२ में सप्ताह में ३ दिन अघोषित बिजली कटौती होती है। फाउंड्री फर्नेस अचानक बंद होने से भारी वित्तीय नुकसान हो रहा है।',
    },
    en: {
      title: 'Frequent Power Outages & High-Voltage Fluctuations in Chakan MIDC Phase-2',
      dept: 'MSEDCL (Maharashtra State Electricity Distribution Co.)',
      exp: 'Unscheduled power tripping 3 days a week in Chakan Phase-2 for the last 3 months, causing induction furnace shutdowns and immense metallurgical losses.',
    },
  },
  'grv-002': {
    mr: {
      title: 'तळेगाव एमआयडीसी फेज-१ अंतर्गत रस्ते डांबरीकरण व औद्योगिक ड्रेनेज लाईन दुरुस्ती',
      dept: 'एमआयडीसी (MIDC)',
      exp: 'औद्योगिक अवजड वाहनांची वाहतूक असणाऱ्या मुख्य रस्त्यावर खोल खड्डे पडले असून पावसाळ्यात पाणी साचून कंटेनर वाहतूक ठप्प होते.',
    },
    hi: {
      title: 'तालेगांव एमआईडीसी फेज-१ आंतरिक सड़कों की मरम्मत एवं औद्योगिक ड्रेनेज लाइन कार्य',
      dept: 'एमआईडीसी (MIDC)',
      exp: 'औद्योगिक भारी वाहनों वाले मुख्य मार्ग पर गहरे गड्ढे हो गए हैं तथा बारिश में जलभराव के कारण कंटेनर परिवहन बाधित हो रहा है।',
    },
    en: {
      title: 'Talegaon MIDC Phase-1 Internal Road Repairs & Industrial Storm Drainage Line',
      dept: 'MIDC Engineering Division',
      exp: 'Heavy container transport roads have severe potholes and monsoon waterlogging, creating bottlenecks for export consignments.',
    },
  },
};

export function localizeGrievance(grv: Grievance, lang: Language): Grievance {
  const loc = grievanceData[grv.id]?.[lang];
  return {
    ...grv,
    subject: loc?.title || grv.subject,
    explanation: loc?.exp || grv.explanation,
    district: localizeDistrict(grv.district, lang),
  };
}

// Samvad Topics Localization Dictionary
const samvadData: Record<string, Record<Language, { title: string; desc: string; assoc?: string }>> = {
  'samvad-plastics-2026': {
    mr: {
      title: 'महाराष्ट्र प्लास्टिक उद्योग परिषद व पुनर्चक्रीकरण धोरण संवाद',
      desc: 'महाराष्ट्र राज्य प्रदूषण नियंत्रण मंडळ (MPCB) मार्गदर्शक तत्त्वे, EPR अनुपालन, आणि कच्च्या मालाचे दर नियंत्रण यावर राज्यव्यापी विचारमंथन.',
      assoc: 'महाराष्ट्र प्लास्टिक मॅन्युफॅक्चरर्स असोसिएशन (MPMA)',
    },
    hi: {
      title: 'महाराष्ट्र प्लास्टिक उद्योग परिषद एवं पुनर्चक्रण नीति संवाद',
      desc: 'महाराष्ट्र राज्य प्रदूषण नियंत्रण बोर्ड (MPCB) दिशानिर्देश, ईपीआर अनुपालन और कच्चे माल के मूल्य नियंत्रण पर राज्यव्यापी संवाद।',
      assoc: 'महाराष्ट्र प्लास्टिक मैन्युफैक्चरर्स एसोसिएशन (MPMA)',
    },
    en: {
      title: 'Maharashtra Plastic Industry Conference & Recycling Policy Samvad',
      desc: 'Statewide roundtable on MPCB compliance guidelines, Extended Producer Responsibility (EPR), and raw material price stability.',
      assoc: 'Maharashtra Plastic Manufacturers Association (MPMA)',
    },
  },
  'samvad-solar-foundry': {
    mr: {
      title: 'ग्रीन फाउंड्री व रूफटॉप सोलर नेट मीटरिंग प्रत्यक्ष कार्यशाळा',
      desc: 'उच्च दाबाच्या फाउंड्री युनिट्ससाठी वीज खर्चात ३०% बचत कशी करावी, सौर ऊर्जा नेट मीटरिंग मंजुरी आणि ऊर्जा कार्यक्षमता अनुदानावर कार्यशाळा.',
    },
    hi: {
      title: 'ग्रीन फाउंड्री एवं रूफटॉप सोलर नेट मीटरिंग कार्यशाला',
      desc: 'उच्च दबाव फाउंड्री इकाइयों के लिए बिजली बिल में ३०% बचत, सौर ऊर्जा नेट मीटरिंग मंजूरी एवं ऊर्जा दक्षता सब्सिडी पर तकनीकी कार्यशाला।',
    },
    en: {
      title: 'Green Foundry & Industrial Rooftop Solar Net-Metering Workshop',
      desc: 'Practical workshop on reducing electricity costs by 30% for high-tension foundry units, rooftop solar net-metering clearances, and capital subsidies.',
    },
  },
};

export function localizeSamvadTopic(topic: SamvadTopic, lang: Language): SamvadTopic {
  const loc = samvadData[topic.id]?.[lang];
  return {
    ...topic,
    title: loc?.title || topic.title,
    description: loc?.desc || topic.description,
    associationName: loc?.assoc || topic.associationName,
    sector: localizeSector(topic.sector, lang),
    district: topic.district ? localizeDistrict(topic.district, lang) : undefined,
  };
}
