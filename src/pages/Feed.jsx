import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from '../components/UserCard';

const Feed = () => {
    
    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const feed = useSelector( (store) => store.feed);

    const dispatch = useDispatch();

    const getFeed = async () => {

      if(feed) return;

      try {
              const res = await axios.get(BASE_URL + "/user/feed",
                {withCredentials : true}
              );
        
              // dispatch an action
              dispatch(addFeed(res.data));
      } catch (error) {

        console.log(error.mesage);
        
      }

    }

    // useEffect
    useEffect( () => {
      getFeed();

    }, []);
    
  return (

    feed && 
        (<div className='flex justify-center my-10'>

         <UserCard  userInfo ={feed.data[0]} />

        </div>)

  )
};

export default Feed