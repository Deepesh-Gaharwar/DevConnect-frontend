import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Check, Crown, Sparkles, Zap, Shield } from "lucide-react";

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(null);
  const [error, setError] = useState("");
  const [checkingPremium, setCheckingPremium] = useState(true);

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    try {
      setCheckingPremium(true);
      const res = await axios.get(BASE_URL + "/premium/verify", {
        withCredentials: true,
      });

      if (res.data.isPremium) {
        setIsUserPremium(true);
      }
    } catch (err) {
      console.error("Error verifying premium status:", err);
      setError("Failed to verify premium status. Please try again.");
    } finally {
      setCheckingPremium(false);
    }
  };

  const handleBuyClick = async (type) => {
    try {
      setLoadingPlan(type);
      setError("");

      const order = await axios.post(
        BASE_URL + "/payment/create",
        {
          membershipType: type,
        },
        {
          withCredentials: true,
        },
      );

      const { amount, currency, notes, orderId } = order.data;

      // Open Razorpay Checkout
      const options = {
        key: RAZORPAY_KEY_ID,
        amount,
        currency,
        name: "DevConnect",
        description: "Connect to other developers",
        order_id: orderId,
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
          contact: notes.phoneNumber || "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        handler: async function (response) {
          try {
            // Verify payment on backend
            const verifyRes = await axios.get(
              BASE_URL + "/premium/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                withCredentials: true,
              },
            );

            if (verifyRes.data.success) {
              // Refresh premium status
              await verifyPremiumUser();
            } else {
              setError("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Payment verification error:", err);
            setError("Payment verification failed. Please contact support.");
          } finally {
            setLoadingPlan(null);
          }
        },
        modal: {
          ondismiss: function () {
            setLoadingPlan(null);
            setError(
              "Payment cancelled. Please try again if you wish to upgrade.",
            );
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        setLoadingPlan(null);
        setError(
          response.error.description || "Payment failed. Please try again.",
        );
      });

      rzp.open();
    } catch (err) {
      console.error("Error creating order:", err);
      setError(
        err.response?.data?.message ||
          "Failed to initiate payment. Please try again.",
      );
      setLoadingPlan(null);
    }
  };

  // Loading State
  if (checkingPremium) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Checking premium status...</p>
        </div>
      </div>
    );
  }

  // Premium Active State
  if (isUserPremium) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full"
        >
          <div className="bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-700">
            {/* Crown Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-4 rounded-full">
                <Crown className="w-12 h-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              You're a Premium Member!
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Enjoy unlimited connections and exclusive perks
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-200">
                  Unlimited Requests
                </p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                <Shield className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-200">
                  Verified Badge
                </p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-xl border border-gray-600">
                <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-200">
                  Exclusive Features
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Plans Selection
  return (
    <div className="min-h-screen bg-gray-900 p-6 md:p-8">
      <div className="max-w-6xl mx-auto bg-gray-800/30 rounded-3xl p-6 md:p-10 border border-gray-700/50">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-medium mb-4 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
            Unlock Premium Features
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Choose Your Premium Plan
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Supercharge your networking journey with unlimited connections and
            exclusive benefits
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto mb-10 mt-6"
          >
            <div className="bg-red-500/5 border border-red-500/20 text-red-300/70 px-6 py-3.5 rounded-full flex items-center justify-center gap-3">
              <div className="bg-red-500/10 rounded-full p-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}

        {/* Plans */}
        <div className="grid md:grid-cols-[1fr_1.15fr] gap-6 max-w-5xl mx-auto items-start">
          {/* Silver Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Icon */}
            <div className="bg-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-6 border border-blue-500/20">
              <Shield className="w-7 h-7 text-blue-400" />
            </div>

            {/* Plan Info */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Silver Membership
            </h2>
            <p className="text-gray-400 mb-6">Perfect for getting started</p>

            {/* Features */}
            <ul className="space-y-3 mb-8">
              {[
                "Chat with developers",
                "100 connection requests / day",
                "Blue verification tick",
                "Valid for 3 months",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-300">
                  <div className="bg-blue-500/20 rounded-full p-0.5 mt-0.5">
                    <Check className="w-4 h-4 text-blue-400" />
                  </div>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹499</span>
              <span className="text-gray-400 ml-2">/ 3 months</span>
            </div>

            {/* Button */}
            <button
              disabled={loadingPlan !== null}
              onClick={() => handleBuyClick("silver")}
              className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center cursor-pointer ${
                loadingPlan === "silver"
                  ? "bg-blue-500/50 cursor-not-allowed text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {loadingPlan === "silver" ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Get Silver
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </motion.div>

          {/* Gold Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-9 border-2 border-yellow-500/40 hover:border-yellow-500/60 transition-all duration-300 relative shadow-lg shadow-yellow-500/5"
          >
            {/* Popular Badge */}
            <div className="absolute -top-3 right-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-5 py-1.5 rounded-full text-sm font-bold shadow-lg">
              ⭐ Most Popular
            </div>

            {/* Icon */}
            <div className="bg-yellow-500/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6 border border-yellow-500/30">
              <Crown className="w-8 h-8 text-yellow-400" />
            </div>

            {/* Plan Info */}
            <h2 className="text-2xl font-bold text-white mb-2">
              Gold Membership
            </h2>
            <p className="text-gray-300 mb-7">Best value for professionals</p>

            {/* Features */}
            <ul className="space-y-4 mb-8">
              {[
                "Chat with developers",
                "Unlimited connection requests",
                "Blue verification tick",
                "Valid for 6 months",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-start gap-3 text-gray-200">
                  <div className="bg-yellow-500/30 rounded-full p-0.5 mt-0.5">
                    <Check className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">₹899</span>
              <span className="text-gray-300 ml-2">/ 6 months</span>
            </div>

            {/* Button */}
            <button
              disabled={loadingPlan !== null}
              onClick={() => handleBuyClick("gold")}
              className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center cursor-pointer ${
                loadingPlan === "gold"
                  ? "bg-gradient-to-r from-yellow-400/50 to-orange-400/50 cursor-not-allowed text-gray-900"
                  : "bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-gray-900 shadow-lg shadow-yellow-500/20"
              }`}
            >
              {loadingPlan === "gold" ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  Get Gold
                  <Crown className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Footer */}
        <div className="mt-16 mb-8 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-gray-800 text-gray-300 px-6 py-3 rounded-full border border-gray-700">
            <Shield className="w-5 h-5 text-blue-400" />
            Secure payments powered by Razorpay
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
