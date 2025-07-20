import React from "react";
import ReactDOM from "react-dom/client";

import "../style/style.css";
import "../style/base.scss";

// import "bootstrap/dist/css/bootstrap.css";
// import "bootstrap/dist/js/bootstrap.bundle.js";

import App from "./app.jsx";

const content = document.getElementById("content");
const root = ReactDOM.createRoot(content);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
