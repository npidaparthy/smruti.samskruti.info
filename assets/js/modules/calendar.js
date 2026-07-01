/* calendar.js — Ekadashi calendar panel */

const Calendar = (function () {
  let data = null;

  // ── Data loading ───────────────────────────────────────────────
  async function loadData() {
    if (data) return data;
    const r = await fetch('/data/ekadashi.json', { cache: 'no-store' });
    data = await r.json();
    return data;
  }

  // ── Date helpers ───────────────────────────────────────────────
  function today() {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function parseDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function diffDays(a, b) {
    return Math.round((b - a) / 86400000);
  }

  function isEn() { return window._uiLang === 'en'; }

  function fmtDate(str) {
    const d = parseDate(str);
    const locale = isEn() ? 'en-IN' : 'te-IN';
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
  }

  // Collect all dates across all years, sorted
  function allDates(ekadashis_map) {
    const all = [];
    Object.entries(ekadashis_map).forEach(([year, list]) => {
      list.forEach(e => all.push({ ...e, year: +year }));
    });
    all.sort((a, b) => a.date.localeCompare(b.date));
    return all;
  }

  function nextEkadashi(all) {
    const t = today();
    return all.find(e => parseDate(e.date) >= t) || null;
  }

  // ── Render ─────────────────────────────────────────────────────
  function renderCountdown(next, infoMap) {
    const el = document.getElementById('cal-countdown');
    if (!el || !next) return;
    const info = infoMap[next.id];
    const days = diffDays(today(), parseDate(next.date));
    const en = isEn();
    const label = days === 0
      ? (en ? 'Today!' : 'నేడే!')
      : days === 1
        ? (en ? 'Tomorrow' : 'రేపు')
        : en ? `${days} days` : `${days} రోజులు`;
    const badge = info?.gita_jayanti ? ' 🌟' : '';
    const name = en ? (info?.name_sa || info?.name_te || next.id) : (info?.name_te || next.id);
    el.innerHTML = `
      <div class="cal-next-label">${en ? 'Next Ekādaśī' : 'తదుపరి ఏకాదశి'}</div>
      <div class="cal-next-name">${name}${badge}</div>
      <div class="cal-next-date">${fmtDate(next.date)}</div>
      <div class="cal-next-days ${days === 0 ? 'cal-today' : ''}">${label}</div>
    `;
  }

  function renderYearSection(year, list, infoMap) {
    const t = today();
    const en = isEn();
    const rows = list.map(e => {
      const info = infoMap[e.id] || {};
      const d = parseDate(e.date);
      const isPast = d < t;
      const isToday = diffDays(t, d) === 0;
      const gitaBadge = en ? '🌟 Gītā Jayantī' : '🌟 గీతా జయంతి';
      const badge = info.gita_jayanti ? `<span class="cal-gita-badge">${gitaBadge}</span>` : '';
      const name = en ? (info.name_sa || info.name_te || e.id) : (info.name_te || e.id);
      const month = en ? (info.month_sa || info.month_te || '') : (info.month_te || '');
      const paksha = en ? (info.paksha_en || info.paksha_te || '') : (info.paksha_te || '');
      return `
        <div class="cal-row ${isPast ? 'cal-past' : ''} ${isToday ? 'cal-today-row' : ''}" data-id="${e.id}">
          <div class="cal-row-date">${fmtDate(e.date)}</div>
          <div class="cal-row-name">
            ${name}
            ${badge}
          </div>
          <div class="cal-row-month">${month} · ${paksha}</div>
        </div>`;
    }).join('');

    return `
      <div class="cal-year-section">
        <div class="cal-year-heading">${year}</div>
        ${rows}
      </div>`;
  }

  function renderCards(ekadashis) {
    const container = document.getElementById('cal-cards');
    if (!container) return;
    const en = isEn();
    container.innerHTML = ekadashis.map(info => {
      const name     = en ? (info.name_sa  || info.name_te)  : info.name_te;
      const month    = en ? (info.month_sa || info.month_te) : info.month_te;
      const paksha   = en ? (info.paksha_en  || info.paksha_te)  : info.paksha_te;
      const deity    = en ? (info.deity_en   || info.deity)       : info.deity;
      const sig      = en ? (info.significance_en || info.significance_te) : info.significance_te;
      const story    = en ? (info.story_en   || info.story_te)   : info.story_te;
      const fasting  = en ? (info.fasting_en || info.fasting_te) : info.fasting_te;
      const gitaBadge = en ? '🌟 Gītā Jayantī' : '🌟 గీతా జయంతి';
      const lblSig    = en ? 'Significance'    : 'ప్రాముఖ్యం';
      const lblStory  = en ? 'Story'           : 'పురాణ కథ';
      const lblFast   = en ? 'Fasting'         : 'ఉపవాస విధి';
      return `
      <details class="cal-card ${info.gita_jayanti ? 'cal-card-gita' : ''}">
        <summary>
          <span class="cal-card-name">${name}</span>
          <span class="cal-card-sa">${en ? info.name_te : info.name_sa}</span>
          ${info.gita_jayanti ? `<span class="cal-gita-badge">${gitaBadge}</span>` : ''}
        </summary>
        <div class="cal-card-body">
          <div class="cal-card-meta">${month} · ${paksha} · ${deity}</div>
          <div class="cal-card-section-label">${lblSig}</div>
          <div class="cal-card-text">${sig}</div>
          <div class="cal-card-section-label">${lblStory}</div>
          <div class="cal-card-text">${story}</div>
          <div class="cal-card-section-label">${lblFast}</div>
          <div class="cal-card-text">${fasting}</div>
        </div>
      </details>`;
    }).join('');
  }

  function renderCalendar(d) {
    const infoMap = {};
    d.ekadashis.forEach(e => { infoMap[e.id] = e; });

    const all = allDates(d.dates);
    const next = nextEkadashi(all);
    renderCountdown(next, infoMap);

    const years = [...new Set(all.map(e => e.year))].sort();
    // Default: year of next ekadashi (or last available year)
    const defaultYear = next ? next.year : years[years.length - 1];

    const calList = document.getElementById('cal-list');
    if (calList) {
      // Build year pill row
      const pillRow = document.createElement('div');
      pillRow.className = 'pill-group cal-year-pills';
      years.forEach(y => {
        const btn = document.createElement('button');
        btn.className = 'pill' + (y === defaultYear ? ' active' : '');
        btn.textContent = y;
        btn.addEventListener('click', () => {
          pillRow.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          showYear(y);
        });
        pillRow.appendChild(btn);
      });

      const listArea = document.createElement('div');
      listArea.id = 'cal-year-area';

      calList.innerHTML = '';
      calList.appendChild(pillRow);
      calList.appendChild(listArea);

      function showYear(y) {
        listArea.innerHTML = renderYearSection(y, d.dates[y] || [], infoMap);
        // Scroll to next upcoming row if in this year
        if (next && next.year === y) {
          setTimeout(() => {
            const row = listArea.querySelector(`[data-id="${next.id}"]`);
            if (row) row.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      }

      showYear(defaultYear);
    }

    renderCards(d.ekadashis);
  }

  // ── Tab views ──────────────────────────────────────────────────
  function setupTabs() {
    const tabs = document.querySelectorAll('.cal-tab-btn');
    const views = document.querySelectorAll('.cal-view');
    tabs.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.calTab;
        tabs.forEach(t => t.classList.toggle('active', t === btn));
        views.forEach(v => v.classList.toggle('active', v.id === 'cal-view-' + target));
      });
    });
  }

  // ── Public ─────────────────────────────────────────────────────
  async function init() {
    const panel = document.getElementById('calendar');
    if (!panel) return;
    try {
      const d = await loadData();
      renderCalendar(d);
      setupTabs();
      window.addEventListener('uiLangChange', () => renderCalendar(d));
    } catch (err) {
      console.error('Calendar load failed', err);
    }
  }

  return { init };
})();
