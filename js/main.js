/* ============================================================
   DIPANKAR SARKAR — PORTFOLIO  |  main.js  v4
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     THEME TOGGLE
  ───────────────────────────────────────────── */
  const html      = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  applyTheme(localStorage.getItem('ds-theme') || 'light');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('ds-theme', next);
    });
  }

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    if (themeIcon) themeIcon.className = t === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (themeText) themeText.textContent = t === 'dark' ? 'Light' : 'Dark';
  }

  /* ─────────────────────────────────────────────
     HAMBURGER / MOBILE NAV
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      const open = navLinks.classList.contains('open');
      const spans = hamburger.querySelectorAll('span');
      spans[0].style.transform = open ? 'rotate(45deg) translate(4px, 5px)' : '';
      spans[1].style.opacity   = open ? '0' : '';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(4px, -5px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }));
  }

  /* ─────────────────────────────────────────────
     ACTIVE NAV ON SCROLL
  ───────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY + 120;
    sections.forEach(sec => {
      if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight) {
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id));
      }
    });
  }, { passive: true });

  /* ─────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────── */
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

  /* ─────────────────────────────────────────────
     HERO TYPEWRITER
  ───────────────────────────────────────────── */
  const roles = [
    'Software Engineer',
    'President of GSEC',
    'Problem Solver',
    'Student Mentor',
    'Community Builder'
  ];
  const twWord = document.getElementById('twWord');
  if (twWord) {
    let ri = 0, ci = 0, deleting = false;
    function typeStep() {
      const word = roles[ri];
      if (!deleting) {
        twWord.textContent = word.slice(0, ++ci);
        if (ci === word.length) { deleting = true; return setTimeout(typeStep, 1800); }
        setTimeout(typeStep, 80);
      } else {
        twWord.textContent = word.slice(0, --ci);
        if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; return setTimeout(typeStep, 400); }
        setTimeout(typeStep, 45);
      }
    }
    setTimeout(typeStep, 1200);
  }

  /* ─────────────────────────────────────────────
     HERO COUNTER ANIMATION
  ───────────────────────────────────────────── */
  const counters = document.querySelectorAll('.hero-stat-val[data-count]');
  if (counters.length) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el  = entry.target;
        const end = +el.dataset.count;
        const suf = el.dataset.suffix || '+';
        let cur = 0;
        const step = Math.ceil(end / 30);
        const timer = setInterval(() => {
          cur = Math.min(cur + step, end);
          el.textContent = cur + suf;
          if (cur >= end) clearInterval(timer);
        }, 50);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ─────────────────────────────────────────────
     SKILL BARS
  ───────────────────────────────────────────── */
  const skillSection = document.querySelector('.skills-grid');
  if (skillSection) {
    const sObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.skill-fill').forEach(bar => {
          setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 250);
        });
        sObs.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    sObs.observe(skillSection);
  }

  /* ─────────────────────────────────────────────
     PROJECT FILTER TABS
  ───────────────────────────────────────────── */
  const projectTabs = document.getElementById('projectTabs');
  if (projectTabs) {
    const cards = document.querySelectorAll('#projectsGrid .project-card');
    projectTabs.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        projectTabs.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.dataset.filter;
        let delay = 0;
        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.tech === filter;
          card.classList.remove('fade-in');
          if (match) {
            card.classList.remove('hidden');
            setTimeout(() => card.classList.add('fade-in'), delay);
            delay += 80;
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  /* ─────────────────────────────────────────────
     CAROUSEL FACTORY
     Creates a tabbed + arrow carousel for a section
  ───────────────────────────────────────────── */
  function makeCarousel({ trackId, prevId, nextId, dotsId, tabsId, tabAttr, itemAttr, visibleCount = 3 }) {
    const track   = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsEl  = document.getElementById(dotsId);
    const tabsEl  = document.getElementById(tabsId);
    if (!track) return;

    let allItems   = Array.from(track.querySelectorAll('.carousel-item'));
    let visible    = [...allItems];
    let current    = 0;

    /* -- responsive visible count -- */
    function getVisCount() {
      if (window.innerWidth < 600) return 1;
      if (window.innerWidth < 900) return 2;
      return visibleCount;
    }

    /* -- set item widths -- */
    function setWidths() {
      const vp      = track.parentElement;
      const gap     = 20;
      const vc      = getVisCount();
      const w       = (vp.offsetWidth - gap * (vc - 1)) / vc;
      visible.forEach(item => {
        item.style.width    = w + 'px';
        item.style.minWidth = w + 'px';
      });
    }

    /* -- build dots -- */
    function buildDots() {
      if (!dotsEl) return;
      dotsEl.innerHTML = '';
      const pages = Math.ceil(visible.length / getVisCount());
      for (let i = 0; i < pages; i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        d.addEventListener('click', () => goTo(i));
        dotsEl.appendChild(d);
      }
    }

    /* -- update dots -- */
    function updateDots() {
      if (!dotsEl) return;
      const pg = Math.floor(current / getVisCount());
      dotsEl.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === pg));
    }

    /* -- go to index -- */
    function goTo(pageIndex) {
      const vc  = getVisCount();
      current   = Math.max(0, Math.min(pageIndex * vc, visible.length - vc));
      const gap = 20;
      const w   = parseFloat(visible[0]?.style.width || 0);
      track.style.transform = `translateX(-${current * (w + gap)}px)`;
      updateDots();
      if (prevBtn) prevBtn.disabled = current === 0;
      if (nextBtn) nextBtn.disabled = current >= visible.length - vc;
    }

    /* -- arrows -- */
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(Math.floor((current - getVisCount()) / getVisCount())));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(Math.floor((current + getVisCount()) / getVisCount())));

    /* -- filter by tab -- */
    if (tabsEl) {
      tabsEl.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
          tabsEl.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          const cat = tab.dataset[tabAttr === 'cat' ? 'cat' : 'certCat'];
          allItems.forEach(item => {
            const v = cat === 'all' || item.dataset[itemAttr] === cat;
            item.classList.toggle('hidden', !v);
          });
          visible = allItems.filter(item => !item.classList.contains('hidden'));
          current = 0;
          track.style.transform = 'translateX(0)';
          setWidths();
          buildDots();
          updateDots();
          if (prevBtn) prevBtn.disabled = true;
          if (nextBtn) nextBtn.disabled = visible.length <= getVisCount();
        });
      });
    }

    /* -- init -- */
    function init() {
      setWidths();
      buildDots();
      goTo(0);
    }
    init();
    window.addEventListener('resize', () => { setWidths(); buildDots(); goTo(0); }, { passive: true });

    /* -- touch swipe -- */
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend',   e => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) nextBtn && nextBtn.click();
        else        prevBtn && prevBtn.click();
      }
    });
  }

  /* ─────────────────────────────────────────────
     INIT: ACTIVITY CAROUSEL
  ───────────────────────────────────────────── */
  makeCarousel({
    trackId:      'activityTrack',
    prevId:       'actPrev',
    nextId:       'actNext',
    dotsId:       'activityDots',
    tabsId:       'activityTabs',
    tabAttr:      'cat',
    itemAttr:     'cat',
    visibleCount: 3
  });

  /* ─────────────────────────────────────────────
     INIT: CERT CAROUSEL
  ───────────────────────────────────────────── */
  makeCarousel({
    trackId:      'certTrack',
    prevId:       'certPrev',
    nextId:       'certNext',
    dotsId:       'certDots',
    tabsId:       'certTabs',
    tabAttr:      'certCat',
    itemAttr:     'certCat',
    visibleCount: 4
  });

  /* ─────────────────────────────────────────────
     CERTIFICATE LIGHTBOX
  ───────────────────────────────────────────── */
  const overlay   = document.getElementById('lightboxOverlay');
  const lbImg     = document.getElementById('lightboxImg');
  const lbCaption = document.getElementById('lightboxCaption');
  const lbClose   = document.getElementById('lightboxClose');

  function openLightbox(card) {
    const img     = card.querySelector('img');
    const issuer  = card.querySelector('.cert-issuer')?.textContent || '';
    const name    = card.querySelector('.cert-name')?.textContent   || '';
    lbImg.src     = img.src;
    lbCaption.textContent = issuer + ' — ' + name;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    if (overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  }

  // Delegate to catch dynamically ordered cert cards
  document.addEventListener('click', e => {
    const card = e.target.closest('.cert-card');
    if (card) openLightbox(card);
  });

  if (lbClose)  lbClose.addEventListener('click', closeLightbox);
  if (overlay)  overlay.addEventListener('click', e => { if (e.target === overlay) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  /* ─────────────────────────────────────────────
     CONTACT FORM TOAST
  ───────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Message sent! I\'ll get back to you soon.');
      contactForm.reset();
    });
  }

  function showToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = `
      position:fixed;bottom:2rem;right:2rem;z-index:9999;
      background:linear-gradient(135deg,#00AEEF,#2251AA);color:#fff;
      padding:1rem 1.5rem;border-radius:10px;font-size:0.875rem;font-weight:500;
      box-shadow:0 8px 32px rgba(0,0,0,0.25);
      opacity:0;transform:translateY(12px);
      transition:opacity 0.3s,transform 0.3s;
    `;
    document.body.appendChild(t);
    requestAnimationFrame(() => { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; });
    setTimeout(() => {
      t.style.opacity = '0'; t.style.transform = 'translateY(12px)';
      setTimeout(() => t.remove(), 300);
    }, 3500);
  }

  /* ─────────────────────────────────────────────
     CARD TILT EFFECT (subtle 3D on hover)
  ───────────────────────────────────────────── */
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left) / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-4px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────
     SMOOTH SCROLL FOR ALL ANCHOR LINKS
  ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});