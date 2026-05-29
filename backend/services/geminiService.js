const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeTaskWithAI = async (title, description = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      Jesteś bezstanowym procesorem danych API. Twoim jedynym celem jest analiza tekstu i zwrócenie wyniku WYŁĄCZNIE w postaci surowego obiektu JSON. Obowiązuje absolutny zakaz dodawania jakichkolwiek powitań, wyjaśnień oraz bloków formatowania Markdown (nigdy nie używaj znaków `` ani ``json).

      [DANE WEJŚCIOWE]
      Tytuł: "${title}"
      Opis: "${description}"

      [ZASADY EKSTRAKCJI]
      Przeanalizuj powyższe dane i przypisz im dokładnie trzy parametry.

      1. "taskType" (String):
        - "ACTIVE" — Wymaga pełnego skupienia, zaangażowania umysłowego lub obecności (np. programowanie, pisanie, spotkanie, nauka).
        - "PASSIVE" — Może dziać się w tle lub wymaga minimalnej uwagi (np. pobieranie plików, oczekiwanie na kompilację/odpowiedź, słuchanie podcastu).

      2. "estimatedTime" (Integer):
        - Realistyczny czas wykonania wyrażony wyłącznie w minutach (liczba całkowita).
        - Jeśli opis nie zawiera jasnych ram czasowych, zastosuj rzetelne wartości domyślne dla podobnych zadań (np. e-mail = 10, aktualizacja systemu = 15, raport = 60).

      3. "priority" (String):
        - "high" — Zadania pilne, krytyczne. Kontekst lub słowa kluczowe: ASAP, awaria, natychmiast, dzisiaj, deadline, klient, szef.
        - "low" — Rozrywka, hobby, zadania opcjonalne. Kontekst: "kiedyś", "może", "fajnie byłoby", pomysły na przyszłość.
        - "medium" — Standardowa praca i codzienne zadania bez skrajnych sygnałów pilności lub błahości.

      [FORMAT WYJŚCIOWY - WYMAGANY WZÓR]
      Zwróć dokładnie ten obiekt JSON (z podmienionymi wartościami) jako czysty ciąg znaków:
      {"taskType": "ACTIVE", "estimatedTime": 30, "priority": "medium"}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log("🔍 Surowa odpowiedź AI:", text);

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Nie znaleziono JSON w odpowiedzi AI");

    return JSON.parse(jsonMatch[0]);

  } catch (error) {
    console.error("Błąd Gemini AI:", error.message);
    return {
      taskType: 'ACTIVE',
      estimatedTime: 30,
      priority: 'medium'
    };
  }
};

const generateDailyPlan = async (tasks, events, userName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const now = new Date();
    const currentDate = now.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' });
    const currentTime = now.toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' });

    const tasksList = tasks.map(t => 
      `- [${t.taskType}] ${t.title} (${t.estimatedTime}min, priorytet: ${t.priority})`
    ).join('\n');

    const eventsList = events.map(e => 
      `- ${e.time}: ${e.title} (${e.duration}min)`
    ).join('\n');

    const prompt = `
      Jesteś eksperckim asystentem produktywności. Twój użytkownik to: ${userName}.

      [KONTEKST DANYCH]
      - Dzisiejsza data: ${currentDate}
      - OBECNA GODZINA: ${currentTime} (To Twój absolutny punkt startowy)

      [KALENDARZ - SZTYWNE RAMY]
      ${eventsList || "Brak spotkań."}

      [ZADANIA - DO ZROBIENIA]
      ${tasksList || "Brak zadań."}

      [ZADANIE]
      Przeanalizuj OBECNĄ GODZINĘ i zaplanuj optymalną strategię działania wyłącznie na RESZTĘ DNIA. 

      [ZASADY KRYTYCZNE - BEZWZGLĘDNIE PRZESTRZEGAJ]
      1. Świadomość czasu: Traktuj ${currentTime} jako punkt zero. Nie planuj niczego w przeszłości. Wydarzenia z kalendarza, które już minęły, całkowicie zignoruj.
      2. Realizm okien czasowych: Znajdź najbliższą wolną lukę OD TERAZ. Dopasuj wielkość sugerowanego zadania do dostępnego czasu (nie proponuj długich zadań, jeśli zostało mało czasu do końca dnia lub kolejnego spotkania).
      3. Limit długości: Wygeneruj maksymalnie 3 do 4 zdań.
      4. Format wyjściowy: Zwróć WYŁĄCZNIE czysty tekst. Obowiązuje absolutny zakaz używania jakiegokolwiek formatowania Markdown (żadnych gwiazdek, pogrubień, kursyw, punktorów ani list).
      5. Ton: Zwięzły, konkretny, motywujący i nastawiony na akcję.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error) {
    console.error("Błąd generowania planu:", error);
    return "Nie udało się wygenerować planu dnia. Skup się na priorytetach!";
  }
};

module.exports = { analyzeTaskWithAI, generateDailyPlan };