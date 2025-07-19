import React, { useEffect } from 'react';
import NavBar from './NavBar';
import { Outlet, useNavigate } from 'react-router-dom';
import Footer from './Footer';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { toast } from 'react-toastify';

const Body = () => {

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const userData = useSelector( (store) => store.user);

  const fetchUser = async () => {

    if(userData) return;
     
    try {
      const res = await axios.get(BASE_URL + "/profile/view", 
        {withCredentials : true},
      )

      // dispatch an action
      dispatch(addUser(res.data));

    } catch (error) {

      toast.error(error.message);
      
      if(error.status === 401){
        navigate("/login");
      } 
    }
  };
  
  
  // useEffect 
  useEffect( () => {
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <NavBar />
      
      <div className="flex-grow flex justify-center items-center px-4 py-8">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
};

export default Body;
