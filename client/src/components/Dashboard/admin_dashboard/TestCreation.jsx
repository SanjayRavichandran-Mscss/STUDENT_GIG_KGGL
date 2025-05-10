import { useState, useEffect } from "react";
import axios from "axios";

export default function TestCreation() {
  const [formData, setFormData] = useState({
    test_name: "",
    test_description: "",
    skill_id: "",
    difficulty_level_id: "",
    easy_level_question: 0,
    medium_level_question: 0,
    hard_level_question: 0,
    easy_pass_mark: 0,
    medium_pass_mark: 0,
    hard_pass_mark: 0,
  });
  const [skills, setSkills] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionErrors, setQuestionErrors] = useState({});

  // Fetch skills, difficulty levels, and available questions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [skillsResponse, difficultyResponse, questionsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/quiz/skills", { withCredentials: true }),
          axios.get("http://localhost:5000/api/quiz/difficulty-levels", { withCredentials: true }),
          axios.get("http://localhost:5000/api/quiz/available-questions", { withCredentials: true }),
        ]);
        setSkills(skillsResponse.data);
        setDifficultyLevels(difficultyResponse.data);
        setAvailableQuestions(questionsResponse.data);
      } catch (err) {
        setError("Failed to load data. Please check the server connection.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate total number of questions
  const totalQuestions =
    Number(formData.easy_level_question) +
    Number(formData.medium_level_question) +
    Number(formData.hard_level_question);

  // Get available question counts for the selected skill
  const selectedSkillQuestions = availableQuestions.find(
    (q) => q.skill_id === Number(formData.skill_id)
  ) || { easy_count: 0, medium_count: 0, hard_count: 0 };

  // Validate question counts and pass marks
  useEffect(() => {
    const errors = {};
    if (formData.skill_id) {
      if (Number(formData.easy_level_question) > selectedSkillQuestions.easy_count) {
        errors.easy = `Only ${selectedSkillQuestions.easy_count} Easy questions available`;
      }
      if (Number(formData.medium_level_question) > selectedSkillQuestions.medium_count) {
        errors.medium = `Only ${selectedSkillQuestions.medium_count} Medium questions available`;
      }
      if (Number(formData.hard_level_question) > selectedSkillQuestions.hard_count) {
        errors.hard = `Only ${selectedSkillQuestions.hard_count} Hard questions available`;
      }
      if (Number(formData.easy_pass_mark) > Number(formData.easy_level_question)) {
        errors.easy_pass = `Easy pass mark cannot exceed ${formData.easy_level_question}`;
      }
      if (Number(formData.medium_pass_mark) > Number(formData.medium_level_question)) {
        errors.medium_pass = `Medium pass mark cannot exceed ${formData.medium_level_question}`;
      }
      if (Number(formData.hard_pass_mark) > Number(formData.hard_level_question)) {
        errors.hard_pass = `Hard pass mark cannot exceed ${formData.hard_level_question}`;
      }
    }
    setQuestionErrors(errors);
  }, [
    formData.skill_id,
    formData.easy_level_question,
    formData.medium_level_question,
    formData.hard_level_question,
    formData.easy_pass_mark,
    formData.medium_pass_mark,
    formData.hard_pass_mark,
    selectedSkillQuestions.easy_count,
    selectedSkillQuestions.medium_count,
    selectedSkillQuestions.hard_count,
  ]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes("question") || name.includes("pass_mark") ? Number(value) || 0 : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (Object.keys(questionErrors).length > 0) {
      setError("Please correct the question count or pass mark errors.");
      setIsSubmitting(false);
      return;
    }

    if (totalQuestions === 0) {
      setError("At least one question must be included in the test.");
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        total_no_of_questions: totalQuestions,
        skill_id: Number(formData.skill_id),
        difficulty_level_id: Number(formData.difficulty_level_id),
        easy_level_question: Number(formData.easy_level_question),
        medium_level_question: Number(formData.medium_level_question),
        hard_level_question: Number(formData.hard_level_question),
        easy_pass_mark: Number(formData.easy_pass_mark),
        medium_pass_mark: Number(formData.medium_pass_mark),
        hard_pass_mark: Number(formData.hard_pass_mark),
      };

      await axios.post("http://localhost:5000/api/quiz/create-test", dataToSubmit, {
        withCredentials: true,
      });
      setSuccess("Test created successfully!");
      setFormData({
        test_name: "",
        test_description: "",
        skill_id: "",
        difficulty_level_id: "",
        easy_level_question: 0,
        medium_level_question: 0,
        hard_level_question: 0,
        easy_pass_mark: 0,
        medium_pass_mark: 0,
        hard_pass_mark: 0,
      });
      setQuestionErrors({});
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to create test.");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create New Test</h2>

        {isLoading && (
          <div className="text-center text-gray-600 mb-4">Loading data...</div>
        )}
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="test_name">
              Test Name
            </label>
            <input
              type="text"
              id="test_name"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Frontend Basics"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="test_description">
              Test Description
            </label>
            <textarea
              id="test_description"
              name="test_description"
              value={formData.test_description}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Test your HTML and CSS skills"
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="skill_id">
              Skill
            </label>
            <select
              id="skill_id"
              name="skill_id"
              value={formData.skill_id}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a skill</option>
              {skills.map((skill) => (
                <option key={skill.skill_id} value={skill.skill_id}>
                  {skill.skill_name}
                </option>
              ))}
            </select>
            {formData.skill_id && (
              <p className="text-sm text-gray-600 mt-2">
                Available Questions: {selectedSkillQuestions.easy_count} Easy,{" "}
                {selectedSkillQuestions.medium_count} Medium, {selectedSkillQuestions.hard_count} Hard
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1" htmlFor="difficulty_level_id">
              Difficulty Level
            </label>
            <select
              id="difficulty_level_id"
              name="difficulty_level_id"
              value={formData.difficulty_level_id}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a difficulty level</option>
              {difficultyLevels.map((level) => (
                <option key={level.level_id} value={level.level_id}>
                  {level.level_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="easy_level_question">
                Easy Questions
              </label>
              <input
                type="number"
                id="easy_level_question"
                name="easy_level_question"
                value={formData.easy_level_question}
                onChange={handleChange}
                min="0"
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  questionErrors.easy ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {questionErrors.easy && (
                <p className="text-red-600 text-sm mt-1">{questionErrors.easy}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="medium_level_question">
                Medium Questions
              </label>
              <input
                type="number"
                id="medium_level_question"
                name="medium_level_question"
                value={formData.medium_level_question}
                onChange={handleChange}
                min="0"
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  questionErrors.medium ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {questionErrors.medium && (
                <p className="text-red-600 text-sm mt-1">{questionErrors.medium}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="hard_level_question">
                Hard Questions
              </label>
              <input
                type="number"
                id="hard_level_question"
                name="hard_level_question"
                value={formData.hard_level_question}
                onChange={handleChange}
                min="0"
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  questionErrors.hard ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {questionErrors.hard && (
                <p className="text-red-600 text-sm mt-1">{questionErrors.hard}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="total_questions">
                Total Questions
              </label>
              <input
                type="number"
                id="total_questions"
                value={totalQuestions}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-100 text-gray-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="easy_pass_mark">
                Easy Pass Mark
              </label>
              <input
                type="number"
                id="easy_pass_mark"
                name="easy_pass_mark"
                value={formData.easy_pass_mark}
                onChange={handleChange}
                min="0"
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  questionErrors.easy_pass ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {questionErrors.easy_pass && (
                <p className="text-red-600 text-sm mt-1">{questionErrors.easy_pass}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="medium_pass_mark">
                Medium Pass Mark
              </label>
              <input
                type="number"
                id="medium_pass_mark"
                name="medium_pass_mark"
                    value={formData.medium_pass_mark}
                onChange={handleChange}
                min="0"
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  questionErrors.medium_pass ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {questionErrors.medium_pass && (
                <p className="text-red-600 text-sm mt-1">{questionErrors.medium_pass}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="hard_pass_mark">
                Hard Pass Mark
              </label>
              <input
                type="number"
                id="hard_pass_mark"
                name="hard_pass_mark"
                value={formData.hard_pass_mark}
                onChange={handleChange}
                min="0"
                required
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  questionErrors.hard_pass ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"
                }`}
              />
              {questionErrors.hard_pass && (
                <p className="text-red-600 text-sm mt-1">{questionErrors.hard_pass}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isLoading || Object.keys(questionErrors).length > 0}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
              isSubmitting || isLoading || Object.keys(questionErrors).length > 0
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Test"}
          </button>
        </form>
      </div>
    </div>
  );
}