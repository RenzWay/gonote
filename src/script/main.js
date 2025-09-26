import React from 'react';
import ReactDOM from 'react-dom/client';

import {askNotificationPermission, registerServiceWorker} from './utils/index.js';

import '../style/style.css';
import '../style/base.scss';
import App from './app.jsx';

const content = document.getElementById('content');
const root = ReactDOM.createRoot(content);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

async function initApp() {
  await askNotificationPermission();
  registerServiceWorker();
}
initApp();
