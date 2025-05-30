// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { Clock, AlertCircle, ChevronRight, BookOpen, CheckCircle } from "lucide-react";
// import Swal from "sweetalert2";

// export default function AttendTest() {
//   const { id, testId, type } = useParams();
//   const studentId = atob(id);
//   const [test, setTest] = useState(null);
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [selectedOption, setSelectedOption] = useState("");
//   const [answers, setAnswers] = useState({});
//   const [correctCounts, setCorrectCounts] = useState({ easy: 0, medium: 0, hard: 0 });
//   const [askedQuestionIds, setAskedQuestionIds] = useState([]);
//   const [allQuestionIds, setAllQuestionIds] = useState([]);
//   const [error, setError] = useState("");
//   const [totalAsked, setTotalAsked] = useState(0);
//   const [questionQueue, setQuestionQueue] = useState({ easy: [], medium: [], hard: [] });
//   const [additionalQueue, setAdditionalQueue] = useState({ easy: [], medium: [], hard: [] });
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [timeLeft, setTimeLeft] = useState(30 * 60);
//   const [attemptId, setAttemptId] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isTimeout, setIsTimeout] = useState(false);
//   const [testStarted, setTestStarted] = useState(false);
//   const [questionsAskedByLevel, setQuestionsAskedByLevel] = useState({ easy: 0, medium: 0, hard: 0 });
//   const navigate = useNavigate();

//   const minutes = Math.floor(timeLeft / 60);
//   const seconds = timeLeft % 60;

//   const levelColors = {
//     1: {
//       bg: "bg-blue-50",
//       border: "border-blue-200",
//       text: "text-blue-800",
//       selected: "bg-blue-100",
//       button: "bg-blue-600 hover:bg-blue-700",
//       progress: "bg-blue-500",
//       accent: "text-blue-600",
//     },
//     2: {
//       bg: "bg-purple-50",
//       border: "border-purple-200",
//       text: "text-purple-800",
//       selected: "bg-purple-100",
//       button: "bg-purple-600 hover:bg-purple-700",
//       progress: "bg-purple-500",
//       accent: "text-purple-600",
//     },
//     3: {
//       bg: "bg-teal-50",
//       border: "border-teal-200",
//       text: "text-teal-800",
//       selected: "bg-teal-100",
//       button: "bg-teal-600 hover:bg-teal-700",
//       progress: "bg-teal-500",
//       accent: "text-teal-600",
//     },
//   };

//   const currentLevelColors = levelColors[currentLevel] || levelColors[1];

//   const stripHtml = useCallback((html) => {
//     if (!html || typeof html !== "string") return "";
//     const div = document.createElement("div");
//     div.innerHTML = html;
//     return div.textContent || div.innerText || "";
//   }, []);

//   const getOptionText = useCallback(
//     (opt) => {
//       if (!opt) return "Invalid option";
//       if (typeof opt === "string") return stripHtml(opt);
//       if (typeof opt === "object") {
//         return stripHtml(
//           opt.option || opt.text || opt.value || opt.option_text || "Invalid option"
//         );
//       }
//       return "Invalid option";
//     },
//     [stripHtml]
//   );

//   const getOptionValue = useCallback((opt) => {
//     if (!opt) return "";
//     if (typeof opt === "string") return opt;
//     if (typeof opt === "object") {
//       return (
//         opt.option ||
//         opt.text ||
//         opt.value ||
//         opt.option_text ||
//         opt.option_value ||
//         JSON.stringify(opt)
//       );
//     }
//     return "";
//   }, []);

//   const calculateScore = useCallback((question, selectedAnswer) => {
//     if (!question || !selectedAnswer || !question.correct_answer) return 0;
//     return selectedAnswer.trim() === question.correct_answer.trim() ? 1 : 0;
//   }, []);

//   const determineStudentLevelAndPercentage = useCallback(() => {
//     if (!test) return { studentLevel: "Failed", percentage: 0, easyScore: 0, mediumScore: 0, hardScore: 0, totalScore: 0 };

//     const maxEasyScore = test.easy_level_question || 0;
//     const maxMediumScore = test.medium_level_question || 0;
//     const maxHardScore = test.hard_level_question || 0;
//     const totalMaxScore = maxEasyScore + maxMediumScore + maxHardScore;

//     let easyScore = 0, mediumScore = 0, hardScore = 0;
//     let studentLevel = "Failed";

//     Object.entries(answers).forEach(([questionId, answer]) => {
//       const question = [
//         ...(test.primary_questions?.easy || []),
//         ...(test.additional_questions?.easy || []),
//       ].find((q) => q.id == questionId);
//       if (question && answer !== null) {
//         easyScore += calculateScore(question, answer);
//       }
//     });

//     if (easyScore >= (test.easy_pass_mark || 0) && test.difficulty_level_id >= 2) {
//       studentLevel = "Easy";
//       Object.entries(answers).forEach(([questionId, answer]) => {
//         const question = [
//           ...(test.primary_questions?.medium || []),
//           ...(test.additional_questions?.medium || []),
//         ].find((q) => q.id == questionId);
//         if (question && answer !== null) {
//           mediumScore += calculateScore(question, answer);
//         }
//       });
//     }

//     if (mediumScore >= (test.medium_pass_mark || 0) && test.difficulty_level_id === 3) {
//       studentLevel = "Medium";
//       Object.entries(answers).forEach(([questionId, answer]) => {
//         const question = [
//           ...(test.primary_questions?.hard || []),
//           ...(test.additional_questions?.hard || []),
//         ].find((q) => q.id == questionId);
//         if (question && answer !== null) {
//           hardScore += calculateScore(question, answer);
//         }
//       });
//       if (hardScore >= (test.hard_pass_mark || 0)) {
//         studentLevel = "Hard";
//       }
//     }

//     easyScore = Math.min(easyScore, maxEasyScore);
//     mediumScore = Math.min(mediumScore, maxMediumScore);
//     hardScore = Math.min(hardScore, maxHardScore);
//     const totalScore = easyScore + mediumScore + hardScore;

//     const percentage = totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(2) : 0;

//     return {
//       studentLevel,
//       percentage,
//       easyScore,
//       mediumScore,
//       hardScore,
//       totalScore,
//     };
//   }, [test, answers, calculateScore]);

//   const submitTest = useCallback(
//     async (isTimeoutSubmission = false) => {
//       if (!test || !attemptId) {
//         console.error("[submitTest] Missing test or attemptId");
//         setError("Test data or attempt ID is missing.");
//         return;
//       }

//       if (isSubmitted) {
//         console.log("[submitTest] Test already submitted");
//         return;
//       }

//       setIsSubmitting(true);
//       try {
//         const finalAnswers = { ...answers };
//         allQuestionIds.forEach((id) => {
//           if (!(id in finalAnswers)) {
//             finalAnswers[id] = null;
//           }
//         });

//         const { studentLevel, percentage, easyScore, mediumScore, hardScore, totalScore } =
//           determineStudentLevelAndPercentage();

//         const answeredQuestions = Object.keys(answers).filter((id) => answers[id] !== null).length;
//         const incorrectAnswerCount = answeredQuestions - totalScore;

//         if (incorrectAnswerCount < 0 || incorrectAnswerCount > answeredQuestions) {
//           console.error("[submitTest] Invalid incorrect answer count:", {
//             answeredQuestions,
//             totalScore,
//             incorrectAnswerCount,
//           });
//           throw new Error("Invalid incorrect answer count");
//         }

//         const submissionData = {
//           test_id: test.test_id,
//           student_id: studentId,
//           answers: finalAnswers,
//           easy_score: easyScore,
//           medium_score: mediumScore,
//           hard_score: hardScore,
//           total_score: totalScore,
//           incorrect_answer_count: incorrectAnswerCount,
//           student_level: studentLevel,
//           percentage: parseFloat(percentage),
//           attempt_id: attemptId,
//         };

//         console.log("[submitTest] Submitting:", JSON.stringify(submissionData, null, 2));

//         await axios.post("http://localhost:5000/api/test/submit-test", submissionData, {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         });

//         sessionStorage.removeItem(`test_attempt_${studentId}_${testId}_${type}`);
//         setIsSubmitted(true);
//         setIsSubmitting(false);

//         await Swal.fire({
//           title: isTimeoutSubmission ? "Time's Up" : "Test Submitted",
//           text: "Your test has been submitted successfully.",
//           icon: "success",
//           confirmButtonText: "Okay",
//           confirmButtonColor: "#3085d6",
//           allowOutsideClick: false,
//         });

//         navigate(`/student/${id}`);
//       } catch (err) {
//         console.error("[submitTest] Error:", err);
//         setIsSubmitting(false);
//         const errorMessage =
//           err.response?.data?.msg || "Failed to submit test. Please try again.";
//         await Swal.fire({
//           title: "Submission Error",
//           text: errorMessage,
//           icon: "error",
//           confirmButtonText: "Okay",
//           confirmButtonColor: "#3085d6",
//         });
//         setError(errorMessage);
//       }
//     },
//     [test, attemptId, isSubmitted, answers, allQuestionIds, studentId, testId, type, navigate, determineStudentLevelAndPercentage]
//   );

//   const startTestAttempt = useCallback(async () => {
//     const storageKey = `test_attempt_${studentId}_${testId}_${type}`;
//     const storedAttemptId = sessionStorage.getItem(storageKey);
//     if (storedAttemptId) {
//       setAttemptId(storedAttemptId);
//       try {
//         const response = await axios.get(
//           `http://localhost:5000/api/test/test-time/${storedAttemptId}`,
//           { withCredentials: true }
//         );
//         setTimeLeft(response.data.time_left_seconds);
//         if (response.data.time_left_seconds <= 0 && !isSubmitted) {
//           setIsTimeout(true);
//           await submitTest(true);
//         }
//         return true;
//       } catch (err) {
//         console.error("[startTestAttempt] Error:", err);
//         setError("Failed to fetch test time.");
//         return false;
//       }
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/test/start-test",
//         { student_id: studentId, test_id: testId, test_type: type },
//         { withCredentials: true }
//       );
//       setAttemptId(response.data.attempt_id);
//       setTimeLeft(response.data.time_left_seconds);
//       sessionStorage.setItem(storageKey, response.data.attempt_id);
//       return true;
//     } catch (err) {
//       console.error("[startTestAttempt] Error:", err);
//       setError("Failed to start test.");
//       return false;
//     }
//   }, [studentId, testId, type, isSubmitted, submitTest]);

//   const initializeTest = useCallback(() => {
//     if (!test) return;
//     const newQuestionQueue = {
//       easy: [...(test.primary_questions?.easy || [])],
//       medium: [...(test.primary_questions?.medium || [])],
//       hard: [...(test.primary_questions?.hard || [])],
//     };
//     const newAdditionalQueue = {
//       easy: [...(test.additional_questions?.easy || [])],
//       medium: [...(test.additional_questions?.medium || [])],
//       hard: [...(test.additional_questions?.hard || [])],
//     };

//     setQuestionQueue(newQuestionQueue);
//     setAdditionalQueue(newAdditionalQueue);

//     if (newQuestionQueue.easy.length > 0) {
//       const firstQuestion = newQuestionQueue.easy[0];
//       setCurrentQuestion(firstQuestion);
//       setAskedQuestionIds([firstQuestion.id]);
//       setQuestionQueue((prev) => ({
//         ...prev,
//         easy: prev.easy.slice(1),
//       }));
//     } else {
//       setError("No easy questions available.");
//     }
//   }, [test]);

//   const fetchAdditionalQuestions = useCallback(
//     async (level, count) => {
//       if (!test) return [];
//       try {
//         const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
//         const response = await axios.get(
//           `http://localhost:5000/api/test/questions/${test.skill_id}/${levelId}?count=${count}&exclude=${askedQuestionIds.join(",")}`,
//           { withCredentials: true }
//         );
//         const newQuestions = response.data;
//         setAllQuestionIds((prev) => [...prev, ...newQuestions.map((q) => q.id)]);
//         return newQuestions;
//       } catch (err) {
//         console.error("[fetchAdditionalQuestions] Error:", err);
//         setError("Failed to fetch additional questions.");
//         return [];
//       }
//     },
//     [test, askedQuestionIds]
//   );

//   const getNextQuestion = useCallback(
//     (level) => {
//       const levelKey = level === 1 ? "easy" : level === 2 ? "medium" : "hard";
//       if (questionQueue[levelKey].length > 0) {
//         return questionQueue[levelKey][0];
//       }
//       if (additionalQueue[levelKey].length > 0) {
//         return additionalQueue[levelKey][0];
//       }
//       return null;
//     },
//     [questionQueue, additionalQueue]
//   );

//   const handleOptionChange = useCallback(
//     (option) => {
//       if (timeLeft <= 0 || isSubmitted || !testStarted) return;
//       const optionValue = getOptionValue(option);
//       setSelectedOption(optionValue);
//       if (currentQuestion) {
//         setAnswers((prev) => ({
//           ...prev,
//           [currentQuestion.id]: optionValue,
//         }));
//       }
//     },
//     [currentQuestion, timeLeft, isSubmitted, testStarted, getOptionValue]
//   );

//   const handleNextQuestion = useCallback(async () => {
//     if (timeLeft <= 0 || isSubmitted || !testStarted) return;

//     if (!currentQuestion || !selectedOption) {
//       setError("Please select an option.");
//       return;
//     }

//     const score = calculateScore(currentQuestion, selectedOption);
//     setCorrectCounts((prev) => ({
//       ...prev,
//       [currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard"]:
//         prev[currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard"] + score,
//     }));

//     const levelKey = currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard";
//     setQuestionsAskedByLevel((prev) => ({
//       ...prev,
//       [levelKey]: prev[levelKey] + 1,
//     }));

//     const newTotalAsked = totalAsked + 1;
//     setTotalAsked(newTotalAsked);

//     const maxQuestionsForLevel =
//       currentLevel === 1
//         ? test.easy_level_question
//         : currentLevel === 2
//         ? test.medium_level_question
//         : test.hard_level_question;
//     const isLastQuestionForLevel = questionsAskedByLevel[levelKey] + 1 === maxQuestionsForLevel;

//     setSelectedOption("");

//     if (newTotalAsked >= test.total_no_of_questions) {
//       return;
//     }

//     let nextLevel = currentLevel;
//     if (isLastQuestionForLevel) {
//       const currentCorrect = correctCounts[levelKey] + score;
//       const passMark =
//         currentLevel === 1
//           ? test.easy_pass_mark
//           : currentLevel === 2
//           ? test.medium_pass_mark
//           : test.hard_pass_mark;

//       if (currentCorrect >= passMark) {
//         if (currentLevel === 1 && test.difficulty_level_id >= 2) {
//           nextLevel = 2;
//         } else if (currentLevel === 2 && test.difficulty_level_id === 3) {
//           nextLevel = 3;
//         }
//       }
//     }

//     let nextQuestion = getNextQuestion(nextLevel);

//     if (!nextQuestion && nextLevel !== currentLevel) {
//       nextLevel = currentLevel;
//       nextQuestion = getNextQuestion(currentLevel);
//     }

//     if (!nextQuestion) {
//       const questions = await fetchAdditionalQuestions(nextLevel, 1);
//       if (questions.length > 0) {
//         nextQuestion = questions[0];
//         setAdditionalQueue((prev) => ({
//           ...prev,
//           [nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard"]: [
//             ...prev[nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard"],
//             ...questions,
//           ],
//         }));
//       }
//     }

//     if (!nextQuestion) {
//       setError("No more questions available.");
//       await submitTest(false);
//       return;
//     }

//     const nextLevelKey = nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard";
//     if (
//       questionQueue[nextLevelKey].length > 0 &&
//       questionQueue[nextLevelKey][0]?.id === nextQuestion.id
//     ) {
//       setQuestionQueue((prev) => ({
//         ...prev,
//         [nextLevelKey]: prev[nextLevelKey].slice(1),
//       }));
//     } else if (
//       additionalQueue[nextLevelKey].length > 0 &&
//       additionalQueue[nextLevelKey][0]?.id === nextQuestion.id
//     ) {
//       setAdditionalQueue((prev) => ({
//         ...prev,
//         [nextLevelKey]: prev[nextLevelKey].slice(1),
//       }));
//     }

//     setCurrentLevel(nextLevel);
//     setCurrentQuestion(nextQuestion);
//     setAskedQuestionIds((prev) => [...prev, nextQuestion.id]);
//   }, [
//     currentQuestion,
//     selectedOption,
//     calculateScore,
//     currentLevel,
//     totalAsked,
//     test,
//     correctCounts,
//     questionsAskedByLevel,
//     getNextQuestion,
//     fetchAdditionalQuestions,
//     questionQueue,
//     additionalQueue,
//     askedQuestionIds,
//     timeLeft,
//     isSubmitted,
//     testStarted,
//     submitTest,
//   ]);

//   const handleStartTest = async () => {
//     const success = await startTestAttempt();
//     if (success) {
//       setTestStarted(true);
//       setIsModalOpen(false);
//       initializeTest();
//     }
//   };

//   useEffect(() => {
//     const fetchTestData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/test/all-tests/${studentId}`, {
//           withCredentials: true,
//         });
//         const tests = response.data;
//         const selectedTest = tests.find(
//           (t) => t.test_id === Number(testId) && t.test_type === type
//         );
//         if (!selectedTest) {
//           setError("Test not found.");
//           return;
//         }
//         setTest(selectedTest);

//         const primaryQuestions = selectedTest.primary_questions || {
//           easy: [],
//           medium: [],
//           hard: [],
//         };
//         const additionalQuestions = selectedTest.additional_questions || {
//           easy: [],
//           medium: [],
//           hard: [],
//         };
//         setQuestionQueue({
//           easy: primaryQuestions.easy || [],
//           medium: primaryQuestions.medium || [],
//           hard: primaryQuestions.hard || [],
//         });
//         setAdditionalQueue({
//           easy: additionalQuestions.easy || [],
//           medium: additionalQuestions.medium || [],
//           hard: additionalQuestions.hard || [],
//         });

//         const allIds = [
//           ...(primaryQuestions.easy || []).map((q) => q.id),
//           ...(primaryQuestions.medium || []).map((q) => q.id),
//           ...(primaryQuestions.hard || []).map((q) => q.id),
//           ...(additionalQuestions.easy || []).map((q) => q.id),
//           ...(additionalQuestions.medium || []).map((q) => q.id),
//           ...(additionalQuestions.hard || []).map((q) => q.id),
//         ].filter((id) => id != null);
//         setAllQuestionIds(allIds);
//       } catch (err) {
//         console.error("[fetchTestData] Error:", err);
//         setError("Failed to load test data.");
//       }
//     };

//     fetchTestData();
//   }, [studentId, testId, type]);

//   useEffect(() => {
//     if (!testStarted || !attemptId || isSubmitted) return;

//     const timer = setInterval(() => {
//       axios
//         .get(`http://localhost:5000/api/test/test-time/${attemptId}`, { withCredentials: true })
//         .then((response) => {
//           const { time_left_seconds } = response.data;
//           setTimeLeft(time_left_seconds);
//           if (time_left_seconds <= 0 && !isSubmitted && !isTimeout) {
//             setIsTimeout(true);
//             submitTest(true);
//           }
//         })
//         .catch((err) => {
//           console.error("[Timer] Error:", err);
//           setError("Failed to sync timer.");
//         });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [attemptId, isSubmitted, isTimeout, submitTest, testStarted]);

//   if (error && !isModalOpen) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white p-6 rounded-xl shadow-sm max-w-md w-full text-center border border-gray-100">
//           <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
//           <h3 className="text-lg font-medium text-gray-900 mb-2">Error Occurred</h3>
//           <p className="text-gray-600 mb-5">{error}</p>
//           <button
//             onClick={() => navigate(`/student/${id}`)}
//             className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!test) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="text-center">
//           <div className="animate-pulse flex justify-center mb-4">
//             <BookOpen className="w-10 h-10 text-blue-500" />
//           </div>
//           <h1 className="text-xl font-medium text-gray-800 mb-3">Loading Test...</h1>
//           {error && (
//             <div className="bg-red-50 text-red-600 p-3 rounded-lg max-w-md mx-auto text-sm flex items-center justify-center border border-red-100">
//               <AlertCircle className="w-4 h-4 mr-2" />
//               {error}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8 font-sans">
//       <Transition.Root show={isModalOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-50" onClose={() => {}}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm" />
//           </Transition.Child>
//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 translate-y-4 sm:scale-95"
//                 enterTo="opacity-100 translate-y-0 sm:scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                 leaveTo="opacity-0 translate-y-4 sm:scale-95"
//               >
//                 <Dialog.Panel className="relative bg-white rounded-xl px-5 py-6 shadow-sm max-w-md w-full border border-gray-100">
//                   <div className="flex justify-center mb-3">
//                     <div className="bg-blue-100 p-3 rounded-full">
//                       <BookOpen className="w-8 h-8 text-blue-600" />
//                     </div>
//                   </div>
//                   <Dialog.Title className="text-lg font-medium text-gray-900 text-center mb-3">
//                     Test Instructions
//                   </Dialog.Title>
//                   <div className="text-gray-600 text-sm space-y-3 mb-5">
//                     <div className="flex items-start">
//                       <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
//                         <AlertCircle className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <p>
//                         <span className="font-medium">Questions:</span> {test.total_no_of_questions} questions across different difficulty levels.
//                       </p>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
//                         <BookOpen className="w-4 h-4 text-blue-600" />
//                       </div>
//                       <p>
//                         <span className="font-medium">Progression:</span> Answer correctly to advance through levels.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-5">
//                     <button
//                       onClick={handleStartTest}
//                       className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
//                     >
//                       Start Test
//                       <ChevronRight className="w-4 h-4 ml-2" />
//                     </button>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition.Root>

//       <div className="max-w-3xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
//           <div className="order-1 sm:order-none">
//             <h1 className="text-xl font-semibold text-gray-900">{test.test_name || "Test"}</h1>
//             <p className="text-gray-500 text-sm mt-1">Complete all questions to finish the test</p>
//           </div>
//           {testStarted && (
//             <div className="flex items-center gap-3 order-2 sm:order-none">
//               <div
//                 className={`flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm border ${
//                   timeLeft <= 0 ? "border-red-200 bg-red-50" : "border-gray-200"
//                 }`}
//               >
//                 <Clock
//                   className={`w-4 h-4 mr-1.5 ${timeLeft <= 0 ? "text-red-600" : currentLevelColors.accent}`}
//                 />
//                 <span
//                   className={`font-mono text-sm font-medium ${
//                     timeLeft <= 0 ? "text-red-800" : "text-gray-800"
//                   }`}
//                 >
//                   {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//                 </span>
//               </div>
//               {totalAsked + 1 === test.total_no_of_questions && (
//                 <button
//                   onClick={() => submitTest(false)}
//                   disabled={isSubmitting || isSubmitted || timeLeft <= 0}
//                   className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
//                     isSubmitting || isSubmitted || timeLeft <= 0
//                       ? "bg-gray-400 cursor-not-allowed"
//                       : "bg-green-600 hover:bg-green-700 shadow-sm"
//                   }`}
//                 >
//                   <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
//                   Submit
//                 </button>
//               )}
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-3 rounded-lg mb-4 flex items-start">
//             <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
//             <span className="text-sm">{error}</span>
//           </div>
//         )}

//         <div
//           className={`bg-white border ${currentLevelColors.border} ${currentLevelColors.bg} rounded-lg p-5 shadow-sm transition-all duration-200`}
//         >
//           {testStarted && !currentQuestion ? (
//             <div className="py-6 text-center">
//               <div className="animate-pulse">
//                 <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500">Loading question...</p>
//               </div>
//             </div>
//           ) : testStarted && currentQuestion ? (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
//                   Question {totalAsked + 1} of {test.total_no_of_questions}
//                 </div>
//                 <div className="h-2 w-16 rounded-full overflow-hidden bg-gray-200">
//                   <div 
//                     className={`h-full ${currentLevelColors.progress}`} 
//                     style={{ 
//                       width: `${((questionsAskedByLevel[currentLevel === 1 ? 'easy' : currentLevel === 2 ? 'medium' : 'hard']) / 
//                       (currentLevel === 1 ? test.easy_level_question : currentLevel === 2 ? test.medium_level_question : test.hard_level_question) * 100%}` 
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="mb-5">
//                 <p className="text-gray-800 font-medium">{stripHtml(currentQuestion.questions)}</p>
//               </div>
//               <div className="space-y-2.5">
//                 {Array.isArray(currentQuestion.option) && currentQuestion.option.length > 0 ? (
//                   currentQuestion.option.map((opt, index) => (
//                     <label
//                       key={index}
//                       className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
//                         selectedOption === getOptionValue(opt)
//                           ? `${currentLevelColors.selected} border-blue-300 shadow-xs`
//                           : "bg-white hover:bg-gray-50 border-gray-200"
//                       } ${timeLeft <= 0 || isSubmitted ? "cursor-not-allowed" : ""}`}
//                     >
//                       <input
//                         type="radio"
//                         name="option"
//                         value={getOptionValue(opt)}
//                         checked={selectedOption === getOptionValue(opt)}
//                         onChange={() => handleOptionChange(opt)}
//                         className="mt-0.5 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         disabled={timeLeft <= 0 || isSubmitted}
//                       />
//                       <span className="ml-3 text-gray-700">{getOptionText(opt)}</span>
//                     </label>
//                   ))
//                 ) : (
//                   <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-3 rounded-lg">
//                     <p className="text-sm">No options available for this question.</p>
//                   </div>
//                 )}
//               </div>
//               {totalAsked + 1 < test.total_no_of_questions && (
//                 <div className="flex justify-end mt-5">
//                   <button
//                     onClick={handleNextQuestion}
//                     disabled={!selectedOption || timeLeft <= 0 || isSubmitted || isSubmitting}
//                     className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                       selectedOption && timeLeft > 0 && !isSubmitted && !isSubmitting
//                         ? `${currentLevelColors.button} text-white shadow-sm hover:shadow-xs focus:ring-blue-500`
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     Next
//                     <ChevronRight className="w-4 h-4 ml-1.5" />
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="py-6 text-center">
//               <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
//               <p className="text-gray-500">Please start the test to begin.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
//             }














import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Addproject() {
  const [pname, setPname] = useState("");
  const [pdes, setPdes] = useState("");
  const [skill, setSkill] = useState("");
  const [date, setDate] = useState("");
  const [numberOfStudents, setNumberOfStudents] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [college, setCollege] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/college/skill")
      .then((res) => {
        setCollege(res.data.msg);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to fetch skills.");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/test/difficulty-levels")
      .then((res) => {
        setLevels(res.data);
      })
      .catch(() => {
        toast.error("Failed to fetch difficulty levels.");
      });
  }, []);

  const handleAddProject = () => {
    if (!pname || !pdes || !skill || !date || !selectedLevel || !numberOfStudents) {
      toast.error("Please fill all fields");
      return;
    }

    if (!Number.isInteger(Number(numberOfStudents)) || numberOfStudents <= 0) {
      toast.error("Number of students must be a positive integer");
      return;
    }

    setIsLoading(true);
    axios
      .post(`http://localhost:5000/api/admin/addproject`, {
        pname,
        pdes,
        skill,
        date,
        level_id: selectedLevel,
        number_of_students: numberOfStudents,
      })
      .then((res) => {
        if (res.data.msg === "added") {
          toast.success("Project Added Successfully!");
          setPname("");
          setPdes("");
          setSkill("");
          setDate("");
          setSelectedLevel("");
          setNumberOfStudents("");
        } else {
          toast.error("Failed to add project");
        }
      })
      .catch(() => {
        toast.error("Network error. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-bold text-center">Add New Project</h2>
        </div>
        
        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-xs font-medium text-gray-600 mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={pname}
              onChange={(e) => setPname(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-xs font-medium text-gray-600 mb-1">
              Project Description
            </label>
            <textarea
              id="projectDescription"
              rows="3"
              value={pdes}
              onChange={(e) => setPdes(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Technology Stack</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Stack</option>
                {college.map((value) => (
                  <option key={value.skill_id} value={value.skill_id}>
                    {value.skill_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl.level_id} value={lvl.level_id}>
                    {lvl.level_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Number of Students</label>
              <input
                type="number"
                value={numberOfStudents}
                onChange={(e) => setNumberOfStudents(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter number"
                min="1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
              <input
                type="datetime-local"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handleAddProject}
            disabled={isLoading}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : "Add Project"}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}