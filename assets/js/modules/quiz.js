/* quiz.js — Quiz tab: multiple-choice questions on Bhagavad Gita verses */

const Quiz = (() => {
  const $ = id => document.getElementById(id);

  let bank = null;          // full question bank
  let session = null;       // { questions, idx, score, answered }
  const SESSION_SIZE = 10;

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

  function lang() {
    return (window._meaningLang === 'sa') ? 'en' : (window._meaningLang || 'en');
  }

  async function startSession() {
    const intro = $('quiz-intro');
    if (intro) intro.style.display = 'none';
    const questions = await loadBank();
    session = {
      questions: shuffle(questions).slice(0, Math.min(SESSION_SIZE, questions.length)),
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
      wrap.innerHTML = '<div class="quiz-empty">ప్రశ్నలు దొరకలేదు · No questions available</div>';
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
      <div class="quiz-progress">${session.idx + 1} / ${session.questions.length} · ${q.verse.c}.${q.verse.s}</div>
      <div class="quiz-question">${q.q[L] || q.q.en}</div>
      <div class="quiz-choices" id="quiz-choices"></div>
      <div class="quiz-explanation" id="quiz-explanation" style="display:none"></div>
      <div class="quiz-actions" id="quiz-actions" style="display:none">
        <button class="btn-submit" id="quiz-next-btn">తదుపరి · Next →</button>
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
        <div class="quiz-summary-score">${session.score} / ${total}</div>
        <div class="quiz-summary-pct">${pct}%</div>
        <button class="btn-submit" id="quiz-restart-btn">మళ్ళీ ప్రారంభించండి · Restart</button>
      </div>`;
    $('quiz-restart-btn').addEventListener('click', startSession);
  }

  function init() {
    const startBtn = $('quiz-start-btn');
    if (!startBtn) return;
    startBtn.addEventListener('click', startSession);
  }

  return { init };
})();
