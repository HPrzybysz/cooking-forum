# Dokumentacja Projektu Cooking Forum

## Backend

### Opis ogólny

Backend projektu to serwer oparty na frameworku Express.js, który udostępnia REST API do zarządzania użytkownikami,
przepisami, kategoriami, składnikami, ocenami i innymi zasobami. Serwer obsługuje uwierzytelnianie, autoryzację oraz
zarządzanie sesjami.

### Baza danych:

#### Opis:

- Główne tabele

  1. Użytkownicy (users)

     Przechowuje informacje o użytkownikach (imię, nazwisko, email, hasło, avatar)

     Zawiera pola timestamp dla śledzenia tworzenia i aktualizacji konta

     Unikalny indeks na emailu

  2. Kategorie (categories)

     Organizuje przepisy w kategorie (np. "Desery", "Dania główne")

     Każda kategoria może mieć obrazek reprezentacyjny

  3. Tagi (tags)

     Etykiety do oznaczania przepisów (np. "wegetariańskie", "szybkie")

     Unikalne nazwy tagów

  4. Przepisy (recipes)

     Główna tabela przechowująca przepisy

     Zawiera podstawowe informacje (tytuł, opis, czas przygotowania, liczba porcji)

     Powiązana z użytkownikiem (autor) i kategorią

     Posiada pełnotekstowy indeks do wyszukiwania

  5. Elementy przepisów

     Składniki (ingredients): lista składników z ilościami

     Kroki przygotowania (preparation_steps): ponumerowane instrukcje

     Zdjęcia przepisów (recipe_images): zdjęcia związane z przepisem (możliwość oznaczenia głównego zdjęcia)

  6. Relacje między przepisami a tagami (recipe_tags)

     Tabela łącząca pozwalająca na przypisanie wielu tagów do przepisu

- Funkcjonalności społecznościowe

  1. Ulubione (favorites)

     Śledzi, którzy użytkownicy dodały przepisy do ulubionych

  2. Statystyki przepisów (recipe_statistics)

     Liczniki wyświetleń i ulubionych

     Data ostatniego wyświetlenia

  3. Oceny i recenzje (recipe_ratings)

     System ocen (1-5) z możliwością dodania recenzji

     Każdy użytkownik może ocenić przepis tylko raz

- Bezpieczeństwo i uwierzytelnianie

  1. Tokeny odświeżania (refresh_tokens)

     Zarządzanie sesjami użytkowników

  2. Tokeny resetowania hasła (password_reset_tokens)

     Bezpieczne resetowanie haseł z ograniczeniem czasowym

#### Diagram:

- Patrz: baza_diagram.png

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

Frontend to aplikacja SPA napisana w React z wykorzystaniem TypeScript. Umożliwia użytkownikom przeglądanie, dodawanie i
ocenianie przepisów, zarządzanie kontem oraz korzystanie z funkcji społecznościowych.

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

## Podział pracy:

### wszystko:

- Hubert Przybysz

