import { createSlice } from '@reduxjs/toolkit';

export const NotificationsSlice = createSlice({
  name: 'notifications',
  initialState: {
    currentNotifications: null
  },
  reducers: {
    alert: (state, action) => {
      state.currentNotifications = action.payload;
    },
    clear: state => {
      state.currentNotifications = null;
    }
  }
});

export const NotificationsSystemActions = NotificationsSlice.actions;