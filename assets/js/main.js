/* ============================================================
   Portfolio — Main JS
   Navigation, project filtering, active link highlighting
   ============================================================ */

(function () {
  'use strict';

  // ── Mobile Nav Toggle ──────────────────────────────────────
  const toggle  = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-links');

  if (toggle && navList) {
    toggle.addEventListener('click', () => {
      const open = navList.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });

    // Close when clicking outside the nav
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.nav')) {
        navList.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ── Mobile Projects Dropdown Toggle ───────────────────────
  document.querySelectorAll('.nav-item').forEach((item) => {
    const link     = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.nav-dropdown');
    if (!link || !dropdown) return;

    link.addEventListener('click', (e) => {
      // Only intercept on mobile (dropdown is CSS-driven on desktop)
      if (window.innerWidth <= 640) {
        e.preventDefault();
        item.classList.toggle('open');
      }
    });
  });

  // ── Project / Writing Filter ───────────────────────────────
  const filterBtns = document.querySelectorAll('.filter-btn');
  const filterCards = document.querySelectorAll('[data-category]');

  if (filterBtns.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;

        // Update active state
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        // Show / hide cards
        filterCards.forEach((card) => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  // ── Active Nav Link ────────────────────────────────────────
  const path = window.location.pathname;

  function pathMatchesHref(path, norm) {
    if (norm === 'index') return path === '/' || path === '/index.html';
    const segment = norm.split('/')[0]; // e.g. 'work', 'education', 'research'
    return path.includes('/' + segment + '/') || path.endsWith('/' + norm) || path.endsWith('/' + norm + '.html');
  }

  document.querySelectorAll('.nav-link[href]').forEach((link) => {
    const href = link.getAttribute('href');
    const norm = href.replace(/\.\.\//g, '').replace(/\.html$/, '');
    if (pathMatchesHref(path, norm)) {
      link.classList.add('active');
    }
  });

  // ── Copy to Clipboard ──────────────────────────────────────
  document.querySelectorAll('.copy-btn').forEach((btn) => {
    const original = btn.textContent;
    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(btn.dataset.copy).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = original; }, 1500);
      });
    });
  });

  // ── Tech Tag Renderer ──────────────────────────────────────
  // Reads data-tags="A,B,C,..." and renders the first LIMIT tags
  // into the element's .tech-tags container, appending "+N" if overflow.
  const TAG_LIMIT = 3;
  document.querySelectorAll('[data-tags]').forEach((el) => {
    const container = el.querySelector('.tech-tags');
    if (!container) return;
    const tags = el.dataset.tags.split(',').map((t) => t.trim()).filter(Boolean);
    container.innerHTML = '';
    tags.slice(0, TAG_LIMIT).forEach((tag) => {
      const s = document.createElement('span');
      s.className = 'tech-tag';
      s.textContent = tag;
      container.appendChild(s);
    });
    const overflow = tags.length - TAG_LIMIT;
    if (overflow > 0) {
      const s = document.createElement('span');
      s.className = 'tech-tag tech-tag--more';
      s.textContent = `+${overflow}`;
      container.appendChild(s);
    }
  });
})();
