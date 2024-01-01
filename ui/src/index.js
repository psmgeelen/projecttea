import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.js';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS

import { NotificationsProvider } from './contexts/NotificationsContext.js';
import { WaterPumpAPIProvider } from './contexts/WaterPumpAPIContext.js';

ReactDOM.render(
  <React.StrictMode>
    <NotificationsProvider>
      <WaterPumpAPIProvider>
        <App />
      </WaterPumpAPIProvider>
    </NotificationsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
