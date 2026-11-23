import type { NextApiRequest, NextApiResponse } from 'next';

interface ChatResponse {
  answer: string;
  category: 'schemes' | 'startup_guidance' | 'general';
  suggestedPrompts?: string[];
  sources: { title: string; url: string; department: string }[];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { message, lang = 'mr', mode = 'all' } = req.body || {};

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const q = message.toLowerCase().trim();

  // Knowledge base matchers
  const isSolar = q.includes('solar') || q.includes('सोलर') || q.includes('सौर');
  const isFoundry = q.includes('foundry') || q.includes('फाउंड्री') || q.includes('कास्टिंग') || q.includes('casting');
  const isCmegp = q.includes('cmegp') || q.includes('pmegp') || q.includes('कर्ज') || q.includes('loan') || q.includes('सबसिडी') || q.includes('subsidy');
  const isFood = q.includes('food') || q.includes('अन्न') || q.includes('फूड') || q.includes('fssai') || q.includes('प्रोसेसिंग') || q.includes('processing');
  const isTextile = q.includes('textile') || q.includes('कापड') || q.includes('गारमेंट') || q.includes('garment') || q.includes('सूत');
  const isMidc = q.includes('midc') || q.includes('एमआयडीसी') || q.includes('plot') || q.includes('भूखंड') || q.includes('shed') || q.includes('शेड');
  const isPlastic = q.includes('plastic') || q.includes('प्लास्टिक') || q.includes('polymer');
  const isMpcb = q.includes('mpcb') || q.includes('प्रदूषण') || q.includes('pollution') || q.includes('consent') || q.includes('ना हरकत');

  let answer = '';
  let category: 'schemes' | 'startup_guidance' | 'general' = 'general';
  let sources: { title: string; url: string; department: string }[] = [];
  let suggestedPrompts: string[] = [];

  // Generate localized response
  if (isSolar) {
    category = 'schemes';
    if (lang === 'en') {
      answer = `### ☀️ Rooftop Solar Subsidies & Industrial Power Incentives in Maharashtra

1. **PM Surya Ghar / MSME Rooftop Solar Incentive**:
   - **Capital Subsidy**: Up to 30% to 40% capital incentive for grid-connected rooftop solar installations in MSME manufacturing units.
   - **Net Metering Facility**: MSEDCL (Mahavitaran) provides net metering agreements allowing surplus solar power to offset high-tension/low-tension industrial power bills.
   - **Accelerated Depreciation**: Under Income Tax Section 32, up to 40% accelerated depreciation in Year 1 for commercial solar assets.

2. **Maharashtra RE Policy 2020 & Electricity Duty Rebate**:
   - Full exemption on Electricity Duty for 5 years for captive renewable units in C, D, D+ and Vidarbha/Marathwada zones.
   - Banking of energy allowed on an annual basis with MSEDCL.

3. **Required Documents for Solar Grid Connection**:
   - Udyam Registration & Latest Electricity Bill
   - Roof Ownership / Registered Industrial Lease Agreement
   - Sanctioned Power Load Clearance from MSEDCL Executive Engineer
   - MNRE Approved Vendor Quotation and Technical Drawing`;
    } else if (lang === 'hi') {
      answer = `### ☀️ महाराष्ट्र में सोलर रूफटॉप सब्सिडी एवं औद्योगिक विद्युत प्रोत्साहन

1. **एमएसएमई रूफटॉप सोलर सब्सिडी (MSME Solar Incentives)**:
   - **पूंजीगत सब्सिडी**: एमएसएमई विनिर्माण इकाइयों के लिए ग्रिड-कनेक्टेड सोलर रूफटॉप पर 30% से 40% तक पूंजीगत अनुदान।
   - **नेट मीटरिंग सुविधा**: महावितरण (MSEDCL) द्वारा नेट मीटरिंग अनुबंध, जिससे अतिरिक्त उत्पादित सौर ऊर्जा आपके औद्योगिक बिल में समायोजित होती है।
   - **त्वरित मूल्यह्रास (Accelerated Depreciation)**: आयकर धारा 32 के तहत वाणिज्यिक सोलर परिसंपत्तियों पर पहले वर्ष में 40% तक छूट।

2. **महाराष्ट्र नवीकरणीय ऊर्जा नीति (RE Policy)**:
   - 'C', 'D', 'D+' और विदर्भ/मराठवाड़ा औद्योगिक क्षेत्रों में 5 वर्षों के लिए विद्युत शुल्क (Electricity Duty) में पूर्ण छूट।

3. **सोलर ग्रिड कनेक्शन हेतु आवश्यक दस्तावेज**:
   - उद्यम पंजीकरण एवं नवीनतम बिजली बिल
   - औद्योगिक परिसर का स्वामित्व पत्र अथवा पंजीकृत लीज डीड
   - महावितरण से स्वीकृत लोड अनुमति
   - नवीन एवं नवीकरणीय ऊर्जा मंत्रालय (MNRE) द्वारा अधिकृत वेंडर का तकनीकी प्रस्ताव`;
    } else {
      answer = `### ☀️ महाराष्ट्रात सोलर रूफटॉप सबसिडी व औद्योगिक वीज दर सवलती

1. **एमएसएमई सोलर रूफटॉप सबसिडी (MSME Rooftop Solar Incentive)**:
   - **भांडवली अनुदान**: एमएसएमई उत्पादन घटकांसाठी ग्रीड-कनेक्टेड सोलर रूफटॉप उभारणीवर ३०% ते ४०% पर्यंत थेट भांडवली सबसिडी.
   - **नेट मीटरिंग सुविधा**: महावितरण (MSEDCL) कडून नेट मीटरिंग करार; उत्पादित अतिरिक्त सौर ऊर्जा औद्योगिक वीज बिलातून वजावट (Net Settlement) केली जाते.
   - **त्वरित घसारा (Accelerated Depreciation)**: इन्कम टॅक्स कलम ३२ अंतर्गत पहिल्याच वर्षी सोलर यंत्रसामग्रीवर ४०% पर्यंत टॅक्स सवलत.

2. **महाराष्ट्र नवीकरणीय ऊर्जा धोरण (RE Policy) व वीज शुल्क सूट**:
   - 'क', 'ड', 'ड+' आणि विदर्भ-मराठवाडा औद्योगिक क्षेत्रातील प्रकल्पांना ५ वर्षांसाठी वीज शुल्कात (Electricity Duty) १००% सूट.

3. **सोलर ग्रीड जोडणीसाठी लागणारी कागदपत्रे**:
   - उद्यम नोंदणी (Udyam Registration) व चालू वीज बिल
   - जागेचा अधिकृत मालकी पुरावा किंवा नोंदणीकृत भाडेकरार
   - महावितरण कार्यकारी अभियंत्यांचे वीज भार मंजुरी पत्र (Sanctioned Load)
   - MNRE मान्यताप्राप्त व्हेंडरचा तांत्रिक प्रकल्प आराखडा`;
    }

    sources = [
      { title: 'MAHAURJA - Maharashtra Energy Development Agency', url: 'https://www.mahaurja.com', department: 'Govt of Maharashtra' },
      { title: 'MAITRI Single Window Solar Clearances', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
      { title: 'MSEDCL Renewable Net Metering Portal', url: 'https://www.mahadiscom.in', department: 'MSEDCL' },
    ];
    suggestedPrompts = [
      lang === 'en' ? 'What are the steps for MSEDCL Net Metering?' : 'महावितरण नेट मीटरिंगसाठी काय प्रक्रिया आहे?',
      lang === 'en' ? 'Check CMEGP subsidy eligibility' : 'CMEGP उद्योग कर्ज व सबसिडी पात्रता तपासा',
    ];
  } else if (isFoundry || (isMpcb && !isFood)) {
    category = 'startup_guidance';
    if (lang === 'en') {
      answer = `### 🏭 Roadmap & Document Checklist: Starting a Foundry / Casting Unit in Maharashtra

1. **Location & Zoning Clearances**:
   - Foundries are categorized as **Red Category** under MPCB due to furnace emissions and sand casting waste.
   - Must be situated in an approved industrial zone (MIDC Industrial Estate or Chakan/Bhosari/Markal designated industrial zones in Pune).

2. **Step-by-Step Statutory Approvals**:
   - **Step 1: Company Registration & Udyam**: Register as Pvt Ltd/LLP and obtain free Central MSME Udyam Certificate.
   - **Step 2: Land / Shed Allotment**: MIDC Land Allotment Letter / Factory Shed registered lease agreement.
   - **Step 3: MPCB Consent to Establish (CTE)**: Apply on MPCB Single Window with layout plan, Chimney Stack Design & Wet Scrubber/Dust Collector specs.
   - **Step 4: DISH Factory Plan Approval**: Directorate of Industrial Safety & Health (DISH) factory building plan scrutiny.
   - **Step 5: High Tension (HT) Power Connection**: MSEDCL industrial electricity load sanction (minimum 250 KVA to 1000 KVA for Induction Furnaces).
   - **Step 6: Fire Department NOC**: Local Industrial Fire Officer NOC for furnace and molten metal safety.
   - **Step 7: MPCB Consent to Operate (CTO)**: Final site inspection before commencing casting operations.

3. **Mandatory Documentation Checklist**:
   - Detailed Project Report (DPR) with raw material (pig iron, scrap, silica sand) flow chart
   - MPCB Air Pollution Control System (APCS) drawing & stack height calculation
   - Hazardous Waste Agreement with MEPL (Maharashtra Enviro Power Ltd) for foundry slag/sand disposal`;
    } else if (lang === 'hi') {
      answer = `### 🏭 महाराष्ट्र में फाउंड्री / मेटल कास्टिंग उद्योग शुरू करने की प्रक्रिया एवं दस्तावेज

1. **स्थान एवं औद्योगिक जोन नियम**:
   - फाउंड्री उद्योग प्रदूषण नियंत्रण मंडल (MPCB) द्वारा **रेड श्रेणी (Red Category)** में आता है।
   - यह केवल स्वीकृत एमआयडीसी औद्योगिक क्षेत्र (उदा. चाकण, भोसरी, शिरवळ आदि) में ही स्थापित किया जा सकता है।

2. **क्रमवार सरकारी स्वीकृतियां**:
   - **चरण 1: कंपनी एवं उद्यम पंजीकरण**: प्राइवेट लिमिटेड/एलएलपी एवं उद्यम सर्टिफिकेट प्राप्त करें।
   - **चरण 2: एमआयडीसी भूखंड / शेड**: एमआयडीसी अलॉटमेंट लेटर अथवा पंजीकृत लीज डीड।
   - **चरण 3: MPCB स्थापना सहमति (CTE)**: चिमनी स्टैक डिजाइन, वेट स्क्रबर व बैग फिल्टर के तकनीकी नक्शे के साथ आवेदन।
   - **चरण 4: DISH कारखाना नक्शा मंजूरी**: औद्योगिक सुरक्षा एवं स्वास्थ्य संचालनालय (DISH) से फैक्ट्री लेआउट अनुमोदन।
   - **चरण 5: हाई टेंशन (HT) विद्युत भार**: महावितरण से 250 KVA से 1000 KVA इंडक्शन फर्नेस बिजली कनेक्शन।
   - **चरण 6: फायर एनओसी एवं MPCB संचालन सहमति (CTO)**: उत्पादन शुरू करने से पहले अंतिम निरीक्षण।

3. **अनिवार्य दस्तावेज चेकलिस्ट**:
   - विस्तृत परियोजना रिपोर्ट (DPR)
   - प्रदूषण नियंत्रण प्रणाली (APCS) एवं चिमनी की ऊंचाई गणना पत्रक
   - स्लॅग एवं सैंड निस्तारण हेतु MEPL के साथ परिसंकटमय अपशिष्ट अनुबंध पत्र`;
    } else {
      answer = `### 🏭 महाराष्ट्रात (उदा. पुणे, कोल्हापूर) फाउंड्री उद्योग सुरू करण्याची अधिकृत प्रक्रिया व कागदपत्रे

1. **औद्योगिक क्षेत्र व पर्यावरणीय वर्गवारी**:
   - फाउंड्री उद्योग हा महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB) च्या **लाल प्रवर्गात (Red Category)** येतो.
   - हा प्रकल्प केवळ मंजूर औद्योगिक क्षेत्रात (उदा. MIDC चाकण, भोसरी, शिरवळ, किंवा कोल्हापूर शिरोली/गोकुळ शिरगाव) सुरू करता येतो.

2. **क्रमवार शासकीय परवाने व पायऱ्या**:
   - **पायरी १: कंपनी स्थापना व उद्यम नोंदणी**: Udyam Registration (केंद्रीय एमएसएमई नोंदणी).
   - **पायरी २: जागा/शेड संपादन**: MIDC कडून भूखंड वाटप पत्र किंवा इंडस्ट्रियल शेडचा अधिकृत नोंदणीकृत भाडेकरार.
   - **पायरी ३: MPCB स्थापना संमती (CTE - Consent to Establish)**: MAITRI पोर्टलवरून चिमणी डिझाईन, स्क्रबर व डस्ट कलेक्टरच्या नकाशासह अर्ज.
   - **पायरी ४: DISH फॅक्टरी प्लॅन मंजुरी**: औद्योगिक सुरक्षा व आरोग्य संचालनालय (DISH) कडून कारखाना नकाशा मंजुरी.
   - **पायरी ५: महावितरण HT वीज भार मंजुरी**: इंडक्शन फर्नेससाठी ११ केव्ही किंवा २२ केव्ही हाय-टेन्शन वीज जोडणी.
   - **पायरी ६: अग्निशामक (Fire) NOC व MPCB उत्पादन संमती (CTO - Consent to Operate)**: अंतिम तपासणीनंतर उत्पादन सुरू करण्याची अधिकृत परवानगी.

3. **कागदपत्रांची अधिकृत चेकलिस्ट**:
   - सविस्तर प्रकल्प अहवाल (DPR - Detailed Project Report)
   - प्रदूषण नियंत्रण यंत्रणा (APCS) व चिमणी उंचीचे तांत्रिक रेखाचित्र
   - घातक कचरा (स्लॅग व सँड) विल्हेवाटीसाठी MEPL (रंजनगाव) सोबतचा करारनामा
   - जमिनीचा ७/१२ उतारा अथवा MIDC ताबा पावती`;
    }

    sources = [
      { title: 'MAITRI Single Window Clearance System', url: 'https://maitri.maharashtra.gov.in', department: 'Govt of Maharashtra' },
      { title: 'Maharashtra Pollution Control Board (MPCB)', url: 'https://www.mpcb.gov.in', department: 'Environment Dept, GoM' },
      { title: 'MIDC Industrial Land & Services', url: 'https://midc.maharashtra.gov.in', department: 'MIDC' },
    ];
    suggestedPrompts = [
      lang === 'en' ? 'What are the subsidies for Foundry under PSI 2019?' : 'PSI 2019 अंतर्गत फाउंड्रीसाठी सबसिडी किती मिळते?',
      lang === 'en' ? 'Upload document for AI preparation check' : 'कागदपत्र तपासणीसाठी उद्योग सारथी टूल उघडा',
    ];
  } else if (isFood) {
    category = 'startup_guidance';
    if (lang === 'en') {
      answer = `### 🥗 Starting a Food Processing Unit in Maharashtra

1. **Key Subsidies Available**:
   - **PMFME Scheme**: 35% credit-linked capital subsidy up to ₹10 Lakhs for micro-food processing units.
   - **Maharashtra Agriculture Business & Food Processing Policy**: Capital subsidy up to 25%-35% on plant & machinery, plus cold chain incentives.

2. **Mandatory Clearances**:
   - **FSSAI License**: State or Central Manufacturing License depending on production capacity.
   - **MPCB Consent**: Green or Orange Category consent depending on effluent generation (ETP requirement for washing/processing water).
   - **Water Supply & Lab Testing**: Certified potability water testing report (BIS standard).
   - **Packaging & Legal Metrology**: Package commodity registration under Legal Metrology Act.`;
    } else if (lang === 'hi') {
      answer = `### 🥗 महाराष्ट्र में खाद्य प्रसंस्करण (Food Processing) इकाई शुरू करने के नियम व योजनाएं

1. **प्रमुख सरकारी योजनाएं एवं अनुदान**:
   - **PMFME योजना**: माइक्रो फूड प्रोसेसिंग इकाइयों के लिए 35% क्रेडिट लिंक्ड पूंजीगत सब्सिडी (अधिकतम ₹10 लाख)।
   - **महाराष्ट्र कृषि एवं खाद्य प्रसंस्करण नीति**: मशीनरी पर 25% से 35% तक अतिरिक्त राज्य अनुदान।

2. **आवश्यक अनुमतियां**:
   - **FSSAI विनिर्माण लाइसेंस**: क्षमता अनुसार राज्य अथवा केंद्रीय खाद्य सुरक्षा लाइसेंस।
   - **MPCB सहमति**: ग्रीन अथवा ऑरेंज श्रेणी सहमति (अपशिष्ट जल हेतु ETP अनिवार्य)।
   - **पानी की गुणवत्ता परीक्षण रिपोर्ट**: BIS मानकों के अनुसार जल परीक्षण प्रमाण पत्र।
   - **लीगल मेट्रोलॉजी रजिस्ट्रेशन**: पैकेज्ड फूड पर वजन एवं माप विभाग का पंजीकरण।`;
    } else {
      answer = `### 🥗 महाराष्ट्रात अन्न प्रक्रिया (Food Processing) उद्योग सुरू करण्याची प्रक्रिया व अनुदान

1. **उपलब्ध शासकीय योजना व सबसिडी**:
   - **PMFME योजना (केंद्रीय अन्न प्रक्रिया योजना)**: प्रकल्प खर्चावर ३५% क्रेडिट-लिंक्ड भांडवली अनुदान (कमाल ₹१० लाख पर्यंत सबसिडी).
   - **महाराष्ट्र कृषी औद्योगिक धोरण**: शेतीमाल प्रक्रिया यंत्रसामग्रीवर २५% ते ३५% पर्यंत राज्य अनुदान व वीज दर सवलत.
   - **CMEGP योजना**: ग्रामीण व शहरी युवकांसाठी ₹५० लाखांपर्यंतच्या उत्पादन प्रकल्पावर १५% ते ३५% अनुदान.

2. **आवश्यक परवाने व कागदपत्रे**:
   - **FSSAI परवाना**: क्षमतेनुसार State किंवा Central अन्न सुरक्षा परवाना.
   - **MPCB पर्यावरण संमती**: ऑरेंज किंवा ग्रीन कॅटेगरी संमती (सांडपाणी प्रक्रियेसाठी ETP यंत्रणा).
   - **पाणी गुणवत्ता चाचणी अहवाल**: अधिकृत प्रयोगशाळेचा पिण्यायोग्य पाणी तपासणी अहवाल.
   - **पॅकेजिंग व वजने-मापे परवाना**: Legal Metrology पॅकर नोंदणी.`;
    }

    sources = [
      { title: 'PMFME National Portal (MoFPI)', url: 'https://pmfme.mofpi.gov.in', department: 'Ministry of Food Processing, GoI' },
      { title: 'FSSAI Food Safety Licensing Portal (FoSCoS)', url: 'https://foscos.fssai.gov.in', department: 'FSSAI' },
      { title: 'MAITRI Maharashtra Single Window', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
    ];
    suggestedPrompts = [
      lang === 'en' ? 'How to apply for PMFME loan?' : 'PMFME कर्जासाठी अर्ज कसा करावा?',
      lang === 'en' ? 'What are ETP rules for Food Processing?' : 'अन्न प्रक्रियेसाठी ETP सांडपाणी नियम काय आहेत?',
    ];
  } else if (isCmegp) {
    category = 'schemes';
    if (lang === 'en') {
      answer = `### 💼 Chief Minister Employment Generation Programme (CMEGP) & PMEGP

1. **CMEGP (Maharashtra State Scheme)**:
   - **Project Ceiling**: Manufacturing projects up to **₹50 Lakhs**; Service projects up to **₹10 Lakhs**.
   - **Subsidy Rate**:
     - General Category (Urban): 15% | Rural: 25%
     - Special Category (SC/ST/Women/Minorities/Differently Abled): Urban: 25% | Rural: **35%**
   - **Own Contribution**: Only 5% to 10% promoter equity required.
   - **Application**: Directly online via the official CMEGP Maharashtra single window portal.

2. **PMEGP (Central Government / KVIC)**:
   - Project limit up to ₹50 Lakhs for manufacturing.
   - Collateral-free bank loan backed by CGTMSE guarantee.
   - 15% to 35% margin money subsidy credited to your bank account after 3 years of successful operation.

3. **Required Checklist**:
   - Aadhar Card & PAN Card
   - Caste / Category Certificate (if claiming 25%-35% special category subsidy)
   - Detailed Project Report (DPR) prepared as per DIC guidelines
   - Educational Qualification (Minimum 8th pass for manufacturing above ₹10L)
   - Rent/Lease Agreement or Property 7/12 & Non-Agriculture (NA) order`;
    } else if (lang === 'hi') {
      answer = `### 💼 मुख्यमंत्री रोजगार सृजन कार्यक्रम (CMEGP) एवं PMEGP योजना

1. **CMEGP योजना (महाराष्ट्र सरकार)**:
   - **परियोजना सीमा**: विनिर्माण (Manufacturing) हेतु अधिकतम **₹50 लाख**; सेवा (Service) हेतु अधिकतम **₹10 लाख**।
   - **सब्सिडी दर**:
     - सामान्य वर्ग (शहरी): 15% | ग्रामीण: 25%
     - विशेष वर्ग (महिला/अजा/अजजा/दिव्यांग/अल्पसंख्यक): शहरी: 25% | ग्रामीण: **35%**
   - **स्वयं का अंशदान**: केवल 5% से 10% पूंजी।

2. **PMEGP योजना (केंद्र सरकार - केवीआईसी)**:
   - विनिर्माण के लिए ₹50 लाख तक ऋण।
   - बिना किसी बंधक (Collateral-Free) गारंटी के बैंक ऋण।

3. **अनिवार्य दस्तावेज**:
   - आधार, पैन कार्ड एवं पासपोर्ट साइज फोटो
   - विशेष वर्ग हेतु जाति प्रमाण पत्र
   - जिला उद्योग केंद्र (DIC) प्रारूप अनुसार प्रोजेक्ट रिपोर्ट (DPR)
   - शैक्षणिक योग्यता प्रमाण पत्र (₹10 लाख से अधिक विनिर्माण हेतु न्यूनतम 8वीं पास)`;
    } else {
      answer = `### 💼 मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP) व PMEGP संपूर्ण माहिती

1. **CMEGP योजना (महाराष्ट्र शासन उद्योग विभाग)**:
   - **प्रकल्प मर्यादा**: उत्पादन क्षेत्रासाठी कमाल **₹५० लाख**; सेवा उद्योगासाठी कमाल **₹१० लाख**.
   - **शासकीय अनुदान (Subsidy)**:
     - सर्वसाधारण प्रवर्ग: शहरी भागात १५% | ग्रामीण भागात २५%
     - विशेष प्रवर्ग (महिला, अनुसूचित जाती/जमाती, इतर मागास, दिव्यांग, अल्पसंख्याक): शहरी भागात २५% | ग्रामीण भागात **३५%**
   - **स्वतःचे भांडवल**: केवळ ५% ते १०% स्वतःची गुंतवणूक आवश्यक.

2. **PMEGP योजना (केंद्र शासन खादी व ग्रामोद्योग)**:
   - उत्पादन घटकांसाठी ₹५० लाखांपर्यंत राष्ट्रीयकृत बँकेकडून कर्ज.
   - CGTMSE हमी अंतर्गत विनातारण (Collateral-free) कर्ज सुविधा.

3. **अर्जासाठी लागणारी आवश्यक कागदपत्रे**:
   - आधार कार्ड, पॅन कार्ड व रहिवासी दाखला
   - जातीचा दाखला (विशेष वर्ग सबसिडी दाव्यासाठी)
   - अधिकृत चार्टर्ड अकाउंटंट (CA) किंवा तांत्रिक तज्ज्ञाने प्रमाणित केलेला DPR (प्रकल्प अहवाल)
   - शैक्षणिक प्रमाणपत्र (किमान ८ वी उत्तीर्ण)
   - जागेचा पुरावा (७/१२, ८-अ, मालमत्ता कर पावती किंवा ५ वर्षांचा भाडेकरार)`;
    }

    sources = [
      { title: 'CMEGP Maharashtra Official Single Window', url: 'https://maha-cmegp.gov.in', department: 'Directorate of Industries, GoM' },
      { title: 'PMEGP e-Portal (KVIC Central)', url: 'https://www.kviconline.gov.in/pmegpeportal', department: 'Ministry of MSME, GoI' },
      { title: 'MAITRI Portal Maharashtra', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
    ];
    suggestedPrompts = [
      lang === 'en' ? 'Download sample DPR for CMEGP' : 'CMEGP साठी DPR कसा तयार करावा?',
      lang === 'en' ? 'Check PSI 2019 Scheme incentives' : 'PSI 2019 योजना भांडवली अनुदान माहिती',
    ];
  } else if (isMidc) {
    category = 'startup_guidance';
    if (lang === 'en') {
      answer = `### 🏗️ MIDC Land & Industrial Shed Allotment in Maharashtra

1. **How to Apply for MIDC Land**:
   - Applications are 100% online through the **MIDC SWC (Single Window Clearance)** portal.
   - Vacant industrial plots across all 36 districts are categorized into Priority A, B, and C based on industrial development.

2. **Step-by-Step MIDC Process**:
   - **Step 1**: Register on MIDC Portal with Company Profile and PAN.
   - **Step 2**: Select Industrial Area (e.g. Chakan, Talegaon, Butibori, Ranjangaon, Kagal).
   - **Step 3**: Submit DPR detailing power, water, investment, and employment projections.
   - **Step 4**: Scrutiny by Land Allotment Committee (LAC) chaired by Regional Officer (RO).
   - **Step 5**: Payment of 100% lease premium within prescribed 30 to 60 days.
   - **Step 6**: Execution of Agreement to Lease and physical possession receipt.

3. **Building Permission & BCC**:
   - Factory building plan approval from MIDC Executive Engineer (SPA).
   - Mandatory completion of factory construction within 3 to 5 years to obtain Building Completion Certificate (BCC).`;
    } else if (lang === 'hi') {
      answer = `### 🏗️ एमआयडीसी (MIDC) भूखंड एवं औद्योगिक शेड आवंटन प्रक्रिया

1. **एमआयडीसी भूखंड आवेदन प्रक्रिया**:
   - आवेदन पूर्णतः ऑनलाइन **MIDC सिंगल विंडो क्लीयरेंस** पोर्टल द्वारा किया जाता है।
   - रिक्त भूखंडों की सूची एवं दरों की जानकारी पोर्टल पर पारदर्शी रूप से उपलब्ध रहती है।

2. **आवंटन के मुख्य चरण**:
   - **चरण 1**: एमआयडीसी पोर्टल पर पंजीकरण एवं उद्योग प्रोफाइल दर्ज करना।
   - **चरण 2**: औद्योगिक क्षेत्र (उदा. चाकण, तलेगांव, बुटीबोरी आदि) एवं भूखंड का चयन।
   - **चरण 3**: विस्तृत परियोजना रिपोर्ट (DPR), विद्युत व जल आवश्यकता विवरण प्रस्तुत करना।
   - **चरण 4**: क्षेत्रीय अधिकारी (RO) की अध्यक्षता में भूखंड आवंटन समिति (LAC) द्वारा अनुमोदन।
   - **चरण 5**: निर्धारित समय सीमा में लीज प्रीमियम राशि का भुगतान एवं पट्टा अनुबंध।
   - **चरण 6**: वास्तविक भौतिक कब्जा (Possession) एवं कारखाना निर्माण अनुमति।`;
    } else {
      answer = `### 🏗️ एमआयडीसी (MIDC) भूखंड व इंडस्ट्रियल शेड वाटप प्रक्रिया

1. **अधिकृत ऑनलाइन अर्ज पद्धत**:
   - एमआयडीसी भूखंड वाटपासाठी सर्व अर्ज १००% पारदर्शक पद्धतीने **MIDC Single Window** पोर्टलवरून केले जातात.
   - महाराष्ट्रातील ३६ जिल्ह्यांतील उपलब्ध रिक्त भूखंडांची यादी थेट पोर्टलवर पाहिली जाऊ शकते.

2. **भूखंड वाटपाचे मुख्य टप्पे**:
   - **टप्पा १**: कंपनी नोंदणी व अधिकृत प्रोफाईल तयार करणे.
   - **टप्पा २**: पसंतीचे MIDC क्षेत्र (उदा. चाकण, तळेगाव, रांजणगाव, बुटीबोरी, कुपवाड इ.) निवडणे.
   - **टप्पा ३**: गुंतवणूक, रोजगार, पाणी व वीज आवश्यकतेचा सविस्तर प्रकल्प अहवाल (DPR) जोडणे.
   - **टप्पा ४**: प्रादेशिक अधिकारी (RO) यांच्या अध्यक्षतेखालील भूखंड वाटप समिती (LAC) समोर सादरीकरण.
   - **टप्पा ५**: अलॉटमेंट लेटर मिळाल्यावर ३० ते ६० दिवसांत लीज प्रीमियम भरणे.
   - **टप्पा ६**: भाडेपट्टा करार (Agreement to Lease) नोंदणी व प्रत्यक्षात जागेचा ताबा (Possession).

3. **बांधकाम परवाना व BCC**:
   - ताबा मिळाल्यानंतर एमआयडीसीच्या विशेष नियोजन प्राधिकरणाकडून (SPA) कारखाना नकाशा मंजुरी.
   - ३ ते ५ वर्षांच्या मुदतीत उत्पादन सुरू करून इमारत पूर्णत्व दाखला (BCC) घेणे बंधनकारक.`;
    }

    sources = [
      { title: 'MIDC Official Single Window Portal', url: 'https://midc.maharashtra.gov.in', department: 'MIDC, Govt of Maharashtra' },
      { title: 'MAITRI Maharashtra Single Window System', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
    ];
    suggestedPrompts = [
      lang === 'en' ? 'What are the current MIDC water and power tariffs?' : 'एमआयडीसी पाणी आणि वीज दर काय आहेत?',
      lang === 'en' ? 'How to file grievance for MIDC pending lease?' : 'एमआयडीसी प्रलंबित कामासाठी तक्रार कशी नोंदवावी?',
    ];
  } else {
    // Comprehensive general fallback
    category = 'general';
    if (lang === 'en') {
      answer = `### 🚀 Industrial Guidance & Schemes Assistant (BJP Udyog Setu)

I have searched across official Government of Maharashtra and Central Government databases for: **"${message}"**.

#### 1. Core Schemes That May Fit Your Request:
- **Package Scheme of Incentives (PSI 2019)**: Industrial promotion subsidy up to 100% of Fixed Capital Investment (FCI) for MSMEs in developing zones ('B', 'C', 'D', 'D+').
- **Chief Minister Employment Generation Programme (CMEGP)**: 15% to 35% margin money capital subsidy for manufacturing up to ₹50 Lakhs.
- **Credit Guarantee Fund Trust (CGTMSE)**: Collateral-free credit facility up to ₹5 Crore from public/private banks.
- **Dr. Babasaheb Ambedkar Special Incentive**: Enhanced 40%-50% capital subsidy and special MIDC plot concessions for SC/ST entrepreneurs.

#### 2. Key Business Setup Clearances in Maharashtra:
1. **Udyam Registration**: Free 5-minute online MSME registration.
2. **MAITRI Portal**: Single window clearing 118+ state licenses (MPCB, DISH, Labour, Power, Fire).
3. **MSEDCL Industrial Connection**: High Tension / Low Tension electricity load release.
4. **GST & Bank Accounts**: Tax registration and current account setup.`;
    } else if (lang === 'hi') {
      answer = `### 🚀 उद्योग मार्गदर्शन एवं योजना सहायक (भाजपा उद्योग सेतु)

आपके प्रश्न **"${message}"** के संदर्भ में महाराष्ट्र एवं केंद्र सरकार के डेटाबेस से जानकारी:

#### 1. प्रमुख सरकारी योजनाएं एवं लाभ:
- **PSI 2019 (औद्योगिक प्रोत्साहन योजना)**: विनिर्माण इकाइयों के लिए अचल पूंजी निवेश (FCI) पर 100% तक राज्य जीएसटी पुनर्भुगतान व विद्युत शुल्क छूट।
- **CMEGP योजना (महाराष्ट्र सरकार)**: ₹50 लाख तक के विनिर्माण प्रोजेक्ट्स पर 15% से 35% तक का पूंजीगत अनुदान।
- **CGTMSE योजना**: बिना किसी बंधक (Collateral) के ₹5 करोड़ तक का एमएसएमई बैंक ऋण।
- **महिला उद्यमी विशेष प्रोत्साहन**: महिला उद्यमियों को अतिरिक्त 5% ब्याज अनुदान और पूंजी सब्सिडी।

#### 2. उद्योग स्थापना के अनिवार्य चरण:
1. **उद्यम पंजीकरण (Udyam)**: निःशुल्क केंद्रीय एमएसएमई प्रमाण पत्र।
2. **मैत्री (MAITRI) पोर्टल**: महाराष्ट्र सरकार की एक-खिड़की प्रणाली, जिससे सभी 118+ अनुमतियां प्राप्त होती हैं।
3. **प्रदूषण नियंत्रण (MPCB) एवं कारखाना लाइसेंस (DISH)**।
4. **महावितरण औद्योगिक विद्युत कनेक्शन**।`;
    } else {
      answer = `### 🚀 उद्योग मार्गदर्शन व शासकीय योजना सहाय्यक (भाजपा उद्योग सेतू)

आपल्या प्रश्नाबाबत **"${message}"** महाराष्ट्र शासन व केंद्र सरकारच्या अधिकृत माहितीनुसार:

#### १. आपल्यासाठी लागू असणाऱ्या प्रमुख योजना:
- **पॅकेज स्कीम ऑफ इन्सेंटिव्हज (PSI 2019)**: 'क', 'ड', 'ड+' आणि विदर्भ-मराठवाडा भागात नवीन किंवा विस्तार प्रकल्पासाठी भांडवली गुंतवणुकीवर १००% पर्यंत सबसिडी, SGST परतावा व वीज शुल्कात सूट.
- **मुख्यमंत्री रोजगार निर्मिती कार्यक्रम (CMEGP)**: ₹५० लाखांपर्यंतच्या उत्पादन प्रकल्पावर १५% ते ३५% थेट भांडवली अनुदान.
- **CGTMSE विनातारण कर्ज**: कोणत्याही तारण/गॅरंटीशिवाय ₹५ कोटींपर्यंत राष्ट्रीयकृत बँकेकडून कर्ज हमी.
- **डॉ. बाबासाहेब आंबेडकर विशेष योजना**: अनुसूचित जाती/जमाती उद्योजकांसाठी विशेष सवलती, अतिरिक्त भांडवली अनुदान व MIDC भूखंड सवलत.

#### २. उद्योग सुरू करताना आवश्यक प्रमुख परवाने:
१. **उद्यम नोंदणी (Udyam)**: भारत सरकारचे अधिकृत एमएसएमई प्रमाणपत्र (५ मिनिटांत ऑनलाइन व मोफत).
२. **मैत्री (MAITRI) सिंगल विंडो पोर्टल**: सर्व शासकीय परवाने (MIDC, MPCB, कामगार, वीज) एकाच खिडकीतून.
३. **MPCB पर्यावरण संमती (CTE/CTO)**: प्रदूषण नियंत्रण मंडळ ना हरकत प्रमाणपत्र.
४. **महावितरण औद्योगिक वीज जोडणी**: लघुदाब (LT) किंवा उच्चदाब (HT) वीज भार मंजुरी.`;
    }

    sources = [
      { title: 'MAITRI Maharashtra Single Window System', url: 'https://maitri.maharashtra.gov.in', department: 'Industry Dept, GoM' },
      { title: 'Directorate of Industries, Maharashtra', url: 'https://industry.maharashtra.gov.in', department: 'Govt of Maharashtra' },
      { title: 'MSME Development & Facilitation Office', url: 'https://msme.gov.in', department: 'Govt of India' },
    ];
    suggestedPrompts = [
      lang === 'en' ? 'How to start a foundry in Pune?' : 'पुण्यात फाउंड्री सुरू करण्यासाठी काय कागदपत्रे लागतील?',
      lang === 'en' ? 'Solar Rooftop MSME subsidy' : 'सोलर रूफटॉप सबसिडी माहिती',
      lang === 'en' ? 'CMEGP ₹50 Lakh loan details' : 'CMEGP ५० लाख कर्ज व सबसिडी',
    ];
  }

  return res.status(200).json({
    answer,
    category,
    sources,
    suggestedPrompts,
  });
}
