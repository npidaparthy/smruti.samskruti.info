/* contact.js — Contact modal */

const Contact = (function () {
  const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxa0hLe7kRV3jhmTdvHNf9P8rVntm8wEAa7Xrz0f51mT8LJwrxRtD2Q0yU-m-UsTUrY3A/exec';

  function open() {
    document.getElementById('contact-modal').hidden = false;
    document.getElementById('contact-form')?.querySelector('input[name="name"]')?.focus();
    clearFieldErrors();
  }

  function close() {
    document.getElementById('contact-modal').hidden = true;
    document.getElementById('contact-form')?.reset();
    const status = document.getElementById('contact-status');
    if (status) { status.hidden = true; status.className = 'contact-status'; }
    clearFieldErrors();
  }

  // Per-field inline errors — the browser's own required-field bubble
  // (novalidate-suppressed) follows <html lang> rather than the site's
  // own toggle, so we roll our own, localized to _uiLang like everything
  // else on the page.
  function showFieldError(name, msg) {
    const field = document.querySelector(`#contact-form [name="${name}"]`);
    if (!field) return;
    field.classList.add('field-invalid');
    const errId = 'contact-err-' + name;
    let errEl = document.getElementById(errId);
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.id = errId;
      errEl.className = 'field-error';
      field.insertAdjacentElement('afterend', errEl);
    }
    errEl.textContent = msg;
    errEl.hidden = false;
    field.addEventListener('input', () => {
      field.classList.remove('field-invalid');
      errEl.hidden = true;
    }, { once: true });
  }

  function clearFieldErrors() {
    document.querySelectorAll('#contact-form .field-invalid').forEach(f => f.classList.remove('field-invalid'));
    document.querySelectorAll('#contact-form .field-error').forEach(e => { e.hidden = true; });
  }

  function i18nSelect() {
    const en = window._uiLang === 'en';
    const opts = {
      contact_sub_feedback: en ? 'Feedback & Suggestions'   : 'సూచనలు & అభిప్రాయం',
      contact_sub_gita:     en ? 'Gītā Verse Correction'    : 'గీత శ్లోక సవరణ',
      contact_sub_vsn:      en ? 'VSN Name Correction'      : 'VSN నామ సవరణ',
      contact_sub_thanks:   en ? 'Thanks & Appreciation'    : 'కృతజ్ఞత',
      contact_sub_tech:     en ? 'Technical Issue'          : 'సాంకేతిక సమస్య',
      contact_sub_other:    en ? 'Other'                    : 'ఇతర',
    };
    document.querySelectorAll('#contact-form select[name="subject"] option').forEach(opt => {
      const key = opt.getAttribute('data-i18n');
      if (key && opts[key]) opt.textContent = opts[key];
    });
  }

  async function submit(e) {
    e.preventDefault();
    const form   = e.target;
    const btn    = form.querySelector('.btn-submit');
    const status = document.getElementById('contact-status');
    const en     = window._uiLang === 'en';

    btn.disabled = true;
    status.hidden = true;
    clearFieldErrors();

    const fd = new FormData(form);
    const payload = {
      name:    (fd.get('name') || '').trim(),
      email:   (fd.get('email') || '').trim(),
      subject: fd.get('subject'),
      message: (fd.get('message') || '').trim(),
      lang:    window._uiLang || 'te',
      site:    fd.get('site'),
    };

    // Per-field validation — the form's own required-field checks are
    // suppressed (novalidate), on purpose: the browser's native tooltip
    // follows <html lang="te"> rather than the site's own toggle, so we
    // do this ourselves and stay in sync with _uiLang.
    let valid = true;
    if (!payload.name)    { showFieldError('name',    en ? 'Please enter your name' : 'దయచేసి మీ పేరు నమోదు చేయండి'); valid = false; }
    if (!payload.email)   { showFieldError('email',   en ? 'Please enter your email' : 'దయచేసి మీ ఇమెయిల్ నమోదు చేయండి'); valid = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      showFieldError('email', en ? 'Please enter a valid email' : 'సరైన ఇమెయిల్ నమోదు చేయండి'); valid = false;
    }
    if (!payload.message) { showFieldError('message', en ? 'Please enter your message' : 'దయచేసి మీ సందేశం నమోదు చేయండి'); valid = false; }
    if (!valid) { btn.disabled = false; return; }

    // Fire and forget — no-cors means we can't read the response anyway
    fetch(APPS_SCRIPT_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    });

    // Show success immediately
    form.reset();
    btn.disabled = false;
    status.textContent = en ? '✓ Message sent! We\'ll get back to you soon.' : '✓ సందేశం పంపబడింది! త్వరలో స్పందిస్తాం.';
    status.className = 'contact-status ok';
    status.hidden = false;
    setTimeout(close, 2500);
  }

  function init() {
    document.getElementById('footer-contact-btn')?.addEventListener('click', e => { e.preventDefault(); open(); });
    document.getElementById('settings-contact-btn')?.addEventListener('click', e => { e.preventDefault(); open(); });
    document.getElementById('contact-close')?.addEventListener('click', close);
    document.getElementById('contact-modal')?.addEventListener('click', e => { if (e.target.id === 'contact-modal') close(); });
    document.getElementById('contact-form')?.addEventListener('submit', submit);
    window.addEventListener('uiLangChange', () => { i18nSelect(); });
    i18nSelect();
  }

  return { init };
})();
