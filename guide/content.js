/* content.js — Chanting Rules guide content (Śikṣā).
   Consolidated from a single-pass reading of the source material — the
   original draft repeated the same six topics three times at increasing
   detail; this keeps one clean pass per topic, folding the sutra citations
   and worked examples into it instead of a separate "step-by-step" repeat. */

const GUIDE_CONTENT = {
  title: { en: 'Pronunciation Rules — Śikṣā', sa: 'शिक्षा — उच्चारणनियमाः', te: 'ఉచ్చారణ నియమాలు — శిక్ష' },
  subtitle: {
    en: 'A structured guide to Sanskrit pronunciation, drawn from the Taittirīya Upaniṣad and Pāṇinīya Śīkṣā.',
    te: 'తైత్తిరీయోపనిషత్తు మరియు పాణినీయ శిక్ష ఆధారంగా సంస్కృత ఉచ్చారణకు మార్గదర్శిక.'
  },

  sections: [
    {
      id: 'overview',
      icon: '🕉️',
      title: { en: 'The Six Elements of Śikṣā', sa: 'शिक्षा', te: 'శిక్ష — ఆరు అంశాలు' },
      verse: {
        sa: 'शीक्षां व्याख्यास्यामः । वर्णः स्वरः । मात्रा बलम् । साम सन्तानः । इत्युक्तः शीक्षाध्यायः ॥',
        ro: 'śīkṣāṁ vyākhyāsyāmaḥ | varṇaḥ svaraḥ | mātrā balam | sāma santānaḥ | ityuktaḥ śīkṣādhyāyaḥ ||',
        source: 'Taittirīya Upaniṣad, Śīkṣāvallī 1.2.1',
        translation: {
          en: 'We shall now explain the science of pronunciation: Letter (varṇa), Accent (svara), Duration (mātrā), Effort (bala), Rhythm (sāma), and Flow (santāna).',
          te: 'ఇప్పుడు ఉచ్చారణ శాస్త్రాన్ని వివరిస్తాం: అక్షరం (వర్ణం), స్వరం, కాల ప్రమాణం (మాత్ర), శ్రమ (బలం), లయ (సామ), కలయిక (సంతానం).'
        }
      },
      body: [
        { en: 'These six elements are the entire syllabus of Vedic pronunciation, and every rule below is one of them worked out in practice.', te: 'ఈ ఆరు అంశాలే వేద ఉచ్చారణ శాస్త్రం మొత్తం — కింద ఉన్న ప్రతి నియమం వీటిలో ఏదో ఒకదాన్ని ఆచరణలో వివరిస్తుంది.' }
      ],
      items: [
        { term: 'Varṇa', sub: 'Letter', en: { en: 'Every phoneme articulated accurately from its correct place of origin (sthāna).', te: 'ప్రతి అక్షరాన్ని దాని సరైన స్థానం నుండి ఖచ్చితంగా పలకడం.' } },
        { term: 'Svara', sub: 'Accent / Pitch', en: { en: 'Udātta (raised), anudātta (lowered), and svarita (falling) — three Vedic pitch accents. In actual Vedic recitation, if the pitch is mispronounced or shifted to a different syllable, the meaning can change completely, or even flip to its opposite.', te: 'ఉదాత్తం, అనుదాత్తం, స్వరితం అనే మూడు వేద స్వరభేదాలు ఉన్నాయి. నిజమైన వేద పఠనంలో స్వరం తప్పుగా పలికినా లేదా వేరే అక్షరానికి మారినా, పలికిన మాట అర్థం పూర్తిగా మారిపోవచ్చు, కొన్నిసార్లు సరిగ్గా వ్యతిరేక అర్థం కూడా రావచ్చు.' } },
        { term: 'Mātrā', sub: 'Duration', en: { en: 'Short, long, and protracted vowels held for their exact, strict count of beats.', te: 'హ్రస్వ, దీర్ఘ, ప్లుత స్వరాలను వాటి ఖచ్చితమైన కాల ప్రమాణంతో పలకడం.' } },
        { term: 'Bala', sub: 'Effort', en: { en: 'Internal (tongue/lip contact) and external (breath) effort — covered under Prayatna below.', te: 'అంతః ప్రయత్నం (నాలుక/పెదవుల స్పర్శ) మరియు బాహ్య ప్రయత్నం (ఊపిరి) — దిగువ ప్రయత్నం విభాగంలో వివరణ.' } },
        { term: 'Sāma', sub: 'Evenness', en: { en: 'A constant tempo and smooth rhythm, without rushing, dragging, or emotional distortion.', te: 'తొందరపడకుండా, జాప్యం చేయకుండా, భావావేశం లేకుండా — స్థిరమైన వేగం, సాఫీ లయ.' } },
        { term: 'Santāna', sub: 'Flow', en: { en: 'How words join in continuous recitation (sandhi), and where pauses are and are not allowed.', te: 'నిరంతర పఠనంలో పదాలు ఎలా కలుస్తాయో (సంధి), ఎక్కడ ఆగవచ్చో ఎక్కడ ఆగకూడదో.' } }
      ]
    },

    {
      id: 'sthana',
      icon: '👄',
      title: { en: 'Sthāna — Places of Articulation', sa: 'स्थानम्', te: 'స్థానం — ఉచ్చారణ స్థలాలు' },
      body: [
        { en: 'Every sound in Sanskrit originates from one exact place in the mouth or throat. Chanting the right letter from the wrong place is still a mispronunciation — this is the most common, and most correctable, source of unclear chanting.', te: 'ప్రతి సంస్కృత ధ్వని నోటిలో లేదా గొంతులో ఒక నిర్దిష్ట స్థానం నుండి పుడుతుంది. సరైన అక్షరాన్ని తప్పు స్థానం నుండి పలకడం కూడా అపభ్రంశమే — ఇది అత్యంత సాధారణమైన, అత్యంత సరిదిద్దగలిగిన అస్పష్ట ఉచ్చారణ మూలం.' }
      ],
      diagram: 'sthana',
      items: [
        { term: 'Kaṇṭha', sub: 'Throat / Guttural', sutra: 'अकुहविसर्जनीयानां कण्ठः', letters: 'a, ā · ka-varga (ka kha ga gha ṅa) · ha · visarga (ः)' },
        { term: 'Tālu', sub: 'Hard palate / Palatal', sutra: 'इचुयशानां तालु', letters: 'i, ī · ca-varga (ca cha ja jha ña) · ya · śa' },
        { term: 'Mūrdhā', sub: 'Roof of mouth / Retroflex', sutra: 'ऋटुरषाणां मूर्धा', letters: 'ṛ, ṝ · ṭa-varga (ṭa ṭha ḍa ḍha ṇa) · ra · ṣa' },
        { term: 'Danta', sub: 'Teeth / Dental', sutra: 'लृतुलसानां दन्ताः', letters: 'ḷ · ta-varga (ta tha da dha na) · la · sa' },
        { term: 'Oṣṭha', sub: 'Lips / Labial', sutra: 'उपूपध्मानीयानाम् ओष्ठौ', letters: 'u, ū · pa-varga (pa pha ba bha ma) · upadhmānīya' },
        { term: 'Nāsikā', sub: 'Nasal cavity', sutra: 'ञमङणनानां नासिका च', letters: 'ña, ma, ṅa, ṇa, na — engage both their own sthāna and the nose' },
        { term: 'Combined places', sub: '', letters: 'va = danta+oṣṭha · e, ai = kaṇṭha+tālu · o, au = kaṇṭha+oṣṭha — these diphthongs are themselves vowel-combinations: e = a+i, ai = ā+ī, o = a+u, au = ā+ū' },
        {
          term: 'Hakāra after a nasal — a Telugu print convention',
          sub: { en: 'Not a sandhi rule, but a common orthographic pattern', te: 'సంధి నియమం కాదు, ముద్రణలో కనిపించే సాధారణ ధోరణి' },
          tentative: true,
          letters: {
            en: 'In some Telugu-script printings, a conjunct ending in ḍha/hma before ha-adjacent letters is respelled with the class-nasal (ṇ/n/m) directly before ha — e.g. prauḍha appears as prauṇha, vahni as vanhi, brahma as bramha. This is a print/orthography habit noted in traditional teaching notes rather than a Pāṇinian sandhi rule; the correct chanted sound is still the original aspirate (ḍha/hma), not the respelled nasal+ha. Flagged here for awareness — check with a teacher before treating this as a pronunciation instruction.',
            te: 'కొన్ని తెలుగు ముద్రణలలో, హ-సమీప అక్షరాల ముందు ఢ/హ్మ తో ముగిసే సంయుక్తాక్షరాన్ని నేరుగా వర్గ-నాసిక్యంతో (ణ/న/మ) హ ముందు మళ్ళీ రాస్తారు — ఉదా. ప్రౌఢ → ప్రౌణ్హ, వహ్ని → వన్హి, బ్రహ్మ → బ్రమ్హ. ఇది పాణినీయ సంధి నియమం కాదు — సంప్రదాయ బోధనా నోట్సులలో కనిపించే ముద్రణ/రచనా అలవాటు మాత్రమే; నిజంగా పలకవలసిన ధ్వని ఇప్పటికీ మూల మహాప్రాణమే (ఢ/హ్మ), తిరిగి రాసిన నాసిక్యం+హ కాదు. అవగాహన కోసం ఇక్కడ గుర్తించాం — దీన్ని ఉచ్చారణ సూచనగా తీసుకునే ముందు గురువును సంప్రదించండి.'
          }
        },
        {
          term: 'Jihvāmūlīya', sub: { en: 'Tongue-root — a visarga variant', te: 'జిహ్వామూలం — విసర్గ ఉపరూపం' },
          sutra: 'क्ख इति कखाभ्यां प्रागर्धविसर्गसदृशो जिह्वामूलीयः',
          letters: { en: 'A special half-visarga sound, articulated at the root of the tongue, that replaces a plain visarga specifically when it occurs right before ka or kha. Example, Bhagavad Gītā 1.35: "hetoḥ kiṃ nu mahīkṛte" — the visarga in hetoḥ, right before kiṃ, takes this tongue-root sound, not a plain "ha".', te: 'నాలుక మూలం నుండి పలికే ప్రత్యేక అర్ధ-విసర్గ ధ్వని — క లేదా ఖ ముందు వచ్చిన సాధారణ విసర్గకు బదులుగా వస్తుంది. ఉదాహరణ, భగవద్గీత 1.35: "హేతోః కిం ను మహీకృతే" — ఇందులో హేతోః తర్వాత కిం రావడంతో ఆ విసర్గ ఈ నాలుక-మూల ధ్వనిగా పలకాలి, సాధారణ "హ" లా కాదు.' }
        },
        {
          term: 'Upadhmānīya', sub: { en: 'Lip-region — a visarga variant', te: 'ఓష్ఠ ప్రాంతం — విసర్గ ఉపరూపం' },
          sutra: 'प्फ इति पफाभ्यां प्रागर्धविसर्गसदृश उपध्मानीयः',
          letters: { en: 'The equivalent half-visarga sound before pa or pha — articulated near the lips instead of the throat. Example, Bhagavad Gītā 1.1, the very opening line: "māmakāḥ pāṇḍavāścaiva" — the visarga in māmakāḥ, right before pāṇḍavāḥ, takes this lip-region sound. Most reciters flatten both this and the jihvāmūlīya into a plain visarga; the tradition treats them as distinct sounds with their own sthāna.', te: 'ప లేదా ఫ ముందు వచ్చే ఇదే తరహా అర్ధ-విసర్గ ధ్వని — గొంతు బదులు పెదవుల దగ్గర పలుకుతారు. ఉదాహరణ, భగవద్గీతలో మొదటి పాదమే — 1.1: "మామకాః పాండవాశ్చైవ" — ఇందులో మామకాః తర్వాత పాండవాః రావడంతో ఆ విసర్గ ఈ పెదవి-ప్రాంత ధ్వనిగా పలకాలి. చాలామంది పఠనకర్తలు దీన్నీ, జిహ్వామూలీయాన్నీ రెండింటినీ సాధారణ విసర్గగానే పలుకుతారు; సంప్రదాయం వీటిని వాటి స్వంత స్థానం గల వేర్వేరు ధ్వనులుగా చూస్తుంది.' }
        }
      ],
      rule: {
        sa: 'अं अः इत्यचः परावनुस्वारविसर्गौ',
        ro: 'aṁ aḥ ityacaḥ parāvanusvāraviṣargau',
        source: 'Śikṣā sūtras — Yogavāha classification',
        translation: {
          en: 'Anusvāra and visarga are classed as "following" (para) sounds of a vowel — not full vowels, not full consonants, but a distinct category called yogavāha ("that which carries the combination"). Anusvāra, visarga, jihvāmūlīya, and upadhmānīya all belong to this same category — which is why they behave differently from ordinary consonants in sandhi.',
          te: 'అనుస్వారం, విసర్గ — స్వరం తర్వాత వచ్చే ("పర") ధ్వనులుగా వర్గీకరించబడతాయి — పూర్తి స్వరాలు కావు, పూర్తి హల్లులు కావు, "యోగవాహాః" అనే ప్రత్యేక వర్గం. అనుస్వారం, విసర్గ, జిహ్వామూలీయం, ఉపధ్మానీయం — నాలుగూ ఇదే వర్గానికి చెందుతాయి — అందుకే సంధిలో ఇవి సాధారణ హల్లుల కంటే వేరుగా ప్రవర్తిస్తాయి.'
        }
      },
      body2: [
        { en: 'Why this matters in practice: śa (palatal, tālavya), ṣa (retroflex, mūrdhanya) and sa (dental, dantya) are three different sthānas that sound almost identical if you\'re careless — and confusing them changes real words.', te: 'ఆచరణలో ఇది ఎందుకు ముఖ్యమో: శ (తాలవ్యం), ష (మూర్ధన్యం), స (దంత్యం) — మూడు వేర్వేరు స్థానాలు, జాగ్రత్త లేకపోతే దాదాపు ఒకేలా వినిపిస్తాయి — వీటిని తారుమారు చేస్తే నిజమైన పదాలు మారిపోతాయి.' }
      ],
      verse2: {
        sa: 'यद्यपि बहुनाधीषे तथापि पठ पुत्र! व्याकरणम् । स्वजनः श्वजनो मा भूत् सकलं शकलं सकृत् शकृत् ॥',
        ro: 'yadyapi bahunādhīṣe tathāpi paṭha putra! vyākaraṇam | svajanaḥ śvajano mā bhūt sakalaṁ śakalaṁ sakṛt śakṛt ||',
        source: 'Traditional verse on the necessity of grammar (cf. Patañjali Mahābhāṣya)',
        translation: {
          en: 'My child, even if you study little else, learn grammar. So that svajanaḥ (kinsman, dental sa) never becomes śvajanaḥ (a dog, palatal śa) — sakalam (whole, dental sa) never becomes śakalam (a fragment, palatal śa) — and sakṛt (once, dental sa) never becomes śakṛt (excrement, palatal śa).',
          te: 'నాయనా! నీవు ఎక్కువ చదవకపోయినా పర్వాలేదు, వ్యాకరణం మాత్రం నేర్చుకో. స్వజనః (మన వాళ్ళు, దంత్య స) శ్వజనః (కుక్కలు, తాలవ్య శ) కాకుండా — సకలం (సర్వం, దంత్య స) శకలం (ముక్కలు, తాలవ్య శ) కాకుండా — సకృత్ (ఒకసారి, దంత్య స) శకృత్ (మలము, తాలవ్య శ) కాకుండా ఉండడానికే కాక, తదితర పదాలను కూడా సక్రమంగా పలకడానికి ఇది ఉపయోగపడుతుంది.'
        }
      }
    },

    {
      id: 'svara',
      icon: '🎵',
      title: { en: 'Svara — Pitch Accent', sa: 'स्वरः', te: 'స్వరం — స్వర భేదం' },
      body: [
        { en: 'In Vedic chanting especially, pitch is not decoration — if a syllable is chanted with the wrong pitch, or the accent lands on the wrong syllable, the meaning can change completely, sometimes even flipping to the exact opposite of what was intended.', te: 'ముఖ్యంగా వేద పఠనంలో స్వరం కేవలం అలంకారం కాదు — ఒక అక్షరాన్ని తప్పు స్వరంతో పలికినా, లేదా స్వరం వేరే అక్షరం మీద పడినా, అర్థం పూర్తిగా మారిపోవచ్చు, కొన్నిసార్లు ఉద్దేశించిన దానికి సరిగ్గా వ్యతిరేకంగా కూడా మారిపోవచ్చు.' },
        { en: 'Where this actually applies: the Bhagavad Gītā is smṛti, not chanted with these formal Vedic pitch accents the way Veda mantras are — so this section is most relevant if you also recite VSN or other Vedic-tradition material. Getting svara right is not something to self-teach from text; it genuinely needs a qualified guru\'s ear.', te: 'ఇది నిజంగా ఎక్కడ వర్తిస్తుందంటే: భగవద్గీత స్మృతి గ్రంథం — వేద మంత్రాల్లా ఈ లాంఛనప్రాయమైన వేద స్వరాలతో పఠించరు. కాబట్టి మీరు VSN లేదా ఇతర వేద-సంబంధ గ్రంథాలు కూడా పఠిస్తుంటే ఈ విభాగం మీకు ఎక్కువ వర్తిస్తుంది. స్వరాన్ని పాఠం చూసి స్వయంగా నేర్చుకోదగినది కాదు — దీనికి నిజంగా అర్హత గల గురువు చెవి అవసరం.' }
      ],
      verse: {
        sa: 'उदात्तश्च अनुदात्तश्च स्वरितश्च त्रयः स्वराः । एकश्रुति दूरात् संबुद्धौ इति शिक्षा प्रकीर्तिता ॥',
        ro: 'udāttaśca anudāttaśca svaritaśca trayaḥ svarāḥ | ekaśruti dūrāt saṁbuddhau iti śikṣā prakīrtitā ||',
        source: 'Pāṇinīya Śīkṣā',
        translation: {
          en: 'Udātta (raised), anudātta (lowered), and svarita (a blend of the two) are the three [Vedic] pitch accents. Ekaśruti (a level monotone) is used when calling out to someone from a distance. Thus is śikṣā proclaimed.',
          te: 'ఉదాత్తం, అనుదాత్తం, స్వరితం అని మూడు వేద స్వరభేదాలు ఉన్నాయి. ఎవరినైనా దూరం నుండి పిలిచేటప్పుడు మాత్రం ఏకశ్రుతి అంటే ఒకే స్థాయిలో స్వరం వాడతారు. ఇదే శిక్షా శాస్త్రం బోధించేది.'
        }
      },
      items: [
        { term: 'Udātta', sub: { en: 'Raised / high pitch', te: 'ఎత్తైన స్వరం' }, en: { en: 'Unmarked in most printed texts; the reference pitch a syllable is chanted at.', te: 'చాలా ముద్రిత గ్రంథాలలో దీనికి ప్రత్యేక గుర్తు ఉండదు; మిగతా స్వరాలను దీనితో పోల్చుకుంటారు.' } },
        { term: 'Anudātta', sub: { en: 'Lowered / low pitch', te: 'తగ్గిన స్వరం' }, en: { en: 'Marked with a horizontal line below the syllable; a distinctly lower tone than udātta.', te: 'అక్షరం కింద అడ్డగీత గుర్తుతో చూపిస్తారు; ఉదాత్తం కంటే స్పష్టంగా తక్కువ స్థాయిలో ఉంటుంది.' } },
        { term: 'Svarita', sub: { en: 'Falling / combined pitch', te: 'దిగే స్వరం' }, en: { en: 'Marked with a vertical line above the syllable; begins high and falls — a blend arising from an udātta followed by an anudātta.', te: 'అక్షరం పైన నిలువుగీత గుర్తుతో చూపిస్తారు; ఎత్తుగా మొదలై కిందికి దిగుతుంది — ఉదాత్తం తర్వాత వెంటనే అనుదాత్తం వచ్చినప్పుడు ఏర్పడే కలయిక ఇది.' } },
        { term: 'Ekaśruti', sub: { en: 'Level monotone', te: 'ఒకే స్థాయి స్వరం' }, en: { en: 'Used when calling out from a distance (dūrāt saṁbuddhau) — the one case where pitch variation is deliberately dropped.', te: 'ఎవరినైనా దూరం నుండి పిలిచేటప్పుడు వాడతారు — స్వర వైవిధ్యాన్ని ఉద్దేశపూర్వకంగా వదిలేసే ఏకైక సందర్భం ఇది.' } },
        { term: 'Dīrgha-svarita', sub: { en: 'A fourth accent — extended svarita', te: 'నాలుగవ స్వరం — దీర్ఘ స్వరితం' }, en: { en: 'An extended, higher-held variant of svarita, marked with two vertical strokes above the syllable instead of one — used at the end of a sentence, or on a dīrgha vowel immediately before a conjunct consonant. Named in the Rules of Chanting in Saṁskṛtam (Swamini Svatmabodhananda Saraswati) alongside the standard three; not always taught as a separate accent in shorter treatments.', te: 'స్వరితం యొక్క పొడిగించిన, ఎక్కువసేపు ఎత్తులో నిలిచే రూపం — అక్షరం పైన ఒక నిలువుగీతకు బదులు రెండు గీతలతో సూచిస్తారు — వాక్యాంతంలో, లేదా సంయుక్తాక్షరం ముందు వచ్చిన దీర్ఘ స్వరంపై వాడతారు. Rules of Chanting in Saṁskṛtam (స్వామినీ స్వాత్మబోధానంద సరస్వతి) గ్రంథంలో మిగతా మూడు స్వరాలతో పాటు పేర్కొనబడింది; తక్కువ లోతైన బోధనలలో దీన్ని ప్రత్యేక స్వరంగా చెప్పకపోవచ్చు.' } }
      ],
      verseExample: {
        ref: { en: 'Classic grammarians\' example', te: 'ప్రసిద్ధ వ్యాకరణ ఉదాహరణ' },
        text: 'indraśatruḥ',
        note: {
          en: 'The classic grammarians\' cautionary tale: as a tatpuruṣa (accent on the final syllable) it means "Indra\'s slayer" — but chanted with the accent shifted to the first syllable, it becomes a bahuvrīhi meaning "one whose enemy is Indra," reversing who kills whom. Pitch alone carries that grammatical distinction — which is why Vedic mantras are guarded so carefully.',
          te: 'వ్యాకరణవేత్తల ప్రసిద్ధ హెచ్చరిక కథ: చివరి అక్షరంపై స్వరం ఉంటే (తత్పురుష) "ఇంద్రుని చంపేవాడు" అని అర్థం — కానీ మొదటి అక్షరానికి స్వరం మారితే (బహువ్రీహి) "ఎవరి శత్రువు ఇంద్రుడో వాడు" అని తారుమారు అవుతుంది. స్వరం ఒక్కటే ఆ వ్యాకరణ భేదాన్ని మోసుకెళుతుంది — అందుకే వేద మంత్రాలను ఇంత జాగ్రత్తగా కాపాడతారు.'
        }
      }
    },

    {
      id: 'matra',
      icon: '⏱️',
      title: { en: 'Mātrā — Duration', sa: 'मात्रा', te: 'మాత్ర — కాల ప్రమాణం' },
      verse: {
        sa: 'एकमात्रो भवेद्ध्रस्वो द्विमात्रो दीर्घ उच्यते । त्रिमात्रस्तु प्लुतो ज्ञेयो व्यञ्जनं चार्धमात्रकम् ॥',
        ro: 'ekamātro bhaveddhrasvo dvimātro dīrgha ucyate | trimātrastu pluto jñeyo vyañjanaṁ cārdhamātrakam ||',
        source: 'Pāṇinīya Śīkṣā',
        translation: {
          en: 'One mātrā is defined as the time taken to snap a finger or blink an eye — a natural, physical unit of time, not a vague feeling of "short" or "long".',
          te: 'ఒక మాత్ర అంటే వేలు చిటికె వేసేంత లేదా కంటి రెప్ప వేసేంత కాలం — ఇది సహజమైన, భౌతిక కాల ప్రమాణం, "పొట్టి" "పొడవు" అనే అస్పష్ట భావన కాదు.'
        }
      },
      diagram: 'matra',
      items: [
        { term: 'Hrasva', sub: 'Short — 1 mātrā', letters: 'a, i, u, ṛ, ḷ' },
        { term: 'Dīrgha', sub: 'Long — 2 mātrās, exactly twice hrasva', letters: 'ā, ī, ū, ṝ, e, ai, o, au' },
        { term: 'Pluta', sub: 'Protracted — 3 mātrās, marked ३', letters: { en: 'used when calling from a distance, in Vedic accents, e.g. Om3', te: 'దూరం నుండి పిలిచేటప్పుడు, వేద స్వరాలలో వాడతారు, ఉదా. ఓం3' } },
        { term: 'Vyañjana', sub: 'Pure consonant — ½ mātrā', letters: { en: 'a consonant with no vowel of its own, e.g. k, t, m', te: 'తనదైన స్వరం లేని హల్లు, ఉదా. క్, త్, మ్' } }
      ]
    },

    {
      id: 'anunasika',
      icon: '👃',
      title: { en: 'Anunāsika — Nasalized vs Oral', sa: 'अनुनासिकः', te: 'అనునాసికం — నాసిక్య, నిరనునాసిక అక్షరాలు' },
      body: [
        { en: 'Anunāsika means "sounded through the nose [as well as the mouth]" — air passes through both passages at once. This is a different, often-confused category from anusvāra (ं), which is a nasal stop that comes after a vowel, not a nasal quality of the vowel itself — see Sandhi & Parasavarṇa above for anusvāra.', te: 'అనునాసికం అంటే — నోటితో పాటు ముక్కు గుండా కూడా ధ్వని రావడం. ఇది అనుస్వారం (ం) కంటే వేరు — అనుస్వారం స్వరం తర్వాత వచ్చే నాసిక్య ఆగివేత, స్వరం యొక్క స్వంత గుణం కాదు. అనుస్వారం గురించి పైన సంధి విభాగంలో చూడండి.' }
      ],
      items: [
        { term: 'Anunāsika consonants', sub: { en: 'The five class-nasals', te: 'ఐదు వర్గ నాసిక్యాలు' }, letters: { en: 'ṅa, ña, ṇa, na, ma — each already carries its own sthāna (kaṇṭha/tālu/mūrdhā/danta/oṣṭha) plus the nasal cavity, engaged together.', te: 'ఙ, ఞ, ణ, న, మ — వీటిలో ప్రతి ఒక్కటీ తన సొంత స్థానం (కంఠ/తాలు/మూర్ధ/దంత/ఓష్ఠ) తో పాటు నాసికను కూడా ఏకకాలంలో ఉపయోగిస్తుంది.' } },
        { term: 'Anunāsika vowels', sub: { en: 'Nasalized vowels', te: 'నాసిక్య స్వరాలు' }, letters: { en: 'any vowel can be nasalized — marked with a candrabindu (ँ) in Devanāgarī — distinct from the plain (anunāsika-rahita / nirasita) oral vowel.', te: 'ఏ స్వరమైనా నాసిక్యంగా మారవచ్చు — దేవనాగరిలో చంద్రబిందువు (ँ) తో గుర్తించబడుతుంది — సాధారణ (అనునాసిక-రహిత) నోటి స్వరం కంటే వేరు.' } },
        { term: 'Aduṣṭa vs Anunāsika-rahita', sub: { en: 'The default case', te: 'సాధారణ స్థితి' }, letters: { en: 'a consonant or vowel with no nasal marking is anunāsika-rahita (purely oral) — this is the default state for everything not listed above.', te: 'నాసిక్య గుర్తు లేని హల్లు లేదా స్వరం అనునాసిక-రహితం (పూర్తిగా నోటిది) — పైన పేర్కొనని ప్రతిదానికీ ఇదే సాధారణ స్థితి.' } }
      ],
      rule: {
        sa: 'यरोऽनुनासिके अनुनासिको वा',
        ro: 'yaro\'nunāsike anunāsiko vā',
        source: 'Pāṇini 8.4.45',
        translation: {
          en: 'A semivowel (ya, ra, la, va) immediately before a nasal consonant may optionally itself become nasalized — one of the few places Sanskrit phonetics explicitly allows a chanter\'s discretion, rather than a fixed rule.',
          te: 'నాసిక్య హల్లుకు ముందు వచ్చిన అర్ధస్వరం (య, ర, ల, వ) ఐచ్ఛికంగా నాసిక్యంగా మారవచ్చు — సంస్కృత ధ్వనిశాస్త్రంలో పఠించేవారి విచక్షణకు స్పష్టంగా చోటిచ్చిన కొద్ది సందర్భాలలో ఇది ఒకటి.'
        }
      }
    },

    {
      id: 'eighteen-a',
      icon: '🔢',
      title: { en: '"अ" in Eighteen Ways', sa: '', te: '"అ" — పద్దెనిమిది విధాలు' },
      body: [
        { en: 'This is where sthāna, mātrā, svara, and anunāsika all meet. Even the simplest vowel — अ (a) — is not one sound. It is the product of three independent choices, and getting any one of them wrong changes what you\'ve actually said.', te: 'ఇక్కడ స్థానం, మాత్ర, స్వరం, అనునాసికం — అన్నీ కలుస్తాయి. అతి సరళమైన అచ్చు — అ — కూడా ఒకే ధ్వని కాదు. ఇది మూడు స్వతంత్ర ఎంపికల ఫలితం, వాటిలో ఏదొక్కటి తప్పైనా నిజంగా పలికిన మాటే మారిపోతుంది.' }
      ],
      items: [
        { term: 'Duration', sub: '3 choices', letters: 'hrasva (1 mātrā) · dīrgha (2 mātrās) · pluta (3 mātrās)' },
        { term: 'Pitch', sub: '× 3 choices', letters: 'udātta · anudātta · svarita' },
        { term: 'Nasality', sub: '× 2 choices', letters: 'anunāsika (nasalized) · anunāsika-rahita (oral)' }
      ],
      body2: [
        { en: '3 × 3 × 2 = 18 distinct ways to pronounce a single vowel like अ — this is traditional śikṣā-paramparā teaching, following directly from the mātrā, svara, and anunāsika rules above (each individually sourced in their own sections). Not all 18 carry different meanings in ordinary speech, but in Vedic mantra recitation, where accent and nasality are both meaning-bearing, the wrong combination is a real error, not a stylistic variation.', te: '3 × 3 × 2 = 18 — ఒకే అచ్చు అ ని పలికే విధాలు — ఇది సంప్రదాయ శిక్షా బోధన, పైన చెప్పిన మాత్ర, స్వర, అనునాసిక నియమాల నుండి నేరుగా వస్తుంది. సాధారణ మాటలో అన్ని 18 వేర్వేరు అర్థాలు ఇవ్వకపోవచ్చు, కానీ వేద మంత్ర పఠనంలో — స్వరం, నాసిక్యత రెండూ అర్థాన్ని మోసుకెళ్తాయి కాబట్టి — తప్పు కలయిక నిజమైన దోషమే, శైలీ వ్యత్యాసం కాదు.' }
      ],
      verse2: {
        sa: 'अक्षराणामकारोऽस्मि द्वन्द्वः सामासिकस्य च । अहमेवाक्षयः कालो धाताहं विश्वतोमुखः ॥',
        ro: 'akṣarāṇām akāro\'smi dvandvaḥ sāmāsikasya ca | ahamevākṣayaḥ kālo dhātāhaṁ viśvatomukhaḥ ||',
        source: 'Bhagavad Gītā 10.33',
        translation: {
          en: 'Among letters, I am the letter A; among compounds, I am the dvandva. I alone am imperishable time; I am the sustainer, facing all directions. — Krishna names Himself with the very letter whose correct pronunciation carries this much weight.',
          te: 'అక్షరాలలో నేను అకారాన్ని; సమాసాలలో నేను ద్వంద్వాన్ని. నేనే నాశనం లేని కాలాన్ని; అన్ని దిక్కులవైపు చూసే ధాతను నేనే. — ఎంత ఖచ్చితత్వం అవసరమో ఆ అక్షరంతోనే కృష్ణుడు తనను తాను చెప్పుకుంటాడు.'
        }
      }
    },

    {
      id: 'prayatna',
      icon: '💨',
      title: { en: 'Prayatna — Effort & Aspiration', sa: 'प्रयत्नः', te: 'ప్రయత్నం — శ్రమ, ఊపిరి' },
      verse: {
        sa: 'यथा व्याघ्री हरेत्पुत्रान् दंष्ट्राभ्यां न च पीडयेत् । भीता दन्तपाताभ्यामिति वर्णान् प्रयोजयेत् ॥',
        ro: 'yathā vyāghrī haretputrān daṁṣṭrābhyāṁ na ca pīḍayet | bhītā dantapātābhyāmiti varṇān prayojayet ||',
        source: 'Pāṇinīya Śīkṣā, v.24 — "The Tigress Analogy"',
        translation: {
          en: 'Just as a tigress carries her cubs between her teeth without crushing them, yet holds them firmly lest they fall — so articulate each letter: firm, but never harsh or strained.',
          te: 'తల్లి పులి తన పిల్లలను దంతాలతో మోసేటప్పుడు నలగకుండా, కానీ పడిపోకుండా గట్టిగా పట్టుకున్నట్టు — అదేవిధంగా ప్రతి అక్షరాన్ని పలకాలి: దృఢంగా, కానీ కర్కశంగా లేదా అతిగా శ్రమపడకుండా.'
        }
      },
      body: [
        { en: 'Internal effort (how the tongue/lips touch) and external effort (how much breath is used) both shape a sound. Getting the letter right but the effort wrong is still audible as a mispronunciation to a trained ear.', te: 'నాలుక/పెదవుల స్పర్శ (అంతః ప్రయత్నం) మరియు ఊపిరి బలం (బాహ్య ప్రయత్నం) — రెండూ ధ్వనిని రూపొందిస్తాయి. అక్షరం సరిగ్గా ఉన్నా ప్రయత్నం తప్పైతే, నేర్పరి చెవికి అది తప్పు ఉచ్చారణగానే వినిపిస్తుంది.' }
      ],
      items: [
        { term: 'Spṛṣṭa', sub: 'Full contact', letters: 'all stop consonants, ka to ma' },
        { term: 'Īṣat-spṛṣṭa', sub: 'Slight contact', letters: 'semivowels — ya, ra, la, va' },
        { term: 'Īṣat-vivṛta', sub: 'Slightly open', letters: 'sibilants/aspirates — śa, ṣa, sa, ha' },
        { term: 'Vivṛta', sub: 'Fully open', letters: 'all vowels' },
        { term: 'Alpaprāṇa', sub: 'Unaspirated — gentle breath', letters: '1st, 3rd, 5th letter of each varga + ya ra la va (ka, ga, ṅa…)' },
        {
          term: 'Mahāprāṇa', sub: 'Aspirated — strong breath', letters: '2nd, 4th letter of each varga + śa ṣa sa ha (kha, gha…)',
          warn: { en: 'Never soften a mahāprāṇa into an alpaprāṇa — dharma must never become darma.', te: 'మహాప్రాణాన్ని అల్పప్రాణంగా మృదువుగా చేయవద్దు — ధర్మ అనేది దర్మ కాకూడదు.' }
        },
        {
          term: 'Repha (र्) before a sibilant',
          sub: { en: 'Rules of Chanting in Saṁskṛtam, Swamini Svatmabodhananda Saraswati', te: 'Rules of Chanting in Saṁskṛtam, స్వామినీ స్వాత్మబోధానంద సరస్వతి' },
          en: {
            en: 'When "r" is immediately followed by one of the ūṣmāṇaḥ (śa, ṣa, sa, ha), it should carry a little more stress than an ordinary r — a small but deliberate emphasis, not a full stop or a rolled trill. Reciters who treat every r identically miss this distinction.',
            te: 'ర్ తర్వాత వెంటనే ఊష్మాక్షరాలలో ఒకటి (శ, ష, స, హ) వస్తే, ఆ రేఫాన్ని సాధారణ ర కంటే కొంచెం ఎక్కువ ఒత్తితో పలకాలి — చిన్నదైనా ఉద్దేశపూర్వకమైన ఒత్తిడి, పూర్తి ఆపు కాదు, దొర్లే ధ్వనీ కాదు. ప్రతి రను ఒకేలా పలికేవారు ఈ భేదాన్ని కోల్పోతారు.'
          }
        }
      ],
      verse2: {
        sa: 'व्याघ्री यथा हरेत्पुत्रान्दंष्ट्राभ्यां न च पीडयेत् । भीता पतनभेदाभ्यां तद्वद्वर्णान्पीडयेत् ॥',
        ro: 'vyāghrī yathā haretputrān daṁṣṭrābhyāṁ na ca pīḍayet | bhītā patanabhedābhyāṁ tadvad varṇān pīḍayet ||',
        source: 'Pāṇinīya Śīkṣā, v.24 — alternate reading',
        translation: {
          en: 'A variant of the same verse — word order and the second line\'s ending differ from the version above, but the teaching is identical. Both readings circulate in the tradition.',
          te: 'ఇదే శ్లోకం యొక్క మరో పాఠాంతరం — పద క్రమం, రెండవ పాదం ముగింపు పైన ఉన్నదానికంటే వేరు, కానీ బోధన ఒకటే. రెండు పాఠాంతరాలూ సంప్రదాయంలో వాడుకలో ఉన్నాయి.'
        }
      }
    },

    {
      id: 'tempo',
      icon: '🎼',
      title: { en: 'Laya — Tempo & Rhythm', sa: 'लयः', te: 'లయ — వేగం' },
      body: [
        { en: 'This is Sāma from the six elements — an even, unhurried pace. Both extremes are faults: rushing (śīghrī, one of the six faults of a chanter) and dragging are equally listed as errors, not just speed.', te: 'ఇది ఆరు అంశాలలో సామ — తొందరపడకుండా, స్థిరమైన వేగం. రెండు అతివాదాలూ దోషాలే — తొందర (శీఘ్రీ, పాఠకుని ఆరు దోషాలలో ఒకటి) మరియు మరీ నెమ్మది — రెండూ తప్పులే.' }
      ],
      verse: {
        sa: 'न अतिद्रुतं न अतिविलम्बितं मध्यमं पठनं हितम् । स्पष्टं सुश्रावणं चैव वाचनस्य विशेषणम् ॥',
        ro: 'na atidrutaṁ na ativilambitaṁ madhyamaṁ paṭhanaṁ hitam | spaṣṭaṁ suśrāvaṇaṁ caiva vācanasya viśeṣaṇam ||',
        source: 'Śikṣā sūtras',
        translation: {
          en: 'Neither too fast nor too slow — a moderate (madhyama) pace is beneficial for recitation. Clear and pleasant-to-hear — these are the marks of good vācana (recitation).',
          te: 'మరీ వేగం కాదు, మరీ నెమ్మది కాదు — మధ్యమ వేగం పఠనానికి హితకరం. స్పష్టంగా, వినడానికి ఇంపుగా — ఇవే మంచి వాచనానికి లక్షణాలు.'
        }
      },
      body2: [
        { en: 'Practically: if you notice yourself swallowing syllables or running padas together to keep up, you\'ve drifted into śīghrī (the "reciting too fast" fault) — slow down to madhyama-laya before continuing, rather than pushing through at the wrong speed.', te: 'ఆచరణలో: అక్షరాలు మింగేస్తున్నారా, పాదాలు కలిపేస్తున్నారా అనిపిస్తే — అది శీఘ్రీ దోషం లోకి జారడమే — తప్పు వేగంతో కొనసాగించకుండా, మధ్యమ లయకు తిరిగి రావాలి.' }
      ]
    },

    {
      id: 'sandhi',
      icon: '🔗',
      title: { en: 'Sandhi & Parasavarṇa — Flow', sa: 'सन्तानः', te: 'సంధి — స్వరాల కలయిక' },
      body: [
        { en: 'An anusvāra (ం) has no independent sound of its own — unlike every other letter, its pronunciation always depends entirely on the consonant that follows it. That is exactly what the parasavarṇa rule below specifies.', te: 'అనుస్వారానికి (ం) సొంతమైన స్వతంత్ర ఉచ్చారణ లేదు — మిగతా ప్రతి అక్షరం లాగా కాకుండా, దాని పలుకుబడి పూర్తిగా తర్వాత వచ్చే హల్లుపై ఆధారపడి ఉంటుంది. కింద ఉన్న పరసవర్ణ నియమం సరిగ్గా దీన్నే నిర్దేశిస్తుంది.' },
        { en: 'When chanting continuous text (saṁhitā-pāṭha), sandhi rules must be applied smoothly across word boundaries — not read word-by-word and then artificially joined.', te: 'నిరంతర పఠనంలో (సంహితా-పాఠం), పద సంధులు సహజంగా కలవాలి — విడివిడిగా చదివి తర్వాత కృత్రిమంగా జోడించకూడదు.' }
      ],
      items: [
        {
          term: 'Padānte makāraḥ bhavati',
          sub: { en: 'Word-final m at a pause', te: 'ఆగే ముందు పద-చివరి మ్' },
          en: {
            en: 'At the true end of a pada — right before a pause or breath-break, not mid-flow — a word-final "m" is pronounced as a clear, closed makāra (म्), not softened into a vague nasal hum the way an anusvāra before a consonant often gets blurred. Example: in "...śaraṇaṁ vraja" chanted straight through, that ṁ leans nasal before v; but if that same word ended a phrase right before a pause, the m should close cleanly, lips shut, not trail off as a hum. Reciters who blur every word-final m the same way lose this distinction.',
            te: 'పదం నిజంగా ముగిసేచోట — ఆగే ముందు, మధ్యలో కాదు — పద-చివరి "మ్" స్పష్టమైన, మూసిన మకారంగా (म्) పలకాలి, హల్లు ముందు అనుస్వారం తరచుగా అస్పష్టమైనట్టు మసకగా కాదు. ఉదాహరణ: "...శరణం వ్రజ" నిరంతరంగా పఠిస్తే, ఆ ం వ ముందు నాసిక్యంగా ఉంటుంది; అదే పదం ఆగే ముందు ముగిస్తే, మ్ పెదవులు మూసుకుని స్పష్టంగా ముగియాలి, హమ్‌గా సాగకూడదు. ప్రతి పద-చివరి మ్‌నూ ఒకేలా అస్పష్టం చేసేవారు ఈ భేదాన్ని కోల్పోతారు.'
          }
        },
        {
          term: 'Anusvāra before ya–ha',
          sub: { en: 'A special case of parasavarṇa', te: 'పరసవర్ణ నియమంలో ఒక ప్రత్యేక సందర్భం' },
          en: {
            en: 'When an anusvāra is followed by one of ya, ra, la, va, śa, ṣa, sa, or ha — letters that have no nasal of their own class — it is pronounced as a closed, lip-shut m (म्) rather than left as a vague nasal hum. Example, Bhagavad Gītā 2.61: "tāni sarvāṇi saṃyamya" — the ṃ in saṃyamya, right before ya, closes as a clear m, giving sam-yamya rather than a nasalized "sāṃyamya."',
            te: 'అనుస్వారం తర్వాత య, ర, ల, వ, శ, ష, స, హ — వీటికి సొంత వర్గపు నాసిక్యం లేనందున — ఆ అనుస్వారాన్ని స్పష్టమైన, మూసిన మ్‌గా పలకాలి, అస్పష్ట నాసిక్య ధ్వనిగా కాదు. ఉదాహరణ, భగవద్గీత 2.61: "తాని సర్వాణి సంయమ్య" — ఇందులో సంయమ్య లోని ం, య ముందు రావడంతో స్పష్టమైన మ్‌గా మూసుకుపోవాలి, సమ్-యమ్య అని పలకాలి, అస్పష్టమైన "సాంయమ్య" అని కాదు.'
          }
        },
        {
          term: 'Visarga before kṣa',
          sub: { en: 'No change — visarga stays as-is', te: 'మార్పు లేదు — విసర్గ యథాతథం' },
          en: {
            en: 'Unlike before ka/kha (jihvāmūlīya) or pa/pha (upadhmānīya), a visarga right before a word beginning with kṣa does not change or sandhi away — it is simply held as a plain visarga. Example, Bhagavad Gītā 2.32: "sukhinaḥ kṣatriyāḥ pārtha" — the ḥ in sukhinaḥ stays a visarga going into kṣatriyāḥ, with no merge and no substitution.',
            te: 'క/ఖ (జిహ్వామూలీయం) లేదా ప/ఫ (ఉపధ్మానీయం) ముందు మాదిరిగా కాకుండా, క్ష-తో మొదలయ్యే పదం ముందు వచ్చిన విసర్గ మారదు, సంధి చెందదు — సాధారణ విసర్గగానే నిలుస్తుంది. ఉదాహరణ, భగవద్గీత 2.32: "సుఖినః క్షత్రియాః పార్థ" — ఇందులో సుఖినః లోని విసర్గ క్షత్రియాః ముందు ఎలాంటి మార్పు లేకుండా అలాగే నిలుస్తుంది.'
          }
        },
        {
          term: 'Visarga at the end of a sentence',
          sub: { en: 'Must be pronounced, not silent — Rules of Chanting in Saṁskṛtam, Swamini Svatmabodhananda Saraswati', te: 'తప్పనిసరిగా పలకాలి, మౌనం కాదు — Rules of Chanting in Saṁskṛtam, స్వామినీ స్వాత్మబోధానంద సరస్వతి' },
          en: {
            en: 'A visarga at the true end of a sentence or verse-quarter (not one that sandhi-merges with what follows) must still be audibly pronounced — it is an aspirate, not a silent mark that only matters in writing. Reciters who trail off before the final ḥ, or drop it silently, are skipping a real sound.',
            te: 'వాక్యం లేదా పాదం నిజంగా ముగిసేచోట వచ్చిన విసర్గ (తర్వాతి పదంతో సంధి చెందనిది) కూడా వినిపించేలా పలకాలి — ఇది కేవలం రాతలో మాత్రమే ఉండే మౌన గుర్తు కాదు, ఒక ఘోష (aspirate) ధ్వని. చివరి ః ముందు స్వరం సన్నగిల్లిపోయేవారు, లేదా దాన్ని మౌనంగా వదిలేసేవారు నిజమైన ధ్వనిని దాటవేస్తున్నారు.'
          }
        },
        {
          term: 'Visarga before śa/ṣa/sa',
          sub: { en: 'Doubles into the following sibilant', te: 'తర్వాతి ఊష్మాక్షరంతో ద్విత్వం అవుతుంది' },
          en: {
            en: 'A visarga right before a word beginning with śa, ṣa, or sa is not dropped or left as-is — it merges into a doubled sibilant (śś, ṣṣ, or ss). Example, Bhagavad Gītā 8.28: "vedeṣu yajñeṣu tapassu caiva" — this is tapaḥ + su, and the printed form itself already shows the visarga becoming a doubled "ss": tapassu, not tapaḥsu.',
            te: 'శ, ష, స — వీటితో మొదలయ్యే పదం ముందు వచ్చిన విసర్గ వదిలేయబడదు, మార్పు లేకుండా కూడా ఉండదు — తర్వాతి ఊష్మాక్షరంతో ద్విత్వంగా (శ్శ, ష్ష, స్స) కలుస్తుంది. ఉదాహరణ, భగవద్గీత 8.28: "వేదేషు యజ్ఞేషు తపస్సు చైవ" — ఇది తపః + సు, ముద్రిత రూపంలోనే విసర్గ ద్విత్వ "స్స్"గా మారడం కనిపిస్తుంది: తపస్సు, తపఃసు కాదు.'
          }
        }
      ],
      rule: {
        sa: 'अनुस्वारस्य ययि परसवर्णः',
        ro: 'anusvārasya yayi parasavarṇaḥ',
        source: 'Pāṇini 8.4.58',
        translation: {
          en: 'An anusvāra (ṁ) followed by a consonant of the five vargas becomes the nasal of that consonant\'s own class.',
          te: 'పంచ వర్గాలలోని హల్లు తర్వాత వచ్చిన అనుస్వారం (ం) ఆ హల్లు వర్గపు నాసిక్యంగా మారుతుంది.'
        }
      },
      examples: [
        { sa: 'उपसङ्गम्य', ro: 'upa+saṁ+gamya → upasaṅgamya (BG 1.2)', note: { en: 'guttural ṅ, because ga is guttural', te: 'కంఠ్య ఙ, ఎందుకంటే గ కంఠ్యం' } },
        { sa: 'सञ्जय', ro: 'saṁ+jaya → sañjaya (BG 1.1)', note: { en: 'palatal ñ, because ja is palatal', te: 'తాలవ్య ఞ, ఎందుకంటే జ తాలవ్యం' } },
        { sa: 'शान्त', ro: 'śāṁ + ta → śānta (traditional example)', note: { en: 'dental n, because ta is dental', te: 'దంత్య న, ఎందుకంటే త దంత్యం' } },
        { sa: 'सम्बन्धिनः', ro: 'saṁ+bandhinaḥ → sambandhinaḥ (BG 1.34)', note: { en: 'labial m, because ba is labial', te: 'ఓష్ఠ్య మ, ఎందుకంటే బ ఓష్ఠ్యం' } }
      ],
      verseExample: {
        ref: 'Bhagavad Gītā 2.47',
        text: 'karmaṇy-evādhikāras te',
        note: {
          en: 'karmaṇi + eva sandhi-joins to karmaṇyevādhikāraste — chant it as one continuous unit, not "karmani ... eva ... adhikaraste" with breaks.',
          te: 'కర్మణి + ఏవ సంధి కలిసి కర్మణ్యేవాధికారస్తే అవుతుంది — దీన్ని ఒకే నిరంతర భాగంగా పలకాలి, "కర్మణి ... ఏవ ... అధికారస్తే" అని విడగొట్టకూడదు.'
        }
      }
    },

    {
      id: 'laghu-guru',
      icon: '⚓',
      title: { en: 'Laghu & Guru — Light and Heavy Syllables', sa: 'लघु-गुरु', te: 'లఘు-గురు — తేలిక, బరువైన అక్షరాలు' },
      body: [
        { en: 'Every syllable in a verse is classified as either laghu (light) or guru (heavy). This isn\'t about loudness — it\'s about duration, and it\'s the actual mechanism that makes a meter (chandas) recognizable when chanted. Get the laghu/guru pattern right and unfamiliar verses in a known meter start to feel predictable; get it wrong and even a memorized verse can sound "off" without anyone being able to say why.', te: 'శ్లోకంలో ప్రతి అక్షరం లఘువు లేదా గురువు అని వర్గీకరించబడుతుంది. ఇది గట్టిగా పలకడం గురించి కాదు — వ్యవధి గురించి — పఠించినప్పుడు ఛందస్సు గుర్తించదగినదిగా చేసే అసలు యంత్రాంగం ఇదే. లఘు-గురు క్రమం సరిగ్గా ఉంటే తెలిసిన ఛందస్సులో కొత్త శ్లోకాలు కూడా ఊహించదగినట్టు అనిపిస్తాయి; తప్పైతే కంఠస్థం చేసిన శ్లోకం కూడా ఎందుకో తేడాగా వినిపిస్తుంది.' }
      ],
      items: [
        { term: 'Laghu', sub: 'Light — 1 mātrā', letters: { en: 'a short vowel (hrasva) NOT followed by a conjunct consonant, anusvāra, or visarga, and not at the very end of a pāda.', te: 'సంయుక్తాక్షరం, అనుస్వారం, విసర్గ తర్వాత రాని, పాదాంతంలో లేని హ్రస్వ స్వరం.' } },
        { term: 'Guru — by nature', sub: 'Heavy — 2 mātrās', letters: { en: 'any long or protracted vowel (dīrgha or pluta) — ā, ī, ū, ṝ, e, ai, o, au — is guru regardless of what follows it.', te: 'ఏ దీర్ఘ లేదా ప్లుత స్వరమైనా (ā, ī, ū, ṝ, e, ai, o, au) — తర్వాత ఏమి వచ్చినా గురువే.' } },
        { term: 'Guru — by position', sub: 'Heavy — 2 mātrās', letters: { en: 'a short vowel becomes guru when followed by a conjunct consonant (saṁyoga), an anusvāra (ṁ), or a visarga (ḥ) — or when it falls at the end of a verse-quarter (pāda), where the last syllable is conventionally treated as guru regardless.', te: 'సంయుక్తాక్షరం, అనుస్వారం, లేదా విసర్గ తర్వాత వస్తే హ్రస్వ స్వరం గురువుగా మారుతుంది — లేదా అది పాదాంతంలో ఉంటే, ఆఖరి అక్షరాన్ని సంప్రదాయికంగా గురువుగానే భావిస్తారు.' } }
      ],
      body2: [
        { en: 'Pronunciation, not just counting: a guru syllable should be audibly held for roughly twice the duration of a laghu one — this is the same mātrā unit from the Duration section above, just applied to full syllables instead of single vowels. Rushing through a "positionally guru" short vowel (e.g. the a in dharmakṣetre, heavy only because of the following conjunct kṣ) is one of the most common ways reciters flatten a meter without realizing it — the vowel itself feels short, so it gets chanted short, even though its position demands the full guru weight.', te: 'ఉచ్చారణలో — కేవలం లెక్కించడమే కాదు: గురు అక్షరాన్ని లఘువు కంటే దాదాపు రెట్టింపు కాలం వినిపించేలా పలకాలి. స్థాన కారణంగా గురువైన హ్రస్వ స్వరాన్ని (ఉదా. తర్వాత సంయుక్తాక్షరం ఉన్నందున) తొందరగా పలకడం — మీటర్‌ను తెలియకుండానే చదును చేసే అత్యంత సాధారణ మార్గాలలో ఒకటి.' }
      ]
    },

    {
      id: 'meter',
      icon: '📏',
      title: { en: 'Preserving Meter — Yati & Compound Integrity', sa: 'छन्दोभङ्गवर्जनम्', te: 'ఛందస్సు రక్షణ — యతి, సమాస సమగ్రత' },
      body: [
        { en: 'A long compound word (samasta-pada) carries one combined meaning. Breaking it mid-word for breath destroys both the meaning (artha-bhaṅga) and the meter (chando-bhaṅga).', te: 'పొడవైన సమాసపదం ఒకే అర్థాన్ని కలిగి ఉంటుంది. ఊపిరి కోసం మధ్యలో ఆపడం అర్థాన్నీ, ఛందస్సునూ రెండింటినీ దెబ్బతీస్తుంది.' },
        { en: 'If you must pause, pause only at a recognized word-boundary (pada-chheda) or a prescribed metrical caesura (yati) — never arbitrarily. If a mid-compound pause is unavoidable, backtrack to the start of that compound before continuing.', te: 'ఆగవలసి వస్తే, గుర్తించిన పద విభజన (పద-ఛేద) వద్ద లేదా నిర్దేశిత యతి వద్ద మాత్రమే ఆగాలి — ఇష్టం వచ్చినట్టు కాదు. మధ్యలో ఆగక తప్పకపోతే, కొనసాగించే ముందు ఆ సమాసం మొదటికి తిరిగి వెళ్ళాలి.' },
        { en: 'A short vowel (hrasva, 1 mātrā) counts as heavy (guru, 2 mātrās) in the meter when followed by a conjunct consonant, an anusvāra, a visarga, or when it ends a verse quarter (pāda) — give it the weight the meter needs, even though it\'s "short" in isolation.', te: 'హ్రస్వ స్వరం తర్వాత సంయుక్తాక్షరం, అనుస్వారం, విసర్గ ఉంటే లేదా అది పాదాంతంలో ఉంటే — ఛందస్సులో అది గురువుగా లెక్కించబడుతుంది.' },
        { en: 'This isn\'t limited to compounds: as a general rule, a word beginning with a conjunct consonant should be chanted joined to the previous word with no pause between them, for the same sāma (evenness) reason — it just happens most visibly with the five specific never-split compounds cited above.', te: 'ఇది సమాసాలకే పరిమితం కాదు — సాధారణ నియమంగా, సంయుక్తాక్షరంతో మొదలయ్యే పదాన్ని ముందు పదంతో కలిపి, మధ్యలో ఆగకుండా పఠించాలి, అదే సామ (సమతూకం) కారణంతో — పైన ఉదహరించిన ఐదు "ఎప్పుడూ విడగొట్టని" సమాసాలలో ఇది అత్యంత స్పష్టంగా కనిపిస్తుంది అంతే.' }
      ],
      verseExample: {
        ref: 'Bhagavad Gītā 18.66',
        text: 'sarva-dharmān parityajya',
        note: {
          en: '"Sarva-dharmān" is one compound (all dharmas) — never split as "sarva ... dharman ... parityajya". Chant the whole compound in one breath-unit.',
          te: '"సర్వధర్మాన్" ఒకే సమాసం (అన్ని ధర్మాలు) — "సర్వ ... ధర్మాన్ ... పరిత్యజ్య" అని విడగొట్టకూడదు. మొత్తం సమాసాన్ని ఒకే శ్వాసలో పలకాలి.'
        }
      }
    },

    {
      id: 'faults-virtues',
      icon: '⚖️',
      title: { en: 'Faults & Virtues of a Chanter', sa: 'पाठकदोषगुणाः', te: 'పాఠకుని దోషాలు, గుణాలు' },
      verse: {
        sa: 'गीती शीघ्री शिरःकम्पी यथा लिखितपाठकः । अनर्थज्ञोऽल्पकण्ठश्च षडेते पाठकाधमाः ॥',
        ro: 'gītī śīghrī śiraḥkampī yathā likhitapāṭhakaḥ | anarthajño\'lpakaṇṭhaśca ṣaḍete pāṭhakādhamāḥ ||',
        source: 'Pāṇinīya Śīkṣā, v.32 — Six Faults'
      },
      items: [
        { term: 'Gītī', en: { en: 'Singing it like a song instead of using the correct tonal svaras.', te: 'సరైన స్వరాలు వాడకుండా పాటలా పాడటం.' } },
        { term: 'Śīghrī', en: { en: 'Reciting too fast.', te: 'మరీ వేగంగా పఠించడం.' } },
        { term: 'Śiraḥkampī', en: { en: 'Unnecessarily shaking or nodding the head.', te: 'అనవసరంగా తల ఊపడం.' } },
        { term: 'Yathā likhitapāṭhakaḥ', en: { en: 'Reading mechanically off paper rather than from memory with real attention.', te: 'నిజమైన శ్రద్ధతో కంఠస్థం నుండి కాకుండా, కాగితం చూసి యాంత్రికంగా చదవడం.' } },
        { term: 'Anarthajñaḥ', en: { en: 'Chanting with no awareness of the meaning.', te: 'అర్థం తెలియకుండా పఠించడం.' } },
        { term: 'Alpakaṇṭhaḥ', en: { en: 'A weak, indistinct, barely-audible voice.', te: 'బలహీనమైన, అస్పష్టమైన, వినపడీ వినపడని స్వరం.' } }
      ],
      verse2: {
        sa: 'माधुर्यमक्षरव्यक्तिः पदच्छेदस्तु सुस्वरः । धैर्यं लयसमर्थं च षडेते पाठका गुणाः ॥',
        ro: 'mādhuryamakṣaravyaktiḥ padacchedastu susvaraḥ | dhairyaṁ layasamarthaṁ ca ṣaḍete pāṭhakā guṇāḥ ||',
        source: 'Pāṇinīya Śīkṣā, v.33 — Six Virtues'
      },
      items2: [
        { term: 'Mādhuryam', en: { en: 'Sweetness of tone.', te: 'స్వర మాధుర్యం.' } },
        { term: 'Akṣaravyaktiḥ', en: { en: 'Crystal-clear articulation of every syllable.', te: 'ప్రతి అక్షరాన్ని స్ఫుటంగా పలకడం.' } },
        { term: 'Padacchedaḥ', en: { en: 'Correct word separation.', te: 'సరైన పద విభజన.' } },
        { term: 'Susvaraḥ', en: { en: 'Accurate pitch and accent.', te: 'ఖచ్చితమైన స్వరం, ఉచ్చారణ.' } },
        { term: 'Dhairyam', en: { en: 'Patience and composure.', te: 'ఓర్పు, స్థిమితం.' } },
        { term: 'Layasamartham', en: { en: 'Command over rhythm and tempo.', te: 'లయ, వేగంపై పట్టు.' } }
      ]
    },

    {
      id: 'common-mistakes',
      icon: '🚫',
      title: { en: 'Common Mistakes — With Real Examples', sa: '', te: 'సాధారణ తప్పులు — నిజమైన ఉదాహరణలతో' },
      body: [
        { en: 'These are errors reciters make routinely, often without realizing it — each with a concrete, verified example from texts this site already hosts.', te: 'ఇవి పఠనకర్తలు రోజూ చేసే తప్పులు, తరచుగా తెలియకుండానే — ప్రతి దానికీ ఈ సైట్‌లో ఇప్పటికే ఉన్న గ్రంథాల నుండి నిర్దిష్ట, ధృవీకరించిన ఉదాహరణ.' }
      ],
      items: [
        {
          term: 'Visarga chanted identically to "ha"',
          en: {
            en: 'Visarga (ः) and the letter ha are different sounds from different mechanisms — visarga is a breath-echo of the preceding vowel (see Kaṇṭha above), not a full consonant. Collapsing them into the same sound is a very common, very audible error. Best learned by ear from a teacher who knows the śāstra, not from text alone.',
            te: 'విసర్గ (ః), హ అక్షరం — వేర్వేరు యంత్రాంగాల నుండి వచ్చే వేర్వేరు ధ్వనులు — విసర్గ ముందున్న స్వరం యొక్క ఊపిరి ప్రతిధ్వని (పైన కంఠం చూడండి), పూర్తి హల్లు కాదు. వీటిని ఒకేలా పలకడం చాలా సాధారణమైన, స్పష్టంగా వినిపించే తప్పు. శాస్త్రం తెలిసిన గురువు నుండి చెవితో నేర్చుకోవడం ఉత్తమం, పాఠం చూసి మాత్రమే కాదు.'
          }
        },
        {
          term: 'Anusvāra flattened to a generic "ma" everywhere',
          en: {
            en: 'The parasavarṇa rule (see Sandhi above) means an anusvāra should change its nasal quality to match the following consonant\'s class — guttural before ka, palatal before ca, and so on. Pronouncing every anusvāra as a plain "m" regardless of context is one of the most widespread habits among reciters.',
            te: 'పరసవర్ణ నియమం (పైన సంధి చూడండి) ప్రకారం అనుస్వారం తర్వాత వచ్చే హల్లు వర్గాన్ని బట్టి తన నాసిక్య గుణాన్ని మార్చుకోవాలి — క ముందు కంఠ్యం, చ ముందు తాలవ్యం, ఇలా. సందర్భంతో సంబంధం లేకుండా ప్రతి అనుస్వారాన్నీ సాధారణ "మ"గా పలకడం పఠనకర్తలలో అత్యంత విస్తృతమైన అలవాటు.'
          }
        },
        {
          term: '"ayi" mispronounced as "ai"',
          sub: 'Mahiṣāsura Mardini Stotram, opening line',
          sutra: 'अयि गिरिनन्दिनि नन्दितमेदिनि',
          en: {
            en: 'ayi (a vocative particle, "O!") and ai (a diphthong) are different vowel sequences — collapsing "ayi giri-nandini" into "ai giri-nandini" changes the opening address of the stotra.',
            te: 'అయి (సంబోధన అవ్యయం, "ఓ!") మరియు ఐ (ద్విస్వరం) — వేర్వేరు స్వర క్రమాలు — "అయి గిరినందిని"ని "ఐ గిరినందిని"గా కుదించడం స్తోత్రం ప్రారంభ సంబోధననే మార్చేస్తుంది.'
          }
        },
        {
          term: '"mayi" mispronounced as "my"',
          sub: 'Bhagavad Gītā 3.30',
          sutra: 'मयि सर्वाणि कर्माणि',
          en: {
            en: '"mayi" (locative, "in Me") collapsed into an English-style "my" sound loses the final short i entirely — a common drift when a reciter\'s native script/phonology doesn\'t distinguish it clearly.',
            te: '"మయి" (సప్తమీ విభక్తి, "నాలో") అనేది ఆంగ్ల-తరహా "మై"గా కుదిస్తే చివరి హ్రస్వ ఇ పూర్తిగా పోతుంది — పఠనకర్త మాతృ లిపి/ధ్వనిశాస్త్రం దీన్ని స్పష్టంగా వేరు చేయనప్పుడు వచ్చే సాధారణ జారుడు.'
          }
        },
        {
          term: '"u" mispronounced as "vu"',
          sub: 'Bhagavad Gītā 15.1',
          sutra: 'ऊर्ध्वमूलमधःशाखम्',
          en: {
            en: 'ūrdhvamūlam starts with a pure vowel ū — not "vūrdhva". Inserting a "v" glide before a word-initial u/ū is a common habit that doesn\'t belong to the actual sound.',
            te: 'ఊర్ధ్వమూలమ్ అనేది స్వచ్ఛమైన ఊ స్వరంతో మొదలవుతుంది — "వూర్ధ్వ" కాదు. పద-ప్రారంభ ఉ/ఊ ముందు "వ" జోడించడం సాధారణ అలవాటు, కానీ అసలు ధ్వనిలో అది లేదు.'
          }
        },
        {
          term: 'Avagraha dropped — the missing "a" that flips meaning',
          sub: 'Lalitā Sahasranāma',
          sutra: 'मूर्तामूर्ता नित्यतृप्ता',
          en: {
            en: 'This is mūrtā + amūrtā (avagraha marks the elided a) — "having form and formless" — not "mūrtā mūrtā" repeated. Dropping the avagraha doesn\'t just blur the sound, it deletes an entire word (amūrtā) and its opposite meaning.',
            te: 'ఇది మూర్తా + అమూర్తా (అవగ్రహం లోపించిన అ ని సూచిస్తుంది) — "రూపం గలది, రూపం లేనిది" — "మూర్తా మూర్తా" పునరావృతం కాదు. అవగ్రహాన్ని వదిలేస్తే ధ్వని మసకబారడమే కాదు, ఒక పూర్తి పదాన్నే (అమూర్తా) దాని వ్యతిరేక అర్థంతో సహా తొలగించేస్తుంది.'
          }
        },
        {
          term: 'Avagraha dropped — VSN, verified against our own data',
          sub: 'Śrī Viṣṇu Sahasranāma, śloka 6, pada 2 (names #48–49)',
          sutra: 'पद्मनाभोऽमरप्रभुः',
          en: {
            en: 'This is padmanābhaḥ + amaraprabhuḥ ("lord of the immortals") sandhi-joined. Dropping the avagraha and chanting "padmanābho marprabhuḥ" loses the negating a- of amara ("immortal") — the meaning is not a minor slur, it actually changes.',
            te: 'ఇది పద్మనాభః + అమరప్రభుః ("అమరుల ప్రభువు") సంధి కలయిక. అవగ్రహాన్ని వదిలేసి "పద్మనాభో మరప్రభుః" అని పలికితే అమర ("అమరుడు") లోని నిషేధార్థక అ- పోతుంది — ఇది చిన్న అస్పష్టత కాదు, నిజంగా అర్థమే మారుతుంది.'
          }
        },
        {
          term: 'Splitting a compound across padas for breath',
          sub: 'Verified against our own Gītā data — every pada below is stored ending mid-compound, continuing into the next pada with no legitimate pause',
          letters: 'BG 6.9 (suhṛnmitrāryudāsīna-) · 6.23 (taṃ vidyādduḥkhasaṃyoga-) · 17.8 (āyuḥsattvabalārogya-) · 17.9 (kaṭvamlalavaṇātyuṣṇa-) · 17.14 (devadvijaguruprājña-)',
          en: {
            en: 'Each of these padas ends mid-word by design — the compound only completes in the next pada. Pausing for breath at the pada-break here is exactly the arbitrary mid-compound split the Preserving Meter section above warns against — these five are concrete, checkable instances of it in the Gītā itself.',
            te: 'ఈ పాదాలు ప్రతి ఒక్కటీ ఉద్దేశపూర్వకంగా పదం మధ్యలో ముగుస్తాయి — సమాసం తర్వాతి పాదంలోనే పూర్తవుతుంది. ఇక్కడ పాద-విరామం వద్ద ఊపిరి కోసం ఆగడం అంటే పైన ఛందస్సు రక్షణ విభాగం హెచ్చరించిన ఏకపక్ష మధ్య-సమాస విభజనే — ఇవి గీతలోనే నిర్దిష్టంగా తనిఖీ చేయగల ఐదు ఉదాహరణలు.'
          }
        },
        {
          term: 'Phakāra (ఫ) mispronounced as English "F"',
          en: {
            en: 'ఫ (pha) is an aspirated labial stop (mahāprāṇa pa) — lips fully close, then release with a burst of breath. English "F" is a fricative made with the teeth on the lower lip, a completely different mechanism, with no full lip-closure at all. Reciters who learned Sanskrit through English transliteration often default to the familiar F sound. The correct kṣa and jña conjuncts also have traditional pronunciations best picked up by ear from a teacher, not inferred from spelling.',
            te: 'ఫ (అనగా మహాప్రాణ ప) అనేది పెదవులు పూర్తిగా మూసుకుని, తర్వాత ఊపిరి తాకిడితో విడుదలయ్యే ధ్వని. ఆంగ్ల "F" అనేది పళ్ళు కింది పెదవిపై తాకి వచ్చే ఘర్షణ ధ్వని — పూర్తిగా వేరే యంత్రాంగం, పెదవులు అసలు మూసుకోవు. ఆంగ్ల లిప్యంతరీకరణ ద్వారా సంస్కృతం నేర్చుకున్నవారు తరచుగా పరిచయమైన F ధ్వనికే మొగ్గు చూపుతారు. క్ష, జ్ఞ సంయుక్తాక్షరాల సరైన ఉచ్చారణ కూడా సంప్రదాయబద్ధంగా గురువు నుండి చెవితో నేర్చుకోవాలి, స్పెల్లింగు నుండి ఊహించకూడదు.'
          }
        },
        {
          term: 'ṛ (vowel) confused with ra (consonant), ḷ (vowel) with la (consonant)',
          sub: { en: 'Rules of Chanting in Saṁskṛtam, Swamini Svatmabodhananda Saraswati', te: 'Rules of Chanting in Saṁskṛtam, స్వామినీ స్వాత్మబోధానంద సరస్వతి' },
          en: {
            en: 'ṛ is a short vowel (as in kṛṣṇa) pronounced with the tongue curled at the mūrdhā, distinct from the consonant ra even though they look and sound superficially similar to an untrained ear. The same confusion happens with the rare vowel ḷ versus the consonant la. Treating either vowel as its look-alike consonant is a real sthāna error, not a harmless simplification.',
            te: 'ఋ అనేది హ్రస్వ స్వరం (ఉదా. కృష్ణ లో), నాలుక మూర్ధా వద్ద వంపు తిప్పి పలికేది — ర హల్లుకు వేరు, రెండూ శిక్షణ లేని చెవికి పైపైన ఒకేలా అనిపించినా. అరుదైన స్వరం ఌ, హల్లు ల మధ్య కూడా ఇదే గందరగోళం వస్తుంది. ఏ స్వరాన్నైనా దాన్ని పోలిన హల్లుగా పలకడం నిజమైన స్థాన తప్పే, హానిలేని సరళీకరణ కాదు.'
          }
        },
        {
          term: 'Reading a conjunct without knowing its components',
          sub: { en: 'e.g. padma, nissaigunya', te: 'ఉదా. పద్మ, నిస్సైగుణ్య' },
          en: {
            en: 'A conjunct consonant (saṁyuktākṣara) is written by stacking its component letters, but must be pronounced as the sequence they represent — padma is written as a single stacked glyph but chanted as pa+d+ma; nissaigunya unpacks as nis+t+raigunya. Guessing the pronunciation from the visual shape of an unfamiliar conjunct, instead of unpacking it into its actual letters first, is a common source of error — see "Unpack the sandhi first" in Practice Method above for the same discipline applied to sandhi.',
            te: 'సంయుక్తాక్షరాన్ని దాని ఘటక అక్షరాలను పేర్చి రాస్తారు, కానీ అవి సూచించే అక్షర క్రమంగానే పలకాలి — పద్మ అనేది ఒకే పేర్చిన గుర్తుగా రాసినా ప+ద్+మ గా పలకాలి; నిస్సైగుణ్య అనేది నిస్+త్+రైగుణ్యగా విడిపోతుంది. కొత్త సంయుక్తాక్షరాన్ని విడగొట్టకుండా, దాని ఆకారాన్ని చూసి ఉచ్చారణను ఊహించడం సాధారణ తప్పుకు మూలం — ఇదే క్రమశిక్షణను సంధికి వర్తింపజేయడం కోసం పైన అభ్యాస పద్ధతిలో "ముందు సంధిని విడగొట్టండి" చూడండి.'
          }
        },
        {
          term: 'Guru akṣara rushed instead of held',
          tentative: true,
          en: {
            en: 'A positionally-guru syllable (heavy because of what follows it, not its own vowel length — see Laghu & Guru above) should carry its extra weight on the syllable itself, held slightly longer, rather than as a pause inserted at the conjunct that follows. Getting this technique right takes ear-training more than rule-reading.',
            te: 'స్థాన కారణంగా గురువైన అక్షరం (దాని తర్వాత వచ్చేదాని వలన బరువైనది, స్వంత స్వర దైర్ఘ్యం వలన కాదు — పైన లఘు-గురు చూడండి) దాని అదనపు బరువును ఆ అక్షరం మీదే కొంచెం ఎక్కువసేపు నిలిపి మోయాలి, తర్వాత వచ్చే సంయుక్తాక్షరం వద్ద ఆగడం ద్వారా కాదు. ఈ నైపుణ్యం నియమాలు చదవడం కంటే చెవి శిక్షణ ద్వారానే వస్తుంది.'
          }
        }
      ]
    },

    {
      id: 'voice-care',
      icon: '🥛',
      title: { en: 'Food & Voice-Care — Before You Chant', sa: '', te: 'ఆహారం మరియు స్వరరక్షణ — పఠనానికి ముందు' },
      body: [
        { en: 'Āyurveda and dharmaśāstra both treat voice quality as directly caused by what and when you eat — not a vague association, but a stated cause-and-effect relationship. This section collects the specific, sourced rules.', te: 'ఆయుర్వేదం మరియు ధర్మశాస్త్రం రెండూ స్వరం యొక్క నాణ్యత ఆహారంపై నేరుగా ఆధారపడి ఉంటుందని చెప్తాయి — ఇది అస్పష్టమైన సంబంధం కాదు, స్పష్టమైన కారణ-కార్య సంబంధం. ఈ విభాగం నిర్దిష్ట, ప్రామాణిక నియమాలను సేకరిస్తుంది.' }
      ],
      items: [
        {
          term: { en: 'Snigdha-uṣṇa-laghu before reciting', te: 'పఠనానికి ముందు స్నిగ్ధ-ఉష్ణ-లఘు ఆహారం' },
          sub: 'Aṣṭāṅga Hṛdayam, Sūtrasthāna 10.15',
          sutra: 'स्वरवर्णप्रसादाय स्निग्धोष्णं लघु भोजनम् । गानात् पूर्वं हितं प्रोक्तं वाग्विशुद्धिकरं परम् ॥',
          en: {
            en: 'For clarity of svara and varṇa, unctuous (snigdha), warm (uṣṇa), and light (laghu) food is recommended before recitation or singing — this most greatly purifies the voice. Practically: warm milk with ghee, or warm rice with ghee, before a reading session.',
            te: 'స్వర-వర్ణ ప్రసాదానికి — స్నిగ్ధమైన (నెయ్యి కలిగిన), ఉష్ణమైన, లఘువైన ఆహారం పాఠం/గానం ముందు తీసుకోవాలి. ఇది వాగ్విశుద్ధిని పరమంగా కలిగిస్తుంది. ఆచరణలో: నెయ్యి కలిపిన వెచ్చని పాలు, లేదా నెయ్యితో వెచ్చని అన్నం.'
          }
        },
        {
          term: { en: 'Rūkṣa (dry/rough) food destroys the voice', te: 'రూక్ష (పొడి) ఆహారం స్వరాన్ని నాశనం చేస్తుంది' },
          sub: 'Aṣṭāṅga Hṛdayam',
          sutra: 'रूक्षान्नसेवनात् पश्चात् स्वरनाशो भविष्यति ।',
          en: {
            en: 'After eating dry, rough food, speaking loudly, reciting, or singing will destroy the voice — stated as a certainty (future tense), not a possibility. Directly relevant to anyone speaking on radio, teaching, or chanting for a living.',
            te: 'రూక్షమైన ఆహారం తిన్న తర్వాత అతిగా మాట్లాడడం, పఠించడం, గానం చేయడం — స్వరనాశనానికి దారితీస్తుంది. ఇది భవిష్యత్ కాలంలో చెప్పబడింది — అంటే ఇది అనివార్యం. రేడియో ప్రవచనకారులకు, అధ్యాపకులకు, గాయకులకు ఇది నేరుగా వర్తిస్తుంది.'
          }
        },
        {
          term: { en: 'Dry and very cold food', te: 'పొడి, అతి శీతల ఆహారం' },
          sub: 'Caraka Saṃhitā',
          sutra: 'स्वरभेदः कासश्च श्वासो दौर्बल्यमेव च । रूक्षाण्यतिशीतानि भोजनात् उपजायते ॥',
          en: {
            en: 'Voice-breaking, cough, breathlessness, and weakness arise from dry and excessively cold food — all four listed as direct obstacles to reciting long compounds without running out of breath.',
            te: 'స్వరభేదం (గొంతు పగలడం), దగ్గు, శ్వాస కష్టం, బలహీనత — ఇవి రూక్షమైన, అతి శీతలమైన ఆహారం వలన కలుగుతాయి. ఇవి నాలుగూ పొడవైన సమాసాలను ఊపిరి అందకుండా పఠించడానికి నేరుగా అడ్డంకులు.'
          }
        },
        {
          term: { en: 'Not on an undigested stomach', te: 'అజీర్ణంలో వద్దు' },
          sub: 'Haṭhayoga Pradīpikā 1.57–58',
          sutra: 'मिताहारः स्थिरश्चित्तः स्वरशुद्धिकरः सदा । अजीर्णे भोजनं त्याज्यं पठनं च विवर्जयेत् ॥',
          en: {
            en: 'A moderate diet keeps the mind steady and always purifies the voice. Both eating and reciting should be avoided while the previous meal is still undigested (ajīrṇa).',
            te: 'మితాహారం — స్థిరమైన చిత్తం — సదా స్వరశుద్ధి — ఇవి ఒకదానితో ఒకటి ముడిపడి ఉంటాయి. అజీర్ణంలో భోజనం మానాలి, పఠనమూ మానాలి.'
          }
        },
        {
          term: { en: 'Mitāhāra — how much is "moderate"', te: 'మితాహారం — ఎంత తినాలి' },
          sub: 'Haṭhayoga Pradīpikā 1.59',
          sutra: 'अष्टांशोनं हितं भुक्तं योगिनो मितमुच्यते ।',
          en: {
            en: 'For a practitioner, "moderate" means filling five of the stomach\'s eight parts with food — leaving room for water and air. A full stomach presses on the diaphragm and directly weakens breath support for chanting.',
            te: 'యోగికి మితాహారం అంటే — కడుపులో ఎనిమిది వంతులలో అయిదు మాత్రమే ఆహారంతో నింపడం — నీళ్ళకు, గాలికి చోటు వదలడం. నిండైన కడుపు డయాఫ్రమ్‌ను నొక్కి, పఠనానికి ఊపిరి బలాన్ని బలహీనపరుస్తుంది.'
          }
        },
        {
          term: { en: 'No heavy meal before study', te: 'పఠనానికి ముందు బరువైన భోజనం వద్దు' },
          sub: 'Manusmṛti 4.120',
          sutra: 'न अश्नीयात् भोजनं रात्रौ वेदाभ्यासात् पूर्वतः । दिवा स्वाध्यायशीलस्य लघ्वन्नं हितमुच्यते ॥',
          en: {
            en: 'One should not eat [a heavy] meal at night before Vedic study; for one devoted to daily recitation, light food during the day is recommended.',
            te: 'వేదాభ్యాసానికి ముందు రాత్రి భోజనం చేయరాదు. స్వాధ్యాయ శీలుడికి పగలు లఘు భోజనం హితకరం.'
          }
        },
        {
          term: { en: 'Not right after eating, not with wet feet', te: 'తిన్న వెంటనే వద్దు, తడి పాదాలతో వద్దు' },
          sub: 'Manusmṛti 4.113',
          sutra: 'न उच्चैः पठेत् भुक्त्वान्नम् न आर्द्रपादो जपेत् क्वचित् । शुचिः शुद्धान्नभोजी च शुद्धोच्चारणमाप्नुयात् ॥',
          en: {
            en: 'Do not recite loudly right after eating; never chant with wet feet. One who is clean and eats pure food attains pure pronunciation — stated as direct cause and effect, not a loose association.',
            te: 'అన్నం తిన్న వెంటనే పెద్దగా పఠించరాదు. తడి పాదాలతో జపం చేయకూడదు. శుచిగా, శుద్ధాన్నం తిన్నవాడే శుద్ధోచ్చారణ పొందుతాడు — ఇది స్పష్టమైన కారణ-కార్య సంబంధంగా చెప్పబడింది.'
          }
        }
      ]
    },

    {
      id: 'etiquette',
      icon: '🙏',
      title: { en: 'When to Chant — Etiquette', sa: '', te: 'ఎప్పుడు జపించాలి — ఆచార నియమాలు' },
      draft: true,
      body: [
        { en: 'The food/timing rules above are sourced (Manusmṛti, Haṭhayoga Pradīpikā, Āyurveda). The points below are still general convention without a specific citation — please review and correct.', te: 'పైన ఉన్న ఆహార/సమయ నియమాలు ప్రామాణిక గ్రంథాల నుండి తీసుకున్నవి. కింద ఉన్నవి ఇంకా సాధారణ ఆచారం మాత్రమే — దయచేసి సమీక్షించండి.' }
      ],
      items: [
        { term: { en: 'Time of day', te: 'రోజులో సమయం' }, en: { en: 'Brāhma-muhūrta (roughly 90 min before sunrise), or morning/evening sandhyā, are traditionally preferred — the mind is considered quieter and more receptive.', te: 'బ్రాహ్మ ముహూర్తం (సూర్యోదయానికి సుమారు 90 నిమిషాల ముందు), లేదా ఉదయం/సాయంత్రం సంధ్య — సాంప్రదాయికంగా ఇష్టపడేవి — మనసు నిశ్శబ్దంగా, స్వీకరించడానికి సిద్ధంగా ఉంటుందని భావన.' } },
        { term: { en: 'State of mind', te: 'మనఃస్థితి' }, en: { en: 'Chant with attention on the meaning, not by rote — see anarthajñaḥ above, one of the six faults.', te: 'యాంత్రికంగా కాకుండా అర్థంపై శ్రద్ధతో పఠించాలి — పైన అనర్థజ్ఞః దోషం చూడండి.' } },
        { term: { en: 'Restricted mantras', te: 'నియంత్రిత మంత్రాలు' }, en: { en: 'Certain Vedic mantras traditionally require initiation (upanayana/dīkṣā) from a qualified teacher — this varies by tradition and text; when in doubt, ask a knowledgeable elder or guru rather than assuming.', te: 'కొన్ని వేద మంత్రాలకు అర్హత గల గురువు నుండి ఉపనయనం/దీక్ష సాంప్రదాయికంగా అవసరం — ఇది సంప్రదాయాన్ని బట్టి మారుతుంది; సందేహం ఉంటే తెలిసినవారిని లేదా గురువును అడగాలి, ఊహించకూడదు.' } },
        { term: { en: 'Consistency over intensity', te: 'తీవ్రత కంటే స్థిరత్వం' }, en: { en: 'A short, steady daily practice (nitya-pāṭha) is traditionally valued over occasional long sessions.', te: 'అప్పుడప్పుడు పొడవైన సాధన కంటే, చిన్నదైనా స్థిరమైన నిత్య పాఠం సాంప్రదాయికంగా విలువైనది.' } },
        {
          term: { en: 'Posture (Gambhīratā)', te: 'ఆసనం (గాంభీర్యం)' },
          sub: { en: 'Rules of Chanting in Saṁskṛtam, Swamini Svatmabodhananda Saraswati', te: 'Rules of Chanting in Saṁskṛtam, స్వామినీ స్వాత్మబోధానంద సరస్వతి' },
          en: {
            en: 'Sit with head, neck, and back in one straight line, without unnecessary movement or fidgeting (ceṣṭā). This directly complements the śiraḥkampī fault above (unnecessary head-shaking) — steady posture is the positive practice, not just the absence of that fault.',
            te: 'తల, మెడ, వెన్ను ఒకే సరళరేఖలో ఉండేలా కూర్చోవాలి, అనవసర కదలికలు (చేష్ట) లేకుండా. ఇది పైన ఉన్న శిరఃకమ్పీ దోషానికి (అనవసరంగా తల ఊపడం) సరిగ్గా పూరకం — స్థిరమైన ఆసనం అనేది ఆ దోషం లేకపోవడమే కాదు, దానికి తోడైన సానుకూల అభ్యాసం.'
          }
        },
        {
          term: { en: 'Volume', te: 'స్వర పరిమాణం' },
          sub: { en: 'Rules of Chanting in Saṁskṛtam, Swamini Svatmabodhananda Saraswati', te: 'Rules of Chanting in Saṁskṛtam, స్వామినీ స్వాత్మబోధానంద సరస్వతి' },
          en: {
            en: 'Loud when chanting in a group, medium volume while practicing alone, and a soft murmur (upāṁśu) when chanting privately — three distinct, appropriate volumes for three different settings, not one fixed loudness for every occasion.',
            te: 'సమూహంలో పఠించేటప్పుడు గట్టిగా, ఒంటరిగా సాధన చేసేటప్పుడు మధ్యస్థంగా, ప్రైవేటుగా జపించేటప్పుడు మెల్లని గుసగుస (ఉపాంశు)గా — మూడు వేర్వేరు సందర్భాలకు మూడు తగిన స్వర పరిమాణాలు, అన్ని సందర్భాలకూ ఒకే స్థిరమైన గట్టితనం కాదు.'
          }
        }
      ]
    },

    {
      id: 'practice-method',
      icon: '🎯',
      title: { en: 'Practice Method — Step by Step', sa: '', te: 'అభ్యాస పద్ధతి — దశలవారీగా' },
      body: [
        { en: 'Written for anyone drilling verses for real accuracy — including competitive Gītā reciters (e.g. Avadhāna/gold-medal aspirants) — but every step here applies equally to VSN or any other text. The rules above are the theory; this is the order to apply them in.', te: 'ఖచ్చితత్వం కోసం శ్లోకాలు సాధన చేసే ప్రతి ఒక్కరికీ — పోటీ గీతా పఠన/అవధాన, స్వర్ణ పతక ఆకాంక్షులతో సహా — రాయబడింది; కానీ ఇక్కడి ప్రతి దశ VSN కి లేదా మరే ఇతర గ్రంథానికైనా సమానంగా వర్తిస్తుంది. పైన ఉన్నవి సిద్ధాంతం; ఇది వాటిని అమలు చేసే క్రమం.' }
      ],
      items: [
        {
          term: { en: '1. Map before speed', te: '1. వేగానికి ముందు పటం' },
          en: {
            en: 'Before attempting full speed, identify the sthāna and prayatna for every letter in the verse — especially any mahāprāṇa, mūrdhanya, or the śa/ṣa/sa you\'re prone to blur. Speed hides errors from your own ear; slow, deliberate articulation exposes them.',
            te: 'పూర్తి వేగం ప్రయత్నించే ముందు, శ్లోకంలోని ప్రతి అక్షరం యొక్క స్థానం, ప్రయత్నం గుర్తించండి — ముఖ్యంగా మహాప్రాణాలు, మూర్ధన్యాలు, మీరు తారుమారు చేసే శ, ష, స. వేగం మీ స్వంత చెవి నుండి తప్పులను దాచేస్తుంది; నెమ్మదిగా, జాగ్రత్తగా పలకడం వాటిని బయటపెడుతుంది.'
          }
        },
        {
          term: { en: '2. Unpack the sandhi first', te: '2. ముందు సంధిని విడగొట్టండి' },
          en: {
            en: 'Split each pada into its individual words before you try to chant it joined. Know what "karmaṇyevādhikāraste" actually is — karmaṇi + eva + adhikāraḥ + te — before you chant it as one flowing unit. Chanting a sandhi you don\'t understand is memorizing a sound, not a sentence.',
            te: 'కలిపి పఠించే ముందు ప్రతి పాదాన్ని విడివిడి పదాలుగా విడగొట్టండి. "కర్మణ్యేవాధికారస్తే" అంటే నిజంగా ఏమిటో తెలుసుకోండి — కర్మణి + ఏవ + అధికారః + తే — తర్వాతే దాన్ని ఒకే ప్రవాహంగా పఠించండి. అర్థం కాని సంధిని పఠించడం అంటే ధ్వనిని కంఠస్థం చేయడమే, వాక్యాన్ని కాదు.'
          }
        },
        {
          term: { en: '3. Count mātrā out loud, slow first', te: '3. మాత్రలను గట్టిగా లెక్కించండి, ముందు నెమ్మదిగా' },
          en: {
            en: 'Practice the syllable-timing (hrasva/dīrgha/pluta) at half speed before attempting performance speed. If you can\'t keep the timing slow, you can\'t keep it fast — you\'ll just be fast and wrong.',
            te: 'ప్రదర్శన వేగం ప్రయత్నించే ముందు అక్షర కాల ప్రమాణాన్ని (హ్రస్వ/దీర్ఘ/ప్లుత) సగం వేగంతో సాధన చేయండి. నెమ్మదిగా కాలమానం పాటించలేకపోతే, వేగంగానూ పాటించలేరు — వేగంగా తప్పుగా మాత్రమే ఉంటారు.'
          }
        },
        {
          term: { en: '4. Record yourself', te: '4. మిమ్మల్ని రికార్డ్ చేసుకోండి' },
          en: {
            en: 'Your tongue often can\'t feel its own mistakes, but your ear can catch them on playback — especially mahāprāṇa softening into alpaprāṇa, and sthāna drift on retroflex letters. Compare against a known-correct reciter for the same verse.',
            te: 'మీ నాలుకకు తన స్వంత తప్పులు తరచుగా తెలియవు, కానీ రికార్డింగ్ వినేటప్పుడు మీ చెవి వాటిని పట్టుకుంటుంది — ముఖ్యంగా మహాప్రాణం అల్పప్రాణంగా మారడం, మూర్ధన్యాక్షరాలలో స్థాన తప్పిదం. అదే శ్లోకాన్ని సరిగ్గా పఠించే వ్యక్తితో పోల్చి చూడండి.'
          }
        },
        {
          term: { en: '5. Respect the yati', te: '5. యతిని గౌరవించండి' },
          en: {
            en: 'Practice pauses only where the meter or word-boundary allows one (see Preserving Meter above) — never invent a breath-pause mid-compound out of convenience. If you must stop, mark that spot and drill starting from the compound\'s beginning, not from where you stopped.',
            te: 'ఛందస్సు లేదా పద-విభజన అనుమతించిన చోటనే ఆగడం సాధన చేయండి — సౌకర్యం కోసం సమాసం మధ్యలో ఆగడం సృష్టించకండి. ఆగవలసి వస్తే, ఆ స్థానాన్ని గుర్తుంచుకుని, సమాసం మొదటి నుండి సాధన చేయండి, ఆగినచోట నుండి కాదు.'
          }
        },
        {
          term: { en: '6. Get svara-checked for Vedic-adjacent material', te: '6. వేదసంబంధ గ్రంథాలకు స్వరం తనిఖీ చేయించుకోండి' },
          en: {
            en: 'For VSN or any text with pitch accents, self-teaching accent placement from text alone is unreliable — the "indraśatruḥ" example above shows how a misplaced accent inverts meaning. Get a teacher or experienced reciter to check your svara, at least for the verses you\'ll be judged on.',
            te: 'VSN లేదా స్వరాలున్న ఏ గ్రంథానికైనా, పాఠం చూసి మాత్రమే స్వరాన్ని స్వయంగా నేర్చుకోవడం నమ్మదగినది కాదు — పైన "ఇంద్రశత్రుః" ఉదాహరణ తప్పు స్వరం అర్థాన్ని ఎలా తారుమారు చేస్తుందో చూపిస్తుంది. కనీసం మీరు అంచనా వేయబడే శ్లోకాలకైనా గురువు లేదా అనుభవజ్ఞుడైన పఠనకర్త చేత మీ స్వరాన్ని తనిఖీ చేయించుకోండి.'
          }
        },
        {
          term: { en: '7. Mind the food/timing rules', te: '7. ఆహారం/సమయ నియమాలు గమనించండి' },
          en: {
            en: 'Before a practice or performance session, follow the voice-care guidance above (snigdha-uṣṇa-laghu food, not on an undigested stomach) — this is a physical precondition for your voice holding up through a long recitation, not superstition.',
            te: 'సాధన లేదా ప్రదర్శనకు ముందు, పైన చెప్పిన స్వరరక్షణ మార్గదర్శకాన్ని పాటించండి (స్నిగ్ధ-ఉష్ణ-లఘు ఆహారం, అజీర్ణంలో కాదు) — ఇది మూఢనమ్మకం కాదు, పొడవైన పఠనలో మీ స్వరం నిలబడటానికి భౌతిక అవసరం.'
          }
        },
        {
          term: { en: '8. Consistency beats cramming', te: '8. స్థిరత్వం, ఒత్తిడితో నింపడం కంటే మేలు' },
          en: {
            en: 'A short daily drill session compounds; a single long cram session before a competition does not fix accumulated errors — it just performs them faster. Track which specific letters/verses you personally get wrong and drill those, rather than re-practicing what you already have right.',
            te: 'రోజూ చిన్న సాధన సెషన్ కూడబెడుతుంది; పోటీకి ముందు ఒకే పొడవైన సాధన పోగుపడిన తప్పులను సరిదిద్దదు — వాటిని వేగంగా చేస్తుంది అంతే. మీరు వ్యక్తిగతంగా తప్పుగా చేసే అక్షరాలు/శ్లోకాలను గుర్తించి వాటినే సాధన చేయండి, ఇప్పటికే సరిగ్గా ఉన్నవాటిని మళ్ళీ మళ్ళీ కాదు.'
          }
        },
        {
          term: { en: '9. Use Avadhānam mode here to drill recall', te: '9. గుర్తుంచుకోవడం సాధనకు అవధానం మోడ్ వాడండి' },
          en: {
            en: 'This site\'s Avadhānam practice mode tests verse recall from a pada, verse number, or speaker cue — pair it with the pronunciation drilling above: recall is not the same skill as correct articulation, and a gold-medal-level reciter needs both.',
            te: 'ఈ సైట్ యొక్క అవధానం సాధన విధానం ఒక పాదం, శ్లోక సంఖ్య, లేదా వక్త సూచన నుండి శ్లోకాన్ని గుర్తుతెచ్చుకోవడం పరీక్షిస్తుంది — దీన్ని పైన చెప్పిన ఉచ్చారణ సాధనతో జతచేయండి: గుర్తుతెచ్చుకోవడం, సరైన ఉచ్చారణ — ఇవి వేర్వేరు నైపుణ్యాలు, స్వర్ణ పతక స్థాయి పఠనకర్తకు రెండూ కావాలి.'
          }
        }
      ]
    },

    {
      id: 'guna-ahara-philosophy',
      icon: '🪔',
      title: { en: 'The Deeper Philosophy — Guṇa & Āhāra', sa: '', te: 'లోతైన తత్త్వం — గుణం, ఆహారం' },
      body: [
        { en: 'Everything above is technique. This closing section is why the tradition considers that technique sacred — the chain from what you eat, to the quality of your mind, to the fitness of your speech to carry meaning at all.', te: 'పైనున్నదంతా సాంకేతికం. ఈ చివరి విభాగం — ఆ సాంకేతికతను సంప్రదాయం ఎందుకు పవిత్రంగా చూస్తుందో చెబుతుంది — మీరు తినేది, మనసు నాణ్యత, అర్థాన్ని మోసుకెళ్ళగల వాక్కు సామర్థ్యం — ఈ గొలుసు.' }
      ],
      items: [
        {
          term: 'Akṣaraṁ brahma paramam',
          sub: 'Bhagavad Gītā 8.3',
          sutra: 'अक्षरं ब्रह्म परमम्',
          en: {
            en: 'The Akṣara [imperishable syllable] is the Supreme Brahman itself. The word for "letter" (akṣara) and the word for "imperishable" are the same word — not a coincidence, in this tradition\'s view. Every letter chanted purely is treated as a form of that same imperishability.',
            te: 'అక్షరమే పరమ బ్రహ్మ. "అక్షరం" అనే పదానికి "నశించనిది" అనే అర్థం కూడా ఉంది — ఇది యాదృచ్ఛికం కాదని ఈ సంప్రదాయం భావిస్తుంది. శుద్ధంగా పలికిన ప్రతి అక్షరం ఆ నాశరహిత తత్త్వానికి ఒక రూపంగా చూడబడుతుంది.'
          }
        },
        {
          term: 'Om ityekākṣaraṁ brahma',
          sub: 'Bhagavad Gītā 8.13',
          sutra: 'ओमित्येकाक्षरं ब्रह्म व्याहरन् मामनुस्मरन् । यः प्रयाति त्यजन् देहं स याति परमां गतिम् ॥',
          en: {
            en: 'One who departs the body while uttering the one-syllable Om — Brahman — and remembering Me, attains the supreme goal. If a single syllable, correctly uttered, carries this much weight, the case for pronunciation discipline makes itself.',
            te: 'ఓం అనే ఏకాక్షర బ్రహ్మను ఉచ్చరిస్తూ, నన్ను స్మరిస్తూ శరీరాన్ని విడిచేవాడు పరమ గతిని పొందుతాడు. ఒక్క అక్షరం — సరిగ్గా పలికితే — ఇంత బరువు కలిగి ఉంటే, ఉచ్చారణ శిక్షణ యొక్క ఆవశ్యకత తనకు తానే స్పష్టమవుతుంది.'
          }
        },
        {
          term: 'Annamayaṁ hi manaḥ',
          sub: 'Chāndogya Upaniṣad 6.7.6',
          sutra: 'अन्नमयं हि सोम्य मनः । आपोमयः प्राणः । तेजोमयी वाक् ॥',
          en: {
            en: 'Mind is made of food; breath is made of water; speech is made of fire (tejas). The Upaniṣad states, not suggests, that speech quality traces to what you eat via mind and breath — the same causal chain the Voice-Care section above draws its Āyurvedic rules from.',
            te: 'ఓ సోమ్యా! మనస్సు అన్నమయం — ఆహారంతో నిర్మించబడినది. ప్రాణం ఆపోమయం — జలంతో నిర్మించబడినది. వాక్కు తేజోమయి — అగ్నితత్త్వంతో నిర్మించబడినది. ఇది సూచన కాదు, ప్రకటన — వాక్కు నాణ్యత మీరు తినేదాని నుండి మనస్సు, ప్రాణం ద్వారా వస్తుందని ఉపనిషత్ చెబుతుంది.'
          }
        },
        {
          term: 'Āhāraśuddhau sattvaśuddhiḥ',
          sub: 'Chāndogya Upaniṣad 7.26.2',
          sutra: 'आहारशुद्धौ सत्त्वशुद्धिः । सत्त्वशुद्धौ ध्रुवा स्मृतिः । स्मृतिलाभे सर्वग्रन्थीनां विप्रमोक्षः ॥',
          en: {
            en: 'From purity of food, purity of mind (sattva); from purity of mind, steady memory (smṛti); from attaining memory, freedom from all the knots [of the heart]. For a reciter, the middle term matters most directly: steady memory is exactly what verse-recall depends on.',
            te: 'ఆహారశుద్ధి వలన సత్త్వశుద్ధి కలుగుతుంది. సత్త్వశుద్ధి వలన స్మృతి స్థిరపడుతుంది. స్మృతి లభించినప్పుడు అన్ని హృదయ గ్రంథులూ విముక్తమవుతాయి. పఠనకర్తకు మధ్య పదమే అత్యంత ముఖ్యం: శ్లోక జ్ఞాపకశక్తి స్థిరమైన స్మృతిపైనే ఆధారపడి ఉంటుంది.'
          }
        },
        {
          term: 'Sāttvika āhāra',
          sub: 'Bhagavad Gītā 17.8',
          sutra: 'आयुःसत्त्वबलारोग्यसुखप्रीतिविवर्धनाः । रस्याः स्निग्धाः स्थिरा हृद्याः आहाराः सात्त्विकप्रियाः ॥',
          en: {
            en: 'Foods that increase life, vitality, strength, health, joy, and satisfaction — juicy, unctuous (snigdha), substantial, and naturally agreeable — are dear to the sāttvika person. Snigdha here is the same word the Voice-Care section\'s Aṣṭāṅga Hṛdayam citation uses for pre-recitation food.',
            te: 'ఆయుస్సు, సత్త్వం, బలం, ఆరోగ్యం, సుఖం, ప్రీతి — వీటిని వృద్ధి చేసేవి; రసయుక్తమైనవి, స్నిగ్ధమైనవి, స్థిరమైనవి, హృద్యమైనవి — ఇవి సాత్విక ప్రియులకు ఇష్టమైన ఆహారాలు. ఇక్కడి "స్నిగ్ధ" అనే పదం పైన స్వరరక్షణ విభాగంలోని అష్టాంగ హృదయం ఉదహరించిన అదే పదం.'
          }
        },
        {
          term: 'Rājasika āhāra',
          sub: 'Bhagavad Gītā 17.9',
          sutra: 'कट्वम्ललवणात्युष्णतीक्ष्णरूक्षविदाहिनः । आहारा राजसस्येष्टा दुःखशोकामयप्रदाः ॥',
          en: {
            en: 'Foods that are bitter, sour, salty, very hot, pungent, dry (rūkṣa), and burning are dear to the rājasika person, and bring suffering, grief, and disease. Rūkṣa is the exact term the Voice-Care section cites as directly destructive to the chanting voice.',
            te: 'కటువైనవి, పులుపైనవి, ఉప్పగా ఉన్నవి, అతి ఉష్ణమైనవి, తీక్ష్ణమైనవి, రూక్షమైనవి, దాహం కలిగించేవి — రాజసికులకు ఇష్టమైన ఈ ఆహారాలు దుఃఖం, శోకం, రోగం కలిగిస్తాయి. "రూక్ష" అనే పదాన్నే స్వరరక్షణ విభాగం పఠన స్వరాన్ని నేరుగా దెబ్బతీసేదిగా పేర్కొంది.'
          }
        },
        {
          term: 'Tāmasika āhāra',
          sub: 'Bhagavad Gītā 17.10',
          sutra: 'यातयामं गतरसं पूति पर्युषितं च यत् । उच्छिष्टमपि चामेध्यं भोजनं तामसप्रियम् ॥',
          en: {
            en: 'Food that is stale, tasteless, putrid, spoiled, leftover, and impure is dear to the tāmasika person. Traditionally read as producing a dull, sluggish mind — and a dull mind produces dull, indistinct speech (compare alpakaṇṭhaḥ, the sixth fault of a chanter, above).',
            te: 'చల్లారిపోయిన, రసం పోయిన, దుర్వాసన వచ్చే, పాచిపోయిన, ఎంగిలి, అపవిత్రమైన ఆహారం — తామసికులకు ప్రియమైన భోజనం. ఇది మందకొడి మనస్సును కలిగిస్తుందని సాంప్రదాయిక భావన — మందకొడి మనస్సు అస్పష్ట వాక్కును కలిగిస్తుంది (పైన అల్పకంఠః దోషంతో పోల్చండి).'
          }
        },
        {
          term: 'Vāṅmaya tapas',
          sub: 'Bhagavad Gītā 17.15',
          sutra: 'अनुद्वेगकरं वाक्यं सत्यं प्रियहितं च यत् । स्वाध्यायाभ्यसनं चैव वाङ्मयं तप उच्यते ॥',
          en: {
            en: 'Speech that causes no distress, is truthful, pleasant, and beneficial, together with regular recitation practice (svādhyāyābhyasanam) — this is called the austerity of speech. Regular practice is named here as part of the discipline itself, not separate from it.',
            te: 'ఉద్వేగం కలిగించనిది, సత్యమైనది, ప్రియమైనది, హితమైనది — స్వాధ్యాయ అభ్యాసంతో కూడిన వాక్కు — ఇదే వాఙ్మయ తపస్సు. నిత్య అభ్యాసాన్ని ఇక్కడ సాధనలో భాగంగానే పేర్కొన్నారు, వేరుగా కాదు.'
          }
        },
        {
          term: 'Śabdabrahmaṇi niṣṇātaḥ',
          sub: 'Vākyapadīya (Bhartṛhari)',
          sutra: 'शब्दब्रह्मणि निष्णातः परं ब्रह्माधिगच्छति',
          en: {
            en: 'One who is well-versed in Śabda-brahman [the Word as the Absolute] attains the Supreme Brahman. Bhartṛhari\'s foundational claim for the entire tradition of treating grammar and correct sound as a spiritual discipline, not merely a technical one.',
            te: 'శబ్దబ్రహ్మలో నిష్ణాతుడైనవాడు పరబ్రహ్మను పొందుతాడు. వ్యాకరణాన్ని, సరైన ధ్వనిని కేవలం సాంకేతికమైనదిగా కాక ఆధ్యాత్మిక సాధనగా చూసే మొత్తం సంప్రదాయానికి భర్తృహరి పునాది వేసిన ప్రకటన ఇది.'
          }
        }
      ]
    }
  ]
};
