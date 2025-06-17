import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";

export default function StudentLeaveForm() {
  const { id } = useParams();
  const decodedId = atob(id);
  const [formData, setFormData] = useState({
    startDate: null,
    endDate: null,
    reason: "",
    instructor: "",
  });
  const [admins, setAdmins] = useState([]);
  const [leaveHistory, setLeaveHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch admins for instructor dropdown
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get("https://gig.kggeniuslabs.com/api/api/stu/all-admins", {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.status === "success") {
          setAdmins(response.data.admins);
        } else {
          setError("Failed to load instructors.");
        }
      } catch (err) {
        console.error("Error fetching admins:", err);
        setError("Failed to load instructors. Please try again.");
      }
    };

    fetchAdmins();
  }, []);

  // Fetch leave history
  useEffect(() => {
    const fetchLeaveHistory = async () => {
      try {
        const response = await axios.get(`https://gig.kggeniuslabs.com/api/api/stu/leave-history/${decodedId}`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.status === "success") {
          setLeaveHistory(response.data.leaveHistory);
        }
      } catch (err) {
        console.error("Error fetching leave history:", err);
        setError("Failed to load leave history.");
      }
    };

    fetchLeaveHistory();
  }, [decodedId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date, name) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason || !formData.instructor) {
      setError("All fields are required.");
      toast.error("All fields are required.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (formData.startDate > formData.endDate) {
      setError("End date must be after start date.");
      toast.error("End date must be after start date.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("https://gig.kggeniuslabs.com/api/api/stu/apply-leave", {
        student_id: decodedId,
        instructor_id: formData.instructor,
        start_date: formData.startDate.toISOString().split("T")[0],
        end_date: formData.endDate.toISOString().split("T")[0],
        reason: formData.reason,
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.data.status === "success") {
        toast.success("Leave application submitted successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          startDate: null,
          endDate: null,
          reason: "",
          instructor: "",
        });
        // Refresh leave history
        const historyResponse = await axios.get(`https://gig.kggeniuslabs.com/api/api/stu/leave-history/${decodedId}`);
        if (historyResponse.data.status === "success") {
          setLeaveHistory(historyResponse.data.leaveHistory);
        }
      } else if (response.data.status === "email_failed") {
        toast.warn("Leave application submitted, but email failed to send.", {
          position: "top-right",
          autoClose: 3000,
        });
        setFormData({
          startDate: null,
          endDate: null,
          reason: "",
          instructor: "",
        });
        // Refresh leave history
        const historyResponse = await axios.get(`https://gig.kggeniuslabs.com/api/api/stu/leave-history/${decodedId}`);
        if (historyResponse.data.status === "success") {
          setLeaveHistory(historyResponse.data.leaveHistory);
        }
      } else {
        throw new Error("Submission failed.");
      }
    } catch (err) {
      console.error("Error submitting leave application:", err);
      toast.error("Failed to submit leave application.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-6 sm:py-8 lg:py-12 px-4 sm:px-6 lg:px-8">
      <ToastContainer />
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 transform transition-all duration-300 animate-fade-in">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg p-4 sm:p-5">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Apply for Leave</h2>
        </div>
        {error && (
          <p className="text-red-600 bg-red-50 p-3 rounded-lg mt-4 text-sm font-medium">{error}</p>
        )}
        <form className="space-y-5 sm:space-y-6 mt-5 sm:mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Instructor</label>
            <select
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors bg-white text-sm sm:text-base"
            >
              <option value="">Select Instructor</option>
              {admins.map((admin) => (
                <option key={admin.admin_id} value={admin.admin_id}>
                  {admin.admin_name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">From Date</label>
            <DatePicker
              selected={formData.startDate}
              onChange={(date) => handleDateChange(date, "startDate")}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-sm sm:text-base"
              placeholderText="Select start date"
              showPopperArrow={false}
              customInput={<input className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">To Date</label>
            <DatePicker
              selected={formData.endDate}
              onChange={(date) => handleDateChange(date, "endDate")}
              dateFormat="yyyy-MM-dd"
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors text-sm sm:text-base"
              placeholderText="Select end date"
              showPopperArrow={false}
              customInput={<input className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg" />}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-colors resize-none text-sm sm:text-base"
              rows="4"
              placeholder="Enter the reason for your leave"
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2.5 sm:p-3 rounded-lg text-white font-medium text-sm sm:text-base ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 transform hover:scale-[1.02] transition-all duration-200"
            }`}
          >
            {loading ? "Submitting..." : "Submit Leave Request"}
          </button>
        </form>
      </div>
      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-lg p-6 sm:p-8 mt-6 sm:mt-8 transform transition-all duration-300 animate-fade-in">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-5">Leave History</h3>
        {leaveHistory.length === 0 ? (
          <p className="text-gray-500 text-sm sm:text-base">No leave applications submitted yet.</p>
        ) : (
          <div className="space-y-4">
            {leaveHistory.map((leave) => (
              <div
                key={leave.id}
                className="border border-gray-200 rounded-lg p-4 sm:p-5 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
              >
                <p className="text-sm sm:text-base"><strong>Instructor:</strong> {leave.instructor_name}</p>
                <p className="text-sm sm:text-base"><strong>Start Date:</strong> {leave.start_date}</p>
                <p className="text-sm sm:text-base"><strong>End Date:</strong> {leave.end_date}</p>
                <p className="text-sm sm:text-base"><strong>Reason:</strong> {leave.reason}</p>
                <p className="text-sm sm:text-base"><strong>Submitted On:</strong> {new Date(leave.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}