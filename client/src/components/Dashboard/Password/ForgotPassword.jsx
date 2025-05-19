import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: Passkey, 3: New Password
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(null); // null: not checked, true: exists, false: doesn't exist
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Check email existence
  const checkEmailExists = async (email) => {
    if (!validateEmail(email)) {
      setEmailExists(null);
      return;
    }

    setIsCheckingEmail(true);
    try {
      const response = await axios.post("http://103.118.158.24/api/api/stu/check-email", { email });
      setEmailExists(response.data.exists);
    } catch (error) {
      console.error("Error checking email:", error);
      setEmailExists(false);
      setErrors({ email: "Failed to verify email. Please try again." });
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Debounced version of checkEmailExists
  const debouncedCheckEmail = debounce(checkEmailExists, 500);

  // Run email check when email changes
  useEffect(() => {
    if (email) {
      debouncedCheckEmail(email);
    } else {
      setEmailExists(null);
    }
  }, [email]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePasskey = (passkey) => {
    return /^\d{8}$/.test(passkey);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address." });
      return;
    }

    if (!emailExists) {
      setErrors({ email: "This email is not registered." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://103.118.158.24/api/api/stu/forgot", { Email: email });
      if (response.data === "mail_sended") {
        setStep(2);
        alert("A passkey has been sent to your email.");
      } else {
        setErrors({ email: response.data.message || "Failed to send passkey. Please try again." });
      }
    } catch (error) {
      console.error("Error sending reset email:", error);
      setErrors({ email: error.response?.data?.message || "Failed to send passkey. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasskeySubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validatePasskey(passkey)) {
      setErrors({ passkey: "Passkey must be an 8-digit number." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://103.118.158.24/api/api/stu/verify-passkey", { email, passkey });
      if (response.data.status === "success") {
        setStep(3);
      } else {
        setErrors({ passkey: response.data.message || "Invalid passkey. Please try again." });
      }
    } catch (error) {
      console.error("Error verifying passkey:", error);
      setErrors({ passkey: error.response?.data?.message || "Invalid passkey. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validatePassword(newPassword)) {
      setErrors({ newPassword: "Password must be at least 8 characters long." });
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match." });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("http://103.118.158.24/api/api/stu/reset", {
        email,
        passkey,
        password: newPassword,
      });
      if (response.data === "password_updated") {
        alert("Password reset successfully!");
        navigate("/login");
      } else {
        setErrors({ general: response.data.message || "Failed to reset password. Please try again." });
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrors({ general: error.response?.data?.message || "Failed to reset password. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password</h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "Enter your registered email to receive a passkey."}
            {step === 2 && "Enter the 8-digit passkey sent to your email."}
            {step === 3 && "Set your new password."}
          </p>
        </div>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="you@example.com"
              />
              {isCheckingEmail && (
                <p className="mt-2 text-sm text-gray-500">Checking email...</p>
              )}
              {emailExists === false && email && validateEmail(email) && (
                <p className="mt-2 text-sm text-red-600">This email is not registered.</p>
              )}
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading || !emailExists || isCheckingEmail}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading || !emailExists || isCheckingEmail ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Send Passkey"
                )}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handlePasskeySubmit} className="space-y-6">
            <div>
              <label htmlFor="passkey" className="block text-sm font-medium text-gray-700">
                8-Digit Passkey
              </label>
              <input
                id="passkey"
                type="text"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter 8-digit passkey"
              />
              {errors.passkey && (
                <p className="mt-2 text-sm text-red-600">{errors.passkey}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Verify Passkey"
                )}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter new password"
              />
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading ? "opacity-50 cursor ForgotPassword.jsx-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Reset Password"
                )}
              </button>
            </div>
            {errors.general && (
              <p className="mt-2 text-sm text-red-600 text-center">{errors.general}</p>
            )}
          </form>
        )}

        <div className="mt-6 text-center">
          <a
            href="/login"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}