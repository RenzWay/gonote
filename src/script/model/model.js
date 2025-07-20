// Ganti URL sesuai dengan mock server atau server yang sebenarnya
const url =
  "https://lively-moon-764606.postman.co/workspace/gonote~105fe907-d76b-46d2-80ef-d6a42fa99616/request/41320528-13526454-8386-4727-b081-4dae007c211f?action=share&source=copy-link&creator=41320528&active-environment=4fd1492f-73ad-4359-aefa-9d2543dfe8c3";
// atau gunakan localhost jika server berjalan lokal
// const url = "http://localhost:3000/task";

export async function GetTask() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Tambahkan header lain jika diperlukan, misalnya authorization
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Data from API:", data);
    return data;
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    throw error;
  }
}
