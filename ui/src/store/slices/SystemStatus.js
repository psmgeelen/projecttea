import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationsSystemActions } from './Notifications';

function withNotification(action, message) {
  return async (params, { dispatch }) => {
    try {
      return await action(params);
    } catch(error) {
      dispatch(NotificationsSystemActions.alert({
        type: 'error',
        message: `${message} (${error.message})`
      }));
      throw error;
    }
  };
}

// Async thunks
export const startPump = createAsyncThunk(
  'systemStatus/startPump',
  withNotification(
    async ({ api, pouringTime }) => {
      return await api.start(pouringTime);
    },
    'Failed to start pump'
  )
);

export const stopPump = createAsyncThunk(
  'systemStatus/stopPump',
  withNotification(
    async ({ api }) => {
      return await api.stop();
    },
    'Failed to stop pump'
  )
);

export const updateSystemStatus = createAsyncThunk(
  'systemStatus/update',
  withNotification(
    async ( api ) => {
      return await api.status();
    },
    'Failed to update system status'
  )
);

// slice for system status
const bindStatus = (state, action) => {
  return action.payload;
};

export const SystemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    // update system status on start/stop pump
    builder.addCase(startPump.fulfilled, bindStatus);
    builder.addCase(stopPump.fulfilled, bindStatus);
    builder.addCase(updateSystemStatus.fulfilled, bindStatus);
    // on error, do not update system status
    builder.addCase(startPump.rejected, (state, action) => state);
    builder.addCase(stopPump.rejected, (state, action) => state);
    builder.addCase(updateSystemStatus.rejected, (state, action) => {
      return null;
    });
  }
});

export const actions = SystemStatusSlice.actions;