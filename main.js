/* ── Contact Modal Functions (global scope) ── */
function openContactModal() {
  document.getElementById('contactModal').classList.add('open');
  document.getElementById('modalBackdrop').classList.add('open');
  document.body.classList.add('modal-open');
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (form) form.style.display = '';
  if (success) success.style.display = 'none';
  setTimeout(() => {
    const first = document.getElementById('fname');
    if (first) first.focus();
  }, 420);
}

function closeContactModal() {
  document.getElementById('contactModal').classList.remove('open');
  document.getElementById('modalBackdrop').classList.remove('open');
  document.body.classList.remove('modal-open');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeContactModal();
});

/* ══════════════════════════════════════════
   DC Environmental Consultancy — main.js
   ══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Navbar Scroll ──────────────────────────────────
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  function closeNav() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
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
  const slides    = document.querySelectorAll('.carousel-slide');
  const dots      = document.querySelectorAll('.dot');
  const captionEl = document.getElementById('carouselCaptionText');
  let current     = 0;
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

  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  if (prevBtn) prevBtn.addEventListener('click', () => { clearInterval(autoplayTimer); goToSlide(current - 1); startAutoplay(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { clearInterval(autoplayTimer); goToSlide(current + 1); startAutoplay(); });

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

  if (slides.length > 0) startAutoplay();

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
          el.classList.add('visible');
           el.style.transitionDelay = '0s';
        });
      }
    });
  });

  // ── 3D Tilt Hover on Cards ────────────────────────
  function applyTilt(el) {
    el.addEventListener('mousemove', (e) => {
      const rect  = el.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const tiltX = dy * -5;
      const tiltY = dx *  5;
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
      const item   = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Contact Form — Web3Forms ──────────────────────
  const WEB3FORMS_KEY = '21d43280-583b-4503-b4f6-670901f26e56';

  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const fname   = document.getElementById('fname')?.value.trim();
      const lname   = document.getElementById('lname')?.value.trim();
      const email   = document.getElementById('memail')?.value.trim();
      const phone   = document.getElementById('mphone')?.value.trim();
      const service = document.getElementById('mservice')?.value.trim();
      const message = document.getElementById('mmessage')?.value.trim();

      if (!fname || !lname || !message) {
        alert('Please fill in First Name, Last Name, and Message.');
        return;
      }

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round" style="animation:spin 1s linear infinite;">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4
                   M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Sending...
      `;

      const formData = {
        access_key: WEB3FORMS_KEY,
        to: 'dcenviconsultancy@gmail.com',
        subject: `New Inquiry from ${fname} ${lname}${service ? ' — ' + service : ''}`,
        from_name: 'DC Environmental Website',
        replyto: email || '',
        'Full Name': `${fname} ${lname}`,
        'Email': email || 'Not provided',
        'Phone / WhatsApp': phone || 'Not provided',
        'Service Needed': service || 'Not specified',
        'Message': message,
        autoresponse: email ? 'true' : 'false',
        autoresponse_message: `Hi ${fname},\n\nThank you for reaching out to DC Environmental Consultancy Services!\n\nWe have received your inquiry and will get back to you as soon as possible via WhatsApp or email.\n\nFor urgent matters, you may also reach us at:\n📱 WhatsApp: +63 961 730 1048\n📧 Email: dcenviconsultancy@gmail.com\n\nBest regards,\nDC Environmental Consultancy Services\nTower 1, SMDC Sun Residences, España Blvd, Quezon City`,
        botcheck: '',
      };

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          contactForm.style.display = 'none';
          const success = document.getElementById('formSuccess');
          if (success) success.style.display = 'block';
        } else {
          throw new Error(result.message || 'Submission failed');
        }

      } catch (err) {
        console.error('Form error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        alert('Something went wrong. Please try WhatsApp or email us directly at dcenviconsultancy@gmail.com');
      }
    });
  }

  // ── Messenger Chat Widget ──────────────────────────
  const messengerBtn   = document.getElementById('messengerBtn');
  const messengerPopup = document.getElementById('messengerPopup');
  const messengerClose = document.getElementById('messengerClose');
  const messengerSend  = document.getElementById('messengerSend');
  const messengerInput = document.getElementById('messengerInput');

  if (messengerBtn) {
    messengerBtn.addEventListener('click', () => {
      messengerPopup.classList.toggle('hidden');
    });
  }
  if (messengerClose) {
    messengerClose.addEventListener('click', () => {
      messengerPopup.classList.add('hidden');
    });
  }
  if (messengerSend) {
    messengerSend.addEventListener('click', () => {
      const msg = messengerInput.value.trim();
      if (msg) {
        window.open('https://m.me/61554171736979', '_blank');
        messengerInput.value = '';
      }
    });
  }
  if (messengerInput) {
    messengerInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') messengerSend.click();
    });
  }

  if (messengerPopup) messengerPopup.classList.add('hidden');

  // ── Mobile Review Carousel ──────────────────────────
  function initReviewCarousel() {
    if (window.innerWidth > 768) return;

    const cards = Array.from(document.querySelectorAll('#testimonials .projects-grid .project-card'));
    if (!cards.length) return;

    let current = 0;

    function show(index) {
      cards.forEach(c => c.classList.remove('review-active'));
      cards[index].classList.add('review-active');
      current = index;
    }

    const nav = document.createElement('div');
    nav.className = 'review-nav';
    nav.innerHTML = `
      <button id="reviewPrev" aria-label="Previous review">&#8592;</button>
      <button id="reviewNext" aria-label="Next review">&#8594;</button>
    `;
    const grid = document.querySelector('#testimonials .projects-grid');
    if (grid) grid.after(nav);

    let timer = setInterval(() => show((current + 1) % cards.length), 5000);

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(() => show((current + 1) % cards.length), 5000);
    }

    nav.querySelector('#reviewNext').addEventListener('click', () => {
      show((current + 1) % cards.length);
      resetTimer();
    });
    nav.querySelector('#reviewPrev').addEventListener('click', () => {
      show((current - 1 + cards.length) % cards.length);
      resetTimer();
    });

    show(0);
  }

  initReviewCarousel();

}); // end DOMContentLoaded

// ── Spinner keyframe ──
const spinStyle = document.createElement('style');
spinStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
document.head.appendChild(spinStyle);
