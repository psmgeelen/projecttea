import React from "react";
import { timeBetweenAsString } from "../Utils/time";

export function TimerArea({ startTime=null, endTime=null, interval=450 }) {
  const [countdown, setCountdown] = React.useState('');

  React.useEffect(() => {
    const tid = setInterval(() => {
      setCountdown(timeBetweenAsString({ startTime, endTime }));
    }, interval);

    return () => clearInterval(tid);
  }, [startTime, endTime, interval]);

  return (
    <span className="timer-area">
      {countdown}
    </span>
  );
}

export default TimerArea;