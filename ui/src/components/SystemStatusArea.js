import React from 'react';
import { Card } from 'react-bootstrap';

// TODO: Update time since last update every second,
//       currently it only updates when the status changes
function _systemStatus(status) {
  if (null === status) {
    return (<b>Not connected</b>);
  }

  const pump = status.pump;
  // TODO: check is this is a valid way to get the time since last update
  const now = new Date();
  const diff = now - status.updated;
  const diffString = new Date(diff).toISOString().substr(11, 8);
  return (
    <>
      <strong>Time since last update:</strong> {diffString}<br />
      <strong>Pump Running:</strong> {pump.running ? "Yes" : "No"}<br />
      <strong>Time Left:</strong> {pump.timeLeft} ms
    </>
  );
}

function SystemStatusArea({ status }) {
  return (
    <Card>
      <Card.Body>
        <Card.Title>System Status</Card.Title>
        <Card.Text>
          {_systemStatus(status)}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default SystemStatusArea;