// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function MyTest() {
//   const { id } = useParams(); // Get base64-encoded student_id from URL
//   const studentId = atob(id); // Decode base64 to get student_id
//   const [tests, setTests] = useState([]);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchTests = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/quiz/all-tests/${studentId}`, {
//           withCredentials: true,
//         });

//         const allTests = response.data.map((test) => ({
//           ...test,
//           type: test.test_type, // Use test_type from API ('assigned' or 'skill')
//         }));

//         // Sort by created_at (newest first)
//         const sortedTests = allTests.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );

//         setTests(sortedTests);

//         if (sortedTests.length === 0) {
//           setError("No tests available. Please contact your instructor or update your skills.");
//         }
//       } catch (err) {
//         setError(err.response?.data?.msg || "Failed to fetch tests. Please try again later.");
//         console.error("Error fetching tests:", err);
//       }
//     };
//     fetchTests();
//   }, [studentId]);

//   const handleAttendTest = (testId, type) => {
//     navigate(`/attend-test/${id}/${testId}/${type}`);
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Tests</h1>
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//       {tests.length === 0 && !error ? (
//         <p className="text-gray-600">Loading tests...</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {tests.map((test) => (
//             <div
//               key={`${test.test_id}-${test.type}`}
//               className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
//             >
//               <h3 className="text-xl font-semibold text-gray-800 mb-2">
//                 {test.test_name}{" "}
//                 <span className="text-sm font-normal text-gray-500">
//                   ({test.type === "assigned" ? "Assigned" : "Skill-Based"})
//                 </span>
//               </h3>
//               <p className="text-gray-600 mb-4">{test.test_description || "No description available"}</p>
//               <div className="space-y-2 text-sm text-gray-700">
//                 <p><strong>Skill:</strong> {test.skill_name}</p>
//                 <p><strong>Difficulty:</strong> {test.level_name}</p>
//                 <p><strong>Total Questions:</strong> {test.total_no_of_questions}</p>
//                 <p><strong>Easy Questions:</strong> {test.easy_level_question}</p>
//                 <p><strong>Medium Questions:</strong> {test.medium_level_question}</p>
//                 <p><strong>Hard Questions:</strong> {test.hard_level_question}</p>
//                 <p><strong>Easy Pass Mark:</strong> {test.easy_pass_mark}</p>
//                 <p><strong>Medium Pass Mark:</strong> {test.medium_pass_mark}</p>
//                 <p><strong>Hard Pass Mark:</strong> {test.hard_pass_mark}</p>
//                 <p><strong>Created At:</strong> {formatDate(test.created_at)}</p>
//                 {test.error && (
//                   <p className="text-red-600"><strong>Error:</strong> {test.error}</p>
//                 )}
//               </div>
//               <button
//                 onClick={() => handleAttendTest(test.test_id, test.type)}
//                 disabled={!!test.error} // Disable button if test has an error
//                 className={`w-full mt-4 py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
//                   test.error ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
//                 }`}
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
import Datetime from "react-datetime";
import moment from "moment";
import "react-datetime/css/react-datetime.css";

// Component to display and manage available tests for a student
export default function MyTest() {
  const { id } = useParams(); // Get base64-encoded student_id from URL
  const studentId = atob(id); // Decode base64 to get student_id
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState({}); // Store test schedules { test_id: moment }
  const [enabledTests, setEnabledTests] = useState({}); // Store enabled test IDs { test_id: boolean }
  const navigate = useNavigate();

  // Duration for button enablement (in minutes)
  // To test different durations, change this value (e.g., 5 for 5 minutes, 60 for 1 hour)
  const ENABLE_DURATION_MINUTES = 45;

  // Fetch tests and schedules on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch tests
        const testsResponse = await axios.get(
          `http://localhost:5000/api/quiz/all-tests/${studentId}`,
          { withCredentials: true }
        );

        const allTests = testsResponse.data.map((test) => ({
          ...test,
          type: test.test_type, // Use test_type from API ('assigned' or 'skill')
        }));

        // Sort by created_at (newest first)
        const sortedTests = allTests.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );

        setTests(sortedTests);

        if (sortedTests.length === 0) {
          setError("No tests available. Please contact your instructor or update your skills.");
        }

        // Fetch schedules
        const schedulesResponse = await axios.get(
          `http://localhost:5000/api/quiz/schedules/${studentId}`,
          { withCredentials: true }
        );

        const schedulesMap = schedulesResponse.data.reduce((acc, schedule) => {
          acc[schedule.test_id] = moment(schedule.datetime);
          return acc;
        }, {});
        setSchedules(schedulesMap);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch tests or schedules. Please try again later.");
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [studentId]);

  // Check schedules and enable/disable buttons based on current time
  useEffect(() => {
    const interval = setInterval(() => {
      const now = moment();
      const newEnabledTests = {};

      Object.keys(schedules).forEach((testId) => {
        const scheduleTime = schedules[testId];
        if (!scheduleTime.isValid()) return;

        // Enable button if current time is within the enable duration
        const endTime = moment(scheduleTime).add(ENABLE_DURATION_MINUTES, "minutes");
        newEnabledTests[testId] = now.isSameOrAfter(scheduleTime) && now.isBefore(endTime);
      });

      setEnabledTests(newEnabledTests);
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [schedules]);

  // Handle DateTime change
  const handleDateTimeChange = async (testId, date) => {
    if (!moment.isMoment(date) || !date.isValid()) return;

    try {
      // Save schedule to backend
      await axios.post(
        "http://localhost:5000/api/quiz/schedule",
        {
          student_id: studentId,
          test_id: testId,
          datetime: date.format("YYYY-MM-DD HH:mm:ss"),
        },
        { withCredentials: true }
      );

      // Update local schedules
      setSchedules((prev) => ({
        ...prev,
        [testId]: date,
      }));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save schedule. Please try again.");
      console.error("Error saving schedule:", err);
    }
  };

  // Handle "Now" button click
  const handleSetNow = async (testId) => {
    const now = moment();
    await handleDateTimeChange(testId, now);
  };

  // Navigate to attend test
  const handleAttendTest = (testId, type) => {
    navigate(`/attend-test/${id}/${testId}/${type}`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Validate DateTime input (disable past dates)
  const isValidDate = (current) => {
    return current.isSameOrAfter(moment().startOf("minute"));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Tests</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {tests.length === 0 && !error ? (
        <p className="text-gray-600">Loading tests...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => (
            <div
              key={`${test.test_id}-${test.type}`}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {test.test_name}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({test.type === "assigned" ? "Assigned" : "Skill-Based"})
                </span>
              </h3>
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
                {test.error && (
                  <p className="text-red-600"><strong>Error:</strong> {test.error}</p>
                )}
              </div>
              {/* DateTime Picker Container */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule Test</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1">
                    <Datetime
                      value={schedules[test.test_id] || ""}
                      onChange={(date) => handleDateTimeChange(test.test_id, date)}
                      isValidDate={isValidDate}
                      inputProps={{
                        className:
                          "w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                        placeholder: "Select date and time",
                      }}
                      timeFormat="HH:mm"
                      dateFormat="DD-MM-YYYY"
                    />
                  </div>
                  <button
                    onClick={() => handleSetNow(test.test_id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200"
                  >
                    Now
                  </button>
                </div>
              </div>
              <button
                onClick={() => handleAttendTest(test.test_id, test.type)}
                disabled={!enabledTests[test.test_id] || !!test.error}
                className={`w-full mt-4 py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  !enabledTests[test.test_id] || test.error
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
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