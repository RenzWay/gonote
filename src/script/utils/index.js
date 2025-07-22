export function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js")
        .then((reg) => console.log("[SW] Registered", reg))
        .catch((err) => console.error("[SW] Error", err));
    });
  }
}

export async function askNotificationPermission() {
  const permission = await Notification.requestPermission();
  if (permission === "granted") {
    console.log("Notification permission granted ✅");
  } else {
    console.warn("Notification permission denied ❌");
  }
}
