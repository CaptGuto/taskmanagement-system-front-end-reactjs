import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const Layout = () => {
  return (
    <div className="flex m-2 gap-1 lg:m-3">
      <Sidebar />
      <div className='flex-1'>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
