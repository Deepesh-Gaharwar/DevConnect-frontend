import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UserCircle, Menu } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';
import { toast } from 'react-toastify';

const NavBar = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      toast.success("Logged Out Successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
    }
  };

  
  const isAuthenticated = user?._id && user?._persist?.rehydrated;

  return (
    <div className={`navbar px-4 sticky top-0 z-50 transition-all duration-300
      bg-base-300/80 backdrop-blur-md border-b border-base-200/30
      shadow-sm hover:bg-base-300/90`}>
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-2xl">
          🕸️ DevConnect
        </Link>
      </div>

      {isAuthenticated ? (
        <div className="flex items-center gap-2">
          {/* Desktop Welcome */}
          <span className="text-sm font-medium hidden sm:block">
            Welcome, {user.firstName}
          </span>

          {/* Desktop Dropdown */}
          <div className="dropdown dropdown-end hidden sm:block">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full overflow-hidden flex items-center justify-center bg-base-200">
                {user.photoUrl ? (
                  <img alt="user" src={user.photoUrl} />
                ) : (
                  <UserCircle className="w-8 h-8 text-gray-500" />
                )}
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-md dropdown-content bg-base-100 rounded-box z-10 mt-3 w-64 p-4 shadow text-base gap-2"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile <span className="badge">New</span>
                </Link>
              </li>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/connections">Connections</Link></li>
              <li><Link to="/requests/received">Requests</Link></li>
              <li><Link to="/forgot-password">Forgot Password</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>

          {/* Mobile Dropdown */}
          <div className="dropdown dropdown-end sm:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
              <Menu className="w-6 h-6" />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-64 px-5 py-6 shadow text-sm gap-3"
            >
              <div className="flex justify-center items-center mb-3">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-base-200 flex items-center justify-center shadow-md">
                  {user.photoUrl ? (
                    <img alt="user" src={user.photoUrl} className="object-cover w-full h-full" />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gray-500" />
                  )}
                </div>
              </div>
              <li>
                <Link to="/profile" className="justify-between">
                  Profile <span className="badge">New</span>
                </Link>
              </li>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/connections">Connections</Link></li>
              <li><Link to="/requests/received">Requests</Link></li>
              <li><Link to="/forgot-password">Forgot Password</Link></li>
              <li><button onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/login" className="btn btn-primary">Sign Up</Link>
        </div>
      )}
    </div>
  );
};

export default NavBar;