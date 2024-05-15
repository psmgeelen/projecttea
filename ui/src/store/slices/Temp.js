import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  lastOperationDuration: 0,
  prevTeaLevel: 0,
  startTeaLevel: 0,
  estimatedTeaLevel: 50,
}

export const TempSlice = createSlice({
  name: 'Temp',
  initialState: initialState,
  reducers: {
    changeLastOperationDuration: (state, action) => {
      state.lastOperationDuration = action.payload;
    },
    changeEstimatedTeaLevel: (state, action) => {
      state.estimatedTeaLevel = action.payload;
    },
    changePrevTeaLevel: (state, action) => {
      state.prevTeaLevel = action.payload;
    },
    pumpStartedEvent: (state, action) => {
      state.prevTeaLevel = state.startTeaLevel;
    },
    changeStartTeaLevel: (state, action) => {
      state.startTeaLevel = action.payload;
      state.estimatedTeaLevel = state.startTeaLevel;
      state.lastOperationDuration = 0;
    },
  }
});

export const actions = TempSlice.actions;
export const { 
  changeLastOperationDuration, 
  changeEstimatedTeaLevel, 
  changePrevTeaLevel, 
  pumpStartedEvent, 
  changeStartTeaLevel
} = actions;