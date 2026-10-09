'use strict';

(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById('theme');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  function syncTheme() {
    const dark = root.dataset.theme === 'dark';
    themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`);
    themeMeta.content = dark ? '#121314' : '#f3f1eb';
  }
  syncTheme();
  themeButton.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch (_) { /* Optional persistence. */ }
    syncTheme();
  });

  const menuButton = document.getElementById('menu-toggle');
  const navigation = document.getElementById('navigation');
  function closeMenu() {
    navigation.classList.remove('is-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  }
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', `${open ? 'Close' : 'Open'} navigation`);
  });
  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('is-open')) {
      closeMenu();
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('#nav')) closeMenu();
  });
  matchMedia('(min-width: 801px)').addEventListener('change', closeMenu);

  const progress = document.getElementById('scroll-progress');
  let scrollPending = false;
  function updateScroll() {
    const length = root.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${length > 0 ? Math.min(1, scrollY / length) : 0})`;
    scrollPending = false;
  }
  addEventListener('scroll', () => {
    if (!scrollPending) {
      scrollPending = true;
      requestAnimationFrame(updateScroll);
    }
  }, { passive: true });
  addEventListener('resize', updateScroll);
  updateScroll();

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          entry.target.classList.remove('reveal-pending');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { rootMargin: '0px 0px -30px 0px' });
    document.querySelectorAll('.reveal').forEach((element) => {
      // Content remains visible without JavaScript, and above-the-fold content never waits.
      if (!reducedMotion.matches && element.getBoundingClientRect().top >= innerHeight) {
        element.classList.add('reveal-pending');
        revealObserver.observe(element);
      }
    });
    const links = [...navigation.querySelectorAll('a')];
    const sectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        links.forEach((link) => {
          const active = link.hash === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -65% 0px' });
    document.querySelectorAll('main section').forEach((section) => sectionObserver.observe(section));
  }
  document.getElementById('yr').textContent = new Date().getFullYear();
})();
