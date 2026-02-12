import axios from "axios";
import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Loader, User, Mail, Lock } from "lucide-react";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoginForm, setIsLoginForm] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "signup") {
      setIsLoginForm(false);
    } else {
      setIsLoginForm(true);
    }
  }, [searchParams]);

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailId);
  const isPasswordStrong =
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/.test(password);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { emailId, password },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      toast.info(`Welcome back, ${res?.data?.data?.firstName}!`);
      navigate("/");
    } catch (error) {
      setError(error?.response?.data);
      // toast.error(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
        },
        { withCredentials: true },
      );

      // dispatch an action
      dispatch(addUser(res.data.data));
      navigate("/profile");
    } catch (error) {
      setError("Error : " + error.message || "something went wrong!");
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center px-4 py-12 bg-base-100">
      <div className="w-full max-w-md bg-base-200/80 backdrop-blur-xl border border-base-300 rounded-2xl shadow-2xl">
        {/* Header Tabs */}
        <div className="flex border-b border-base-300">
          <button
            onClick={() => setIsLoginForm(true)}
            className={`w-1/2 py-4 cursor-pointer text-lg font-semibold transition-all duration-300 border-b-2 ${
              isLoginForm
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginForm(false)}
            className={`w-1/2 py-4 cursor-pointer text-lg font-semibold transition-all duration-300 border-b-2 ${
              !isLoginForm
                ? "border-primary text-primary"
                : "border-transparent text-base-content/60 hover:text-base-content"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form Body */}
        <div className="card-body space-y-6 min-h-[420px] px-8 py-10">
          <h2 className="text-center text-3xl font-bold text-primary">
            {isLoginForm ? "Log in" : "Sign Up"}
          </h2>

          {/* Conditionally show Name inputs for Sign Up */}
          {!isLoginForm && (
            <div className="flex gap-4">
              <label className="form-control w-full">
                <span className="label-text mb-1">First Name</span>
                <input
                  type="text"
                  value={firstName}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary/40 transition"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>

              <label className="form-control w-full">
                <span className="label-text mb-1">Last Name</span>
                <input
                  type="text"
                  value={lastName}
                  className="input input-bordered w-full focus:ring-2 focus:ring-primary/40 transition"
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
              className="input input-bordered w-full focus:ring-2 focus:ring-primary/40 transition"
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
                className="input input-bordered w-full pr-12 focus:ring-2 focus:ring-primary/40 transition"
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              {password.length > 0 && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
            </div>
          </label>

          {/* Forgot Password */}
          {isLoginForm && (
            <div className="flex justify-end -mt-3">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 text-sm rounded-lg px-4 py-2 text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              className="w-full bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold py-3 rounded-lg shadow-md disabled:opacity-70 cursor-pointer"
              onClick={isLoginForm ? handleLogin : handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <Loader className="animate-spin mx-auto w-5 h-5" />
              ) : isLoginForm ? (
                "Log in"
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          {/* Bottom Switch Text */}
          <div className="text-center text-sm text-base-content/60 mt-2">
            {isLoginForm ? (
              <>
                New to DevConnect?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline font-medium cursor-pointer"
                  onClick={() => setIsLoginForm(false)}
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-500 hover:underline font-medium cursor-pointer"
                  onClick={() => setIsLoginForm(true)}
                >
                  Login here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
