# Only Us v3.1 — GitHub Pages + Firebase CDN

Projekt oparty na oryginalnej paczce v3.0. Poprawiono niezgodność `firebase-config.js` z `index.html` oraz ujednolicono importy CDN Firebase SDK do 13.4.0.

## Publikacja
1. Rozpakuj ZIP.
2. Na GitHub otwórz repozytorium `only-us` → Add file → Upload files. Wgraj zawartość folderu głównego paczki (nie sam plik ZIP). Zatwierdź Commit changes.
3. Settings → Pages: Branch `main`, folder `/ (root)`. Poczekaj na wdrożenie.
4. Firebase Authentication: włącz Email/Password, dodaj `<login>.github.io` w Authorized domains.
5. Firebase Firestore: utwórz bazę w trybie production. Reguły `firestore.rules` należy wdrożyć przed korzystaniem z prywatnych danych. Nie używaj reguł `allow read, write: if true`.
6. Do działania Invite Code wymagane jest wdrożenie funkcji z `functions/` w projekcie Firebase `only-us-e3723` w regionie `europe-west1`; wymaga to narzędzia Firebase CLI i zwykle planu Blaze. Sama publikacja na GitHub Pages nie wdraża funkcji ani reguł.
7. Sprawdź stronę po twardym odświeżeniu Ctrl+Shift+R.

## Wdrażanie backendu (komputer z Node.js i Firebase CLI)
```bash
npm install -g firebase-tools
firebase login
firebase use --add
cd functions
npm install
cd ..
firebase deploy --only firestore:rules,functions
```
W `firebase use --add` wybierz projekt `only-us-e3723`. Plik `.firebaserc.example` jest przykładem, nie aktywną konfiguracją.

## Status
- Interfejs i Firebase Auth: gotowe do testów po publikacji i włączeniu usług.
- Czat, wydarzenia, data związku: wymagają poprawnych reguł i połączenia kont.
- Invite Code: wymaga wdrożenia Cloud Functions.
- Powiadomienia push, album, pełny kalendarz i pozostałe moduły: jeszcze niezaimplementowane.
- Nie wykonano testu end-to-end na Twoim projekcie Firebase.

## Bezpieczeństwo
`firebase-config.js` zawiera publiczną konfigurację klienta, nie klucz konta usługi. Nie umieszczaj w repozytorium prywatnych kluczy serwerowych. Przed użyciem przez dwie osoby sprawdź reguły dostępu i ograniczenia zaproszeń.
