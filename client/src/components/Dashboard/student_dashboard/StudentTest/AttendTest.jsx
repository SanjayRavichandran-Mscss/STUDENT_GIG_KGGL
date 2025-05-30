// import React, { useState, useEffect, useCallback } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment } from "react";
// import { Clock, AlertCircle, ChevronRight, BookOpen } from "lucide-react";
// import Swal from 'sweetalert2';

// export default function AttendTest() {
//   const { id, testId, type } = useParams();
//   const studentId = atob(id);
//   const [test, setTest] = useState(null);
//   const [currentLevel, setCurrentLevel] = useState(1); // 1: Easy, 2: Medium, 3: Hard
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
//       border: "border-blue-100",
//       text: "text-blue-800",
//       selected: "bg-blue-100",
//       button: "bg-blue-600 hover:bg-blue-700"
//     },
//     2: {
//       bg: "bg-purple-50",
//       border: "border-purple-100",
//       text: "text-purple-800",
//       selected: "bg-purple-100",
//       button: "bg-purple-600 hover:bg-purple-700"
//     },
//     3: {
//       bg: "bg-teal-50",
//       border: "border-teal-100",
//       text: "text-teal-800",
//       selected: "bg-teal-100",
//       button: "bg-teal-600 hover:bg-teal-700"
//     }
//   };

//   const currentLevelColors = levelColors[currentLevel] || levelColors[1];

//   const stripHtml = useCallback((html) => {
//     if (!html || typeof html !== "string") return "";
//     const div = document.createElement("div");
//     div.innerHTML = html;
//     return div.textContent || div.innerText || "";
//   }, []);

//   const getOptionText = useCallback((opt) => {
//     if (!opt) return "Invalid option";
//     if (typeof opt === "string") return stripHtml(opt);
//     if (typeof opt === "object") {
//       if (opt.option) return stripHtml(opt.option);
//       if (opt.text) return stripHtml(opt.text);
//       if (opt.value) return stripHtml(opt.value);
//       if (opt.option_text) return stripHtml(opt.option_text);
//     }
//     return "Invalid option";
//   }, [stripHtml]);

//   const getOptionValue = useCallback((opt) => {
//     if (!opt) return "";
//     if (typeof opt === "string") return opt;
//     if (typeof opt === "object") {
//       if (opt.option) return opt.option;
//       if (opt.text) return opt.text;
//       if (opt.value) return opt.value;
//       if (opt.option_text) return opt.option_text;
//       if (opt.option_value) return opt.option_value;
//     }
//     return JSON.stringify(opt);
//   }, []);

//   const calculateScore = useCallback((question, selectedAnswer) => {
//     if (!selectedAnswer) return 0;
//     const isCorrect = selectedAnswer === question.correct_answer;
//     return isCorrect ? 1 : 0;
//   }, []);

//   const determineStudentLevelAndPercentage = useCallback(() => {
//     if (!test) return { studentLevel: "Failed", percentage: 0, easyScore: 0, mediumScore: 0, hardScore: 0, totalScore: 0 };

//     const maxEasyScore = test.easy_level_question;
//     const maxMediumScore = test.medium_level_question;
//     const maxHardScore = test.hard_level_question;
//     const totalMaxScore = maxEasyScore + maxMediumScore + maxHardScore;

//     let easyScore = 0, mediumScore = 0, hardScore = 0;
//     let studentLevel = "Failed";

//     // Calculate easy score
//     Object.entries(answers).forEach(([questionId, answer]) => {
//       const question = [...(test.primary_questions?.easy || []),
//                        ...(test.additional_questions?.easy || [])]
//                       .find(q => q.id == questionId);
//       if (question) {
//         easyScore += calculateScore(question, answer);
//       }
//     });

//     // Only count medium score if easy level is passed
//     if (easyScore >= test.easy_pass_mark && test.difficulty_level_id >= 2) {
//       studentLevel = "Easy";
//       Object.entries(answers).forEach(([questionId, answer]) => {
//         const question = [...(test.primary_questions?.medium || []),
//                          ...(test.additional_questions?.medium || [])]
//                         .find(q => q.id == questionId);
//         if (question) {
//           mediumScore += calculateScore(question, answer);
//         }
//       });
//     }

//     // Only count hard score if medium level is passed
//     if (mediumScore >= test.medium_pass_mark && test.difficulty_level_id === 3) {
//       studentLevel = "Medium";
//       Object.entries(answers).forEach(([questionId, answer]) => {
//         const question = [...(test.primary_questions?.hard || []),
//                          ...(test.additional_questions?.hard || [])]
//                         .find(q => q.id == questionId);
//         if (question) {
//           hardScore += calculateScore(question, answer);
//         }
//       });
//       if (hardScore >= test.hard_pass_mark) {
//         studentLevel = "Hard";
//       }
//     } else if (easyScore >= test.easy_pass_mark) {
//       studentLevel = "Easy";
//     }

//     // Cap scores at maximum possible for each level
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
//       totalScore
//     };
//   }, [test, answers, calculateScore]);

//   const submitTest = useCallback(async (isTimeoutSubmission = false) => {
//     if (!test || !attemptId) {
//       console.error("[submitTest] Missing test or attemptId");
//       throw new Error("Missing test or attemptId");
//     }

//     if (isSubmitted) {
//       console.log("[submitTest] Test already submitted, skipping submission");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const finalAnswers = { ...answers };
//       allQuestionIds.forEach(id => {
//         if (!(id in finalAnswers)) {
//           finalAnswers[id] = null;
//         }
//       });

//       const totalCorrect = correctCounts.easy + correctCounts.medium + correctCounts.hard;
//       const answeredQuestions = Object.keys(answers).filter(id => answers[id] !== null).length;
//       const incorrect_answer_count = answeredQuestions - totalCorrect;

//       const {
//         studentLevel,
//         percentage,
//         easyScore,
//         mediumScore,
//         hardScore,
//         totalScore
//       } = determineStudentLevelAndPercentage();

//       const submissionData = {
//         test_id: test.test_id,
//         student_id: studentId,
//         answers: finalAnswers,
//         easy_score: easyScore,
//         medium_score: mediumScore,
//         hard_score: hardScore,
//         total_score: totalScore,
//         incorrect_answer_count,
//         student_level: studentLevel,
//         percentage: parseFloat(percentage),
//         attempt_id: attemptId,
//       };

//       console.log("Submitting test with data:", JSON.stringify(submissionData, null, 2));

//       await axios.post(
//         "http://103.118.158.24/api/api /test/submit-test",
//         submissionData,
//         {
//           withCredentials: true,
//           headers: {
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       sessionStorage.removeItem(`test_attempt_${studentId}_${testId}_${type}`);
//       setIsSubmitted(true);
//       setIsSubmitting(false);

//       await Swal.fire({
//         title: isTimeoutSubmission ? 'Time Submitted' : 'Test Submitted',
//         text: isTimeoutSubmission
//           ? 'Your test has been submitted successfully.'
//           : 'Your test has been submitted successfully.',
//         icon: 'success',
//         confirmButtonText: 'Okay',
//         confirmButtonColor: '#3085d6',
//         allowOutsideClick: false,
//         allowEscapeKey: false,
//         allowEnterKey: false,
//       });

//       navigate(`/student/${id}`);
//     } catch (err) {
//       console.error("[submitTest] Submission error:", err);
//       setIsSubmitting(false);
//       const errorMessage = err.response?.data?.msg || "Failed to submit test due to a server error. Please try again or contact support.";

//       // Log more details about the error
//       console.log("[submitTest] Error details:", {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message,
//       });

//       await Swal.fire({
//         title: 'Submission Error',
//         text: errorMessage,
//         icon: 'error',
//         confirmButtonText: 'Okay',
//         confirmButtonColor: '#3085d6',
//       });

//       throw new Error(errorMessage);
//     }
//   }, [test, correctCounts, determineStudentLevelAndPercentage, answers, allQuestionIds, studentId, testId, type, attemptId, isSubmitted, id, navigate]);

//   const startTestAttempt = useCallback(async () => {
//     const storageKey = `test_attempt_${studentId}_${testId}_${type}`;
//     const storedAttemptId = sessionStorage.getItem(storageKey);
//     if (storedAttemptId) {
//       console.log(`[startTestAttempt] Reusing attemptId=${storedAttemptId} for studentId=${studentId}, testId=${testId}, type=${type}`);
//       setAttemptId(storedAttemptId);
//       try {
//         const response = await axios.get(
//           `http://103.118.158.24/api/api /test/test-time/${storedAttemptId}`,
//           { withCredentials: true }
//         );
//         console.log(`[startTestAttempt] Fetched time for attemptId=${storedAttemptId}: ${response.data.time_left_seconds}s`);
//         setTimeLeft(response.data.time_left_seconds);
//         if (response.data.time_left_seconds <= 0 && !isSubmitted) {
//           console.log("[startTestAttempt] Time already expired, submitting test");
//           setIsTimeout(true);
//           await submitTest(true);
//         }
//         return true;
//       } catch (err) {
//         console.error("[startTestAttempt] Error fetching test time:", err);
//         setError(err.response?.data?.msg || "Failed to fetch test time.");
//         return false;
//       }
//     }

//     console.log(`[startTestAttempt] Starting new test attempt for studentId=${studentId}, testId=${testId}, type=${type}`);
//     try {
//       const response = await axios.post(
//         "http://103.118.158.24/api/api /test/start-test",
//         { student_id: studentId, test_id: testId, test_type: type },
//         { withCredentials: true }
//       );
//       console.log(`[startTestAttempt] Started new attempt: attemptId=${response.data.attempt_id}`);
//       setAttemptId(response.data.attempt_id);
//       setTimeLeft(response.data.time_left_seconds);
//       sessionStorage.setItem(storageKey, response.data.attempt_id);
//       return true;
//     } catch (err) {
//       console.error("[startTestAttempt] Error starting test:", err);
//       setError(err.response?.data?.msg || "Failed to start test.");
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
//       setError("No easy questions available for this test.");
//     }
//   }, [test]);

//   const fetchAdditionalQuestions = useCallback(async (level, count) => {
//     if (!test) return [];
//     try {
//       const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
//       const response = await axios.get(
//         `http://103.118.158.24/api/api /test/questions/${test.skill_id}/${levelId}?count=${count}&exclude=${askedQuestionIds.join(",")}`,
//         { withCredentials: true }
//       );
//       const newQuestions = response.data;
//       setAllQuestionIds(prev => [...prev, ...newQuestions.map(q => q.id)]);
//       return newQuestions;
//     } catch (err) {
//       console.error("Error fetching additional questions:", err);
//       return [];
//     }
//   }, [test, askedQuestionIds]);

//   const getNextQuestion = useCallback((level) => {
//     const levelKey = level === 1 ? "easy" : level === 2 ? "medium" : "hard";
//     if (questionQueue[levelKey].length > 0) {
//       return questionQueue[levelKey][0];
//     }
//     if (additionalQueue[levelKey].length > 0) {
//       return additionalQueue[levelKey][0];
//     }
//     return null;
//   }, [questionQueue, additionalQueue]);

//   const handleOptionChange = useCallback(
//     (option) => {
//       if (timeLeft <= 0 || isSubmitted || !testStarted) return;
//       setSelectedOption(option);
//       if (currentQuestion) {
//         setAnswers((prev) => ({
//           ...prev,
//           [currentQuestion.id]: option,
//         }));
//       }
//     },
//     [currentQuestion, timeLeft, isSubmitted, testStarted]
//   );

//   const handleNextQuestion = useCallback(async () => {
//     if (timeLeft <= 0 || isSubmitted || !testStarted) return;

//     if (!currentQuestion || !selectedOption) {
//       setError("Please select an option before proceeding.");
//       return;
//     }

//     const score = calculateScore(currentQuestion, selectedOption);
//     const isCorrect = score > 0;

//     // Update correct counts for the current level
//     setCorrectCounts((prev) => {
//       const newCounts = { ...prev };
//       if (currentLevel === 1) newCounts.easy += isCorrect ? 1 : 0;
//       else if (currentLevel === 2) newCounts.medium += isCorrect ? 1 : 0;
//       else if (currentLevel === 3) newCounts.hard += isCorrect ? 1 : 0;
//       return newCounts;
//     });

//     // Update the number of questions asked for the current level
//     setQuestionsAskedByLevel((prev) => {
//       const newCounts = { ...prev };
//       if (currentLevel === 1) newCounts.easy += 1;
//       else if (currentLevel === 2) newCounts.medium += 1;
//       else if (currentLevel === 3) newCounts.hard += 1;
//       return newCounts;
//     });

//     const newTotalAsked = totalAsked + 1;
//     setTotalAsked(newTotalAsked);

//     setSelectedOption("");

//     // Check if we've reached the total number of questions
//     if (newTotalAsked >= test.total_no_of_questions) {
//       try {
//         await submitTest(false);
//       } catch (err) {
//         // Error is already handled in submitTest
//       }
//       return;
//     }

//     // Determine the next level and question
//     let nextLevel = currentLevel;
//     const currentLevelKey = currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard";
//     const maxQuestionsForLevel = currentLevel === 1 ? test.easy_level_question :
//                                 currentLevel === 2 ? test.medium_level_question :
//                                 test.hard_level_question;

//     // Check if all questions for the current level have been asked
//     if (questionsAskedByLevel[currentLevelKey] >= maxQuestionsForLevel) {
//       const currentCorrect = currentLevel === 1 ? correctCounts.easy + (isCorrect ? 1 : 0) :
//                             currentLevel === 2 ? correctCounts.medium + (isCorrect ? 1 : 0) :
//                             correctCounts.hard + (isCorrect ? 1 : 0);
//       const currentPassMark = currentLevel === 1 ? test.easy_pass_mark :
//                              currentLevel === 2 ? test.medium_pass_mark :
//                              test.hard_pass_mark;

//       // Check if the student passed the current level
//       if (currentCorrect >= currentPassMark) {
//         // Progress to the next level if available
//         if (currentLevel === 1 && test.difficulty_level_id >= 2) {
//           nextLevel = 2;
//         } else if (currentLevel === 2 && test.difficulty_level_id === 3) {
//           nextLevel = 3;
//         }
//       }
//       // If not passed, stay at the current level and fetch additional questions if needed
//     }

//     // Get the next question
//     let nextQuestion = getNextQuestion(nextLevel);

//     // If no question available at the next level, stay at current level
//     if (!nextQuestion && nextLevel !== currentLevel) {
//       nextLevel = currentLevel;
//       nextQuestion = getNextQuestion(currentLevel);
//     }

//     // If still no question, try to fetch additional questions for the current level
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

//     // If no questions available at all, submit the test
//     if (!nextQuestion) {
//       setError("No more questions available.");
//       try {
//         await submitTest(false);
//       } catch (err) {
//         // Error is already handled in submitTest
//       }
//       return;
//     }

//     // Remove the question from the appropriate queue
//     const levelKey = nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard";
//     if (questionQueue[levelKey].length > 0 && questionQueue[levelKey][0]?.id === nextQuestion.id) {
//       setQuestionQueue((prev) => ({
//         ...prev,
//         [levelKey]: prev[levelKey].slice(1),
//       }));
//     } else if (additionalQueue[levelKey].length > 0 && additionalQueue[levelKey][0]?.id === nextQuestion.id) {
//       setAdditionalQueue((prev) => ({
//         ...prev,
//         [levelKey]: prev[levelKey].slice(1),
//       }));
//     }

//     // Update state with the next question
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
//     getNextQuestion,
//     fetchAdditionalQuestions,
//     questionQueue,
//     additionalQueue,
//     askedQuestionIds,
//     timeLeft,
//     submitTest,
//     isSubmitted,
//     testStarted,
//     questionsAskedByLevel
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
//         const response = await axios.get(`http://103.118.158.24/api/api /test/all-tests/${studentId}`, { withCredentials: true });
//         const tests = response.data;
//         const selectedTest = tests.find(t => t.test_id === Number(testId) && t.test_type === type);
//         if (!selectedTest) {
//           setError("Test not found or not available.");
//           return;
//         }
//         setTest(selectedTest);

//         const primaryQuestions = selectedTest.primary_questions || { easy: [], medium: [], hard: [] };
//         const additionalQuestions = selectedTest.additional_questions || { easy: [], medium: [], hard: [] };
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
//           ...(primaryQuestions.easy || []).map(q => q.id),
//           ...(primaryQuestions.medium || []).map(q => q.id),
//           ...(primaryQuestions.hard || []).map(q => q.id),
//           ...(additionalQuestions.easy || []).map(q => q.id),
//           ...(additionalQuestions.medium || []).map(q => q.id),
//           ...(additionalQuestions.hard || []).map(q => q.id),
//         ].filter(id => id != null);
//         setAllQuestionIds(allIds);
//       } catch (err) {
//         console.error("[fetchTestData] Error:", err);
//         setError(err.response?.data?.msg || "Failed to load test data.");
//       }
//     };

//     fetchTestData();
//   }, [studentId, testId, type]);

//   useEffect(() => {
//     if (!testStarted || !attemptId || isSubmitted) return;

//     const timer = setInterval(() => {
//       axios.get(`http://103.118.158.24/api/api /test/test-time/${attemptId}`, { withCredentials: true })
//         .then(response => {
//           const { time_left_seconds } = response.data;
//           setTimeLeft(time_left_seconds);
//           if (time_left_seconds <= 0 && !isSubmitted && !isTimeout) {
//             console.log(`[Timer] Time expired for attemptId=${attemptId}, auto-submitting test`);
//             setIsTimeout(true);
//             submitTest(true);
//           }
//         })
//         .catch(err => {
//           console.error("[Timer] Error:", err);
//           setError("Failed to sync timer. Please submit your test.");
//         });
//     }, 1000);

//     return () => {
//       console.log(`[Timer] Cleaning up interval for attemptId=${attemptId}`);
//       clearInterval(timer);
//     };
//   }, [attemptId, isSubmitted, isTimeout, submitTest, testStarted]);

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
//         <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-center">
//           <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-500">{error}</p>
//           <button
//             onClick={() => navigate(`/student/${id}`)}
//             className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!test) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
//         <div className="text-center">
//           <h1 className="text-2xl font-medium text-gray-800 mb-4">Loading Test...</h1>
//           {error && (
//             <div className="bg-red-50 text-red-700 p-3 rounded-lg max-w-md mx-auto text-sm flex items-center justify-center">
//               <AlertCircle className="w-5 h-5 mr-2" />
//               {error}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 font-sans select-none">
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
//             <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" />
//           </Transition.Child>
//           <div className="fixed inset-0 z-50 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//                 enterTo="opacity-100 translate-y-0 sm:scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                 leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
//               >
//                 <Dialog.Panel className="relative transform overflow-hidden rounded-xl bg-white px-6 py-6 text-left shadow-xl transition-all sm:my-8 w-full max-w-md">
//                   <div className="flex justify-center mb-4">
//                     <BookOpen className="w-10 h-10 text-blue-600" />
//                   </div>
//                   <Dialog.Title as="h2" className="text-xl font-semibold text-gray-900 mb-4 text-center">
//                     Test Instructions
//                   </Dialog.Title>
//                   <div className="space-y-3 text-gray-600 text-sm">
//                     {/* <p className="flex items-start">
//                       <Clock className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
//                       <span>
//                         <span className="font-medium">Duration:</span> 30 minutes total. The test will auto-submit when time expires.
//                       </span>
//                     </p> */}
//                     <p className="flex items-start">
//                       <AlertCircle className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
//                       <span>
//                         <span className="font-medium">Questions:</span> {test.total_no_of_questions} questions across{" "}
//                         {test.difficulty_level_id === 1 ? "Easy" : test.difficulty_level_id === 2 ? "Easy and Medium" : "Easy, Medium, and Hard"} levels.
//                       </span>
//                     </p>
//                     <p className="flex items-start">
//                       <BookOpen className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0 text-blue-500" />
//                       <span>
//                         <span className="font-medium">Progression:</span> You must complete and pass each level to proceed to the next.
//                       </span>
//                     </p>
//                   </div>
//                   <div className="mt-6 flex justify-center">
//                     <button
//                       type="button"
//                       className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                       onClick={handleStartTest}
//                     >
//                       Start Test
//                       <ChevronRight className="w-4 h-4 ml-1" />
//                     </button>
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition.Root>

//       <div className="max-w-2xl mx-auto">
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//           <div>
//             <h1 className="text-xl font-medium text-gray-900">{test.test_name}</h1>
//             <p className="text-sm text-gray-500">Complete the test to assess your skills.</p>
//           </div>
//           {testStarted && (
//             <div className={`flex items-center border rounded-lg py-2 px-3 shadow-sm ${timeLeft <= 0 ? "bg-red-50 border-red-200" : "bg-white border-blue-200"}`}>
//               <Clock className={`w-5 h-5 mr-2 ${timeLeft <= 0 ? "text-red-600" : "text-blue-600"}`} />
//               <span className={`font-mono font-medium ${timeLeft <= 0 ? "text-red-800" : "text-blue-800"}`}>
//                 {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//               </span>
//             </div>
//           )}
//         </div>

//         {error && (
//           <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-6 text-sm flex items-center">
//             <AlertCircle className="w-5 h-5 mr-2" />
//             {error}
//           </div>
//         )}

//         <div className={`rounded-xl shadow-sm border ${currentLevelColors.border} ${currentLevelColors.bg} p-5 mb-6 transition-colors duration-300 select-none`}>
//           {testStarted && !currentQuestion ? (
//             <p className="text-gray-500 text-center py-8">Loading question...</p>
//           ) : testStarted && currentQuestion ? (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <div className="bg-white rounded-lg px-3 py-1 shadow-xs">
//                   <span className="text-xs font-medium text-gray-600">
//                     Question <span className="font-semibold">{totalAsked + 1}</span> of <span className="font-semibold">{test.total_no_of_questions}</span>
//                   </span>
//                 </div>
//               </div>
//               <div className="mb-6">
//                 <p className={`text-sm ${currentLevelColors.text} font-medium select-none`}>
//                   {stripHtml(currentQuestion.questions)}
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {Array.isArray(currentQuestion.option) && currentQuestion.option.length > 0 ? (
//                   currentQuestion.option.map((opt, index) => (
//                     <label
//                       key={index}
//                       className={`flex items-start p-3 rounded-lg border cursor-pointer transition-all select-none ${
//                         selectedOption === getOptionValue(opt)
//                           ? `border-blue-300 ${currentLevelColors.selected} shadow-xs`
//                           : "border-gray-200 bg-white hover:bg-gray-50"
//                       } ${timeLeft <= 0 || isSubmitted ? "cursor-not-allowed" : ""}`}
//                     >
//                       <input
//                         type="radio"
//                         name="option"
//                         value={getOptionValue(opt)}
//                         checked={selectedOption === getOptionValue(opt)}
//                         onChange={() => handleOptionChange(getOptionValue(opt))}
//                         className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
//                         disabled={timeLeft <= 0 || isSubmitted}
//                       />
//                       <span className="ml-3 text-sm text-gray-700 select-none">
//                         {getOptionText(opt)}
//                       </span>
//                     </label>
//                   ))
//                 ) : (
//                   <p className="text-red-500 text-sm text-center py-4 select-none">
//                     No options available for this question.
//                   </p>
//                 )}
//               </div>
//               <div className="flex justify-end mt-6">
//                 <button
//                   onClick={handleNextQuestion}
//                   disabled={!selectedOption || timeLeft <= 0 || isSubmitted || isSubmitting}
//                   className={`inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors select-none ${
//                     selectedOption && timeLeft > 0 && !isSubmitted && !isSubmitting
//                       ? `${currentLevelColors.button} shadow-md hover:shadow-sm`
//                       : "bg-gray-400 cursor-not-allowed"
//                   }`}
//                 >
//                   {totalAsked + 1 >= test.total_no_of_questions ? "Submit Test" : "Next Question"}
//                   <ChevronRight className="w-4 h-4 ml-1" />
//                 </button>
//               </div>
//             </>
//           ) : (
//             <p className="text-gray-500 text-center py-8 select-none">Please start the test to begin.</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import {
  Clock,
  AlertCircle,
  ChevronRight,
  BookOpen,
  CheckCircle,
} from "lucide-react";
import Swal from "sweetalert2";

export default function AttendTest() {
  const { id, testId, type } = useParams();
  const studentId = atob(id);
  const [test, setTest] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [answers, setAnswers] = useState({});
  const [correctCounts, setCorrectCounts] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [askedQuestionIds, setAskedQuestionIds] = useState([]);
  const [allQuestionIds, setAllQuestionIds] = useState([]);
  const [error, setError] = useState("");
  const [totalAsked, setTotalAsked] = useState(0);
  const [questionQueue, setQuestionQueue] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [additionalQueue, setAdditionalQueue] = useState({
    easy: [],
    medium: [],
    hard: [],
  });
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [attemptId, setAttemptId] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [questionsAskedByLevel, setQuestionsAskedByLevel] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const navigate = useNavigate();

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const levelColors = {
    1: {
      bg: "bg-blue-50",
      border: "border-blue-300",
      text: "text-blue-900",
      selected: "bg-blue-100",
      button: "bg-blue-700 hover:bg-blue-800",
      progress: "bg-blue-600",
      accent: "text-blue-700",
    },
    2: {
      bg: "bg-purple-50",
      border: "border-purple-300",
      text: "text-purple-900",
      selected: "bg-purple-100",
      button: "bg-purple-700 hover:bg-purple-800",
      progress: "bg-purple-600",
      accent: "text-purple-700",
    },
    3: {
      bg: "bg-teal-50",
      border: "border-teal-300",
      text: "text-teal-900",
      selected: "bg-teal-100",
      button: "bg-teal-700 hover:bg-teal-800",
      progress: "bg-teal-600",
      accent: "text-teal-700",
    },
  };

  const currentLevelColors = levelColors[currentLevel] || levelColors[1];

  const stripHtml = useCallback((html) => {
    if (!html || typeof html !== "string") return "";
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  }, []);

  const getOptionText = useCallback(
    (opt) => {
      if (!opt) return "Invalid option";
      if (typeof opt === "string") return stripHtml(opt);
      if (typeof opt === "object") {
        return stripHtml(
          opt.option ||
            opt.text ||
            opt.value ||
            opt.option_text ||
            "Invalid option"
        );
      }
      return "Invalid option";
    },
    [stripHtml]
  );

  const getOptionValue = useCallback((opt) => {
    if (!opt) return "";
    if (typeof opt === "string") return opt;
    if (typeof opt === "object") {
      return (
        opt.option ||
        opt.text ||
        opt.value ||
        opt.option_text ||
        opt.option_value ||
        JSON.stringify(opt)
      );
    }
    return "";
  }, []);

  const calculateScore = useCallback((question, selectedAnswer) => {
    if (!question || !selectedAnswer || !question.correct_answer) return 0;
    return selectedAnswer.trim() === question.correct_answer.trim() ? 1 : 0;
  }, []);

  const determineStudentLevelAndPercentage = useCallback(() => {
    if (!test)
      return {
        studentLevel: "Failed",
        percentage: 0,
        easyScore: 0,
        mediumScore: 0,
        hardScore: 0,
        totalScore: 0,
      };

    const maxEasyScore = test.easy_level_question || 0;
    const maxMediumScore = test.medium_level_question || 0;
    const maxHardScore = test.hard_level_question || 0;
    const totalMaxScore = maxEasyScore + maxMediumScore + maxHardScore;

    let easyScore = 0,
      mediumScore = 0,
      hardScore = 0;
    let studentLevel = "Failed";

    Object.entries(answers).forEach(([questionId, answer]) => {
      const question = [
        ...(test.primary_questions?.easy || []),
        ...(test.additional_questions?.easy || []),
      ].find((q) => q.id == questionId);
      if (question && answer !== null) {
        easyScore += calculateScore(question, answer);
      }
    });

    if (
      easyScore >= (test.easy_pass_mark || 0) &&
      test.difficulty_level_id >= 2
    ) {
      studentLevel = "Easy";
      Object.entries(answers).forEach(([questionId, answer]) => {
        const question = [
          ...(test.primary_questions?.medium || []),
          ...(test.additional_questions?.medium || []),
        ].find((q) => q.id == questionId);
        if (question && answer !== null) {
          mediumScore += calculateScore(question, answer);
        }
      });
    }

    if (
      mediumScore >= (test.medium_pass_mark || 0) &&
      test.difficulty_level_id === 3
    ) {
      studentLevel = "Medium";
      Object.entries(answers).forEach(([questionId, answer]) => {
        const question = [
          ...(test.primary_questions?.hard || []),
          ...(test.additional_questions?.hard || []),
        ].find((q) => q.id == questionId);
        if (question && answer !== null) {
          hardScore += calculateScore(question, answer);
        }
      });
      if (hardScore >= (test.hard_pass_mark || 0)) {
        studentLevel = "Hard";
      }
    }

    easyScore = Math.min(easyScore, maxEasyScore);
    mediumScore = Math.min(mediumScore, maxMediumScore);
    hardScore = Math.min(hardScore, maxHardScore);
    const totalScore = easyScore + mediumScore + hardScore;

    const percentage =
      totalMaxScore > 0 ? ((totalScore / totalMaxScore) * 100).toFixed(2) : 0;

    return {
      studentLevel,
      percentage,
      easyScore,
      mediumScore,
      hardScore,
      totalScore,
    };
  }, [test, answers, calculateScore]);

  const submitTest = useCallback(
    async (isTimeoutSubmission = false) => {
      if (!test || !attemptId) {
        console.error("[submitTest] Missing test or attemptId");
        setError("Test data or attempt ID is missing.");
        return;
      }

      if (isSubmitted) {
        console.log("[submitTest] Test already submitted");
        return;
      }

      setIsSubmitting(true);
      try {
        const finalAnswers = { ...answers };
        allQuestionIds.forEach((id) => {
          if (!(id in finalAnswers)) {
            finalAnswers[id] = null;
          }
        });

        const {
          studentLevel,
          percentage,
          easyScore,
          mediumScore,
          hardScore,
          totalScore,
        } = determineStudentLevelAndPercentage();

        const answeredQuestions = Object.keys(answers).filter(
          (id) => answers[id] !== null
        ).length;
        const incorrectAnswerCount = answeredQuestions - totalScore;

        if (
          incorrectAnswerCount < 0 ||
          incorrectAnswerCount > answeredQuestions
        ) {
          console.error("[submitTest] Invalid incorrect answer count:", {
            answeredQuestions,
            totalScore,
            incorrectAnswerCount,
          });
          throw new Error("Invalid incorrect answer count");
        }

        const submissionData = {
          test_id: test.test_id,
          student_id: studentId,
          answers: finalAnswers,
          easy_score: easyScore,
          medium_score: mediumScore,
          hard_score: hardScore,
          total_score: totalScore,
          incorrect_answer_count: incorrectAnswerCount,
          student_level: studentLevel,
          percentage: parseFloat(percentage),
          attempt_id: attemptId,
        };

        console.log(
          "[submitTest] Submitting:",
          JSON.stringify(submissionData, null, 2)
        );

        await axios.post(
          "http://103.118.158.24/api/api /test/submit-test",
          submissionData,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        sessionStorage.removeItem(
          `test_attempt_${studentId}_${testId}_${type}`
        );
        setIsSubmitted(true);
        setIsSubmitting(false);

        await Swal.fire({
          title: isTimeoutSubmission ? "Time's Up" : "Test Submitted",
          text: "Your test has been submitted successfully.",
          icon: "success",
          confirmButtonText: "Okay",
          confirmButtonColor: "#1e40af",
          allowOutsideClick: false,
        });

        navigate(`/student/${id}`);
      } catch (err) {
        console.error("[submitTest] Error:", err);
        setIsSubmitting(false);
        const errorMessage =
          err.response?.data?.msg || "Failed to submit test. Please try again.";
        await Swal.fire({
          title: "Submission Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "Okay",
          confirmButtonColor: "#1e40af",
        });
        setError(errorMessage);
      }
    },
    [
      test,
      attemptId,
      isSubmitted,
      answers,
      allQuestionIds,
      studentId,
      testId,
      type,
      navigate,
      determineStudentLevelAndPercentage,
    ]
  );

  const startTestAttempt = useCallback(async () => {
    const storageKey = `test_attempt_${studentId}_${testId}_${type}`;
    const storedAttemptId = sessionStorage.getItem(storageKey);
    if (storedAttemptId) {
      setAttemptId(storedAttemptId);
      try {
        const response = await axios.get(
          `http://103.118.158.24/api/api /test/test-time/${storedAttemptId}`,
          { withCredentials: true }
        );
        setTimeLeft(response.data.time_left_seconds);
        if (response.data.time_left_seconds <= 0 && !isSubmitted) {
          setIsTimeout(true);
          await submitTest(true);
        }
        return true;
      } catch (err) {
        console.error("[startTestAttempt] Error:", err);
        setError("Failed to fetch test time.");
        return false;
      }
    }

    try {
      const response = await axios.post(
        "http://103.118.158.24/api/api /test/start-test",
        { student_id: studentId, test_id: testId, test_type: type },
        { withCredentials: true }
      );
      setAttemptId(response.data.attempt_id);
      setTimeLeft(response.data.time_left_seconds);
      sessionStorage.setItem(storageKey, response.data.attempt_id);
      return true;
    } catch (err) {
      console.error("[startTestAttempt] Error:", err);
      setError("Failed to start test.");
      return false;
    }
  }, [studentId, testId, type, isSubmitted, submitTest]);

  const initializeTest = useCallback(() => {
    if (!test) return;
    const newQuestionQueue = {
      easy: [...(test.primary_questions?.easy || [])],
      medium: [...(test.primary_questions?.medium || [])],
      hard: [...(test.primary_questions?.hard || [])],
    };
    const newAdditionalQueue = {
      easy: [...(test.additional_questions?.easy || [])],
      medium: [...(test.additional_questions?.medium || [])],
      hard: [...(test.additional_questions?.hard || [])],
    };

    setQuestionQueue(newQuestionQueue);
    setAdditionalQueue(newAdditionalQueue);

    if (newQuestionQueue.easy.length > 0) {
      const firstQuestion = newQuestionQueue.easy[0];
      setCurrentQuestion(firstQuestion);
      setAskedQuestionIds([firstQuestion.id]);
      setQuestionQueue((prev) => ({
        ...prev,
        easy: prev.easy.slice(1),
      }));
    } else {
      setError("No easy questions available.");
    }
  }, [test]);

  const fetchAdditionalQuestions = useCallback(
    async (level, count) => {
      if (!test) return [];
      try {
        const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
        const response = await axios.get(
          `http://103.118.158.24/api/api /test/questions/${
            test.skill_id
          }/${levelId}?count=${count}&exclude=${askedQuestionIds.join(",")}`,
          { withCredentials: true }
        );
        const newQuestions = response.data;
        setAllQuestionIds((prev) => [
          ...prev,
          ...newQuestions.map((q) => q.id),
        ]);
        return newQuestions;
      } catch (err) {
        console.error("[fetchAdditionalQuestions] Error:", err);
        setError("Failed to fetch additional questions.");
        return [];
      }
    },
    [test, askedQuestionIds]
  );

  const getNextQuestion = useCallback(
    (level) => {
      const levelKey = level === 1 ? "easy" : level === 2 ? "medium" : "hard";
      if (questionQueue[levelKey].length > 0) {
        return questionQueue[levelKey][0];
      }
      if (additionalQueue[levelKey].length > 0) {
        return additionalQueue[levelKey][0];
      }
      return null;
    },
    [questionQueue, additionalQueue]
  );

  const handleOptionChange = useCallback(
    (option) => {
      if (timeLeft <= 0 || isSubmitted || !testStarted) return;
      const optionValue = getOptionValue(option);
      setSelectedOption(optionValue);
      if (currentQuestion) {
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: optionValue,
        }));
      }
    },
    [currentQuestion, timeLeft, isSubmitted, testStarted, getOptionValue]
  );

  const handleNextQuestion = useCallback(async () => {
    if (timeLeft <= 0 || isSubmitted || !testStarted) return;

    if (!currentQuestion || !selectedOption) {
      setError("Please select an option.");
      return;
    }

    const score = calculateScore(currentQuestion, selectedOption);
    setCorrectCounts((prev) => ({
      ...prev,
      [currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard"]:
        prev[
          currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard"
        ] + score,
    }));

    const levelKey =
      currentLevel === 1 ? "easy" : currentLevel === 2 ? "medium" : "hard";
    setQuestionsAskedByLevel((prev) => ({
      ...prev,
      [levelKey]: prev[levelKey] + 1,
    }));

    const newTotalAsked = totalAsked + 1;
    setTotalAsked(newTotalAsked);

    const maxQuestionsForLevel =
      currentLevel === 1
        ? test.easy_level_question
        : currentLevel === 2
        ? test.medium_level_question
        : test.hard_level_question;
    const isLastQuestionForLevel =
      questionsAskedByLevel[levelKey] + 1 === maxQuestionsForLevel;

    setSelectedOption("");

    if (newTotalAsked >= test.total_no_of_questions) {
      return;
    }

    let nextLevel = currentLevel;
    if (isLastQuestionForLevel) {
      const currentCorrect = correctCounts[levelKey] + score;
      const passMark =
        currentLevel === 1
          ? test.easy_pass_mark
          : currentLevel === 2
          ? test.medium_pass_mark
          : test.hard_pass_mark;

      if (currentCorrect >= passMark) {
        if (currentLevel === 1 && test.difficulty_level_id >= 2) {
          nextLevel = 2;
        } else if (currentLevel === 2 && test.difficulty_level_id === 3) {
          nextLevel = 3;
        }
      }
    }

    let nextQuestion = getNextQuestion(nextLevel);

    if (!nextQuestion && nextLevel !== currentLevel) {
      nextLevel = currentLevel;
      nextQuestion = getNextQuestion(currentLevel);
    }

    if (!nextQuestion) {
      const questions = await fetchAdditionalQuestions(nextLevel, 1);
      if (questions.length > 0) {
        nextQuestion = questions[0];
        setAdditionalQueue((prev) => ({
          ...prev,
          [nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard"]: [
            ...prev[
              nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard"
            ],
            ...questions,
          ],
        }));
      }
    }

    if (!nextQuestion) {
      setError("No more questions available.");
      await submitTest(false);
      return;
    }

    const nextLevelKey =
      nextLevel === 1 ? "easy" : nextLevel === 2 ? "medium" : "hard";
    if (
      questionQueue[nextLevelKey].length > 0 &&
      questionQueue[nextLevelKey][0]?.id === nextQuestion.id
    ) {
      setQuestionQueue((prev) => ({
        ...prev,
        [nextLevelKey]: prev[nextLevelKey].slice(1),
      }));
    } else if (
      additionalQueue[nextLevelKey].length > 0 &&
      additionalQueue[nextLevelKey][0]?.id === nextQuestion.id
    ) {
      setAdditionalQueue((prev) => ({
        ...prev,
        [nextLevelKey]: prev[nextLevelKey].slice(1),
      }));
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
    questionsAskedByLevel,
    getNextQuestion,
    fetchAdditionalQuestions,
    questionQueue,
    additionalQueue,
    askedQuestionIds,
    timeLeft,
    isSubmitted,
    testStarted,
    submitTest,
  ]);

  const handleStartTest = async () => {
    const success = await startTestAttempt();
    if (success) {
      setTestStarted(true);
      setIsModalOpen(false);
      initializeTest();
    }
  };

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(
          `http://103.118.158.24/api/api /test/all-tests/${studentId}`,
          {
            withCredentials: true,
          }
        );
        const tests = response.data;
        const selectedTest = tests.find(
          (t) => t.test_id === Number(testId) && t.test_type === type
        );
        if (!selectedTest) {
          setError("Test not found.");
          return;
        }
        setTest(selectedTest);

        const primaryQuestions = selectedTest.primary_questions || {
          easy: [],
          medium: [],
          hard: [],
        };
        const additionalQuestions = selectedTest.additional_questions || {
          easy: [],
          medium: [],
          hard: [],
        };
        setQuestionQueue({
          easy: primaryQuestions.easy || [],
          medium: primaryQuestions.medium || [],
          hard: primaryQuestions.hard || [],
        });
        setAdditionalQueue({
          easy: additionalQuestions.easy || [],
          medium: additionalQuestions.medium || [],
          hard: additionalQuestions.hard || [],
        });

        const allIds = [
          ...(primaryQuestions.easy || []).map((q) => q.id),
          ...(primaryQuestions.medium || []).map((q) => q.id),
          ...(primaryQuestions.hard || []).map((q) => q.id),
          ...(additionalQuestions.easy || []).map((q) => q.id),
          ...(additionalQuestions.medium || []).map((q) => q.id),
          ...(additionalQuestions.hard || []).map((q) => q.id),
        ].filter((id) => id != null);
        setAllQuestionIds(allIds);
      } catch (err) {
        console.error("[fetchTestData] Error:", err);
        setError("Failed to load test data.");
      }
    };

    fetchTestData();
  }, [studentId, testId, type]);

  useEffect(() => {
    if (!testStarted || !attemptId || isSubmitted) return;

    const timer = setInterval(() => {
      axios
        .get(`http://103.118.158.24/api/api /test/test-time/${attemptId}`, {
          withCredentials: true,
        })
        .then((response) => {
          const { time_left_seconds } = response.data;
          setTimeLeft(time_left_seconds);
          if (time_left_seconds <= 0 && !isSubmitted && !isTimeout) {
            setIsTimeout(true);
            submitTest(true);
          }
        })
        .catch((err) => {
          console.error("[Timer] Error:", err);
          setError("Failed to sync timer.");
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptId, isSubmitted, isTimeout, submitTest, testStarted]);

  if (error && !isModalOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 select-none">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Occurred
          </h3>
          <p className="text-gray-600 mb-5 text-sm">{error}</p>
          <button
            onClick={() => navigate(`/student/${id}`)}
            className="w-full bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 select-none">
        <div className="text-center">
          <div className="animate-pulse flex justify-center mb-4">
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Loading Test...
          </h1>
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg max-w-md mx-auto text-sm flex items-center justify-center border border-red-200">
              <AlertCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 sm:px-6 lg:px-8 font-sans select-none">
      <Transition.Root show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-100/30 backdrop-blur-md" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:scale-95"
              >
                <Dialog.Panel className="relative bg-white/95 rounded-xl px-6 py-8 shadow-lg max-w-md w-full border border-gray-200">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <BookOpen className="w-8 h-8 text-blue-700" />
                    </div>
                  </div>
                  <Dialog.Title className="text-xl font-semibold text-gray-900 text-center mb-4">
                    {test.test_name || "Test"} Instructions
                  </Dialog.Title>
                  <div className="text-gray-600 text-base space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <BookOpen className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Welcome! </span> You are about to begin{" "}
                        <span className="font-medium">{test.test_name || "the test"}</span>, which consists of{" "}
                        <span className="font-medium">{test.total_no_of_questions}</span> questions.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Academic Integrity:</span> Any form of malpractice, including switching tabs, copying, pasting, or using unauthorized resources, is strictly prohibited and may result in disqualification.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Internet Connectivity:</span> Ensure a stable internet connection throughout the test. Disconnections may disrupt the real-time testing platform, and responses may not be saved if connectivity is lost.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <BookOpen className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Project Assignment:</span> Based on your score and performance level, a project will be assigned. Failure to meet the required threshold will result in no project assignment.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <Clock className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Time Management:</span> The test is timed. If the time expires, the test will automatically submit, and your score will be finalized. You will not be permitted to reattempt the test.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={handleStartTest}
                      className="w-full bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center"
                    >
                      Start Test
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="order-1 sm:order-none">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              {test.test_name || "Test"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Complete all questions to finish the test
            </p>
          </div>
          {testStarted && (
            <div className="flex items-center gap-3 order-2 sm:order-none">
              <div
                className={`flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm border ${
                  timeLeft <= 0 ? "border-red-200 bg-red-50" : "border-gray-200"
                }`}
              >
                <Clock
                  className={`w-4 h-4 mr-1.5 ${
                    timeLeft <= 0 ? "text-red-600" : currentLevelColors.accent
                  }`}
                />
                <span
                  className={`font-mono text-sm font-medium ${
                    timeLeft <= 0 ? "text-red-800" : "text-gray-800"
                  }`}
                >
                  {minutes < 10 ? `0${minutes}` : minutes}:
                  {seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
              {totalAsked + 1 === test.total_no_of_questions && (
                <button
                  onClick={() => submitTest(false)}
                  disabled={
                    isSubmitting || isSubmitted || timeLeft <= 0 || !selectedOption
                  }
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
                    isSubmitting ||
                    isSubmitted ||
                    timeLeft <= 0 ||
                    !selectedOption
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-700 hover:bg-green-800 shadow-sm focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  Submit
                </button>
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-4 flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div
          className={`bg-white border ${currentLevelColors.border} ${currentLevelColors.bg} rounded-lg p-5 sm:p-6 shadow-sm transition-all duration-200 select-none`}
        >
          {testStarted && !currentQuestion ? (
            <div className="py-6 text-center">
              <div className="animate-pulse">
                <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">Loading question...</p>
              </div>
            </div>
          ) : testStarted && currentQuestion ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
                  Question {totalAsked + 1} of {test.total_no_of_questions}
                </div>
                <div className="h-2 w-16 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className={`h-full ${currentLevelColors.progress}`}
                    style={{
                      width: `${
                        (questionsAskedByLevel[
                          currentLevel === 1
                            ? "easy"
                            : currentLevel === 2
                            ? "medium"
                            : "hard"
                        ] /
                          (currentLevel === 1
                            ? test.easy_level_question
                            : currentLevel === 2
                            ? test.medium_level_question
                            : test.hard_level_question)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="mb-5">
                <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed">
                  {stripHtml(currentQuestion.questions)}
                </p>
              </div>
              <div className="space-y-3">
                {Array.isArray(currentQuestion.option) &&
                currentQuestion.option.length > 0 ? (
                  currentQuestion.option.map((opt, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
                        selectedOption === getOptionValue(opt)
                          ? `${currentLevelColors.selected} border-blue-300 shadow-sm`
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      } ${
                        timeLeft <= 0 || isSubmitted ? "cursor-not-allowed" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="option"
                        value={getOptionValue(opt)}
                        checked={selectedOption === getOptionValue(opt)}
                        onChange={() => handleOptionChange(opt)}
                        className="mt-0.5 w-4 h-4 text-blue-700 focus:ring-blue-600 border-gray-300"
                        disabled={timeLeft <= 0 || isSubmitted}
                      />
                      <span className="ml-3 text-gray-700 text-sm sm:text-base">
                        {getOptionText(opt)}
                      </span>
                    </label>
                  ))
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-lg">
                    <p className="text-sm">
                      No options available for this question.
                    </p>
                  </div>
                )}
              </div>
              {totalAsked + 1 < test.total_no_of_questions && (
                <div className="flex justify-end mt-5">
                  <button
                    onClick={handleNextQuestion}
                    disabled={
                      !selectedOption ||
                      timeLeft <= 0 ||
                      isSubmitted ||
                      isSubmitting
                    }
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedOption &&
                      timeLeft > 0 &&
                      !isSubmitted &&
                      !isSubmitting
                        ? `${currentLevelColors.button} text-white shadow-sm hover:shadow-md focus:ring-blue-600`
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1.5" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 text-sm">Please start the test to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}