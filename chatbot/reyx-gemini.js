// chatbot/reyx-gemini.js
import axios from "axios";

export async function generateResponse(prompt) {
  try {
    // ⚡ Usa el mismo modelo que TITAN IA
    const GEMINI_MODEL = "gemini-2.5-flash-lite";
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const { data } = await axios.post(GEMINI_API_URL, body, {
      headers: { "Content-Type": "application/json" },
    });

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 No se obtuvo respuesta de TITAN IA.";

    return text;
  } catch (error) {
    console.error("❌ Error en Gemini:", error.response?.status || error.message);

    // 🧠 Respuesta humana si la API falla
    return "⚙️ TITAN IA está procesando muchas solicitudes ahora. Inténtalo de nuevo en unos minutos ⚡";
  }
}
