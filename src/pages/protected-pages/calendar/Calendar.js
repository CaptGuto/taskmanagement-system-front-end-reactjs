import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

function Calendar() {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <div>
      <h3>Select a Date and Time:</h3>
      <DatePicker
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)} // Keep the date object as-is
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={60} // Time intervals in minutes
        minDate={new Date()} 
        timeCaption="Time"
        dateFormat="MMMM d, yyyy h:mm aa" // Format for date and time
        customInput={<FaCalendarAlt />}
      />
      {selectedDate instanceof Date && !isNaN(selectedDate) ? (
        <h1>{selectedDate.toString()}, {selectedDate.toLocaleTimeString()}</h1> // Convert to string only for display
      ) : (
        <h1>No date selected</h1>
      )}
    </div>
  );
}

export default Calendar;
