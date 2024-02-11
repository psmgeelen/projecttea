import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationsSystemActions } from './Notifications';

// Async thunks
export const updateSystemStatus = createAsyncThunk(
  'systemStatus/update',
  async ({ action, failMessage }, { dispatch }) => {
    try {
      return await action();
    } catch(error) {
      await dispatch(NotificationsSystemActions.alert({
        type: 'error',
        message: `${failMessage} (${error.message})`
      }));
      throw error;
    }
  }
);    

export const SystemStatusSlice = createSlice({
  name: 'systemStatus',
  initialState: null,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateSystemStatus.fulfilled, (state, action) => action.payload);
    builder.addCase(updateSystemStatus.rejected, (state, action) => state);
  }
});

export const actions = SystemStatusSlice.actions;