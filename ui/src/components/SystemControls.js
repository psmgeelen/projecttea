import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';
import { startPump, stopPump } from '../store/slices/SystemStatus.js';

export function SystemControlsComponent({
  pouringTime, systemStatus, startPump, stopPump
}) {
  const api = useWaterPumpAPI().API;
  const handleStart = async () => {
    await startPump({ api , pouringTime });
  };

  const handleStop = async () => {
    await stopPump({ api });
  };

  const isRunning = systemStatus.pump.running;
  return (
    <>
      <Button variant="primary" onClick={handleStart} disabled={isRunning}>
        Start
      </Button>{' '}
      <Button variant="secondary" onClick={handleStop} disabled={!isRunning}>
        Stop
      </Button>
    </>
  );
}

export default connect(
  state => ({
    pouringTime: state.UI.pouringTime,
    systemStatus: state.systemStatus,
  }), { startPump, stopPump }
)(SystemControlsComponent);