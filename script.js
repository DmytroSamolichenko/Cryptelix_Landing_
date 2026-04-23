/* ==========================================
   script.js — Cryptelix Landing Page
   ========================================== */

// ── Header scroll effect ──────────────────────────────────────────────────────
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ── Scroll-to-top button ──────────────────────────────────────────────────────
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scroll-top';
scrollTopBtn.title = 'Back to top';
scrollTopBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.scrollY > 400) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
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

  // Save locally (simulate)
  const entries = JSON.parse(localStorage.getItem('cryptelix_waitlist') || '[]');
  if (!entries.includes(email)) {
    entries.push(email);
    localStorage.setItem('cryptelix_waitlist', JSON.stringify(entries));
  }

  emailInput.value = '';
  showToast('🎉 You\'re on the list! We\'ll reach out soon.');
}

// ── Intersection Observer – fade-in cards ─────────────────────────────────────
const observedEls = document.querySelectorAll(
  '.feature-card, .step-card, .pricing-card, .integration-item'
);

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

observedEls.forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
  fadeObserver.observe(el);
});

// ── Smooth nav link highlight ─────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? 'var(--gold-light)'
          : '';
        link.style.background = link.getAttribute('href') === `#${id}`
          ? 'rgba(201,168,76,0.1)'
          : '';
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach((s) => sectionObserver.observe(s));
