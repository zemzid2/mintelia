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

    // ── Close on link click ──
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // ── Close on outside click ──
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        closeMenu();
      }
    });

    // ── Close on resize back to desktop ──
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });

    // ── Nav shrink on scroll ──
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

  });
})();
