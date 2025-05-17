// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// export default function UserScoreDetails() {
//   const { id } = useParams();
//   const decoded = atob(id);

//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

  
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get(`http://localhost:5000/stu/student-test-data/${decoded}`);
//         setData(response.data);

//         console.log(response.data)
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to load student data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [id]);

//   // Format date for display
//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   // Render loading state
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

//   const { student, testResults } = data;

//   return (
//     <div className="min-h-screen  p-6">
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">User Test Details</h1>

      
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//         <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <p className="text-sm font-medium text-gray-600">Name</p>
//             <p className="text-lg text-gray-800 capitalize">{student.name}</p>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Roll No</p>
//             <p className="text-lg text-gray-800">{student.roll_no || "N/A"}</p>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-600">Quiz Attempts</p>
//             <p className="text-lg text-gray-800">{student.quiz_attempts}</p>
//           </div>
//         </div>
//       </div>

      
//       <div className="bg-white rounded-lg shadow-md overflow-hidden">
//         <h2 className="text-xl font-semibold text-gray-800 p-6">Test Results</h2>
//         {testResults.length === 0 ? (
//           <p className="text-gray-600 p-6">No test results available.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Test ID
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Easy Score
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Medium Score
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Hard Score
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Total Score
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Attended At
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Percentage
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Student Level
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {testResults.map((result) => (
//                   <tr key={result.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.test_id}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.easy_score}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.medium_score}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.hard_score}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                       {result.total_score}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {formatDate(result.attend_at)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.percentage}%</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {result.student_level || "N/A"}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

















import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UserScoreDetails() {
  const { id } = useParams();
  const decoded = atob(id);

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/stu/student-test-data/${decoded}`);
        setData(response.data);

        console.log(response.data)
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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

  const { student, testResults,skillCount } = data;

  console.log(skillCount)

  return (
    <div className="min-h-screen  p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">User Test Details</h1>

      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Name</p>
            <p className="text-lg text-gray-800 capitalize">{student.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Roll No</p>
            <p className="text-lg text-gray-800">{student.roll_no || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Score</p>
            <p className="text-lg text-gray-800">{student.total_score || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">Total Test Assigned</p>
            <p className="text-lg text-gray-800">{JSON.stringify(skillCount)|| "N/A"}</p>
          </div>
        </div>
      </div>

      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold text-gray-800 p-6">Test Results</h2>
        {testResults.length === 0 ? (
          <p className="text-gray-600 p-6">No test results available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Easy Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Medium Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hard Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Attended At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Level
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testResults.map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.test_id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.easy_score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.medium_score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.hard_score}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                      {result.total_score}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(result.attend_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.percentage}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {result.student_level || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}