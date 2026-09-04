/* ============================================================
   CONEXÃO INSPIRAR — JS Principal
   Lógica: Firestore em tempo real + fallback gracioso
   Público: Alunos em curso (Graduandos), Graduados e Pós-Graduados
   Cursos: Portfólio oficial da Faculdade Inspirar (Presencial Curitiba, EAD e Pós-Graduações)
   Polos: Curitiba / PR, Estados do Brasil, Polo Luanda (Angola) e 100% Online
   ============================================================ */

/* ─── CATÁLOGO OFICIAL DE CURSOS DA FACULDADE INSPIRAR ────── */
var CURSOS_INSPIRAR = {
  graduacao: [
    'Direito (Presencial - Curitiba)',
    'Fisioterapia (Presencial - Curitiba)',
    'Biomedicina (Presencial - Curitiba)',
    'Psicologia (Presencial - Curitiba)',
    'Administração (Graduação EAD)',
    'Tecnólogo em Gestão Hospitalar (Graduação EAD)'
  ],
  pos: {
    'Fisioterapia': [
      'Fisioterapia em Traumato-Ortopedia e Esportiva',
      'Fisioterapia Dermatofuncional e Cosmetologia Avançada',
      'Fisioterapia Pélvica Funcional',
      'Fisioterapia em Terapia Intensiva',
      'Quiropraxia',
      'Acupuntura Integrativa',
      'Fisioterapia Neurofuncional Adulto e Pediátrica',
      'Fisioterapia em Pediatria e Neonatologia',
      'Fisioterapia do Trabalho',
      'Fisioterapia em Gerontologia',
      'Fisioterapia em Oncologia',
      'Fisioterapia Obstétrica (do pré-natal ao pós-parto)',
      'Fisioterapia Respiratória e Cardiovascular',
      'Fisioterapia em Terapia Manual (raciocínio clínico)',
      'Fisioterapia Vestibular',
      'Mobilização Neural / Neurodinâmica',
      'Perícias Fisioterapêuticas',
      'Pós-graduação em Dor e Manejo da Dor Crônica',
      'Dry Needling (Agulhamento a Seco)',
      'Formação em Osteopatia'
    ],
    'Estética, Biomedicina, Enfermagem e Correlatas': [
      'Biomedicina Estética (e Internacional)',
      'Farmácia Estética / Enfermagem Estética (Internacional)',
      'Saúde Estética com ênfase em Harmonização Facial e Corporal',
      'Estética Avançada e Métodos Injetáveis (Internacional)',
      'Enfermagem em Terapia Intensiva',
      'Urgência e Emergência',
      'Transporte e Resgate Aeromédico',
      'Medicina Hospitalar',
      'Enfermagem Centro Cirúrgico e CME'
    ],
    'Fonoaudiologia': [
      'Fonoaudiologia Neonatal e Amamentação',
      'Aparelhos de Amplificação Sonora Individual (AASI)',
      'Processamento Auditivo Central',
      'Fala e Linguagem Infantil',
      'Comunicação do Adulto e Idoso (linguagem, fala e cognição)',
      'Voz nas Variações Hormonais',
      'Fluência',
      'Otoneurologia',
      'Disfagia – Clínica e Hospitalar',
      'Motricidade Orofacial',
      'Eletroacústica e Eletrofisiologia',
      'Fonoaudiologia do Trabalho (Audiologia e Voz)',
      'Fonoaudiologia Neurofuncional nos Ciclos da Vida'
    ],
    'Psicologia, Saúde Mental e Outras': [
      'Psicologia Clínica Comportamental',
      'Saúde Mental: Abordagens Contemporâneas e Práticas Baseadas em Evidências',
      'Análise do Comportamento Aplicada (ABA) – Autismo e Desenvolvimento Atípico',
      'Dependência Química e Comunidades Terapêuticas',
      'Dislexia e Transtornos Associados',
      'Abordagem Centrada na Pessoa (ACP)',
      'Distúrbios do Sono',
      'Gerontologia (Multiprofissional)'
    ],
    'MBAs e Gestão': [
      'MBA em Gestão, Auditoria e Qualidade em Saúde',
      'MBA em Gestão, Inovação e Empreendedorismo em Fisioterapia',
      'MBA em Ergonomia (reconhecido pela ABERGO)',
      'Perícia Ergonômica'
    ]
  }
};

/* ─── HELPER DE POPULAÇÃO DINÂMICA DE ÁREAS ──────────────── */
function populateAreaSelect(nivel, selectEl, selectedVal, isFilter) {
  if (!selectEl) return;
  var html = '<option value="">' + (isFilter ? 'Todas as áreas de formação' : 'Selecione a área / curso...') + '</option>';

  if (nivel === 'Graduando' || nivel === 'Graduado' || nivel === 'graduacao') {
    CURSOS_INSPIRAR.graduacao.forEach(function(c) {
      var sel = (selectedVal === c) ? ' selected' : '';
      html += '<option value="' + c + '"' + sel + '>' + c + '</option>';
    });
  } else if (nivel === 'Pos-Graduado' || nivel === 'pos' || nivel === 'Pós-Graduado' || nivel === 'Pós-graduado') {
    Object.keys(CURSOS_INSPIRAR.pos).forEach(function(areaKey) {
      html += '<optgroup label="' + areaKey + '">';
      CURSOS_INSPIRAR.pos[areaKey].forEach(function(p) {
        var sel = (selectedVal === p) ? ' selected' : '';
        html += '<option value="' + p + '"' + sel + '>' + p + '</option>';
      });
      html += '</optgroup>';
    });
  } else {
    html += '<optgroup label="Cursos de Graduação">';
    CURSOS_INSPIRAR.graduacao.forEach(function(c) {
      var sel = (selectedVal === c) ? ' selected' : '';
      html += '<option value="' + c + '"' + sel + '>' + c + '</option>';
    });
    html += '</optgroup>';

    Object.keys(CURSOS_INSPIRAR.pos).forEach(function(areaKey) {
      html += '<optgroup label="Pós-Graduação: ' + areaKey + '">';
      CURSOS_INSPIRAR.pos[areaKey].forEach(function(p) {
        var sel = (selectedVal === p) ? ' selected' : '';
        html += '<option value="' + p + '"' + sel + '>' + p + '</option>';
      });
      html += '</optgroup>';
    });
  }

  selectEl.innerHTML = html;
}

/* ─── MOTOR DE ARQUIVOS (IndexedDB + Canvas + Fallbacks) ─── */

// Formatação amigável de tamanho de arquivo
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  var k = 1024;
  var sizes = ['B', 'KB', 'MB', 'GB'];
  var i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Compressão inteligente de imagem no cliente (Canvas)
function comprimirFoto(file, callback) {
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    var img = new Image();
    img.onload = function() {
      var maxDim = 420;
      var w = img.width;
      var h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      var canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      var ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);
      var dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      callback(dataUrl);
    };
    img.onerror = function() {
      callback(e.target.result);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Repositório local IndexedDB para PDFs (sem limite de 5MB do localStorage)
var PDFStorage = {
  dbName: 'ConexaoInspirarDB',
  storeName: 'curriculos',
  getDB: function(callback) {
    if (!window.indexedDB) {
      callback(new Error('IndexedDB não suportado'));
      return;
    }
    var req = indexedDB.open(this.dbName, 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('curriculos')) {
        db.createObjectStore('curriculos', { keyPath: 'id' });
      }
    };
    req.onsuccess = function(e) { callback(null, e.target.result); };
    req.onerror = function(e) { callback(e); };
  },
  salvarPDF: function(id, blob, nome, tamanho, callback) {
    this.getDB(function(err, db) {
      if (err) { if (callback) callback(err); return; }
      try {
        var tx = db.transaction('curriculos', 'readwrite');
        var store = tx.objectStore('curriculos');
        var item = {
          id: id,
          blob: blob,
          nome: nome,
          tamanho: tamanho,
          data: new Date().toISOString().split('T')[0]
        };
        store.put(item);
        tx.oncomplete = function() { if (callback) callback(null, item); };
        tx.onerror = function(e) { if (callback) callback(e); };
      } catch (e) {
        if (callback) callback(e);
      }
    });
  },
  obterPDF: function(id, callback) {
    this.getDB(function(err, db) {
      if (err) { callback(err); return; }
      try {
        var tx = db.transaction('curriculos', 'readonly');
        var store = tx.objectStore('curriculos');
        var req = store.get(id);
        req.onsuccess = function() { callback(null, req.result); };
        req.onerror = function(e) { callback(e); };
      } catch (e) {
        callback(e);
      }
    });
  },
  removerPDF: function(id, callback) {
    this.getDB(function(err, db) {
      if (err) { if (callback) callback(err); return; }
      try {
        var tx = db.transaction('curriculos', 'readwrite');
        var store = tx.objectStore('curriculos');
        store.delete(id);
        tx.oncomplete = function() { if (callback) callback(null); };
        tx.onerror = function(e) { if (callback) callback(e); };
      } catch (e) {
        if (callback) callback(e);
      }
    });
  }
};

// Gerador de PDF demonstrativo válido padrão PDF-1.4 para perfis demo
function gerarSamplePDF(nome, area, especialidade) {
  var doc = 
    "%PDF-1.4\n" +
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n" +
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n" +
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n" +
    "4 0 obj << /Length 430 >> stream\n" +
    "BT\n" +
    "/F1 18 Tf\n" +
    "50 720 Td\n" +
    "(FACULDADE INSPIRAR - CURRICULO PROFISSIONAL) Tj\n" +
    "/F1 12 Tf\n" +
    "0 -40 Td\n" +
    "(Candidato(a): " + (nome || "Candidato Inspirar") + ") Tj\n" +
    "0 -24 Td\n" +
    "(Area de Formacao: " + (area || "Saude e Gestao") + ") Tj\n" +
    "0 -24 Td\n" +
    "(Especialidade / Foco: " + (especialidade || "Geral") + ") Tj\n" +
    "0 -36 Td\n" +
    "(Status: Aluno / Especialista com dados validados pela plataforma) Tj\n" +
    "/F1 10 Tf\n" +
    "0 -30 Td\n" +
    "(Portal Conexao Inspirar - Curitiba, EAD e Polo Luanda Angola) Tj\n" +
    "ET\n" +
    "endstream\n" +
    "endobj\n" +
    "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj\n" +
    "xref\n" +
    "0 6\n" +
    "0000000000 65535 f \n" +
    "0000000010 00000 n \n" +
    "0000000060 00000 n \n" +
    "0000000117 00000 n \n" +
    "0000000247 00000 n \n" +
    "0000000728 00000 n \n" +
    "trailer << /Size 6 /Root 1 0 R >>\n" +
    "startxref\n" +
    "800\n" +
    "%%EOF";
  return new Blob([doc], { type: 'application/pdf' });
}

// Converter Data URI para Blob nativo
function dataUriToBlob(dataUri) {
  var parts = dataUri.split(',');
  var byteString = atob(parts[1]);
  var mimeString = parts[0].split(':')[1].split(';')[0];
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
}

// Abertura do PDF do Talento (no browser nativo)
window.abrirCurriculoTalento = function(email, nomeArquivo, url) {
  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    window.open(url, '_blank');
    return;
  }
  if (url && url.startsWith('data:application/pdf')) {
    var blob = dataUriToBlob(url);
    var blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    return;
  }

  PDFStorage.obterPDF(email, function(err, item) {
    if (!err && item && item.blob) {
      var blobUrl = URL.createObjectURL(item.blob);
      window.open(blobUrl, '_blank');
    } else {
      var sampleBlob = gerarSamplePDF(nomeArquivo ? nomeArquivo.replace('Curriculo_', '').replace('.pdf', '').replace(/_/g, ' ') : 'Candidato Inspirar');
      var sampleUrl = URL.createObjectURL(sampleBlob);
      window.open(sampleUrl, '_blank');
    }
  });
};

// Download do PDF do Talento
window.baixarCurriculoTalento = function(email, nomeArquivo, url) {
  function triggerDownload(blob, filename) {
    var a = document.createElement('a');
    var blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = filename || 'Curriculo_Inspirar.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    }, 400);
  }

  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    var a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = nomeArquivo || 'Curriculo.pdf';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() { document.body.removeChild(a); }, 400);
    return;
  }

  PDFStorage.obterPDF(email, function(err, item) {
    if (!err && item && item.blob) {
      triggerDownload(item.blob, item.nome || nomeArquivo);
    } else {
      var sampleBlob = gerarSamplePDF(nomeArquivo ? nomeArquivo.replace('Curriculo_', '').replace('.pdf', '').replace(/_/g, ' ') : 'Candidato');
      triggerDownload(sampleBlob, nomeArquivo || 'Curriculo_Inspirar.pdf');
    }
  });
};

/* ─── MOCK DATA MULTIDISCIPLINAR (Fallback & Seed) ───────── */
var VAGAS_MOCK = [
  {
    id: 'mock-1',
    empresa: 'Hospital Santa Cruz',
    cidade: 'Curitiba',
    estado: 'PR',
    nivel: 'Graduado',
    area: 'Fisioterapia (Presencial - Curitiba)',
    especialidade: 'Fisioterapeuta Pélvico / Hospitalar',
    tipo: 'CLT',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Buscamos fisioterapeuta graduado ou residente para atendimento ambulatorial e hospitalar. Carga de 30h semanais. Equipe multidisciplinar consolidada.',
    tipoContato: 'ambos',
    contato: 'rh@santacruz.com.br',
    whatsapp: '(41) 9 9999-0001',
    data: '2026-08-20',
    createdAt: new Date('2026-08-20').getTime()
  },
  {
    id: 'mock-2',
    empresa: 'Carvalho & Associados Advocacia',
    cidade: 'Curitiba',
    estado: 'PR',
    nivel: 'Graduando',
    area: 'Direito (Presencial - Curitiba)',
    especialidade: 'Estágio em Direito Médico e da Saúde',
    tipo: 'Estágio',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Vaga de estágio para alunos em curso de Direito da Inspirar em Curitiba com interesse em compliance hospitalar e direito regulatório.',
    tipoContato: 'whatsapp',
    contato: 'vagas@carvalhoadv.com.br',
    whatsapp: '(41) 9 8888-2233',
    data: '2026-08-22',
    createdAt: new Date('2026-08-22').getTime()
  },
  {
    id: 'mock-3',
    empresa: 'Laboratório Diagnose & Pesquisa',
    cidade: 'Curitiba',
    estado: 'PR',
    nivel: 'Graduando',
    area: 'Biomedicina (Presencial - Curitiba)',
    especialidade: 'Estágio em Análises Clínicas',
    tipo: 'Estágio',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Oportunidade de estágio para graduandos de Biomedicina em Curitiba. Atuação com automação laboratorial e controle de qualidade.',
    tipoContato: 'email',
    contato: 'estagio@diagnoselab.com.br',
    whatsapp: '',
    data: '2026-08-23',
    createdAt: new Date('2026-08-23').getTime()
  },
  {
    id: 'mock-4',
    empresa: 'Centro de Reabilitação NeuroFuncional',
    cidade: 'Curitiba',
    estado: 'PR',
    nivel: 'Pos-Graduado',
    area: 'Fisioterapia Neurofuncional Adulto e Pediátrica',
    especialidade: 'Especialista em Fisioterapia Neurofuncional',
    tipo: 'PJ',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Clínica de excelência em Curitiba busca pós-graduado especialista em Neurofuncional pela Inspirar para atendimento ambulatorial.',
    tipoContato: 'whatsapp',
    contato: 'contato@neurofuncional.com.br',
    whatsapp: '(41) 9 9123-4455',
    data: '2026-08-24',
    createdAt: new Date('2026-08-24').getTime()
  },
  {
    id: 'mock-5',
    empresa: 'Rede Hospitalar Santa Cecília',
    cidade: 'Remoto / Nacional',
    estado: '100% Online (EAD)',
    nivel: 'Graduado',
    area: 'Tecnólogo em Gestão Hospitalar (Graduação EAD)',
    especialidade: 'Analista de Gestão de Processos Hospitalares',
    tipo: 'CLT',
    modalidade: '100% Online',
    status: 'aberta',
    descricao: 'Contratação de graduado em Gestão Hospitalar EAD. Vaga 100% remota com atuação em controladoria e gestão da qualidade hospitalar.',
    tipoContato: 'ambos',
    contato: 'carreiras@santacecilia.com.br',
    whatsapp: '(11) 9 9876-5432',
    data: '2026-08-25',
    createdAt: new Date('2026-08-25').getTime()
  },
  {
    id: 'mock-6',
    empresa: 'Clínica Luanda Saúde Integrada',
    cidade: 'Luanda',
    estado: 'Luanda (Angola)',
    nivel: 'Pos-Graduado',
    area: 'Fisioterapia em Traumato-Ortopedia e Esportiva',
    especialidade: 'Fisioterapeuta Especialista em Ortopedia',
    tipo: 'CLT',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Oportunidade no polo internacional de Luanda (Angola) para fisioterapeuta pós-graduado com atuação em reabilitação esportiva e traumato-ortopedia.',
    tipoContato: 'ambos',
    contato: 'recrutamento@luandasaude.ao',
    whatsapp: '(244) 923 000 111',
    data: '2026-08-26',
    createdAt: new Date('2026-08-26').getTime()
  }
];

var DEMO_USER = {
  email: 'demo@inspirar.com',
  cpf: '000.000.000-00',
  senha: '123456',
  nome: 'Ana Paula Silva',
  statusAcademico: 'Pos-Graduado',
  area: 'Fisioterapia Pélvica Funcional',
  especialidade: 'Fisioterapia Pélvica e Obstétrica',
  modalidade: 'Presencial (Curitiba)',
  cidade: 'Curitiba',
  estado: 'PR',
  whatsapp: '(41) 9 9999-8888',
  bio: 'Especialista pós-graduada pela Inspirar com foco em reabilitação uroginecológica, obstetrícia e saúde integral humanizada.',
  linkedin: 'https://linkedin.com/in/anapaula-inspirar',
  instagram: '@anapaula.saude',
  site: '',
  fotoUrl: 'https://images.unsplash.com/photo-1594824813571-2b533411efa0?w=150&auto=format&fit=crop&q=80',
  curriculoUrl: 'demo',
  curriculoNome: 'Curriculo_Ana_Paula_Silva.pdf',
  curriculoTamanho: '184 KB',
  contratadoPelaPlataforma: true
};

/* ─── UTILITÁRIOS & FIRESTORE OPERAÇÕES ──────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  var d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Buscar Vagas do Firestore com fallback local silencioso
function listenVagas(callback) {
  var loaded = false;

  var timer = setTimeout(function() {
    if (!loaded) {
      loaded = true;
      var saved = localStorage.getItem('ccin-vagas');
      var localList = saved ? JSON.parse(saved) : [];
      callback(localList.concat(VAGAS_MOCK));
    }
  }, 800);

  if (typeof firebase !== 'undefined' && typeof db !== 'undefined') {
    try {
      db.collection('vagas').orderBy('createdAt', 'desc').onSnapshot(function(snapshot) {
        if (!loaded) {
          loaded = true;
          clearTimeout(timer);
        }
        if (snapshot.empty) {
          callback(VAGAS_MOCK);
        } else {
          var vagas = [];
          snapshot.forEach(function(doc) {
            var data = doc.data();
            data.id = doc.id;
            vagas.push(data);
          });
          callback(vagas);
        }
      }, function(error) {
        if (!loaded) {
          loaded = true;
          clearTimeout(timer);
          var saved = localStorage.getItem('ccin-vagas');
          var localList = saved ? JSON.parse(saved) : [];
          callback(localList.concat(VAGAS_MOCK));
        }
      });
    } catch (e) {
      clearTimeout(timer);
      var saved = localStorage.getItem('ccin-vagas');
      var localList = saved ? JSON.parse(saved) : [];
      callback(localList.concat(VAGAS_MOCK));
    }
  } else {
    clearTimeout(timer);
    var saved = localStorage.getItem('ccin-vagas');
    var localList = saved ? JSON.parse(saved) : [];
    callback(localList.concat(VAGAS_MOCK));
  }
}

function getPerfilLocalOrFirestore(callback) {
  var saved = localStorage.getItem('ccin-perfil');
  var perfil = saved ? JSON.parse(saved) : DEMO_USER;

  if (typeof db !== 'undefined' && perfil.email) {
    db.collection('perfis').doc(perfil.email).get().then(function(doc) {
      if (doc.exists) {
        var data = doc.data();
        localStorage.setItem('ccin-perfil', JSON.stringify(data));
        callback(data);
      } else {
        callback(perfil);
      }
    }).catch(function() {
      callback(perfil);
    });
  } else {
    callback(perfil);
  }
}

/* ─── CANDIDATURAS (Minhas Candidaturas) ─────────────────── */
function registrarCandidatura(vagaId, vagaTitulo, empresa, canal) {
  var candidaturas = JSON.parse(localStorage.getItem('ccin-candidaturas') || '[]');
  var hoje = new Date().toISOString().split('T')[0];

  var existe = candidaturas.some(function(c) { return c.vagaId === vagaId; });
  if (!existe) {
    candidaturas.unshift({
      vagaId: vagaId,
      titulo: vagaTitulo,
      empresa: empresa,
      data: hoje,
      canal: canal || 'WhatsApp'
    });
    localStorage.setItem('ccin-candidaturas', JSON.stringify(candidaturas));
  }
}

/* ─── VAGA CARD HTML ─────────────────────────────────────── */
function vagaCardHTML(vaga) {
  var isEncerrada = vaga.status === 'encerrada';
  var statusBadge = isEncerrada
    ? '<span class="tag tag--encerrada">🔴 Vaga Encerrada</span>'
    : '<span class="tag tag--aberta">🟢 Processo Aberto</span>';

  var nivelBadge = vaga.nivel
    ? '<span class="tag tag--estudante">' + (vaga.nivel === 'Pos-Graduado' ? '🏆 Pós-Graduação' : vaga.nivel) + '</span>'
    : '';

  var modBadge = vaga.modalidade
    ? '<span class="tag tag--ead">' + vaga.modalidade + '</span>'
    : '';

  var areaBadge = vaga.area
    ? '<span class="tag" style="border-color:var(--green-border);color:var(--green-text)">' + vaga.area + '</span>'
    : '';

  var contactButtonsHTML = '';
  var whatsMsg = encodeURIComponent('Olá! Sou aluno/formado da Faculdade Inspirar e tenho interesse na vaga de ' + (vaga.especialidade || vaga.area) + ' no(a) ' + vaga.empresa + '. Podemos conversar?');
  var mailSubject = encodeURIComponent('Candidatura Conexão Inspirar — ' + (vaga.especialidade || vaga.area));
  var mailBody = encodeURIComponent('Olá equipe de recrutamento da ' + vaga.empresa + ',\n\nSou estudante/formado da Faculdade Inspirar e gostaria de me candidatar à oportunidade de ' + (vaga.especialidade || vaga.area) + ' divulgada no Portal Conexão Inspirar.\n\nAguardo retorno!');

  if (isEncerrada) {
    contactButtonsHTML = '<button class="btn-outline btn-sm" disabled style="opacity:0.6;cursor:not-allowed;width:100%">Processo Seletivo Finalizado</button>';
  } else {
    var rawPhone = (vaga.whatsapp || vaga.contato || '').replace(/\D/g, '');
    var email = (vaga.contato && vaga.contato.includes('@')) ? vaga.contato : (vaga.email || 'rh@empresa.com');

    var btnWhats = '<a href="https://wa.me/55' + rawPhone + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + (vaga.especialidade || vaga.area) + '\', \'' + vaga.empresa + '\', \'WhatsApp\')">WhatsApp →</a>';
    var btnEmail = '<a href="mailto:' + email + '?subject=' + mailSubject + '&body=' + mailBody + '" class="btn-ghost btn-sm" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + (vaga.especialidade || vaga.area) + '\', \'' + vaga.empresa + '\', \'E-mail\')">E-mail →</a>';

    if (vaga.tipoContato === 'whatsapp') {
      contactButtonsHTML = '<a href="https://wa.me/55' + rawPhone + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" style="width:100%;justify-content:center" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + (vaga.especialidade || vaga.area) + '\', \'' + vaga.empresa + '\', \'WhatsApp\')">Candidatar-se via WhatsApp →</a>';
    } else if (vaga.tipoContato === 'email') {
      contactButtonsHTML = '<a href="mailto:' + email + '?subject=' + mailSubject + '&body=' + mailBody + '" class="btn-primary btn-sm" style="width:100%;justify-content:center" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + (vaga.especialidade || vaga.area) + '\', \'' + vaga.empresa + '\', \'E-mail\')">Candidatar-se via E-mail →</a>';
    } else {
      contactButtonsHTML = '<div class="vaga-contact-group">' + btnWhats + btnEmail + '</div>';
    }
  }

  return '<div class="vaga-card" data-reveal>' +
    '<div class="vaga-card__header">' +
      '<div class="vaga-card__company">' +
        '<div class="vaga-card__avatar">' + (vaga.empresa ? vaga.empresa.charAt(0).toUpperCase() : 'E') + '</div>' +
        '<div>' +
          '<div class="vaga-card__name">' + vaga.empresa + '</div>' +
          '<div class="vaga-card__location">' +
            '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            vaga.cidade + ' · ' + vaga.estado +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">' +
        '<span class="tag tag--tipo">' + vaga.tipo + '</span>' +
        statusBadge +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:6px;flex-wrap:wrap">' +
      nivelBadge +
      areaBadge +
      modBadge +
    '</div>' +
    '<div style="font-weight:700;font-size:14px;color:var(--text-heading);margin-top:4px">' + (vaga.especialidade || '') + '</div>' +
    '<p class="vaga-card__desc">' + vaga.descricao + '</p>' +
    '<div class="vaga-card__footer" style="flex-direction:column;align-items:stretch;gap:10px">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--text-dim)">' +
        '<span>Publicada em: ' + formatDate(vaga.data) + '</span>' +
      '</div>' +
      contactButtonsHTML +
    '</div>' +
  '</div>';
}

/* ─── LOGIN (login.html) ─────────────────────────────────── */
(function initLogin() {
  var form = document.getElementById('loginForm');
  if (!form) return;

  var errorMsg = document.getElementById('loginError');
  var togglePwd = document.getElementById('togglePwd');
  var pwdInput = document.getElementById('loginSenha');

  if (togglePwd && pwdInput) {
    togglePwd.addEventListener('click', function () {
      var isHidden = pwdInput.type === 'password';
      pwdInput.type = isHidden ? 'text' : 'password';
      togglePwd.innerHTML = isHidden
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
    });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var identifier = document.getElementById('loginEmail').value.trim().toLowerCase();
    var senha = document.getElementById('loginSenha').value;

    var isDemo =
      (identifier === DEMO_USER.email || identifier === DEMO_USER.cpf) &&
      senha === DEMO_USER.senha;

    if (isDemo) {
      localStorage.setItem('ccin-logado', '1');
      if (!localStorage.getItem('ccin-perfil')) {
        localStorage.setItem('ccin-perfil', JSON.stringify(DEMO_USER));
      }
      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Entrando...';
      btn.disabled = true;
      btn.style.opacity = '0.75';
      setTimeout(function () { window.location.href = 'painel.html'; }, 800);
    } else {
      if (errorMsg) {
        errorMsg.style.display = 'flex';
        setTimeout(function () { errorMsg.style.display = 'none'; }, 4500);
      }
      pwdInput.value = '';
      pwdInput.focus();
    }
  });
})();

/* ─── FORMULÁRIO DE VAGA (empresa.html) ──────────────────── */
(function initVagaForm() {
  var form = document.getElementById('vagaForm');
  if (!form) return;

  var nivelSelect = document.getElementById('vagaNivel');
  var areaSelect = document.getElementById('vagaArea');
  if (nivelSelect && areaSelect) {
    populateAreaSelect(nivelSelect.value, areaSelect, '', false);
    nivelSelect.addEventListener('change', function() {
      populateAreaSelect(nivelSelect.value, areaSelect, '', false);
    });
  }

  var successMsg = document.getElementById('vagaSuccess');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    function getVal(id) {
      var el = document.getElementById(id);
      return el ? (el.value || '').trim() : '';
    }

    var hoje = new Date().toISOString().split('T')[0];
    var nova = {
      empresa: getVal('vagaEmpresa') || 'Empresa Contratante',
      cidade: getVal('vagaCidade') || 'Curitiba',
      estado: getVal('vagaEstado') || 'PR',
      nivel: getVal('vagaNivel') || 'Graduado',
      area: getVal('vagaArea') || 'Fisioterapia (Presencial - Curitiba)',
      especialidade: getVal('vagaEspecialidade') || 'Geral',
      modalidade: getVal('vagaModalidade') || 'Presencial',
      tipo: getVal('vagaTipo') || 'CLT',
      tipoContato: getVal('vagaTipoContato') || 'ambos',
      contato: getVal('vagaContato') || 'contato@empresa.com',
      whatsapp: getVal('vagaWhatsapp') || '',
      descricao: getVal('vagaDescricao') || '',
      status: 'aberta',
      data: hoje,
      createdAt: Date.now()
    };

    var btn = form.querySelector('button[type="submit"]');
    var originalText = btn.textContent;
    btn.textContent = 'Publicando vaga...';
    btn.disabled = true;

    var handled = false;

    function completeSubmit(error) {
      if (handled) return;
      handled = true;

      try {
        var localVagas = JSON.parse(localStorage.getItem('ccin-vagas') || '[]');
        nova.id = 'loc-' + Date.now();
        localVagas.unshift(nova);
        localStorage.setItem('ccin-vagas', JSON.stringify(localVagas));
      } catch (e) {
        console.error("Local storage error:", e);
      }

      btn.textContent = 'Vaga publicada com sucesso!';
      if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(function () { successMsg.style.display = 'none'; }, 5000);
      }

      setTimeout(function () {
        form.reset();
        btn.textContent = originalText;
        btn.disabled = false;
        if (nivelSelect && areaSelect) populateAreaSelect(nivelSelect.value, areaSelect, '', false);
        renderVagasEmpresa();
        var vagasSection = document.getElementById('vagasPublicadas');
        if (vagasSection) vagasSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 1200);
    }

    var timer = setTimeout(function() {
      completeSubmit("Timeout de rede");
    }, 2500);

    if (typeof db !== 'undefined') {
      try {
        db.collection('vagas').add(nova).then(function(docRef) {
          clearTimeout(timer);
          completeSubmit(null);
        }).catch(function(err) {
          clearTimeout(timer);
          completeSubmit(err);
        });
      } catch (err) {
        clearTimeout(timer);
        completeSubmit(err);
      }
    } else {
      clearTimeout(timer);
      completeSubmit("Offline fallback");
    }
  });

  renderVagasEmpresa();
  renderVitrineTalentos();
})();

/* ─── VITRINE VIP DE TALENTOS (empresa.html) ─────────────── */
function renderVitrineTalentos() {
  var grid = document.getElementById('vitrineTalentosGrid');
  var filterNivel = document.getElementById('vitrineFilterNivel');
  var filterArea = document.getElementById('vitrineFilterArea');
  var filterEst = document.getElementById('vitrineFilterEst');
  if (!grid) return;

  if (filterNivel && filterArea) {
    populateAreaSelect(filterNivel.value, filterArea, '', true);
    filterNivel.addEventListener('change', function() {
      populateAreaSelect(filterNivel.value, filterArea, '', true);
      applyVitrineFilter();
    });
  }

  var DEMO_TALENTOS = [
    {
      nome: 'Ana Paula Silva',
      email: 'anapaula@inspirar.com',
      statusAcademico: 'Pos-Graduado',
      area: 'Fisioterapia Pélvica Funcional',
      especialidade: 'Fisioterapia Pélvica / Hospitalar',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 9999-8888',
      bio: 'Especialista pós-graduada pela Inspirar com foco em reabilitação uroginecológica e obstetrícia humanizada.',
      linkedin: 'https://linkedin.com',
      instagram: '@anapaula.saude',
      fotoUrl: 'https://images.unsplash.com/photo-1594824813571-2b533411efa0?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Ana_Paula_Silva.pdf',
      curriculoTamanho: '184 KB',
      contratadoPelaPlataforma: true
    },
    {
      nome: 'Juliana Medeiros',
      email: 'juliana@inspirar.com',
      statusAcademico: 'Graduado',
      area: 'Direito (Presencial - Curitiba)',
      especialidade: 'Direito Médico & Compliance',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 8765-4321',
      bio: 'Advogada graduada em Direito pela Inspirar, atuante em regulação e compliance hospitalar.',
      linkedin: 'https://linkedin.com',
      instagram: '@juliana.direito',
      fotoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Juliana_Medeiros.pdf',
      curriculoTamanho: '162 KB',
      contratadoPelaPlataforma: true
    },
    {
      nome: 'Lucas Gabriel',
      email: 'lucas@inspirar.com',
      statusAcademico: 'Graduando',
      area: 'Biomedicina (Presencial - Curitiba)',
      especialidade: 'Análises Clínicas e Diagnóstico',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 9123-4567',
      bio: 'Graduando do 6º período de Biomedicina na Inspirar em busca de oportunidades em laboratório.',
      linkedin: 'https://linkedin.com',
      instagram: '@lucas.biomed',
      fotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Lucas_Gabriel.pdf',
      curriculoTamanho: '145 KB',
      contratadoPelaPlataforma: false
    },
    {
      nome: 'Camila Ribeiro',
      email: 'camila@inspirar.com',
      statusAcademico: 'Graduando',
      area: 'Psicologia (Presencial - Curitiba)',
      especialidade: 'Psicologia Clínica e Organizacional',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 9654-3210',
      bio: 'Aluna de Psicologia focada em desenvolvimento humano, avaliação psicológica e RH.',
      linkedin: 'https://linkedin.com',
      instagram: '@camila.psico',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Camila_Ribeiro.pdf',
      curriculoTamanho: '190 KB',
      contratadoPelaPlataforma: false
    },
    {
      nome: 'Carlos Eduardo',
      email: 'carlos@inspirar.com',
      statusAcademico: 'Graduado',
      area: 'Tecnólogo em Gestão Hospitalar (Graduação EAD)',
      especialidade: 'Gestão Hospitalar & Processos',
      modalidade: '100% Online (EAD)',
      cidade: 'Remoto / Nacional',
      estado: '100% Online (EAD)',
      whatsapp: '(11) 9 9333-7788',
      bio: 'Graduado em Gestão Hospitalar EAD pela Inspirar com experiência em auditoria de leitos.',
      linkedin: 'https://linkedin.com',
      instagram: '',
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Carlos_Eduardo.pdf',
      curriculoTamanho: '210 KB',
      contratadoPelaPlataforma: true
    },
    {
      nome: 'Mateus Kuanza',
      email: 'mateus@inspirar.com',
      statusAcademico: 'Graduando',
      area: 'Administração (Graduação EAD)',
      especialidade: 'Administração e Gestão Estratégica',
      modalidade: 'Polo Luanda (Angola)',
      cidade: 'Luanda',
      estado: 'Luanda (Angola)',
      whatsapp: '(244) 924 112 233',
      bio: 'Aluno do polo Luanda focado em planejamento financeiro, processos organizacionais e liderança.',
      linkedin: 'https://linkedin.com',
      instagram: '@mateus.adm',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Mateus_Kuanza.pdf',
      curriculoTamanho: '175 KB',
      contratadoPelaPlataforma: false
    }
  ];

  function applyVitrineFilter() {
    var nivel = filterNivel ? filterNivel.value : '';
    var area = filterArea ? filterArea.value : '';
    var est = filterEst ? filterEst.value : '';

    var formadosLocais = JSON.parse(localStorage.getItem('ccin-admin-formados') || '[]');
    var perfilLogado = JSON.parse(localStorage.getItem('ccin-perfil') || 'null');
    if (perfilLogado && !formadosLocais.some(function(f){ return f.email === perfilLogado.email; })) {
      formadosLocais.unshift(perfilLogado);
    }

    var lista = formadosLocais.concat(DEMO_TALENTOS);

    if (nivel) lista = lista.filter(function(t) { return t.statusAcademico === nivel; });
    if (area) lista = lista.filter(function(t) { return (t.area || '').includes(area) || (t.especialidade || '').includes(area); });
    if (est) lista = lista.filter(function(t) { return t.estado === est || (t.modalidade || '').includes(est); });

    if (!lista.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div><div class="empty-state__title">Nenhum talento encontrado</div><p>Tente selecionar outro nível ou área de formação.</p></div>';
      return;
    }

    grid.innerHTML = lista.map(function(t) {
      var inicial = (t.nome || 'E').charAt(0).toUpperCase();
      var avatarHTML = t.fotoUrl
        ? '<img src="' + t.fotoUrl + '" class="vaga-card__avatar" style="object-fit:cover;border-radius:12px">'
        : '<div class="vaga-card__avatar" style="background:var(--green-subtle);border-color:var(--green-border);color:var(--green)">' + inicial + '</div>';

      var badgeAcademico = t.statusAcademico === 'Graduando'
        ? '<span class="tag tag--estudante">🎓 Graduando</span>'
        : (t.statusAcademico === 'Pos-Graduado' ? '<span class="tag tag--formado">🏆 Pós-Graduado</span>' : '<span class="tag tag--formado">🎓 Graduado</span>');

      var badgeContratado = t.contratadoPelaPlataforma
        ? '<div style="margin-top:4px"><span class="badge-contratado">✨ Contratado via Conexão Inspirar</span></div>'
        : '';

      var socialLinksHTML = '';
      if (t.linkedin) {
        socialLinksHTML += '<a href="' + t.linkedin + '" target="_blank" rel="noopener" class="talent-social-btn" title="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>';
      }
      if (t.instagram) {
        socialLinksHTML += '<a href="https://instagram.com/' + t.instagram.replace('@', '') + '" target="_blank" rel="noopener" class="talent-social-btn" title="Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>';
      }

      var bioHTML = t.bio ? '<p class="talent-bio">"' + t.bio + '"</p>' : '';
      
      var curriculoBtn = (t.curriculoUrl || t.curriculoNome || t.email)
        ? '<button type="button" class="btn-outline btn-sm" style="font-size:11px;padding:6px 11px;cursor:pointer" onclick="abrirCurriculoTalento(\'' + (t.email || '') + '\', \'' + (t.curriculoNome || ('Curriculo_' + t.nome.replace(/\s+/g, '_') + '.pdf')) + '\', \'' + (t.curriculoUrl || '') + '\')">📄 Currículo PDF</button>'
        : '';

      var whatsMsg = encodeURIComponent('Olá ' + t.nome + ', vi seu perfil no Conexão Inspirar e temos uma oportunidade compatível com sua área (' + (t.especialidade || t.area) + ')!');

      return '<div class="vaga-card" data-reveal>' +
        '<div class="vaga-card__header">' +
          '<div class="vaga-card__company">' +
            avatarHTML +
            '<div>' +
              '<div class="vaga-card__name">' + t.nome + '</div>' +
              '<div class="vaga-card__location">' +
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                t.cidade + ' · ' + t.estado +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">' +
            badgeAcademico +
          '</div>' +
        '</div>' +
        badgeContratado +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">' +
          '<span class="tag" style="border-color:var(--green-border);color:var(--green-text)">' + (t.area || 'Saúde') + '</span>' +
          (t.especialidade && t.especialidade !== t.area ? '<span class="tag">' + t.especialidade + '</span>' : '') +
        '</div>' +
        bioHTML +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-subtle);flex-wrap:wrap;gap:8px">' +
          '<div class="talent-social-links">' + socialLinksHTML + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;margin-left:auto">' +
            curriculoBtn +
            '<a href="https://wa.me/55' + (t.whatsapp || '').replace(/\D/g, '') + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" style="font-size:12px;padding:7px 14px">Contatar →</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    revealCards(grid);
  }

  if (filterArea) filterArea.addEventListener('change', applyVitrineFilter);
  if (filterEst) filterEst.addEventListener('change', applyVitrineFilter);
  applyVitrineFilter();
}

function renderVagasEmpresa() {
  var container = document.getElementById('vagasContainer');
  if (!container) return;

  listenVagas(function(vagas) {
    if (!vagas || vagas.length === 0) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg></div><div class="empty-state__title">Nenhuma vaga ainda</div><p>Seja o primeiro a publicar uma oportunidade para os talentos da Inspirar.</p></div>';
      return;
    }
    container.innerHTML = vagas.slice(0, 8).map(vagaCardHTML).join('');
    revealCards(container);
  });
}

/* ─── PAINEL DO ALUNO (painel.html) ──────────────────────── */
(function initPainel() {
  var painel = document.getElementById('painelApp');
  if (!painel) return;

  if (!localStorage.getItem('ccin-logado')) {
    window.location.href = 'login.html';
    return;
  }

  getPerfilLocalOrFirestore(function(perfil) {
    document.querySelectorAll('.painel__user-name').forEach(function (el) {
      el.textContent = perfil.nome;
    });
    var espEl = document.querySelector('.painel__user-esp');
    if (espEl) {
      var prefix = (perfil.statusAcademico === 'Graduando') ? '🎓 Graduando(a) em ' : (perfil.statusAcademico === 'Pos-Graduado' ? '🏆 Especialista em ' : '🎓 Graduado(a) em ');
      espEl.textContent = prefix + (perfil.especialidade || perfil.area);
    }
    var cidEl = document.querySelector('.painel__user-cidade');
    if (cidEl) cidEl.textContent = perfil.cidade + ' · ' + perfil.estado;
    var avatarEl = document.querySelector('.painel__user-avatar');
    if (avatarEl) {
      if (perfil.fotoUrl) {
        avatarEl.innerHTML = '<img src="' + perfil.fotoUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
      } else {
        avatarEl.textContent = perfil.nome.charAt(0).toUpperCase();
      }
    }

    var navItems = document.querySelectorAll('.painel__nav-item');
    var sections = document.querySelectorAll('.painel__section');

    function showSection(id) {
      sections.forEach(function (s) {
        s.classList.toggle('active', s.id === id);
      });
      navItems.forEach(function (n) {
        n.classList.toggle('active', n.dataset.section === id);
      });

      if (id === 'sec-minhas-vagas') renderMinhasVagas(perfil);
      if (id === 'sec-todas-vagas') renderTodasVagas();
      if (id === 'sec-candidaturas') renderMinhasCandidaturas();
      if (id === 'sec-vitrine-talentos') renderPainelVitrine();
    }

    navItems.forEach(function (item) {
      item.addEventListener('click', function () {
        var section = item.dataset.section;
        if (section === 'logout') {
          localStorage.removeItem('ccin-logado');
          window.location.href = 'index.html';
          return;
        }
        showSection(section);
        var sidebar = document.getElementById('painelSidebar');
        if (sidebar) sidebar.classList.remove('sidebar-open');
      });
    });

    showSection('sec-minhas-vagas');
  });

  var sidebarToggle = document.getElementById('sidebarToggle');
  var sidebar = document.getElementById('painelSidebar');
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function () {
      sidebar.classList.toggle('sidebar-open');
    });
    document.addEventListener('click', function (e) {
      if (sidebar.classList.contains('sidebar-open') &&
          !sidebar.contains(e.target) &&
          e.target !== sidebarToggle) {
        sidebar.classList.remove('sidebar-open');
      }
    });
  }

  initPerfilForm();
})();

function renderMinhasVagas(perfil) {
  var container = document.getElementById('minhasVagasContainer');
  if (!container) return;

  listenVagas(function(all) {
    var filtered = all.filter(function (v) {
      return v.estado === perfil.estado ||
             v.area === perfil.area ||
             v.nivel === perfil.statusAcademico ||
             v.modalidade === '100% Online';
    });

    filtered.sort(function (a, b) {
      var aScore = (a.estado === perfil.estado ? 2 : 0) + (a.area === perfil.area ? 2 : 0) + (a.status === 'aberta' ? 1 : -2);
      var bScore = (b.estado === perfil.estado ? 2 : 0) + (b.area === perfil.area ? 2 : 0) + (b.status === 'aberta' ? 1 : -2);
      return bScore - aScore;
    });

    if (filtered.length === 0) {
      container.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
          '<div class="empty-state__title">Nenhuma vaga correspondente</div>' +
          '<p>Não encontramos vagas exatas para seu curso/região no momento. Explore a aba "Todas as Vagas" para oportunidades remotas ou em outras áreas.</p>' +
        '</div>';
      return;
    }

    container.innerHTML = filtered.map(vagaCardHTML).join('');
    revealCards(container);
  });
}

function renderTodasVagas() {
  var container = document.getElementById('todasVagasContainer');
  var filterNivel = document.getElementById('filterNivel');
  var filterArea = document.getElementById('filterArea');
  var filterEst = document.getElementById('filterEst');
  var filterSearch = document.getElementById('filterSearch');
  if (!container) return;

  if (filterNivel && filterArea) {
    populateAreaSelect(filterNivel.value, filterArea, '', true);
    filterNivel.addEventListener('change', function() {
      populateAreaSelect(filterNivel.value, filterArea, '', true);
      applyFilter();
    });
  }

  function applyFilter() {
    var nivel = filterNivel ? filterNivel.value : '';
    var area = filterArea ? filterArea.value : '';
    var est = filterEst ? filterEst.value : '';
    var term = filterSearch ? filterSearch.value.trim().toLowerCase() : '';

    listenVagas(function(vagas) {
      if (nivel) vagas = vagas.filter(function(v) { return v.nivel === nivel; });
      if (area) vagas = vagas.filter(function (v) { return (v.area || '').includes(area) || (v.especialidade || '').includes(area); });
      if (est) vagas = vagas.filter(function (v) { return v.estado === est || (v.modalidade || '').includes(est); });
      if (term) {
        vagas = vagas.filter(function (v) {
          var haystack = ((v.empresa || '') + ' ' + (v.cidade || '') + ' ' + (v.descricao || '') + ' ' + (v.area || '') + ' ' + (v.especialidade || '')).toLowerCase();
          return haystack.indexOf(term) !== -1;
        });
      }

      if (vagas.length === 0) {
        container.innerHTML =
          '<div class="empty-state">' +
            '<div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
            '<div class="empty-state__title">Nenhuma vaga encontrada</div>' +
            '<p>Nenhum resultado para os filtros selecionados. Tente alterar o termo da pesquisa.</p>' +
          '</div>';
      } else {
        container.innerHTML = vagas.map(vagaCardHTML).join('');
        revealCards(container);
      }
    });
  }

  if (filterArea) filterArea.addEventListener('change', applyFilter);
  if (filterEst) filterEst.addEventListener('change', applyFilter);
  if (filterSearch) filterSearch.addEventListener('input', applyFilter);
  applyFilter();
}

/* ─── RENDER: MINHAS CANDIDATURAS ────────────────────────── */
function renderMinhasCandidaturas() {
  var container = document.getElementById('minhasCandidaturasContainer');
  if (!container) return;

  var candidaturas = JSON.parse(localStorage.getItem('ccin-candidaturas') || '[]');

  listenVagas(function(allVagas) {
    if (!candidaturas || candidaturas.length === 0) {
      container.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1">' +
          '<div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>' +
          '<div class="empty-state__title">Nenhuma candidatura registrada ainda</div>' +
          '<p>Quando você clicar em "Candidatar-se" em qualquer vaga, ela será adicionada aqui automaticamente para você acompanhar o status.</p>' +
        '</div>';
      return;
    }

    container.innerHTML = candidaturas.map(function(c) {
      var vagaOriginal = allVagas.find(function(v) { return v.id === c.vagaId; }) || {};
      var isEncerrada = vagaOriginal.status === 'encerrada';
      var statusBadge = isEncerrada
        ? '<span class="tag tag--encerrada">🔴 Processo Encerrado pelo Contratante</span>'
        : '<span class="tag tag--aberta">🟢 Em Andamento (Vaga Aberta)</span>';

      return '<div class="candidatura-card" data-reveal>' +
        '<div class="candidatura-card__header">' +
          '<div>' +
            '<div class="candidatura-card__title">' + (c.titulo || 'Oportunidade Profissional') + '</div>' +
            '<div class="candidatura-card__empresa">' + c.empresa + '</div>' +
          '</div>' +
          statusBadge +
        '</div>' +
        '<div class="candidatura-card__meta">' +
          '<span>📅 Candidatou-se em: ' + formatDate(c.data) + '</span>' +
          '<span>📱 Contato via: ' + (c.canal || 'WhatsApp') + '</span>' +
          (vagaOriginal.cidade ? '<span>📍 ' + vagaOriginal.cidade + ' · ' + vagaOriginal.estado + '</span>' : '') +
        '</div>' +
      '</div>';
    }).join('');

    revealCards(container);
  });
}

function renderPainelVitrine() {
  var grid = document.getElementById('painelVitrineGrid');
  var filterNivel = document.getElementById('painelVitrineNivel');
  var filterArea = document.getElementById('painelVitrineArea');
  var filterEst = document.getElementById('painelVitrineEst');
  if (!grid) return;

  if (filterNivel && filterArea) {
    populateAreaSelect(filterNivel.value, filterArea, '', true);
    filterNivel.addEventListener('change', function() {
      populateAreaSelect(filterNivel.value, filterArea, '', true);
      applyFilter();
    });
  }

  var DEMO_TALENTOS = [
    {
      nome: 'Ana Paula Silva',
      email: 'anapaula@inspirar.com',
      statusAcademico: 'Pos-Graduado',
      area: 'Fisioterapia Pélvica Funcional',
      especialidade: 'Fisioterapia Pélvica / Hospitalar',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 9999-8888',
      bio: 'Especialista pós-graduada pela Inspirar com foco em reabilitação uroginecológica e obstetrícia humanizada.',
      linkedin: 'https://linkedin.com',
      instagram: '@anapaula.saude',
      fotoUrl: 'https://images.unsplash.com/photo-1594824813571-2b533411efa0?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Ana_Paula_Silva.pdf',
      curriculoTamanho: '184 KB',
      contratadoPelaPlataforma: true
    },
    {
      nome: 'Juliana Medeiros',
      email: 'juliana@inspirar.com',
      statusAcademico: 'Graduado',
      area: 'Direito (Presencial - Curitiba)',
      especialidade: 'Direito Médico & Compliance',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 8765-4321',
      bio: 'Advogada graduada em Direito pela Inspirar, atuante em regulação e compliance hospitalar.',
      linkedin: 'https://linkedin.com',
      instagram: '@juliana.direito',
      fotoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Juliana_Medeiros.pdf',
      curriculoTamanho: '162 KB',
      contratadoPelaPlataforma: true
    },
    {
      nome: 'Lucas Gabriel',
      email: 'lucas@inspirar.com',
      statusAcademico: 'Graduando',
      area: 'Biomedicina (Presencial - Curitiba)',
      especialidade: 'Análises Clínicas e Diagnóstico',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 9123-4567',
      bio: 'Graduando do 6º período de Biomedicina na Inspirar em busca de oportunidades em laboratório.',
      linkedin: 'https://linkedin.com',
      instagram: '@lucas.biomed',
      fotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Lucas_Gabriel.pdf',
      curriculoTamanho: '145 KB',
      contratadoPelaPlataforma: false
    },
    {
      nome: 'Camila Ribeiro',
      email: 'camila@inspirar.com',
      statusAcademico: 'Graduando',
      area: 'Psicologia (Presencial - Curitiba)',
      especialidade: 'Psicologia Clínica e Organizacional',
      modalidade: 'Presencial (Curitiba)',
      cidade: 'Curitiba',
      estado: 'PR',
      whatsapp: '(41) 9 9654-3210',
      bio: 'Aluna de Psicologia focada em desenvolvimento humano, avaliação psicológica e RH.',
      linkedin: 'https://linkedin.com',
      instagram: '@camila.psico',
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Camila_Ribeiro.pdf',
      curriculoTamanho: '190 KB',
      contratadoPelaPlataforma: false
    },
    {
      nome: 'Carlos Eduardo',
      email: 'carlos@inspirar.com',
      statusAcademico: 'Graduado',
      area: 'Tecnólogo em Gestão Hospitalar (Graduação EAD)',
      especialidade: 'Gestão Hospitalar & Processos',
      modalidade: '100% Online (EAD)',
      cidade: 'Remoto / Nacional',
      estado: '100% Online (EAD)',
      whatsapp: '(11) 9 9333-7788',
      bio: 'Graduado em Gestão Hospitalar EAD pela Inspirar com experiência em auditoria de leitos.',
      linkedin: 'https://linkedin.com',
      instagram: '',
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Carlos_Eduardo.pdf',
      curriculoTamanho: '210 KB',
      contratadoPelaPlataforma: true
    },
    {
      nome: 'Mateus Kuanza',
      email: 'mateus@inspirar.com',
      statusAcademico: 'Graduando',
      area: 'Administração (Graduação EAD)',
      especialidade: 'Administração e Gestão Estratégica',
      modalidade: 'Polo Luanda (Angola)',
      cidade: 'Luanda',
      estado: 'Luanda (Angola)',
      whatsapp: '(244) 924 112 233',
      bio: 'Aluno do polo Luanda focado em planejamento financeiro, processos organizacionais e liderança.',
      linkedin: 'https://linkedin.com',
      instagram: '@mateus.adm',
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Mateus_Kuanza.pdf',
      curriculoTamanho: '175 KB',
      contratadoPelaPlataforma: false
    }
  ];

  function applyFilter() {
    var nivel = filterNivel ? filterNivel.value : '';
    var area = filterArea ? filterArea.value : '';
    var est = filterEst ? filterEst.value : '';

    var formadosLocais = JSON.parse(localStorage.getItem('ccin-admin-formados') || '[]');
    var perfilLogado = JSON.parse(localStorage.getItem('ccin-perfil') || 'null');
    if (perfilLogado && !formadosLocais.some(function(f){ return f.email === perfilLogado.email; })) {
      formadosLocais.unshift(perfilLogado);
    }

    var lista = formadosLocais.concat(DEMO_TALENTOS);

    if (nivel) lista = lista.filter(function(t) { return t.statusAcademico === nivel; });
    if (area) lista = lista.filter(function(t) { return (t.area || '').includes(area) || (t.especialidade || '').includes(area); });
    if (est) lista = lista.filter(function(t) { return t.estado === est || (t.modalidade || '').includes(est); });

    if (!lista.length) {
      grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg></div><div class="empty-state__title">Nenhum colega encontrado</div><p>Tente selecionar outro nível ou área de formação.</p></div>';
      return;
    }

    grid.innerHTML = lista.map(function(t) {
      var inicial = (t.nome || 'E').charAt(0).toUpperCase();
      var avatarHTML = t.fotoUrl
        ? '<img src="' + t.fotoUrl + '" class="vaga-card__avatar" style="object-fit:cover;border-radius:12px">'
        : '<div class="vaga-card__avatar" style="background:var(--green-subtle);border-color:var(--green-border);color:var(--green)">' + inicial + '</div>';

      var badgeAcademico = t.statusAcademico === 'Graduando'
        ? '<span class="tag tag--estudante">🎓 Graduando</span>'
        : (t.statusAcademico === 'Pos-Graduado' ? '<span class="tag tag--formado">🏆 Pós-Graduado</span>' : '<span class="tag tag--formado">🎓 Graduado</span>');

      var badgeContratado = t.contratadoPelaPlataforma
        ? '<div style="margin-top:4px"><span class="badge-contratado">✨ Contratado via Conexão Inspirar</span></div>'
        : '';

      var socialLinksHTML = '';
      if (t.linkedin) {
        socialLinksHTML += '<a href="' + t.linkedin + '" target="_blank" rel="noopener" class="talent-social-btn" title="LinkedIn"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>';
      }
      if (t.instagram) {
        socialLinksHTML += '<a href="https://instagram.com/' + t.instagram.replace('@', '') + '" target="_blank" rel="noopener" class="talent-social-btn" title="Instagram"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg></a>';
      }

      var bioHTML = t.bio ? '<p class="talent-bio">"' + t.bio + '"</p>' : '';
      
      var curriculoBtn = (t.curriculoUrl || t.curriculoNome || t.email)
        ? '<button type="button" class="btn-outline btn-sm" style="font-size:11px;padding:6px 11px;cursor:pointer" onclick="abrirCurriculoTalento(\'' + (t.email || '') + '\', \'' + (t.curriculoNome || ('Curriculo_' + t.nome.replace(/\s+/g, '_') + '.pdf')) + '\', \'' + (t.curriculoUrl || '') + '\')">📄 Currículo PDF</button>'
        : '';

      var whatsMsg = encodeURIComponent('Olá ' + t.nome + ', sou colega da comunidade Conexão Inspirar e vi seu perfil na Rede!');

      return '<div class="vaga-card" data-reveal>' +
        '<div class="vaga-card__header">' +
          '<div class="vaga-card__company">' +
            avatarHTML +
            '<div>' +
              '<div class="vaga-card__name">' + t.nome + '</div>' +
              '<div class="vaga-card__location">' +
                '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
                t.cidade + ' · ' + t.estado +
              '</div>' +
            '</div>' +
          '</div>' +
          badgeAcademico +
        '</div>' +
        badgeContratado +
        '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:4px">' +
          '<span class="tag" style="border-color:var(--green-border);color:var(--green-text)">' + (t.area || 'Saúde') + '</span>' +
          (t.especialidade && t.especialidade !== t.area ? '<span class="tag">' + t.especialidade + '</span>' : '') +
        '</div>' +
        bioHTML +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-subtle);flex-wrap:wrap;gap:8px">' +
          '<div class="talent-social-links">' + socialLinksHTML + '</div>' +
          '<div style="display:flex;gap:6px;align-items:center;margin-left:auto">' +
            curriculoBtn +
            '<a href="https://wa.me/55' + (t.whatsapp || '').replace(/\D/g, '') + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" style="font-size:12px;padding:7px 14px">Conectar via WhatsApp →</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    revealCards(grid);
  }

  if (filterArea) filterArea.addEventListener('change', applyFilter);
  if (filterEst) filterEst.addEventListener('change', applyFilter);
  applyFilter();
}

/* ─── FORMULÁRIO DE PERFIL (painel.html) ─────────────────── */
function initPerfilForm() {
  var form = document.getElementById('perfilForm');
  if (!form) return;

  var nivelSelect = document.getElementById('perfilStatusAcademico');
  var areaSelect = document.getElementById('perfilArea');

  // Elementos do Avatar / Foto de Perfil
  var avatarImg = document.getElementById('avatarPreviewImg');
  var avatarFallback = document.getElementById('avatarPreviewFallback');
  var btnRemoverFoto = document.getElementById('btnRemoverFoto');
  var fotoInput = document.getElementById('perfilFoto');

  // Elementos do Currículo PDF
  var curriculoDropzone = document.getElementById('curriculoDropzone');
  var curriculoCard = document.getElementById('curriculoCard');
  var curriculoCardName = document.getElementById('curriculoCardName');
  var curriculoCardSize = document.getElementById('curriculoCardSize');
  var curriculoInput = document.getElementById('perfilCurriculo');
  var btnVisualizarPDF = document.getElementById('btnVisualizarPDF');
  var btnBaixarPDF = document.getElementById('btnBaixarPDF');
  var btnRemoverPDF = document.getElementById('btnRemoverPDF');

  var celebrationBanner = document.getElementById('celebrationBanner');

  getPerfilLocalOrFirestore(function(perfil) {
    if (nivelSelect && areaSelect) {
      populateAreaSelect(perfil.statusAcademico || 'Pos-Graduado', areaSelect, perfil.area || '', false);
      nivelSelect.addEventListener('change', function() {
        populateAreaSelect(nivelSelect.value, areaSelect, '', false);
      });
    }

    var fields = ['nome', 'statusAcademico', 'area', 'especialidade', 'modalidade', 'cidade', 'estado', 'whatsapp', 'bio', 'linkedin', 'instagram', 'site'];
    fields.forEach(function (f) {
      var el = form.querySelector('[name="' + f + '"]');
      if (el && perfil[f]) el.value = perfil[f];
    });

    var contratadoCheck = form.querySelector('[name="contratadoPelaPlataforma"]');
    if (contratadoCheck) {
      contratadoCheck.checked = !!perfil.contratadoPelaPlataforma;
      if (celebrationBanner) celebrationBanner.style.display = perfil.contratadoPelaPlataforma ? 'flex' : 'none';
      contratadoCheck.addEventListener('change', function() {
        if (celebrationBanner) celebrationBanner.style.display = contratadoCheck.checked ? 'flex' : 'none';
      });
    }

    // ─── ESTADO E INTERATIVIDADE DA FOTO ────────────────────
    var currentFotoUrl = perfil.fotoUrl || '';

    function renderFotoPreview(url) {
      if (url) {
        if (avatarImg) {
          avatarImg.src = url;
          avatarImg.style.display = 'block';
        }
        if (avatarFallback) avatarFallback.style.display = 'none';
        if (btnRemoverFoto) btnRemoverFoto.style.display = 'inline-flex';
      } else {
        if (avatarImg) avatarImg.style.display = 'none';
        if (avatarFallback) {
          avatarFallback.style.display = 'flex';
          avatarFallback.textContent = (perfil.nome || 'A').charAt(0).toUpperCase();
        }
        if (btnRemoverFoto) btnRemoverFoto.style.display = 'none';
      }
    }

    renderFotoPreview(currentFotoUrl);

    if (fotoInput) {
      fotoInput.addEventListener('change', function() {
        if (fotoInput.files.length > 0) {
          var f = fotoInput.files[0];
          comprimirFoto(f, function(compressedUrl) {
            currentFotoUrl = compressedUrl;
            renderFotoPreview(currentFotoUrl);

            // Atualiza sidebar instantaneamente para feedback visual
            var sbAvatar = document.querySelector('.painel__user-avatar');
            if (sbAvatar) sbAvatar.innerHTML = '<img src="' + compressedUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
          });
        }
      });
    }

    if (btnRemoverFoto) {
      btnRemoverFoto.addEventListener('click', function() {
        currentFotoUrl = '';
        if (fotoInput) fotoInput.value = '';
        renderFotoPreview('');
        var sbAvatar = document.querySelector('.painel__user-avatar');
        if (sbAvatar) sbAvatar.textContent = (perfil.nome || 'A').charAt(0).toUpperCase();
      });
    }

    // ─── ESTADO E INTERATIVIDADE DO CURRÍCULO PDF ──────────
    var currentCurriculo = {
      file: null,
      url: perfil.curriculoUrl || '',
      nome: perfil.curriculoNome || (perfil.curriculoUrl ? 'Curriculo_Profissional.pdf' : ''),
      tamanho: perfil.curriculoTamanho || (perfil.curriculoUrl ? 'PDF Anexado' : ''),
      removed: false
    };

    function renderCurriculoUI() {
      if (currentCurriculo.nome && !currentCurriculo.removed) {
        if (curriculoCard) curriculoCard.style.display = 'flex';
        if (curriculoDropzone) curriculoDropzone.style.display = 'none';
        if (curriculoCardName) curriculoCardName.textContent = currentCurriculo.nome;
        if (curriculoCardSize) curriculoCardSize.textContent = currentCurriculo.tamanho || 'PDF';
      } else {
        if (curriculoCard) curriculoCard.style.display = 'none';
        if (curriculoDropzone) curriculoDropzone.style.display = 'block';
      }
    }

    // Verifica se há PDF no IndexedDB
    PDFStorage.obterPDF(perfil.email, function(err, item) {
      if (!err && item && item.blob) {
        currentCurriculo.nome = item.nome || currentCurriculo.nome || 'Curriculo_Profissional.pdf';
        currentCurriculo.tamanho = item.tamanho || currentCurriculo.tamanho || 'PDF Anexado';
        currentCurriculo.url = 'indexeddb:' + perfil.email;
        currentCurriculo.removed = false;
      }
      renderCurriculoUI();
    });

    function processarPDFSelecionado(file) {
      if (!file) return;
      var isPdf = file.name.toLowerCase().endsWith('.pdf') || file.type === 'application/pdf';
      if (!isPdf) {
        alert('Por favor, selecione um arquivo no formato PDF (.pdf).');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert('O arquivo selecionado tem mais de 10 MB. Escolha um arquivo PDF menor.');
        return;
      }

      currentCurriculo = {
        file: file,
        url: '',
        nome: file.name,
        tamanho: formatFileSize(file.size),
        removed: false
      };
      renderCurriculoUI();
    }

    if (curriculoInput) {
      curriculoInput.addEventListener('change', function() {
        if (curriculoInput.files.length > 0) {
          processarPDFSelecionado(curriculoInput.files[0]);
        }
      });
    }

    // Drag and Drop no Dropzone de Currículo
    if (curriculoDropzone) {
      curriculoDropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
        curriculoDropzone.classList.add('dragover');
      });
      curriculoDropzone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        curriculoDropzone.classList.remove('dragover');
      });
      curriculoDropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        curriculoDropzone.classList.remove('dragover');
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
          processarPDFSelecionado(e.dataTransfer.files[0]);
        }
      });
    }

    // Ações nos botões do card de PDF
    if (btnVisualizarPDF) {
      btnVisualizarPDF.addEventListener('click', function() {
        if (currentCurriculo.file) {
          var blobUrl = URL.createObjectURL(currentCurriculo.file);
          window.open(blobUrl, '_blank');
        } else {
          window.abrirCurriculoTalento(perfil.email, currentCurriculo.nome, currentCurriculo.url);
        }
      });
    }

    if (btnBaixarPDF) {
      btnBaixarPDF.addEventListener('click', function() {
        if (currentCurriculo.file) {
          var a = document.createElement('a');
          var blobUrl = URL.createObjectURL(currentCurriculo.file);
          a.href = blobUrl;
          a.download = currentCurriculo.nome || 'Curriculo.pdf';
          document.body.appendChild(a);
          a.click();
          setTimeout(function() { document.body.removeChild(a); }, 400);
        } else {
          window.baixarCurriculoTalento(perfil.email, currentCurriculo.nome, currentCurriculo.url);
        }
      });
    }

    if (btnRemoverPDF) {
      btnRemoverPDF.addEventListener('click', function() {
        if (confirm('Deseja realmente desanexar este currículo em PDF do seu perfil?')) {
          currentCurriculo = {
            file: null,
            url: '',
            nome: '',
            tamanho: '',
            removed: true
          };
          if (curriculoInput) curriculoInput.value = '';
          renderCurriculoUI();
        }
      });
    }

    // ─── SALVAR PERFIL COMPLETO (Foto + PDF + Dados) ─────────
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var orig = btn.textContent;
      btn.textContent = 'Processando foto e currículo...';
      btn.disabled = true;

      var updated = {};
      Object.assign(updated, perfil);
      fields.forEach(function (f) {
        var el = form.querySelector('[name="' + f + '"]');
        if (el) updated[f] = el.value;
      });

      if (contratadoCheck) {
        updated.contratadoPelaPlataforma = contratadoCheck.checked;
      }

      // Atualiza foto
      updated.fotoUrl = currentFotoUrl;

      // Atualiza currículo
      if (currentCurriculo.removed) {
        updated.curriculoUrl = '';
        updated.curriculoNome = '';
        updated.curriculoTamanho = '';
        PDFStorage.removerPDF(perfil.email);
      } else if (currentCurriculo.file) {
        updated.curriculoNome = currentCurriculo.nome;
        updated.curriculoTamanho = currentCurriculo.tamanho;
        updated.curriculoData = new Date().toISOString().split('T')[0];
        updated.curriculoUrl = 'indexeddb:' + perfil.email;

        // Armazena no IndexedDB
        PDFStorage.salvarPDF(perfil.email, currentCurriculo.file, currentCurriculo.nome, currentCurriculo.tamanho);
      }

      function salvarLocalEFirestore() {
        btn.textContent = 'Salvando na base...';
        localStorage.setItem('ccin-perfil', JSON.stringify(updated));

        // Tenta salvar no Firestore se disponível
        if (typeof db !== 'undefined' && updated.email) {
          try {
            db.collection('perfis').doc(updated.email).set(updated, { merge: true });
          } catch(err) {
            console.log("Firestore fallback:", err);
          }
        }

        btn.textContent = 'Perfil e arquivos salvos com sucesso!';
        setTimeout(function () {
          btn.textContent = orig;
          btn.disabled = false;
          document.querySelectorAll('.painel__user-name').forEach(function (el) { el.textContent = updated.nome; });
          var espEl = document.querySelector('.painel__user-esp');
          if (espEl) {
            var prefix = (updated.statusAcademico === 'Graduando') ? '🎓 Graduando(a) em ' : (updated.statusAcademico === 'Pos-Graduado' ? '🏆 Especialista em ' : '🎓 Graduado(a) em ');
            espEl.textContent = prefix + (updated.especialidade || updated.area);
          }
          var cidEl = document.querySelector('.painel__user-cidade');
          if (cidEl) cidEl.textContent = updated.cidade + ' · ' + updated.estado;
          var avatarEl = document.querySelector('.painel__user-avatar');
          if (avatarEl) {
            if (updated.fotoUrl) {
              avatarEl.innerHTML = '<img src="' + updated.fotoUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
            } else {
              avatarEl.textContent = updated.nome.charAt(0).toUpperCase();
            }
          }
          renderVitrineTalentos();
          renderPainelVitrine();
        }, 1200);
      }

      // Se houver arquivo PDF novo e Firebase Storage estiver configurado, tenta subir em nuvem
      if (currentCurriculo.file && typeof storage !== 'undefined') {
        btn.textContent = 'Enviando PDF para o servidor...';
        try {
          var cleanEmail = (updated.email || 'aluno').replace(/[^a-zA-Z0-9]/g, '_');
          var storageRef = storage.ref('curriculos/' + cleanEmail + '.pdf');
          storageRef.put(currentCurriculo.file).then(function(snapshot) {
            return snapshot.ref.getDownloadURL();
          }).then(function(downloadUrl) {
            updated.curriculoUrl = downloadUrl;
            salvarLocalEFirestore();
          }).catch(function(err) {
            console.log("Storage em fallback local seguro:", err);
            salvarLocalEFirestore();
          });
        } catch(e) {
          salvarLocalEFirestore();
        }
      } else {
        salvarLocalEFirestore();
      }
    });
  });
}

/* ─── HELPER: re-ativar reveal nos cards inseridos via JS ── */
function revealCards(container) {
  container.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    setTimeout(function () { el.classList.add('revealed'); }, i * 50);
  });
}
