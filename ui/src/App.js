import React, { useState } from 'react';
import './App.css';
import { Container, Form } from 'react-bootstrap';

import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField';
import PourTimeField from './components/PourTimeField';
import SystemControls from './components/SystemControls';
import SystemStatusArea from './components/SystemStatusArea';

function App() {
  // TODO: Move this to a redux store
  const [pourTime, setPourTime] = useState(1000);
  // TODO: Add a fake countdown timer of timeLeft
  const systemStatus = null; // TODO: Remove usage of this variable and use redux store instead
  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <SystemStatusArea />

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