import React from 'react';
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';

// time elapsed since last update
function TimeElapsedComponent({ updated }) {
  const [diffString, setDiffString] = React.useState('');  
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now - updated;
      const newDiffString = new Date(diff).toISOString().substr(11, 8);
      setDiffString(newDiffString);
    }, 1000);

    return () => clearInterval(interval);
  }, [updated]);

  return (
    <span>{diffString}</span>
  );
}

function _systemStatus(status) {  
  if (null === status) {
    return (<b>Not connected</b>);
  }
  
  const pump = status.pump;
  return (
    <>
      <strong>Time since last update:</strong>{' '}
        <TimeElapsedComponent updated={status.updated} />
      <br />
      <strong>Pump Running:</strong> {pump.running ? "Yes" : "No"}<br />
      <strong>Time Left:</strong> {pump.timeLeft} ms
    </>
  );
}

export function SystemStatusAreaComponent({ status }) {
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

export default connect(
  state => ({
    status: state.systemStatus
  }), []
)(SystemStatusAreaComponent);