import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { CWaterPumpAPI } from './api/CWaterPumpAPI.js';
import { useNotificationsSystem } from './contexts/NotificationsContext.js';
import './App.css';
import NotificationsArea from './components/NotificationsArea.js';

const STORE_API = 'apiAddress';
const STORE_RUNTIME = 'runTime';

function App() {
  const [apiAddress, setApiAddress] = useState('');
  const [runTime, setRunTime] = useState(1000);
  const NotificationsSystem = useNotificationsSystem();

  useEffect(() => {
    const storedApiAddress = localStorage.getItem(STORE_API);
    if (storedApiAddress) setApiAddress(storedApiAddress);

    let storedRunTime = localStorage.getItem(STORE_RUNTIME);
    if (storedRunTime) {
      if (typeof storedRunTime === 'string') {
        storedRunTime = parseInt(storedRunTime, 10);
      }
      setRunTime(storedRunTime);
    }
  }, []);

  const waterPumpAPI = React.useMemo(() => {
    let url = apiAddress;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'http://' + url;
    }
    return new CWaterPumpAPI({ URL: url });
  }, [apiAddress]);

  const handleStart = async () => {
    try {
      await waterPumpAPI.start(runTime);
      NotificationsSystem.alert('Water pump started successfully!');
    } catch (error) {
      NotificationsSystem.alert('Error starting water pump: ' + error.message);
    }
  };

  const handleStop = async () => {
    try {
      await waterPumpAPI.stop();
      NotificationsSystem.alert('Water pump stopped successfully!');
    } catch (error) {
      NotificationsSystem.alert('Error stopping water pump: ' + error.message);
    }
  };

  const handleRunTimeChange = (event) => {
    const runTime = parseInt(event.target.value, 10);
    setRunTime(runTime);
    localStorage.setItem(STORE_RUNTIME, runTime);
  };

  const handleApiAddressChange = (event) => {
    const apiAddress = event.target.value;
    setApiAddress(apiAddress);
    localStorage.setItem(STORE_API, apiAddress);
  };

  return (
    <Container className="App">
      <h1>Tea System UI</h1>
      <NotificationsArea />
      <Form>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2">
            API Address:
          </Form.Label>
          <Col sm="10">
            <Form.Control type="text" value={apiAddress} onChange={handleApiAddressChange} />
          </Col>
        </Form.Group>
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
