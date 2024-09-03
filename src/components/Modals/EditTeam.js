import React from 'react'
import { IoClose } from 'react-icons/io5'
import {FaPlus} from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../services/axiosInstance'
import {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

function EditTeam({ onClose }) {
  const {register, handleSubmit, formState: {errors, isSubmitting}, setError} = useForm({resolver: zodResolver(addTeamSchema)})

  async function onSubmit(data) {
    try {
      /*the next two lines are temporary code */
      //console.log(data);
      onclose()
      
      const response = await axiosInstance.post('/create/team', {data});

      if (response?.success) {
        onClose()
      }
      if (response?.error) {
        const errors = response.error;
        if (errors.email) {
          setError("email", {
            type: "server",
            message: errors.email,
          });
        } else if (errors.name) {
          setError("name", {
            type: "server",
            message: errors.name,
          });
        } else {
          alert("Something went wrong!");
        }
      }
    } catch (err) {
      if (!err?.response) {
        setError('No Server Response');
      } else if (err.response?.status === 400) {
        setError('Missing Team name or Email');
      } else if (err.response?.status === 401) {
        setError('Unauthorized');
      } else {
        setError('Login Failed');
      }
    }
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg w-96 p-6 relative shadow-lg">
        <header className="text-lg font-semibold mb-4">Add Team</header>
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <IoClose size={24} />
        </button>
        <form onSubmit={handleSubmit(onSubmit)}> 
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Team name</label>
            <input
              {...register("teamName")}
              type="text"
              placeholder="Enter name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-200"
            />
            {errors.teamName && (
                <p className="text-red-300">{`${errors.teamName.message}`}</p>
              )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Invite members</label>
            <div className='flex'>
            <input
              {...register("email")}
              type="email"
              placeholder="Enter an email"
              className="w-full px-3 py-2 border border-gray-300 rounded-s-md shadow-sm focus:outline-none focus:ring-1 focus:ring-green-200 focus:border-green-200"
            />
            <button className='px-3 py-2 border border-gray-300 rounded-e-md shadow-sm'><FaPlus /></button>
            </div>
            {errors.email && (
                <p className="text-red-300">{`${errors.email.message}`}</p>
              )}
          </div>
          <div className="flex justify-end">
            <button
            disabled={isSubmitting}
              type="submit"
              className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#88e488] p-2 w-full rounded-lg text-white text-md font-semibold sm:text-base md:text-lg disabled: bg-green-50 mt-4 hover:bg-gradient-to-r hover:from-[#1b7e32] hover:to-[#8AC543] transition-all disabled:bg-gray-600'
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditTeam

const addTeamSchema = z.object({
  teamName: z.string().min(4 , "needs to be longer that 3"),
  email: z.string().email(),
})