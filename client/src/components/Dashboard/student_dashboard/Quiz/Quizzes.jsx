import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function Quizzes() {
  const { id, name } = useParams();
  const decoded = atob(id);
  const decodedName = atob(name);

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quizScore, setQuizScore] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  useEffect(() => {
    fetchQuestions(1); // Fetch easy level questions initially
  }, []);

  const fetchQuestions = (level) => {
    axios
      .get(`http://localhost:5000/stu/questions?level=${level}`)
      .then((res) => {
        const questionsWithParsedOptions = res.data.map((question) => ({
          ...question,
          options: JSON.parse(question.options),
        }));
        setQuestions(questionsWithParsedOptions);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  };

  const handleOptionChange = (questionId, option) => {
    setSelectedOptions({
      ...selectedOptions,
      [questionId]: option,
    });

    axios
      .post("http://localhost:5000/stu/option-click", {
        questionId,
        selectedOption: option,
        correctAnswersCount,
      })
      .then((response) => {
        const { isCorrect, difficultyLevel } = response.data;
        
        if (difficultyLevel === 1 && isCorrect) {
          setEasyCount(prev => prev + 1);
        }
        if (difficultyLevel === 2 && easyCount >= 4 && isCorrect) {
          setMediumCount(prev => prev + 1);
        }
        if (difficultyLevel === 3 && mediumCount >= 3 && isCorrect) {
          setHardCount(prev => prev + 1);
        }
      })
      .catch((error) => {
        console.error("Error handling option click:", error);
      });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (easyCount >= 4) fetchQuestions(2);
      if (mediumCount >= 3) fetchQuestions(3);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    const data = {
      student_id: decoded,
      student_name: decodedName,
      quiz_attempts: 1,
      totalScore: easyCount + mediumCount + hardCount,
      questions: questions.map((question) => ({
        question_id: question.question_id,
        chosen_option: selectedOptions[question.question_id] || null,
        difficulty_level_id: question.difficulty_level_id,
        is_correct: selectedOptions[question.question_id] === question.correct_answer,
        correct_answer: question.correct_answer,
      })),
    };

    axios
      .post("http://localhost:5000/stu/compare-and-submit", data)
      .then((response) => {
        setQuizScore(response.data.totalScore);
        setIsSubmitted(true);
      })
      .catch((error) => {
        console.error("Error submitting data:", error);
      });
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Quiz Completed</h1>
          <p className="text-xl text-gray-600 mb-6">
            Your score: {quizScore} / {questions.length}
          </p>
          <Link
            to={`/student/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-center text-2xl font-bold text-gray-800">ENTRY TEST</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6">
          {currentQuestion && (
            <>
              <div className="flex justify-between items-center mb-6">
                <p className="text-lg font-medium text-gray-700">
                  Question <span className="text-blue-600">{currentQuestionIndex + 1}</span>
                  /{questions.length}
                </p>
              </div>

              <p className="text-xl font-medium text-gray-800 mb-6">
                {currentQuestionIndex + 1}. {currentQuestion.question_text}
              </p>

              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="radio"
                      name={`question${currentQuestion.question_id}`}
                      id={`option${index}`}
                      value={option}
                      checked={selectedOptions[currentQuestion.question_id] === option}
                      onChange={() => handleOptionChange(currentQuestion.question_id, option)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label htmlFor={`option${index}`} className="ml-3 block text-gray-700">
                      {option}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                {currentQuestionIndex > 0 && (
                  <button
                    onClick={handlePrevious}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md transition duration-200"
                  >
                    Previous
                  </button>
                )}
                {!isLastQuestion ? (
                  <button
                    onClick={handleNext}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition duration-200"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition duration-200"
                  >
                    Submit
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Quizzes;