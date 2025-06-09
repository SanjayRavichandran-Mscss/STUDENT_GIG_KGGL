// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { IoClose } from "react-icons/io5";
// import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
// import "react-circular-progressbar/dist/styles.css";

// export default function UserScoreDetails() {
//   const { id } = useParams();
//   const decoded = atob(id);

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [totalTest, setTotalTest] = useState(0);
//   const [selectedPerformance, setSelectedPerformance] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:5000/api/stu/student-test-data/${decoded}`, {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//           },
//         });
//         // Filter unique test results by test_name and attach performance
//         const uniqueTestResults = [];
//         const seenTestNames = new Set();
//         response.data.testResults.forEach((result) => {
//           if (!seenTestNames.has(result.test_name)) {
//             seenTestNames.add(result.test_name);
//             uniqueTestResults.push({
//               ...result,
//               performance: response.data.studentperformance.find(
//                 (perf) => perf.test_id === result.test_id
//               ),
//             });
//           }
//         });
//         setData({
//           ...response.data,
//           testResults: uniqueTestResults,
//         });

//         const testsResponse = await axios.get(
//           `http://localhost:5000/api/test/all-tests/${decoded}`,
//           { withCredentials: true }
//         );

//         const allTests = testsResponse.data.map((test) => ({
//           ...test,
//           type: test.test_type,
//         }));

//         setTotalTest(allTests.length);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load student data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [decoded]);

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     try {
//       return new Date(dateString).toLocaleString("en-US", {
//         year: "numeric",
//         month: "short",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: true,
//         timeZone: "Asia/Kolkata",
//       });
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const formatDuration = (duration) => {
//     if (!duration) return "N/A";
//     try {
//       const [hours, minutes, seconds] = duration.split(":").map(Number);
//       return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
//     } catch {
//       return duration;
//     }
//   };

//   const closeModal = () => {
//     setSelectedPerformance(null);
//   };

//   const handleViewDetails = (performance) => {
//     setSelectedPerformance(performance);
//   };

//   const renderSkeleton = () => (
//     <div className="space-y-4">
//       {[...Array(5)].map((_, i) => (
//         <div key={i} className="animate-pulse flex space-x-4 p-4 bg-white rounded-lg shadow">
//           <div className="flex-1 space-y-3">
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             <div className="space-y-2">
//               <div className="h-3 bg-gray-200 rounded"></div>
//               <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-600 text-lg">{error}</p>
//       </div>
//     );
//   }

//   if (!data || data.status !== "success") {
//     return (
//       <div className="text-center py-10">
//         <p className="text-red-600 text-lg">No data available for this student.</p>
//       </div>
//     );
//   }

//   const { student, testResults, skillCount } = data;

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Your Test Details</h1>

//         <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <div>
//               <p className="text-sm font-medium text-gray-600">Name</p>
//               <p className="text-lg text-gray-800 capitalize">{student.name || "N/A"}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Roll No</p>
//               <p className="text-lg text-gray-800">{student.roll_no || "N/A"}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Tests Assigned</p>
//               <p className="text-lg text-gray-800">{totalTest || "N/A"}</p>
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600">Skills</p>
//               <p className="text-lg text-gray-800">{skillCount || "0"}</p>
//             </div>
//           </div>
//         </div>

//         {selectedPerformance && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             onClick={closeModal}
//           >
//             <div
//               className="relative bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <button
//                 className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
//                 onClick={closeModal}
//               >
//                 <IoClose className="h-6 w-6" />
//               </button>
//               <div className="space-y-6">
//                 {/* Top Container */}
//                 <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
//                   <h2 className="text-xl font-bold text-gray-800 mb-4">
//                     {selectedPerformance.test_details.test_name || "N/A"}
//                   </h2>
//                   <p className="text-sm text-gray-600 mb-4">
//                     {selectedPerformance.test_details.test_description || "No description available"}
//                   </p>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <div className="flex items-center justify-center">
//                       <div className="w-24 h-24">
//                         <CircularProgressbar
//                           value={parseFloat(selectedPerformance.percentage) || 0}
//                           text={`${parseFloat(selectedPerformance.percentage) || 0}%`}
//                           styles={buildStyles({
//                             pathColor: "#14b8a6",
//                             textColor: "#1f2937",
//                             trailColor: "#e5e7eb",
//                             textSize: "24px",
//                           })}
//                         />
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Total Score</span>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {selectedPerformance.total_score || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Duration</span>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {selectedPerformance.test_details.duration_minutes || "N/A"} min
//                         </p>
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Completed In</span>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {formatDuration(selectedPerformance.completed_duration) || "N/A"}
//                         </p>
//                       </div>
//                       <div>
//                         <span className="text-xs font-medium text-gray-500">Test Date</span>
//                         <p className="text-lg font-semibold text-gray-900">
//                           {formatDate(selectedPerformance.created_at) || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Bottom Container */}
//                 <div className="bg-white p-6 rounded-lg border border-gray-200">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions Attempted</h3>
//                   {selectedPerformance.questions.length === 0 ? (
//                     <p className="text-sm text-gray-500">No questions attempted.</p>
//                   ) : (
//                     <div className="space-y-4">
//                       {selectedPerformance.questions.map((q, index) => (
//                         <div key={q.question_id} className="border-b border-gray-200 pb-4">
//                           <div className="flex items-start space-x-2">
//                             <span className="text-sm font-medium text-gray-700">{index + 1}.</span>
//                             <p
//                               className="text-sm text-gray-900"
//                               dangerouslySetInnerHTML={{ __html: q.questions }}
//                             />
//                           </div>
//                           <div className="ml-6 mt-2 space-y-1">
//                             {q.option.map((opt, optIndex) => (
//                               <div
//                                 key={optIndex}
//                                 className={`text-sm ${
//                                   opt.option === q.correct_answer
//                                     ? "text-green-600 font-medium"
//                                     : opt.option === q.student_answer &&
//                                       q.student_answer !== q.correct_answer
//                                     ? "text-red-600"
//                                     : "text-gray-600"
//                                 }`}
//                               >
//                                 {String.fromCharCode(97 + optIndex)}. {opt.option}
//                                 {opt.option === q.correct_answer && " (Correct)"}
//                                 {opt.option === q.student_answer &&
//                                   opt.option !== q.correct_answer &&
//                                   " (Your Answer)"}
//                               </div>
//                             ))}
//                             <div className="text-sm text-gray-500 mt-2">
//                               <span className="font-medium">Correct Answer: </span>
//                               {q.correct_answer}
//                             </div>
//                             <div className="text-sm text-gray-500">
//                               <span className="font-medium">Your Answer: </span>
//                               {q.student_answer || "Not answered"}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-800 p-6">Test Results</h2>
//           {testResults.length === 0 ? (
//             <div className="p-8 text-center">
//               <svg
//                 className="mx-auto h-12 w-12 text-gray-400"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9.172 16.172a4 4 0 015.656 0M9 10h.001M15 10h.001M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                 />
//               </svg>
//               <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
//               <p className="mt-1 text-sm text-gray-500">No tests have been attempted yet.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Test Details
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Performance
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Results
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {testResults.map((result) => (
//                     <tr key={result.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4">
//                         <div className="text-sm text-gray-900 font-medium">{result.test_name || "N/A"}</div>
//                         <div className="text-sm text-gray-500">{formatDate(result.attend_at)}</div>
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="grid grid-cols-3 gap-4">
//                           <div>
//                             <div className="text-xs text-gray-500">Beg.</div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {result.easy_score ?? "N/A"} / {result.easy_attended || "N/A"}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-500">Int.</div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {result.medium_score ?? "N/A"} / {result.medium_attended || "N/A"}
//                             </div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-500">Adv.</div>
//                             <div className="text-sm font-medium text-gray-900">
//                               {result.hard_score ?? "N/A"} / {result.hard_attended || "N/A"}
//                             </div>
//                           </div>
//                         </div>
//                         {result.performance && (
//                           <button
//                             onClick={() => handleViewDetails(result.performance)}
//                             className="mt-4 px-6 py-3 bg-teal-600 text-white rounded-md text-sm font-medium hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 transition duration-200"
//                           >
//                             View Details
//                           </button>
//                         )}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="flex items-center space-x-4">
//                           <div>
//                             <div className="text-xs text-gray-500">Total</div>
//                             <div className="text-sm font-medium text-blue-600">{result.total_score ?? "N/A"}</div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-500">Percentage</div>
//                             <div className="text-sm font-medium">{result.percentage ? `${result.percentage}%` : "N/A"}</div>
//                           </div>
//                           <div>
//                             <div className="text-xs text-gray-500">Level</div>
//                             <div
//                               className={`text-sm font-medium ${
//                                 result.student_level === "Advanced" || result.student_level === "Hard"
//                                   ? "text-green-600"
//                                   : result.student_level === "Intermediate" || result.student_level === "Medium"
//                                   ? "text-yellow-600"
//                                   : "text-red-600"
//                               }`}
//                             >
//                               {result.student_level || "N/A"}
//                             </div>
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }



















import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { X, Clock, Award, BarChart2, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp, BookOpen, Gauge, Trophy, Star, Zap } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";

export default function UserScoreDetails() {
  const { id } = useParams();
  let decoded;
  try {
    decoded = atob(id);
  } catch (e) {
    console.error("Failed to decode ID:", e);
    decoded = null;
  }

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTest, setTotalTest] = useState(0);
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [expandedTest, setExpandedTest] = useState(null);

  useEffect(() => {
    if (!decoded) {
      setError("Invalid student ID.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/stu/student-test-data/${decoded}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const uniqueTestResults = [];
        const seenTestNames = new Set();
        (response.data.testResults || []).forEach((result) => {
          if (!seenTestNames.has(result.test_name)) {
            seenTestNames.add(result.test_name);
            uniqueTestResults.push({
              ...result,
              performance: response.data.studentperformance?.find(
                (perf) => perf.test_id === result.test_id
              ),
            });
          }
        });

        // Sort tests by most recent first
        const sortedTests = uniqueTestResults.sort((a, b) => {
          return new Date(b.attend_at) - new Date(a.attend_at);
        });

        setData({
          ...response.data,
          testResults: sortedTests,
        });

        const testsResponse = await axios.get(
          `http://localhost:5000/api/test/all-tests/${decoded}`,
          { withCredentials: true }
        );

        const allTests = testsResponse.data.map((test) => ({
          ...test,
          type: test.test_type,
        }));

        setTotalTest(allTests.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [decoded]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata",
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatDuration = (duration) => {
    if (!duration) return "N/A";
    try {
      const [hours, minutes, seconds] = duration.split(":").map(Number);
      return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
    } catch {
      return duration;
    }
  };

  const getPerformanceRemark = (percentage) => {
    const percent = parseFloat(percentage) || 0;
    if (percent >= 90) return "Outstanding! Keep it up!";
    if (percent >= 75) return "Excellent performance!";
    if (percent >= 60) return "Good job! You're doing well";
    if (percent >= 40) return "Not bad! Keep practicing";
    return "Keep working hard! You'll improve";
  };

  const closeModal = () => {
    setSelectedPerformance(null);
  };

  const toggleTestDetails = (testId) => {
    if (expandedTest === testId) {
      setExpandedTest(null);
    } else {
      setExpandedTest(testId);
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4 p-4 bg-white rounded-lg shadow">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {renderSkeleton()}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!data || data.status !== "success") {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg">No data available for this student.</p>
      </div>
    );
  }

  const { student, testResults, skillCount } = data;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-blue-800">Student roll number:</span>
            <span className="text-sm font-semibold text-blue-900">{student.roll_no || "N/A"}</span>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-indigo-600">
                    {student.name ? student.name.charAt(0).toUpperCase() : "?"}
                  </span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 capitalize">{student.name || "N/A"}</h2>
                <p className="text-sm text-gray-600">Test Performance Overview</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white p-3 rounded-lg shadow-xs text-center">
                <p className="text-xs font-medium text-gray-500">Tests Assigned</p>
                <p className="text-lg font-bold text-indigo-600">{totalTest || "0"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs text-center">
                <p className="text-xs font-medium text-gray-500">Tests Completed</p>
                <p className="text-lg font-bold text-indigo-600">{testResults.length || "0"}</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-xs text-center">
                <p className="text-xs font-medium text-gray-500">Skills</p>
                <p className="text-lg font-bold text-indigo-600">{skillCount || "0"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Modal */}
        <AnimatePresence>
          {selectedPerformance && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={closeModal}
                >
                  <X className="h-6 w-6" />
                </button>

                <div className="p-6 space-y-6">
                  {/* Test Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                          {selectedPerformance.test_details?.test_name || "N/A"}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedPerformance.test_details?.test_description || "No description available"}
                        </p>
                      </div>
                      <div className="mt-4 md:mt-0 flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-50 rounded-full">
                              <Clock className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Test Duration</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDuration(selectedPerformance.test_details?.duration) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg shadow-xs">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-green-50 rounded-full">
                              <Zap className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-gray-500">Completed In</p>
                              <p className="text-sm font-semibold text-gray-900">
                                {formatDuration(selectedPerformance.completed_duration) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Questions Section */}
                  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-xs">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                      <span>Questions Attempted</span>
                      <span className="text-sm font-normal text-gray-500 ml-2">
                        ({selectedPerformance.questions?.length || 0} questions)
                      </span>
                    </h3>

                    {selectedPerformance.questions?.length === 0 ? (
                      <div className="text-center py-8">
                        <div className="mx-auto h-16 w-16 text-gray-400">
                          <XCircle className="h-full w-full" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No questions attempted</h3>
                        <p className="mt-1 text-sm text-gray-500">This test doesn't have any attempted questions.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {selectedPerformance.questions.map((q, index) => (
                          <div key={q.question_id} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                            <div className="flex items-start space-x-3">
                              <span
                                className={`inline-flex items-center justify-center h-6 w-6 rounded-full text-xs font-medium mt-1 ${
                                  q.student_answer === q.correct_answer
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {index + 1}
                              </span>
                              <div className="flex-1">
                                <p
                                  className="text-sm text-gray-900 mb-2"
                                  dangerouslySetInnerHTML={{ __html: q.questions }}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                  {q.option.map((opt, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`text-sm p-2 rounded-md border ${
                                        opt.option === q.correct_answer
                                          ? "bg-green-50 border-green-200 text-green-800 font-medium"
                                          : opt.option === q.student_answer &&
                                            q.student_answer !== q.correct_answer
                                          ? "bg-red-50 border-red-200 text-red-800"
                                          : "bg-gray-50 border-gray-200 text-gray-700"
                                      }`}
                                    >
                                      <div className="flex items-center">
                                        {opt.option === q.correct_answer ? (
                                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                        ) : opt.option === q.student_answer &&
                                          q.student_answer !== q.correct_answer ? (
                                          <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                        ) : (
                                          <span className="h-4 w-4 mr-2 text-gray-400">
                                            {String.fromCharCode(97 + optIndex)}.
                                          </span>
                                        )}
                                        {opt.option}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="mt-3 flex flex-wrap gap-2">
                                  <div className="text-xs px-2 py-1 bg-blue-50 text-blue-800 rounded-full">
                                    <span className="font-medium">Correct: </span>
                                    {q.correct_answer}
                                  </div>
                                  <div
                                    className={`text-xs px-2 py-1 rounded-full ${
                                      q.student_answer === q.correct_answer
                                        ? "bg-green-50 text-green-800"
                                        : "bg-red-50 text-red-800"
                                    }`}
                                  >
                                    <span className="font-medium">Your Answer: </span>
                                    {q.student_answer || "Not answered"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Test Results Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Test Attempts</h2>
          
          {testResults.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl shadow-sm">
              <svg
                className="mx-auto h-16 w-16 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-3 text-lg font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">No tests have been completed yet.</p>
            </div>
          ) : (
            testResults.map((result) => (
              <div key={result.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleTestDetails(result.id)}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-medium">
                          {result.test_name ? result.test_name.charAt(0).toUpperCase() : "T"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800">{result.test_name || "N/A"}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(result.attend_at)}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Score</div>
                        <div className="text-xl font-bold text-blue-600">{result.total_score ?? "0"}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">Percentage</div>
                        <div
                          className={`text-xl font-bold ${
                            parseFloat(result.percentage) >= 70
                              ? "text-green-600"
                              : parseFloat(result.percentage) >= 40
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {result.percentage ? `${result.percentage}%` : "0%"}
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="text-xs text-gray-500">Difficulty</div>
                        <div
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            result.student_level === "Advanced" || result.student_level === "Hard"
                              ? "bg-green-100 text-green-800"
                              : result.student_level === "Intermediate" || result.student_level === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {result.student_level || "N/A"}
                        </div>
                      </div>
                      <div className="hidden md:block">
                        <div className="text-xs text-gray-500">Performance</div>
                        <div className="text-sm font-medium text-indigo-600">
                          {getPerformanceRemark(result.percentage)}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTestDetails(result.id);
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {expandedTest === result.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedTest === result.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                        <div className="mb-6">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Difficulty Breakdown</h4>
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-green-50 p-3 rounded-lg text-center">
                              <p className="text-xs font-medium text-green-800">Beginner</p>
                              <p className="text-lg font-bold text-green-600">
                                {result.easy_score ?? "0"}
                                <span className="text-sm font-normal text-green-500"> / {result.easy_attended || "0"}</span>
                              </p>
                            </div>
                            <div className="bg-yellow-50 p-3 rounded-lg text-center">
                              <p className="text-xs font-medium text-yellow-800">Intermediate</p>
                              <p className="text-lg font-bold text-yellow-600">
                                {result.medium_score ?? "0"}
                                <span className="text-sm font-normal text-yellow-500"> / {result.medium_attended || "0"}</span>
                              </p>
                            </div>
                            <div className="bg-red-50 p-3 rounded-lg text-center">
                              <p className="text-xs font-medium text-red-800">Advanced</p>
                              <p className="text-lg font-bold text-red-600">
                                {result.hard_score ?? "0"}
                                <span className="text-sm font-normal text-red-500"> / {result.hard_attended || "0"}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="w-full mb-6">
                          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-indigo-600 rounded-full"
                              style={{
                                width: `${result.percentage || 0}%`,
                                transition: 'width 0.5s ease-in-out'
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-xs text-gray-500">0%</span>
                            <span className="text-xs font-medium text-indigo-600">{result.percentage || 0}%</span>
                            <span className="text-xs text-gray-500">100%</span>
                          </div>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => {
                              setSelectedPerformance(result.performance);
                              setExpandedTest(null);
                            }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Details
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}