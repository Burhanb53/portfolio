import {
  siJavascript, siTypescript, siReact, siNextdotjs, siTailwindcss, siPhp, siCodeigniter,
  siNodedotjs, siExpress, siRabbitmq, siRedis, siFlutter, siDart, siFirebase,
  siPostgresql, siMysql, siMongodb, siDocker, siKubernetes, siHelm, siJenkins,
  siTerraform, siLinux, siNginx, siGithubactions, siPrometheus, siLangchain, siN8n,
  siGit, siGithub, siPostman, siVercel, siWhatsapp, siGmail,
} from 'simple-icons';

export const BRAND = {
  'JavaScript': siJavascript, 'TypeScript': siTypescript, 'React.js': siReact, 'React Native': siReact,
  'Next.js': siNextdotjs, 'Tailwind CSS': siTailwindcss, 'PHP': siPhp, 'CodeIgniter': siCodeigniter,
  'PHP CodeIgniter': siCodeigniter, 'Node.js': siNodedotjs, 'Express.js': siExpress, 'RabbitMQ': siRabbitmq,
  'Redis': siRedis, 'Flutter': siFlutter, 'Dart': siDart, 'Firebase': siFirebase, 'PostgreSQL': siPostgresql,
  'MySQL': siMysql, 'MongoDB': siMongodb, 'Docker': siDocker, 'Kubernetes': siKubernetes, 'Helm': siHelm,
  'Jenkins': siJenkins, 'Terraform': siTerraform, 'Linux': siLinux, 'Nginx': siNginx,
  'GitHub Actions': siGithubactions, 'Prometheus': siPrometheus, 'LangChain': siLangchain, 'n8n': siN8n,
  'Git': siGit, 'GitHub': siGithub, 'Postman': siPostman, 'Vercel': siVercel,
  'WhatsApp': siWhatsapp, 'Gmail': siGmail,
};

const lum = (hex) => {
  const n = parseInt(hex, 16);
  return (0.299 * ((n >> 16) & 255) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
/** Brand colour, lifted to off-white when the brand colour is too dark for a dark UI. */
export const brandColor = (hex) => (lum(hex) < 0.25 ? '#efe9df' : `#${hex}`);

export function brandSvg(name, size = 16, color) {
  const ic = BRAND[name];
  if (!ic) return '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true" style="fill:${color || brandColor(ic.hex)}"><path d="${ic.path}"/></svg>`;
}

const stroke = (d, size = 20) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

export const UI = {
  arrowRight: (s) => stroke('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>', s),
  arrowLeft: (s) => stroke('<path d="M19 12H5"/><path d="m11 6-6 6 6 6"/>', s),
  arrowUpRight: (s) => stroke('<path d="M7 17 17 7"/><path d="M8 7h9v9"/>', s),
  arrowDown: (s) => stroke('<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>', s),
  arrowUp: (s) => stroke('<path d="M12 19V5"/><path d="m6 11 6-6 6 6"/>', s),
  mail: (s) => stroke('<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m4 7 8 6 8-6"/>', s),
  phone: (s) => stroke('<path d="M5 4h3.5l1.8 4.6-2.3 1.4a11 11 0 0 0 6 6l1.4-2.3L20 15.5V19a2 2 0 0 1-2.2 2A17 17 0 0 1 3 6.2 2 2 0 0 1 5 4Z"/>', s),
  copy: (s) => stroke('<rect x="9" y="9" width="11" height="11" rx="2.5"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>', s),
  check: (s) => stroke('<path d="m5 12.5 4.5 4.5L19 7"/>', s),
  close: (s) => stroke('<path d="M6 6l12 12M18 6 6 18"/>', s),
  download: (s) => stroke('<path d="M12 4v11"/><path d="m7 10 5 5 5-5"/><path d="M5 20h14"/>', s),
  lock: (s) => stroke('<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', s),
  pin: (s) => stroke('<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="9" r="2.5"/>', s),
  clock: (s) => stroke('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', s),
  send: (s) => stroke('<path d="M21 3 10 14"/><path d="m21 3-7 18-4-7-7-4 18-7Z"/>', s),
  web: (s) => stroke('<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9h18"/><circle cx="6.5" cy="6.5" r=".6" fill="currentColor"/><circle cx="9" cy="6.5" r=".6" fill="currentColor"/><path d="m9 13-2 2 2 2M15 13l2 2-2 2"/>', s),
  mobile: (s) => stroke('<rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3"/>', s),
  cloud: (s) => stroke('<path d="M7 18a4.5 4.5 0 0 1-.6-8.96A6 6 0 0 1 18 9.5a4.25 4.25 0 0 1-.5 8.5Z"/><path d="m10 14 2-2 2 2M12 12v5"/>', s),
  ai: (s) => stroke('<rect x="5" y="7" width="14" height="12" rx="3"/><path d="M12 3v4M9 12h.01M15 12h.01M9.5 15.5h5M2.5 12v3M21.5 12v3"/>', s),
  menu: (s) => stroke('<path d="M4 8h16M4 16h16"/>', s),
  sparkle: (s) => stroke('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>', s),
  linkedin: (s = 20) =>
    `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.5c0-1.3-.02-3-1.83-3-1.83 0-2.1 1.43-2.1 2.9V21H9V9Z"/></svg>`,
  github: (s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" aria-hidden="true"><path d="${siGithub.path}"/></svg>`,
  whatsapp: (s = 20) => `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="currentColor" aria-hidden="true"><path d="${siWhatsapp.path}"/></svg>`,
};
