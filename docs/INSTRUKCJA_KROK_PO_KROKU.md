# Only Us v3.0 — instrukcja GitHub Pages + Firebase

## Co otrzymujesz
Działający fundament: rejestracja i logowanie e-mail/hasło, prywatne parowanie jednorazowym kodem 10 znaków (24 godziny), czat i szybkie uczucia synchronizowane przez Firestore, lista wydarzeń oraz data początku związku w ustawieniach. To nie jest jeszcze kompletna wersja wszystkich 23 funkcji. **Push, zdjęcia, eksport, widżety i rozbudowane moduły są do wykonania w kolejnych etapach.**

## 1. Utwórz projekt Firebase
1. Otwórz https://console.firebase.google.com/ i wybierz **Add project / Dodaj projekt**.
2. Nazwij projekt np. `only-us-private` (identyfikator musi być unikalny). Analytics możesz wyłączyć.
3. Wejdź w **Build → Authentication → Get started → Sign-in method** i włącz **Email/Password**.
4. Wejdź w **Build → Firestore Database → Create database**. Wybierz region możliwie blisko Polski, np. europejski. Wybierz **production mode**, a następnie wdroż reguły z pliku `firestore.rules`.
5. W **Project settings → General → Your apps** dodaj aplikację **Web** (symbol `</>`). Skopiuj pola obiektu `firebaseConfig` do `firebase-config.js` w paczce. Nie kopiuj `serviceAccountKey.json` do GitHuba!
6. W **Authentication → Settings → Authorized domains** dodaj domenę `TWOJ_LOGIN.github.io` (bez `https://` i ścieżki repozytorium). Jeśli używasz własnej domeny, dodaj ją także.

## 2. Aktywuj Cloud Functions
1. Do bezpiecznego tworzenia i realizowania kodów zaproszeń potrzebne są Cloud Functions. Zwykle wymagają **planu Blaze z kontem rozliczeniowym**. Koszty zależą od użycia; alerty nie blokują automatycznie naliczania.
2. Zainstaluj Node.js 22 oraz Firebase CLI na komputerze: `npm install -g firebase-tools`.
3. W terminalu wejdź do rozpakowanego folderu projektu.
4. Wykonaj `firebase login` i `firebase use --add`, wybierając utworzony projekt. Alternatywnie skopiuj `.firebaserc.example` do `.firebaserc` i wpisz identyfikator projektu.
5. Uruchom `cd functions`, następnie `npm install`, a potem wróć `cd ..`.
6. Wykonaj `firebase deploy --only firestore:rules,functions`.
7. Sprawdź w konsoli Firebase, czy funkcje `createInvite` i `joinInvite` zostały wdrożone w regionie `europe-west1`.

**Uwaga bezpieczeństwa:** kod zaproszenia jest jednorazowy i wygasa po 24 godzinach, ale ta wersja demonstracyjna nie ma jeszcze pełnego limitowania prób i mechanizmów antyspamowych. Nie udostępniaj aplikacji publicznie na dużą skalę bez dodatkowych zabezpieczeń (App Check, limity, monitoring).

## 3. Opublikuj na GitHub Pages
1. Wejdź na https://github.com/ i zaloguj się.
2. Wybierz **New repository**, nazwij np. `only-us`, utwórz repozytorium **Public** (dla darmowego GitHub Pages na typowych kontach).
3. Wgraj pliki z paczki do katalogu głównego repozytorium: `index.html`, `style.css`, `app.js`, `firebase-config.js`, `manifest.webmanifest`, `icon.svg`.
4. Nie wgrywaj prywatnych kluczy, plików `.env`, ani plików konta serwisowego. Konfiguracja `firebase-config.js` jest publiczna i to normalne; bezpieczeństwo zapewniają Authentication, reguły Firestore i backend.
5. W repozytorium przejdź do **Settings → Pages → Build and deployment → Deploy from a branch**, wybierz `main` oraz `/ (root)`, zapisz.
6. Poczekaj na publikację i otwórz `https://TWOJ_LOGIN.github.io/only-us/`.

**Ważne:** GitHub Pages jest publicznie dostępny. Nie oznacza to, że prywatne dane są publiczne — dostęp do nich ograniczają reguły Firestore. Nie publikuj w repozytorium prywatnych zdjęć ani wiadomości.

## 4. Połącz dwa telefony
1. Na pierwszym telefonie otwórz stronę aplikacji i zarejestruj konto.
2. Na drugim telefonie zarejestruj inne konto.
3. Na pierwszym wybierz **Utwórz Invite Code** i przekaż kod drugiej osobie prywatnym kanałem.
4. Na drugim wpisz kod i kliknij **Połącz konta**.
5. Po synchronizacji oba telefony pokażą wspólny czat i kalendarz wydarzeń.
6. Datę początku związku ustaw w sekcji **Nasze ustawienia**.

## 5. Dodaj na ekran główny
- iPhone: otwórz aplikację w Safari → **Udostępnij → Do ekranu początkowego**.
- Android: otwórz w Chrome → menu → **Dodaj do ekranu głównego / Zainstaluj**.
- Ta wersja jest podstawową aplikacją webową z manifestem; do solidnej obsługi offline i push dojdzie Service Worker.

## 6. Diagnostyka
- `auth/unauthorized-domain`: dodaj domenę GitHub Pages w Firebase Authentication.
- `permission-denied`: sprawdź, czy wdrożono `firestore.rules` i czy użytkownicy są sparowani.
- `functions/not-found`: sprawdź region `europe-west1`, identyfikator projektu i deploy funkcji.
- `Failed to fetch` / problem z modułami: sprawdź połączenie internetowe i konsolę przeglądarki.
- `billing required`: aktywuj Blaze dla Cloud Functions lub wstrzymaj wdrożenie tej funkcji.

## 7. Plan kolejnych wydań
- v3.1: Firebase Cloud Messaging, powiadomienia, przypomnienia, service worker.
- v3.2: pełny kalendarz, zadania, nastroje, lista marzeń, listy na później.
- v3.3: zdjęcia i wspomnienia (Storage), eksport, oś czasu, pytanie dnia, słoik miłych słów, odliczanie.
- v3.4: dopracowanie interfejsu, zabezpieczenia, testy i skróty systemowe.
