import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  value: [],
}

export const tomorrowSlice = createSlice({
  name: 'tomorrowTask',
  initialState,
  reducers: {
    setTomorrowTasks: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    setTomorrowTasksForDnd: (state, action) => {
      state.value = action.payload
    },
    removeTomorowTasks: (state, action) => {
      state.value = state.value.filter(task => task.id !== action.payload);
    },
    toggleTomorrowFinished: (state, action) => {
      const task = state.value.find(task => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    },
  }
});

export const { setTomorrowTasks, setTomorrowTasksForDnd, removeTomorowTasks, toggleTomorrowFinished } = tomorrowSlice.actions;
export default tomorrowSlice.reducer;
