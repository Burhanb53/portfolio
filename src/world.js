import * as THREE from 'three';
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {
  siReact, siNodedotjs, siFlutter, siPostgresql, siKubernetes, siN8n,
  siNextdotjs, siTypescript, siJavascript, siMongodb, siRedis, siDocker, siTerraform, siFirebase, siGit,
} from 'simple-icons';
import { S, BRAND_LOGOS } from './state.js';
import { brandColor } from './icons.js';
import { drawServiceDemo } from './serviceDemo.js';
import { SKILLS, JOURNEY, PROJECTS, CONTACT, SERVICES } from './data.js';

const MAIN_LOGOS = [siReact, siNodedotjs, siFlutter, siPostgresql, siKubernetes, siN8n];
const MOON_LOGOS = [siNextdotjs, siTypescript, siJavascript, siMongodb, siRedis, siDocker, siTerraform, siFirebase, siGit];
const LAST = 5;

const lerp = (a, b, t) => a + (b - a) * t;
function dcGlow() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const x = c.getContext('2d'); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  return c;
}
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rnd = (a, b) => a + Math.random() * (b - a);

export function createWorld({ canvas, speechEl, tipEl, reduced }) {
  const isMobile = () => innerWidth < 1000;
  const small = Math.min(innerWidth, innerHeight) < 700;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.25 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.shadowMap.enabled = !small;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x08080a, 13, 30);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.45;
  pmrem.dispose();

  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 10);
  function resize() {
    renderer.setSize(innerWidth, innerHeight, false);
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize);

  /* ---------- lights: neutral studio ---------- */
  scene.add(new THREE.HemisphereLight(0xffffff, 0x18181b, 1.6));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -8, right: 8, top: 8, bottom: -8, near: 1, far: 30 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.0004;
  scene.add(key);
  const rim = new THREE.PointLight(0xdfe8ff, 9, 16, 1);
  rim.position.set(-4, 3, -2);
  scene.add(rim);
  const rim2 = new THREE.PointLight(0xfff1dc, 6, 16, 1);
  rim2.position.set(5, -2, 2);
  scene.add(rim2);

  const SM = (c, o = {}) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, metalness: 0.05, ...o });
  const mesh = (g, m, cast = true) => { const x = new THREE.Mesh(g, m); x.castShadow = cast; x.receiveShadow = true; return x; };
  const V = (x, y, z) => new THREE.Vector3(x, y, z);

  /* ---------- screen texture (laptop + holo panel) ---------- */
  const sc = document.createElement('canvas');
  sc.width = 1536; sc.height = 960;
  const g2 = sc.getContext('2d');
  g2.scale(1.5, 1.5); // all drawing below is in 1024×640 units, rendered at 1.5× for a crisper screen
  g2.imageSmoothingQuality = 'high';
  const stex = new THREE.CanvasTexture(sc);
  stex.colorSpace = THREE.SRGBColorSpace;
  stex.anisotropy = 8;
  const mono = (s) => `${s}px "JetBrains Mono", monospace`;
  const sans = (s, w = 700) => `${w} ${s}px "Space Grotesk Variable", "Space Grotesk", sans-serif`;
  const CODE = ["const burhanuddin = {", "  role: 'Software Engineer',", "  city: 'Dubai',", "  web: ['Next.js', 'Node'],", "  mobile: ['Flutter'],", "  cloud: ['AWS', 'K8s', 'Helm'],", "  coffee: Infinity,", "};", "", "deploy(burhanuddin).then(() =>", "  console.log('shipped'));"];
  const total = CODE.join('\n').length;
  let typed = 0;
  function rr(x, y, w, h, r) { g2.beginPath(); g2.roundRect(x, y, w, h, r); g2.fill(); }
  function chrome(title) {
    g2.fillStyle = '#0c0c0e'; g2.fillRect(0, 0, 1024, 640);
    g2.fillStyle = '#17171a'; g2.fillRect(0, 0, 1024, 52);
    ['#52525b', '#3f3f46', '#2c2c31'].forEach((c, i) => { g2.fillStyle = c; g2.beginPath(); g2.arc(30 + i * 28, 26, 9, 0, 7); g2.fill(); });
    g2.fillStyle = '#232327'; rr(140, 12, 744, 28, 14);
    g2.fillStyle = '#a1a1aa'; g2.font = mono(17); g2.fillText(title, 162, 32);
  }
  function drawCode() {
    chrome('~/burhanuddin/portfolio.js');
    g2.font = mono(30);
    let n = typed;
    CODE.forEach((line, i) => {
      if (n <= 0) return;
      const s = line.slice(0, n);
      n -= line.length + 1;
      g2.fillStyle = '#3f3f46'; g2.fillText(String(i + 1).padStart(2), 24, 104 + i * 48);
      g2.fillStyle = /const|then|deploy/.test(line) ? '#ffffff' : /'/.test(line) ? '#a1a1aa' : '#d4d4d8';
      g2.fillText(s, 86, 104 + i * 48);
      if (n <= 0 && Date.now() % 800 < 400) { const w = g2.measureText(s).width; g2.fillStyle = '#ffffff'; g2.fillRect(90 + w, 80 + i * 48, 16, 32); }
    });
  }
  function drawSkills() {
    chrome('~/burhanuddin/stack.json');
    g2.font = mono(28); let y = 100;
    g2.fillStyle = '#d4d4d8'; g2.fillText('{', 30, y);
    SKILLS.forEach((gr, i) => {
      y += 78;
      const hot = S.hotGroup === i;
      if (hot) { g2.fillStyle = 'rgba(255,255,255,.08)'; g2.fillRect(20, y - 56, 984, 76); }
      g2.fillStyle = hot ? '#ffffff' : '#d4d4d8'; g2.font = mono(26); g2.fillText(`"${gr.t}":`, 60, y - 22);
      g2.fillStyle = hot ? '#ffffff' : '#71717a'; g2.font = mono(20);
      g2.fillText(`[${gr.s.slice(0, 5).join(', ')}${gr.s.length > 5 ? ', …' : ''}]`, 90, y + 8);
    });
    g2.fillStyle = '#d4d4d8'; g2.font = mono(28); g2.fillText('}', 30, y + 56);
  }
  function drawJourney() {
    chrome('git log --oneline --graph');
    JOURNEY.forEach((j, i) => {
      const y = 120 + i * 120, on = i === S.activeJ;
      g2.fillStyle = on ? '#ffffff' : '#52525b';
      g2.beginPath(); g2.arc(50, y - 8, on ? 14 : 9, 0, 7); g2.fill();
      if (i < JOURNEY.length - 1) { g2.fillStyle = '#3f3f46'; g2.fillRect(48, y + 8, 4, 96); }
      g2.fillStyle = on ? '#ffffff' : '#a1a1aa'; g2.font = mono(26); g2.fillText(j.role, 86, y);
      g2.fillStyle = '#52525b'; g2.font = mono(19); g2.fillText(`${j.when}  ·  ${j.org.slice(0, 40)}`, 86, y + 34);
    });
  }
  const IMG = {};
  PROJECTS.forEach((p) => { if (p.img) { const im = new Image(); im.onload = () => (sig = ''); im.src = `/${p.img}`; IMG[p.id] = im; } });
  // the new project cross-fades in over the previous one
  let shownId = null, fadeFrom = null, fadeT = 1;
  function drawCover(id) {
    const im = IMG[id];
    if (im?.complete && im.naturalWidth) {
      const W = 1024, H = 588, s = Math.max(W / im.naturalWidth, H / im.naturalHeight), w = im.naturalWidth * s;
      g2.drawImage(im, (W - w) / 2, 52, w, im.naturalHeight * s);
      return;
    }
    const p = PROJECTS.find((x) => x.id === id);
    g2.fillStyle = '#0c0c0e'; g2.fillRect(0, 52, 1024, 588);
    g2.fillStyle = '#f4f4f5'; g2.font = sans(84); g2.fillText(p.t, 60, 260);
    g2.fillStyle = '#a1a1aa'; g2.font = sans(28, 400); g2.fillText(p.cat, 60, 310);
  }
  function drawProject() {
    const p = PROJECTS[S.activeP];
    if (shownId !== p.id) { fadeFrom = shownId; shownId = p.id; fadeT = fadeFrom ? 0 : 1; }
    chrome(p.host);
    drawCover(p.id);
    if (fadeFrom && fadeT < 1) {
      g2.globalAlpha = 1 - ease(fadeT);
      drawCover(fadeFrom);
      g2.globalAlpha = 1;
    }
  }
  function drawContact() {
    chrome(`mailto:${CONTACT.email}`);
    const gr = g2.createRadialGradient(512, 340, 10, 512, 340, 520);
    gr.addColorStop(0, 'rgba(255,255,255,.12)'); gr.addColorStop(1, '#0c0c0e');
    g2.fillStyle = gr; g2.fillRect(0, 52, 1024, 588);
    g2.textAlign = 'center';
    g2.fillStyle = '#ffffff'; g2.font = sans(110); g2.fillText('say hi', 512, 320);
    g2.font = mono(30); g2.fillStyle = '#a1a1aa'; g2.fillText(CONTACT.email, 512, 400);
    g2.textAlign = 'left';
  }
  const MODES = ['code', 'code', 'work', 'skills', 'journey', 'contact'];
  let mode = '', sig = '', spinBoost = 0, lastP = 0;
  function updateScreen() {
    const m = MODES[Math.round(S.fs)];
    const s = `${m}|${S.hotGroup}|${S.activeJ}|${S.activeP}`;
    if (m === 'code') {
      if (Date.now() % 55 < 20 || mode !== 'code') { typed = typed > total + 60 ? 0 : typed + 1; drawCode(); stex.needsUpdate = true; }
    } else if (s !== sig || (m === 'work' && fadeT < 1)) {
      if (m === 'work' && fadeT < 1) fadeT = Math.min(1, fadeT + 0.07);
      ({ skills: drawSkills, journey: drawJourney, work: drawProject, contact: drawContact })[m]();
      stex.needsUpdate = true;
    }
    if (m !== mode && m === 'work') spinBoost = 1;
    if (S.activeP !== lastP && m === 'work') lastP = S.activeP; // no lid dip: the screen just cross-fades
    mode = m; sig = s;
  }

  /* ---------- STUDIO: desk, chair, person ---------- */
  const studio = new THREE.Group();
  scene.add(studio);
  /* ---------- the ROOM: one big open-front set around the desk ----------
     Back wall at z = -2.2 running x = -13 … 7, floor top at y = -1.03.
     Along the back wall, left to right: window (experience), bookshelf (skills),
     four service screens (services), then the desk area (hero / contact). */
  const X0 = -18, X1 = 7, RB = -2.2, FY = -1.03, RH = 6;
  const RWD = X1 - X0, RCX = (X0 + X1) / 2;
  const wallM = SM(0x0f0f13, { roughness: 0.95 });
  const floor = mesh(new THREE.BoxGeometry(RWD, 0.14, 6), SM(0x15120f, { roughness: 0.6, metalness: 0.05 }), false);
  floor.position.set(RCX, FY - 0.07, RB + 3); studio.add(floor);
  const seamM = new THREE.MeshBasicMaterial({ color: 0x0b0a09 });
  for (let x = X0 + 0.6; x < X1; x += 0.6) { const seam = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.002, 6), seamM); seam.position.set(x, FY + 0.001, RB + 3); studio.add(seam); }
  const backWall = mesh(new THREE.BoxGeometry(RWD, RH, 0.12), wallM, false); backWall.position.set(RCX, FY + RH / 2, RB - 0.06); studio.add(backWall);
  const sideWall = mesh(new THREE.BoxGeometry(0.12, RH, 6), wallM, false); sideWall.position.set(X0 - 0.06, FY + RH / 2, RB + 3); studio.add(sideWall);
  const skirting = new THREE.Mesh(new THREE.BoxGeometry(RWD, 0.08, 0.02), SM(0x1c1c21)); skirting.position.set(RCX, FY + 0.04, RB + 0.01); studio.add(skirting);
  const rug = mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.01, 48), SM(0x1b1924, { roughness: 1 }), false); rug.scale.z = 0.7; rug.position.set(0, FY + 0.006, -0.3); studio.add(rug);

  const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const tx = new THREE.CanvasTexture(c); tx.colorSpace = THREE.SRGBColorSpace; return tx; };
  const frameM2 = SM(0x26262c, { roughness: 0.5, metalness: 0.3 });

  // window with a night city outside (experience station)
  const WIN = { x: -16, y: 1.55, w: 2.6, h: 1.6 };
  const nightTex = canvasTex(640, 400, (c, w, h) => {
    const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#0b0a1f'); g.addColorStop(1, '#2a2050'); c.fillStyle = g; c.fillRect(0, 0, w, h);
    c.fillStyle = '#f4f1ff'; c.beginPath(); c.arc(w * 0.78, h * 0.2, 20, 0, 7); c.fill();
    for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * 0.7})`; c.fillRect(Math.random() * w, Math.random() * h * 0.5, 1.5, 1.5); }
    let x = 0;
    while (x < w) {
      const bw = 22 + Math.random() * 46, bh = 70 + Math.random() * 210;
      c.fillStyle = '#0a0912'; c.fillRect(x, h - bh, bw, bh);
      for (let yy = h - bh + 8; yy < h - 6; yy += 11) for (let xx = x + 5; xx < x + bw - 5; xx += 9) if (Math.random() < 0.3) { c.fillStyle = Math.random() < 0.8 ? 'rgba(255,214,150,.85)' : 'rgba(157,140,255,.9)'; c.fillRect(xx, yy, 4, 5); }
      x += bw + 3;
    }
  });
  const win = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w, WIN.h), new THREE.MeshBasicMaterial({ map: nightTex }));
  win.position.set(WIN.x, WIN.y, RB + 0.005); studio.add(win);
  [[WIN.h / 2, WIN.w + 0.1, 0.06], [-WIN.h / 2, WIN.w + 0.1, 0.06], [0, WIN.w, 0.03]].forEach(([dy, w, h]) => { const b = mesh(new THREE.BoxGeometry(w, h, 0.06), frameM2); b.position.set(WIN.x, WIN.y + dy, RB + 0.03); studio.add(b); });
  [-WIN.w / 2, 0, WIN.w / 2].forEach((dx) => { const b = mesh(new THREE.BoxGeometry(dx ? 0.06 : 0.03, WIN.h, 0.06), frameM2); b.position.set(WIN.x + dx, WIN.y, RB + 0.03); studio.add(b); });
  const sill = mesh(new THREE.BoxGeometry(WIN.w + 0.2, 0.04, 0.16), frameM2); sill.position.set(WIN.x, WIN.y - WIN.h / 2 - 0.05, RB + 0.08); studio.add(sill);
  const moonLight = new THREE.PointLight(0x8f86ff, 5, 7, 1.4); moonLight.position.set(WIN.x, WIN.y, RB + 0.8); studio.add(moonLight);

  // bookshelf with books and a small plant (skills station)
  const SH = { x: -13, y: 0.35 };
  const woodM = SM(0x2a221c, { roughness: 0.7 });
  const rows = [0, 0.62, 1.24];
  rows.forEach((dy) => { const b = mesh(new THREE.BoxGeometry(1.6, 0.04, 0.32), woodM); b.position.set(SH.x, SH.y + dy, RB + 0.16); studio.add(b); });
  const bookCols = [0x9d8cff, 0x3f3f46, 0xe4e4e7, 0x22d3ee, 0x52525b, 0xa3e635, 0x71717a, 0xfbbf24];
  rows.forEach((dy, row) => {
    let x = SH.x - 0.72;
    for (let k = 0; k < 9 - row * 2; k++) {
      const h = 0.3 + ((k * 7 + row * 3) % 5) * 0.035, w = 0.05 + ((k + row) % 3) * 0.015;
      const bk = mesh(new THREE.BoxGeometry(w, h, 0.22), SM(bookCols[(k + row * 3) % bookCols.length], { roughness: 0.8 }));
      bk.position.set(x + w / 2, SH.y + dy + 0.02 + h / 2, RB + 0.16); studio.add(bk); x += w + 0.012;
    }
  });
  const sPot = mesh(new THREE.CylinderGeometry(0.08, 0.06, 0.13, 20), SM(0xe9e9e9)); sPot.position.set(SH.x + 0.55, SH.y + 1.24 + 0.085, RB + 0.16); studio.add(sPot);
  for (let i = 0; i < 6; i++) { const lf = mesh(new THREE.ConeGeometry(0.03, 0.26, 5), SM(0x3d6b52)); lf.position.set(SH.x + 0.55, SH.y + 1.24 + 0.24, RB + 0.16); lf.rotation.set(Math.sin(i * 2.1) * 0.6, i, Math.cos(i * 1.3) * 0.6); studio.add(lf); }
  const shelfLight = new THREE.PointLight(0xfff1dc, 3, 4, 1.6); shelfLight.position.set(SH.x, SH.y + 2.1, RB + 0.8); studio.add(shelfLight);

  // four service screens on the wall (services station): each plays that service's live demo
  const BX = [-10.6, -8.2, -5.8, -3.4], BY = 1.0, BW = 2.0, BH = 1.25;
  const boards = SERVICES.map((d, i) => {
    const cv = document.createElement('canvas'); cv.width = 800; cv.height = 500;
    const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const body = mesh(new RoundedBoxGeometry(BW + 0.1, BH + 0.1, 0.06, 3, 0.03), SM(0x0c0c0f, { roughness: 0.3, metalness: 0.5 }));
    body.position.set(BX[i], BY, RB + 0.04); studio.add(body);
    const mat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false });
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(BW, BH), mat);
    scr.position.set(BX[i], BY, RB + 0.075); studio.add(scr);
    const plate = new THREE.Mesh(new THREE.PlaneGeometry(BW, 0.16), new THREE.MeshBasicMaterial({ map: canvasTex(800, 64, (c, w, h) => {
      c.fillStyle = '#9d8cff'; c.font = mono(22); c.fillText(`0${i + 1}`, 0, 40);
      c.fillStyle = '#f4f4f5'; c.font = sans(30, 600); c.fillText(d.name, 52, 42);
      c.fillStyle = '#a1a1aa'; c.font = mono(20); const g = d.goal; c.fillText(g, w - c.measureText(g).width, 40);
    }), transparent: true }));
    plate.position.set(BX[i], BY - BH / 2 - 0.16, RB + 0.02); studio.add(plate);
    return { cv, ctx: cv.getContext('2d'), tex, mat, drawn: false };
  });
  function drawBoard(i, t) { const b = boards[i]; drawServiceDemo(b.ctx, 800, 500, i, t); b.tex.needsUpdate = true; b.drawn = true; }
  boards.forEach((_, i) => drawBoard(i, 3));
  const boardGlow = new THREE.PointLight(0x9d8cff, 0, 5, 1.2); boardGlow.position.set(BX[0], BY, RB + 1.2); studio.add(boardGlow);

  // pendant lamp over the desk, framed poster, floor lamp on the right
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 3, 6), new THREE.MeshBasicMaterial({ color: 0x27272a })); cord.position.set(0, FY + RH - 1.5, 0); studio.add(cord);
  const shade = mesh(new THREE.ConeGeometry(0.26, 0.24, 32, 1, true), SM(0x1c1c20, { side: THREE.DoubleSide, metalness: 0.4, roughness: 0.4 })); shade.position.set(0, 1.9, 0); studio.add(shade);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe6c2 })); bulb.position.set(0, 1.83, 0); studio.add(bulb);
  const lampLight = new THREE.PointLight(0xffd9a8, 7, 5, 1.6); lampLight.position.set(0, 1.75, 0); studio.add(lampLight);
  const posterTex = canvasTex(320, 440, (c, w, h) => {
    c.fillStyle = '#16141f'; c.fillRect(0, 0, w, h); c.strokeStyle = '#9d8cff'; c.lineWidth = 3;
    for (let i = 0; i < 9; i++) { c.beginPath(); c.arc(w / 2, h * 0.42, 20 + i * 13, 0, 7); c.globalAlpha = 1 - i * 0.1; c.stroke(); }
    c.globalAlpha = 1; c.fillStyle = '#fff'; c.font = sans(34); c.fillText('ship it.', 40, h - 60); c.fillStyle = '#9d8cff'; c.font = mono(14); c.fillText('// burhanb53.dev', 40, h - 30);
  });
  const poster = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 1.03), new THREE.MeshBasicMaterial({ map: posterTex }));
  poster.position.set(4.3, 1.3, RB + 0.01); studio.add(poster);
  const flPole = mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.9, 10), SM(0xc4c4cc, { metalness: 0.9, roughness: 0.25 })); flPole.position.set(5.6, FY + 0.95, RB + 0.5); studio.add(flPole);
  const flBase = mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.04, 24), SM(0x1c1c20)); flBase.position.set(5.6, FY + 0.02, RB + 0.5); studio.add(flBase);
  const flGlobe = new THREE.Mesh(new THREE.SphereGeometry(0.16, 20, 16), new THREE.MeshBasicMaterial({ color: 0xfff1dc })); flGlobe.position.set(5.6, FY + 1.95, RB + 0.5); studio.add(flGlobe);
  const flLight = new THREE.PointLight(0xfff1dc, 3, 4, 1.6); flLight.position.set(5.6, FY + 1.9, RB + 0.8); studio.add(flLight);
  const deskTop = mesh(new THREE.BoxGeometry(2.8, 0.07, 1.3), SM(0x161619, { roughness: 0.35, metalness: 0.2 }));
  studio.add(deskTop);
  const deskEdge = new THREE.Mesh(new THREE.BoxGeometry(2.81, 0.008, 1.31), new THREE.MeshBasicMaterial({ color: 0x3f3f46 }));
  deskEdge.position.y = 0.036;
  studio.add(deskEdge);
  [[-1.3, -0.55], [1.3, -0.55], [-1.3, 0.55], [1.3, 0.55]].forEach(([x, z]) => {
    const l = mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.05, 16), SM(0xc4c4cc, { metalness: 0.9, roughness: 0.25 }));
    l.position.set(x, -0.55, z); studio.add(l);
  });
  const mug = mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.2, 24), SM(0xf2f2f2, { roughness: 0.3 }));
  mug.position.set(-0.95, 0.14, 0.25); studio.add(mug);
  const handle = mesh(new THREE.TorusGeometry(0.055, 0.015, 8, 16), SM(0xf2f2f2, { roughness: 0.3 }));
  handle.position.set(-0.85, 0.14, 0.25); studio.add(handle);
  const steam = [];
  for (let i = 0; i < 3; i++) {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }));
    studio.add(s); steam.push(s);
  }
  const pot = mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.18, 24), SM(0xe9e9e9, { roughness: 0.4 }));
  pot.position.set(1.05, 0.13, -0.25); studio.add(pot);
  for (let i = 0; i < 7; i++) {
    const lf = mesh(new THREE.ConeGeometry(0.045, 0.36, 5), SM(0x3d6b52, { roughness: 0.7 }));
    lf.position.set(1.05, 0.35, -0.25); lf.rotation.set(Math.sin(i * 2.3) * 0.45, i, Math.cos(i * 1.7) * 0.45); studio.add(lf);
  }
  const chair = new THREE.Group(); chair.position.set(0, 0, -0.85); studio.add(chair);
  const seat = mesh(new THREE.CylinderGeometry(0.4, 0.38, 0.1, 40), SM(0x1c1c20, { roughness: 0.5 })); seat.scale.z = 0.9; seat.position.y = -0.42; chair.add(seat);
  const back = mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.08, 40), SM(0x1c1c20, { roughness: 0.5 })); back.rotation.x = Math.PI / 2 + 0.12; back.scale.z = 1.35; back.position.set(0, 0.18, -0.38); chair.add(back);
  const pole = mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.6, 16), SM(0xc4c4cc, { metalness: 0.9, roughness: 0.25 })); pole.position.y = -0.7; chair.add(pole);
  const cbase = mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.05, 5), SM(0x1c1c20)); cbase.position.y = -1; chair.add(cbase);
  const holo = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshBasicMaterial({ map: stex, transparent: true, opacity: 0.9, side: THREE.DoubleSide }));
  holo.position.set(1.95, 1.5, -0.3); holo.rotation.y = -0.5; studio.add(holo);
  holo.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(1.66, 1.06)), new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 })));

  /* the person */
  const guy = new THREE.Group(); guy.position.set(0, 0, -0.72); studio.add(guy);
  const skin = SM(0xc98e66, { roughness: 0.55 });
  const shirt = SM(0xe9e7e2, { roughness: 0.85 });
  const shirtL = SM(0xd8d5ce, { roughness: 0.85 });
  const hairM = SM(0x141212, { roughness: 0.95 });
  const pants = SM(0x1c1c20, { roughness: 0.85 });
  const shoeM = SM(0xf2f2f2, { roughness: 0.45 });
  const soleM = SM(0x27272a, { roughness: 0.6 });
  const eyeW = SM(0xf6f3ee, { roughness: 0.2 });
  const irisM = SM(0x2a1a12, { roughness: 0.1 });
  const frameM = SM(0x111113, { metalness: 0.5, roughness: 0.3 });
  const btnM = SM(0x3f3f46, { roughness: 0.3 });
  const TP = [[0, -0.36], [0.25, -0.36], [0.27, -0.25], [0.265, -0.1], [0.29, 0.08], [0.31, 0.24], [0.29, 0.36], [0.21, 0.45], [0.1, 0.5], [0, 0.5]];
  const torso = mesh(new THREE.LatheGeometry(TP.map(([x, y]) => new THREE.Vector2(x, y)), 48), shirt);
  torso.scale.z = 0.74; torso.position.y = 0.06; guy.add(torso);
  const rAt = (y) => { for (let i = 1; i < TP.length; i++) { if (y <= TP[i][1]) { const a = TP[i - 1], b = TP[i]; return a[0] + (b[0] - a[0]) * ((y - a[1]) / (b[1] - a[1] || 1)); } } return 0; };
  [-0.2, -0.05, 0.1, 0.25].forEach((y) => { const b = mesh(new THREE.SphereGeometry(0.013, 12, 10), btnM); b.position.set(0, y + 0.06, rAt(y) * 0.74 + 0.004); guy.add(b); });
  const placket = mesh(new THREE.BoxGeometry(0.03, 0.62, 0.004), shirtL); placket.position.set(0, 0.09, rAt(0.03) * 0.74 + 0.002); guy.add(placket);
  const pelvis = mesh(new THREE.SphereGeometry(0.27, 32, 20), pants); pelvis.scale.set(1.02, 0.42, 0.82); pelvis.position.y = -0.32; guy.add(pelvis);
  const collar = mesh(new THREE.TorusGeometry(0.1, 0.025, 12, 40), shirtL); collar.rotation.x = Math.PI / 2; collar.scale.y = 0.85; collar.position.y = 0.56; guy.add(collar);
  [-1, 1].forEach((s) => { const f = mesh(new THREE.BoxGeometry(0.11, 0.07, 0.012), shirtL); f.position.set(s * 0.055, 0.535, 0.085); f.rotation.set(-0.55, 0, s * 0.55); guy.add(f); });
  const neck = mesh(new THREE.CylinderGeometry(0.072, 0.082, 0.16, 24), skin); neck.position.y = 0.62; guy.add(neck);
  const legsSit = new THREE.Group(), legsStand = new THREE.Group(); guy.add(legsSit, legsStand); legsStand.visible = false;
  [-0.13, 0.13].forEach((x) => {
    const th = mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.52, 24), pants); th.rotation.x = Math.PI / 2; th.position.set(x, -0.34, 0.2); legsSit.add(th);
    const kn = mesh(new THREE.SphereGeometry(0.1, 20, 16), pants); kn.position.set(x, -0.34, 0.46); legsSit.add(kn);
    const sh = mesh(new THREE.CylinderGeometry(0.092, 0.078, 0.5, 24), pants); sh.position.set(x, -0.6, 0.48); legsSit.add(sh);
    const shoe = mesh(new THREE.SphereGeometry(0.1, 24, 16), shoeM); shoe.scale.set(0.85, 0.5, 1.6); shoe.position.set(x, -0.86, 0.56); legsSit.add(shoe);
    const sole = mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.025, 24), soleM); sole.scale.z = 1.9; sole.position.set(x, -0.905, 0.56); legsSit.add(sole);
  });
  [-0.13, 0.13].forEach((x) => {
    const th = mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.5, 24), pants); th.position.set(x, -0.6, 0); legsStand.add(th);
    const kn = mesh(new THREE.SphereGeometry(0.1, 20, 16), pants); kn.position.set(x, -0.86, 0); legsStand.add(kn);
    const sh = mesh(new THREE.CylinderGeometry(0.092, 0.078, 0.5, 24), pants); sh.position.set(x, -1.1, 0); legsStand.add(sh);
    const shoe = mesh(new THREE.SphereGeometry(0.1, 24, 16), shoeM); shoe.scale.set(0.85, 0.5, 1.6); shoe.position.set(x, -1.36, 0.07); legsStand.add(shoe);
    const sole = mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.025, 24), soleM); sole.scale.z = 1.9; sole.position.set(x, -1.405, 0.07); legsStand.add(sole);
  });
  const headG = new THREE.Group(); headG.position.y = 0.86; guy.add(headG);
  const head = mesh(new THREE.SphereGeometry(0.23, 48, 36), skin); head.scale.set(1, 1.13, 1.05); headG.add(head);
  [-1, 1].forEach((s) => { const e = mesh(new THREE.SphereGeometry(0.05, 20, 16), skin); e.scale.set(0.45, 1, 0.75); e.position.set(s * 0.228, 0, -0.01); headG.add(e); });
  const nose = mesh(new THREE.SphereGeometry(0.038, 20, 16), skin); nose.scale.set(0.8, 1.05, 1.1); nose.position.set(0, -0.005, 0.236); headG.add(nose);
  // short, trimmed beard along the jaw so the face stays readable
  const beardM = SM(0x221c19, { roughness: 0.95 });
  const beard = mesh(new THREE.SphereGeometry(0.236, 48, 24, 0, Math.PI * 2, Math.PI * 0.64, Math.PI * 0.36), beardM); beard.scale.set(1.01, 1.12, 1.07); beard.position.set(0, -0.004, 0.004); headG.add(beard);
  const must = mesh(new THREE.CapsuleGeometry(0.011, 0.07, 4, 8), beardM); must.rotation.z = Math.PI / 2; must.position.set(0, -0.068, 0.236); headG.add(must);
  const mouth = mesh(new THREE.CapsuleGeometry(0.006, 0.04, 4, 8), SM(0x7a3b2e, { roughness: 0.6 })); mouth.rotation.z = Math.PI / 2; mouth.position.set(0, -0.098, 0.236); headG.add(mouth);
  const hair = mesh(new THREE.SphereGeometry(0.245, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.43), hairM); hair.scale.set(1.03, 1.16, 1.08); hair.position.set(0, 0.02, -0.012); headG.add(hair);
  const quiff = mesh(new THREE.SphereGeometry(0.13, 32, 20), hairM); quiff.scale.set(1.55, 0.5, 1); quiff.position.set(0, 0.215, 0.1); quiff.rotation.x = -0.35; headG.add(quiff);
  [-1, 1].forEach((s) => { const sb = mesh(new THREE.BoxGeometry(0.035, 0.12, 0.07), hairM); sb.position.set(s * 0.218, -0.01, 0.03); headG.add(sb); });
  const eyes = [-1, 1].map((s) => {
    const g = new THREE.Group(); g.position.set(s * 0.08, 0.035, 0.205);
    const w = mesh(new THREE.SphereGeometry(0.03, 20, 16), eyeW); w.scale.set(1, 0.78, 0.55); g.add(w);
    const ir = mesh(new THREE.SphereGeometry(0.015, 16, 12), irisM); ir.position.z = 0.014; g.add(ir);
    headG.add(g); return g;
  });
  [-1, 1].forEach((s) => { const b = mesh(new THREE.BoxGeometry(0.075, 0.013, 0.02), hairM); b.position.set(s * 0.082, 0.088, 0.218); b.rotation.z = -s * 0.08; headG.add(b); });
  [-1, 1].forEach((s) => {
    const r = mesh(new THREE.TorusGeometry(0.05, 0.007, 10, 36), frameM); r.position.set(s * 0.082, 0.035, 0.245); headG.add(r);
    const tmp = mesh(new THREE.BoxGeometry(0.007, 0.007, 0.24), frameM); tmp.position.set(s * 0.13, 0.045, 0.13); headG.add(tmp);
  });
  const bridge = mesh(new THREE.BoxGeometry(0.04, 0.007, 0.007), frameM); bridge.position.set(0, 0.045, 0.247); headG.add(bridge);
  function arm(side) {
    const sh = new THREE.Group(); sh.position.set(side * 0.31, 0.46, 0); guy.add(sh);
    sh.add(mesh(new THREE.SphereGeometry(0.098, 24, 18), shirt));
    const up = mesh(new THREE.CylinderGeometry(0.088, 0.074, 0.4, 24), shirt); up.position.y = -0.2; sh.add(up);
    const el = new THREE.Group(); el.position.y = -0.4; sh.add(el);
    el.add(mesh(new THREE.SphereGeometry(0.074, 20, 16), shirt));
    const fo = mesh(new THREE.CylinderGeometry(0.071, 0.06, 0.32, 24), shirt); fo.position.y = -0.16; el.add(fo);
    const cuff = mesh(new THREE.CylinderGeometry(0.064, 0.064, 0.05, 24), shirtL); cuff.position.y = -0.33; el.add(cuff);
    if (side < 0) {
      const watch = mesh(new THREE.TorusGeometry(0.05, 0.013, 10, 28), SM(0x18181b, { metalness: 0.6, roughness: 0.3 })); watch.rotation.x = Math.PI / 2; watch.position.y = -0.37; el.add(watch);
      const face = mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.012, 20), SM(0xd4d4d8, { metalness: 0.9, roughness: 0.2 })); face.position.set(0, -0.37, 0.058); face.rotation.x = Math.PI / 2; el.add(face);
    }
    const hand = new THREE.Group(); hand.position.y = -0.39; el.add(hand);
    const palm = mesh(new THREE.SphereGeometry(0.052, 20, 16), skin); palm.scale.set(1.1, 1.25, 0.55); palm.position.y = -0.035; hand.add(palm);
    [-0.03, -0.01, 0.01, 0.03].forEach((x, k) => { const f = mesh(new THREE.CylinderGeometry(0.011, 0.01, 0.065 - (k === 0 || k === 3 ? 0.012 : 0), 10), skin); f.position.set(x, -0.1, 0); hand.add(f); });
    const th = mesh(new THREE.CylinderGeometry(0.012, 0.011, 0.055, 10), skin); th.position.set(-side * 0.05, -0.05, 0.01); th.rotation.z = -side * 0.7; hand.add(th);
    sh.rotation.set(-0.5, 0, side * 0.08); el.rotation.x = -0.85;
    return { sh, el };
  }
  const armL = arm(-1), armR = arm(1);

  /* ---------- LAPTOP (travels on its own) ----------
     Rounded aluminium unibody, backlit keyboard, glass trackpad, glossy bezel with a camera notch. */
  const laptop = new THREE.Group(); scene.add(laptop);
  const rrShape = (w, h, r) => {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    return s;
  };
  const alu = new THREE.MeshPhysicalMaterial({ color: 0xc9cad1, metalness: 0.9, roughness: 0.3, clearcoat: 0.35, clearcoatRoughness: 0.35 });
  const base = mesh(new RoundedBoxGeometry(1.1, 0.034, 0.74, 4, 0.016), alu);
  laptop.add(base);
  // keyboard well: the violet backlight glows in the gaps between the keys
  const well = new THREE.Mesh(new RoundedBoxGeometry(0.96, 0.004, 0.34, 2, 0.012), new THREE.MeshStandardMaterial({ color: 0x0b0b0e, emissive: 0x9d8cff, emissiveIntensity: 0.45, roughness: 0.8 }));
  well.position.set(0, 0.0165, -0.075);
  laptop.add(well);
  const KEY_PITCH = 0.0665, ROWS_Z = [-0.225, -0.175, -0.115, -0.055, 0.005, 0.062];
  const keySpecs = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 14; c++) keySpecs.push([-0.4325 + c * KEY_PITCH, ROWS_Z[r], 1, r === 0 ? 0.56 : 1]);
  [0, 1, 2, 9, 10, 11, 12, 13].forEach((c) => keySpecs.push([-0.4325 + c * KEY_PITCH, ROWS_Z[5], 1, 1]));
  keySpecs.push([-0.4325 + 5.5 * KEY_PITCH, ROWS_Z[5], 5.9, 1]);
  const keys = new THREE.InstancedMesh(new RoundedBoxGeometry(0.056, 0.008, 0.05, 2, 0.008), SM(0x131316, { roughness: 0.55, metalness: 0.1 }), keySpecs.length);
  const km = new THREE.Matrix4();
  keySpecs.forEach(([x, z, sx, sz], i) => { km.makeScale(sx, 1, sz); km.setPosition(x, 0.0225, z); keys.setMatrixAt(i, km); });
  keys.receiveShadow = true;
  laptop.add(keys);
  [-1, 1].forEach((side) => {
    const grille = new THREE.Mesh(new RoundedBoxGeometry(0.028, 0.002, 0.3, 1, 0.006), SM(0x2a2a2f, { roughness: 0.9 }));
    grille.position.set(side * 0.51, 0.0172, -0.085); laptop.add(grille);
  });
  const pad = new THREE.Mesh(new RoundedBoxGeometry(0.4, 0.002, 0.2, 2, 0.012), new THREE.MeshPhysicalMaterial({ color: 0xb4b5bd, metalness: 0.55, roughness: 0.16, clearcoat: 0.8 }));
  pad.position.set(0, 0.0172, 0.235); laptop.add(pad);
  const barrel = mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.86, 24), SM(0x2a2a2e, { metalness: 0.8, roughness: 0.35 }));
  barrel.rotation.z = Math.PI / 2; barrel.position.set(0, 0.018, -0.362); laptop.add(barrel);

  const hinge = new THREE.Group(); hinge.position.set(0, 0.02, -0.36); laptop.add(hinge);
  const lid = mesh(new RoundedBoxGeometry(1.1, 0.7, 0.012, 4, 0.006), alu); lid.position.y = 0.35; hinge.add(lid);
  const bezel = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(1.084, 0.684, 0.014)), new THREE.MeshPhysicalMaterial({ color: 0x050506, roughness: 0.18, metalness: 0.1, clearcoat: 1 }));
  bezel.position.set(0, 0.35, 0.0062); hinge.add(bezel);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(1.03, 0.644), new THREE.MeshBasicMaterial({ map: stex, toneMapped: false }));
  screen.position.set(0, 0.344, 0.0066); hinge.add(screen);
  const notch = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(0.1, 0.03, 0.008)), new THREE.MeshBasicMaterial({ color: 0x050506 }));
  notch.position.set(0, 0.344 + 0.322 - 0.011, 0.0069); hinge.add(notch);
  const cam = new THREE.Mesh(new THREE.CircleGeometry(0.0055, 20), new THREE.MeshBasicMaterial({ color: 0x1c1c2e }));
  cam.position.set(0, 0.344 + 0.322 - 0.013, 0.0071); hinge.add(cam);
  // glass: a faint reflective layer plus a diagonal glare streak
  const glass = new THREE.Mesh(new THREE.ShapeGeometry(rrShape(1.084, 0.684, 0.014)), new THREE.MeshPhysicalMaterial({ color: 0xffffff, metalness: 0, roughness: 0.04, clearcoat: 1, transparent: true, opacity: 0.07, depthWrite: false }));
  glass.position.set(0, 0.35, 0.0074); hinge.add(glass);
  const gc = document.createElement('canvas'); gc.width = 256; gc.height = 160;
  const gx = gc.getContext('2d'); const gg = gx.createLinearGradient(0, 0, 256, 160);
  gg.addColorStop(0.3, 'rgba(255,255,255,0)'); gg.addColorStop(0.42, 'rgba(255,255,255,.55)'); gg.addColorStop(0.5, 'rgba(255,255,255,0)');
  gx.fillStyle = gg; gx.fillRect(0, 0, 256, 160);
  const glare = new THREE.Mesh(new THREE.PlaneGeometry(1.03, 0.644), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(gc), transparent: true, opacity: 0.09, depthWrite: false, blending: THREE.AdditiveBlending }));
  glare.position.set(0, 0.344, 0.0076); hinge.add(glare);
  // glowing logo on the back of the lid
  const lidLogo = new THREE.Mesh(new THREE.CircleGeometry(0.05, 40), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  lidLogo.position.set(0, 0.35, -0.0065); lidLogo.rotation.y = Math.PI; hinge.add(lidLogo);
  const logoGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(dcGlow()), color: 0x9d8cff, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending }));
  logoGlow.position.set(0, 0.35, -0.007); logoGlow.rotation.y = Math.PI; hinge.add(logoGlow);
  const HINGE_OPEN = -0.24;
  hinge.rotation.x = HINGE_OPEN;
  let lidKick = 0;
  const sLight = new THREE.PointLight(0xe6e1ff, 2.2, 2.6, 1); sLight.position.set(0, 0.45, 0.35); laptop.add(sLight);

  /* ---------- PHONE (for the mobile-app project) ---------- */
  const pc = document.createElement('canvas'); pc.width = 540; pc.height = 1140;
  const p2 = pc.getContext('2d');
  const ptex = new THREE.CanvasTexture(pc); ptex.colorSpace = THREE.SRGBColorSpace; ptex.anisotropy = 4;
  const phoneP = PROJECTS.find((p) => p.phone);
  const PIMG = (phoneP ? phoneP.phone : []).map((s) => { const im = new Image(); im.src = `/${s}`; return im; });
  const phone = new THREE.Group(); scene.add(phone);
  phone.add(mesh(new THREE.BoxGeometry(0.64, 1.3, 0.07), SM(0x1c1c20, { metalness: 0.6, roughness: 0.3 })));
  const pBezel = new THREE.Mesh(new THREE.PlaneGeometry(0.61, 1.27), new THREE.MeshBasicMaterial({ color: 0x050505 })); pBezel.position.z = 0.0355; phone.add(pBezel);
  const pscr = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 1.224), new THREE.MeshBasicMaterial({ map: ptex, toneMapped: false })); pscr.position.z = 0.0362; phone.add(pscr);
  const punch = new THREE.Mesh(new THREE.CircleGeometry(0.014, 16), new THREE.MeshBasicMaterial({ color: 0x000000 })); punch.position.set(0, 0.585, 0.0368); phone.add(punch);
  phone.visible = false;
  let phoneW = 0;
  function drawPhone(t) {
    p2.fillStyle = '#111'; p2.fillRect(0, 0, 540, 1140);
    const n = PIMG.length; if (!n) return;
    const ph = t / 2.8, i = Math.floor(ph) % n, tr = clamp(((ph % 1) - 0.8) / 0.2), e2 = ease(tr);
    const draw = (im, dx) => { if (!im.complete || !im.naturalWidth) return; const s = Math.max(540 / im.naturalWidth, 1140 / im.naturalHeight), w = im.naturalWidth * s; p2.drawImage(im, dx + (540 - w) / 2, 0, w, im.naturalHeight * s); };
    draw(PIMG[i], -e2 * 540); if (tr > 0) draw(PIMG[(i + 1) % n], 540 - e2 * 540);
    const on = tr > 0.5 ? (i + 1) % n : i;
    for (let k = 0; k < n; k++) { p2.fillStyle = k === on ? '#ffffff' : 'rgba(255,255,255,.35)'; p2.beginPath(); p2.arc(270 + (k - (n - 1) / 2) * 24, 1105, k === on ? 8 : 6, 0, 7); p2.fill(); }
    ptex.needsUpdate = true;
  }

  /* ---------- chrome tech logos, extruded from the official SVG paths ---------- */
  const svgLoader = new SVGLoader();
  function logoGeo(icon, segs) {
    const data = svgLoader.parse(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}"/></svg>`);
    const shapes = data.paths.flatMap((p) => p.toShapes(true));
    const g = new THREE.ExtrudeGeometry(shapes, { depth: 3.2, bevelEnabled: true, bevelThickness: 0.45, bevelSize: 0.25, bevelSegments: 2, curveSegments: segs });
    g.center(); g.rotateX(Math.PI); g.scale(0.032, 0.032, 0.032); g.computeVertexNormals();
    return g;
  }
  const chromeMat = (hex) => {
    const brand = new THREE.Color(brandColor(hex));
    const m = BRAND_LOGOS
      ? new THREE.MeshStandardMaterial({ color: brand, metalness: 0.35, roughness: 0.32, emissive: brand, emissiveIntensity: 1 })
      : new THREE.MeshStandardMaterial({ color: 0xe4e4e7, metalness: 1, roughness: 0.2, emissive: 0x000000 });
    m.userData.brand = brand;
    m.userData.base = BRAND_LOGOS ? brand.clone() : new THREE.Color(0xe4e4e7);
    return m;
  };
  // brand mode: always coloured, a little self-glow so dark brand colours still read; hover adds more glow
  const tintLogo = (mat, glow) => {
    mat.color.copy(mat.userData.base).lerp(mat.userData.brand, glow);
    mat.emissive.copy(mat.userData.brand).multiplyScalar(BRAND_LOGOS ? 0.12 + glow * 0.3 : glow * 0.35);
  };
  const planets = MAIN_LOGOS.map((ic, i) => {
    const m = new THREE.Mesh(logoGeo(ic, small ? 8 : 14), chromeMat(ic.hex));
    m.castShadow = true;
    const halo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.57, 48), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, side: THREE.DoubleSide }));
    m.add(halo);
    m.userData = { i, halo, glow: 0, spin: 0, ry: 0, name: ic.title };
    scene.add(m);
    return m;
  });
  const moons = MOON_LOGOS.map((ic, j) => {
    const m = new THREE.Mesh(logoGeo(ic, small ? 6 : 10), chromeMat(ic.hex));
    m.castShadow = true;
    m.userData = { j, sd: Math.random(), sd2: Math.random(), sc: 0.001, name: ic.title, glow: 0 };
    m.scale.setScalar(0.001);
    scene.add(m);
    return m;
  });
  const MC = [
    { c: [4.2, 0.6, -4.5], rx: 3.6, ry: 3.2, sp: 0.05 },
    { c: [9, 3, -10], rx: 0.5, ry: 0.5, sp: 0.04, hide: 1 },
    { c: [-4, 0.3, -5], rx: 3.6, ry: 3.4, sp: 0.04 },
    { c: [3.3, 0.1, -0.8], rx: 3.4, ry: 1.2, sp: 0.18, ring: 1 },
    { c: [4.2, 0, -3.5], rx: 2.8, ry: 3.5, sp: 0.05 },
    { c: [3.4, 2.4, -3], rx: 3.4, ry: 1.2, sp: 0.15, ring: 1 },
  ];
  function moonState(k, j, t) {
    const n = moons.length, m = MC[k], a = t * m.sp + j * ((Math.PI * 2) / n);
    if (m.hide) return { p: m.c, s: 0.001 };
    if (m.ring) return { p: [m.c[0] + Math.cos(a) * m.rx, m.c[1] + Math.sin(a) * m.ry * 0.4, m.c[2] + Math.sin(a) * m.rx * 0.45], s: 0.42 };
    const u = moons[j].userData;
    return { p: [m.c[0] + Math.cos(a + j * 1.7) * m.rx * (0.45 + 0.55 * u.sd), m.c[1] + Math.sin(a * 1.3 + j) * m.ry * (u.sd2 * 2 - 1), m.c[2] - u.sd * 2], s: 0.42 };
  }

  /* ---------- particles that morph between formations ---------- */
  const N = small ? 700 : 2600;
  const forms = [];
  forms.push(Float32Array.from({ length: N * 3 }, (_, k) => (k % 3 === 0 ? rnd(-14, 14) : k % 3 === 1 ? rnd(-8, 8) : rnd(-14, 2))));
  { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const phi = Math.acos(1 - (2 * (i + 0.5)) / N), th = Math.PI * (1 + Math.sqrt(5)) * i, r = 3.4; a[i * 3] = -3.1 + r * Math.cos(th) * Math.sin(phi); a[i * 3 + 1] = 0.2 + r * Math.cos(phi); a[i * 3 + 2] = -1.8 + r * Math.sin(th) * Math.sin(phi); } forms.push(a); }
  { const a = new Float32Array(N * 3); const cols = Math.ceil(Math.sqrt(N * 1.6)); for (let i = 0; i < N; i++) { const cx = i % cols, cz = Math.floor(i / cols); a[i * 3] = -13 + (cx / cols) * 26; a[i * 3 + 1] = -2.9; a[i * 3 + 2] = -14 + (cz / (N / cols)) * 16; } forms.push(a); }
  { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const k = i % 6, r = 1.35 + k * 0.38 + rnd(-0.04, 0.04), an = rnd(0, Math.PI * 2); a[i * 3] = 2.9 + Math.cos(an) * r; a[i * 3 + 1] = 0.1 + Math.sin(an) * r * 0.35 + rnd(-0.03, 0.03); a[i * 3 + 2] = Math.sin(an) * r * 0.5; } forms.push(a); }
  { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const u = Math.random(), rung = i % 7 === 0, st = i % 2, an = u * Math.PI * 5 + st * Math.PI, y = -3.8 + u * 7.6;
    if (rung) { const t = Math.random(), x1 = Math.cos(an) * 1.4, z1 = Math.sin(an) * 1.4; a[i * 3] = 3.1 + lerp(x1, -x1, t); a[i * 3 + 1] = y; a[i * 3 + 2] = lerp(z1, -z1, t); }
    else { a[i * 3] = 3.1 + Math.cos(an) * 1.4 + rnd(-0.05, 0.05); a[i * 3 + 1] = y; a[i * 3 + 2] = Math.sin(an) * 1.4 + rnd(-0.05, 0.05); } } forms.push(a); }
  { const a = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const arm2 = i % 3, r = Math.pow(Math.random(), 0.6) * 5.2, an = r * 1.15 + arm2 * 2.094 + rnd(-0.3, 0.3); a[i * 3] = 2.9 + Math.cos(an) * r; a[i * 3 + 1] = 0.6 + Math.sin(an) * r * 0.32 + rnd(-0.12, 0.12); a[i * 3 + 2] = -3 + Math.sin(an) * r * 0.6; } forms.push(a); }
  const delay = Float32Array.from({ length: N }, () => Math.random());
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(forms[0]);
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pal = [0xffffff, 0xd4d4d8, 0x9d8cff, 0xa1a1aa].map((c) => new THREE.Color(c));
  const pCol = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { const c = pal[i % pal.length]; pCol[i * 3] = c.r; pCol[i * 3 + 1] = c.g; pCol[i * 3 + 2] = c.b; }
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
  const dc = document.createElement('canvas'); dc.width = dc.height = 64;
  const dx = dc.getContext('2d');
  const rg = dx.createRadialGradient(32, 32, 0, 32, 32, 32);
  rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(0.4, 'rgba(255,255,255,.55)'); rg.addColorStop(1, 'rgba(255,255,255,0)');
  dx.fillStyle = rg; dx.fillRect(0, 0, 64, 64);
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.06, map: new THREE.CanvasTexture(dc), vertexColors: true, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(points);

  /* ---------- background helix: a slim double strip that winds along the page as you scroll ---------- */
  const HN = small ? 500 : 1300, HH = 18;
  const hPos = new Float32Array(HN * 3), hCol = new Float32Array(HN * 3), hU = new Float32Array(HN), hSt = new Float32Array(HN), hRung = new Float32Array(HN);
  const hPal = [new THREE.Color(0xffffff), new THREE.Color(0x9d8cff)];
  for (let i = 0; i < HN; i++) {
    hU[i] = Math.random(); hSt[i] = i % 2; hRung[i] = Math.random();
    const c = hPal[hSt[i]]; hCol[i * 3] = c.r; hCol[i * 3 + 1] = c.g; hCol[i * 3 + 2] = c.b;
  }
  const hGeo = new THREE.BufferGeometry();
  hGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
  hGeo.setAttribute('color', new THREE.BufferAttribute(hCol, 3));
  const hMat = new THREE.PointsMaterial({ size: 0.05, map: points.material.map, vertexColors: true, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending });
  const helix = new THREE.Points(hGeo, hMat);
  helix.frustumCulled = false;
  scene.add(helix);

  /* ---------- keyframes, one per section: hero, services, work, skills, experience, contact ---------- */
  const STUDIO = [
    { p: [2.5, -1.25, 0], r: [0.12, -0.62, 0], s: 1 },
    { p: [9, -1.2, 2.2], r: [0.03, 0.12, 0], s: 1.5 },       // services: set every frame from the screen he stands at
    { p: [3.5, -1.6, -6], r: [0.1, -0.3, 0], s: 0.9 },       // projects: room far back, laptop up front
    { p: [17.8, -0.77, 1.75], r: [0.05, -0.15, 0], s: 1.1 }, // skills: the bookshelf behind the logos
    { p: [19.97, -0.8, 2.37], r: [0.05, -0.2, 0], s: 1.1 },  // experience: the night window
    { p: [2.9, -1.45, 0], r: [0.1, -0.4, 0], s: 0.95 },
  ];
  const LAP = [
    { attach: 1 }, { attach: 1 },
    { p: [-2.75, -0.55, 1.4], r: [0.14, 0.45, 0], s: 2.25 },
    { p: [3.3, -0.05, -0.6], r: [0.45, -0.4, 0], s: 1.35 },
    { p: [3.2, 2.6, -0.8], r: [0.5, -0.9, 0.15], s: 0.7 },
    { attach: 1 },
  ];
  const CAMZ = [10, 10, 10, 10.2, 10.4, 9.8];
  // every formation stays on the 3D side of the screen so text stays clean
  const HERO_SPOTS = [[1.9, 2.3, -1.2], [5.6, 1.6, -1.5], [5.8, -1.6, 0.2], [1.6, -2.4, -0.6], [3.9, 3, -2.4], [6.4, 0.2, -2.6]];
  const NP = planets.length, TAU = Math.PI * 2;
  const PF = [
    (i, t) => { const s = HERO_SPOTS[i]; return { p: [s[0] + Math.cos(t * 0.7 + i) * 0.08, s[1] + Math.sin(t * 1.1 + i * 1.3) * 0.18, s[2]], s: 0.8 }; },
    (i) => ({ p: [8 + i * 0.5, 3, -10], s: 0.001 }),
    (i, t) => { const a = t * 0.3 + (i * TAU) / NP; return { p: [-2.75 + Math.cos(a) * 2.5, -0.2 + Math.sin(a) * 1.8, 0.2 + Math.sin(a) * 0.6], s: 0.45 }; },
    (i, t) => { const r = 1.7 + i * 0.3, a = t * (0.5 - i * 0.05) + i * 1.3; return { p: [3.3 + Math.cos(a) * r, 0.1 + Math.sin(a) * r * 0.3, -0.6 + Math.sin(a) * r * 0.5], s: 0.6 + (S.hotGroup === i ? 0.35 : 0) }; },
    (i, t) => { const a = i * 1.3 + t * 0.35; return { p: [3.3 + Math.cos(a) * 1.5, 2.3 - i * 0.92, -0.4 + Math.sin(a) * 1.5], s: 0.5 + (S.activeJ === i ? 0.2 : 0) }; },
    (i, t) => { const a = t * 0.5 + (i * TAU) / NP; return { p: [3.1 + Math.cos(a) * 2.2, -1.25 + Math.sin(a * 2) * 0.12, -0.2 + Math.sin(a) * 1.6], s: 0.45 }; },
  ];

  /* ---------- interaction ---------- */
  const ray = new THREE.Raycaster();
  const ptr = new THREE.Vector2(9, 9);
  let tx = 0, ty = 0, pointerX = 0, pointerY = 0, overUI = true;
  const UI_SEL = 'a, button, input, textarea, label, select, .card, dialog, .mmenu, .header, .mbar, .quick';
  addEventListener('pointermove', (e) => {
    ptr.x = (e.clientX / innerWidth) * 2 - 1; ptr.y = -(e.clientY / innerHeight) * 2 + 1;
    pointerX = e.clientX; pointerY = e.clientY;
    if (e.pointerType === 'mouse') { tx = ptr.x; ty = ptr.y; }
    overUI = !!e.target.closest?.(UI_SEL);
  }, { passive: true });
  let jump = 0, hovered = null;
  const pickables = [...planets, ...moons];
  function pick() {
    ray.setFromCamera(ptr, camera);
    const vis = pickables.filter((m) => m.visible && m.scale.x > 0.05);
    const hit = ray.intersectObjects(vis, false)[0];
    if (hit) return hit.object;
    if (studio.visible && studio.scale.x > 0.5 && ray.intersectObject(guy, true).length) return guy;
    return null;
  }
  addEventListener('click', (e) => {
    if (e.target.closest(UI_SEL)) return;
    ptr.x = (e.clientX / innerWidth) * 2 - 1; ptr.y = -(e.clientY / innerHeight) * 2 + 1;
    const o = pick();
    if (!o) return;
    if (o === guy) { wave("Hi, I'm Burhanuddin 👋"); jump = 1; return; }
    o.userData.spin = 1;
    say(`${o.userData.name}: used in production`);
  });

  let speechT, speechOn = false;
  function say(text, ms = 2800) {
    if (!speechEl) return;
    speechEl.textContent = text;
    speechEl.classList.add('show');
    speechOn = true;
    clearTimeout(speechT);
    speechT = setTimeout(() => { speechEl.classList.remove('show'); speechOn = false; }, ms);
  }
  function wave(text) { S.wave = 1; if (text) say(text); }

  /* ---------- loop ---------- */
  const tmpV = V(0, 0, 0);
  // phones: everything shifts into the top ~40% of the screen (above the hero text), closer and bigger
  const mob = (o) => (isMobile() ? { p: [o.p[0] * 0.12, o.p[1] + 2.45, o.p[2] - 1.4], r: o.r, s: o.s * 0.8 } : o);
  // logos on phones: spread to the left/right edges and above, so none floats in front of him
  const mobLogo = (o) => {
    if (!isMobile()) return o;
    const m = mob(o);
    const x = (o.p[0] - 3.4) * 0.5;
    m.p[0] = x + Math.sign(x || 1) * 0.55;
    m.p[1] -= 0.2;
    m.s *= 0.85;
    return m;
  };
  function attachState() {
    studio.updateMatrixWorld(true);
    const w = studio.localToWorld(V(0, 0.07, -0.12));
    return { p: [w.x, w.y, w.z], r: [studio.rotation.x, studio.rotation.y + Math.PI, studio.rotation.z], s: studio.scale.x };
  }
  const lerpState = (A, B, t) => ({ p: A.p.map((v, k) => lerp(v, B.p[k], t)), r: (A.r || [0, 0, 0]).map((v, k) => lerp(v, (B.r || [0, 0, 0])[k], t)), s: lerp(A.s, B.s, t) });
  function apply(o, st) { o.position.set(st.p[0], st.p[1], st.p[2]); if (st.r) o.rotation.set(st.r[0], st.r[1], st.r[2]); o.scale.setScalar(st.s); }

  S.fs = S.f;
  const footerEl = document.querySelector('.footer');
  let camX = 0, camY = 0, presentW = 0, guyY = 0, svcFocus = 0, lastBoard = -1, prevGX = 0, standing = false, guyRot = 0;
  const svcEuler = new THREE.Euler(0.03, 0.12, 0);
  let raf = 0, t = 0, last = performance.now(), frame = 0, greeted = false, contactGreeted = false;
  function tick() {
    raf = requestAnimationFrame(tick);
    const now = performance.now(), dt = Math.min((now - last) / 1000, 0.05);
    last = now; t += dt; frame++;

    S.fs = reduced ? S.f : S.fs + (S.f - S.fs) * 0.07;
    // phones: the 3D scene belongs to the intro only. Past it, fade it out and stop drawing,
    // so scrolling the rest of the page never competes with WebGL for the phone's CPU/GPU.
    if (isMobile()) {
      const op = clamp(1 - (S.fs - 0.25) / 0.45);
      const ops = op.toFixed(2);
      if (canvas.style.opacity !== ops) canvas.style.opacity = ops;
      if (op <= 0) { if (speechEl) speechEl.classList.remove('show'); return; }
    } else if (canvas.style.opacity) canvas.style.opacity = '';
    const fs = S.fs, i0 = Math.min(LAST, Math.floor(fs)), i1 = Math.min(LAST, i0 + 1), e = ease(fs - i0);

    // services: the room slides so the screen he is presenting sits on the right half of the screen
    const svcT = Math.min(SERVICES.length - 1, Math.floor(clamp(S.svcP || 0) * SERVICES.length));
    svcFocus += (svcT - svcFocus) * (reduced ? 1 : 0.045);
    const bx = BX[0] + svcFocus * (BX[1] - BX[0]);
    tmpV.set(bx, BY, RB).applyEuler(svcEuler).multiplyScalar(STUDIO[1].s);
    STUDIO[1].p = [2.3 - tmpV.x, 0.45 - tmpV.y, 0.4 - tmpV.z];
    const st = lerpState(STUDIO[i0], STUDIO[i1], e); apply(studio, mob(st)); studio.visible = studio.scale.x > 0.12;
    const la = LAP[i0].attach ? attachState() : mob(LAP[i0]);
    const lb = LAP[i1].attach ? attachState() : mob(LAP[i1]);
    const ls = lerpState(la, lb, e);
    spinBoost *= 0.94;
    ls.r[1] += spinBoost * Math.PI * 2 * (1 - spinBoost);
    if (!LAP[i0].attach || !LAP[i1].attach) ls.p[1] += Math.sin(t * 0.8) * 0.015 * Math.min(1, Math.abs(fs - 1) * 2);
    apply(laptop, ls);
    phoneW += ((Math.round(fs) === 2 && PROJECTS[S.activeP]?.phone ? 1 : 0) - phoneW) * 0.08;
    laptop.scale.multiplyScalar(1 - phoneW * 0.999);
    if (phoneW > 0.01) {
      phone.visible = true;
      phone.position.set(ls.p[0] + 0.2, ls.p[1] + 0.6 + Math.sin(t * 0.8) * 0.015, ls.p[2]);
      phone.rotation.set(0.04, 0.3 + Math.sin(t * 0.4) * 0.05 + (1 - phoneW) * 2.5, 0);
      phone.scale.setScalar(Math.max(0.001, phoneW * (isMobile() ? 1.15 : 1.8)));
      drawPhone(t);
    } else phone.visible = false;
    updateScreen();
    // on a new project the lid dips a little and springs back open
    lidKick *= 0.93;
    hinge.rotation.x = HINGE_OPEN + 1.6 * lidKick * (1 - lidKick);
    logoGlow.material.opacity = 0.45 + Math.sin(t * 2) * 0.1;

    // hover picking, throttled
    if (frame % 3 === 0 && !isMobile()) {
      const nh = overUI ? null : pick();
      if (nh !== hovered) {
        hovered = nh;
        document.body.classList.toggle('hover-3d', !!nh);
        document.querySelector('.cursor')?.classList.toggle('hover', !!nh);
        if (tipEl) { tipEl.textContent = nh && nh !== guy ? nh.userData.name : ''; tipEl.classList.toggle('show', !!nh && nh !== guy); }
        document.querySelectorAll('.sk-tab').forEach((g, i) => g.classList.toggle('hot', !!nh && nh.userData.i === i));
      }
      if (hovered && tipEl) { tipEl.style.left = `${pointerX}px`; tipEl.style.top = `${pointerY}px`; }
    }

    planets.forEach((pl) => {
      const u = pl.userData, i = u.i;
      const a = PF[i0](i, t), b = PF[i1](i, t);
      const s = mobLogo({ p: a.p.map((v, k) => lerp(v, b.p[k], e)), s: lerp(a.s, b.s, e) });
      pl.position.set(s.p[0], s.p[1], s.p[2]);
      const hot = pl === hovered || (S.hotGroup === i && Math.round(fs) === 3) || (S.activeJ === i && Math.round(fs) === 4);
      u.glow += ((hot ? 1 : 0) - u.glow) * 0.1;
      u.spin *= 0.95;
      pl.scale.setScalar(s.s * 1.15 * (1 + u.glow * 0.2 + u.spin * 0.4));
      u.ry += u.spin * 0.35 + u.glow * 0.04;
      pl.rotation.set(Math.sin(t * 0.5 + i) * 0.18, Math.sin(t * 0.7 + i * 1.3) * 0.6 + u.ry, Math.sin(t * 0.4 + i) * 0.06);
      tintLogo(pl.material, u.glow);
      u.halo.material.opacity = (pl === hovered ? 1 : 0) * u.glow * 0.6;
      u.halo.lookAt(camera.position);
    });
    moons.forEach((m, j) => {
      const a = moonState(i0, j, t), b = moonState(i1, j, t);
      const s = mobLogo({ p: a.p.map((v, k) => lerp(v, b.p[k], e)), s: lerp(a.s, b.s, e) });
      m.position.set(s.p[0], s.p[1], s.p[2]);
      const u = m.userData;
      u.sc += (s.s - u.sc) * 0.05;
      u.spin = (u.spin || 0) * 0.95;
      u.glow += ((m === hovered ? 1 : 0) - u.glow) * 0.12;
      m.scale.setScalar(u.sc * (1 + u.glow * 0.3 + u.spin * 0.4));
      m.rotation.set(Math.sin(t * 0.6 + j) * 0.2, Math.sin(t * 0.5 + j * 2) * 0.7 + u.spin * 6, 0);
      tintLogo(m.material, u.glow);
    });

    // particles morph with stagger
    const A = forms[i0], B = forms[i1], tt = fs - i0;
    const wGrid = Math.max(0, 1 - Math.abs(fs - 2)), wBelt = Math.max(0, 1 - Math.abs(fs - 3));
    for (let i = 0; i < N; i++) {
      const k = clamp((tt - delay[i] * 0.35) / 0.65), ee = ease(k), j = i * 3;
      let x = A[j] + (B[j] - A[j]) * ee, y = A[j + 1] + (B[j + 1] - A[j + 1]) * ee, z = A[j + 2] + (B[j + 2] - A[j + 2]) * ee;
      if (wGrid > 0) y += (Math.sin(x * 0.55 + t * 1.4) * 0.28 + Math.cos(z * 0.5 + t) * 0.18) * wGrid;
      if (wBelt > 0) { const dx2 = x - 2.9, dz = z, ang = t * 0.08 * wBelt, ca = Math.cos(ang), sa = Math.sin(ang); x = 2.9 + dx2 * ca - dz * sa * 1.4; z = dx2 * sa * 0.7 + dz * ca; }
      pPos[j] = x; pPos[j + 1] = y + Math.sin(t + i) * 0.015; pPos[j + 2] = z;
    }
    pGeo.attributes.position.needsUpdate = true;
    // background band: a twisting ribbon that sweeps from side to side as you scroll, like it follows you down the page
    {
      const wExp = Math.max(0, 1 - Math.abs(fs - 4) * 1.6);
      hMat.opacity = 0.4 * (1 - wExp * 0.6);
      const cx = Math.cos(fs * 1.15) * 5.6, flow = t * 0.35 + fs * 1.4;
      for (let i = 0; i < HN; i++) {
        const y = ((hU[i] * HH + fs * 1.2) % HH) - HH / 2;
        const sway = Math.sin(y * 0.32 + flow) * 2.4, tw = y * 0.55 + t * 0.5;
        const w = (hRung[i] >= 0 ? hRung[i] : hSt[i] * 0.5 + hU[i] * 0.07) * 2 - 1;
        hPos[i * 3] = cx * (1 - Math.abs(y) / 40) + sway + Math.cos(tw) * w * 1.15;
        hPos[i * 3 + 1] = y;
        hPos[i * 3 + 2] = -4 + Math.sin(tw) * w * 1.15;
      }
      hGeo.attributes.position.needsUpdate = true;
    }
    points.rotation.y = Math.sin(t * 0.05) * 0.05;

    // the person
    // services: he gets up, walks to the wall screen and pitches; elsewhere he sits and types
    presentW += ((fs > 0.55 && fs < 1.6 ? 1 : 0) - presentW) * (reduced ? 1 : 0.05);
    const pw = ease(clamp(presentW));
    if (pw > 0.6) standing = true; else if (pw < 0.4) standing = false;
    legsSit.visible = !standing; legsStand.visible = standing;
    guy.position.x = lerp(0, bx + 1.3, pw); guy.position.z = lerp(-0.72, -1.45, pw);
    const walkV = Math.abs(guy.position.x - prevGX) / Math.max(dt, 0.001); prevGX = guy.position.x;
    const walking = standing && walkV > 0.6;
    guyRot += (lerp(0, -0.2, pw) - guyRot) * 0.06; guy.rotation.y = guyRot;
    guyY += ((standing ? 0.39 : 0) - guyY) * 0.25;
    const typing = pw < 0.1 && (fs < 0.6 || (fs > 2.4 && fs < 4.6)), kk = t * 14;
    armL.sh.rotation.x = lerp(-0.5, -0.3, pw);
    armL.sh.rotation.z = lerp(-0.08, -1.2 + Math.sin(t * 0.9) * 0.03, pw);
    armL.el.rotation.x = lerp(-0.85 + (typing ? Math.sin(kk) * 0.12 : 0), -0.35, pw);
    if (S.wave > 0) S.wave -= 0.006;
    const wv = Math.max(fs > 4.5 ? 1 : 0, Math.min(1, S.wave * 3));
    armR.sh.rotation.x = lerp(lerp(-0.5, -0.45 + Math.sin(t * 1.1) * 0.05, pw), -2.75, wv);
    armR.sh.rotation.z = lerp(lerp(0.1, 0.18, pw), 0.3 + Math.sin(t * 9) * 0.35, wv);
    armR.el.rotation.x = lerp(lerp(-0.85 + (typing ? Math.sin(kk + Math.PI) * 0.12 : 0), -1.1 + Math.sin(t * 1.1 + 1) * 0.06, pw), -0.35, wv);
    if (jump > 0) { jump -= 0.03; guy.position.y = guyY + Math.sin((1 - jump) * Math.PI) * 0.25; } else guy.position.y = guyY;
    // the screen he stands at plays its live demo; the others sit dim
    const act = Math.round(svcFocus);
    if (fs > 0.3 && fs < 1.9 && frame % 2 === 0) drawBoard(act, t);
    boards.forEach((b, k) => { const on = k === act ? 1 : 0.16 + 0.84 * (1 - pw); b.mat.color.setScalar(b.mat.color.r + (on - b.mat.color.r) * 0.08); });
    boardGlow.position.x = BX[act]; boardGlow.intensity = pw * 6;
    if (pw > 0.9 && act !== lastBoard && !walking) { lastBoard = act; const d = SERVICES[act]; say(`${d.name} ${d.title}`); }
    if (pw < 0.2) lastBoard = -1;
    // head: steady, limited range, eased; while presenting he glances between the screen and you
    const yawT = pw > 0.5 ? (walking ? -0.2 : Math.sin(t * 0.35) > 0.5 ? -0.55 : 0.1) : clamp(tx * 0.55 + 0.3, -0.6, 0.6);
    const pitchT = clamp(-ty * 0.25 + 0.1, -0.2, 0.3);
    headG.rotation.y += (yawT - headG.rotation.y) * 0.05;
    headG.rotation.x += (pitchT - headG.rotation.x) * 0.05;
    const blink = t % 3.6 < 0.12 ? 0.1 : 1;
    eyes.forEach((o) => (o.scale.y = blink));
    steam.forEach((s, i) => { const p = (t * 0.5 + i / 3) % 1; s.position.set(-0.95 + Math.sin(t * 2 + i) * 0.04, 0.3 + p * 0.5, 0.25); s.material.opacity = 0.35 * (1 - p); s.scale.setScalar(0.6 + p); });
    holo.position.y = 1.5 + Math.sin(t * 1.2) * 0.06;
    holo.material.opacity = 0.9 * (1 - pw); holo.visible = pw < 0.97;

    // greetings
    if (!greeted && t > 1.4 && fs < 0.3) { greeted = true; wave("Hi, I'm Burhanuddin 👋"); }
    if (fs > 4.6 && !contactGreeted) { contactGreeted = true; say("Let's build something!"); }
    if (fs < 4) contactGreeted = false;

    // speech bubble follows his head
    if (speechOn && speechEl) {
      headG.getWorldPosition(tmpV); tmpV.y += 0.35 * studio.scale.x; tmpV.project(camera);
      const visible = studio.visible && tmpV.z < 1;
      speechEl.style.left = `${(tmpV.x * 0.5 + 0.5) * innerWidth + 18}px`;
      speechEl.style.top = `${(-tmpV.y * 0.5 + 0.5) * innerHeight}px`;
      speechEl.style.visibility = visible ? 'visible' : 'hidden';
    }


    // when the footer scrolls in, lift the whole scene by the same number of pixels so it isn't covered
    const footTop = footerEl ? footerEl.getBoundingClientRect().top : innerHeight;
    const overlapPx = Math.max(0, innerHeight - footTop);
    const worldPerPx = (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z) / innerHeight;
    const lift = overlapPx * worldPerPx;

    camX += (tx * 0.5 - camX) * 0.04;
    camY += (ty * 0.3 - camY) * 0.04;
    camera.position.x = camX;
    camera.position.y = camY - lift;
    camera.position.z += (lerp(CAMZ[i0], CAMZ[i1], e) - camera.position.z) * 0.05;
    camera.lookAt(0, -lift, 0);
    rim.position.x = -4 + Math.sin(t * 0.3) * 2;
    renderer.render(scene, camera);
  }

  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
  function stop() { cancelAnimationFrame(raf); raf = 0; }
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  start();
  requestAnimationFrame(() => canvas.classList.add('ready'));

  return { wave, say };
}
