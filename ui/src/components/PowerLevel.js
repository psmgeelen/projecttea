import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import Slider from 'react-input-slider';
import { connect } from 'react-redux';
import { updatePowerLevel } from '../store/slices/UI';

const SLIDER_STYLE = {
  track: {
    width: '100%',
    height: '3rem',
    backgroundColor: 'none',
    backgroundImage: `url(gauge.png)`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    border: '1px solid blue',
  },
  active: {
    backgroundColor: 'silver',
    opacity: 0.3,
  },
  thumb: {
    height: '2.5rem',
    width: 3,
    borderRadius: 0,
    backgroundColor: '#000',
    cursor: 'pointer',
    boxSizing: 'border-box'
  }
};

function PowerLevel({ powerLevel, onChange }) {
  return (
    <Form.Group as={Row} className="mb-3">
      <Form.Label column sm="2">
        Power Level:
      </Form.Label>
      <Col sm="10">
        <Slider
          axis="x" xstep={1} xmin={0} xmax={100 - 1} xreverse
          x={100 - powerLevel}
          onChange={({ x }) => onChange(100 - x)}
          styles={SLIDER_STYLE}
        />
        <div className="text-center">
          {powerLevel + '%' }
        </div>
      </Col>
    </Form.Group>
  );
}

export default connect(
  (state) => ({
    powerLevel: state.UI.powerLevelInPercents,
  }),
  { onChange: updatePowerLevel }
)(PowerLevel);