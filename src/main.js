import './style.css';
import { GAME_W, GAME_H, SCALE, ROOMS, AGENTS } from './layout.js';
import { drawScene, hitTest } from './scene.js';
import { preloadSpriteSheets } from './spriteAnimator.js';

// ─── Canvas ───
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = GAME_W * SCALE;
canvas.height = GAME_H * SCALE;

const buf = document.createElement('canvas');
buf.width = GAME_W; buf.height = GAME_H;
const bctx = buf.getContext('2d');

let frame = 0;
let zoom = { active: false, key: null, t: 0, targetT: 0 };
let hoverKey = null;

const AVATAR_COLORS = {
  billy: '#4d7a6b', isaac: '#3464a8', patrick: '#3a6a3a',
  marcos: '#3a3a8a', sandra: '#8a3a3a', charlie: '#c07030', wendy: '#6a3a8a'
};

// ═══════════════════════════════════════════
//  HORIZONTAL AGENT BAR (center header)
// ═══════════════════════════════════════════
const agentBar = document.getElementById('agent-bar');

function buildAgentBar() {
  agentBar.innerHTML = '';
  Object.entries(AGENTS).forEach(([key, a]) => {
    const chip = document.createElement('div');
    chip.className = 'agent-chip';
    chip.id = `agent-chip-${key}`;
    chip.innerHTML = `
      <div class="chip-avatar" style="background:${AVATAR_COLORS[key]}">${a.name[0]}</div>
      <div class="chip-info">
        <span class="chip-name">${a.name}</span>
        <span class="chip-role">${a.role}</span>
      </div>
      <div class="chip-status ${a.status}" data-chip-key="${key}"></div>`;
    chip.addEventListener('click', () => {
      showAgentPanel(key);
      selectChatAgent(key);
    });
    agentBar.appendChild(chip);
  });
}

// ═══════════════════════════════════════════
//  LEFT DASHBOARD
// ═══════════════════════════════════════════
const activityLog = document.getElementById('activity-log');
const statWorking = document.getElementById('stat-working');
const statIdle = document.getElementById('stat-idle');
const statMeeting = document.getElementById('stat-meeting');
const dashTime = document.getElementById('dash-time');
const infoPanel = document.getElementById('info-panel');
const infoContent = document.getElementById('info-content');

const AGENT_TASKS = {
  billy:   [{ name: 'Q2 Strategy Review', progress: 78 }, { name: 'Board Deck Prep', progress: 45 }],
  isaac:   [{ name: 'API v2 Refactor', progress: 62 }, { name: 'Bug Fixes Sprint', progress: 91 }],
  patrick: [{ name: 'Monthly P&L', progress: 88 }, { name: 'Budget Forecast', progress: 34 }],
  marcos:  [{ name: 'NDA Review', progress: 100 }, { name: 'IP Filing', progress: 22 }],
  sandra:  [{ name: 'Sprint Planning', progress: 55 }, { name: 'Vendor Contracts', progress: 70 }],
  charlie: [{ name: 'Homepage Redesign', progress: 40 }, { name: 'Icon Pack v3', progress: 85 }],
  wendy:   [{ name: '1:1 with Isaac', progress: 50 }, { name: 'Team Retro Prep', progress: 15 }],
};

const activities = [];
const ACTIVITY_TEMPLATES = [
  { agent: 'isaac', text: 'pushed 3 commits to main' },
  { agent: 'billy', text: 'joined the boardroom meeting' },
  { agent: 'charlie', text: 'updated the homepage mockup' },
  { agent: 'sandra', text: 'created Sprint #14 backlog' },
  { agent: 'marcos', text: 'reviewed the NDA document' },
  { agent: 'patrick', text: 'submitted Q2 financial report' },
  { agent: 'wendy', text: 'started 1:1 coaching with Charlie' },
  { agent: 'isaac', text: 'resolved bug #247 (critical)' },
  { agent: 'billy', text: 'approved the marketing budget' },
  { agent: 'charlie', text: 'exported assets for the app' },
  { agent: 'sandra', text: 'assigned 4 tasks to the team' },
  { agent: 'marcos', text: 'filed IP protection request' },
  { agent: 'wendy', text: 'completed team performance review' },
  { agent: 'patrick', text: 'analyzed revenue growth trends' },
  { agent: 'isaac', text: 'deployed API v2.1 to staging' },
  { agent: 'charlie', text: 'finalized icon pack v3' },
];

let nextActivityIdx = 0;

function updateStats() {
  let w = 0, i = 0, m = 0;
  Object.values(AGENTS).forEach(a => { if (a.status==='working') w++; else if (a.status==='idle') i++; else m++; });
  statWorking.textContent = w; statIdle.textContent = i; statMeeting.textContent = m;
}

function addActivity(agentKey, text) {
  const time = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false });
  activities.unshift({ time, name: AGENTS[agentKey].name, text });
  if (activities.length > 15) activities.pop();
  renderActivities();
}

function renderActivities() {
  activityLog.innerHTML = '';
  activities.slice(0, 6).forEach(act => {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.innerHTML = `<span class="activity-time">${act.time}</span><span class="activity-text"><strong>${act.name}</strong> ${act.text}</span>`;
    activityLog.appendChild(li);
  });
}

function updateClock() {
  dashTime.textContent = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:true });
}

function simulateStatusChange() {
  const keys = Object.keys(AGENTS);
  const k = keys[Math.floor(Math.random() * keys.length)];
  const statuses = ['working','idle','meeting'];
  const ns = statuses[Math.floor(Math.random()*statuses.length)];
  if (ns !== AGENTS[k].status) {
    AGENTS[k].status = ns;
    updateStats();
    // Update chip status dot
    const chipDot = document.querySelector(`[data-chip-key="${k}"]`);
    if (chipDot) chipDot.className = `chip-status ${ns}`;
    // Update chat tab status dot
    const tabDot = document.querySelector(`.chat-tab[data-agent="${k}"] .tab-status`);
    if (tabDot) tabDot.className = `tab-status ${ns}`;
    addActivity(k, { working:'started working', idle:'went idle', meeting:'joined a meeting' }[ns]);
  }
}

// ─── Info Panel ───
function showAgentPanel(key) {
  const a = AGENTS[key];
  const tasks = AGENT_TASKS[key] || [];
  const taskHtml = tasks.map(t => `
    <div class="info-task">
      <span style="flex:1">${t.name}</span>
      <div class="task-progress"><div class="task-progress-fill" style="width:${t.progress}%;background:${t.progress===100?'var(--status-working)':'var(--accent-teal)'}"></div></div>
      <span style="font-family:var(--font-pixel);font-size:8px;color:var(--text-secondary)">${t.progress}%</span>
    </div>`).join('');
  infoContent.innerHTML = `
    <h3>${a.name}</h3>
    <p><strong>Role:</strong> ${a.role}</p>
    <p><span class="status-dot ${a.status}"></span><strong>Status:</strong> ${a.status.charAt(0).toUpperCase()+a.status.slice(1)}</p>
    <div class="info-tasks"><strong style="font-size:10px;color:var(--text-secondary)">CURRENT TASKS</strong>${taskHtml}</div>`;
  infoPanel.classList.remove('hidden');
  document.querySelectorAll('.agent-chip').forEach(el => el.classList.remove('active'));
  document.getElementById(`agent-chip-${key}`)?.classList.add('active');
  const room = ROOMS[key];
  if (room?.type === 'office') zoom = { active: true, key, t: zoom.t, targetT: 1 };
}

function hideAgentPanel() {
  infoPanel.classList.add('hidden');
  document.querySelectorAll('.agent-chip').forEach(el => el.classList.remove('active'));
}

document.getElementById('info-close').addEventListener('click', () => { hideAgentPanel(); zoom = { ...zoom, targetT: 0 }; });


// ═══════════════════════════════════════════
//  ACTIVE DEALS (left panel)
// ═══════════════════════════════════════════
const dealsList = document.getElementById('deals-list');
const dealsCountEl = document.getElementById('deals-count');

const DEALS = [
  {
    id: 'd1', name: 'Acme Corp Enterprise', value: '$240K', stage: 'negotiation', heat: 'hot',
    owner: 'billy', desc: 'Enterprise license deal with Acme Corp. NDA signed, SOW under review.',
    docs: 3, tags: ['enterprise', 'Q2'], progress: 68,
    updates: ['Billy presented ROI deck', 'Patrick ran financial projection', 'Marcos drafting MSA'],
  },
  {
    id: 'd2', name: 'TechStart Pilot', value: '$45K', stage: 'proposal', heat: 'warm',
    owner: 'sandra', desc: 'Pilot program for TechStart\'s 50-person team. Demo scheduled.',
    docs: 2, tags: ['pilot', 'SMB'], progress: 35,
    updates: ['Sandra sent proposal draft', 'Charlie designing custom demo slides'],
  },
  {
    id: 'd3', name: 'GlobalBank Platform', value: '$1.2M', stage: 'discovery', heat: 'cold',
    owner: 'billy', desc: 'Major platform deal with GlobalBank. Early discovery phase.',
    docs: 1, tags: ['finance', 'platform'], progress: 12,
    updates: ['Billy had initial discovery call', 'Marcos checking compliance requirements'],
  },
  {
    id: 'd4', name: 'RetailMax Renewal', value: '$180K', stage: 'closing', heat: 'hot',
    owner: 'patrick', desc: 'Annual renewal with upsell opportunity. Contract ready for signature.',
    docs: 4, tags: ['renewal', 'upsell'], progress: 92,
    updates: ['Patrick finalized pricing', 'Marcos approved the contract', 'Awaiting signature'],
  },
  {
    id: 'd5', name: 'HealthSync Integration', value: '$95K', stage: 'negotiation', heat: 'warm',
    owner: 'isaac', desc: 'API integration deal. Isaac scoping technical requirements.',
    docs: 2, tags: ['API', 'healthcare'], progress: 50,
    updates: ['Isaac completed technical assessment', 'Sandra scheduling follow-up'],
  },
];

function renderDeals() {
  dealsList.innerHTML = '';
  const openCount = DEALS.filter(d => d.progress < 100).length;
  dealsCountEl.textContent = `${openCount} open`;

  DEALS.forEach(deal => {
    const card = document.createElement('div');
    card.className = `deal-card ${deal.heat}`;

    const stageColor = deal.progress >= 90 ? 'var(--status-working)' :
                       deal.progress >= 50 ? 'var(--accent-coral)' :
                       deal.progress >= 25 ? 'var(--status-idle)' : 'var(--status-meeting)';

    const tagsHtml = deal.tags.map(t => `<span class="deal-tag">${t}</span>`).join('');
    const latestUpdate = deal.updates[deal.updates.length - 1];

    card.innerHTML = `
      <div class="deal-top">
        <span class="deal-icon">${deal.heat === 'hot' ? '🔥' : deal.heat === 'warm' ? '🌤' : '❄️'}</span>
        <span class="deal-name">${deal.name}</span>
        <span class="deal-value">${deal.value}</span>
      </div>
      <div class="deal-meta">
        <span class="deal-stage ${deal.stage}">${deal.stage}</span>
        <span class="deal-owner">👤 ${AGENTS[deal.owner].name}</span>
      </div>
      <div class="deal-desc">${latestUpdate}</div>
      <div class="deal-footer">
        ${tagsHtml}
        <span class="deal-docs">📎 ${deal.docs} docs</span>
      </div>
      <div class="deal-progress-wrap">
        <div class="deal-progress-bar">
          <div class="deal-progress-fill" style="width:${deal.progress}%;background:${stageColor}"></div>
        </div>
        <span class="deal-progress-label">${deal.progress}%</span>
      </div>`;

    card.addEventListener('click', () => showDealDetail(deal));
    dealsList.appendChild(card);
  });
}

function showDealDetail(deal) {
  const updatesHtml = deal.updates.map(u => `<div class="info-task"><span style="flex:1">• ${u}</span></div>`).join('');
  infoContent.innerHTML = `
    <h3>${deal.heat === 'hot' ? '🔥' : deal.heat === 'warm' ? '🌤' : '❄️'} ${deal.name}</h3>
    <p><strong>Value:</strong> ${deal.value} &nbsp;|&nbsp; <strong>Stage:</strong> ${deal.stage.charAt(0).toUpperCase()+deal.stage.slice(1)}</p>
    <p><strong>Owner:</strong> ${AGENTS[deal.owner].name} (${AGENTS[deal.owner].role})</p>
    <p style="font-size:10px;color:var(--text-secondary);margin-top:4px">${deal.desc}</p>
    <div class="info-tasks">
      <strong style="font-size:10px;color:var(--text-secondary)">DEAL HISTORY</strong>
      ${updatesHtml}
    </div>
    <p style="font-size:9px;color:var(--accent-gold-dim);margin-top:6px">📎 ${deal.docs} documents attached &nbsp;|&nbsp; Tags: ${deal.tags.join(', ')}</p>`;
  infoPanel.classList.remove('hidden');
}

function simulateDealProgress() {
  DEALS.forEach(deal => {
    if (deal.progress >= 100) return;
    const bump = Math.floor(Math.random() * 3);
    deal.progress = Math.min(100, deal.progress + bump);

    if (deal.progress >= 100) {
      deal.progress = 100;
      deal.stage = 'closing';
      deal.heat = 'hot';
      addActivity(deal.owner, `closed the "${deal.name}" deal! 🎉`);
      chatHistory[deal.owner]?.push({
        from: 'agent', text: `🎉 Great news! We just closed the ${deal.name} deal (${deal.value})!`, time: formatTime(),
      });
      if (activeChatAgent === deal.owner) renderChat();
      else { unreadCounts[deal.owner]++; updateUnreadBadge(deal.owner); }
    }
  });
  renderDeals();
}


// ═══════════════════════════════════════════
//  CHAT SYSTEM
// ═══════════════════════════════════════════
const chatTabs = document.getElementById('chat-tabs');
const chatMessages = document.getElementById('chat-messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');

let activeChatAgent = null;
const chatHistory = {};
const unreadCounts = {};
Object.keys(AGENTS).forEach(k => { chatHistory[k] = []; unreadCounts[k] = 0; });

const AGENT_PERSONALITIES = {
  billy: {
    greeting: "Hey boss! Billy here, CEO. What's on your mind?",
    responses: [
      "Great point. I'll bring this up in the next board meeting.",
      "Let me sync with the team. I'll have an update by EOD.",
      "This aligns with our Q2 strategy. Let's move forward.",
      "I've been thinking about this too. Let me loop in Patrick for budget.",
      "Consider it done. I'll restructure priorities.",
      "I'll check with Sandra on the timeline before we commit.",
    ]
  },
  isaac: {
    greeting: "Yo! Isaac here, Lead Dev. Ready to talk code.",
    responses: [
      "On it. I'll push the fix after running tests.",
      "That's a bigger refactor than it sounds. Give me an hour to scope it.",
      "Already got a branch half-finished. Let me wrap it up.",
      "Good catch! That's a known bug. Priority bump incoming.",
      "I can prototype something by tonight.",
      "Might conflict with current sprint work. Let me check with Sandra.",
    ]
  },
  patrick: {
    greeting: "Patrick here, CFO. Let's talk numbers.",
    responses: [
      "I've run the numbers. We're within budget, barely.",
      "That'll cost ~$12K this quarter. I can make it work.",
      "Budget-wise, we're in good shape this month.",
      "I'll prepare a cost-benefit analysis by noon.",
      "Revenue is tracking ahead. We can invest here.",
      "I'll update the budget spreadsheet and share with the board.",
    ]
  },
  marcos: {
    greeting: "Marcos speaking, Legal & Compliance. How can I help?",
    responses: [
      "I'll review the contract. I'll expedite the turnaround.",
      "We need to be careful. There could be IP implications.",
      "I'll draft an NDA. Better safe than sorry.",
      "That's a gray area. Let me research precedents.",
      "The liability clause needs revision. I'll redline it.",
      "The compliance paperwork is in motion. Clear by Friday.",
    ]
  },
  sandra: {
    greeting: "Sandra here, Line Producer. Let's keep moving!",
    responses: [
      "Added to the sprint backlog. I'll prioritize next week.",
      "Let me check team capacity. We're loaded this sprint.",
      "I've blocked time on the calendar. Team's free Thursday.",
      "Timeline is tight, achievable if we cut secondary features.",
      "I'll create Jira tickets and assign them now.",
      "Deadline update: on pace to deliver Wednesday.",
    ]
  },
  charlie: {
    greeting: "Hey! Charlie here, lead designer. Talk design to me!",
    responses: [
      "I've got three mockup options ready. Let me share my screen.",
      "Love that direction! Let me sketch something up.",
      "The font pairing isn't working. Trying something bolder.",
      "I'll have the Figma file updated by tomorrow morning.",
      "The user flow has too many steps. Let me simplify.",
      "A/B test results are in — Option B won by 23%.",
    ]
  },
  wendy: {
    greeting: "Hi! Wendy, Performance Coach. How can I support the team?",
    responses: [
      "I noticed tension in the team. Want me to facilitate a retro?",
      "Great progress this week! I'll highlight this in the report.",
      "Let me set up a 1:1 with them. A private conversation helps.",
      "That's a motivation issue, not skills. Let me talk to them.",
      "Team velocity is up 15% since last month. Keep it up!",
      "Burnout is real. I'm suggesting a mental health day.",
    ]
  },
};

function buildChatTabs() {
  chatTabs.innerHTML = '';
  Object.entries(AGENTS).forEach(([key, a]) => {
    const tab = document.createElement('div');
    tab.className = 'chat-tab';
    tab.dataset.agent = key;
    tab.style.background = AVATAR_COLORS[key];
    tab.innerHTML = `${a.name[0]}<div class="tab-status ${a.status}"></div><div class="tab-unread hidden" data-unread="${key}">0</div>`;
    tab.title = `${a.name} — ${a.role}`;
    tab.addEventListener('click', () => selectChatAgent(key));
    chatTabs.appendChild(tab);
  });
}

function selectChatAgent(key) {
  activeChatAgent = key;
  document.querySelectorAll('.chat-tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.chat-tab[data-agent="${key}"]`)?.classList.add('active');
  unreadCounts[key] = 0;
  updateUnreadBadge(key);
  chatInput.placeholder = `Message ${AGENTS[key].name}...`;
  if (chatHistory[key].length === 0) {
    chatHistory[key].push({ from: 'agent', text: AGENT_PERSONALITIES[key].greeting, time: formatTime() });
  }
  renderChat();
}

function renderChat() {
  if (!activeChatAgent) {
    chatMessages.innerHTML = `<div class="chat-welcome"><div class="chat-welcome-icon">💬</div><h3>SELECT AN AGENT</h3><p>Click a tab above to start chatting.</p></div>`;
    return;
  }
  chatMessages.innerHTML = '';
  chatHistory[activeChatAgent].forEach(msg => {
    const div = document.createElement('div');
    div.className = `chat-msg ${msg.from}`;
    const authorName = msg.from === 'user' ? 'YOU' : AGENTS[activeChatAgent].name;
    const authorColor = msg.from === 'user' ? '' : `color:${AVATAR_COLORS[activeChatAgent]}`;
    div.innerHTML = `<div class="msg-header"><span class="msg-author" style="${authorColor}">${authorName}</span><span class="msg-time">${msg.time}</span></div><div class="msg-bubble">${msg.text}</div>`;
    chatMessages.appendChild(div);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function updateUnreadBadge(key) {
  const badge = document.querySelector(`[data-unread="${key}"]`);
  if (!badge) return;
  if (unreadCounts[key] > 0) { badge.textContent = unreadCounts[key]; badge.classList.remove('hidden'); }
  else { badge.classList.add('hidden'); }
}

function showTypingIndicator() {
  if (chatMessages.querySelector('.typing-indicator')) return;
  const div = document.createElement('div');
  div.className = 'typing-indicator';
  div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTypingIndicator() {
  chatMessages.querySelector('.typing-indicator')?.remove();
}

function getAgentResponse(key, userMsg) {
  const p = AGENT_PERSONALITIES[key];
  const lower = userMsg.toLowerCase();
  if (lower.includes('status') || lower.includes('how are') || lower.includes('update')) {
    const a = AGENTS[key];
    const tasks = AGENT_TASKS[key];
    const taskStr = tasks ? tasks.map(t => `"${t.name}" (${t.progress}%)`).join(' and ') : 'various items';
    return `${{ working:"Heads-down working.", idle:"I'm free right now.", meeting:"In a meeting, but here briefly." }[a.status]} Currently handling ${taskStr}.`;
  }
  if (lower.includes('deal') || lower.includes('pipeline') || lower.includes('revenue')) {
    const agentDeals = DEALS.filter(d => d.owner === key);
    if (agentDeals.length > 0) return agentDeals.map(d => `📋 "${d.name}" — ${d.stage} (${d.value}, ${d.progress}%)`).join('\n');
    return "I'm not directly owning any deals right now, but I'm supporting the team on several.";
  }
  if (lower.includes('task') || lower.includes('working on') || lower.includes('progress')) {
    const tasks = AGENT_TASKS[key];
    if (tasks) return tasks.map(t => `📋 "${t.name}" — ${t.progress}% complete${t.progress===100?' ✅':''}`).join('\n');
  }
  if (lower.includes('thank') || lower.includes('appreciate')) return "Happy to help! Let me know if you need anything. 👍";
  return p.responses[Math.floor(Math.random() * p.responses.length)];
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatInput.value.trim();
  if (!text || !activeChatAgent) return;
  chatHistory[activeChatAgent].push({ from: 'user', text, time: formatTime() });
  chatInput.value = '';
  renderChat();
  addActivity(activeChatAgent, 'received a message from you');
  showTypingIndicator();
  const agentKey = activeChatAgent;
  setTimeout(() => {
    removeTypingIndicator();
    const response = getAgentResponse(agentKey, text);
    chatHistory[agentKey].push({ from: 'agent', text: response, time: formatTime() });
    if (activeChatAgent === agentKey) renderChat();
  }, 800 + Math.random() * 1500);
});

function proactiveAgentMessage() {
  const keys = Object.keys(AGENTS);
  const k = keys[Math.floor(Math.random() * keys.length)];
  const msgs = {
    billy: ["Just had a great call with an investor! 🚀", "Reminder: all-hands tomorrow at 10 AM."],
    isaac: ["Found a memory leak. Fixing now.", "Test coverage is up to 87%."],
    patrick: ["Revenue up 12% this month.", "Cash flow looks healthy."],
    marcos: ["Trademark approved. 🎉", "Updated the privacy policy, please review."],
    sandra: ["Sprint velocity up 18%!", "Standup notes posted."],
    charlie: ["Finished dark mode variants! 🔥", "New icon set uploaded."],
    wendy: ["Team morale: 4.2/5.0 📊", "Reminder to take breaks, everyone."],
  };
  const msg = msgs[k][Math.floor(Math.random() * msgs[k].length)];
  chatHistory[k].push({ from: 'agent', text: msg, time: formatTime() });
  if (activeChatAgent === k) renderChat();
  else { unreadCounts[k]++; updateUnreadBadge(k); }
  addActivity(k, 'sent you a message');
}


// ═══════════════════════════════════════════
//  TEAMWORK SECTION
// ═══════════════════════════════════════════
const teamworkList = document.getElementById('teamwork-list');
const collabCount = document.getElementById('collab-count');

const COLLABORATIONS = [
  { id:'c1', agents:['isaac','charlie'], title:'Homepage Redesign', type:'build', desc:'Isaac implementing Charlie\'s new Figma mockup.', progress:40, startTime:'09:30', active:true },
  { id:'c2', agents:['billy','patrick'], title:'Q2 Budget Approval', type:'review', desc:'Reviewing the quarterly budget forecast.', progress:72, startTime:'09:15', active:true },
  { id:'c3', agents:['sandra','wendy'], title:'Sprint Retro Planning', type:'plan', desc:'Co-designing the sprint retrospective agenda.', progress:55, startTime:'10:00', active:true },
  { id:'c4', agents:['isaac','marcos'], title:'API License Audit', type:'review', desc:'Auditing third-party API licenses.', progress:28, startTime:'10:05', active:true },
  { id:'c5', agents:['charlie','wendy','billy'], title:'Brand Refresh Kickoff', type:'plan', desc:'Brainstorm on refreshing brand identity.', progress:12, startTime:'10:10', active:false },
  { id:'c6', agents:['isaac','sandra'], title:'Bug Triage Session', type:'debug', desc:'Triaging P0 bugs from latest release.', progress:85, startTime:'08:45', active:true },
];

const COLLAB_POOL = [
  { agents:['patrick','marcos'], title:'Vendor Contract Review', type:'review', desc:'Cross-checking vendor payment terms.', progress:0 },
  { agents:['wendy','isaac'], title:'Dev Team Coaching', type:'plan', desc:'Coaching Isaac on leadership skills.', progress:0 },
  { agents:['billy','sandra','charlie'], title:'Product Roadmap Sync', type:'plan', desc:'Aligning product roadmap with design capacity.', progress:0 },
  { agents:['charlie','marcos'], title:'Design IP Protection', type:'review', desc:'Filing copyright for design assets.', progress:0 },
  { agents:['isaac','patrick'], title:'Infrastructure Cost Audit', type:'debug', desc:'Auditing cloud spend for optimization.', progress:0 },
  { agents:['sandra','billy'], title:'Hiring Pipeline Review', type:'plan', desc:'Reviewing candidates for senior dev position.', progress:0 },
];

function renderTeamwork() {
  teamworkList.innerHTML = '';
  const activeCount = COLLABORATIONS.filter(c => c.active).length;
  collabCount.textContent = `${activeCount} active`;

  COLLABORATIONS.forEach(collab => {
    const card = document.createElement('div');
    card.className = `collab-card${collab.active ? ' active-collab' : ''}`;
    const avatarsHtml = collab.agents.map(k =>
      `<div class="collab-avatar" style="background:${AVATAR_COLORS[k]}" title="${AGENTS[k].name}">${AGENTS[k].name[0]}</div>`
    ).join('');
    const progressColor = collab.progress >= 80 ? 'var(--status-working)' :
                           collab.progress >= 50 ? 'var(--accent-teal)' :
                           collab.progress >= 25 ? 'var(--status-idle)' : 'var(--status-meeting)';
    card.innerHTML = `
      <div class="collab-header">
        <div class="collab-avatars">${avatarsHtml}</div>
        <span class="collab-title">${collab.title}</span>
        ${collab.active ? '<div class="collab-live"></div>' : ''}
      </div>
      <div class="collab-meta">
        <span class="collab-type ${collab.type}">${collab.type}</span>
        <span class="collab-time">since ${collab.startTime}</span>
      </div>
      <div class="collab-desc">${collab.desc}</div>
      <div class="collab-progress-wrap">
        <div class="collab-progress-bar">
          <div class="collab-progress-fill" style="width:${collab.progress}%;background:${progressColor}"></div>
        </div>
        <span class="collab-progress-label">${collab.progress}%</span>
      </div>`;
    teamworkList.appendChild(card);
  });
}

function simulateCollabProgress() {
  COLLABORATIONS.forEach(collab => {
    if (!collab.active) return;
    collab.progress = Math.min(100, collab.progress + Math.floor(Math.random() * 5));
    if (collab.progress >= 100) {
      collab.active = false; collab.progress = 100;
      addActivity(collab.agents[0], `completed "${collab.title}" with ${collab.agents.slice(1).map(k => AGENTS[k].name).join(', ')}`);
      collab.agents.forEach(k => {
        chatHistory[k].push({ from:'agent', text:`✅ We just finished "${collab.title}"! Great teamwork.`, time:formatTime() });
        if (activeChatAgent === k) renderChat();
        else { unreadCounts[k]++; updateUnreadBadge(k); }
      });
    }
  });
  renderTeamwork();
}

function spawnNewCollab() {
  const activeCount = COLLABORATIONS.filter(c => c.active).length;
  if (activeCount >= 5 || COLLAB_POOL.length === 0) return;
  const idx = Math.floor(Math.random() * COLLAB_POOL.length);
  const template = COLLAB_POOL.splice(idx, 1)[0];
  const time = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12:false });
  const newCollab = { ...template, id:'c'+Date.now(), startTime:time, active:true, progress:Math.floor(Math.random()*10) };
  COLLABORATIONS.unshift(newCollab);
  addActivity(newCollab.agents[0], `started collaborating with ${newCollab.agents.slice(1).map(k => AGENTS[k].name).join(', ')} on "${newCollab.title}"`);
  newCollab.agents.forEach(k => {
    chatHistory[k].push({ from:'agent', text:`🤝 Started working with ${newCollab.agents.filter(a=>a!==k).map(a=>AGENTS[a].name).join(' and ')} on "${newCollab.title}".`, time:formatTime() });
    if (activeChatAgent === k) renderChat();
    else { unreadCounts[k]++; updateUnreadBadge(k); }
  });
  renderTeamwork();
}


// ═══════════════════════════════════════════
//  CANVAS INTERACTION
// ═══════════════════════════════════════════
function canvasToGame(e) {
  const rect = canvas.getBoundingClientRect();
  const sx = canvas.width / rect.width;
  const sy = canvas.height / rect.height;
  const px = (e.clientX - rect.left) * sx;
  const py = (e.clientY - rect.top) * sy;
  if (zoom.active && zoom.t > 0.01) {
    const r = ROOMS[zoom.key];
    const pad = 10;
    const cx = r.x + r.w/2, cy = r.y + r.h/2;
    const zs = Math.min(GAME_W/(r.w+pad*2), GAME_H/(r.h+pad*2));
    const s = 1 + (zs-1)*zoom.t;
    const ox = (GAME_W/2 - cx*s) * zoom.t;
    const oy = (GAME_H/2 - cy*s) * zoom.t;
    return { x: (px/SCALE - ox)/s, y: (py/SCALE - oy)/s };
  }
  return { x: px/SCALE, y: py/SCALE };
}

canvas.addEventListener('mousemove', e => {
  const g = canvasToGame(e);
  hoverKey = hitTest(g.x, g.y);
  canvas.style.cursor = hoverKey ? 'pointer' : 'default';
});

canvas.addEventListener('click', e => {
  const g = canvasToGame(e);
  const key = hitTest(g.x, g.y);
  if (zoom.active && zoom.t > 0.5) { zoom = { ...zoom, targetT: 0 }; hideAgentPanel(); return; }
  if (key && AGENTS[key]) { showAgentPanel(key); selectChatAgent(key); }
});

canvas.addEventListener('dblclick', () => { zoom = { ...zoom, targetT: 0 }; hideAgentPanel(); });


// ═══════════════════════════════════════════
//  RENDER LOOP
// ═══════════════════════════════════════════
function render() {
  frame++;
  zoom.t += (zoom.targetT - zoom.t) * 0.08;
  if (zoom.targetT === 0 && zoom.t < 0.005) { zoom.active = false; zoom.t = 0; }

  bctx.clearRect(0, 0, GAME_W, GAME_H);
  bctx.save();

  if (zoom.active && zoom.t > 0.001) {
    const r = ROOMS[zoom.key];
    const pad = 10;
    const cx = r.x+r.w/2, cy = r.y+r.h/2;
    const zs = Math.min(GAME_W/(r.w+pad*2), GAME_H/(r.h+pad*2));
    const s = 1+(zs-1)*zoom.t;
    bctx.translate((GAME_W/2-cx*s)*zoom.t, (GAME_H/2-cy*s)*zoom.t);
    bctx.scale(s, s);
  }

  drawScene(bctx, GAME_W, GAME_H, frame);

  if (hoverKey && !zoom.active) {
    const r = ROOMS[hoverKey];
    bctx.strokeStyle = '#5d8a7b';
    bctx.lineWidth = 2;
    bctx.strokeRect(r.x, r.y, r.w, r.h);
  }

  bctx.restore();
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(buf, 0, 0, canvas.width, canvas.height);

  requestAnimationFrame(render);
}


// ═══════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════
async function init() {
  await document.fonts.load("6px 'Press Start 2P'");
  await preloadSpriteSheets();

  buildAgentBar();
  buildChatTabs();
  updateStats();
  updateClock();
  renderChat();
  renderDeals();
  renderTeamwork();

  for (let i = 0; i < 5; i++) {
    const a = ACTIVITY_TEMPLATES[i];
    addActivity(a.agent, a.text);
  }

  setInterval(updateClock, 1000);
  setInterval(simulateStatusChange, 8000);
  setInterval(() => {
    const tmpl = ACTIVITY_TEMPLATES[nextActivityIdx % ACTIVITY_TEMPLATES.length];
    nextActivityIdx++;
    addActivity(tmpl.agent, tmpl.text);
  }, 12000);
  setInterval(() => {
    Object.values(AGENT_TASKS).forEach(tasks => {
      tasks.forEach(t => { if (t.progress < 100) t.progress = Math.min(100, t.progress + Math.floor(Math.random()*3)); });
    });
  }, 10000);

  setInterval(proactiveAgentMessage, 25000 + Math.random() * 15000);
  setInterval(simulateCollabProgress, 6000);
  setInterval(spawnNewCollab, 30000 + Math.random() * 20000);
  setInterval(simulateDealProgress, 15000);

  render();
}

init();
