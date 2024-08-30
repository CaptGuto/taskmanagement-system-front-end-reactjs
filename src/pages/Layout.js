import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  return (
    <div className="">
      <Sidebar />
      <div className="">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
