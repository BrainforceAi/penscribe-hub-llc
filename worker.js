const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });

const MAX_FILES = 3;
const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
const MAX_MESSAGE_CHARS = 100000;
const ALLOWED_EXT = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv', 'txt', 'rtf', 'png', 'jpg', 'jpeg', 'webp'];
const EMAIL_RE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]{2,}$/;
const oneLine = (v, max = 200) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);

const LABELS = {
  service: 'Service', company: 'Company', phone: 'Phone', deadline_approaching: 'Deadline approaching',
  deadline_date: 'Deadline date', deadline_time: 'Deadline time', deadline_timezone: 'Time zone',
  solicitation_link: 'Solicitation link or number', target_geography: 'Target geography',
  contract_interests: 'Contract interests', registration_type: 'Registration status',
  certification_sought: 'Certification sought', existing_statement_link: 'Current capability statement link',
  source: 'Source', page_url: 'Page',
};

function toBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

async function readRequest(request) {
  const type = request.headers.get('content-type') || '';
  const fields = {};
  const files = [];
  if (type.includes('multipart/form-data')) {
    const form = await request.formData();
    for (const [key, value] of form.entries()) {
      if (typeof value === 'string') fields[key] = value;
      else if (value && value.size > 0) files.push(value);
    }
  } else {
    Object.assign(fields, await request.json());
  }
  return { fields, files };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname !== '/api/contact') return env.ASSETS.fetch(request);
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
    try {
      if (Number(request.headers.get('content-length') || 0) > MAX_TOTAL_BYTES + 1024 * 1024) {
        return json({ error: 'Your files are too large. Please attach less than 10 MB in total or email them to isaac@thepenscribe.com.' }, 413);
      }
      const { fields, files } = await readRequest(request);
      if (fields.website) return json({ ok: true });

      const name = oneLine(fields.name, 150);
      const email = oneLine(fields.email, 200);
      const message = String(fields.message ?? '').trim();
      if (!name || !EMAIL_RE.test(email) || message.length < 10) return json({ error: 'Please complete your name, a valid email address, and a short description of what you need.' }, 400);
      if (message.length > MAX_MESSAGE_CHARS) return json({ error: 'That message is too long to send through the form. Please email it to isaac@thepenscribe.com.' }, 400);

      if (files.length > MAX_FILES) return json({ error: `Please attach no more than ${MAX_FILES} files.` }, 400);
      let total = 0;
      for (const file of files) {
        total += file.size;
        const ext = String(file.name || '').split('.').pop().toLowerCase();
        if (!ALLOWED_EXT.includes(ext)) return json({ error: 'That file type is not supported. Please use PDF, Word, Excel, text, or image files.' }, 400);
      }
      if (total > MAX_TOTAL_BYTES) return json({ error: 'Your files add up to more than 10 MB. Please attach smaller files or email them to isaac@thepenscribe.com.' }, 413);

      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const key = `lead:${ip}`;
      if (env.LEAD_LIMIT) {
        const recent = await env.LEAD_LIMIT.get(key);
        if (recent) return json({ error: 'Please wait a few minutes before sending another request.' }, 429);
        await env.LEAD_LIMIT.put(key, '1', { expirationTtl: 300 });
      }

      const extras = {};
      let count = 0;
      for (const [k, v] of Object.entries(fields)) {
        if (['name', 'email', 'message', 'website'].includes(k) || typeof v !== 'string' || !v.trim() || count >= 30) continue;
        extras[k] = oneLine(v, 500);
        count += 1;
      }
      const service = extras.service || 'Website inquiry';
      const urgent = extras.deadline_approaching === 'yes';
      const attachmentNames = files.map(f => oneLine(f.name, 120));
      const lead = { ...extras, name, email, message, attachments: attachmentNames, createdAt: new Date().toISOString(), ip };

      const jobs = [];
      if (env.GOOGLE_SHEETS_WEBHOOK) {
        jobs.push(fetch(env.GOOGLE_SHEETS_WEBHOOK, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(lead) }));
      }
      if (env.RESEND_API_KEY) {
        const lines = [`Service: ${service}`, `Name: ${name}`, `Email: ${email}`];
        for (const [k, v] of Object.entries(extras)) {
          if (k === 'service') continue;
          lines.push(`${LABELS[k] || k}: ${v}`);
        }
        if (attachmentNames.length) lines.push(`Attachments: ${attachmentNames.join(', ')}`);
        lines.push(`Submitted: ${lead.createdAt}`, `IP: ${ip}`, '', 'Message:', message);
        const attachments = [];
        for (const file of files) attachments.push({ filename: oneLine(file.name, 120).replace(/[^\w.\- ()]/g, '_'), content: toBase64(await file.arrayBuffer()) });
        const payload = {
          from: env.FORM_FROM_EMAIL || 'Website <website@thepenscribe.com>',
          to: [env.FORM_TO_EMAIL || 'isaac@thepenscribe.com'],
          reply_to: email,
          subject: oneLine(`${urgent ? 'URGENT: ' : ''}New inquiry: ${service} from ${name}`),
          text: lines.join('\n'),
        };
        if (attachments.length) payload.attachments = attachments;
        jobs.push(fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify(payload) }));
      }
      if (!jobs.length) return json({ error: 'Form delivery is not configured.' }, 503);

      const results = await Promise.allSettled(jobs);
      const emailJobIndex = env.GOOGLE_SHEETS_WEBHOOK ? 1 : 0;
      const emailResult = env.RESEND_API_KEY ? results[emailJobIndex] : null;
      // The email is what Isaac reads, so it decides success when it is configured.
      const delivered = emailResult
        ? emailResult.status === 'fulfilled' && emailResult.value.ok
        : results.some(r => r.status === 'fulfilled' && r.value.ok);
      if (!delivered) return json({ error: 'Delivery failed.' }, 502);
      return json({ ok: true });
    } catch (e) {
      return json({ error: 'Invalid request.' }, 400);
    }
  },
};
