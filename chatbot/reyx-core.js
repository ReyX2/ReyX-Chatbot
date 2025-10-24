// chatbot/reyx-core.js
// ⚡ Núcleo del Chatbot ReyX (memoria + citas + IA)

import axios from "axios";
import {
  saveMessage,
  getUserMemory,
  saveAppointment,
  cancelAppointment,
} from "./reyx-firebase.js";
import { generateResponse } from "./reyx-gemini.js";

// 💬 Controlador de mensajes
export function iniciarServidorReyX(app) {
  app.post("/api/whatsapp/webhook", async (req, res) => {
    try {
      const data = req.body;
      const mensaje = data?.data?.body || "";
      const numero = data?.data?.from || "";

      console.log("📥 Mensaje recibido:", mensaje, "de", numero);

      const respuesta = await processMessage(mensaje, numero);

      // ✅ Limpiar número (sin @c.us)
      const cleanNumber = numero.replace("@c.us", "");

      // 📤 Enviar la respuesta al usuario por UltraMsg
      const url = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`;
      await axios.post(url, {
        token: process.env.ULTRAMSG_TOKEN,
        to: cleanNumber,
        body: respuesta,
      });

      console.log("✅ Respuesta enviada a", cleanNumber);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("❌ Error procesando mensaje:", error.message);
      res.status(500).json({ success: false, error: error.message });
    }
  });
}

// 💡 Procesar texto del usuario
export async function processMessage(text, sender) {
  try {
    const msg = text.toLowerCase().trim();
    const memory = await getUserMemory(sender);
    await saveMessage(sender, "usuario", msg);

    // 📍Respuestas directas
    if (msg.includes("hola"))
      return await responder(sender, "⚡ Hola! Soy TITAN IA de ReyX 🤖 ¿En qué puedo ayudarte?");
    if (msg.includes("titan ia"))
      return await responder(sender, "💫 TITAN IA es la inteligencia oficial de ReyX, disponible en Google Play 🌍");
    if (msg.includes("reyxd"))
      return await responder(sender, "🎥 ReyXD descarga videos sin marca de agua. ¡Descárgala ya en Google Play! 🔥");

    // 📅 Agendar citas
    if (msg.includes("agendar") || msg.includes("cita")) {
      await saveAppointment(sender, "Cita con el CEO de ReyX", "Reinaldo Benavides Córdoba");
      await notificarCEO(`🚨 Nueva cita agendada por ${sender}`);
      return await responder(sender, "📅 Tu cita fue agendada con el CEO de ReyX. Te avisaré 30 min antes ⏰");
    }

    // ❌ Cancelar citas
    if (msg.includes("cancelar")) {
      await cancelAppointment(sender);
      await notificarCEO(`⚠️ ${sender} canceló su cita.`);
      return await responder(sender, "❌ Tu cita fue cancelada correctamente.");
    }

    // 💭 IA con memoria
    const context = memory.join("\n");
    const aiResponse = await generateResponse(`${context}\nUsuario: ${msg}`);
    return await responder(sender, aiResponse);
  } catch (err) {
    console.error("⚠️ Error interno:", err.message);
    return "⚠️ Error interno del chatbot.";
  }
}

// ✉️ Guardar y devolver texto
async function responder(user, text) {
  await saveMessage(user, "bot", text);
  return text;
}

// 📞 Notificación automática al CEO
async function notificarCEO(mensaje) {
  try {
    const ceoNumber = process.env.CEO_NUMBER.replace("@c.us", "");
    const url = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`;
    await axios.post(url, {
      token: process.env.ULTRAMSG_TOKEN,
      to: ceoNumber,
      body: mensaje,
    });
  } catch (err) {
    console.error("❌ Error notificando al CEO:", err.message);
  }
}