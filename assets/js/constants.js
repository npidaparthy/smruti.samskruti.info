const C = {
  // Data paths
  GITA_INDEX:    '/data/gita-index.json',
  VSN_INDEX:     '/data/vsn-index.json',
  CHAPTER_PATH:  ch => `/data/chapters/ch${String(ch).padStart(2,'0')}.json`,
  NAKSHATRAS:    '/data/texts/vsn/nakshatras.json',
  SEARCH_INDEX:  '/data/search-index.json',

  // Scripts / Lipi
  SCRIPTS: ['te', 'ro', 'sa'],
  SCRIPT_LABELS: { te: 'తె', ro: 'En', sa: 'सं' },
  SCRIPT_DEFAULT: 'te',

  // UI languages
  UI_LANGS: ['te', 'en'],
  UI_LANG_DEFAULT: 'te',

  // Meaning languages
  MEANING_LANGS: ['te', 'en', 'sa'],
  MEANING_LANG_DEFAULT: 'te',

  // Font sizes (rem applied to verse text)
  FONT_SIZES: { sm: '1rem', md: '1.2rem', lg: '1.5rem', xl: '1.85rem' },
  FONT_SIZE_DEFAULT: 'md',

  // Themes
  THEMES: ['auto', 'light', 'dark'],
  THEME_DEFAULT: 'auto',

  // Gita chapters
  GITA_CHAPTERS: 18,
  GITA_TOTAL_SHLOKAS: 700,

  // Gita chapter range presets (for reference; UI uses multi-select now)
  GITA_RANGES: {
    '1-6':   { from: 1, to: 6 },
    '7-12':  { from: 7, to: 12 },
    '13-18': { from: 13, to: 18 },
    '1-9':   { from: 1, to: 9 },
    '10-18': { from: 10, to: 18 }
  },

  // VSN
  VSN_TOTAL_SHLOKAS: 108,
  VSN_NAKSHATRAS: 27,
  VSN_GROUPS: [
    { label: '1–10',    from: 1,   to: 10  },
    { label: '11–20',   from: 11,  to: 20  },
    { label: '21–30',   from: 21,  to: 30  },
    { label: '31–40',   from: 31,  to: 40  },
    { label: '41–50',   from: 41,  to: 50  },
    { label: '51–60',   from: 51,  to: 60  },
    { label: '61–70',   from: 61,  to: 70  },
    { label: '71–80',   from: 71,  to: 80  },
    { label: '81–90',   from: 81,  to: 90  },
    { label: '91–100',  from: 91,  to: 100 },
    { label: '101–108', from: 101, to: 108 },
  ],
  VSN_NAME_GROUPS: [
    { label: '1–100',    from: 1,   to: 100  },
    { label: '101–200',  from: 101, to: 200  },
    { label: '201–300',  from: 201, to: 300  },
    { label: '301–400',  from: 301, to: 400  },
    { label: '401–500',  from: 401, to: 500  },
    { label: '501–600',  from: 501, to: 600  },
    { label: '601–700',  from: 601, to: 700  },
    { label: '701–800',  from: 701, to: 800  },
    { label: '801–900',  from: 801, to: 900  },
    { label: '901–1008', from: 901, to: 1008 },
  ],

  // Speakers — keys: te (Telugu), dn (Devanagari), ro (IAST), en (English)
  SPEAKERS: ['krishna', 'arjuna', 'sanjaya', 'dhritarashtra'],
  SPEAKER_LABEL: {
    krishna:       { te: 'శ్రీ భగవానువాచ',    sa: 'श्रीभगवानुवाच',    ro: 'Śrī Bhagavān uvāca',    en: 'Śrī Bhagavān'   },
    arjuna:        { te: 'అర్జున ఉవాచ',       sa: 'अर्जुन उवाच',      ro: 'Arjuna uvāca',           en: 'Arjuna'         },
    sanjaya:       { te: 'సంజయ ఉవాచ',        sa: 'सञ्जय उवाच',       ro: 'Sañjaya uvāca',          en: 'Sañjaya'        },
    dhritarashtra: { te: 'ధృతరాష్ట్ర ఉవాచ',  sa: 'धृतराष्ट्र उवाच', ro: 'Dhṛtarāṣṭra uvāca',     en: 'Dhṛtarāṣṭra'   }
  },

  // Text labels per script (for dropdowns)
  TEXT_LABELS: {
    gita: { te: 'శ్రీమద్భగవద్గీతా', sa: 'श्रीमद्भगवद्गीता', ro: 'Śrīmad Bhagavadgītā', en: 'Śrīmad Bhagavadgītā' },
    vsn:  { te: 'శ్రీవిష్ణుసహస్రనామమ్', sa: 'श्रीविष्णुसहस्रनामम्', ro: 'Śrīviṣṇusahasranāmam', en: 'Śrī Viṣṇu Sahasranāmam' }
  },

  // Avadhānam test modes
  TEST_MODES_GITA: [
    { id: 'pada1',      label_en: 'Pada 1 → recall rest',    label_te: 'పాద 1 → మిగిలినవి చెప్పండి' },
    { id: 'pada2',      label_en: 'Pada 2 → recall rest',    label_te: 'పాద 2 → మిగిలినవి చెప్పండి' },
    { id: 'pada3',      label_en: 'Pada 3 → recall rest',    label_te: 'పాద 3 → మిగిలినవి చెప్పండి' },
    { id: 'pada4',      label_en: 'Pada 4 → recall rest',    label_te: 'పాద 4 → మిగిలినవి చెప్పండి' },
    { id: 'versenum',  label_en: 'Verse # → recall verse',   label_te: 'శ్లోక సంఖ్య → శ్లోకం చెప్పండి' },
    { id: 'alpha',     label_en: 'First syllable (alpha)',   label_te: 'మొదటి అక్షరం (వర్ణక్రమం)' },
    { id: 'uvacha',    label_en: 'Uvāca (speaker recall)',   label_te: 'ఉవాచ (వక్త గుర్తింపు)'    },
    { id: 'firstverse',label_en: 'First verse of chapter',  label_te: 'అధ్యాయ ప్రారంభ శ్లోకం'   },
    { id: 'lastverse', label_en: 'Last verse of chapter',   label_te: 'అధ్యాయ చివరి శ్లోకం'     }
  ],
  TEST_MODES_VSN: [
    { id: 'pada1',     label_en: 'Pada 1 → recall rest',        label_te: 'పాద 1 → మిగిలినవి చెప్పండి'   },
    { id: 'pada2',     label_en: 'Pada 2 → recall rest',        label_te: 'పాద 2 → మిగిలినవి చెప్పండి'   },
    { id: 'pada3',     label_en: 'Pada 3 → recall rest',        label_te: 'పాద 3 → మిగిలినవి చెప్పండి'   },
    { id: 'pada4',     label_en: 'Pada 4 → recall rest',        label_te: 'పాద 4 → మిగిలినవి చెప్పండి'   },
    { id: 'versenum',  label_en: 'Verse # → chant verse',       label_te: 'శ్లోక సంఖ్య → శ్లోకం చెప్పండి' },
    { id: 'namenum',   label_en: 'Name # → chant verse',        label_te: 'నామ సంఖ్య → శ్లోకం చెప్పండి'   },
    { id: 'name',      label_en: 'Name → shloka',               label_te: 'నామం → శ్లోకం'                  },
    { id: 'namerev',   label_en: 'First name → recall verse',   label_te: 'మొదటి నామం → శ్లోకం చెప్పండి'  },
    { id: 'nakshatra', label_en: 'Nakshatra·Pada → verse',      label_te: 'నక్షత్ర·పాద → శ్లోకం'          },
  ],

  // Help videos
  HELP_VIDEO_TE: 'https://youtube.com/shorts/clD5BxBsVJI?feature=share',
  HELP_VIDEO_EN: 'https://youtube.com/shorts/J2VY9nvKW90?feature=share',

  // Lipi color presets — index 0 = default (uses --accent via CSS, no override)
  LIPI_PRESETS: [
    null,
    { name: 'Indigo', l: '#4a3580', d: '#9b85e0' },
    { name: 'Forest', l: '#1e6b3a', d: '#5eba87' },
    { name: 'Slate',  l: '#2b4a6b', d: '#6aadce' },
  ],

  // LocalStorage keys
  LS: {
    SCRIPT:       'smriti_script',
    UI_LANG:      'smriti_ui_lang',
    MEANING_LANG: 'smriti_meaning_lang',
    FONT_SIZE:    'smriti_font_size',
    THEME:        'smriti_theme',
    TEXT:         'smriti_active_text',
    TEST_MODE:    'smriti_test_mode',
    CHAPTERS_SEL: 'smriti_chapters_selected',
    LIPI_PRESET:  'smriti_lipi_preset',
    AUDIO_SPEED:  'smriti_audio_speed',
    AUTO_ADVANCE: 'smriti_auto_advance',
    AV_MEANING:   'smriti_av_meaning'
  }
};

if (typeof module !== 'undefined') module.exports = C;
