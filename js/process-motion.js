/* =============================================================
   VALUE SPACE ARCHITECTURE — Premium Process Timeline Animation
   Powered by GSAP & ScrollTrigger
   - Sequential Alternating Step Reveals (Left -> Right -> Left -> Right)
   - Dynamic Progressive Line Drawing as users scroll
   - Individual Step Animations (Marker scale, image slides, text staggers)
   - Distinct image effects (Slide, scale-down, clip-path)
   - Fully responsive on mobile, tablet & desktop
   ============================================================= */

(function () {
  'use strict';

  function initProcessTimelineAnimation() {
    const timeline = document.querySelector('.process-timeline');
    if (!timeline || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    gsap.registerPlugin(ScrollTrigger);

    // 1. Inject or locate the progressive line fill element
    let progressLine = timeline.querySelector('.timeline-progress-line');
    if (!progressLine) {
      progressLine = document.createElement('div');
      progressLine.className = 'timeline-progress-line';
      timeline.prepend(progressLine);
    }

    // Progressive Line Drawing tied to scroll progress through the timeline
    gsap.fromTo(
      progressLine,
      { height: '0%' },
      {
        height: '92%',
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: 'top 70%',
          end: 'bottom 80%',
          scrub: 0.3,
        },
      }
    );

    // 2. Animate each timeline row individually with unique alternating effects
    const rows = timeline.querySelectorAll('.timeline-row');

    rows.forEach((row, index) => {
      const isLeft = row.classList.contains('timeline-row--left');
      const card = row.querySelector('.timeline-card');
      const node = row.querySelector('.node-circle');
      const media = row.querySelector('.timeline-media');
      const img = media ? media.querySelector('img') : null;

      // Card sub-elements for separate staggered animation
      const badge = card ? card.querySelector('.timeline-step-badge') : null;
      const title = card ? card.querySelector('h3') : null;
      const desc = card ? card.querySelector('p') : null;
      const ticks = card ? card.querySelectorAll('.ticks li') : [];

      const rowTl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 75%',
          once: true, // Appears smoothly once and stays visible without flickering
          onEnter: () => {
            if (node) node.classList.add('is-active');
          },
        },
      });

      // A. Center Circular Gold Marker scale-in from 0 to 1 with elastic bounce
      if (node) {
        rowTl.fromTo(
          node,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(1.7)' },
          0
        );
      }

      // B. Unique Image Reveal per Step
      if (media) {
        if (index === 0) {
          // STEP 01: Image slides in from the left with smooth reveal
          rowTl.fromTo(
            media,
            { x: -50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
            0.15
          );
          if (img) {
            rowTl.fromTo(img, { scale: 1.08 }, { scale: 1.0, duration: 1.2, ease: 'power2.out' }, 0.15);
          }
        } else if (index === 1) {
          // STEP 02: Image slides in from the right with smooth scale
          rowTl.fromTo(
            media,
            { x: 50, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9, ease: 'power2.out' },
            0.15
          );
          if (img) {
            rowTl.fromTo(img, { scale: 1.08 }, { scale: 1.0, duration: 1.2, ease: 'power2.out' }, 0.15);
          }
        } else if (index === 2) {
          // STEP 03: Image reveals with modern clip-path curtain unfold
          rowTl.fromTo(
            media,
            { clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)', opacity: 0.3 },
            { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', opacity: 1, duration: 1.1, ease: 'power3.out' },
            0.15
          );
        } else if (index === 3) {
          // STEP 04: Image fade-in with smooth scale down
          rowTl.fromTo(
            media,
            { scale: 0.92, opacity: 0 },
            { scale: 1.0, opacity: 1, duration: 0.9, ease: 'power2.out' },
            0.15
          );
        } else {
          // STEP 05+: Smooth directional slide & reveal
          rowTl.fromTo(
            media,
            { y: 35, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
            0.15
          );
        }
      }

      // C. Alternating Card & Text Stagger (Separately animated)
      if (card) {
        const cardX = window.innerWidth > 768 ? (isLeft ? -40 : 40) : 0;
        rowTl.fromTo(
          card,
          { x: cardX, y: 25, opacity: 0 },
          { x: 0, y: 0, opacity: 1, duration: 0.85, ease: 'power2.out' },
          0.1
        );

        if (badge) {
          rowTl.fromTo(badge, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, 0.25);
        }
        if (title) {
          rowTl.fromTo(title, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 0.35);
        }
        if (desc) {
          rowTl.fromTo(desc, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.6 }, 0.45);
        }
        if (ticks.length) {
          rowTl.fromTo(
            ticks,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
            0.55
          );
        }
      }
    });

    // Refresh ScrollTrigger calculations after all images are loaded
    window.addEventListener('load', () => {
      ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProcessTimelineAnimation);
  } else {
    initProcessTimelineAnimation();
  }
})();
