/* =============================================================
   VALUE SPACE ARCHITECTURE — Ultra-Lightweight Motion Engine
   Optimized for:
   - 60+ FPS Instant Response (No lag, no stutter)
   - Zero-conflict native-feel scrolling
   - Low CPU & Memory footprint
   ============================================================= */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  // 1. Lenis Smooth Inertia Scroll (Lightweight & responsive)
  function initLenis() {
    if (prefersReduced || typeof Lenis === 'undefined') return;

    try {
      lenisInstance = new Lenis({
        duration: 0.85, // Fast response, no heavy lag
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
        orientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.2,
      });

      if (typeof ScrollTrigger !== 'undefined') {
        lenisInstance.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
          lenisInstance.raf(time * 1000);
        });
      } else {
        function raf(time) {
          lenisInstance.raf(time);
          requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
      }

      // Smooth anchor links handling
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
              e.preventDefault();
              lenisInstance.scrollTo(targetEl, { offset: -70 });
            }
          }
        });
      });
    } catch (err) {
      console.warn('Lenis initialization skipped:', err);
    }
  }

  // 2. High-Performance Hero Frame Canvas (30 optimized frames, requestAnimationFrame throttled)
  function initHeroFrameSequence() {
    const heroSection = document.querySelector('.hero-frame-section');
    const canvas = document.getElementById('heroFrameCanvas');
    if (!heroSection || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const totalFrames = 30;
    const images = [];
    const frameObj = { currentFrame: 0 };
    let lastRenderedFrame = -1;
    let isTicking = false;

    function resizeCanvas() {
      // Limit to 1.5 DPR on high-res monitors for smooth 60fps render
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      lastRenderedFrame = -1;
      renderFrame(frameObj.currentFrame);
    }

    function renderFrame(index) {
      const idx = Math.min(Math.max(0, Math.round(index)), totalFrames - 1);
      if (idx === lastRenderedFrame) return; // Avoid redundant paint

      const img = images[idx];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      lastRenderedFrame = idx;
      const w = window.innerWidth;
      const h = window.innerHeight;

      const imgRatio = img.naturalWidth / img.naturalHeight;
      const screenRatio = w / h;
      let drawW, drawH, drawX, drawY;

      if (screenRatio > imgRatio) {
        drawW = w;
        drawH = w / imgRatio;
        drawX = 0;
        drawY = (h - drawH) / 2;
      } else {
        drawH = h;
        drawW = h * imgRatio;
        drawX = (w - drawW) / 2;
        drawY = 0;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    }

    // Preload priority: Frame 0 first, then remaining frames in background
    const firstImg = new Image();
    firstImg.src = 'images/sequence/frame_000.webp';
    firstImg.onload = () => {
      images[0] = firstImg;
      resizeCanvas();
      // Load remaining frames quietly
      for (let i = 1; i < totalFrames; i++) {
        const img = new Image();
        const numStr = String(i).padStart(3, '0');
        img.src = `images/sequence/frame_${numStr}.webp`;
        images[i] = img;
      }
    };
    images[0] = firstImg;

    window.addEventListener('resize', resizeCanvas, { passive: true });
    resizeCanvas();

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReduced) {
      return;
    }

    // Scrub timeline for frame animation
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: '+=120%', // Shorter scroll distance = faster, responsive feel
        scrub: 0.1,   // Snappy response without heavy drag
        pin: true,
        anticipatePin: 1,
      },
    });

    heroTl.to(frameObj, {
      currentFrame: totalFrames - 1,
      ease: 'none',
      onUpdate: () => {
        if (!isTicking) {
          isTicking = true;
          requestAnimationFrame(() => {
            renderFrame(frameObj.currentFrame);
            isTicking = false;
          });
        }
      },
    }, 0);

    const heroContent = heroSection.querySelector('.hero-frame-content');
    const heroScrollIndicator = heroSection.querySelector('.scroll-indicator');

    if (heroContent) {
      heroTl.to(heroContent, {
        y: -70,
        opacity: 0,
        ease: 'power1.in',
      }, 0.2);
    }

    if (heroScrollIndicator) {
      heroTl.to(heroScrollIndicator, {
        opacity: 0,
        duration: 0.15,
      }, 0);
    }

    // Hero title entrance on load
    const titleLines = heroSection.querySelectorAll('.hero-title-line');
    const eyebrow = heroSection.querySelector('.eyebrow');
    const heroLead = heroSection.querySelector('.lead');
    const heroBtns = heroSection.querySelector('.hero__actions');

    const entranceTl = gsap.timeline({ delay: 0.1 });
    if (eyebrow) entranceTl.fromTo(eyebrow, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' });
    if (titleLines.length) {
      entranceTl.fromTo(titleLines, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power2.out' }, '-=0.4');
    }
    if (heroLead) entranceTl.fromTo(heroLead, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
    if (heroBtns) entranceTl.fromTo(heroBtns, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }, '-=0.5');
  }

  // 3. Lightweight Section Animations (Hardware-accelerated transforms only)
  function initStorytellingAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' || prefersReduced) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Section 02 – Vision & Approach
    const visionSec = document.querySelector('.section--vision');
    if (visionSec) {
      const visionCard = visionSec.querySelector('.vision-card');
      const visionContent = visionSec.querySelector('.vision-content');

      if (visionCard) {
        gsap.fromTo(
          visionCard,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: visionSec, start: 'top 80%', once: true },
          }
        );
      }
      if (visionContent) {
        gsap.fromTo(
          visionContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: visionSec, start: 'top 75%', once: true },
          }
        );
      }
    }

    // Section 03 – The Studio
    const studioSec = document.querySelector('.section--studio');
    if (studioSec) {
      const studioMedia = studioSec.querySelector('.studio-media');
      const studioContent = studioSec.querySelector('.studio-content');
      const pillars = studioSec.querySelectorAll('.pillar');

      if (studioMedia) {
        gsap.fromTo(
          studioMedia,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: studioSec, start: 'top 80%', once: true },
          }
        );
      }
      if (studioContent) {
        gsap.fromTo(
          studioContent.children,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: { trigger: studioSec, start: 'top 75%', once: true },
          }
        );
      }
      if (pillars.length) {
        gsap.fromTo(
          pillars,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: 'power2.out',
            scrollTrigger: { trigger: studioSec.querySelector('.pillars'), start: 'top 85%', once: true },
          }
        );
      }
    }

    // Section 04 – Philosophy
    const philosophySec = document.querySelector('.section--philosophy');
    if (philosophySec) {
      const philoContent = philosophySec.querySelector('.philosophy-content');
      if (philoContent) {
        gsap.fromTo(
          philoContent,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: 'power2.out',
            scrollTrigger: { trigger: philosophySec, start: 'top 75%', once: true },
          }
        );
      }
    }

    // Section 05 – Services Home
    const servicesSec = document.querySelector('.section--services-home');
    if (servicesSec) {
      const servicesMedia = servicesSec.querySelector('.home-services-media');
      const rowLinks = servicesSec.querySelectorAll('.row-list li');

      if (servicesMedia) {
        gsap.fromTo(
          servicesMedia,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: servicesSec, start: 'top 80%', once: true },
          }
        );
      }
      if (rowLinks.length) {
        gsap.fromTo(
          rowLinks,
          { opacity: 0, x: 20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.05,
            ease: 'power2.out',
            scrollTrigger: { trigger: servicesSec.querySelector('.row-list'), start: 'top 85%', once: true },
          }
        );
      }
    }

    // Section 06 – Portfolio Projects
    const projectsSec = document.querySelector('.section--projects-home');
    if (projectsSec) {
      const observer = new MutationObserver(() => {
        const cards = projectsSec.querySelectorAll('.project-card');
        if (cards.length) {
          observer.disconnect();
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: 'power2.out',
              scrollTrigger: { trigger: projectsSec, start: 'top 80%', once: true },
            }
          );
        }
      });
      const grid = projectsSec.querySelector('.projects-grid');
      if (grid) observer.observe(grid, { childList: true });
    }
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initLenis();
      initHeroFrameSequence();
      initStorytellingAnimations();
    });
  } else {
    initLenis();
    initHeroFrameSequence();
    initStorytellingAnimations();
  }
})();
