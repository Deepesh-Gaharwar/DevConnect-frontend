import React, { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [emailId, setEmailId] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    if ((emailId && oldPassword) || (!emailId && !oldPassword)) {
      setError('Please provide either your email or old password — not both.');
      return;
    }

    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/forgot-password`,
        {
          emailId: emailId || undefined,
          oldPassword: oldPassword || undefined,
          newPassword,
        },
        { withCredentials: true }
      );

      toast.info(res.data || 'Password updated successfully!');
      setEmailId('');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err?.response?.data || 'Something went wrong.');
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-base-100 px-4">
      <div className="card w-full max-w-md bg-base-200 shadow-xl rounded-lg">
        <div className="card-body space-y-5">
          <h2 className="card-title justify-center text-2xl font-bold text-primary">Forgot Password</h2>

          <p className="text-center text-sm text-gray-400 -mt-2">
            Enter <span className="font-semibold">either</span> your email or old password to verify — not both.
          </p>

          {/* Email Field */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Email (optional)</span>
            <div className="relative">
              <input
                type="email"
                value={emailId}
                placeholder="example@mail.com"
                className="input input-bordered w-full pl-10"
                onChange={(e) => setEmailId(e.target.value)}
              />
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content" />
            </div>
          </label>

          {/* Old Password Field */}
          <label className="form-control w-full">
            <span className="label-text mb-1">Old Password (optional)</span>
            <div className="relative">
              <input
                type={showOldPassword ? 'text' : 'password'}
                value={oldPassword}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-10"
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content" />
              {oldPassword && (
                <button
                  type="button"
                  onClick={() => setShowOldPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showOldPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
            </div>
          </label>

          {/* New Password Field */}
          <label className="form-control w-full">
            <span className="label-text mb-1">New Password</span>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                placeholder="••••••••"
                className="input input-bordered w-full pl-10 pr-10"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content" />
              {newPassword && (
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showNewPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              )}
            </div>
          </label>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <div className="card-actions justify-center mt-4">
            <button className="btn btn-primary w-60" onClick={handleSubmit}>
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
