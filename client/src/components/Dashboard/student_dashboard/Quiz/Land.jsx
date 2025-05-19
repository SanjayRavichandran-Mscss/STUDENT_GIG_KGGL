import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Quizzes from "./Quizzes";
import "bootstrap/dist/css/bootstrap.min.css";

function Land() {
  const { id } = useParams();
  const decoded = atob(id);
  const [isLoading, setIsLoading] = useState(true);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [hasStartedQuiz, setHasStartedQuiz] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizAttempts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:5000/stu/getdata/${decoded}`);
        setQuizAttempts(response.data.msg[0]?.quiz_attempts || 0);
      } catch (err) {
        console.error("Error fetching quiz attempts:", err);
        setError("Failed to load quiz data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizAttempts();
  }, [decoded]);

  const handleStartQuiz = () => {
    setHasStartedQuiz(true);
  };

  if (isLoading) {
    return (
      <div className={`d-flex justify-content-center align-items-center`}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className= "d-flex justify-content-center align-items-center"
      >
        <div className="alert alert-danger text-center">
          {error}
          <Link to={`/student/${id}`} className="btn btn-secondary mt-3 d-block">
            Return to Profile
          </Link>
        </div>
      </div>
    );
  }

  if (hasStartedQuiz) {
    return <Quizzes />;
  }

  return (
    <div>
      <div className="container text-center py-5">
        <div className="card mx-auto" style={{ maxWidth: "800px" }}>
          <div className="card-body p-4 p-md-5">
            <h1 className="mb-4">Quiz Instructions</h1>
            
            <div className="text-start mb-4">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Time Limit:</strong> 30 minutes to complete the quiz
                </li>
                <li className="list-group-item">
                  <strong>Question Types:</strong> Multiple choice, true/false, and short answer
                </li>
                <li className="list-group-item">
                  <strong>Navigation:</strong> Use 'Next' and 'Previous' buttons to move between questions
                </li>
                <li className="list-group-item">
                  <strong>Submission:</strong> Click 'Submit' after answering all questions
                </li>
                <li className="list-group-item">
                  <strong>Timeout:</strong> Quiz auto-submits when time expires
                </li>
                <li className="list-group-item">
                  <strong>Scoring:</strong> Each correct answer = 1 point
                </li>
                <li className="list-group-item">
                  <strong>Results:</strong> Available immediately after submission
                </li>
                <li className="list-group-item text-danger">
                  <strong>Note:</strong> No external assistance allowed - cheating leads to disqualification
                </li>
              </ul>
            </div>

            <div className="d-flex justify-content-center gap-3">
              <button 
                className="btn btn-primary px-4" 
                onClick={handleStartQuiz}
              >
                Start Quiz
              </button>
              
              {quizAttempts > 0 ? (
                <Link 
                  to={`/student/${id}`} 
                  className="btn btn-outline-secondary px-4"
                >
                  Go to Profile
                </Link>
              ) : (
                <button 
                  className="btn btn-outline-secondary px-4" 
                  disabled
                  title="Complete at least one quiz attempt to access profile"
                >
                  Go to Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Land;