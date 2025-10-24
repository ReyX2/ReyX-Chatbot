// reyx-core.js
// ⚡ Núcleo central del ecosistema de bots de ReyX (WhatsApp, Telegram, Web)

import axios from "axios";

// 💬 Procesa los mensajes recibidos y decide la respuesta
export async function processMessage(text, sender) {
  try {
    const msg = text.toLowerCase().trim();

    // 🔹 Respuestas instantáneas
    if (msg.includes("hola") || msg.includes("buenas")) {
      return `⚡ Hola ${sender || ""}! Soy TITAN IA de ReyX. Estoy aquí para ayudarte 🚀`;
    }

    if (msg.includes("quién eres") || msg.includes("que eres")) {
      return "Soy TITAN IA ⚡, un bot inteligente de ReyX diseñado para automatizar y mejorar la atención de tu negocio 💼.";
    }

    if (msg.includes("web") || msg.includes("página")) {
      return "🌐 Conoce más del universo ReyX en https://reyx-global.vercel.app 🌍";
    }

    // 🔸 Si no hay coincidencia directa, se conecta con TITAN IA
    const aiResponse = await connectTitanIA(msg);
    return aiResponse || "🤔 No logré entenderte del todo, ¿puedes explicarlo de otra forma?";
  } catch (err) {
    console.error("❌ Error en processMessage:", err.message);
    return "⚠️ Ocurrió un error procesando tu mensaje.";
  }
}

// 🧠 Conecta con TITAN IA (tu backend principal)
async function connectTitanIA(prompt) {
  try {
    const response = await axios.post("https://titan-ia-production.up.railway.app/api/reyx-m", {
      message: prompt,
      sender: "ReyX-WhatsApp",
    });
    return response.data.reply || response.data.response || "⚡ Respuesta generada por TITAN IA.";
  } catch (err) {
    console.error("❌ Error al conectar con TITAN IA:", err.message);
    return null;
  }
}