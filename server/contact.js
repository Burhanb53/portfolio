import nodemailer from 'nodemailer';

/* Contact form backend: validates a submission and sends two emails through Gmail SMTP
   (a notification to the owner, a confirmation to the visitor).
   Config comes only from environment variables, never from the client:
     GMAIL_USER          the Gmail address that sends (and receives) the mail
     GMAIL_APP_PASSWORD  a Google App Password for that account
     CONTACT_TO          optional, where notifications go (defaults to GMAIL_USER)
     SITE_URL            optional, linked from the confirmation email
     MAIL_DRY_RUN=1      build the emails without sending (for local design checks) */

const TOPICS = ['a website', 'a web app', 'a mobile app', 'DevOps / cloud help', 'automation / AI'];
const WHATSAPP = 'https://wa.me/971562708253';
const OWNER = 'Burhanuddin Bohra';

const C = {
  bg: '#08080a', card: '#121215', card2: '#1a1a1e', line: '#26262b',
  text: '#f4f4f5', muted: '#a1a1aa', dim: '#71717a', a: '#9d8cff', wa: '#25d366',
};
const FONT = "'Space Grotesk','Segoe UI',Helvetica,Arial,sans-serif";
const MONO = "'JetBrains Mono',Consolas,'Courier New',monospace";

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const oneLine = (s) => String(s ?? '').replace(/[\r\n\t]+/g, ' ').trim();
const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]{1,64}@[a-z0-9.-]{1,253}\.[a-z]{2,24}$/i;

/* best-effort per-instance rate limit: 3 submissions per IP per 10 minutes */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now(), win = 10 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 3;
}

/* duplicate guard: the same submission id, or the same email + message, is only emailed once per 10 minutes */
const recent = new Map();
function markSeen(id, d) {
  const now = Date.now(), win = 10 * 60 * 1000;
  for (const [k, t] of recent) if (now - t > win) recent.delete(k);
  const keys = [`m:${d.email.toLowerCase()}|${d.message}`];
  if (id) keys.push(`id:${id}`);
  if (keys.some((k) => recent.has(k))) return null;
  keys.forEach((k) => recent.set(k, now));
  return keys;
}

export function validate(body) {
  const b = body && typeof body === 'object' ? body : {};
  if (b.company) return { spam: true };
  const name = oneLine(b.name).slice(0, 80);
  const email = oneLine(b.email).slice(0, 254);
  const topic = TOPICS.includes(b.topic) ? b.topic : TOPICS[0];
  const message = String(b.message ?? '').replace(/\r\n/g, '\n').trim().slice(0, 3000);
  const errors = {};
  if (name.length < 2) errors.name = 'Please tell me your name.';
  if (!EMAIL_RE.test(email)) errors.email = 'That email doesn’t look right.';
  if (message.length < 10) errors.message = 'A few more words, please (10+ characters).';
  return Object.keys(errors).length ? { errors } : { data: { name, email, topic, message } };
}

/* ---------- email layout (table-based with inline styles so it renders in Gmail/Outlook/Apple Mail) ---------- */
function shell({ preheader, body }) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark"><meta name="supported-color-schemes" content="dark"><title>${esc(preheader)}</title></head>
<body style="margin:0;padding:0;background:${C.bg};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};"><tr><td align="center" style="padding:32px 14px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
  <tr><td style="padding:0 4px 18px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="width:34px;height:34px;border-radius:10px;background:${C.a};color:#0a0a0a;font:700 18px ${FONT};text-align:center;vertical-align:middle;">B</td>
      <td style="padding-left:10px;font:600 15px ${MONO};color:${C.text};">burhanb53<span style="color:${C.dim};">.dev</span></td>
    </tr></table>
  </td></tr>
  <tr><td style="background:${C.card};border:1px solid ${C.line};border-radius:20px;overflow:hidden;">
    <div style="height:3px;background:${C.a};line-height:3px;font-size:0;">&nbsp;</div>
    <div style="padding:30px 28px 28px;">${body}</div>
  </td></tr>
  <tr><td style="padding:18px 6px 0;font:12px ${MONO};color:${C.dim};text-align:center;line-height:1.7;">
    ${OWNER} · Software engineer · Dubai, UAE<br>Web apps · Mobile apps · Cloud · Automation
  </td></tr>
</table></td></tr></table></body></html>`;
}
const kicker = (t) => `<div style="font:12px ${MONO};letter-spacing:.06em;text-transform:uppercase;color:${C.a};">${esc(t)}</div>`;
const h1 = (t) => `<h1 style="margin:10px 0 0;font:700 26px/1.2 ${FONT};letter-spacing:-.02em;color:${C.text};">${t}</h1>`;
const p = (t, mt = 14) => `<p style="margin:${mt}px 0 0;font:15px/1.65 ${FONT};color:${C.muted};">${t}</p>`;
const btn = (href, label, bg, fg) => `<a href="${esc(href)}" style="display:inline-block;padding:13px 22px;border-radius:999px;background:${bg};color:${fg};font:600 15px ${FONT};text-decoration:none;margin:0 8px 8px 0;">${label}</a>`;
const row = (label, value) => `<tr>
  <td style="padding:12px 0;border-bottom:1px solid ${C.line};width:96px;vertical-align:top;font:11px ${MONO};letter-spacing:.06em;text-transform:uppercase;color:${C.dim};">${label}</td>
  <td style="padding:12px 0 12px 12px;border-bottom:1px solid ${C.line};font:15px/1.5 ${FONT};color:${C.text};">${value}</td></tr>`;
const quote = (t) => `<div style="margin-top:18px;padding:16px 18px;border-radius:14px;background:${C.card2};border:1px solid ${C.line};font:15px/1.65 ${FONT};color:${C.text};white-space:pre-wrap;">${esc(t)}</div>`;

export function ownerEmail(d) {
  const when = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Dubai', dateStyle: 'medium', timeStyle: 'short' });
  const reply = `mailto:${d.email}?subject=${encodeURIComponent(`Re: your enquiry about ${d.topic}`)}`;
  const html = shell({
    preheader: `${d.name} is looking for ${d.topic}`,
    body: kicker('New enquiry from your portfolio')
      + h1(`${esc(d.name)} is looking for <span style="color:${C.a};">${esc(d.topic)}</span>`)
      + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:20px;border-top:1px solid ${C.line};">
          ${row('Name', esc(d.name))}
          ${row('Email', `<a href="mailto:${esc(d.email)}" style="color:${C.a};text-decoration:none;">${esc(d.email)}</a>`)}
          ${row('Looking for', esc(d.topic))}
          ${row('Received', `${esc(when)} (Dubai)`)}
        </table>`
      + `<div style="margin-top:22px;font:11px ${MONO};letter-spacing:.06em;text-transform:uppercase;color:${C.dim};">Message</div>`
      + quote(d.message)
      + `<div style="margin-top:24px;">${btn(reply, `Reply to ${esc(d.name.split(' ')[0])}`, C.a, '#0a0a0a')}</div>`
      + p('Replying to this email goes straight to them.', 6),
  });
  const text = `New enquiry from your portfolio\n\nName: ${d.name}\nEmail: ${d.email}\nLooking for: ${d.topic}\nReceived: ${when} (Dubai)\n\n${d.message}\n`;
  return { subject: `New enquiry: ${d.topic} · ${d.name}`, html, text };
}

export function visitorEmail(d, siteUrl) {
  const first = d.name.split(' ')[0];
  const steps = [
    ['01', 'I read your message', 'and reply within a few hours, Dubai time.'],
    ['02', 'A short call', 'to understand your goal, users and budget.'],
    ['03', 'A clear plan', 'with timeline and cost, before any work starts.'],
  ].map(([n, t, s]) => `<tr>
      <td style="width:40px;vertical-align:top;padding:8px 0;"><div style="width:30px;height:30px;border-radius:9px;background:rgba(157,140,255,.16);color:${C.a};font:600 12px/30px ${MONO};text-align:center;">${n}</div></td>
      <td style="padding:8px 0 8px 6px;font:15px/1.5 ${FONT};color:${C.muted};"><b style="color:${C.text};font-weight:600;">${t}</b> ${s}</td></tr>`).join('');
  const html = shell({
    preheader: `Thanks ${first}, your message reached me. Here's what happens next.`,
    body: kicker('Message received')
      + h1(`Thanks ${esc(first)}, I got your message.`)
      + p(`You're looking for <b style="color:${C.text};font-weight:600;">${esc(d.topic)}</b>. I'll personally reply to <span style="color:${C.text};">${esc(d.email)}</span> soon.`)
      + `<div style="margin-top:22px;font:11px ${MONO};letter-spacing:.06em;text-transform:uppercase;color:${C.dim};">What happens next</div>`
      + `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:6px;">${steps}</table>`
      + p('Need a faster answer? Message me on WhatsApp.', 18)
      + `<div style="margin-top:16px;">${btn(WHATSAPP, 'Chat on WhatsApp', C.wa, '#04210e')}${siteUrl ? btn(siteUrl, 'See my work', C.card2, C.text) : ''}</div>`
      + `<p style="margin:22px 0 0;font:15px/1.6 ${FONT};color:${C.text};">Talk soon,<br><b>${OWNER}</b></p>`,
  });
  const text = `Thanks ${first}, I got your message.\n\nYou're looking for ${d.topic}. I'll personally reply to ${d.email} within a few hours (Dubai time).\n\nNeed a faster answer? WhatsApp: ${WHATSAPP}\n\nTalk soon,\n${OWNER}\n`;
  return { subject: `Thanks ${first}, I got your message`, html, text };
}

/* ---------- request handling, shared by the Vercel function and the Vite dev server ---------- */
export async function handleContact(body, ip, env = process.env) {
  if (rateLimited(ip || 'unknown')) return { status: 429, json: { ok: false, error: 'Too many messages. Please try again in a few minutes or use WhatsApp.' } };
  const v = validate(body);
  if (v.spam) return { status: 200, json: { ok: true } };
  if (v.errors) return { status: 400, json: { ok: false, errors: v.errors } };
  const d = v.data;
  const id = typeof body?.id === 'string' ? body.id.slice(0, 64) : '';
  const user = env.GMAIL_USER, pass = env.GMAIL_APP_PASSWORD;
  const dry = env.MAIL_DRY_RUN === '1';
  if (!dry && (!user || !pass)) return { status: 503, json: { ok: false, error: 'Email is not configured yet.' } };
  const seenKeys = markSeen(id, d);
  if (!seenKeys) return { status: 200, json: { ok: true, duplicate: true } };

  const owner = ownerEmail(d), visitor = visitorEmail(d, env.SITE_URL || 'https://burhanb53.dev');
  if (dry) return { status: 200, json: { ok: true, dryRun: true, owner, visitor } };

  const transport = nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
  const from = { name: OWNER, address: user };
  try {
    await transport.sendMail({ from, to: env.CONTACT_TO || user, replyTo: { name: d.name, address: d.email }, subject: owner.subject, html: owner.html, text: owner.text });
  } catch (err) {
    console.error('contact: owner email failed', err?.message);
    seenKeys.forEach((k) => recent.delete(k));
    return { status: 502, json: { ok: false, error: 'Could not send right now. Please try WhatsApp.' } };
  }
  try {
    await transport.sendMail({ from, to: { name: d.name, address: d.email }, replyTo: from, subject: visitor.subject, html: visitor.html, text: visitor.text });
  } catch (err) {
    console.error('contact: confirmation email failed', err?.message);
  }
  return { status: 200, json: { ok: true } };
}
