import React from 'react';
import { connect } from 'react-redux';
import { Button, Container } from 'react-bootstrap';

import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';
import { startPump, stopPump } from '../store/slices/SystemStatus.js';

export function SystemControlsComponent({
  pouringTime, powerLevel, systemStatus, startPump, stopPump
}) {
  const api = useWaterPumpAPI().API;
  const handleStart = async () => {
    await startPump({ api, pouringTime, powerLevel });
  };

  const handleStop = async () => {
    await stopPump({ api });
  };

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
    pouringTime: state.UI.pouringTime,
    powerLevel: state.UI.powerLevelInPercents,
    systemStatus: state.systemStatus,
  }), { startPump, stopPump }
)(SystemControlsComponent);