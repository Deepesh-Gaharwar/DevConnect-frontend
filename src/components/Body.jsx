import React from 'react';
import NavBar from './NavBar';
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const Body = () => {
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
