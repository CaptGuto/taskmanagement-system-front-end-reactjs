import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function CalendarLayout() {
  return (
    <div className="m-2 border rounded-2xl border-gray-200 p-3">
      <nav>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 bg-slate-100 py-1 px-3 m-2 border border-gray-200 rounded-md"
              : "text-gray-600 bg-slate-100 py-1 px-3 m-2 border border-gray-200 rounded-md"
          }
          to="/calendar/today"
        >
          Today
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 bg-slate-100 py-1 px-3 m-2 border border-gray-200 rounded-md"
              : "text-gray-600 bg-slate-100 py-1 px-3 m-2 border border-gray-200 rounded-md"
          }
          to="/calendar/week"
        >
          Week
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive
              ? "text-green-500 bg-slate-100 py-1 px-3 m-2 border border-gray-200 rounded-md"
              : "text-gray-600 bg-slate-100 py-1 px-3 m-2 border border-gray-200 rounded-md"
          }
          to="/calendar/month"
        >
          Month
        </NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default CalendarLayout;
