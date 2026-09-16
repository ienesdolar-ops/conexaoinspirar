# Gates: Mobile Responsiveness & Carrossel de Depoimentos

OWNS: index.html, login.html, painel.html, empresa.html, css/portal.css, css/design-system.css, js/portal.js, GATES.md

Scope: Garantir experiência mobile de altíssimo nível (especialmente no iPhone) sem nenhuma quebra de layout, overflow horizontal ou elementos cortados em todas as telas (index, login, painel, empresa). Implementar carrossel horizontal de depoimentos com fotos no topo do card e textos abaixo para eliminar a rolagem infinita.

- [x] G1: Reestruturação dos cards de depoimento (Foto no topo, texto abaixo)
  CHECK: powershell -ExecutionPolicy Bypass -Command "Get-Content index.html | Select-String -Pattern 'depoimento-card__header' | Measure-Object | Select-Object -ExpandProperty Count"
  EXPECT: 5

- [x] G2: Implementação do carrossel horizontal com controles (Track, Setas Anterior/Próximo, Indicadores de Dots)
  CHECK: powershell -ExecutionPolicy Bypass -Command "$c = Get-Content index.html -Raw; if ($c -match 'depoimentos-carousel' -and $c -match 'depoimentos-track' -and $c -match 'depoimentos-btn--prev' -and $c -match 'depoimentos-btn--next' -and $c -match 'depoimentos-dots') { 'CAROUSEL_OK' } else { 'MISSING' }"
  EXPECT: CAROUSEL_OK

- [x] G3: Script de controle do carrossel em js/portal.js (Scroll snap, navegação por botões, drag/touch swipe e dots ativos)
  CHECK: powershell -ExecutionPolicy Bypass -Command "$js = Get-Content js/portal.js -Raw; if ($js -match 'initDepoimentosCarousel' -or $js -match 'depoimentos-track') { 'CAROUSEL_JS_OK' } else { 'MISSING' }"
  EXPECT: CAROUSEL_JS_OK

- [x] G4: Prevenção de zoom forçado no iOS Safari (inputs com font-size >= 16px em telas mobile) e overflow horizontal zero
  CHECK: powershell -ExecutionPolicy Bypass -Command "$css = (Get-Content css/portal.css -Raw) + (Get-Content css/design-system.css -Raw); if ($css -match 'overflow-x:\s*hidden' -and $css -match 'font-size:\s*16px') { 'IOS_AUDIT_OK' } else { 'MISSING' }"
  EXPECT: IOS_AUDIT_OK

- [x] G5: Verificação de responsividade mobile de index.html no viewport de iPhone (390x844) via Headless Browser
  CHECK: powershell -ExecutionPolicy Bypass -Command "if ((Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_mobile_index_hero.png') -and (Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_mobile_depoimentos.png')) { 'INDEX_MOBILE_OK' } else { 'ERROR' }"
  EXPECT: INDEX_MOBILE_OK

- [x] G6: Verificação de responsividade mobile de login.html, painel.html e empresa.html no viewport de iPhone (390x844)
  CHECK: powershell -ExecutionPolicy Bypass -Command "if ((Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_mobile_login.png') -and (Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_mobile_painel.png') -and (Test-Path 'C:\Users\Usuario\.gemini\antigravity\brain\b03f838c-d0ac-42b6-82f7-8d0d0cea44c7\screenshot_mobile_empresa.png')) { 'ALL_PAGES_MOBILE_OK' } else { 'ERROR' }"
  EXPECT: ALL_PAGES_MOBILE_OK
