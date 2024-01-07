import { createSlice } from '@reduxjs/toolkit';

const INITIAL_STATE = {
  pouringTime: 1000,
  apiHost: '',
};
// slice for system status
export const UISlice = createSlice({
  name: 'UI',
  initialState: INITIAL_STATE,
  reducers: {
    updatePouringTime(state, action) {
      state.pouringTime = action.payload;
    },
    updateAPIHost(state, action) {
      state.apiHost = action.payload;
    },
  },
});

export const actions = UISlice.actions;
export const { updatePouringTime, updateAPIHost } = actions;