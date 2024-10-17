import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useAuth } from '../../AuthContext'

export default function Signup() {

  const [email, SetEmail] = useState("")
  const [username, SetUsername] = useState("")
  const [password, SetPassword] = useState("")
  const [loading, SetLoading] = useState(false)
  const { setCurrentUser } = useAuth()

  const navigate = useNavigate(); // call useNavigate here

  const HandleSignup = async (e) => {
    e.preventDefault();
    try {
      SetLoading(true)
      const res = await axios.post("http://localhost:3000/api/users/signup", {
        email: email,
        password: password,
        username: username
      });

      const token = res.data.token;
      const userId = res.data.userId;

      // Correcting localStorage API
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);

      setCurrentUser(userId);
      SetLoading(false);

      // Navigate to home page after successful signup
      navigate("/");

    } catch (err) {
      console.error(err);
      alert("Signup Failed!");
      SetLoading(false);
    }
  }

  return (
    <div className='w-screen h-screen'>
      <div className='grid grid-cols-1 place-items-center pt-12'>
        <div className='text-3xl font-semibold pt-4 text-slate-600'>Sign Up</div>

        <div className='border rounded-md border-slate-300 hover:border-slate-600 mt-6 px-16 py-5'>
          <div>
            <p className='text-center font-medium'>Username</p>
            <TextField 
              value={username}
              onChange={(e) => SetUsername(e.target.value)}
              size='small' 
              id="username" 
              margin="normal" 
            />
          </div>
          <div>
            <p className='text-center font-medium'>Email address</p>
            <TextField
              value={email}
              onChange={(e) => SetEmail(e.target.value)}
              size='small' 
              id="email" 
              margin="normal" 
            />
          </div>
          <div>
            <p className='text-center font-medium'>Password</p>
            <TextField
              value={password}
              onChange={(e) => SetPassword(e.target.value)}
              size='small' 
              id="password" 
              margin="normal" 
              type="password"
            />
          </div>
          <div className='flex justify-center mt-4'>
            <Button
              variant="contained"
              disabled={loading}
              onClick={HandleSignup}>
              {loading ? "Loading..." : "Signup"}
            </Button>
          </div>
        </div>

        <div className='my-3 flex justify-center space-x-1 p-8 px-14 border rounded-md border-slate-300 hover:border-slate-600'>
          <p>Already have an account?</p>
          <Link to="/auth" className='text-blue-500'>Login</Link>
        </div>
      </div>
    </div>
  )
}
