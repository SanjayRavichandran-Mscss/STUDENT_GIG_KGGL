import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function TestCreation() {
  const [formData, setFormData] = useState({
    test_name: "",
    test_description: "",
    skill_id: "",
    difficulty_level_id: "",
    duration_minutes: "",
    total_no_of_questions: 0,
    easy_pass_mark: 0,
    medium_pass_mark: 0,
    hard_pass_mark: 0,
  });
  const [skills, setSkills] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
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
          fetch("http://103.118.158.24/api/api /test/skills", { credentials: 'include' }),
          fetch("http://103.118.158.24/api/api /test/difficulty-levels", { credentials: 'include' }),
          fetch("http://103.118.158.24/api/api /test/available-questions", { credentials: 'include' }),
        ]);
        
        const skillsData = await skillsResponse.json();
        const difficultyData = await difficultyResponse.json();
        const questionsData = await questionsResponse.json();
        
        setSkills(skillsData);
        setDifficultyLevels(difficultyData);
        setAvailableQuestions(questionsData);
      } catch (err) {
        toast.error("Failed to load data. Please check the server connection.");
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

  // Calculate question distribution
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

    let distribution = { easy_level_question: 0, medium_level_question: 0, hard_level_question: 0 };
    let passMarks = { easy_pass_mark: 0, medium_pass_mark: 0, hard_pass_mark: 0 };

    switch (difficultyName) {
      case 'easy':
        distribution.easy_level_question = totalQuestions;
        if (!manualPassCriteria) passMarks.easy_pass_mark = 0;
        break;
      case 'medium':
        distribution.easy_level_question = totalQuestions;
        if (!manualPassCriteria) passMarks.easy_pass_mark = Math.ceil(totalQuestions * 0.33);
        distribution.medium_level_question = totalQuestions - (manualPassCriteria ? formData.easy_pass_mark : passMarks.easy_pass_mark);
        if (!manualPassCriteria) passMarks.medium_pass_mark = 0;
        break;
      case 'hard':
        distribution.easy_level_question = totalQuestions;
        if (!manualPassCriteria) passMarks.easy_pass_mark = Math.ceil(totalQuestions * 0.17);
        const easyPass = manualPassCriteria ? formData.easy_pass_mark : passMarks.easy_pass_mark;
        distribution.medium_level_question = totalQuestions - easyPass;
        if (!manualPassCriteria) passMarks.medium_pass_mark = Math.ceil(distribution.medium_level_question * 0.4);
        const mediumPass = manualPassCriteria ? formData.medium_pass_mark : passMarks.medium_pass_mark;
        distribution.hard_level_question = totalQuestions - mediumPass - easyPass;
        if (!manualPassCriteria) passMarks.hard_pass_mark = Math.ceil(distribution.hard_level_question * 0.75);
        break;
      default:
        break;
    }

    setQuestionDistribution(distribution);
    if (!manualPassCriteria) {
      setFormData(prev => ({ ...prev, ...passMarks }));
    }
  }, [formData.difficulty_level_id, formData.total_no_of_questions, selectedDifficultyLevel, manualPassCriteria, formData.easy_pass_mark, formData.medium_pass_mark]);

  // Validate form
  useEffect(() => {
    const errors = {};
    const duration = Number(formData.duration_minutes);
    if (duration < 0) errors.duration_minutes = "Test duration cannot be negative.";

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

      if (formData.easy_pass_mark > questionDistribution.easy_level_question) {
        errors.easy_pass = `Easy pass mark (${formData.easy_pass_mark}) cannot exceed easy questions (${questionDistribution.easy_level_question})`;
      }
      if (formData.medium_pass_mark > questionDistribution.medium_level_question) {
        errors.medium_pass = `Medium pass mark (${formData.medium_pass_mark}) cannot exceed medium questions (${questionDistribution.medium_level_question})`;
      }
      if (formData.hard_pass_mark > questionDistribution.hard_level_question) {
        errors.hard_pass = `Hard pass mark (${formData.hard_pass_mark}) cannot exceed hard questions (${questionDistribution.hard_level_question})`;
      }

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
  }, [questionDistribution, selectedSkillQuestions, formData, selectedDifficultyLevel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDurationAdjust = (direction) => {
    const currentDuration = Number(formData.duration_minutes) || 0;
    const newDuration = direction === 'up' ? currentDuration + 1 : Math.max(1, currentDuration - 1);
    setFormData(prev => ({ ...prev, duration_minutes: newDuration.toString() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.duration_minutes || Number(formData.duration_minutes) <= 0) {
      toast.error("Please enter a valid duration");
      setIsSubmitting(false);
      return;
    }

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please correct the validation errors");
      setIsSubmitting(false);
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        easy_level_question: Number(formData.easy_pass_mark),
        medium_level_question: Number(formData.medium_pass_mark),
        hard_level_question: Number(formData.hard_pass_mark),
        skill_id: Number(formData.skill_id),
        difficulty_level_id: Number(formData.difficulty_level_id),
        total_no_of_questions: Number(formData.total_no_of_questions),
        duration_minutes: Number(formData.duration_minutes),
      };

      const response = await fetch("http://103.118.158.24/api/api /test/create-test", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit),
      });

      if (!response.ok) throw new Error('Failed to create test');
      
      toast.success("Test created successfully!");
      setFormData({
        test_name: "",
        test_description: "",
        skill_id: "",
        difficulty_level_id: "",
        duration_minutes: "",
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
      toast.error(err.message || "Failed to create test");
      console.error("Submit error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white text-center">Create New Test</h2>
        </div>
        
        <div className="p-6 space-y-4">
          {isLoading && (
            <div className="text-center text-gray-600">Loading data...</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="test_name">
                  Test Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="test_name"
                  name="test_name"
                  value={formData.test_name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., JavaScript Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="test_description">
                  Test Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="test_description"
                  name="test_description"
                  value={formData.test_description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe the test content and objectives"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="skill_id">
                    Skill <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="skill_id"
                    name="skill_id"
                    value={formData.skill_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a skill</option>
                    {skills.map((skill) => (
                      <option key={skill.skill_id} value={skill.skill_id}>
                        {skill.skill_name}
                      </option>
                    ))}
                  </select>
                  {formData.skill_id && (
                    <p className="text-xs text-gray-600 mt-2">
                      Available: {selectedSkillQuestions.easy_count} Easy, {selectedSkillQuestions.medium_count} Medium, {selectedSkillQuestions.hard_count} Hard
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="difficulty_level_id">
                    Difficulty Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="difficulty_level_id"
                    name="difficulty_level_id"
                    value={formData.difficulty_level_id}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select difficulty</option>
                    {difficultyLevels.map((level) => (
                      <option key={level.level_id} value={level.level_id}>
                        {level.level_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="duration_minutes">
                    Duration (Minutes) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      id="duration_minutes"
                      name="duration_minutes"
                      value={formData.duration_minutes}
                      onChange={handleChange}
                      min="1"
                      required
                      className={`w-full px-3 py-2 text-sm border ${validationErrors.duration_minutes ? 'border-red-500' : 'border-gray-300'} rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="e.g., 60"
                    />
                    <div className="absolute right-2 flex flex-col space-y-1">
                      <button
                        type="button"
                        onClick={() => handleDurationAdjust('up')}
                        className="p-0.5 text-gray-500 hover:text-blue-600"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDurationAdjust('down')}
                        className="p-0.5 text-gray-500 hover:text-blue-600"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {validationErrors.duration_minutes && (
                    <p className="text-xs text-red-600 mt-1">{validationErrors.duration_minutes}</p>
                  )}
                </div>

                {formData.difficulty_level_id && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="total_no_of_questions">
                      Total Questions <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="total_no_of_questions"
                      name="total_no_of_questions"
                      value={formData.total_no_of_questions}
                      onChange={handleChange}
                      min="1"
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 30"
                    />
                  </div>
                )}
              </div>
            </div>

            {formData.total_no_of_questions > 0 && formData.difficulty_level_id && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-0">Question Distribution</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-600">Manual Pass Criteria</span>
                    <button
                      type="button"
                      onClick={() => setManualPassCriteria(!manualPassCriteria)}
                      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${manualPassCriteria ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${manualPassCriteria ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Beginner Questions</p>
                    <p className="text-lg font-bold text-blue-600">{questionDistribution.easy_level_question}</p>
                    {questionDistribution.easy_level_question > 0 && selectedDifficultyLevel?.level_name?.toLowerCase() !== 'easy' && (
                      <div className="mt-2">
                        {manualPassCriteria ? (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Pass Mark</label>
                            <input
                              type="number"
                              name="easy_pass_mark"
                              value={formData.easy_pass_mark}
                              onChange={handleChange}
                              min="0"
                              max={questionDistribution.easy_level_question}
                              className={`w-full px-2 py-1 text-xs border ${validationErrors.easy_pass ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-blue-500`}
                            />
                            {validationErrors.easy_pass && (
                              <p className="text-xs text-red-600 mt-1">{validationErrors.easy_pass}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">Pass Mark: {formData.easy_pass_mark}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Intermediate Questions</p>
                    <p className="text-lg font-bold text-green-600">{questionDistribution.medium_level_question}</p>
                    {questionDistribution.medium_level_question > 0 && selectedDifficultyLevel?.level_name?.toLowerCase() === 'hard' && (
                      <div className="mt-2">
                        {manualPassCriteria ? (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Pass Mark</label>
                            <input
                              type="number"
                              name="medium_pass_mark"
                              value={formData.medium_pass_mark}
                              onChange={handleChange}
                              min="0"
                              max={questionDistribution.medium_level_question}
                              className={`w-full px-2 py-1 text-xs border ${validationErrors.medium_pass ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-blue-500`}
                            />
                            {validationErrors.medium_pass && (
                              <p className="text-xs text-red-600 mt-1">{validationErrors.medium_pass}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">Pass Mark: {formData.medium_pass_mark}</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bg-white p-3 rounded-md border border-gray-200">
                    <p className="text-xs text-gray-600 mb-1">Advanced Questions</p>
                    <p className="text-lg font-bold text-red-600">{questionDistribution.hard_level_question}</p>
                    {questionDistribution.hard_level_question > 0 && (
                      <div className="mt-2">
                        {manualPassCriteria ? (
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Pass Mark</label>
                            <input
                              type="number"
                              name="hard_pass_mark"
                              value={formData.hard_pass_mark}
                              onChange={handleChange}
                              min="0"
                              max={questionDistribution.hard_level_question}
                              className={`w-full px-2 py-1 text-xs border ${validationErrors.hard_pass ? 'border-red-500' : 'border-gray-300'} rounded focus:ring-1 focus:ring-blue-500`}
                            />
                            {validationErrors.hard_pass && (
                              <p className="text-xs text-red-600 mt-1">{validationErrors.hard_pass}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-600">Pass Mark: {formData.hard_pass_mark}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

           {selectedDifficultyLevel && (
  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
    <h4 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      Test Flow for {selectedDifficultyLevel.level_name} Level
    </h4>
    
    <div className="space-y-3">
      {selectedDifficultyLevel.level_name.toLowerCase() === 'easy' && (
        <div className="flex items-start">
          <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
            <span className="text-xs font-bold text-blue-600">1</span>
          </div>
          <p className="text-xs text-gray-700">
            All <span className="font-medium">{formData.total_no_of_questions}</span> questions will be from <span className="font-medium text-blue-600">Easy</span> level
          </p>
        </div>
      )}

      {selectedDifficultyLevel.level_name.toLowerCase() === 'medium' && (
        <>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <p className="text-xs text-gray-700">
              Start with <span className="font-medium">{questionDistribution.easy_level_question}</span> <span className="font-medium text-blue-600">Easy</span> questions
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <span className="text-xs font-bold text-green-600">2</span>
            </div>
            <p className="text-xs text-gray-700">
              Candidate must answer at least <span className="font-medium">{formData.easy_pass_mark}</span> correctly to proceed to <span className="font-medium text-green-600">Medium</span> level questions
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-xs text-gray-700">
              If passed, continue with <span className="font-medium">{questionDistribution.medium_level_question}</span> <span className="font-medium text-green-600">Medium</span> questions
            </p>
          </div>
        </>
      )}

      {selectedDifficultyLevel.level_name.toLowerCase() === 'hard' && (
        <>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2 mt-0.5">
              <span className="text-xs font-bold text-blue-600">1</span>
            </div>
            <p className="text-xs text-gray-700">
              Start with <span className="font-medium">{questionDistribution.easy_level_question}</span> <span className="font-medium text-blue-600">Easy</span> questions
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <span className="text-xs font-bold text-green-600">2</span>
            </div>
            <p className="text-xs text-gray-700">
              Must answer at least <span className="font-medium">{formData.easy_pass_mark}</span> correctly to proceed to <span className="font-medium text-green-600">Medium</span> level
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-2 mt-0.5">
              <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-xs text-gray-700">
              Then <span className="font-medium">{questionDistribution.medium_level_question}</span> <span className="font-medium text-green-600">Medium</span> questions
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
              <span className="text-xs font-bold text-red-600">3</span>
            </div>
            <p className="text-xs text-gray-700">
              Must answer at least <span className="font-medium">{formData.medium_pass_mark}</span> correctly to proceed to <span className="font-medium text-red-600">Hard</span> level
            </p>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-2 mt-0.5">
              <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <p className="text-xs text-gray-700">
              Finally <span className="font-medium">{questionDistribution.hard_level_question}</span> <span className="font-medium text-red-600">Hard</span> questions
            </p>
          </div>
        </>
      )}
    </div>
  </div>
)}

                {validationErrors.questions && (
                  <div className="mt-3 p-2 bg-red-50 text-red-600 text-xs rounded">
                    {validationErrors.questions}
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || isLoading || Object.keys(validationErrors).length > 0}
              className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center justify-center ${
                isSubmitting || isLoading || Object.keys(validationErrors).length > 0 ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Test...
                </>
              ) : "Create Test"}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}