# Dokumentacja Projektu Cooking Forum

## Backend

### Opis ogólny
Backend projektu to serwer oparty na frameworku Express.js, który udostępnia REST API do zarządzania użytkownikami, przepisami, kategoriami, składnikami, ocenami i innymi zasobami. Serwer obsługuje uwierzytelnianie, autoryzację oraz zarządzanie sesjami.

### Struktura katalogów
- `controllers/` - logika obsługi żądań HTTP, implementacja endpointów API
- `models/` - definicje modeli danych i schematów bazy danych
- `routes/` - definicje tras API i ich powiązanie z kontrolerami
- `middlewares/` - pośredniczące funkcje np. uwierzytelnianie, obsługa błędów
- `utils/` - narzędzia pomocnicze, np. szyfrowanie, wysyłka emaili, logowanie
- `config/` - konfiguracje, np. połączenie z bazą danych
- `uploads/` - katalog do przechowywania przesłanych plików (np. zdjęć)
- `scripts/` - katlog do przechowywania skryptów np do synchronizacji stanu
- `utils/` - narzędzia do wykorzystania w innych częściach kodu

### Główne funkcjonalności API
- **Autoryzacja i uwierzytelnianie**: rejestracja, logowanie, odświeżanie tokenów, resetowanie hasła
- **Zarządzanie użytkownikami**: pobieranie profilu, edycja danych
- **Kategorie i składniki**: CRUD kategorii i składników używanych w przepisach
- **Przepisy**: tworzenie, edycja, usuwanie, pobieranie przepisów oraz ich komponentów i kroków przygotowania
- **Oceny i ulubione**: dodawanie ocen, zarządzanie ulubionymi przepisami
- **Statystyki**: śledzenie popularności przepisów i innych statystyk
- **Reset Hasła**: wysyłanie maili na podany adres email z tokenem do resetu hasła

### Konfiguracja serwera i middleware
- CORS skonfigurowany do komunikacji z frontendem
- Parsowanie ciała żądań JSON i URL-encoded
- Obsługa statycznych plików w katalogu `uploads`
- Globalna obsługa błędów

---

## Frontend

### Opis ogólny
Frontend to aplikacja SPA napisana w React z wykorzystaniem TypeScript. Umożliwia użytkownikom przeglądanie, dodawanie i ocenianie przepisów, zarządzanie kontem oraz korzystanie z funkcji społecznościowych.

### Struktura katalogów
- `components/` - komponenty React odpowiadające za poszczególne strony i elementy UI
- `context/` - kontekst uwierzytelniania i zarządzania stanem aplikacji
- `services/` - warstwa komunikacji z backendem (API)
- `styles/` - pliki SCSS do stylowania aplikacji
- `assets/` - zasoby statyczne, takie jak obrazy i ikony

### Główne komponenty i strony
- **Logowanie i rejestracja**: strony umożliwiające uwierzytelnianie użytkowników
- **Strona główna**: przegląd najpopularniejszych i polecanych przepisów
- **Kategorie i przepisy**: przeglądanie kategorii oraz szczegółów przepisów
- **Dodawanie przepisu**: formularz do tworzenia nowych przepisów
- **Konto użytkownika**: zarządzanie danymi użytkownika i jego przepisami
- **Ulubione**: lista ulubionych przepisów użytkownika

### Routing i ochrona tras
- React Router do nawigacji między stronami
- Komponent `ProtectedRoute` zabezpieczający dostęp do chronionych stron

### Kontekst uwierzytelniania
- `AuthContext` zarządza stanem logowania i danymi użytkownika w całej aplikacji

### Stylowanie i zasoby
- Stylowanie oparte na SCSS z podziałem na zmienne, komponenty i strony
- Zasoby graficzne przechowywane w katalogu `assets`

---

### Resetowanie hasła poprzez email
- Adres z którego przyjdzie mail: sadadsxdawdasxda@gmail.com 
