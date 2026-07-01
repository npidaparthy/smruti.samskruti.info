#!/usr/bin/env python3
"""
build-nakshatras.py — generate data/texts/vsn/nakshatras.json from embedded data table.

Gemstone derives from ruling planet (graha):
  Ketu→Cat's Eye, Śukra→Diamond, Sūrya→Ruby, Candra→Pearl,
  Maṅgala→Red Coral, Rāhu→Hessonite, Guru→Yellow Sapphire,
  Śani→Blue Sapphire, Budha→Emerald

Dosha derives from Nāḍī:  Ādi→Vāta, Madhya→Pitta, Antya→Kapha
"""

import json, pathlib

ROOT = pathlib.Path(__file__).parent.parent
OUT  = ROOT / 'data' / 'texts' / 'vsn' / 'nakshatras.json'

# ── lookup tables ─────────────────────────────────────────────────────────────

RASHI_SYMBOLS = {
    'Meṣa':'♈','Vṛṣabha':'♉','Mithuna':'♊','Karkaṭa':'♋',
    'Siṃha':'♌','Kanyā':'♍','Tulā':'♎','Vṛścika':'♏',
    'Dhanus':'♐','Makara':'♑','Kumbha':'♒','Mīna':'♓',
}
RASHI_SA = {
    'Meṣa':'मेषः','Vṛṣabha':'वृषभः','Mithuna':'मिथुनः','Karkaṭa':'कर्कटः',
    'Siṃha':'सिंहः','Kanyā':'कन्या','Tulā':'तुला','Vṛścika':'वृश्चिकः',
    'Dhanus':'धनुः','Makara':'मकरः','Kumbha':'कुम्भः','Mīna':'मीनः',
}
RASHI_TE = {
    'Meṣa':'మేషం','Vṛṣabha':'వృషభం','Mithuna':'మిథునం','Karkaṭa':'కర్కాటకం',
    'Siṃha':'సింహం','Kanyā':'కన్య','Tulā':'తులా','Vṛścika':'వృశ్చికం',
    'Dhanus':'ధనుస్సు','Makara':'మకరం','Kumbha':'కుంభం','Mīna':'మీనం',
}

GRAHA_SA  = {'Ketu':'केतुः','Śukra':'शुक्रः','Sūrya':'सूर्यः','Candra':'चन्द्रः',
             'Maṅgala':'मङ्गलः','Rāhu':'राहुः','Guru':'गुरुः','Śani':'शनिः','Budha':'बुधः'}
GRAHA_TE  = {'Ketu':'కేతువు','Śukra':'శుక్రుడు','Sūrya':'సూర్యుడు','Candra':'చంద్రుడు',
             'Maṅgala':'కుజుడు','Rāhu':'రాహువు','Guru':'గురువు','Śani':'శనిదేవుడు','Budha':'బుధుడు'}

GEM = {
    'Ketu':   {'iast':'Vaidūrya',      'en':'Cat\'s Eye',      'sa':'वैदूर्यः',  'te':'వైఢూర్యం'},
    'Śukra':  {'iast':'Vajra',         'en':'Diamond',         'sa':'वज्रम्',    'te':'వజ్రం'},
    'Sūrya':  {'iast':'Māṇikya',       'en':'Ruby',            'sa':'माणिक्यम्', 'te':'మాణిక్యం'},
    'Candra': {'iast':'Mukta',         'en':'Pearl',           'sa':'मुक्तम्',   'te':'ముత్యం'},
    'Maṅgala':{'iast':'Pravāḷa',       'en':'Red Coral',       'sa':'प्रवालम्',  'te':'పగడం'},
    'Rāhu':   {'iast':'Gomeda',        'en':'Hessonite',       'sa':'गोमेदम्',   'te':'గోమేధికం'},
    'Guru':   {'iast':'Puṣparāga',     'en':'Yellow Sapphire', 'sa':'पुष्परागः', 'te':'పుష్యరాగం'},
    'Śani':   {'iast':'Nīla',          'en':'Blue Sapphire',   'sa':'नीलम्',     'te':'నీలమణి'},
    'Budha':  {'iast':'Marakata',      'en':'Emerald',         'sa':'मरकतम्',    'te':'మరకతం'},
}

NADI_DATA = {
    'Ādi':   {'sa':'आदिनाडी', 'te':'ఆది నాడి',   'dosha_iast':'Vāta',  'dosha_sa':'वातः', 'dosha_te':'వాతం'},
    'Madhya':{'sa':'मध्यनाडी','te':'మధ్య నాడి',  'dosha_iast':'Pitta', 'dosha_sa':'पित्तः','dosha_te':'పిత్తం'},
    'Antya': {'sa':'अन्त्यनाडी','te':'అంత్య నాడి','dosha_iast':'Kapha', 'dosha_sa':'कफः',  'dosha_te':'కఫం'},
}

GANA_DATA = {
    'Deva':    {'sa':'देवगणः',    'te':'దేవగణం'},
    'Manuṣya': {'sa':'मानुषगणः', 'te':'మానవగణం'},
    'Rākṣasa': {'sa':'राक्षसगणः','te':'రాక్షసగణం'},
}

TATTVA_DATA = {
    'Pṛthvī':{'sa':'पृथ्वी',  'te':'పృథ్వి',  'en':'Earth'},
    'Jala':  {'sa':'जलम्',    'te':'జలం',     'en':'Water'},
    'Agni':  {'sa':'अग्निः',  'te':'అగ్ని',   'en':'Fire'},
    'Vāyu':  {'sa':'वायुः',   'te':'వాయువు',  'en':'Air'},
    'Ākāśa': {'sa':'आकाशः',   'te':'ఆకాశం',  'en':'Ether'},
}

PURUSHARDHA_DATA = {
    'Dharma':{'sa':'धर्मः', 'te':'ధర్మం'},
    'Artha': {'sa':'अर्थः', 'te':'అర్థం'},
    'Kāma':  {'sa':'कामः',  'te':'కామం'},
    'Mokṣa': {'sa':'मोक्षः','te':'మోక్షం'},
}

VARNA_DATA = {
    'Brāhmaṇa': {'sa':'ब्राह्मणः','te':'బ్రాహ్మణుడు'},
    'Kṣatriya': {'sa':'क्षत्रियः','te':'క్షత్రియుడు'},
    'Vaiśya':   {'sa':'वैश्यः',   'te':'వైశ్యుడు'},
    'Śūdra':    {'sa':'शूद्रः',   'te':'శూద్రుడు'},
    'Chandāla': {'sa':'चाण्डालः', 'te':'చండాలుడు'},
}

# ── nakshatra mantras ─────────────────────────────────────────────────────────
# Source verses describing each nakshatra. Each entry: {sa, te, iast}

MANTRAS = {
    1:  {'sa': 'भवत्यश्विनिनक्षत्रमश्वीदस्त्रस्तुरङ्गः ।\nआद्यस्तुरङ्गस्तुरग अश्वो वाजी हयो हरिः ॥',
         'te': 'భవత్యశ్వినినక్షత్రమశ్వీదస్త్రస్తురఙ్గః ।\nఆద్యస్తురఙ్గస్తురగ అశ్వో వాజీ హయో హరిః ॥',
         'iast': 'bhavatyaśvininakṣatramaśvīdastrasturaṅgaḥ |\nādyasturaṅgasturaga aśvo vājī hayo hariḥ ||'},
    2:  {'sa': 'भरणी स्याद्यमो याम्यस्त्वन्तको यमसंज्ञिकः ।',
         'te': 'భరణీ స్యాద్యమో యామ్యస్త్వన్తకో యమసంజ్ఞికః ।',
         'iast': 'bharaṇī syādyamo yāmyastvantako yamasaṃjñikaḥ |'},
    3:  {'sa': 'कृत्तिका बहुला ज्ञेया हुतभुग्वह्नि संज्ञिका ॥\nषट्तारकः पावकश्चानलोऽथ ज्वलनस्तथा ।',
         'te': 'కృత్తికా బహులా జ్ఞేయా హుతభుగ్వహ్ని సంజ్ఞికా ॥\nషట్తారకః పావకశ్చానలోఽథ జ్వలనస్తథా ।',
         'iast': 'kṛttikā bahulā jñeyā hutabhugvahni saṃjñikā ||\nṣaṭtārakaḥ pāvakaścānalo\'tha jvalanastathā |'},
    4:  {'sa': 'रोहिणी च विधिर्ब्रह्मा प्राजापत्यश्चतुर्मुखः ॥\nप्राजापतिः प्रजेशशच विधातापङ्कजासनः ।\nआत्मभूः पद्मयोनीस्स्याद्ब्रह्मनाम ततः परम् ॥',
         'te': 'రోహిణీ చ విధిర్బ్రహ్మా ప్రాజాపత్యశ్చతుర్ముఖః ॥\nప్రాజాపతిః ప్రజేశశచ విధాతాపఙ్కజాసనః ।\nఆత్మభూః పద్మయోనీస్స్యాద్బ్రహ్మనామ తతః పరమ్ ॥',
         'iast': 'rohiṇī ca vidhirbrahmā prājāpatyaścaturmukhaḥ ||\nprājāpatiḥ prajeśaśaca vidhātāpaṅkajāsanaḥ |\nātmabhūḥ padmayonīssyādbrahmanāma tataḥ param ||'},
    5:  {'sa': 'मृगशीर्षे मृहश्चन्द्र ऐन्दवो हिमदीधितिः ।\nस्याच्चन्द्र शिशुभं सौम्यो निशानाथो निशाकरः ॥',
         'te': 'మృగశీర్షే మృహశ్చన్ద్ర ఐన్దవో హిమదీధితిః ।\nస్యాచ్చన్ద్ర శిశుభం సౌమ్యో నిశానాథో నిశాకరః ॥',
         'iast': 'mṛgaśīrṣe mṛhaścandra aindavo himadīdhitiḥ |\nsyāccandra śiśubhaṃ saumyo niśānātho niśākaraḥ ||'},
    6:  {'sa': 'आर्द्रा रौद्रश्च पुरजिच्छर्वस्थाणुर्भवो हरः ।',
         'te': 'ఆర్ద్రా రౌద్రశ్చ పురజిచ్ఛర్వస్థాణుర్భవో హరః ।',
         'iast': 'ārdrā raudraśca purajiccharvasthāṇurbhavo haraḥ |'},
    7:  {'sa': 'पुनर्वस्वदितिर्देवमाता आदित्यमेव च ॥',
         'te': 'పునర్వస్వదితిర్దేవమాతా ఆదిత్యమేవ చ ॥',
         'iast': 'punarvasvaditirdevamātā ādityameva ca ||'},
    8:  {'sa': 'इज्याद्यौ तिष्यपुष्येतु पूजितो गुरुनामकः ।\nवागीशश्चामरेज्यश्च जीवो देवपुरोहितः ॥',
         'te': 'ఇజ్యాద్యౌ తిష్యపుష్యేతు పూజితో గురునామకః ।\nవాగీశశ్చామరేజ్యశ్చ జీవో దేవపురోహితః ॥',
         'iast': 'ijyādyau tiṣyapuṣyetu pūjito gurunāmakaḥ |\nvāgīśaścāmarejyaśca jīvo devapurohitaḥ ||'},
    9:  {'sa': 'आश्रेषोरगसार्पाहि भुजङ्गव्यालसंज्ञिकः ।',
         'te': 'ఆశ్రేషోరగసార్పాహి భుజఙ్గవ్యాలసంజ్ఞికః ।',
         'iast': 'āśreṣoragasārpāhi bhujaṅgavyālasaṃjñikaḥ |'},
    10: {'sa': 'मघा पिता च पैत्रश्च मेखला पितृभं तथा ॥',
         'te': 'మఘా పితా చ పైత్రశ్చ మేఖలా పితృభం తథా ॥',
         'iast': 'maghā pitā ca paitraśca mekhalā pitṛbhaṃ tathā ||'},
    11: {'sa': 'भाग्यं पूर्वाफल्गुनी स्याद्भागाख्यं भगसंज्ञिकम् ।',
         'te': 'భాగ్యం పూర్వాఫల్గునీ స్యాద్భాగాఖ్యం భగసంజ్ఞికమ్ ।',
         'iast': 'bhāgyaṃ pūrvāphalgunī syādbhāgākhyaṃ bhagasaṃjñikam |'},
    12: {'sa': 'अर्यमार्यमणं चैव अर्यम्णं चोत्तरं तथा ॥',
         'te': 'అర్యమార్యమణం చైవ అర్యమ్ణం చోత్తరం తథా ॥',
         'iast': 'aryamāryamaṇaṃ caiva aryamṇaṃ cottaraṃ tathā ||'},
    13: {'sa': 'हस्तस्सवितृसावित्रा वर्कस्सूर्यो दिवाकरः ।',
         'te': 'హస్తస్సవితృసావిత్రా వర్కస్సూర్యో దివాకరః ।',
         'iast': 'hastassavitṛsāvitrā varkassūryo divākaraḥ |'},
    14: {'sa': 'चित्रास्यात्त्वष्टृदैवत्यं त्वाष्ट्रेन्द्रे सुरवर्धकम् ॥',
         'te': 'చిత్రాస్యాత్త్వష్టృదైవత్యం త్వాష్ట్రేన్ద్రే సురవర్ధకమ్ ॥',
         'iast': 'citrāsyāttvaṣṭṛdaivatyaṃ tvāṣṭrendre suravardhakam ||'},
    15: {'sa': 'स्वाती समीरणो वायुः पवनश्चानिलो मरुत् ।',
         'te': 'స్వాతీ సమీరణో వాయుః పవనశ్చానిలో మరుత్ ।',
         'iast': 'svātī samīraṇo vāyuḥ pavanaścānilo marut |'},
    16: {'sa': 'विशाखं शूर्पमैन्द्राग्नं द्विदैवत्यं विशाखभम् ॥',
         'te': 'విశాఖం శూర్పమైన్ద్రాగ్నం ద్విదైవత్యం విశాఖభమ్ ॥',
         'iast': 'viśākhaṃ śūrpamaindrāgnaṃ dvidaivatyaṃ viśākhabham ||'},
    17: {'sa': 'मित्रं मैत्रमनूराधमनूराधस्य संज्ञिकम् ।',
         'te': 'మిత్రం మైత్రమనూరాధమనూరాధస్య సంజ్ఞికమ్ ।',
         'iast': 'mitraṃ maitramanūrādhamanūrādhasya saṃjñikam |'},
    18: {'sa': 'ज्येष्टेन्द्रः पुरुहूतश्च ऐन्द्रश्शतमुखस्तथा ॥',
         'te': 'జ్యేష్టేన్ద్రః పురుహూతశ్చ ఐన్ద్రశ్శతముఖస్తథా ॥',
         'iast': 'jyeṣṭendraḥ puruhūtaśca aindraśśatamukhastathā ||'},
    19: {'sa': 'मूलं निशाचरं प्रोक्तमासुरं निरृतिस्तथा ।\nनक्तञ्चरं कोणपं च राक्षसं पिशिताशनम् ॥',
         'te': 'మూలం నిశాచరం ప్రోక్తమాసురం నిరృతిస్తథా ।\nనక్తఞ్చరం కోణపం చ రాక్షసం పిశితాశనమ్ ॥',
         'iast': 'mūlaṃ niśācaraṃ proktamāsuraṃ nirṛtistathā |\nnaktañcaraṃ koṇapaṃ ca rākṣasaṃ piśitāśanam ||'},
    20: {'sa': 'पूर्वाषाढा जलं तोयमुदकं चाप एव च ।',
         'te': 'పూర్వాషాఢా జలం తోయముదకం చాప ఏవ చ ।',
         'iast': 'pūrvāṣāḍhā jalaṃ toyamudakaṃ cāpa eva ca |'},
    21: {'sa': 'उत्तराषाढा विश्वे च अभिजिद्वाप्रकाशकम् ॥',
         'te': 'ఉత్తరాషాఢా విశ్వే చ అభిజిద్వాప్రకాశకమ్ ॥',
         'iast': 'uttarāṣāḍhā viśve ca abhijidvāprakāśakam ||'},
    22: {'sa': 'श्रवणं वैष्णवं श्रीशश्श्रीकान्तो मुरजिद्धरिः ।',
         'te': 'శ్రవణం వైష్ణవం శ్రీశశ్శ్రీకాన్తో మురజిద్ధరిః ।',
         'iast': 'śravaṇaṃ vaiṣṇavaṃ śrīśaśśrīkānto murajiddhariḥ |'},
    23: {'sa': 'श्रविष्ठा च धनिष्ठा च वसुर्वासव एव च ॥',
         'te': 'శ్రవిష్ఠా చ ధనిష్ఠా చ వసుర్వాసవ ఏవ చ ॥',
         'iast': 'śraviṣṭhā ca dhaniṣṭhā ca vasurvāsava eva ca ||'},
    24: {'sa': 'प्राचेतसो जलनिधिश्शततारश्च वारुणः ।',
         'te': 'ప్రాచేతసో జలనిధిశ్శతతారశ్చ వారుణః ।',
         'iast': 'prācetaso jalanidhiśśatatāraśca vāruṇaḥ |'},
    25: {'sa': 'अजैकपात्प्रोष्ठपदा पुर्वाभाद्र पदा तथा ॥',
         'te': 'అజైకపాత్ప్రోష్ఠపదా పుర్వాభాద్ర పదా తథా ॥',
         'iast': 'ajaikapātproṣṭhapadā purvābhādra padā tathā ||'},
    26: {'sa': 'उत्तराभाद्रकं चैव अहिर्बुध्न्यं निशामुखम् ।',
         'te': 'ఉత్తరాభాద్రకం చైవ అహిర్బుధ్న్యం నిశాముఖమ్ ।',
         'iast': 'uttarābhādrakaṃ caiva ahirbudhnyaṃ niśāmukham |'},
    27: {'sa': 'रेवती पौष्ण इत्याहुरन्त्यः पूषा तथैव च ॥',
         'te': 'రేవతీ పౌష్ణ ఇత్యాహురన్త్యః పూషా తథైవ చ ॥',
         'iast': 'revatī pauṣṇa ityāhurantyaḥ pūṣā tathaiva ca ||'},
}

# ── nakshatra data table ───────────────────────────────────────────────────────
# Fields: num, id, iast, te, sa, stars, symbol_en, symbol_te, symbol_sa,
#         rashi, graha, deity_en, deity_te, deity_sa,
#         gana, tattva, purushardha, varna, nadi,
#         animal_en, animal_te, animal_sa,
#         vsn_shloka_from, vsn_shloka_to,
#         syllables: [(sa,te,iast), ...]

NAKSHATRAS = [
  # 1
  dict(num=1, id='aswini',
    iast='Aśvinī', te='అశ్విని', sa='अश्विनी',
    stars=3, symbol_en="Horse's head", symbol_te='అశ్వముఖం', symbol_sa='अश्वमुखः',
    rashi='Meṣa', graha='Ketu',
    deity_iast='Aśvinī Kumāras', deity_te='అశ్వినీ కుమారులు', deity_sa='अश्विनीकुमारौ',
    gana='Deva', tattva='Pṛthvī', purushardha='Dharma', varna='Vaiśya', nadi='Ādi',
    animal_iast='Horse', animal_te='గుర్రం', animal_sa='अश्वः',
    vsn_from=1, vsn_to=4,
    syllables=[('चू','చూ','cū'),('चे','చే','ce'),('चो','చో','co'),('ला','లా','lā')]),
  # 2
  dict(num=2, id='bharani',
    iast='Bharaṇī', te='భరణి', sa='भरणी',
    stars=3, symbol_en='Yoni (womb)', symbol_te='యోని ఆకారం', symbol_sa='योनिः',
    rashi='Meṣa', graha='Śukra',
    deity_iast='Yama', deity_te='యముడు', deity_sa='यमः',
    gana='Manuṣya', tattva='Pṛthvī', purushardha='Artha', varna='Chandāla', nadi='Madhya',
    animal_iast='Elephant', animal_te='ఏనుగు', animal_sa='गजः',
    vsn_from=5, vsn_to=8,
    syllables=[('ली','లీ','lī'),('लू','లూ','lū'),('ले','లే','le'),('लो','లో','lo')]),
  # 3
  dict(num=3, id='krittika',
    iast='Kṛttikā', te='కృత్తిక', sa='कृत्तिका',
    stars=6, symbol_en='Flame / Razor', symbol_te='అగ్నిశిఖ', symbol_sa='क्षुरः',
    rashi='Vṛṣabha', graha='Sūrya',
    deity_iast='Agni', deity_te='అగ్నిదేవుడు', deity_sa='अग्निः',
    gana='Rākṣasa', tattva='Agni', purushardha='Kāma', varna='Brāhmaṇa', nadi='Antya',
    animal_iast='Female Sheep', animal_te='గొర్రె', animal_sa='मेषः',
    vsn_from=9, vsn_to=12,
    syllables=[('अ','అ','a'),('ई','ఈ','ī'),('उ','ఉ','u'),('ए','ఏ','e')]),
  # 4
  dict(num=4, id='rohini',
    iast='Rohiṇī', te='రోహిణి', sa='रोहिणी',
    stars=5, symbol_en='Chariot / Ox-cart', symbol_te='శకటం', symbol_sa='शकटः',
    rashi='Vṛṣabha', graha='Candra',
    deity_iast='Brahmā', deity_te='బ్రహ్మదేవుడు', deity_sa='ब्रह्मा',
    gana='Manuṣya', tattva='Pṛthvī', purushardha='Mokṣa', varna='Śūdra', nadi='Ādi',
    animal_iast='Male Serpent', animal_te='పాము', animal_sa='सर्पः',
    vsn_from=13, vsn_to=16,
    syllables=[('ओ','ఓ','o'),('वा','వా','vā'),('वि','వి','vi'),('वु','వు','vu')]),
  # 5
  dict(num=5, id='mrigasira',
    iast='Mṛgaśirā', te='మృగశిర', sa='मृगशिरा',
    stars=3, symbol_en="Deer's head", symbol_te='మృగశిరస్సు', symbol_sa='मृगशिरः',
    rashi='Mithuna', graha='Maṅgala',
    deity_iast='Soma', deity_te='సోముడు', deity_sa='सोमः',
    gana='Deva', tattva='Pṛthvī', purushardha='Mokṣa', varna='Vaiśya', nadi='Madhya',
    animal_iast='Female Serpent', animal_te='ఆడపాము', animal_sa='सर्पी',
    vsn_from=17, vsn_to=20,
    syllables=[('वे','వే','ve'),('वो','వో','vo'),('का','కా','kā'),('की','కీ','kī')]),
  # 6
  dict(num=6, id='ardra',
    iast='Ārdrā', te='ఆర్ద్ర', sa='आर्द्रा',
    stars=1, symbol_en='Teardrop / Diamond', symbol_te='వజ్రం', symbol_sa='मणिः',
    rashi='Mithuna', graha='Rāhu',
    deity_iast='Rudra', deity_te='రుద్రుడు', deity_sa='रुद्रः',
    gana='Manuṣya', tattva='Jala', purushardha='Kāma', varna='Chandāla', nadi='Antya',
    animal_iast='Female Dog', animal_te='ఆడకుక్క', animal_sa='शुनी',
    vsn_from=21, vsn_to=24,
    syllables=[('कु','కు','ku'),('घ','ఘ','gha'),('ङ','ఙ','ṅa'),('छ','ఛ','cha')]),
  # 7
  dict(num=7, id='punarvasu',
    iast='Punarvasu', te='పునర్వసు', sa='पुनर्वसु',
    stars=2, symbol_en='Bow and quiver', symbol_te='ధనస్సు', symbol_sa='धनुः',
    rashi='Karkaṭa', graha='Guru',
    deity_iast='Aditi', deity_te='అదితి', deity_sa='अदितिः',
    gana='Deva', tattva='Jala', purushardha='Artha', varna='Vaiśya', nadi='Ādi',
    animal_iast='Female Cat', animal_te='ఆడపిల్లి', animal_sa='मार्जारी',
    vsn_from=25, vsn_to=28,
    syllables=[('के','కే','ke'),('को','కో','ko'),('हा','హా','hā'),('ही','హీ','hī')]),
  # 8
  dict(num=8, id='pushya',
    iast='Puṣya', te='పుష్య', sa='पुष्य',
    stars=3, symbol_en='Lotus flower / udder', symbol_te='పద్మం', symbol_sa='पद्मः',
    rashi='Karkaṭa', graha='Śani',
    deity_iast='Bṛhaspati', deity_te='బృహస్పతి', deity_sa='बृहस्पतिः',
    gana='Deva', tattva='Jala', purushardha='Dharma', varna='Kṣatriya', nadi='Madhya',
    animal_iast='Male Sheep', animal_te='గొర్రె పోతు', animal_sa='मेषः',
    vsn_from=29, vsn_to=32,
    syllables=[('हु','హు','hu'),('हे','హే','he'),('हो','హో','ho'),('डा','డా','ḍā')]),
  # 9
  dict(num=9, id='ashlesha',
    iast='Āśleṣā', te='ఆశ్లేష', sa='आश्लेषा',
    stars=5, symbol_en='Coiled serpent', symbol_te='నాగబంధం', symbol_sa='सर्पः',
    rashi='Karkaṭa', graha='Budha',
    deity_iast='Sarpas', deity_te='నాగదేవతలు', deity_sa='नागाः',
    gana='Rākṣasa', tattva='Jala', purushardha='Dharma', varna='Chandāla', nadi='Antya',
    animal_iast='Male Cat', animal_te='మగపిల్లి', animal_sa='मार्जारः',
    vsn_from=33, vsn_to=36,
    syllables=[('डी','డీ','ḍī'),('डू','డూ','ḍū'),('डे','డే','ḍe'),('डो','డో','ḍo')]),
  # 10
  dict(num=10, id='magha',
    iast='Maghā', te='మఘ', sa='मघा',
    stars=5, symbol_en='Royal throne / palanquin', symbol_te='సింహాసనం', symbol_sa='सिंहासनम्',
    rashi='Siṃha', graha='Ketu',
    deity_iast='Pitṛs', deity_te='పితృదేవతలు', deity_sa='पितरः',
    gana='Rākṣasa', tattva='Agni', purushardha='Artha', varna='Śūdra', nadi='Ādi',
    animal_iast='Male Rat', animal_te='మగ ఎలుక', animal_sa='मूषकः',
    vsn_from=37, vsn_to=40,
    syllables=[('मा','మా','mā'),('मी','మీ','mī'),('मू','మూ','mū'),('मे','మే','me')]),
  # 11
  dict(num=11, id='purva-phalguni',
    iast='Pūrva Phālgunī', te='పూర్వ ఫాల్గుణి', sa='पूर्वफाल्गुणी',
    stars=2, symbol_en='Front legs of bed / fig tree', symbol_te='మంచం ముందు కాళ్ళు', symbol_sa='खट्वा',
    rashi='Siṃha', graha='Śukra',
    deity_iast='Bhaga', deity_te='భగుడు', deity_sa='भगः',
    gana='Manuṣya', tattva='Agni', purushardha='Kāma', varna='Brāhmaṇa', nadi='Madhya',
    animal_iast='Female Rat', animal_te='ఆడ ఎలుక', animal_sa='मूषिका',
    vsn_from=41, vsn_to=44,
    syllables=[('मो','మో','mo'),('टा','టా','ṭā'),('टी','టీ','ṭī'),('टू','టూ','ṭū')]),
  # 12
  dict(num=12, id='uttara-phalguni',
    iast='Uttara Phālgunī', te='ఉత్తర ఫాల్గుణి', sa='उत्तरफाल्गुणी',
    stars=2, symbol_en='Rear legs of bed', symbol_te='మంచం వెనక కాళ్ళు', symbol_sa='खट्वापादौ',
    rashi='Kanyā', graha='Sūrya',
    deity_iast='Aryaman', deity_te='ఆర్యముడు', deity_sa='अर्यमा',
    gana='Manuṣya', tattva='Agni', purushardha='Mokṣa', varna='Kṣatriya', nadi='Antya',
    animal_iast='Male Cow (Bull)', animal_te='ఎద్దు', animal_sa='वृषभः',
    vsn_from=45, vsn_to=48,
    syllables=[('टे','టే','ṭe'),('टो','టో','ṭo'),('पा','పా','pā'),('पी','పీ','pī')]),
  # 13
  dict(num=13, id='hasta',
    iast='Hasta', te='హస్త', sa='हस्त',
    stars=5, symbol_en='Open hand / fist', symbol_te='అరచేయి', symbol_sa='हस्तः',
    rashi='Kanyā', graha='Candra',
    deity_iast='Sūrya / Savitṛ', deity_te='సవితృడు', deity_sa='सविता',
    gana='Deva', tattva='Agni', purushardha='Mokṣa', varna='Vaiśya', nadi='Ādi',
    animal_iast='Female Buffalo', animal_te='ఆడ గేదె', animal_sa='महिषी',
    vsn_from=49, vsn_to=52,
    syllables=[('पू','పూ','pū'),('षा','షా','ṣā'),('णा','ణా','ṇā'),('ठा','ఠా','ṭhā')]),
  # 14
  dict(num=14, id='chitra',
    iast='Citrā', te='చిత్ర', sa='चित्रा',
    stars=1, symbol_en='Bright jewel / pearl', symbol_te='ముత్యం', symbol_sa='मुक्ता',
    rashi='Tulā', graha='Maṅgala',
    deity_iast='Tvaṣṭṛ', deity_te='విశ్వకర్మ', deity_sa='त्वष्टा',
    gana='Rākṣasa', tattva='Agni', purushardha='Kāma', varna='Vaiśya', nadi='Madhya',
    animal_iast='Female Tiger', animal_te='ఆడ పులి', animal_sa='व्याघ्री',
    vsn_from=53, vsn_to=56,
    syllables=[('पे','పే','pe'),('पो','పో','po'),('रा','రా','rā'),('री','రీ','rī')]),
  # 15
  dict(num=15, id='swati',
    iast='Svāti', te='స్వాతి', sa='स्वाति',
    stars=1, symbol_en='Young sprout blown by wind', symbol_te='చిగురు', symbol_sa='अङ्कुरः',
    rashi='Tulā', graha='Rāhu',
    deity_iast='Vāyu', deity_te='వాయుదేవుడు', deity_sa='वायुः',
    gana='Deva', tattva='Vāyu', purushardha='Artha', varna='Chandāla', nadi='Antya',
    animal_iast='Male Buffalo', animal_te='మగ గేదె', animal_sa='महिषः',
    vsn_from=57, vsn_to=60,
    syllables=[('रू','రూ','rū'),('रे','రే','re'),('रो','రో','ro'),('ता','తా','tā')]),
  # 16
  dict(num=16, id='vishakha',
    iast='Viśākhā', te='విశాఖ', sa='विशाखा',
    stars=4, symbol_en='Triumphal arch / potter\'s wheel', symbol_te='విజయతోరణం', symbol_sa='तोरणम्',
    rashi='Vṛścika', graha='Guru',
    deity_iast='Indra and Agni', deity_te='ఇంద్రాగ్నులు', deity_sa='इन्द्राग्नी',
    gana='Rākṣasa', tattva='Agni', purushardha='Dharma', varna='Chandāla', nadi='Ādi',
    animal_iast='Male Tiger', animal_te='మగ పులి', animal_sa='व्याघ्रः',
    vsn_from=61, vsn_to=64,
    syllables=[('ती','తీ','tī'),('तू','తూ','tū'),('ते','తే','te'),('तो','తో','to')]),
  # 17
  dict(num=17, id='anuradha',
    iast='Anurādhā', te='అనురాధ', sa='अनुराधा',
    stars=4, symbol_en='Umbrella / lotus', symbol_te='గొడుగు', symbol_sa='छत्रम्',
    rashi='Vṛścika', graha='Śani',
    deity_iast='Mitra', deity_te='మిత్రుడు', deity_sa='मित्रः',
    gana='Deva', tattva='Agni', purushardha='Dharma', varna='Śūdra', nadi='Madhya',
    animal_iast='Female Deer (Doe)', animal_te='ఆడ లేడి', animal_sa='मृगी',
    vsn_from=65, vsn_to=68,
    syllables=[('ना','నా','nā'),('नी','నీ','nī'),('नू','నూ','nū'),('ने','నే','ne')]),
  # 18
  dict(num=18, id='jyeshtha',
    iast='Jyeṣṭhā', te='జ్యేష్ఠ', sa='ज्येष्ठा',
    stars=3, symbol_en='Earring / circular amulet', symbol_te='కుండలం', symbol_sa='कुण्डलम्',
    rashi='Vṛścika', graha='Budha',
    deity_iast='Indra', deity_te='ఇంద్రుడు', deity_sa='इन्द्रः',
    gana='Rākṣasa', tattva='Jala', purushardha='Artha', varna='Vaiśya', nadi='Antya',
    animal_iast='Male Deer (Stag)', animal_te='మగ లేడి', animal_sa='मृगः',
    vsn_from=69, vsn_to=72,
    syllables=[('नो','నో','no'),('या','యా','yā'),('यी','యీ','yī'),('यू','యూ','yū')]),
  # 19
  dict(num=19, id='moola',
    iast='Mūla', te='మూల', sa='मूल',
    stars=11, symbol_en='Bunch of roots tied together', symbol_te='వేళ్ళ గుత్తి', symbol_sa='मूलम्',
    rashi='Dhanus', graha='Ketu',
    deity_iast='Nirṛti', deity_te='నిరృతి', deity_sa='निरृतिः',
    gana='Rākṣasa', tattva='Agni', purushardha='Kāma', varna='Chandāla', nadi='Ādi',
    animal_iast='Male Dog', animal_te='మగ కుక్క', animal_sa='शुनः',
    vsn_from=73, vsn_to=76,
    syllables=[('ये','యే','ye'),('यो','యో','yo'),('भा','భా','bhā'),('भी','భీ','bhī')]),
  # 20
  dict(num=20, id='purvashadha',
    iast='Pūrvāṣāḍhā', te='పూర్వాషాఢ', sa='पूर्वाषाढा',
    stars=2, symbol_en='Elephant tusk / fan', symbol_te='గజదంతం', symbol_sa='गजदन्तः',
    rashi='Dhanus', graha='Śukra',
    deity_iast='Āpas', deity_te='జలదేవత', deity_sa='आपः',
    gana='Manuṣya', tattva='Jala', purushardha='Mokṣa', varna='Brāhmaṇa', nadi='Madhya',
    animal_iast='Male Monkey', animal_te='మగ కోతి', animal_sa='वानरः',
    vsn_from=77, vsn_to=80,
    syllables=[('भू','భూ','bhū'),('धा','ధా','dhā'),('फा','ఫా','phā'),('ढा','ఢా','ḍhā')]),
  # 21
  dict(num=21, id='uttarashadha',
    iast='Uttarāṣāḍhā', te='ఉత్తరాషాఢ', sa='उत्तराषाढा',
    stars=4, symbol_en='Small cot / tusk', symbol_te='చిన్న మంచం', symbol_sa='खट्वा',
    rashi='Makara', graha='Sūrya',
    deity_iast='Viśve Devāḥ', deity_te='విశ్వేదేవతలు', deity_sa='विश्वेदेवाः',
    gana='Manuṣya', tattva='Pṛthvī', purushardha='Mokṣa', varna='Kṣatriya', nadi='Antya',
    animal_iast='Female Mongoose', animal_te='ఆడ ముంగిస', animal_sa='नकुली',
    vsn_from=81, vsn_to=84,
    syllables=[('भे','భే','bhe'),('भो','భో','bho'),('जा','జా','jā'),('जी','జీ','jī')]),
  # 22
  dict(num=22, id='shravana',
    iast='Śravaṇa', te='శ్రవణ', sa='श्रवण',
    stars=3, symbol_en='Three footprints / ear', symbol_te='చెవి', symbol_sa='श्रोत्रम्',
    rashi='Makara', graha='Candra',
    deity_iast='Viṣṇu', deity_te='విష్ణువు', deity_sa='विष्णुः',
    gana='Deva', tattva='Vāyu', purushardha='Artha', varna='Chandāla', nadi='Ādi',
    animal_iast='Female Monkey', animal_te='ఆడ కోతి', animal_sa='वानरी',
    vsn_from=85, vsn_to=88,
    syllables=[('खी','ఖీ','khī'),('खू','ఖూ','khū'),('खे','ఖే','khe'),('खो','ఖో','kho')]),
  # 23
  dict(num=23, id='dhanishtha',
    iast='Dhaniṣṭhā', te='ధనిష్ఠ', sa='धनिष्ठा',
    stars=4, symbol_en='Drum / flute', symbol_te='మృదంగం', symbol_sa='मृदङ्गः',
    rashi='Kumbha', graha='Maṅgala',
    deity_iast='Aṣṭa Vasus', deity_te='అష్టవసువులు', deity_sa='अष्टवसवः',
    gana='Rākṣasa', tattva='Ākāśa', purushardha='Dharma', varna='Vaiśya', nadi='Madhya',
    animal_iast='Female Lion (Lioness)', animal_te='ఆడ సింహం', animal_sa='सिंही',
    vsn_from=89, vsn_to=92,
    syllables=[('गा','గా','gā'),('गी','గీ','gī'),('गु','గు','gu'),('गे','గే','ge')]),
  # 24
  dict(num=24, id='shatabhisha',
    iast='Śatabhiṣā', te='శతభిష', sa='शतभिषा',
    stars=100, symbol_en='Empty circle / 100 stars', symbol_te='శూన్యవలయం', symbol_sa='वृत्तम्',
    rashi='Kumbha', graha='Rāhu',
    deity_iast='Varuṇa', deity_te='వరుణదేవుడు', deity_sa='वरुणः',
    gana='Rākṣasa', tattva='Ākāśa', purushardha='Dharma', varna='Chandāla', nadi='Antya',
    animal_iast='Male Horse', animal_te='మగ గుర్రం', animal_sa='अश्वः',
    vsn_from=93, vsn_to=96,
    syllables=[('गो','గో','go'),('सा','సా','sā'),('सी','సీ','sī'),('सू','సూ','sū')]),
  # 25
  dict(num=25, id='purva-bhadrapada',
    iast='Pūrva Bhādrapadā', te='పూర్వ భాద్రపద', sa='पूर्वभाद्रपदा',
    stars=2, symbol_en='Sword / front legs of funeral cot', symbol_te='శవపేటె ముందు కాళ్ళు', symbol_sa='खड्गः',
    rashi='Mīna', graha='Guru',
    deity_iast='Aja Ekapāda', deity_te='అజ ఏకపాదుడు', deity_sa='अजएकपादः',
    gana='Manuṣya', tattva='Ākāśa', purushardha='Artha', varna='Brāhmaṇa', nadi='Ādi',
    animal_iast='Male Lion', animal_te='మగ సింహం', animal_sa='सिंहः',
    vsn_from=97, vsn_to=100,
    syllables=[('से','సే','se'),('सो','సో','so'),('दा','దా','dā'),('दी','దీ','dī')]),
  # 26
  dict(num=26, id='uttara-bhadrapada',
    iast='Uttara Bhādrapadā', te='ఉత్తర భాద్రపద', sa='उत्तरभाद्रपदा',
    stars=2, symbol_en='Twins / rear legs of funeral cot', symbol_te='శవపేటె వెనక కాళ్ళు', symbol_sa='युगलम्',
    rashi='Mīna', graha='Śani',
    deity_iast='Ahirbudhnya', deity_te='అహిర్బుధ్న్యుడు', deity_sa='अहिर्बुध्न्यः',
    gana='Manuṣya', tattva='Ākāśa', purushardha='Kāma', varna='Kṣatriya', nadi='Madhya',
    animal_iast='Female Cow', animal_te='ఆవు', animal_sa='गौः',
    vsn_from=101, vsn_to=104,
    syllables=[('दू','దూ','dū'),('था','థా','thā'),('झा','ఝా','jhā'),('ञा','ఞా','ñā')]),
  # 27
  dict(num=27, id='revati',
    iast='Revatī', te='రేవతి', sa='रेवती',
    stars=32, symbol_en='Fish / drum', symbol_te='చేప', symbol_sa='मत्स्यः',
    rashi='Mīna', graha='Budha',
    deity_iast='Pūṣan', deity_te='పూషణుడు', deity_sa='पूषा',
    gana='Deva', tattva='Ākāśa', purushardha='Mokṣa', varna='Śūdra', nadi='Antya',
    animal_iast='Female Elephant', animal_te='ఆడ ఏనుగు', animal_sa='हस्तिनी',
    vsn_from=105, vsn_to=108,
    syllables=[('दे','దే','de'),('दो','దో','do'),('चा','చా','cā'),('ची','చీ','cī')]),
]

# ── build JSON record ──────────────────────────────────────────────────────────

def build_record(n):
    rashi   = n['rashi']
    graha   = n['graha']
    nadi_k  = n['nadi']
    nadi    = NADI_DATA[nadi_k]
    gem     = GEM[graha]
    gana    = GANA_DATA[n['gana']]
    tattva  = TATTVA_DATA[n['tattva']]
    pur     = PURUSHARDHA_DATA[n['purushardha']]
    varna   = VARNA_DATA[n['varna']]

    syllables = {}
    for i, (sa, te, iast) in enumerate(n['syllables'], 1):
        syllables[f'p{i}'] = {'sa': sa, 'te': te, 'iast': iast}

    return {
        'num':  n['num'],
        'id':   n['id'],
        'name': {'iast': n['iast'], 'te': n['te'], 'sa': n['sa']},
        'stars': n['stars'],
        'symbol': {
            'en': n['symbol_en'], 'te': n['symbol_te'], 'sa': n['symbol_sa']
        },
        'rashi': {
            'iast': rashi, 'te': RASHI_TE[rashi],
            'sa': RASHI_SA[rashi], 'symbol': RASHI_SYMBOLS[rashi]
        },
        'rashi_lord':      _graha_obj(n['rashi']),  # overridden below per rashi
        'nakshatra_graha': {
            'iast': graha, 'sa': GRAHA_SA[graha], 'te': GRAHA_TE[graha]
        },
        'nakshatra_deity': {
            'iast': n['deity_iast'], 'te': n['deity_te'], 'sa': n['deity_sa']
        },
        'nakshatra_animal': {
            'iast': n['animal_iast'], 'te': n['animal_te'], 'sa': n['animal_sa']
        },
        'gana':         {'iast': n['gana'],         'sa': gana['sa'],       'te': gana['te']},
        'tattva':       {'iast': n['tattva'],        'sa': tattva['sa'],     'te': tattva['te'],   'en': tattva['en']},
        'purushardha':  {'iast': n['purushardha'],   'sa': pur['sa'],        'te': pur['te']},
        'dosha':        {'iast': nadi['dosha_iast'], 'sa': nadi['dosha_sa'], 'te': nadi['dosha_te']},
        'varna':        {'iast': n['varna'],         'sa': varna['sa'],      'te': varna['te']},
        'nadi':         {'iast': nadi_k,             'sa': nadi['sa'],       'te': nadi['te']},
        'gemstone':     gem,
        'sound_syllables': syllables,
        'vsn_shloka_from': n['vsn_from'],
        'vsn_shloka_to':   n['vsn_to'],
        'mantra': MANTRAS.get(n['num'], {'sa': '', 'te': '', 'iast': ''}),
    }

# Rashi lords
RASHI_LORD = {
    'Meṣa':'Maṅgala','Vṛṣabha':'Śukra','Mithuna':'Budha','Karkaṭa':'Candra',
    'Siṃha':'Sūrya','Kanyā':'Budha','Tulā':'Śukra','Vṛścika':'Maṅgala',
    'Dhanus':'Guru','Makara':'Śani','Kumbha':'Śani','Mīna':'Guru',
}

def _graha_obj(rashi):
    g = RASHI_LORD[rashi]
    return {'iast': g, 'sa': GRAHA_SA[g], 'te': GRAHA_TE[g]}


def main():
    records = []
    for n in NAKSHATRAS:
        r = build_record(n)
        # fix rashi_lord (computed from rashi)
        r['rashi_lord'] = _graha_obj(n['rashi'])
        records.append(r)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(records, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )
    print(f'Wrote {len(records)} nakshatras → {OUT}')


if __name__ == '__main__':
    main()
