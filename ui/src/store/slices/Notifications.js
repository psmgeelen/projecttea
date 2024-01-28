import { createSlice } from '@reduxjs/toolkit';

export const NotificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    currentNotifications: null
  },
  reducers: {
    alert: (state, action) => {
      const { message, ...rest } = action.payload;
      // prepend HH:MM:SS to message
      const now = new Date();
      const time = now.toTimeString().split(' ')[0];
      state.currentNotifications = {
        message: `[${time}] ${message}`,
        ...rest
      };
    },
    clear: state => {
      state.currentNotifications = null;
    }
  }
});

export const NotificationsSystemActions = NotificationsSlice.actions;