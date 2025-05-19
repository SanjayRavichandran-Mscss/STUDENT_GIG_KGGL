import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function SkillBasedTest() {
  const { id } = useParams(); // Get base64-encoded student_id from URL
  const studentId = atob(id); // Decode base64 to get student_id
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/skill-based-tests/${studentId}`,
          { withCredentials: true }
        );
        setTests(response.data);
        if (response.data.length === 0) {
          setError("No skill-based tests found.");
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch skill-based tests.");
        console.error("Error fetching tests:", err);
      }
    };
    fetchTests();
  }, [studentId]);

  const handleAttendTest = (testId) => {
    navigate(`/skill-test/${id}/${testId}`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Skill-Based Tests</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {tests.length === 0 && !error ? (
        <p className="text-gray-600">Loading tests...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div key={test.test_id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{test.test_name}</h2>
              <p className="text-gray-600 mb-2"><strong>Description:</strong> {test.test_description}</p>
              <p className="text-gray-600 mb-2"><strong>Skill:</strong> {test.skill_name}</p>
              <p className="text-gray-600 mb-2"><strong>Level:</strong> {test.level_name}</p>
              <p className="text-gray-600 mb-4"><strong>Total Questions:</strong> {test.total_no_of_questions}</p>
              <button
                onClick={() => handleAttendTest(test.test_id)}
                className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Attend Test
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}