"use client"
import React, {useState} from 'react';
import Link from 'next/link'
import {auth} from '@/firebase';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      console.log("Login Successfully")
      router.push('/home')
    } catch(err) {
      console.log(err)
      alert('Failed to login. Please try again or press forgot password.');
    }
  }

  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (!email) {
      alert('Please enter your email address.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Sent password reset.');
    } catch(err) {
      console.log("Error")
      console.log(email)
      alert('Failed to send password reset email. Please try again.');
    }
  }

  return (
    <div className='flex flex-col justify-center items-center w-full h-screen gap-2'>
      <h1 className='text-[24px] font-semibold'>Meal Prep</h1>
      <p className='text-center'>Start monitoring your calories now!</p>
      <div className='flex flex-col justify-center items-center w-full h-full max-w-[500px] max-h-[300px] border bg-white'>
        <form onSubmit={handleSubmit} className='w-full h-full max-w-[400px] max-h-[200px] flex flex-col gap-4'>
          <div className='email'>
            <p>Your email</p>
            <input className='border border-gray-600 w-full h-[40px] rounded-sm p-2' type='text' onChange={(e) => setEmail(e.target.value)} placeholder='e.g. example@gmail.com'></input>
          </div>
          <div className='password'>
            <p>Your password</p>
            <input className='border border-gray-600 w-full h-[40px] rounded-sm p-2' type='password' onChange={(e) => setPassword(e.target.value)} placeholder='e.g. 12341234'></input>
          </div>
          <div className='flex flex-col items-center'>
            <button type='submit' className='w-[60%] h-[40px] bg-green-500 rounded-lg text-white'>Log In</button>
          </div>
          <div className='flex flex-row justify-center gap-8 text-xs'>
            <Link className='text-blue-500 underline' href='/signup'>Don&apos;t have an account?</Link>
            <a onClick={handlePasswordReset} href="#" className='text-blue-500 underline'>Forgot your password?</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login