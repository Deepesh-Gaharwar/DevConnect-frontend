import React, { useEffect, useState } from "react";
import NavBar from "./NavBar";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addUser, removeUser } from "../utils/userSlice";
import { persistor } from "../utils/appStore";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";

const Body = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const userData = useSelector((store) => store.user);
  const isAuthenticated = Boolean(userData?._id);

  const [loading, setLoading] = useState(true);
  const pathname = location.pathname;

  useEffect(() => {
    // Public routes → no auth check
    if (["/login", "/signup", "/forgot-password"].includes(pathname)) {
      setLoading(false);
      return;
    }

    // Verify auth with backend
    axios
      .get(`${BASE_URL}/profile/view`, { withCredentials: true })
      .then((res) => {
        dispatch(addUser(res.data)); // backend says logged in
        setLoading(false);
      })
      .catch((error) => {
        // Expected case: user is NOT logged in
        if (error.response?.status === 401 || error.response?.status === 400) {
          dispatch(removeUser());
          persistor.purge();
          setLoading(false);
          navigate("/login");
          return; // do NOT treat as error
        }

        // Unexpected error (server down, 500, etc.)
        dispatch(removeUser());
        persistor.purge();
        setLoading(false);
        toast.error("Please try again! After some time..");
        navigate("/login");
      });
  }, [pathname, BASE_URL, dispatch, navigate]);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
        <Loader className="w-12 h-12 text-primary animate-spin" />
        <p className="mt-4 text-sm text-gray-500">Loading your experience...</p>
      </div>
    );
  }

  const isLoginRoute = pathname === "/login";
  const isForgotPasswordRoute = pathname === "/forgot-password";

  return (
    <div className="flex flex-col min-h-screen bg-base-100">
      <NavBar />
      <div className="flex-grow px-4 pb-8">
        {!isLoginRoute && !isForgotPasswordRoute && !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <Loader className="w-12 h-12 text-primary animate-spin" />
            <p className="mt-4 text-sm text-gray-500">
              Redirecting to login...
            </p>
          </div>
        ) : (
          <Outlet />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Body;
