/**
 * main.js — Boot all utilities on DOMContentLoaded
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.JMP) {
    JMP.initPreloader();
    JMP.initNavbar();
    JMP.initRevealAnimations();
    JMP.initStatCounters();
    JMP.init3dTilt();
    JMP.initCarousel();
    JMP.initTestimonialsHoverEffect();
    JMP.initCtaParticles();
    JMP.initGalleryFilter();
    JMP.initLightbox();
    JMP.initContactForm();
    JMP.initFloatingLabels();
  }
});
