/* ============================================================
   DESIGN SYSTEM JS — Faculdade Inspirar
   Animações, interações e comportamentos base.
   Cada funcionalidade é um IIFE independente com early-return
   se o elemento-alvo não existir na página.
   ============================================================ */

/* ─── NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll → opacidade
  let ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        navbar.classList.toggle('navbar--scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Hamburguer / menu mobile
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
  }

  if (mobileMenu) {
    mobileMenu.querySelectorAll('a, button').forEach(function (el) {
      el.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
      });
    });
    // Fechar ao clicar no backdrop
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) document.body.classList.remove('nav-open');
    });
  }
})();

/* ─── THEME TOGGLE ───────────────────────────────────────── */
(function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  const root = document.documentElement;
  // Restaurar preferência salva
  const saved = localStorage.getItem('inspirar-theme');
  if (saved) root.setAttribute('data-theme', saved);

  btn.addEventListener('click', function () {
    const current = root.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('inspirar-theme', next);
    // Atualiza ícone
    updateThemeIcon(btn, next);
  });

  // Ícone inicial
  const theme = root.getAttribute('data-theme') || 'dark';
  updateThemeIcon(btn, theme);

  function updateThemeIcon(btn, theme) {
    if (theme === 'light') {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
    } else {
      btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }
})();

/* ─── REVEAL (IntersectionObserver) ─────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const delay = parseInt(entry.target.dataset.delay || '0', 10);
      setTimeout(function () {
        entry.target.classList.add('revealed');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

  els.forEach(function (el) { observer.observe(el); });
})();

/* ─── COUNTERS ANIMADOS ──────────────────────────────────── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    els.forEach(function (el) {
      el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(function (el) { observer.observe(el); });
})();

/* ─── JOURNEY STACK ──────────────────────────────────────── */
(function initJourneyStack() {
  // O efeito de stack é puramente CSS (position: sticky + --i).
  // JS adiciona apenas delays de reveal escalonados.
  const steps = document.querySelectorAll('.jstep');
  if (!steps.length) return;
  steps.forEach(function (step, i) {
    if (!step.dataset.delay) step.dataset.delay = i * 100;
  });
})();

/* ─── LOGO LOOP ──────────────────────────────────────────── */
(function initLogoLoop() {
  // A animação CSS já faz o loop; o JS apenas verifica se precisa
  // de clones extras para listas pequenas.
  const tracks = document.querySelectorAll('.logoloop__track');
  if (!tracks.length) return;

  tracks.forEach(function (track) {
    const list = track.querySelector('.logoloop__list');
    if (!list) return;
    // Se já temos duplicatas no HTML, não clonar novamente.
    if (track.querySelectorAll('.logoloop__list').length > 1) return;
    const clone = list.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });
})();
