#!/usr/bin/env node
// Reads all JSON files from check-ins/ and rebuilds bsc-infographic.html

const fs   = require('fs');
const path = require('path');

const CHECKINS_DIR = path.join(__dirname, 'check-ins');
const OUT_FILE     = path.join(__dirname, 'bsc-infographic.html');

// ── perspective config ────────────────────────────────────────────────────────
const PERSPECTIVE = {
  Finance:              { cls: 's-fin',  stripe: '#3B82F6', desc: 'Revenue, cash flow & financial reporting' },
  Sales:                { cls: 's-cust', stripe: '#22C55E', desc: 'Delivery performance & commercial pipeline' },
  Operations:           { cls: 's-proc', stripe: '#F59E0B', desc: 'Operational efficiency, costing & process quality' },
  Procurement:          { cls: 's-prcm', stripe: '#FB923C', desc: 'Supplier performance, cost discipline & procurement cadence' },
  Quality:              { cls: 's-qual', stripe: '#E11D48', desc: 'First-pass build rate, repair actions & defect trending' },
  'Safety & Compliance':{ cls: 's-lgr',  stripe: '#A855F7', desc: 'People capability, compliance & safety culture' },
  Stores:               { cls: 's-str',  stripe: '#0EA5E9', desc: 'Material availability, inventory accuracy & BOM gap reporting' },
  Production:           { cls: 's-prod', stripe: '#10B981', desc: 'Production schedule adherence & daily output' },
  Engineering:          { cls: 's-eng',  stripe: '#6366F1', desc: 'BOM quality, drawing accuracy & release discipline' },
};

const ORDER = ['Finance','Sales','Operations','Procurement','Quality','Safety & Compliance','Stores','Production','Engineering'];

// ── helpers ───────────────────────────────────────────────────────────────────
function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ragDot(r)   { return `<div class="kpi-dot ${r[0]}"></div>`; }
function ragValue(v, r) {
  const num = parseFloat(v);
  if (!isNaN(num) && String(v).trim() === String(num)) {
    return `<span class="kpi-value ${r[0]}">${esc(v)}</span>`;
  }
  return `<span class="kv-chip ${r[0]}">${esc(v)}</span>`;
}

function kpiRow(kpi) {
  const r = (kpi.rag || 'pending')[0]; // g/a/r/p
  return `
        <div class="kpi-row">
          ${ragDot(r)}
          <div>
            <div class="kpi-name">${esc(kpi.name)}</div>
            ${kpi.comment ? `<div class="kpi-comment">${esc(kpi.comment)}</div>` : ''}
          </div>
          <div class="kpi-right">
            ${ragValue(kpi.value, r)}
            <span class="kpi-target">target: ${esc(kpi.target)}</span>
          </div>
        </div>`;
}

function section(checkin) {
  const fn  = checkin.function;
  const cfg = PERSPECTIVE[fn] || { cls: 's-fin', stripe: '#3B82F6', desc: '' };
  const kpis = (checkin.kpis || []).map(kpiRow).join('');
  return `
  <div class="section ${cfg.cls}">
    <div class="section-stripe"></div>
    <div class="section-inner">
      <div class="section-head">
        <div style="display:flex;align-items:center;gap:10px;">
          <span class="section-name">${esc(fn)}</span>
          <span class="section-source">${esc(checkin.name)} · ${esc(fn)} · ${esc(checkin.month)}</span>
        </div>
        <span class="section-desc">${esc(cfg.desc)}</span>
      </div>
      <div class="kpi-list">${kpis}
      </div>
    </div>
  </div>`;
}

function actionItems(checkins) {
  const reds = [];
  for (const c of checkins) {
    for (const k of (c.kpis || [])) {
      if ((k.rag || '').toLowerCase() === 'red') {
        reds.push({ kpi: k, owner: c.name, fn: c.function });
      }
    }
  }
  return reds.map(({ kpi, owner }) => `
      <div class="action-item">
        <div class="action-kpi">${esc(kpi.name)} &nbsp;·&nbsp; <span style="color:#EF4444">${esc(kpi.value)} vs target ${esc(kpi.target)}</span></div>
        <div class="action-desc">${esc(kpi.comment)}</div>
        <div class="action-owner">${esc(owner)}</div>
      </div>`).join('');
}

// ── load check-ins ────────────────────────────────────────────────────────────
const files = fs.readdirSync(CHECKINS_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CHECKINS_DIR, f), 'utf8')));

// sort by perspective order, then by date descending (keep latest per function)
const byFn = {};
for (const c of files) {
  const fn = c.function;
  if (!byFn[fn] || c.generated > byFn[fn].generated) byFn[fn] = c;
}

const checkins = ORDER
  .filter(fn => byFn[fn])
  .map(fn => byFn[fn]);

// also include any functions not in ORDER
for (const c of Object.values(byFn)) {
  if (!ORDER.includes(c.function)) checkins.push(c);
}

// ── counts ────────────────────────────────────────────────────────────────────
let G=0, A=0, R=0, P=0;
for (const c of checkins) {
  for (const k of (c.kpis||[])) {
    const r = (k.rag||'pending').toLowerCase();
    if (r==='green') G++;
    else if (r==='amber') A++;
    else if (r==='red') R++;
    else P++;
  }
}
const totalKpis = G+A+R+P;
const fnList = checkins.map(c => c.function).join(' · ');
const today  = new Date().toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'});
const reds   = R;

// ── build HTML ────────────────────────────────────────────────────────────────
const GATE_HASH = '76f38c6ad4c2cdf925fa7dacab14e77b08a2c9126c89ebfd5182e3be8bfcd6a2';

const html = `<title>BSC Master Dashboard</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:ital,wght@0,400;0,500;0,600;1,400&display=swap">

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #0A1628; color: #F0F4FA; font-family: 'Inter', system-ui, sans-serif; font-size: 13px; line-height: 1.5; padding: 32px 20px 56px; -webkit-font-smoothing: antialiased; }
  #gate { position:fixed;inset:0;z-index:9999;background:#0A1628;display:flex;align-items:center;justify-content:center; }
  #gate-box { background:#0D1B35;border:1px solid #1E3158;border-radius:10px;padding:40px 36px;width:340px;text-align:center; }
  #gate-eyebrow { font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#FFC000;margin-bottom:8px; }
  #gate-title { font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:#fff;margin-bottom:24px; }
  #gate-input { width:100%;background:#0A1628;color:#F0F4FA;border:1.5px solid #1E3158;border-radius:6px;padding:11px 14px;font-size:15px;text-align:center;letter-spacing:0.12em;outline:none;margin-bottom:12px;font-family:'Inter',system-ui,sans-serif; }
  #gate-input:focus { border-color:#FFC000; }
  #gate-btn { width:100%;background:#FFC000;color:#0D1B35;border:none;border-radius:6px;padding:12px;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;letter-spacing:0.06em;cursor:pointer; }
  #gate-btn:hover { background:#E6AC00; }
  #gate-err { font-size:12px;color:#EF4444;margin-top:10px;min-height:18px; }
  .wrap { max-width: 1100px; margin: 0 auto; display: none; flex-direction: column; gap: 4px; }
  .masthead { background: #0D1B35; border: 1px solid #1E3158; border-radius: 10px 10px 0 0; overflow: hidden; }
  .mast-amber-bar { height: 5px; background: linear-gradient(90deg, #FFC000 0%, #E6AC00 100%); }
  .mast-body { padding: 24px 32px 22px; display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; }
  .mast-eyebrow { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: #FFC000; margin-bottom: 6px; }
  .mast-title { font-family: 'Barlow Condensed', sans-serif; font-size: 40px; font-weight: 800; color: #fff; line-height: 0.95; letter-spacing: 0.01em; }
  .mast-sub { margin-top: 10px; font-size: 12.5px; color: #7A90AC; letter-spacing: 0.02em; }
  .mast-sub strong { color: #A8BDD0; font-weight: 600; }
  .rag-row { display: flex; gap: 8px; flex-shrink: 0; align-items: stretch; }
  .rag-block { display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 8px; padding: 12px 18px; min-width: 82px; border: 1px solid rgba(255,255,255,0.08); }
  .rag-block .n { font-family: 'Barlow Condensed', sans-serif; font-size: 38px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
  .rag-block .lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin-top: 3px; }
  .rag-block.g { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.2); } .rag-block.g .n { color: #22C55E; }
  .rag-block.a { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.2); } .rag-block.a .n { color: #F59E0B; }
  .rag-block.r { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.22); } .rag-block.r .n { color: #EF4444; }
  .rag-block.p { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); } .rag-block.p .n { color: #3A5070; }
  .section { display: flex; background: #0D1B35; border: 1px solid #1E3158; border-top: none; overflow: hidden; }
  .section:last-of-type { border-radius: 0 0 10px 10px; }
  .section-stripe { width: 5px; flex-shrink: 0; }
  .s-fin  .section-stripe { background: #3B82F6; }
  .s-cust .section-stripe { background: #22C55E; }
  .s-proc .section-stripe { background: #F59E0B; }
  .s-prcm .section-stripe { background: #FB923C; }
  .s-qual .section-stripe { background: #E11D48; }
  .s-lgr  .section-stripe { background: #A855F7; }
  .s-str  .section-stripe { background: #0EA5E9; }
  .s-prod .section-stripe { background: #10B981; }
  .s-eng  .section-stripe { background: #6366F1; }
  .section-inner { flex: 1; padding: 0 28px; }
  .section-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 0 10px; border-bottom: 1px solid #1E3158; gap: 12px; }
  .section-name { font-family: 'Barlow Condensed', sans-serif; font-size: 17px; font-weight: 700; letter-spacing: 0.07em; text-transform: uppercase; color: #D6E4F5; }
  .section-source { font-size: 10px; color: #364E68; font-weight: 500; letter-spacing: 0.04em; background: #0A1628; border: 1px solid #1E3158; border-radius: 4px; padding: 2px 8px; white-space: nowrap; }
  .section-desc { font-size: 11px; color: #364E68; font-style: italic; }
  .kpi-list { display: flex; flex-direction: column; padding-bottom: 4px; }
  .kpi-row { display: grid; grid-template-columns: 18px 1fr auto; align-items: start; gap: 0 14px; padding: 10px 0; border-bottom: 1px solid #0F1E38; }
  .kpi-row:last-child { border-bottom: none; }
  .kpi-dot { width: 12px; height: 12px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
  .kpi-dot.g { background: #22C55E; box-shadow: 0 0 6px rgba(34,197,94,0.5); }
  .kpi-dot.a { background: #F59E0B; box-shadow: 0 0 6px rgba(245,158,11,0.4); }
  .kpi-dot.r { background: #EF4444; box-shadow: 0 0 8px rgba(239,68,68,0.55); }
  .kpi-dot.p { background: #1E3050; }
  .kpi-name { font-size: 13px; font-weight: 600; color: #C8D8EA; line-height: 1.3; }
  .kpi-comment { font-size: 11.5px; color: #3A5878; font-style: italic; margin-top: 2px; line-height: 1.4; }
  .kpi-right { text-align: right; flex-shrink: 0; display: flex; flex-direction: column; align-items: flex-end; gap: 1px; }
  .kpi-value { font-family: 'Barlow Condensed', sans-serif; font-size: 26px; font-weight: 800; line-height: 1; font-variant-numeric: tabular-nums; }
  .kpi-value.g { color: #22C55E; } .kpi-value.a { color: #F59E0B; } .kpi-value.r { color: #EF4444; } .kpi-value.p { color: #1E3050; }
  .kpi-target { font-size: 10px; color: #263C55; font-weight: 500; white-space: nowrap; }
  .kv-chip { font-family: 'Barlow Condensed', sans-serif; font-size: 14px; font-weight: 700; letter-spacing: 0.04em; padding: 2px 9px 3px; border-radius: 4px; line-height: 1.2; }
  .kv-chip.g { background: rgba(34,197,94,0.12); color: #22C55E; }
  .kv-chip.a { background: rgba(245,158,11,0.12); color: #F59E0B; }
  .kv-chip.r { background: rgba(239,68,68,0.12); color: #EF4444; }
  .kv-chip.p { background: rgba(255,255,255,0.03); color: #2A3D55; }
  .action-callout { margin-top: 12px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(239,68,68,0.3); background: rgba(239,68,68,0.06); }
  .action-head { display: flex; align-items: center; gap: 10px; padding: 12px 28px; border-bottom: 1px solid rgba(239,68,68,0.2); background: rgba(239,68,68,0.1); }
  .action-icon { width: 8px; height: 8px; border-radius: 50%; background: #EF4444; box-shadow: 0 0 8px rgba(239,68,68,0.7); flex-shrink: 0; }
  .action-title { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #EF4444; }
  .action-body { padding: 14px 28px; display: flex; flex-direction: column; gap: 8px; }
  .action-item { display: grid; grid-template-columns: 220px 1fr auto; align-items: center; gap: 16px; }
  .action-kpi { font-weight: 600; font-size: 13px; color: #C8D8EA; }
  .action-desc { font-size: 12px; color: #3A5878; font-style: italic; }
  .action-owner { font-size: 10.5px; color: #263C55; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap; }
  .footer { margin-top: 16px; display: flex; justify-content: space-between; align-items: center; padding: 0 2px; }
  .footer-note { font-size: 10.5px; color: #1E3050; }
  .footer-date { font-size: 10.5px; color: #263C55; font-weight: 500; }
</style>

<div class="wrap">
  <div class="masthead">
    <div class="mast-amber-bar"></div>
    <div class="mast-body">
      <div>
        <div class="mast-eyebrow">Liquip Victoria · Strategic Performance Review</div>
        <div class="mast-title">Balanced Scorecard<br>Master Dashboard</div>
        <div class="mast-sub">
          <strong>August 2026</strong> &nbsp;·&nbsp; Month 1 of FY2026–27 &nbsp;·&nbsp;
          ${checkins.length} perspectives &nbsp;·&nbsp; ${totalKpis} KPIs tracked &nbsp;·&nbsp;
          Check-ins: ${esc(fnList)}
        </div>
      </div>
      <div class="rag-row">
        <div class="rag-block g"><span class="n">${G}</span><span class="lbl">On Track</span></div>
        <div class="rag-block a"><span class="n">${A}</span><span class="lbl">Monitor</span></div>
        <div class="rag-block r"><span class="n">${R}</span><span class="lbl">Action</span></div>
        <div class="rag-block p"><span class="n">${P}</span><span class="lbl">Pending</span></div>
      </div>
    </div>
  </div>

${checkins.map(section).join('\n')}

  <div class="action-callout">
    <div class="action-head">
      <div class="action-icon"></div>
      <div class="action-title">Action Required — ${reds} KPIs need immediate attention</div>
    </div>
    <div class="action-body">
${actionItems(checkins)}
    </div>
  </div>

  <div class="footer">
    <span class="footer-note">Check-ins received: ${esc(fnList)}</span>
    <span class="footer-date">Next full review: September 2026 &nbsp;·&nbsp; Generated ${esc(today)}</span>
  </div>
</div>

<div id="gate">
  <div id="gate-box">
    <div id="gate-eyebrow">Liquip Victoria · Strategic Performance</div>
    <div id="gate-title">BSC Dashboard</div>
    <input id="gate-input" type="password" placeholder="Access code" autocomplete="off">
    <button id="gate-btn" onclick="checkCode()">View Dashboard</button>
    <div id="gate-err"></div>
  </div>
</div>

<script>
const HASH = '${GATE_HASH}';
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
}
async function checkCode() {
  const val = document.getElementById('gate-input').value.trim();
  if (!val) return;
  const h = await sha256(val);
  if (h === HASH) {
    sessionStorage.setItem('bsc_auth','1');
    document.getElementById('gate').remove();
    document.querySelector('.wrap').style.display = 'flex';
  } else {
    document.getElementById('gate-err').textContent = 'Incorrect code — try again';
    document.getElementById('gate-input').value = '';
    document.getElementById('gate-input').focus();
  }
}
document.getElementById('gate-input').addEventListener('keydown', e => { if (e.key === 'Enter') checkCode(); });
if (sessionStorage.getItem('bsc_auth') === '1') {
  document.getElementById('gate').remove();
  document.querySelector('.wrap').style.display = 'flex';
}
</script>
`;

fs.writeFileSync(OUT_FILE, html, 'utf8');
console.log(`Dashboard generated: ${checkins.length} perspectives, ${totalKpis} KPIs (${G}G/${A}A/${R}R/${P}P)`);
