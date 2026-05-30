/* ============================================================
   SEJA CREATE — MAIN JAVASCRIPT (v2)
   ============================================================ */

(function () {
  'use strict';

  // ===== NAVIGATION: SCROLL EFFECT =====
  const header    = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== NAVIGATION: MOBILE HAMBURGER =====
  function closeMenu() {
    navLinks.classList.remove('open');
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    const spans  = navToggle.querySelectorAll('span');

    if (isOpen) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      closeMenu();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // ===== SCROLL ANIMATIONS (IntersectionObserver) =====
  const revealEls = document.querySelectorAll('.reveal, .reveal--right, .reveal--left');

  // Stagger delays for card grids
  const staggerParents = document.querySelectorAll(
    '.dor__grid, .solucao__steps, .servicos__grid, .depoimentos__grid'
  );
  staggerParents.forEach(parent => {
    parent.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = (i * 0.07) + 's';
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -48px 0px',
  });

  revealEls.forEach(el => revealObserver.observe(el));

  // ===== ANIMATED STAT COUNTERS =====
  const counters = document.querySelectorAll('[data-count]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateCount(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReduced || isNaN(target)) {
      el.textContent = suffix.includes('+') ? '+' + target : target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const value = Math.round(eased * target);
      el.textContent = suffix.includes('+') ? '+' + value : value + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(el => countObserver.observe(el));
  }

  // ===== SMOOTH SCROLL (with header offset) =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const offset = 80;
      const top    = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav__links a:not(.btn)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('active'));
        const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(section => sectionObserver.observe(section));

  // ===== FAQ ACCORDION =====
  document.querySelectorAll('.faq__item').forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer   = item.querySelector('.faq__answer');

    question.addEventListener('click', () => {
      const isOpen = answer.classList.contains('open');

      document.querySelectorAll('.faq__answer').forEach(a => a.classList.remove('open'));
      document.querySelectorAll('.faq__question').forEach(q => q.setAttribute('aria-expanded', 'false'));

      if (!isOpen) {
        answer.classList.add('open');
        question.setAttribute('aria-expanded', 'true');
      }
    });
  });

})();
