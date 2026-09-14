# Gates: Adição de 4 Novos Depoimentos Reais de Alunas (Conexão Inspirar)

OWNS: index.html, css/portal.css, GATES.md

Scope: Integrar 4 novos depoimentos reais com fotos reais fornecidas pelo usuário (Alessandra Antonia, Lais Gianotti, Gilmara Arrais, Priscilla Capana) somando 5 histórias autênticas com a de Shelami Santos, eliminando placeholders e garantindo enquadramento facial de alta precisão e layout equilibrado em modo claro e escuro.

- [x] G1: Geração e validação dos 4 novos avatares recortados com foco no rosto em alta resolução
  EVIDENCE: Gerados com System.Drawing e foco preciso facial: alessandra-menezes.png (1100x1100), lais-franco.png (1150x1150), gilmara-arrais.jpeg (850x850), priscilla-capana.png (340x340) e shelami-santos-rosto.jpeg (680x680). Test-Path confirmou True para todos.

- [x] G2: Presença de todos os 5 depoimentos reais com nomes, cargos e textos integrais em index.html
  EVIDENCE: Verificado via Select-String a presença integral de Shelami Santos, Gilmara F. M. Arrais, Priscilla Capana, Alessandra Antonia V.B. de Menezes e Lais Gianotti Franco, com fotos, cargos e textos completos na íntegra.

- [x] G3: Remoção completa de depoimentos fictícios / placeholders anteriores
  EVIDENCE: Select-String confirmou 0 ocorrências de Amanda Silveira, Mateus Kuanza e Juliana Medeiros. 100% da seção de histórias é agora autêntica.

- [x] G4: Layout estruturado sem buracos (Card Destaque + Grid 2x2 harmônico) adaptado para tema claro e escuro
  EVIDENCE: Implementado componente .depoimento-destaque (Shelami Santos em evidência horizontal) + .depoimentos-grid (2x2 simétrico e responsivo para Gilmara, Priscilla, Alessandra e Lais). Sem espaços vazios ou desbalanceamento de alturas.

- [x] G5: Captura e verificação visual em Edge Headless (Modo Claro e Modo Escuro)
  EVIDENCE: Gerados screenshots screenshot_depoimentos_5_light.png e screenshot_depoimentos_5_dark.png confirmando renderização impecável, tipografia nítida, badges e fotos enquadradas nos dois temas.

