// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function AssignedTest() {
//   const { id } = useParams(); // Get base64-encoded student_id from URL
//   const studentId = atob(id); // Decode base64 to get student_id
//   const [tests, setTests] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/quiz/assigned-tests/${studentId}`,
//           { withCredentials: true }
//         );
//         setTests(response.data);
//         if (response.data.length === 0) {
//           setError("No assigned tests found.");
//         }
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch assigned tests.");
//         console.error("Error fetching tests:", err);
//       }
//     };
//     fetchTests();
//   }, [studentId]);

//   const handleAttendTest = (testId) => {
//     navigate(`/quiz/${id}/${testId}`);
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Tests</h1>
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//       {tests.length === 0 && !error ? (
//         <p className="text-gray-600">Loading tests...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tests.map((test) => (
//             <div key={test.test_id} className="bg-white rounded-lg shadow-md p-6">
//               <h2 className="text-xl font-semibold text-gray-800 mb-2">{test.test_name}</h2>
//               <p className="text-gray-600 mb-2"><strong>Description:</strong> {test.test_description}</p>
//               <p className="text-gray-600 mb-2"><strong>Skill:</strong> {test.skill_name}</p>
//               <p className="text-gray-600 mb-2"><strong>Level:</strong> {test.level_name}</p>
//               <p className="text-gray-600 mb-4"><strong>Total Questions:</strong> {test.total_no_of_questions}</p>
//               <button
//                 onClick={() => handleAttendTest(test.test_id)}
//                 className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
//               >
//                 Attend Test
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }










import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AssignedTest() {
  const { id } = useParams(); // Get base64-encoded student_id from URL
  const studentId = atob(id); // Decode base64 to get student_id
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/assigned-tests/${studentId}`,
          { withCredentials: true }
        );
        setTests(response.data);
        if (response.data.length === 0) {
          setError("No assigned tests found.");
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch assigned tests.");
        console.error("Error fetching tests:", err);
      }
    };
    fetchTests();
  }, [studentId]);

  const handleAttendTest = (testId) => {
    navigate(`/quiz/${id}/${testId}`);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Assigned Tests</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {tests.length === 0 && !error ? (
        <p className="text-gray-600">Loading tests...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={test.test_id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.test_name}</h3>
              <p className="text-gray-600 mb-4">{test.test_description || "No description available"}</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Skill:</strong> {test.skill_name}</p>
                <p><strong>Difficulty:</strong> {test.level_name}</p>
                <p><strong>Total Questions:</strong> {test.total_no_of_questions}</p>
                <p><strong>Easy Questions:</strong> {test.easy_level_question}</p>
                <p><strong>Medium Questions:</strong> {test.medium_level_question}</p>
                <p><strong>Hard Questions:</strong> {test.hard_level_question}</p>
                <p><strong>Easy Pass Mark:</strong> {test.easy_pass_mark}</p>
                <p><strong>Medium Pass Mark:</strong> {test.medium_pass_mark}</p>
                <p><strong>Hard Pass Mark:</strong> {test.hard_pass_mark}</p>
                <p><strong>Created At:</strong> {formatDate(test.created_at)}</p>
              </div>
              <button
                onClick={() => handleAttendTest(test.test_id)}
                className="w-full mt-4 py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition duration-200"
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