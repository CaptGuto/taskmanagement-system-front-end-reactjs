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



const router = createBrowserRouter(createRoutesFromElements(
  <Route>
    <Route path='/' element={<Landing />} />
    <Route path='/login' element={<Login />}/>
    <Route path='/register' element={<RegisterPage />} />
    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
      <Route path="/home" element={<Home />} />
      <Route path="/today" element={<Todays />} />
      <Route path="/calendar" element={<Calendar />} />
    </Route>
  </Route>
))



function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
