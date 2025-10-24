// server.js
// ⚡ Servidor principal del ReyX Chatbot (WhatsApp + UltraMsg + TITAN IA)
// Autor: Reinaldo Benavides – CEO de ReyX 🌍

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import {
  saveMessage,
  getUserMemory,
  saveAppointment,
  cancelAppointment,
} from "./chatbot/reyx-firebase.js";
import { generateResponse } from "./chatbot/reyx-gemini.js";

dotenv.config();

// 🚀 Crear servidor
const app = express();
app.use(cors());
app.use(express.json());

// 🧠 Verificación rápida
app.get("/", (req, res) => {
  res.send("⚡ Servidor ReyX Chatbot activo y conectado con TITAN IA ⚡");
});

// 📩 Webhook principal de UltraMsg
app.post("/api/whatsapp/webhook", async (req, res) => {
  try {
    const data = req.body;
    const mensaje = data?.data?.body || "";
    const numero = data?.data?.from || "";

    console.log("📥 Mensaje recibido:", mensaje, "de", numero);

    const respuesta = await processMessage(mensaje, numero);

    // 📤 Enviar respuesta al usuario por UltraMsg
    const url = `https://api.ultramsg.com/${process.env.ULTRAMSG_INSTANCE_ID}/messages/chat`;
    await axios.post(url, {
      token: process.env.ULTRAMSG_TOKEN,
      to: numero,
      body: respuesta,
    });

    console.log("✅ Respuesta enviada a", numero);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ Error procesando mensaje:", error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor ReyX Chatbot activo en puerto ${PORT}`);
});

// 💬 Procesar texto del usuario
async function processMessage(text, sender) {
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
    const ceoNumber = process.env.CEO_NUMBER;
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