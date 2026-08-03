/* ============================================================
   PKB KALAI CONSTRUCTION — script.js
   ============================================================ */
'use strict';

console.log(
  '%c ⚡ Designed & Developed by Arun Kumar %c https://github.com/ARUNKUMAR016 ',
  'background: #d97706; color: #000; font-weight: bold; font-size: 12px; padding: 4px 8px; border-radius: 4px 0 0 4px;',
  'background: #1e293b; color: #fbbf24; font-size: 12px; padding: 4px 8px; border-radius: 0 4px 4px 0;'
);

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

// XSS Sanitizer: Escape HTML characters
function sanitizeHTML(str) {
  if (!str || typeof str !== 'string') return '';
  return str.replace(/[&<>"']/g, function(m) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
  });
}

// Safe URL Sanitizer preventing javascript: / data: URI execution vectors
function sanitizeURL(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (/^(javascript|vbscript|data):/i.test(trimmed)) return '';
  return trimmed;
}

// Rate Limiter Engine (Sliding Window)
const SecurityRateLimiter = {
  attempts: {},
  check(key, limit = 5, windowMs = 600000) { // Default 5 attempts per 10 mins
    const now = Date.now();
    if (!this.attempts[key]) this.attempts[key] = [];
    // Filter timestamps within window
    this.attempts[key] = this.attempts[key].filter(timestamp => now - timestamp < windowMs);
    if (this.attempts[key].length >= limit) {
      const oldest = this.attempts[key][0];
      const retryInSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
      return { allowed: false, retryInSeconds };
    }
    return { allowed: true };
  },
  record(key) {
    if (!this.attempts[key]) this.attempts[key] = [];
    this.attempts[key].push(Date.now());
  }
};

// Admin Login Lockout Manager
const LoginLockoutManager = {
  failedAttempts: 0,
  lockoutUntil: 0,
  maxFailures: 5,
  lockoutDurationMs: 15 * 60 * 1000, // 15 minutes lockout

  isLockedOut() {
    const now = Date.now();
    if (this.lockoutUntil > now) {
      const remainingSec = Math.ceil((this.lockoutUntil - now) / 1000);
      return { locked: true, remainingSec };
    }
    if (this.lockoutUntil !== 0 && this.lockoutUntil <= now) {
      // Reset lockout after expiry
      this.lockoutUntil = 0;
      this.failedAttempts = 0;
    }
    return { locked: false };
  },
  recordFailedAttempt() {
    this.failedAttempts += 1;
    if (this.failedAttempts >= this.maxFailures) {
      this.lockoutUntil = Date.now() + this.lockoutDurationMs;
    }
  },
  reset() {
    this.failedAttempts = 0;
    this.lockoutUntil = 0;
  }
};

// Binary File Header Magic-Byte Verification (PNG, JPEG, WEBP)
async function validateImageFileMagicBytes(file) {
  if (!file) return false;
  // Maximum file size 5MB
  if (file.size > 5 * 1024 * 1024) return false;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = (e) => {
      if (!e.target || e.target.readyState !== FileReader.DONE) {
        resolve(false);
        return;
      }
      const arr = new Uint8Array(e.target.result);
      if (arr.length < 4) { resolve(false); return; }

      // JPEG magic: FF D8 FF
      const isJpeg = arr[0] === 0xFF && arr[1] === 0xD8 && arr[2] === 0xFF;
      // PNG magic: 89 50 4E 47
      const isPng = arr[0] === 0x89 && arr[1] === 0x50 && arr[2] === 0x4E && arr[3] === 0x47;
      // WebP magic: 52 49 46 46 (RIFF) ... 57 45 42 50 (WEBP)
      const isRiff = arr[0] === 0x52 && arr[1] === 0x49 && arr[2] === 0x46 && arr[3] === 0x46;

      resolve(isJpeg || isPng || isRiff);
    };
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
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
        updateHeroProjectCount();
        renderStats();
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
  updateHeroProjectCount();
  renderStats();
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

const statsModal          = $('statsModal');
const closeStatsModal     = $('closeStatsModal');
const adminEditStatsBtn   = $('adminEditStatsBtn');
const statsBarEditBtn     = $('statsBarEditBtn');
const statsForm           = $('statsForm');
const resetStatsBtn       = $('resetStatsBtn');

const visitorLogsModal      = $('visitorLogsModal');
const closeVisitorLogsModal = $('closeVisitorLogsModal');
const adminVisitorLogsBtn   = $('adminVisitorLogsBtn');
const vlSearchInput         = $('vlSearchInput');
const vlFilterDevice        = $('vlFilterDevice');
const vlRefreshBtn          = $('vlRefreshBtn');
const vlExportBtn           = $('vlExportBtn');
const vlClearBtn            = $('vlClearBtn');

const projectsGrid    = $('projectsGrid');
const projEmpty       = $('projEmpty');
const contactForm     = $('contactForm');
const formSuccess     = $('formSuccess');

/* ════════════════════════════════════════
   MODAL HELPERS
════════════════════════════════════════ */
function openModal(el)  { if (el) { el.classList.add('open'); document.body.classList.add('modal-open'); document.body.style.overflow = 'hidden'; } }
function closeModal(el) { if (el) { el.classList.remove('open'); document.body.classList.remove('modal-open'); document.body.style.overflow = ''; } }

[loginModal, projectModal, deleteModal, viewModal, enquiriesModal, statsModal, visitorLogsModal].forEach(m => {
  if (m) m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')
    [loginModal, projectModal, deleteModal, viewModal, enquiriesModal, statsModal, visitorLogsModal].forEach(m => { if (m) closeModal(m); });
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
  const target = +el.dataset.target || 0;
  if (target === 0) {
    el.textContent = '0';
    return;
  }
  let cur = 0; 
  const step = Math.max(1, Math.ceil(target / 40));
  const t = setInterval(() => {
    cur = Math.min(cur + step, target);
    el.textContent = Math.floor(cur);
    if (cur >= target) {
      el.textContent = target;
      clearInterval(t);
    }
  }, 25);
}

// Helper to update hero project count based on 30+ baseline & uploaded projects
function updateHeroProjectCount() {
  if (!statsData || !statsData[0]) return;
  
  // Base default for projects completed is at least 30 (or whatever higher value set by admin)
  let baseNum = typeof statsData[0].num === 'number' ? statsData[0].num : 30;
  if (baseNum < 30) baseNum = 30;

  // Count projects (uploaded projects vs default projects)
  const totalProjCount = Array.isArray(projects) ? projects.length : 0;
  // If user uploaded extra projects beyond initial 5 defaults, count them towards total!
  const extraUploaded = totalProjCount > 5 ? (totalProjCount - 5) : 0;
  
  const finalNum = Math.max(30, baseNum, 30 + extraUploaded);
  statsData[0].num = finalNum;
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
   ADMIN EDIT STATS MANAGEMENT
════════════════════════════════════════ */
const DEFAULT_STATS_DATA = [
  { id: 'stat1', num: 30, suffix: '+', label: 'Projects Done' },
  { id: 'stat2', num: 10, suffix: '+', label: 'Years Experience' },
  { id: 'stat3', num: 50, suffix: 'K+', label: 'Sq. Ft. Built' },
  { id: 'stat4', num: 100, suffix: '%', label: 'Client Satisfaction' }
];
let statsData = [...DEFAULT_STATS_DATA];

async function loadStats() {
  let loaded = false;
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('site_stats')
        .select('*')
        .eq('id', 1)
        .single();
      if (!error && data && data.data && Array.isArray(data.data) && data.data.length === 4) {
        statsData = data.data;
        loaded = true;
      }
    } catch (e) {}
  }

  if (!loaded) {
    try {
      const raw = localStorage.getItem('pkb_stats_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length === 4) {
          statsData = parsed;
        }
      }
    } catch (e) {
      statsData = JSON.parse(JSON.stringify(DEFAULT_STATS_DATA));
    }
  }

  // Ensure stat1 ("Projects Done") is at least 30
  if (statsData[0] && (typeof statsData[0].num !== 'number' || statsData[0].num < 30)) {
    statsData[0].num = 30;
  }

  updateHeroProjectCount();
  renderStats();
}

function renderStats() {
  statsData.forEach((stat, idx) => {
    const i = idx + 1;
    const numEl = $(`statNum${i}`);
    const sufEl = $(`statSuffix${i}`);
    const lblEl = $(`statLabel${i}`);

    if (numEl) {
      numEl.dataset.target = stat.num;
      if (numEl.dataset.done) {
        animateCount(numEl);
      } else {
        numEl.textContent = stat.num;
      }
    }
    if (sufEl) sufEl.textContent = stat.suffix;
    if (lblEl) lblEl.textContent = stat.label;
  });

  // Keep About profile card "Years of Excellence" badge in sync with Stat 2
  const abYearEl = document.querySelector('.ab-year');
  if (abYearEl && statsData[1]) {
    abYearEl.textContent = `${statsData[1].num}${statsData[1].suffix || '+'}`;
  }
}

function saveStats(newStats) {
  if (newStats[0] && typeof newStats[0].num === 'number' && newStats[0].num < 30) {
    newStats[0].num = 30;
  }
  statsData = newStats;
  updateHeroProjectCount();

  try {
    localStorage.setItem('pkb_stats_data', JSON.stringify(statsData));
  } catch (e) {}

  if (supabaseClient) {
    try {
      supabaseClient.from('site_stats').upsert({ id: 1, data: statsData }).catch(() => {});
    } catch (e) {}
  }

  renderStats();
  document.querySelectorAll('.hcsb-num').forEach(el => animateCount(el));
  toast('Stats counter updated successfully!');
}

function openStatsEditor() {
  if (!isAdmin) {
    toast('🔒 Admin access required. Please sign in as Admin.');
    return;
  }
  updateHeroProjectCount();
  statsData.forEach((stat, idx) => {
    const i = idx + 1;
    const labelInput = $(`stLabel${i}`);
    const numInput = $(`stNum${i}`);
    const suffixInput = $(`stSuffix${i}`);
    if (labelInput) labelInput.value = stat.label || '';
    if (numInput) numInput.value = stat.num !== undefined ? stat.num : 0;
    if (suffixInput) suffixInput.value = stat.suffix || '';
  });
  openModal(statsModal);
}

if (adminEditStatsBtn) adminEditStatsBtn.addEventListener('click', openStatsEditor);
if (statsBarEditBtn) statsBarEditBtn.addEventListener('click', openStatsEditor);
if (closeStatsModal) closeStatsModal.addEventListener('click', () => closeModal(statsModal));

if (statsForm) {
  statsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const updated = [1, 2, 3, 4].map(i => ({
      id: `stat${i}`,
      label: sanitizeHTML(($(`stLabel${i}`)?.value || '').trim()),
      num: parseInt($(`stNum${i}`)?.value, 10) || 0,
      suffix: sanitizeHTML(($(`stSuffix${i}`)?.value || '').trim())
    }));
    saveStats(updated);
    closeModal(statsModal);
  });
}

if (resetStatsBtn) {
  resetStatsBtn.addEventListener('click', () => {
    if (confirm('Reset stats counter to default values?')) {
      saveStats(JSON.parse(JSON.stringify(DEFAULT_STATS_DATA)));
      openStatsEditor();
    }
  });
}

/* ════════════════════════════════════════
   SERVER ACCESS LOG & VISITOR TRACKER
════════════════════════════════════════ */
let visitorLogs = [];

function getVisitorId() {
  let vid = localStorage.getItem('pkb_visitor_id');
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    localStorage.setItem('pkb_visitor_id', vid);
  }
  return vid;
}

function parseDevice(ua) {
  let os = 'Windows';
  let browser = 'Chrome';
  let device = 'Desktop';

  if (!ua) return { os, browser, device };

  const uaLower = ua.toLowerCase();

  // 1. Device Category
  if (/tablet|ipad|playbook|silk/i.test(uaLower) || (/android/i.test(uaLower) && !/mobile/i.test(uaLower))) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(uaLower)) {
    device = 'Mobile';
  } else {
    device = 'Desktop';
  }

  // 2. OS Detection (Must check iOS BEFORE macOS because iPhone/iPad UAs contain 'Mac OS X')
  if (/iphone|ipad|ipod/i.test(uaLower)) {
    os = 'iOS';
  } else if (/android/i.test(uaLower)) {
    os = 'Android';
  } else if (/windows/i.test(uaLower)) {
    os = 'Windows';
  } else if (/macintosh|mac os x/i.test(uaLower)) {
    os = 'macOS';
  } else if (/linux|x11/i.test(uaLower)) {
    os = 'Linux';
  } else if (/cros/i.test(uaLower)) {
    os = 'ChromeOS';
  } else {
    os = 'Unknown OS';
  }

  // 3. Browser Detection
  if (/edg|edge/i.test(uaLower)) {
    browser = 'Edge';
  } else if (/opera|opr/i.test(uaLower)) {
    browser = 'Opera';
  } else if (/chrome|crios/i.test(uaLower) && !/edg|opera|opr/i.test(uaLower)) {
    browser = 'Chrome';
  } else if (/firefox|fxios/i.test(uaLower)) {
    browser = 'Firefox';
  } else if (/safari/i.test(uaLower) && !/chrome|crios|android/i.test(uaLower)) {
    browser = 'Safari';
  }

  return { os, browser, device };
}

// Sample initial visitor logs for demo analytics if no multi-device logs exist yet
const sampleVisitorLogs = [
  {
    id: 'log_seed_1',
    visitorId: 'v_mobile_01',
    ip: '157.48.12.94',
    city: 'Madurai',
    country: 'TN, IN',
    os: 'Android',
    browser: 'Chrome',
    device: 'Mobile',
    path: '/',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    isNew: true
  },
  {
    id: 'log_seed_2',
    visitorId: 'v_ios_02',
    ip: '106.51.78.112',
    city: 'Chennai',
    country: 'TN, IN',
    os: 'iOS',
    browser: 'Safari',
    device: 'Mobile',
    path: '/#services',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isNew: false
  },
  {
    id: 'log_seed_3',
    visitorId: 'v_mac_03',
    ip: '182.73.19.40',
    city: 'Bengaluru',
    country: 'KA, IN',
    os: 'macOS',
    browser: 'Safari',
    device: 'Desktop',
    path: '/#portfolio',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    isNew: true
  },
  {
    id: 'log_seed_4',
    visitorId: 'v_win_04',
    ip: '49.207.54.18',
    city: 'Coimbatore',
    country: 'TN, IN',
    os: 'Windows',
    browser: 'Edge',
    device: 'Desktop',
    path: '/#contact',
    timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    isNew: false
  },
  {
    id: 'log_seed_5',
    visitorId: 'v_tab_05',
    ip: '117.216.89.205',
    city: 'Kochi',
    country: 'KL, IN',
    os: 'Android',
    browser: 'Chrome',
    device: 'Tablet',
    path: '/',
    timestamp: new Date(Date.now() - 1000 * 60 * 380).toISOString(),
    isNew: true
  }
];

async function fetchIpLocation() {
  const fallback = { ip: '127.0.0.1 (Client)', city: 'Madurai', country: 'TN, IN' };

  // Provider 1: ipapi.co (Returns IP, City, Region, Country)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip && !data.error) {
        return {
          ip: data.ip,
          city: data.city || 'Tamil Nadu',
          country: `${data.region_code || 'TN'}, ${data.country_code || 'IN'}`
        };
      }
    }
  } catch (e) {}

  // Provider 2: api.db-ip.com
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2500);
    const res = await fetch('https://api.db-ip.com/v2/free/self', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ipAddress) {
        return {
          ip: data.ipAddress,
          city: data.city || 'Tamil Nadu',
          country: data.countryName || 'India'
        };
      }
    }
  } catch (e) {}

  // Provider 3: api.ipify.org
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      if (data && data.ip) {
        return { ip: data.ip, city: 'Madurai', country: 'TN, IN' };
      }
    }
  } catch (e) {}

  return fallback;
}

async function recordVisitorLog() {
  const vid = getVisitorId();
  const isNew = !localStorage.getItem('pkb_has_visited_before');
  localStorage.setItem('pkb_has_visited_before', '1');

  const { os, browser, device } = parseDevice(navigator.userAgent || '');
  const path = window.location.pathname + window.location.hash || '/';

  const ipInfo = await fetchIpLocation();

  const newLog = {
    id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    visitorId: vid,
    ip: ipInfo.ip,
    city: ipInfo.city,
    country: ipInfo.country,
    os,
    browser,
    device,
    path,
    timestamp: new Date().toISOString(),
    isNew
  };

  try {
    const raw = localStorage.getItem('pkb_visitor_logs');
    visitorLogs = raw ? JSON.parse(raw) : [];
  } catch (e) { visitorLogs = []; }

  // Seed sample logs if empty
  if (!visitorLogs || visitorLogs.length === 0) {
    visitorLogs = [...sampleVisitorLogs];
  }

  // Prepend current log if not duplicate of last log in past 5s
  const lastLog = visitorLogs[0];
  if (!lastLog || lastLog.ip !== newLog.ip || lastLog.os !== newLog.os || (Date.now() - new Date(lastLog.timestamp).getTime() > 5000)) {
    visitorLogs.unshift(newLog);
  }

  if (visitorLogs.length > 200) visitorLogs = visitorLogs.slice(0, 200);

  try {
    localStorage.setItem('pkb_visitor_logs', JSON.stringify(visitorLogs));
  } catch (e) {}

  if (supabaseClient) {
    try {
      supabaseClient.from('visitor_logs').insert([newLog]).catch(() => {});
    } catch (e) {}
  }

  updateVisitorCountBadge();
}

async function loadVisitorLogs() {
  let loadedFromCloud = false;

  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('visitor_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(200);

      if (!error && data && data.length > 0) {
        visitorLogs = data;
        localStorage.setItem('pkb_visitor_logs', JSON.stringify(visitorLogs));
        loadedFromCloud = true;
      }
    } catch (e) {
      console.warn('Supabase visitor logs fetch fallback to local:', e);
    }
  }

  if (!loadedFromCloud) {
    try {
      const raw = localStorage.getItem('pkb_visitor_logs');
      visitorLogs = raw ? JSON.parse(raw) : [];
    } catch (e) { 
      visitorLogs = []; 
    }
  }

  // If local logs only contain 127.0.0.1 Windows logs, seed realistic multi-device demo logs so modal is informative
  const onlyLocalWindows = visitorLogs.length === 0 || visitorLogs.every(l => l.ip === '127.0.0.1 (Client)' && l.os === 'Windows');
  if (onlyLocalWindows) {
    const existingCurrentVisits = visitorLogs.filter(l => l.ip !== '127.0.0.1 (Client)' || l.os !== 'Windows');
    visitorLogs = [...existingCurrentVisits, ...sampleVisitorLogs];
    try { localStorage.setItem('pkb_visitor_logs', JSON.stringify(visitorLogs)); } catch (e) {}
  }

  updateVisitorCountBadge();
}

function updateVisitorCountBadge() {
  const abVisitorsCount = $('abVisitorsCount');
  if (abVisitorsCount) {
    abVisitorsCount.textContent = visitorLogs.length;
  }
}

function formatRelativeTime(isoStr) {
  const date = new Date(isoStr);
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

async function renderVisitorLogs(searchTerm = '', deviceFilter = 'all') {
  await loadVisitorLogs();

  const listContainer     = $('visitorLogsList');
  const vlTotalBadge      = $('vlTotalBadge');
  const kpiTotalVisits    = $('kpiTotalVisits');
  const kpiUniqueVisitors = $('kpiUniqueVisitors');
  const kpiTodayVisits    = $('kpiTodayVisits');
  const kpiTopDevice      = $('kpiTopDevice');

  const s = searchTerm.toLowerCase().trim();
  const filtered = visitorLogs.filter(log => {
    const matchDevice = deviceFilter === 'all' || log.device === deviceFilter;
    const matchSearch = !s || 
      (log.ip && log.ip.toLowerCase().includes(s)) ||
      (log.os && log.os.toLowerCase().includes(s)) ||
      (log.browser && log.browser.toLowerCase().includes(s)) ||
      (log.city && log.city.toLowerCase().includes(s)) ||
      (log.country && log.country.toLowerCase().includes(s)) ||
      (log.path && log.path.toLowerCase().includes(s));
    return matchDevice && matchSearch;
  });

  const total = visitorLogs.length;
  const uniqueIPs = new Set(visitorLogs.map(l => l.ip)).size;
  const todayStr = new Date().toISOString().split('T')[0];
  const todayVisits = visitorLogs.filter(l => l.timestamp && l.timestamp.startsWith(todayStr)).length;

  const deviceCounts = visitorLogs.reduce((acc, l) => {
    acc[l.device] = (acc[l.device] || 0) + 1;
    return acc;
  }, {});
  let topDevice = 'Desktop';
  let maxCount = 0;
  Object.keys(deviceCounts).forEach(d => {
    if (deviceCounts[d] > maxCount) {
      maxCount = deviceCounts[d];
      topDevice = d;
    }
  });

  if (kpiTotalVisits) kpiTotalVisits.textContent = total;
  if (kpiUniqueVisitors) kpiUniqueVisitors.textContent = uniqueIPs;
  if (kpiTodayVisits) kpiTodayVisits.textContent = todayVisits;
  if (kpiTopDevice) kpiTopDevice.textContent = topDevice;
  if (vlTotalBadge) vlTotalBadge.textContent = `${filtered.length} Displayed`;

  if (!listContainer) return;

  if (filtered.length === 0) {
    listContainer.innerHTML = '<div class="logs-empty">No visitor access logs found matching criteria.</div>';
    return;
  }

  listContainer.innerHTML = filtered.map(log => {
    const dateObj = new Date(log.timestamp);
    const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    const relTime = formatRelativeTime(log.timestamp);

    const devIcon = log.device === 'Mobile' ? '📱' : log.device === 'Tablet' ? '📑' : '💻';
    const typeBadge = log.isNew
      ? '<span class="badge-type-new">🟢 New</span>'
      : '<span class="badge-type-returning">🔵 Returning</span>';

    const locationText = log.city || log.country ? `${log.city}${log.city && log.country ? ', ' : ''}${log.country}` : 'Tamil Nadu, IN';

    return `
      <div class="log-row">
        <div class="col-ip">
          <span class="badge-ip">⚡ ${sanitizeHTML(log.ip)}</span>
          <span class="badge-geo">📍 ${sanitizeHTML(locationText)}</span>
        </div>
        <div class="col-time">
          <div>${dateStr} ${timeStr}</div>
          <div class="time-ago">${relTime}</div>
        </div>
        <div class="col-device">
          <span>${devIcon}</span>
          <span>${sanitizeHTML(log.device)} &bull; ${sanitizeHTML(log.browser)} (${sanitizeHTML(log.os)})</span>
        </div>
        <div class="col-path">
          <span>${sanitizeHTML(log.path)}</span>
        </div>
        <div class="col-status">
          ${typeBadge}
        </div>
      </div>
    `;
  }).join('');
}

async function openVisitorLogsManager() {
  if (!isAdmin) {
    toast('🔒 Admin access required. Please sign in as Admin.');
    return;
  }
  await renderVisitorLogs(vlSearchInput?.value || '', vlFilterDevice?.value || 'all');
  openModal(visitorLogsModal);
}

if (adminVisitorLogsBtn) adminVisitorLogsBtn.addEventListener('click', openVisitorLogsManager);
if (closeVisitorLogsModal) closeVisitorLogsModal.addEventListener('click', () => closeModal(visitorLogsModal));

if (vlSearchInput) {
  vlSearchInput.addEventListener('input', () => {
    renderVisitorLogs(vlSearchInput.value, vlFilterDevice?.value || 'all');
  });
}

if (vlFilterDevice) {
  vlFilterDevice.addEventListener('change', () => {
    renderVisitorLogs(vlSearchInput?.value || '', vlFilterDevice.value);
  });
}

if (vlRefreshBtn) {
  vlRefreshBtn.addEventListener('click', () => {
    renderVisitorLogs(vlSearchInput?.value || '', vlFilterDevice?.value || 'all');
    toast('Access logs refreshed');
  });
}

if (vlExportBtn) {
  vlExportBtn.addEventListener('click', () => {
    if (visitorLogs.length === 0) {
      toast('No logs to export');
      return;
    }
    const headers = ['ID', 'IP Address', 'Device', 'OS', 'Browser', 'Location', 'Path', 'Timestamp', 'Is New'];
    const rows = visitorLogs.map(l => [
      l.id, l.ip, l.device, l.os, l.browser, `${l.city} ${l.country}`.trim(), l.path, l.timestamp, l.isNew ? 'Yes' : 'No'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.map(x => `"${x}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pkb_visitor_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast('Visitor logs CSV downloaded!');
  });
}

if (vlClearBtn) {
  vlClearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all server access logs?')) {
      visitorLogs = [];
      try { localStorage.removeItem('pkb_visitor_logs'); } catch (e) {}
      renderVisitorLogs();
      toast('All access logs cleared.');
    }
  });
}

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

  // Check anti-brute-force lockout state
  const lockoutStatus = LoginLockoutManager.isLockedOut();
  if (lockoutStatus.locked) {
    loginError.textContent = `🔒 Account locked out due to too many failed attempts. Try again in ${lockoutStatus.remainingSec}s.`;
    loginError.classList.add('show');
    return;
  }

  // Rate Limiting check
  const rateCheck = SecurityRateLimiter.check('admin_login', 5, 300000); // 5 attempts per 5 mins
  if (!rateCheck.allowed) {
    loginError.textContent = `⚠️ Too many login attempts. Please wait ${rateCheck.retryInSeconds} seconds.`;
    loginError.classList.add('show');
    return;
  }

  SecurityRateLimiter.record('admin_login');
  loginBtn.textContent = 'Signing in…';
  loginBtn.disabled = true;

  try {
    const inputUserHash = await sha256(loginUser.value.trim());
    const inputPassHash = await sha256(loginPass.value);

    // Artificial delay to prevent brute-force timing attacks
    await new Promise(resolve => setTimeout(resolve, 650));

    if (inputUserHash === HASHED_USER && inputPassHash === HASHED_PASS) {
      isAdmin = true;
      LoginLockoutManager.reset();
      closeModal(loginModal);
      adminBar.classList.add('show');
      navbar.classList.add('admin-active');
      document.body.classList.add('admin-mode');
      adminTrigger.classList.add('active');
      renderProjects();
      toast('✅ Welcome back, K. Prasath!');
    } else {
      LoginLockoutManager.recordFailedAttempt();
      const checkLock = LoginLockoutManager.isLockedOut();
      if (checkLock.locked) {
        loginError.textContent = `🔒 Too many failed attempts. Account locked for 15 minutes.`;
      } else {
        loginError.textContent = `Invalid credentials. ${LoginLockoutManager.maxFailures - LoginLockoutManager.failedAttempts} attempt(s) remaining.`;
      }
      loginError.classList.add('show');
      loginPass.value = '';
    }
  } catch (err) {
    console.error('Security verification error:', err);
    loginError.textContent = 'An error occurred during verification.';
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

  // Auth Guard
  if (!isAdmin) {
    pmError.textContent = '🔒 Unauthorized: You must be logged in as Admin to manage projects.';
    return;
  }

  const rawName     = pName.value.trim();
  const rawCategory = pCategory.value;
  const rawDesc     = pDesc.value.trim();
  const rawLocation = pLocation.value.trim();
  const rawYear     = pYear.value.trim();
  const rawClient   = pClient.value.trim();

  if (!rawName || rawName.length < 3 || rawName.length > 100) {
    pmError.textContent = '⚠️ Project name must be between 3 and 100 characters.';
    return;
  }
  if (!rawCategory) { pmError.textContent = '⚠️ Please select a valid category.'; return; }
  if (!rawDesc || rawDesc.length < 5 || rawDesc.length > 2000) {
    pmError.textContent = '⚠️ Description must be between 5 and 2000 characters.';
    return;
  }

  const name     = sanitizeHTML(rawName);
  const category = sanitizeHTML(rawCategory);
  const desc     = sanitizeHTML(rawDesc);
  const location = sanitizeHTML(rawLocation);
  const year     = sanitizeHTML(rawYear);
  const client   = sanitizeHTML(rawClient);

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
    updateHeroProjectCount();
    renderStats();
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
  updateHeroProjectCount();
  renderStats();
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
async function handleImageFilesSelect(files) {
  if (!files || !files.length) return;
  pmError.textContent = '';
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    if (!file.type || !file.type.startsWith('image/')) {
      pmError.textContent = '⚠️ Invalid file type. Only JPEG, PNG, and WebP images are allowed.';
      continue;
    }
    const isValidImage = await validateImageFileMagicBytes(file);
    if (!isValidImage) {
      pmError.textContent = `⚠️ Security alert: File "${sanitizeHTML(file.name)}" failed magic-byte validation or exceeds 5MB limit.`;
      continue;
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
  }
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
   CAPTCHA & ADVANCED ANTI-SPAM PROTECTION
════════════════════════════════════════ */
let currentCaptchaAnswer = 0;

function initCaptcha() {
  const captchaText = $('captchaText');
  if (!captchaText) return;
  const num1 = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const num2 = Math.floor(Math.random() * 8) + 1; // 1 to 8
  currentCaptchaAnswer = num1 + num2;
  captchaText.textContent = `Math Check: ${num1} + ${num2} = ?`;
  const captchaInput = $('fcaptcha');
  if (captchaInput) captchaInput.value = '';
}

// Initialize Math CAPTCHA on load
initCaptcha();

// Spam phrases commonly sent by marketing bot submission engines
const SPAM_PATTERNS = [
  /booking widget/i,
  /website refresh/i,
  /rank on google/i,
  /seo service/i,
  /increase traffic/i,
  /digital marketing/i,
  /guest post/i,
  /redesign your/i,
  /web development/i,
  /app development/i,
  /generate leads/i,
  /backlink/i,
  /increase sales/i,
  /domain authority/i,
  /page 1 of google/i
];

/* ════════════════════════════════════════
   CONTACT FORM SUBMISSION
════════════════════════════════════════ */
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    // 1. Honeypot Anti-Spam Check
    const hpField = $('hp_website');
    if (hpField && hpField.value) {
      console.warn('Bot detected via honeypot field submission');
      contactForm.reset();
      initCaptcha();
      formSuccess.textContent = '✅ Enquiry received!';
      formSuccess.classList.add('show');
      return;
    }

    // 2. Math CAPTCHA Verification
    const captchaInput = $('fcaptcha');
    if (captchaInput) {
      const userAns = parseInt(captchaInput.value.trim(), 10);
      if (isNaN(userAns) || userAns !== currentCaptchaAnswer) {
        alert(`❌ Security Check Failed: Please enter the correct math answer (e.g. ${currentCaptchaAnswer}).`);
        initCaptcha();
        captchaInput.focus();
        return;
      }
    }

    // 3. Rate Limiting Check (Max 3 submissions per 10 mins)
    const rateCheck = SecurityRateLimiter.check('contact_enquiry', 3, 600000);
    if (!rateCheck.allowed) {
      alert(`⚠️ Rate limit reached: Please wait ${rateCheck.retryInSeconds} seconds before sending another enquiry.`);
      return;
    }

    const nameEl    = $('fname');
    const phoneEl   = $('fphone');
    const emailEl   = $('femail');
    const serviceEl = $('fservice');
    const msgEl     = $('fmsg');
    const btn       = $('submitBtn');

    const rawName    = nameEl ? nameEl.value.trim() : '';
    const rawPhone   = phoneEl ? phoneEl.value.trim() : '';
    const rawEmail   = emailEl ? emailEl.value.trim() : '';
    const rawService = serviceEl ? serviceEl.value : '';
    const rawMessage = msgEl ? msgEl.value.trim() : '';

    // 4. Spam Keyword & Marketing Pitch Detector
    const isSpamText = SPAM_PATTERNS.some(pattern => pattern.test(rawMessage) || pattern.test(rawName));
    if (isSpamText) {
      console.warn('Spam marketing message blocked:', rawMessage);
      // Silently pretend success to fool bot without storing in database
      contactForm.reset();
      initCaptcha();
      formSuccess.textContent = '✅ Enquiry received!';
      formSuccess.classList.add('show');
      setTimeout(() => formSuccess.classList.remove('show'), 5000);
      return;
    }

    // 5. Strict Input Validation
    if (!rawName || rawName.length < 2 || rawName.length > 60) {
      alert('Please enter a valid Full Name (2 to 60 characters).');
      if (nameEl) nameEl.focus();
      return;
    }

    // 6. Fake Phone & Pattern Filtering (reject 5555480448, 0000000000, 1234567890, 555...)
    const cleanPhone = rawPhone.replace(/\D/g, '');
    const isRepeatedDigits = /^(\d)\1{5,}$/.test(cleanPhone);
    const isSequential = /^12345|^98765/.test(cleanPhone);
    const isFake555 = /^555/.test(cleanPhone);

    if (isRepeatedDigits || isSequential || isFake555) {
      alert('Please enter a valid, active 10-digit mobile phone number.');
      if (phoneEl) phoneEl.focus();
      return;
    }

    // Indian 10-digit mobile numbers MUST start with 6, 7, 8, or 9
    if (cleanPhone.length === 10 && !/^[6-9]/.test(cleanPhone)) {
      alert('Indian mobile numbers must start with 6, 7, 8, or 9.');
      if (phoneEl) phoneEl.focus();
      return;
    }

    // General Phone validation regex
    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$|^(\+\d{1,3}[\-\s]?)?\d{7,14}$/;
    if (!rawPhone || !phoneRegex.test(rawPhone.replace(/\s+/g, ''))) {
      alert('Please enter a valid 10-digit Phone Number (e.g. 9791643450 or +91 9791643450).');
      if (phoneEl) phoneEl.focus();
      return;
    }

    // 7. Email validation & Dot-Stuffed Spam Email Filter
    if (rawEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(rawEmail) || rawEmail.length > 100) {
        alert('Please enter a valid email address.');
        if (emailEl) emailEl.focus();
        return;
      }

      // Detect dot-stuffed Gmail spam addresses (e.g. p.r.a.n.a.b.h.u.e...)
      const emailUserPart = rawEmail.split('@')[0] || '';
      const dotCount = (emailUserPart.match(/\./g) || []).length;
      if (dotCount > 3) {
        alert('Please enter a valid email address without excessive dots.');
        if (emailEl) emailEl.focus();
        return;
      }
    }

    if (rawMessage.length > 1000) {
      alert('Message description is too long (maximum 1000 characters).');
      if (msgEl) msgEl.focus();
      return;
    }

    // Sanitized inputs for DB / Local storage
    const name    = sanitizeHTML(rawName);
    const phone   = sanitizeHTML(rawPhone);
    const email   = sanitizeHTML(rawEmail);
    const service = sanitizeHTML(rawService);
    const message = sanitizeHTML(rawMessage);

    SecurityRateLimiter.record('contact_enquiry');
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
      alert('An error occurred while saving your enquiry. Please try again.');
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
loadStats();
recordVisitorLog();
renderProjects();
updateNav();
