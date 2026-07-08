#!/usr/bin/env python3
"""
add-conclusions.py — Add traditional chapter-end colophon to all 18 BG chapters.

Format (same text, three scripts):
  oṃ tatsaditi śrīmadbhagavadgītāsūpaniṣatsu brahmavidyāyāṃ yogaśāstre
  śrīkṛṣṇārjunasaṃvāde [yoga] nāma [ordinal]'dhyāyaḥ

Ch18 only — appends epilogue:
  śrīkṛṣṇārpaṇamastu | oṃ tat sat |

Stores as chapter-level "conclusion": { ro, te, dn, meaning:{en,te,sa} }
Overwrites any existing conclusion field.
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent

# ── Chapter data ──────────────────────────────────────────────────────────────
# yoga: (ro compound, te compound, dn compound)
# ordinal: (ro, te, dn)  — already in sandhi form before 'dhyāyaḥ

CHAPTERS = [
    # ch, yoga_ro, yoga_te, yoga_dn, ordinal_ro, ordinal_te, ordinal_dn, yoga_en
    (1,  "arjunaviṣādayogo",             "అర్జునవిషాదయోగో",          "अर्जुनविषादयोगो",          "prathamo",    "ప్రథమో",    "प्रथमो",    "Arjuna's Despondency"),
    (2,  "sāṃkhyayogo",                  "సాంఖ్యయోగో",               "सांख्ययोगो",               "dvitīyo",     "ద్వితీయో",  "द्वितीयो",  "Sāṃkhya"),
    (3,  "karmayogo",                    "కర్మయోగో",                 "कर्मयोगो",                 "tṛtīyo",      "తృతీయో",    "तृतीयो",    "Karma"),
    (4,  "jñānakarmāsaṃnyāsayogo",       "జ్ఞానకర్మసన్న్యాసయోగో",    "ज्ञानकर्मसंन्यासयोगो",    "caturtho",    "చతుర్థో",   "चतुर्थो",   "Knowledge and Renunciation of Action"),
    (5,  "karmasaṃnyāsayogo",            "కర్మసన్న్యాసయోగో",         "कर्मसंन्यासयोगो",         "pañcamo",     "పఞ్చమో",    "पञ्चमो",    "Renunciation of Action"),
    (6,  "ātmasaṃyamayogo",              "ఆత్మసంయమయోగో",             "आत्मसंयमयोगो",             "ṣaṣṭho",      "షష్ఠో",     "षष्ठो",     "Self-Mastery"),
    (7,  "jñānavijñānayogo",             "జ్ఞానవిజ్ఞానయోగో",         "ज्ञानविज्ञानयोगो",         "saptamo",     "సప్తమో",    "सप्तमो",    "Knowledge and Realisation"),
    (8,  "akṣarabrahmayogo",             "అక్షరబ్రహ్మయోగో",          "अक्षरब्रह्मयोगो",          "aṣṭamo",      "అష్టమో",    "अष्टमो",    "The Imperishable Brahman"),
    (9,  "rājavidyārājaguhyayogo",       "రాజవిద్యారాజగుహ్యయోగో",   "राजविद्याराजगुह्ययोगो",   "navamo",      "నవమో",      "नवमो",      "The Royal Knowledge and Royal Secret"),
    (10, "vibhūtiyogo",                  "విభూతియోగో",               "विभूतियोगो",               "daśamo",      "దశమో",      "दशमो",      "Divine Manifestations"),
    (11, "viśvarūpadarśanayogo",         "విశ్వరూపదర్శనయోగో",        "विश्वरूपदर्शनयोगो",        "ekādaśo",     "ఏకాదశో",    "एकादशो",    "The Vision of the Cosmic Form"),
    (12, "bhaktiyogo",                   "భక్తియోగో",                "भक्तियोगो",                "dvādaśo",     "ద్వాదశో",   "द्वादशो",   "Devotion"),
    (13, "kṣetrakṣetrajñavibhāgayogo",  "క్షేత్రక్షేత్రజ్ఞవిభాగయోగో", "क्षेत्रक्षेत्रज्ञविभागयोगो", "trayodaśo",   "త్రయోదశో",  "त्रयोदशो",  "The Field and Its Knower"),
    (14, "guṇatrayavibhāgayogo",         "గుణత్రయవిభాగయోగో",         "गुणत्रयविभागयोगो",         "caturdaśo",   "చతుర్దశో",  "चतुर्दशो",  "The Three Qualities"),
    (15, "puruṣottamayogo",              "పురుషోత్తమయోగో",            "पुरुषोत्तमयोगो",            "pañcadaśo",   "పఞ్చదశో",   "पञ्चदशो",   "The Supreme Person"),
    (16, "daivāsurasaṃpadvibhāgayogo",  "దైవాసురసంపద్విభాగయోగో",   "दैवासुरसंपद्विभागयोगो",   "ṣoḍaśo",      "షోడశో",     "षोडशो",     "Divine and Demonic Endowments"),
    (17, "śraddhātrayavibhāgayogo",      "శ్రద్ధాత్రయవిభాగయోగో",     "श्रद्धात्रयविभागयोगो",     "saptadaśo",   "సప్తదశో",   "सप्तदशो",   "The Threefold Faith"),
    (18, "mokṣasaṃnyāsayogo",           "మోక్షసన్న్యాసయోగో",        "मोक्षसंन्यासयोगो",        "aṣṭādaśo",    "అష్టాదశో",  "अष्टादशो",  "Liberation through Renunciation"),
]

# ── Colophon templates ────────────────────────────────────────────────────────

PREFIX_RO = ("oṃ tatsaditi śrīmadbhagavadgītāsūpaniṣatsu "
             "brahmavidyāyāṃ yogaśāstre śrīkṛṣṇārjunasaṃvāde")
PREFIX_RO_18 = ("oṃ tatsaditi, śrīmanmahābhārate, śatasāhasrikāyāṃ, saṃhitāyāṃ, "
                "vaiyāsikīyāṃ, śrīmadbhīṣmaparvaṇi, śrīmadbhagavadgītāsu, "
                "upaniṣatsu, brahmavidyāyāṃ, yogaśāstre, śrīkṛṣṇārjunasaṃvāde")
PREFIX_TE = ("ఓం తత్సదితి శ్రీమద్భగవద్గీతాసూపనిషత్సు "
             "బ్రహ్మవిద్యాయాం యోగశాస్త్రే శ్రీకృష్ణార్జునసంవాదే")
PREFIX_TE_18 = ("ఓం తత్సదితి, శ్రీమన్మహాభారతే, శతసాహస్రికాయాం, సంహితాయాం, "
                "వైయ్యాసిక్యాం, శ్రీమద్భీష్మపర్వణి, శ్రీమద్భగవద్గీతాసు, "
                "ఉపనిషత్సు, బ్రహ్మవిద్యాయాం, యోగశాస్త్రే, శ్రీకృష్ణార్జునసంవాదే")
PREFIX_DN = ("ॐ तत्सदिति श्रीमद्भगवद्गीतासूपनिषत्सु "
             "ब्रह्मविद्यायां योगशास्त्रे श्रीकृष्णार्जुनसंवादे")
PREFIX_DN_18 = ("ॐ तत्सदिति, श्रीमन्महाभारते, शतसाहस्रिकायां, संहितायां, "
                "वैयासिकीयां, श्रीमद्भीष्मपर्वणि, श्रीमद्भगवद्गीतासु, "
                "उपनिषत्सु, ब्रह्मविद्यायां, योगशास्त्रे, श्रीकृष्णार्जुनसंवादे")

EPILOGUE_RO = "śrīkṛṣṇārpaṇamastu | oṃ tat sat |"
EPILOGUE_TE = "శ్రీకృష్ణార్పణమస్తు. ఓమ్ తత్ సత్ ।"
EPILOGUE_DN = "श्रीकृष्णार्पणमस्तु । ओम् तत् सत् ।"


def make_colophon(ch, yoga_ro, yoga_te, yoga_dn, ord_ro, ord_te, ord_dn, yoga_en):
    sep = ", " if ch == 18 else " "
    ro = f"{PREFIX_RO_18 if ch == 18 else PREFIX_RO}{sep}{yoga_ro} nāma {ord_ro}'dhyāyaḥ"
    te = f"{PREFIX_TE_18 if ch == 18 else PREFIX_TE}{sep}{yoga_te}నామ {ord_te}ఽధ్యాయః"
    dn = f"{PREFIX_DN_18 if ch == 18 else PREFIX_DN}{sep}{yoga_dn} नाम {ord_dn}ऽध्यायः"

    if ch == 18:
        ro += f"\n{EPILOGUE_RO}"
        te += f"\n{EPILOGUE_TE}"
        dn += f"\n{EPILOGUE_DN}"

    ordinal_en = [
        "", "first", "second", "third", "fourth", "fifth", "sixth",
        "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth",
        "thirteenth", "fourteenth", "fifteenth", "sixteenth",
        "seventeenth", "eighteenth"
    ][ch]

    short_en = (f"Thus ends the {ordinal_en} chapter entitled '{yoga_en} Yoga' "
                f"in the Śrīmad Bhagavadgītā, the Upaniṣad, the science of the Absolute, "
                f"the scripture of yoga, the dialogue between Śrī Kṛṣṇa and Arjuna.")
    short_te = (f"ఇట్లు శ్రీమద్భగవద్గీతలో, ఉపనిషత్తులలో, బ్రహ్మవిద్యలో, యోగశాస్త్రంలో, "
                f"శ్రీకృష్ణార్జున సంవాదంలో '{yoga_te[:-1]}' అను {ord_te[:-1]}ధ్యాయం సమాప్తం.")
    short_sa = (f"एवं श्रीमद्भगवद्गीतासूपनिषत्सु ब्रह्मविद्यायां योगशास्त्रे "
                f"श्रीकृष्णार्जुनसंवादे '{yoga_dn[:-1]}' नाम {ord_dn[:-1]}ध्यायः समाप्तः।")

    return {
        "ro": ro,
        "te": te,
        "dn": dn,
        "meaning": {
            "en": {"short": short_en},
            "te": {"short": short_te},
            "sa": {"short": short_sa},
        }
    }


def save(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))


if __name__ == "__main__":
    for row in CHAPTERS:
        ch = row[0]
        path = ROOT / "data" / "chapters" / f"ch{ch:02d}.json"
        d = json.load(open(path, encoding="utf-8"))
        d["conclusion"] = make_colophon(*row)
        save(path, d)
        print(f"  ch{ch:02d} ✓  {row[1]}")

    print("\nDone — conclusion added to all 18 chapters.")
