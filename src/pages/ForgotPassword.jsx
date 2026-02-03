import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { persistor } from "../utils/appStore";
import { removeUser } from "../utils/userSlice";
import axios from "axios";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import OtpInput from "../components/OtpInput";

const ForgotPassword = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const [step, setStep] = useState("EMAIL"); // EMAIL | OTP | RESET
  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // step 1 — send otp
  const sendOtp = async () => {
    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/profile/forgot-password/send-otp`, {
        emailId,
      });

      toast.success("OTP sent to your email");
      setStep("OTP");
    } catch (err) {
      const res = err?.response;
      if (res?.status === 429 && res.data?.retryAfter) {
        toast.error(
          `Too many attempts. Try again after ${new Date(
            res.data.retryAfter,
          ).toLocaleString()}`,
        );
      } else {
        toast.error(res?.data || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  }  

  // step 2 — verify otp
  const verifyOtp = async () => {
    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/profile/forgot-password/verify-otp`, {
        emailId,
        otp,
      });

      toast.success("OTP verified");
      setStep("RESET");
    } catch (err) {
      const res = err?.response;

      if (res?.status === 429 && res.data?.retryAfter) {
        toast.error(
          `Too many attempts. Try again after ${new Date(
            res.data.retryAfter,
          ).toLocaleString()}`,
        );
      } else {
        toast.error(res?.data || "Invalid OTP");
      }

    } finally {
      setLoading(false);
    }

  };

  // step 3 — reset password
  const resetPassword = async () => {
    try {
      setLoading(true);

      await axios.patch(`${BASE_URL}/profile/forgot-password/reset`, {
        emailId,
        newPassword,
      });

      toast.success("Password reset successful");

      setStep("EMAIL");
      setEmailId("");
      setOtp("");
      setNewPassword("");

      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true }); // for clearing the stored token in cookies

      dispatch(removeUser());
      await persistor.purge();

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);

    } catch (err) {
      const res = err?.response;

      toast.error(
        typeof res?.data === "string" ? res.data : "Password reset failed",
      );

    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="flex flex-1 items-center justify-center bg-base-100 mt-20">
      <div className="card w-full max-w-md bg-base-200/90 backdrop-blur border border-base-300 shadow-2xl">
        <div className="card-body space-y-5 px-8 py-10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-primary">Forgot Password</h2>
            <p className="text-sm text-base-content/70">
              Enter your email to receive a one-time password
            </p>
          </div>

          {/* step 1 — email */}
          {step === "EMAIL" && (
            <>
              <label className="form-control w-full space-y-2">
                <span className="label-text">Email</span>
                <div className="relative">
                  <input
                    type="email"
                    value={emailId}
                    onChange={(e) => setEmailId(e.target.value)}
                    disabled={loading}
                    className="input input-bordered w-full pl-10"
                    placeholder="example@mail.com"
                  />
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                  />
                </div>
              </label>

              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={sendOtp}
                disabled={loading || !emailId}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* step 2 — OTP */}
          {step === "OTP" && (
            <>
              <label className="form-control">
                <span className="label-text">Enter OTP</span>
                <OtpInput value={otp} onChange={setOtp} disabled={loading} />
              </label>

              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={verifyOtp}
                disabled={loading || otp.length !== 6}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* step 3 — reset password */}
          {step === "RESET" && (
            <>
              <label className="form-control">
                <span className="label-text">New Password</span>
                <div className="relative">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={loading}
                    className="input input-bordered w-full pl-10"
                    placeholder="New strong password"
                  />
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    size={18}
                  />
                </div>
              </label>

              <button
                className="btn btn-primary w-full flex items-center justify-center gap-2"
                onClick={resetPassword}
                disabled={loading || !newPassword}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;