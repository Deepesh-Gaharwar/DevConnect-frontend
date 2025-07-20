import axios from 'axios';
import React, { useState } from 'react';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId);
  const isPasswordStrong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/.test(password);

  const handleLogin = async () => {
    setLoading(true); 
    try {
      const res = await axios.post(
        BASE_URL + '/login',
        { emailId, password },
        { withCredentials: true }
      );

      dispatch(addUser(res.data));

      toast.info(`Welcome back, ${res?.data?.firstName}!`);

      navigate('/'); 
    } catch (error) {
      setError(error?.response?.data);
      toast.error(error?.response?.data);
    } finally {
      setLoading(false); 
    }
  };


  const handleSignUp = async () => {
     try {

      const res = await axios.post(BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        {withCredentials : true},
      );

      // dispatch an action
      dispatch(addUser(res.data.data));

      navigate("/profile");
      
     } catch (error) {
        setError("Error : "+ error.message || "something went wrong!");
      
     }
  }

  return (
    <div className="w-full h-full flex justify-center items-center px-4 py-12">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title justify-center text-2xl font-bold text-primary">{isLoginForm ? "Login" : "Sign Up"}</h2>


        { !isLoginForm &&
            <>
               {/* First + Last Name */}
                <div className="flex gap-4">
                  <label className="form-control w-full">
                    <span className="label-text mb-1">First Name</span>
                    <input
                      type="text"
                      value={firstName}
                      className='input input-bordered w-full'
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </label>

                  <label className="form-control w-full">
                    <span className="label-text mb-1">Last Name</span>
                    <input
                      type="text"
                      value={lastName}
                      className='input input-bordered w-full'
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </label>
                </div>
              

            </>
        }

          {/* Email Input */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Email Address</span>
            <input
              type="email"
              value={emailId}
              placeholder="example@mail.com"
              className={`input w-full ${
                emailId.length === 0
                  ? 'input-bordered'
                  : isEmailValid
                  ? 'input-success'
                  : 'input-bordered'
              }`}
              required
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          {/* Password Input */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Password</span>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                placeholder="••••••••"
                className={`input w-full pr-12 ${
                  password.length === 0
                    ? 'input-bordered'
                    : isPasswordStrong
                    ? 'input-success'
                    : 'input-bordered'
                }`}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              
              {/* Toggle Visibility Icon */}
              {password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 cursor-pointer"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
            </div>
          </label>


          <p className="text-red-500"> {error} </p>

          {/* Login / Sign Up Button */}
          <div className="card-actions justify-center mt-4">
              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={isLoginForm ? handleLogin : handleSignUp}
                disabled={loading}
              >
                {loading ? <Loader className="animate-spin w-5 h-5" /> : isLoginForm ? 'Login' : 'Sign up'}
              </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-2">
            {isLoginForm ? "Don't have an account? " : 'Already have an account? '}
            <span
              className="link link-primary cursor-pointer"
              onClick={() => setIsLoginForm(!isLoginForm)}
            >
              {loading ? 'Loading...' : isLoginForm ? 'Sign up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
