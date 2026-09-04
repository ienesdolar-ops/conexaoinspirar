/* ============================================================
   CONEXÃO INSPIRAR — JS Principal
   Lógica: Local-first + Cloud Firestore 100% Gratuito (Sem Firebase Storage)
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

/* ─── MOTOR DE ARQUIVOS (IndexedDB + Canvas + Cloud Firestore) ─── */

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
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, w, h);
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

// 1. Repositório local IndexedDB para PDFs (armazenamento instantâneo no navegador)
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

// 2. Repositório em Nuvem Gratuita (Cloud Firestore — sem necessidade de Storage Pago)
var CloudPDFStorage = {
  salvar: function(email, fileOrBlob, nome, callback) {
    if (typeof nome === 'function') {
      callback = nome;
      nome = (fileOrBlob && fileOrBlob.name) || 'Curriculo_Profissional.pdf';
    }
    nome = nome || (fileOrBlob && fileOrBlob.name) || 'Curriculo_Profissional.pdf';

    if (typeof db === 'undefined' || !email || !fileOrBlob) {
      if (callback) callback(new Error('Firestore ou arquivo indisponível'));
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUri = e.target.result;
      var cleanEmail = email.toLowerCase().trim();
      var sizeFormatted = formatFileSize(fileOrBlob.size || dataUri.length * 0.75);

      // PDFs padrão até 800 KB: salvos em documento único no Firestore (Gratuito!)
      if (dataUri.length < 900000) {
        db.collection('curriculos_pdf').doc(cleanEmail).set({
          email: cleanEmail,
          nome: nome,
          tamanho: sizeFormatted,
          dataUri: dataUri,
          isChunked: false,
          updatedAt: Date.now()
        }).then(function() {
          console.log('[CloudPDFStorage] ✅ PDF salvo com sucesso na nuvem para:', cleanEmail);
          if (callback) callback(null);
        }).catch(function(err) {
          console.error('[CloudPDFStorage] ❌ Erro ao salvar PDF:', err);
          if (callback) callback(err);
        });
      } else {
        // PDFs maiores: divididos em partes no Firestore
        var chunkSize = 500000;
        var chunks = [];
        for (var i = 0; i < dataUri.length; i += chunkSize) {
          chunks.push(dataUri.slice(i, i + chunkSize));
        }
        var batch = db.batch();
        var mainRef = db.collection('curriculos_pdf').doc(cleanEmail);
        batch.set(mainRef, {
          email: cleanEmail,
          nome: nome,
          tamanho: sizeFormatted,
          totalChunks: chunks.length,
          isChunked: true,
          updatedAt: Date.now()
        });
        chunks.forEach(function(chunk, idx) {
          var partRef = mainRef.collection('partes').doc(String(idx));
          batch.set(partRef, { chunk: chunk, index: idx });
        });
        batch.commit().then(function() {
          console.log('[CloudPDFStorage] ✅ PDF em partes salvo na nuvem para:', cleanEmail);
          if (callback) callback(null);
        }).catch(function(err) {
          console.error('[CloudPDFStorage] ❌ Erro ao salvar PDF em partes:', err);
          if (callback) callback(err);
        });
      }
    };
    reader.onerror = function(err) {
      if (callback) callback(err);
    };
    reader.readAsDataURL(fileOrBlob);
  },
  obter: function(email, callback) {
    if (typeof db === 'undefined' || !email) {
      callback(new Error('Firestore indisponível'));
      return;
    }
    var cleanEmail = email.toLowerCase().trim();
    db.collection('curriculos_pdf').doc(cleanEmail).get().then(function(doc) {
      if (!doc.exists) {
        callback(new Error('Currículo não encontrado na nuvem'));
        return;
      }
      var data = doc.data();
      if (!data.isChunked && data.dataUri) {
        callback(null, {
          blob: dataUriToBlob(data.dataUri),
          nome: data.nome,
          tamanho: data.tamanho
        });
      } else if (data.isChunked) {
        db.collection('curriculos_pdf').doc(cleanEmail).collection('partes').orderBy('index').get().then(function(snap) {
          var parts = [];
          snap.forEach(function(pDoc) {
            parts.push(pDoc.data().chunk);
          });
          var fullDataUri = parts.join('');
          callback(null, {
            blob: dataUriToBlob(fullDataUri),
            nome: data.nome,
            tamanho: data.tamanho
          });
        }).catch(function(err) {
          callback(err);
        });
      } else {
        callback(new Error('Estrutura de arquivo inválida'));
      }
    }).catch(function(err) {
      callback(err);
    });
  },
  remover: function(email) {
    if (typeof db === 'undefined' || !email) return;
    var cleanEmail = email.toLowerCase().trim();
    db.collection('curriculos_pdf').doc(cleanEmail).delete().catch(function(){});
  }
};

// Gerador de PDF demonstrativo matematicamente válido padrão PDF-1.4
function gerarSamplePDF(nome, area, nivel, especialidade) {
  var sanitize = function(str) {
    return (str || '').replace(/[\\()]/g, '');
  };
  var streamText = 
    "BT\n" +
    "/F1 18 Tf\n" +
    "50 740 Td\n" +
    "(FACULDADE INSPIRAR - CURRICULO PROFISSIONAL) Tj\n" +
    "/F2 10 Tf\n" +
    "0 -22 Td\n" +
    "(Portal Conexao Inspirar - Curitiba, EAD e Polo Luanda Angola) Tj\n" +
    "/F1 14 Tf\n" +
    "0 -40 Td\n" +
    "(Candidato(a): " + sanitize(nome || "Talento Inspirar") + ") Tj\n" +
    "/F2 11 Tf\n" +
    "0 -24 Td\n" +
    "(Nivel Academico: " + sanitize(nivel || "Graduado / Especialista") + ") Tj\n" +
    "0 -20 Td\n" +
    "(Area de Formacao: " + sanitize(area || "Saude e Gestao") + ") Tj\n" +
    "0 -20 Td\n" +
    "(Especialidade / Foco: " + sanitize(especialidade || "Atuacao Profissional") + ") Tj\n" +
    "0 -36 Td\n" +
    "(Status: Perfil ativo e disponivel para selecao de vagas) Tj\n" +
    "/F2 9 Tf\n" +
    "0 -30 Td\n" +
    "(Documento gerado e validado no ecossistema Conexao Inspirar 2026) Tj\n" +
    "ET";
    
  var streamLen = streamText.length;
  
  var obj1 = "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n";
  var obj2 = "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n";
  var obj3 = "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj\n";
  var obj4 = "4 0 obj\n<< /Length " + streamLen + " >>\nstream\n" + streamText + "\nendstream\nendobj\n";
  var obj5 = "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n";
  var obj6 = "6 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n";
  
  var header = "%PDF-1.4\n";
  var offset1 = header.length;
  var offset2 = offset1 + obj1.length;
  var offset3 = offset2 + obj2.length;
  var offset4 = offset3 + obj3.length;
  var offset5 = offset4 + obj4.length;
  var offset6 = offset5 + obj5.length;
  var xrefOffset = offset6 + obj6.length;
  
  var pad = function(n) {
    var s = "0000000000" + n;
    return s.substr(s.length - 10);
  };
  
  var xref = "xref\n0 7\n0000000000 65535 f \n" +
    pad(offset1) + " 00000 n \n" +
    pad(offset2) + " 00000 n \n" +
    pad(offset3) + " 00000 n \n" +
    pad(offset4) + " 00000 n \n" +
    pad(offset5) + " 00000 n \n" +
    pad(offset6) + " 00000 n \n";
    
  var trailer = "trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF";
  
  var doc = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer;
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

/* ─── VISUALIZADOR DE PDF (Modal + Nova Aba + Download) ──── */
window.abrirModalPDF = function(blobOrUrl, nomeArquivo) {
  var modal = document.getElementById('pdfViewerModal');
  var iframe = document.getElementById('pdfModalIframe');
  var titleEl = document.getElementById('pdfModalTitle');
  var newTabBtn = document.getElementById('pdfModalNewTabBtn');
  var dlBtn = document.getElementById('pdfModalDownloadBtn');

  var finalUrl = (typeof blobOrUrl === 'string') ? blobOrUrl : URL.createObjectURL(blobOrUrl);

  if (titleEl) titleEl.textContent = nomeArquivo || 'Currículo Profissional.pdf';
  if (iframe) iframe.src = finalUrl;
  if (newTabBtn) newTabBtn.href = finalUrl;
  if (dlBtn) {
    dlBtn.onclick = function() {
      var a = document.createElement('a');
      a.href = finalUrl;
      a.download = nomeArquivo || 'Curriculo.pdf';
      document.body.appendChild(a);
      a.click();
      setTimeout(function() { document.body.removeChild(a); }, 400);
    };
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    window.open(finalUrl, '_blank');
  }
};

window.fecharModalPDF = function() {
  var modal = document.getElementById('pdfViewerModal');
  var iframe = document.getElementById('pdfModalIframe');
  if (modal) modal.classList.remove('active');
  if (iframe) iframe.src = '';
  document.body.style.overflow = '';
};

// Abertura do PDF do Talento (IndexedDB -> Cloud Firestore Gratuito -> Gerador Inspirar)
window.abrirCurriculoTalento = function(email, nomeArquivo, url) {
  nomeArquivo = nomeArquivo || 'Curriculo_Profissional.pdf';

  if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
    window.abrirModalPDF(url, nomeArquivo);
    return;
  }
  if (url && url.startsWith('data:application/pdf')) {
    var blob = dataUriToBlob(url);
    window.abrirModalPDF(blob, nomeArquivo);
    return;
  }

  // 1. Tenta buscar no IndexedDB do navegador local
  PDFStorage.obterPDF(email, function(err, item) {
    if (!err && item && item.blob) {
      window.abrirModalPDF(item.blob, item.nome || nomeArquivo);
      return;
    }

    // 2. Se não estiver no computador local (ex: recrutador em outro computador), busca na Nuvem Firestore
    CloudPDFStorage.obter(email, function(cloudErr, cloudItem) {
      if (!cloudErr && cloudItem && cloudItem.blob) {
        window.abrirModalPDF(cloudItem.blob, cloudItem.nome || nomeArquivo);
      } else {
        // 3. Fallback: gera PDF oficial Inspirar em tempo real
        var sampleBlob = gerarSamplePDF(nomeArquivo.replace('Curriculo_', '').replace('.pdf', '').replace(/_/g, ' '));
        window.abrirModalPDF(sampleBlob, nomeArquivo);
      }
    });
  });
};

// Download nativo direto do PDF do Talento
window.baixarCurriculoTalento = function(email, nomeArquivo, url) {
  nomeArquivo = nomeArquivo || 'Curriculo_Inspirar.pdf';

  function triggerDownload(blob, filename) {
    var a = document.createElement('a');
    var blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    a.download = filename;
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
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    setTimeout(function() { document.body.removeChild(a); }, 400);
    return;
  }

  // 1. Tenta IndexedDB local
  PDFStorage.obterPDF(email, function(err, item) {
    if (!err && item && item.blob) {
      triggerDownload(item.blob, item.nome || nomeArquivo);
      return;
    }

    // 2. Tenta Nuvem Firestore
    CloudPDFStorage.obter(email, function(cloudErr, cloudItem) {
      if (!cloudErr && cloudItem && cloudItem.blob) {
        triggerDownload(cloudItem.blob, cloudItem.nome || nomeArquivo);
      } else {
        // 3. Fallback gerado
        var sampleBlob = gerarSamplePDF(nomeArquivo.replace('Curriculo_', '').replace('.pdf', '').replace(/_/g, ' '));
        triggerDownload(sampleBlob, nomeArquivo);
      }
    });
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
    empresa: 'Laboratório Diagnose Curitiba',
    cidade: 'Curitiba',
    estado: 'PR',
    nivel: 'Graduando',
    area: 'Biomedicina (Presencial - Curitiba)',
    especialidade: 'Estágio em Análises Clínicas',
    tipo: 'Estágio',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Oportunidade para graduandos de Biomedicina da Inspirar atuarem em rotinas de hematologia, bioquímica e controle de qualidade laboratorial.',
    tipoContato: 'email',
    contato: 'talentos@diagnosecuritiba.med.br',
    whatsapp: '',
    data: '2026-08-23',
    createdAt: new Date('2026-08-23').getTime()
  },
  {
    id: 'mock-4',
    empresa: 'Instituto de Neuropsicologia do Paraná',
    cidade: 'Curitiba',
    estado: 'PR',
    nivel: 'Pos-Graduado',
    area: 'Psicologia, Saúde Mental e Outras',
    especialidade: 'Especialista em ABA e Desenvolvimento Atípico',
    tipo: 'PJ',
    modalidade: 'Presencial',
    status: 'aberta',
    descricao: 'Contratação de psicólogo especialista pós-graduado com formação em ABA / neuropsicologia para atendimento a crianças e adolescentes no espectro.',
    tipoContato: 'ambos',
    contato: 'contato@neuropsicoparana.com.br',
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
  curriculoUrl: 'cloud:demo@inspirar.com',
  curriculoNome: 'Curriculo_Ana_Paula_Silva.pdf',
  curriculoTamanho: '112 KB',
  contratadoPelaPlataforma: true,
  updatedAt: 0
};

/* ─── UTILITÁRIOS & FIRESTORE OPERAÇÕES ──────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  var parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  var meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  return parts[2] + ' ' + meses[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}

function listenVagas(callback) {
  var timer = setTimeout(function () {
    var saved = localStorage.getItem('ccin-vagas');
    var localList = saved ? JSON.parse(saved) : [];
    callback(localList.concat(VAGAS_MOCK));
  }, 2500);

  if (typeof db !== 'undefined') {
    try {
      db.collection('vagas').orderBy('createdAt', 'desc').onSnapshot(function (snapshot) {
        clearTimeout(timer);
        var cloudVagas = [];
        snapshot.forEach(function (doc) {
          var d = doc.data();
          d.id = doc.id;
          cloudVagas.push(d);
        });
        var saved = localStorage.getItem('ccin-vagas');
        var localList = saved ? JSON.parse(saved) : [];
        var all = cloudVagas.concat(
          localList.filter(function (l) {
            return !cloudVagas.some(function (c) { return c.id === l.id; });
          })
        ).concat(VAGAS_MOCK);

        var unique = [];
        var seen = {};
        all.forEach(function (v) {
          if (!seen[v.id]) { seen[v.id] = true; unique.push(v); }
        });
        callback(unique);
      }, function (err) {
        clearTimeout(timer);
        console.log("Firestore fallback:", err);
        var saved = localStorage.getItem('ccin-vagas');
        var localList = saved ? JSON.parse(saved) : [];
        callback(localList.concat(VAGAS_MOCK));
      });
    } catch (err) {
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
  var perfilLocal = saved ? JSON.parse(saved) : null;

  // Determinar o email do usuário: prioridade = login-email > perfil local > demo
  var loginEmail = localStorage.getItem('ccin-login-email');
  var emailParaBuscar = (loginEmail || (perfilLocal && perfilLocal.email) || DEMO_USER.email).toLowerCase().trim();

  // Se não existe perfil local, usar DEMO_USER como fallback imediato
  if (!perfilLocal) {
    perfilLocal = Object.assign({}, DEMO_USER);
    if (loginEmail && loginEmail !== DEMO_USER.email) {
      perfilLocal.email = loginEmail;
      perfilLocal.nome = 'Aluno Inspirar';
      perfilLocal.fotoUrl = '';
      perfilLocal.curriculoUrl = '';
      perfilLocal.curriculoNome = '';
    }
    delete perfilLocal.updatedAt; // Garante que qualquer dado da nuvem substitua esse fallback
  }

  // Renderiza imediatamente com os dados locais para resposta rápida
  callback(perfilLocal);

  // Busca assíncrona na nuvem Firestore para dados mais recentes
  if (typeof db !== 'undefined' && emailParaBuscar) {
    console.log('[Perfil] Buscando perfil na nuvem Firestore para:', emailParaBuscar);
    db.collection('perfis').doc(emailParaBuscar).get().then(function(doc) {
      if (doc.exists) {
        var cloudData = doc.data();
        console.log('[Perfil] ✅ Dados encontrados na nuvem:', cloudData.nome, '| foto:', !!cloudData.fotoUrl, '| currículo:', cloudData.curriculoNome);

        // A nuvem tem prioridade sobre dados vazios ou de sessão anônima
        var deveAtualizar = false;
        if (!saved) {
          deveAtualizar = true; // Guia anônima / primeira vez no navegador
        } else if (!perfilLocal.updatedAt) {
          deveAtualizar = true;
        } else if (cloudData.updatedAt && cloudData.updatedAt >= (perfilLocal.updatedAt || 0)) {
          deveAtualizar = true;
        } else if (cloudData.fotoUrl && !perfilLocal.fotoUrl) {
          deveAtualizar = true;
        } else if (cloudData.curriculoNome && !perfilLocal.curriculoNome) {
          deveAtualizar = true;
        } else if (!cloudData.updatedAt) {
          deveAtualizar = true; // Documento da nuvem sem timestamp prévio
        }

        if (deveAtualizar) {
          var merged = Object.assign({}, perfilLocal, cloudData);
          localStorage.setItem('ccin-perfil', JSON.stringify(merged));
          callback(merged);
        }
      } else {
        console.log('[Perfil] Nenhum perfil na nuvem para:', emailParaBuscar);
      }
    }).catch(function(e) {
      console.warn('[Perfil] ⚠️ Erro ao consultar nuvem:', e.message || e);
    });
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
      canal: canal,
      status: 'Em andamento',
      data: hoje
    });
    localStorage.setItem('ccin-candidaturas', JSON.stringify(candidaturas));
  }
}

/* ─── VAGA CARD HTML ─────────────────────────────────────── */
function vagaCardHTML(vaga) {
  var initial = (vaga.empresa || 'E').charAt(0).toUpperCase();
  var isAberta = (vaga.status || 'aberta') === 'aberta';
  var statusBadge = isAberta
    ? '<span class="tag tag--aberta">Vaga Aberta</span>'
    : '<span class="tag tag--fechada">Encerrada</span>';

  var badgeNivel = vaga.nivel === 'Graduando'
    ? '<span class="tag tag--estudante">🎓 Aluno(a) em Curso</span>'
    : (vaga.nivel === 'Pos-Graduado' ? '<span class="tag tag--formado">🏆 Pós-Graduado</span>' : '<span class="tag tag--formado">🎓 Graduado</span>');

  var whatsMsg = encodeURIComponent('Olá! Sou aluno(a)/formado(a) da Faculdade Inspirar e tenho interesse na vaga de ' + vaga.especialidade + ' na ' + vaga.empresa + ' que vi no Conexão Inspirar.');

  var botoesContatoHTML = '';
  if (isAberta) {
    var tipoC = vaga.tipoContato || 'ambos';
    if (tipoC === 'whatsapp' && vaga.whatsapp) {
      var num = vaga.whatsapp.replace(/\D/g, '');
      botoesContatoHTML = '<a href="https://wa.me/55' + num + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + vaga.especialidade + '\', \'' + vaga.empresa + '\', \'WhatsApp\')">Candidatar via WhatsApp →</a>';
    } else if (tipoC === 'email' && vaga.contato) {
      botoesContatoHTML = '<a href="mailto:' + vaga.contato + '?subject=' + encodeURIComponent('Candidatura Conexão Inspirar — ' + vaga.especialidade) + '" class="btn-primary btn-sm" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + vaga.especialidade + '\', \'' + vaga.empresa + '\', \'E-mail\')">Candidatar via E-mail →</a>';
    } else {
      if (vaga.whatsapp) {
        var num2 = vaga.whatsapp.replace(/\D/g, '');
        botoesContatoHTML += '<a href="https://wa.me/55' + num2 + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" style="margin-right:6px" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + vaga.especialidade + '\', \'' + vaga.empresa + '\', \'WhatsApp\')">WhatsApp →</a>';
      }
      if (vaga.contato) {
        botoesContatoHTML += '<a href="mailto:' + vaga.contato + '?subject=' + encodeURIComponent('Candidatura Conexão Inspirar — ' + vaga.especialidade) + '" class="btn-outline btn-sm" onclick="registrarCandidatura(\'' + vaga.id + '\', \'' + vaga.especialidade + '\', \'' + vaga.empresa + '\', \'E-mail\')">E-mail</a>';
      }
    }
  } else {
    botoesContatoHTML = '<span style="font-size:12px;color:var(--text-dim);font-weight:500">Seleção Finalizada</span>';
  }

  return '<div class="vaga-card" data-reveal>' +
    '<div class="vaga-card__header">' +
      '<div class="vaga-card__company">' +
        '<div class="vaga-card__avatar">' + initial + '</div>' +
        '<div>' +
          '<div class="vaga-card__name">' + vaga.empresa + '</div>' +
          '<div class="vaga-card__location">' +
            '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            vaga.cidade + ' · ' + vaga.estado +
          '</div>' +
        '</div>' +
      '</div>' +
      statusBadge +
    '</div>' +
    '<h3 class="vaga-card__title">' + vaga.especialidade + '</h3>' +
    '<div class="vaga-card__tags">' +
      badgeNivel +
      '<span class="tag tag--destaque">' + vaga.area + '</span>' +
      '<span class="tag">' + vaga.tipo + '</span>' +
      '<span class="tag">' + vaga.modalidade + '</span>' +
    '</div>' +
    '<p class="vaga-card__desc">' + vaga.descricao + '</p>' +
    '<div class="vaga-card__footer">' +
      '<span class="vaga-card__date">' + formatDate(vaga.data) + '</span>' +
      '<div style="display:flex;align-items:center">' + botoesContatoHTML + '</div>' +
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

    if (isDemo || identifier.length > 3) {
      var btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Entrando...';
      btn.disabled = true;
      btn.style.opacity = '0.75';

      // Salvar o email do login para identificar o usuário em qualquer contexto
      var loginEmail = identifier.indexOf('@') > -1 ? identifier : DEMO_USER.email;
      localStorage.setItem('ccin-logado', '1');
      localStorage.setItem('ccin-login-email', loginEmail);

      // Tentar buscar perfil do Firestore ANTES de redirecionar
      var redirectTimeout = setTimeout(function() {
        // Fallback: se Firestore não responder em 3s, redireciona com dados locais/demo
        if (!localStorage.getItem('ccin-perfil')) {
          if (isDemo) {
            localStorage.setItem('ccin-perfil', JSON.stringify(DEMO_USER));
          } else {
            var novoPerfil = Object.assign({}, DEMO_USER, { email: loginEmail, nome: 'Aluno Inspirar', fotoUrl: '', curriculoUrl: '', curriculoNome: '', updatedAt: 0 });
            localStorage.setItem('ccin-perfil', JSON.stringify(novoPerfil));
          }
        }
        window.location.href = 'painel.html';
      }, 3000);

      if (typeof db !== 'undefined') {
        console.log('[Login] Buscando perfil no Firestore para:', loginEmail);
        db.collection('perfis').doc(loginEmail).get().then(function(doc) {
          clearTimeout(redirectTimeout);
          if (doc.exists) {
            var cloudPerfil = doc.data();
            console.log('[Login] ✅ Perfil encontrado na nuvem:', cloudPerfil.nome, '— foto:', !!cloudPerfil.fotoUrl);
            localStorage.setItem('ccin-perfil', JSON.stringify(cloudPerfil));
          } else {
            console.log('[Login] Perfil não encontrado na nuvem. Usando dados locais/demo.');
            if (!localStorage.getItem('ccin-perfil')) {
              if (isDemo) {
                localStorage.setItem('ccin-perfil', JSON.stringify(DEMO_USER));
              } else {
                var novoPerfil = Object.assign({}, DEMO_USER, { email: loginEmail, nome: 'Aluno Inspirar', fotoUrl: '', curriculoUrl: '', curriculoNome: '', updatedAt: 0 });
                localStorage.setItem('ccin-perfil', JSON.stringify(novoPerfil));
              }
            }
          }
          window.location.href = 'painel.html';
        }).catch(function(err) {
          clearTimeout(redirectTimeout);
          console.log('[Login] Firestore indisponível, usando fallback:', err.message || err);
          if (!localStorage.getItem('ccin-perfil')) {
            localStorage.setItem('ccin-perfil', JSON.stringify(DEMO_USER));
          }
          window.location.href = 'painel.html';
        });
      } else {
        // Sem Firestore, redireciona direto
        clearTimeout(redirectTimeout);
        if (!localStorage.getItem('ccin-perfil')) {
          localStorage.setItem('ccin-perfil', JSON.stringify(DEMO_USER));
        }
        window.location.href = 'painel.html';
      }
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

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    function getVal(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    var hoje = new Date().toISOString().split('T')[0];
    var novaVaga = {
      empresa: getVal('vagaEmpresa'),
      cidade: getVal('vagaCidade'),
      estado: getVal('vagaEstado'),
      nivel: getVal('vagaNivel'),
      area: getVal('vagaArea'),
      especialidade: getVal('vagaEsp'),
      tipo: getVal('vagaTipo'),
      modalidade: getVal('vagaModalidade'),
      status: 'aberta',
      descricao: getVal('vagaDesc'),
      tipoContato: getVal('vagaTipoContato') || 'ambos',
      contato: getVal('vagaContato'),
      whatsapp: getVal('vagaWhatsapp'),
      data: hoje,
      createdAt: Date.now()
    };

    var btn = form.querySelector('button[type="submit"]');
    var origText = btn.textContent;
    btn.textContent = 'Publicando...';
    btn.disabled = true;

    function completeSubmit(error) {
      btn.textContent = origText;
      btn.disabled = false;
      var saved = localStorage.getItem('ccin-vagas');
      var list = saved ? JSON.parse(saved) : [];
      novaVaga.id = 'local-' + Date.now();
      list.unshift(novaVaga);
      localStorage.setItem('ccin-vagas', JSON.stringify(list));

      var successMsg = document.getElementById('vagaSuccess');
      if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(function () { successMsg.style.display = 'none'; }, 5000);
      }
      form.reset();
      if (nivelSelect && areaSelect) populateAreaSelect(nivelSelect.value, areaSelect, '', false);
      renderVagasEmpresa();
      renderVitrineTalentos();
    }

    var timer = setTimeout(function () { completeSubmit("Timeout"); }, 3000);

    if (typeof db !== 'undefined') {
      try {
        db.collection('vagas').add(novaVaga).then(function () {
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
      email: 'demo@inspirar.com',
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
    
    if (perfilLogado) {
      formadosLocais = formadosLocais.filter(function(f) { return f.email !== perfilLogado.email; });
      formadosLocais.unshift(perfilLogado);
    }

    var demoFiltrada = DEMO_TALENTOS.filter(function(t) {
      if (perfilLogado && (t.email === perfilLogado.email || t.nome.toLowerCase() === perfilLogado.nome.toLowerCase())) {
        return false;
      }
      return true;
    });

    var lista = formadosLocais.concat(demoFiltrada);

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
      
      var safeEmail = encodeURIComponent(t.email || '');
      var safeNomeCurriculo = encodeURIComponent(t.curriculoNome || ('Curriculo_' + (t.nome || 'Talento').replace(/\s+/g, '_') + '.pdf'));
      var safeUrl = encodeURIComponent(t.curriculoUrl || '');

      var curriculoBtn = (t.curriculoUrl || t.curriculoNome || t.email)
        ? '<button type="button" class="btn-outline btn-sm btn-abrir-pdf-talento" data-email="' + safeEmail + '" data-nome="' + safeNomeCurriculo + '" data-url="' + safeUrl + '" style="font-size:11px;padding:6px 11px;cursor:pointer">📄 Currículo PDF</button>'
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

  // Sincronização em tempo real com perfis salvos no Firestore (de qualquer computador!)
  if (typeof db !== 'undefined') {
    db.collection('perfis').onSnapshot(function(snapshot) {
      var cloudPerfis = [];
      snapshot.forEach(function(doc) {
        var d = doc.data();
        if (d && d.nome && d.email) {
          cloudPerfis.push(d);
        }
      });
      if (cloudPerfis.length > 0) {
        var locais = JSON.parse(localStorage.getItem('ccin-admin-formados') || '[]');
        cloudPerfis.forEach(function(cp) {
          var idx = locais.findIndex(function(l) { return l.email === cp.email; });
          if (idx === -1) {
            locais.push(cp);
          } else {
            if (cp.updatedAt && (!locais[idx].updatedAt || cp.updatedAt > locais[idx].updatedAt)) {
              locais[idx] = cp;
            }
          }
        });
        localStorage.setItem('ccin-admin-formados', JSON.stringify(locais));
        applyVitrineFilter();
      }
    }, function(err) {
      console.log("Firestore vitrine fallback:", err);
    });
  }

  grid.onclick = function(e) {
    var btn = e.target.closest('.btn-abrir-pdf-talento');
    if (btn) {
      e.preventDefault();
      var email = decodeURIComponent(btn.getAttribute('data-email') || '');
      var nome = decodeURIComponent(btn.getAttribute('data-nome') || '');
      var url = decodeURIComponent(btn.getAttribute('data-url') || '');
      window.abrirCurriculoTalento(email, nome, url);
    }
  };

  if (filterArea) filterArea.addEventListener('change', applyVitrineFilter);
  if (filterEst) filterEst.addEventListener('change', applyVitrineFilter);

  applyVitrineFilter();
}

function renderVagasEmpresa() {
  var container = document.getElementById('empresaVagasGrid');
  if (!container) return;

  listenVagas(function (vagas) {
    if (!vagas.length) {
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
    // Auto-login para compatibilidade (acesso direto sem passar por login.html)
    localStorage.setItem('ccin-logado', '1');
    console.log('[Painel] Auto-login ativado (acesso direto)');
  }

  var navItems = document.querySelectorAll('.painel__nav-item');
  var sections = document.querySelectorAll('.painel__section');
  var activePerfil = null;

  function showSection(id) {
    sections.forEach(function (s) {
      s.classList.toggle('active', s.id === id);
    });
    navItems.forEach(function (n) {
      n.classList.toggle('active', n.dataset.section === id);
    });

    if (activePerfil && id === 'sec-minhas-vagas') renderMinhasVagas(activePerfil);
    if (id === 'sec-todas-vagas') renderTodasVagas();
    if (id === 'sec-candidaturas') renderMinhasCandidaturas();
    if (id === 'sec-vitrine-talentos') renderPainelVitrine();
  }

  // 1. Vinculação única de eventos de navegação
  navItems.forEach(function (item) {
    item.addEventListener('click', function () {
      var section = item.dataset.section;
      if (section === 'logout') {
        localStorage.removeItem('ccin-logado');
        localStorage.removeItem('ccin-login-email');
        window.location.href = 'index.html';
        return;
      }
      showSection(section);
      var sidebar = document.getElementById('painelSidebar');
      if (sidebar) sidebar.classList.remove('sidebar-open');
    });
  });

  var sidebarUser = document.getElementById('sidebarUserCard');
  if (sidebarUser) {
    sidebarUser.addEventListener('click', function() {
      showSection('sec-perfil');
    });
  }

  var initialSection = 'sec-minhas-vagas';
  if (window.location.hash && document.getElementById(window.location.hash.substring(1))) {
    initialSection = window.location.hash.substring(1);
  }
  showSection(initialSection);

  // 2. Atualização reativa de dados do usuário (na carga inicial e quando vier da nuvem)
  function atualizarInfoUsuarioPainel(perfil) {
    activePerfil = perfil;
    document.querySelectorAll('.painel__user-name').forEach(function (el) {
      el.textContent = perfil.nome || 'Aluno Inspirar';
    });
    var espEl = document.querySelector('.painel__user-esp');
    if (espEl) {
      var prefix = (perfil.statusAcademico === 'Graduando') ? '🎓 Graduando(a) em ' : (perfil.statusAcademico === 'Pos-Graduado' ? '🏆 Especialista em ' : '🎓 Graduado(a) em ');
      espEl.textContent = prefix + (perfil.especialidade || perfil.area || 'Formação');
    }
    var cidEl = document.querySelector('.painel__user-cidade');
    if (cidEl) cidEl.textContent = (perfil.cidade || 'Curitiba') + ' · ' + (perfil.estado || 'PR');
    var avatarEl = document.querySelector('.painel__user-avatar');
    if (avatarEl) {
      if (perfil.fotoUrl) {
        avatarEl.innerHTML = '<img src="' + perfil.fotoUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
      } else {
        avatarEl.textContent = (perfil.nome || 'A').charAt(0).toUpperCase();
      }
    }
    renderMinhasVagas(perfil);
  }

  getPerfilLocalOrFirestore(function(perfil) {
    console.log('[Painel] Perfil carregado na UI:', perfil.nome, '| email:', perfil.email, '| foto:', !!perfil.fotoUrl);
    atualizarInfoUsuarioPainel(perfil);
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
  var container = document.getElementById('minhasVagasGrid');
  if (!container) return;

  listenVagas(function (all) {
    var filtered = all.filter(function (v) {
      var matchNivel = !v.nivel || v.nivel === perfil.statusAcademico || (perfil.statusAcademico === 'Graduado' && v.nivel === 'Graduando');
      var matchArea = !v.area || (perfil.area && v.area.toLowerCase().includes(perfil.area.toLowerCase())) || (v.area && perfil.area && perfil.area.toLowerCase().includes(v.area.toLowerCase()));
      var matchEstado = !v.estado || v.estado === perfil.estado || (v.modalidade && v.modalidade.includes('Online')) || perfil.estado === 'Luanda (Angola)';
      return matchNivel || matchArea || matchEstado;
    });

    filtered.sort(function (a, b) {
      var scoreA = (a.area === perfil.area ? 2 : 0) + (a.estado === perfil.estado ? 1 : 0);
      var scoreB = (b.area === perfil.area ? 2 : 0) + (b.estado === perfil.estado ? 1 : 0);
      return scoreB - scoreA;
    });

    if (!filtered.length) {
      container.innerHTML = '<div class="empty-state"><div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg></div><div class="empty-state__title">Nenhuma vaga recomendada no momento</div><p>Atualize sua área de especialidade em "Meu Perfil" ou confira a aba "Todas as Vagas".</p></div>';
      return;
    }

    container.innerHTML = filtered.map(vagaCardHTML).join('');
    revealCards(container);
  });
}

function renderTodasVagas() {
  var container = document.getElementById('todasVagasGrid');
  var filterArea = document.getElementById('filtroArea');
  var filterEst = document.getElementById('filtroEst');
  var filterNivel = document.getElementById('filtroNivel');
  var searchInput = document.getElementById('buscaVagas');
  if (!container) return;

  if (filterNivel && filterArea) {
    populateAreaSelect(filterNivel.value, filterArea, '', true);
    filterNivel.addEventListener('change', function() {
      populateAreaSelect(filterNivel.value, filterArea, '', true);
      applyFilter();
    });
  }

  function applyFilter() {
    listenVagas(function (all) {
      var area = filterArea ? filterArea.value : '';
      var est = filterEst ? filterEst.value : '';
      var nivel = filterNivel ? filterNivel.value : '';
      var q = searchInput ? searchInput.value.toLowerCase().trim() : '';

      var vagas = all;
      if (nivel) vagas = vagas.filter(function (v) { return v.nivel === nivel; });
      if (area) vagas = vagas.filter(function (v) { return (v.area || '').includes(area) || (v.especialidade || '').includes(area); });
      if (est) vagas = vagas.filter(function (v) { return v.estado === est || (v.modalidade || '').includes(est); });
      if (q) {
        vagas = vagas.filter(function (v) {
          return (v.empresa && v.empresa.toLowerCase().includes(q)) ||
                 (v.especialidade && v.especialidade.toLowerCase().includes(q)) ||
                 (v.cidade && v.cidade.toLowerCase().includes(q)) ||
                 (v.area && v.area.toLowerCase().includes(q));
        });
      }

      if (!vagas.length) {
        container.innerHTML = '<div class="empty-state"><div class="empty-state__icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div><div class="empty-state__title">Nenhuma vaga encontrada</div><p>Tente ajustar os filtros ou os termos de busca.</p></div>';
        return;
      }

      container.innerHTML = vagas.map(vagaCardHTML).join('');
      revealCards(container);
    });
  }

  if (filterArea) filterArea.addEventListener('change', applyFilter);
  if (filterEst) filterEst.addEventListener('change', applyFilter);
  if (searchInput) searchInput.addEventListener('input', applyFilter);

  applyFilter();
}

/* ─── RENDER: MINHAS CANDIDATURAS ───────────────────────── */
function renderMinhasCandidaturas() {
  var container = document.getElementById('minhasCandidaturasGrid');
  if (!container) return;

  var candidaturas = JSON.parse(localStorage.getItem('ccin-candidaturas') || '[]');

  if (!candidaturas.length) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1">' +
      '<div class="empty-state__icon">' +
        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>' +
      '</div>' +
      '<div class="empty-state__title">Você ainda não se candidatou a nenhuma vaga</div>' +
      '<p>Ao clicar para entrar em contato com uma empresa parceira via WhatsApp ou E-mail, a vaga será acompanhada aqui em tempo real!</p>' +
    '</div>';
    return;
  }

  listenVagas(function(vagas) {
    container.innerHTML = candidaturas.map(function(c) {
      var vagaRef = vagas.find(function(v) { return v.id === c.vagaId; });
      var statusVaga = vagaRef ? vagaRef.status : 'aberta';
      var isFechada = statusVaga === 'fechada' || statusVaga === 'encerrada';

      var badgeHTML = isFechada
        ? '<span class="tag tag--fechada">🔒 Processo Concluído pela Empresa</span>'
        : '<span class="tag tag--aberta">🟢 Processo em Andamento</span>';

      return '<div class="candidatura-card" data-reveal>' +
        '<div class="candidatura-card__header">' +
          '<div>' +
            '<div class="candidatura-card__title">' + c.titulo + '</div>' +
            '<div class="candidatura-card__empresa">🏢 ' + c.empresa + '</div>' +
          '</div>' +
          badgeHTML +
        '</div>' +
        '<div class="candidatura-card__meta">' +
          '<span>Canal: <strong>' + c.canal + '</strong></span>' +
          '<span>Data: <strong>' + formatDate(c.data) + '</strong></span>' +
        '</div>' +
      '</div>';
    }).join('');

    revealCards(container);
  });
}

/* ─── RENDER: VITRINE DE COLEGAS NO PAINEL ──────────────── */
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
      fotoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Juliana_Medeiros.pdf',
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
      fotoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Lucas_Gabriel.pdf',
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
      fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Camila_Ribeiro.pdf',
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
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Carlos_Eduardo.pdf',
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
      fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      curriculoUrl: 'demo',
      curriculoNome: 'Curriculo_Mateus_Kuanza.pdf',
      contratadoPelaPlataforma: false
    }
  ];

  function applyFilter() {
    var nivel = filterNivel ? filterNivel.value : '';
    var area = filterArea ? filterArea.value : '';
    var est = filterEst ? filterEst.value : '';

    var formadosLocais = JSON.parse(localStorage.getItem('ccin-admin-formados') || '[]');
    var perfilLogado = JSON.parse(localStorage.getItem('ccin-perfil') || 'null');
    
    if (perfilLogado) {
      formadosLocais = formadosLocais.filter(function(f) { return f.email !== perfilLogado.email; });
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

      var safeEmail = encodeURIComponent(t.email || '');
      var safeNomeCurriculo = encodeURIComponent(t.curriculoNome || ('Curriculo_' + (t.nome || 'Talento').replace(/\s+/g, '_') + '.pdf'));
      var safeUrl = encodeURIComponent(t.curriculoUrl || '');

      var curriculoBtn = (t.curriculoUrl || t.curriculoNome || t.email)
        ? '<button type="button" class="btn-outline btn-sm btn-abrir-pdf-talento" data-email="' + safeEmail + '" data-nome="' + safeNomeCurriculo + '" data-url="' + safeUrl + '" style="font-size:11px;padding:6px 11px;cursor:pointer">📄 Currículo PDF</button>'
        : '';

      var whatsMsg = encodeURIComponent('Olá ' + t.nome + ', sou colega na Inspirar e vi seu perfil no Conexão Inspirar!');

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
        (t.bio ? '<p class="talent-bio">"' + t.bio + '"</p>' : '') +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:12px;border-top:1px solid var(--border-subtle);flex-wrap:gap:8px">' +
          '<span style="font-size:12px;color:var(--text-dim)">Polo ' + t.cidade + '</span>' +
          '<div style="display:flex;gap:6px;align-items:center;margin-left:auto">' +
            curriculoBtn +
            '<a href="https://wa.me/55' + (t.whatsapp || '').replace(/\D/g, '') + '?text=' + whatsMsg + '" target="_blank" rel="noopener" class="btn-primary btn-sm" style="font-size:12px;padding:7px 14px">Conectar →</a>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');

    revealCards(grid);
  }

  grid.onclick = function(e) {
    var btn = e.target.closest('.btn-abrir-pdf-talento');
    if (btn) {
      e.preventDefault();
      var email = decodeURIComponent(btn.getAttribute('data-email') || '');
      var nome = decodeURIComponent(btn.getAttribute('data-nome') || '');
      var url = decodeURIComponent(btn.getAttribute('data-url') || '');
      window.abrirCurriculoTalento(email, nome, url);
    }
  };

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
  var avatarWrap = document.getElementById('avatarPreviewWrap');
  var avatarImg = document.getElementById('avatarPreviewImg');
  var avatarFallback = document.getElementById('avatarPreviewFallback');
  var btnSelecionarFoto = document.getElementById('btnSelecionarFoto');
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
  var btnSubstituirPDF = document.getElementById('btnSubstituirPDF');
  var btnRemoverPDF = document.getElementById('btnRemoverPDF');

  var celebrationBanner = document.getElementById('celebrationBanner');
  var feedbackEl = document.getElementById('perfilFeedback');

  // Estado interno em memória
  var currentFotoUrl = '';
  var currentCurriculo = {
    file: null,
    url: '',
    nome: '',
    tamanho: '',
    removed: false
  };

  function renderFotoPreview(url) {
    if (url) {
      if (avatarImg) {
        avatarImg.src = url;
        avatarImg.style.display = 'block';
      }
      if (avatarFallback) avatarFallback.style.display = 'none';
      if (btnRemoverFoto) btnRemoverFoto.style.display = 'inline-flex';
    } else {
      if (avatarImg) {
        avatarImg.src = '';
        avatarImg.style.display = 'none';
      }
      if (avatarFallback) {
        avatarFallback.style.display = 'flex';
        var nomeVal = form.querySelector('[name="nome"]');
        avatarFallback.textContent = (nomeVal && nomeVal.value ? nomeVal.value : 'A').charAt(0).toUpperCase();
      }
      if (btnRemoverFoto) btnRemoverFoto.style.display = 'none';
    }
  }

  function renderCurriculoUI() {
    if (currentCurriculo.nome && !currentCurriculo.removed) {
      if (curriculoCard) curriculoCard.style.display = 'flex';
      if (curriculoDropzone) curriculoDropzone.style.display = 'none';
      if (curriculoCardName) curriculoCardName.textContent = currentCurriculo.nome;
      if (curriculoCardSize) curriculoCardSize.textContent = currentCurriculo.tamanho || 'PDF Anexado';
    } else {
      if (curriculoCard) curriculoCard.style.display = 'none';
      if (curriculoDropzone) curriculoDropzone.style.display = 'block';
    }
  }

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

  // ─── LIGAÇÃO DE EVENTOS DE UPLOAD ─────────────────────────

  function dispararEscolhaFoto(e) {
    if (e) e.preventDefault();
    if (fotoInput) {
      fotoInput.value = '';
      fotoInput.click();
    }
  }

  if (btnSelecionarFoto) {
    btnSelecionarFoto.addEventListener('click', dispararEscolhaFoto);
  }

  if (avatarWrap) {
    avatarWrap.addEventListener('click', dispararEscolhaFoto);
    avatarWrap.addEventListener('dragover', function(e) {
      e.preventDefault();
      avatarWrap.style.transform = 'scale(1.08)';
      avatarWrap.style.borderColor = 'var(--green)';
    });
    avatarWrap.addEventListener('dragleave', function(e) {
      e.preventDefault();
      avatarWrap.style.transform = '';
      avatarWrap.style.borderColor = '';
    });
    avatarWrap.addEventListener('drop', function(e) {
      e.preventDefault();
      avatarWrap.style.transform = '';
      avatarWrap.style.borderColor = '';
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        var f = e.dataTransfer.files[0];
        if (f.type.startsWith('image/')) {
          comprimirFoto(f, function(compressedUrl) {
            currentFotoUrl = compressedUrl;
            renderFotoPreview(currentFotoUrl);
            var sbAvatar = document.querySelector('.painel__user-avatar');
            if (sbAvatar) sbAvatar.innerHTML = '<img src="' + compressedUrl + '" style="width:100%;height:100%;object-fit:cover;border-radius:50%">';
          });
        }
      }
    });
  }

  if (fotoInput) {
    fotoInput.addEventListener('change', function() {
      if (fotoInput.files && fotoInput.files.length > 0) {
        var f = fotoInput.files[0];
        comprimirFoto(f, function(compressedUrl) {
          currentFotoUrl = compressedUrl;
          renderFotoPreview(currentFotoUrl);
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
      if (sbAvatar) {
        var nomeVal = form.querySelector('[name="nome"]');
        sbAvatar.textContent = (nomeVal && nomeVal.value ? nomeVal.value : 'A').charAt(0).toUpperCase();
      }
    });
  }

  // 2. Dropzone e Input de Currículo
  function dispararEscolhaPDF(e) {
    if (e) e.preventDefault();
    if (curriculoInput) {
      curriculoInput.value = '';
      curriculoInput.click();
    }
  }

  if (curriculoDropzone) {
    curriculoDropzone.addEventListener('click', dispararEscolhaPDF);
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
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processarPDFSelecionado(e.dataTransfer.files[0]);
      }
    });
  }

  if (curriculoInput) {
    curriculoInput.addEventListener('change', function() {
      if (curriculoInput.files && curriculoInput.files.length > 0) {
        processarPDFSelecionado(curriculoInput.files[0]);
      }
    });
  }

  if (btnSubstituirPDF) {
    btnSubstituirPDF.addEventListener('click', dispararEscolhaPDF);
  }

  if (btnRemoverPDF) {
    btnRemoverPDF.addEventListener('click', function() {
      if (confirm('Deseja realmente remover o currículo em PDF do seu perfil?')) {
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

  // Prevenção de arraste acidental para fora que navegava a página
  window.addEventListener('dragover', function(e) { e.preventDefault(); }, false);
  window.addEventListener('drop', function(e) {
    if (!e.target.closest('#curriculoDropzone') && !e.target.closest('#avatarPreviewWrap')) {
      e.preventDefault();
    }
  }, false);

  // 3. Visualizar e Baixar PDF
  if (btnVisualizarPDF) {
    btnVisualizarPDF.addEventListener('click', function() {
      var perfilLocal = JSON.parse(localStorage.getItem('ccin-perfil') || '{}');
      if (currentCurriculo.file) {
        window.abrirModalPDF(currentCurriculo.file, currentCurriculo.nome);
      } else {
        window.abrirCurriculoTalento(perfilLocal.email, currentCurriculo.nome, currentCurriculo.url);
      }
    });
  }

  if (btnBaixarPDF) {
    btnBaixarPDF.addEventListener('click', function() {
      var perfilLocal = JSON.parse(localStorage.getItem('ccin-perfil') || '{}');
      if (currentCurriculo.file) {
        var a = document.createElement('a');
        var blobUrl = URL.createObjectURL(currentCurriculo.file);
        a.href = blobUrl;
        a.download = currentCurriculo.nome || 'Curriculo.pdf';
        document.body.appendChild(a);
        a.click();
        setTimeout(function() { document.body.removeChild(a); }, 400);
      } else {
        window.baixarCurriculoTalento(perfilLocal.email, currentCurriculo.nome, currentCurriculo.url);
      }
    });
  }

  // ─── CARREGAMENTO DOS DADOS DO PERFIL ─────────────────────
  function carregarPerfilNoFormulario(perfil) {
    if (nivelSelect && areaSelect) {
      populateAreaSelect(perfil.statusAcademico || 'Pos-Graduado', areaSelect, perfil.area || '', false);
    }

    var fields = ['nome', 'email', 'statusAcademico', 'area', 'especialidade', 'modalidade', 'cidade', 'estado', 'whatsapp', 'bio', 'linkedin', 'instagram', 'site'];
    fields.forEach(function (f) {
      var el = form.querySelector('[name="' + f + '"]');
      if (el && perfil[f] !== undefined) el.value = perfil[f];
    });

    var emailInput = form.querySelector('[name="email"]');
    if (emailInput && !emailInput.value) {
      emailInput.value = perfil.email || 'demo@inspirar.com';
    }

    var contratadoCheck = form.querySelector('[name="contratadoPelaPlataforma"]');
    if (contratadoCheck) {
      contratadoCheck.checked = !!perfil.contratadoPelaPlataforma;
      if (celebrationBanner) celebrationBanner.style.display = perfil.contratadoPelaPlataforma ? 'flex' : 'none';
    }

    currentFotoUrl = perfil.fotoUrl || '';
    renderFotoPreview(currentFotoUrl);

    // Se o perfil já possui currículo registrado, prepara a UI imediatamente
    if (perfil.curriculoNome) {
      currentCurriculo.nome = perfil.curriculoNome;
      currentCurriculo.tamanho = perfil.curriculoTamanho || 'PDF Anexado';
      currentCurriculo.url = perfil.curriculoUrl || ('cloud:' + perfil.email);
      currentCurriculo.removed = false;
      renderCurriculoUI();
    }

    // 1. Tenta obter o PDF do IndexedDB local
    PDFStorage.obterPDF(perfil.email, function(err, item) {
      if (!err && item && item.blob) {
        currentCurriculo.nome = item.nome || currentCurriculo.nome || 'Curriculo_Profissional.pdf';
        currentCurriculo.tamanho = item.tamanho || currentCurriculo.tamanho || 'PDF Anexado';
        currentCurriculo.url = 'indexeddb:' + perfil.email;
        currentCurriculo.removed = false;
        renderCurriculoUI();

        // BACKUP PROATIVO: Se o PDF está apenas no IndexedDB, faz upload silencioso para a nuvem Firestore
        CloudPDFStorage.salvar(perfil.email, item.blob, item.nome, function(cloudErr) {
          if (!cloudErr) console.log('[Auto-Sync] PDF local sincronizado com a nuvem Firestore com sucesso!');
        });
      } else {
        // 2. Se não estiver no IndexedDB local (ex: Guia Anônima / outro PC), busca na Nuvem Firestore
        CloudPDFStorage.obter(perfil.email, function(cloudErr, cloudItem) {
          if (!cloudErr && cloudItem && cloudItem.blob) {
            currentCurriculo.nome = cloudItem.nome || currentCurriculo.nome || 'Curriculo_Profissional.pdf';
            currentCurriculo.tamanho = cloudItem.tamanho || currentCurriculo.tamanho || 'PDF Anexado';
            currentCurriculo.url = 'cloud:' + perfil.email;
            currentCurriculo.removed = false;
            // Salva no IndexedDB local desta sessão para abrir instantaneamente nas próximas vezes
            PDFStorage.salvarPDF(perfil.email, cloudItem.blob, currentCurriculo.nome, currentCurriculo.tamanho);
          }
          renderCurriculoUI();
        });
      }
    });
  }

  // Listener para mudança de nível acadêmico no formulário
  if (nivelSelect && areaSelect) {
    nivelSelect.addEventListener('change', function() {
      populateAreaSelect(nivelSelect.value, areaSelect, '', false);
    });
  }

  var contratadoCheckEl = form.querySelector('[name="contratadoPelaPlataforma"]');
  if (contratadoCheckEl && celebrationBanner) {
    contratadoCheckEl.addEventListener('change', function() {
      celebrationBanner.style.display = contratadoCheckEl.checked ? 'flex' : 'none';
    });
  }

  getPerfilLocalOrFirestore(function(perfil) {
    carregarPerfilNoFormulario(perfil);
  });

  // ─── SALVAMENTO RESILIENTE (Local-First + Cloud Firestore Gratuito) ───
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]');
    var origText = btn.textContent;
    btn.textContent = 'Gravando alterações...';
    btn.disabled = true;

    var perfilAtual = JSON.parse(localStorage.getItem('ccin-perfil') || '{}');
    var updated = Object.assign({}, perfilAtual);

    var fields = ['nome', 'email', 'statusAcademico', 'area', 'especialidade', 'modalidade', 'cidade', 'estado', 'whatsapp', 'bio', 'linkedin', 'instagram', 'site'];
    fields.forEach(function (f) {
      var el = form.querySelector('[name="' + f + '"]');
      if (el && el.value.trim()) updated[f] = el.value.trim();
    });

    var contratadoCheck = form.querySelector('[name="contratadoPelaPlataforma"]');
    if (contratadoCheck) {
      updated.contratadoPelaPlataforma = contratadoCheck.checked;
    }

    updated.nome = updated.nome || 'Aluno Inspirar';
    updated.email = (updated.email || perfilAtual.email || 'demo@inspirar.com').toLowerCase().trim();
    updated.cidade = updated.cidade || perfilAtual.cidade || 'Curitiba';
    updated.estado = updated.estado || perfilAtual.estado || 'PR';
    updated.updatedAt = Date.now();
    updated.fotoUrl = currentFotoUrl;

    if (currentCurriculo.removed) {
      updated.curriculoUrl = '';
      updated.curriculoNome = '';
      updated.curriculoTamanho = '';
      PDFStorage.removerPDF(updated.email);
      CloudPDFStorage.remover(updated.email);
    } else if (currentCurriculo.file) {
      updated.curriculoNome = currentCurriculo.nome;
      updated.curriculoTamanho = currentCurriculo.tamanho;
      updated.curriculoData = new Date().toISOString().split('T')[0];
      updated.curriculoUrl = 'cloud:' + updated.email;

      // 1. Grava no IndexedDB local para rapidez instantânea
      PDFStorage.salvarPDF(updated.email, currentCurriculo.file, currentCurriculo.nome, currentCurriculo.tamanho);
      
      // 2. Grava na Nuvem Firestore (100% GRATUITO — sem plano pago!)
      CloudPDFStorage.salvar(updated.email, currentCurriculo.file, function(err) {
        if (!err) {
          console.log("[Salvar] ✅ PDF sincronizado com a nuvem Firestore com sucesso!");
        } else {
          console.error("[Salvar] ❌ ERRO ao salvar PDF na nuvem:", err.message || err);
        }
      });
    } else if (currentCurriculo.url && currentCurriculo.nome) {
      updated.curriculoNome = currentCurriculo.nome;
      updated.curriculoTamanho = currentCurriculo.tamanho;
      updated.curriculoUrl = 'cloud:' + updated.email;

      // Se o blob já está no IndexedDB, assegura que esteja espelhado na nuvem Firestore
      PDFStorage.obterPDF(updated.email, function(err, item) {
        if (!err && item && item.blob) {
          CloudPDFStorage.salvar(updated.email, item.blob, item.nome, function(cloudErr) {
            if (!cloudErr) console.log('[Salvar] PDF do IndexedDB assegurado na nuvem Firestore!');
          });
        }
      });
    }

    // Gravação instantânea no LocalStorage
    localStorage.setItem('ccin-perfil', JSON.stringify(updated));

    // Sincroniza com lista de formados/alunos para a vitrine
    var formados = JSON.parse(localStorage.getItem('ccin-admin-formados') || '[]');
    formados = formados.filter(function(f) { return f.email !== updated.email; });
    formados.unshift(updated);
    localStorage.setItem('ccin-admin-formados', JSON.stringify(formados));

    try {
      window.dispatchEvent(new Event('storage'));
    } catch(e) {}

    // Atualização visual instantânea
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

    if (celebrationBanner) {
      celebrationBanner.style.display = updated.contratadoPelaPlataforma ? 'flex' : 'none';
    }

    if (feedbackEl) {
      feedbackEl.style.display = 'block';
      feedbackEl.style.background = 'rgba(155, 225, 93, 0.16)';
      feedbackEl.style.border = '1px solid rgba(155, 225, 93, 0.4)';
      feedbackEl.style.color = 'var(--green-text)';
      feedbackEl.innerHTML = '✨ <strong>Perfil atualizado com sucesso!</strong> Sua foto e currículo em PDF foram salvos e já estão disponíveis na vitrine.';
      try { feedbackEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch(e) {}
      setTimeout(function() { feedbackEl.style.display = 'none'; }, 7000);
    }

    btn.textContent = '✅ Perfil Salvo com Sucesso!';
    btn.style.background = 'var(--green)';
    btn.style.color = '#000';
    setTimeout(function () {
      btn.textContent = origText;
      btn.disabled = false;
      btn.style.background = '';
      btn.style.color = '';
    }, 1500);

    renderPainelVitrine();

    // Sincroniza dados do perfil no Firestore (Gratuito!)
    if (typeof db !== 'undefined' && updated.email) {
      console.log('[Salvar] Sincronizando perfil com Firestore para:', updated.email);
      console.log('[Salvar] Foto incluída:', !!updated.fotoUrl, '| Currículo:', !!updated.curriculoNome);
      try {
        db.collection('perfis').doc(updated.email).set(updated, { merge: true }).then(function() {
          console.log('[Salvar] ✅ Perfil sincronizado com sucesso na nuvem!');
          // Atualizar o login-email caso o usuário tenha alterado o email
          localStorage.setItem('ccin-login-email', updated.email);
          if (feedbackEl && feedbackEl.style.display !== 'none') {
            feedbackEl.innerHTML = '✅ <strong>Perfil salvo na nuvem!</strong> Seus dados, foto e currículo estão acessíveis de qualquer computador/navegador.';
          }
        }).catch(function(err) {
          console.error('[Salvar] ❌ ERRO ao sincronizar com Firestore:', err.code || '', err.message || err);
          if (feedbackEl) {
            feedbackEl.style.display = 'block';
            feedbackEl.style.background = 'rgba(255,180,60,0.16)';
            feedbackEl.style.border = '1px solid rgba(255,180,60,0.4)';
            feedbackEl.style.color = '#ffb43c';
            feedbackEl.innerHTML = '⚠️ <strong>Perfil salvo localmente.</strong> Não foi possível sincronizar com a nuvem: ' + (err.message || err) + '<br>Seus dados só estão neste navegador.';
          }
        });
      } catch(e) {
        console.error('[Salvar] Exceção Firestore:', e);
      }
    } else {
      console.log('[Salvar] Firestore indisponível. Perfil salvo apenas localmente.');
    }
  });
}

/* ─── HELPER: re-ativar reveal nos cards inseridos via JS ── */
function revealCards(container) {
  container.querySelectorAll('[data-reveal]').forEach(function (el, i) {
    setTimeout(function () { el.classList.add('revealed'); }, i * 50);
  });
}

/* ─── SINCRONIZAÇÃO ENTRE ABAS DO NAVEGADOR ───────────────── */
window.addEventListener('storage', function(e) {
  if (e.key === 'ccin-perfil' || e.key === 'ccin-admin-formados') {
    renderVitrineTalentos();
    renderPainelVitrine();
  }
});
