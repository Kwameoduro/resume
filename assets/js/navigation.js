/* ============================================================
   NAVIGATION JS — kwame-portfolio
   Handles: scroll state, active link, mobile toggle, component injection
   ============================================================ */

(function () {
  'use strict';

  /* ── 1. Inject navbar HTML into any page ── */
  async function injectNavbar() {
    const placeholder = document.getElementById('navbar-placeholder');
    if (!placeholder) return;

    try {
      const res  = await fetch('/components/navbar.html');
      const html = await res.text();
      placeholder.outerHTML = html;
      initNavbar();
    } catch (e) {
      console.warn('Navbar inject failed:', e);
    }
  }

  /* ── 2. Core navbar logic ── */
  function initNavbar() {
    const navbar     = document.getElementById('navbar');
    const hamburger  = document.getElementById('navHamburger');
    const mobileMenu = document.getElementById('navMobile');

    if (!navbar) return;

    /* Scroll: add .scrolled class */
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load

    /* Active link: match current page */
    const currentPage = getCurrentPage();
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.dataset.page === currentPage) {
        link.classList.add('active');
      }
    });

    /* Mobile toggle */
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        const isOpen = hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen);
      });

      /* Close mobile menu on outside click */
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        }
      });

      /* Close on mobile link click */
      document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('open');
          mobileMenu.classList.remove('open');
        });
      });
    }
  }

  /* ── 3. Determine current page from URL ── */
  function getCurrentPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop().replace('.html', '') || 'home';
    const map  = {
      '':           'home',
      'index':      'home',
      'resume':     'resume',
      'experience': 'experience',
      'projects':   'projects',
      'contact':    'contact',
    };
    return map[file] ?? file;
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectNavbar);
  } else {
    injectNavbar();
  }

})();