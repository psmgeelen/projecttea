import React, { useState } from 'react';
import './App.css';
import { Container, Form } from 'react-bootstrap';

import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField';
import PourTimeField from './components/PourTimeField';
import SystemControls from './components/SystemControls';

function App() {
  const [pourTime, setPourTime] = useState(1000);

  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <Form>
        <APIAddressField />
        <PourTimeField onChange={setPourTime} min={100} max={10000} />
        
        <SystemControls pouringTime={pourTime} />
      </Form>
      <div className="spacer my-3" />
      <NotificationsArea />
    </Container>
  );
}

export default App;
