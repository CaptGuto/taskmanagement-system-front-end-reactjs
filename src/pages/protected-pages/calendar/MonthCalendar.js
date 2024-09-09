import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { format } from 'date-fns';

const MonthRow = ({ day, rowTasks }) => (
  <div className="flex items-center p-3 border-b border-solid">
    <div className={`text-xl ${rowTasks && rowTasks.length > 0 ? 'font-bold' : 'font-light'} p-2}`}>{day}</div>
    <div className="flex flex-1 gap-2 pl-3">
      {rowTasks.map(task => (
        <div key={task.id} className="bg-purple-500 px-3 py-1 lg:py-[6px] rounded flex-grow text-gray-100 font-lg font-semibold">
          {task.content}
        </div>
      ))}
    </div>
  </div>
);

function MonthCalendar() {
  const weekTask = useSelector((state) => state.weektask.value);
  const AnyTask = useSelector((state) => state.anytask.value);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    setTasks([...AnyTask, ...weekTask]);
  }, [weekTask, AnyTask]);

  const month = Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  return (
    <div>
      {month.map(day => (
        <MonthRow
          key={day}
          day={day}
          rowTasks={tasks.filter((task) => {
            const taskDate = new Date(task.due_date);
            const today = new Date();

            const isSameMonth = format(taskDate, 'MM') === format(today, 'MM');
            const isSameDay = format(taskDate, 'dd') === day;

            return isSameMonth && isSameDay;
          })}
        />
      ))}
    </div>
  );
}

export default MonthCalendar;
