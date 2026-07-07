/* ====================================================
   NAAYAAB-E-KALA | script.js
   ==================================================== */

'use strict';

/* ---------- LOADER ---------- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.classList.add('hidden');
      setTimeout(() => loader.remove(), 700);
    }
  }, 2200);
});

/* ---------- CUSTOM CURSOR ---------- */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursor-trail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (cursor) {
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  }
});

function animateTrail() {
  trailX += (mouseX - trailX) * 0.14;
  trailY += (mouseY - trailY) * 0.14;
  if (cursorTrail) {
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
  }
  requestAnimationFrame(animateTrail);
}
animateTrail();

document.querySelectorAll('a, button, [tabindex]').forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursor) { cursor.style.transform = 'translate(-50%,-50%) scale(1.7)'; cursor.style.background = '#A1045A'; }
    if (cursorTrail) { cursorTrail.style.transform = 'translate(-50%,-50%) scale(1.4)'; }
  });
  el.addEventListener('mouseleave', () => {
    if (cursor) { cursor.style.transform = 'translate(-50%,-50%) scale(1)'; cursor.style.background = '#B8860B'; }
    if (cursorTrail) { cursorTrail.style.transform = 'translate(-50%,-50%) scale(1)'; }
  });
});

/* ---------- HERO CANVAS ANIMATION ---------- */
const heroCanvas = document.getElementById('heroCanvas');
if (heroCanvas) {
  const ctx = heroCanvas.getContext('2d');
  let W, H;
  const particles = [];

  function resizeCanvas() {
    W = heroCanvas.width = heroCanvas.offsetWidth;
    H = heroCanvas.height = heroCanvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 2.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.alpha = Math.random() * 0.6 + 0.1;
      const colors = ['#B8860B', '#D4A017', '#A1045A', '#F8F1E7'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < -10 || this.x > W + 10 || this.y < -10 || this.y > H + 10) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 100; i++) particles.push(new Particle());

  // Brush stroke paths
  const strokes = [
    { pts: [], color: 'rgba(184,134,11,0.15)', w: 60, progress: 0, speed: 0.002 },
    { pts: [], color: 'rgba(161,4,90,0.12)', w: 40, progress: 0.3, speed: 0.0015 },
    { pts: [], color: 'rgba(212,160,23,0.1)', w: 30, progress: 0.6, speed: 0.0025 },
  ];

  function generateStroke() {
    const pts = [];
    let x = Math.random() * W;
    let y = Math.random() * H;
    for (let i = 0; i < 80; i++) {
      x += (Math.random() - 0.3) * (W / 40);
      y += (Math.random() - 0.5) * (H / 20);
      pts.push({ x, y });
    }
    return pts;
  }
  strokes.forEach(s => { s.pts = generateStroke(); });

  function drawBrushStroke(stroke) {
    if (stroke.pts.length < 2) return;
    const visibleCount = Math.floor(stroke.progress * stroke.pts.length);
    if (visibleCount < 2) return;
    ctx.save();
    ctx.strokeStyle = stroke.color;
    ctx.lineWidth = stroke.w;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(stroke.pts[0].x, stroke.pts[0].y);
    for (let i = 1; i < visibleCount; i++) {
      ctx.lineTo(stroke.pts[i].x, stroke.pts[i].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function animateCanvas() {
    ctx.clearRect(0, 0, W, H);
    strokes.forEach(s => {
      s.progress += s.speed;
      if (s.progress > 1.3) {
        s.progress = 0;
        s.pts = generateStroke();
      }
      drawBrushStroke(s);
    });
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateCanvas);
  }
  animateCanvas();
}

/* ---------- NAVBAR SCROLL BEHAVIOR ---------- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
  updateActiveNav();
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;
  sections.forEach(section => {
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      link.style.color = (scrollPos >= top && scrollPos < top + height) ? 'var(--mustard)' : '';
    }
  });
}

/* ---------- HAMBURGER MENU ---------- */
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    const spans = hamburger.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });
}

// Close nav on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks && navLinks.classList.remove('open');
    hamburger && hamburger.setAttribute('aria-expanded', 'false');
    const spans = hamburger && hamburger.querySelectorAll('span');
    if (spans) spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

/* ---------- DARK MODE TOGGLE ---------- */
const darkToggle = document.getElementById('darkToggle');
const themeIcon = document.getElementById('themeIcon');

function setTheme(theme) {
  document.body.setAttribute('data-theme', theme);
  localStorage.setItem('nk-theme', theme);
  if (themeIcon) themeIcon.textContent = theme === 'dark' ? '☀' : '☽';
}

// Load saved theme
const savedTheme = localStorage.getItem('nk-theme') || 'light';
setTheme(savedTheme);

if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    const current = document.body.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ---------- SCROLL REVEAL ---------- */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Don't unobserve so they stay visible after scrolling back
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ---------- COUNTER ANIMATION ---------- */
const statNums = document.querySelectorAll('.stat-num');

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  const duration = 1800;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.counted) {
      entry.target.dataset.counted = 'true';
      animateCounter(entry.target);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));

/* ---------- GALLERY FILTER ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');
    filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');

    galleryItems.forEach(item => {
      const cat = item.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;
      item.classList.toggle('hidden', !show);
      item.style.opacity = show ? '' : '0';
      if (show) {
        setTimeout(() => { item.style.opacity = '1'; }, 10);
        item.style.transition = 'opacity 0.4s ease';
      }
    });
  });
});

/* ---------- GALLERY LIGHTBOX ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxArt = document.getElementById('lightboxArt');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxArtist = document.getElementById('lightboxArtist');

function openLightbox(item) {
  const imgEl = item.querySelector('.gallery-img');
  const title = item.getAttribute('data-title');
  const artist = item.getAttribute('data-artist');
  if (lightboxArt && imgEl) {
  lightboxArt.src = imgEl.src;
  lightboxArt.alt = imgEl.alt;
}
  if (lightboxTitle) lightboxTitle.textContent = title;
  if (lightboxArtist) lightboxArtist.textContent = 'by ' + artist;
  if (lightbox) {
    lightbox.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    lightboxClose && lightboxClose.focus();
  }
}

function closeLightbox() {
  if (lightbox) {
    lightbox.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
}

galleryItems.forEach(item => {
  item.addEventListener('click', () => openLightbox(item));
  item.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(item); }
  });
});

lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
lightboxOverlay && lightboxOverlay.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { closeLightbox(); closeModal(); }
});

/* ---------- WORKSHOP BOOKING MODAL ---------- */
const bookingModal = document.getElementById('bookingModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const bookingForm = document.getElementById('bookingForm');
const bookingDetails = document.getElementById('bookingDetails');

window.openBooking = function(name, date, fee) {
  if (bookingDetails) {
    bookingDetails.innerHTML = `<strong>${name}</strong><br/>📅 ${date} &nbsp;|&nbsp; 💰 ${fee}`;
  }
  if (bookingModal) {
    bookingModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('bName') && document.getElementById('bName').focus();
  }
};

function closeModal() {
  if (bookingModal) {
    bookingModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }
}

modalClose && modalClose.addEventListener('click', closeModal);
modalOverlay && modalOverlay.addEventListener('click', closeModal);

if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(bookingForm)) return;
    const btn = bookingForm.querySelector('button[type="submit"]');
    btn.textContent = 'Booking Confirmed ✦';
    btn.style.background = 'linear-gradient(135deg, #2D7D46, #3CAF60)';
    setTimeout(() => {
      closeModal();
      bookingForm.reset();
      btn.textContent = 'Confirm Booking';
      btn.style.background = '';
    }, 2000);
  });
}

/* ---------- CONTACT FORM ---------- */
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm(contactForm)) return;
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message Sent ✦';
      contactSuccess && (contactSuccess.removeAttribute('hidden'));
      setTimeout(() => {
        contactForm.reset();
        btn.textContent = 'Send Message';
        btn.disabled = false;
        contactSuccess && contactSuccess.setAttribute('hidden', '');
      }, 4000);
    }, 1200);
  });
}

/* ---------- FORM VALIDATION ---------- */
function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(input => {
    input.style.borderColor = '';
    if (!input.value.trim()) {
      input.style.borderColor = '#c0392b';
      input.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.15)';
      valid = false;
      if (valid === false && input === form.querySelector('[required]')) input.focus();
    }
    if (input.type === 'email' && input.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#c0392b';
      input.style.boxShadow = '0 0 0 3px rgba(192,57,43,0.15)';
      valid = false;
    }
  });
  return valid;
}

// Reset validation style on input
document.querySelectorAll('input, textarea').forEach(input => {
  input.addEventListener('input', () => {
    input.style.borderColor = '';
    input.style.boxShadow = '';
  });
});

/* ---------- NEWSLETTER FORM ---------- */
const newsletterForm = document.getElementById('newsletterForm');
const newsletterSuccess = document.getElementById('newsletterSuccess');

if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = newsletterForm.querySelector('input');
    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
      input.style.borderColor = '#c0392b';
      return;
    }
    newsletterSuccess && newsletterSuccess.removeAttribute('hidden');
    newsletterForm.reset();
    setTimeout(() => newsletterSuccess && newsletterSuccess.setAttribute('hidden', ''), 4000);
  });
}

/* ---------- TESTIMONIAL CAROUSEL ---------- */
const cards = document.querySelectorAll('.testimonial-card');
const dotsContainer = document.getElementById('carouselDots');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let currentSlide = 0;
let autoSlide;

// Build dots
if (dotsContainer && cards.length) {
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
}

function goToSlide(index) {
  cards[currentSlide].classList.remove('active');
  document.querySelectorAll('.dot')[currentSlide].classList.remove('active');
  currentSlide = (index + cards.length) % cards.length;
  cards[currentSlide].classList.add('active');
  document.querySelectorAll('.dot')[currentSlide].classList.add('active');
}

prevBtn && prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
nextBtn && nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });

function startAutoSlide() {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}
function resetAutoSlide() {
  clearInterval(autoSlide);
  startAutoSlide();
}
if (cards.length) startAutoSlide();

// Pause on hover
const carousel = document.getElementById('testimonialCarousel');
carousel && carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
carousel && carousel.addEventListener('mouseleave', startAutoSlide);

/* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ---------- PARALLAX ON SCROLL (subtle) ---------- */
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
  if (hero && window.scrollY < window.innerHeight) {
    const speed = window.scrollY * 0.25;
    const content = hero.querySelector('.hero-content');
    if (content) content.style.transform = `translateY(${speed}px)`;
    const floats = hero.querySelector('.floating-elements');
    if (floats) floats.style.transform = `translateY(${speed * 0.4}px)`;
  }
}, { passive: true });

/* ---------- MICRO-INTERACTION: CARD TILT ---------- */
document.querySelectorAll('.service-card, .workshop-card, .artist-card, .done-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
  });
});

/* ---------- PAINT SPLASH ON SECTION ENTRY ---------- */
function createSplash(x, y, color) {
  const splash = document.createElement('div');
  splash.style.cssText = `
    position: fixed;
    left: ${x}px; top: ${y}px;
    width: 8px; height: 8px;
    background: ${color};
    border-radius: 50%;
    pointer-events: none;
    z-index: 9997;
    animation: splashOut 0.6s ease forwards;
  `;
  document.body.appendChild(splash);

  const style = document.createElement('style');
  style.textContent = `
    @keyframes splashOut {
      0% { transform: translate(-50%,-50%) scale(0); opacity: 1; }
      60% { transform: translate(-50%,-50%) scale(8); opacity: 0.5; }
      100% { transform: translate(-50%,-50%) scale(14); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  setTimeout(() => { splash.remove(); style.remove(); }, 700);
}

// Splash on section visibility
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const rect = entry.target.getBoundingClientRect();
      const colors = ['rgba(184,134,11,0.25)', 'rgba(161,4,90,0.2)', 'rgba(212,160,23,0.2)'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      createSplash(window.innerWidth / 2, rect.top + 10, color);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

/* ---------- GALLERY KEYBOARD NAVIGATION ---------- */
document.addEventListener('keydown', (e) => {
  if (!lightbox || lightbox.hasAttribute('hidden')) return;
  if (e.key === 'ArrowRight') {
    const visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
    const currentIndex = visibleItems.findIndex(i => i.getAttribute('data-title') === lightboxTitle.textContent);
    if (currentIndex < visibleItems.length - 1) openLightbox(visibleItems[currentIndex + 1]);
  }
  if (e.key === 'ArrowLeft') {
    const visibleItems = [...galleryItems].filter(i => !i.classList.contains('hidden'));
    const currentIndex = visibleItems.findIndex(i => i.getAttribute('data-title') === lightboxTitle.textContent);
    if (currentIndex > 0) openLightbox(visibleItems[currentIndex - 1]);
  }
});

/* ---------- ACCESSIBILITY: TRAP FOCUS IN MODALS ---------- */
function trapFocus(modal) {
  const focusable = modal.querySelectorAll('button, input, textarea, select, a[href], [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  modal.addEventListener('keydown', function handler(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    if (modal.hasAttribute('hidden')) modal.removeEventListener('keydown', handler);
  });
}

bookingModal && new MutationObserver(() => {
  if (!bookingModal.hasAttribute('hidden')) trapFocus(bookingModal);
}).observe(bookingModal, { attributes: true, attributeFilter: ['hidden'] });

lightbox && new MutationObserver(() => {
  if (!lightbox.hasAttribute('hidden')) trapFocus(lightbox);
}).observe(lightbox, { attributes: true, attributeFilter: ['hidden'] });

/* ---------- REDUCE MOTION CHECK ---------- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.fade-up').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.style.animation = 'none';
  });
  clearInterval(autoSlide);
}



