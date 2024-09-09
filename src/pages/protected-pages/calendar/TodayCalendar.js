import React from 'react'
import { useSelector } from 'react-redux';

const HourRow = ({ hour, rowTasks }) => (
  <div className="flex items-center p-3 border-b border-solid">
    <div className={`text-xl ${rowTasks && rowTasks.length > 0 ? 'font-bold' : 'font-light'} p-2}`}>{hour}:00</div>
    <div className="flex flex-1 gap-2 pl-3">
      {rowTasks.map(task => <div key={task.id} className="bg-purple-500 px-3 py-1 lg:py-[6px] rounded flex-grow text-gray-100 font-lg font-semibold">{task.content}</div>)}
    </div>
  </div>
);

function TodayCalendar() {
  const tasks = useSelector((state) => state.task.value);

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));


  return (
    <div>
      {
        hours.map(hour => (
          <HourRow key={hour} hour={hour} rowTasks={
            tasks.filter(task => task.due_date.split(':')[0] === hour)
          } />
        ))}
    </div>
  )
}

export default TodayCalendar
