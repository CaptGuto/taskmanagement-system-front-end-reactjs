import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  value: [],
}

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setTasks: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    setTasksForDnd: (state, action) => {
      state.value = action.payload
    },
    removeTasks: (state, action) => {
      state.value = state.value.filter(task => task.id !== action.payload);
    },
    toggleFinished: (state, action) => {
      const task = state.value.find(task => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    }
  }
});

export const { setTasks, removeTasks, toggleFinished, setTasksForDnd } = taskSlice.actions;
export default taskSlice.reducer;
