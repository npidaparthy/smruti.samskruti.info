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
        { term: 'Svara', sub: 'Accent / Pitch', en: { en: 'Udātta (high), anudātta (low), svarita (falling) — in Vedic chanting, wrong pitch can change meaning.', te: 'ఉదాత్తం (ఎత్తు), అనుదాత్తం (తగ్గు), స్వరితం (దిగు) — వేద పఠనంలో తప్పు స్వరం అర్థాన్నే మార్చేయగలదు.' } },
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
        { term: 'Combined places', sub: '', letters: 'va = danta+oṣṭha · e, ai = kaṇṭha+tālu · o, au = kaṇṭha+oṣṭha' },
        {
          term: 'Jihvāmūlīya', sub: { en: 'Tongue-root — a visarga variant', te: 'జిహ్వామూలం — విసర్గ ఉపరూపం' },
          sutra: 'क्ख इति कखाभ्यां प्रागर्धविसर्गसदृशो जिह्वामूलीयः',
          letters: { en: 'A special half-visarga sound, articulated at the root of the tongue, that replaces a plain visarga specifically when it occurs right before क or ख (e.g. duḥkha). Distinct from the ordinary visarga used elsewhere.', te: 'నాలుక మూలం నుండి పలికే ప్రత్యేక అర్ధ-విసర్గ ధ్వని — క లేదా ఖ ముందు వచ్చిన సాధారణ విసర్గకు బదులుగా వస్తుంది (ఉదా. దుఃఖ). ఇతర చోట్ల వాడే సాధారణ విసర్గ కంటే వేరు.' }
        },
        {
          term: 'Upadhmānīya', sub: { en: 'Lip-region — a visarga variant', te: 'ఓష్ఠ ప్రాంతం — విసర్గ ఉపరూపం' },
          sutra: 'प्फ इति पफाभ्यां प्रागर्धविसर्गसदृश उपध्मानीयः',
          letters: { en: 'The equivalent half-visarga sound before प or फ (e.g. duḥpāra) — articulated near the lips instead of the throat. Most reciters flatten both of these into a plain visarga; the tradition treats them as distinct sounds with their own sthāna.', te: 'ప లేదా ఫ ముందు వచ్చే ఇదే తరహా అర్ధ-విసర్గ ధ్వని (ఉదా. దుఃపార) — గొంతు బదులు పెదవుల దగ్గర పలుకుతారు. చాలామంది పఠనకర్తలు వీటిని రెండింటినీ సాధారణ విసర్గగానే పలుకుతారు; సంప్రదాయం వీటిని వాటి స్వంత స్థానం గల వేర్వేరు ధ్వనులుగా చూస్తుంది.' }
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
        { en: 'In Vedic chanting especially, pitch is not decoration — the same word chanted with the wrong pitch can mean the opposite of what was intended.', te: 'ముఖ్యంగా వేద పఠనంలో, స్వరం అలంకారం కాదు — తప్పు స్వరంతో పలికిన అదే పదం అర్థాన్ని పూర్తిగా మార్చేయగలదు.' }
      ],
      verse: {
        sa: 'उदात्तश्च अनुदात्तश्च स्वरितश्च त्रयः स्वराः । एकश्रुति दूरात् संबुद्धौ इति शिक्षा प्रकीर्तिता ॥',
        ro: 'udāttaśca anudāttaśca svaritaśca trayaḥ svarāḥ | ekaśruti dūrāt saṁbuddhau iti śikṣā prakīrtitā ||',
        source: 'Pāṇinīya Śīkṣā',
        translation: {
          en: 'Udātta (raised), anudātta (lowered), and svarita (a blend of the two) are the three [Vedic] pitch accents. Ekaśruti (a level monotone) is used when calling out to someone from a distance. Thus is śikṣā proclaimed.',
          te: 'ఉదాత్తం, అనుదాత్తం, స్వరితం — ఇవి మూడు వేద స్వరాలు. దూరం నుండి పిలిచేటప్పుడు ఏకశ్రుతి (ఒకే స్థాయి స్వరం) వాడతారు. ఇదే శిక్షా శాస్త్రం చెప్పేది.'
        }
      },
      items: [
        { term: 'Udātta', sub: 'Raised / high pitch', en: { en: 'Unmarked in most printed texts; the reference pitch a syllable is chanted at.', te: 'చాలా ముద్రిత గ్రంథాలలో గుర్తు లేకుండానే ఉంటుంది; అక్షరం పలికే ప్రాథమిక స్థాయి.' } },
        { term: 'Anudātta', sub: 'Lowered / low pitch', en: { en: 'Marked with a horizontal line below the syllable; a distinctly lower tone than udātta.', te: 'అక్షరం కింద అడ్డగీతతో గుర్తించబడుతుంది; ఉదాత్తం కంటే స్పష్టంగా తక్కువ స్వరం.' } },
        { term: 'Svarita', sub: 'Falling / combined pitch', en: { en: 'Marked with a vertical line above the syllable; begins high and falls — a blend arising from an udātta followed by an anudātta.', te: 'అక్షరం పైన నిలువుగీతతో గుర్తించబడుతుంది; ఎత్తుగా మొదలై దిగుతుంది — ఉదాత్తం తర్వాత అనుదాత్తం కలయిక వలన వస్తుంది.' } },
        { term: 'Ekaśruti', sub: 'Level monotone', en: { en: 'Used when calling out from a distance (dūrāt saṁbuddhau) — the one case where pitch variation is deliberately dropped.', te: 'దూరం నుండి పిలిచేటప్పుడు వాడతారు — స్వర వైవిధ్యాన్ని ఉద్దేశపూర్వకంగా వదిలేసే ఏకైక సందర్భం.' } }
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
        }
      ]
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
        { sa: 'शान्त', ro: 'śāṁ + ta → śānta', note: { en: 'dental n, because ta is dental', te: 'దంత్య న, ఎందుకంటే త దంత్యం' } },
        { sa: 'सङ्कल्प', ro: 'saṁ + kalpa → saṅkalpa', note: { en: 'guttural ṅ, because ka is guttural', te: 'కంఠ్య ఙ, ఎందుకంటే క కంఠ్యం' } },
        { sa: 'सञ्चय', ro: 'saṁ + caya → sañcaya', note: { en: 'palatal ñ, because ca is palatal', te: 'తాలవ్య ఞ, ఎందుకంటే చ తాలవ్యం' } }
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
        { en: 'A short vowel (hrasva, 1 mātrā) counts as heavy (guru, 2 mātrās) in the meter when followed by a conjunct consonant, an anusvāra, a visarga, or when it ends a verse quarter (pāda) — give it the weight the meter needs, even though it\'s "short" in isolation.', te: 'హ్రస్వ స్వరం తర్వాత సంయుక్తాక్షరం, అనుస్వారం, విసర్గ ఉంటే లేదా అది పాదాంతంలో ఉంటే — ఛందస్సులో అది గురువుగా లెక్కించబడుతుంది.' }
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
        { term: { en: 'Consistency over intensity', te: 'తీవ్రత కంటే స్థిరత్వం' }, en: { en: 'A short, steady daily practice (nitya-pāṭha) is traditionally valued over occasional long sessions.', te: 'అప్పుడప్పుడు పొడవైన సాధన కంటే, చిన్నదైనా స్థిరమైన నిత్య పాఠం సాంప్రదాయికంగా విలువైనది.' } }
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
