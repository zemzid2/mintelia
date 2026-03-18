(function () {

  document.addEventListener('DOMContentLoaded', function () {

    const nav = document.querySelector('nav');
    if (!nav) return;

    // ── Inject hamburger button ──
    const hamburger = document.createElement('button');
    hamburger.className = 'nav-hamburger';
    hamburger.setAttribute('aria-label', 'Toggle menu');
    hamburger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(hamburger);

    // ── Inject mobile menu ──
    const navLinks = nav.querySelector('.nav-links');
    const navCta = nav.querySelector('.nav-cta');

    if (!navLinks) return;

    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'nav-mobile';

    // Clone links
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

    // Clone CTA button
    if (navCta) {
      const cta = document.createElement('a');
      cta.href = navCta.href;
      cta.className = 'nav-mobile-cta';
      cta.textContent = navCta.textContent;
      mobileMenu.appendChild(cta);
    }

    document.body.appendChild(mobileMenu);

    // ── Toggle ──
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // ── Close on link click ──
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // ── Close on outside click ──
    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

  });

})();
