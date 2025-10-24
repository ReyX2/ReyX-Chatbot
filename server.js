// server.js
// ⚡ Servidor principal del ReyX Chatbot (WhatsApp con UltraMsg + ReyX-Core)

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { processMessage } from "./chatbot/reyx-core.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// 🧠 Verificación rápida para saber si el backend está vivo
app.get("/", (req, res) => {
  res.send("🚀 Servidor ReyX Chatbot activo y conectado con TITAN IA ⚡");
});

// 📩 Webhook que recibe los mensajes de WhatsApp desde UltraMsg
app.post("/api/whatsapp/webhook", async (req, res) => {
  try {
    const data = req.body;
    const mensaje = data?.data?.body || "";
    const numero = data?.data?.from || "";

    console.log("📥 Mensaje recibido:", mensaje, "de", numero);

    // 🧠 Procesar el mensaje con el núcleo de inteligencia
    const respuesta = await processMessage(mensaje, numero);

    // 📤 Enviar la respuesta al usuario por UltraMsg
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

app.listen(PORT, () => console.log(`🔥 Servidor activo en el puerto ${PORT}`));