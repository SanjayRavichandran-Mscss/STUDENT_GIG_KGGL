import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AttendQuiz({ test }) {
  const { id } = useParams(); // Get base64-encoded student_id from URL
  const studentId = atob(id); // Decode base64 to get student_id
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({ easy: 0, medium: 0, hard: 0, total: 0 });
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState("");
  const totalQuestions = 10;

  // Initialize questions based on difficulty_level_id
  useEffect(() => {
    const initializeQuestions = () => {
      try {
        let filteredQuestions = [];
        if (test.difficulty_level_id === 1) {
          // 10 easy
          filteredQuestions = test.questions.filter((q) => q.difficulty_level_id === 1).slice(0, 10);
        } else if (test.difficulty_level_id === 2) {
          // 6 easy, 4 medium
          const easyQuestions = test.questions
            .filter((q) => q.difficulty_level_id === 1)
            .slice(0, test.easy_level_question);
          const mediumQuestions = test.questions
            .filter((q) => q.difficulty_level_id === 2)
            .slice(0, test.medium_level_question);
          filteredQuestions = [...easyQuestions, ...mediumQuestions];
        } else if (test.difficulty_level_id === 3) {
          // 4 easy, 3 medium, 3 hard
          const easyQuestions = test.questions
            .filter((q) => q.difficulty_level_id === 1)
            .slice(0, test.easy_level_question);
          const mediumQuestions = test.questions
            .filter((q) => q.difficulty_level_id === 2)
            .slice(0, test.medium_level_question);
          const hardQuestions = test.questions
            .filter((q) => q.difficulty_level_id === 3)
            .slice(0, test.hard_level_question);
          filteredQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        }

        if (filteredQuestions.length !== totalQuestions) {
          console.error(
            `Incorrect number of questions fetched for test ${test.test_id}: expected ${totalQuestions}, got ${filteredQuestions.length}`,
            {
              easy: test.questions.filter((q) => q.difficulty_level_id === 1).length,
              medium: test.questions.filter((q) => q.difficulty_level_id === 2).length,
              hard: test.questions.filter((q) => q.difficulty_level_id === 3).length,
              required: {
                easy: test.easy_level_question,
                medium: test.medium_level_question,
                hard: test.hard_level_question,
              },
            }
          );
          throw new Error(
            `Unable to load test: expected ${totalQuestions} questions, but only ${filteredQuestions.length} were available.`
          );
        }

        setQuestions(filteredQuestions);
      } catch (err) {
        setError(err.message);
      }
    };

    if (test && test.questions) {
      initializeQuestions();
    } else {
      setError("Test data is incomplete or missing questions.");
    }
  }, [test]);

  const currentQuestion = questions[currentQuestionIndex];
  const isNextDisabled = !selectedOption;

  // Synchronize selectedOption with answers
  useEffect(() => {
    setSelectedOption(answers[currentQuestion?.id] || "");
  }, [currentQuestionIndex, currentQuestion?.id, answers]);

  // Strip HTML tags
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Handle option selection
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: option,
    }));
  };

  // Calculate score for the current question
  const calculateScore = (question, selectedAnswer) => {
    if (selectedAnswer === question.correct_answer) {
      switch (question.difficulty_level_id) {
        case 1:
          return 1; // Easy: 1 point
        case 2:
          return 2; // Medium: 2 points
        case 3:
          return 3; // Hard: 3 points
        default:
          return 0;
      }
    }
    return 0;
  };

  // Determine student level based on scores and pass marks
  const determineStudentLevel = () => {
    const easyCorrect = scores.easy; // Number of correct easy questions
    const mediumCorrect = Math.floor(scores.medium / 2); // Number of correct medium questions
    const hardCorrect = Math.floor(scores.hard / 3); // Number of correct hard questions

    if (easyCorrect < test.easy_pass_mark) {
      return "Failed";
    }
    if (test.difficulty_level_id === 1) {
      return "Easy";
    }
    if (mediumCorrect < test.medium_pass_mark) {
      return "Easy";
    }
    if (test.difficulty_level_id === 2) {
      return "Medium";
    }
    if (hardCorrect < test.hard_pass_mark) {
      return "Medium";
    }
    return "Hard";
  };

  // Handle next question or submit
  const handleNext = async () => {
    const score = calculateScore(currentQuestion, selectedOption);
    setScores((prev) => {
      const newScores = { ...prev };
      switch (currentQuestion.difficulty_level_id) {
        case 1:
          newScores.easy += score;
          break;
        case 2:
          newScores.medium += score;
          break;
        case 3:
          newScores.hard += score;
          break;
      }
      newScores.total += score;
      return newScores;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
    } else {
      // End of questions: calculate student level and submit
      await submitTest();
    }
  };

  // Submit test
  const submitTest = async () => {
    try {
      const incorrect_answer_count =
        questions.length - (scores.easy + Math.floor(scores.medium / 2) + Math.floor(scores.hard / 3));
      const studentLevel = determineStudentLevel();
      const response = await axios.post(
        "http://localhost:5000/api/quiz/submit-test",
        {
          test_id: test.test_id,
          student_id: studentId,
          answers,
          easy_score: scores.easy,
          medium_score: scores.medium,
          hard_score: scores.hard,
          total_score: scores.total,
          incorrect_answer_count,
        },
        { withCredentials: true }
      );

      const maxEasyScore = test.easy_level_question;
      const maxMediumScore = test.medium_level_question * 2;
      const maxHardScore = test.hard_level_question * 3;

      alert(
        `Test submitted successfully!\n` +
          `Scores:\n` +
          `Easy: ${scores.easy}/${maxEasyScore}\n` +
          `Medium: ${scores.medium}/${maxMediumScore}\n` +
          `Hard: ${scores.hard}/${maxHardScore}\n` +
          `Total: ${scores.total}/${maxEasyScore + maxMediumScore + maxHardScore}\n` +
          `Student Level: ${studentLevel}\n` +
          `Total Questions: ${questions.length}`
      );
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to submit test.");
      console.error("Submission error:", err);
    }
  };

  // Render option text
  const getOptionText = (opt) => {
    if (typeof opt === "string") return opt;
    else if (opt && typeof opt === "object" && opt.option) return opt.option;
    else return "Invalid option";
  };

  // Get option value
  const getOptionValue = (opt) => {
    if (typeof opt === "string") return opt;
    else if (opt && typeof opt === "object" && opt.option) return opt.option;
    else return JSON.stringify(opt);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{test?.test_name || "Loading..."}</h1>
      <p className="text-gray-600 mb-4">{test?.test_description || ""}</p>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow-md p-6">
        {questions.length === 0 ? (
          <p className="text-gray-600">
            {error || "No questions available for this test. Please contact the administrator."}
          </p>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h2>
            <p className="text-gray-700 mb-4">{stripHtml(currentQuestion.questions)}</p>
            <div className="space-y-2">
              {currentQuestion.option.map((opt, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="option"
                    value={getOptionValue(opt)}
                    checked={selectedOption === getOptionValue(opt)}
                    onChange={() => handleOptionChange(getOptionValue(opt))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">{getOptionText(opt)}</span>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                disabled={isNextDisabled}
                className={`py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  isNextDisabled ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {currentQuestionIndex === questions.length - 1 ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}