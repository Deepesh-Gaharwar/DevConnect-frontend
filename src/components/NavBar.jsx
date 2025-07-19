import React from 'react'
import { useSelector } from 'react-redux'
import { UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const NavBar = () => {

    const user = useSelector(store => store.user);
    console.log("User ", user);

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
                                <li><a>Settings</a></li>
                                <li><a>Logout</a></li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default NavBar;
