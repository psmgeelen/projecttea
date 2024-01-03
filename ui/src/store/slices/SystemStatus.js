import { createSlice } from '@reduxjs/toolkit';

// TODO: Replace this with a real system status
//       replace "water threshold" with "waterThreshold"
//       replace "time left" with "timeLeft"
//       add field "updated"
const systemStatus = {
  waterThreshold: 1234,
  pump: {
    running: false,
    timeLeft: 0,
  },
  updated: new Date(),
};
// NOTE: SystemStatusSlice can't store unseralizable data, such as Date objects!

// slice for system status
export const SystemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState: systemStatus,
  reducers: {
    updateSystemStatus(state, action) {
      return action.payload;
    },
  },
});

export const actions = SystemStatusSlice.actions;
export const { updateSystemStatus } = actions;