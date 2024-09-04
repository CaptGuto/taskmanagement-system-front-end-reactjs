import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import EditTeam from "./Modals/EditTeam";
//icons
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { IoTodayOutline } from "react-icons/io5";
import { FaRegCalendarAlt, FaBars } from "react-icons/fa";
import { FaPerson, FaPlus } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { PiSignOut } from "react-icons/pi";

function Sidebar() {
  const [showModalPopup, setShowModalPopup] = useState(false);
  const [openParent3, setOpenParent3] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function handleToggleModalPopup() {
    setShowModalPopup(!showModalPopup);
  }

  function onClose() {
    setShowModalPopup(false);
  }

  function toggleSidebar() {
    setIsSidebarOpen(!isSidebarOpen);
  }

  return (
    <div className="relative p-1">
      <button
        onClick={toggleSidebar}
        className={`p-1 sm:p-2 md:hidden block ${isSidebarOpen ? "hidden" : "block"}`}
      >
        <FaBars className="text-[18] sm:text-[20]" />
      </button>
      <div
        className={`fixed top-0 left-0 w-full max-w-56 lg:min-w-60 bg-[#f4f4f4] rounded-3xl text-black min-h-screen transition-transform duration-100 transform overflow-y-auto ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:block flex flex-col justify-between z-50`}
      >
        {/* Top Section */}
        <div className="flex flex-col flex-grow">
          <div className="flex items-center justify-between p-5">
            <Link to={"/home"} className="text-lg md:text-xl font-semibold">
              Menu
            </Link>
            <button onClick={toggleSidebar} className="md:hidden">
              <FaBars size={24} />
            </button>
          </div>

          <div className="shadow-md mb-1 p-2">
            <button className="w-full px-4 py-2 text-left text-base font-semibold">
              Tasks
            </button>
            <div className="pl-6 flex flex-col pr-2">
              <NavLink
                to={"/upcoming"}
                className="flex items-center hover:bg-gray-300 rounded-md px-1"
              >
                <MdKeyboardDoubleArrowRight />
                <div className="w-full px-2 py-1 text-left text-sm">
                  Upcoming
                </div>
                <span className="bg-white rounded-full px-1 text-xs">6</span>
              </NavLink>

              <NavLink
                to={"/today"}
                className="flex items-center hover:bg-gray-300 rounded-md px-1"
              >
                <IoTodayOutline className="text-sm" />
                <div className="w-full px-2 py-1 text-left text-sm">Today</div>
                <span className="bg-white rounded-full px-1 text-xs">6</span>
              </NavLink>

              <NavLink
                to={"/calendar"}
                className="flex items-center hover:bg-gray-300 rounded-md px-1"
              >
                <FaRegCalendarAlt className="text-sm" />
                <div className="w-full px-2 py-1 text-left text-sm">
                  Calendar
                </div>
              </NavLink>
            </div>
          </div>

          <div className="shadow-md mb-1 p-2">
            <button className="w-full px-4 py-2 text-left font-semibold text-base">
              Workspace
            </button>
            <div className="pl-6 flex flex-col">
              <NavLink
                to={"/assigned"}
                className="flex items-center hover:bg-gray-300 rounded-md px-1"
              >
                <FaPerson className="text-sm" />
                <div className="w-full px-2 py-1 text-left text-sm">
                  Assigned to you
                </div>
                <span className="bg-white rounded-full px-1 text-xs">7</span>
              </NavLink>
              <NavLink
                to={"/projects"}
                className="flex items-center hover:bg-gray-300 rounded-md px-1"
              >
                <FaTasks className="text-sm" />
                <div className="w-full px-2 py-1 text-left text-sm">
                  Projects
                </div>
                <span className="bg-white rounded-full px-1 text-xs">3</span>
              </NavLink>
            </div>
          </div>

          <div className="p-2">
            <button
              onClick={() => setOpenParent3(!openParent3)}
              className="w-11/12 rounded-md mx-1 px-4 py-1 text-left hover:bg-gray-300 font-semibold text-base"
            >
              Team
            </button>
            {openParent3 && (
              <div className="pl-6 flex flex-col">
                <button
                  onClick={handleToggleModalPopup}
                  className="w-full px-4 py-1 text-left hover:bg-gray-300 rounded-md text-sm flex items-center gap-2"
                >
                  <FaPlus className="text-sm" />
                  Add Team
                </button>
              </div>
            )}
          </div>
          {showModalPopup && <EditTeam onClose={onClose} />}
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col mt-auto">
          <NavLink
            to={"/settings"}
            className="flex items-center hover:bg-gray-300 rounded-md px-4"
          >
            <IoSettingsOutline className="text-sm" />
            <div className="w-full px-2 py-1 text-left text-sm">Settings</div>
          </NavLink>
          <button className="w-full px-4 py-1 text-left hover:bg-gray-300 rounded-md text-sm flex items-center gap-2">
            <PiSignOut className="text-sm" /> Sign out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
