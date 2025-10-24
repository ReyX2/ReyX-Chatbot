// server.js
// ⚡ Servidor principal del ReyX Chatbot (WhatsApp + UltraMsg + TITAN IA)
// Autor: Reinaldo Benavides – CEO de ReyX 🌍

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { iniciarServidorReyX } from "./chatbot/reyx-core.js"; // ✅ Núcleo central del bot

// 🔹 Cargar variables del entorno (.env)
dotenv.config();

// 🔹 Crear servidor Express
const app = express();
app.use(cors());
app.use(express.json());

// 🧩 Ruta de prueba rápida
app.get("/", (req, res) => {
  res.send("⚡ Servidor ReyX Chatbot activo y conectado con TITAN IA ⚡");
});

// 🚀 Iniciar el núcleo del chatbot
iniciarServidorReyX(app);

// 🚀 Iniciar servidor HTTP
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor ReyX Chatbot activo en puerto ${PORT}`);
});
