import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useRef, useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { FaCalendarCheck, FaClock, FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import {
  removeTasks,
  setTasks,
  setTasksForDnd,
  toggleFinished,
} from "../../store/slices/todayTasks";
import {
  setTomorrowTasks,
  setTomorrowTasksForDnd,
  removeTomorowTasks,
  toggleTomorrowFinished,
} from "../../store/slices/tomorrowSlice";
import {
  setWeekTasks,
  setWeekTasksForDnd,
  removeWeekTasks,
  toggleWeekFinished,
} from "../../store/slices/weekSlice";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css'

const todayTaskSchema = z.object({
  todayTask: z.string().max(500, "Word limit").min(1, "*"),
});
const tomorrowTaskSchema = z.object({
  tomorrowTask: z.string().max(500, "word limit").min(1, "*"),
});
const weekTaskSchema = z.object({
  weekTask: z.string().max(500, "Word limit").min(1, "*"),
});

function Upcoming() {
  const {
    register: registerToday,
    handleSubmit: handleSubmitToday,
    formState: { errors: todayErrors, isSubmitting: isSubmittingToday },
    reset: resetToday,
  } = useForm({ resolver: zodResolver(todayTaskSchema) });
  const {
    register: registerTomorrow,
    handleSubmit: handleSubmitTomorrow,
    formState: { errors: tomorrowErrors, isSubmitting: isSubmittingTomorrow },
    reset: resetTomorrow,
  } = useForm({ resolver: zodResolver(tomorrowTaskSchema) });
  const {
    register: registerWeek,
    handleSubmit: handleSubmitWeek,
    formState: { errors: weekErrors, isSubmitting: isSubmittingWeek },
    reset: resetWeek,
  } = useForm({ resolver: zodResolver(weekTaskSchema) });

  const tasks = useSelector((state) => state.task.value);
  const tomorrowtasks = useSelector((state) => state.tomorrowtask.value);
  const weektasks = useSelector((state) => state.weektask.value);
  const dispatch = useDispatch();

  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  const [err, setErr] = useState('')
  const [errWeek, setErrWeek] = useState('')
  const [errTmr, setErrTmr] = useState('')
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className='flex items-center cursor-pointer py-1 px-2 border-r-2 border-y-2 border-gray-200 rounded-r-xl  bg-white'
    >
      <FaClock title="Select Time" className='text-xl text-gray-600 ' />
      <span style={{ marginLeft: '10px' }}>{value || "When"}</span>
    </div>
  ));

  const CustomInputW = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className='flex items-center cursor-pointer, py-1 px-2 border-r-2 border-y-2 border-gray-200 rounded-r-xl bg-white'
    >
      <FaCalendarCheck title="Select Time" className='text-xl text-gray-600' />
      <span className='ml-3'>{value || "when"}</span>
    </div>
  ));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(event.target)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function onSubmit(data) {
    try {
      if (!selectedTime) {
        throw new Error('Please select a starting time.');
      }
      else {
        const newTask = {
          id: `${Date.now()}`,
          content: data.todayTask,
          checked: false,
          due_date: selectedTime.toTimeString()
        };
        dispatch(setTasks(newTask));
        resetToday();
        setSelectedTime()
        setErr('')
      }

    } catch (error) {
      setErr(error.message)
    }
  }

  async function onSubmitTomorrow(data) {

    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const newTask = {
        id: `${Date.now()}`,
        content: data.tomorrowTask,
        checked: false,
        due_date: tomorrow.toDateString(),
      };
      dispatch(setTomorrowTasks(newTask));
      dispatch(setWeekTasks(newTask));
      resetTomorrow();
      setErr('')
    } catch (error) {
      setErrTmr(error.message)
    }
  }

  async function onSubmitWeek(data) {
    try {
      if (!selectedDate) {
        throw new Error('Please select a date.');
      } else {
        const newTask = {
          id: `${Date.now()}`,
          content: data.weekTask,
          checked: false,
          due_date: selectedDate.toDateString()
        };
        dispatch(setWeekTasks(newTask));
        resetWeek();
        setSelectedDate()
        setErrWeek('')
      }
    } catch (error) {
      setErrWeek(error.message)
    }
  }

  const onDragEnd = (result, section) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.index === source.index) return;

    const updatedTasks =
      section === "today"
        ? Array.from(tasks)
        : section === "tomorrow"
          ? Array.from(tomorrowtasks)
          : Array.from(weektasks);

    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, {
      ...movedTask,
      id: draggableId,
    });

    if (section === "today") {
      dispatch(setTasksForDnd(updatedTasks));
    } else if (section === "tomorrow") {
      dispatch(setTomorrowTasksForDnd(updatedTasks));
    } else {
      dispatch(setWeekTasksForDnd(updatedTasks));
    }
  };

  const handleContextMenu = (event, index, section) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      taskIndex: index,
      section,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (contextMenu && contextMenu.taskIndex !== undefined) {
      const section = contextMenu.section;
      const taskId =
        section === "today"
          ? tasks[contextMenu.taskIndex].id
          : section === "tomorrow"
            ? tomorrowtasks[contextMenu.taskIndex].id
            : weektasks[contextMenu.taskIndex].id;

      if (section === "today") {
        dispatch(removeTasks(taskId));
      } else if (section === "tomorrow") {
        dispatch(removeTomorowTasks(taskId));
      } else {
        dispatch(removeWeekTasks(taskId));
      }
    }
    handleClose();
  };

  const handleChecked = (index, section) => {
    if (section === "today") {
      dispatch(toggleFinished(tasks[index].id));
    } else if (section === "tomorrow") {
      dispatch(toggleTomorrowFinished(tomorrowtasks[index].id));
    } else {
      dispatch(toggleWeekFinished(weektasks[index].id));
    }
  };

  return (
    <div className="bg-[#fefefe] rounded-3xl text-black min-h-screen w-full flex flex-col gap-3 mt-3">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-semibold m-2 lg:m-4">
        Upcoming
      </h1>
      {/* Today's Tasks */}
      <div className="border border-gray-400 rounded-2xl pb-2 px-2 min-h-60 md:mb-10">
        <h1 className="text-base md:text-lg lg:text-2xl font-semibold m-5 lg:mx-10">
          Today
        </h1>
        <form
          className="flex mx-3 md:mx-10"
          onSubmit={handleSubmitToday(onSubmit)}
        >
          <button
            disabled={isSubmittingToday}
            className="border-l-2 border-y-2 border-gray-200 py-1 px-2 bg-white rounded-l-xl cursor-pointer"
            type="submit"
          >
            <div className="border rounded-full p-1 border-gray-400"><FaPlus className="text-sm" /></div>
          </button>
          <input
            autoComplete="off"
            className="w-full max-w-[700px] border-y-2 border-gray-200 py-1 px-2 focus:outline-none"
            {...registerToday("todayTask")}
            type="text"
            placeholder="Add new task"
            disabled={isSubmittingToday}
          />
          <DatePicker
            selected={selectedTime}
            onChange={(time) => setSelectedTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={30}
            timeFormat="HH:mm"
            dateFormat="HH:mm"
            customInput={<CustomInput />}
          />
        </form>
        {todayErrors.todayTask && (
          <p className="text-red-500 mx-10 mt-1 text-xs">
            {todayErrors.todayTask.message}
          </p>
        )}
        {err && <p className="text-red-500 mx-10 mt-1">{err}</p>}

        <DragDropContext onDragEnd={(result) => onDragEnd(result, "today")}>
          <Droppable droppableId="todayDroppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="mt-3"
              >
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <Draggable
                      key={task.id}
                      draggableId={task.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onContextMenu={(event) =>
                            handleContextMenu(event, index, "today")
                          }
                          className={`text-wrap overflow-auto shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center gap-3 max-w-3xl mb-2 ${snapshot.isDragging ? "bg-gray-50" : ""
                            }`}
                        >
                          {task.checked ? (
                            <ImCheckboxChecked
                              className="text-gray-800 bg-white text-lg"
                              onClick={() => handleChecked(index, "today")}
                            />
                          ) : (
                            <ImCheckboxUnchecked
                              className="text-gray-500 text-lg"
                              onClick={() => handleChecked(index, "today")}
                            />
                          )}
                          {task.content}
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <p className="px-6 md:px-12 text-base font-semibold">
                    No tasks added yet
                  </p>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Tomorrow and Week Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 min-h-52">
        {/* Tomorrow's Tasks */}
        <div className="w-full flex flex-col border border-gray-400 rounded-xl pb-2 px-1">
          <h1 className="text-base md:text-lg lg:text-2xl font-semibold m-5 lg:mx-10">
            Tomorrow
          </h1>
          <form
            className="flex mx-3 md:mx-10"
            onSubmit={handleSubmitTomorrow(onSubmitTomorrow)}
          >
            <button
              disabled={isSubmittingTomorrow}
              className="border-l-2 border-y-2 border-gray-200 py-1 px-2 bg-white rounded-l-xl cursor-pointer"
              type="submit"
            >
              <div className="border rounded-full p-1 border-gray-400"><FaPlus className="text-sm" /></div>
            </button>
            <input
              autoComplete="off"
              className="w-full max-w-[700px] border-r-2 border-y-2 border-gray-200 py-1 px-2 rounded-r-xl focus
              focus:outline-none"
              {...registerTomorrow("tomorrowTask")}
              type="text"
              placeholder="Add new task"
              disabled={isSubmittingTomorrow}
            />
          </form>
          {tomorrowErrors.tomorrowTask && (
            <p className="text-red-500 mx-10 mt-1 text-xs">
              {tomorrowErrors.tomorrowTask.message}
            </p>
          )}
          {errTmr && <p className="text-red-500 mx-10 mt-1">{errTmr}</p>}

          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, "tomorrow")}
          >
            <Droppable droppableId="tomorrowDroppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mt-3"
                >
                  {tomorrowtasks.length > 0 ? (
                    tomorrowtasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onContextMenu={(event) =>
                              handleContextMenu(event, index, "tomorrow")
                            }
                            className={`text-wrap overflow-x-auto shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center gap-3 max-w-3xl mb-2 ${snapshot.isDragging ? "bg-gray-50" : ""
                              }`}
                          >
                            {task.checked ? (
                              <ImCheckboxChecked
                                className="text-gray-800 bg-white text-lg"
                                onClick={() => handleChecked(index, "tomorrow")}
                              />
                            ) : (
                              <ImCheckboxUnchecked
                                className="text-gray-500 text-lg"
                                onClick={() => handleChecked(index, "tomorrow")}
                              />
                            )}
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="px-6 md:px-12 text-base font-semibold">
                      No tasks added yet
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        {/* Week's Tasks */}
        <div className="w-full flex flex-col border border-gray-400 rounded-2xl pb-2 px-1">
          <h1 className="text-base md:text-lg lg:text-2xl font-semibold m-5 lg:mx-10">
            Week
          </h1>
          <form
            className="flex mx-3 md:mx-10"
            onSubmit={handleSubmitWeek(onSubmitWeek)}
          >
            <button
              disabled={isSubmittingWeek}
              className="border-l-2 border-y-2 border-gray-200 py-1 px-2 bg-white rounded-l-xl cursor-pointer"
              type="submit"
            >
              <div className="border rounded-full p-1 border-gray-400"><FaPlus className="text-sm" /></div>
            </button>
            <input
              autoComplete="off"
              className="w-full max-w-[700px] border-y-2 border-gray-200 py-1 px-2 focus:outline-none"
              {...registerWeek("weekTask")}
              type="text"
              placeholder="Add new task"
              disabled={isSubmittingWeek}
            />
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              minDate={new Date()}
              maxDate={new Date(new Date().setDate(new Date().getDate() + 7))}
              dateFormat="EEEE"
              customInput={<CustomInputW />}
            />
          </form>
          {weekErrors.weekTask && (
            <p className="text-red-500 mx-10 mt-1 text-xs">
              {weekErrors.weekTask.message}
            </p>
          )}
          {errWeek && <p className="text-red-500 mx-10 mt-1">{errWeek}</p>}

          <DragDropContext onDragEnd={(result) => onDragEnd(result, "week")}>
            <Droppable droppableId="weekDroppable">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="mt-3"
                >
                  {weektasks.length > 0 ? (
                    weektasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onContextMenu={(event) =>
                              handleContextMenu(event, index, "week")
                            }
                            className={`text-wrap overflow-x-auto shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center gap-3 max-w-3xl mb-2 ${snapshot.isDragging ? "bg-gray-50" : ""
                              }`}
                          >
                            {task.checked ? (
                              <ImCheckboxChecked
                                className="text-gray-800 bg-white text-lg"
                                onClick={() => handleChecked(index, "week")}
                              />
                            ) : (
                              <ImCheckboxUnchecked
                                className="text-gray-500 text-lg"
                                onClick={() => handleChecked(index, "week")}
                              />
                            )}
                            {task.content}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <p className="px-6 md:px-12 text-base font-semibold">
                      No tasks added yet
                    </p>
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      {/* Context Menu for Deleting Tasks */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          className="absolute bg-white p-2 shadow-lg rounded-md"
        >
          <button onClick={handleDelete} className="text-red-600">
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
}

export default Upcoming;
