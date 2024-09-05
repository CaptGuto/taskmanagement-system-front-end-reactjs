import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='p-1 bg-[#f4f4f4] rounded-3xl text-black min-h-screen w-full flex items-center sm:p-5 md:p-20 lg:px-40 lg:py-10 flex-col'>
      <h1 className='text-xl md:text-2xl lg:text-4xl font-semibold text-center my-4'>Welcome to Task Manager</h1>
      <span className='text-sm font-semibold text-center'>
      A Task Manager app is a simple, user-friendly digital tool designed to help individuals and teams organize tasks and manage their daily activities efficiently. Users can create, edit, and prioritize tasks, set deadlines or reminders and categorize items all within an intuitive and accessible interface. These apps are essential for improving productivity, reducing stress, and ensuring that important responsibilities are not forgotten.
      </span>
      <Link to={'/today'} className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#88e488] p-2 w-full rounded-lg text-white text-md font-semibold sm:text-base md:text-lg disabled: bg-green-50 mt-4 hover:bg-gradient-to-r hover:from-[#1b7e32] hover:to-[#8AC543] transition-all disabled:bg-gray-600 block text-center max-w-64'>Go to tasks</Link>
    </div>
  )
}

export default Home
