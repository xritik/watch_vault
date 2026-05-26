/* ══════════════════════════════════════════════════
   RITIK'S WATCH VAULT — app.js
   ══════════════════════════════════════════════════
 
   MongoDB Atlas Data API setup:
   ─────────────────────────────
   1. Go to https://cloud.mongodb.com
   2. Create a free M0 cluster (or use existing)
   3. In the cluster → "App Services" → Create an App
   4. Enable "Data API" under the app
   5. Create an API Key (Authentication → API Keys)
   6. Fill in the 3 constants below:
      - ATLAS_ENDPOINT  : your Data API base URL
      - ATLAS_API_KEY   : your API key
      - ATLAS_DB        : your database name
   7. Create a collection called "watchlist" in that DB
   8. In the App Services Rules, allow read/write on the collection
 
   The app falls back to localStorage automatically if
   the API is not configured yet (ATLAS_ENDPOINT = '').
   ══════════════════════════════════════════════════ */
 
/* ── MongoDB Atlas Data API config ── */
const ATLAS_ENDPOINT = '';          // e.g. 'https://data.mongodb-api.com/app/data-xxxxx/endpoint/data/v1'
const ATLAS_API_KEY  = '';          // your Atlas Data API key
const ATLAS_DB       = 'watchvault'; // your database name
const ATLAS_COLL     = 'watchlist';  // collection name
const USE_ATLAS      = ATLAS_ENDPOINT !== '';
 
/* ── Local fallback store key ── */
const LOCAL_KEY = 'ritik_watchvault_v3';
 
/* ── Password ── */
const CORRECT_PWD = '7777777';
 
/* ══════════════════════
   DEFAULT DATA (seed)
   ══════════════════════ */
const DEFAULT_DATA = [
  {_id:'1',title:'Oppenheimer',type:'movie',year:2023,genre:'Historical Drama',status:'watched',rating:5,emoji:'💣',note:'Absolutely mind-blowing. Nolan at his peak. The IMAX experience was life-changing.',added:Date.now()-8e8},
  {_id:'2',title:'Attack on Titan',type:'anime',year:2013,genre:'Action, Dark Fantasy',status:'watched',rating:5,emoji:'⚔️',note:'Greatest anime ever made. The final arc destroyed me emotionally.',added:Date.now()-7e8},
  {_id:'3',title:'Dune: Part Two',type:'movie',year:2024,genre:'Sci-Fi, Epic',status:'watched',rating:5,emoji:'🏜️',note:"Stunning visuals. Zendaya was incredible. Can't wait for Part Three.",added:Date.now()-6e8},
  {_id:'4',title:'Peaky Blinders',type:'series',year:2013,genre:'Crime, Drama',status:'watched',rating:5,emoji:'🎩',note:'Tommy Shelby is one of the greatest TV characters of all time.',added:Date.now()-5e8},
  {_id:'5',title:'The Bear',type:'series',year:2022,genre:'Drama, Comedy',status:'watching',rating:4,emoji:'🐻',note:'Intensely stressful in the best way possible. Season 2 is art.',added:Date.now()-4e8},
  {_id:'6',title:'Past Lives',type:'movie',year:2023,genre:'Romance, Drama',status:'watched',rating:5,emoji:'🌿',note:'Quietly devastating. The ending made me stare at the ceiling for 20 minutes.',added:Date.now()-3e8},
  {_id:'7',title:'Cyberpunk: Edgerunners',type:'anime',year:2022,genre:'Sci-Fi, Action',status:'watched',rating:5,emoji:'🌆',note:'10 episodes. Made me cry like a baby. David Martinez lives forever.',added:Date.now()-2.5e8},
  {_id:'8',title:'True Detective S1',type:'series',year:2014,genre:'Crime, Mystery',status:'watched',rating:5,emoji:'🕵️',note:'Rust Cohle monologues alone are worth the watch. Peak television.',added:Date.now()-2e8},
  {_id:'9',title:'Poor Things',type:'movie',year:2023,genre:'Fantasy, Drama',status:'watched',rating:4,emoji:'🔮',note:'Weird, wild, wonderful. Emma Stone is from another planet.',added:Date.now()-1.5e8},
  {_id:'10',title:'Severance',type:'series',year:2022,genre:'Sci-Fi, Thriller',status:'watching',rating:5,emoji:'🏢',note:'The most creative concept on TV. Every episode ends on a cliffhanger.',added:Date.now()-1e8},
  {_id:'11',title:'Parasite',type:'movie',year:2019,genre:'Thriller, Drama',status:'watched',rating:5,emoji:'🪲',note:'Changed the way I think about cinema. The basement scene = peak cinema.',added:Date.now()-9e7},
  {_id:'12',title:'Shogun (2024)',type:'series',year:2024,genre:'Historical, Drama',status:'plan',rating:0,emoji:'⛩️',note:"Everyone says it's incredible. It's next on my list.",added:Date.now()-5e7},
];
 
/* ══════════════════════
   ATLAS DATA API HELPERS
   ══════════════════════ */
async function atlasRequest(action, body) {
  const res = await fetch(`${ATLAS_ENDPOINT}/action/${action}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': ATLAS_API_KEY,
    },
    body: JSON.stringify({
      dataSource: 'Cluster0',
      database: ATLAS_DB,
      collection: ATLAS_COLL,
      ...body,
    }),
  });
  if (!res.ok) throw new Error(`Atlas API error: ${res.status}`);
  return res.json();
}
 
async function dbFetchAll() {
  if (!USE_ATLAS) {
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  }
  try {
    const data = await atlasRequest('find', { sort: { added: -1 }, limit: 500 });
    return data.documents || [];
  } catch (e) {
    console.error('Atlas fetch failed, falling back to localStorage', e);
    const stored = localStorage.getItem(LOCAL_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DATA;
  }
}
 
async function dbInsert(item) {
  if (!USE_ATLAS) {
    db.unshift(item); localSave(); return item;
  }
  try {
    await atlasRequest('insertOne', { document: item });
    db.unshift(item);
  } catch (e) {
    console.error('Atlas insert failed', e);
    db.unshift(item); localSave();
  }
}
 
async function dbUpdate(id, updates) {
  if (!USE_ATLAS) {
    const idx = db.findIndex(x => x._id === id);
    if (idx > -1) { db[idx] = { ...db[idx], ...updates }; localSave(); }
    return;
  }
  try {
    await atlasRequest('updateOne', {
      filter: { _id: { $oid: id } },
      update: { $set: updates },
    });
    const idx = db.findIndex(x => x._id === id);
    if (idx > -1) db[idx] = { ...db[idx], ...updates };
  } catch (e) {
    console.error('Atlas update failed', e);
    const idx = db.findIndex(x => x._id === id);
    if (idx > -1) { db[idx] = { ...db[idx], ...updates }; localSave(); }
  }
}
 
async function dbDelete(id) {
  if (!USE_ATLAS) {
    db = db.filter(x => x._id !== id); localSave(); return;
  }
  try {
    await atlasRequest('deleteOne', { filter: { _id: { $oid: id } } });
    db = db.filter(x => x._id !== id);
  } catch (e) {
    console.error('Atlas delete failed', e);
    db = db.filter(x => x._id !== id); localSave();
  }
}
 
function localSave() {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(db));
}
 
/* ══════════════════════
   APP STATE
   ══════════════════════ */
let db = [];
let statusF = 'all', typeF = 'all', search = '', sortBy = 'newest';
let ratingVal = 0, detailId = null;
let editMode = false, editId = null;
let pwdAction = null; // 'delete' | 'edit'
 
/* ══════════════════════
   HEARTS CANVAS
   ══════════════════════ */
const hc   = document.getElementById('hc');
const hctx = hc.getContext('2d');
let hearts = [];
 
function resizeHC() { hc.width = innerWidth; hc.height = innerHeight; }
resizeHC(); window.addEventListener('resize', resizeHC);
 
function hColor() {
  const s = getComputedStyle(document.documentElement);
  return [s.getPropertyValue('--heart1').trim(), s.getPropertyValue('--heart2').trim(), s.getPropertyValue('--heart3').trim()];
}
function mkH(x, y) {
  const c = hColor();
  return { x: x ?? Math.random()*hc.width, y: y ?? (hc.height+20),
    sz: Math.random()*14+6, sp: Math.random()*1+.4, op: Math.random()*.4+.15,
    cl: c[~~(Math.random()*3)], dr: (Math.random()-.5)*.5,
    ang: Math.random()*Math.PI*2, spn: (Math.random()-.5)*.025 };
}
function initH() { hearts = Array.from({length:25}, () => { const h=mkH(); h.y=Math.random()*hc.height; return h; }); }
initH();
 
function drawH(cx, cy, s, a, cl, op) {
  hctx.save(); hctx.translate(cx,cy); hctx.rotate(a); hctx.globalAlpha=op;
  const r=s*.5; hctx.beginPath();
  hctx.moveTo(0,r*.6); hctx.bezierCurveTo(r,-r*.2,r*1.6,-r*1.2,0,-r*.8);
  hctx.bezierCurveTo(-r*1.6,-r*1.2,-r,-r*.2,0,r*.6);
  hctx.fillStyle=cl; hctx.shadowColor=cl; hctx.shadowBlur=s*1.2; hctx.fill(); hctx.restore();
}
function animH() {
  hctx.clearRect(0,0,hc.width,hc.height);
  hearts.forEach((h,i) => {
    h.y -= h.sp; h.x += h.dr; h.ang += h.spn;
    drawH(h.x,h.y,h.sz,h.ang,h.cl,h.op);
    if (h.y < -20) hearts[i] = mkH();
  });
  requestAnimationFrame(animH);
}
animH();
 
document.addEventListener('click', e => {
  for (let i=0;i<4;i++) {
    const h = mkH(e.clientX+(Math.random()-.5)*20, e.clientY);
    h.sp=Math.random()*3+1.5; h.op=.7;
    hearts.push(h);
    setTimeout(() => { const idx=hearts.indexOf(h); if(idx>-1) hearts.splice(idx,1); }, 2500);
  }
});
 
/* ══════════════════════
   THEME TOGGLE
   ══════════════════════ */
function applyTheme(light) {
  document.documentElement.setAttribute('data-theme', light ? 'light' : 'dark');
  // Nav toggle
  document.getElementById('tIcon').textContent  = light ? '☀️' : '🌙';
  document.getElementById('tLabel').textContent = light ? 'Light' : 'Dark';
  // Drawer toggle
  document.getElementById('drawerThemeIcon').textContent  = light ? '☀️' : '🌙';
  document.getElementById('drawerThemeLabel').textContent = light ? 'Switch to Dark Mode' : 'Switch to Light Mode';
  initH();
}
 
document.getElementById('themeToggle').addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  applyTheme(!isLight);
});
 
document.getElementById('drawerThemeBtn').addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  applyTheme(!isLight);
});
 
/* ══════════════════════
   MOBILE DRAWER
   ══════════════════════ */
const drawer        = document.getElementById('mobileDrawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const hamburger     = document.getElementById('hamburger');
 
function openDrawer()  { drawer.classList.add('open'); drawerOverlay.classList.add('open'); hamburger.classList.add('open'); }
function closeDrawer() { drawer.classList.remove('open'); drawerOverlay.classList.remove('open'); hamburger.classList.remove('open'); }
 
hamburger.addEventListener('click', () => drawer.classList.contains('open') ? closeDrawer() : openDrawer());
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
drawerOverlay.addEventListener('click', closeDrawer);
 
// Mobile status filter (inside drawer)
document.getElementById('mobileStatusFilter').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  document.querySelectorAll('#mobileStatusFilter button').forEach(b => b.classList.remove('active'));
  // Sync desktop nav too
  document.querySelectorAll('#statusFilter button').forEach(b => b.classList.remove('active'));
  const desktopBtn = document.querySelector(`#statusFilter button[data-status="${btn.dataset.status}"]`);
  if (desktopBtn) desktopBtn.classList.add('active');
  btn.classList.add('active');
  statusF = btn.dataset.status;
  closeDrawer();
  render();
});
 
/* ══════════════════════
   RENDER
   ══════════════════════ */
const grid       = document.getElementById('grid');
const emptyState = document.getElementById('emptyState');
const loadingEl  = document.getElementById('loadingState');
 
const statusMap = {
  watched:  { cls:'badge-watched',  label:'Watched' },
  watching: { cls:'badge-watching', label:'Watching' },
  plan:     { cls:'badge-plan',     label:'Plan to Watch' },
  dropped:  { cls:'badge-dropped',  label:'Dropped' },
};
const typeLabel = { movie:'Movie', series:'Series', anime:'Anime', documentary:'Doc' };
 
function starsHTML(n) {
  let s = ''; for (let i=1;i<=5;i++) s += `<span style="color:${i<=n?'var(--gold)':'#3a3a3a'}">★</span>`; return s;
}
function posterGrad(type) {
  const g = { movie:'linear-gradient(160deg,#0f1620,#1c2540)', series:'linear-gradient(160deg,#100e1c,#221540)', anime:'linear-gradient(160deg,#150d1a,#3d1038)', documentary:'linear-gradient(160deg,#0e1510,#1a2d10)' };
  return g[type] || g.movie;
}
 
function filterSort() {
  let d = [...db];
  if (statusF !== 'all') d = d.filter(x => x.status === statusF);
  if (typeF   !== 'all') d = d.filter(x => x.type   === typeF);
  if (search) d = d.filter(x => x.title.toLowerCase().includes(search.toLowerCase()) || (x.genre||'').toLowerCase().includes(search.toLowerCase()));
  if (sortBy === 'newest') d.sort((a,b) => b.added - a.added);
  else if (sortBy === 'oldest') d.sort((a,b) => a.added - b.added);
  else if (sortBy === 'rating') d.sort((a,b) => b.rating - a.rating);
  else if (sortBy === 'az')     d.sort((a,b) => a.title.localeCompare(b.title));
  else if (sortBy === 'year')   d.sort((a,b) => b.year - a.year);
  return d;
}
 
function render() {
  const data = filterSort();
  document.getElementById('statTotal').textContent   = db.length;
  document.getElementById('statMovies').textContent  = db.filter(x => x.type === 'movie').length;
  document.getElementById('statSeries').textContent  = db.filter(x => x.type === 'series' || x.type === 'anime').length;
  document.getElementById('statWatched').textContent = db.filter(x => x.status === 'watched').length;
 
  loadingEl.style.display = 'none';
  if (!data.length) { grid.innerHTML = ''; emptyState.style.display = 'block'; return; }
  emptyState.style.display = 'none';
 
  grid.innerHTML = data.map((m, i) => `
    <div class="card" data-id="${m._id}" style="animation-delay:${i*40}ms">
      <div class="card-poster">
        <div class="poster-bg" style="background:${posterGrad(m.type)}"></div>
        <div class="poster-overlay"></div>
        <div class="card-emoji">${m.emoji || '🎬'}</div>
        <span class="badge ${statusMap[m.status].cls}">${statusMap[m.status].label}</span>
        <span class="type-badge">${typeLabel[m.type] || m.type}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${m.title}</div>
        <div class="card-meta">
          ${m.year  ? `<span class="card-year">${m.year}</span>` : ''}
          ${m.genre ? `<span class="card-genre">${m.genre.split(',')[0].trim()}</span>` : ''}
        </div>
        ${m.rating ? `<div class="stars">${starsHTML(m.rating)}</div>` : ''}
        ${m.note   ? `<div class="card-note">${m.note}</div>` : ''}
      </div>
    </div>
  `).join('');
 
  grid.querySelectorAll('.card').forEach(c => c.addEventListener('click', () => openDetail(c.dataset.id)));
}
 
/* ══════════════════════
   FILTERS & SEARCH
   ══════════════════════ */
document.getElementById('statusFilter').addEventListener('click', e => {
  const btn = e.target.closest('button'); if (!btn) return;
  document.querySelectorAll('#statusFilter button').forEach(b => b.classList.remove('active'));
  // Sync mobile drawer
  document.querySelectorAll('#mobileStatusFilter button').forEach(b => {
    b.classList.toggle('active', b.dataset.status === btn.dataset.status);
  });
  btn.classList.add('active'); statusF = btn.dataset.status; render();
});
document.getElementById('typeFilter').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn'); if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active'); typeF = btn.dataset.type; render();
});
document.getElementById('searchInput').addEventListener('input', e => { search = e.target.value; render(); });
document.getElementById('sortSelect').addEventListener('change', e => { sortBy = e.target.value; render(); });
 
/* ══════════════════════
   ADD / EDIT MODAL
   ══════════════════════ */
const addModal = document.getElementById('addModal');
 
document.getElementById('fabBtn').addEventListener('click', () => {
  editMode = false; editId = null;
  document.getElementById('modalTitle').textContent  = 'ADD TITLE';
  document.getElementById('saveAdd').textContent     = 'Save ♡';
  resetForm(); addModal.classList.add('open');
});
document.getElementById('cancelAdd').addEventListener('click', () => {
  addModal.classList.remove('open');
  if (editMode && editId) setTimeout(() => openDetail(editId), 200);
});
addModal.addEventListener('click', e => {
  if (e.target === addModal) {
    addModal.classList.remove('open');
    if (editMode && editId) setTimeout(() => openDetail(editId), 200);
  }
});
 
const starPicker = document.getElementById('starPicker');
starPicker.querySelectorAll('span').forEach(s => {
  s.addEventListener('click', () => { ratingVal = +s.dataset.v; updateStars(); });
  s.addEventListener('mouseenter', () => { starPicker.querySelectorAll('span').forEach((x,i) => x.classList.toggle('lit', i < +s.dataset.v)); });
  s.addEventListener('mouseleave', updateStars);
});
function updateStars() { starPicker.querySelectorAll('span').forEach((x,i) => x.classList.toggle('lit', i < ratingVal)); }
function resetForm() {
  ['f-title','f-year','f-genre','f-emoji','f-note'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('f-type').value   = 'movie';
  document.getElementById('f-status').value = 'watched';
  ratingVal = 0; updateStars();
}
function fillForm(m) {
  document.getElementById('f-title').value  = m.title  || '';
  document.getElementById('f-year').value   = m.year   || '';
  document.getElementById('f-genre').value  = m.genre  || '';
  document.getElementById('f-emoji').value  = m.emoji  || '';
  document.getElementById('f-note').value   = m.note   || '';
  document.getElementById('f-type').value   = m.type   || 'movie';
  document.getElementById('f-status').value = m.status || 'watched';
  ratingVal = m.rating || 0; updateStars();
}
 
document.getElementById('saveAdd').addEventListener('click', async () => {
  const title = document.getElementById('f-title').value.trim();
  if (!title) return;
 
  if (editMode && editId) {
    /* ── UPDATE ── */
    const updates = {
      title,
      type:   document.getElementById('f-type').value,
      year:   +document.getElementById('f-year').value || null,
      genre:  document.getElementById('f-genre').value.trim(),
      status: document.getElementById('f-status').value,
      rating: ratingVal,
      emoji:  document.getElementById('f-emoji').value.trim() || '🎬',
      note:   document.getElementById('f-note').value.trim(),
    };
    showToast('Updating…');
    await dbUpdate(editId, updates);
    addModal.classList.remove('open');
    editMode = false;
    render();
    showToast('✅ Updated!');
    setTimeout(() => {
      const updated = document.querySelector(`.card[data-id="${editId}"]`);
      if (updated) { updated.style.boxShadow = '0 0 0 2px var(--primary), 0 16px 40px var(--glow)'; setTimeout(() => updated.style.boxShadow = '', 1200); }
    }, 100);
  } else {
    /* ── INSERT ── */
    const item = {
      _id:    String(Date.now()),
      title,
      type:   document.getElementById('f-type').value,
      year:   +document.getElementById('f-year').value || null,
      genre:  document.getElementById('f-genre').value.trim(),
      status: document.getElementById('f-status').value,
      rating: ratingVal,
      emoji:  document.getElementById('f-emoji').value.trim() || '🎬',
      note:   document.getElementById('f-note').value.trim(),
      added:  Date.now(),
    };
    showToast('Saving…');
    await dbInsert(item);
    addModal.classList.remove('open');
    render();
    showToast('✅ Added!');
  }
});
 
/* ══════════════════════
   DETAIL MODAL
   ══════════════════════ */
const detailModal = document.getElementById('detailModal');
 
function openDetail(id) {
  const m = db.find(x => x._id === id); if (!m) return;
  detailId = id;
  document.getElementById('dBg').textContent    = m.emoji || '🎬';
  document.getElementById('dTitle').textContent = m.title;
  document.getElementById('dMeta').innerHTML = `
    ${m.year  ? `<span class="card-year">${m.year}</span>` : ''}
    ${m.genre ? `<span class="card-genre">${m.genre}</span>` : ''}
    <span class="badge ${statusMap[m.status].cls}">${statusMap[m.status].label}</span>
    ${m.rating ? `<div class="stars">${starsHTML(m.rating)}</div>` : ''}
  `;
  document.getElementById('dNote').textContent = m.note || 'No notes added yet.';
  detailModal.classList.add('open');
}
document.getElementById('closeDetail').addEventListener('click', () => detailModal.classList.remove('open'));
detailModal.addEventListener('click', e => { if (e.target === detailModal) detailModal.classList.remove('open'); });
 
/* ── DELETE button → password modal ── */
document.getElementById('deleteBtn').addEventListener('click', () => {
  pwdAction = 'delete';
  document.getElementById('pwdIcon').textContent = '🗑️';
  document.getElementById('pwdTitle').textContent = 'CONFIRM DELETE';
  document.getElementById('pwdSub').textContent  = 'Enter your secret password to delete this title.';
  document.getElementById('confirmPwd').textContent = 'Delete ♡';
  detailModal.classList.remove('open');
  setTimeout(openPwdModal, 200);
});
 
/* ── EDIT button → password modal ── */
document.getElementById('editBtn').addEventListener('click', () => {
  pwdAction = 'edit';
  document.getElementById('pwdIcon').textContent = '✏️';
  document.getElementById('pwdTitle').textContent = 'VERIFY TO EDIT';
  document.getElementById('pwdSub').textContent  = 'Enter your secret password to edit this title.';
  document.getElementById('confirmPwd').textContent = 'Unlock Edit ♡';
  detailModal.classList.remove('open');
  setTimeout(openPwdModal, 200);
});
 
/* ══════════════════════
   PASSWORD MODAL
   ══════════════════════ */
const pwdModal  = document.getElementById('pwdModal');
const pwdInput  = document.getElementById('pwdInput');
const pwdError  = document.getElementById('pwdError');
const pwdEye    = document.getElementById('pwdEye');
const pwdDots   = document.getElementById('pwdDots').querySelectorAll('.pwd-dot');
 
function openPwdModal() {
  pwdInput.value = ''; pwdInput.type = 'password'; pwdEye.textContent = '👁️';
  pwdError.classList.remove('show');
  pwdInput.classList.remove('shake','wrong');
  pwdDots.forEach(d => d.classList.remove('filled','wrong'));
  pwdModal.classList.add('open');
  setTimeout(() => pwdInput.focus(), 350);
}
function closePwdModal() { pwdModal.classList.remove('open'); }
 
pwdInput.addEventListener('input', () => {
  const len = pwdInput.value.length;
  pwdDots.forEach((d,i) => { d.classList.toggle('filled', i < len); d.classList.remove('wrong'); });
  pwdError.classList.remove('show');
  pwdInput.classList.remove('shake','wrong');
});
 
pwdEye.addEventListener('click', () => {
  const hidden = pwdInput.type === 'password';
  pwdInput.type = hidden ? 'text' : 'password';
  pwdEye.textContent = hidden ? '🙈' : '👁️';
});
 
function wrongPassword() {
  pwdInput.classList.remove('shake','wrong');
  void pwdInput.offsetWidth;
  pwdInput.classList.add('shake','wrong');
  pwdDots.forEach(d => { d.classList.remove('filled'); d.classList.add('wrong'); });
  pwdError.classList.remove('show');
  void pwdError.offsetWidth;
  const msgs = [
    'Wrong password! Access denied. 🚫',
    "Nope! That's not it. Try again.",
    'Incorrect! This vault is protected. 🔒',
    'Wrong! Only Ritik knows this. 👀',
  ];
  document.getElementById('pwdErrorMsg').textContent = msgs[~~(Math.random() * msgs.length)];
  pwdError.classList.add('show');
  pwdInput.value = '';
  setTimeout(() => { pwdDots.forEach(d => d.classList.remove('wrong')); }, 600);
  setTimeout(() => pwdInput.focus(), 100);
}
 
async function attemptConfirm() {
  if (pwdInput.value !== CORRECT_PWD) { wrongPassword(); return; }
  closePwdModal();
 
  if (pwdAction === 'delete') {
    /* ── Confirmed delete ── */
    showToast('Deleting…');
    await dbDelete(detailId);
    render();
    showToast('🗑 Deleted');
 
  } else if (pwdAction === 'edit') {
    /* ── Confirmed edit → open edit form ── */
    const m = db.find(x => x._id === detailId); if (!m) return;
    editMode = true; editId = detailId;
    document.getElementById('modalTitle').textContent = 'EDIT TITLE';
    document.getElementById('saveAdd').textContent    = 'Update ♡';
    fillForm(m);
    setTimeout(() => addModal.classList.add('open'), 200);
  }
}
 
document.getElementById('confirmPwd').addEventListener('click', attemptConfirm);
pwdInput.addEventListener('keydown', e => { if (e.key === 'Enter') attemptConfirm(); });
 
document.getElementById('cancelPwd').addEventListener('click', () => {
  closePwdModal();
  setTimeout(() => { if (detailId) openDetail(detailId); }, 250);
});
pwdModal.addEventListener('click', e => { if (e.target === pwdModal) { closePwdModal(); setTimeout(() => { if(detailId) openDetail(detailId); }, 250); } });
 
/* ══════════════════════
   TOAST
   ══════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}
 
/* ══════════════════════
   INIT
   ══════════════════════ */
async function init() {
  loadingEl.style.display = 'flex';
  grid.innerHTML = '';
  emptyState.style.display = 'none';
  db = await dbFetchAll();
  if (!db.length && !USE_ATLAS) { db = DEFAULT_DATA; localSave(); }
  render();
}
 
init();