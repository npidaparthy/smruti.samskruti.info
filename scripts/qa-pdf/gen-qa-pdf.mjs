#!/usr/bin/env node
/* gen-qa-pdf.mjs — renders a BG chapter's Q&A (data/quiz/bg/chNN/*.json,
 * against data/bg/content/chapters/chNN.json) into qa/pdf/bg-chNN-te.pdf.
 *
 * Usage: node gen-qa-pdf.mjs --chapter 1 --chrome /path/to/chrome [--repo /path/to/repo]
 *
 * Telugu-only (matches the hand-shared PDFs this mirrors). Requires
 * puppeteer-core (see package.json) so it can drive an already-installed
 * Chrome/Chromium via CDP and set a custom footer (page.pdf's
 * displayHeaderFooter/footerTemplate) — plain `chrome --print-to-pdf` on
 * the CLI cannot customize footer text, only toggle Chrome's own default
 * (which shows the source file path, not what we want).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function parseArgs(argv) {
  const args = { repo: path.resolve(__dirname, '../..') };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--chapter') args.chapter = parseInt(argv[++i], 10);
    else if (argv[i] === '--chrome') args.chrome = argv[++i];
    else if (argv[i] === '--repo') args.repo = argv[++i];
    else if (argv[i] === '--out') args.out = argv[++i];
  }
  if (!args.chapter) throw new Error('--chapter <N> is required');
  if (!args.chrome) throw new Error('--chrome <path> is required');
  return args;
}

function pad2(n) { return String(n).padStart(2, '0'); }

function readJSON(p) {
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function verseText(v) {
  return ['p1', 'p2', 'p3', 'p4'].filter(k => v[k]).map(k => v[k].te).join(' | ');
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function loadChapterQuiz(repo, ch) {
  const chTag = `ch${pad2(ch)}`;
  const chData = readJSON(path.join(repo, `data/bg/content/chapters/${chTag}.json`));
  if (!chData) throw new Error(`missing data/bg/content/chapters/${chTag}.json`);

  const quizDir = path.join(repo, `data/quiz/bg/${chTag}`);
  if (!fs.existsSync(quizDir)) throw new Error(`missing data/quiz/bg/${chTag}/`);

  const quizByVerse = {};
  for (const v of chData.shlokas) {
    const s = v.s;
    let all = readJSON(path.join(quizDir, `${ch}.${s}.json`)) || [];
    for (const suffix of ['a', 'b', 'c']) {
      const extra = readJSON(path.join(quizDir, `${ch}.${s}${suffix}.json`));
      if (extra) all = all.concat(extra);
      else break;
    }
    if (all.length) quizByVerse[s] = all;
  }
  return { chData, quizByVerse };
}

function buildHTML(ch, chData, quizByVerse) {
  const titleTe = chData.title.te;
  const titleSa = chData.title.sa;
  let qnum = 0;
  const blocks = [];

  for (const v of chData.shlokas) {
    const quiz = quizByVerse[v.s];
    if (!quiz || !quiz.length) continue;

    blocks.push(`<h3 class="vs">శ్లోకం ${ch}.${v.s}</h3>`);
    blocks.push(`<div class="verse-block">
      <div class="verse-sa">${esc(verseText(v))}</div>
      <div class="verse-meaning">${esc(v.meaning.te.short)}</div>
    </div>`);

    for (const q of quiz) {
      qnum++;
      const choices = q.choices.map(c => {
        const cls = c.correct ? 'correct-choice' : '';
        const mark = c.correct ? '✅' : '◻️';
        return `<li class="${cls}">${mark} ${c.id}) ${esc(c.te)}</li>`;
      }).join('');
      const correct = q.choices.find(c => c.correct);
      blocks.push(`<div class="q-block">
        <div><span class="q-num">ప్రశ్న ${qnum}.</span> ${esc(q.q.te)}</div>
        <ul class="choices">${choices}</ul>
        <div class="answer">సరైన సమాధానం: ${correct.id}) ${esc(correct.te)}</div>
        <div class="explain"><b>వివరణ:</b> ${esc(q.explanation.te)}</div>
      </div>`);
    }
    blocks.push('<hr>');
  }

  return `<!doctype html><html lang="te"><head><meta charset="utf-8">
<title>Bhagavad Gita Chapter ${ch} - Q&A</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: "Noto Sans Telugu", "Noto Serif Devanagari", "Georgia", serif; color:#2a1d0e; line-height:1.6; font-size: 12.5px; margin: 0; }
  h1 { font-size: 22px; color:#8b5e15; margin: 0 0 4px; text-align:center; }
  h2.chsub { font-size: 15px; color:#a87f24; text-align:center; margin: 0 0 4px; font-weight:600; }
  .meta { text-align:center; color:#8a6d34; font-size:11px; margin-bottom: 18px; }
  hr { border:none; border-top:1px solid #d9c48f; margin: 18px 0; }
  .verse-block { background:#faf3e2; border-left:4px solid #c8a84b; border-radius:6px; padding:10px 14px; margin: 10px 0 16px; page-break-inside: avoid; }
  h3.vs { font-size:16px; color:#7a4f10; margin: 22px 0 8px; }
  .verse-sa { font-size: 14px; margin-bottom:4px; }
  .verse-meaning { font-size:12px; color:#5a4322; }
  .q-block { margin: 14px 0 18px; page-break-inside: avoid; }
  .q-num { font-weight:700; color:#2a1d0e; }
  ul.choices { list-style:none; padding-left: 4px; margin: 6px 0; }
  ul.choices li { margin: 3px 0; padding-left: 4px; }
  .correct-choice { color:#1d6b3a; font-weight:600; }
  .answer { margin-top:6px; font-weight:700; color:#1d6b3a; }
  .explain { margin-top:4px; color:#4a3a1e; font-size:11.5px; background:#f6efdc; border-radius:6px; padding:7px 10px; }
</style></head><body>
<h1>శ్రీమద్భగవద్గీతా</h1>
<h2 class="chsub">అధ్యాయం ${ch} — ${esc(titleTe)} (${esc(titleSa)})</h2>
<div class="meta">ప్రశ్నోత్తరాలు (Q&amp;A) — స్వీయ అధ్యయనం కోసం &nbsp;·&nbsp; smruti.samskruti.info నుండి సేకరించినది</div>
<hr>
${blocks.join('\n')}
</body></html>`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { chData, quizByVerse } = loadChapterQuiz(args.repo, args.chapter);
  const html = buildHTML(args.chapter, chData, quizByVerse);

  const outPath = args.out || path.join(args.repo, `qa/pdf/bg-ch${pad2(args.chapter)}-te.pdf`);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const browser = await puppeteer.launch({ executablePath: args.chrome, headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.pdf({
      path: outPath,
      format: 'A4',
      margin: { top: '20mm', bottom: '18mm', left: '16mm', right: '16mm' },
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      footerTemplate: `
        <div style="width:100%; font-size:8px; font-family:sans-serif; color:#8a6d34; text-align:center; padding-top:2px;">
          smruti.samskruti.info &nbsp;·&nbsp; samskruti.info@gmail.com &nbsp;·&nbsp; <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>`
    });
  } finally {
    await browser.close();
  }

  const qCount = Object.values(quizByVerse).reduce((s, a) => s + a.length, 0);
  console.log(`ch${pad2(args.chapter)}: ${Object.keys(quizByVerse).length} verses, ${qCount} questions -> ${outPath}`);
}

main().catch(e => { console.error(e); process.exit(1); });
