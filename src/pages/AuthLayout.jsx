import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-base-100">
      {/* NAVBAR */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* HERO SECTION */}
        <div
          className="w-full lg:w-1/2 
             relative overflow-hidden
             bg-base-100
             flex items-center justify-center 
             px-8 py-16 lg:py-0"
        >
          <div className="relative max-w-xl text-center lg:text-left text-white">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-4">
              Connecting Developers.
              <br />
              Building Futures.
            </h1>

            <p className="text-base sm:text-lg text-white/90">
              Find your next tech collaborator, mentor, or opportunity.
            </p>
          </div>
        </div>

        {/* LOGIN FORM */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-1">
          <Outlet />
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default AuthLayout;
