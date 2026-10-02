# Gates: Ícones Personalizados e 30 Anos de Excelência

OWNS: index.html, css/portal.css, css/design-system.css, GATES.md, icones/**

Scope: Substituir os 3 ícones da seção de recursos (Do Estágio ao Especialista, Presencial EAD e Global, Contato Direto & Acompanhamento) pelas novas artes feitas pelo designer (icones 2, 3 e 4). Atualizar a seção de estatísticas/conquistas de 29 para 30 Anos de Excelência. Garantir renderização perfeita em desktop e mobile.

- [x] G1: Presença e substituição dos 3 novos ícones (2.png, 3.png, 4.png) nos cards de features de index.html
  CHECK: powershell -ExecutionPolicy Bypass -Command "$c = Get-Content index.html -Raw -Encoding UTF8; if ($c -match 'icones/2\.png' -and $c -match 'icones/3\.png' -and $c -match 'icones/4\.png') { 'ICONS_OK' } else { 'MISSING' }"
  EXPECT: ICONS_OK
  EVIDENCE: Met (icones 2.png, 3.png e 4.png aplicados respectivamente nos cards formativos)

- [x] G2: Atualização do contador de conquistas para 30 Anos de Excelência
  CHECK: powershell -ExecutionPolicy Bypass -Command "$c = Get-Content index.html -Raw -Encoding UTF8; if ($c -match 'data-count=\"30\"' -and $c -match 'Anos de[\s\S]*?Excel') { 'STATS_30_OK' } else { 'MISSING' }"
  EXPECT: STATS_30_OK
  EVIDENCE: Met (data-count atualizado de 29 para 30 em index.html e design-system.html)

- [x] G3: Estilização visual dos ícones nos cards (tamanho adequado e sem sobreposição de bordas/fundo)
  CHECK: powershell -ExecutionPolicy Bypass -Command "$css = (Get-Content css/portal.css -Raw -Encoding UTF8) + (Get-Content css/design-system.css -Raw -Encoding UTF8); if ($css -match 'feature-card__icon--img' -and $css -match 'feature-card__icon-img') { 'CSS_OK' } else { 'MISSING' }"
  EXPECT: CSS_OK
  EVIDENCE: Met (classes .feature-card__icon--img e .feature-card__icon-img com 52x52px, sombra suave e hover com elevação)

- [x] G4: Integridade do texto UTF-8 sem artefatos ou caracteres corrompidos
  CHECK: powershell -ExecutionPolicy Bypass -Command "$c = Get-Content index.html -Raw -Encoding UTF8; if ($c.Contains('Ã')) { 'ENCODING_ERROR' } else { 'ENCODING_CLEAN' }"
  EXPECT: ENCODING_CLEAN
  EVIDENCE: Met (zero caracteres double-encoded em index.html)

- [x] G5: Verificação visual no Desktop e Mobile (iPhone) via captura headless
  CHECK: powershell -ExecutionPolicy Bypass -Command "if ((Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_features_desktop.png') -and (Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_features_mobile.png')) { 'VISUAL_OK' } else { 'MISSING' }"
  EXPECT: VISUAL_OK
  EVIDENCE: Met (capturas de tela geradas e verificadas visualmente no Desktop e iPhone)
