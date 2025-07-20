import React, { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
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

  const userData = useSelector((store) => store.user);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (userData && userData._id) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(BASE_URL + "/profile/view",
         {withCredentials: true,}
      );

      dispatch(addUser(res.data));
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else {
        toast.error("Failed to load user. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading your experience...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <NavBar />
      <div className="flex-grow px-4  pb-8">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Body;
