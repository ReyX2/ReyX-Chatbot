// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import { processMessage } from "./chatbot/reyx-core.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🤖 ReyX Chatbot activo y conectado con Firebase y Gemini.");
});

app.post("/api/whatsapp/webhook", async (req, res) => {
  try {
    const data = req.body;
    const mensaje = data?.data?.body || "";
    const numero = data?.data?.from || "";

    console.log("📥 Mensaje recibido:", mensaje, "de", numero);

    const respuesta = await processMessage(mensaje, numero);

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Chatbot ReyX escuchando en el puerto ${PORT}`)
);