import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  value: [],
}

export const taskAnySlice = createSlice({
  name: 'AnyTask',
  initialState,
  reducers: {
    setAnyTasks: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    setAnyTasksForDnd: (state, action) => {
      state.value = action.payload
    },
    removeAnyTasks: (state, action) => {
      state.value = state.value.filter(task => task.id !== action.payload);
    },
    toggleAnyFinished: (state, action) => {
      const task = state.value.find(task => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    }
  }
});

export const { setAnyTasks, removeAnyTasks, toggleAnyFinished, setAnyTasksForDnd } = taskAnySlice.actions;
export default taskAnySlice.reducer;
