import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from "axios"
import { useAuth } from "../../AuthContext"
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const { setCurrentUser } = useAuth()
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
  }, [setCurrentUser]); // Added dependencies for useEffect

  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);  // Start loading state
      const res = await axios.post("http://localhost:3000/api/users/login", {
        email,
        password,
      });
  
      const { token, userId } = res.data; // Ensure backend responds with this format
  
      // Store token and userId in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", userId);
      
      // Optionally, set the current user in state if needed
      setCurrentUser(userId);
  
      setLoading(false); // End loading state
  
      // Navigate to the homepage after successful login
      navigate("/");
  
    } catch (error) {
      console.error("Login error:", error.response?.data?.message || "An error occurred during login.");
      alert("Login Failed! Please check your credentials.");
      
      setLoading(false); // End loading state in case of error
    }
  };


  return (
    <div className='w-screen h-screen '>
      <div className='grid grid-cols-1 place-items-center pt-12'>
        <div className='text-3xl font-semibold pt-4 text-slate-600'>Log in</div>

        <div className='border rounded-md border-slate-300 hover:border-slate-600  mt-6 px-16 py-5'>
          <div>
            <p className='text-center font-medium'>Email address</p>
            <TextField
              value={email}
              onChange={(e) => SetEmail(e.target.value)} // Corrected from SetUsername to SetEmail
              size='small'
              id="margin-normal"
              margin="normal"
            />
          </div>
          <div>
            <p className='text-center font-medium'>Password</p>
            <TextField
              value={password}
              onChange={(e) => SetPassword(e.target.value)} // Corrected from SetUsername to SetPassword
              size='small'
              id="margin-normal"
              margin="normal"
            />
          </div>
          <div className='flex justify-center mt-4'>
            <Button variant="contained"
              disabled={loading}
              onClick={handleLogin}
            >   {loading ? "Loading..." : "Login"} </Button>
          </div>
        </div>

        <div className='my-3 flex justify-center space-x-1 p-8 px-14 border rounded-md border-slate-300 hover:border-slate-600'>
          <p>Already have an account?</p>
          <Link to="/signup" className='text-blue-500'>Signup</Link>
        </div>
      </div>
    </div>
  );
}
