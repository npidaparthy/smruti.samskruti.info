/* app.js — top-level init: tabs, help, SW registration */

(function () {
  // ── Tab routing ───────────────────────────────────────────────
  const panels = ['reader','avadhanam','meanings','search','quiz','calendar','library','settings','help-panel'];
  let prevTab = 'reader';

  function switchTab(id) {
    panels.forEach(p => {
      const el = document.getElementById(p);
      const btn = document.querySelector(`.tab-btn[data-tab="${p}"]`);
      if (el) el.classList.toggle('active', p === id);
      if (btn) btn.classList.toggle('active', p === id);
    });
  }

  document.querySelectorAll('.tab-btn[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      // Issue #3: settings toggles open/closed
      if (tab === 'settings') {
        const isOpen = document.getElementById('settings')?.classList.contains('active');
        switchTab(isOpen ? (prevTab || 'reader') : 'settings');
        return;
      }
      prevTab = tab;
      switchTab(tab);
    });
  });

  // ── Help panel ────────────────────────────────────────────────
  function showHelp() {
    switchTab('help-panel');
    window.scrollTo(0, 0);
  }

  document.getElementById('r-help-btn')?.addEventListener('click', showHelp);
  document.getElementById('help-back-btn')?.addEventListener('click', () => {
    switchTab(prevTab || 'reader');
  });
  document.getElementById('help-top-btn')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('showHelp', () => showHelp());

  // Search result navigation → switch to Reader at the right verse
  window.addEventListener('searchNavigate', e => {
    const { text, sh, ch, s } = e.detail;
    switchTab('reader');
    prevTab = 'reader';
    window.scrollTo(0, 0);
    // Delegate to Reader to navigate
    window.dispatchEvent(new CustomEvent('readerNavigate', { detail: e.detail }));
  });

  // Help lang toggle
  document.getElementById('help-lang-te')?.addEventListener('click', () => {
    document.getElementById('help-video-te').style.display = '';
    document.getElementById('help-video-en').style.display = 'none';
    document.getElementById('help-text-te').style.display = '';
    document.getElementById('help-text-en').style.display = 'none';
    document.getElementById('help-lang-te').classList.add('active');
    document.getElementById('help-lang-en').classList.remove('active');
  });
  document.getElementById('help-lang-en')?.addEventListener('click', () => {
    document.getElementById('help-video-te').style.display = 'none';
    document.getElementById('help-video-en').style.display = '';
    document.getElementById('help-text-te').style.display = 'none';
    document.getElementById('help-text-en').style.display = '';
    document.getElementById('help-lang-te').classList.remove('active');
    document.getElementById('help-lang-en').classList.add('active');
  });

  // Help search
  document.getElementById('help-search')?.addEventListener('input', function () {
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('.help-section').forEach(sec => {
      let anyVisible = false;
      sec.querySelectorAll('.help-item').forEach(item => {
        const match = !q || item.textContent.toLowerCase().includes(q);
        item.style.display = match ? '' : 'none';
        if (match) anyVisible = true;
      });
      sec.style.display = anyVisible ? '' : 'none';
      if (q && anyVisible) sec.open = true;
    });
  });

  // Show correct help video based on UI lang
  function syncHelpLang() {
    const lang = window._uiLang || 'te';
    const isTe = lang === 'te';
    document.getElementById('help-video-te').style.display = isTe ? '' : 'none';
    document.getElementById('help-video-en').style.display = isTe ? 'none' : '';
    document.getElementById('help-text-te').style.display  = isTe ? '' : 'none';
    document.getElementById('help-text-en').style.display  = isTe ? 'none' : '';
    document.getElementById('help-lang-te').classList.toggle('active', isTe);
    document.getElementById('help-lang-en').classList.toggle('active', !isTe);
  }
  window.addEventListener('uiLangChange', syncHelpLang);

  // ── Keyboard shortcuts ────────────────────────────────────────
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    const activePanel = panels.find(p => document.getElementById(p)?.classList.contains('active'));

    if (activePanel === 'avadhanam') {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('a-reveal')?.click();
      } else if (e.key === 'ArrowLeft') {
        document.getElementById('a-prev')?.click();
      } else if (e.key === 'ArrowRight') {
        document.getElementById('a-next')?.click();
      } else if (e.key === 'r' || e.key === 'R') {
        document.getElementById('a-random')?.click();
      }
    } else if (activePanel === 'reader') {
      if (e.key === 'ArrowLeft') document.getElementById('r-prev')?.click();
      else if (e.key === 'ArrowRight') document.getElementById('r-next')?.click();
      else if (e.key === 'r' || e.key === 'R') document.getElementById('r-random')?.click();
    }
  });

  // ── Service Worker ────────────────────────────────────────────
  // Most users install this as a homescreen PWA and reopen it cold (no
  // tab left open across a deploy) — a dismissible "update available"
  // banner they'd have to notice and tap doesn't reach them. Instead,
  // reload automatically the moment a new service worker takes control
  // (fires on both a live tab that was open during a deploy, and a cold
  // homescreen reopen that triggers the browser's own SW update check).
  // No button, no tap — just a brief toast so the reload doesn't look
  // like a blank-screen glitch. `swRefreshing` stops a reload loop, since
  // `controllerchange` can in principle fire more than once.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
      .then(reg => {
        console.log('SW registered');
        reg.update().catch(() => {});
      })
      .catch(err => console.warn('SW registration failed', err));

    let swRefreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (swRefreshing) return;
      swRefreshing = true;

      const toast = document.createElement('div');
      toast.id = 'sw-update-toast';
      toast.textContent = window._uiLang === 'en' ? 'Updating…' : 'అప్‌డేట్ అవుతోంది…';
      document.body.appendChild(toast);

      const reloadNow = () => location.reload();
      const active = document.activeElement;
      const isTyping = active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT');
      if (isTyping) {
        // Don't yank an in-progress note away — reload once they blur,
        // but don't let the app sit stale forever if they never do.
        const onBlur = () => { active.removeEventListener('blur', onBlur); setTimeout(reloadNow, 400); };
        active.addEventListener('blur', onBlur);
        setTimeout(reloadNow, 30000);
      } else {
        setTimeout(reloadNow, 600);
      }
    });
  }

  // ── Bootstrap ─────────────────────────────────────────────────
  Settings.init();
  Settings.loadBuildBadge();
  Reader.init();
  Avadhaanam.init();
  Calendar.init();
  Search.init();
  Quiz.init();
  Library.init();
  Contact.init();
  NamesReview.init();
  syncHelpLang();

  console.log('smruti.samskruti.info initialised ✓');
})();
