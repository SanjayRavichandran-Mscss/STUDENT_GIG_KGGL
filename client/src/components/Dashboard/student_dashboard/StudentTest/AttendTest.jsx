// import axios from 'axios';
// import { useCallback, useEffect, useState, useMemo } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { Dialog, Transition } from '@headlessui/react';
// import { Fragment } from 'react';
// import { BookOpen, Clock, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';
// import Swal from 'sweetalert2';

// export default function AttendTest() {
//   const { id, testId, type } = useParams();
//   const navigate = useNavigate();
//   const studentId = atob(id);
//   const [test, setTest] = useState(null);
//   const [currentQuestion, setCurrentQuestion] = useState(null);
//   const [selectedOption, setSelectedOption] = useState('');
//   const [questionQueue, setQuestionQueue] = useState({ easy: [], medium: [], hard: [] });
//   const [askedQuestionIds, setAskedQuestionIds] = useState(new Set());
//   const [currentLevel, setCurrentLevel] = useState(1);
//   const [totalAsked, setTotalAsked] = useState(0);
//   const [questionsAskedByLevel, setQuestionsAskedByLevel] = useState({
//     easy: 0,
//     medium: 0,
//     hard: 0,
//   });
//   const [correctCounts, setCorrectCounts] = useState({
//     easy: 0,
//     medium: 0,
//     hard: 0,
//   });
//   const [answers, setAnswers] = useState({});
//   const [error, setError] = useState('');
//   const [testStarted, setTestStarted] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(true);
//   const [attemptId, setAttemptId] = useState(null);
//   const [timeLeft, setTimeLeft] = useState(null);
//   const [isSubmitted, setIsSubmitted] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isTimeout, setIsTimeout] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const TOTAL_QUESTIONS = 21;
//   const EASY_QUESTIONS = 10;
//   const MEDIUM_QUESTIONS = 6;
//   const HARD_QUESTIONS = 4;

//   const levelColors = useMemo(
//     () => ({
//       1: {
//         bg: 'bg-blue-50',
//         border: 'border-blue-300',
//         text: 'text-blue-900',
//         selected: 'bg-blue-100',
//         button: 'bg-blue-700 hover:bg-blue-800',
//         progress: 'bg-blue-600',
//         accent: 'text-blue-700',
//       },
//       2: {
//         bg: 'bg-purple-50',
//         border: 'border-purple-300',
//         text: 'text-purple-900',
//         selected: 'bg-purple-100',
//         button: 'bg-purple-700 hover:bg-purple-800',
//         progress: 'bg-purple-600',
//         accent: 'text-purple-700',
//       },
//       3: {
//         bg: 'bg-teal-50',
//         border: 'border-teal-300',
//         text: 'text-teal-900',
//         selected: 'bg-teal-100',
//         button: 'bg-teal-700 hover:bg-teal-800',
//         progress: 'bg-teal-600',
//         accent: 'text-teal-700',
//       },
//     }),
//     []
//   );

//   const currentLevelColors = levelColors[currentLevel] || levelColors[1];

//   const stripHtml = useCallback((html) => {
//     if (!html || typeof html !== 'string') return '';
//     const div = document.createElement('div');
//     div.innerHTML = html;
//     return div.textContent || div.innerText || '';
//   }, []);

//   const getOptionValue = useCallback((opt) => {
//     if (!opt) return '';
//     if (typeof opt === 'string') return opt.trim();
//     if (typeof opt === 'object') {
//       return (
//         (opt.option ||
//           opt.text ||
//           opt.value ||
//           opt.option_text ||
//           opt.option_value ||
//           JSON.stringify(opt))?.trim() || ''
//       );
//     }
//     return '';
//   }, []);

//   const getOptionText = useCallback(
//     (opt) => {
//       if (!opt) return 'Invalid option';
//       if (typeof opt === 'string') return stripHtml(opt);
//       if (typeof opt === 'object') {
//         return stripHtml(
//           opt.option ||
//             opt.text ||
//             opt.value ||
//             opt.option_text ||
//             'Invalid option'
//         );
//       }
//       return 'Invalid option';
//     },
//     [stripHtml]
//   );

//   const calculateScore = useCallback((question, selected) => {
//     if (!question || !selected || !question.correct_answer) return 0;
//     const correctAnswer = getOptionValue(question.correct_answer);
//     return selected.trim() === correctAnswer.trim() ? 1 : 0;
//   }, [getOptionValue]);

//   const submitTest = useCallback(
//     async (isTimeoutSubmission = false) => {
//       if (!test || !attemptId || isSubmitted) return;
//       setIsSubmitting(true);

//       try {
//         const easyAttended = Math.min(questionsAskedByLevel.easy, EASY_QUESTIONS);
//         const mediumAttended = Math.min(questionsAskedByLevel.medium, MEDIUM_QUESTIONS);
//         const hardAttended = Math.min(questionsAskedByLevel.hard, HARD_QUESTIONS);
//         const totalAttended = easyAttended + mediumAttended + hardAttended;

//         const easyScore = Math.min(correctCounts.easy, easyAttended);
//         const mediumScore = Math.min(correctCounts.medium, mediumAttended);
//         const hardScore = Math.min(correctCounts.hard, hardAttended);
//         const totalScore = easyScore + mediumScore + hardScore;
//         const incorrectAnswerCount = totalAttended - totalScore;
//         const percentage = ((totalScore / TOTAL_QUESTIONS) * 100).toFixed(2);

//         let studentLevel = 'Failed';
//         if (easyScore >= test.easy_pass_mark) {
//           studentLevel = 'Easy';
//           if (test.difficulty_level_id >= 2 && mediumScore >= test.medium_pass_mark) {
//             studentLevel = 'Medium';
//             if (test.difficulty_level_id === 3 && hardScore >= test.hard_pass_mark) {
//               studentLevel = 'Hard';
//             }
//           }
//         }

//         const endTime = new Date();
//         const parsedStartTime = new Date(startTime);
//         if (isNaN(parsedStartTime.getTime())) {
//           throw new Error('Invalid test start time');
//         }
//         const durationMs = endTime - parsedStartTime;
//         const durationSeconds = Math.max(0, Math.floor(durationMs / 1000));
//         const hours = Math.floor(durationSeconds / 3600);
//         const minutes = Math.floor((durationSeconds % 3600) / 60);
//         const seconds = durationSeconds % 60;
//         const completedDuration = `${hours.toString().padStart(2, '0')}:${minutes
//           .toString()
//           .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

//         const submissionData = {
//           test_id: test.test_id,
//           student_id: studentId,
//           answers,
//           easy_score: easyScore,
//           medium_score: mediumScore,
//           hard_score: hardScore,
//           total_score: totalScore,
//           incorrect_answer_count: incorrectAnswerCount,
//           skipped_question_count: 0,
//           student_level: studentLevel,
//           percentage: parseFloat(percentage),
//           attempt_id: attemptId,
//           easy_attended: easyAttended,
//           medium_attended: mediumAttended,
//           hard_attended: hardAttended,
//         };

//         const performanceData = {
//           test_id: test.test_id,
//           student_id: studentId,
//           performance: answers,
//           completed_duration: completedDuration,
//         };

//         await Promise.all([
//           axios.post('http://localhost:5000/api/test/submit-test', submissionData, {
//             withCredentials: true,
//             headers: { 'Content-Type': 'application/json' },
//           }),
//           axios.post('http://localhost:5000/api/test/save-performance', performanceData, {
//             withCredentials: true,
//             headers: { 'Content-Type': 'application/json' },
//           }),
//         ]);

//         sessionStorage.removeItem(`test_attempt_${studentId}_${testId}_${type}`);
//         setIsSubmitted(true);

//         await Swal.fire({
//           title: isTimeoutSubmission ? "Time's Up" : 'Test Submitted',
//           text: 'Your test has been submitted successfully.',
//           icon: 'success',
//           confirmButtonText: 'Okay',
//           confirmButtonColor: '#1e40af',
//           allowOutsideClick: false,
//         });

//         navigate(`/student/${id}`);
//       } catch (err) {
//         console.error('[submitTest] Error:', err);
//         setError(err.response?.data?.msg || 'Failed to submit test.');
//         await Swal.fire({
//           title: 'Submission Error',
//           text: err.response?.data?.msg || 'Failed to submit test.',
//           icon: 'error',
//           confirmButtonText: 'Okay',
//           confirmButtonColor: '#1e40af',
//         });
//       } finally {
//         setIsSubmitting(false);
//       }
//     },
//     [
//       test,
//       attemptId,
//       isSubmitted,
//       correctCounts,
//       answers,
//       studentId,
//       testId,
//       type,
//       navigate,
//       questionsAskedByLevel,
//       startTime,
//     ]
//   );

//   const startTestAttempt = useCallback(async () => {
//     const storageKey = `test_attempt_${studentId}_${testId}_${type}`;
//     const storedAttemptId = sessionStorage.getItem(storageKey);
//     if (storedAttemptId) {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/test/test-time/${storedAttemptId}`, {
//           withCredentials: true,
//         });
//         setAttemptId(storedAttemptId);
//         setTimeLeft(response.data.time_left_seconds);
//         setStartTime(response.data.start_time);
//         if (response.data.time_left_seconds <= 0 && !isSubmitted) {
//           setIsTimeout(true);
//           await submitTest(true);
//           return false;
//         }
//         return true;
//       } catch (err) {
//         console.error('[startTestAttempt] Error:', err);
//         setError('Failed to fetch test time.');
//         return false;
//       }
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/test/start-test',
//         { student_id: studentId, test_id: testId, test_type: type },
//         { withCredentials: true }
//       );
//       setAttemptId(response.data.attempt_id);
//       setTimeLeft(response.data.time_left_seconds);
//       setStartTime(response.data.start_time);
//       sessionStorage.setItem(storageKey, response.data.attempt_id);
//       return true;
//     } catch (err) {
//       console.error('[startTestAttempt] Error:', err);
//       setError('Failed to start test.');
//       return false;
//     }
//   }, [studentId, testId, type, isSubmitted, submitTest]);

//   const initializeTest = useCallback(() => {
//     if (!test) return;
//     const newQuestionQueue = {
//       easy: [...(test.primary_questions?.easy || [])].filter((q) => !askedQuestionIds.has(q.id)),
//       medium: [...(test.primary_questions?.medium || [])].filter((q) => !askedQuestionIds.has(q.id)),
//       hard: [...(test.primary_questions?.hard || [])].filter((q) => !askedQuestionIds.has(q.id)),
//     };

//     setQuestionQueue(newQuestionQueue);

//     if (newQuestionQueue.easy.length > 0) {
//       const firstQuestion = newQuestionQueue.easy[0];
//       setCurrentQuestion(firstQuestion);
//       setAskedQuestionIds(new Set([firstQuestion.id]));
//       setTotalAsked(1);
//       setQuestionsAskedByLevel((prev) => ({ ...prev, easy: 1 }));
//       setQuestionQueue((prev) => ({
//         ...prev,
//         easy: prev.easy.filter((q) => q.id !== firstQuestion.id),
//       }));
//     } else {
//       setError('No easy questions available.');
//     }
//   }, [test, askedQuestionIds]);

//   const fetchAdditionalQuestions = useCallback(
//     async (level, count) => {
//       if (!test) return [];
//       try {
//         const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
//         const response = await axios.get(
//           `http://localhost:5000/api/test/questions/${test.skill_id}/${levelId}?count=${count}&exclude=${Array.from(
//             askedQuestionIds
//           ).join(',')}`,
//           { withCredentials: true }
//         );
//         const newQuestions = response.data.filter((q) => !askedQuestionIds.has(q.id));
//         if (newQuestions.length === 0) {
//           console.warn(`No additional ${levelId === 1 ? 'easy' : levelId === 2 ? 'medium' : 'hard'} questions available.`);
//         }
//         return newQuestions;
//       } catch (err) {
//         console.error('[fetchAdditionalQuestions] Error:', err);
//         setError('Failed to fetch additional questions.');
//         return [];
//       }
//     },
//     [test, askedQuestionIds]
//   );

//   const getNextQuestion = useCallback(
//     async (level) => {
//       const levelKey = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
//       const availablePrimary = questionQueue[levelKey].filter((q) => !askedQuestionIds.has(q.id));

//       if (availablePrimary.length > 0) {
//         return availablePrimary[0];
//       }

//       const additionalQuestions = await fetchAdditionalQuestions(level, 1);
//       if (additionalQuestions.length > 0) {
//         setQuestionQueue((prev) => ({
//           ...prev,
//           [levelKey]: [...prev[levelKey], ...additionalQuestions],
//         }));
//         return additionalQuestions[0];
//       }

//       return null;
//     },
//     [questionQueue, askedQuestionIds, fetchAdditionalQuestions]
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

// const handleNextQuestion = useCallback(
//   async () => {
//     if (timeLeft <= 0 || isSubmitted || !testStarted || totalAsked >= TOTAL_QUESTIONS) return;

//     if (!currentQuestion || !selectedOption) {
//       setError('Please select an option before proceeding.');
//       return;
//     }

//     const score = calculateScore(currentQuestion, selectedOption);
//     const levelKey = currentLevel === 1 ? 'easy' : currentLevel === 2 ? 'medium' : 'hard';

//     // Update correct counts first
//     const newCorrectCounts = {
//       ...correctCounts,
//       [levelKey]: correctCounts[levelKey] + score,
//     };
//     setCorrectCounts(newCorrectCounts);

//     // Update answers
//     setAnswers((prev) => ({
//       ...prev,
//       [currentQuestion.id]: selectedOption,
//     }));

//     const newTotalAsked = totalAsked + 1;
//     setTotalAsked(newTotalAsked);
//     const newQuestionsAskedByLevel = {
//       ...questionsAskedByLevel,
//       [levelKey]: questionsAskedByLevel[levelKey] + 1,
//     };
//     setQuestionsAskedByLevel(newQuestionsAskedByLevel);

//     if (newTotalAsked >= TOTAL_QUESTIONS) {
//       await submitTest();
//       return;
//     }

//     // Determine next level based on current performance and question counts
//     let nextLevel = currentLevel;
    
//     // Check if we've completed the minimum questions for current level and passed
//     if (currentLevel === 1 && 
//         newQuestionsAskedByLevel.easy >= EASY_QUESTIONS && 
//         newCorrectCounts.easy >= test.easy_pass_mark && 
//         test.difficulty_level_id >= 2) {
//       nextLevel = 2;
//     } 
//     else if (currentLevel === 2 && 
//              newQuestionsAskedByLevel.medium >= MEDIUM_QUESTIONS && 
//              newCorrectCounts.medium >= test.medium_pass_mark && 
//              test.difficulty_level_id >= 3) {
//       nextLevel = 3;
//     }

//     // Get next question from the determined level
//     let nextQuestion = await getNextQuestion(nextLevel);

//     // If no questions available in next level, try current level
//     if (!nextQuestion && nextLevel !== currentLevel) {
//       nextQuestion = await getNextQuestion(currentLevel);
//       if (nextQuestion) {
//         nextLevel = currentLevel; // Revert to current level if we found questions
//       }
//     }

//     if (!nextQuestion) {
//       setError('No more questions available.');
//       await submitTest();
//       return;
//     }

//     // Update question queue
//     const nextLevelKey = nextLevel === 1 ? 'easy' : nextLevel === 2 ? 'medium' : 'hard';
//     setQuestionQueue((prev) => ({
//       ...prev,
//       [nextLevelKey]: prev[nextLevelKey].filter((q) => q.id !== nextQuestion.id),
//     }));

//     setCurrentLevel(nextLevel);
//     setCurrentQuestion(nextQuestion);
//     setAskedQuestionIds((prev) => new Set([...prev, nextQuestion.id]));
//     setSelectedOption('');
//   },
//   [
//     currentQuestion,
//     selectedOption,
//     calculateScore,
//     currentLevel,
//     totalAsked,
//     test,
//     correctCounts,
//     answers,
//     questionsAskedByLevel,
//     getNextQuestion,
//     timeLeft,
//     isSubmitted,
//     testStarted,
//     submitTest,
//   ]
// );

//   const handleStartTest = useCallback(async () => {
//     const success = await startTestAttempt();
//     if (success) {
//       setTestStarted(true);
//       setIsModalOpen(false);
//       initializeTest();
//     }
//   }, [startTestAttempt, initializeTest]);

//   useEffect(() => {
//     const fetchTestData = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5000/api/test/all-tests/${studentId}`, {
//           withCredentials: true,
//         });
//         const tests = response.data;
//         const selectedTest = tests.find(
//           (t) => t.test_id === Number(testId) && t.test_type.toLowerCase() === type.toLowerCase()
//         );
//         if (!selectedTest) {
//           setError('Test not found.');
//           return;
//         }

//         const primary_questions = {
//           easy: [],
//           medium: [],
//           hard: [],
//         };

//         const uniqueQuestions = [];
//         const seenIds = new Set();
//         selectedTest.test_questions.forEach((question) => {
//           if (!seenIds.has(question.id)) {
//             uniqueQuestions.push(question);
//             seenIds.add(question.id);
//           }
//         });

//         uniqueQuestions.forEach((question) => {
//           if (question.id === 48) {
//             question.correct_answer = 'String';
//           }
//           if (question.difficulty_level_id === 1) {
//             primary_questions.easy.push(question);
//           } else if (question.difficulty_level_id === 2) {
//             primary_questions.medium.push(question);
//           } else if (question.difficulty_level_id === 3) {
//             primary_questions.hard.push(question);
//           }
//         });

//         if (
//           primary_questions.easy.length < EASY_QUESTIONS ||
//           primary_questions.medium.length < MEDIUM_QUESTIONS ||
//           primary_questions.hard.length < HARD_QUESTIONS
//         ) {
//           setError('Insufficient questions available for the test.');
//           return;
//         }

//         setTest({
//           ...selectedTest,
//           primary_questions,
//           total_no_of_questions: TOTAL_QUESTIONS,
//           easy_level_question: EASY_QUESTIONS,
//           medium_level_question: MEDIUM_QUESTIONS,
//           hard_level_question: HARD_QUESTIONS,
//           easy_pass_mark: 6,
//           medium_pass_mark: 4,
//           hard_pass_mark: 2,
//           difficulty_level_id: 3,
//         });
//       } catch (err) {
//         console.error('[fetchTestData] Error:', err);
//         setError('Failed to load test data.');
//       }
//     };

//     fetchTestData();
//   }, [studentId, testId, type]);

//   useEffect(() => {
//     if (!testStarted || !attemptId || isSubmitted) return;

//     const timer = setInterval(() => {
//       axios
//         .get(`http://localhost:5000/api/test/test-time/${attemptId}`, {
//           withCredentials: true,
//         })
//         .then((response) => {
//           const { time_left_seconds } = response.data;
//           setTimeLeft(time_left_seconds);
//           if (time_left_seconds <= 0 && !isSubmitted && !isTimeout) {
//             setIsTimeout(true);
//             submitTest(true);
//           }
//         })
//         .catch((err) => {
//           console.error('[Timer] Error:', err);
//           setError('Failed to sync timer.');
//         });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [attemptId, isSubmitted, isTimeout, submitTest, testStarted]);

//   const minutes = timeLeft != null ? Math.floor(timeLeft / 60) : 0;
//   const seconds = timeLeft != null ? timeLeft % 60 : 0;

//   if (error && !isModalOpen) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 select-none">
//         <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200">
//           <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
//           <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Occurred</h3>
//           <p className="text-gray-600 mb-5 text-sm">{error}</p>
//           <button
//             onClick={() => navigate(`/student/${id}`)}
//             className="w-full bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
//           >
//             Back to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!test) {
//     return (
//       <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 select-none">
//         <div className="text-center">
//           <div className="animate-pulse flex justify-center mb-4">
//             <BookOpen className="w-10 h-10 text-blue-600" />
//           </div>
//           <h1 className="text-xl font-semibold text-gray-900 mb-3">Loading Test...</h1>
//           {error && (
//             <div className="bg-red-50 text-red-700 p-3 rounded-lg max-w-md mx-auto text-sm flex items-center justify-center border border-red-200">
//               <AlertCircle className="w-4 h-4 mr-2" />
//               {error}
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 py-4 px-4 sm:px-6 lg:px-8 font-sans select-none">
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
//             <div className="fixed inset-0 bg-gray-100/30 backdrop-blur-md" />
//           </Transition.Child>
//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 translate-y-4 sm:scale-95"
//                 enterTo="opacity-100 translate-y-0 sm:scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 translate-y-0 sm:scale-100"
//                 leaveTo="opacity-0 translate-y-4 sm:scale-95"
//               >
//                 <Dialog.Panel className="relative bg-white/95 rounded-xl px-6 py-8 shadow-lg max-w-md w-full border border-gray-200">
//                   <div className="flex justify-center mb-4">
//                     <div className="bg-blue-100 p-3 rounded-full">
//                       <BookOpen className="w-8 h-8 text-blue-700" />
//                     </div>
//                   </div>
//                   <Dialog.Title className="text-xl font-semibold text-gray-900 text-center mb-4">
//                     {test.test_name || 'Test'} Instructions
//                   </Dialog.Title>
//                   <div className="text-gray-600 text-base space-y-4 mb-6">
//                     <div className="flex items-start">
//                       <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
//                         <BookOpen className="w-4 h-4 text-blue-700" />
//                       </div>
//                       <p>
//                         <span className="font-medium">Welcome! </span> You are about to begin{' '}
//                         <span className="font-medium">{test.test_name || 'the test'}</span>, which consists of{' '}
//                         <span className="font-medium">{TOTAL_QUESTIONS}</span> questions.
//                       </p>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
//                         <AlertCircle className="w-4 h-4 text-blue-700" />
//                       </div>
//                       <p>
//                         <span className="font-medium">Academic Integrity:</span> Any form of malpractice is prohibited.
//                       </p>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
//                         <Clock className="w-4 h-4 text-blue-700" />
//                       </div>
//                       <p>
//                         <span className="font-medium">Time Management:</span> The test is timed. If time expires, it will auto-submit.
//                       </p>
//                     </div>
//                   </div>
//                   <div className="mt-6">
//                     <button
//                       onClick={handleStartTest}
//                       className="w-full bg-blue-700 text-white px-4 py-2.5 rounded-lg hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 flex items-center justify-center"
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
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
//           <div className="order-1 sm:order-none">
//             <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{test.test_name || 'Test'}</h1>
//             <p className="text-gray-500 text-sm mt-1">Complete all questions to finish the test</p>
//           </div>
//           {testStarted && (
//             <div className="flex items-center gap-3 order-2 sm:order-none">
//               <div
//                 className={`flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm border ${
//                   timeLeft <= 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'
//                 }`}
//               >
//                 <Clock
//                   className={`w-4 h-4 mr-1.5 ${timeLeft <= 0 ? 'text-red-600' : currentLevelColors.accent}`}
//                 />
//                 <span className={`font-mono text-sm font-medium ${timeLeft <= 0 ? 'text-red-800' : 'text-gray-800'}`}>
//                   {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
//                 </span>
//               </div>
//               {totalAsked >= TOTAL_QUESTIONS && (
//                 <button
//                   onClick={() => submitTest(false)}
//                   disabled={isSubmitting || isSubmitted || timeLeft <= 0 || !selectedOption}
//                   className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
//                     isSubmitting || isSubmitted || timeLeft <= 0 || !selectedOption
//                       ? 'bg-gray-400 cursor-not-allowed'
//                       : 'bg-green-700 hover:bg-green-800 shadow-sm focus:ring-2 focus:ring-green-600 focus:ring-offset-2'
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
//           <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg mb-4 flex items-start">
//             <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
//             <span className="text-sm">{error}</span>
//           </div>
//         )}

//         <div
//           className={`bg-white border ${currentLevelColors.border} ${currentLevelColors.bg} rounded-lg p-5 sm:p-6 shadow-sm transition-all duration-200 select-none`}
//         >
//           {testStarted && !currentQuestion ? (
//             <div className="py-6 text-center">
//               <div className="animate-pulse">
//                 <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-600 text-sm">Loading question...</p>
//               </div>
//             </div>
//           ) : testStarted && currentQuestion ? (
//             <>
//               <div className="flex justify-between items-center mb-4">
//                 <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
//                   Question {totalAsked} of {TOTAL_QUESTIONS-1}
//                 </div>
//                 <div className="h-2 w-16 rounded-full overflow-hidden bg-gray-200">
//                   <div
//                     className={`h-full ${currentLevelColors.progress}`}
//                     style={{
//                       width: `${
//                         (questionsAskedByLevel[
//                           currentLevel === 1 ? 'easy' : currentLevel === 2 ? 'medium' : 'hard'
//                         ] /
//                           (currentLevel === 1
//                             ? EASY_QUESTIONS
//                             : currentLevel === 2
//                             ? MEDIUM_QUESTIONS
//                             : HARD_QUESTIONS)) *
//                         100
//                       }%`,
//                     }}
//                   />
//                 </div>
//               </div>
//               <div className="mb-5">
//                 <p className="text-gray-800 font-medium text-base sm:text-lg leading-relaxed">
//                   {stripHtml(currentQuestion.questions)}
//                 </p>
//               </div>
//               <div className="space-y-3">
//                 {Array.isArray(currentQuestion.option) && currentQuestion.option.length > 0 ? (
//                   currentQuestion.option.map((opt, index) => (
//                     <label
//                       key={index}
//                       className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
//                         selectedOption === getOptionValue(opt)
//                           ? `${currentLevelColors.selected} border-blue-300 shadow-sm`
//                           : 'bg-white hover:bg-gray-50 border-gray-200'
//                       } ${timeLeft <= 0 || isSubmitted ? 'cursor-not-allowed' : ''}`}
//                     >
//                       <input
//                         type="radio"
//                         name="option"
//                         value={getOptionValue(opt)}
//                         checked={selectedOption === getOptionValue(opt)}
//                         onChange={() => handleOptionChange(opt)}
//                         className="mt-0.5 w-4 h-4 text-blue-700 focus:ring-blue-600 border-gray-300"
//                         disabled={timeLeft <= 0 || isSubmitted}
//                       />
//                       <span className="ml-3 text-gray-700 text-sm sm:text-base">{getOptionText(opt)}</span>
//                     </label>
//                   ))
//                 ) : (
//                   <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-lg">
//                     <p className="text-sm">No options available for this question.</p>
//                   </div>
//                 )}
//               </div>
//               {totalAsked < TOTAL_QUESTIONS && (
//                 <div className="flex justify-end mt-5">
//                   <button
//                     onClick={handleNextQuestion}
//                     disabled={!selectedOption || timeLeft <= 0 || isSubmitted || isSubmitting}
//                     className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
//                       selectedOption && timeLeft > 0 && !isSubmitted && !isSubmitting
//                         ? `${currentLevelColors.button} text-white shadow-sm hover:shadow-md focus:ring-blue-600`
//                         : 'bg-gray-500 text-white cursor-not-allowed'
//                     }`}
//                   >
//                     Next
//                     <ChevronRight className="w-4 h-4 ml-2" />
//                   </button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="py-6 text-center">
//               <div className="animate-pulse">
//                 <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
//                 <p className="text-gray-500 text-sm">Please start the test to begin.</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }









































import axios from 'axios';
import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { BookOpen, Clock, AlertCircle, ChevronRight, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

export default function AttendTest() {
  const { id, testId, type } = useParams();
  const navigate = useNavigate();
  const studentId = atob(id);
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [questionQueue, setQuestionQueue] = useState({ easy: [], medium: [], hard: [] });
  const [askedQuestionIds, setAskedQuestionIds] = useState(new Set());
  const [currentLevel, setCurrentLevel] = useState(1);
  const [totalAsked, setTotalAsked] = useState(0);
  const [questionsAskedByLevel, setQuestionsAskedByLevel] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [correctCounts, setCorrectCounts] = useState({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [attemptId, setAttemptId] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTimeout, setIsTimeout] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const TOTAL_QUESTIONS = 20;

  const levelColors = useMemo(
    () => ({
      1: {
        bg: 'bg-blue-50',
        border: 'border-blue-300',
        text: 'text-blue-900',
        selected: 'bg-blue-100',
        button: 'bg-blue-700 hover:bg-blue-800',
        progress: 'bg-blue-600',
        accent: 'text-blue-700',
      },
      2: {
        bg: 'bg-purple-50',
        border: 'border-purple-300',
        text: 'text-purple-900',
        selected: 'bg-purple-100',
        button: 'bg-purple-700 hover:bg-purple-800',
        progress: 'bg-purple-600',
        accent: 'text-purple-700',
      },
      3: {
        bg: 'bg-teal-50',
        border: 'border-teal-300',
        text: 'text-teal-900',
        selected: 'bg-teal-100',
        button: 'bg-teal-700 hover:bg-teal-800',
        progress: 'bg-teal-600',
        accent: 'text-teal-700',
      },
    }),
    []
  );

  const currentLevelColors = levelColors[currentLevel] || levelColors[1];

  const stripHtml = useCallback((html) => {
    if (!html || typeof html !== 'string') return '';
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  }, []);

  const getOptionValue = useCallback((opt) => {
    if (!opt) return '';
    if (typeof opt === 'string') return opt.trim();
    if (typeof opt === 'object') {
      return (
        (opt.option ||
          opt.text ||
          opt.value ||
          opt.option_text ||
          opt.option_value ||
          JSON.stringify(opt))?.trim() || ''
      );
    }
    return '';
  }, []);

  const getOptionText = useCallback(
    (opt) => {
      if (!opt) return 'Invalid option';
      if (typeof opt === 'string') return stripHtml(opt);
      if (typeof opt === 'object') {
        return stripHtml(
          opt.option ||
            opt.text ||
            opt.value ||
            opt.option_text ||
            'Invalid option'
        );
      }
      return 'Invalid option';
    },
    [stripHtml]
  );

  const calculateScore = useCallback((question, selected) => {
    if (!question || !selected || !question.correct_answer) return 0;
    const correctAnswer = getOptionValue(question.correct_answer);
    return selected.trim() === correctAnswer.trim() ? 1 : 0;
  }, [getOptionValue]);

  const submitTest = useCallback(
    async (isTimeoutSubmission = false) => {
      if (!test || !attemptId || isSubmitted) return;
      setIsSubmitting(true);

      try {
        const easyAttended = Math.min(questionsAskedByLevel.easy, test.easy_level_question);
        const mediumAttended = Math.min(questionsAskedByLevel.medium, test.medium_level_question);
        const hardAttended = Math.min(questionsAskedByLevel.hard, test.hard_level_question);
        const totalAttended = easyAttended + mediumAttended + hardAttended;

        const easyScore = Math.min(correctCounts.easy, easyAttended);
        const mediumScore = Math.min(correctCounts.medium, mediumAttended);
        const hardScore = Math.min(correctCounts.hard, hardAttended);
        const totalScore = easyScore + mediumScore + hardScore;
        const incorrectAnswerCount = totalAttended - totalScore;
        const percentage = ((totalScore / TOTAL_QUESTIONS) * 100).toFixed(2);

        let studentLevel = 'Failed';
        if (easyScore >= test.easy_pass_mark) {
          studentLevel = 'Easy';
          if (test.difficulty_level_id >= 2 && mediumScore >= test.medium_pass_mark) {
            studentLevel = 'Medium';
            if (test.difficulty_level_id === 3 && hardScore >= test.hard_pass_mark) {
              studentLevel = 'Hard';
            }
          }
        }

        const endTime = new Date();
        const parsedStartTime = new Date(startTime);
        if (isNaN(parsedStartTime.getTime())) {
          throw new Error('Invalid test start time');
        }
        const durationMs = endTime - parsedStartTime;
        const durationSeconds = Math.max(0, Math.floor(durationMs / 1000));
        const hours = Math.floor(durationSeconds / 3600);
        const minutes = Math.floor((durationSeconds % 3600) / 60);
        const seconds = durationSeconds % 60;
        const completedDuration = `${hours.toString().padStart(2, '0')}:${minutes
          .toString()
          .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const submissionData = {
          test_id: test.test_id,
          student_id: studentId,
          answers,
          easy_score: easyScore,
          medium_score: mediumScore,
          hard_score: hardScore,
          total_score: totalScore,
          incorrect_answer_count: incorrectAnswerCount,
          skipped_question_count: 0,
          student_level: studentLevel,
          percentage: parseFloat(percentage),
          attempt_id: attemptId,
          easy_attended: easyAttended,
          medium_attended: mediumAttended,
          hard_attended: hardAttended,
        };

        const performanceData = {
          test_id: test.test_id,
          student_id: studentId,
          performance: answers,
          completed_duration: completedDuration,
        };

        await Promise.all([
          axios.post('http://localhost:5000/api/test/submit-test', submissionData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }),
          axios.post('http://localhost:5000/api/test/save-performance', performanceData, {
            withCredentials: true,
            headers: { 'Content-Type': 'application/json' },
          }),
        ]);

        sessionStorage.removeItem(`test_attempt_${studentId}_${testId}_${type}`);
        setIsSubmitted(true);

        await Swal.fire({
          title: isTimeoutSubmission ? "Time's Up" : 'Test Submitted',
          text: 'Your test has been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#1e40af',
          allowOutsideClick: false,
        });

        navigate(`/student/${id}`);
      } catch (err) {
        console.error('[submitTest] Error:', err);
        setError(err.response?.data?.msg || 'Failed to submit test.');
        await Swal.fire({
          title: 'Submission Error',
          text: err.response?.data?.msg || 'Failed to submit test.',
          icon: 'error',
          confirmButtonText: 'Okay',
          confirmButtonColor: '#1e40af',
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      test,
      attemptId,
      isSubmitted,
      correctCounts,
      answers,
      studentId,
      testId,
      type,
      navigate,
      questionsAskedByLevel,
      startTime,
    ]
  );

  const startTestAttempt = useCallback(async () => {
    const storageKey = `test_attempt_${studentId}_${testId}_${type}`;
    const storedAttemptId = sessionStorage.getItem(storageKey);
    if (storedAttemptId) {
      try {
        const response = await axios.get(`http://localhost:5000/api/test/test-time/${storedAttemptId}`, {
          withCredentials: true,
        });
        setAttemptId(storedAttemptId);
        setTimeLeft(response.data.time_left_seconds);
        setStartTime(response.data.start_time);
        if (response.data.time_left_seconds <= 0 && !isSubmitted) {
          setIsTimeout(true);
          await submitTest(true);
          return false;
        }
        return true;
      } catch (err) {
        console.error('[startTestAttempt] Error:', err);
        setError('Failed to fetch test time.');
        return false;
      }
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/test/start-test',
        { student_id: studentId, test_id: testId, test_type: type },
        { withCredentials: true }
      );
      setAttemptId(response.data.attempt_id);
      setTimeLeft(response.data.time_left_seconds);
      setStartTime(response.data.start_time);
      sessionStorage.setItem(storageKey, response.data.attempt_id);
      return true;
    } catch (err) {
      console.error('[startTestAttempt] Error:', err);
      setError('Failed to start test.');
      return false;
    }
  }, [studentId, testId, type, isSubmitted, submitTest]);

  const initializeTest = useCallback(() => {
    if (!test) return;
    const newQuestionQueue = {
      easy: [...(test.primary_questions?.easy || [])].filter((q) => !askedQuestionIds.has(q.id)),
      medium: [...(test.primary_questions?.medium || [])].filter((q) => !askedQuestionIds.has(q.id)),
      hard: [...(test.primary_questions?.hard || [])].filter((q) => !askedQuestionIds.has(q.id)),
    };

    setQuestionQueue(newQuestionQueue);

    if (newQuestionQueue.easy.length > 0) {
      const firstQuestion = newQuestionQueue.easy[0];
      setCurrentQuestion(firstQuestion);
      setAskedQuestionIds(new Set([firstQuestion.id]));
      setTotalAsked(1);
      setQuestionsAskedByLevel((prev) => ({ ...prev, easy: 1 }));
      setQuestionQueue((prev) => ({
        ...prev,
        easy: prev.easy.filter((q) => q.id !== firstQuestion.id),
      }));
    } else {
      setError('No easy questions available.');
    }
  }, [test, askedQuestionIds]);

  const fetchAdditionalQuestions = useCallback(
    async (level, count) => {
      if (!test) return [];
      try {
        const levelId = level === 1 ? 1 : level === 2 ? 2 : 3;
        const response = await axios.get(
          `http://localhost:5000/api/test/questions/${test.skill_id}/${levelId}?count=${count}&exclude=${Array.from(
            askedQuestionIds
          ).join(',')}`,
          { withCredentials: true }
        );
        const newQuestions = response.data.filter((q) => !askedQuestionIds.has(q.id));
        if (newQuestions.length === 0) {
          console.warn(`No additional ${levelId === 1 ? 'easy' : levelId === 2 ? 'medium' : 'hard'} questions available.`);
        }
        return newQuestions;
      } catch (err) {
        console.error('[fetchAdditionalQuestions] Error:', err);
        setError('Failed to fetch additional questions.');
        return [];
      }
    },
    [test, askedQuestionIds]
  );

  const getNextQuestion = useCallback(
    async (level) => {
      const levelKey = level === 1 ? 'easy' : level === 2 ? 'medium' : 'hard';
      const availablePrimary = questionQueue[levelKey].filter((q) => !askedQuestionIds.has(q.id));

      if (availablePrimary.length > 0) {
        return availablePrimary[0];
      }

      const additionalQuestions = await fetchAdditionalQuestions(level, 1);
      if (additionalQuestions.length > 0) {
        setQuestionQueue((prev) => ({
          ...prev,
          [levelKey]: [...prev[levelKey], ...additionalQuestions],
        }));
        return additionalQuestions[0];
      }

      return null;
    },
    [questionQueue, askedQuestionIds, fetchAdditionalQuestions]
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

  const handleNextQuestion = useCallback(
    async () => {
      if (timeLeft <= 0 || isSubmitted || !testStarted) return;

      if (!currentQuestion || !selectedOption) {
        setError('Please select an option before proceeding.');
        return;
      }

      const score = calculateScore(currentQuestion, selectedOption);
      const levelKey = currentLevel === 1 ? 'easy' : currentLevel === 2 ? 'medium' : 'hard';

      // Update correct counts
      const newCorrectCounts = {
        ...correctCounts,
        [levelKey]: correctCounts[levelKey] + score,
      };
      setCorrectCounts(newCorrectCounts);

      // Update answers
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: selectedOption,
      }));

      const newTotalAsked = totalAsked + 1;
      setTotalAsked(newTotalAsked);
      const newQuestionsAskedByLevel = {
        ...questionsAskedByLevel,
        [levelKey]: questionsAskedByLevel[levelKey] + 1,
      };
      setQuestionsAskedByLevel(newQuestionsAskedByLevel);

      // If this was the 20th question, do not fetch a new question or submit
      if (newTotalAsked >= TOTAL_QUESTIONS+1) {
        setError('');
        return;
      }

      // Determine next level based on current performance and question counts
      let nextLevel = currentLevel;

      // Check if we've completed the required questions for current level and passed
      if (
        currentLevel === 1 &&
        newQuestionsAskedByLevel.easy > test.easy_level_question &&
        newCorrectCounts.easy >= test.easy_pass_mark &&
        test.difficulty_level_id >= 2
      ) {
        nextLevel = 2;
      } else if (
        currentLevel === 2 &&
        newQuestionsAskedByLevel.medium >= test.medium_level_question &&
        newCorrectCounts.medium >= test.medium_pass_mark &&
        test.difficulty_level_id >= 3
      ) {
        nextLevel = 3;
      }

      // Get next question from the determined level
      let nextQuestion = await getNextQuestion(nextLevel);

      // If no questions available in next level, try current level
      if (!nextQuestion && nextLevel !== currentLevel) {
        nextQuestion = await getNextQuestion(currentLevel);
        if (nextQuestion) {
          nextLevel = currentLevel; // Revert to current level if we found questions
        }
      }

      if (!nextQuestion) {
        setError('No more questions available.');
        await submitTest();
        return;
      }

      // Update question queue
      const nextLevelKey = nextLevel === 1 ? 'easy' : nextLevel === 2 ? 'medium' : 'hard';
      setQuestionQueue((prev) => ({
        ...prev,
        [nextLevelKey]: prev[nextLevelKey].filter((q) => q.id !== nextQuestion.id),
      }));

      setCurrentLevel(nextLevel);
      setCurrentQuestion(nextQuestion);
      setAskedQuestionIds((prev) => new Set([...prev, nextQuestion.id]));
      setSelectedOption('');
    },
    [
      currentQuestion,
      selectedOption,
      calculateScore,
      currentLevel,
      totalAsked,
      test,
      correctCounts,
      answers,
      questionsAskedByLevel,
      getNextQuestion,
      timeLeft,
      isSubmitted,
      testStarted,
      submitTest,
    ]
  );

  const handleStartTest = useCallback(async () => {
    const success = await startTestAttempt();
    if (success) {
      setTestStarted(true);
      setIsModalOpen(false);
      initializeTest();
    }
  }, [startTestAttempt, initializeTest]);

  useEffect(() => {
    const fetchTestData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/test/all-tests/${studentId}`, {
          withCredentials: true,
        });
        const tests = response.data;
        const selectedTest = tests.find(
          (t) => t.test_id === Number(testId) && t.test_type.toLowerCase() === type.toLowerCase()
        );
        if (!selectedTest) {
          setError('Test not found.');
          return;
        }

        const primary_questions = {
          easy: [],
          medium: [],
          hard: [],
        };

        const uniqueQuestions = [];
        const seenIds = new Set();
        selectedTest.test_questions.forEach((question) => {
          if (!seenIds.has(question.id)) {
            uniqueQuestions.push(question);
            seenIds.add(question.id);
          }
        });

        uniqueQuestions.forEach((question) => {
          if (question.id === 48) {
            question.correct_answer = 'String';
          }
          if (question.difficulty_level_id === 1) {
            primary_questions.easy.push(question);
          } else if (question.difficulty_level_id === 2) {
            primary_questions.medium.push(question);
          } else if (question.difficulty_level_id === 3) {
            primary_questions.hard.push(question);
          }
        });

        const totalQuestions = (selectedTest.easy_level_question || 0) +
                              (selectedTest.medium_level_question || 0) +
                              (selectedTest.hard_level_question || 0);

        if (
          primary_questions.easy.length < (selectedTest.easy_level_question || 0) ||
          primary_questions.medium.length < (selectedTest.medium_level_question || 0) ||
          primary_questions.hard.length < (selectedTest.hard_level_question || 0) ||
          totalQuestions !== TOTAL_QUESTIONS
        ) {
          setError('Insufficient questions available or invalid question count for the test.');
          return;
        }

        setTest({
          ...selectedTest,
          primary_questions,
          total_no_of_questions: TOTAL_QUESTIONS,
          easy_level_question: selectedTest.easy_level_question || 10,
          medium_level_question: selectedTest.medium_level_question || 6,
          hard_level_question: selectedTest.hard_level_question || 4,
          easy_pass_mark: selectedTest.easy_pass_mark || 6,
          medium_pass_mark: selectedTest.medium_pass_mark || 4,
          hard_pass_mark: selectedTest.hard_pass_mark || 2,
          difficulty_level_id: selectedTest.difficulty_level_id || 3,
        });
      } catch (err) {
        console.error('[fetchTestData] Error:', err);
        setError('Failed to load test data.');
      }
    };

    fetchTestData();
  }, [studentId, testId, type]);

  useEffect(() => {
    if (!testStarted || !attemptId || isSubmitted) return;

    const timer = setInterval(() => {
      axios
        .get(`http://localhost:5000/api/test/test-time/${attemptId}`, {
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
          console.error('[Timer] Error:', err);
          setError('Failed to sync timer.');
        });
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptId, isSubmitted, isTimeout, submitTest, testStarted]);

  const minutes = timeLeft != null ? Math.floor(timeLeft / 60) : 0;
  const seconds = timeLeft != null ? timeLeft % 60 : 0;

  if (error && !isModalOpen) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6 select-none">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md w-full text-center border border-gray-200">
          <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Occurred</h3>
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
          <h1 className="text-xl font-semibold text-gray-900 mb-3">Loading Test...</h1>
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
                    {test.test_name || 'Test'} Instructions
                  </Dialog.Title>
                  <div className="text-gray-600 text-base space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <BookOpen className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Welcome! </span> You are about to begin{' '}
                        <span className="font-medium">{test.test_name || 'the test'}</span>, which consists of{' '}
                        <span className="font-medium">{TOTAL_QUESTIONS}</span> questions.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <AlertCircle className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Academic Integrity:</span> Any form of malpractice is prohibited.
                      </p>
                    </div>
                    <div className="flex items-start">
                      <div className="bg-blue-100 p-1 rounded-full mr-2 mt-1">
                        <Clock className="w-4 h-4 text-blue-700" />
                      </div>
                      <p>
                        <span className="font-medium">Time Management:</span> The test is timed. If time expires, it will auto-submit.
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{test.test_name || 'Test'}</h1>
            <p className="text-gray-500 text-sm mt-1">Complete all questions to finish the test</p>
          </div>
          {testStarted && (
            <div className="flex items-center gap-3 order-2 sm:order-none">
              <div
                className={`flex items-center bg-white rounded-lg px-3 py-1.5 shadow-sm border ${
                  timeLeft <= 0 ? 'border-red-200 bg-red-50' : 'border-gray-200'
                }`}
              >
                <Clock
                  className={`w-4 h-4 mr-1.5 ${timeLeft <= 0 ? 'text-red-600' : currentLevelColors.accent}`}
                />
                <span className={`font-mono text-sm font-medium ${timeLeft <= 0 ? 'text-red-800' : 'text-gray-800'}`}>
                  {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </span>
              </div>
              {totalAsked >= TOTAL_QUESTIONS && (
                <button
                  onClick={() => submitTest(false)}
                  disabled={isSubmitting || isSubmitted || timeLeft <= 0 || !selectedOption}
                  className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-colors ${
                    isSubmitting || isSubmitted || timeLeft <= 0 || !selectedOption
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-700 hover:bg-green-800 shadow-sm focus:ring-2 focus:ring-green-600 focus:ring-offset-2'
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
                <p className="text-gray-600 text-sm">Loading question...</p>
              </div>
            </div>
          ) : testStarted && currentQuestion ? (
            <>
              <div className="flex justify-between items-center mb-4">
                <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-xs font-medium text-gray-600">
                  Question {totalAsked} of {TOTAL_QUESTIONS}
                </div>
                <div className="h-2 w-16 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className={`h-full ${currentLevelColors.progress}`}
                    style={{
                      width: `${
                        (questionsAskedByLevel[
                          currentLevel === 1 ? 'easy' : currentLevel === 2 ? 'medium' : 'hard'
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
                {Array.isArray(currentQuestion.option) && currentQuestion.option.length > 0 ? (
                  currentQuestion.option.map((opt, index) => (
                    <label
                      key={index}
                      className={`flex items-start p-3 border rounded-lg cursor-pointer transition-all duration-150 ${
                        selectedOption === getOptionValue(opt)
                          ? `${currentLevelColors.selected} border-blue-300 shadow-sm`
                          : 'bg-white hover:bg-gray-50 border-gray-200'
                      } ${timeLeft <= 0 || isSubmitted ? 'cursor-not-allowed' : ''}`}
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
                      <span className="ml-3 text-gray-700 text-sm sm:text-base">{getOptionText(opt)}</span>
                    </label>
                  ))
                ) : (
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-lg">
                    <p className="text-sm">No options available for this question.</p>
                  </div>
                )}
              </div>
              {totalAsked < TOTAL_QUESTIONS && (
                <div className="flex justify-end mt-5">
                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedOption || timeLeft <= 0 || isSubmitted || isSubmitting}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      selectedOption && timeLeft > 0 && !isSubmitted && !isSubmitting
                        ? `${currentLevelColors.button} text-white shadow-sm hover:shadow-md focus:ring-blue-600`
                        : 'bg-gray-500 text-white cursor-not-allowed'
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="animate-pulse">
                <BookOpen className="w-8 h-8 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500 text-sm">Please start the test to begin.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
