/**
 * inner.js — Inner page specific scripts (accordion, 3D image tilt, page hero particles)
 */

(function() {
  'use strict';

  /* ---------- Accordion ---------- */
  function initAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (!header) return;
      header.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        // Close all
        items.forEach(i => i.classList.remove('open'));
        // Toggle current
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ---------- 3D Image Tilt on inner pages ---------- */
  function initInnerImgTilt() {
    document.querySelectorAll('.img-3d-wrapper').forEach(wrapper => {
      const inner = wrapper.querySelector('.img-3d-inner');
      const depth = wrapper.querySelector('.img-3d-depth');
      if (!inner) return;

      wrapper.addEventListener('mousemove', (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;

        inner.style.transform = `rotateY(${x * 10}deg) rotateX(${-y * 7}deg) scale(1.02)`;
        if (depth) depth.style.transform = `translate(${x * 16 + 8}px, ${y * 16 + 8}px)`;
      });

      wrapper.addEventListener('mouseleave', () => {
        inner.style.transform = '';
        if (depth) depth.style.transform = '';
      });
    });
  }

  /* ---------- Page Hero mini-Three.js particles ---------- */
  function initPageHeroParticles() {
    const canvas = document.getElementById('pageHeroCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.parentElement.offsetWidth, canvas.parentElement.offsetHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.parentElement.offsetWidth / canvas.parentElement.offsetHeight, 0.1, 500);
    camera.position.z = 30;

    const count = 200;
    const pos   = new Float32Array(count * 3);
    const col   = new Float32Array(count * 3);
    const goldC = new THREE.Color(0xc9a84c);
    const whiteC= new THREE.Color(0xf0ebe2);

    for (let i = 0; i < count; i++) {
      pos[i*3]   = (Math.random()-0.5)*80;
      pos[i*3+1] = (Math.random()-0.5)*50;
      pos[i*3+2] = (Math.random()-0.5)*40;
      const c = Math.random()>0.5 ? goldC : whiteC;
      col[i*3]=c.r; col[i*3+1]=c.g; col[i*3+2]=c.b;
    }

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geom.setAttribute('color',    new THREE.BufferAttribute(col, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.15, vertexColors: true, transparent: true, opacity: 0.4,
      blending: THREE.AdditiveBlending, depthWrite: false,
    });

    scene.add(new THREE.Points(geom, mat));

    let mx = 0, my = 0;
    document.addEventListener('mousemove', e => {
      mx = (e.clientX/window.innerWidth  - 0.5) * 2;
      my = (e.clientY/window.innerHeight - 0.5) * 2;
    });

    const clock = new THREE.Clock();
    (function tick() {
      requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      scene.rotation.y = t * 0.04 + mx * 0.2;
      scene.rotation.x = -my * 0.1;
      renderer.render(scene, camera);
    })();

    window.addEventListener('resize', () => {
      const w = canvas.parentElement.offsetWidth;
      const h = canvas.parentElement.offsetHeight;
      renderer.setSize(w, h);
      camera.aspect = w/h;
      camera.updateProjectionMatrix();
    });
  }

  /* ---------- Suite Card Hover 3D ---------- */
  function initSuiteCards3D() {
    document.querySelectorAll('.suite-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-10px) rotateX(${-y*6}deg) rotateY(${x*6}deg)`;
        card.style.transformOrigin = 'center center';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Venue Item Parallax Image ---------- */
  function initVenueItemParallax() {
    const items = document.querySelectorAll('.venue-item-img');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      items.forEach(img => {
        const rect = img.getBoundingClientRect();
        const offset = (rect.top + rect.height/2 - window.innerHeight/2) * 0.08;
        img.style.backgroundPositionY = `calc(50% + ${offset}px)`;
      });
    }, { passive: true });
  }

  /* ---------- Card 3D hover ---------- */
  function initCards3DHover() {
    document.querySelectorAll('.card-3d').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width  - 0.5;
        const y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `translateY(-10px) scale(1.01) rotateX(${-y*7}deg) rotateY(${x*7}deg)`;
        card.style.transformStyle = 'preserve-3d';
        card.style.transformOrigin = 'center center';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ---------- Suite Carousels ---------- */
  function initSuiteCarousels() {
    document.querySelectorAll('.carousel-controls').forEach(controls => {
      const prevBtn = controls.querySelector('.prev');
      const nextBtn = controls.querySelector('.next');
      if (!prevBtn || !nextBtn) return;
      
      const targetId = prevBtn.getAttribute('data-target');
      const carousel = document.querySelector(targetId);
      if (!carousel) return;
      
      prevBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: -300, behavior: 'smooth' });
      });
      nextBtn.addEventListener('click', () => {
        carousel.scrollBy({ left: 300, behavior: 'smooth' });
      });
    });
  }

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initInnerImgTilt();
    initPageHeroParticles();
    initSuiteCards3D();
    initVenueItemParallax();
    initCards3DHover();
    initSuiteCarousels();
  });

})();
