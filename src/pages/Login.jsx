import axios from 'axios';
import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {

  const BASE_URL = import.meta.env.VITE_BASE_URL;  

  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId);
  const isPasswordStrong = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/.test(password);

  const handleLogin = async () => {
     
    try {

      const res = await axios.post(BASE_URL + "/login", {
        emailId,
        password,
      }, { withCredentials: true });

      // You can add success logic here (toast, navigation etc.)

      // dispatch an action
      dispatch(addUser(res.data));

      toast.success(`Welcome ${res?.data?.firstName}, Logged in successfully!`, {
        style: { whiteSpace: "nowrap",minWidth: "400px", }
      });

      // navigate 
      return navigate("/");

      

    } catch (error) {
      setError(error?.response?.data);
      toast.error(error?.response?.data);
    }
  };

  return (
    <div className="w-full h-full flex justify-center items-center px-4 py-12 ">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body space-y-4">
          <h2 className="card-title justify-center text-2xl font-bold text-primary">Login</h2>

          {/* Email Input */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Email Address</span>
            <input
              type="email"
              value={emailId}
              placeholder="example@mail.com"
              className={`input w-full ${emailId.length === 0 ? "input-bordered" : isEmailValid ? "input-success" : "input-bordered"}`}
              required
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          {/* Password Input */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                className={`input w-full pr-12 ${password.length === 0 ? "input-bordered" : isPasswordStrong ? "input-success" : "input-bordered"}`}
                required
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* Show/hide password icon */}
              {password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer z-10"
                  onClick={() => setShowPassword(prev => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              )}
            </div>
          </label>


          <p className='text-red-500'> {error} </p>

          {/* Login Button */}
          <div className="card-actions justify-center mt-4">
            <button
              className="btn btn-primary w-full"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-2">
            Don't have an account? <a className="link link-primary cursor-pointer">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
