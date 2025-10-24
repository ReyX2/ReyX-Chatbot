// chatbot/reyx-utils.js
import axios from "axios";

export async function askGemini(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );
    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No entendí bien eso 🤔";
  } catch (err) {
    console.error("Error en Gemini:", err.message);
    return "⚠️ Hubo un error con el motor de inteligencia.";
  }
}