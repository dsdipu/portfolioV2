/* ============================================================
   DIPANKAR SARKAR — PORTFOLIO
   main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     THEME TOGGLE
  ───────────────────────────────────────────── */
  const html       = document.documentElement;
  const toggleBtn  = document.getElementById('themeToggle');
  const themeIcon  = document.getElementById('themeIcon');
  const themeText  = document.getElementById('themeText');

  const saved = localStorage.getItem('ds-theme') || 'light';
  applyTheme(saved);

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
      const isOpen = navLinks.classList.contains('open');
      hamburger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(4px, 5px)' : '';
      hamburger.querySelectorAll('span')[1].style.opacity  = isOpen ? '0' : '';
      hamburger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(4px, -5px)' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      });
    });
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
        links.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === '#' + sec.id);
        });
      }
    });
  }, { passive: true });

  /* ─────────────────────────────────────────────
     SCROLL REVEAL
  ───────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');
  const revObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 70);
        revObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealEls.forEach(el => revObs.observe(el));

  /* ─────────────────────────────────────────────
     SKILL BARS
  ───────────────────────────────────────────── */
  const skillSection = document.querySelector('.skills-grid');
  if (skillSection) {
    const skillObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.skill-fill').forEach(bar => {
            setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 250);
          });
          skillObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    skillObs.observe(skillSection);
  }

  /* ─────────────────────────────────────────────
     CERTIFICATE LIGHTBOX
  ───────────────────────────────────────────── */
  const overlay    = document.getElementById('lightboxOverlay');
  const lbImg      = document.getElementById('lightboxImg');
  const lbCaption  = document.getElementById('lightboxCaption');
  const lbClose    = document.getElementById('lightboxClose');

  document.querySelectorAll('.cert-card').forEach(card => {
    card.addEventListener('click', () => {
      const img = card.querySelector('img');
      const caption = card.querySelector('.cert-issuer').textContent + ' — ' + card.querySelector('.cert-name').textContent;
      lbImg.src = img.src;
      lbCaption.textContent = caption;
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lbClose) {
    lbClose.addEventListener('click', closeLightbox);
  }
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  function closeLightbox() {
    if (overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }
  }

  /* ─────────────────────────────────────────────
     CONTACT FORM (demo toast)
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
      background:var(--grad);color:#fff;padding:1rem 1.5rem;
      border-radius:var(--radius);font-size:0.875rem;font-weight:500;
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

});
