import React, { useState } from 'react';
import UserCard from './UserCard';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { toast } from 'react-toastify';

const EditProfile = ({ user }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [about, setAbout] = useState(user.about || "");
  const [skills, setSkills] = useState(user.skills?.join(", ") || "");
  const [error, setError] = useState('');

  const saveProfile = async () => {
    setError("");

    try {
      const skillsArray = skills.split(",").map(skill => skill.trim());

      const res = await axios.patch(BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about, skills: skillsArray },
        { withCredentials: true },
      );

      dispatch(addUser(res.data.data));
      toast.info("Profile Updated Successfully!");
    } catch (error) {
      toast.error(error?.response?.data);
      setError(error?.response?.data);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-stretch gap-10 px-4 py-10 max-w-7xl mx-auto">

      {/* Left Side - Edit Form */}
      <div className="card w-full max-w-2xl bg-base-200 shadow-xl mx-auto">
        <div className="card-body space-y-4">
          <h2 className="card-title justify-center text-2xl font-bold text-primary">Edit Profile</h2>

          {/* First + Last Name */}
          <div className="flex gap-4">
            <label className="form-control w-full">
              <span className="label-text mb-1">First Name</span>
              <input
                type="text"
                value={firstName}
                className='input input-bordered w-full'
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Last Name</span>
              <input
                type="text"
                value={lastName}
                className='input input-bordered w-full'
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>

          {/* Age + Gender */}
          <div className="flex gap-4">
            <label className="form-control w-full">
              <span className="label-text mb-1">Age</span>
              <input
                type="text"
                value={age}
                className='input input-bordered w-full'
                onChange={(e) => setAge(e.target.value)}
              />
            </label>

            <label className="form-control w-full">
              <span className="label-text mb-1">Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </label>
          </div>

          {/* Photo URL */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Photo URL</span>
            <input
              type="text"
              value={photoUrl}
              className='input input-bordered w-full'
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </label>

          {/* Skills */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Skills</span>
            <input
              type="text"
              value={skills}
              className='input input-bordered w-full'
              onChange={(e) => setSkills(e.target.value)}
            />
          </label>

          {/* About */}
          <label className="form-control w-full">
            <span className="label-text mb-1">About</span>
            <textarea
              value={about}
              className='textarea textarea-bordered w-full'
              onChange={(e) => setAbout(e.target.value)}
              placeholder="About"
            />
          </label>

          {/* Error Message */}
          <p className='text-red-500'>{error}</p>

          {/* Save Button */}
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary" onClick={saveProfile}>
              Save Profile
            </button>
          </div>
        </div>
      </div>

      {/* Right Side - User Card Preview */}
      <div className="flex justify-center w-full max-w-2xl mx-auto">
        <UserCard userInfo={{ firstName, lastName, photoUrl, age, gender, about, skills }} />
      </div>
    </div>
  );
};

export default EditProfile;
