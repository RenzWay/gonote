import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function addDaySchedule(data) {
  try {
    const response = await addDoc(collection(db, 'schedule'), data);
    console.log('berhasil menambahkan schedule', response);
    return response;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function updateDaySchedule(id, data) {
  try {
    const ref = doc(db, 'schedule', id);
    await updateDoc(ref, data);
    console.log('berhasil update schedule');
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function deleteDaySchedule(id) {
  try {
    const ref = doc(db, 'schedule', id);
    await deleteDoc(ref);
    console.log('berhasil hapus schedule');
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getDaySchedule() {
  try {
    const response = await getDocs(collection(db, 'schedule'));
    return response.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getGonoteTask() {
  const snapshot = await getDocs(collection(db, 'task'));
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      date: data.date?.toDate?.() ?? new Date(),
    };
  });
}

export async function deleteTask(id) {
  await deleteDoc(doc(db, 'task', id));
}

export async function toggleFavorite(id, currentValue) {
  await updateDoc(doc(db, 'task', id), {
    favorite: !currentValue,
  });
}

export async function addGonoteTask(
  title,
  content,
  date,
  priority,
  category,
  favorite = false,
  complete = false,
) {
  try {
    const collectionGonote = collection(db, 'task');
    const payload = {
      title,
      content,
      date: date instanceof Date ? date : date?.toDate?.() || new Date(),
      priority,
      category,
      favorite,
      complete,
    };
    const docRef = await addDoc(collectionGonote, payload);
    console.log(`✅ berhasil menambahkan ${docRef.id}`);
    return docRef;
  } catch (error) {
    console.error('🔥 Firebase error:', error);
    return null;
  }
}

export const toggleComplete = async (id, currentValue) => {
  const ref = doc(db, 'task', id);
  await updateDoc(ref, {
    complete: !currentValue,
  });
};

export async function editGonoteTask(id, updatedData) {
  const ref = doc(db, 'task', id);
  await updateDoc(ref, updatedData);
}
export const getTaskById = async (id) => {
  const ref = doc(db, 'task', id);
  const snapshot = await getDoc(ref);
  return { id: snapshot.id, ...snapshot.data() };
};

export const updateTask = async (id, updatedData) => {
  const ref = doc(db, 'task', id);
  await updateDoc(ref, updatedData);
};
