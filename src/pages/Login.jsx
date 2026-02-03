import axios from 'axios';
import React, { useState } from 'react';
import { Eye, EyeOff, Loader, User, Mail, Lock } from 'lucide-react';
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

      dispatch(addUser(res?.data?.data));
      toast.info(`Welcome back, ${res?.data?.data?.firstName}!`);

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
    <div className="w-full h-screen flex justify-center items-center px-4 py-12 bg-base-100">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        {/* Header Tabs */}
        <div className="flex">
          <button
            onClick={() => setIsLoginForm(true)}
            className={`w-1/2 py-3 cursor-pointer text-lg font-medium transition-all rounded-none border-b-2 ${
              isLoginForm
                ? "border-primary text-primary"
                : "border-base-300 text-base-content"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginForm(false)}
            className={`w-1/2 py-3 cursor-pointer text-lg font-medium transition-all rounded-none border-b-2 ${
              !isLoginForm
                ? "border-primary text-primary"
                : "border-base-300 text-base-content"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="card-body space-y-4 min-h-[400px]">
          <h2 className="text-center text-2xl font-semibold text-primary">
            {isLoginForm ? "Login" : "Sign Up"}
          </h2>

          {/* Conditionally show Name inputs for Sign Up */}
          {!isLoginForm && (
            <div className="flex gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
          )}

          {/* Email */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Email Address</span>
            <input
              type="email"
              value={emailId}
              placeholder="example@mail.com"
              className={`input w-full ${
                emailId.length === 0
                  ? "input-bordered"
                  : isEmailValid
                    ? "input-success"
                    : "input-bordered"
              }`}
              required
              onChange={(e) => setEmailId(e.target.value)}
            />
          </label>

          {/* Password */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="••••••••"
                className={`input w-full pr-12 ${
                  password.length === 0
                    ? "input-bordered"
                    : isPasswordStrong
                      ? "input-success"
                      : "input-bordered"
                }`}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 z-10 cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
            </div>
          </label>

          {/* Forgot Password */}
          {isLoginForm && (
            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              className="btn btn-primary w-[180px] flex items-center justify-center gap-2"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin w-5 h-5" />
              ) : isLoginForm ? (
                "Login"
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );


};

export default Login;
