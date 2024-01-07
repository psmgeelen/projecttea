import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';

import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';
import { useNotificationsSystem } from '../contexts/NotificationsContext.js';
import { startPump, stopPump } from '../store/slices/SystemStatus.js';

export function SystemControlsComponent({
  pouringTime, systemStatus, startPump, stopPump
}) {
  const api = useWaterPumpAPI().API;
  const NotificationsSystem = useNotificationsSystem();

  const handleStart = async () => {
    try {
      await startPump({ api , pouringTime });
    } catch (error) {
      NotificationsSystem.alert('Error starting water pump: ' + error.message);
    }
  };

  const handleStop = async () => {
    try {
      await stopPump({ api });
    } catch (error) {
      NotificationsSystem.alert('Error stopping water pump: ' + error.message);
    }
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