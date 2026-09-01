const REPO    = 'geoffkalms-arch/executive-dashboard';
const BRANCH  = 'main';
const ALLOWED = 'https://geoffkalms-arch.github.io';

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return cors(new Response(null, { status: 204 }));
    }

    if (request.method !== 'POST') {
      return cors(new Response('Method not allowed', { status: 405 }));
    }

    // Validate origin
    const origin = request.headers.get('Origin') || '';
    if (!origin.startsWith(ALLOWED)) {
      return cors(new Response('Forbidden', { status: 403 }));
    }

    let data;
    try {
      data = await request.json();
    } catch {
      return cors(new Response('Invalid JSON', { status: 400 }));
    }

    const fn    = (data.function || 'Unknown').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
    const month = (data.month    || 'Unknown').replace(/[^a-z0-9]/gi, '-').replace(/-+/g, '-');
    const path  = `check-ins/${fn}-${month}.json`;
    const body  = JSON.stringify(data, null, 2);
    const encoded = btoa(unescape(encodeURIComponent(body)));

    const headers = {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'bsc-checkin-worker',
    };

    // Get existing SHA if file exists (needed for update)
    let sha;
    const check = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}?ref=${BRANCH}`,
      { headers }
    );
    if (check.ok) {
      sha = (await check.json()).sha;
    }

    const payload = {
      message: `Check-in: ${data.function} — ${data.month}`,
      content: encoded,
      branch: BRANCH,
    };
    if (sha) payload.sha = sha;

    const put = await fetch(
      `https://api.github.com/repos/${REPO}/contents/${path}`,
      { method: 'PUT', headers, body: JSON.stringify(payload) }
    );

    if (put.ok) {
      return cors(new Response(JSON.stringify({ ok: true, path }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }));
    }

    const err = await put.json();
    return cors(new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: put.status,
      headers: { 'Content-Type': 'application/json' },
    }));
  }
};

function cors(response) {
  const r = new Response(response.body, response);
  r.headers.set('Access-Control-Allow-Origin', ALLOWED);
  r.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  r.headers.set('Access-Control-Allow-Headers', 'Content-Type, X-BSC-Code');
  return r;
}
