/**
 * animations.js — GSAP-powered scroll animations & 3D page transitions
 */

(function() {
  'use strict';
  if (typeof gsap === 'undefined') return;

  /* ---------- Register ScrollTrigger ---------- */
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ---------- Page Enter Animation ---------- */
  function initPageEnter() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;

    const delayTime = window.preloaderDelay !== undefined ? window.preloaderDelay : 2.2;
    const tl = gsap.timeline({ delay: delayTime });

    // Hero lines reveal
    const heroLines = document.querySelectorAll('.hero-title .line');
    if (heroLines.length) {
      tl.from(heroLines, {
        y: 80,
        opacity: 0,
        skewY: 3,
        stagger: 0.15,
        duration: 1.2,
        ease: 'power4.out',
      });
    }

    tl.from('.hero-eyebrow', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.8');

    tl.from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out',
    }, '-=0.6');

    tl.from('.hero-cta > *', {
      opacity: 0,
      y: 20,
      stagger: 0.12,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.5');

    tl.from('.hero-stats .stat-card', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.6,
      ease: 'power3.out',
    }, '-=0.4');
  }

  /* ---------- Parallax Scrolling ---------- */
  function initParallax() {
    if (typeof ScrollTrigger === 'undefined') return;

    // Hero canvas parallax
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
      gsap.to(heroCanvas, {
        y: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        }
      });
    }

    // About image parallax
    const aboutImg = document.querySelector('.about-img-3d');
    if (aboutImg) {
      gsap.from(aboutImg, {
        x: -60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section-about-teaser',
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      });
    }

    // Venue cards stagger
    const venueCards = document.querySelectorAll('.venue-card');
    if (venueCards.length) {
      gsap.from(venueCards, {
        y: 80,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section-venues',
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });
    }

    // Testimonials stagger
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    if (testimonialCards.length) {
      gsap.from(testimonialCards, {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.section-testimonials',
          start: 'top 70%',
          toggleActions: 'play none none none',
        }
      });
    }
  }

  /* ---------- Horizontal Text Marquee (decorative) ---------- */
  function initMarquee() {
    const marquees = document.querySelectorAll('.marquee-track');
    marquees.forEach(track => {
      gsap.to(track, {
        x: '-50%',
        duration: 20,
        ease: 'none',
        repeat: -1,
      });
    });
  }

  /* ---------- Service Card 3D hover (GSAP enhanced) ---------- */
  function initServiceCards() {
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        gsap.to(card, {
          rotateX: -y * 10,
          rotateY:  x * 10,
          transformPerspective: 600,
          duration: 0.4,
          ease: 'power2.out',
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  /* ---------- 3D Venue Hover ---------- */
  function initVenueHover() {
    const cards = document.querySelectorAll('.venue-card');
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        gsap.to(card, {
          rotateX: -y * 8,
          rotateY:  x * 8,
          transformPerspective: 800,
          duration: 0.4,
          ease: 'power2.out',
        });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          rotateX: 0, rotateY: 0,
          duration: 0.8,
          ease: 'elastic.out(1, 0.5)',
        });
      });
    });
  }

  /* ---------- Page transition (fade on link click) ---------- */
  function initPageTransitions() {
    const overlay = document.createElement('div');
    overlay.id = 'pageTransitionOverlay';
    overlay.style.cssText = `
      position: fixed; inset: 0; z-index: 9998;
      background: #0a0a0b;
      pointer-events: none;
      opacity: 0;
    `;
    document.body.appendChild(overlay);

    // Fade in on page load
    gsap.from(overlay, { opacity: 1, duration: 0.6, ease: 'power2.in', delay: 0.1 });

    // Fade out on navigation links
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('http')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(overlay, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          onComplete: () => { window.location.href = href; }
        });
      });
    });
  }

  /* ---------- Gallery image 3D card flip ---------- */
  function initGalleryCards() {
    const items = document.querySelectorAll('.gallery-item');
    items.forEach(item => {
      item.addEventListener('mouseenter', () => {
        gsap.to(item, { scale: 1.04, duration: 0.45, ease: 'power2.out' });
      });
      item.addEventListener('mouseleave', () => {
        gsap.to(item, { scale: 1, duration: 0.5, ease: 'power2.out' });
      });
    });
  }

  /* ---------- Suite Hover 3D Depth Effect ---------- */
  function initSuiteHover() {
    const slides = document.querySelectorAll('.suite-slide-inner');
    slides.forEach(slide => {
      slide.addEventListener('mousemove', (e) => {
        const rect = slide.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        gsap.to(slide, {
          rotateX: -y * 4,
          rotateY:  x * 4,
          transformPerspective: 1200,
          duration: 0.5,
          ease: 'power2.out',
        });
      });
      slide.addEventListener('mouseleave', () => {
        gsap.to(slide, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------- Number Ticker on scroll (GSAP-powered) ---------- */
  function initGsapCounters() {
    const stats = document.querySelectorAll('.stat-num[data-target]');
    stats.forEach(el => {
      ScrollTrigger && ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          const target = parseInt(el.dataset.target, 10);
          gsap.to({ val: 0 }, {
            val: target,
            duration: 2,
            ease: 'power2.out',
            onUpdate: function() {
              el.textContent = Math.round(this.targets()[0].val);
            }
          });
        }
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initPageEnter();
    initParallax();
    initMarquee();
    initServiceCards();
    initVenueHover();
    initPageTransitions();
    initGalleryCards();
    initSuiteHover();
    initGsapCounters();
  });

})();
