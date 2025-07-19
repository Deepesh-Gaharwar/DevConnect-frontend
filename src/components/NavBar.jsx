import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { removeUser } from '../utils/userSlice';
import { toast } from 'react-toastify';

const NavBar = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL ;

    const user = useSelector(store => store.user);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {

            await axios.post(
                BASE_URL + "/logout",
                { },
                {withCredentials : true}
            )

          // dispatch an action
          dispatch(removeUser());

          toast.success("Logged Out Successfully!");

          navigate("/login");
            
        } catch (error) {
            toast.error(error.message);
        }
    }



    return (
        <div className="navbar bg-base-300 shadow-sm">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost text-xl">🧑🏻‍💻 DevTinder</Link>
            </div>

            <div className="flex items-center gap-2">
                {user && (
                    <>
                        <span className="text-sm font-medium hidden sm:block">
                            Welcome, {user.firstName}
                        </span>

                        <div className="dropdown dropdown-end mx-5">
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full overflow-hidden flex items-center justify-center bg-base-200">
                                    {user.photoUrl ? (
                                        <img
                                            alt="user photo"
                                            src={user.photoUrl}
                                        />
                                    ) : (
                                        <UserCircle className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
                            >
                                <li>
                                    <Link to="/profile" className="justify-between">
                                        Profile
                                        <span className="badge">New</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/connections" >Connections</Link>
                                </li>
                                <li>
                                    <Link  onClick={handleLogout}>Logout</Link>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;
