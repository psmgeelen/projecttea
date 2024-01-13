import React from "react";
import { connect } from "react-redux";
import TimerArea from "./TimerArea";

export function CurrentOperationInfoAreaComponent({
  isRunning, estimatedEndTime
}) {
  estimatedEndTime = isRunning ? estimatedEndTime : null;
  return (
    <div className="countdown-area">
      <TimerArea startTime={null} endTime={estimatedEndTime} />
    </div>
  );
}

export default connect(
  state => ({
    isRunning: state.systemStatus.pump.running,
    estimatedEndTime: state.systemStatus.pump.estimatedEndTime,
  }),
  []
)(CurrentOperationInfoAreaComponent);