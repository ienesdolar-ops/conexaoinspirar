/* JORNADA MOTION — scroll-driven no desktop, auto-avanço + toque no mobile */
(function () {
  var root = document.getElementById('jornadaMotion');
  if (!root) return;
  var steps = root.querySelectorAll('.jm__step');
  var scenes = root.querySelectorAll('.jm__scene');
  var fill = root.querySelector('.jm__rail-fill');
  var stage = root.querySelector('.jm__stage');
  var urlB = root.querySelector('.jm__url b');
  var autobar = root.querySelector('.jm__autobar');
  var N = steps.length, current = -1;
  var urls = ['inspirar.com.br/inscricao', 'inspirar.com.br/meu-curso', 'conexao.inspirar.com.br/perfil', 'conexao.inspirar.com.br/vagas'];
  var glow = [['20%','15%'], ['75%','20%'], ['25%','70%'], ['70%','75%']];
  var mq = window.matchMedia('(max-width: 900px)');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AUTO_MS = 5200, autoTimer = null, visible = false;

  function setStep(i) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === current) return;
    current = i;
    steps.forEach(function (s, k) {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-done', k < i);
      s.setAttribute('aria-selected', k === i ? 'true' : 'false');
    });
    scenes.forEach(function (s, k) {
      s.classList.toggle('is-active', k === i);
      s.classList.toggle('is-past', k < i);
      s.setAttribute('aria-hidden', k === i ? 'false' : 'true');
    });
    if (urlB) urlB.textContent = urls[i] || '';
    stage.style.setProperty('--gx', glow[i][0]);
    stage.style.setProperty('--gy', glow[i][1]);
    root.classList.toggle('is-final', i === N - 1);
    if (mq.matches) fill.style.height = (i / (N - 1) * 100) + '%';
  }

  /* ---------- Desktop: progresso do scroll ---------- */
  function onScroll() {
    if (mq.matches) return;
    var r = root.getBoundingClientRect();
    var total = root.offsetHeight - window.innerHeight;
    var p = Math.max(0, Math.min(1, -r.top / total));
    if (p > 0.02) root.classList.add('has-scrolled');
    fill.style.height = (p * 100) + '%';
    setStep(Math.floor(p * N * 0.999));
  }
  function scrollToStep(i) {
    var total = root.offsetHeight - window.innerHeight;
    var top = root.getBoundingClientRect().top + window.scrollY + total * ((i + 0.5) / N);
    window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
  }

  /* ---------- Mobile: auto-avanço ---------- */
  function runAuto() {
    clearTimeout(autoTimer);
    if (!mq.matches || !visible || reduce) { autobar.classList.remove('is-running'); return; }
    autobar.classList.remove('is-running'); void autobar.offsetWidth; autobar.classList.add('is-running');
    autoTimer = setTimeout(function () { setStep((current + 1) % N); runAuto(); }, AUTO_MS);
  }

  steps.forEach(function (s, k) {
    function go() { if (mq.matches) { setStep(k); runAuto(); } else scrollToStep(k); }
    s.addEventListener('click', go);
    s.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); steps[Math.min(N - 1, k + 1)].focus(); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); steps[Math.max(0, k - 1)].focus(); }
    });
  });

  /* ---------- Tilt 3D do palco ---------- */
  if (!reduce && window.matchMedia('(hover: hover)').matches) {
    stage.addEventListener('mousemove', function (e) {
      var b = stage.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width - 0.5, y = (e.clientY - b.top) / b.height - 0.5;
      stage.style.transform = 'rotateY(' + (x * 7) + 'deg) rotateX(' + (-y * 7) + 'deg)';
    });
    stage.addEventListener('mouseleave', function () { stage.style.transform = ''; });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { visible = en[0].isIntersecting; runAuto(); }, { threshold: 0.35 }).observe(stage);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { onScroll(); runAuto(); });
  setStep(0);
  onScroll();
})();
