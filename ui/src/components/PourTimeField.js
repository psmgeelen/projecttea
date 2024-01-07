import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updatePouringTime } from '../store/slices/UI';

export function PourTimeFieldComponent({ onChange, min, max, value }) {
  const handleChange = (event) => {
    let newTime = parseInt(event.target.value, 10);
    if (isNaN(newTime)) return;
    if (newTime < min) newTime = min;
    if (max < newTime) newTime = max;

    onChange(newTime);
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm="2">
        Run Time (ms):
      </Form.Label>
      <Col sm="10">
      <Form.Control type="number" value={value} onChange={handleChange} />
      </Col>
    </Form.Group>
  );
}

export default connect(
  state => ({
    min: 100,
    max: state.systemStatus?.waterThreshold,
    value: state.UI.pouringTime,
  }), {
    onChange: updatePouringTime,
  }
)(PourTimeFieldComponent);