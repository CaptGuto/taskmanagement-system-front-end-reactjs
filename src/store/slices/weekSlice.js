import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  value: [],
}

export const weekSlice = createSlice({
  name: 'weekTask',
  initialState,
  reducers: {
    setWeekTasks: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    setWeekTasksForDnd: (state, action) => {
      state.value = action.payload
    },
    removeWeekTasks: (state, action) => {
      state.value = state.value.filter(task => task.id !== action.payload);
    },
    toggleWeekFinished: (state, action) => {
      const task = state.value.find(task => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    }
  }
});

export const { setWeekTasks, setWeekTasksForDnd, removeWeekTasks, toggleWeekFinished } = weekSlice.actions;
export default weekSlice.reducer;
