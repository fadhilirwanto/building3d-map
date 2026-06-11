/* =============================================
   3D Campus Mapping - Main JavaScript
   ============================================= */

'use strict';

// =============================================
// NAVBAR SCROLL BEHAVIOR
// =============================================

const navbar = document.querySelector('.navbar');

function handleNavbarScroll() {
  if (!navbar) return;
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll(); // Run on init

// =============================================
// HAMBURGER MENU (MOBILE)
// =============================================

const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  // Close mobile nav on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// =============================================
// SCROLL REVEAL (INTERSECTION OBSERVER)
// =============================================

function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // Only animate once
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

// =============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// =============================================

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// =============================================
// ACTIVE NAV LINK (SCROLL SPY)
// =============================================

function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const sections = [];
  navLinks.forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) sections.push({ link, target });
  });

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    let activeSet = false;

    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].target.offsetTop <= scrollPos) {
        navLinks.forEach(l => l.classList.remove('active'));
        sections[i].link.classList.add('active');
        activeSet = true;
        break;
      }
    }

    if (!activeSet) navLinks.forEach(l => l.classList.remove('active'));
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
}

// =============================================
// ANIMATED PROGRESS BARS (ABOUT PAGE)
// =============================================

function initProgressBars() {
  const fills = document.querySelectorAll('.scope-metric-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          const width = fill.dataset.width || '0';
          fill.style.width = width;
          observer.unobserve(fill);
        }
      });
    },
    { threshold: 0.5 }
  );

  fills.forEach(fill => {
    const width = fill.style.width;
    fill.style.width = '0'; // Reset first
    fill.dataset.width = width;
    observer.observe(fill);
  });
}

// =============================================
// FEATURE CARD HOVER PARALLAX
// =============================================

function initCardParallax() {
  const cards = document.querySelectorAll('.feature-card, .team-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 30;
      const rotateY = (centerX - x) / 30;

      card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease, box-shadow 0.35s ease, border-color 0.35s ease';
    });
  });
}

// =============================================
// COUNTER ANIMATION (Hero Stats)
// =============================================

function animateCounter(el, target, duration = 2000) {
  let start = null;
  const startValue = 0;
  const isFloat = target % 1 !== 0;

  function step(timestamp) {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = eased * (target - startValue) + startValue;
    el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counterEls = document.querySelectorAll('[data-count]');
  if (!counterEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseFloat(el.dataset.count);
          animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  counterEls.forEach(el => observer.observe(el));
}

// =============================================
// INIT ALL
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initSmoothScroll();
  initScrollSpy();
  initProgressBars();
  initCardParallax();
  initCounters();
});
