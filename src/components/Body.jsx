import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

const Body = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const pathname = location.pathname;

  const fetchUser = async () => {
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });

      dispatch(addUser(res.data));
      setIsAuthenticated(true);
    } catch (error) {

      if (error.response?.status === 401) {
        dispatch(addUser(null));
        setIsAuthenticated(false);

        if (!["/login", "/forgot-password"].includes(pathname)) {
          navigate("/login");
        }
      } else {
        toast.error("Failed to load user. Please try again.");
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If Redux already has user → no need to hit API
    if (userData && userData._id) {
      setIsAuthenticated(true);
      setLoading(false);
      return;
    }

    // If on login/signup/forgot-password → don’t hit API
    if (["/login", "/signup", "/forgot-password"].includes(pathname)) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }

    // Otherwise → try fetching user from backend
    fetchUser();
  }, [pathname]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading your experience...</p>
      </div>
    );
  }

  // Show full layout for /forgot-password (like protected routes)
  // Show partial layout for /login (NavBar shows login/signup)
  const isLoginRoute = pathname === '/login';
  const isForgotPasswordRoute = pathname === '/forgot-password';

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <NavBar />
      <div className="flex-grow px-4 pb-8">
        {
          !isLoginRoute && !isForgotPasswordRoute && !isAuthenticated ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <Loader className="w-12 h-12 text-primary animate-spin" />
              <p className="mt-4 text-sm text-gray-500">Redirecting to login...</p>
            </div>
          ) : (
            <Outlet />
          )
        }
      </div>
      <Footer />
    </div>
  );
};

export default Body;
