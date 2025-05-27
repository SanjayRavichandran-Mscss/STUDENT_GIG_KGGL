import axios from "axios";
import { useEffect, useState } from "react";

export default function Score() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/stu/all-students-test-data`);
        setData(response.data);
        console.log(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load students data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (!data || data.status !== "success" || !data.students || data.students.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg">No data available for students.</p>
      </div>
    );
  }

  // Prepare data for the consolidated table
  const tableRows = [];
  const seenCombinations = new Set();

  data.students.forEach((studentData) => {
    if (studentData.testResults.length === 0) {
      // If student has no test results, add a single row with student info
      tableRows.push({
        student: studentData.student,
        totalScore: 0,
        skillCount: studentData.skillCount || 0,
        testResult: null,
      });
    } else {
      // Filter unique test results by student name and test name
      const uniqueTestResults = [];
      const seenTestNames = new Set();

      studentData.testResults.forEach((result) => {
        const key = `${studentData.student.name}-${result.test_name}`;
        if (!seenTestNames.has(result.test_name)) {
          seenTestNames.add(result.test_name);
          seenCombinations.add(key);
          uniqueTestResults.push(result);
        }
      });

      // Calculate total score for unique test results
      const totalScore = uniqueTestResults.reduce((sum, r) => sum + (r.total_score || 0), 0);

      // Add a row for each unique test result
      uniqueTestResults.forEach((result) => {
        tableRows.push({
          student: studentData.student,
          totalScore,
          skillCount: studentData.skillCount || 0,
          testResult: result,
        });
      });
    }
  });

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Students Test Details</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {/* Student Information Columns */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Skills
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Score (All Tests)
                </th>

                {/* Test Result Columns */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Beginner Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Intermediate Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Advanced Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Score
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
              {tableRows.map((row, index) => (
                <tr key={`${row.student.student_id}-${row.testResult?.id || index}`} className="hover:bg-gray-50">
                  {/* Student Information */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                    {row.student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.student.roll_no || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.skillCount || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {row.totalScore}
                  </td>

                  {/* Test Result Data */}
                  {row.testResult ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testResult.test_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testResult.easy_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testResult.medium_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testResult.hard_score}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {row.testResult.total_score}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(row.testResult.attend_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.testResult.percentage}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {row.testResult.student_level || "N/A"}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 italic" colSpan={8}>
                        No test results available
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}