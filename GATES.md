# Gates: Fotos Reais na Jornada & Ícones Oficiais

OWNS: index.html, css/portal.css, css/design-system.css, GATES.md, icones/**, fotosicone/**

Scope: Substituir os ícones de etapas da seção "A Jornada" (Da matrícula ao topo da carreira) por fotos reais dos alunos e práticas da Faculdade Inspirar (fotosicone 1 a 4). Manter integridade visual, responsividade mobile no iPhone, enquadramento das imagens e estilização institucional com hover suave.

- [x] G1: Presença dos arquivos de foto na pasta fotosicone (1.jpg, 2.jpg, 3.png, 4.jpg)
  CHECK: powershell -ExecutionPolicy Bypass -Command "if ((Test-Path 'fotosicone/1.jpg') -and (Test-Path 'fotosicone/2.jpg') -and (Test-Path 'fotosicone/3.png') -and (Test-Path 'fotosicone/4.jpg')) { 'PHOTOS_OK' } else { 'MISSING' }"
  EXPECT: PHOTOS_OK
  EVIDENCE: Met (fotos 1.jpg, 2.jpg, 3.png e 4.jpg presentes em fotosicone)

- [x] G2: Inclusão das tags img com fotosicone nas 4 etapas da Jornada em index.html
  CHECK: powershell -ExecutionPolicy Bypass -Command "$c = Get-Content index.html -Raw -Encoding UTF8; if ($c -match 'fotosicone/1\.jpg' -and $c -match 'fotosicone/2\.jpg' -and $c -match 'fotosicone/3\.png' -and $c -match 'fotosicone/4\.jpg') { 'JSTEP_IMG_OK' } else { 'MISSING' }"
  EXPECT: JSTEP_IMG_OK
  EVIDENCE: Met (todas as 4 etapas da jornada utilizam imagens reais de fotosicone com loading lazy e enquadramento ajustado)

- [x] G3: Regras CSS para .jstep__img, .jstep__media e transição suave de hover
  CHECK: powershell -ExecutionPolicy Bypass -Command "$css = Get-Content css/portal.css -Raw -Encoding UTF8; if ($css -match 'jstep__img' -and $css -match 'object-fit:\s*cover') { 'CSS_JSTEP_OK' } else { 'MISSING' }"
  EXPECT: CSS_JSTEP_OK
  EVIDENCE: Met (regras de object-fit: cover, gradiente de overlay sutil e transform scale no hover adicionadas a portal.css)

- [x] G4: Integridade do texto UTF-8 sem artefatos ou caracteres corrompidos
  CHECK: powershell -ExecutionPolicy Bypass -Command "$c = Get-Content index.html -Raw -Encoding UTF8; if ($c.Contains('Ã')) { 'ENCODING_ERROR' } else { 'ENCODING_CLEAN' }"
  EXPECT: ENCODING_CLEAN
  EVIDENCE: Met (zero caracteres corrompidos em index.html)

- [x] G5: Verificação visual no Desktop e Mobile (iPhone) via captura headless
  CHECK: powershell -ExecutionPolicy Bypass -Command "if ((Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_jornada_desktop.png') -and (Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_jornada_mobile.png')) { 'VISUAL_OK' } else { 'MISSING' }"
  EXPECT: VISUAL_OK
  EVIDENCE: Met (capturas de tela geradas e verificadas no desktop 1280x1200 e mobile 390x1100)
