import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaCalendarCheck, FaPlus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css'
import { removeProject, setProject, setProjectForDnd, toggleProjectFinished } from '../../store/slices/projectSlice';
import NestedComp from '../../components/NestedProject/NestedComp';


const taskSchema = z.object({
  task: z.string().max(500, "Word limit").min(1, '*')
});

function Projects() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(taskSchema) });
  const projectsList = useSelector((state) => state.project.value);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [err, setErr] = useState('')
  const [showNested, setShowNested] = useState([])
  const [assignToOtherModal, setassignToOtherModal]= useState(false)

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className='flex inline-flex, items-center, cursor-pointer, py-1 px-2 border-r-2 border-y-2 border-gray-200 rounded-r-xl  bg-white'
    >
      <FaCalendarCheck title="Select Time" className='text-2xl text-gray-600' />
      <span className='ml-3'>{value || "when"}</span>
    </div>
  ));


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        handleClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  async function onSubmit(data) {
    try {
      //console.log(data);
      if (!selectedDate) {
        throw new Error('Please select a due date.');
      }
      else {
        const newTask = { id: `${Date.now()}`, content: data.task, due_date: selectedDate.toDateString(), checked: false };
        dispatch(setProject(newTask));
        reset();
        setSelectedDate()
        setErr('')
        //send a post request here too or implement useEffect function that triggers every time when the task is updated in any way
      }
    }

    catch (error) {
      setErr(error.message)
    }
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedTasks = Array.from(projectsList);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, { ...movedTask, id: draggableId });

    dispatch(setProjectForDnd(updatedTasks));
    //send a post to the server here also
  };

  const handleContextMenu = (event, index) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      taskIndex: index,
    });
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const handleDelete = () => {
    if (contextMenu && contextMenu.taskIndex !== undefined) {
      const taskId = projectsList[contextMenu.taskIndex].id;
      dispatch(removeProject(taskId));
    }
    handleClose();
    // send a post request here too
  };

  const handleChecked = (index) => {
    dispatch(toggleProjectFinished(projectsList[index].id));
    // here too
  };

  function handleClickProject(projectId) {
    if (showNested.includes(projectId)) {
      setShowNested(showNested.filter(id => id !== projectId))
    } else {
      setShowNested([...showNested, projectId])
    }
  }
  function handleAssignToOthers(projectId) {
    setassignToOtherModal(true)
  }

  return (
    <div className='p-4 bg-[#fefefe] rounded-3xl text-black min-h-screen w-full flex flex-col'>
      <div>
        <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold m-3 lg:mx-5'>Tasks</h1>
        <form className='flex mx-3 md:mx-10' onSubmit={handleSubmit(onSubmit)}>
          <button disabled={isSubmitting} className='border-l-2 border-y-2 border-gray-200 py-1 px-2 bg-white rounded-l-xl cursor-pointer' type='submit'>
            <div className="border rounded-full p-1 border-gray-400"><FaPlus className="text-sm" /></div>
          </button>
          <input
            autoComplete='off'
            className='w-full max-w-[700px] border-y-2 border-gray-200 py-1 px-2 focus:outline-none'
            {...register('task')}
            type='text'
            alt='enter tasks'
            placeholder='Add new task'
            disabled={isSubmitting}
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            customInput={<CustomInput />}
          />
        </form>
        {errors.task && <p className="text-red-500 mx-10 mt-1">{errors.task.message}</p>}
        {err && <p className="text-red-500 mx-10 mt-1">{err}</p>}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='mt-3'
            >
              {projectsList.length > 0 ? projectsList.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div
                        onContextMenu={(event) => handleContextMenu(event, index)}
                        className={`shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center gap-3 max-w-3xl mb-2 ${snapshot.isDragging ? 'bg-gray-50' : ''}`}
                      >
                        {task.checked ?
                          <ImCheckboxChecked className='text-gray-800 bg-white' onClick={() => handleChecked(index)} /> :
                          <ImCheckboxUnchecked className='text-gray-500' onClick={() => handleChecked(index)} />
                        }
                        <div onClick={() => handleClickProject(task.id)}> {task.content} </div>
                      </div>
                      {
                        showNested.includes(task.id) && <NestedComp projectId={task.id} />
                      }
                      <div>
                        <button
                          className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#88e488] p-2 w-full rounded-lg text-white text-md font-semibold sm:text-base md:text-lg disabled: bg-green-50 mt-4 hover:bg-gradient-to-r hover:from-[#1b7e32] hover:to-[#8AC543] transition-all disabled:bg-gray-600 block text-center max-w-64'
                          onClick={handleAssignToOthers(task.id)}>
                          Assign to Others
                        </button>
                      </div>
                    </div>

                  )}
                </Draggable>
              )) : <p className='px-6 md:px-12 text-lg font-semibold'>No tasks added yet</p>}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {contextMenu && (
        <div
          ref={contextMenuRef}
          className="absolute bg-white border shadow-md rounded-md"
          style={{ top: contextMenu.mouseY, left: contextMenu.mouseX }}
          onClick={handleDelete}
        >
          <p className="px-4 py-1 text-red-500 hover:bg-gray-100 cursor-pointer z-20">Delete</p>
        </div>
      )}
    </div>
  );
}

export default Projects;
