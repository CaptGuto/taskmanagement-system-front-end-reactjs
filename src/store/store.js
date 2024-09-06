import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/todayTasks'; 
import weekreducer from './slices/weekSlice'
import tomorrowReducer from './slices/tomorrowSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    weektask: weekreducer,
    tomorrowtask: tomorrowReducer,
  },
});
