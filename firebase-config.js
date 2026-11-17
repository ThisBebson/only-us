
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-storage.js";
import { getMessaging, isSupported } from "https://www.gstatic.com/firebasejs/13.4.0/firebase-messaging.js";

// Konfiguracja projektu Only Us
export const firebaseConfig = {
  apiKey: "AIzaSyBNLymyggpl9NR2RIXw9uYjhe53byFbWJE",
  authDomain: "only-us-e3723.firebaseapp.com",
  projectId: "only-us-e3723",
  storageBucket: "only-us-e3723.firebasestorage.app",
  messagingSenderId: "703025429227",
  appId: "1:703025429227:web:43369a39f7f59795365cae",
  measurementId: "G-F5RLJXN92E"
};

// Inicjalizacja Firebase
export const app = initializeApp(firebaseConfig);

// Logowanie i rejestracja
export const auth = getAuth(app);

// Baza danych
export const db = getFirestore(app);

// Zdjęcia i załączniki
export const storage = getStorage(app);

// Powiadomienia push (jeśli przeglądarka je obsługuje)
export const messagingPromise = isSupported()
  .then(supported => supported ? getMessaging(app) : null)
  .catch(() => null);
