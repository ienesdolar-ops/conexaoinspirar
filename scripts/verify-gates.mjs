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
  const files = ['index.html', 'painel.html', 'css/portal.css', 'js/portal.js'];
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

switch (gate) {
  case 'G1': checkG1(); break;
  case 'G2': checkG2(); break;
  case 'G3': checkG3(); break;
  case 'G4': checkG4(); break;
  case 'G5': checkG5(); break;
  case 'G6': checkG6(); break;
  case 'G7': checkG7(); break;
  default:
    console.error('UNKNOWN GATE');
    process.exit(1);
}
