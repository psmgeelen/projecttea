import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container } from 'react-bootstrap';
import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';
import { startPump, stopPump } from '../store/slices/SystemStatus.js';

export function HoldToPourComponent({ startPump, stopPump }) {
  const pouringTime = 1500;
  const api = useWaterPumpAPI().API;
  const [isPouring, setIsPouring] = useState(false);

  useEffect(() => {
    if (!isPouring) return;

    const tid = setInterval(() => {
      startPump({ api, pouringTime });
    }, pouringTime - 500);

    return () => {
      clearInterval(tid);
      stopPump({ api });
    };
  }, [isPouring, api, startPump, stopPump]);

  const handlePress = () => { setIsPouring(true); };
  const handleRelease = () => { setIsPouring(false); };

  return (
    <Container className="d-flex justify-content-center mt-3">
      <img src="valve.png" className='hold-to-pour-image' alt="Hold to pour button" 
        draggable="false" onMouseDown={handlePress} onMouseUp={handleRelease}
      />
    </Container>
  );
}

export default connect(
  state => ({}),
  { startPump, stopPump }
)(HoldToPourComponent);