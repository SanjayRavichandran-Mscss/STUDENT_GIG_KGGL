import React, { useEffect, useState } from "react";
import axios from "axios";

function QuizzAssign() {
  const [formData, setFormData] = useState({
    quizName: "",
    quizDes: "",
    selectedCategoryId: "",
    totalQuestions: 0,
    difficultyLevel: 1,
    easyPassMark: 0,
    mediumPassMark: 0
  });
  const [categories, setCategories] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/admin/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchQuestionCount = async () => {
      if (formData.selectedCategoryId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/admin/questions/count?category_id=${formData.selectedCategoryId}`
          );
          setAvailableQuestions(response.data.count);
        } catch (error) {
          console.error("Error fetching question count:", error);
        }
      }
    };
    fetchQuestionCount();
  }, [formData.selectedCategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAssignQuiz = async () => {
    if (formData.totalQuestions > availableQuestions) {
      alert(`Cannot exceed available questions (${availableQuestions})`);
      return;
    }

    try {
      setIsLoading(true);
      const data = {
        quiz_name: formData.quizName,
        quiz_des: formData.quizDes,
        category_id: formData.selectedCategoryId,
        total_no_of_question: formData.totalQuestions,
        difficulty_level_id: formData.difficultyLevel,
        easy_pass_mark: formData.easyPassMark,
        medium_pass_mark: formData.difficultyLevel >= 2 ? formData.mediumPassMark : null,
      };

      const response = await axios.post("http://localhost:5000/admin/assign-test", data);
      
      if (response.data) {
        setIsSuccess(true);
        setFormData({
          quizName: "",
          quizDes: "",
          selectedCategoryId: "",
          totalQuestions: 0,
          difficultyLevel: 1,
          easyPassMark: 0,
          mediumPassMark: 0
        });
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error assigning quiz:", error);
      alert("Failed to assign quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">Assign New Quiz</h1>
        
        {isSuccess && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center animate-fade-in">
            Quiz assigned successfully!
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Quiz Name *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              name="quizName"
              value={formData.quizName}
              onChange={handleChange}
              placeholder="Enter quiz name"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Quiz Description</label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all resize-y min-h-[100px]"
              name="quizDes"
              value={formData.quizDes}
              onChange={handleChange}
              placeholder="Enter quiz description"
              rows="3"
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Category *</label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              name="selectedCategoryId"
              value={formData.selectedCategoryId}
              onChange={handleChange}
              required
              disabled={isLoading}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">
              Total Questions * 
              <span className="text-gray-500 ml-2">(Available: {availableQuestions})</span>
            </label>
            <input
              type="number"
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              name="totalQuestions"
              value={formData.totalQuestions}
              onChange={handleChange}
              min="1"
              max={availableQuestions}
              required
            />
            {formData.totalQuestions > availableQuestions && (
              <span className="text-red-500 text-sm">
                Cannot exceed available questions
              </span>
            )}
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Difficulty Level *</label>
            <select
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              name="difficultyLevel"
              value={formData.difficultyLevel}
              onChange={handleChange}
              required
            >
              <option value={1}>Easy</option>
              <option value={2}>Medium</option>
              <option value={3}>Hard</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="font-medium text-gray-600 text-sm">Easy Pass Mark *</label>
              <input
                type="number"
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                name="easyPassMark"
                value={formData.easyPassMark}
                onChange={handleChange}
                min="0"
                max="100"
                required
              />
            </div>

            {formData.difficultyLevel >= 2 && (
              <div className="space-y-2">
                <label className="font-medium text-gray-600 text-sm">Medium Pass Mark *</label>
                <input
                  type="number"
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  name="mediumPassMark"
                  value={formData.mediumPassMark}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                />
              </div>
            )}
          </div>

          <button 
            onClick={handleAssignQuiz}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center mt-4"
            disabled={isLoading || formData.totalQuestions > availableQuestions}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3h-5z" />
                </svg>
                Assigning...
              </>
            ) : "Assign Quiz"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizzAssign;