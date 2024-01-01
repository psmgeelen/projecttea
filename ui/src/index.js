import React from 'react';
import App from './App.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

import { NotificationsProvider } from './contexts/NotificationsContext.js';
import { WaterPumpAPIProvider } from './contexts/WaterPumpAPIContext.js';

import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NotificationsProvider>
      <WaterPumpAPIProvider>
        <App />
      </WaterPumpAPIProvider>
    </NotificationsProvider>
  </React.StrictMode>
);
