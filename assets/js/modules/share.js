/* share.js — Share verse as image card */

const Share = (() => {
  const W = 900, H = 500;
  const PAD = 52;

  function isDark() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ||
      (document.documentElement.getAttribute('data-theme') === 'auto' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
  }

  function colors() {
    return isDark()
      ? { bg: '#1a1208', card: '#2a1f0f', amber: '#d4943a', text: '#f0e6d0', sub: '#a08060', border: '#3a2a14' }
      : { bg: '#fdf6e8', card: '#fff9ef', amber: '#b8730a', text: '#2c1a0e', sub: '#7a5530', border: '#e8c878' };
  }

  function wrapText(ctx, text, x, y, maxW, lineH) {
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, lineY);
        line = word;
        lineY += lineH;
      } else {
        line = test;
      }
    }
    if (line) { ctx.fillText(line, x, lineY); lineY += lineH; }
    return lineY;
  }

  async function buildCanvas(sh, chTitle, meaning) {
    const canvas = document.createElement('canvas');
    canvas.width  = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    const C   = colors();

    // Background
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, W, H);

    // Card rect
    const cx = PAD, cy = PAD, cw = W - PAD * 2, ch = H - PAD * 2;
    ctx.fillStyle = C.card;
    roundRect(ctx, cx, cy, cw, ch, 18);
    ctx.fill();
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1.5;
    roundRect(ctx, cx, cy, cw, ch, 18);
    ctx.stroke();

    // Left amber bar
    ctx.fillStyle = C.amber;
    roundRect(ctx, cx, cy, 5, ch, [18, 0, 0, 18]);
    ctx.fill();

    const ip = PAD + 30; // inner padding x
    let y = cy + 36;

    // Ref badge: "Bhagavad Gītā · 2.47"
    ctx.font = 'bold 14px system-ui, sans-serif';
    ctx.fillStyle = C.amber;
    ctx.textAlign = 'left';
    const ref = chTitle ? `Bhagavad Gītā · ${sh.c}.${sh.s} — ${chTitle}` : `Bhagavad Gītā · ${sh.c}.${sh.s}`;
    ctx.fillText(ref, ip, y);
    y += 28;

    // Verse padas
    const script = window._script || 'te';
    const padas  = ['p1','p2','p3','p4'].map(k => {
      if (!sh[k]) return '';
      let t = sh[k][script] || sh[k].ro || '';
      if (sh[k].cont) t += '-';
      return t;
    }).filter(Boolean);

    const verseFont = script === 'ro' ? '22px Georgia, serif' : '26px "Noto Sans Telugu", "Noto Sans Devanagari", serif';
    ctx.font = verseFont;
    ctx.fillStyle = C.text;

    for (let i = 0; i < padas.length; i++) {
      let line = padas[i];
      if (i === 1) line += ' ।';
      if (i === 3) line += ` ॥ ${sh.c}.${sh.s} ॥`;
      ctx.fillText(line, ip, y);
      y += 38;
    }

    y += 10;

    // Divider
    ctx.strokeStyle = C.border;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ip, y); ctx.lineTo(W - PAD - 20, y);
    ctx.stroke();
    y += 20;

    // Meaning
    if (meaning) {
      ctx.font = 'italic 15px Georgia, serif';
      ctx.fillStyle = C.sub;
      y = wrapText(ctx, `"${meaning}"`, ip, y, cw - 60, 22);
      y += 8;
    }

    // Footer: attribution
    const footerY = cy + ch - 24;
    ctx.font = '12px system-ui, sans-serif';
    ctx.fillStyle = C.sub;
    ctx.textAlign = 'left';
    ctx.fillText('smruti.samskruti.info', ip, footerY);
    ctx.textAlign = 'right';
    ctx.fillText('🕉', W - PAD - 20, footerY);

    return canvas;
  }

  function roundRect(ctx, x, y, w, h, r) {
    if (typeof r === 'number') r = [r, r, r, r];
    const [tl, tr, br, bl] = r;
    ctx.beginPath();
    ctx.moveTo(x + tl, y);
    ctx.lineTo(x + w - tr, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + tr);
    ctx.lineTo(x + w, y + h - br);
    ctx.quadraticCurveTo(x + w, y + h, x + w - br, y + h);
    ctx.lineTo(x + bl, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - bl);
    ctx.lineTo(x, y + tl);
    ctx.quadraticCurveTo(x, y, x + tl, y);
    ctx.closePath();
  }

  async function shareVerse(sh, chTitle, meaning) {
    const canvas = await buildCanvas(sh, chTitle, meaning);

    // Try native share with image file
    if (navigator.canShare) {
      canvas.toBlob(async blob => {
        const file = new File([blob], `gita-${sh.c}-${sh.s}.png`, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file], title: `Bhagavad Gītā ${sh.c}.${sh.s}` });
            return;
          } catch(e) { if (e.name === 'AbortError') return; }
        }
        // Fallback: download
        downloadCanvas(canvas, sh);
      }, 'image/png');
    } else {
      // Desktop fallback: open in new tab
      const url = canvas.toDataURL('image/png');
      const win = window.open();
      win.document.write(`<img src="${url}" style="max-width:100%"><br><a download="gita-${sh.c}-${sh.s}.png" href="${url}">Download</a>`);
    }
  }

  function downloadCanvas(canvas, sh) {
    const a = document.createElement('a');
    a.download = `gita-${sh.c}-${sh.s}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
  }

  return { shareVerse };
})();
