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
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'proj-default-2',
    name: 'G+4 Office Complex',
    category: 'Commercial',
    description: 'Multi-storey commercial building with basement parking, glass curtain wall facade, and full MEP installation. Completed within budget.',
    location: 'Coimbatore, Tamil Nadu',
    year: '2022',
    client: 'Suresh Enterprises',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'proj-default-3',
    name: 'Contemporary Residence',
    category: 'Residential',
    description: 'Elegant contemporary home featuring floor-to-ceiling windows, open concept interiors, and premium stone cladding.',
    location: 'Salem, Tamil Nadu',
    year: '2023',
    client: 'Mr. Arjun Patel',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'proj-default-4',
    name: 'Retail Showroom',
    category: 'Commercial',
    description: 'Spacious 4,000 sq.ft retail showroom with high-bay lighting, glass display facade and polished concrete floors.',
    location: 'Madurai, Tamil Nadu',
    year: '2021',
    client: 'Sri Lakshmi Textiles',
    image: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'proj-default-5',
    name: 'Industrial Warehouse',
    category: 'Industrial',
    description: 'Large-span pre-engineered steel warehouse with loading docks, fire suppression, and industrial ventilation.',
    location: 'Tiruchirappalli, Tamil Nadu',
    year: '2022',
    client: 'Logistics Corp Ltd.',
    image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80'
    ]
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

/* ─── SUPABASE CLIENT ─── */
const SUPABASE_URL = 'https://cqkbkemsiszkbziqiwni.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxa2JrZW1zaXN6a2J6aXFpd25pIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODE5MzMsImV4cCI6MjEwMDQ1NzkzM30.phw_G0FXzhGmfse5ffEXav-YRRxoNNjWv8_O2Z7DXzE';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

/* ─── STATE ─── */
let isAdmin       = false;
let projects      = [];
let deleteId      = null;
let activeFilter  = 'all';
let modalImages   = []; // array of { url: string, file?: File, isExisting: boolean }
let viewGallery   = { images: [], activeIndex: 0, category: '' };
let enquiries     = [];

/* ─── HELPER TO NORMALIZE PROJECT IMAGES ─── */
function parseProjectImages(p) {
  let imgList = [];
  if (p.images && Array.isArray(p.images) && p.images.length > 0) {
    imgList = p.images.filter(Boolean);
  } else if (p.image) {
    if (typeof p.image === 'string') {
      const trimmed = p.image.trim();
      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) imgList = parsed.filter(Boolean);
        } catch (e) {}
      }
      if (imgList.length === 0) {
        if (trimmed.includes(',')) {
          imgList = trimmed.split(',').map(s => s.trim()).filter(Boolean);
        } else {
          imgList = [trimmed];
        }
      }
    } else if (Array.isArray(p.image)) {
      imgList = p.image.filter(Boolean);
    }
  }
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    desc: p.description || p.desc || '',
    description: p.description || p.desc || '',
    location: p.location || '',
    year: p.year || '',
    client: p.client || '',
    image: imgList[0] || null,
    images: imgList
  };
}

/* ─── STORAGE ─── */
async function loadProjects() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        projects = data.map(parseProjectImages);
        renderProjects();
        return;
      }
    } catch (e) {
      console.warn('Supabase fetch failed, fallback to local', e);
    }
  }

  try {
    const raw = localStorage.getItem('pkb_projects');
    projects = raw ? JSON.parse(raw).map(parseProjectImages) : [];
  } catch { projects = []; }
  renderProjects();
}

async function uploadImageToSupabase(file) {
  if (!supabaseClient) return null;
  try {
    const rawExt = file.name ? file.name.split('.').pop() : 'jpg';
    const ext = rawExt ? rawExt.toLowerCase() : 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;
    const contentType = file.type || (ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg');

    const { error } = await supabaseClient.storage
      .from('project-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: true, contentType });

    if (error) {
      console.error('Storage upload error:', error);
      return null;
    }
    const { data: pubUrlData } = supabaseClient.storage
      .from('project-images')
      .getPublicUrl(fileName);

    return pubUrlData ? pubUrlData.publicUrl : null;
  } catch (e) {
    console.error('Upload exception:', e);
    return null;
  }
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
const imgCountBadge   = $('imgCountBadge');
const multiImgGrid    = $('multiImgGrid');
const pmError         = $('pmError');
const saveProjectBtn  = $('saveProjectBtn');

const deleteModal     = $('deleteModal');
const dmProjectName   = $('dmProjectName');
const cancelDelete    = $('cancelDelete');
const confirmDelete   = $('confirmDelete');

const viewModal       = $('viewModal');
const closeViewModal  = $('closeViewModal');
const vmImgWrap       = $('vmImgWrap');
const vmPrevBtn       = $('vmPrevBtn');
const vmNextBtn       = $('vmNextBtn');
const vmCounter       = $('vmCounter');
const vmThumbsBar     = $('vmThumbsBar');
const vmCat           = $('vmCat');
const vmTitle         = $('vmTitle');
const vmDesc          = $('vmDesc');
const vmMeta          = $('vmMeta');

const enquiriesModal      = $('enquiriesModal');
const closeEnquiriesModal = $('closeEnquiriesModal');
const adminEnquiriesBtn   = $('adminEnquiriesBtn');
const abEnquiriesCount    = $('abEnquiriesCount');
const emTotalBadge        = $('emTotalBadge');
const enquiriesList       = $('enquiriesList');

const projectsGrid    = $('projectsGrid');
const projEmpty       = $('projEmpty');
const contactForm     = $('contactForm');
const formSuccess     = $('formSuccess');

/* ════════════════════════════════════════
   MODAL HELPERS
════════════════════════════════════════ */
function openModal(el)  { el.classList.add('open'); document.body.classList.add('modal-open'); document.body.style.overflow = 'hidden'; }
function closeModal(el) { el.classList.remove('open'); document.body.classList.remove('modal-open'); document.body.style.overflow = ''; }

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
function triggerAdminLogin() {
  if (isAdmin) { logoutAdmin(); return; }
  loginUser.value = ''; loginPass.value = '';
  loginError.classList.remove('show');
  openModal(loginModal);
  setTimeout(() => loginUser.focus(), 280);
}
if (adminTrigger) adminTrigger.addEventListener('click', triggerAdminLogin);
const mbnAdminBtn = $('mbnAdminBtn');
if (mbnAdminBtn) mbnAdminBtn.addEventListener('click', triggerAdminLogin);
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

  const imgList = (proj.images && proj.images.length > 0) ? proj.images : (proj.image ? [proj.image] : []);
  const mainImg = imgList[0];
  const count = imgList.length;
  const countBadge = count > 1 ? `<div class="proj-photo-count">📷 ${count} Photos</div>` : '';

  const imgH = mainImg
    ? `<div class="proj-img-wrap"><img src="${mainImg}" alt="${esc(proj.name)}" loading="lazy"/>${countBadge}</div>`
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
  modalImages = [];
  renderModalThumbnails();
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

  const imgList = (p.images && p.images.length > 0) ? p.images : (p.image ? [p.image] : []);
  modalImages = imgList.map(url => ({ url, isExisting: true }));
  renderModalThumbnails();

  openModal(projectModal);
  setTimeout(() => pName.focus(), 280);
}

/* ════════════════════════════════════════
   RENDER MODAL THUMBNAILS
════════════════════════════════════════ */
function renderModalThumbnails() {
  if (!imgCountBadge || !multiImgGrid) return;
  const count = modalImages.length;
  imgCountBadge.textContent = `${count} ${count === 1 ? 'image' : 'images'} attached`;

  if (count === 0) {
    multiImgGrid.style.display = 'none';
    multiImgGrid.innerHTML = '';
    return;
  }

  multiImgGrid.style.display = 'grid';
  multiImgGrid.innerHTML = '';

  modalImages.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = 'mig-item' + (index === 0 ? ' is-cover' : '');
    div.innerHTML = `
      <img src="${item.url}" alt="Photo ${index + 1}" />
      ${index === 0 ? '<span class="mig-cover-badge">COVER</span>' : ''}
      <div class="mig-actions">
        ${index !== 0 ? `<button type="button" class="mig-btn mig-btn-cover" data-index="${index}">Set Cover</button>` : ''}
        <button type="button" class="mig-btn mig-btn-remove" data-index="${index}">Remove ✕</button>
      </div>
    `;

    const coverBtn = div.querySelector('.mig-btn-cover');
    if (coverBtn) {
      coverBtn.addEventListener('click', e => {
        e.stopPropagation();
        const target = modalImages.splice(index, 1)[0];
        modalImages.unshift(target);
        renderModalThumbnails();
      });
    }

    const removeBtn = div.querySelector('.mig-btn-remove');
    if (removeBtn) {
      removeBtn.addEventListener('click', e => {
        e.stopPropagation();
        modalImages.splice(index, 1);
        renderModalThumbnails();
      });
    }

    multiImgGrid.appendChild(div);
  });
}

/* ════════════════════════════════════════
   SAVE PROJECT
════════════════════════════════════════ */
projectForm.addEventListener('submit', async e => {
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

  try {
    const finalImageUrls = [];
    const pendingUploads = modalImages.filter(img => !img.isExisting && img.file);

    if (pendingUploads.length > 0) {
      saveProjectBtn.textContent = `Uploading ${pendingUploads.length} photo(s)…`;
    }

    for (const item of modalImages) {
      if (item.isExisting || !item.file) {
        finalImageUrls.push(item.url);
      } else {
        const uploadedUrl = await uploadImageToSupabase(item.file);
        if (!uploadedUrl) {
          pmError.textContent = `⚠️ Failed to upload photo "${item.file.name || 'image'}". Please try again.`;
          saveProjectBtn.textContent = 'Save Project';
          saveProjectBtn.disabled = false;
          return;
        }
        finalImageUrls.push(uploadedUrl);
      }
    }

    const id = editProjectId.value || uid();
    const storedImageValue = finalImageUrls.length > 1 ? JSON.stringify(finalImageUrls) : (finalImageUrls[0] || null);

    const data = {
      id,
      name,
      category,
      desc,
      description: desc,
      location: pLocation.value.trim(),
      year: pYear.value.trim(),
      client: pClient.value.trim(),
      image: storedImageValue,
      images: finalImageUrls
    };

    if (supabaseClient) {
      const payload = {
        id: data.id,
        name: data.name,
        category: data.category,
        description: data.description,
        location: data.location,
        year: data.year,
        client: data.client,
        image: data.image
      };

      const { error } = await supabaseClient
        .from('projects')
        .upsert([payload]);

      if (error) {
        console.error('Supabase save error:', error);
        pmError.textContent = `⚠️ Database save failed: ${error.message || 'Could not save project'}`;
        saveProjectBtn.textContent = 'Save Project';
        saveProjectBtn.disabled = false;
        return;
      }
    }

    if (editProjectId.value) {
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
  } catch (err) {
    console.error('Save error:', err);
    pmError.textContent = '⚠️ Error saving project.';
  } finally {
    saveProjectBtn.textContent = 'Save Project';
    saveProjectBtn.disabled = false;
  }
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
function extractSupabaseStoragePath(url) {
  if (!url || typeof url !== 'string') return null;
  const prefix = '/storage/v1/object/public/project-images/';
  if (url.includes(prefix)) {
    const parts = url.split(prefix);
    return parts[1] ? decodeURIComponent(parts[1]) : null;
  }
  return null;
}

confirmDelete.addEventListener('click', async () => {
  if (!deleteId) return;
  const targetId = deleteId;
  const targetProj = projects.find(p => p.id === targetId);

  projects = projects.filter(p => p.id !== targetId);
  saveProjects();
  closeModal(deleteModal);
  deleteId = null;
  renderProjects();
  toast('🗑️ Project deleted.');

  if (supabaseClient) {
    // Delete database entry
    const { error } = await supabaseClient.from('projects').delete().eq('id', targetId);
    if (error) console.error('Supabase delete error:', error);

    // Delete associated uploaded images from Supabase Storage
    if (targetProj) {
      const imgList = (targetProj.images && targetProj.images.length > 0)
        ? targetProj.images
        : (targetProj.image ? [targetProj.image] : []);

      const storageFilesToDelete = imgList
        .map(extractSupabaseStoragePath)
        .filter(Boolean);

      if (storageFilesToDelete.length > 0) {
        const { error: storageErr } = await supabaseClient.storage
          .from('project-images')
          .remove(storageFilesToDelete);
        if (storageErr) console.error('Storage deletion error:', storageErr);
      }
    }
  }
});

/* ════════════════════════════════════════
   VIEW PROJECT GALLERY
════════════════════════════════════════ */
function openView(proj) {
  const imgList = (proj.images && proj.images.length > 0)
    ? proj.images
    : (proj.image ? [proj.image] : []);

  viewGallery.images = imgList;
  viewGallery.activeIndex = 0;
  viewGallery.category = proj.category;

  vmCat.textContent   = proj.category;
  vmTitle.textContent = proj.name;
  vmDesc.textContent  = proj.desc || proj.description || '';
  vmMeta.innerHTML = [
    proj.location && `<span>📍 ${esc(proj.location)}</span>`,
    proj.year     && `<span>📅 ${esc(proj.year)}</span>`,
    proj.client   && `<span>👤 ${esc(proj.client)}</span>`
  ].filter(Boolean).join('');

  renderViewGallery();
  openModal(viewModal);
}

function renderViewGallery() {
  const { images, activeIndex, category } = viewGallery;
  if (!images || images.length === 0) {
    vmImgWrap.innerHTML = `<div class="vm-no-img">${catEmoji(category)}</div>`;
    vmPrevBtn.style.display = 'none';
    vmNextBtn.style.display = 'none';
    vmCounter.style.display = 'none';
    vmThumbsBar.style.display = 'none';
    return;
  }

  // Display active image
  vmImgWrap.innerHTML = `<img src="${images[activeIndex]}" alt="Project image ${activeIndex + 1}" />`;

  if (images.length > 1) {
    vmPrevBtn.style.display = 'flex';
    vmNextBtn.style.display = 'flex';
    vmCounter.style.display = 'block';
    vmCounter.textContent = `${activeIndex + 1} / ${images.length}`;

    vmThumbsBar.style.display = 'flex';
    vmThumbsBar.innerHTML = '';
    images.forEach((url, i) => {
      const thumb = document.createElement('div');
      thumb.className = 'vmt-item' + (i === activeIndex ? ' active' : '');
      thumb.innerHTML = `<img src="${url}" alt="Thumbnail ${i + 1}" />`;
      thumb.addEventListener('click', () => {
        viewGallery.activeIndex = i;
        renderViewGallery();
      });
      vmThumbsBar.appendChild(thumb);
    });
  } else {
    vmPrevBtn.style.display = 'none';
    vmNextBtn.style.display = 'none';
    vmCounter.style.display = 'none';
    vmThumbsBar.style.display = 'none';
  }
}

vmPrevBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (viewGallery.images.length <= 1) return;
  viewGallery.activeIndex = (viewGallery.activeIndex - 1 + viewGallery.images.length) % viewGallery.images.length;
  renderViewGallery();
});

vmNextBtn.addEventListener('click', e => {
  e.stopPropagation();
  if (viewGallery.images.length <= 1) return;
  viewGallery.activeIndex = (viewGallery.activeIndex + 1) % viewGallery.images.length;
  renderViewGallery();
});

document.addEventListener('keydown', e => {
  if (!viewModal.classList.contains('open')) return;
  if (e.key === 'ArrowLeft') {
    vmPrevBtn.click();
  } else if (e.key === 'ArrowRight') {
    vmNextBtn.click();
  }
});

closeViewModal.addEventListener('click', () => closeModal(viewModal));

/* ════════════════════════════════════════
   MULTI-IMAGE UPLOAD SELECTION & DRAG-DROP
════════════════════════════════════════ */
function handleImageFilesSelect(files) {
  if (!files || !files.length) return;
  pmError.textContent = '';
  const fileArray = Array.from(files);

  fileArray.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) {
      pmError.textContent = '⚠️ Some photos exceed 10MB limit.';
      return;
    }
    const r = new FileReader();
    r.onload = ev => {
      modalImages.push({
        url: ev.target.result,
        file: file,
        isExisting: false
      });
      renderModalThumbnails();
    };
    r.readAsDataURL(file);
  });
}

pImage.addEventListener('change', e => {
  handleImageFilesSelect(e.target.files);
  pImage.value = '';
});

imgUploadArea.addEventListener('dragover', e => { e.preventDefault(); imgUploadArea.classList.add('dragover'); });
imgUploadArea.addEventListener('dragleave', () => { imgUploadArea.classList.remove('dragover'); });
imgUploadArea.addEventListener('drop', e => {
  e.preventDefault();
  imgUploadArea.classList.remove('dragover');
  if (e.dataTransfer.files && e.dataTransfer.files.length) {
    handleImageFilesSelect(e.dataTransfer.files);
  }
});

/* ════════════════════════════════════════
   CLIENT ENQUIRIES STORAGE & MANAGER
════════════════════════════════════════ */
async function loadEnquiries() {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        enquiries = data;
        updateEnquiriesBadge();
        return;
      }
    } catch (e) {
      console.warn('Supabase enquiries fetch fallback to local:', e);
    }
  }

  try {
    const raw = localStorage.getItem('pkb_enquiries');
    enquiries = raw ? JSON.parse(raw) : [];
  } catch { enquiries = []; }
  updateEnquiriesBadge();
}

function saveEnquiriesLocal() {
  try { localStorage.setItem('pkb_enquiries', JSON.stringify(enquiries)); } catch {}
  updateEnquiriesBadge();
}

function updateEnquiriesBadge() {
  const count = enquiries.length;
  if (abEnquiriesCount) abEnquiriesCount.textContent = count;
  if (emTotalBadge) emTotalBadge.textContent = `${count} ${count === 1 ? 'Received' : 'Received'}`;
}

async function addEnquiry(enquiryData) {
  enquiries.unshift(enquiryData);
  saveEnquiriesLocal();

  if (supabaseClient) {
    try {
      await supabaseClient.from('enquiries').insert([enquiryData]);
    } catch (e) {
      console.error('Supabase enquiry save error:', e);
    }
  }
}

async function deleteEnquiry(id) {
  enquiries = enquiries.filter(item => item.id !== id);
  saveEnquiriesLocal();
  renderEnquiries();
  toast('🗑️ Enquiry deleted.');

  if (supabaseClient) {
    try {
      await supabaseClient.from('enquiries').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase enquiry delete error:', e);
    }
  }
}

function renderEnquiries() {
  if (!enquiriesList) return;
  updateEnquiriesBadge();

  if (enquiries.length === 0) {
    enquiriesList.innerHTML = `<div class="enquiries-empty">📭 No enquiries received yet.</div>`;
    return;
  }

  enquiriesList.innerHTML = '';
  enquiries.forEach(item => {
    const card = document.createElement('div');
    card.className = 'enquiry-card';

    const cleanPhone = String(item.phone || '').replace(/\D/g, '');
    const dateStr = item.created_at ? new Date(item.created_at).toLocaleString() : 'Just now';

    const waText = encodeURIComponent(
      `Hello ${item.name}, thank you for contacting PKB Kalai Construction regarding your ${item.service || 'project'} enquiry. We are ready to assist you!`
    );

    card.innerHTML = `
      <div class="ec-header">
        <span class="ec-name">${esc(item.name)}</span>
        <span class="ec-service">${esc(item.service || 'General Enquiry')}</span>
      </div>
      <div class="ec-meta">
        <span>📞 ${esc(item.phone)}</span>
        ${item.email ? `<span>✉️ ${esc(item.email)}</span>` : ''}
      </div>
      ${item.message ? `<div class="ec-msg">${esc(item.message)}</div>` : ''}
      <div class="ec-footer">
        <span class="ec-date">📅 ${esc(dateStr)}</span>
        <div class="ec-actions">
          <a href="tel:${cleanPhone}" class="ec-btn ec-btn-call" title="Call Client">📞 Call</a>
          <a href="https://wa.me/91${cleanPhone}?text=${waText}" target="_blank" rel="noopener" class="ec-btn ec-btn-wa" title="WhatsApp Chat">💬 WhatsApp</a>
          <button type="button" class="ec-btn ec-btn-del" data-id="${item.id}" title="Delete">🗑️</button>
        </div>
      </div>
    `;

    card.querySelector('.ec-btn-del').addEventListener('click', () => {
      deleteEnquiry(item.id);
    });

    enquiriesList.appendChild(card);
  });
}

if (adminEnquiriesBtn) {
  adminEnquiriesBtn.addEventListener('click', () => {
    renderEnquiries();
    openModal(enquiriesModal);
  });
}
if (closeEnquiriesModal) {
  closeEnquiriesModal.addEventListener('click', () => closeModal(enquiriesModal));
}

/* ════════════════════════════════════════
   CONTACT FORM SUBMISSION
════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const nameEl    = $('fname');
    const phoneEl   = $('fphone');
    const emailEl   = $('femail');
    const serviceEl = $('fservice');
    const msgEl     = $('fmsg');
    const btn       = $('submitBtn');

    const name    = nameEl ? nameEl.value.trim() : '';
    const phone   = phoneEl ? phoneEl.value.trim() : '';
    const email   = emailEl ? emailEl.value.trim() : '';
    const service = serviceEl ? serviceEl.value : '';
    const message = msgEl ? msgEl.value.trim() : '';

    if (!name || !phone) {
      alert('Please fill in your Full Name and Phone Number.');
      return;
    }

    btn.textContent = 'Sending Enquiry…';
    btn.disabled = true;

    try {
      const enquiryObj = {
        id: uid(),
        name,
        phone,
        email,
        service,
        message,
        created_at: new Date().toISOString()
      };

      await addEnquiry(enquiryObj);

      // Open WhatsApp directly with populated enquiry details
      const waText = encodeURIComponent(
        `*New Project Enquiry — PKB Kalai Construction*\n\n` +
        `👤 *Name:* ${name}\n` +
        `📞 *Phone:* ${phone}\n` +
        `✉️ *Email:* ${email || 'N/A'}\n` +
        `🏗️ *Service:* ${service || 'General Enquiry'}\n` +
        `📝 *Details:* ${message || 'N/A'}`
      );
      const waUrl = `https://wa.me/919791643450?text=${waText}`;

      setTimeout(() => {
        btn.textContent = 'Send Enquiry';
        btn.disabled = false;
        formSuccess.textContent = '✅ Enquiry sent! Opening WhatsApp to connect with K. Prasath...';
        formSuccess.classList.add('show');
        contactForm.reset();

        window.open(waUrl, '_blank');
        toast('✅ Enquiry recorded & WhatsApp opened!');

        setTimeout(() => formSuccess.classList.remove('show'), 6000);
      }, 700);

    } catch (err) {
      console.error('Enquiry error:', err);
      btn.textContent = 'Send Enquiry';
      btn.disabled = false;
    }
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
loadEnquiries();
renderProjects();
updateNav();
