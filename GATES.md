# Gates: Isolamento Completo entre Contas (Demo vs Novo Usuário)

OWNS: js/portal.js, painel.html, login.html, GATES.md

Scope: Garantir isolamento estrito de dados entre a conta Demo e novos usuários cadastrados. Novos usuários jamais devem herdar ou exibir a foto e currículo da conta demo. Cada conta deve ter seus próprios dados independentes na nuvem, no painel e na vitrine de talentos.

- [x] G1: Limpeza dos dados indevidamente propagados para leandrodimarco3@gmail.com
  CHECK: Executar script de inspeção no Firestore para perfis/leandrodimarco3@gmail.com e curriculos_pdf/leandrodimarco3@gmail.com
  EXPECT: fotoUrl e curriculoNome vazios em leandrodimarco3, documento removido de curriculos_pdf

- [x] G2: Remoção de herança indevida no formulário de cadastro (Primeiro Acesso)
  CHECK: Inspecionar signupForm em js/portal.js
  EXPECT: Novos cadastros inicializam com fotoUrl e curriculoNome vazios, sem clonagem de curriculos_pdf de outras contas

- [x] G3: Renderização condicional correta na Vitrine de Talentos (Rede de Colegas)
  CHECK: Verificar renderização de cards de talentos em js/portal.js
  EXPECT: Alunos sem foto usam inicial do nome; alunos sem currículo não mostram botão de currículo PDF

- [x] G4: Verificação do login demo em guia anônima vs login de novo usuário
  CHECK: Testar login demo (carrega foto e PDF do demo) e login de novo usuário (carrega dados limpos próprios)
  EXPECT: demo@inspirar.com com foto e PDF preservados; leandrodimarco3@gmail.com sem dados do demo

- [x] G5: Verificação visual com captura de tela (Screenshot)
  CHECK: Capturar screenshot da vitrine e do painel para o perfil leandrinho caos
  EXPECT: Card sem foto do demo e sem currículo do demo
