import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRequests, removeRequest } from '../utils/requestSlice';
import { Loader, MailX  } from 'lucide-react';

const Requests = () => {

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const dispatch = useDispatch();

  const requests = useSelector((store) => store.requests);

  const [loading, setLoading] = useState(false);

  const handleReviewRequest = async (status, _id) => {
    try {
       await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(_id));
    } catch (error) {
      return error.message;
    }
  };

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/user/requests/received`, {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data));
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader className="animate-spin w-12 h-12 text-primary" />
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-3 text-gray-400">
        <MailX className="w-12 h-12" />
        <h1 className="text-2xl font-semibold">No Requests Found</h1>
        <p className="text-sm text-gray-500">You're all caught up! New requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pt-4 pb-10 px-4">
      <h1 className="text-center text-4xl font-bold text-white mb-10">Requests</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {requests.map((request, index) => {
          const { firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId;

          return (
            <div
              key={index}
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
                  {age && gender && `${age}, ${gender.charAt(0).toUpperCase() + gender.slice(1)}`}
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

              <div className="flex gap-2 mt-4 my-2 md:mt-0 md:flex-col">
                <button
                  className="btn btn-primary"
                  onClick={() => handleReviewRequest('rejected', request._id)}
                >
                  Reject
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={() => handleReviewRequest('accepted', request._id)}
                >
                  Accept
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
