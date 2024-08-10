"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {auth} from '@/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Signup = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter(); 

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          await createUserWithEmailAndPassword(auth, email, password)
          console.log("Account created")
          router.push('/home')
        } catch(err) {
          console.log(err)
          alert('Failed to login. Please try again or press forgot password.');
        }
      }

    return (
        <div className='flex flex-col justify-center items-center w-full h-screen gap-2'>
            <h1 className='text-[24px] font-semibold'>Create your account</h1>
            <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center w-full h-full max-w-[500px] max-h-[300px] border bg-white'>
                <div className='w-full h-full max-w-[400px] max-h-[200px] flex flex-col gap-4'>
                    <div className='email'>
                        <p>Your email</p>
                        <input className='border border-gray-600 w-full h-[40px] rounded-sm p-2' type='text' onChange={(e) => setEmail(e.target.value)} placeholder='e.g. example@gmail.com'></input>
                    </div>
                    <div className='password'>
                        <p>Your password</p>
                        <input className='border border-gray-600 w-full h-[40px] rounded-sm p-2' type='password' onChange={(e) => setPassword(e.target.value)} placeholder='e.g. 12341234'></input>
                    </div>
                    <div className='flex flex-col items-center'>
                        <button type='submit' className='w-[60%] h-[40px] bg-green-500 rounded-lg text-white'>Sign Up</button>
                    </div>
                    <div className='flex flex-row justify-center gap-8 text-xs'>
                        <Link className='text-blue-500 underline' href='/'>Already registered? Login</Link>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Signup