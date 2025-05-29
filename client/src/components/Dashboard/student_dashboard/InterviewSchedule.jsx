import React, { useState } from "react";
import { useParams } from "react-router-dom";
import StudentMenu from "./StudentMenu";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InterviewSchedule = () => {
  const { id } = useParams();
  const decodedId = atob(id);
  const [formData, setFormData] = useState({
    specializedIn: "",
    dateTime: "",
    preferredMode: "Online",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast.success("Interview request submitted successfully! Waiting for admin approval.", {
        position: "top-right",
        autoClose: 2000,
      });
      // Reset form
      setFormData({
        specializedIn: "",
        dateTime: "",
        preferredMode: "Online",
      });
    }, 1000);
  };

  // Get current date and time for min attribute
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDThh:mm

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Sidebar - Student Menu */}
      <div className="w-full md:w-64 bg-white shadow-md flex-shrink-0 border-r border-gray-200">
        <StudentMenu />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 rounded-lg mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Schedule Your Interview</h1>
            <p className="text-blue-100 text-sm mt-1">
              Select your preferred details to request an interview slot
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl shadow-lg p-6 sm:p-8">
            <div>
              <label
                htmlFor="specializedIn"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                You Specialized In
              </label>
              <input
                type="text"
                id="specializedIn"
                name="specializedIn"
                value={formData.specializedIn}
                onChange={handleChange}
                placeholder="e.g., Communication, Marketing, Tally, Excel"
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dateTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Date & Time
              </label>
              <input
                type="datetime-local"
                id="dateTime"
                name="dateTime"
                value={formData.dateTime}
                onChange={handleChange}
                min={minDateTime}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="preferredMode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Preferred Mode
              </label>
              <select
                id="preferredMode"
                name="preferredMode"
                value={formData.preferredMode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                required
              >
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center px-4 py-2 rounded-md text-white font-medium transition-colors ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        className="opacity-25"
                      ></circle>
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                        className="opacity-75"
                      ></path>
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Interview Request"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;