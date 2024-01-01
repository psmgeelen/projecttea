import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';

function APIAddressField() {
  const waterPumpCtx = useWaterPumpAPI();

  const handleApiAddressChange = (event) => {
    const apiAddress = event.target.value;
    waterPumpCtx.bindApiHost(apiAddress);
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm="2">
        API Address:
      </Form.Label>
      <Col sm="10">
        <Form.Control type="text" value={waterPumpCtx.apiHost} onChange={handleApiAddressChange} />
      </Col>
    </Form.Group>
  );
}

export default APIAddressField;