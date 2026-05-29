# AI Time Manager

AI Time Manager to zaawansowana aplikacja webowa (Single Page Application), która pełni rolę inteligentnego asystenta produktywności. Centralizuje ona zarządzanie notatkami, wydarzeniami w kalendarzu oraz zadaniami. Wykorzystując sztuczną inteligencję (Google Gemini API), aplikacja proaktywnie zarządza Twoim czasem, automatycznie kategoryzuje zadania i układa optymalny plan dnia.

## Główne Funkcjonalności

*   **Inteligentne Zarządzanie Zadaniami:** AI analizuje nazwy i opisy zadań, automatycznie estymując czas ich trwania, ustalając priorytet (Low, Medium, High) oraz rozróżniając zadania aktywne (wymagające skupienia) od pasywnych (wykonywanych w tle).
*   **Smart Dashboard (Podsumowanie Dnia):** Główny panel, na którym asystent AI generuje optymalny harmonogram, łącząc sztywne wydarzenia z kalendarza z elastycznymi zadaniami w dostępne luki czasowe.
*   **Kalendarz (Wydarzenia):** Proste zarządzanie wydarzeniami ze sztywnymi ramami czasowymi.
*   **Notatki:** Przestrzeń do swobodnego zapisywania myśli i informacji.
*   **Płynny User Experience:** Aplikacja została zaprojektowana z myślą o asynchroniczności modeli LLM. Wykorzystuje loadery, blokady akcji oraz mechanizmy graceful degradation, zapewniając płynność działania nawet podczas dłuższego oczekiwania na odpowiedź AI.

## Stack Technologiczny

Projekt został zbudowany jako monorepo przy użyciu stosu MERN z nowoczesnymi narzędziami.

**Frontend:**
*   React.js (Vite)
*   Tailwind CSS (Stylowanie)
*   Custom Hooks (Zarządzanie stanem domenowym)
*   Axios (Komunikacja z API)

**Backend:**
*   Node.js & Express.js
*   MongoDB & Mongoose
*   Google Gemini API (`@google/generative-ai`)
*   JWT (Autoryzacja)

**Testy (QA):**
*   Playwright (Testy End-to-End).
*   *Uwaga: Testy weryfikują realne przepływy i integrują się z rzeczywistym API Google Gemini, nie polegając na mockowaniu.*

## 📂 Struktura Projektu

```text
AITimeManager/
├── frontend/       # Aplikacja React SPA (Vite, Tailwind)
├── backend/        # API Express (Mongoose, integracja z Gemini)
└── tests/          # Testy E2E w Playwright
```

## Uruchomienie Projektu

### Wymagania wstępne

*   Node.js (zalecana wersja 18+)
*   Baza danych MongoDB (lokalna lub Atlas)
*   Klucz API Google Gemini

### Instalacja

1.  **Sklonuj repozytorium:**
    ```bash
    git clone <adres-repozytorium>
    cd AITimeManager
    ```

2.  **Zainstaluj zależności backendu:**
    ```bash
    cd backend
    npm install
    ```

3.  **Zainstaluj zależności frontendu:**
    ```bash
    cd frontend
    npm install
    ```

4.  **Zainstaluj zależności testów:**
    ```bash
    cd tests
    npm install
    npx playwright install
    ```

### Zmienne Środowiskowe

Utwórz plik `.env` w katalogu `backend/` i uzupełnij go następującymi zmiennymi:

```env
PORT=5000
MONGO_URI=twój_string_polaczeniowy_mongodb
JWT_SECRET=twój_sekret_jwt
GEMINI_API_KEY=twój_klucz_api_gemini
```

### Uruchomienie lokalne

**Uruchomienie Backendu:**
```bash
cd backend
npm run dev
```

**Uruchomienie Frontendu:**
```bash
cd frontend
npm run dev
```

Domyślnie frontend uruchomi się pod adresem `http://localhost:5173`, a backend pod `http://localhost:5000`.

## Testowanie

Projekt wykorzystuje narzędzie Playwright do testów E2E.

Aby uruchomić testy:
```bash
cd tests
npx playwright test
```
*Upewnij się, że backend jest uruchomiony i posiadasz prawidłowy klucz API Gemini, ponieważ testy sprawdzają rzeczywistą integrację z LLM.*
