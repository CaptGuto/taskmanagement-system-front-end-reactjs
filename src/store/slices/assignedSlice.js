import { createSlice } from "@reduxjs/toolkit";



const initialState = {
  value: [],
}

export const taskAssignedSlice = createSlice({
  name: 'assignedTask',
  initialState,
  reducers: {
    setAssignedTasks: (state, action) => {
      state.value = [...state.value, action.payload];
    },
    setAssignedTasksForDnd: (state, action) => {
      state.value = action.payload
    },
    removeAssignedTasks: (state, action) => {
      state.value = state.value.filter(task => task.id !== action.payload);
    },
    toggleAssignedFinished: (state, action) => {
      const task = state.value.find(task => task.id === action.payload);
      if (task) {
        task.checked = !task.checked;
      }
    }
  }
});

export const { setAssignedTasks, setAssignedTasksForDnd, removeAssignedTasks, toggleAssignedFinished } = taskAssignedSlice.actions;
export default taskAssignedSlice.reducer;
