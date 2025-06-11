import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Datetime from "react-datetime";
import moment from "moment";
import "react-datetime/css/react-datetime.css";

// Component to display and manage available tests for a student
export default function MyTest() {
  const { id } = useParams(); // Get base64-encoded student_id from URL
  const navigate = useNavigate();
  const studentId = atob(id); // Decode base64 to get student_id
  const [tests, setTests] = useState([]);
  const [error, setError] = useState("");
  const [schedules, setSchedules] = useState({}); // Store test schedules { test_id: moment }
  const [enabledTests, setEnabledTests] = useState({}); // Store enabled test IDs { test_id: boolean }
  const [attendedTests, setAttendedTests] = useState([]); // Store attended test IDs
  const [loading, setLoading] = useState(true); // Track loading state

  // Duration for button enablement (in minutes)
  const ENABLE_DURATION_MINUTES = 45;

  // Fetch tests, schedules, and attended tests on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch tests
        const testsResponse = await axios.get(
          `https://gig.kggeniuslabs.com/api/api/test/active-tests/${studentId}`,
          { withCredentials: true }
        );

        // Validate response data
        if (!Array.isArray(testsResponse.data)) {
          throw new Error("Invalid tests data format");
        }

        const allTests = testsResponse.data.map((test) => ({
          test_id: test.test_id,
          test_name: test.test_name || "Untitled Test",
          test_description: test.test_description || "No description available",
          type: test.test_type === "assigned" || test.test_type === "skill" ? test.test_type : "unknown",
          created_at: test.created_at || new Date().toISOString(),
          error: test.error || null,
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
          `https://gig.kggeniuslabs.com/api/api/test/schedules/${studentId}`,
          { withCredentials: true }
        );

        // Validate schedules data
        if (!Array.isArray(schedulesResponse.data)) {
          throw new Error("Invalid schedules data format");
        }

        const schedulesMap = schedulesResponse.data.reduce((acc, schedule) => {
          if (schedule.test_id && moment(schedule.datetime).isValid()) {
            acc[schedule.test_id] = moment(schedule.datetime);
          }
          return acc;
        }, {});
        setSchedules(schedulesMap);

        // Fetch attended tests
        const attendedResponse = await axios.get(
          `https://gig.kggeniuslabs.com/api/api/test/student-test-attended/${studentId}`,
          { withCredentials: true }
        );

        // Validate attended tests data
        if (!Array.isArray(attendedResponse.data.attended_tests)) {
          throw new Error("Invalid attended tests data format");
        }

        setAttendedTests(attendedResponse.data.attended_tests);
      } catch (err) {
        setError(err.message || "Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
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
        if (!moment.isMoment(scheduleTime) || !scheduleTime.isValid()) return;

        // Enable button if current time is within the enable duration
        const endTime = moment(scheduleTime).add(ENABLE_DURATION_MINUTES, "minutes");
        newEnabledTests[testId] = now.isSameOrAfter(scheduleTime) && now.isBefore(endTime);
      });

      setEnabledTests(newEnabledTests);
    }, 1000); // Check every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [schedules]);

  // Handle DateTime change
  const handleDateTimeChange = async (testId, date) => {
    if (!moment.isMoment(date) || !date.isValid()) {
      setError("Invalid date selected.");
      return;
    }

    try {
      // Save schedule to backend
      await axios.post(
        "https://gig.kggeniuslabs.com/api/api/test/schedule",
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
    if (type !== "assigned" && type !== "skill") {
      setError("Invalid test type.");
      return;
    }
    navigate(`/attend-test/${id}/${testId}/${type}`);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!moment.isMoment(date) || !date.isValid()) {
      return "Not scheduled";
    }
    return date.format("DD-MM-YYYY HH:mm");
  };

  // Validate DateTime input (disable past dates)
  const isValidDate = (current) => {
    return current.isSameOrAfter(moment().startOf("minute"));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Tests</h1>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {loading ? (
        <p className="text-gray-600">Loading tests...</p>
      ) : tests.length === 0 ? (
        <p className="text-gray-600">No tests available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tests.map((test) => {
            const isAttended = attendedTests.includes(test.test_id);
            const isEnabled = enabledTests[test.test_id] && !isAttended && !test.error;
            return (
              <div
                key={`${test.test_id}-${test.type}`}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {test.test_name}{" "}
                  <span className="text-sm font-normal text-gray-500">
                    ({test.type === "assigned" ? "Assigned" : test.type === "skill" ? "Skill-Based" : "Unknown"})
                  </span>
                </h3>
                <p className="text-gray-600 mb-4">{test.test_description}</p>
                {test.error && (
                  <p className="text-red-600 text-sm mb-2">
                    <strong>Error:</strong> {test.error}
                  </p>
                )}
                {/* Schedule Container */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    {isAttended ? "Scheduled At" : "Schedule Test"}
                  </h4>
                  {isAttended && schedules[test.test_id] ? (
                    <p className="text-sm text-gray-600">
                      {formatDate(schedules[test.test_id])}
                    </p>
                  ) : (
                    !isAttended && (
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
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                          disabled={isAttended}
                        >
                          Now
                        </button>
                      </div>
                    )
                  )}
                </div>
                <button
                  onClick={() => handleAttendTest(test.test_id, test.type)}
                  disabled={!isEnabled}
                  className={`w-full mt-4 py-3 px-4 rounded-lg font-medium text-white transition duration-200 ${
                    isEnabled
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isAttended ? "Test Completed" : "Start Test"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}