/* ============================================================
   PKB KALAI CONSTRUCTION — script.js
   ============================================================ */
'use strict';

/* ─── DEFAULT PROJECTS ─── */
const DEFAULT_PROJECTS = [
  {
    id: 'proj-default-1',
    name: '3BHK Luxury Villa',
    category: 'Residential',
    description: 'A stunning 3BHK luxury villa with open-plan design, premium finishes, and a landscaped garden. Delivered two weeks ahead of schedule.',
    location: 'Chennai, Tamil Nadu',
    year: '2023',
    client: 'Mr. Ramesh Kumar',
    image: null
  },
  {
    id: 'proj-default-2',
    name: 'G+4 Office Complex',
    category: 'Commercial',
    description: 'Multi-storey commercial building with basement parking, glass curtain wall facade, and full MEP installation. Completed within budget.',
    location: 'Coimbatore, Tamil Nadu',
    year: '2022',
    client: 'Suresh Enterprises',
    image: null
  },
  {
    id: 'proj-default-3',
    name: 'Contemporary Residence',
    category: 'Residential',
    description: 'Elegant contemporary home featuring floor-to-ceiling windows, open concept interiors, and premium stone cladding.',
    location: 'Salem, Tamil Nadu',
    year: '2023',
    client: 'Mr. Arjun Patel',
    image: null
  },
  {
    id: 'proj-default-4',
    name: 'Retail Showroom',
    category: 'Commercial',
    description: 'Spacious 4,000 sq.ft retail showroom with high-bay lighting, glass display facade and polished concrete floors.',
    location: 'Madurai, Tamil Nadu',
    year: '2021',
    client: 'Sri Lakshmi Textiles',
    image: null
  },
  {
    id: 'proj-default-5',
    name: 'Industrial Warehouse',
    category: 'Industrial',
    description: 'Large-span pre-engineered steel warehouse with loading docks, fire suppression, and industrial ventilation.',
    location: 'Tiruchirappalli, Tamil Nadu',
    year: '2022',
    client: 'Logistics Corp Ltd.',
    image: null
  }
];

/* ─── CONSTANTS & SECURITY HASHES ─── */
const HASHED_USER = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'; // SHA-256 of admin
const HASHED_PASS = '4bf6b146b72019624754f1c41753f9e5889ee02e67e450f8750d1126d9ee7688'; // SHA-256 of pkb@2024

/* ─── SECURITY HELPERS ─── */
async function sha256(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ─── STATE ─── */
let isAdmin       = false;
let projects      = [];
let deleteId      = null;
let activeFilter  = 'all';
let imageBase64   = null;

/* ─── STORAGE ─── */
function loadProjects() {
  try {
    const raw = localStorage.getItem('pkb_projects');
    projects = raw ? JSON.parse(raw) : [...DEFAULT_PROJECTS];
    if (!raw) saveProjects();
  } catch { projects = [...DEFAULT_PROJECTS]; }
}
function saveProjects() {
  try { localStorage.setItem('pkb_projects', JSON.stringify(projects)); } catch {}
}
function uid() { return 'proj-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6); }

/* ─── DOM ─── */
const $ = id => document.getElementById(id);
const navbar          = $('navbar');
const hamburger       = $('hamburger');
const navLinks        = $('navLinks');
const adminTrigger    = $('adminTrigger');
const adminBar        = $('adminBar');
const addProjectBtn   = $('addProjectBtn');
const adminLogout     = $('adminLogout');

const loginModal      = $('loginModal');
const closeLogin      = $('closeLogin');
const loginForm       = $('loginForm');
const loginUser       = $('loginUser');
const loginPass       = $('loginPass');
const loginError      = $('loginError');
const loginBtn        = $('loginBtn');
const pwToggle        = $('pwToggle');

const projectModal    = $('projectModal');
const closeProjectModal  = $('closeProjectModal');
const cancelProjectModal = $('cancelProjectModal');
const projectForm     = $('projectForm');
const pmTitle         = $('pmTitle');
const editProjectId   = $('editProjectId');
const pName           = $('pName');
const pCategory       = $('pCategory');
const pLocation       = $('pLocation');
const pYear           = $('pYear');
const pDesc           = $('pDesc');
const pClient         = $('pClient');
const pImage          = $('pImage');
const imgUploadArea   = $('imgUploadArea');
const imgPlaceholder  = $('imgPlaceholder');
const imgPreviewWrap  = $('imgPreviewWrap');
const imgPreview      = $('imgPreview');
const imgRemoveBtn    = $('imgRemoveBtn');
const pmError         = $('pmError');
const saveProjectBtn  = $('saveProjectBtn');

const deleteModal     = $('deleteModal');
const dmProjectName   = $('dmProjectName');
const cancelDelete    = $('cancelDelete');
const confirmDelete   = $('confirmDelete');

const viewModal       = $('viewModal');
const closeViewModal  = $('closeViewModal');
const vmImgWrap       = $('vmImgWrap');
const vmCat           = $('vmCat');
const vmTitle         = $('vmTitle');
const vmDesc          = $('vmDesc');
const vmMeta          = $('vmMeta');

const projectsGrid    = $('projectsGrid');
const projEmpty       = $('projEmpty');
const contactForm     = $('contactForm');
const formSuccess     = $('formSuccess');

/* ════════════════════════════════════════
   MODAL HELPERS
════════════════════════════════════════ */
function openModal(el)  { el.classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(el) { el.classList.remove('open'); document.body.style.overflow = ''; }

[loginModal, projectModal, deleteModal, viewModal].forEach(m =>
  m.addEventListener('click', e => { if (e.target === m) closeModal(m); })
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    [loginModal, projectModal, deleteModal, viewModal].forEach(closeModal);
});

/* ════════════════════════════════════════
   NAVBAR
════════════════════════════════════════ */
function updateNav() {
  const scrolled = window.scrollY > 20;
  navbar.classList.toggle('solid', scrolled);
  // Active link
  const sections = document.querySelectorAll('section[id]');
  const sy = window.scrollY + 100;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (link) link.classList.toggle('active', sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight);
  });
}
window.addEventListener('scroll', updateNav, { passive: true });

const navOverlay = document.getElementById('navOverlay');

function openNav() {
  navLinks.classList.add('open');
  hamburger.classList.add('open');
  navOverlay.classList.add('show');
  navbar.classList.add('nav-open');
  document.body.style.overflow = 'hidden';
}
function closeNav() {
  navLinks.classList.remove('open');
  hamburger.classList.remove('open');
  navOverlay.classList.remove('show');
  navbar.classList.remove('nav-open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  navLinks.classList.contains('open') ? closeNav() : openNav();
});
navOverlay.addEventListener('click', closeNav);
document.querySelectorAll('.nav-link').forEach(l =>
  l.addEventListener('click', closeNav)
);

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    const offset = isAdmin ? 116 : 72;
    window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════
   HERO CINEMA SLIDESHOW & COUNTER
   ════════════════════════════════════════ */
let activeSlide = 0;
const slideCount = 3;
const slideInterval = 5000;
let slideTimer;

function setSlide(index) {
  activeSlide = index;
  // Backgrounds
  const slides = document.querySelectorAll('.hc-slide');
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
  // Panels
  const panels = document.querySelectorAll('.hc-panel');
  panels.forEach((panel, idx) => {
    panel.classList.toggle('active', idx === index);
  });
  // Dots
  const dots = document.querySelectorAll('.hc-dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === index);
  });
}

function startSlideshow() {
  stopSlideshow();
  slideTimer = setInterval(() => {
    setSlide((activeSlide + 1) % slideCount);
  }, slideInterval);
}

function stopSlideshow() {
  if (slideTimer) clearInterval(slideTimer);
}

// Bind dot clicks
document.querySelectorAll('.hc-dot').forEach(dot => {
  dot.addEventListener('click', () => {
    const idx = parseInt(dot.dataset.slide, 10);
    setSlide(idx);
    startSlideshow(); // reset timer
  });
});

// Start slide cycle
startSlideshow();

// Stats counter
function animateCount(el) {
  const target = +el.dataset.target;
  let cur = 0; 
  const step = target / 72;
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) clearInterval(t);
  }, 18);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.hcsb-num').forEach(el => {
        if (!el.dataset.done) { 
          el.dataset.done = 1; 
          animateCount(el); 
        }
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });

const statsBar = document.querySelector('.hc-stats-bar');
if (statsBar) statsObserver.observe(statsBar);

/* ════════════════════════════════════════
   SECTORS SHOWCASE TABS
   ════════════════════════════════════════ */
document.querySelectorAll('.st-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.st-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.sp-panel').forEach(p => p.classList.remove('active'));
    
    btn.classList.add('active');
    const targetSector = btn.dataset.sector;
    const targetPanel = document.getElementById(`sp${targetSector}`);
    if (targetPanel) targetPanel.classList.add('active');
  });
});

/* ════════════════════════════════════════
   SCROLL REVEALS
   ════════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { 
    if (e.isIntersecting) { 
      e.target.classList.add('in'); 
      revealObs.unobserve(e.target); 
    } 
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.svc-row, .testi-card, .ac-item, .wp-item, .cd-item, .apc-badge, .st-btn, .sp-panel, .hcsb-item').forEach((el, i) => {
  el.classList.add('reveal');
  if (i % 3 === 1) el.classList.add('reveal-d1');
  if (i % 3 === 2) el.classList.add('reveal-d2');
  revealObs.observe(el);
});

/* ════════════════════════════════════════
   ADMIN LOGIN / LOGOUT
════════════════════════════════════════ */
adminTrigger.addEventListener('click', () => {
  if (isAdmin) { logoutAdmin(); return; }
  loginUser.value = ''; loginPass.value = '';
  loginError.classList.remove('show');
  openModal(loginModal);
  setTimeout(() => loginUser.focus(), 280);
});
closeLogin.addEventListener('click', () => closeModal(loginModal));

pwToggle.addEventListener('click', () => {
  const eye = loginPass.type === 'password';
  loginPass.type = eye ? 'text' : 'password';
  pwToggle.textContent = eye ? '🙈' : '👁';
});

loginForm.addEventListener('submit', async e => {
  e.preventDefault();
  loginError.classList.remove('show');
  loginBtn.textContent = 'Signing in…';
  loginBtn.disabled = true;

  try {
    const inputUserHash = await sha256(loginUser.value.trim());
    const inputPassHash = await sha256(loginPass.value);

    // Artificial delay to prevent brute-force timing attacks and preserve transition
    await new Promise(resolve => setTimeout(resolve, 650));

    if (inputUserHash === HASHED_USER && inputPassHash === HASHED_PASS) {
      isAdmin = true;
      closeModal(loginModal);
      adminBar.classList.add('show');
      navbar.classList.add('admin-active');
      document.body.classList.add('admin-mode');
      adminTrigger.classList.add('active');
      renderProjects();
      toast('✅ Welcome back, K. Prasath!');
    } else {
      loginError.classList.add('show');
      loginPass.value = '';
    }
  } catch (err) {
    console.error('Security verification error:', err);
    loginError.classList.add('show');
  } finally {
    loginBtn.textContent = 'Sign In';
    loginBtn.disabled = false;
  }
});

function logoutAdmin() {
  isAdmin = false;
  adminBar.classList.remove('show');
  navbar.classList.remove('admin-active');
  document.body.classList.remove('admin-mode');
  adminTrigger.classList.remove('active');
  renderProjects();
  toast('Logged out of admin.');
}
adminLogout.addEventListener('click', logoutAdmin);

/* ════════════════════════════════════════
   RENDER PROJECTS
════════════════════════════════════════ */
function renderProjects(filter) {
  if (filter !== undefined) activeFilter = filter;
  projectsGrid.innerHTML = '';

  const list = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter);

  if (!list.length) {
    projEmpty.style.display = 'flex';
    return;
  }
  projEmpty.style.display = 'none';

  list.forEach((proj, i) => {
    const card = buildCard(proj, i);
    projectsGrid.appendChild(card);
    revealObs.observe(card);
  });
}

/* ─── BUILD CARD ─── */
function buildCard(proj, idx) {
  const card = document.createElement('div');
  card.className = 'proj-card reveal' + (idx === 0 ? ' proj-featured' : '');
  card.dataset.id = proj.id;
  card.style.animationDelay = idx * 0.06 + 's';

  const imgH = proj.image
    ? `<div class="proj-img-wrap"><img src="${proj.image}" alt="${esc(proj.name)}" loading="lazy"/></div>`
    : `<div class="proj-placeholder-bg"><span class="pp-icon">${catEmoji(proj.category)}</span><span class="pp-label">${esc(proj.category)}</span></div>`;

  const meta = [
    proj.location && `<span>📍 ${esc(proj.location)}</span>`,
    proj.year     && `<span>📅 ${esc(proj.year)}</span>`,
    proj.client   && `<span>👤 ${esc(proj.client)}</span>`
  ].filter(Boolean).join('');

  card.innerHTML = `
    ${imgH}
    <div class="proj-admin-actions">
      <button class="paa-btn paa-edit"   data-action="edit"   data-id="${proj.id}" title="Edit">✏️</button>
      <button class="paa-btn paa-delete" data-action="delete" data-id="${proj.id}" title="Delete">🗑️</button>
    </div>
    <div class="proj-info">
      <div class="proj-info-top"><span class="proj-cat-badge">${esc(proj.category)}</span></div>
      <div class="proj-title">${esc(proj.name)}</div>
      <div class="proj-desc">${esc(proj.desc || proj.description || '')}</div>
      ${meta ? `<div class="proj-meta">${meta}</div>` : ''}
    </div>`;

  // Click to view (not admin buttons)
  card.addEventListener('click', e => {
    if (e.target.closest('.proj-admin-actions')) return;
    openView(proj);
  });

  card.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      btn.dataset.action === 'edit'
        ? openEditModal(btn.dataset.id)
        : openDeleteModal(btn.dataset.id);
    });
  });

  return card;
}

function catEmoji(c) {
  return { Residential:'🏠', Commercial:'🏢', Renovation:'🔨', Industrial:'🏗️', Interior:'🎨' }[c] || '🏗️';
}
function esc(s) {
  return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─── FILTER PILLS ─── */
document.querySelectorAll('.pf-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pf-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.filter);
  });
});

/* ════════════════════════════════════════
   ADD PROJECT
════════════════════════════════════════ */
addProjectBtn.addEventListener('click', () => {
  pmTitle.textContent = 'Add New Project';
  editProjectId.value = '';
  projectForm.reset();
  clearImgPreview();
  imageBase64 = null;
  pmError.textContent = '';
  openModal(projectModal);
  setTimeout(() => pName.focus(), 280);
});

/* ════════════════════════════════════════
   EDIT PROJECT
════════════════════════════════════════ */
function openEditModal(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  pmTitle.textContent = 'Edit Project';
  editProjectId.value = p.id;
  pName.value     = p.name || '';
  pCategory.value = p.category || '';
  pLocation.value = p.location || '';
  pYear.value     = p.year || '';
  pDesc.value     = p.desc || p.description || '';
  pClient.value   = p.client || '';
  pmError.textContent = '';
  imageBase64 = p.image || null;

  if (p.image) {
    imgPreview.src = p.image;
    imgPreviewWrap.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  } else { clearImgPreview(); }

  openModal(projectModal);
  setTimeout(() => pName.focus(), 280);
}

/* ════════════════════════════════════════
   SAVE PROJECT
════════════════════════════════════════ */
projectForm.addEventListener('submit', e => {
  e.preventDefault();
  pmError.textContent = '';

  const name     = pName.value.trim();
  const category = pCategory.value;
  const desc     = pDesc.value.trim();
  if (!name)     { pmError.textContent = '⚠️ Project name is required.'; return; }
  if (!category) { pmError.textContent = '⚠️ Please select a category.'; return; }
  if (!desc)     { pmError.textContent = '⚠️ Description is required.'; return; }

  saveProjectBtn.textContent = 'Saving…';
  saveProjectBtn.disabled = true;

  setTimeout(() => {
    const id = editProjectId.value;
    const data = {
      id: id || uid(), name, category, desc, description: desc,
      location: pLocation.value.trim(), year: pYear.value.trim(),
      client: pClient.value.trim(), image: imageBase64
    };

    if (id) {
      const i = projects.findIndex(p => p.id === id);
      if (i !== -1) projects[i] = data;
      toast('✅ Project updated!');
    } else {
      projects.unshift(data);
      toast('✅ Project added!');
    }

    saveProjects();
    closeModal(projectModal);
    renderProjects();
    saveProjectBtn.textContent = 'Save Project';
    saveProjectBtn.disabled = false;
  }, 550);
});

closeProjectModal.addEventListener('click',  () => closeModal(projectModal));
cancelProjectModal.addEventListener('click', () => closeModal(projectModal));

/* ════════════════════════════════════════
   DELETE PROJECT
════════════════════════════════════════ */
function openDeleteModal(id) {
  const p = projects.find(x => x.id === id);
  if (!p) return;
  deleteId = id;
  dmProjectName.textContent = p.name;
  openModal(deleteModal);
}
cancelDelete.addEventListener('click', () => { closeModal(deleteModal); deleteId = null; });
confirmDelete.addEventListener('click', () => {
  if (!deleteId) return;
  projects = projects.filter(p => p.id !== deleteId);
  saveProjects();
  closeModal(deleteModal);
  deleteId = null;
  renderProjects();
  toast('🗑️ Project deleted.');
});

/* ════════════════════════════════════════
   VIEW PROJECT
════════════════════════════════════════ */
function openView(proj) {
  vmImgWrap.innerHTML = proj.image
    ? `<img src="${proj.image}" alt="${esc(proj.name)}" />`
    : `<div class="vm-no-img">${catEmoji(proj.category)}</div>`;
  vmCat.textContent   = proj.category;
  vmTitle.textContent = proj.name;
  vmDesc.textContent  = proj.desc || proj.description || '';
  vmMeta.innerHTML = [
    proj.location && `<span>📍 ${esc(proj.location)}</span>`,
    proj.year     && `<span>📅 ${esc(proj.year)}</span>`,
    proj.client   && `<span>👤 ${esc(proj.client)}</span>`
  ].filter(Boolean).join('');
  openModal(viewModal);
}
closeViewModal.addEventListener('click', () => closeModal(viewModal));

/* ════════════════════════════════════════
   IMAGE UPLOAD
════════════════════════════════════════ */
pImage.addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { pmError.textContent = '⚠️ Max image size is 5MB.'; pImage.value = ''; return; }
  const r = new FileReader();
  r.onload = ev => {
    imageBase64 = ev.target.result;
    imgPreview.src = imageBase64;
    imgPreviewWrap.style.display = 'block';
    imgPlaceholder.style.display = 'none';
  };
  r.readAsDataURL(file);
});

imgRemoveBtn.addEventListener('click', e => { e.stopPropagation(); clearImgPreview(); imageBase64 = null; pImage.value = ''; });

function clearImgPreview() {
  imgPreview.src = '';
  imgPreviewWrap.style.display = 'none';
  imgPlaceholder.style.display = 'flex';
}

imgUploadArea.addEventListener('dragover', e => { e.preventDefault(); imgUploadArea.style.borderColor = 'var(--orange)'; });
imgUploadArea.addEventListener('dragleave', () => { imgUploadArea.style.borderColor = ''; });
imgUploadArea.addEventListener('drop', e => {
  e.preventDefault(); imgUploadArea.style.borderColor = '';
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    if (file.size > 5 * 1024 * 1024) { pmError.textContent = '⚠️ Max image size is 5MB.'; return; }
    const r = new FileReader();
    r.onload = ev => {
      imageBase64 = ev.target.result;
      imgPreview.src = imageBase64;
      imgPreviewWrap.style.display = 'block';
      imgPlaceholder.style.display = 'none';
    };
    r.readAsDataURL(file);
  }
});

/* ════════════════════════════════════════
   CONTACT FORM
════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('submitBtn');
    btn.textContent = 'Sending…'; btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Send Enquiry'; btn.disabled = false;
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
    }, 1400);
  });
}

/* ════════════════════════════════════════
   TOAST
════════════════════════════════════════ */
function toast(msg) {
  const old = document.getElementById('pkb-toast');
  if (old) old.remove();
  const el = document.createElement('div');
  el.id = 'pkb-toast';
  el.textContent = msg;
  el.style.cssText = [
    'position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(16px)',
    'background:#1c1c1c;color:#fff;font-size:.84rem;font-weight:600',
    'padding:12px 28px;border-radius:2px;border-left:3px solid #E05C10',
    'box-shadow:0 8px 32px rgba(0,0,0,.35);z-index:9999',
    'opacity:0;transition:all .3s cubic-bezier(.34,1.4,.64,1);white-space:nowrap'
  ].join(';');
  document.body.appendChild(el);
  requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = 'translateX(-50%) translateY(0)'; });
  setTimeout(() => {
    el.style.opacity = '0'; el.style.transform = 'translateX(-50%) translateY(8px)';
    setTimeout(() => el.remove(), 350);
  }, 3000);
}

/* ════════════════════════════════════════
   INIT
════════════════════════════════════════ */
loadProjects();
renderProjects();
updateNav();
