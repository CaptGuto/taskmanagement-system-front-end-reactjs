import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  return (
    <div className="flex m-1 gap-1">
      <Sidebar />
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
