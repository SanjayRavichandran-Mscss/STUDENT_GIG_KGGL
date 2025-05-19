import { useState, useEffect } from "react";

export default function TestCreation() {
  const [formData, setFormData] = useState({
    test_name: "",
    test_description: "",
    skill_id: "",
    difficulty_level_id: "",
    total_no_of_questions: 0,
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
  const [questionDistribution, setQuestionDistribution] = useState({
    easy_level_question: 0,
    medium_level_question: 0,
    hard_level_question: 0,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [manualPassCriteria, setManualPassCriteria] = useState(false);

  // Fetch skills, difficulty levels, and available questions
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [skillsResponse, difficultyResponse, questionsResponse] = await Promise.all([
          fetch("http://103.118.158.24/api/api/quiz/skills", { credentials: 'include' }),
          fetch("http://103.118.158.24/api/api/quiz/difficulty-levels", { credentials: 'include' }),
          fetch("http://103.118.158.24/api/api/quiz/available-questions", { credentials: 'include' }),
        ]);
        
        const skillsData = await skillsResponse.json();
        const difficultyData = await difficultyResponse.json();
        const questionsData = await questionsResponse.json();
        
        setSkills(skillsData);
        setDifficultyLevels(difficultyData);
        setAvailableQuestions(questionsData);
      } catch (err) {
        setError("Failed to load data. Please check the server connection.");
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get selected difficulty level details
  const selectedDifficultyLevel = difficultyLevels.find(
    (level) => level.level_id === Number(formData.difficulty_level_id)
  );

  // Get available question counts for the selected skill
  const selectedSkillQuestions = availableQuestions.find(
    (q) => q.skill_id === Number(formData.skill_id)
  ) || { easy_count: 0, medium_count: 0, hard_count: 0 };

  // Calculate question distribution based on difficulty level and total questions
  useEffect(() => {
    if (!formData.difficulty_level_id || !formData.total_no_of_questions) {
      setQuestionDistribution({
        easy_level_question: 0,
        medium_level_question: 0,
        hard_level_question: 0,
      });
      if (!manualPassCriteria) {
        setFormData(prev => ({
          ...prev,
          easy_pass_mark: 0,
          medium_pass_mark: 0,
          hard_pass_mark: 0,
        }));
      }
      return;
    }

    const totalQuestions = Number(formData.total_no_of_questions);
    const difficultyName = selectedDifficultyLevel?.level_name?.toLowerCase();

    let distribution = {
      easy_level_question: 0,
      medium_level_question: 0,
      hard_level_question: 0,
    };

    let passMarks = {
      easy_pass_mark: 0,
      medium_pass_mark: 0,
      hard_pass_mark: 0,
    };

    switch (difficultyName) {
      case 'easy':
        distribution.easy_level_question = totalQuestions;
        if (!manualPassCriteria) {
          passMarks.easy_pass_mark = 0; // No minimum pass criteria for easy
        }
        break;

      case 'medium':
        distribution.easy_level_question = totalQuestions;
        if (!manualPassCriteria) {
          passMarks.easy_pass_mark = Math.ceil(totalQuestions * 0.33); // 33% pass criteria for easy
        }
        distribution.medium_level_question = totalQuestions - (manualPassCriteria ? formData.easy_pass_mark : passMarks.easy_pass_mark);
        if (!manualPassCriteria) {
          passMarks.medium_pass_mark = 0; // No additional criteria for medium
        }
        break;

      case 'hard':
        distribution.easy_level_question = totalQuestions;
        if (!manualPassCriteria) {
          passMarks.easy_pass_mark = Math.ceil(totalQuestions * 0.17); // ~17% pass criteria for easy
        }
        
        const easyPass = manualPassCriteria ? formData.easy_pass_mark : passMarks.easy_pass_mark;
        const remainingAfterEasy = totalQuestions - easyPass;
        distribution.medium_level_question = remainingAfterEasy;
        
        if (!manualPassCriteria) {
          passMarks.medium_pass_mark = Math.ceil(remainingAfterEasy * 0.4); // 40% of remaining for medium
        }
        
        const mediumPass = manualPassCriteria ? formData.medium_pass_mark : passMarks.medium_pass_mark;
        const remainingAfterMedium = totalQuestions - mediumPass - easyPass;
        distribution.hard_level_question = remainingAfterMedium;
        
        if (!manualPassCriteria) {
          passMarks.hard_pass_mark = Math.ceil(remainingAfterMedium * 0.75); // 75% of remaining for hard
        }
        break;

      default:
        break;
    }

    setQuestionDistribution(distribution);
    
    if (!manualPassCriteria) {
      setFormData(prev => ({
        ...prev,
        ...passMarks,
      }));
    }
  }, [formData.difficulty_level_id, formData.total_no_of_questions, selectedDifficultyLevel, manualPassCriteria, formData.easy_pass_mark, formData.medium_pass_mark]);

  // Validate availability of questions and pass criteria
  useEffect(() => {
    const errors = {};
    
    if (formData.skill_id && questionDistribution.easy_level_question > 0) {
      const easyShortage = questionDistribution.easy_level_question - selectedSkillQuestions.easy_count;
      const mediumShortage = questionDistribution.medium_level_question - selectedSkillQuestions.medium_count;
      const hardShortage = questionDistribution.hard_level_question - selectedSkillQuestions.hard_count;

      if (easyShortage > 0) {
        errors.questions = `Not enough Easy questions available. Need ${questionDistribution.easy_level_question}, but only ${selectedSkillQuestions.easy_count} available.`;
      } else if (mediumShortage > 0) {
        errors.questions = `Not enough Medium questions available. Need ${questionDistribution.medium_level_question}, but only ${selectedSkillQuestions.medium_count} available.`;
      } else if (hardShortage > 0) {
        errors.questions = `Not enough Hard questions available. Need ${questionDistribution.hard_level_question}, but only ${selectedSkillQuestions.hard_count} available.`;
      }

      // Validate pass criteria
      if (formData.easy_pass_mark > questionDistribution.easy_level_question) {
        errors.easy_pass = `Easy pass mark (${formData.easy_pass_mark}) cannot exceed easy questions (${questionDistribution.easy_level_question})`;
      }
      if (formData.medium_pass_mark > questionDistribution.medium_level_question) {
        errors.medium_pass = `Medium pass mark (${formData.medium_pass_mark}) cannot exceed medium questions (${questionDistribution.medium_level_question})`;
      }
      if (formData.hard_pass_mark > questionDistribution.hard_level_question) {
        errors.hard_pass = `Hard pass mark (${formData.hard_pass_mark}) cannot exceed hard questions (${questionDistribution.hard_level_question})`;
      }

      // Check if pass criteria would result in negative remaining questions
      const difficultyName = selectedDifficultyLevel?.level_name?.toLowerCase();
      if (difficultyName === 'medium' || difficultyName === 'hard') {
        const remainingAfterEasy = formData.total_no_of_questions - formData.easy_pass_mark;
        if (remainingAfterEasy < 0) {
          errors.easy_pass = `Easy pass mark too high. Only ${formData.total_no_of_questions} total questions available.`;
        }
      }
      if (difficultyName === 'hard') {
        const remainingAfterMedium = formData.total_no_of_questions - formData.medium_pass_mark - formData.easy_pass_mark;
        if (remainingAfterMedium < 0) {
          errors.medium_pass = `Medium pass mark too high. Only ${formData.total_no_of_questions} total questions available.`;
        }
      }
    }

    setValidationErrors(errors);
  }, [questionDistribution, selectedSkillQuestions, formData.skill_id, formData.easy_pass_mark, formData.medium_pass_mark, formData.hard_pass_mark, selectedDifficultyLevel, formData.total_no_of_questions]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "total_no_of_questions" || name.includes("pass_mark") ? Number(value) || 0 : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (Object.keys(validationErrors).length > 0) {
      setError("Please correct the validation errors.");
      setIsSubmitting(false);
      return;
    }

    if (formData.total_no_of_questions === 0) {
      setError("Total number of questions must be greater than 0.");
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        ...questionDistribution,
        skill_id: Number(formData.skill_id),
        difficulty_level_id: Number(formData.difficulty_level_id),
        total_no_of_questions: Number(formData.total_no_of_questions),
      };

      const response = await fetch("http://103.118.158.24/api/api/quiz/create-test", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.msg || 'Failed to create test');
      }
      
      setSuccess("Test created successfully!");
      setFormData({
        test_name: "",
        test_description: "",
        skill_id: "",
        difficulty_level_id: "",
        total_no_of_questions: 0,
        easy_pass_mark: 0,
        medium_pass_mark: 0,
        hard_pass_mark: 0,
      });
      setQuestionDistribution({
        easy_level_question: 0,
        medium_level_question: 0,
        hard_level_question: 0,
      });
      setValidationErrors({});
      setManualPassCriteria(false);
    } catch (err) {
      setError(err.message || "Failed to create test.");
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

        <div onSubmit={handleSubmit} className="space-y-6">
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
                Available Questions: {selectedSkillQuestions.easy_count} Beginner,{" "}
                {selectedSkillQuestions.medium_count} Intermediate, {selectedSkillQuestions.hard_count} Advanced
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

          {formData.difficulty_level_id && (
            <div>
              <label className="block text-gray-700 font-medium mb-1" htmlFor="total_no_of_questions">
                Total Number of Questions
              </label>
              <input
                type="number"
                id="total_no_of_questions"
                name="total_no_of_questions"
                value={formData.total_no_of_questions}
                onChange={handleChange}
                min="1"
                required
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 30"
              />
            </div>
          )}

          {formData.total_no_of_questions > 0 && formData.difficulty_level_id && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800">Question Distribution</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Manual Pass Criteria:</span>
                  <button
                    type="button"
                    onClick={() => setManualPassCriteria(!manualPassCriteria)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      manualPassCriteria ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        manualPassCriteria ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Beginner Questions</p>
                  <p className="text-2xl font-bold text-blue-600">{questionDistribution.easy_level_question}</p>
                  {(questionDistribution.easy_level_question > 0 && (selectedDifficultyLevel?.level_name?.toLowerCase() !== 'easy')) && (
                    <div className="mt-2">
                      {manualPassCriteria ? (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1" htmlFor="easy_pass_mark">
                            Pass Mark:
                          </label>
                          <input
                            type="number"
                            id="easy_pass_mark"
                            name="easy_pass_mark"
                            value={formData.easy_pass_mark}
                            onChange={handleChange}
                            min="0"
                            max={questionDistribution.easy_level_question}
                            className={`w-20 p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              validationErrors.easy_pass ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.easy_pass && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.easy_pass}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Pass Mark: {formData.easy_pass_mark}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Intermediate Questions</p>
                  <p className="text-2xl font-bold text-green-600">{questionDistribution.medium_level_question}</p>
                  {(questionDistribution.medium_level_question > 0 && selectedDifficultyLevel?.level_name?.toLowerCase() === 'hard') && (
                    <div className="mt-2">
                      {manualPassCriteria ? (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1" htmlFor="medium_pass_mark">
                            Pass Mark:
                          </label>
                          <input
                            type="number"
                            id="medium_pass_mark"
                            name="medium_pass_mark"
                            value={formData.medium_pass_mark}
                            onChange={handleChange}
                            min="0"
                            max={questionDistribution.medium_level_question}
                            className={`w-20 p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              validationErrors.medium_pass ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.medium_pass && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.medium_pass}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Pass Mark: {formData.medium_pass_mark}</p>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Advanced Questions</p>
                  <p className="text-2xl font-bold text-red-600">{questionDistribution.hard_level_question}</p>
                  {questionDistribution.hard_level_question > 0 && (
                    <div className="mt-2">
                      {manualPassCriteria ? (
                        <div>
                          <label className="block text-xs text-gray-500 mb-1" htmlFor="hard_pass_mark">
                            Pass Mark:
                          </label>
                          <input
                            type="number"
                            id="hard_pass_mark"
                            name="hard_pass_mark"
                            value={formData.hard_pass_mark}
                            onChange={handleChange}
                            min="0"
                            max={questionDistribution.hard_level_question}
                            className={`w-20 p-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              validationErrors.hard_pass ? 'border-red-500' : 'border-gray-300'
                            }`}
                          />
                          {validationErrors.hard_pass && (
                            <p className="text-xs text-red-600 mt-1">{validationErrors.hard_pass}</p>
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500">Pass Mark: {formData.hard_pass_mark}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {selectedDifficultyLevel && (
                <div className="mt-4 text-sm text-gray-700">
                  <p className="font-medium">Test Flow for {selectedDifficultyLevel.level_name} Level:</p>
                  {selectedDifficultyLevel.level_name.toLowerCase() === 'easy' && (
                    <p>• All {formData.total_no_of_questions} questions will be Easy level with no minimum pass criteria.</p>
                  )}
                  {selectedDifficultyLevel.level_name.toLowerCase() === 'medium' && (
                    <p>• Start with {questionDistribution.easy_level_question} Easy questions. If candidate passes {formData.easy_pass_mark} questions, remaining {questionDistribution.medium_level_question} will be Medium level.</p>
                  )}
                  {selectedDifficultyLevel.level_name.toLowerCase() === 'hard' && (
                    <div>
                      <p>• Start with {questionDistribution.easy_level_question} Easy questions. Pass {formData.easy_pass_mark} to continue.</p>
                      <p>• Next {questionDistribution.medium_level_question} Medium questions. Pass {formData.medium_pass_mark} to continue.</p>
                      <p>• Finally {questionDistribution.hard_level_question} Hard questions. Pass {formData.hard_pass_mark} to complete.</p>
                    </div>
                  )}
                </div>
              )}

              {validationErrors.questions && (
                <div className="mt-4 text-red-600 text-sm">
                  <p>{validationErrors.questions}</p>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting || isLoading || Object.keys(validationErrors).length > 0}
            className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 ${
              isSubmitting || isLoading || Object.keys(validationErrors).length > 0
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting ? "Creating..." : "Create Test"}
          </button>
        </div>
      </div>
    </div>
  );
}