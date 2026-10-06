# Gates: Ajustes do Audio (Hero, Jornada, Vagas e Painel)

OWNS: index.html, css/portal.css, css/design-system.css, painel.html, js/portal.js, scripts/verify-gates.mjs, GATES.md

Scope: Implementar integralmente os 7 direcionamentos da revisao em audio dos gestores: Hero com split-gradient (metade esquerda solida para texto e metade direita com foto e degradê), padronizacao das fotos da Jornada sem expansao de container e zoom suave, troca do destaque da etapa 3 para a etapa 4 (seja contratado), badges de recrutadores com alto contraste em contratado e padrao unico para disponivel, expansao do logo no rodape, vagas no painel com descricao compacta e expansivel sob demanda, alinhamento do label WhatsApp e substituicao da nomenclatura PDF por Curriculo com remocao do nome do anexo.

- [x] G1: Hero Split Gradient com metade esquerda solida e transicao suave para a foto na direita
  CHECK: node scripts/verify-gates.mjs G1
  EXPECT: HERO_GRADIENT_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=ddbca44d5273d9ae05765e513549ed7720b5256012935369083eaf88885fe8a1; output-bytes=17

- [x] G2: Padronizacao do container da Jornada com tamanho uniforme e remocao da expansao no hover
  CHECK: node scripts/verify-gates.mjs G2
  EXPECT: JSTEP_SIZE_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=d2b53fe80cd09d2c2bae1454eb5a951cc69c385ab0382029346dbf1bc832c5a4; output-bytes=14

- [x] G3: Inversao de destaque da Jornada da Etapa 3 para a Etapa 4 (Seja Contratado)
  CHECK: node scripts/verify-gates.mjs G3
  EXPECT: FEATURED_SWAP_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=6072ea85cecda418463bb4441fb60da74d911cc52ec569fea76cde27a8046f3c; output-bytes=17

- [x] G4: Badges de Recrutadores com alto contraste para Contratado e estilo unico para Disponivel
  CHECK: node scripts/verify-gates.mjs G4
  EXPECT: BADGES_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=b525d859783133c9cbf9b54d9c2d86b90aa0af832962203a40b189d238545789; output-bytes=10

- [x] G5: Ampliacao do logo Conexao Inspirar no rodape para maior autoridade e presenca de marca
  CHECK: node scripts/verify-gates.mjs G5
  EXPECT: FOOTER_LOGO_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=4a589202690dff2f3f2357a2f4cfc61480e3aefcafb13a655097f3bf24af5740; output-bytes=15

- [x] G6: Vagas no Painel com descricao compacta e botao expansivel (Ver detalhes / Ocultar)
  CHECK: node scripts/verify-gates.mjs G6
  EXPECT: VACANCY_EXPAND_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=481670bfb28b5087fa23b8b7eb3b69f99ada8aae067437383a68e80b1b593b2a; output-bytes=18

- [x] G7: Alinhamento do campo WhatsApp e adocao da nomenclatura Curriculo (sem PDF e sem nome de anexo)
  CHECK: node scripts/verify-gates.mjs G7
  EXPECT: PAINEL_LABELS_OK
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=5a0dd865d62ee026154f674efc0a1e29d6c062f63eee8a4b3f7f9e584c12bb70; output-bytes=17

- [x] G8: Integridade de codificacao UTF-8 sem caracteres corrompidos no projeto
  CHECK: node scripts/verify-gates.mjs G8
  EXPECT: ENCODING_CLEAN
  EVIDENCE: exit=0; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\Usuario\Downloads\Carreiras Inspirar; path=679a989839ae/18 entries; EXPECT=matched; output-sha256=91a7c059384e08fd77fbe86285e578a9706e3ad4c67488713d7290b6f39ed66b; output-bytes=15
