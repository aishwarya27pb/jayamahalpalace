/**
 * utils.js — Shared utility functions
 */

/* ---------- Intersection Observer for Reveal ---------- */
function initRevealAnimations() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0, 10);

      setTimeout(() => {
        el.classList.add('visible');
      }, delay);

      observer.unobserve(el);
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
}

/* ---------- Stat Counter ---------- */
function initStatCounters() {
  const stats = document.querySelectorAll('.stat-num[data-target]');
  if (!stats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start  = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ---------- Sticky Navbar ---------- */
function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const navLinks  = document.getElementById('navLinks');
  if (!navbar) return;

  /* Scrolled state */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  /* ---------- Mobile drawer ---------- */
  if (!hamburger || !navLinks) return;

  /* Inject backdrop once */
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function openDrawer() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    navLinks.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  /* Close on backdrop click */
  backdrop.addEventListener('click', closeDrawer);

  /* Close on nav link click */
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  /* Close on Escape key */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });
}

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('done');
    }, 2200);
  });
}

/* ---------- CTA Particle Sparks ---------- */
function initCtaParticles() {
  const container = document.getElementById('ctaParticles');
  if (!container) return;

  function createSpark() {
    const spark = document.createElement('div');
    spark.style.cssText = `
      position: absolute;
      width: ${2 + Math.random() * 3}px;
      height: ${2 + Math.random() * 3}px;
      background: ${Math.random() > 0.5 ? '#c9a84c' : '#e8cc80'};
      border-radius: 50%;
      top: ${Math.random() * 100}%;
      left: ${Math.random() * 100}%;
      opacity: 0;
      pointer-events: none;
    `;
    container.appendChild(spark);

    const duration = 3 + Math.random() * 4;
    const tx = (Math.random() - 0.5) * 200;
    const ty = -(100 + Math.random() * 200);

    spark.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 0 },
      { transform: `translate(${tx * 0.3}px, ${ty * 0.3}px) scale(1.5)`, opacity: 0.8, offset: 0.2 },
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 },
    ], {
      duration: duration * 1000,
      easing: 'ease-out',
      delay: Math.random() * 3000,
    }).onfinish = () => spark.remove();
  }

  setInterval(createSpark, 300);
}

/* ---------- 3D Tilt on About Image ---------- */
function init3dTilt() {
  const img = document.getElementById('aboutImg3d');
  if (!img) return;

  img.closest('.about-img-wrap').addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    img.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateZ(10px)`;
  });

  img.closest('.about-img-wrap').addEventListener('mouseleave', () => {
    img.style.transform = 'rotateY(0) rotateX(0) translateZ(0)';
  });
}

/* ---------- Suite Carousel ---------- */
function initCarousel() {
  const slides   = document.querySelectorAll('.suite-slide');
  const dots     = document.querySelectorAll('.dot');
  const prevBtn  = document.getElementById('carouselPrev');
  const nextBtn  = document.getElementById('carouselNext');
  if (!slides.length) return;

  let current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    slides[current].classList.remove('prev');
    dots[current] && dots[current].classList.remove('active');

    slides[current].classList.add('prev');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current] && dots[current].classList.add('active');

    setTimeout(() => {
      document.querySelectorAll('.suite-slide.prev').forEach(s => s.classList.remove('prev'));
    }, 700);
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-advance
  setInterval(() => goTo(current + 1), 5000);
}

/* ---------- Smooth horizontal scroll for testimonials --- */
function initTestimonialsHoverEffect() {
  const cards = document.querySelectorAll('.testimonial-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ---------- Gallery Filter (used in gallery.html) ---------- */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      galleryItems.forEach(item => {
        const match = filter === 'all' || item.dataset.category === filter;
        item.style.opacity = match ? '1' : '0';
        item.style.transform = match ? 'scale(1)' : 'scale(0.9)';
        item.style.pointerEvents = match ? 'all' : 'none';
        item.style.display = match ? '' : 'none';
      });
    });
  });
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  let lightbox = document.getElementById('lightbox');
  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const galleryItems = document.querySelectorAll('.gallery-item[data-src]');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      lightboxImg.src = item.dataset.src;
      lightbox.classList.add('open');
      document.body.classList.add('no-scroll');
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.classList.remove('no-scroll');
    lightboxImg.src = '';
  }

  lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

/* ---------- Contact Form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Message Sent';
      btn.style.background = '#2d7a4f';
      form.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1500);
  });
}

/* ---------- Floating label inputs ---------- */
function initFloatingLabels() {
  document.querySelectorAll('.form-group input, .form-group textarea, .form-group select').forEach(input => {
    input.addEventListener('focus',  () => input.closest('.form-group').classList.add('focused'));
    input.addEventListener('blur',   () => input.closest('.form-group').classList.remove('focused'));
    input.addEventListener('input',  () => input.closest('.form-group').classList.toggle('has-value', !!input.value));
  });
}

/* ---------- Export all inits ---------- */
window.JMP = {
  initRevealAnimations,
  initStatCounters,
  initNavbar,
  initPreloader,
  initCtaParticles,
  init3dTilt,
  initCarousel,
  initTestimonialsHoverEffect,
  initGalleryFilter,
  initLightbox,
  initContactForm,
  initFloatingLabels,
};
