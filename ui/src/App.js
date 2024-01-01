import React, { useState, useEffect } from 'react';
import './App.css';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';

import { useWaterPumpAPI } from './contexts/WaterPumpAPIContext';
import { useNotificationsSystem } from './contexts/NotificationsContext.js';
import NotificationsArea from './components/NotificationsArea.js';
import APIAddressField from './components/APIAddressField';

const STORE_RUNTIME = 'runTime';

function App() {
  const waterPumpCtx = useWaterPumpAPI();
  const [runTime, setRunTime] = useState(1000);
  const NotificationsSystem = useNotificationsSystem();

  useEffect(() => {
    let storedRunTime = localStorage.getItem(STORE_RUNTIME);
    if (storedRunTime) {
      if (typeof storedRunTime === 'string') {
        storedRunTime = parseInt(storedRunTime, 10);
      }
      setRunTime(storedRunTime);
    }
  }, []);
  
  const handleRunTimeChange = (event) => {
    const runTime = parseInt(event.target.value, 10);
    setRunTime(runTime);
    localStorage.setItem(STORE_RUNTIME, runTime);
  };

  const handleStart = async () => {
    try {
      await waterPumpCtx.API.start(runTime);
      NotificationsSystem.alert('Water pump started successfully!');
    } catch (error) {
      NotificationsSystem.alert('Error starting water pump: ' + error.message);
    }
  };

  const handleStop = async () => {
    try {
      await waterPumpCtx.API.stop();
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
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            Run Time (ms):
          </Form.Label>
          <Col sm="10">
            <Form.Control type="number" value={runTime} onChange={handleRunTimeChange} />
          </Col>
        </Form.Group>
        <Button variant="primary" onClick={handleStart}>Start</Button>{' '}
        <Button variant="secondary" onClick={handleStop}>Stop</Button>
      </Form>
    </Container>
  );
}

export default App;
