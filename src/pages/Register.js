"use client";

//redux import
import { useDispatch } from 'react-redux';
import { setBool } from '../store/slices/authSlice'

//image
import LandingImg from '../assets/LandingImg.png';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import axiosInstance from '../services/axiosInstance'

export default function RegisterPage() {
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
      const response = await axiosInstance.post('/auth/register', { data });

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
      <div className='flex flex-col-reverse md:flex-row m-3 md:m-6 gap-3 md:gap-5 w-full'>
        <div className='flex-1 hidden md:flex justify-center items-center mt-3 md:mt-0'>
          <img className='max-w-full max-h-full object-contain' src={LandingImg} alt="Landing" />
        </div>
        <div className='flex flex-col flex-1 p-2 items-center w-full bg-white bg-opacity-10 rounded-[2.5rem]'>
        <div className='flex items-center justify-center w-4/5'>
            <h1 className='text-4xl text-gray-200 sm:text-5xl md:text-6xl font-bold text-center font-[Roboto] m-2'>
              Sign Up
            </h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-3 w-4/5 p-[1rem] md:p-[3.75rem]">
            <input
              {...register("firstName")}
              type="text"
              placeholder="First name"
              className="px-4 py-1 rounded"
            />
            {errors.firstName && (
              <p className="text-red-300">{`${errors.firstName.message}`}</p>
            )}

            <input
              {...register("lastName")}
              type="text"
              placeholder="Last name"
              className="px-4 py-1 rounded"
            />
            {errors.lastName && (
              <p className="text-red-300">{`${errors.lastName.message}`}</p>
            )}

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

            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm password"
              className="px-4 py-1 rounded"
            />
            {errors.confirmPassword && (
              <p className="text-red-300">{`${errors.confirmPassword.message}`}</p>
            )}

            <button
              disabled={isSubmitting}
              type="submit"
              className='bg-gradient-to-r from-[#28A745] via-[#8ac543] to-[#90EE90] p-2 w-full rounded-lg text-white text-sm sm:text-base md:text-lg disabled: bg-green-50 mt-4'
            >
              Sign Up
            </button>
          </form>
          <div>
          <p className='mt-4 text-center text-sm sm:text-base text-gray-200'>
              Already have an account? <Link to={'/login'}><span className='cursor-pointer text-blue-300'>Sign In</span> </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const signUpSchema = z
  .object({
    firstName: z.string().max(50, "The length must be less than 50 characters").min(1),
    lastName: z.string().max(50, "The length must be less than 50 characters").min(1),
    email: z.string().email(),
    password: z.string().min(5, "Password must be greater than 5 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
