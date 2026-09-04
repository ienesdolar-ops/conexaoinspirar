/* ============================================================
   FIREBASE CONFIG — Conexão Carreiras Inspirar
   SDK Compat v10 via CDN — sem npm, sem bundler
   ============================================================ */

firebase.initializeApp({
  apiKey:            "AIzaSyBvo3kJJO4xgZXBFsV7YAfZ2CS2bsjB7Iw",
  authDomain:        "conexao-carreiras-inspirar.firebaseapp.com",
  projectId:         "conexao-carreiras-inspirar",
  storageBucket:     "conexao-carreiras-inspirar.firebasestorage.app",
  messagingSenderId: "303962933237",
  appId:             "1:303962933237:web:935576e634aacb6065c2bc"
});

// Instância global do Firestore (100% Gratuito no Plano Spark)
var db = firebase.firestore();

// Storage opcional e seguro (não bloqueia o app se o plano Spark estiver ativo)
var storage = null;
try {
  if (typeof firebase.storage === 'function') {
    storage = firebase.storage();
  }
} catch (e) {
  console.info('[Firebase] Armazenamento de arquivos operando via Cloud Firestore 100% Gratuito.');
}
