/**
 * PORTAL V2 JS — Conexão Inspirar
 * Comportamentos interativos fluidos e leves
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Controle de Abas da Jornada (Alunos vs Empresas)
  initJornadaTabs();

  // 2. Inicializar Filtro de Vitrine de Vagas
  initVagasFilter();

  // 3. Inicializar Carrossel de Depoimentos Reais
  initDepoimentosV2();
});

function initJornadaTabs() {
  const tabs = document.querySelectorAll('.segmented-btn');
  const panels = document.querySelectorAll('.jornada-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('data-target');

      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      panels.forEach(panel => {
        if (panel.id === targetId) {
          panel.classList.add('active');
        } else {
          panel.classList.remove('active');
        }
      });
    });
  });
}

function initVagasFilter() {
  const filterBtns = document.querySelectorAll('.vagas-pill-filter');
  const vagaCards = document.querySelectorAll('.vaga-preview-card');

  if (!filterBtns.length || !vagaCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      vagaCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'todas' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeUp 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function initDepoimentosV2() {
  const track = document.getElementById('depoimentosTrack');
  const prevBtn = document.getElementById('depoimentosPrev');
  const nextBtn = document.getElementById('depoimentosNext');
  const dotsContainer = document.getElementById('depoimentosDots');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.depoimento-card');
  if (!cards.length) return;

  // Gerar dots dinamicamente
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    cards.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = 'depoimentos-dot' + (idx === 0 ? ' active' : '');
      dot.setAttribute('aria-label', Ir para depoimento );
      dot.addEventListener('click', () => {
        const cardWidth = cards[0].getBoundingClientRect().width + 24;
        track.scrollTo({ left: idx * cardWidth, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    });
  }

  function updateActiveState() {
    const scrollLeft = track.scrollLeft;
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    const activeIndex = Math.round(scrollLeft / cardWidth);

    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.depoimentos-dot');
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIndex));
    }

    prevBtn.disabled = scrollLeft <= 10;
    nextBtn.disabled = scrollLeft >= (track.scrollWidth - track.clientWidth - 15);
  }

  prevBtn.addEventListener('click', () => {
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    const cardWidth = cards[0].getBoundingClientRect().width + 24;
    track.scrollBy({ left: cardWidth, behavior: 'smooth' });
  });

  track.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateActiveState);
  }, { passive: true });

  // Suporte a teclado
  track.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevBtn.click();
    if (e.key === 'ArrowRight') nextBtn.click();
  });

  updateActiveState();
}