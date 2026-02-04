import React from "react";
import { persistor } from "../utils/appStore";
import { useDispatch, useSelector } from "react-redux";
import { UserCircle, Menu, Crown, Github } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { toast } from "react-toastify";

const NavBar = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = Boolean(user?._id);
  const membershipType = user?.membershipType;

  const premiumRing =
    membershipType === "gold"
      ? "ring-2 ring-yellow-400 ring-offset-2 ring-offset-base-300"
      : membershipType === "silver"
        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-base-300"
        : "";

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true });
      dispatch(removeUser());
      await persistor.purge();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const MenuItems = () => (
    <>
      <li>
        <Link to="/">Home</Link>
      </li>
      <li>
        <Link to="/profile">Profile</Link>
      </li>
      <li>
        <Link to="/connections">Connections</Link>
      </li>
      <li>
        <Link to="/requests">Requests</Link>
      </li>
      <li>
        <Link
          to="/premium"
          className="flex items-center gap-2 text-yellow-500 font-semibold"
        >
          <Crown size={16} />
          Premium
        </Link>
      </li>
      <li>
        <Link to="/forgot-password">Forgot Password</Link>
      </li>
      <li>
        <button onClick={handleLogout}>Logout</button>
      </li>
    </>
  );

  return (
    <div
      className="navbar sticky top-0 z-50 px-3 sm:px-6
      bg-base-300/80 backdrop-blur-md border-b border-base-200"
    >
      {/* LOGO */}
      <div className="flex-1 min-w-0">
        <Link
          to={isAuthenticated ? "/" : "/login"}
          className="btn btn-ghost text-xl sm:text-2xl truncate"
        >
          🕸️ DevConnect
        </Link>
      </div>

      {/* RIGHT SIDE */}
      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {/* Welcome text (desktop only) */}
          <span className="hidden lg:block text-sm font-medium">
            Welcome, {user.firstName}
          </span>

          {/* Desktop Avatar */}
          <div className="dropdown dropdown-end hidden sm:block">
            <div tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className={`w-10 rounded-full bg-base-200 ${premiumRing}`}>
                {user.photoUrl ? (
                  <img src={user.photoUrl} alt="user" />
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-500" />
                )}
              </div>
            </div>
            <ul className="menu dropdown-content bg-base-100 rounded-box w-60 p-3 shadow">
              <MenuItems />
            </ul>
          </div>

          {/* Mobile Menu */}
          <div className="dropdown dropdown-end sm:hidden">
            <div tabIndex={0} className="btn btn-ghost btn-circle">
              <Menu />
            </div>
            <ul className="menu dropdown-content bg-base-100 rounded-box w-64 p-4 shadow">
              <div className="flex justify-center mb-3">
                <div
                  className={`w-16 h-16 rounded-full bg-base-200 ${premiumRing}`}
                >
                  {user.photoUrl ? (
                    <img src={user.photoUrl} alt="user" />
                  ) : (
                    <UserCircle className="w-10 h-10 mx-auto mt-3 text-gray-500" />
                  )}
                </div>
              </div>
              <MenuItems />
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-2">

          <Link to="/login" className="btn btn-ghost btn-sm sm:btn-md">
            Login
          </Link>

          <Link to="/login" className="btn btn-primary btn-sm sm:btn-md">
            Sign Up
          </Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;