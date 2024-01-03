import { createSlice } from '@reduxjs/toolkit';

function preprocessSystemStatus(systemStatus) {
  if(null == systemStatus) return null;
  // convert "water threshold" to "waterThreshold"
  systemStatus.waterThreshold = systemStatus["water threshold"];
  delete systemStatus["water threshold"];

  // convert "time left" to "timeLeft"
  systemStatus.pump.timeLeft = systemStatus.pump["time left"];
  delete systemStatus.pump["time left"];

  // add field "updated"
  systemStatus.updated = Date.now();
  return systemStatus;
}
// TODO: Replace this with a real system status
const systemStatus = preprocessSystemStatus({
  "water threshold": 1234,
  "pump": {
    "running": false,
    "time left": 0
  }
});

// slice for system status
export const SystemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState: systemStatus,
  reducers: {
    updateSystemStatus(state, action) {
      return preprocessSystemStatus(action.payload);
    },
  },
});

export const actions = SystemStatusSlice.actions;
export const { updateSystemStatus } = actions;