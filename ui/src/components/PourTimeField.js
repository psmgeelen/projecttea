import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const STORE_POURRTIME = 'pourTime';

function PourTimeField({ onChange, min, max }) {
  const [pourTime, setPourTime] = useState(1000);

  useEffect(() => {
    const time = localStorage.getItem(STORE_POURRTIME);
    if (time) setPourTime(parseInt(time, 10));
  }, []); // on mount
  // call onChange when pourTime changes
  useEffect(() => onChange(pourTime), [pourTime, onChange]);

  const handleChange = (event) => {
    let newTime = parseInt(event.target.value, 10);
    if (isNaN(newTime)) return;
    if (newTime < min) newTime = min;
    if (max < newTime) newTime = max;

    setPourTime(newTime);
    localStorage.setItem(STORE_POURRTIME, newTime);
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm="2">
        Run Time (ms):
      </Form.Label>
      <Col sm="10">
        <Form.Control type="number" value={pourTime} onChange={handleChange} />
      </Col>
    </Form.Group>
  );
}

export default PourTimeField;