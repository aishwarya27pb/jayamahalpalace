/**
 * hero3d.js — Palace Video scroll-expand + minimal gold dust particles
 *
 * Scroll behaviour:
 *   - Video starts at scale(1.08) and expands to scale(1.0) as user scrolls,
 *     giving a cinematic "opening up" feeling.
 *   - Particle count is kept low (dust only, no geometric boxes).
 */

(function () {
  'use strict';

  /* ============================================================
     1. SCROLL-DRIVEN VIDEO EXPANSION
     ============================================================ */
  const video = document.getElementById('heroBgVideo');

  if (video) {
    // Start zoomed-in; expand (zoom-out) to 1.0 as user scrolls through the hero
    const MAX_SCALE  = 1.08;   // initial scale
    const MIN_SCALE  = 1.0;    // fully expanded on scroll
    const PARALLAX_Y = 0.18;   // how much the video shifts vertically (parallax)

    let ticking = false;

    function updateVideoTransform() {
      const scrollY   = window.scrollY;
      const heroH     = document.getElementById('hero')?.offsetHeight || window.innerHeight;
      const progress  = Math.min(scrollY / heroH, 1); // 0 → 1 as hero exits viewport

      // Scale: zoomed-in → natural as user scrolls
      const scale = MAX_SCALE - (MAX_SCALE - MIN_SCALE) * progress;

      // Parallax: video drifts up slightly as user scrolls
      const translateY = scrollY * PARALLAX_Y;

      video.style.transform = `scale(${scale.toFixed(4)}) translateY(${translateY.toFixed(1)}px)`;

      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateVideoTransform);
        ticking = true;
      }
    }, { passive: true });

    // Initial state
    updateVideoTransform();
  }

  /* ============================================================
     2. MINIMAL GOLD DUST PARTICLES (Three.js)
        — No wireframe boxes. Just fine dust & a subtle torus ring.
     ============================================================ */
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);  // fully transparent
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 0, 50);

  /* ---------- Fine Gold Dust (reduced count, smaller) ---------- */
  const PARTICLE_COUNT = 600;   // was 1800 — 1/3 fewer particles
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors    = new Float32Array(PARTICLE_COUNT * 3);
  const sizes     = new Float32Array(PARTICLE_COUNT);

  const goldC  = new THREE.Color(0xc9a84c);
  const whiteC = new THREE.Color(0xe8d5a3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta  = Math.random() * Math.PI * 2;
    const radius = 10 + Math.random() * 45;
    const height = (Math.random() - 0.4) * 35;

    positions[i * 3]     = Math.cos(theta) * radius;
    positions[i * 3 + 1] = height;
    positions[i * 3 + 2] = Math.sin(theta) * radius * 0.4 - 8;

    const c = Math.random() > 0.4 ? goldC : whiteC;
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;

    sizes[i] = 0.2 + Math.random() * 0.8;  // smaller dots
  }

  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geom.setAttribute('color',    new THREE.BufferAttribute(colors, 3));
  geom.setAttribute('size',     new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    size: 0.35,
    vertexColors: true,
    transparent: true,
    opacity: 0.55,          // subtler — let the video show through
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(geom, mat);
  scene.add(particles);

  /* ---------- Single Thin Torus Ring (palace arch motif) ---------- */
  // Just one elegant ring — no boxes/octahedrons
  const torusMat = new THREE.MeshBasicMaterial({
    color: 0xc9a84c,
    wireframe: true,
    opacity: 0.06,          // very subtle — barely visible
    transparent: true,
  });
  const torus = new THREE.Mesh(
    new THREE.TorusGeometry(16, 0.2, 6, 80),
    torusMat
  );
  torus.rotation.x = Math.PI / 2.2;
  torus.position.z = -30;
  scene.add(torus);

  /* ---------- Soft ambient light ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));

  /* ---------- Mouse parallax ---------- */
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* ---------- Scroll fade ---------- */
  let scrollY = 0;
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  /* ---------- Render loop ---------- */
  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    // Ease mouse
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    // Gently rotate particle cloud
    particles.rotation.y = t * 0.025 + targetX * 0.2;
    particles.rotation.x = -targetY * 0.1;

    // Fade particles out as user scrolls
    const heroH   = document.getElementById('hero')?.offsetHeight || window.innerHeight;
    const fadeOut = Math.max(0, 1 - scrollY / (heroH * 0.7));
    mat.opacity   = 0.55 * fadeOut;

    // Torus slow spin
    torus.rotation.z = t * 0.04;
    torusMat.opacity  = 0.06 * fadeOut;

    // Camera drift
    camera.position.x += (targetX * 2 - camera.position.x) * 0.025;
    camera.position.y += (-targetY * 1.5 - camera.position.y) * 0.025;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  })();

  /* ---------- Resize ---------- */
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

})();
