#!/usr/bin/env python3
"""Add missing meaning blocks for BG 1.33 and BG 13.34."""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
CH01 = ROOT / "data" / "chapters" / "ch01.json"
CH13 = ROOT / "data" / "chapters" / "ch13.json"


def save(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, separators=(",", ":"))
    print(f"  ✓ saved {path.relative_to(ROOT)}")


MEANING_1_33 = {
    "en": {
        "short": "Those for whose sake we desire kingdoms, enjoyments, and pleasures — those very ones stand here in battle, having given up their lives and wealth.",
        "long": "Arjuna turns the longing back on itself: everything he wanted — kingdom, comfort, pleasure — was wanted *for* these people. And those people are now here, ready to die. The word kāṅkṣitam (desired) sits with rājyaṃ bhogāḥ sukhāni — abstract goods — while the next line places ta ime (those very ones) as living, breathing people arrayed on the battlefield having already renounced (tyaktvā) the very things Arjuna thought he was fighting to give them. The grief is not sentimental; it is logical: the means has consumed the end.",
        "wbw": [
            {"word": "yeṣām arthe", "grammar": "gen. pl. + loc.", "meaning": "for whose sake"},
            {"word": "kāṅkṣitam", "grammar": "ppp nom. sg. neuter", "meaning": "desired, wished for"},
            {"word": "naḥ", "grammar": "gen. pl.", "meaning": "by us, our"},
            {"word": "rājyam", "grammar": "nom. sg.", "meaning": "kingdom"},
            {"word": "bhogāḥ", "grammar": "nom. pl.", "meaning": "enjoyments, pleasures"},
            {"word": "sukhāni", "grammar": "nom. pl. neuter", "meaning": "happiness, comforts"},
            {"word": "ca", "grammar": "particle", "meaning": "and"},
            {"word": "te ime", "grammar": "dem. pron. nom. pl.", "meaning": "those very ones, these"},
            {"word": "avasthitāḥ", "grammar": "ppp nom. pl.", "meaning": "standing, arrayed"},
            {"word": "yuddhe", "grammar": "loc. sg.", "meaning": "in battle"},
            {"word": "prāṇān tyaktvā", "grammar": "acc. pl. + gerund", "meaning": "having abandoned their lives"},
            {"word": "dhanāni ca", "grammar": "acc. pl. neuter + particle", "meaning": "and wealth"}
        ]
    },
    "te": {
        "short": "ఎవరికోసం మనం రాజ్యం, భోగాలు, సుఖాలు కోరుకుంటున్నామో — వారే యుద్ధంలో ప్రాణాలు, ధనాలు వదిలిపెట్టి నిలిచి ఉన్నారు.",
        "long": "అర్జునుడు తన కోరికను తిరిగి పరీక్షించుకుంటాడు: రాజ్యం, భోగాలు, సుఖాలు — వీటన్నింటినీ ఈ ప్రజల కోసమే కోరుకున్నాడు. అదే వ్యక్తులు ఇప్పుడు యుద్ధంలో ప్రాణాలు వదిలిపెట్టి నిలిచి ఉన్నారు. సాధనమే లక్ష్యాన్ని మింగివేసింది — ఇది అర్జుని నిజమైన వేదన."
    },
    "sa": {
        "short": "येषामर्थे नः राज्यं भोगाः सुखानि च काङ्क्षितम् — ते इमे युद्धे प्राणांस्त्यक्त्वा धनानि च अवस्थिताः।",
        "long": "अर्जुनः स्वस्य आकाङ्क्षां पुनः परीक्षते। राज्यं, भोगाः, सुखानि — एतत्सर्वम् एतेषाम् अर्थे एव काङ्क्षितम्। ते एव इदानीं युद्धे प्राणांस्त्यक्त्वा अवस्थिताः। साधनम् एव लक्ष्यं ग्रसितवत् — इयं अर्जुनस्य वास्तविका वेदना।"
    }
}

MEANING_13_34 = {
    "en": {
        "short": "Those who know — with the eye of knowledge — the distinction between the field and the knower of the field, and liberation from the nature of beings: they go to the Supreme.",
        "long": "This closing verse of the chapter gathers everything: kṣetra (body-mind field), kṣetrajña (the witnessing Self), and bhūta-prakṛti-mokṣa (freedom from identification with manifest nature). The instrument is jñāna-cakṣuṣā — the eye of knowledge, not sense perception or inference. The one who truly sees the distinction between what is witnessed and the witness is no longer bound by what is witnessed. Yānti te param — they go to the Supreme — is not a future reward but the natural destination of clear seeing: when the knower is known, the Supreme is recognised as already present.",
        "wbw": [
            {"word": "kṣetra-kṣetrajñayoḥ", "grammar": "gen. dual", "meaning": "between the field and the field-knower"},
            {"word": "evam", "grammar": "indeclinable", "meaning": "thus, in this way"},
            {"word": "antaram", "grammar": "acc. sg.", "meaning": "the distinction, difference"},
            {"word": "jñāna-cakṣuṣā", "grammar": "inst. sg.", "meaning": "with the eye of knowledge"},
            {"word": "bhūta-prakṛti-mokṣam", "grammar": "acc. sg.", "meaning": "liberation from the nature of beings"},
            {"word": "ca", "grammar": "particle", "meaning": "and"},
            {"word": "ye", "grammar": "rel. pron. nom. pl.", "meaning": "those who"},
            {"word": "viduḥ", "grammar": "3rd pl. perf. of vid", "meaning": "know"},
            {"word": "yānti", "grammar": "3rd pl. pres. of yā", "meaning": "go, attain"},
            {"word": "te", "grammar": "dem. pron. nom. pl.", "meaning": "they"},
            {"word": "param", "grammar": "acc./nom. neuter", "meaning": "the Supreme, the highest"}
        ]
    },
    "te": {
        "short": "జ్ఞానదృష్టితో క్షేత్రం మరియు క్షేత్రజ్ఞుని మధ్య భేదాన్ని, భూతప్రకృతి నుండి మోక్షాన్ని తెలుసుకున్నవారు పరమాన్ని పొందుతారు.",
        "long": "ఈ అధ్యాయపు చివరి శ్లోకం అన్నింటినీ సంగ్రహిస్తుంది: క్షేత్రం (శరీర-మనో వ్యవస్థ), క్షేత్రజ్ఞుడు (సాక్షి ఆత్మ), మరియు భూతప్రకృతి మోక్షం (ప్రకృతితో తాదాత్మ్యం నుండి విముక్తి). జ్ఞానచక్షువు — అనుభవ దృష్టి — ఇది సాధనం. సాక్షి ఎవరో తెలిసినప్పుడు, పరమం ఇప్పటికే ఉన్నట్టు గుర్తింపబడుతుంది."
    },
    "sa": {
        "short": "ये जनाः ज्ञानचक्षुषा क्षेत्रक्षेत्रज्ञयोः अन्तरं भूतप्रकृतिमोक्षं च विदुः — ते परं यान्ति।",
        "long": "अयम् अध्यायस्य अन्तिमः श्लोकः सर्वं संगृह्णाति: क्षेत्रम् (देहमनोव्यवस्था), क्षेत्रज्ञः (साक्षी आत्मा), भूतप्रकृतिमोक्षश्च (प्रकृत्या तादात्म्यात् मुक्तिः)। साधनं ज्ञानचक्षुः — इन्द्रियज्ञानं न, अनुमानं न। साक्षी विज्ञातः चेत् परमं स्वतः सिद्धम्।"
    }
}


def add_to_chapter(path, shloka_s, meaning):
    d = json.load(open(path, encoding="utf-8"))
    by_s = {sh["s"]: sh for sh in d["shlokas"]}
    if shloka_s not in by_s:
        print(f"  ERROR: s={shloka_s} not found in {path.name}")
        return
    by_s[shloka_s]["meaning"] = meaning
    print(f"  Added meaning for s={shloka_s}")
    save(path, d)


if __name__ == "__main__":
    print("Adding BG 1.33 meaning …")
    add_to_chapter(CH01, 33, MEANING_1_33)

    print("\nAdding BG 13.34 meaning …")
    add_to_chapter(CH13, 34, MEANING_13_34)
