import React, { useState, useEffect } from 'react';
import './App.css';
import { CWaterPumpAPI } from './api/CWaterPumpAPI.js';

const STORE_API = 'apiAddress';
const STORE_RUNTIME = 'runTime';

function App() {
  const [apiAddress, setApiAddress] = useState('');
  const [runTime, setRunTime] = useState(1000);

  useEffect(() => {
    const storedApiAddress = localStorage.getItem(STORE_API);
    if (storedApiAddress) setApiAddress(storedApiAddress);

    let storedRunTime = localStorage.getItem(STORE_RUNTIME);
    if (storedRunTime) {
      // if string then convert to int
      if (typeof storedRunTime === 'string') {
        storedRunTime = parseInt(storedRunTime, 10);
      }
      setRunTime(storedRunTime);
    }
  }, []); // on mount

  const waterPumpAPI = React.useMemo(
    () => {
      // ensure apiAddress is started with http:// or https://
      let url = apiAddress;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
      }
      return new CWaterPumpAPI({ URL: url });
    }, [apiAddress] // only re-create if apiAddress changes
  );

  const handleStart = async () => {
    try {
      await waterPumpAPI.start(runTime);
      alert('Water pump started successfully!');
    } catch (error) {
      alert('Error starting water pump: ' + error.message);
    }
  };

  const handleStop = async () => {
    try {
      await waterPumpAPI.stop();
      alert('Water pump stopped successfully!');
    } catch (error) {
      alert('Error stopping water pump: ' + error.message);
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
    <div className="App">
      <h1>Tea System UI</h1>
      <div>
        <label>
          API Address:
          <input type="text" value={apiAddress} onChange={handleApiAddressChange} />
        </label>
      </div>
      <div>
        <label>
          Run Time (ms):
          <input type="number" value={runTime} onChange={handleRunTimeChange} />
        </label>
      </div>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}

export default App;
