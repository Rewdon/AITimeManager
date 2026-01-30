const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');


dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const analyzeTaskWithAI = async (title, description = "") => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash" });

    const prompt = `
      Jesteś asystentem API. Zwróć TYLKO czysty JSON (bez markdown).
      Przeanalizuj zadanie: "${title}". Opis: "${description}".
      
      Zdecyduj:
      1. taskType: "ACTIVE" (wymaga skupienia) lub "PASSIVE" (w tle).
      2. estimatedTime: czas w minutach (number).
      3. priority: "high" (pilne/krytyczne), "medium" (standardowe), "low" (mało ważne/na kiedyś).
      
      Zasady priorytetów:
      - Słowa kluczowe "pilne", "ważne", "dzisiaj", "awaria", "termin", "szef", "klient" -> high.
      - Rozrywka, hobby, luźne pomysły -> low.
      - Standardowa praca -> medium.

      Wzór odpowiedzi:
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
    console.error("❌ Błąd Gemini AI:", error.message);
    return {
      taskType: 'ACTIVE',
      estimatedTime: 30,
      priority: 'medium'
    };
  }
};

const generateDailyPlan = async (tasks, events, userName) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
      Jesteś osobistym asystentem produktywności dla użytkownika o imieniu ${userName}.
      
      DANE CZASOWE:
      - Dziś jest: ${currentDate}
      - OBECNA GODZINA: ${currentTime} (To bardzo ważne!)

      KALENDARZ (Sztywne ramy):
      ${eventsList || "Brak spotkań."}

      LISTA ZADAŃ (Do zrobienia):
      ${tasksList || "Brak zadań."}

      Twoim celem jest ułożenie strategii na RESZTĘ DNIA (max 3-4 zdania).
      
      Zasady krytyczne:
      1. Spójrz na obecną godzinę (${currentTime}). Jeśli jakieś spotkanie z kalendarza już minęło, zignoruj je lub wspomnij krótko jako "po spotkaniu X".
      2. Nie planuj zadań na godziny, które już minęły!
      3. Znajdź najbliższą wolną lukę czasową OD TERAZ.
      4. Sugeruj zadania pasujące do pozostałego czasu (np. nie proponuj 3-godzinnego zadania, jeśli jest 16:00 a o 17:00 koniec pracy).
      5. Styl: Konkretny, motywujący, krótki. Bez formatowania markdown (pogrubień itp.), czysty tekst.
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