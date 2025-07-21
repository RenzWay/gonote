import { addDoc } from "firebase/firestore";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function getGonoteTask() {
  const snapshot = await getDocs(collection(db, "task"));
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function deleteTask(id) {
  await deleteDoc(doc(db, "task", id));
}

export async function toggleFavorite(id, currentValue) {
  await updateDoc(doc(db, "task", id), {
    favorite: !currentValue,
  });
}

export async function addGonoteTask(title, content, date, priority, category) {
  try {
    const collectionGonote = collection(db, "task");
    const payload = {
      title,
      content,
      date: date instanceof Date ? date : date?.toDate?.() || new Date(),
      priority,
      category,
      favorite: false,
      complete: false,
    };
    console.log("payload:", payload); // 🐞
    const docRef = await addDoc(collectionGonote, payload);
    console.log(`✅ berhasil menambahkan ${docRef.id}`);
    return docRef;
  } catch (error) {
    console.error("🔥 Firebase error:", error);
    return null;
  }
}
