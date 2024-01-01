import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { CWaterPumpAPI } from './api/CWaterPumpAPI.js';
import './App.css';

const STORE_API = 'apiAddress';
const STORE_RUNTIME = 'runTime';

function App() {
  const [apiAddress, setApiAddress] = useState('');
  const [runTime, setRunTime] = useState(1000);
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

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
      setAlertMessage('Water pump started successfully!');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error starting water pump: ' + error.message);
      setShowAlert(true);
    }
  };

  const handleStop = async () => {
    try {
      await waterPumpAPI.stop();
      setAlertMessage('Water pump stopped successfully!');
      setShowAlert(true);
    } catch (error) {
      setAlertMessage('Error stopping water pump: ' + error.message);
      setShowAlert(true);
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
      {showAlert && <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>}
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
