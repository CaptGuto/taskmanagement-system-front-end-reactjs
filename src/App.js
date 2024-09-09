import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './pages/ProtectedRoute';

//pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterPage from './pages/Register';
import Layout from './pages/Layout';
import Home from './pages/protected-pages/Home'
import Todays from './pages/protected-pages/Todays';
import Assigned from './pages/protected-pages/Assigned';
import Projects from './pages/protected-pages/Projects';
import Settings from './pages/protected-pages/Settings';
import Team from './pages/protected-pages/Team';
import Upcoming from './pages/protected-pages/Upcoming';
import TasksPage from './pages/protected-pages/TasksPage';
import CalendarLayout from './components/CalendarLayout';
import TodayCalendar from './pages/protected-pages/calendar/TodayCalendar';
import WeekCalendar from './pages/protected-pages/calendar/WeekCalendar';
import MonthCalendar from './pages/protected-pages/calendar/MonthCalendar';



const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    <Route path='/' element={<Landing />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<RegisterPage />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="/home" element={<Home />} />
      <Route path="/today" element={<Todays />} />
      <Route path="/calendar" element={<CalendarLayout />}>
        <Route path='today' element={<TodayCalendar />} />
        <Route path='week' element={<WeekCalendar />} />
        <Route path='month' element={<MonthCalendar />} />
      </Route>
      <Route path="/assigned" element={<Assigned />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/team" element={<Team />} />
      <Route path="/upcoming" element={<Upcoming />} />
      <Route path='/task' element={<TasksPage />} />
    </Route>
  </Route>
))



function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;