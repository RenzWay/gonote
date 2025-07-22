import React from "react";
import ReactDOM from "react-dom/client";

import {
  registerServiceWorker,
  askNotificationPermission,
} from "./utils/index.js";

import "../style/style.css";
import "../style/base.scss";
import App from "./app.jsx";

const content = document.getElementById("content");
const root = ReactDOM.createRoot(content);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

askNotificationPermission();
registerServiceWorker();
