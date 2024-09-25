import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/todayTasks'; 
import weekreducer from './slices/weekSlice'
import tomorrowReducer from './slices/tomorrowSlice'
import anyTaskReducer from './slices/tasksSlice'
import assignedTaskReducer from './slices/assignedSlice'
import projectReducer from './slices/projectSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    anytask:anyTaskReducer,
    task: taskReducer,
    weektask: weekreducer,
    tomorrowtask: tomorrowReducer,
    assignedTask: assignedTaskReducer,
    project: projectReducer
  },
});
