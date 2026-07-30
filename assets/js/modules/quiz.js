/* quiz.js — Quiz tab: multiple-choice questions on Bhagavad Gita verses */

const Quiz = (() => {
  const $ = id => document.getElementById(id);

  let bank = null;              // full question bank
  let session = null;           // { questions, idx, score, answered }
  let selectedChapters = new Set(); // empty = all chapters
  let questionCount = 10;

  async function loadBank() {
    if (bank) return bank;
    const r = await fetch(C.BG_QUIZ);
    bank = await r.json();
    return bank;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Meaning language drives quiz CONTENT (question/choices/explanation) —
  // these are meanings, same as the rest of the app. UI chrome (buttons,
  // labels) instead follows _uiLang via t(), same as every other tab.
  function lang() {
    return (window._meaningLang === 'sa') ? 'en' : (window._meaningLang || 'en');
  }

  // ── Chapter picker ──────────────────────────────────────────────
  function buildChapterPicker() {
    const wrap = $('quiz-ch-wrap');
    if (!wrap || wrap.dataset.built) return;
    wrap.dataset.built = '1';

    const allBtn = document.createElement('button');
    allBtn.className = 'ch-btn all active';
    allBtn.textContent = t('all');
    allBtn.dataset.i18nAll = '1';
    allBtn.addEventListener('click', () => {
      selectedChapters.clear();
      updateChapterBtnStates();
    });
    wrap.appendChild(allBtn);

    for (let ch = 1; ch <= C.GITA_CHAPTERS; ch++) {
      const btn = document.createElement('button');
      btn.className = 'ch-btn';
      btn.textContent = ch;
      btn.dataset.ch = ch;
      btn.addEventListener('click', () => {
        if (selectedChapters.has(ch)) selectedChapters.delete(ch);
        else selectedChapters.add(ch);
        updateChapterBtnStates();
      });
      wrap.appendChild(btn);
    }
  }

  function updateChapterBtnStates() {
    const wrap = $('quiz-ch-wrap');
    if (!wrap) return;
    wrap.querySelector('.ch-btn.all')?.classList.toggle('active', selectedChapters.size === 0);
    wrap.querySelectorAll('.ch-btn[data-ch]').forEach(btn => {
      btn.classList.toggle('active', selectedChapters.has(+btn.dataset.ch));
    });
  }

  function buildCountPicker() {
    document.querySelectorAll('#quiz-count-group [data-count]').forEach(btn => {
      btn.addEventListener('click', () => {
        questionCount = +btn.dataset.count;
        document.querySelectorAll('#quiz-count-group [data-count]').forEach(b => b.classList.toggle('active', b === btn));
      });
    });
  }

  // ── Session ───────────────────────────────────────────────────
  async function startSession() {
    const intro = $('quiz-intro');
    if (intro) intro.style.display = 'none';

    const questions = await loadBank();
    const pool = selectedChapters.size === 0
      ? questions
      : questions.filter(q => selectedChapters.has(q.verse.c));

    session = {
      questions: shuffle(pool).slice(0, Math.min(questionCount, pool.length)),
      idx: 0,
      score: 0,
      answered: false,
    };
    renderQuestion();
  }

  function renderQuestion() {
    const wrap = $('quiz-content');
    if (!wrap) return;

    if (!session || session.questions.length === 0) {
      wrap.innerHTML = `<div class="quiz-empty">${t('quiz_empty')}</div>`;
      return;
    }

    if (session.idx >= session.questions.length) {
      renderSummary();
      return;
    }

    const L = lang();
    const q = session.questions[session.idx];
    session.answered = false;

    const div = document.createElement('div');
    div.className = 'quiz-card';
    div.innerHTML = `
      <div class="quiz-progress">${session.idx + 1} / ${session.questions.length}</div>
      <div class="quiz-question">${q.q[L] || q.q.en}</div>
      <div class="quiz-choices" id="quiz-choices"></div>
      <div class="quiz-explanation" id="quiz-explanation" style="display:none"></div>
      <div class="quiz-actions" id="quiz-actions" style="display:none">
        <button class="btn-submit" id="quiz-next-btn">${t('quiz_next')}</button>
      </div>`;

    const choicesEl = div.querySelector('#quiz-choices');
    shuffle(q.choices).forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice';
      btn.textContent = choice[L] || choice.en;
      btn.addEventListener('click', () => selectChoice(choice, q, div));
      choicesEl.appendChild(btn);
    });

    wrap.innerHTML = '';
    wrap.appendChild(div);
  }

  function selectChoice(choice, q, cardEl) {
    if (session.answered) return;
    session.answered = true;
    if (choice.correct) session.score++;

    const L = lang();
    cardEl.querySelectorAll('.quiz-choice').forEach(btn => {
      btn.disabled = true;
      if (btn.textContent === (choice[L] || choice.en)) {
        btn.classList.add(choice.correct ? 'quiz-correct' : 'quiz-wrong');
      }
    });
    // Highlight the actual correct choice too, if a wrong one was picked
    if (!choice.correct) {
      const correctChoice = q.choices.find(c => c.correct);
      cardEl.querySelectorAll('.quiz-choice').forEach(btn => {
        if (correctChoice && btn.textContent === (correctChoice[L] || correctChoice.en)) {
          btn.classList.add('quiz-correct');
        }
      });
    }

    const expEl = cardEl.querySelector('#quiz-explanation');
    expEl.textContent = (q.explanation && (q.explanation[L] || q.explanation.en)) || '';
    expEl.style.display = '';
    cardEl.querySelector('#quiz-actions').style.display = '';
    cardEl.querySelector('#quiz-next-btn').addEventListener('click', () => {
      session.idx++;
      renderQuestion();
    });
  }

  function renderSummary() {
    const wrap = $('quiz-content');
    const total = session.questions.length;
    const pct = Math.round((session.score / total) * 100);
    wrap.innerHTML = `
      <div class="quiz-summary">
        <div class="quiz-summary-label">${t('quiz_score')}</div>
        <div class="quiz-summary-score">${session.score} / ${total}</div>
        <div class="quiz-summary-pct">${pct}%</div>
        <button class="btn-submit" id="quiz-restart-btn">${t('quiz_restart')}</button>
      </div>`;
    $('quiz-restart-btn').addEventListener('click', () => {
      const intro = $('quiz-intro');
      if (intro) intro.style.display = '';
      session = null;
      $('quiz-content').innerHTML = '';
    });
  }

  // ── i18n / lang change handling ─────────────────────────────────
  function refreshChrome() {
    const allBtn = $('quiz-ch-wrap')?.querySelector('.ch-btn.all');
    if (allBtn) allBtn.textContent = t('all');
    if (session && !(session.idx >= session.questions.length)) {
      // Re-render current question so chrome (Next button label etc.) updates.
      // If already answered, just relabel the visible buttons in place.
      const nextBtn = $('quiz-next-btn');
      if (nextBtn) nextBtn.textContent = t('quiz_next');
    } else if (session) {
      renderSummary();
    }
  }

  function init() {
    const startBtn = $('quiz-start-btn');
    if (!startBtn) return;

    buildChapterPicker();
    buildCountPicker();
    startBtn.addEventListener('click', startSession);

    window.addEventListener('uiLangChange', refreshChrome);
    window.addEventListener('meaningLangChange', () => {
      if (session && session.idx < session.questions.length) renderQuestion();
    });
  }

  return { init };
})();
