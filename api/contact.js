import { handleContact } from '../server/contact.js';

/* Vercel serverless function: POST /api/contact */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket?.remoteAddress;
  const { status, json } = await handleContact(body, ip);
  const { owner, visitor, ...safe } = json;
  return res.status(status).json(safe);
}
