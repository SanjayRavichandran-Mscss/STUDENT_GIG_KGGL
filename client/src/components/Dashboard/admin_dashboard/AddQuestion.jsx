// import React, { useEffect, useState } from "react";
// import axios from "axios";

// function AddQuestion() {
//   const [formData, setFormData] = useState({
//     questionText: "",
//     correctAnswer: "",
//     options: ["", "", "", ""],
//     difficultyLevelId: 1,
//     categoryId: "",
//     subCategoryId: ""
//   });
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         setIsLoading(true);
//         const response = await axios.get("http://localhost:5000/admin/categories-and-subcategories");
//         setCategories(response.data);
//       } catch (error) {
//         console.error("Error fetching categories:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleOptionChange = (index, value) => {
//     const newOptions = [...formData.options];
//     newOptions[index] = value;
//     setFormData(prev => ({ ...prev, options: newOptions }));
//   };

//   const handleAddQuestion = async () => {
//     if (formData.options.some(opt => opt === "") || 
//         !formData.questionText || 
//         !formData.correctAnswer || 
//         !formData.categoryId) {
//       alert("Please fill all required fields");
//       return;
//     }

//     try {
//       setIsLoading(true);
//       const response = await axios.post("http://localhost:5000/admin/add-question", {
//         question_text: formData.questionText,
//         correct_answer: formData.correctAnswer,
//         options: formData.options,
//         difficulty_level_id: formData.difficultyLevelId,
//         category_id: parseInt(formData.categoryId),
//         sub_category_id: formData.subCategoryId ? parseInt(formData.subCategoryId) : null,
//       });

//       if (response.data.message === "Question added successfully") {
//         setIsSuccess(true);
//         setFormData({
//           questionText: "",
//           correctAnswer: "",
//           options: ["", "", "", ""],
//           difficultyLevelId: 1,
//           categoryId: "",
//           subCategoryId: ""
//         });
//         setTimeout(() => setIsSuccess(false), 3000);
//       }
//     } catch (error) {
//       console.error("Error adding question:", error);
//       alert("Failed to add question. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen p-8 bg-gray-100">
//       <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-2xl">
//         <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">Add New Question</h1>
        
//         {isSuccess && (
//           <div className="bg-green-500 text-white p-3 rounded-lg mb-6 text-center animate-fade-in">
//             Question added successfully!
//           </div>
//         )}

//         <div className="space-y-6">
//           <div className="space-y-2">
//             <label className="font-medium text-gray-600 text-sm">Question Text *</label>
//             <textarea
//               className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all resize-y min-h-[100px]"
//               name="questionText"
//               value={formData.questionText}
//               onChange={handleChange}
//               placeholder="Enter your question here..."
//               rows="4"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="font-medium text-gray-600 text-sm">Correct Answer *</label>
//             <input
//               type="text"
//               className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
//               name="correctAnswer"
//               value={formData.correctAnswer}
//               onChange={handleChange}
//               placeholder="Enter the correct answer"
//               required
//             />
//           </div>

//           <div className="space-y-2">
//             <label className="font-medium text-gray-600 text-sm">Options *</label>
//             {formData.options.map((option, index) => (
//               <div key={index} className="space-y-1">
//                 <span className="text-xs text-gray-500">Option {index + 1}</span>
//                 <input
//                   type="text"
//                   className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
//                   value={option}
//                   onChange={(e) => handleOptionChange(index, e.target.value)}
//                   placeholder={`Option ${index + 1}`}
//                   required
//                 />
//               </div>
//             ))}
//           </div>

//           <div className="flex gap-6">
//             <div className="space-y-2 flex-1">
//               <label className="font-medium text-gray-600 text-sm">Difficulty Level *</label>
//               <select
//                 className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
//                 name="difficultyLevelId"
//                 value={formData.difficultyLevelId}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value={1}>Easy</option>
//                 <option value={2}>Medium</option>
//                 <option value={3}>Hard</option>
//               </select>
//             </div>

//             <div className="space-y-2 flex-1">
//               <label className="font-medium text-gray-600 text-sm">Category *</label>
//               <select
//                 className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
//                 name="categoryId"
//                 value={formData.categoryId}
//                 onChange={handleChange}
//                 required
//                 disabled={isLoading}
//               >
//                 <option value="">Select a category</option>
//                 {categories.map((category) => (
//                   <option key={category.category_id} value={category.category_id}>
//                     {category.category_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           {formData.categoryId && (
//             <div className="space-y-2">
//               <label className="font-medium text-gray-600 text-sm">Subcategory</label>
//               <select
//                 className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all"
//                 name="subCategoryId"
//                 value={formData.subCategoryId}
//                 onChange={handleChange}
//                 disabled={isLoading}
//               >
//                 <option value="">Select a subcategory (optional)</option>
//                 {categories
//                   .find(cat => cat.category_id === parseInt(formData.categoryId))
//                   ?.subcategories?.map((subCategory) => (
//                     <option key={subCategory.sub_category_id} value={subCategory.sub_category_id}>
//                       {subCategory.sub_category_name}
//                     </option>
//                   ))}
//               </select>
//             </div>
//           )}

//           <button 
//             onClick={handleAddQuestion}
//             className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center mt-4"
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3h-5z" />
//                 </svg>
//                 Adding...
//               </>
//             ) : "Add Question"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddQuestion;































import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { ChevronDown } from "lucide-react";

function AddQuestion() {
  const [formData, setFormData] = useState({
    skillId: "",
    difficultyLevelId: "",
    questionText: "",
    correctAnswer: "",
    options: [
      { option: "", feedback: "" },
      { option: "", feedback: "" },
      { option: "", feedback: "" },
      { option: "", feedback: "" },
    ],
  });
  const [skills, setSkills] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch skills and difficulty levels
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [skillsRes, levelsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/quiz/skills"),
          axios.get("http://localhost:5000/api/quiz/difficulty-levels"),
        ]);
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
        setDifficultyLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setSkills([]);
        setDifficultyLevels([]);
        Swal.fire({
          title: "Error",
          text: "Failed to load skills and difficulty levels",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on change
  };

  // Handle changes for options and feedback
  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData((prev) => ({ ...prev, options: newOptions }));
    setError("");
  };

  // Validate form data
  const validateForm = () => {
    if (!formData.skillId || !formData.difficultyLevelId) {
      setError("Please select both skill and difficulty level");
      return false;
    }
    if (!formData.questionText) {
      setError("Please enter the question text");
      return false;
    }
    if (!formData.correctAnswer) {
      setError("Please enter the correct answer");
      return false;
    }
    if (formData.options.some((opt) => !opt.option || !opt.feedback)) {
      setError("Please fill all options and their feedback");
      return false;
    }
    if (!formData.options.some((opt) => opt.option === formData.correctAnswer)) {
      setError("Correct answer must match one of the options");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleAddQuestion = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const questionToSave = {
        skill_id: parseInt(formData.skillId),
        difficulty_level_id: parseInt(formData.difficultyLevelId),
        questions: `<p>${formData.questionText}</p>`, // Wrap in <p> for HTML compatibility
        option: formData.options, // Array of { option, feedback }
        correct_answer: formData.correctAnswer,
      };

      const response = await axios.post("http://localhost:5000/api/quiz/mcq", {
        mcqs: [questionToSave],
      });

      Swal.fire({
        title: "Success!",
        text: "Question saved successfully.",
        icon: "success",
        confirmButtonColor: "#2563eb",
      });

      setIsSuccess(true);
      setFormData({
        skillId: "",
        difficultyLevelId: "",
        questionText: "",
        correctAnswer: "",
        options: [
          { option: "", feedback: "" },
          { option: "", feedback: "" },
          { option: "", feedback: "" },
          { option: "", feedback: "" },
        ],
      });
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving question:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save question to database",
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-bold text-center">Add New Question</h1>
          </div>

          <div className="p-4">
            {isSuccess && (
              <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                Question added successfully!
              </div>
            )}

            {error && (
              <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Skill *
                </label>
                <div className="relative">
                  <select
                    name="skillId"
                    value={formData.skillId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                    required
                  >
                    <option value="">Select a skill</option>
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <option key={skill.skill_id} value={skill.skill_id}>
                          {skill.skill_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No skills available</option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Difficulty Level *
                </label>
                <div className="relative">
                  <select
                    name="difficultyLevelId"
                    value={formData.difficultyLevelId}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                    required
                  >
                    <option value="">Select difficulty</option>
                    {difficultyLevels.length > 0 ? (
                      difficultyLevels.map((level) => (
                        <option key={level.level_id} value={level.level_id}>
                          {level.level_name}
                        </option>
                      ))
                    ) : (
                      <option disabled>No difficulty levels available</option>
                    )}
                  </select>
                  <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Question Text *
                </label>
                <textarea
                  name="questionText"
                  value={formData.questionText}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-y min-h-[100px]"
                  placeholder="Enter your question here..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Correct Answer *
                </label>
                <input
                  type="text"
                  name="correctAnswer"
                  value={formData.correctAnswer}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Enter the correct answer"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Options *
                </label>
                {formData.options.map((opt, index) => (
                  <div key={index} className="mb-3 space-y-2">
                    <div>
                      <span className="text-xs text-gray-500">Option {index + 1}</span>
                      <input
                        type="text"
                        value={opt.option}
                        onChange={(e) => handleOptionChange(index, "option", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={`Option ${index + 1}`}
                        required
                      />
                    </div>
                    <div>
                      <span className="text-xs text-gray-500">Feedback for Option {index + 1}</span>
                      <input
                        type="text"
                        value={opt.feedback}
                        onChange={(e) => handleOptionChange(index, "feedback", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder={`Feedback for Option ${index + 1}`}
                        required
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleAddQuestion}
              disabled={isLoading}
              className={`w-full py-2 px-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Adding...
                </>
              ) : (
                "Add Question"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddQuestion;
