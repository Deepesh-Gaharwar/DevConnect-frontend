import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { addRequests } from '../utils/requestSlice';
import { Loader } from 'lucide-react';

const Requests = () => {

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const dispatch = useDispatch();

    const requests = useSelector((store) => store.requests);

    const [loading, setLoading] = useState(false);

    const fetchRequests = async () => {
        setLoading(true);
        try {

            const res = await axios.get(BASE_URL + "/user/requests/received" ,
                {withCredentials : true},
            )

            // dispatch anction
            dispatch(addRequests(res?.data?.data));
            
        } catch (error) {
            console.log(error.message);
        } finally {
          setLoading(false);
        }
    }


     useEffect( () => {
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
      <div className="flex justify-center items-center h-[60vh]">
        <h1 className="text-2xl font-semibold text-gray-400">No Requests Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-center text-4xl font-bold text-white mb-10">Requests</h1>

      <div className="space-y-6">
        {requests.map((request, index) => {
          const { firstName, lastName, photoUrl, age, gender, about, skills } = request.fromUserId;

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center gap-6 p-6 bg-base-200 rounded-2xl shadow-lg"
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

              <div>
                 <button className="btn btn-primary mx-2">Reject</button>
                 <button className="btn btn-secondary mx-2">Accept</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;