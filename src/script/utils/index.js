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
    badge: './public/notes.png',
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
    let refreshing;

    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });

    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        // Check for updates - lebih sering di development
        const updateInterval = process.env.NODE_ENV === 'development' ? 5000 : 60000; // 5s dev, 60s prod
        setInterval(() => {
          registration.update();
        }, updateInterval);

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          console.log('New SW installing...');

          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  // Ada SW baru tersedia
                  console.log('New SW available');
                  handleUpdateAvailable(newWorker);
                } else {
                  // SW pertama kali install
                  console.log('SW ready');
                }
              }
            });
          }
        });
      })
      .catch((error) => {
        console.log('SW registration failed:', error);
      });
  }
}

function handleUpdateAvailable(newWorker) {
  // Development: Auto update tanpa konfirmasi
  if (process.env.NODE_ENV === 'development') {
    console.log('🔄 Development mode: Auto updating...');
    autoUpdateSW(newWorker);
    return;
  }

  // Production: Konfirmasi user dulu
  if (confirm('Versi terbaru tersedia! Refresh halaman untuk update?')) {
    if (newWorker && newWorker.postMessage) {
      newWorker.postMessage({ type: 'SKIP_WAITING' });
    }
  }
}

// Function untuk auto update (hanya dipanggil ketika ada newWorker)
function autoUpdateSW(newWorker) {
  if (newWorker && newWorker.postMessage) {
    console.log('Auto updating to new version...');
    newWorker.postMessage({ type: 'SKIP_WAITING' });

    // Delay sedikit untuk development agar tidak terlalu kasar
    if (process.env.NODE_ENV === 'development') {
      console.log('⏳ Reloading in 1 second...');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  } else {
    console.warn('No valid service worker for auto update');
  }
}

export async function askNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('Browser tidak support notifikasi');
    return false;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    console.log('Notification permission granted ✅');
    return true;
  } else {
    console.warn('Notification permission denied ❌');
    return false;
  }
}

// Function untuk force update cache (untuk development/testing)
export function forceCacheUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.update();
    });
  }
}
