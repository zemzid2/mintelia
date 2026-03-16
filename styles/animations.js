(function() {

  // ── SCROLL OBSERVER — fade up elements ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  // Expose globally so Cloudinary gallery can use it after loading
  window.minteliaObserver = observer;

  // Auto-observe common elements
  function observeElements() {
    const selectors = [
      '.fade-up', '.fade-left', '.fade-right', '.stagger',
      '.section-header', '.stat-item', '.ab-stat',
      '.service-card', '.testimonial-card', '.team-card',
      '.val-card', '.mv-card', '.catalogue-card',
      '.portfolio-item', '.port-item', '.rev-card',
      '.timeline-item', '.process-step', '.strip-item',
      '.about-images', '.about-content',
      '.svc-feature', '.pricing-card',
      '.other-card', '.related-card'
    ];

    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('fade-up') &&
            !el.classList.contains('fade-left') &&
            !el.classList.contains('fade-right')) {
          el.classList.add('fade-up');
        }
        observer.observe(el);
      });
    });

    // Stagger grids
    const staggerSelectors = [
      '.categories-grid', '.services-grid', '.testimonials-grid',
      '.team-grid', '.values-grid', '.related-grid',
      '.other-grid', '.stats-row', '.pricing-grid',
      '.process-steps', '.rev-grid', '.about-values'
    ];
    staggerSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.add('stagger');
        observer.observe(el);
      });
    });
  }

  // ── NAV SHRINK ON SCROLL ──
  function initNavShrink() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── HERO ANIMATION ──
  function initHeroAnimation() {
    const hero = document.querySelector('#hero, .page-hero');
    if (!hero) return;
    hero.classList.add('hero-animate');
  }

  // ── COUNTER ANIMATION for stats ──
  function animateCounter(el, target, duration) {
    const step = (timestamp) => {
      if (!el._start) el._start = timestamp;
      const progress = Math.min((timestamp - el._start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString() + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString() + (el.dataset.suffix || '');
    };
    requestAnimationFrame(step);
  }

  function initCounters() {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const text = el.textContent.replace(/[^0-9]/g, '');
          const suffix = el.textContent.replace(/[0-9,]/g, '').trim();
          const target = parseInt(text);
          if (!isNaN(target) && target > 0) {
            el.dataset.suffix = suffix;
            animateCounter(el, target, 1500);
          }
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-num, .ab-stat-num, .review-score').forEach(el => {
      counterObserver.observe(el);
    });
  }

  // ── SMOOTH ANCHOR SCROLL ──
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ── INIT ALL ──
  document.addEventListener('DOMContentLoaded', () => {
    observeElements();
    initNavShrink();
    initHeroAnimation();
    initCounters();
    initSmoothScroll();
  });

  // Fallback — show all elements after 1.5s if observer fails
  setTimeout(() => {
    document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
      el.classList.add('visible');
    });
    document.querySelectorAll('.stagger').forEach(el => {
      el.classList.add('visible');
    });
  }, 1500);

})();
