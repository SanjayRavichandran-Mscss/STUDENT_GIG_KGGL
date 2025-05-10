import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AttendQuiz from "./AttendQuiz";

export default function AssignedTest() {
  const { id } = useParams(); // Get base64-encoded student_id from URL
  const studentId = atob(id); // Decode base64 to get student_id
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/assigned-tests/${studentId}`,
          { withCredentials: true }
        );
        setTests(response.data);
        // Select the first test by default (or implement test selection UI)
        if (response.data.length > 0) {
          setSelectedTest(response.data[0]);
        } else {
          setError("No assigned tests found.");
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch assigned tests.");
        console.error("Error fetching tests:", err);
      }
    };
    fetchTests();
  }, [studentId]);

  return (
    <div className="p-6">
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {tests.length === 0 && !error ? (
        <p className="text-gray-600">Loading tests...</p>
      ) : (
        <>
          {/* Optional: Add UI to select a test if multiple are assigned */}
          {selectedTest ? (
            <AttendQuiz test={selectedTest} />
          ) : (
            <p className="text-gray-600">No test selected.</p>
          )}
        </>
      )}
    </div>
  );
}