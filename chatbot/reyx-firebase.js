// chatbot/reyx-firebase.js
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

// 💾 Guardar mensaje
export async function saveMessage(userId, sender, text) {
  await db
    .collection("reyx_whatsapp_chats")
    .doc(userId)
    .collection("mensajes")
    .add({
      sender,
      text,
      timestamp: Date.now(),
    });
}

// 🧠 Obtener memoria del usuario
export async function getUserMemory(userId) {
  const snapshot = await db
    .collection("reyx_whatsapp_chats")
    .doc(userId)
    .collection("mensajes")
    .orderBy("timestamp", "desc")
    .limit(10)
    .get();

  return snapshot.docs.map((d) => d.data().text).reverse();
}

// 📅 Guardar cita
export async function saveAppointment(userId, motivo, persona) {
  await db.collection("reyx_citas").doc(userId).set({
    motivo,
    persona,
    fecha: new Date().toISOString(),
    activa: true,
  });
}

// ❌ Cancelar cita
export async function cancelAppointment(userId) {
  await db.collection("reyx_citas").doc(userId).update({
    activa: false,
  });
}
