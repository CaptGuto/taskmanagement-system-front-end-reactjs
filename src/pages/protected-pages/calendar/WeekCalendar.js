import React from 'react'
import { useSelector } from 'react-redux'
import { format, addDays } from 'date-fns';

const WeekRow = ({ day, rowTasks }) => (
  <div className="flex items-center p-3 border-b border-solid">
    <div className={`text-xl ${rowTasks && rowTasks.length > 0 ? 'font-semibold' : 'font-light'} p-2}`}> {day} </div>
    <div className="flex flex-1 gap-2 pl-3">
      {rowTasks.map(task => <div key={task.id} className="bg-purple-500 px-3 py-1 lg:py-[6px] rounded flex-grow text-gray-100 font-lg font-semibold">{task.content}</div>)}
    </div>
  </div>
);         

function WeekCalendar() {
  const weekTask = useSelector((state) => state.weektask.value)
  console.log(weekTask);
  

  const weeks = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      dayName: format(date, 'EEEE')
    };
  });
  return (
    <div>
      {
        weeks.map(day => (
          <WeekRow key={day} day={day.dayName} rowTasks={weekTask.filter(task => 
             format(task.due_date,'EEEE') === day.dayName)}/>
        ))}
    </div>
  )
}

export default WeekCalendar
