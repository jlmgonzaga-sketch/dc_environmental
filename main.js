/* ══════════════════════════════════════════
   DC Environmental Consultancy — main.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Custom Cursor ──────────────────────────────────
  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  const label = document.getElementById('cursor-label');

  if (dot && ring && label) {
    let mouseX = 0, mouseY = 0;
    let ringX  = 0, ringY  = 0;
    let labelX = 0, labelY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    // Cursor label content per state
    const labelMap = { cta: 'Let\'s go', card: 'View' };

    // Smooth ring + label follow
    function animateRing() {
      ringX  += (mouseX - ringX)  * 0.12;
      ringY  += (mouseY - ringY)  * 0.12;
      labelX += (mouseX - labelX) * 0.12;
      labelY += (mouseY - labelY) * 0.12;
      ring.style.transform  = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${labelX + 18}px, ${labelY}px) translateY(-50%)`;
      requestAnimationFrame(animateRing);
    }
    animateRing();

    // Cursor states per element
    document.querySelectorAll('[data-cursor]').forEach(el => {
      el.addEventListener('mouseenter', () => {
        const state = el.dataset.cursor;
        document.body.className = document.body.className
          .split(' ').filter(c => !c.startsWith('cursor-')).join(' ');
        document.body.classList.add(`cursor-${state}`);
        label.textContent = labelMap[state] || '';
      });
      el.addEventListener('mouseleave', () => {
        document.body.className = document.body.className
          .split(' ').filter(c => !c.startsWith('cursor-')).join(' ');
        label.textContent = '';
      });
    });
  }

  // ── Navbar Scroll ──────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ── Active Nav Link on Scroll ──────────────────────
  const sections = document.querySelectorAll('section[id], div[id="home"]');
  const navItems = document.querySelectorAll('.nav-links a[href^="#"]');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          a.classList.remove('active-link');
          if (a.getAttribute('href') === `#${id}`) a.classList.add('active-link');
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  // ── Hero Image Carousel ────────────────────────────
  const slides   = document.querySelectorAll('.carousel-slide');
  const dots     = document.querySelectorAll('.dot');
  const captionEl = document.getElementById('carouselCaptionText');
  let current    = 0;
  let autoplayTimer;

  const captions = [
    'Environmental Consulting · Philippines',
    'Field Surveys & Assessments',
    'Construction Site Compliance',
    'Water Quality Monitoring'
  ];

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    if (captionEl) {
      captionEl.style.opacity = '0';
      setTimeout(() => {
        captionEl.textContent = captions[current] || '';
        captionEl.style.opacity = '1';
      }, 250);
    }
  }

  function startAutoplay() {
    autoplayTimer = setInterval(() => goToSlide(current + 1), 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoplayTimer);
      goToSlide(parseInt(dot.dataset.index));
      startAutoplay();
    });
  });

  // Prev / Next arrows
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoplayTimer); goToSlide(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoplayTimer); goToSlide(current + 1); startAutoplay(); });

  // Touch / swipe support
  const carouselBg = document.getElementById('carouselBg');
  if (carouselBg) {
    let touchStartX = 0;
    carouselBg.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    carouselBg.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        clearInterval(autoplayTimer);
        goToSlide(diff > 0 ? current + 1 : current - 1);
        startAutoplay();
      }
    });
    carouselBg.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
    carouselBg.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();

  // ── Fade-in Observer ──────────────────────────────
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach((el, i) => {
    el.style.transitionDelay = (i % 4) * 0.1 + 's';
    fadeObserver.observe(el);
  });

  // ── Services Tabs ──────────────────────────────────
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      document.querySelectorAll('.services-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      const panel = document.getElementById(btn.dataset.panel);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.fade-in').forEach(el => {
          el.classList.remove('visible');
          void el.offsetWidth;
          fadeObserver.observe(el);
        });
      }
    });
  });

  // ── 3D Tilt Hover on Cards ────────────────────────
  function applyTilt(el) {
    el.addEventListener('mousemove', (e) => {
      const rect   = el.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const tiltX  = dy * -5;   // max 5deg
      const tiltY  = dx *  5;
      el.style.transform = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      el.style.boxShadow = `${-dx * 8}px ${-dy * 8}px 30px rgba(26,74,46,0.18)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
      el.style.boxShadow = '';
      el.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
      setTimeout(() => { el.style.transition = ''; }, 500);
    });
  }

  document.querySelectorAll('.service-card, .project-card').forEach(applyTilt);

  // ── FAQ Accordion ─────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item     = btn.closest('.faq-item');
      const isOpen   = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Contact Form ───────────────────────────────────
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fname   = document.getElementById('fname').value.trim();
      const email   = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!fname || !email || !message) {
        alert('Please fill in all required fields.');
        return;
      }
      this.style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';
    });
  }

});