import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { useForm } from 'react-hook-form';
import { FaCalendarCheck, FaPlus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { z } from 'zod';
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.module.css';
import { addStep, removeStep, toggleStepFinished} from '../../store/slices/projectSlice';

const taskSchema = z.object({
  task: z.string().max(300, "Word limit").min(1, '*'),
});

function NestedComp({ projectId }) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({ resolver: zodResolver(taskSchema) });
  const projectsList = useSelector((state) => state.project.value);
  const project = projectsList.find(task => task.id === projectId);
  const dispatch = useDispatch();
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [err, setErr] = useState('');

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div
      onClick={onClick}
      ref={ref}
      className='flex inline-flex, items-center cursor-pointer py-1 px-2 border-r-2 border-y-2 border-gray-300 rounded-r-xl bg-white'
    >
      <FaCalendarCheck title="Select Time" className='text-xl text-gray-500' />
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
      if (!selectedDate) {
        throw new Error('Please select a due date.');
      } else {
        const step = { id: `${Date.now()}`, content: data.task, due_date: selectedDate.toDateString(), checked: false };
        dispatch(addStep({ projectId, step }));  // Add the step to Redux state
        reset();
        setSelectedDate(null);
        setErr('');
      }
    } catch (error) {
      setErr(error.message);
    }
  }

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
      const stepId = project.steps[contextMenu.taskIndex].id;
      dispatch(removeStep({ projectId, stepId }));  // Correct payload
    }
    handleClose();
  };
  

  const handleChecked = (index) => {
    const stepId = project.steps[index].id;
    dispatch(toggleStepFinished({ projectId, stepId }));  // Correct payload for toggling
  };
  

  return (
    <div className='p-4 bg-[#fefefe] rounded-3xl text-black w-full flex flex-col'>
      <div>
        <form className='flex mx-3 md:mx-10' onSubmit={handleSubmit(onSubmit)}>
          <button disabled={isSubmitting} className='border-l-2 border-y-2 border-gray-300 px-2 bg-white rounded-l-xl cursor-pointer' type='submit'>
            <div className="border rounded-full p-1 border-gray-400"><FaPlus className="text-sm" /></div>
          </button>
          <input
            autoComplete='off'
            className='w-full max-w-[700px] border-y-2 border-gray-200 px-2 focus:outline-none'
            {...register('task')}
            type='text'
            placeholder='Add steps'
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

      <div className='mt-3 lg:ml-20'>
        {project && project.steps && project.steps.length > 0 ? project.steps.map((task, index) => (
          <div
            key={task.id}
            onContextMenu={(event) => handleContextMenu(event, index)}
            className='shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center gap-3 max-w-3xl mb-2'
          >
            {task.checked ?
              <ImCheckboxChecked className='text-gray-800 bg-white' onClick={() => handleChecked(index)} /> :
              <ImCheckboxUnchecked className='text-gray-500' onClick={() => handleChecked(index)} />
            }
            {task.content}
          </div>
        )) : <p className='px-6 md:px-12 text-lg font-semibold'>No steps added yet</p>}
      </div>

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

export default NestedComp;
