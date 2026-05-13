/* ============================================
   AZZURRA MARINA — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar scroll effect ──────────────────
  const navbar = document.getElementById('navbar');

  const handleNavScroll = () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });

  // ── Mobile nav toggle ─────────────────────
  const navToggle = document.getElementById('navToggle');
  const navMenu   = document.getElementById('navMenu');

  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close menu when a link is clicked
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ── Active nav link on scroll ─────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  const updateActiveLink = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) current = section.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });

  // ── Scroll reveal (IntersectionObserver) ──
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings within the same parent
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        let delay = 0;
        siblings.forEach(sib => {
          if (sib === entry.target) return;
          if (!sib.classList.contains('visible')) delay += 0.1;
        });
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);

        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── Staggered reveal for grids ────────────
  const staggerContainers = document.querySelectorAll('.boats-grid, .features-grid, .testi-grid, .info-items');

  const staggerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const children = entry.target.children;
        Array.from(children).forEach((child, i) => {
          child.style.opacity = '0';
          child.style.transform = 'translateY(30px)';
          child.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
          requestAnimationFrame(() => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'none';
            }, 50);
          });
        });
        staggerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  staggerContainers.forEach(el => staggerObserver.observe(el));

  // ── Catalogo tabs ─────────────────────────
  const catTabs   = document.querySelectorAll('.cat-tab');
  const catPanels = document.querySelectorAll('.cat-panel');

  catTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.dataset.cat;

      catTabs.forEach(t => t.classList.remove('active'));
      catPanels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.querySelector(`.cat-panel[data-cat="${cat}"]`);
      if (panel) {
        panel.classList.add('active');
        // Re-trigger stagger on panel children
        const grid = panel.querySelector('.boats-grid');
        if (grid) {
          const cards = grid.querySelectorAll('.boat-card');
          cards.forEach((card, i) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = `opacity 0.4s ease ${i * 0.1}s, transform 0.4s ease ${i * 0.1}s`;
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'none';
            }, 30);
          });
        }
      }
    });
  });

  // ── Contact form ──────────────────────────
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      btn.style.opacity = '0.7';
      btn.style.pointerEvents = 'none';

      // Simulate async send
      setTimeout(() => {
        formSuccess.style.display = 'block';
        form.reset();
        btn.style.opacity = '1';
        btn.style.pointerEvents = '';

        setTimeout(() => {
          formSuccess.style.display = 'none';
        }, 5000);
      }, 1200);
    });
  }

  // ── Parallax on hero image ────────────────
  const heroImg = document.querySelector('.hero-img');

  if (heroImg) {
    const parallaxHero = () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImg.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
      }
    };
    window.addEventListener('scroll', parallaxHero, { passive: true });
  }

  // ── Smooth anchor scrolling ───────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── Number counter animation ──────────────
  const counters = document.querySelectorAll('.badge-num');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el   = entry.target;
        const text = el.textContent;
        const num  = parseInt(text);
        const suffix = text.replace(/[0-9]/g, '');

        if (!isNaN(num)) {
          let current = 0;
          const step = Math.ceil(num / 40);
          const interval = setInterval(() => {
            current = Math.min(current + step, num);
            el.textContent = current + suffix;
            if (current >= num) clearInterval(interval);
          }, 40);
        }
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObserver.observe(el));

  // ── Cursor glow effect (desktop only) ────
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed; pointer-events: none; z-index: 9999;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%);
      transform: translate(-50%, -50%);
      transition: transform 0.1s ease;
      top: -200px; left: -200px;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  // ── Nettuno sub-tabs ──────────────────────
  document.querySelectorAll('.nsub-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.nsub;
      document.querySelectorAll('.nsub-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.nsub-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.querySelector(`.nsub-panel[data-nsub="${target}"]`);
      if (panel) {
        panel.classList.add('active');
        const kids = panel.querySelectorAll('.ndspec-item, .material-item');
        kids.forEach((k, i) => {
          k.style.opacity = '0';
          k.style.transform = 'translateX(-12px)';
          k.style.transition = `opacity 0.35s ease ${i * 0.06}s, transform 0.35s ease ${i * 0.06}s`;
          setTimeout(() => { k.style.opacity = '1'; k.style.transform = 'none'; }, 30);
        });
      }
    });
  });

});

// ── Nettuno Modal ─────────────────────────
function openNettuno() {
  const modal = document.getElementById('nettunoModal');
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNettuno(event) {
  // Close only if clicking backdrop or close button (not inner content)
  if (event && event.target !== document.getElementById('nettunoModal')) return;
  const modal = document.getElementById('nettunoModal');
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('nettunoModal');
    if (modal && modal.classList.contains('open')) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
});
