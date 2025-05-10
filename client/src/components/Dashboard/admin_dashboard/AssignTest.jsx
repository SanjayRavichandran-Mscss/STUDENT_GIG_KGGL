import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AssignTest() {
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignedStudents, setAssignedStudents] = useState({});
  const [selectedStudents, setSelectedStudents] = useState({});
  const [currentStudent, setCurrentStudent] = useState({});
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch tests, students, and available questions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [testsResponse, studentsResponse, questionsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/quiz/tests", { withCredentials: true }),
          axios.get("http://localhost:5000/api/quiz/students", { withCredentials: true }),
          axios.get("http://localhost:5000/api/quiz/available-questions", { withCredentials: true }),
        ]);
        setTests(testsResponse.data);
        setStudents(studentsResponse.data);
        setAvailableQuestions(questionsResponse.data);

        // Initialize selected students and current student for each test
        const initialSelected = {};
        const initialCurrent = {};
        testsResponse.data.forEach((test) => {
          initialSelected[test.test_id] = [];
          initialCurrent[test.test_id] = "";
        });
        setSelectedStudents(initialSelected);
        setCurrentStudent(initialCurrent);

        // Fetch assigned students for each test
        const assignedPromises = testsResponse.data.map((test) =>
          axios.get(`http://localhost:5000/api/quiz/assigned-students/${test.test_id}`, {
            withCredentials: true,
          })
        );
        const assignedResponses = await Promise.all(assignedPromises);
        const assignedMap = {};
        testsResponse.data.forEach((test, index) => {
          assignedMap[test.test_id] = assignedResponses[index].data;
        });
        setAssignedStudents(assignedMap);
      } catch (err) {
        setError("Failed to load data. Please check the server connection.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle student selection change
  const handleStudentChange = (testId, studentId) => {
    setCurrentStudent((prev) => ({ ...prev, [testId]: studentId }));
  };

  // Add student to selected list
  const handleAddStudent = (testId) => {
    const studentId = Number(currentStudent[testId]);
    if (!studentId) {
      setError("Please select a student before adding.");
      return;
    }
    if (
      !selectedStudents[testId].includes(studentId) &&
      !assignedStudents[testId]?.some((s) => s.student_id === studentId)
    ) {
      setSelectedStudents((prev) => ({
        ...prev,
        [testId]: [...prev[testId], studentId],
      }));
      setCurrentStudent((prev) => ({ ...prev, [testId]: "" }));
    }
  };

  // Remove student from selected list
  const handleRemoveStudent = (testId, studentId) => {
    setSelectedStudents((prev) => ({
      ...prev,
      [testId]: prev[testId].filter((id) => id !== studentId),
    }));
  };

  // Assign test to selected students
  const handleAssignTest = async (testId) => {
    setError("");
    setSuccess("");
    const studentsToAssign = selectedStudents[testId] || [];
    if (studentsToAssign.length === 0) {
      setError("Please select at least one student to assign the test.");
      return;
    }

    // Validate question availability
    const test = tests.find((t) => t.test_id === testId);
    const skillQuestions = availableQuestions.find((q) => q.skill_id === test.skill_id);
    if (!skillQuestions) {
      setError("No questions available for the selected skill.");
      return;
    }
    if (
      test.easy_level_question > skillQuestions.easy_count ||
      test.medium_level_question > skillQuestions.medium_count ||
      test.hard_level_question > skillQuestions.hard_count
    ) {
      setError("Insufficient questions available for this test. Please add more questions.");
      return;
    }

    try {
      for (const studentId of studentsToAssign) {
        await axios.post(
          "http://localhost:5000/api/quiz/assign-test",
          { test_id: testId, student_id: studentId },
          { withCredentials: true }
        );
      }
      setSuccess("Test assigned successfully!");
      setAssignedStudents((prev) => ({
        ...prev,
        [testId]: [
          ...(prev[testId] || []),
          ...students.filter((s) => studentsToAssign.includes(s.student_id)),
        ],
      }));
      setSelectedStudents((prev) => ({ ...prev, [testId]: [] }));
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to assign test.");
      console.error("Assign error:", err);
    }
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

  // Get question availability message
  const getAvailabilityMessage = (test) => {
    const skillQuestions = availableQuestions.find((q) => q.skill_id === test.skill_id);
    if (!skillQuestions) return "No questions available for this skill.";
    const messages = [];
    if (test.easy_level_question > skillQuestions.easy_count) {
      messages.push(`Add ${test.easy_level_question - skillQuestions.easy_count} more easy questions`);
    }
    if (test.medium_level_question > skillQuestions.medium_count) {
      messages.push(`Add ${test.medium_level_question - skillQuestions.medium_count} more medium questions`);
    }
    if (test.hard_level_question > skillQuestions.hard_count) {
      messages.push(`Add ${test.hard_level_question - skillQuestions.hard_count} more hard questions`);
    }
    return messages.length > 0 ? messages.join(", ") : "";
  };

  return (
    <div className="bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Assign Tests</h2>

      {isLoading && (
        <div className="text-center text-gray-600 mb-4">Loading tests...</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map((test) => {
          const skillQuestions = availableQuestions.find((q) => q.skill_id === test.skill_id);
          const totalAvailable = skillQuestions
            ? skillQuestions.easy_count + skillQuestions.medium_count + skillQuestions.hard_count
            : 0;
          const availabilityMessage = getAvailabilityMessage(test);

          return (
            <div key={test.test_id} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{test.test_name}</h3>
              <p className="text-gray-600 mb-4">{test.test_description}</p>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Skill:</strong> {test.skill_name}</p>
                <p><strong>Difficulty:</strong> {test.level_name}</p>
                <p><strong>Total Questions:</strong> {test.total_no_of_questions}</p>
                <p><strong>Easy Questions:</strong> {test.easy_level_question}</p>
                {availabilityMessage.includes("easy") && (
                  <p className="text-red-600 text-xs">
                    {availabilityMessage
                      .split(", ")
                      .find((msg) => msg.includes("easy"))}
                  </p>
                )}
                <p><strong>Medium Questions:</strong> {test.medium_level_question}</p>
                {availabilityMessage.includes("medium") && (
                  <p className="text-red-600 text-xs">
                    {availabilityMessage
                      .split(", ")
                      .find((msg) => msg.includes("medium"))}
                  </p>
                )}
                <p><strong>Hard Questions:</strong> {test.hard_level_question}</p>
                {availabilityMessage.includes("hard") && (
                  <p className="text-red-600 text-xs">
                    {availabilityMessage
                      .split(", ")
                      .find((msg) => msg.includes("hard"))}
                  </p>
                )}
                <p><strong>Easy Pass Mark:</strong> {test.easy_pass_mark}</p>
                <p><strong>Medium Pass Mark:</strong> {test.medium_pass_mark}</p>
                <p><strong>Hard Pass Mark:</strong> {test.hard_pass_mark}</p>
                <p><strong>Available Questions:</strong></p>
                <p className="pl-4">
                  Easy: {skillQuestions?.easy_count || 0}, Medium: {skillQuestions?.medium_count || 0}, Hard: {skillQuestions?.hard_count || 0}, Total: {totalAvailable}
                </p>
                <p><strong>Created At:</strong> {formatDate(test.created_at)}</p>
              </div>

              <div className="mt-4">
                <label className="block text-gray-700 font-medium mb-1">Select Students</label>
                <div className="flex items-center gap-2">
                  <select
                    value={currentStudent[test.test_id] || ""}
                    onChange={(e) => handleStudentChange(test.test_id, e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select a student
                    </option>
                    {students
                      .filter(
                        (student) =>
                          !selectedStudents[test.test_id].includes(student.student_id) &&
                          !assignedStudents[test.test_id]?.some(
                            (s) => s.student_id === student.student_id
                          )
                      )
                      .map((student) => (
                        <option key={student.student_id} value={student.student_id}>
                          {student.name}
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => handleAddStudent(test.test_id)}
                    className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
                    disabled={!currentStudent[test.test_id]}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>
              </div>

              {(selectedStudents[test.test_id]?.length > 0 || assignedStudents[test.test_id]?.length > 0) && (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">Selected/Assigned Students:</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedStudents[test.test_id].map((studentId) => {
                      const student = students.find((s) => s.student_id === studentId);
                      return (
                        <div
                          key={studentId}
                          className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center"
                        >
                          {student?.name || "Unknown"}
                          <button
                            onClick={() => handleRemoveStudent(test.test_id, studentId)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      );
                    })}
                    {assignedStudents[test.test_id]?.map((student) => (
                      <div
                        key={student.student_id}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full"
                      >
                        {student.name} (Assigned)
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => handleAssignTest(test.test_id)}
                disabled={!(selectedStudents[test.test_id]?.length > 0) || availabilityMessage.length > 0}
                className={`w-full mt-4 py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
                  selectedStudents[test.test_id]?.length > 0 && availabilityMessage.length === 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 cursor-not-allowed"
                }`}
              >
                {assignedStudents[test.test_id]?.length > 0 ? "Assign More" : "Assign Test"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}