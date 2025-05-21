import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Clock, AlertCircle, CheckCircle, ChevronRight, BookOpen } from "lucide-react";
import Swal from 'sweetalert2';

export default function AttendTest() {
  const { id, testId, type } = useParams();
  const studentId = atob(id);
  const [test, setTest] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({ easy: 0, medium: 0, hard: 0, total: 0 });
  const [correctCounts, setCorrectCounts] = useState({ easy: 0, medium: 0, hard: 0 });
  const [askedQuestionIds, setAskedQuestionIds] = useState([]);
  const [allQuestionIds, setAllQuestionIds] = useState([]);
  const [error, setError] = useState("");
  const [passStatus, setPassStatus] = useState({ easy: false, medium: false, hard: false });
  const [totalAsked, setTotalAsked] = useState(0);
  const [questionQueue, setQuestionQueue] = useState({ easy: [], medium: [], hard: [] });
  const [additionalQueue, setAdditionalQueue] = useState({ easy: [], medium: [], hard: [] });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [attemptId, setAttemptId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const navigate = useNavigate();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const stripHtml = useCallback((html) => {
    if (!html || typeof html !== "string") return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }, []);

  const calculateScore = useCallback((question, selectedAnswer) => {
    if (!selectedAnswer) return 0;
    const isCorrect = selectedAnswer === question.correct_answer;
    return isCorrect ? 1 : 0;
  }, []);

  const determineStudentLevelAndPercentage = useCallback(() => {
    if (!test) return { studentLevel: "Failed", percentage: 0, cappedScores: { easy: 0, medium: 0, hard: 0, total: 0 } };

    const maxEasyScore = test.easy_level_question * 1;
    const maxMediumScore = test.medium_level_question * 1;
    const maxHardScore = test.hard_level_question * 1;
    const totalMaxScore = maxEasyScore + maxMediumScore + maxHardScore;

    let easyScore = 0, mediumScore = 0, hardScore = 0, totalScore = 0;
    const allQuestions = [
      ...(questionQueue.easy || []),
      ...(questionQueue.medium || []),
      ...(questionQueue.hard || []),
      ...(additionalQueue.easy || []),
      ...(additionalQueue.medium || []),
      ...(additionalQueue.hard || []),
      ...(askedQuestionIds.map(id => ({
        id,
        correct_answer: test.primary_questions?.easy?.find(q => q.id === id)?.correct_answer ||
                        test.primary_questions?.medium?.find(q => q.id === id)?.correct_answer ||
                        test.primary_questions?.hard?.find(q => q.id === id)?.correct_answer ||
                        test.additional_questions?.easy?.find(q => q.id === id)?.correct_answer ||
                        test.additional_questions?.medium?.find(q => q.id === id)?.correct_answer ||
                        test.additional_questions?.hard?.find(q => q.id === id)?.correct_answer
      })) || []),
    ].filter(q => q && q.id);

    allQuestions.forEach(question => {
      const answer = answers[question.id] || null;
      const score = calculateScore(question, answer);
      if (test.primary_questions?.easy?.some(q => q.id === question.id) || test.additional_questions?.easy?.some(q => q.id === id)) {
        easyScore += score;
      } else if (test.primary_questions?.medium?.some(q => q.id === question.id) || test.additional_questions?.medium?.some(q => q.id === id)) {
        mediumScore += score;
      } else if (test.primary_questions?.hard?.some(q => q.id === question.id) || test.additional_questions?.hard?.some(q => q.id === id)) {
        hardScore += score;
      }
      totalScore += score;
    });

    const cappedScores = {
      easy: Math.min(easyScore, maxEasyScore),
      medium: Math.min(mediumScore, maxMediumScore),
      hard: Math.min(hardScore, maxHardScore),
      total: Math.min(totalScore, totalMaxScore),
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
  }, [test, answers, calculateScore, questionQueue, additionalQueue, askedQuestionIds]);

  const submitTest = useCallback(async (isTimeoutSubmission = false) => {
    if (!test || !attemptId) {
      console.error("[submitTest] Missing test or attemptId");
      throw new Error("Missing test or attemptId");
    }

    if (isSubmitted) {
      console.log("[submitTest] Test already submitted, skipping submission");
      return;
    }

    try {
      const finalAnswers = { ...answers };
      allQuestionIds.forEach(id => {
        if (!(id in finalAnswers)) {
          finalAnswers[id] = null;
        }
      });

      const totalCorrect = correctCounts.easy + correctCounts.medium + correctCounts.hard;
      const answeredQuestions = Object.keys(answers).length;
      const incorrect_answer_count = answeredQuestions - totalCorrect;
      const { studentLevel, percentage, cappedScores } = determineStudentLevelAndPercentage();

      console.log(`[submitTest] Submitting test for studentId=${studentId}, attemptId=${attemptId}`);
      await axios.post(
        "http://localhost:5000/api/quiz/submit-test",
        {
          test_id: test.test_id,
          student_id: studentId,
          answers: finalAnswers,
          easy_score: cappedScores.easy,
          medium_score: cappedScores.medium,
          hard_score: cappedScores.hard,
          total_score: cappedScores.total,
          incorrect_answer_count,
          student_level: studentLevel,
          percentage,
          attempt_id: attemptId,
        },
        { withCredentials: true }
      );

      console.log(`[submitTest] Clearing sessionStorage for attemptId=${attemptId}`);
      sessionStorage.removeItem(`test_attempt_${studentId}_${testId}_${type}`);
      setIsSubmitted(true);
      
      // Show appropriate SweetAlert based on submission type
      await Swal.fire({
        // title: isTimeoutSubmission ? 'Time Expired' : 'Test Submitted',
        // text: isTimeoutSubmission 
        //   ? 'Your time has expired and the test has been submitted successfully.' 
        //   : 'Your test has been submitted successfully.',
        title: isTimeoutSubmission ? 'Time Submitted' : 'Test Submitted',
        text: isTimeoutSubmission 
          ? 'Your test has been submitted successfully.' 
          : 'Your test has been submitted successfully.',
        icon: 'success',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#3085d6',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      });
      
      navigate(`/student/${id}`);
    } catch (err) {
      console.error("[submitTest] Submission error:", err);
      const errorMessage = err.response?.data?.msg || "Failed to submit test. Please try again.";
      
      await Swal.fire({
        title: 'Submission Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonText: 'Okay',
        confirmButtonColor: '#3085d6',
      });
      
      throw new Error(errorMessage);
    }
  }, [test, correctCounts, determineStudentLevelAndPercentage, answers, allQuestionIds, studentId, testId, type, attemptId, isSubmitted, id, navigate]);

  useEffect(() => {
    const startTest = async () => {
      const storageKey = `test_attempt_${studentId}_${testId}_${type}`;
      const storedAttemptId = sessionStorage.getItem(storageKey);
      if (storedAttemptId) {
        console.log(`[startTest] Reusing attemptId=${storedAttemptId} for studentId=${studentId}, testId=${testId}, type=${type}`);
        setAttemptId(storedAttemptId);
        try {
          const response = await axios.get(
            `http://localhost:5000/api/quiz/test-time/${storedAttemptId}`,
            { withCredentials: true }
          );
          console.log(`[startTest] Fetched time for attemptId=${storedAttemptId}: ${response.data.time_left_seconds}s`);
          setTimeLeft(response.data.time_left_seconds);
          if (response.data.time_left_seconds <= 0 && !isSubmitted) {
            console.log("[startTest] Time already expired, submitting test");
            setIsTimeout(true);
            await submitTest(true);
          }
        } catch (err) {
          console.error("[startTest] Error fetching test time:", err);
          setError(err.response?.data?.msg || "Failed to fetch test time.");
        }
        return;
      }

      console.log(`[startTest] Starting new test attempt for studentId=${studentId}, testId=${testId}, type=${type}`);
      try {
        const response = await axios.post(
          "http://localhost:5000/api/quiz/start-test",
          { student_id: studentId, test_id: testId, test_type: type },
          { withCredentials: true }
        );
        console.log(`[startTest] Started new attempt: attemptId=${response.data.attempt_id}`);
        setAttemptId(response.data.attempt_id);
        setTimeLeft(response.data.time_left_seconds);
        sessionStorage.setItem(storageKey, response.data.attempt_id);
      } catch (err) {
        console.error("[startTest] Error starting test:", err);
        setError(err.response?.data?.msg || "Failed to start test.");
      }
    };

    startTest();
  }, [studentId, testId, type, id, submitTest, isSubmitted]);

  useEffect(() => {
    if (!attemptId || isSubmitted) return;

    const fetchTime = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/quiz/test-time/${attemptId}`,
          { withCredentials: true }
        );
        setTimeLeft(response.data.time_left_seconds);

        if (response.data.time_left_seconds <= 0 && !isSubmitted) {
          console.log(`[fetchTime] Time expired for attemptId=${attemptId}, auto-submitting test`);
          setIsTimeout(true);
          await submitTest(true);
        }
      } catch (err) {
        console.error(`[fetchTime] Error fetching time for attemptId=${attemptId}:`, err);
        setError(err.response?.data?.msg || "Failed to fetch test time.");
      }
    };

    fetchTime();
    const intervalId = setInterval(fetchTime, 1000);

    return () => {
      console.log(`[fetchTime] Cleaning up interval for attemptId=${attemptId}`);
      clearInterval(intervalId);
    };
  }, [attemptId, submitTest, isSubmitted]);

  const apiEndpoint = `http://localhost:5000/api/quiz/all-tests/${studentId}`;

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(apiEndpoint, { withCredentials: true });
        const selectedTest = response.data.find(
          (t) => t.test_id === Number(testId) && t.test_type === type
        );

        if (!selectedTest) {
          setError("Test not found or not available for this student.");
          return;
        }

        setTest(selectedTest);

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

        const allIds = [
          ...(newQuestionQueue.easy.map(q => q.id) || []),
          ...(newQuestionQueue.medium.map(q => q.id) || []),
          ...(newQuestionQueue.hard.map(q => q.id) || []),
          ...(newAdditionalQueue.easy.map(q => q.id) || []),
          ...(newAdditionalQueue.medium.map(q => q.id) || []),
          ...(newAdditionalQueue.hard.map(q => q.id) || []),
        ];
        setAllQuestionIds(allIds);

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
  }, [studentId, testId, type, apiEndpoint]);

  const handleOptionChange = useCallback(
    (option) => {
      if (timeLeft <= 0 || isSubmitted) return;
      setSelectedOption(option);
      if (currentQuestion) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: option,
        }));
      }
    },
    [currentQuestion, timeLeft, isSubmitted]
  );

  const getNextQuestion = useCallback((level) => {
    const levelKey = level === 1 ? "easy" : level === 2 ? "medium" : "hard";
    if (questionQueue[levelKey].length > 0) {
      return questionQueue[levelKey][0];
    }
    if (additionalQueue[levelKey].length > 0) {
      return additionalQueue[levelKey][0];
    }
    return null;
  }, [questionQueue, additionalQueue]);

  const fetchAdditionalQuestions = useCallback(async (level, count) => {
    if (!test) return [];
    try {
      const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
      const response = await axios.get(
        `http://localhost:5000/api/quiz/questions/${test.skill_id}/${levelId}?count=${count}&exclude=${askedQuestionIds.join(",")}`,
        { withCredentials: true }
      );
      const newQuestions = response.data;
      setAllQuestionIds(prev => [...prev, ...newQuestions.map(q => q.id)]);
      return newQuestions;
    } catch (err) {
      console.error("Error fetching additional questions:", err);
      return [];
    }
  }, [test, askedQuestionIds]);

  const handleNext = useCallback(async () => {
    if (timeLeft <= 0 || isSubmitted) return;

    if (!currentQuestion || !selectedOption) {
      setError("Please select an option before proceeding.");
      return;
    }

    const score = calculateScore(currentQuestion, selectedOption);
    const isCorrect = score > 0;

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
      try {
        await submitTest(false); // Manual submission
      } catch (err) {
        // Error is already handled in submitTest
      }
      return;
    }

    let nextLevel = currentLevel;
    let questionsAskedAtLevel = {
      easy: correctCounts.easy + (currentLevel === 1 && isCorrect ? 1 : 0),
      medium: correctCounts.medium + (currentLevel === 2 && isCorrect ? 1 : 0),
      hard: correctCounts.hard + (currentLevel === 3 && isCorrect ? 1 : 0),
    };

    if (currentLevel === 1 && questionsAskedAtLevel.easy >= test.easy_level_question) {
      if (scores.easy + (isCorrect ? 1 : 0) >= test.easy_pass_mark && test.difficulty_level_id >= 2) {
        setPassStatus((prev) => ({ ...prev, easy: true }));
        nextLevel = 2;
      }
    }

    if (currentLevel === 2 && questionsAskedAtLevel.medium >= test.medium_level_question) {
      if (scores.medium + (isCorrect ? 1 : 0) >= test.medium_pass_mark && test.difficulty_level_id === 3) {
        setPassStatus((prev) => ({ ...prev, medium: true }));
        nextLevel = 3;
      } else {
        nextLevel = 1;
      }
    }

    let nextQuestion = getNextQuestion(nextLevel);

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

    if (!nextQuestion) {
      if (nextLevel === 1) {
        setError("No more easy questions available.");
        try {
          await submitTest(false); // Manual submission
        } catch (err) {
          // Error is already handled in submitTest
        }
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
      try {
        await submitTest(false); // Manual submission
      } catch (err) {
        // Error is already handled in submitTest
      }
      return;
    }

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
        try {
          await submitTest(false); // Manual submission
        } catch (err) {
          // Error is already handled in submitTest
        }
        return;
      }
    }

    setCurrentLevel(nextLevel);
    setCurrentQuestion(nextQuestion);
    setAskedQuestionIds((prev) => [...prev, nextQuestion.id]);
  }, [
    currentQuestion,
    selectedOption,
    calculateScore,
    currentLevel,
    totalAsked,
    test,
    correctCounts,
    scores,
    getNextQuestion,
    fetchAdditionalQuestions,
    questionQueue,
    additionalQueue,
    askedQuestionIds,
    timeLeft,
    submitTest,
    isSubmitted
  ]);

  const getOptionText = useCallback((opt) => {
    if (!opt) return "Invalid option";
    if (typeof opt === "string") return stripHtml(opt);
    if (typeof opt === "object") {
      if (opt.option) return stripHtml(opt.option);
      if (opt.text) return stripHtml(opt.text);
      if (opt.value) return stripHtml(opt.value);
      if (opt.option_text) return stripHtml(opt.option_text);
    }
    return "Invalid option";
  }, [stripHtml]);

  const getOptionValue = useCallback((opt) => {
    if (!opt) return "";
    if (typeof opt === "string") return opt;
    if (typeof opt === "object") {
      if (opt.option) return opt.option;
      if (opt.text) return opt.text;
      if (opt.value) return opt.value;
      if (opt.option_text) return opt.option_text;
    }
    return JSON.stringify(opt);
  }, []);

  const levelColors = {
    1: {
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-800",
      selected: "bg-blue-100",
      button: "bg-blue-600 hover:bg-blue-700"
    },
    2: {
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-800",
      selected: "bg-purple-100",
      button: "bg-purple-600 hover:bg-purple-700"
    },
    3: {
      bg: "bg-teal-50",
      border: "border-teal-100",
      text: "text-teal-800",
      selected: "bg-teal-100",
      button: "bg-teal-600 hover:bg-teal-700"
    }
  };

  const currentLevelColors = levelColors[currentLevel] || levelColors[1];

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-gray-800 mb-4">Loading Test...</h1>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg max-w-md mx-auto text-sm flex items-center justify-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 font-sans">
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setIsModalOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 w-full max-w-md">
                  <div className="flex justify-center mb-4">
                    <BookOpen className="w-10 h-10 text-blue-600" />
                  </div>
                  <Dialog.Title
                    as="h2"
                    className="text-xl font-semibold text-gray-900 mb-4 text-center"
                  >
                    Test Instructions
                  </Dialog.Title>
                  <div className="space-y-3 text-gray-600 text-sm">
                    <p className="flex items-start">
                      <Clock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                      <span>
                        <span className="font-medium">Duration:</span> 30 minutes total. The test will auto-submit when time expires.
                      </span>
                    </p>
                    <p className="flex items-start">
                      <CheckCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                      <span>
                        <span className="font-medium">Individual Effort:</span> Complete this test without assistance or external resources.
                      </span>
                    </p>
                    <p className="flex items-start">
                      <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
                      <span>
                        <span className="font-medium">Integrity:</span> Cheating may result in disqualification.
                      </span>
                    </p>
                  </div>
                  <div className="mt-6 flex justify-center">
                    <button
                      type="button"
                      className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Start Test
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl font-medium text-gray-900">{test.test_name}</h1>
            <p className="text-sm text-gray-500">{test.test_description}</p>
          </div>
          <div className={`flex items-center border rounded-lg py-2 px-3 shadow-sm ${timeLeft <= 0 ? "bg-red-50 border-red-200" : "bg-white border-blue-200"}`}>
            <Clock className={`w-5 h-5 mr-2 ${timeLeft <= 0 ? "text-red-600" : "text-blue-600"}`} />
            <span className={`font-mono font-medium ${timeLeft <= 0 ? "text-red-800" : "text-blue-800"}`}>
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        <div className={`rounded-xl shadow-sm border ${currentLevelColors.border} ${currentLevelColors.bg} p-5 mb-6 transition-colors duration-300`}>
          {!currentQuestion ? (
            <p className="text-gray-500 text-center py-8">Loading question...</p>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="bg-white rounded-lg px-3 py-1 shadow-xs">
                  <span className="text-xs font-medium text-gray-600">
                    Question <span className="font-semibold">{totalAsked + 1}</span> of <span className="font-semibold">{test.total_no_of_questions}</span>
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <p className={`text-sm ${currentLevelColors.text} font-medium`}>
                  {stripHtml(currentQuestion.questions)}
                </p>
              </div>

              <div className="space-y-3">
                {Array.isArray(currentQuestion.option) && currentQuestion.option.length > 0 ? (
                  currentQuestion.option.map((opt, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedOption === getOptionValue(opt)
                          ? `border-blue-300 ${currentLevelColors.selected} shadow-xs`
                          : "border-gray-200 bg-white hover:bg-gray-50"
                      } ${timeLeft <= 0 || isSubmitted ? "cursor-not-allowed" : ""}`}
                    >
                      <input
                        type="radio"
                        name="option"
                        value={getOptionValue(opt)}
                        checked={selectedOption === getOptionValue(opt)}
                        onChange={() => handleOptionChange(getOptionValue(opt))}
                        className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        disabled={timeLeft <= 0 || isSubmitted}
                      />
                      <span className="ml-3 text-sm text-gray-700">
                        {getOptionText(opt)}
                      </span>
                    </label>
                  ))
                ) : (
                  <p className="text-red-500 text-sm text-center py-4">
                    No options available for this question.
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={handleNext}
                  disabled={!selectedOption || timeLeft <= 0 || isSubmitted}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors ${
                    selectedOption && timeLeft > 0 && !isSubmitted
                      ? `${currentLevelColors.button} shadow-md hover:shadow-sm`
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {totalAsked + 1 >= test.total_no_of_questions ? "Submit Test" : "Next Question"}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}











