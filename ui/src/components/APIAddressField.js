import React from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import { connect } from 'react-redux';
import { updateAPIHost } from '../store/slices/UI';

export function APIAddressFieldComponent({ apiHost, onChange }) {
  const handleApiAddressChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm="2">
        API Address:
      </Form.Label>
      <Col sm="10">
        <Form.Control
          type="text" placeholder="Enter API Address"
          value={apiHost}
          onChange={handleApiAddressChange}
        />
      </Col>
    </Form.Group>
  );
}

export default connect(
  (state) => ({
    apiHost: state.UI.apiHost
  }), {
    onChange: updateAPIHost
  }
)(APIAddressFieldComponent);