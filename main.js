/* ==========================================================
   CARTLY — interactions
========================================================== */
(function () {
  'use strict';

  // -------------------- Mobile menu --------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mmClose = document.getElementById('mmClose');

  function openMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (menuToggle) menuToggle.addEventListener('click', openMenu);
  if (mmClose) mmClose.addEventListener('click', closeMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  }

  // -------------------- Hero slider --------------------
  const heroTrack = document.getElementById('heroTrack');
  const heroDotsEl = document.getElementById('heroDots');
  const heroPrev = document.getElementById('heroPrev');
  const heroNext = document.getElementById('heroNext');

  if (heroTrack && heroDotsEl) {
    const slides = heroTrack.children.length;
    let idx = 0;
    let timer;

    // build dots
    for (let i = 0; i < slides; i++) {
      const b = document.createElement('button');
      b.setAttribute('aria-label', `Go to slide ${i + 1}`);
      if (i === 0) b.classList.add('active');
      b.addEventListener('click', () => goTo(i));
      heroDotsEl.appendChild(b);
    }
    const dots = heroDotsEl.querySelectorAll('button');

    function goTo(i) {
      idx = (i + slides) % slides;
      heroTrack.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach((d, di) => d.classList.toggle('active', di === idx));
    }
    function start() {
      stop();
      timer = setInterval(() => goTo(idx + 1), 5000);
    }
    function stop() { if (timer) clearInterval(timer); }

    if (heroPrev) heroPrev.addEventListener('click', () => { goTo(idx - 1); start(); });
    if (heroNext) heroNext.addEventListener('click', () => { goTo(idx + 1); start(); });

    // Pause on hover
    const heroEl = document.getElementById('hero');
    if (heroEl) {
      heroEl.addEventListener('mouseenter', stop);
      heroEl.addEventListener('mouseleave', start);
    }

    // Touch swipe
    let startX = 0, deltaX = 0;
    heroTrack.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; stop(); }, { passive: true });
    heroTrack.addEventListener('touchmove', (e) => { deltaX = e.touches[0].clientX - startX; }, { passive: true });
    heroTrack.addEventListener('touchend', () => {
      if (Math.abs(deltaX) > 50) goTo(idx + (deltaX < 0 ? 1 : -1));
      deltaX = 0;
      start();
    });

    start();
  }

  // -------------------- Flash sale countdown --------------------
  const th = document.getElementById('th');
  const tm = document.getElementById('tm');
  const ts = document.getElementById('ts');
  if (th && tm && ts) {
    // 5h 17m 59s from now
    let total = 5 * 3600 + 17 * 60 + 59;
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      if (total <= 0) total = 6 * 3600;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      th.textContent = pad(h);
      tm.textContent = pad(m);
      ts.textContent = pad(s);
      total -= 1;
    };
    tick();
    setInterval(tick, 1000);
  }

  // -------------------- Wishlist toggle --------------------
  document.querySelectorAll('.fav-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      // burst
      btn.style.transform = 'scale(1.3)';
      setTimeout(() => { btn.style.transform = ''; }, 200);
    });
  });

  // -------------------- Cart bump (visual) --------------------
  const cartCount = document.getElementById('cartCount');
  function bumpCart() {
    if (!cartCount) return;
    cartCount.textContent = String(parseInt(cartCount.textContent || '0', 10) + 1);
    cartCount.style.transform = 'scale(1.4)';
    setTimeout(() => { cartCount.style.transform = ''; }, 250);
  }

  // -------------------- Reveal on scroll --------------------
  const revealEls = document.querySelectorAll(
    '.cats, .feature, .card, .banner-card, .trust-item, .block, .flash'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 30);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  // -------------------- PDP gallery / sizes --------------------
  document.querySelectorAll('[data-gallery] [data-thumb]').forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const main = document.querySelector('[data-main]');
      if (!main) return;
      main.style.opacity = '0';
      setTimeout(() => {
        main.src = thumb.dataset.thumb;
        main.style.opacity = '';
      }, 200);
      document.querySelectorAll('[data-thumb]').forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  document.querySelectorAll('[data-size]').forEach((b) => {
    b.addEventListener('click', () => {
      if (b.disabled) return;
      document.querySelectorAll('[data-size]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  document.querySelectorAll('[data-color]').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-color]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    });
  });

  // PDP add to cart
  const addBtn = document.getElementById('addToCart');
  if (addBtn) {
    const original = addBtn.innerHTML;
    addBtn.addEventListener('click', () => {
      bumpCart();
      addBtn.innerHTML = '<span>Added to Cart ✓</span>';
      addBtn.disabled = true;
      setTimeout(() => {
        addBtn.innerHTML = original;
        addBtn.disabled = false;
      }, 1800);
    });
  }

  // Accordion
  document.querySelectorAll('.acc-head').forEach((h) => {
    h.addEventListener('click', () => h.parentElement.classList.toggle('open'));
  });

  // Filter buttons (visual)
  document.querySelectorAll('[data-filter]').forEach((b) => {
    b.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
    });
  });
})();
