type Payload = {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  created_at?: string | null;
};

declare const Deno: {
  env: {
    get: (key: string) => string | undefined;
  };
  serve: (handler: (req: Request) => Response | Promise<Response>) => void;
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  const TO_EMAIL = Deno.env.get('CONTACT_TO_EMAIL') || 'jupallisaipraneeth@gmail.com';
  const FROM_EMAIL = Deno.env.get('CONTACT_FROM_EMAIL');

  if (!RESEND_API_KEY) {
    return new Response(JSON.stringify({ error: 'Missing RESEND_API_KEY' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  if (!FROM_EMAIL) {
    return new Response(JSON.stringify({ error: 'Missing CONTACT_FROM_EMAIL' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  let payload: Payload;
  try {
    payload = (await req.json()) as Payload;
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const name = (payload.name || '').trim();
  const email = (payload.email || '').trim();
  const subject = (payload.subject || '').trim();
  const message = (payload.message || '').trim();
  const createdAt = (payload.created_at || '').trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  const safeSubject = subject ? subject : 'New contact message';

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
      <h2 style="margin: 0 0 12px;">New Portfolio Contact Message</h2>
      <p style="margin: 0 0 8px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p style="margin: 0 0 8px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p style="margin: 0 0 8px;"><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
      ${createdAt ? `<p style="margin: 0 0 8px;"><strong>Created at:</strong> ${escapeHtml(createdAt)}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #ddd; margin: 12px 0;" />
      <pre style="white-space: pre-wrap; font-family: inherit; background: #f6f6f6; padding: 12px; border-radius: 8px;">${escapeHtml(message)}</pre>
      <p style="margin: 12px 0 0; font-size: 12px; color: #666;">Reply directly to this email to respond.</p>
    </div>
  `;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      subject: `Portfolio: ${safeSubject}`,
      html,
      reply_to: email,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: 'Resend failed', details: text }), {
      status: 502,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

function escapeHtml(s: string) {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
