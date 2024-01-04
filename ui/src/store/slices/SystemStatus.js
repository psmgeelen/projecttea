import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

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

// Async thunks
export const startPump = createAsyncThunk(
  'systemStatus/startPump',
  async ({ api, pouringTime }, { dispatch }) => {
    console.log('startPump: pouringTime = ' + pouringTime);
    const response = await api.start(pouringTime);
    return response;
  }
);

export const stopPump = createAsyncThunk(
  'systemStatus/stopPump',
  async ({ api }, { dispatch }) => {
    console.log('stopPump');
    const response = await api.stop();
    return response;
  }
);

// slice for system status
const bindStatus = (state, action) => {
  return preprocessSystemStatus(action.payload);
};

export const SystemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState: null,
  reducers: {
    updateSystemStatus: bindStatus,
  },
  extraReducers: (builder) => {
    // update system status on start/stop pump
    builder.addCase(startPump.fulfilled, bindStatus);
    builder.addCase(stopPump.fulfilled, bindStatus);
    // on error, do not update system status
    builder.addCase(startPump.rejected, (state, action) => state);
    builder.addCase(stopPump.rejected, (state, action) => state);
  }
});

export const actions = SystemStatusSlice.actions;
export const { updateSystemStatus } = actions;