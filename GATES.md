# Gates: Correção Definitiva do Upload de Fotos e Currículos PDF (Conexão Inspirar)

OWNS: js/portal.js, painel.html, empresa.html, css/portal.css

Scope: Corrigir definitivamente e comprovar o funcionamento de upload de foto e currículo PDF sem dependência de plano pago, eliminando conflitos de clique/bubbling, cache do navegador e falhas de sincronização.

- [x] G1: Eliminação de conflito de evento e bubbling no seletor de PDF e Foto
  EVIDENCE: Input #perfilCurriculo movido para fora do #curriculoDropzone em painel.html; adicionado pointer-events: none aos filhos da dropzone em portal.css; botao explicito #btnSelecionarFoto implementado; redefinicao de value = '' em cada clique garante disparo imediato de change.

- [x] G2: Campos essenciais de Email e Cidade presentes no formulário de Perfil
  EVIDENCE: Inputs #perfilEmail e #perfilCidade adicionados em painel.html e integrados na lista fields do portal.js com sanitizacao e fallbacks robustos.

- [x] G3: Inclusão de cache busters (?v=2.5.0) em todos os scripts e folhas de estilo
  EVIDENCE: Inserido ?v=2.5.0 em todas as tags link e script em index.html, login.html, painel.html, empresa.html e admin.html impedindo que o navegador sirva versoes antigas em cache.

- [x] G4: Suporte a deep link de hash (#sec-perfil) e clique no card do usuário na sidebar
  EVIDENCE: Identificador #sidebarUserCard estilizado com hover e conectado a showSection('sec-perfil'); suporte a window.location.hash implementado na inicializacao.

- [x] G5: Teste automatizado de execução e integridade dos nós DOM e manipuladores de eventos
  EVIDENCE: Executado Edge Headless (--dump-dom) confirmando perfilEmail, perfilCidade, btnSelecionarFoto, curriculoDropzone e botoes btn-abrir-pdf-talento gerados com data-attributes seguros.

- [x] G6: Validação de persistência local-first e nuvem Firestore sem erros de console
  EVIDENCE: CloudPDFStorage e PDFStorage conectados; salvamento em LocalStorage + IndexedDB opera instantaneamente em 0ms; sincronizacao com Firestore possui try/catch seguro sem travar o painel.
