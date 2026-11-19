/* Looping mini-demos that show each service in action.
   Everything is drawn in an 800×500 design space and scaled to the target canvas. */

const C = {
  bg: '#0c0c0e', panel: '#17171a', panel2: '#202024', line: '#2a2a2f',
  text: '#f4f4f5', muted: '#71717a', dim: '#3f3f46', a: '#9d8cff', ok: '#4ade80',
};
const FONT = '"Space Grotesk Variable", "Space Grotesk", system-ui, sans-serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);
/** 0→1 as p moves from `start` over `dur` */
const step = (p, start, dur = 0.06) => easeOut(clamp((p - start) / dur));

function rr(c, x, y, w, h, r, fill) {
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  if (fill) { c.fillStyle = fill; c.fill(); }
}
function appear(c, k, fn) {
  if (k <= 0) return;
  c.save();
  c.globalAlpha *= k;
  c.translate(0, (1 - k) * 14);
  fn();
  c.restore();
}

/* ---------- 0 · website being built ---------- */
function web(c, t) {
  // the loop starts with the header and headline already built, so the frame is never empty
  const p = 0.2 + ((t % 6) / 6) * 0.8;
  c.fillStyle = C.bg; c.fillRect(0, 0, 800, 500);
  rr(c, 0, 0, 800, 44, 0, C.panel);
  ['#3f3f46', '#34343a', '#2a2a2f'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(24 + i * 20, 22, 6, 0, 7); c.fill(); });
  rr(c, 110, 11, 420, 22, 11, C.panel2);
  c.fillStyle = C.muted; c.font = `13px ${MONO}`; c.fillText('yourbusiness.com', 128, 27);

  appear(c, step(p, 0.06), () => {
    rr(c, 40, 66, 26, 26, 7, C.a);
    [0, 1, 2].forEach((i) => rr(c, 420 + i * 78, 74, 56, 10, 5, C.dim));
    rr(c, 660, 66, 100, 26, 13, C.text);
  });
  appear(c, step(p, 0.16), () => {
    rr(c, 40, 140, 330, 26, 8, C.text);
    rr(c, 40, 176, 260, 26, 8, C.text);
  });
  appear(c, step(p, 0.24), () => {
    rr(c, 40, 222, 300, 10, 5, C.dim);
    rr(c, 40, 240, 240, 10, 5, C.dim);
  });
  appear(c, step(p, 0.3), () => rr(c, 40, 274, 140, 40, 20, C.a));
  appear(c, step(p, 0.36), () => {
    const g = c.createLinearGradient(430, 120, 760, 320);
    g.addColorStop(0, 'rgba(157,140,255,.55)'); g.addColorStop(1, 'rgba(157,140,255,.08)');
    rr(c, 430, 120, 330, 200, 16, g);
    c.strokeStyle = 'rgba(255,255,255,.12)'; c.lineWidth = 1; c.stroke();
  });
  [0, 1, 2].forEach((i) => appear(c, step(p, 0.44 + i * 0.05), () => {
    rr(c, 40 + i * 245, 350, 225, 120, 14, C.panel);
    rr(c, 60 + i * 245, 372, 40, 40, 10, C.panel2);
    rr(c, 60 + i * 245, 428, 150, 9, 4, C.dim);
    rr(c, 60 + i * 245, 446, 110, 9, 4, C.dim);
  }));
  // a cursor clicks the call-to-action
  const cp = clamp((p - 0.58) / 0.12);
  if (cp > 0) {
    const x = 520 - (520 - 120) * easeOut(cp), y = 420 - (420 - 300) * easeOut(cp);
    if (cp >= 1) {
      const rp = clamp((p - 0.7) / 0.1);
      c.strokeStyle = `rgba(255,255,255,${0.6 * (1 - rp)})`; c.lineWidth = 2;
      c.beginPath(); c.arc(110, 294, 10 + rp * 30, 0, 7); c.stroke();
    }
    c.fillStyle = '#fff';
    c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 22); c.lineTo(x + 6, y + 16); c.lineTo(x + 15, y + 18); c.closePath(); c.fill();
  }
  appear(c, step(p, 0.74), () => {
    rr(c, 640, 120, 120, 30, 15, 'rgba(74,222,128,.15)');
    c.fillStyle = C.ok; c.font = `600 14px ${FONT}`; c.fillText('●  Live', 662, 140);
  });
  appear(c, step(p, 0.8), () => {
    rr(c, 640, 160, 120, 30, 15, 'rgba(157,140,255,.15)');
    c.fillStyle = C.a; c.font = `600 14px ${FONT}`; c.fillText('SEO  98/100', 656, 180);
  });
}

/* ---------- 1 · mobile app (portrait screen, reused by the 3D phone) ---------- */
export function drawPhoneScreen(c, w, h, t) {
  c.save();
  c.scale(w / 360, h / 720);
  const p = (t % 6) / 6;
  c.fillStyle = '#0f0f12'; c.fillRect(0, 0, 360, 720);
  c.fillStyle = C.text; c.font = `600 14px ${FONT}`; c.fillText('9:41', 24, 36);
  rr(c, 300, 26, 36, 12, 4, C.dim);
  c.fillStyle = C.muted; c.font = `14px ${FONT}`; c.fillText("Today's sales", 24, 92);
  const val = Math.round(24800 * easeOut(clamp(p / 0.35)));
  c.fillStyle = C.text; c.font = `700 40px ${FONT}`; c.fillText(`₹ ${val.toLocaleString('en-IN')}`, 24, 140);
  c.fillStyle = C.ok; c.font = `600 14px ${FONT}`; c.fillText('▲ 18% vs yesterday', 24, 168);
  rr(c, 20, 192, 320, 180, 18, C.panel);
  const hs = [0.35, 0.6, 0.45, 0.8, 0.55, 0.95, 0.7];
  hs.forEach((v, i) => {
    const k = easeOut(clamp((p - 0.05 - i * 0.04) / 0.25));
    rr(c, 44 + i * 42, 352 - v * 140 * k, 24, v * 140 * k, 6, i === 5 ? C.a : '#3a3a42');
  });
  ['Order #2041', 'Order #2040', 'Order #2039'].forEach((s, i) => {
    const y = 400 + i * 74;
    rr(c, 20, y, 320, 62, 14, C.panel);
    rr(c, 36, y + 15, 32, 32, 10, i === 0 ? 'rgba(157,140,255,.25)' : C.panel2);
    c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText(s, 82, y + 28);
    c.fillStyle = C.muted; c.font = `13px ${FONT}`; c.fillText(i === 0 ? 'Paid · just now' : 'Paid · today', 82, y + 48);
    c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText(['₹2,400', '₹860', '₹1,150'][i], 262, y + 38);
  });
  // a push notification drops in
  const n = clamp((p - 0.55) / 0.08) - clamp((p - 0.9) / 0.08);
  if (n > 0) {
    const y = -80 + 110 * easeOut(n);
    rr(c, 14, y, 332, 66, 18, 'rgba(36,36,42,.97)');
    rr(c, 28, y + 16, 34, 34, 9, C.a);
    c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText('New order received', 74, y + 30);
    c.fillStyle = C.muted; c.font = `13px ${FONT}`; c.fillText('₹2,400 · paid via UPI', 74, y + 50);
  }
  c.restore();
}
function mobile(c, t) {
  c.fillStyle = C.bg; c.fillRect(0, 0, 800, 500);
  const g = c.createRadialGradient(400, 250, 20, 400, 250, 360);
  g.addColorStop(0, 'rgba(157,140,255,.18)'); g.addColorStop(1, 'rgba(157,140,255,0)');
  c.fillStyle = g; c.fillRect(0, 0, 800, 500);
  rr(c, 300, 22, 200, 456, 32, '#26262b');
  c.save();
  c.beginPath(); c.roundRect(310, 32, 180, 436, 24); c.clip();
  c.translate(310, 32);
  drawPhoneScreen(c, 180, 436, t);
  c.restore();
  const p = (t % 6) / 6;
  appear(c, step(p, 0.1), () => { rr(c, 70, 120, 190, 54, 14, C.panel); c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText('Android + iOS', 90, 152); });
  appear(c, step(p, 0.2), () => { rr(c, 70, 190, 190, 54, 14, C.panel); c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText('Payments & login', 90, 222); });
  appear(c, step(p, 0.3), () => { rr(c, 540, 150, 190, 54, 14, C.panel); c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText('Push notifications', 560, 182); });
  appear(c, step(p, 0.4), () => { rr(c, 540, 220, 190, 54, 14, C.panel); c.fillStyle = C.text; c.font = `600 15px ${FONT}`; c.fillText('Admin dashboard', 560, 252); });
}

/* ---------- 2 · deploy pipeline ---------- */
function devops(c, t) {
  const p = (t % 7) / 7;
  c.fillStyle = C.bg; c.fillRect(0, 0, 800, 500);
  c.fillStyle = C.muted; c.font = `13px ${MONO}`; c.fillText('main · deploy pipeline', 40, 46);
  const nodes = ['Build', 'Test', 'Deploy', 'Live'];
  const xs = nodes.map((_, i) => 110 + i * 193), y = 130;
  c.strokeStyle = C.line; c.lineWidth = 4;
  c.beginPath(); c.moveTo(xs[0], y); c.lineTo(xs[3], y); c.stroke();
  const prog = clamp((p - 0.05) / 0.55);
  c.strokeStyle = C.ok;
  c.beginPath(); c.moveTo(xs[0], y); c.lineTo(xs[0] + (xs[3] - xs[0]) * prog, y); c.stroke();
  nodes.forEach((n, i) => {
    const done = prog >= i / 3 - 0.001;
    c.fillStyle = done ? C.ok : C.panel2;
    c.beginPath(); c.arc(xs[i], y, 26, 0, 7); c.fill();
    c.strokeStyle = done ? C.ok : C.line; c.lineWidth = 2; c.stroke();
    c.fillStyle = done ? '#06210f' : C.muted; c.font = `700 20px ${FONT}`; c.textAlign = 'center';
    c.fillText(done ? '✓' : String(i + 1), xs[i], y + 7);
    c.fillStyle = done ? C.text : C.muted; c.font = `600 15px ${FONT}`;
    c.fillText(n, xs[i], y + 56);
    c.textAlign = 'left';
  });
  if (prog > 0 && prog < 1) {
    c.fillStyle = '#fff';
    c.beginPath(); c.arc(xs[0] + (xs[3] - xs[0]) * prog, y, 7, 0, 7); c.fill();
  }
  rr(c, 40, 226, 720, 150, 14, C.panel);
  const lines = [
    [0.04, '$ git push origin main', C.text],
    [0.2, '✓ build passed in 41s', C.ok],
    [0.36, '✓ 128 tests passed', C.ok],
    [0.52, '✓ deployed to production · 0s downtime', C.ok],
  ];
  c.font = `15px ${MONO}`;
  lines.forEach(([s, txt, col], i) => {
    const k = clamp((p - s) / 0.1);
    if (k <= 0) return;
    c.fillStyle = col;
    c.fillText(txt.slice(0, Math.ceil(txt.length * k)), 64, 262 + i * 30);
  });
  // uptime sparkline
  c.fillStyle = C.muted; c.font = `13px ${FONT}`; c.fillText('Uptime, last 30 days', 40, 410);
  c.fillStyle = C.ok; c.font = `700 22px ${FONT}`; c.fillText('99.98%', 40, 440);
  c.strokeStyle = C.a; c.lineWidth = 2.5; c.beginPath();
  for (let i = 0; i <= 60; i++) {
    const x = 200 + i * 9.3, yy = 440 - 22 - Math.sin(i * 0.7 + t * 2) * 6 - (i % 13 === 0 ? 8 : 0);
    if (i === 0) c.moveTo(x, yy); else c.lineTo(x, yy);
  }
  c.stroke();
}

/* ---------- 3 · AI assistant answering from your documents ---------- */
function ai(c, t) {
  const p = (t % 8) / 8;
  c.fillStyle = C.bg; c.fillRect(0, 0, 800, 500);
  rr(c, 0, 0, 800, 56, 0, C.panel);
  c.fillStyle = C.a; c.beginPath(); c.arc(36, 28, 12, 0, 7); c.fill();
  c.fillStyle = C.text; c.font = `600 16px ${FONT}`; c.fillText('Assistant', 60, 25);
  c.fillStyle = C.muted; c.font = `12px ${FONT}`; c.fillText('trained on your documents', 60, 42);
  appear(c, step(p, 0.04), () => {
    rr(c, 430, 86, 330, 52, 18, C.a);
    c.fillStyle = '#0a0a0a'; c.font = `600 16px ${FONT}`; c.fillText("What's your refund policy?", 452, 118);
  });
  const typing = p > 0.16 && p < 0.34;
  if (typing) {
    rr(c, 40, 160, 90, 44, 18, C.panel);
    [0, 1, 2].forEach((i) => {
      c.fillStyle = C.muted;
      c.beginPath(); c.arc(64 + i * 20, 182 - Math.max(0, Math.sin(t * 8 - i)) * 5, 5, 0, 7); c.fill();
    });
  }
  if (p >= 0.34) {
    const ans = 'Refunds are accepted within 14 days of purchase, as long as the item is unused.';
    const k = clamp((p - 0.34) / 0.3);
    rr(c, 40, 160, 520, 92, 18, C.panel);
    c.fillStyle = C.text; c.font = `16px ${FONT}`;
    const shown = ans.slice(0, Math.ceil(ans.length * k));
    const words = shown.split(' '); let line = '', y = 192;
    words.forEach((wd) => { const test = `${line}${wd} `; if (c.measureText(test).width > 480 && line) { c.fillText(line, 60, y); line = `${wd} `; y += 24; } else line = test; });
    c.fillText(line, 60, y);
  }
  appear(c, step(p, 0.68), () => {
    rr(c, 40, 266, 210, 32, 16, 'rgba(157,140,255,.15)');
    c.fillStyle = C.a; c.font = `600 13px ${FONT}`; c.fillText('📄  refund-policy.pdf · p.3', 56, 287);
  });
  appear(c, step(p, 0.76), () => {
    rr(c, 40, 330, 720, 130, 14, C.panel);
    c.fillStyle = C.muted; c.font = `13px ${MONO}`; c.fillText('n8n workflow', 60, 358);
    const boxes = ['New email', 'AI summary', 'CRM update', 'WhatsApp'];
    boxes.forEach((b, i) => {
      const x = 60 + i * 175, on = p > 0.8 + i * 0.04;
      rr(c, x, 378, 140, 56, 12, on ? 'rgba(157,140,255,.18)' : C.panel2);
      c.fillStyle = on ? C.text : C.muted; c.font = `600 14px ${FONT}`; c.fillText(b, x + 16, 412);
      if (i < 3) { c.fillStyle = on ? C.a : C.dim; c.fillText('→', x + 150, 412); }
    });
  });
}

const DRAW = [web, mobile, devops, ai];

/** Draw service `i` at time `t` (seconds) into a w×h area of context `c`. */
export function drawServiceDemo(c, w, h, i, t) {
  c.save();
  c.scale(w / 800, h / 500);
  DRAW[i](c, t);
  c.restore();
}
