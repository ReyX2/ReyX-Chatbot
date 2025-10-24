// server.js
// ⚡ Servidor principal del ReyX Chatbot (WhatsApp + UltraMsg + TITAN IA)
// Autor: Reinaldo Benavides – CEO de ReyX 🌍

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

// 🧠 Importar módulos internos de ReyX
import { processMessage } from "./chatbot/reyx-core.js";
import { db, saveMessage, getUserMemory } from "./chatbot/reyx-firebase.js";
import { generateResponse } from "./chatbot/reyx-gemini.js";

// 🔹 Cargar variables del entorno (.env)
dotenv.config();

// 🔹 Crear servidor Express
const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Verificación rápida
app.get("/", (req, res) => {
  res.send("⚡ Servidor ReyX Chatbot activo y conectado con TITAN IA ⚡");
});

// 📩 Endpoint principal: mensajes entrantes desde UltraMsg
app.post("/api/whatsapp/webhook", async (req, res) => {
  try {
    const data = req.body;
    const mensaje = data?.data?.body || "";
    const numero = data?.data?.from || "";

    console.log("📥 Mensaje recibido:", mensaje, "de", numero);

    // Lógica principal (usa reyx-core.js)
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

// 🚀 Iniciar servidor HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🔥 Servidor ReyX Chatbot activo en puerto ${PORT}`)
);