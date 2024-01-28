import React from 'react';
import App from './App.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

import { WaterPumpAPIProvider } from './contexts/WaterPumpAPIContext.js';
// Redux store
import { AppStore } from './store';

import { createRoot } from 'react-dom/client';
const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppStore>
      <WaterPumpAPIProvider>
        <App />
      </WaterPumpAPIProvider>
    </AppStore>
  </React.StrictMode>
);
