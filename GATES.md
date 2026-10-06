# Gates: Enfase na Foto da Hero, Fotos Quadradas na Jornada e Ajustes do Curriculo

OWNS: index.html, painel.html, css/portal.css, js/portal.js, scripts/verify-gates.mjs, GATES.md

Scope: Implementar hero com enfase total na foto (layout 2 colunas com moldura organica e sem veu sobre rostos), padronizar fotos da jornada em formato quadrado uniforme de 170px sem variacao de altura, e ajustar card de curriculo removendo tamanho e tag de disponibilidade mantendo a lixeira e acoes perfeitamente contidas.

- [x] G1: Hero em 2 colunas com hero-media contendo hero.jpg, enquadramento organico e visibilidade total da foto
  CHECK: node scripts/verify-gates.mjs G1
  EXPECT: HERO_PHOTO_EMPHASIS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=5dfd2b9af717bad89985a928d1ae316b4a747dd5f8f5ce2088bf7bebdb7b5930; output-bytes=23

- [x] G2: Fotos da Jornada padronizadas em formato quadrado uniforme sem variacao de altura
  CHECK: node scripts/verify-gates.mjs G2
  EXPECT: JSTEP_SQUARE_PHOTOS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=6a0f2f4a739ddcc2a6d56a3ba880853e6dc08c71892fbe1d7bef8fd95cfbe320; output-bytes=23

- [x] G3: Remocao da exibicao do tamanho do arquivo no card de curriculo no painel
  CHECK: node scripts/verify-gates.mjs G3
  EXPECT: CURRICULO_NO_SIZE_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=502c00f4091672bde3b85e4ef5190a713e6562a08d13a6f176f7b1f33cf4f136; output-bytes=21

- [x] G4: Remocao da tag Disponivel para Empresas no card de curriculo do painel
  CHECK: node scripts/verify-gates.mjs G4
  EXPECT: CURRICULO_NO_DISPONIVEL_TAG_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=93477cbd4065d7687bdde52d0bd1555a631e10e3f69706e4a7caaa4f628a91c8; output-bytes=31

- [x] G5: Botao de lixeira e acoes de curriculo contidos perfeitamente dentro do card sem transbordamento
  CHECK: node scripts/verify-gates.mjs G5
  EXPECT: CURRICULO_CONTAINED_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=c94aa065ef9bd850cf87529ea6a523613aaeefee6268fd5544a6f1437781c16f; output-bytes=23

- [x] G6: Integridade de codificacao UTF-8 sem caracteres corrompidos
  CHECK: node scripts/verify-gates.mjs G6
  EXPECT: ENCODING_CLEAN
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=91a7c059384e08fd77fbe86285e578a9706e3ad4c67488713d7290b6f39ed66b; output-bytes=15

- [x] G7: Remocao completa da barra flutuante de pilares da hero (hero-features-bar) de index.html e css/portal.css
  CHECK: node scripts/verify-gates.mjs G7
  EXPECT: HERO_FEATURES_BAR_REMOVED_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=67572356938ca5a9533ff7e98943a844d55da8e800d52fe0c6027d5fd20dc3ee; output-bytes=29

- [x] G8: Efeito roxo atmosferico confinado estritamente dentro da moldura da foto sem vazar para o fundo branco
  CHECK: node scripts/verify-gates.mjs G8
  EXPECT: PURPLE_GLOW_CONFINED_TO_PHOTO_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=7682ac1cff1567528dc1956967ac161b2dd0a3a85704c87dcc86ba34f927d800; output-bytes=33
