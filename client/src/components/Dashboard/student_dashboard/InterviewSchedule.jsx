import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StudentMenu from "./StudentMenu";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Mail } from "lucide-react";
import axios from "axios";

const InterviewSchedule = () => {
  const { id } = useParams();
  const decodedId = atob(id);
  const [studentData, setStudentData] = useState({
    name: "",
    roll_no: "",
    email: "",
    college_name: "",
    department: "",
    semester: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.get(
          `http://103.118.158.24/api/api /stu/get-non-tech-data/${decodedId}`,
          { withCredentials: true }
        );
        if (response.data.status) {
          setStudentData(response.data.msg);
        } else {
          setError(response.data.message || "Failed to fetch student details.");
          setStudentData({
            name: `Student ${decodedId}`,
            roll_no: "N/A",
            email: "N/A",
            college_name: "N/A",
            department: "N/A",
            semester: "N/A",
          });
        }
      } catch (err) {
        console.error("[fetchStudentData] Error:", err);
        setError("Failed to fetch student details.");
        setStudentData({
          name: `Student ${decodedId}`,
          roll_no: "N/A",
          email: "N/A",
          college_name: "N/A",
          department: "N/A",
          semester: "N/A",
        });
      }
    };
    fetchStudentData();
  }, [decodedId]);

  const handleGmailRedirect = () => {
    if (studentData.email && studentData.email !== "N/A") {
      const gmailUrl = `https://mail.google.com/mail/?authuser=${encodeURIComponent(studentData.email)}`;
      window.open(gmailUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Sidebar - Student Menu */}
      <div className="w-full md:w-64 bg-white shadow-md flex-shrink-0 border-r border-gray-200">
        <StudentMenu />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-200 animate-fade-in">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 text-center mb-3">
            Interview Schedule Notification
          </h2>
          <p className="text-gray-600 text-base sm:text-lg text-center mb-6">
            Dear <span className="font-medium text-blue-600">{studentData.name}</span>,
            <br />
            Please check your registered email. The admin will schedule your interview time.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Student Details</h3>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
              <p><span className="font-medium">Roll Number:</span> {studentData.roll_no}</p>
              <p><span className="font-medium">Name:</span> {studentData.name}</p>
              <p><span className="font-medium">Email:</span> {studentData.email}</p>
              <p><span className="font-medium">College:</span> {studentData.college_name}</p>
              <p><span className="font-medium">Department:</span> {studentData.department}</p>
              <p><span className="font-medium">Semester:</span> {studentData.semester}</p>
            </div>
          </div>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-4 text-sm text-center">
              {error}
            </div>
          )}
          <button
            onClick={handleGmailRedirect}
            disabled={!studentData.email || studentData.email === "N/A"}
            className={`w-full flex justify-center items-center px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${
              studentData.email && studentData.email !== "N/A"
                ? "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                : "bg-gray-400 cursor-not-allowed"
            }`}
            title={
              !studentData.email || studentData.email === "N/A"
                ? "Email not available"
                : "Open Gmail"
            }
          >
            Go to Gmail
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;