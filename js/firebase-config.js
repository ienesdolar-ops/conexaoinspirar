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

// Instâncias globais do Firestore e Storage
var db = firebase.firestore();
var storage = firebase.storage();
