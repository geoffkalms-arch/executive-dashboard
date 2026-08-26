#!/usr/bin/env node
// Reads all JSON files from check-ins/ and rebuilds bsc-infographic.html

const fs   = require('fs');
const path = require('path');

const CHECKINS_DIR = path.join(__dirname, 'check-ins');
const OUT_FILE     = path.join(__dirname, 'bsc-infographic.html');

const PERSPECTIVE = {
  Finance:     { cls: 's-fin',  stripe: '#3B82F6', desc: 'Revenue, cash flow & financial reporting' },
  Sales:       { cls: 's-cust', stripe: '#22C55E', desc: 'Delivery performance & commercial pipeline' },
  Operations:  { cls: 's-proc', stripe: '#F59E0B', desc: 'Operational efficiency, costing & process quality' },
  Procurement: { cls: 's-prcm', stripe: '#FB923C', desc: 'Supplier performance, cost discipline & procurement cadence' },
  Quality:     { cls: 's-qual', stripe: '#E11D48', desc: 'First-pass build rate, repair actions & defect trending' },
  'Safety & Compliance': { cls: 's-lgr', stripe: '#A855F7', desc: 'Safety culture, incident reporting & compliance' },
  Stores:      { cls: 's-str',  stripe: '#0EA5E9', desc: 'Material availability, inventory accuracy & BOM gap reporting' },
  Production:  { cls: 's-prod', stripe: '#10B981', desc: 'Production schedule adherence & daily output' },
  Engineering: { cls: 's-eng',  stripe: '#6366F1', desc: 'BOM quality, release discipline & repair action reduction' },
  Aviation:    { cls: 's-avi',  stripe: '#EC4899', desc: 'Aviation revenue, delivery performance & defect reporting' },
};

const ORDER = ['Finance','Sales','Operations','Procurement','Quality','Safety & Compliance','Stores','Production','Engineering','Aviation'];

function esc(s) {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function ragDot(r)   { return `<div class="kpi-dot ${r}"></div>`; }
function ragValue(v, r) {
  const num = parseFloat(v);
  if (!isNaN(num) && String(v).trim() === String(num)) {
    return `<span class="kpi-value ${r}">${esc(v)}</span>`;
  }
  return `<span class="kv-chip ${r}">${esc(v)}</span>`;
}

function kpiRow(kpi) {
  const r = (kpi.rag || 'pending')[0];
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
      <div class="kpi-list">${(checkin.kpis||[]).map(kpiRow).join('')}
      </div>
    </div>
  </div>`;
}

function actionItems(checkins) {
  const reds = [];
  for (const c of checkins)
    for (const k of (c.kpis||[]))
      if ((k.rag||'').toLowerCase()==='red')
        reds.push({kpi:k, owner:c.name});
  return reds.map(({kpi,owner}) => `
      <div class="action-item">
        <div class="action-kpi">${esc(kpi.name)} &nbsp;·&nbsp; <span style="color:#EF4444">${esc(kpi.value)} vs target ${esc(kpi.target)}</span></div>
        <div class="action-desc">${esc(kpi.comment)}</div>
        <div class="action-owner">${esc(owner)}</div>
      </div>`).join('');
}

// ── load ALL check-ins (not just latest) ─────────────────────────────────────
const allFiles = fs.readdirSync(CHECKINS_DIR)
  .filter(f => f.endsWith('.json'))
  .map(f => JSON.parse(fs.readFileSync(path.join(CHECKINS_DIR, f), 'utf8')));

// Sort all by date ascending
allFiles.sort((a,b) => a.generated < b.generated ? -1 : 1);

// Latest per function for dashboard view
const byFn = {};
for (const c of allFiles) {
  const fn = c.function;
  if (!byFn[fn] || c.generated > byFn[fn].generated) byFn[fn] = c;
}
const checkins = ORDER.filter(fn => byFn[fn]).map(fn => byFn[fn]);
for (const c of Object.values(byFn))
  if (!ORDER.includes(c.function)) checkins.push(c);

// All months present (sorted)
const monthOrder = [...new Set(allFiles.map(c => c.month))];

let G=0,A=0,R=0,P=0;
for (const c of checkins)
  for (const k of (c.kpis||[])) {
    const r=(k.rag||'pending').toLowerCase();
    if(r==='green')G++; else if(r==='amber')A++; else if(r==='red')R++; else P++;
  }
const totalKpis = G+A+R+P;
const fnList = checkins.map(c=>c.function).join(' · ');
const today  = new Date().toLocaleDateString('en-AU',{day:'numeric',month:'long',year:'numeric'});
const latestMonth = checkins.length ? checkins[0].month : '';

const GATE_HASH = '76f38c6ad4c2cdf925fa7dacab14e77b08a2c9126c89ebfd5182e3be8bfcd6a2';
const ALL_DATA  = JSON.stringify(allFiles);

const html = `<title>BSC Master Dashboard</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=Inter:ital,wght@0,400;0,500;0,600;1,400&display=swap">
<style>
  *{box-sizing:border-box;margin:0;padding:0;}
  body{background:#0A1628;color:#F0F4FA;font-family:'Inter',system-ui,sans-serif;font-size:13px;line-height:1.5;-webkit-font-smoothing:antialiased;}

  /* gate */
  #gate{position:fixed;inset:0;z-index:9999;background:#0A1628;display:flex;align-items:center;justify-content:center;}
  #gate-box{background:#0D1B35;border:1px solid #1E3158;border-radius:10px;padding:40px 36px;width:340px;text-align:center;}
  #gate-eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:#FFC000;margin-bottom:8px;}
  #gate-title{font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:800;color:#fff;margin-bottom:24px;}
  #gate-input{width:100%;background:#0A1628;color:#F0F4FA;border:1.5px solid #1E3158;border-radius:6px;padding:11px 14px;font-size:15px;text-align:center;letter-spacing:0.12em;outline:none;margin-bottom:12px;font-family:'Inter',system-ui,sans-serif;}
  #gate-input:focus{border-color:#FFC000;}
  #gate-btn{width:100%;background:#FFC000;color:#0D1B35;border:none;border-radius:6px;padding:12px;font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:800;letter-spacing:0.06em;cursor:pointer;}
  #gate-btn:hover{background:#E6AC00;}
  #gate-err{font-size:12px;color:#EF4444;margin-top:10px;min-height:18px;}

  /* tabs */
  .wrap{max-width:1100px;margin:0 auto;padding:32px 20px 56px;display:none;flex-direction:column;gap:4px;}
  .tab-bar{display:flex;gap:2px;padding:0 0 0 0;margin-bottom:0;}
  .tab-btn{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;
    padding:10px 24px;border:1px solid #1E3158;border-bottom:none;border-radius:6px 6px 0 0;
    background:#0A1628;color:#3A5070;cursor:pointer;transition:all 0.15s;}
  .tab-btn.active{background:#0D1B35;color:#FFC000;border-color:#1E3158;}
  .tab-btn:hover:not(.active){color:#7A90AC;}
  #tab-dashboard,#tab-trends{display:none;flex-direction:column;gap:4px;}
  #tab-dashboard.active,#tab-trends.active{display:flex;}

  /* masthead */
  .masthead{background:#0D1B35;border:1px solid #1E3158;border-radius:0 6px 0 0;overflow:hidden;}
  .mast-amber-bar{height:5px;background:linear-gradient(90deg,#FFC000 0%,#E6AC00 100%);}
  .mast-body{padding:24px 32px 22px;display:flex;align-items:flex-start;justify-content:space-between;gap:24px;}
  .mast-eyebrow{font-family:'Barlow Condensed',sans-serif;font-size:11px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:#FFC000;margin-bottom:6px;}
  .mast-title{font-family:'Barlow Condensed',sans-serif;font-size:40px;font-weight:800;color:#fff;line-height:0.95;letter-spacing:0.01em;}
  .mast-sub{margin-top:10px;font-size:12.5px;color:#7A90AC;letter-spacing:0.02em;}
  .mast-sub strong{color:#A8BDD0;font-weight:600;}
  .rag-row{display:flex;gap:8px;flex-shrink:0;align-items:stretch;}
  .rag-block{display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:8px;padding:12px 18px;min-width:82px;border:1px solid rgba(255,255,255,0.08);}
  .rag-block .n{font-family:'Barlow Condensed',sans-serif;font-size:38px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}
  .rag-block .lbl{font-size:9px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.5);margin-top:3px;}
  .rag-block.g{background:rgba(34,197,94,0.1);border-color:rgba(34,197,94,0.2);} .rag-block.g .n{color:#22C55E;}
  .rag-block.a{background:rgba(245,158,11,0.1);border-color:rgba(245,158,11,0.2);} .rag-block.a .n{color:#F59E0B;}
  .rag-block.r{background:rgba(239,68,68,0.12);border-color:rgba(239,68,68,0.22);} .rag-block.r .n{color:#EF4444;}
  .rag-block.p{background:rgba(255,255,255,0.04);border-color:rgba(255,255,255,0.1);} .rag-block.p .n{color:#3A5070;}

  /* dashboard sections */
  .section{display:flex;background:#0D1B35;border:1px solid #1E3158;border-top:none;overflow:hidden;}
  .section:last-of-type{border-radius:0 0 10px 10px;}
  .section-stripe{width:5px;flex-shrink:0;}
  .s-fin .section-stripe{background:#3B82F6;} .s-cust .section-stripe{background:#22C55E;}
  .s-proc .section-stripe{background:#F59E0B;} .s-prcm .section-stripe{background:#FB923C;}
  .s-qual .section-stripe{background:#E11D48;} .s-lgr .section-stripe{background:#A855F7;}
  .s-str .section-stripe{background:#0EA5E9;} .s-prod .section-stripe{background:#10B981;}
  .s-eng .section-stripe{background:#6366F1;}
  .section-inner{flex:1;padding:0 28px;}
  .section-head{display:flex;align-items:center;justify-content:space-between;padding:13px 0 10px;border-bottom:1px solid #1E3158;gap:12px;}
  .section-name{font-family:'Barlow Condensed',sans-serif;font-size:17px;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;color:#D6E4F5;}
  .section-source{font-size:10px;color:#364E68;font-weight:500;letter-spacing:0.04em;background:#0A1628;border:1px solid #1E3158;border-radius:4px;padding:2px 8px;white-space:nowrap;}
  .section-desc{font-size:11px;color:#364E68;font-style:italic;}
  .kpi-list{display:flex;flex-direction:column;padding-bottom:4px;}
  .kpi-row{display:grid;grid-template-columns:18px 1fr auto;align-items:start;gap:0 14px;padding:10px 0;border-bottom:1px solid #0F1E38;}
  .kpi-row:last-child{border-bottom:none;}
  .kpi-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0;margin-top:4px;}
  .kpi-dot.g{background:#22C55E;box-shadow:0 0 6px rgba(34,197,94,0.5);}
  .kpi-dot.a{background:#F59E0B;box-shadow:0 0 6px rgba(245,158,11,0.4);}
  .kpi-dot.r{background:#EF4444;box-shadow:0 0 8px rgba(239,68,68,0.55);}
  .kpi-dot.p{background:#1E3050;}
  .kpi-name{font-size:13px;font-weight:600;color:#C8D8EA;line-height:1.3;}
  .kpi-comment{font-size:11.5px;color:#3A5878;font-style:italic;margin-top:2px;line-height:1.4;}
  .kpi-right{text-align:right;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:1px;}
  .kpi-value{font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:800;line-height:1;font-variant-numeric:tabular-nums;}
  .kpi-value.g{color:#22C55E;} .kpi-value.a{color:#F59E0B;} .kpi-value.r{color:#EF4444;} .kpi-value.p{color:#1E3050;}
  .kpi-target{font-size:10px;color:#263C55;font-weight:500;white-space:nowrap;}
  .kv-chip{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.04em;padding:2px 9px 3px;border-radius:4px;line-height:1.2;}
  .kv-chip.g{background:rgba(34,197,94,0.12);color:#22C55E;}
  .kv-chip.a{background:rgba(245,158,11,0.12);color:#F59E0B;}
  .kv-chip.r{background:rgba(239,68,68,0.12);color:#EF4444;}
  .kv-chip.p{background:rgba(255,255,255,0.03);color:#2A3D55;}
  .action-callout{margin-top:12px;border-radius:10px;overflow:hidden;border:1px solid rgba(239,68,68,0.3);background:rgba(239,68,68,0.06);}
  .action-head{display:flex;align-items:center;gap:10px;padding:12px 28px;border-bottom:1px solid rgba(239,68,68,0.2);background:rgba(239,68,68,0.1);}
  .action-icon{width:8px;height:8px;border-radius:50%;background:#EF4444;box-shadow:0 0 8px rgba(239,68,68,0.7);flex-shrink:0;}
  .action-title{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#EF4444;}
  .action-body{padding:14px 28px;display:flex;flex-direction:column;gap:8px;}
  .action-item{display:grid;grid-template-columns:220px 1fr auto;align-items:center;gap:16px;}
  .action-kpi{font-weight:600;font-size:13px;color:#C8D8EA;}
  .action-desc{font-size:12px;color:#3A5878;font-style:italic;}
  .action-owner{font-size:10.5px;color:#263C55;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;white-space:nowrap;}
  .footer{margin-top:16px;display:flex;justify-content:space-between;align-items:center;padding:0 2px;}
  .footer-note{font-size:10.5px;color:#1E3050;}
  .footer-date{font-size:10.5px;color:#263C55;font-weight:500;}

  /* trends tab */
  .trends-wrap{display:flex;flex-direction:column;gap:16px;}
  .trends-fn-block{background:#0D1B35;border:1px solid #1E3158;border-radius:8px;overflow:hidden;}
  .trends-fn-head{display:flex;align-items:center;gap:10px;padding:12px 20px;border-bottom:1px solid #1E3158;background:#0A1628;}
  .trends-fn-stripe{width:4px;height:18px;border-radius:2px;flex-shrink:0;}
  .trends-fn-name{font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#D6E4F5;}
  .trends-fn-sub{font-size:11px;color:#364E68;font-style:italic;margin-left:auto;}

  /* heat map table */
  .heatmap-scroll{overflow-x:auto;padding:0 20px 0;}
  table.heatmap{width:100%;border-collapse:collapse;margin:12px 0;}
  table.heatmap th{font-size:10px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#364E68;padding:6px 8px;text-align:right;white-space:nowrap;border-bottom:1px solid #1E3158;}
  table.heatmap th.kpi-col{text-align:left;min-width:200px;}
  table.heatmap td{padding:5px 8px;border-bottom:1px solid #0F1E38;vertical-align:middle;}
  table.heatmap td.kpi-label{font-size:12px;font-weight:600;color:#7A90AC;white-space:nowrap;}
  table.heatmap tr:last-child td{border-bottom:none;}

  .heat-cell{
    display:flex;align-items:center;justify-content:center;
    border-radius:4px;width:100%;min-width:60px;
    padding:4px 6px;cursor:pointer;
    font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;
    transition:opacity 0.15s;position:relative;
  }
  .heat-cell:hover{opacity:0.8;}
  .heat-cell.g{background:rgba(34,197,94,0.15);color:#22C55E;border:1px solid rgba(34,197,94,0.3);}
  .heat-cell.a{background:rgba(245,158,11,0.15);color:#F59E0B;border:1px solid rgba(245,158,11,0.3);}
  .heat-cell.r{background:rgba(239,68,68,0.15);color:#EF4444;border:1px solid rgba(239,68,68,0.3);}
  .heat-cell.p{background:rgba(255,255,255,0.03);color:#2A3D55;border:1px solid rgba(255,255,255,0.07);}
  .heat-cell.empty{background:transparent;border:1px dashed #1E3158;color:#1E3158;}
  .repeat-flag{position:absolute;top:2px;right:3px;font-size:8px;color:#F59E0B;font-weight:700;}

  /* narrative panel */
  .narrative-block{border-top:1px solid #1E3158;padding:16px 20px;display:none;}
  .narrative-block.open{display:block;}
  .narrative-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
  .narrative-title{font-family:'Barlow Condensed',sans-serif;font-size:14px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#7A90AC;}
  .narrative-close{background:none;border:none;color:#364E68;font-size:18px;cursor:pointer;padding:0 4px;}
  .narrative-close:hover{color:#7A90AC;}

  /* detail popup (click on heat cell) */
  .cell-detail{background:#0A1628;border:1px solid #1E3158;border-radius:6px;padding:14px 16px;margin:0 0 12px;}
  .cell-detail-head{display:flex;align-items:center;gap:10px;margin-bottom:8px;}
  .cell-detail-kpi{font-weight:600;font-size:13px;color:#C8D8EA;}
  .cell-detail-month{font-size:11px;color:#364E68;margin-left:auto;}
  .cell-detail-value{font-family:'Barlow Condensed',sans-serif;font-size:22px;font-weight:800;}
  .cell-detail-comment{font-size:12px;color:#7A90AC;font-style:italic;margin-top:6px;line-height:1.5;}
  .repeat-warning{display:inline-block;margin-top:6px;font-size:11px;color:#F59E0B;font-weight:600;background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.3);border-radius:4px;padding:2px 8px;}

  /* narrative Q blocks */
  .q-months{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:8px;}
  .q-month-btn{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:700;letter-spacing:0.06em;
    padding:4px 12px;border-radius:4px;border:1px solid #1E3158;background:#0A1628;color:#3A5070;cursor:pointer;}
  .q-month-btn.active{background:#1E3158;color:#FFC000;border-color:#2A4270;}
  .q-rows{display:flex;flex-direction:column;gap:10px;}
  .q-row{display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:start;}
  .q-tag{font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:800;background:#1E3158;color:#7A90AC;
    border-radius:3px;padding:2px 6px;text-align:center;white-space:nowrap;}
  .q-answer{font-size:12px;color:#7A90AC;line-height:1.5;}
  .q-answer.empty{color:#263C55;font-style:italic;}
</style>

<!-- TAB BAR -->
<div class="wrap">
  <div class="tab-bar">
    <button class="tab-btn active" onclick="showTab('dashboard')">Dashboard</button>
    <button class="tab-btn" onclick="showTab('trends')">Trends &amp; History</button>
  </div>

  <!-- ═══════════════════════ DASHBOARD TAB ═══════════════════════ -->
  <div id="tab-dashboard" class="active">
    <div class="masthead">
      <div class="mast-amber-bar"></div>
      <div class="mast-body">
        <div>
          <div class="mast-eyebrow">Liquip Victoria · Strategic Performance Review</div>
          <div class="mast-title">Balanced Scorecard<br>Master Dashboard</div>
          <div class="mast-sub">
            <strong>${esc(latestMonth)}</strong> &nbsp;·&nbsp; Month 1 of FY2026–27 &nbsp;·&nbsp;
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
        <div class="action-title">Action Required — ${R} KPIs need immediate attention</div>
      </div>
      <div class="action-body">
${actionItems(checkins)}
      </div>
    </div>

    <div class="footer">
      <span class="footer-note">Check-ins received: ${esc(fnList)}</span>
      <span class="footer-date">Next full review: September 2026 &nbsp;·&nbsp; Generated ${esc(today)}</span>
    </div>
  </div><!-- /tab-dashboard -->

  <!-- ═══════════════════════ TRENDS TAB ═══════════════════════ -->
  <div id="tab-trends">
    <div class="trends-wrap" id="trends-content">
      <!-- rendered by JS from ALL_DATA -->
    </div>
  </div>
</div><!-- /wrap -->

<!-- GATE -->
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
// ── embedded data ──────────────────────────────────────────────────────────────
const ALL_DATA = ${ALL_DATA};

const STRIPE = {
  Finance:'#3B82F6', Sales:'#22C55E', Operations:'#F59E0B',
  Procurement:'#FB923C', Quality:'#E11D48', 'Safety & Compliance':'#A855F7',
  Stores:'#0EA5E9', Production:'#10B981', Engineering:'#6366F1', Aviation:'#EC4899',
};
const ORDER = ['Finance','Sales','Operations','Procurement','Quality','Safety & Compliance','Stores','Production','Engineering','Aviation'];

// ── gate ───────────────────────────────────────────────────────────────────────
const HASH = '${GATE_HASH}';
async function sha256(msg) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(msg));
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
async function checkCode() {
  const val = document.getElementById('gate-input').value.trim();
  if (!val) return;
  const h = await sha256(val);
  if (h === HASH) {
    sessionStorage.setItem('bsc_auth','1');
    document.getElementById('gate').remove();
    document.querySelector('.wrap').style.display = 'flex';
    buildTrends();
  } else {
    document.getElementById('gate-err').textContent = 'Incorrect code — try again';
    document.getElementById('gate-input').value = '';
    document.getElementById('gate-input').focus();
  }
}
document.getElementById('gate-input').addEventListener('keydown', e => { if(e.key==='Enter') checkCode(); });
if (sessionStorage.getItem('bsc_auth') === '1') {
  document.getElementById('gate').remove();
  document.querySelector('.wrap').style.display = 'flex';
  buildTrends();
}

// ── tabs ───────────────────────────────────────────────────────────────────────
function showTab(t) {
  document.querySelectorAll('.tab-btn').forEach((b,i) => b.classList.toggle('active', (i===0&&t==='dashboard')||(i===1&&t==='trends')));
  document.getElementById('tab-dashboard').classList.toggle('active', t==='dashboard');
  document.getElementById('tab-trends').classList.toggle('active', t==='trends');
}

// ── similarity check ──────────────────────────────────────────────────────────
function similarity(a, b) {
  if (!a || !b) return 0;
  a = a.toLowerCase().trim(); b = b.toLowerCase().trim();
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  // simple: count shared words
  const wa = new Set(a.split(/\\s+/));
  const wb = b.split(/\\s+/);
  const common = wb.filter(w => wa.has(w)).length;
  return common / Math.max(wa.size, wb.length);
}

// ── build trends tab ──────────────────────────────────────────────────────────
function buildTrends() {
  const container = document.getElementById('trends-content');
  if (!container || container.children.length > 0) return;

  // Group all data by function, then by month
  const byFn = {};
  for (const c of ALL_DATA) {
    if (!byFn[c.function]) byFn[c.function] = [];
    byFn[c.function].push(c);
  }
  // Sort each function's entries by date
  for (const fn of Object.keys(byFn))
    byFn[fn].sort((a,b) => a.generated < b.generated ? -1 : 1);

  // All months across all data, sorted
  const allMonths = [...new Set(ALL_DATA.map(c => c.month))];

  const fns = [...ORDER.filter(f => byFn[f]), ...Object.keys(byFn).filter(f => !ORDER.includes(f))];

  for (const fn of fns) {
    const entries = byFn[fn];
    const stripe = STRIPE[fn] || '#3B82F6';
    const months = entries.map(e => e.month);

    // Collect all unique KPI names for this function
    const kpiNames = [];
    for (const e of entries)
      for (const k of (e.kpis||[]))
        if (!kpiNames.includes(k.name)) kpiNames.push(k.name);

    // Build heat map
    let thead = '<tr><th class="kpi-col">KPI</th>' + months.map(m => \`<th>\${escH(m)}</th>\`).join('') + '</tr>';
    let tbody = '';
    for (const kname of kpiNames) {
      let row = \`<td class="kpi-label">\${escH(kname)}</td>\`;
      let prevComment = null;
      for (const m of months) {
        const entry = entries.find(e => e.month === m);
        const kpi = entry ? (entry.kpis||[]).find(k => k.name === kname) : null;
        if (!kpi) {
          row += '<td><div class="heat-cell empty">—</div></td>';
          continue;
        }
        const r = (kpi.rag||'pending')[0];
        const sim = prevComment ? similarity(kpi.comment, prevComment) : 0;
        const repeatFlag = sim >= 0.85 ? '<span class="repeat-flag">↺</span>' : '';
        const cellData = JSON.stringify({kname, month:m, value:kpi.value, rag:r, comment:kpi.comment, trend:kpi.trend, target:kpi.target, repeated: sim>=0.85, fn});
        row += \`<td><div class="heat-cell \${r}" onclick='showCellDetail(\${cellData.replace(/'/g,"\\\\'")})'>\${escH(kpi.value)}\${repeatFlag}</div></td>\`;
        prevComment = kpi.comment;
      }
      tbody += \`<tr>\${row}</tr>\`;
    }

    // Narrative month buttons
    const monthBtns = months.map((m,i) => \`<button class="q-month-btn\${i===months.length-1?' active':''}" onclick="showNarrative('\${fn}','\${escH(m)}')">\${escH(m)}</button>\`).join('');
    const latestEntry = entries[entries.length-1];

    const block = document.createElement('div');
    block.className = 'trends-fn-block';
    block.id = \`fn-block-\${fn.replace(/[^a-z0-9]/gi,'-')}\`;
    block.innerHTML = \`
      <div class="trends-fn-head">
        <div class="trends-fn-stripe" style="background:\${stripe}"></div>
        <span class="trends-fn-name">\${escH(fn)}</span>
        <span class="trends-fn-sub">\${entries.length} check-in\${entries.length!==1?'s':''} · \${escH(entries[entries.length-1].name)}</span>
      </div>
      <div class="heatmap-scroll">
        <table class="heatmap"><thead>\${thead}</thead><tbody>\${tbody}</tbody></table>
      </div>
      <div class="narrative-block" id="narr-\${fn.replace(/[^a-z0-9]/gi,'-')}">
        <div class="narrative-header">
          <span class="narrative-title">Manager Narrative</span>
          <div class="q-months" id="qmonths-\${fn.replace(/[^a-z0-9]/gi,'-')}">\${monthBtns}</div>
          <button class="narrative-close" onclick="closeNarrative('\${fn}')">×</button>
        </div>
        <div class="q-rows" id="qrows-\${fn.replace(/[^a-z0-9]/gi,'-')}"></div>
      </div>
      <div id="cell-detail-\${fn.replace(/[^a-z0-9]/gi,'-')}" style="padding:0 20px;"></div>
    \`;
    container.appendChild(block);

    // Show latest narrative by default if multiple months
    if (months.length > 0) showNarrative(fn, months[months.length-1]);
  }
}

function escH(s) {
  return String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showNarrative(fn, month) {
  const slug = fn.replace(/[^a-z0-9]/gi,'-');
  const narr = document.getElementById(\`narr-\${slug}\`);
  if (!narr) return;
  narr.classList.add('open');

  // highlight active month button
  document.querySelectorAll(\`#qmonths-\${slug} .q-month-btn\`).forEach(b => {
    b.classList.toggle('active', b.textContent.trim() === month);
  });

  const entry = ALL_DATA.find(c => c.function === fn && c.month === month);
  const rows = document.getElementById(\`qrows-\${slug}\`);
  if (!entry || !rows) return;

  // Check if previous month has same answers
  const byFnSorted = ALL_DATA.filter(c=>c.function===fn).sort((a,b)=>a.generated<b.generated?-1:1);
  const idx = byFnSorted.findIndex(c=>c.month===month);
  const prev = idx > 0 ? byFnSorted[idx-1] : null;

  function qRow(tag, answer, prevAnswer) {
    const sim = prevAnswer ? similarity(answer, prevAnswer) : 0;
    const warn = sim >= 0.85 ? '<span class="repeat-warning">⚠ Same as previous month</span>' : '';
    const cls = answer ? '' : 'empty';
    return \`<div class="q-row">
      <span class="q-tag">\${tag}</span>
      <div>
        <div class="q-answer \${cls}">\${answer ? escH(answer) : 'No response recorded'}</div>
        \${warn}
      </div>
    </div>\`;
  }

  rows.innerHTML = [
    qRow('Q1', entry.q1||'', prev?.q1||''),
    qRow('Q2', entry.q2||'', prev?.q2||''),
    qRow('Q3', entry.q3||'', prev?.q3||''),
  ].join('');
}

function closeNarrative(fn) {
  const slug = fn.replace(/[^a-z0-9]/gi,'-');
  const narr = document.getElementById(\`narr-\${slug}\`);
  if (narr) narr.classList.remove('open');
}

function showCellDetail(dataStr) {
  const d = typeof dataStr === 'string' ? JSON.parse(dataStr) : dataStr;
  const slug = d.fn.replace(/[^a-z0-9]/gi,'-');
  const container = document.getElementById(\`cell-detail-\${slug}\`);
  if (!container) return;

  const ragColour = {g:'#22C55E', a:'#F59E0B', r:'#EF4444', p:'#3A5070'};
  const ragLabel  = {g:'Green', a:'Amber', r:'Red', p:'Pending'};
  const repeatWarn = d.repeated ? '<span class="repeat-warning">⚠ Comment appears identical to previous month</span>' : '';

  container.style.padding = '0 20px 16px';
  container.innerHTML = \`
    <div class="cell-detail">
      <div class="cell-detail-head">
        <div class="kpi-dot \${d.rag}" style="width:10px;height:10px;border-radius:50%;background:\${ragColour[d.rag]};flex-shrink:0;"></div>
        <span class="cell-detail-kpi">\${escH(d.kname)}</span>
        <span class="cell-detail-month">\${escH(d.month)}</span>
      </div>
      <div class="cell-detail-value" style="color:\${ragColour[d.rag]}">\${escH(d.value)}</div>
      <div style="font-size:10px;color:#263C55;margin-top:2px;">target: \${escH(d.target)} &nbsp;·&nbsp; trend: \${escH(d.trend||'—')} &nbsp;·&nbsp; \${ragLabel[d.rag]||'Pending'}</div>
      <div class="cell-detail-comment">\${escH(d.comment)||'<em>No comment recorded</em>'}</div>
      \${repeatWarn}
    </div>\`;

  // also open narrative for that month
  showNarrative(d.fn, d.month);
}
</script>
`;

fs.writeFileSync(OUT_FILE, html, 'utf8');
console.log(`Dashboard generated: ${checkins.length} perspectives, ${totalKpis} KPIs (${G}G/${A}A/${R}R/${P}P) · ${allFiles.length} total check-ins embedded`);
