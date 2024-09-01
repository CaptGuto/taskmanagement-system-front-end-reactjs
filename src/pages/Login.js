//redux import
import { useDispatch } from 'react-redux';
import { setBool } from '../store/slices/authSlice'

//image
import LandingImg from '../assets/LandingImg.png';

// icons
import { FaGoogle, FaMicrosoft } from "react-icons/fa";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import axiosInstance from '../services/axiosInstance'

export default function Login() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });


  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/auth/login', { data });

      //I Assumed the response includes a success message
      //console.log('Login successful:', response?.success);

      if (response?.success) {
        dispatch(setBool(true));
        navigate('/home')
      }

      if (!response.ok) {
        alert("Submitting form failed!");
        return;
      }

      if (response?.errors) {
        const errors = response.errors;

        if (errors.email) {
          setError("email", {
            type: "server",
            message: errors.email,
          });
        } else if (errors.password) {
          setError("password", {
            type: "server",
            message: errors.password,
          });
        } else if (errors.confirmPassword) {
          setError("confirmPassword", {
            type: "server",
            message: errors.confirmPassword,
          });
        } else {
          alert("Something went wrong!");
        }
      }
    } catch (err) {
      if (!err?.response) {
        setError('No Server Response');
      } else if (err.response?.status === 400) {
        setError('Missing Username or Password');
      } else if (err.response?.status === 401) {
        setError('Unauthorized');
      } else {
        setError('Login Failed');
      }
    }

  };

  return (
    <div className=' bg-gradient-to-bl from-[#93a6bb] to-[#0E1B21] md:bg-gradient-to-r md:from-[#D0E3F9]  md:via-[#617c8c] md:to-[#0E1B21] min-h-screen flex justify-center items-center'>
      <div className='flex justify-center md:flex-row m-3 md:m-6 gap-3 md:gap-5 w-full'>
        <div className='hidden md:flex flex-1 justify-center items-center mt-3 md:mt-0'>
          <img className='max-w-full max-h-full object-contain' src={LandingImg} alt="Landing" />
        </div>
        <div className='flex flex-1 justify-center w-4/5 m-1'>
          <div className='flex flex-col flex-1 justify-center items-center w-4/5 bg-white bg-opacity-10 rounded-[2.5rem]'>
            <div className='flex items-center justify-center w-4/5 '>
              <h1 className='text-4xl text-gray-200 sm:text-5xl md:text-6xl font-bold text-center font-[Roboto] m-2'>
                Sign In
              </h1>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3 p-[1rem] sm:p-[2rem] md:p-[3.75rem] w-4/5">

              <input
                {...register("email")}
                type="email"
                placeholder="Email"
                className="px-4 py-1 rounded"
              />
              {errors.email && (
                <p className="text-red-300">{`${errors.email.message}`}</p>
              )}


              <input
                {...register("password")}
                type="password"
                placeholder="Password"
                className="px-4 py-1 rounded"
              />
              {errors.password && (
                <p className="text-red-300">{`${errors.password.message}`}</p>
              )}

              <button
                disabled={isSubmitting}
                type="submit"
                className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#90EE90] p-2 w-full rounded-lg text-white text-sm sm:text-base md:text-lg disabled: bg-green-50 mt-4'
              >
                Sign In
              </button>
            </form>
            <div className='flex w-full m-2 mb-6'>
              <div className='border-solid border-t-2 mt-3 ml-14 mr-3 border-gray-200 w-full'></div>
              <div className='text-sm md:text-lg text-gray-950'>Or</div>
              <div className='border-solid border-t-2 mt-3 mr-14 ml-3 border-gray-200 w-full'></div>
            </div>
            <div className='flex justify-between gap-4 md:gap-5 lg:gap-12 md:ml-4'>
              <button className='flex items-center justify-center gap-x-1 border-solid border-2 text-gray-200 text-sm md:text-lg px-3 py-1 rounded-md'><FaGoogle className='text-blue-200 text-md md:text-xl' /> Google</button>
              <button className='flex items-center justify-center gap-x-1 border-solid border-2 text-gray-200 px-3 py-1 text-sm md:text-lg rounded-md'><FaMicrosoft className='text-blue-200 text-md md:text-xl' /> Microsoft</button>
            </div>
            <div>
              <p className='mt-4 text-center text-xs md:text-sm sm:text-base text-gray-200'>
                Don't have an account? <Link to={'/register'}><span className='cursor-pointer text-blue-300'>Sign Up</span> </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(5, "Password must be greater than 5 characters"),
  });
