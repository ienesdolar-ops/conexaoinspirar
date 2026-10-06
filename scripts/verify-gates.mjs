import fs from 'fs';

const gate = process.argv[2];

function checkG1() {
  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const hasHeroMedia = html.includes('hero-media') && html.includes('hero.jpg');
  const hasHeroGrid = css.includes('hero-container');
  const hasPhotoEmphasis = css.includes('hero-media') && (css.includes('hero-shape') || css.includes('hero-media__frame') || css.includes('clip-path') || css.includes('border-radius'));
  if (hasHeroMedia && hasHeroGrid && hasPhotoEmphasis) {
    console.log('HERO_PHOTO_EMPHASIS_OK');
  } else {
    console.error('FAIL G1: Hero photo emphasis structure missing in index.html or portal.css');
    process.exit(1);
  }
}

function checkG2() {
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const hasSquareRatio = css.includes('aspect-ratio: 1 / 1') || css.includes('aspect-ratio: 1/1');
  const hasFixedSquareDims = (css.includes('width: 170px') && css.includes('height: 170px')) || (css.includes('width: 180px') && css.includes('height: 180px')) || (css.includes('width: 160px') && css.includes('height: 160px'));
  const hasUniformMedia = css.includes('.jstep__media');
  if ((hasSquareRatio || hasFixedSquareDims) && hasUniformMedia) {
    console.log('JSTEP_SQUARE_PHOTOS_OK');
  } else {
    console.error('FAIL G2: Journey photos not configured in uniform square format');
    process.exit(1);
  }
}

function checkG3() {
  const html = fs.readFileSync('painel.html', 'utf8');
  const js = fs.readFileSync('js/portal.js', 'utf8');
  const noSizeInHtml = !html.includes('curriculoCardSize') && !html.includes('Documento Anexado') && !html.includes('185 KB');
  const noSizeInJs = !js.includes('curriculoCardSize.textContent');
  if (noSizeInHtml && noSizeInJs) {
    console.log('CURRICULO_NO_SIZE_OK');
  } else {
    console.error('FAIL G3: File size display still present in painel.html or portal.js');
    process.exit(1);
  }
}

function checkG4() {
  const html = fs.readFileSync('painel.html', 'utf8');
  const noDisponivelTag = !html.includes('Disponível para Empresas');
  if (noDisponivelTag) {
    console.log('CURRICULO_NO_DISPONIVEL_TAG_OK');
  } else {
    console.error('FAIL G4: Disponível para empresas tag still present in painel.html');
    process.exit(1);
  }
}

function checkG5() {
  const html = fs.readFileSync('painel.html', 'utf8');
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const cardStart = html.indexOf('id="curriculoCard"');
  const cardEnd = html.indexOf('id="perfilFeedback"');
  const cardBlock = (cardStart !== -1 && cardEnd !== -1) ? html.substring(cardStart, cardEnd) : '';
  const trashInsideCard = cardBlock.includes('btnRemoverPDF');
  const cssContained = css.includes('.curriculo-card__actions') && (css.includes('flex-wrap: wrap') || css.includes('.curriculo-card {') && css.includes('flex-wrap: wrap'));
  if (trashInsideCard && cssContained) {
    console.log('CURRICULO_CONTAINED_OK');
  } else {
    console.error('FAIL G5: Currículo action buttons or trash icon not properly contained in card');
    process.exit(1);
  }
}

function checkG6() {
  const files = ['index.html', 'painel.html', 'css/portal.css', 'js/portal.js', 'css/design-system.css', 'DESIGN_SYSTEM.md'];
  let clean = true;
  for (const f of files) {
    const c = fs.readFileSync(f, 'utf8');
    if (c.includes('Ã©') || c.includes('Ã£') || c.includes('Ã¡') || c.includes('Ã³') || c.includes('Ãª') || c.includes('Ã§') || c.includes('â”')) {
      clean = false;
      console.error('Corrupted UTF-8 in file:', f);
      break;
    }
  }
  if (clean) {
    console.log('ENCODING_CLEAN');
  } else {
    console.error('FAIL G6: Encoding issues found');
    process.exit(1);
  }
}

function checkG7() {
  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const barNotInHtml = !html.includes('hero-features-bar') && !html.includes('hero-feature-item');
  const barNotInCss = !css.includes('.hero-features-bar {') && !css.includes('.hero-feature-item {');
  if (barNotInHtml && barNotInCss) {
    console.log('HERO_FEATURES_BAR_REMOVED_OK');
  } else {
    console.error('FAIL G7: hero-features-bar still found in index.html or css/portal.css');
    process.exit(1);
  }
}

function checkG8() {
  const html = fs.readFileSync('index.html', 'utf8');
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const frameClipped = css.includes('clip-path: url(#heroOrganicMask)') || css.includes('-webkit-clip-path: url(#heroOrganicMask)');
  const hasGlowInFrame = html.includes('hero-photo-glow') && (html.indexOf('hero-photo-glow') > html.indexOf('class="hero-media__frame"'));
  const noOuterShapes = !html.includes('hero-shape hero-shape--bottom-left');
  if (frameClipped && hasGlowInFrame && noOuterShapes) {
    console.log('PURPLE_GLOW_CONFINED_TO_PHOTO_OK');
  } else {
    console.error('FAIL G8: Purple glow not confined strictly inside hero-media__frame');
    process.exit(1);
  }
}

function checkG9() {
  const css = fs.readFileSync('css/portal.css', 'utf8');
  const usesSerif = css.includes('.hero-title em') && (css.includes('var(--font-serif)') && !css.includes('font-family: inherit'));
  const usesItalic = css.includes('.hero-title em') && (css.includes('font-style: italic') && !css.includes('font-style: normal'));
  const usesBrandGradient = css.includes('.hero-title em') && (css.includes('var(--brand-gradient)') && !css.includes('#4f46e5'));
  if (usesSerif && usesItalic && usesBrandGradient) {
    console.log('HERO_TITLE_DESIGN_SYSTEM_OK');
  } else {
    console.error('FAIL G9: Hero title em not conforming to design system (must use var(--font-serif), italic, and var(--brand-gradient))');
    process.exit(1);
  }
}

function checkG10() {
  const fontDir = 'fonts/ample-soft-pro';
  if (!fs.existsSync(fontDir)) {
    console.error('FAIL G10: fonts/ample-soft-pro directory does not exist');
    process.exit(1);
  }
  const files = fs.readdirSync(fontDir);
  const hasWoff2 = files.some(f => f.includes('AmpleSoftPro-Bold.woff2')) && files.some(f => f.includes('AmpleSoftPro-Regular.woff2'));
  const hasTtf = files.some(f => f.includes('AmpleSoftPro-Bold.ttf')) && files.some(f => f.includes('AmpleSoftPro-Regular.ttf'));
  if (hasWoff2 && hasTtf) {
    console.log('AMPLESOFT_FILES_PRESENT_OK');
  } else {
    console.error('FAIL G10: Key AmpleSoft Pro font files missing in fonts/ample-soft-pro');
    process.exit(1);
  }
}

function checkG11() {
  const css = fs.readFileSync('css/design-system.css', 'utf8');
  const hasFontFace = css.includes('@font-face') && css.includes("font-family: 'AmpleSoft Pro'");
  const hasSwap = css.includes('font-display: swap');
  const hasBold = css.includes('AmpleSoftPro-Bold');
  const hasRegular = css.includes('AmpleSoftPro-Regular');
  if (hasFontFace && hasSwap && hasBold && hasRegular) {
    console.log('AMPLESOFT_FONT_FACE_DECLARED_OK');
  } else {
    console.error('FAIL G11: @font-face declarations for AmpleSoft Pro incomplete in css/design-system.css');
    process.exit(1);
  }
}

function checkG12() {
  const css = fs.readFileSync('css/design-system.css', 'utf8');
  const hasVarSans = css.includes("--font-sans:") && css.includes("'AmpleSoft Pro'");
  if (hasVarSans) {
    console.log('AMPLESOFT_TOKEN_VAR_SANS_OK');
  } else {
    console.error('FAIL G12: --font-sans does not include AmpleSoft Pro in css/design-system.css');
    process.exit(1);
  }
}

function checkG13() {
  const md = fs.readFileSync('DESIGN_SYSTEM.md', 'utf8');
  if (md.includes('AmpleSoft Pro') && md.includes('--font-sans')) {
    console.log('AMPLESOFT_DOCUMENTED_IN_DS_OK');
  } else {
    console.error('FAIL G13: DESIGN_SYSTEM.md not updated with AmpleSoft Pro');
    process.exit(1);
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
  case 'G9': checkG9(); break;
  case 'G10': checkG10(); break;
  case 'G11': checkG11(); break;
  case 'G12': checkG12(); break;
  case 'G13': checkG13(); break;
  default:
    console.error('UNKNOWN GATE');
    process.exit(1);
}
