import fs from 'fs';

const gate = process.argv[2];

function checkG1() {
  const css = fs.readFileSync('css/portal.css', 'utf8');
  // Hero must have split gradient: solid left half (48%), smooth ramp to transparent right
  const hasSplit = css.includes('var(--bg) 0%') && css.includes('var(--bg) 48%') && css.includes('transparent 85%');
  const hasDarkSplit = css.includes('#080808 0%') && css.includes('#080808 48%');
  if (hasSplit && hasDarkSplit) {
    console.log('HERO_GRADIENT_OK');
  } else {
    console.log('FAIL G1: Hero split gradient not properly configured in portal.css');
  }
}

function checkG2() {
  const cssPortal = fs.readFileSync('css/portal.css', 'utf8');
  // jstep__media must have fixed uniform basis/width, hover container expansion must be disabled
  const hasFixedMedia = cssPortal.includes('.jstep__media') && cssPortal.includes('flex-basis: 200px') && cssPortal.includes('width: 200px');
  const hasHoverLock = cssPortal.includes('.jstep__card:hover .jstep__media') && cssPortal.includes('flex-basis: 200px');
  const hasImgZoom = cssPortal.includes('.jstep__card:hover .jstep__img') && cssPortal.includes('scale(1.08)');
  if (hasFixedMedia && hasHoverLock && hasImgZoom) {
    console.log('JSTEP_SIZE_OK');
  } else {
    console.log('FAIL G2: Journey media standardization or hover lock missing');
  }
}

function checkG3() {
  const html = fs.readFileSync('index.html', 'utf8');
  // Step 3 card must NOT have featured class or Destaque label
  const s3Card = html.substring(html.indexOf('Personalize seu Perfil') - 350, html.indexOf('Personalize seu Perfil'));
  const step3HasFeatured = s3Card.includes('jstep__card--featured');
  const step3HasDestaqueText = html.includes('Etapa 3 de 4 · Destaque');

  // Step 4 card MUST have featured class and Destaque label
  const s4Card = html.substring(html.indexOf('Candidate-se e Seja Contratado') - 350, html.indexOf('Candidate-se e Seja Contratado'));
  const step4HasFeatured = s4Card.includes('jstep__card--featured');
  const step4HasDestaqueText = html.includes('Etapa 4 de 4 · Destaque');

  if (!step3HasFeatured && !step3HasDestaqueText && step4HasFeatured && step4HasDestaqueText) {
    console.log('FEATURED_SWAP_OK');
  } else {
    console.log('FAIL G3: Journey highlight not swapped from Step 3 to Step 4');
  }
}

function checkG4() {
  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('css/portal.css', 'utf8');
  // Standardized badge-disponivel or tag--disponivel
  const hasDisponivelCss = css.includes('.tag--disponivel') || css.includes('.badge-disponivel');
  // High contrast contratado
  const hasHighContrastContratado = css.includes('.badge-contratado') && (css.includes('#713f12') || css.includes('#854d0e') || css.includes('#065f46') || css.includes('#ffffff'));
  // In index.html, both available talent rows must use the unified disponivel tag
  const noPurpleDisponivel = !html.includes('tag--formado" style="margin-left:auto;font-size:10px">Disponível');
  const noBlueDisponivel = !html.includes('tag--estudante" style="margin-left:auto;font-size:10px">Disponível');
  const hasUnifiedDisponivel = html.includes('tag--disponivel" style="margin-left:auto;font-size:10px">Disponível') || html.includes('badge-disponivel" style="margin-left:auto;font-size:10px">Disponível');

  if (hasDisponivelCss && hasHighContrastContratado && noPurpleDisponivel && noBlueDisponivel && hasUnifiedDisponivel) {
    console.log('BADGES_OK');
  } else {
    console.log('FAIL G4: Badges not meeting contrast or uniformity criteria');
  }
}

function checkG5() {
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const hasEnlargedLogo = css.includes('.footer-brand__name .logo-img') && (css.includes('height: 52px') || css.includes('height: 48px'));
  if (hasEnlargedLogo) {
    console.log('FOOTER_LOGO_OK');
  } else {
    console.log('FAIL G5: Footer logo not enlarged');
  }
}

function checkG6() {
  const js = fs.readFileSync('js/portal.js', 'utf8');
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const hasJsToggle = js.includes('toggleVagaDesc') || js.includes('vaga-card__toggle-desc');
  const hasCssToggle = css.includes('.vaga-card__toggle-desc') && css.includes('.vaga-card__desc');
  if (hasJsToggle && hasCssToggle) {
    console.log('VACANCY_EXPAND_OK');
  } else {
    console.log('FAIL G6: Vacancy expandable toggle not implemented');
  }
}

function checkG7() {
  const html = fs.readFileSync('painel.html', 'utf8');
  const js = fs.readFileSync('js/portal.js', 'utf8');
  const hasCleanWa = html.includes('<label class="form-label" for="perfilWhatsapp">WhatsApp</label>');
  const noLongWa = !html.includes('WhatsApp para contato de recrutadores');
  const hasVerCurriculo = html.includes('Ver Currículo');
  const hasBaixarCurriculo = html.includes('Baixar Currículo');
  const hasTrocarCurriculo = html.includes('Trocar Currículo');
  const noPdfInTitle = !html.includes('Currículo Profissional em PDF');
  const jsCurriculoName = js.includes("curriculoCardName.textContent = 'Currículo'") || js.includes('curriculoCardName.textContent = "Currículo"');

  if (hasCleanWa && noLongWa && hasVerCurriculo && hasBaixarCurriculo && hasTrocarCurriculo && noPdfInTitle && jsCurriculoName) {
    console.log('PAINEL_LABELS_OK');
  } else {
    console.log('FAIL G7: Form labels or Curriculo terminology incomplete');
  }
}

function checkG8() {
  const files = ['index.html', 'painel.html', 'css/portal.css', 'js/portal.js'];
  let clean = true;
  for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('Ã©') || c.includes('Ã£') || c.includes('Ã¡') || c.includes('Ã³') || c.includes('Ãª') || c.includes('Ã§') || c.includes('â”')) {
      clean = false;
      console.log('Corrupted:', f);
      break;
    }
  }
  if (clean) {
    console.log('ENCODING_CLEAN');
  } else {
    console.log('ENCODING_ERROR');
  }
}

switch (gate) {
  case 'G1': checkG1(); break;
  case 'G2': checkG2(); break;
  case 'G3': checkG3(); break;
  case 'G4': checkG4(); break;
  case 'G5': checkG5(); break;
  case 'G6': checkG6(); break;
  case 'G7': checkG7(); break;
  case 'G8': checkG8(); break;
  default:
    console.log('UNKNOWN GATE');
    process.exit(1);
}
