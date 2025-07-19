import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from '../components/UserCard';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

const Feed = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const feed = useSelector((store) => store.feed);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const getFeed = async () => {
    if (feed) return;

    try {
      setLoading(true);
      const res = await axios.get(BASE_URL + '/user/feed', {
        withCredentials: true,
      });

      dispatch(addFeed(res.data));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  return (
    <div
      className="flex justify-center items-center"
      style={{
        minHeight: 'calc(100vh - 128px)',
        padding: '1rem',
      }}
    >
      {loading ? (
        <Loader className="animate-spin h-8 w-8 text-gray-500" />
      ) : feed?.data?.length > 0 ? (
        <UserCard userInfo={feed.data[0]} />
      ) : (
        <div className="text-center text-gray-500">
          No users in your feed right now.
        </div>
      )}
    </div>
  );
};

export default Feed;
