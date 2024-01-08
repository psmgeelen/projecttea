import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks
export const startPump = createAsyncThunk(
  'systemStatus/startPump',
  async ({ api, pouringTime }, { dispatch }) => {
    const response = await api.start(pouringTime);
    return response;
  }
);

export const stopPump = createAsyncThunk(
  'systemStatus/stopPump',
  async ({ api }, { dispatch }) => {
    const response = await api.stop();
    return response;
  }
);

// slice for system status
const bindStatus = (state, action) => {
  return action.payload;
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