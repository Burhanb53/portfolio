import { defineConfig, loadEnv } from 'vite';
import { handleContact } from './server/contact.js';

/* Runs the same /api/contact handler as Vercel while developing locally,
   reading secrets from .env.local (never bundled into the site). */
function contactApi(env) {
  return {
    name: 'contact-api',
    configureServer(server) {
      server.middlewares.use('/api/contact', (req, res) => {
        const send = (status, json) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(json)); };
        if (req.method !== 'POST') return send(405, { ok: false, error: 'Method not allowed' });
        let raw = '';
        req.on('data', (c) => { raw += c; if (raw.length > 20000) req.destroy(); });
        req.on('end', async () => {
          let body = {};
          try { body = JSON.parse(raw || '{}'); } catch { /* invalid JSON is treated as empty */ }
          const { status, json } = await handleContact(body, req.socket.remoteAddress, env);
          if (json.dryRun && req.headers['x-preview-emails'] === '1') return send(status, json);
          const { owner, visitor, ...safe } = json;
          send(status, safe);
        });
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  /* absolute site address for share previews: SITE_URL, else Vercel's production domain */
  const prod = env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL;
  const siteUrl = (env.SITE_URL || (prod ? `https://${prod}` : '')).replace(/\/$/, '');
  const siteMeta = { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl) };
  return {
    plugins: [contactApi(env), siteMeta],
    build: { chunkSizeWarningLimit: 800, target: 'es2020' },
  };
});
