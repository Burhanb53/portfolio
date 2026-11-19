/* styles and fonts are linked from index.html so they apply before the first paint */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

import { CONTACT, SERVICES, SKILLS, JOURNEY, FILTERS, PROJECTS, MARQUEE } from './data.js';
import { UI, brandSvg, BRAND, brandColor } from './icons.js';
import { drawServiceDemo } from './serviceDemo.js';
import { S, SECTIONS, BRAND_LOGOS } from './state.js';

if (BRAND_LOGOS) document.documentElement.classList.add('brand-logos');

gsap.registerPlugin(ScrollTrigger, SplitText);

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const EASE = 'power3.out';
let menuOpen = false;

/* ================= CONTACT LINKS ================= */
const waLink = (text = "Hi Burhanuddin, I found your portfolio and I'd like to talk.") =>
  `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(text)}`;
const mailLink = (subject = 'Hello from your portfolio', body = '') =>
  `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;

$$('[data-wa]').forEach((a) => { a.href = waLink(); a.target = '_blank'; a.rel = 'noopener'; });
$$('[data-mailto]').forEach((a) => (a.href = mailLink()));
$$('[data-tel]').forEach((a) => (a.href = `tel:${CONTACT.tel}`));
$$('[data-linkedin]').forEach((a) => (a.href = CONTACT.linkedin));
$$('[data-github]').forEach((a) => (a.href = CONTACT.github));
$$('[data-email]').forEach((el) => (el.textContent = CONTACT.email));
$$('[data-phone]').forEach((el) => (el.textContent = CONTACT.phone));
$('#year').textContent = new Date().getFullYear();

/* ================= RENDER CONTENT ================= */
const items = MARQUEE.map((n) => `<span class="marquee-item">${brandSvg(n, 18)}${n}</span>`).join('');
$('#marquee').innerHTML = items + `<span class="dup" aria-hidden="true" style="display:contents">${items}</span>`;

/* ================= SERVICES: four cards, each with a live demo ================= */
$('#svcGrid').innerHTML = SERVICES.map((s, i) => `
  <article class="card svc-card reveal" data-i="${i}">
    <div class="svc-demo"><canvas width="800" height="500" aria-hidden="true"></canvas><span class="svc-goal">${UI.arrowUpRight(13)}${s.goal}</span></div>
    <div class="svc-info">
      <div class="svc-title"><span class="svc-ic">${UI[s.icon](22)}</span><div><h3>${s.name}</h3><p class="svc-sub">${s.title}</p></div></div>
      <ul class="svc-benefits">${s.benefits.map((b) => `<li><i>${UI.check(15)}</i><span>${b}</span></li>`).join('')}</ul>
      <div class="svc-foot">
        <a class="svc-quote" href="${waLink(`Hi Burhanuddin, I'm interested in ${s.name.toLowerCase()} to ${s.goal.toLowerCase()}.`)}" target="_blank" rel="noopener">Let's talk about it ${UI.arrowUpRight(15)}</a>
        <div class="svc-stack" aria-label="Built with">${s.stack.map((n) => `<span title="${n}">${brandSvg(n, 16)}</span>`).join('')}</div>
      </div>
    </div>
  </article>`).join('');


const countFor = (id) => (id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.kind === id).length);
$('#filters').innerHTML = FILTERS.map((f, i) =>
  `<button class="filter" role="tab" aria-selected="${i === 0}" data-f="${f.id}">${f.label}<sup>${countFor(f.id)}</sup></button>`).join('');

const KIND = { app: 'Web app', site: 'Website', mobile: 'Mobile app' };
$('#projects').innerHTML = PROJECTS.map((p) => `
  <article class="card proj" data-kind="${p.kind}" data-id="${p.id}" style="--c:${p.c}" tabindex="0" role="button" aria-label="${p.t}: open project details">
    <div class="proj-thumb${p.phone ? ' phones' : ''}">
      ${p.phone
        ? p.phone.slice(0, 3).map((s) => `<div class="ph"><img src="/${s}" alt="" loading="lazy" decoding="async" width="300" height="640"></div>`).join('')
        : `<img src="/${p.img}" alt="${p.t} screenshot" loading="lazy" decoding="async" width="1200" height="750">`}
      <span class="proj-view">View details ${UI.arrowUpRight(14)}</span>
    </div>
    <div class="proj-body">
      <div class="proj-top"><span class="kind">${KIND[p.kind]}</span><span>${p.url ? p.host : 'private build'}</span></div>
      <h3>${p.t}</h3>
      <p>${p.d}</p>
      <div class="tags">${p.tags.slice(0, 4).map((t) => `<span>${brandSvg(t, 12)}${t}</span>`).join('')}</div>
    </div>
  </article>`).join('');

const brandVar = (n) => (BRAND[n] ? ` style="--brand:${brandColor(BRAND[n].hex)}"` : '');
$('#skTabs').innerHTML = SKILLS.map((g, i) =>
  `<button class="sk-tab" role="tab" data-i="${i}" aria-selected="${i === 0}" aria-controls="skPanel"><span class="tl">${brandSvg(g.logo, 14)}</span>${g.t}</button>`).join('');
function renderSkills(i) {
  const g = SKILLS[i];
  const panel = $('#skPanel');
  const chipStyle = (s, k) => {
    const b = BRAND[s] ? `--brand:${brandColor(BRAND[s].hex)};` : '';
    return ` style="${b}--i:${k}"`;
  };
  panel.innerHTML = `<div class="sk-head"><h3>${g.t}</h3><span>${String(g.s.length).padStart(2, '0')} tools</span></div>
    <div class="chips">${g.s.map((s, k) => `<span class="chip"${chipStyle(s, k)}>${brandSvg(s, 15)}${s}</span>`).join('')}</div>`;
}
renderSkills(0);

$('#timeline').insertAdjacentHTML('beforeend', JOURNEY.map((j) => `
  <li class="tl-item">
    <div class="card tl-card reveal">
      <span class="tl-when">${j.when}</span>
      <h3>${j.role}</h3>
      <div class="tl-org">${j.org}</div>
      <ul>${j.b.map((x) => `<li>${x}</li>`).join('')}</ul>
    </div>
  </li>`).join(''));

$$('i[data-icon]').forEach((i) => { const f = UI[i.dataset.icon]; if (f) i.innerHTML = f(i.closest('.quick-card') ? 20 : 18); });

/* ================= SMOOTH SCROLL ================= */
let lenis = null;
if (!reduced && finePointer) {
  lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}
const headerH = () => $('#header').offsetHeight;
function scrollToHash(hash) {
  const target = hash === '#top' ? 0 : $(hash);
  if (target === null) return;
  if (typeof engaged !== 'undefined' && engaged) { engaged = false; lenis?.start(); releaseUntil = performance.now() + 1400; }
  if (lenis && hash === '#work' && viewerOn()) {
    releaseUntil = performance.now() + 1400;
    lenis.scrollTo(engageY(), { duration: 1.2, onComplete: () => { releaseUntil = 0; engage(0); } });
    return;
  }
  if (lenis) {
    // a menu jump glides past Projects; keep the deck from grabbing the page on the way
    if (typeof releaseUntil !== 'undefined') releaseUntil = Infinity;
    lenis.scrollTo(target, { offset: target === 0 ? 0 : -headerH() - 8, duration: 1.2, onComplete: () => { releaseUntil = performance.now() + 300; lastScroll = scrollY; } });
  } else {
    const y = target === 0 ? 0 : target.getBoundingClientRect().top + scrollY - headerH() - 8;
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const hash = a.getAttribute('href');
  if (hash.length < 2) return;
  e.preventDefault();
  const wasOpen = menuOpen;
  closeMenu();
  setTimeout(() => scrollToHash(hash), wasOpen ? 260 : 0);
  history.replaceState(null, '', hash === '#top' ? location.pathname : hash);
});

/* ================= HEADER, PROGRESS, MOBILE BAR ================= */
const header = $('#header');
const mbar = $('#mbar');
const progress = $('#progress');
let lastY = scrollY;
let contactVisible = false;
function onScroll() {
  const y = scrollY;
  header.classList.toggle('scrolled', y > 16);
  header.classList.toggle('with-chips', y > innerHeight * 0.6);
  if (!menuOpen) header.classList.toggle('hide', y > 500 && y > lastY + 2);
  if (y < lastY - 2) header.classList.remove('hide');
  lastY = y;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  mbar.classList.toggle('show', y > innerHeight * 0.55 && !contactVisible && !menuOpen);
  S.f = computeF();
}

/* scroll progress through the sections (0..5) drives the 3D world */
const secEls = SECTIONS.map((id) => document.getElementById(id));
let secTops = [];
function measure() { secTops = secEls.map((el) => el.getBoundingClientRect().top + scrollY); }
const clamp01 = (v) => Math.max(0, Math.min(1, v));
function computeF() {
  const vh = innerHeight, y = scrollY;
  let f = 0;
  for (let i = 1; i < secTops.length; i++) f += clamp01((y - (secTops[i] - vh * 0.9)) / (vh * 0.75));
  return f;
}
measure();
let refreshT;
new ResizeObserver(() => {
  measure(); S.f = computeF();
  clearTimeout(refreshT);
  refreshT = setTimeout(() => { ScrollTrigger.refresh(); measure(); if (typeof syncActiveSection === 'function') syncActiveSection(); }, 200);
}).observe(document.body);
addEventListener('scroll', onScroll, { passive: true });
onScroll();
const endZones = new Set();
const endIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? endZones.add(e.target) : endZones.delete(e.target)));
  contactVisible = endZones.size > 0;
  onScroll();
}, { rootMargin: '0px 0px -30% 0px' });
endIO.observe($('#contact'));
endIO.observe($('.footer'));

/* active nav link + sliding pill */
const navLinks = $$('.nav a');
const pill = $('.nav-pill');
const railLinks = $$('.rail a, .hchips a');
function setActive(id) {
  railLinks.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === `#${id || 'top'}`));
  const chip = $('.hchips a.on');
  if (chip) chip.parentElement.scrollTo({ left: chip.offsetLeft - 16, behavior: reduced ? 'auto' : 'smooth' });
  navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  const a = navLinks.find((x) => x.classList.contains('active'));
  if (!a) { pill.style.opacity = 0; return; }
  pill.style.opacity = 1;
  pill.style.width = `${a.offsetWidth}px`;
  pill.style.transform = `translateX(${a.offsetLeft}px)`;
}
let activeSec = '';
function syncActiveSection() {
  const line = scrollY + innerHeight * 0.45;
  let id = 'top';
  secTops.forEach((top, i) => { if (top <= line) id = SECTIONS[i]; });
  if (id !== activeSec) { activeSec = id; setActive(id === 'top' ? null : id); }
}
addEventListener('scroll', syncActiveSection, { passive: true });
syncActiveSection();
/* the pill is measured from link widths, which change once the web font loads or the window resizes */
const remeasurePill = () => setActive(activeSec === 'top' || !activeSec ? null : activeSec);
document.fonts.ready.then(remeasurePill);
addEventListener('resize', remeasurePill);

/* ================= MOBILE MENU ================= */
const menu = $('#mobileMenu');
const menuBtn = $('#menuBtn');
function openMenu() {
  menuOpen = true;
  menu.hidden = false;
  menuBtn.setAttribute('aria-expanded', 'true');
  menuBtn.setAttribute('aria-label', 'Close menu');
  header.classList.remove('hide');
  document.body.classList.add('locked');
  lenis?.stop();
  mbar.classList.remove('show');
  if (!reduced) {
    gsap.fromTo(menu, { clipPath: 'circle(0% at calc(100% - 40px) 34px)' }, { clipPath: 'circle(150% at calc(100% - 40px) 34px)', duration: 0.7, ease: 'power3.inOut' });
    gsap.fromTo($$('.mmenu-links a, .mmenu-foot'), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.6, delay: 0.2, ease: EASE });
  }
  $('.mmenu-links a').focus({ preventScroll: true });
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', 'Open menu');
  document.body.classList.remove('locked');
  lenis?.start();
  const done = () => { menu.hidden = true; onScroll(); };
  if (reduced) done();
  else gsap.to(menu, { clipPath: 'circle(0% at calc(100% - 40px) 34px)', duration: 0.45, ease: 'power3.in', onComplete: done });
}
menuBtn.addEventListener('click', () => (menuOpen ? closeMenu() : openMenu()));
menu.addEventListener('click', (e) => { if (e.target.closest('a:not([href^="#"])')) closeMenu(); });
addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { closeMenu(); menuBtn.focus(); } });
matchMedia('(min-width: 960px)').addEventListener('change', (m) => m.matches && closeMenu());

/* ================= PROJECT FILTERS ================= */
const projEls = $$('.proj');
$('#filters').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn || btn.getAttribute('aria-selected') === 'true') return;
  $$('.filter').forEach((b) => b.setAttribute('aria-selected', String(b === btn)));
  const f = btn.dataset.f;
  projEls.forEach((p) => p.classList.toggle('hidden', f !== 'all' && p.dataset.kind !== f));
  renderDots();
  if (isDesk()) showProject(0);
  else mobileGo(0, true);
  requestAnimationFrame(() => { ScrollTrigger.refresh(); measure(); });
});

/* ================= PROJECT DIALOG ================= */
const dlg = $('#pdialog');
const dlgInner = $('#pdInner');
let lastFocus = null;
function openProject(id) {
  const p = PROJECTS.find((x) => x.id === id);
  if (!p) return;
  lastFocus = document.activeElement;
  const media = p.phone
    ? `<div class="pd-media phones">${p.phone.map((s, i) => `<img src="/${s}" alt="${p.t} screen ${i + 1}" loading="lazy">`).join('')}</div>`
    : `<div class="pd-media"><img src="/${p.img}" alt="${p.t} screenshot" width="1200" height="750"></div>`;
  const action = p.url
    ? `<a class="btn btn-primary" href="${p.url}" target="_blank" rel="noopener">${p.phone ? UI.download(18) : ''}<span>${p.cta}</span>${p.phone ? '' : UI.arrowUpRight(18)}</a>`
    : `<span class="pd-private">${UI.lock(18)}Private client build</span>`;
  dlgInner.innerHTML = `
    <div class="pd-grab" aria-hidden="true"></div>
    <button class="pd-close" type="button" aria-label="Close project details">${UI.close(18)}</button>
    ${media}
    <div class="pd-bar">
      <div class="pd-bar-title"><span class="kind">${KIND[p.kind]} · ${p.cat}</span><h3 id="pd-title">${p.t}</h3></div>
      <div class="pd-actions">
        ${action}
        <a class="btn btn-wa" href="${waLink(`Hi Burhanuddin, I saw ${p.t} on your portfolio and I'd like something similar.`)}" target="_blank" rel="noopener">${UI.whatsapp(18)}<span>Want one like this?</span></a>
      </div>
    </div>
    <div class="pd-body">
      <div class="pd-role">${p.role}</div>
      <p>${p.d}</p>
      <div class="tags">${p.tags.map((t) => `<span>${brandSvg(t, 12)}${t}</span>`).join('')}</div>
    </div>`;
  dlg.showModal();
  dlgInner.scrollTop = 0;
  lenis?.stop();
  $('.pd-close', dlg).focus();
}
function closeProject() {
  if (!dlg.open || dlg.classList.contains('closing')) return;
  const finish = () => { dlg.classList.remove('closing'); dlg.close(); };
  if (reduced) finish();
  else { dlg.classList.add('closing'); setTimeout(finish, 280); }
}
dlg.addEventListener('close', () => { if (!engaged) lenis?.start(); lastFocus?.focus({ preventScroll: true }); });
dlg.addEventListener('cancel', (e) => { e.preventDefault(); closeProject(); });
dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('.pd-close')) closeProject(); });
$('#projects').addEventListener('click', (e) => { const c = e.target.closest('.proj'); if (c) openProject(c.dataset.id); });
$('#projects').addEventListener('keydown', (e) => {
  const c = e.target.closest('.proj');
  if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProject(c.dataset.id); }
});
/* swipe the sheet down to close on phones */
let sheetY = null;
dlg.addEventListener('touchstart', (e) => { if (dlgInner.scrollTop <= 0) sheetY = e.touches[0].clientY; }, { passive: true });
dlg.addEventListener('touchmove', (e) => {
  if (sheetY === null) return;
  const dy = e.touches[0].clientY - sheetY;
  if (dy > 0 && dlgInner.scrollTop <= 0) dlg.style.transform = `translateY(${dy}px)`;
}, { passive: true });
dlg.addEventListener('touchend', (e) => {
  if (sheetY === null) return;
  const dy = e.changedTouches[0].clientY - sheetY;
  sheetY = null;
  dlg.style.transition = 'transform .3s';
  dlg.style.transform = '';
  setTimeout(() => (dlg.style.transition = ''), 300);
  if (dy > 110) closeProject();
});

/* ================= TOAST + COPY ================= */
const toastEl = $('#toast');
let toastT;
function toast(html) {
  toastEl.innerHTML = html;
  toastEl.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('show'), 2400);
}
$$('[data-cv]').forEach((a) => a.addEventListener('click', () => { toast(`${UI.download(16)} Downloading CV…`); world?.say?.('Thanks for checking my CV! 📄'); }));
$('#copyEmail').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(CONTACT.email);
    toast(`${UI.check(16)} Email copied`);
  } catch {
    location.href = mailLink();
  }
});

/* ================= LOCAL TIME ================= */
function updateTime() {
  const now = new Date();
  const time = new Intl.DateTimeFormat('en-US', { timeZone: CONTACT.tz, hour: 'numeric', minute: '2-digit' }).format(now);
  const hour = +new Intl.DateTimeFormat('en-GB', { timeZone: CONTACT.tz, hour: '2-digit', hour12: false }).format(now);
  const awake = hour >= 8 && hour < 23;
  $('#localTime').textContent = `It's ${time} in Dubai · ${awake ? 'usually replies within a few hours' : "I'll reply first thing in the morning"}`;
}
updateTime();
setInterval(updateTime, 30000);

/* ================= CONTACT FORM ================= */
const form = $('#contactForm');
const rules = {
  name: (v) => (v.trim().length >= 2 ? '' : 'Please tell me your name.'),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? '' : 'That email doesn’t look right.'),
  message: (v) => (v.trim().length >= 10 ? '' : 'A few more words, please (10+ characters).'),
};
function validate(field) {
  const el = form.elements[field];
  const msg = rules[field](el.value);
  const wrap = el.closest('.field');
  wrap.classList.toggle('invalid', !!msg);
  $('.err', wrap).textContent = msg;
  el.setAttribute('aria-invalid', String(!!msg));
  return !msg;
}
Object.keys(rules).forEach((f) => form.elements[f].addEventListener('blur', () => form.elements[f].value && validate(f)));
Object.keys(rules).forEach((f) => form.elements[f].addEventListener('input', () => form.elements[f].closest('.field').classList.contains('invalid') && validate(f)));
/* "Send message" posts to /api/contact, which emails Burhanuddin and sends the visitor a confirmation.
   The form locks from the first click until the result is shown, so one click = one email. */
const sendBtn = $('#sendBtn');
const formNote = $('#formNote');
const formBtns = $$('button[type="submit"]', form);
let sending = false;
let submissionId = null;
const newId = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`);
const lockForm = (on) => formBtns.forEach((b) => { b.disabled = on; b.setAttribute('aria-disabled', String(on)); });

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (sending) return;
  const ok = Object.keys(rules).map(validate).every(Boolean);
  if (!ok) {
    const first = $('.field.invalid input, .field.invalid textarea', form);
    first?.focus();
    setTimeout(() => $$('.field.invalid', form).forEach((f) => { f.style.animation = 'none'; void f.offsetWidth; f.style.animation = ''; }), 400);
    return;
  }
  const d = Object.fromEntries(new FormData(form));
  const text = `Hi Burhanuddin, I'm ${d.name.trim()} (${d.email.trim()}). I'm looking for ${d.topic}.\n\n${d.message.trim()}`;
  const via = e.submitter?.value || 'mail';
  if (via === 'wa') {
    window.open(waLink(text), '_blank', 'noopener');
    toast(`${UI.check(16)} WhatsApp opened with your message`);
    world?.wave('See you on WhatsApp 👋');
    return;
  }
  sendMessage(d, text);
});

async function sendMessage(d, text) {
  sending = true;
  lockForm(true);
  submissionId ||= newId();
  const label = $('span', sendBtn);
  sendBtn.classList.add('is-loading');
  label.textContent = 'Sending…';
  let keepLocked = false;
  try {
    const res = await fetch('/api/contact', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: submissionId, name: d.name, email: d.email, topic: d.topic, message: d.message, company: d.company || '' }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok && json.ok) {
      keepLocked = true;
      submissionId = null;
      sendBtn.classList.remove('is-loading');
      form.classList.add('sent');
      sendBtn.classList.add('is-sent');
      $('i', sendBtn).innerHTML = UI.check(18);
      label.textContent = 'Message sent';
      const escH = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
      formNote.innerHTML = `Thanks ${escH(d.name.trim().split(' ')[0])}! I've got your message and sent a confirmation to <b>${escH(d.email.trim())}</b>. Expect a reply within a few hours.`;
      toast(`${UI.check(16)} Message sent. Check your inbox for a confirmation`);
      world?.wave("Got it! I'll reply soon 🚀");
      form.reset();
      setTimeout(() => {
        sendBtn.classList.remove('is-sent');
        $('i', sendBtn).innerHTML = UI.send(18);
        label.textContent = 'Send message';
        form.classList.remove('sent');
        sending = false;
        lockForm(false);
      }, 6000);
      return;
    }
    if (json.errors) {
      Object.entries(json.errors).forEach(([f, msg]) => {
        const wrap = form.elements[f]?.closest('.field');
        if (wrap) { wrap.classList.add('invalid'); $('.err', wrap).textContent = msg; }
      });
      label.textContent = 'Send message';
      return;
    }
    throw new Error(json.error || 'send failed');
  } catch (err) {
    label.textContent = 'Send message';
    formNote.innerHTML = `Couldn't send just now. <a href="${waLink(text)}" target="_blank" rel="noopener">Send it on WhatsApp</a> or email <a href="${mailLink(`Project enquiry: ${d.topic}`, text)}">${CONTACT.email}</a>.`;
    toast(`Couldn't send. Try WhatsApp instead`);
  } finally {
    if (!keepLocked) {
      sending = false;
      lockForm(false);
      sendBtn.classList.remove('is-loading');
    }
  }
}

/* ================= DOM → 3D LINKS ================= */
const counter = $('#counter');
function setActiveProject(id) {
  const idx = PROJECTS.findIndex((p) => p.id === id);
  if (idx < 0) return;
  S.activeP = idx;
  projEls.forEach((p) => p.classList.toggle('on', p.dataset.id === id));
  const visible = projEls.filter((p) => !p.classList.contains('hidden'));
  const n = visible.findIndex((p) => p.dataset.id === id) + 1;
  counter.innerHTML = `<b>${String(n).padStart(2, '0')}</b>/ ${String(visible.length).padStart(2, '0')}<span class="nm">${PROJECTS[idx].t}</span>`;
}
setActiveProject(PROJECTS[0].id);
/* ================= PROJECTS: desktop step viewer + phone swipe carousel =================
   Desktop: scrolling into Projects locks the section in place; each scroll gesture (wheel,
   trackpad flick, arrow keys) shows exactly one more/previous project. Past the last or
   first project the page is released and carries on. */
const track = $('#projects');
const dots = $('#carDots');
const workSec = $('#work');
const isDesk = () => innerWidth >= 1000;
const viewerOn = () => isDesk() && !!lenis && !reduced;
function visibleProjects() { return projEls.filter((p) => !p.classList.contains('hidden')); }
const curIndex = () => Math.max(0, visibleProjects().findIndex((p) => p.dataset.id === PROJECTS[S.activeP]?.id));

function renderDots() {
  dots.innerHTML = visibleProjects().map((p, i) => `<button type="button" data-k="${i}" aria-label="Show ${PROJECTS.find((x) => x.id === p.dataset.id).t}"></button>`).join('');
  syncDots();
}
function syncDots() {
  const k = curIndex(), n = visibleProjects().length;
  $$('button', dots).forEach((d, i) => d.classList.toggle('on', i === k));
  if (isDesk()) { $('#carPrev').disabled = k === 0; $('#carNext').disabled = k === n - 1; }
  else { $('#carPrev').disabled = false; $('#carNext').disabled = false; }
}
function showProject(k) {
  const vis = visibleProjects();
  if (!vis.length) return;
  k = Math.max(0, Math.min(vis.length - 1, k));
  vis.forEach((p, i) => {
    const d = i - k;
    p.classList.toggle('before', d < 0);
    p.classList.toggle('after', d > 0);
    p.classList.toggle('far', d > 3);
    p.style.setProperty('--d', String(Math.max(0, Math.min(d, 4))));
  });
  setActiveProject(vis[k].dataset.id);
  syncDots();
}

/* phone carousel: a transform track driven by touch. Vertical swipes always scroll the page
   (touch-action: pan-y); a short horizontal swipe moves exactly one project. */
let mobK = 0;
function mobOffset(k) {
  const p = visibleProjects()[k];
  if (!p) return 0;
  return -(p.offsetLeft - (track.parentElement.clientWidth - p.offsetWidth) / 2);
}
function mobileGo(k, instant) {
  const vis = visibleProjects();
  if (!vis.length) return;
  mobK = Math.max(0, Math.min(vis.length - 1, k));
  track.style.transition = instant || reduced ? 'none' : '';
  track.style.transform = `translate3d(${mobOffset(mobK)}px,0,0)`;
  setActiveProject(vis[mobK].dataset.id);
  syncDots();
}
let tStart = null;
track.addEventListener('touchstart', (e) => {
  if (isDesk() || e.touches.length > 1) return;
  const t = e.touches[0];
  tStart = { x: t.clientX, y: t.clientY, time: performance.now(), axis: '' };
}, { passive: true });
track.addEventListener('touchmove', (e) => {
  if (!tStart) return;
  const t = e.touches[0], dx = t.clientX - tStart.x, dy = t.clientY - tStart.y;
  if (!tStart.axis && Math.hypot(dx, dy) > 8) tStart.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  if (tStart.axis !== 'x') return;
  const n = visibleProjects().length;
  const edge = (mobK === 0 && dx > 0) || (mobK === n - 1 && dx < 0) ? 0.35 : 1; // rubber-band at the ends
  track.style.transition = 'none';
  track.style.transform = `translate3d(${mobOffset(mobK) + dx * edge}px,0,0)`;
}, { passive: true });
function touchEnd(e) {
  if (!tStart) return;
  const s = tStart;
  tStart = null;
  if (s.axis !== 'x') return;
  const dx = (e.changedTouches[0]?.clientX ?? s.x) - s.x;
  const fast = Math.abs(dx) / Math.max(1, performance.now() - s.time) > 0.22;
  if (Math.abs(dx) > 40 || (fast && Math.abs(dx) > 12)) mobileGo(mobK + (dx < 0 ? 1 : -1));
  else mobileGo(mobK);
  track.dataset.swiped = '1';
  setTimeout(() => delete track.dataset.swiped, 50);
}
track.addEventListener('touchend', touchEnd, { passive: true });
track.addEventListener('touchcancel', touchEnd, { passive: true });
/* a swipe must not also open the project details */
track.addEventListener('click', (e) => { if (track.dataset.swiped) { e.stopPropagation(); e.preventDefault(); } }, true);
addEventListener('resize', () => {
  if (isDesk()) { track.style.transform = ''; track.style.transition = ''; }
  else mobileGo(mobK, true);
});

function goTo(k) { if (isDesk()) showProject(k); else mobileGo(k); }
$('#carPrev').addEventListener('click', () => goTo(curIndex() - 1));
$('#carNext').addEventListener('click', () => goTo(curIndex() + 1));
dots.addEventListener('click', (e) => { const b = e.target.closest('[data-k]'); if (b) goTo(+b.dataset.k); });

/* desktop: lock / step / release */
let engaged = false, lockUntil = 0, wheelAcc = 0, releaseUntil = 0, lastScroll = scrollY;
const engageY = () => workSec.getBoundingClientRect().top + scrollY;
function engage(k) {
  if (engaged || !viewerOn()) return;
  engaged = true;
  lenis.stop();
  window.scrollTo(0, engageY());
  wheelAcc = 0;
  lockUntil = performance.now() + 650;
  showProject(k);
}
function release(dir) {
  if (!engaged) return;
  engaged = false;
  releaseUntil = performance.now() + 1100;
  lenis.start();
  if (dir > 0) lenis.scrollTo('#skills', { offset: -headerH() + 1, duration: 1.1 });
  else if (dir < 0) lenis.scrollTo(engageY() - innerHeight * 0.75, { duration: 1.1 });
}
/* anything else moving the page while the deck holds it (scrollbar drag, find-in-page, focus jump) releases it */
addEventListener('scroll', () => {
  if (engaged && Math.abs(scrollY - engageY()) > 40) {
    engaged = false;
    releaseUntil = performance.now() + 1100;
    lenis.start();
  }
}, { passive: true });
/* keyboard Tab moving focus out of Projects lets the page go, without jumping anywhere */
document.addEventListener('focusin', (e) => {
  if (engaged && !workSec.contains(e.target) && !dlg.contains(e.target)) {
    engaged = false;
    releaseUntil = performance.now() + 1100;
    lenis.start();
  }
});
function step(dir) {
  const k = curIndex(), n = visibleProjects().length;
  if (dir > 0 && k >= n - 1) return release(1);
  if (dir < 0 && k <= 0) return release(-1);
  showProject(k + dir);
}
if (lenis) {
  lenis.on('scroll', ({ scroll }) => {
    const prev = lastScroll;
    lastScroll = scroll;
    if (engaged || !viewerOn() || dlg.open || performance.now() < releaseUntil) return;
    const t = engageY();
    if (Math.abs(scroll - t) > innerHeight * 0.5) return; // big jumps (links, scrollbar drags) don't lock
    if (prev < t && scroll >= t) engage(0);
    else if (prev > t && scroll <= t) engage(visibleProjects().length - 1);
  });
}
addEventListener('wheel', (e) => {
  if (!engaged || dlg.open) return;
  e.preventDefault();
  const now = performance.now();
  if (now < lockUntil) { lockUntil = Math.max(lockUntil, now + 170); return; } // swallow trackpad momentum
  wheelAcc += e.deltaY;
  if (Math.abs(wheelAcc) < 24) return;
  const dir = Math.sign(wheelAcc);
  wheelAcc = 0;
  lockUntil = now + 650;
  step(dir);
}, { passive: false });
addEventListener('keydown', (e) => {
  if (!engaged || dlg.open || e.target.closest?.('input, textarea')) return;
  const down = ['ArrowDown', 'PageDown', ' ', 'ArrowRight'].includes(e.key);
  const up = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key);
  if (!down && !up) return;
  e.preventDefault();
  if (performance.now() < lockUntil) return;
  lockUntil = performance.now() + 500;
  step(down ? 1 : -1);
});
addEventListener('resize', () => { if (engaged && !viewerOn()) { engaged = false; lenis?.start(); } });

renderDots();
if (isDesk()) showProject(0); else mobileGo(0, true);

/* service cards: animate the demos only while they are on screen; tilt on hover (desktop) */
const svcCards = $$('.svc-card');
const svcCanvases = svcCards.map((card) => {
  const cv = $('canvas', card);
  return { card, cv, ctx: cv.getContext('2d'), i: +card.dataset.i, on: false };
});
let svcRaf = 0;
function sizeSvcCanvas(o) {
  const w = Math.round(o.cv.clientWidth * Math.min(devicePixelRatio, 2));
  if (w && o.cv.width !== w) { o.cv.width = w; o.cv.height = Math.round(w * 0.625); }
}
function svcLoop(now) {
  const live = svcCanvases.filter((o) => o.on);
  svcRaf = live.length ? requestAnimationFrame(svcLoop) : 0;
  live.forEach((o) => {
    sizeSvcCanvas(o);
    drawServiceDemo(o.ctx, o.cv.width, o.cv.height, o.i, reduced ? 3 : now / 1000);
  });
}
const svcIO = new IntersectionObserver((es) => {
  es.forEach((e) => { const o = svcCanvases.find((x) => x.card === e.target); if (o) o.on = e.isIntersecting; });
  if (!svcRaf) svcRaf = requestAnimationFrame(svcLoop);
}, { rootMargin: '100px' });
svcCards.forEach((c) => svcIO.observe(c));
if (finePointer && !reduced) {
  svcCards.forEach((card) => {
    const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
    gsap.set(card, { transformPerspective: 1100 });
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      ry(((e.clientX - r.left) / r.width - 0.5) * 8);
      rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
    });
    card.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/* skill tabs */
const skTabs = $$('.sk-tab');
function selectSkill(i, focus) {
  skTabs.forEach((t, k) => t.setAttribute('aria-selected', String(k === i)));
  S.hotGroup = i;
  renderSkills(i);
  if (focus) skTabs[i].focus();
}
S.hotGroup = 0;
skTabs.forEach((t, i) => {
  t.addEventListener('click', () => selectSkill(i));
  t.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') selectSkill((i + 1) % skTabs.length, true);
    if (e.key === 'ArrowLeft') selectSkill((i - 1 + skTabs.length) % skTabs.length, true);
  });
});
function updateJourney() {
  const on = $$('.tl-item.on');
  S.activeJ = Math.max(0, on.length - 1);
}

/* ================= MICRO-INTERACTIONS ================= */
if (finePointer && !reduced) {
  /* spotlight on cards */
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest?.('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', `${e.clientX - r.left}px`);
    c.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* magnetic buttons */
  $$('.magnetic').forEach((b) => {
    const xTo = gsap.quickTo(b, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(b, 'y', { duration: 0.5, ease: 'power3' });
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      xTo((e.clientX - r.left - r.width / 2) * 0.28);
      yTo((e.clientY - r.top - r.height / 2) * 0.35);
    });
    b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });

  /* cursor ring */
  const cur = $('.cursor');
  const cx = gsap.quickTo(cur, 'x', { duration: 0.35, ease: 'power3' });
  const cy = gsap.quickTo(cur, 'y', { duration: 0.35, ease: 'power3' });
  addEventListener('pointermove', (e) => { cur.classList.add('on'); cx(e.clientX); cy(e.clientY); }, { passive: true });
  document.addEventListener('pointerleave', () => cur.classList.remove('on'));
  document.addEventListener('pointerover', (e) => {
    if (document.body.classList.contains('hover-3d')) return;
    cur.classList.toggle('hover', !!e.target.closest('a, button, .proj, .chip, .filter, label'));
  });
}

/* ================= SCROLL ANIMATIONS ================= */
function countUp(el) {
  const to = +el.dataset.count, suf = el.dataset.suf || '';
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.4, ease: 'power2.out', onUpdate: () => (el.textContent = Math.round(o.v) + suf) });
}

/* ================= PAGE LOADER ================= */
const loaderEl = $('#loader'), ldBar = $('#ldBar'), ldTxt = $('#ldTxt');
let ldP = 0, ldDone = false, resolveReady;
const pageReady = new Promise((r) => (resolveReady = r));
const ldStart = performance.now();
function ldSet(p) {
  ldP = Math.max(ldP, Math.min(100, p));
  if (ldBar) ldBar.style.width = `${ldP}%`;
  if (ldTxt) ldTxt.textContent = `loading the studio… ${Math.round(ldP)}%`;
}
function ldFinish() {
  if (ldDone) return;
  ldDone = true;
  ldSet(100);
  const wait = Math.max(0, 600 - (performance.now() - ldStart));
  setTimeout(() => { loaderEl?.classList.add('done'); resolveReady(); }, wait + 250);
}
const ldTrickle = setInterval(() => { if (ldDone) clearInterval(ldTrickle); else ldSet(ldP + (90 - ldP) * 0.06); }, 120);
setTimeout(ldFinish, 5000);
document.fonts.ready.then(() => ldSet(40));

if (!reduced) {
  document.fonts.ready.then(() => pageReady).then(() => {
    /* hero intro: plays as the loader fades out */
    const title = $('.hero-title');
    const split = SplitText.create(title, { type: 'words', wordsClass: 'word', mask: 'words' });
    gsap.set(title, { visibility: 'visible' });
    const tl = gsap.timeline({ defaults: { ease: EASE } });
    tl.from(split.words, { yPercent: 115, rotate: 4, duration: 1, stagger: 0.045 })
      .to('.reveal-hero', { opacity: 1, '--ry': '0px', duration: 0.9, stagger: 0.09 }, 0.25)
      .add(() => $$('.hero-meta [data-count]').forEach(countUp), 0.6)
      .from('#header', { y: -30, opacity: 0, duration: 0.8, clearProps: 'transform,opacity' }, 0.1);
  });
  document.fonts.ready.then(() => {
    /* section headings: line-by-line mask reveal */
    $$('.split-lines').forEach((h) => {
      SplitText.create(h, {
        type: 'lines', linesClass: 'line', mask: 'lines', autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, {
          yPercent: 110, duration: 1, ease: EASE, stagger: 0.1,
          scrollTrigger: { trigger: h, start: 'top 88%', once: true },
        }),
      });
    });

    /* generic reveals, batched so cards in the same row stagger */
    ScrollTrigger.batch('.reveal', {
      start: 'top 90%',
      once: true,
      onEnter: (els) => gsap.to(els, { opacity: 1, '--ry': '0px', duration: 0.9, ease: EASE, stagger: 0.08, overwrite: true }),
    });

    /* timeline progress line + active nodes */
    gsap.to('#tlFill', {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: '#timeline', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 },
    });
    $$('.tl-item').forEach((it) => ScrollTrigger.create({
      trigger: it, start: 'top 62%',
      onEnter: () => { it.classList.add('on'); updateJourney(); },
      onLeaveBack: () => { it.classList.remove('on'); updateJourney(); },
    }));

    /* hero copy drifts and fades as the world rebuilds */
    gsap.to('.hero-copy', { yPercent: -8, opacity: 0.3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    ScrollTrigger.refresh();
    measure();
  });
} else {
  $$('.tl-item').forEach((it) => it.classList.add('on'));
  $('#tlFill').style.transform = 'scaleY(1)';
}
window.__revealed = true;

/* ================= 3D WORLD (lazy) ================= */
let world = null;
function supportsWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { return false; }
}
if (supportsWebGL()) {
  document.fonts.ready
    .then(() => import('./world.js'))
    .then(({ createWorld }) => {
      ldSet(75);
      world = createWorld({ canvas: $('#gl'), speechEl: $('#speech'), tipEl: $('#logoTip'), reduced });
      requestAnimationFrame(() => requestAnimationFrame(ldFinish));
    })
    .catch((err) => { console.error('3D world failed to load', err); ldFinish(); });
} else {
  document.fonts.ready.then(ldFinish);
}
