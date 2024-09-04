import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/todayTasks'; 

export const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
  },
});
