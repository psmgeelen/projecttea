import React from 'react';
import { connect } from 'react-redux';
import { Button, Container } from 'react-bootstrap';

import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';

export function SystemControlsComponent({ systemStatus }) {
  const { API } = useWaterPumpAPI();
  const handleStart = async () => { await API.startPump(); };
  const handleStop = async () => { await API.stopPump(); };

  const isRunning = systemStatus.pump.running;
  return (
    <Container className="d-flex justify-content-center">
      <Button variant="primary" onClick={handleStart} disabled={isRunning} size="lg">
        Start
      </Button>
      <Button variant="secondary" onClick={handleStop} disabled={!isRunning} className='ms-5' size="lg">
        Stop
      </Button>
    </Container>
  );
}

export default connect(
  state => ({
    systemStatus: state.systemStatus,
  }), { }
)(SystemControlsComponent);