window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAVBAR: scroll ---- */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    highlightActive();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function highlightActive() {
    const pos = window.scrollY + (navbar.offsetHeight + 24);
    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) {
        navLinks.forEach(l => l.classList.remove('active'));
        const a = document.querySelector(`.nav__link[href="#${sec.id}"]`);
        if (a) a.classList.add('active');
      }
    });
  }

  /* ---- HAMBURGER ---- */
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  hamburger.addEventListener('click', () => {
    const open = nav.classList.toggle('active');
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', String(open));
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- SCROLL ANIMATIONS ---- */
  const animEls = document.querySelectorAll('.animate-on-scroll');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  animEls.forEach(el => io.observe(el));

  /* ---- COUNTERS ---- */
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        counterIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterIO.observe(c));

  function runCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const step = 16;
    const inc = target / (duration / step);
    let cur = 0;
    const t = setInterval(() => {
      cur += inc;
      if (cur >= target) { el.textContent = target; clearInterval(t); }
      else { el.textContent = Math.floor(cur); }
    }, step);
  }

  /* ---- TESTIMONIALS SLIDER ---- */
  const slides   = document.querySelectorAll('.testimonial-card');
  const dotsWrap = document.getElementById('testimonialsDots');
  let current    = 0;
  let auto;

  // Build dots
  if (dotsWrap && slides.length) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'testimonials__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Depoimento ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    });
  }

  function getDots() { return document.querySelectorAll('.testimonials__dot'); }

  function goTo(index) {
    slides[current].classList.remove('active');
    getDots()[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    getDots()[current]?.classList.add('active');
  }

  function startAuto() { auto = setInterval(() => goTo(current + 1), 5000); }
  function resetAuto()  { clearInterval(auto); startAuto(); }

  document.getElementById('prevBtn')?.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  document.getElementById('nextBtn')?.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  startAuto();

  /* ---- CONTACT FORM ---- */
  const form      = document.getElementById('contatoForm');
  const submitBtn = document.getElementById('submitBtn');

  function fieldError(inputId, errorId, ok, msg) {
    const el  = document.getElementById(inputId);
    const err = document.getElementById(errorId);
    if (!el) return true;
    if (!ok(el.value.trim())) {
      el.classList.add('error');
      if (err) err.textContent = msg;
      return false;
    }
    el.classList.remove('error');
    if (err) err.textContent = '';
    return true;
  }

  form?.addEventListener('submit', e => {
    e.preventDefault();

    const v1 = fieldError('nome',     'nomeError',     v => v.length >= 3,                              'Informe seu nome completo.');
    const v2 = fieldError('email',    'emailError',    v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),      'Informe um e-mail válido.');
    const v3 = fieldError('telefone', 'telefoneError', v => v.replace(/\D/,'').length >= 10,            'Informe um telefone válido.');
    const v4 = fieldError('mensagem', 'mensagemError', v => v.length >= 10,                             'Mensagem muito curta.');
    if (!v1 || !v2 || !v3 || !v4) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';

    setTimeout(() => {
      const nome     = document.getElementById('nome').value.trim();
      const telefone = document.getElementById('telefone').value.trim();
      const email    = document.getElementById('email').value.trim();
      const servico  = (() => { const s = document.getElementById('servico'); return s?.options[s.selectedIndex]?.text || ''; })();
      const mensagem = document.getElementById('mensagem').value.trim();

      const txt = encodeURIComponent(
        `Olá! Me chamo ${nome}.${servico && servico !== 'Selecione um serviço' ? ` Tenho interesse em: ${servico}.` : ''}\n\n${mensagem}\n\nTelefone: ${telefone}\nE-mail: ${email}`
      );
      window.open(`https://wa.me/5547999999999?text=${txt}`, '_blank');

      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Enviar mensagem';
    }, 1000);
  });

  /* Phone mask */
  document.getElementById('telefone')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 11);
    if (v.length > 7)      v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length)     v = `(${v}`;
    this.value = v;
  });

  /* ---- FOOTER YEAR ---- */
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();

});
