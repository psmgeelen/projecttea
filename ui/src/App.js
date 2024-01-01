import React, { useState } from 'react';
import './App.css';
import { Container, Form, Button } from 'react-bootstrap';

import { useWaterPumpAPI } from './contexts/WaterPumpAPIContext';
import { useNotificationsSystem } from './contexts/NotificationsContext.js';
import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField';
import PourTimeField from './components/PourTimeField';

function App() {
  const waterPump = useWaterPumpAPI().API;
  const NotificationsSystem = useNotificationsSystem();  
  const [pourTime, setPourTime] = useState(1000);

  const handleStart = async () => {
    try {
      await waterPump.start(pourTime);
      NotificationsSystem.alert('Water pump started successfully!');
    } catch (error) {
      NotificationsSystem.alert('Error starting water pump: ' + error.message);
    }
  };

  const handleStop = async () => {
    try {
      await waterPump.stop();
      NotificationsSystem.alert('Water pump stopped successfully!');
    } catch (error) {
      NotificationsSystem.alert('Error stopping water pump: ' + error.message);
    }
  };

  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <NotificationsArea />
      <Form>
        <APIAddressField />
        <PourTimeField onChange={setPourTime} min={100} max={10000} />
        <Button variant="primary" onClick={handleStart}>Start</Button>{' '}
        <Button variant="secondary" onClick={handleStop}>Stop</Button>
      </Form>
    </Container>
  );
}

export default App;
