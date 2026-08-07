/* content.js — Chanting Rules guide content (Śikṣā).
   Consolidated from a single-pass reading of the source material — the
   original draft repeated the same six topics three times at increasing
   detail; this keeps one clean pass per topic, folding the sutra citations
   and worked examples into it instead of a separate "step-by-step" repeat. */

const GUIDE_CONTENT = {
  title: { en: 'Chanting Rules — Śikṣā', sa: 'शिक्षा — जपनियमाः', te: 'జప నియమాలు — శిక్ష' },
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
        translation: 'We shall now explain the science of pronunciation: Letter (varṇa), Accent (svara), Duration (mātrā), Effort (bala), Rhythm (sāma), and Flow (santāna).'
      },
      body: [
        { en: 'These six elements are the entire syllabus of Vedic pronunciation, and every rule below is one of them worked out in practice.', te: 'ఈ ఆరు అంశాలే వేద ఉచ్చారణ శాస్త్రం మొత్తం — కింద ఉన్న ప్రతి నియమం వీటిలో ఏదో ఒకదాన్ని ఆచరణలో వివరిస్తుంది.' }
      ],
      items: [
        { term: 'Varṇa', sub: 'Letter', en: 'Every phoneme articulated accurately from its correct place of origin (sthāna).' },
        { term: 'Svara', sub: 'Accent / Pitch', en: 'Udātta (high), anudātta (low), svarita (falling) — in Vedic chanting, wrong pitch can change meaning.' },
        { term: 'Mātrā', sub: 'Duration', en: 'Short, long, and protracted vowels held for their exact, strict count of beats.' },
        { term: 'Bala', sub: 'Effort', en: 'Internal (tongue/lip contact) and external (breath) effort — covered under Prayatna below.' },
        { term: 'Sāma', sub: 'Evenness', en: 'A constant tempo and smooth rhythm, without rushing, dragging, or emotional distortion.' },
        { term: 'Santāna', sub: 'Flow', en: 'How words join in continuous recitation (sandhi), and where pauses are and are not allowed.' }
      ]
    },

    {
      id: 'sthana',
      icon: '👄',
      title: { en: 'Sthāna — Places of Articulation', sa: 'स्थानम्', te: 'స్థానం — ఉచ్చారణ స్థలాలు' },
      body: [
        { en: 'Every sound in Sanskrit originates from one exact place in the mouth or throat. Chanting the right letter from the wrong place is still a mispronunciation — this is the most common, and most correctable, source of unclear chanting.', te: 'ప్రతి సంస్కృత ధ్వని నోటిలో లేదా గొంతులో ఒక నిర్దిష్ట స్థానం నుండి పుడుతుంది. సరైన అక్షరాన్ని తప్పు స్థానం నుండి పలకడం కూడా అపభ్రంశమే.' }
      ],
      diagram: 'sthana',
      items: [
        { term: 'Kaṇṭha', sub: 'Throat / Guttural', sutra: 'अकुहविसर्जनीयानां कण्ठः', letters: 'a, ā · ka-varga (ka kha ga gha ṅa) · ha · visarga (ः)' },
        { term: 'Tālu', sub: 'Hard palate / Palatal', sutra: 'इचुयशानां तालु', letters: 'i, ī · ca-varga (ca cha ja jha ña) · ya · śa' },
        { term: 'Mūrdhā', sub: 'Roof of mouth / Retroflex', sutra: 'ऋटुरषाणां मूर्धा', letters: 'ṛ, ṝ · ṭa-varga (ṭa ṭha ḍa ḍha ṇa) · ra · ṣa' },
        { term: 'Danta', sub: 'Teeth / Dental', sutra: 'लृतुलसानां दन्ताः', letters: 'ḷ · ta-varga (ta tha da dha na) · la · sa' },
        { term: 'Oṣṭha', sub: 'Lips / Labial', sutra: 'उपूपध्मानीयानाम् ओष्ठौ', letters: 'u, ū · pa-varga (pa pha ba bha ma) · upadhmānīya' },
        { term: 'Nāsikā', sub: 'Nasal cavity', sutra: 'ञमङणनानां नासिका च', letters: 'ña, ma, ṅa, ṇa, na — engage both their own sthāna and the nose' },
        { term: 'Combined places', sub: '', letters: 'va = danta+oṣṭha · e, ai = kaṇṭha+tālu · o, au = kaṇṭha+oṣṭha' }
      ],
      body2: [
        { en: 'Why this matters in practice: śa (palatal, tālavya), ṣa (retroflex, mūrdhanya) and sa (dental, dantya) are three different sthānas that sound almost identical if you\'re careless — and confusing them changes real words.', te: 'ఆచరణలో ఇది ఎందుకు ముఖ్యమో: శ (తాలవ్యం), ష (మూర్ధన్యం), స (దంత్యం) — మూడు వేర్వేరు స్థానాలు, జాగ్రత్త లేకపోతే దాదాపు ఒకేలా వినిపిస్తాయి — వీటిని తారుమారు చేస్తే నిజమైన పదాలు మారిపోతాయి.' }
      ],
      verse2: {
        sa: 'यद्यपि बहुनाधीषे तथापि पठ पुत्र! व्याकरणम् । स्वजनः श्वजनो मा भूत् सकलं शकलं सकृत् शकृत् ॥',
        ro: 'yadyapi bahunādhīṣe tathāpi paṭha putra! vyākaraṇam | svajanaḥ śvajano mā bhūt sakalaṁ śakalaṁ sakṛt śakṛt ||',
        source: 'Traditional verse on the necessity of grammar (cf. Patañjali Mahābhāṣya)',
        translation: 'My child, even if you study little else, learn grammar. So that svajanaḥ (kinsman, dental sa) never becomes śvajanaḥ (a dog, palatal śa) — sakalam (whole, dental sa) never becomes śakalam (a fragment, palatal śa) — and sakṛt (once, dental sa) never becomes śakṛt (excrement, palatal śa).'
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
        translation: 'Udātta (raised), anudātta (lowered), and svarita (a blend of the two) are the three [Vedic] pitch accents. Ekaśruti (a level monotone) is used when calling out to someone from a distance. Thus is śikṣā proclaimed.'
      },
      items: [
        { term: 'Udātta', sub: 'Raised / high pitch', en: 'Unmarked in most printed texts; the reference pitch a syllable is chanted at.' },
        { term: 'Anudātta', sub: 'Lowered / low pitch', en: 'Marked with a horizontal line below the syllable; a distinctly lower tone than udātta.' },
        { term: 'Svarita', sub: 'Falling / combined pitch', en: 'Marked with a vertical line above the syllable; begins high and falls — a blend arising from an udātta followed by an anudātta.' },
        { term: 'Ekaśruti', sub: 'Level monotone', en: 'Used when calling out from a distance (dūrāt saṁbuddhau) — the one case where pitch variation is deliberately dropped.' }
      ],
      verseExample: {
        ref: 'Classic grammarians\' example',
        text: 'indraśatruḥ',
        note: 'The classic grammarians\' cautionary tale: as a tatpuruṣa (accent on the final syllable) it means "Indra\'s slayer" — but chanted with the accent shifted to the first syllable, it becomes a bahuvrīhi meaning "one whose enemy is Indra," reversing who kills whom. Pitch alone carries that grammatical distinction — which is why Vedic mantras are guarded so carefully.'
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
        translation: 'One mātrā is defined as the time taken to snap a finger or blink an eye — a natural, physical unit of time, not a vague feeling of "short" or "long".'
      },
      diagram: 'matra',
      items: [
        { term: 'Hrasva', sub: 'Short — 1 mātrā', letters: 'a, i, u, ṛ, ḷ' },
        { term: 'Dīrgha', sub: 'Long — 2 mātrās, exactly twice hrasva', letters: 'ā, ī, ū, ṝ, e, ai, o, au' },
        { term: 'Pluta', sub: 'Protracted — 3 mātrās, marked ३', letters: 'used when calling from a distance, in Vedic accents, e.g. Om3' },
        { term: 'Vyañjana', sub: 'Pure consonant — ½ mātrā', letters: 'a consonant with no vowel of its own, e.g. k, t, m' }
      ]
    },

    {
      id: 'prayatna',
      icon: '💨',
      title: { en: 'Prayatna — Effort & Aspiration', sa: 'प्रयत्नः', te: 'ప్రయత్నం — శ్రమ, ఊపిరి' },
      verse: {
        sa: 'यथा व्याघ्री हरेत्पुत्रान् दंष्ट्राभ्यां न च पीडयेत् । भीता दन्तपाताभ्यामिति वर्णान् प्रयोजयेत् ॥',
        ro: 'yathā vyāghrī haretputrān daṁṣṭrābhyāṁ na ca pīḍayet | bhītā dantapātābhyāmiti varṇān prayojayet ||',
        source: 'Pāṇinīya Śīkṣā, v.24 — "The Tigress Analogy"',
        translation: 'Just as a tigress carries her cubs between her teeth without crushing them, yet holds them firmly lest they fall — so articulate each letter: firm, but never harsh or strained.'
      },
      body: [
        { en: 'Internal effort (how the tongue/lips touch) and external effort (how much breath is used) both shape a sound. Getting the letter right but the effort wrong is still audible as a mispronunciation to a trained ear.', te: 'నాలుక/పెదవుల స్పర్శ (అంతః ప్రయత్నం) మరియు ఊపిరి బలం (బాహ్య ప్రయత్నం) — రెండూ ధ్వనిని రూపొందిస్తాయి.' }
      ],
      items: [
        { term: 'Spṛṣṭa', sub: 'Full contact', letters: 'all stop consonants, ka to ma' },
        { term: 'Īṣat-spṛṣṭa', sub: 'Slight contact', letters: 'semivowels — ya, ra, la, va' },
        { term: 'Īṣat-vivṛta', sub: 'Slightly open', letters: 'sibilants/aspirates — śa, ṣa, sa, ha' },
        { term: 'Vivṛta', sub: 'Fully open', letters: 'all vowels' },
        { term: 'Alpaprāṇa', sub: 'Unaspirated — gentle breath', letters: '1st, 3rd, 5th letter of each varga + ya ra la va (ka, ga, ṅa…)' },
        { term: 'Mahāprāṇa', sub: 'Aspirated — strong breath', letters: '2nd, 4th letter of each varga + śa ṣa sa ha (kha, gha…)', warn: 'Never soften a mahāprāṇa into an alpaprāṇa — dharma must never become darma.' }
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
        translation: 'Neither too fast nor too slow — a moderate (madhyama) pace is beneficial for recitation. Clear and pleasant-to-hear — these are the marks of good vācana (recitation).'
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
      rule: {
        sa: 'अनुस्वारस्य ययि परसवर्णः',
        ro: 'anusvārasya yayi parasavarṇaḥ',
        source: 'Pāṇini 8.4.58',
        translation: 'An anusvāra (ṁ) followed by a consonant of the five vargas becomes the nasal of that consonant\'s own class.'
      },
      examples: [
        { sa: 'शान्त', ro: 'śāṁ + ta → śānta', note: 'dental n, because ta is dental' },
        { sa: 'सङ्कल्प', ro: 'saṁ + kalpa → saṅkalpa', note: 'guttural ṅ, because ka is guttural' },
        { sa: 'सञ्चय', ro: 'saṁ + caya → sañcaya', note: 'palatal ñ, because ca is palatal' }
      ],
      verseExample: {
        ref: 'Bhagavad Gītā 2.47',
        text: 'karmaṇy-evādhikāras te',
        note: 'karmaṇi + eva sandhi-joins to karmaṇyevādhikāraste — chant it as one continuous unit, not "karmani ... eva ... adhikaraste" with breaks.'
      }
    },

    {
      id: 'meter',
      icon: '📏',
      title: { en: 'Preserving Meter — Yati & Compound Integrity', sa: 'छन्दोभङ्गवर्जनम्', te: 'ఛందస్సు రక్షణ — యతి, సమాస సమగ్రత' },
      body: [
        { en: 'A long compound word (samasta-pada) carries one combined meaning. Breaking it mid-word for breath destroys both the meaning (artha-bhaṅga) and the meter (chando-bhaṅga).', te: 'పొడవైన సమాసపదం ఒకే అర్థాన్ని కలిగి ఉంటుంది. ఊపిరి కోసం మధ్యలో ఆపడం అర్థాన్నీ, ఛందస్సునూ రెండింటినీ దెబ్బతీస్తుంది.' },
        { en: 'If you must pause, pause only at a recognized word-boundary (pada-chheda) or a prescribed metrical caesura (yati) — never arbitrarily. If a mid-compound pause is unavoidable, backtrack to the start of that compound before continuing.', te: 'ఆగవలసి వస్తే, గుర్తించిన పద విభజన (పద-ఛేద) వద్ద లేదా నిర్దేశిత యతి వద్ద మాత్రమే ఆగాలి.' },
        { en: 'A short vowel (hrasva, 1 mātrā) counts as heavy (guru, 2 mātrās) in the meter when followed by a conjunct consonant, an anusvāra, a visarga, or when it ends a verse quarter (pāda) — give it the weight the meter needs, even though it\'s "short" in isolation.', te: 'హ్రస్వ స్వరం తర్వాత సంయుక్తాక్షరం, అనుస్వారం, విసర్గ ఉంటే లేదా అది పాదాంతంలో ఉంటే — ఛందస్సులో అది గురువుగా లెక్కించబడుతుంది.' }
      ],
      verseExample: {
        ref: 'Bhagavad Gītā 18.66',
        text: 'sarva-dharmān parityajya',
        note: '"Sarva-dharmān" is one compound (all dharmas) — never split as "sarva ... dharman ... parityajya". Chant the whole compound in one breath-unit.'
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
        { term: 'Gītī', en: 'Singing it like a song instead of using the correct tonal svaras.' },
        { term: 'Śīghrī', en: 'Reciting too fast.' },
        { term: 'Śiraḥkampī', en: 'Unnecessarily shaking or nodding the head.' },
        { term: 'Yathā likhitapāṭhakaḥ', en: 'Reading mechanically off paper rather than from memory with real attention.' },
        { term: 'Anarthajñaḥ', en: 'Chanting with no awareness of the meaning.' },
        { term: 'Alpakaṇṭhaḥ', en: 'A weak, indistinct, barely-audible voice.' }
      ],
      verse2: {
        sa: 'माधुर्यमक्षरव्यक्तिः पदच्छेदस्तु सुस्वरः । धैर्यं लयसमर्थं च षडेते पाठका गुणाः ॥',
        ro: 'mādhuryamakṣaravyaktiḥ padacchedastu susvaraḥ | dhairyaṁ layasamarthaṁ ca ṣaḍete pāṭhakā guṇāḥ ||',
        source: 'Pāṇinīya Śīkṣā, v.33 — Six Virtues'
      },
      items2: [
        { term: 'Mādhuryam', en: 'Sweetness of tone.' },
        { term: 'Akṣaravyaktiḥ', en: 'Crystal-clear articulation of every syllable.' },
        { term: 'Padacchedaḥ', en: 'Correct word separation.' },
        { term: 'Susvaraḥ', en: 'Accurate pitch and accent.' },
        { term: 'Dhairyam', en: 'Patience and composure.' },
        { term: 'Layasamartham', en: 'Command over rhythm and tempo.' }
      ]
    },

    {
      id: 'voice-care',
      icon: '🥛',
      title: { en: 'Food & Voice-Care — Before You Chant', sa: '', te: 'ఆహారం మరియు స్వరరక్షణ — పఠనానికి ముందు' },
      body: [
        { en: 'Āyurveda and dharmaśāstra both treat voice quality as directly caused by what and when you eat — not a vague association, but a stated cause-and-effect relationship. This section collects the specific, sourced rules.', te: 'ఆయుర్వేదం మరియు ధర్మశాస్త్రం రెండూ స్వరం యొక్క నాణ్యత ఆహారంపై నేరుగా ఆధారపడి ఉంటుందని చెప్తాయి — ఇది అస్పష్టమైన సంబంధం కాదు, స్పష్టమైన కారణ-కార్య సంబంధం.' }
      ],
      items: [
        {
          term: 'Snigdha-uṣṇa-laghu before reciting',
          sub: 'Aṣṭāṅga Hṛdayam, Sūtrasthāna 10.15',
          sutra: 'स्वरवर्णप्रसादाय स्निग्धोष्णं लघु भोजनम् । गानात् पूर्वं हितं प्रोक्तं वाग्विशुद्धिकरं परम् ॥',
          en: 'For clarity of svara and varṇa, unctuous (snigdha), warm (uṣṇa), and light (laghu) food is recommended before recitation or singing — this most greatly purifies the voice. Practically: warm milk with ghee, or warm rice with ghee, before a reading session.'
        },
        {
          term: 'Rūkṣa (dry/rough) food destroys the voice',
          sub: 'Aṣṭāṅga Hṛdayam',
          sutra: 'रूक्षान्नसेवनात् पश्चात् स्वरनाशो भविष्यति ।',
          en: 'After eating dry, rough food, speaking loudly, reciting, or singing will destroy the voice — stated as a certainty (future tense), not a possibility. Directly relevant to anyone speaking on radio, teaching, or chanting for a living.'
        },
        {
          term: 'Dry and very cold food',
          sub: 'Caraka Saṃhitā',
          sutra: 'स्वरभेदः कासश्च श्वासो दौर्बल्यमेव च । रूक्षाण्यतिशीतानि भोजनात् उपजायते ॥',
          en: 'Voice-breaking, cough, breathlessness, and weakness arise from dry and excessively cold food — all four listed as direct obstacles to reciting long compounds without running out of breath.'
        },
        {
          term: 'Not on an undigested stomach',
          sub: 'Haṭhayoga Pradīpikā 1.57–58',
          sutra: 'मिताहारः स्थिरश्चित्तः स्वरशुद्धिकरः सदा । अजीर्णे भोजनं त्याज्यं पठनं च विवर्जयेत् ॥',
          en: 'A moderate diet keeps the mind steady and always purifies the voice. Both eating and reciting should be avoided while the previous meal is still undigested (ajīrṇa).'
        },
        {
          term: 'Mitāhāra — how much is "moderate"',
          sub: 'Haṭhayoga Pradīpikā 1.59',
          sutra: 'अष्टांशोनं हितं भुक्तं योगिनो मितमुच्यते ।',
          en: 'For a practitioner, "moderate" means filling five of the stomach\'s eight parts with food — leaving room for water and air. A full stomach presses on the diaphragm and directly weakens breath support for chanting.'
        },
        {
          term: 'No heavy meal before study',
          sub: 'Manusmṛti 4.120',
          sutra: 'न अश्नीयात् भोजनं रात्रौ वेदाभ्यासात् पूर्वतः । दिवा स्वाध्यायशीलस्य लघ्वन्नं हितमुच्यते ॥',
          en: 'One should not eat [a heavy] meal at night before Vedic study; for one devoted to daily recitation, light food during the day is recommended.'
        },
        {
          term: 'Not right after eating, not with wet feet',
          sub: 'Manusmṛti 4.113',
          sutra: 'न उच्चैः पठेत् भुक्त्वान्नम् न आर्द्रपादो जपेत् क्वचित् । शुचिः शुद्धान्नभोजी च शुद्धोच्चारणमाप्नुयात् ॥',
          en: 'Do not recite loudly right after eating; never chant with wet feet. One who is clean and eats pure food attains pure pronunciation — stated as direct cause and effect, not a loose association.'
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
        { term: 'Time of day', en: 'Brāhma-muhūrta (roughly 90 min before sunrise), or morning/evening sandhyā, are traditionally preferred — the mind is considered quieter and more receptive.' },
        { term: 'State of mind', en: 'Chant with attention on the meaning, not by rote — see anarthajñaḥ above, one of the six faults.' },
        { term: 'Restricted mantras', en: 'Certain Vedic mantras traditionally require initiation (upanayana/dīkṣā) from a qualified teacher — this varies by tradition and text; when in doubt, ask a knowledgeable elder or guru rather than assuming.' },
        { term: 'Consistency over intensity', en: 'A short, steady daily practice (nitya-pāṭha) is traditionally valued over occasional long sessions.' }
      ]
    }
  ]
};
