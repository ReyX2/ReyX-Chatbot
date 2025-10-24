// chatbot/reyx-gemini.js
import axios from "axios";

export async function generateResponse(prompt) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    };

    const { data } = await axios.post(url, body);
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "🤖 No se obtuvo respuesta.";
    return text;
  } catch (error) {
    console.error("❌ Error en Gemini:", error.message);
    return "⚠️ No se pudo conectar con la IA.";
  }
}