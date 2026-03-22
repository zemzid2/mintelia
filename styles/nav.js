(function () {
  document.addEventListener('DOMContentLoaded', function () {

    const nav = document.querySelector('nav');
    if (!nav) return;

    const navLinks = nav.querySelector('.nav-links');
    const navCta = nav.querySelector('.nav-cta');
    if (!navLinks) return;

    // ── Inject hamburger button ──
    const hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);

    // ── Inject mobile menu ──
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile';

    const ul = document.createElement('ul');
    navLinks.querySelectorAll('a').forEach(link => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.href;
      a.textContent = link.textContent;
      if (link.classList.contains('active')) a.classList.add('active');
      li.appendChild(a);
      ul.appendChild(li);
    });
    mobileMenu.appendChild(ul);

    if (navCta) {
      const cta = document.createElement('a');
      cta.href = navCta.href;
      cta.className = 'nav-mobile-cta';
      cta.textContent = navCta.textContent;
      mobileMenu.appendChild(cta);
    }

    document.body.appendChild(mobileMenu);

    // ── Handle resize with smooth animation ──
    let isMobile = window.innerWidth <= 900;

    function setMobileState(mobile) {
      if (mobile === isMobile) return;
      isMobile = mobile;

      if (mobile) {
        // Widening → Narrowing: slide links out to the right, fade in hamburger
        navLinks.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        navCta.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        hamburger.style.transition = 'opacity 1.2s ease';

        navLinks.style.opacity = '0';
        navLinks.style.transform = 'translateX(20px)';
        navCta.style.opacity = '0';
        navCta.style.transform = 'translateX(20px)';
        hamburger.style.display = 'flex';
        hamburger.style.opacity = '0';

        setTimeout(() => {
          navLinks.style.pointerEvents = 'none';
          navLinks.style.position = 'absolute';
          navLinks.style.visibility = 'hidden';
          navCta.style.pointerEvents = 'none';
          navCta.style.position = 'absolute';
          navCta.style.visibility = 'hidden';
          hamburger.style.opacity = '1';
        }, 100);

      } else {
        // Narrowing → Widening: slide links back in, fade out hamburger
        navLinks.style.visibility = 'visible';
        navLinks.style.position = 'relative';
        navLinks.style.pointerEvents = 'all';
        navCta.style.visibility = 'visible';
        navCta.style.position = 'relative';
        navCta.style.pointerEvents = 'all';

        navLinks.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        navCta.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
        hamburger.style.transition = 'opacity 1.2s ease';

        setTimeout(() => {
          navLinks.style.opacity = '1';
          navLinks.style.transform = 'translateX(0)';
          navCta.style.opacity = '1';
          navCta.style.transform = 'translateX(0)';
          hamburger.style.opacity = '0';
        }, 50);

        setTimeout(() => {
          hamburger.style.display = 'none';
          closeMenu();
        }, 1250);
      }
    }

    // Set initial state without animation
    if (isMobile) {
      navLinks.style.opacity = '0';
      navLinks.style.transform = 'translateX(20px)';
      navLinks.style.pointerEvents = 'none';
      navLinks.style.position = 'absolute';
      navLinks.style.visibility = 'hidden';
      navCta.style.opacity = '0';
      navCta.style.transform = 'translateX(20px)';
      navCta.style.pointerEvents = 'none';
      navCta.style.position = 'absolute';
      navCta.style.visibility = 'hidden';
      hamburger.style.display = 'flex';
      hamburger.style.opacity = '1';
    } else {
      hamburger.style.display = 'none';
    }

    window.addEventListener('resize', function () {
      setMobileState(window.innerWidth <= 900);
    });

    // ── Toggle open/close ──
    function openMenu() {
      hamburger.classList.add('open');
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
      }
    });

    // ── Nav shrink on scroll ──
    window.addEventListener('scroll', function () {
    const scrolled = window.scrollY > 40;
    nav.classList.toggle('scrolled', scrolled);
    mobileMenu.style.top = scrolled ? '58px' : '72px';
    }, { passive: true });

  });
})();
