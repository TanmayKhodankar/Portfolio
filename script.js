/* ═══════════════════════════════════════════════
   Ayush Wandhare — QA Game Tester Portfolio
   script.js
   ═══════════════════════════════════════════════ */

'use strict';

/* ─── Navbar scroll + active link ─── */
const navbar      = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');
const navLinks    = navbar.querySelectorAll('.nav-links a');
const sections    = document.querySelectorAll('section[id]');

function onScroll() {
  const y = window.scrollY;

  navbar.classList.toggle('scrolled', y > 40);
  scrollTopBtn.classList.toggle('visible', y > 300);

  let current = '';
  sections.forEach(s => {
    if (y >= s.offsetTop - 100) current = s.id;
  });

  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // run once on load

/* ─── Scroll-to-top button ─── */
scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Dark / Light theme toggle ─── */
const themeBtn = document.getElementById('theme-btn');
let darkMode = document.documentElement.getAttribute('data-theme') === 'dark';

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  themeBtn.textContent = dark ? '🌙' : '☀️';
  themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

// Restore saved preference
const savedTheme = localStorage.getItem('aw-theme');
if (savedTheme) {
  darkMode = savedTheme === 'dark';
  applyTheme(darkMode);
} else {
  applyTheme(darkMode);
}

themeBtn.addEventListener('click', () => {
  darkMode = !darkMode;
  applyTheme(darkMode);
  localStorage.setItem('aw-theme', darkMode ? 'dark' : 'light');
});

/* ─── Mobile menu ─── */
const menuBtn  = document.getElementById('menu-btn');
const mobileNav = document.getElementById('mobile-nav');

function closeMobileNav() {
  menuBtn.classList.remove('open');
  mobileNav.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

menuBtn.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.mobile-nav-link').forEach(a => {
  a.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileNav();
});

/* ─── Fade-in on scroll (IntersectionObserver) ─── */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      fadeObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

fadeEls.forEach(el => fadeObs.observe(el));

/* ─── Skill bar animations ─── */
const barFills = document.querySelectorAll('.skill-bar-fill');
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target;
      const w = fill.getAttribute('data-width');
      fill.style.width = w + '%';
      fill.classList.add('animate');
      barObs.unobserve(fill);
    }
  });
}, { threshold: 0.5 });

barFills.forEach(bar => {
  bar.style.width = '0%';
  barObs.observe(bar);
});

/* ─── Contact form validation ─── */
const form       = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name  = form.querySelector('#cf-name').value.trim();
  const email = form.querySelector('#cf-email').value.trim();
  const msg   = form.querySelector('#cf-message').value.trim();

  if (!name || !email || !msg) {
    formStatus.style.color = 'var(--warn)';
    formStatus.textContent = '⚠ Please fill in all required fields.';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    formStatus.style.color = 'var(--warn)';
    formStatus.textContent = '⚠ Please enter a valid email address.';
    return;
  }

  formStatus.style.color = 'var(--success)';
  formStatus.textContent = "✓ Message sent! I'll get back to you soon.";
  form.reset();
  setTimeout(() => { formStatus.textContent = ''; }, 5000);
});

/* ─── Resume button ─── */
document.getElementById('resume-btn').addEventListener('click', (e) => {
  e.preventDefault();
  alert('Resume download coming soon! Please reach out via email or LinkedIn.');
});

/* ─── Smooth scroll for all internal hash links ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  if (a.id === 'resume-btn') return; // handled separately
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
