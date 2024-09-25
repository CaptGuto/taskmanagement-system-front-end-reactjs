import { useDispatch, useSelector } from 'react-redux'
import { setAssignedTasksForDnd, toggleAssignedFinished } from '../../store/slices/assignedSlice'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { ImCheckboxChecked, ImCheckboxUnchecked } from 'react-icons/im';

function Assigned() {

  const assignedTasks = useSelector(state => state.assignedTask.value)
  const dispatch = useDispatch()

  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.index === source.index) return;

    const updatedTasks = Array.from(assignedTasks);
    const [movedTask] = updatedTasks.splice(source.index, 1);
    updatedTasks.splice(destination.index, 0, { ...movedTask, id: draggableId });

    dispatch(setAssignedTasksForDnd(updatedTasks));
    //send a post to the server here also
  };

  const handleChecked = (index) => {
    dispatch(toggleAssignedFinished(assignedTasks[index].id));
    // here too
  };

  return (
    <div>
      <h1 className='text-xl md:text-2xl lg:text-3xl font-semibold m-1 lg:mx-10'>
        Projects
      </h1>
      <div className='p-4 bg-[#fefefe] rounded-2xl border border-gray-200 text-black h-[50dvh] min-h-60 lg:min-h-80 w-full flex flex-col justify-between mx-3'>
        <div>
          <div className='flex justify-between items-center m-3 lg:mx-7'>
            <h2 className='text-lg md:text-xl lg:text-2xl font-semibold'>
              Assigned to You
            </h2>
            <h3 className='text-base md:text-lg lg:text-xl font-semibold lg:mr-20'>
              Due
            </h3>
          </div>
          <div>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className='mt-3'
                  >
                    {assignedTasks.length > 0 ? assignedTasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`shadow-lg py-1 px-4 rounded-md m-1 relative cursor-pointer flex items-center, justify-between lg:mr-20 gap-3 max-w-3xl mb-2 ${snapshot.isDragging ? 'bg-gray-50' : ''}`}
                          >
                            <div>
                              {task.checked ?
                                <ImCheckboxChecked className='text-gray-800 bg-white' onClick={() => handleChecked(index)} /> :
                                <ImCheckboxUnchecked className='text-gray-500' onClick={() => handleChecked(index)} />
                              }
                              {task.content}
                            </div>
                            {task.due_date}
                          </div>
                        )}
                      </Draggable>
                    )) : <p className='px-6 md:px-12 font-semibold'>No assigned tasks yet</p>}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
        <div className='flex justify-between items-center mt-1 lg:mt-3 gap-9'>
          <button className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#88e488] p-2 w-full rounded-lg text-white text-md font-semibold sm:text-base md:text-lg disabled:bg-green-100 mt-4 hover:bg-gradient-to-r hover:from-[#1b7e32] hover:to-[#8AC543] transition-all text-center max-w-64'>
            Finished Report
          </button>
          <button className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#88e488] p-2 w-full rounded-lg text-white text-md font-semibold sm:text-base md:text-lg disabled:bg-green-100 mt-4 hover:bg-gradient-to-r hover:from-[#1b7e32] hover:to-[#8AC543] transition-all text-center max-w-64'>Unable To Complete</button>
        </div>


      </div>
    </div>
  )
}

export default Assigned
