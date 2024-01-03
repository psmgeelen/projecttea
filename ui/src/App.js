import React, { useState } from 'react';
import './App.css';
import { Container, Form } from 'react-bootstrap';

import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField';
import PourTimeField from './components/PourTimeField';
import SystemControls from './components/SystemControls';
import SystemStatusArea from './components/SystemStatusArea';

// TODO: Replace this with a real system status
//       replace "water threshold" with "waterThreshold"
//       replace "time left" with "timeLeft"
//       add field "updated"
const systemStatus = {
  waterThreshold: 1234,
  pump: {
    running: false,
    timeLeft: 0,
  },
  updated: new Date(),
};

function App() {
  const [pourTime, setPourTime] = useState(1000);
  // TODO: Add a fake countdown timer of timeLeft
  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <SystemStatusArea status={systemStatus} />

      <Form>
        <APIAddressField />
        {(null === systemStatus) ? null : (
          <>
            <PourTimeField onChange={setPourTime} min={100} max={systemStatus.waterThreshold} />
            <SystemControls pouringTime={pourTime} systemStatus={systemStatus} />
          </>
        )}
      </Form>

      <div className="spacer my-3" />
      <NotificationsArea />
    </Container>
  );
}

export default App;
