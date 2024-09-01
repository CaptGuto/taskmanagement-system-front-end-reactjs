import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './pages/ProtectedRoute';

//pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import RegisterPage from './pages/Register';
import Layout from './pages/Layout';
import Home from './pages/protected-pages/Home'
import Todays from './pages/protected-pages/Todays'
import Calendar from './pages/protected-pages/Calendar'
import Assigned from './pages/protected-pages/Assigned';
import Projects from './pages/protected-pages/Projects';
import Settings from './pages/protected-pages/Settings';
import Team from './pages/protected-pages/Team';
import Upcoming from './pages/protected-pages/Upcoming';



const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    <Route path='/' element={<Landing />} />
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<RegisterPage />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="/home" element={<Home />} />
      <Route path="/today" element={<Todays />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/assigned" element={<Assigned />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/team" element={<Team />} />
      <Route path="/upcoming" element={<Upcoming />} />
    </Route>
  </Route>
))



function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
