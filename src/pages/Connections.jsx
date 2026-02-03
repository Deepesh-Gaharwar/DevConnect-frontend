import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addConnections } from '../utils/connectionSlice';
import { Loader, Users2, MessageCircle } from "lucide-react";
import { Link } from 'react-router-dom';

const Connections = () => {

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);

  const [loading, setLoading] = useState(false);

  const fetchConnections = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  if (!connections || connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-3 text-gray-400">
        <Users2 className="w-12 h-12" />
        <h1 className="text-2xl font-semibold">No Connections Found</h1>
        <p className="text-sm text-gray-500">Start building your network — connect with like-minded people!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <h1 className="text-center text-4xl font-bold text-white mb-10">
        Your Connections
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {connections.map((connection) => {
          const {
            _id,
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
            skills,
          } = connection;

          return (
            <div
              key={_id}
              className="flex flex-col md:flex-row items-center gap-6 p-6 bg-base-200 rounded-2xl shadow-lg h-full"
            >
              <div>
                <img
                  alt="User"
                  src={photoUrl}
                  className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-primary"
                />
              </div>

              <div className="text-left flex-1 space-y-2">
                <h2 className="text-2xl font-bold text-white">
                  {firstName} {lastName}
                </h2>

                <h3 className="text-sm text-gray-400">
                  {age &&
                    gender &&
                    `${age}, ${gender.charAt(0).toUpperCase() + gender.slice(1)}`}
                </h3>

                {skills && skills.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="badge badge-primary badge-outline text-sm px-3 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {about && <p className="text-gray-300 mt-2">{about}</p>}
              </div>

              {/* chat */}
              <Link to={`/chat/${_id}`}>
                <button className="btn btn-primary rounded-4xl flex items-center gap-2">
                  <MessageCircle size={18} />
                  Chat
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
