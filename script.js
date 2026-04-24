/* ==========================================
   script.js — Cryptelix Landing Page
   ========================================== */

// ── Header scroll effect ──────────────────────────────────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Scroll-to-top button ──────────────────────────────────────────────────────
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.title = 'Back to top';
scrollTopBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Toast notification ────────────────────────────────────────────────────────
function showToast(message) {
  let existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  });
}

// ── Waitlist form ─────────────────────────────────────────────────────────────
function handleWaitlist(e) {
  e.preventDefault();
  const emailInput = document.getElementById('hero-email');
  const email = emailInput.value.trim();
  if (!email) return;

  const entries = JSON.parse(localStorage.getItem('cryptelix_waitlist') || '[]');
  if (!entries.includes(email)) {
    entries.push(email);
    localStorage.setItem('cryptelix_waitlist', JSON.stringify(entries));
  }

  emailInput.value = '';
  showToast('🎉 You\'re on the list! We\'ll reach out soon.');
}

// ── Hero entrance animation (runs once on load) ───────────────────────────────
window.addEventListener('load', () => {
  const heroEls = [
    { el: document.querySelector('.badge'),         delay: 0,   anim: 'revealUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards' },
    { el: document.querySelector('.hero-title'),    delay: 120, anim: 'revealUp 0.8s cubic-bezier(0.22,1,0.36,1) forwards' },
    { el: document.querySelector('.hero-subtitle'), delay: 240, anim: 'revealUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards' },
    { el: document.querySelector('.hero-cta'),      delay: 360, anim: 'revealUp 0.7s cubic-bezier(0.22,1,0.36,1) forwards' },
    { el: document.querySelector('.hero-note'),     delay: 460, anim: 'revealUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards' },
  ];

  heroEls.forEach(({ el, delay, anim }) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    setTimeout(() => {
      el.style.animation = anim;
      el.style.opacity   = '';
      el.style.transform = '';
    }, delay);
  });
});

// ── Staggered scroll-reveal system ───────────────────────────────────────────
/**
 * Registers elements for scroll-reveal with per-element animation config.
 * @param {string} selector  – CSS selector
 * @param {object} opts      – { animation, duration, easing, stagger, threshold }
 */
function registerReveal(selector, opts = {}) {
  const {
    animation  = 'revealUp',
    duration   = 600,
    easing     = 'cubic-bezier(0.22,1,0.36,1)',
    stagger    = 80,      // ms between siblings
    threshold  = 0.12,
  } = opts;

  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;

  // Hide initially
  elements.forEach((el) => {
    el.style.opacity  = '0';
    el.style.willChange = 'opacity, transform';
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      // Find sibling index for stagger
      const siblings = [...el.parentElement.children].filter(
        (c) => c.matches(selector)
      );
      const idx = siblings.indexOf(el);
      const delay = idx * stagger;

      setTimeout(() => {
        el.style.animation = `${animation} ${duration}ms ${easing} forwards`;
      }, delay);

      io.unobserve(el);
    });
  }, { threshold });

  elements.forEach((el) => io.observe(el));
}

// Register each group with its own animation flavour
registerReveal('.pain-card',         { animation: 'revealUp',    duration: 650, stagger: 90  });
registerReveal('.feature-card',      { animation: 'revealUp',    duration: 650, stagger: 90  });
registerReveal('.step-card',         { animation: 'scaleIn',     duration: 600, stagger: 140 });
registerReveal('.integration-item',  { animation: 'revealUp',    duration: 550, stagger: 60  });
registerReveal('.pricing-card',      { animation: 'revealUp',    duration: 650, stagger: 120 });
registerReveal('.section-title',     { animation: 'revealUp',    duration: 600, stagger: 0   });
registerReveal('.section-subtitle',  { animation: 'revealUp',    duration: 550, stagger: 0, threshold: 0.2 });

// ── Smooth nav link highlight ─────────────────────────────────────────────────
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        link.style.color      = active ? 'var(--gold-light)' : '';
        link.style.background = active ? 'rgba(192,132,0,0.12)' : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach((s) => sectionObserver.observe(s));
