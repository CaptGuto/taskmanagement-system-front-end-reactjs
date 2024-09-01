import LandingImg from '../assets/LandingImg.png';
import { Link, NavLink } from 'react-router-dom';

function Landing() {
  return (
    <div className='bg-gradient-to-t md:bg-gradient-to-r from-[#D0E3F9]  via-[#617c8c] to-[#0E1B21] min-h-screen flex justify-center items-center'>
      <div className='flex flex-col-reverse  md:flex-row m-3 md:m-6 gap-3 md:gap-5 w-full'>
        {/* Image Section */}
        <div className='hidden md:flex-1 md:flex justify-center items-center mt-3 md:mt-0'>
          <img className='max-w-full max-h-full object-contain' src={LandingImg} alt="Landing" />
        </div>
        
        {/* Text Section */}
        <div className='flex-1 p-2'>
          <div className='flex items-center justify-start mt-10 flex-col h-full'>
            <span className='text-4xl text-gray-200 sm:text-5xl md:text-6xl font-bold text-center font-[Roboto] m-2'>
              Task Manager
            </span>
            <span className='text-sm sm:text-md md:text-lg font-serif block m-3 text-center text-gray-200 font-extralight'>
            Stay organized and get things done. Our task manager app helps you prioritize tasks and stay on top of your schedule.
            </span>
            <NavLink to={'/register'} className='w-4/5'>
              <button className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#90EE90] p-2 w-full rounded-lg text-white text-sm sm:text-base md:text-lg mt-7'>
                Get Started
              </button>
            </NavLink>
            <p className='mt-5 text-center text-sm sm:text-base text-gray-200'>
              Already have an account? <Link to={'/login'}><span className='cursor-pointer text-blue-300'>Sign In</span> </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
