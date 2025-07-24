import { getGonoteTask } from '../model/model';

export async function checkTasksForToday() {
  const permission = Notification.permission;
  if (permission !== 'granted') return;

  const tasks = await getGonoteTask();
  const notifiedTaskIds = getNotifiedTaskIds();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let task of tasks) {
    const taskDate = new Date(task.date);
    taskDate.setHours(0, 0, 0, 0);

    const diffDays = (taskDate - today) / (1000 * 60 * 60 * 24);
    const alreadyNotified = notifiedTaskIds.includes(task.id);

    if ((diffDays === 0 || diffDays === 1) && !alreadyNotified) {
      // Tampilkan notifikasi hanya jika belum dikirim
      showTaskNotification('📌 Pengingat Jadwal', task.title, task.content);
      saveNotifiedTaskId(task.id);
    }
  }
}

function showTaskNotification(title, taskTitle, taskContent) {
  const options = {
    body: `${taskTitle} - ${taskContent}`,
    icon: './public/notes.png',
    badge: './public/react.png',
    data: '/all',
  };

  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(title, options);
  });
}

function getNotifiedTaskIds() {
  try {
    return JSON.parse(sessionStorage.getItem('notifiedTasks')) || [];
  } catch {
    return [];
  }
}

function saveNotifiedTaskId(id) {
  const current = getNotifiedTaskIds();
  if (!current.includes(id)) {
    current.push(id);
    sessionStorage.setItem('notifiedTasks', JSON.stringify(current));
  }
}

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then((reg) => console.log('[SW] Registered', reg))
        .catch((err) => console.error('[SW] Error', err));
    });
  }
}

export async function askNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted ✅');
  } else {
    console.warn('Notification permission denied ❌');
  }
}
