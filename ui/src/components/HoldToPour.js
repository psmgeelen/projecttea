import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Container, Form } from 'react-bootstrap';
import { useWaterPumpAPI } from '../contexts/WaterPumpAPIContext';
import { startPump, stopPump } from '../store/slices/SystemStatus.js';

export function HoldToPourComponent({ startPump, stopPump, interval }) {
  const [isPouring, setIsPouring] = useState(false);
  const [clickToPour, setClickToPour] = useState(false);
  // continuously pour water while the button is pressed
  const lastPouringTime = React.useRef(0);
  const onTick = React.useCallback(
    async () => {
      if(Date.now() < lastPouringTime.current) return;
      try {
        lastPouringTime.current = Number.MAX_SAFE_INTEGER; // prevent concurrent calls
        await startPump();
        lastPouringTime.current = Date.now() + interval;
      } catch(e) {
        lastPouringTime.current = 0; // run again on next tick
      }
    },
    [startPump, interval]
  );

  useEffect(() => {
    if(!isPouring) {
      lastPouringTime.current = 0;
      stopPump();
      return;
    }
    // tick every 100ms
    const tid = setInterval(onTick, 100);
    return async () => {
      clearInterval(tid);
      if(isPouring) await stopPump();
    };
  }, [onTick, isPouring, stopPump, lastPouringTime]);

  const handlePress = () => { setIsPouring(true); };
  const handleRelease = () => { setIsPouring(false); };
  const handleCheckboxChange = e => { setClickToPour(e.target.checked); };
  const handleToggle = () => { setIsPouring(!isPouring); };
  // FIX: onMouseDown/onMouseUp is not working on mobile
  return (
    <Container className="d-flex flex-column align-items-center mt-3">
      <img src="valve.png" className='hold-to-pour-image' alt="Hold to pour button" 
        draggable="false"
        onMouseDown={clickToPour ? null : handlePress}
        onMouseUp={clickToPour ? null : handleRelease}
        onClick={clickToPour ? handleToggle : null}
      />

      <Form.Check
        type="checkbox"
        checked={clickToPour} onChange={handleCheckboxChange}
        label={
          <span style={{ color: 'red', fontSize: '1.5rem' }}>
            Click to pour (<b>dangerous</b>)
          </span>
        }
      />
    </Container>
  );
}

// Helper wrapper to simplify the code in the component
function HoldToPourComponent_withExtras({ pouringTime, startPump, stopPump }) {
  const api = useWaterPumpAPI().API;
  
  const _startPump = React.useCallback(
    async () => { await startPump({ api, pouringTime }); },
    [api, startPump, pouringTime]
  );
  const _stopPump = React.useCallback(
    async () => { await stopPump({ api }); },
    [api, stopPump]
  );
  // a bit smaller than the actual pouring time, to prevent the pump from stopping
  // which could damage the pump
  const interval = Math.max(Math.round(pouringTime - 500), 100);
  return (
    <HoldToPourComponent
      startPump={_startPump} stopPump={_stopPump}
      interval={interval}
    />
  );
};

export default connect(
  state => ({ pouringTime: state.UI.pouringTime }),
  { startPump, stopPump }
)(HoldToPourComponent_withExtras);