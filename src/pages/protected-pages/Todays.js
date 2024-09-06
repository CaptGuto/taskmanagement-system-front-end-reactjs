import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { removeTasks, setTasks, setTasksForDnd, toggleFinished } from '../../store/slices/todayTasks';
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const taskSchema = z.object({
  task: z.string().max(500, "Word limit").min(1, '*')
});

function Todays() {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(taskSchema) });
  const tasks = useSelector((state) => state.task.value);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

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
      const newTask = { id: `${Date.now()}`, content: data.task, checked: false };
      dispatch(setTasks(newTask));
      reset();
      //send a post request here too or implement useEffect function that triggers every time when the task is updated in any way
    } catch (error) {
      console.log(error);
    }
  }

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedTasks = Array.from(tasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, { ...movedTask, id: draggableId });

    dispatch(setTasksForDnd(updatedTasks));
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
      const taskId = tasks[contextMenu.taskIndex].id;
      dispatch(removeTasks(taskId));
    }
    handleClose();
    // send a post request here too
  };

  const handleChecked = (index) => {
    dispatch(toggleFinished(tasks[index].id));
    // here too
  };

  return (
    <div className='p-4 bg-[#fefefe] rounded-3xl text-black min-h-screen w-full flex flex-col'>
      <div>
        <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold m-5 lg:mx-10'>Today</h1>
        <form className='flex mx-3 md:mx-10' onSubmit={handleSubmit(onSubmit)}>
          <button disabled={isSubmitting} className='border-l-2 border-y-2 border-gray-200 py-1 px-2 bg-white rounded-l-xl cursor-pointer' type='submit'>
          <div className="border rounded-full p-1 border-gray-400"><FaPlus className="text-sm"/></div>
          </button>
          <input
            autoComplete='off'
            className='w-full max-w-[700px] border-r-2 border-y-2 border-gray-200 py-1 px-2 rounded-r-xl focus:outline-none'
            {...register('task')}
            type='text'
            alt='enter tasks'
            placeholder='Add new task'
            disabled={isSubmitting}
          />
        </form>
        {errors.task && <p className="text-red-500 mx-10 mt-1">{errors.task.message}</p>}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className='mt-3'
            >
              {tasks.length > 0 ? tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onContextMenu={(event) => handleContextMenu(event, index)}
                      className={`shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center gap-3 max-w-3xl mb-2 ${snapshot.isDragging ? 'bg-gray-50' : ''}`}
                    >
                      {task.checked ?
                        <ImCheckboxChecked className='text-gray-800 bg-white' onClick={() => handleChecked(index)} /> :
                        <ImCheckboxUnchecked className='text-gray-500' onClick={() => handleChecked(index)} />
                      }
                      {task.content}
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

export default Todays;
