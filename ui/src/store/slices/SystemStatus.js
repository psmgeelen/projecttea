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

// slice for system status
export const SystemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState: null,
  reducers: {
    updateSystemStatus(state, action) {
      return preprocessSystemStatus(action.payload);
    },
  },
});

export const actions = SystemStatusSlice.actions;
export const { updateSystemStatus } = actions;