// chatbot/reyx-memory.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();

export async function getUserMemory(numero) {
  const doc = await db.collection("chatbot_memory").doc(numero).get();
  return doc.exists ? doc.data().messages || [] : [];
}

export async function saveToMemory(numero, message) {
  const ref = db.collection("chatbot_memory").doc(numero);
  const doc = await ref.get();

  const messages = doc.exists ? doc.data().messages || [] : [];
  messages.push({ sender: message.sender, text: message.text, time: Date.now() });

  if (messages.length > 40) messages.shift();

  await ref.set({ messages }, { merge: true });
}