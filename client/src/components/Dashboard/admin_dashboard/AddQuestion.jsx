import React, { useEffect, useState } from "react";
import axios from "axios";

function AddQuestion() {
  const [formData, setFormData] = useState({
    questionText: "",
    correctAnswer: "",
    options: ["", "", "", ""],
    difficultyLevelId: 1,
    categoryId: "",
    subCategoryId: ""
  });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:5000/admin/categories-and-subcategories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };

  const handleAddQuestion = async () => {
    if (formData.options.some(opt => opt === "") || 
        !formData.questionText || 
        !formData.correctAnswer || 
        !formData.categoryId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post("http://localhost:5000/admin/add-question", {
        question_text: formData.questionText,
        correct_answer: formData.correctAnswer,
        options: formData.options,
        difficulty_level_id: formData.difficultyLevelId,
        category_id: parseInt(formData.categoryId),
        sub_category_id: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
      });

      if (response.data.message === "Question added successfully") {
        setIsSuccess(true);
        setFormData({
          questionText: "",
          correctAnswer: "",
          options: ["", "", "", ""],
          difficultyLevelId: 1,
          categoryId: "",
          subCategoryId: ""
        });
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-8 bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">Add New Question</h1>
        
        {isSuccess && (
          <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center animate-fade-in">
            Question added successfully!
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Question Text *</label>
            <textarea
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all resize-y min-h-[100px]"
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              placeholder="Enter your question here..."
              rows="4"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Correct Answer *</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              placeholder="Enter the correct answer"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-medium text-gray-600 text-sm">Options *</label>
            {formData.options.map((option, index) => (
              <div key={index} className="space-y-1">
                <span className="text-xs text-gray-500">Option {index + 1}</span>
                <input
                  type="text"
                  className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>

          <div className="flex gap-6">
            <div className="space-y-2 flex-1">
              <label className="font-medium text-gray-600 text-sm">Difficulty Level *</label>
              <select
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                name="difficultyLevelId"
                value={formData.difficultyLevelId}
                onChange={handleChange}
                required
              >
                <option value={1}>Easy</option>
                <option value={2}>Medium</option>
                <option value={3}>Hard</option>
              </select>
            </div>

            <div className="space-y-2 flex-1">
              <label className="font-medium text-gray-600 text-sm">Category *</label>
              <select
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.categoryId && (
            <div className="space-y-2">
              <label className="font-medium text-gray-600 text-sm">Subcategory</label>
              <select
                className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleChange}
                disabled={isLoading}
              >
                <option value="">Select a subcategory (optional)</option>
                {categories
                  .find(cat => cat.category_id === parseInt(formData.categoryId))
                  ?.subcategories?.map((subCategory) => (
                    <option key={subCategory.sub_category_id} value={subCategory.sub_category_id}>
                      {subCategory.sub_category_name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button 
            onClick={handleAddQuestion}
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3h-5z" />
                </svg>
                Adding...
              </>
            ) : "Add Question"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;