/* ===========================
   CONSULAB ODONTOLOGIA — JS
   =========================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR: scroll behavior ---- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    highlightActiveLink();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- NAVBAR: active link on scroll ---- */
  function highlightActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  /* ---- HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');

  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- SMOOTH SCROLL (for browsers without native support) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ---- SCROLL ANIMATIONS ---- */
  const animatedEls = document.querySelectorAll('.animate-on-scroll');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  animatedEls.forEach(el => observer.observe(el));

  /* ---- COUNTER ANIMATION ---- */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step     = 16;
    const increment = target / (duration / step);
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current);
      }
    }, step);
  }

  /* ---- TESTIMONIALS SLIDER ---- */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots   = document.querySelectorAll('.dot');
  let current  = 0;
  let autoInterval;

  function goToSlide(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    autoInterval = setInterval(() => goToSlide(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoInterval);
    startAuto();
  }

  document.getElementById('nextBtn').addEventListener('click', () => { goToSlide(current + 1); resetAuto(); });
  document.getElementById('prevBtn').addEventListener('click', () => { goToSlide(current - 1); resetAuto(); });

  dots.forEach(dot => {
    dot.addEventListener('click', () => { goToSlide(parseInt(dot.dataset.index, 10)); resetAuto(); });
  });

  startAuto();

  /* ---- CONTACT FORM VALIDATION ---- */
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const formFeedback = document.getElementById('formFeedback');

  function validateField(id, errorId, check, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(errorId);
    if (!check(input.value.trim())) {
      input.classList.add('error');
      error.textContent = message;
      return false;
    }
    input.classList.remove('error');
    error.textContent = '';
    return true;
  }

  function clearErrors() {
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      el.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(el => { el.textContent = ''; });
    formFeedback.className = 'form-feedback';
    formFeedback.textContent = '';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const nome      = document.getElementById('nome').value.trim();
    const email     = document.getElementById('email').value.trim();
    const telefone  = document.getElementById('telefone').value.trim();
    const mensagem  = document.getElementById('mensagem').value.trim();
    const servico   = document.getElementById('servico').value;

    let valid = true;

    if (!validateField('nome', 'nomeError', v => v.length >= 3, 'Por favor, informe seu nome completo.')) valid = false;
    if (!validateField('email', 'emailError', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Informe um e-mail válido.')) valid = false;
    if (!validateField('telefone', 'telefoneError', v => v.replace(/\D/g,'').length >= 10, 'Informe um telefone válido.')) valid = false;
    if (!validateField('mensagem', 'mensagemError', v => v.length >= 10, 'Sua mensagem deve ter pelo menos 10 caracteres.')) valid = false;

    if (!valid) return;

    /* Simulate send & redirect to WhatsApp */
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Enviando...';

    setTimeout(() => {
      const servicoText = servico ? ` — Serviço: ${document.getElementById('servico').options[document.getElementById('servico').selectedIndex].text}` : '';
      const msg = encodeURIComponent(
        `Olá! Meu nome é ${nome}.${servicoText}\n\n${mensagem}\n\nTelefone: ${telefone}\nE-mail: ${email}`
      );
      window.open(`https://wa.me/5547999999999?text=${msg}`, '_blank');

      formFeedback.textContent = '✅ Mensagem enviada! Você será redirecionado para o WhatsApp.';
      formFeedback.className = 'form-feedback success';
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Enviar mensagem';
    }, 1200);
  });

  /* Live phone mask */
  const phoneInput = document.getElementById('telefone');
  phoneInput.addEventListener('input', () => {
    let v = phoneInput.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 6) {
      v = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
    } else if (v.length > 2) {
      v = `(${v.substring(0,2)}) ${v.substring(2)}`;
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    phoneInput.value = v;
  });

  /* ---- FOOTER YEAR ---- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
