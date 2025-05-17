import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AttendQuiz() {
  const { id, testId } = useParams();
  const studentId = atob(id);
  const [test, setTest] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1); // 1=Easy, 2=Medium, 3=Hard
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({ easy: 0, medium: 0, hard: 0, total: 0 });
  const [correctCounts, setCorrectCounts] = useState({ easy: 0, medium: 0, hard: 0 });
  const [askedQuestionIds, setAskedQuestionIds] = useState([]);
  const [error, setError] = useState("");
  const [passStatus, setPassStatus] = useState({ easy: false, medium: false, hard: false });
  const [totalAsked, setTotalAsked] = useState(0);
  const [questionQueue, setQuestionQueue] = useState({ easy: [], medium: [], hard: [] });
  const [additionalQueue, setAdditionalQueue] = useState({ easy: [], medium: [], hard: [] });
  const navigate = useNavigate();

  // Fetch test data
  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/assigned-tests/${studentId}`,
          { withCredentials: true }
        );
        const selectedTest = response.data.find((t) => t.test_id === Number(testId));
        if (!selectedTest) {
          setError("Test not found.");
          return;
        }
        setTest(selectedTest);

        // Initialize queues
        const newQuestionQueue = {
          easy: [...(selectedTest.primary_questions?.easy || [])],
          medium: [...(selectedTest.primary_questions?.medium || [])],
          hard: [...(selectedTest.primary_questions?.hard || [])],
        };
        const newAdditionalQueue = {
          easy: [...(selectedTest.additional_questions?.easy || [])],
          medium: [...(selectedTest.additional_questions?.medium || [])],
          hard: [...(selectedTest.additional_questions?.hard || [])],
        };

        setQuestionQueue(newQuestionQueue);
        setAdditionalQueue(newAdditionalQueue);

        // Set first question
        if (newQuestionQueue.easy.length > 0) {
          const firstQuestion = newQuestionQueue.easy[0];
          setCurrentQuestion(firstQuestion);
          setAskedQuestionIds([firstQuestion.id]);
          setQuestionQueue((prev) => ({
            ...prev,
            easy: prev.easy.slice(1),
          }));
        } else {
          setError("No easy questions available for this test.");
        }
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to fetch test data.");
        console.error("Error fetching test:", err);
      }
    };
    fetchTest();
  }, [studentId, testId]);

  // Strip HTML tags
  const stripHtml = (html) => {
    if (!html || typeof html !== "string") return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Handle option selection
  const handleOptionChange = useCallback(
    (option) => {
      setSelectedOption(option);
      if (currentQuestion) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: option,
        }));
      }
    },
    [currentQuestion]
  );

  // Calculate score for the current question
  const calculateScore = (question, selectedAnswer) => {
    const isCorrect = selectedAnswer === question.correct_answer;
    return isCorrect ? 1 : 0; // 1 point for any correct answer
  };

  // Determine student level and percentage
  const determineStudentLevelAndPercentage = () => {
    const maxEasyScore = test.easy_level_question * 1;
    const maxMediumScore = test.medium_level_question * 1;
    const maxHardScore = test.hard_level_question * 1;
    const totalMaxScore = maxEasyScore + maxMediumScore + maxHardScore;

    const cappedScores = {
      easy: Math.min(scores.easy, maxEasyScore),
      medium: Math.min(scores.medium, maxMediumScore),
      hard: Math.min(scores.hard, maxHardScore),
      total: Math.min(scores.total, totalMaxScore),
    };

    const percentage = totalMaxScore > 0 ? ((cappedScores.total / totalMaxScore) * 100).toFixed(2) : 0;

    let studentLevel = "Failed";
    if (cappedScores.easy >= test.easy_pass_mark) {
      studentLevel = "Easy";
      if (test.difficulty_level_id >= 2 && cappedScores.medium >= test.medium_pass_mark) {
        studentLevel = "Medium";
        if (test.difficulty_level_id === 3 && cappedScores.hard >= test.hard_pass_mark) {
          studentLevel = "Hard";
        }
      }
    }

    return { studentLevel, percentage, cappedScores };
  };

  // Get next question from queue
  const getNextQuestion = (level) => {
    const levelKey = level === 1 ? "easy" : level === 2 ? "medium" : "hard";

    // Try primary questions first
    if (questionQueue[levelKey].length > 0) {
      return questionQueue[levelKey][0];
    }

    // Then try additional questions
    if (additionalQueue[levelKey].length > 0) {
      return additionalQueue[levelKey][0];
    }

    return null;
  };

  // Fetch additional questions dynamically
  const fetchAdditionalQuestions = async (level, count) => {
    try {
      const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
      const response = await axios.get(
        `http://localhost:5000/api/quiz/questions/${test.skill_id}/${levelId}?count=${count}&exclude=${askedQuestionIds.join(",")}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (err) {
      console.error("Error fetching additional questions:", err);
      return [];
    }
  };

  // Handle next question or submit
  const handleNext = async () => {
    if (!currentQuestion || !selectedOption) {
      setError("Please select an option before proceeding.");
      return;
    }

    const score = calculateScore(currentQuestion, selectedOption);
    const isCorrect = score > 0;

    // Update scores and correct counts
    setScores((prev) => {
      const newScores = { ...prev };
      if (currentLevel === 1) newScores.easy += score;
      else if (currentLevel === 2) newScores.medium += score;
      else if (currentLevel === 3) newScores.hard += score;
      newScores.total += score;
      return newScores;
    });

    setCorrectCounts((prev) => {
      const newCounts = { ...prev };
      if (currentLevel === 1 && isCorrect) newCounts.easy += 1;
      else if (currentLevel === 2 && isCorrect) newCounts.medium += 1;
      else if (currentLevel === 3 && isCorrect) newCounts.hard += 1;
      return newCounts;
    });

    const newTotalAsked = totalAsked + 1;
    setTotalAsked(newTotalAsked);

    setSelectedOption("");

    if (newTotalAsked >= test.total_no_of_questions) {
      await submitTest();
      return;
    }

    let nextLevel = currentLevel;
    let questionsAskedAtLevel = {
      easy: correctCounts.easy + (currentLevel === 1 && isCorrect ? 1 : 0),
      medium: correctCounts.medium + (currentLevel === 2 && isCorrect ? 1 : 0),
      hard: correctCounts.hard + (currentLevel === 3 && isCorrect ? 1 : 0),
    };

    // Check pass status
    if (currentLevel === 1 && questionsAskedAtLevel.easy >= test.easy_level_question) {
      if (scores.easy >= test.easy_pass_mark && test.difficulty_level_id >= 2) {
        setPassStatus((prev) => ({ ...prev, easy: true }));
        nextLevel = 2;
      }
    }

    if (currentLevel === 2 && questionsAskedAtLevel.medium >= test.medium_level_question) {
      if (scores.medium >= test.medium_pass_mark && test.difficulty_level_id === 3) {
        setPassStatus((prev) => ({ ...prev, medium: true }));
        nextLevel = 3;
      } else {
        nextLevel = 1;
      }
    }

    let nextQuestion = getNextQuestion(nextLevel);

    // Fetch additional questions if needed
    if (!nextQuestion) {
      const questions = await fetchAdditionalQuestions(nextLevel, 1);
      if (questions.length > 0) {
        nextQuestion = questions[0];
        setAdditionalQueue((prev) => ({
          ...prev,
          [nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard"]: [
            ...prev[nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard"],
            ...questions,
          ],
        }));
      }
    }

    // Fallback logic
    if (!nextQuestion) {
      if (nextLevel === 1) {
        setError("No more easy questions available.");
        await submitTest();
        return;
      } else if (nextLevel === 2) {
        nextLevel = 1;
        nextQuestion = getNextQuestion(1);
        if (!nextQuestion) {
          const questions = await fetchAdditionalQuestions(1, 1);
          if (questions.length > 0) {
            nextQuestion = questions[0];
            setAdditionalQueue((prev) => ({
              ...prev,
              easy: [...prev.easy, ...questions],
            }));
          }
        }
      } else if (nextLevel === 3) {
        nextLevel = 2;
        nextQuestion = getNextQuestion(2);
        if (!nextQuestion) {
          const questions = await fetchAdditionalQuestions(2, 1);
          if (questions.length > 0) {
            nextQuestion = questions[0];
            setAdditionalQueue((prev) => ({
              ...prev,
              medium: [...prev.medium, ...questions],
            }));
          }
        }
      }
    }

    if (!nextQuestion) {
      setError("No more questions available.");
      await submitTest();
      return;
    }

    // Update question queues
    const levelKey = nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard";
    if (
      questionQueue[levelKey].length > 0 &&
      questionQueue[levelKey][0]?.id === nextQuestion.id
    ) {
      setQuestionQueue((prev) => ({
        ...prev,
        [levelKey]: prev[levelKey].slice(1),
      }));
    } else if (
      additionalQueue[levelKey].length > 0 &&
      additionalQueue[levelKey][0]?.id === nextQuestion.id
    ) {
      setAdditionalQueue((prev) => ({
        ...prev,
        [levelKey]: prev[levelKey].slice(1),
      }));
    }

    // Prevent duplicate questions
    if (askedQuestionIds.includes(nextQuestion.id)) {
      console.warn(`Duplicate question ID ${nextQuestion.id} detected. Fetching new question.`);
      const newQuestions = await fetchAdditionalQuestions(nextLevel, 1);
      if (newQuestions.length > 0) {
        nextQuestion = newQuestions[0];
        setAdditionalQueue((prev) => ({
          ...prev,
          [levelKey]: [...prev[levelKey], ...newQuestions],
        }));
      } else {
        setError("No unique questions available.");
        await submitTest();
        return;
      }
    }

    // Update state for next question
    setCurrentLevel(nextLevel);
    setCurrentQuestion(nextQuestion);
    setAskedQuestionIds((prev) => [...prev, nextQuestion.id]);
  };

  // Submit test
  const submitTest = async () => {
    try {
      const totalCorrect = correctCounts.easy + correctCounts.medium + correctCounts.hard;
      const incorrect_answer_count = test.total_no_of_questions - totalCorrect;
      const { studentLevel, percentage, cappedScores } = determineStudentLevelAndPercentage();

      const response = await axios.post(
        "http://localhost:5000/api/quiz/submit-test",
        {
          test_id: test.test_id,
          student_id: studentId,
          answers,
          easy_score: cappedScores.easy,
          medium_score: cappedScores.medium,
          hard_score: cappedScores.hard,
          total_score: cappedScores.total,
          incorrect_answer_count,
          student_level: studentLevel,
          percentage,
        },
        { withCredentials: true }
      );

      const maxEasyScore = test.easy_level_question * 1;
      const maxMediumScore = test.medium_level_question * 1;
      const maxHardScore = test.hard_level_question * 1;

      alert(
        `Test submitted successfully!\n\n` +
        `Scores:\n` +
        `- Easy: ${cappedScores.easy}/${maxEasyScore} (${
          cappedScores.easy >= test.easy_pass_mark ? "Pass" : "Fail"
        })\n` +
        `- Medium: ${cappedScores.medium}/${maxMediumScore} (${
          cappedScores.medium >= test.medium_pass_mark ? "Pass" : "Fail"
        })\n` +
        `- Hard: ${cappedScores.hard}/${maxHardScore} (${
          cappedScores.hard >= test.hard_pass_mark ? "Pass" : "Fail"
        })\n` +
        `- Total: ${cappedScores.total}/${maxEasyScore + maxMediumScore + maxHardScore}\n` +
        `- Percentage: ${percentage}%\n` +
        `- Student Level: ${studentLevel}`
      );

      navigate(`/assigned-tests/${id}`);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to submit test. Please try again.");
      console.error("Submission error:", err);
    }
  };

  // Render option text
  const getOptionText = (opt) => {
    if (!opt) return "Invalid option";
    if (typeof opt === "string") return stripHtml(opt);
    if (typeof opt === "object") {
      if (opt.option) return stripHtml(opt.option);
      if (opt.text) return stripHtml(opt.text);
      if (opt.value) return stripHtml(opt.value);
      if (opt.option_text) return stripHtml(opt.option_text);
    }
    return "Invalid option";
  };

  // Get option value
  const getOptionValue = (opt) => {
    if (!opt) return "";
    if (typeof opt === "string") return opt;
    if (typeof opt === "object") {
      if (opt.option) return opt.option;
      if (opt.text) return opt.text;
      if (opt.value) return opt.value;
      if (opt.option_text) return opt.option_text;
    }
    return JSON.stringify(opt);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">{test?.test_name || "Loading..."}</h1>
      <p className="text-gray-600 mb-4">{test?.test_description || ""}</p>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      <div className="bg-white rounded-lg shadow-md p-6">
        {!currentQuestion ? (
          <p className="text-gray-600">{error || "Loading question..."}</p>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Question {totalAsked + 1} of {test.total_no_of_questions} (Level:{" "}
              {currentLevel === 1 ? "Easy" : currentLevel === 2 ? "Medium" : "Hard"})
            </h2>
            <p className="text-gray-700 mb-4">{stripHtml(currentQuestion.questions)}</p>
            <div className="space-y-2">
              {Array.isArray(currentQuestion.option) && currentQuestion.option.length > 0 ? (
                currentQuestion.option.map((opt, index) => (
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
                ))
              ) : (
                <p className="text-red-700">No options available for this question.</p>
              )}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleNext}
                disabled={!selectedOption}
                className={`py-2 px-4 rounded-lg font-medium text-white transition duration-200 ${
                  !selectedOption ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {totalAsked + 1 >= test.total_no_of_questions ? "Submit" : "Next"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
