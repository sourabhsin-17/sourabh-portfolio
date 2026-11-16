/* ============================================================
   SOURABH SINGH – PORTFOLIO  |  script.js
   ============================================================ */

'use strict';

/* ============================================================
   1. DARK / LIGHT MODE
   ============================================================ */
(function initTheme() {
  const toggle   = document.getElementById('theme-toggle');
  const icon     = document.getElementById('theme-icon');
  const body     = document.body;
  const STORAGE_KEY = 'portfolio-theme';

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') applyDark();

  toggle.addEventListener('click', function () {
    if (body.classList.contains('dark-mode')) {
      applyLight();
      localStorage.setItem(STORAGE_KEY, 'light');
    } else {
      applyDark();
      localStorage.setItem(STORAGE_KEY, 'dark');
    }
  });

  function applyDark() {
    body.classList.remove('light-mode');
    body.classList.add('dark-mode');
    icon.textContent = '☀️';
    toggle.setAttribute('aria-label', 'Switch to light mode');
  }

  function applyLight() {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode');
    icon.textContent = '🌙';
    toggle.setAttribute('aria-label', 'Switch to dark mode');
  }
})();


/* ============================================================
   2. NAVBAR – SCROLL SHADOW + ACTIVE SECTION HIGHLIGHT
   ============================================================ */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  // Add shadow on scroll
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
    updateActiveLink();
  }, { passive: true });

  function updateActiveLink() {
    const scrollY = window.scrollY + 100; // small offset

    // Find the last section whose top is above current scroll
    let currentSection = '';
    document.querySelectorAll('section[id]').forEach(function (section) {
      if (section.offsetTop <= scrollY) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute('data-section') === currentSection;
      link.classList.toggle('active', isActive);
    });
  }

  // Run once on load
  updateActiveLink();
})();


/* ============================================================
   3. MOBILE MENU (HAMBURGER)
   ============================================================ */
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  const navLinks  = navMenu.querySelectorAll('.nav-link');

  hamburger.addEventListener('click', function () {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close menu when a link is clicked
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (
      navMenu.classList.contains('open') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });
})();


/* ============================================================
   4. SMOOTH SCROLLING (fallback for older browsers)
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    // CSS scroll-behavior handles it in modern browsers;
    // this ensures fallback behaviour
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});


/* ============================================================
   5. PROFILE PHOTO – FALLBACK ON ERROR
   ============================================================ */
(function initPhoto() {
  const photo = document.getElementById('profile-photo');
  if (!photo) return;

  photo.addEventListener('error', function () {
    // Replace broken image with an emoji avatar
    this.style.display = 'none';
    const wrap = this.parentElement;
    const fallback = document.createElement('div');
    fallback.className = 'hero-photo photo-missing';
    fallback.setAttribute('aria-label', 'Profile photo placeholder');
    fallback.style.width = '220px';
    fallback.style.height = '220px';
    fallback.style.borderRadius = '50%';
    fallback.style.display = 'flex';
    fallback.style.alignItems = 'center';
    fallback.style.justifyContent = 'center';
    fallback.style.fontSize = '5rem';
    fallback.style.background = 'var(--bg-alt)';
    fallback.style.border = '4px solid var(--border)';
    fallback.textContent = '👤';
    wrap.appendChild(fallback);
  });
})();


/* ============================================================
   6. CONTACT FORM VALIDATION
   ============================================================ */
(function initContactForm() {
  const form       = document.getElementById('contact-form');
  if (!form) return;

  const fields = {
    name:    { el: document.getElementById('form-name'),    err: document.getElementById('name-error'),    label: 'Name' },
    email:   { el: document.getElementById('form-email'),   err: document.getElementById('email-error'),   label: 'Email' },
    subject: { el: document.getElementById('form-subject'), err: document.getElementById('subject-error'), label: 'Subject' },
    message: { el: document.getElementById('form-message'), err: document.getElementById('message-error'), label: 'Message' },
  };

  const feedback = document.getElementById('form-feedback');

  // Real-time validation on blur
  Object.values(fields).forEach(function (field) {
    field.el.addEventListener('blur', function () {
      validateField(field);
    });
    field.el.addEventListener('input', function () {
      if (field.el.classList.contains('invalid')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let allValid = true;
    Object.values(fields).forEach(function (field) {
      if (!validateField(field)) allValid = false;
    });

    if (!allValid) {
      showFeedback('error', 'Please fix the errors above before submitting.');
      return;
    }

    // Simulate successful submission (no backend)
    showFeedback(
      'success',
      '✓ Your message has been recorded. Note: this form is a frontend demo — no email is sent without a backend service connected.'
    );
    form.reset();
    Object.values(fields).forEach(function (f) {
      f.el.classList.remove('invalid');
      f.err.textContent = '';
    });
  });

  function validateField(field) {
    const val = field.el.value.trim();

    if (!val) {
      setError(field, field.label + ' is required.');
      return false;
    }

    if (field.el.name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        setError(field, 'Please enter a valid email address.');
        return false;
      }
    }

    if (field.el.name === 'message' && val.length < 10) {
      setError(field, 'Message must be at least 10 characters.');
      return false;
    }

    clearError(field);
    return true;
  }

  function setError(field, msg) {
    field.el.classList.add('invalid');
    field.err.textContent = msg;
  }

  function clearError(field) {
    field.el.classList.remove('invalid');
    field.err.textContent = '';
  }

  function showFeedback(type, msg) {
    feedback.className = 'form-feedback ' + type;
    feedback.textContent = msg;
    feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    if (type === 'success') {
      setTimeout(function () {
        feedback.className = 'form-feedback';
        feedback.textContent = '';
      }, 8000);
    }
  }
})();
