/* ═══════════════════════════════════════════════════════════
   DevDrop — scripts.js
   CRUD completo: Create, Read, Update, Delete
   + Comments, Messaging, Search, Filter, Sort, Like, Download
   ═══════════════════════════════════════════════════════════ */

// ── State ────────────────────────────────────────────────
let DB = {
  files: JSON.parse(localStorage.getItem('dd_files') || 'null') || structuredClone(SEED_FILES),
  conversations: JSON.parse(localStorage.getItem('dd_convs') || 'null') || structuredClone(SEED_CONVERSATIONS),
  comments: JSON.parse(localStorage.getItem('dd_comments') || 'null') || structuredClone(SEED_COMMENTS),
  likedIds: JSON.parse(localStorage.getItem('dd_likes') || '[]'),
  profile: JSON.parse(localStorage.getItem('dd_profile') || 'null') || { username: 'DevUser_42', email: 'dev@example.com', bio: '', web: '' }
};

let currentFileId = null;
let currentConvId = null;
let activeFilter   = 'all';
let currentSort    = 'newest';
let viewMode       = 'grid';
let searchQuery    = '';
let visibleCount   = 9;
let pendingDeleteId = null;

function save() {
  localStorage.setItem('dd_files',    JSON.stringify(DB.files));
  localStorage.setItem('dd_convs',    JSON.stringify(DB.conversations));
  localStorage.setItem('dd_comments', JSON.stringify(DB.comments));
  localStorage.setItem('dd_likes',    JSON.stringify(DB.likedIds));
  localStorage.setItem('dd_profile',  JSON.stringify(DB.profile));
}

// ── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initSearch();
  initFilters();
  initSort();
  initViewToggle();
  initDropZone();
  initTrendingTags();
  initConversations();
  updateStats();
  updateProfile();
  renderCards();
  animateNumbers();
});

// ── Nav links ────────────────────────────────────────────
function initNav() {
  document.querySelectorAll('.nav-link[data-section]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const sec = link.dataset.section;
      if (sec === 'mensajes') {
        new bootstrap.Modal(document.getElementById('messagesModal')).show();
      } else if (sec === 'mis-archivos') {
        setFilter('myfiles');
      } else {
        clearFilters();
      }
    });
  });
}

// ── Trending tags ────────────────────────────────────────
function initTrendingTags() {
  const wrap = document.getElementById('trendingTags');
  TRENDING_TAGS.forEach(tag => {
    const btn = document.createElement('span');
    btn.className = 'trend-tag';
    btn.textContent = tag;
    btn.onclick = () => {
      searchQuery = tag.slice(1);
      document.getElementById('globalSearch').value = searchQuery;
      renderCards();
    };
    wrap.appendChild(btn);
  });
}

// ── Search ───────────────────────────────────────────────
function initSearch() {
  const input = document.getElementById('globalSearch');
  input.addEventListener('input', debounce(e => {
    searchQuery = e.target.value.trim().toLowerCase();
    renderCards();
  }, 300));
  // Keyboard shortcut ⌘K / Ctrl+K
  document.addEventListener('keydown', e => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault(); input.focus();
    }
  });
}

// ── Filters ──────────────────────────────────────────────
const CATEGORIES = ['all','codigo','apk','documento','imagen','video','audio','otro'];
const CAT_LABELS  = { all:'Todos', codigo:'Código', apk:'APK', documento:'Docs', imagen:'Imágenes', video:'Video', audio:'Audio', otro:'Otros' };

function initFilters() {
  const wrap = document.getElementById('filterChips');
  CATEGORIES.forEach(cat => {
    const chip = document.createElement('span');
    chip.className = 'chip' + (cat === 'all' ? ' active' : '');
    chip.textContent = CAT_LABELS[cat];
    chip.dataset.cat = cat;
    chip.onclick = () => setFilter(cat);
    wrap.appendChild(chip);
  });
}

function setFilter(cat) {
  activeFilter = cat;
  document.querySelectorAll('.chip').forEach(c => c.classList.toggle('active', c.dataset.cat === cat));
  visibleCount = 9;
  renderCards();
}

function clearFilters() {
  searchQuery = '';
  document.getElementById('globalSearch').value = '';
  setFilter('all');
}

// ── Sort ─────────────────────────────────────────────────
function initSort() {
  document.getElementById('sortSelect').addEventListener('change', e => {
    currentSort = e.target.value; renderCards();
  });
}

// ── View toggle ──────────────────────────────────────────
function initViewToggle() {
  document.getElementById('viewGrid').addEventListener('click', () => { viewMode = 'grid'; toggleView(); });
  document.getElementById('viewList').addEventListener('click', () => { viewMode = 'list'; toggleView(); });
}
function toggleView() {
  const grid = document.getElementById('fileGrid');
  grid.classList.toggle('list-view', viewMode === 'list');
  document.getElementById('viewGrid').classList.toggle('active', viewMode === 'grid');
  document.getElementById('viewList').classList.toggle('active', viewMode === 'list');
  renderCards();
}

// ── Render cards ─────────────────────────────────────────
function getFiltered() {
  let files = [...DB.files];

  if (activeFilter === 'myfiles') {
    files = files.filter(f => f.author === DB.profile.username);
  } else if (activeFilter !== 'all') {
    files = files.filter(f => f.cat === activeFilter);
  }

  if (searchQuery) {
    files = files.filter(f =>
      f.title.toLowerCase().includes(searchQuery) ||
      (f.desc || '').toLowerCase().includes(searchQuery) ||
      (f.tags || []).some(t => t.toLowerCase().includes(searchQuery)) ||
      f.ext.toLowerCase().includes(searchQuery)
    );
  }

  files.sort((a, b) => {
    if (currentSort === 'popular')   return b.likes - a.likes;
    if (currentSort === 'downloads') return b.downloads - a.downloads;
    if (currentSort === 'comments')  return (DB.comments[b.id]||[]).length - (DB.comments[a.id]||[]).length;
    return b.id - a.id; // newest
  });

  return files;
}

function renderCards() {
  const grid = document.getElementById('fileGrid');
  const empty = document.getElementById('emptyState');
  const lmWrap = document.getElementById('loadMoreWrap');
  const files = getFiltered();

  grid.innerHTML = '';

  if (files.length === 0) {
    empty.classList.remove('d-none');
    lmWrap.style.display = 'none';
    return;
  }
  empty.classList.add('d-none');

  const slice = files.slice(0, visibleCount);
  slice.forEach((f, i) => {
    const col = document.createElement('div');
    col.className = viewMode === 'grid' ? 'col-sm-6 col-lg-4' : 'col-12';
    col.style.animationDelay = `${i * 40}ms`;
    col.innerHTML = buildCard(f);
    col.querySelector('.file-card').addEventListener('click', () => openFile(f.id));
    grid.appendChild(col);
  });

  lmWrap.style.display = files.length > visibleCount ? 'block' : 'none';
  updateStats();
}

function loadMore() {
  visibleCount += 6;
  renderCards();
}

// ── Build card HTML ──────────────────────────────────────
function buildCard(f) {
  const icon    = extIcon(f.ext, f.cat);
  const bgClass = catBgClass(f.cat);
  const cmtCount = (DB.comments[f.id] || []).length;
  const isLiked = DB.likedIds.includes(f.id);
  const tagsHtml = (f.tags || []).slice(0,3).map(t => `<span class="card-tag">${t}</span>`).join('');

  return `
  <div class="file-card h-100">
    <div class="card-header-strip"></div>
    <div class="card-body-inner">
      <div class="card-icon-row">
        <div class="card-file-icon ${bgClass}">${icon}</div>
        <div>
          <div class="card-title">${esc(f.title)}</div>
          <div class="card-ext">.${f.ext} · ${f.size}</div>
        </div>
      </div>
      ${viewMode === 'grid' ? `<div class="card-desc">${esc(f.desc || '')}</div>` : ''}
      ${viewMode === 'grid' ? `<div class="card-tags">${tagsHtml}</div>` : ''}
      <div class="card-footer-row">
        <div class="card-author">
          <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${f.authorSeed}" alt="${f.author}"/>
          <span>${esc(f.author)}</span>
        </div>
        <div class="card-stats">
          <span class="card-stat ${isLiked ? 'text-danger' : ''}"><i class="bi bi-heart${isLiked ? '-fill' : ''}"></i> ${f.likes}</span>
          <span class="card-stat"><i class="bi bi-download"></i> ${f.downloads}</span>
          <span class="card-stat"><i class="bi bi-chat"></i> ${cmtCount}</span>
        </div>
      </div>
    </div>
  </div>`;
}

// ── Open file detail modal ───────────────────────────────
function openFile(id) {
  const f = DB.files.find(x => x.id === id);
  if (!f) return;
  currentFileId = id;
  const isLiked = DB.likedIds.includes(id);

  document.getElementById('fmIcon').className  = `fp-icon sm ${catBgClass(f.cat)}`;
  document.getElementById('fmIcon').innerHTML  = extIcon(f.ext, f.cat);
  document.getElementById('fmTitle').textContent = f.title;
  document.getElementById('fmMeta').textContent  = `.${f.ext} · ${f.size} · por ${f.author} · ${f.dateRel}`;
  document.getElementById('fmDesc').textContent  = f.desc || '';
  document.getElementById('fmLikes').textContent     = f.likes;
  document.getElementById('fmDownloads').textContent = f.downloads;
  document.getElementById('fmCommentCount').textContent = (DB.comments[id] || []).length;

  const likeBtn = document.getElementById('fmLikeBtn');
  likeBtn.className = 'action-btn' + (isLiked ? ' liked' : '');
  likeBtn.querySelector('i').className = 'bi bi-heart' + (isLiked ? '-fill' : '');

  // Tags
  const tagsWrap = document.getElementById('fmTags');
  tagsWrap.innerHTML = (f.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join('');

  // Preview
  const prev = document.getElementById('fmPreview');
  if (f.content) {
    prev.innerHTML = `<pre>${esc(f.content)}</pre>`;
  } else {
    prev.innerHTML = `<div class="text-center"><div class="preview-icon">${extIcon(f.ext, f.cat)}</div><div class="text-muted small mt-2">.${f.ext} — Vista previa no disponible</div></div>`;
  }

  // Owner actions
  document.getElementById('fmOwnerActions').style.display = f.author === DB.profile.username ? 'flex' : 'none';

  renderComments(id);
  new bootstrap.Modal(document.getElementById('fileModal')).show();
}

// ── Like ─────────────────────────────────────────────────
function toggleLike() {
  if (!currentFileId) return;
  const f = DB.files.find(x => x.id === currentFileId);
  const idx = DB.likedIds.indexOf(currentFileId);
  if (idx === -1) {
    DB.likedIds.push(currentFileId);
    f.likes++;
    toast('❤️ Le diste like!', 'success');
  } else {
    DB.likedIds.splice(idx, 1);
    f.likes = Math.max(0, f.likes - 1);
  }
  save();
  document.getElementById('fmLikes').textContent = f.likes;
  const likeBtn = document.getElementById('fmLikeBtn');
  const isLiked = DB.likedIds.includes(currentFileId);
  likeBtn.className = 'action-btn' + (isLiked ? ' liked' : '');
  likeBtn.querySelector('i').className = 'bi bi-heart' + (isLiked ? '-fill' : '');
  renderCards();
}

// ── Download ─────────────────────────────────────────────
function handleDownload() {
  if (!currentFileId) return;
  const f = DB.files.find(x => x.id === currentFileId);
  f.downloads++;
  save();
  document.getElementById('fmDownloads').textContent = f.downloads;
  toast(`⬇️ Descargando ${f.title}…`, 'success');
  renderCards();
  // Simulate download of text content if available
  if (f.content) {
    const blob = new Blob([f.content], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `${f.title.replace(/\s+/g,'_')}.${f.ext}`;
    a.click(); URL.revokeObjectURL(url);
  }
}

// ── Share ─────────────────────────────────────────────────
function shareFile() {
  if (!currentFileId) return;
  const f = DB.files.find(x => x.id === currentFileId);
  const url = `${location.href}?file=${f.id}`;
  navigator.clipboard.writeText(url).then(() => toast('🔗 Enlace copiado al portapapeles', 'success'));
}

// ── Comments ─────────────────────────────────────────────
function renderComments(fileId) {
  const list = document.getElementById('commentList');
  const comments = DB.comments[fileId] || [];
  document.getElementById('fmCommentCount').textContent = comments.length;

  if (comments.length === 0) {
    list.innerHTML = '<p class="text-muted text-center small mt-3">Sé el primero en comentar 👋</p>';
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="comment-item" id="cmt-${c.id}">
      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${c.seed}" class="comment-avatar" alt="${c.user}"/>
      <div class="comment-body">
        <span class="comment-user">${esc(c.user)}</span>
        <span class="comment-time">${c.time}</span>
        ${c.isAuthor ? '<span class="badge bg-warning text-dark ms-1" style="font-size:.6rem">Autor</span>' : ''}
        <div class="comment-text">${esc(c.text)}</div>
        <div class="comment-actions">
          <button class="comment-action" onclick="likeComment(${fileId},${c.id})">
            <i class="bi bi-heart"></i> ${c.likes}
          </button>
          <button class="comment-action" onclick="replyComment('${esc(c.user)}')">
            <i class="bi bi-reply"></i> Responder
          </button>
          ${c.user === DB.profile.username ? `<button class="comment-action text-danger" onclick="deleteComment(${fileId},${c.id})"><i class="bi bi-trash"></i> Eliminar</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');

  list.scrollTop = list.scrollHeight;
}

function addComment() {
  const input = document.getElementById('newComment');
  const text  = input.value.trim();
  if (!text) { toast('Escribe algo primero 😅', 'warning'); return; }

  if (!DB.comments[currentFileId]) DB.comments[currentFileId] = [];
  const newCmt = {
    id: Date.now(), user: DB.profile.username,
    seed: 'devdrop', text,
    time: 'ahora mismo', likes: 0,
    isAuthor: DB.files.find(f => f.id === currentFileId)?.author === DB.profile.username
  };
  DB.comments[currentFileId].push(newCmt);
  save();
  input.value = '';
  renderComments(currentFileId);
  toast('💬 Comentario publicado', 'success');
}

function likeComment(fileId, cid) {
  const cmt = (DB.comments[fileId] || []).find(c => c.id === cid);
  if (cmt) { cmt.likes++; save(); renderComments(fileId); }
}

function replyComment(user) {
  const ta = document.getElementById('newComment');
  ta.value = `@${user} `;
  ta.focus();
}

function deleteComment(fileId, cid) {
  DB.comments[fileId] = (DB.comments[fileId] || []).filter(c => c.id !== cid);
  save(); renderComments(fileId);
  toast('🗑️ Comentario eliminado', 'success');
}

// ── Edit file ────────────────────────────────────────────
function openEditModal() {
  const f = DB.files.find(x => x.id === currentFileId);
  if (!f) return;
  document.getElementById('editTitle').value = f.title;
  document.getElementById('editDesc').value  = f.desc || '';
  document.getElementById('editCat').value   = f.cat;
  document.getElementById('editVis').value   = f.vis;
  document.getElementById('editTags').value  = (f.tags || []).join(', ');
  bootstrap.Modal.getInstance(document.getElementById('fileModal'))?.hide();
  new bootstrap.Modal(document.getElementById('editModal')).show();
}

function saveEdit() {
  const f = DB.files.find(x => x.id === currentFileId);
  if (!f) return;
  f.title = document.getElementById('editTitle').value.trim() || f.title;
  f.desc  = document.getElementById('editDesc').value.trim();
  f.cat   = document.getElementById('editCat').value;
  f.vis   = document.getElementById('editVis').value;
  f.tags  = document.getElementById('editTags').value.split(',').map(t => t.trim()).filter(Boolean);
  save(); renderCards();
  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
  toast('✅ Archivo actualizado', 'success');
}

// ── Delete file ──────────────────────────────────────────
function deleteFile() {
  pendingDeleteId = currentFileId;
  bootstrap.Modal.getInstance(document.getElementById('fileModal'))?.hide();
  new bootstrap.Modal(document.getElementById('confirmModal')).show();
  document.getElementById('confirmDeleteBtn').onclick = confirmDelete;
}

function confirmDelete() {
  DB.files = DB.files.filter(f => f.id !== pendingDeleteId);
  delete DB.comments[pendingDeleteId];
  DB.likedIds = DB.likedIds.filter(id => id !== pendingDeleteId);
  save(); renderCards(); updateStats();
  bootstrap.Modal.getInstance(document.getElementById('confirmModal'))?.hide();
  toast('🗑️ Archivo eliminado', 'success');
  pendingDeleteId = null;
}

// ── Upload ───────────────────────────────────────────────
function initDropZone() {
  const zone  = document.getElementById('dropZone');
  const input = document.getElementById('fileInput');

  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
  zone.addEventListener('drop', e => {
    e.preventDefault(); zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) previewFile(file);
  });
  zone.addEventListener('click', e => { if (e.target === zone || zone.contains(e.target)) input.click(); });
  input.addEventListener('change', () => { if (input.files[0]) previewFile(input.files[0]); });
}

let selectedFile = null;

function previewFile(file) {
  selectedFile = file;
  const ext    = file.name.split('.').pop().toLowerCase();
  const cat    = guessCat(ext);
  document.getElementById('dropZone').classList.add('d-none');
  const prev   = document.getElementById('filePreview');
  prev.classList.remove('d-none');
  const iconEl = document.getElementById('fpIcon');
  iconEl.className = `fp-icon ${catBgClass(cat)}`;
  iconEl.innerHTML = extIcon(ext, cat);
  document.getElementById('fpName').textContent = file.name;
  document.getElementById('fpMeta').textContent = `${formatSize(file.size)} · .${ext}`;
  if (!document.getElementById('uploadTitle').value)
    document.getElementById('uploadTitle').value = file.name.replace(/\.[^.]+$/, '');
  document.getElementById('uploadCat').value = cat;
}

function clearFileInput() {
  selectedFile = null;
  document.getElementById('fileInput').value = '';
  document.getElementById('filePreview').classList.add('d-none');
  document.getElementById('dropZone').classList.remove('d-none');
  document.getElementById('uploadTitle').value = '';
}

function handleUpload() {
  const title = document.getElementById('uploadTitle').value.trim();
  if (!title) { toast('Escribe un título 📝', 'warning'); return; }
  if (!selectedFile) { toast('Selecciona un archivo 📂', 'warning'); return; }

  const ext  = selectedFile.name.split('.').pop().toLowerCase();
  const cat  = document.getElementById('uploadCat').value;
  const desc = document.getElementById('uploadDesc').value.trim();
  const tags = document.getElementById('uploadTags').value.split(',').map(t => t.trim()).filter(Boolean);
  const vis  = document.getElementById('uploadVis').value;

  // Simulate progress
  const progressWrap = document.getElementById('uploadProgress');
  const fill = document.getElementById('progressFill');
  const pct  = document.getElementById('progressPct');
  progressWrap.classList.remove('d-none');
  document.getElementById('submitUpload').disabled = true;

  let p = 0;
  const interval = setInterval(() => {
    p = Math.min(p + Math.random() * 18, 100);
    fill.style.width = p + '%';
    pct.textContent  = Math.round(p) + '%';
    if (p >= 100) {
      clearInterval(interval);
      finishUpload({ title, ext, cat, desc, tags, vis, size: formatSize(selectedFile.size) });
    }
  }, 80);
}

function finishUpload({ title, ext, cat, desc, tags, vis, size }) {
  const newFile = {
    id: Date.now(),
    title, ext, cat, desc, tags, vis, size,
    author: DB.profile.username, authorSeed: 'devdrop',
    likes: 0, downloads: 0,
    date: new Date().toISOString().slice(0,10),
    dateRel: 'ahora mismo',
    content: null
  };
  DB.files.unshift(newFile);
  save(); renderCards(); updateStats();

  bootstrap.Modal.getInstance(document.getElementById('uploadModal'))?.hide();
  toast(`🚀 "${title}" publicado exitosamente!`, 'success');

  // Reset form
  clearFileInput();
  document.getElementById('uploadDesc').value = '';
  document.getElementById('uploadTags').value = '';
  document.getElementById('uploadProgress').classList.add('d-none');
  document.getElementById('progressFill').style.width = '0%';
  document.getElementById('progressPct').textContent = '0%';
  document.getElementById('submitUpload').disabled = false;
}

// ── Messages ─────────────────────────────────────────────
function initConversations() {
  renderConvList();
}

function renderConvList(filter = '') {
  const wrap = document.getElementById('convList');
  const convs = DB.conversations.filter(c =>
    !filter || c.user.toLowerCase().includes(filter.toLowerCase())
  );
  wrap.innerHTML = convs.map(c => {
    const last = c.messages[c.messages.length - 1];
    return `
    <div class="conv-item ${currentConvId === c.id ? 'active' : ''}" onclick="openConv(${c.id})">
      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${c.seed}" class="conv-avatar" alt="${c.user}"/>
      <div class="conv-info">
        <div class="conv-name">${esc(c.user)}</div>
        <div class="conv-preview">${esc(last.text)}</div>
      </div>
      ${c.unread ? '<span class="conv-unread"></span>' : ''}
    </div>`;
  }).join('');
}

function filterConvs(q) { renderConvList(q); }

function openConv(id) {
  currentConvId = id;
  const conv = DB.conversations.find(c => c.id === id);
  if (!conv) return;
  conv.unread = false;
  save();

  document.getElementById('chatHeader').innerHTML = `
    <div class="d-flex align-items-center gap-2">
      <img src="https://api.dicebear.com/7.x/bottts/svg?seed=${conv.seed}" class="msg-avatar" alt="${conv.user}"/>
      <div>
        <div class="fw-bold" style="font-size:.9rem">${esc(conv.user)}</div>
        <div class="text-muted" style="font-size:.72rem;font-family:var(--font-mono)">En línea</div>
      </div>
    </div>`;

  renderMessages(conv);
  renderConvList();

  // Update badge
  const unreadCount = DB.conversations.filter(c => c.unread).length;
  const badge = document.getElementById('msgBadge');
  badge.textContent = unreadCount;
  badge.style.display = unreadCount ? 'inline-flex' : 'none';
}

function renderMessages(conv) {
  const wrap = document.getElementById('chatMessages');
  wrap.innerHTML = conv.messages.map(m => `
    <div class="msg-row ${m.from === 'me' ? 'mine' : ''}">
      ${m.from !== 'me' ? `<img src="https://api.dicebear.com/7.x/bottts/svg?seed=${conv.seed}" class="msg-avatar" alt=""/>` : ''}
      <div>
        <div class="msg-bubble">${esc(m.text)}</div>
        <div class="msg-time">${m.time}</div>
      </div>
    </div>
  `).join('');
  wrap.scrollTop = wrap.scrollHeight;
}

function sendMessage() {
  const input1 = document.getElementById('msgInput');
  const input2 = document.getElementById('msgInputBottom');
  const text   = (input1.value || input2.value).trim();
  if (!text || !currentConvId) return;

  const conv = DB.conversations.find(c => c.id === currentConvId);
  if (!conv) return;

  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  conv.messages.push({ from: 'me', text, time });
  input1.value = ''; input2.value = '';
  save(); renderMessages(conv); renderConvList();

  // Simulate reply after delay
  setTimeout(() => {
    const replies = [
      "Perfecto, gracias! 👍",
      "Entendido, lo reviso.",
      "Ok, dame un momento.",
      "Claro, ya lo veo.",
      "🔥 Genial!",
      "Sí, lo tengo. Un momento..."
    ];
    conv.messages.push({
      from: 'them',
      text: replies[Math.floor(Math.random() * replies.length)],
      time
    });
    conv.unread = false;
    save(); renderMessages(conv);
  }, 1200 + Math.random() * 800);
}

// ── Profile ───────────────────────────────────────────────
function updateProfile() {
  document.getElementById('profileUsername').value = DB.profile.username;
  document.getElementById('profileEmail').value    = DB.profile.email;
  document.getElementById('profileBio').value      = DB.profile.bio || '';
  document.getElementById('profileWeb').value      = DB.profile.web || '';
  const myFiles = DB.files.filter(f => f.author === DB.profile.username).length;
  const myLikes = DB.likedIds.length;
  const myDls   = DB.files.filter(f => f.author === DB.profile.username).reduce((a,f) => a + f.downloads, 0);
  document.getElementById('myFiles').textContent     = myFiles;
  document.getElementById('myLikes').textContent     = myLikes;
  document.getElementById('myDownloads').textContent = myDls;
}

function saveProfile() {
  const newName = document.getElementById('profileUsername').value.trim();
  DB.profile.username = newName || DB.profile.username;
  DB.profile.email    = document.getElementById('profileEmail').value.trim();
  DB.profile.bio      = document.getElementById('profileBio').value.trim();
  DB.profile.web      = document.getElementById('profileWeb').value.trim();
  save(); updateProfile();
  bootstrap.Modal.getInstance(document.getElementById('profileModal'))?.hide();
  toast('✅ Perfil actualizado', 'success');
}

function changeAvatar() {
  const seeds = ['devdrop','cyber','robot','alien','bot','matrix','neo'];
  const newSeed = seeds[Math.floor(Math.random() * seeds.length)];
  document.querySelector('.profile-avatar').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${newSeed}`;
  toast('🎨 Avatar actualizado!', 'success');
}

// ── Stats ─────────────────────────────────────────────────
function updateStats() {
  document.getElementById('statFiles').textContent     = DB.files.length;
  document.getElementById('statDownloads').textContent = DB.files.reduce((a,f) => a + f.downloads, 0).toLocaleString();
  document.getElementById('statUsers').textContent     = new Set(DB.files.map(f => f.author)).size;
  document.getElementById('statComments').textContent  = Object.values(DB.comments).reduce((a,arr) => a + arr.length, 0);
}

function animateNumbers() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.textContent.replace(/,/g,'')) || 0;
    let cur = 0; const step = Math.ceil(target / 40);
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur.toLocaleString();
      if (cur >= target) clearInterval(t);
    }, 30);
  });
}

// ── Toast notifications ───────────────────────────────────
function toast(msg, type = 'info') {
  const stack = document.getElementById('toastStack');
  const el = document.createElement('div');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  el.className = `toast-item ${type}`;
  el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(20px)'; el.style.transition = 'all .3s'; setTimeout(() => el.remove(), 300); }, 3500);
}

// ── Helpers ───────────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024*1024) return (bytes/1024).toFixed(1) + ' KB';
  return (bytes/(1024*1024)).toFixed(1) + ' MB';
}

function guessCat(ext) {
  const map = {
    py:'codigo', js:'codigo', ts:'codigo', jsx:'codigo', tsx:'codigo',
    html:'codigo', css:'codigo', sh:'codigo', yml:'codigo', yaml:'codigo',
    json:'codigo', xml:'codigo', php:'codigo', java:'codigo', kt:'codigo',
    dart:'codigo', cpp:'codigo', c:'codigo', go:'codigo', rs:'codigo',
    apk:'apk', xapk:'apk',
    pdf:'documento', doc:'documento', docx:'documento', txt:'documento',
    md:'documento', xlsx:'documento', ppt:'documento',
    png:'imagen', jpg:'imagen', jpeg:'imagen', gif:'imagen', svg:'imagen', webp:'imagen',
    mp4:'video', mkv:'video', avi:'video', mov:'video',
    mp3:'audio', wav:'audio', flac:'audio', ogg:'audio',
  };
  return map[ext] || 'otro';
}

function extIcon(ext, cat) {
  const icons = {
    py:'🐍', js:'🟨', ts:'🟦', jsx:'⚛️', tsx:'⚛️',
    html:'🌐', css:'🎨', sh:'⚡', bash:'⚡',
    yml:'🐳', yaml:'🐳', json:'📋', xml:'📋',
    php:'🐘', java:'☕', kt:'🎯', dart:'🎯',
    go:'🐹', rs:'🦀', cpp:'⚙️', c:'⚙️',
    apk:'📱', xapk:'📱',
    pdf:'📄', doc:'📝', docx:'📝', txt:'📃', md:'📘',
    xlsx:'📊', csv:'📊', ppt:'📊',
    png:'🖼️', jpg:'🖼️', jpeg:'🖼️', gif:'🎞️', svg:'✏️', webp:'🖼️',
    mp4:'🎬', mkv:'🎬', avi:'🎬', mov:'🎬',
    mp3:'🎵', wav:'🎵', flac:'🎵', ogg:'🎵',
    zip:'📦', rar:'📦', tar:'📦', gz:'📦',
    ini:'⚙️', cfg:'⚙️', conf:'⚙️',
    sql:'🗄️', db:'🗄️',
  };
  return icons[ext] || (cat === 'codigo' ? '💻' : cat === 'apk' ? '📱' : '📦');
}

function catBgClass(cat) {
  const map = {
    codigo:'icon-bg-code', apk:'icon-bg-apk', documento:'icon-bg-doc',
    imagen:'icon-bg-img',  video:'icon-bg-video', audio:'icon-bg-audio'
  };
  return map[cat] || 'icon-bg-other';
}
