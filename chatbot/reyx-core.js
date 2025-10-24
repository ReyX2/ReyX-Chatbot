// chatbot/reyx-core.js
import { getUserMemory, saveToMemory } from "./reyx-memory.js";
import { askGemini } from "./reyx-utils.js";

export async function processMessage(mensaje, numero) {
  const historial = await getUserMemory(numero);
  const contexto = historial.map(h => `${h.sender}: ${h.text}`).join("\n");

  const prompt = `
Eres TITAN IA ⚡, el asistente oficial de ReyX. 
Recuerda las conversaciones previas y ayuda al usuario en todo momento.
Puedes manejar citas, responder dudas sobre ReyX, TITAN IA y ayudar a clientes.

Conversación previa:
${contexto}

Usuario (${numero}): ${mensaje}
Asistente:
`;

  const respuesta = await askGemini(prompt);

  await saveToMemory(numero, { sender: "user", text: mensaje });
  await saveToMemory(numero, { sender: "bot", text: respuesta });

  return respuesta;
}