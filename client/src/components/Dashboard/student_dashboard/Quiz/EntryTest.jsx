import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import parse from "html-react-parser"; // Import html-react-parser

export default function EntryTest() {
  const { id } = useParams();
  const studentId = atob(id); // Decode base64-encoded student_id
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Fetch questions on component mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/quiz/entry-test/${studentId}`, {
          withCredentials: true,
        });
        setQuestions(response.data);
        setTotal(response.data.length);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [studentId]);

  // Debug rendering state
  useEffect(() => {
    console.log("Rendering: loading=", loading, "questions.length=", questions.length, "currentQuestionIndex=", currentQuestionIndex);
  }, [loading, questions, currentQuestionIndex]);

  const handleOptionChange = (questionId, option) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/quiz/submit-entry-test",
        {
          student_id: studentId,
          answers,
        },
        { withCredentials: true }
      );
      setScore(response.data.score);
      setTotal(response.data.total);
      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting test:", err);
      setError("Failed to submit test. Please try again.");
    }
  };

  const handleRetake = () => {
    setSubmitted(false);
    setAnswers({});
    setScore(null);
    setError(null);
    setCurrentQuestionIndex(0);
    // Refetch questions to get a new random set
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/quiz/entry-test/${studentId}`, {
          withCredentials: true,
        });
        setQuestions(response.data);
        setTotal(response.data.length);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions. Please try again.");
        setLoading(false);
      }
    };
    fetchQuestions();
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Render loading state
  if (loading) {
    return <div className="text-center p-8">Loading questions...</div>;
  }

  // Render error state
  if (error) {
    return <div className="text-center p-8 text-red-600">{error}</div>;
  }

  // Render results after submission
  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <p className="text-lg">
          You scored {score} out of {total}
        </p>
        <button
          onClick={handleRetake}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Retake Test
        </button>
      </div>
    );
  }

  // Render no questions available
  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
        <p className="text-gray-600">No questions available for your skills.</p>
      </div>
    );
  }

  // Render current question
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Entry Test Based on your skills</h1>
      <div>
        <h3 className="text-lg font-medium mb-2">
          Question {currentQuestionIndex + 1} of {questions.length}: {parse(currentQuestion.question_text)}
        </h3>
        <div className="space-y-2">
          {currentQuestion.options.map((opt, idx) => (
            <label key={idx} className="flex items-center">
              <input
                type="radio"
                name={`question-${currentQuestion.id}`}
                value={opt.option}
                checked={answers[currentQuestion.id] === opt.option}
                onChange={() => handleOptionChange(currentQuestion.id, opt.option)}
                className="mr-2"
              />
              {opt.option}
            </label>
          ))}
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentQuestionIndex === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length}
              className={`px-4 py-2 rounded-md ${
                Object.keys(answers).length < questions.length
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Submit Test
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
















