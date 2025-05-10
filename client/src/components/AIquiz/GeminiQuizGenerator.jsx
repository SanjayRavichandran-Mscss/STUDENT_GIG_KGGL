import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CheckCircle, XCircle, Check, ChevronDown } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const GeminiQuizGenerator = () => {
  const API_KEY = "AIzaSyC-K6odIEVw20nSSI4mmMiTWsFwRapgLZo";
  const [selectedSkill, setSelectedSkill] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [approvedQuestions, setApprovedQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch skills and difficulty levels from backend
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [skillsRes, levelsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/quiz/skills'),
          axios.get('http://localhost:5000/api/quiz/difficulty-levels')
        ]);
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
        setDifficultyLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);
      } catch (err) {
        console.error('Error fetching initial data:', err);
        setSkills([]);
        setDifficultyLevels([]);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load skills and difficulty levels',
          icon: 'error'
        });
      }
    };
    
    fetchInitialData();
  }, []);

  const validateQuestion = (question) => {
    if (!question.id || !question.question || !question.options || !question.correctAnswer) {
      return false;
    }
    
    if (question.options.length < 2) {
      return false;
    }
    
    if (!question.options.some(opt => opt.option === question.correctAnswer)) {
      return false;
    }
    
    return true;
  };

  const generateQuiz = async () => {
    if (!selectedSkill || !difficulty) {
      setError('Please select both skill and difficulty level');
      return;
    }

    if (questionCount < 1) {
      setError('Please enter a valid number of questions');
      return;
    }

    setIsLoading(true);
    setError('');
    setQuestions([]);

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Generate ${questionCount} multiple-choice questions about ${selectedSkill} at ${difficulty} level.
        Each question must have:
        - A unique id
        - A clear question text (can include HTML)
        - Exactly 4 options with feedback for each
        - One correct answer that matches exactly one option
        
        Return ONLY a valid JSON array with this structure:
        [
          {
            "id": "unique_id1",
            "question": "<p>Question text?</p>",
            "options": [
              {"option": "Option A", "feedback": "Feedback for A"},
              {"option": "Option B", "feedback": "Feedback for B"},
              {"option": "Option C", "feedback": "Feedback for C"},
              {"option": "Option D", "feedback": "Feedback for D"}
            ],
            "correctAnswer": "Option B"
          }
        ]
        
        Important:
        - Ensure correctAnswer exactly matches one option
        - Include feedback for all options
        - Return ONLY the JSON with no additional text
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      let jsonString = text;
      const jsonMatch = text.match(/```json([\s\S]*?)```/);
      if (jsonMatch) {
        jsonString = jsonMatch[1];
      } else if (text.includes('```')) {
        jsonString = text.split('```')[1];
      }

      const quizData = JSON.parse(jsonString.trim());
      const validatedQuestions = Array.isArray(quizData) ? 
        quizData.filter(q => validateQuestion(q)) : 
        [quizData].filter(q => validateQuestion(q));
      
      if (validatedQuestions.length === 0) {
        throw new Error('No valid questions were generated. Please try again.');
      }

      setQuestions(validatedQuestions);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err.message || 'Failed to generate valid quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = (question) => {
    if (approvedQuestions.some(q => q.id === question.id)) {
      Swal.fire({
        title: 'Already Approved',
        text: 'This question has already been approved.',
        icon: 'warning',
        confirmButtonColor: '#2563eb',
      });
      return;
    }
    
    setApprovedQuestions([...approvedQuestions, question]);
    setQuestions(questions.filter(q => q.id !== question.id));
    
    Swal.fire({
      title: 'Question Approved',
      text: 'The question has been moved to approved section.',
      icon: 'success',
      confirmButtonColor: '#2563eb',
    });
  };

  const handleReject = (questionId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This question will be removed from the generated list.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2563eb',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setQuestions(questions.filter(q => q.id !== questionId));
        Swal.fire(
          'Removed!',
          'The question has been removed.',
          'success'
        );
      }
    });
  };

  const handleUnapprove = (question) => {
    setApprovedQuestions(approvedQuestions.filter(q => q.id !== question.id));
    setQuestions([...questions, question]);
    
    Swal.fire({
      title: 'Question Unapproved',
      text: 'The question has been moved back to generated questions.',
      icon: 'info',
      confirmButtonColor: '#2563eb',
    });
  };

  const saveApprovedQuestions = async () => {
    if (approvedQuestions.length === 0) {
      Swal.fire({
        title: 'No Questions',
        text: 'There are no approved questions to save.',
        icon: 'warning'
      });
      return;
    }

    setIsSaving(true);
    
    try {
      const selectedSkillObj = skills.find(s => s.skill_name === selectedSkill);
      const selectedDifficultyObj = difficultyLevels.find(d => d.level_name === difficulty);
      
      if (!selectedSkillObj || !selectedDifficultyObj) {
        throw new Error('Invalid skill or difficulty selection');
      }

      const questionsToSave = approvedQuestions.map(q => ({
        skill_id: selectedSkillObj.skill_id,
        difficulty_level_id: selectedDifficultyObj.level_id,
        questions: q.question,
        option: q.options,
        correct_answer: q.correctAnswer
      }));

      const response = await axios.post('http://localhost:5000/api/quiz/mcq', { mcqs: questionsToSave });
      Swal.fire({
        title: 'Success!',
        text: `${approvedQuestions.length} questions saved successfully.`,
        icon: 'success'
      });
      
      setApprovedQuestions([]);
    } catch (error) {
      console.error('Error saving questions:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to save questions to database',
        icon: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-bold text-center">Ask AI to Generate Quizzes</h1>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Skill
                </label>
                <div className="relative">
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select a skill</option>
                    {Array.isArray(skills) && skills.length > 0 ? (
                      skills.map((skill) => (
                        <option key={skill.skill_id} value={skill.skill_name}>
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
                  Difficulty Level
                </label>
                <div className="relative">
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg appearance-none bg-white pr-8 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select difficulty</option>
                    {Array.isArray(difficultyLevels) && difficultyLevels.length > 0 ? (
                      difficultyLevels.map((level) => (
                        <option key={level.level_id} value={level.level_name}>
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

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="1"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value) || 1)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="mt-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                <p>{error}</p>
              </div>
            )}

            <button
              onClick={generateQuiz}
              disabled={isLoading}
              className={`mt-4 w-full py-2 px-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : 'Generate Quizzes'}
            </button>
          </div>
        </div>

        {questions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="bg-blue-600 p-4 text-white">
              <h2 className="text-lg font-bold">Generated Questions ({questions.length})</h2>
            </div>
            
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question & Options</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {questions.map((q, qIndex) => (
                    <tr key={q.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full">
                          {qIndex + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div 
                          className="text-sm font-medium mb-2 p-2 bg-white rounded-lg border-l-4 border-blue-500"
                          dangerouslySetInnerHTML={renderHTML(q.question)} 
                        />
                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded-lg flex flex-col ${
                                q.correctAnswer === opt.option
                                  ? 'bg-green-50 border-l-4 border-green-500'
                                  : 'bg-gray-100 border-l-4 border-gray-300'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full mr-2 ${
                                  q.correctAnswer === opt.option 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium" dangerouslySetInnerHTML={renderHTML(opt.option)} />
                                  <div className="mt-1 text-xs p-1 bg-indigo-50 text-indigo-700 rounded">
                                    <span className="font-medium">Feedback:</span> {opt.feedback}
                                  </div>
                                </div>
                                {q.correctAnswer === opt.option && (
                                  <div className="ml-2 text-green-500">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(q)}
                            className="p-1.5 bg-green-100 text-green-500 rounded-full hover:bg-green-200 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleReject(q.id)}
                            className="p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {approvedQuestions.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 p-4 text-white">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold">Approved Questions ({approvedQuestions.length})</h2>
                <button
                  onClick={saveApprovedQuestions}
                  disabled={isSaving}
                  className={`px-3 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition ${
                    isSaving ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
            
            <div className="p-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question & Options</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedQuestions.map((q, qIndex) => (
                    <tr key={`approved-${q.id}`} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full">
                          {qIndex + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div 
                          className="text-sm font-medium mb-2 p-2 bg-white rounded-lg border-l-4 border-blue-500"
                          dangerouslySetInnerHTML={renderHTML(q.question)} 
                        />
                        <div className="space-y-2">
                          {q.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded-lg flex flex-col ${
                                q.correctAnswer === opt.option
                                  ? 'bg-green-50 border-l-4 border-green-500'
                                  : 'bg-gray-100 border-l-4 border-gray-300'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className={`w-5 h-5 flex-shrink-0 flex items-center justify-center rounded-full mr-2 ${
                                  q.correctAnswer === opt.option 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {String.fromCharCode(65 + optIndex)}
                                </div>
                                <div className="flex-1">
                                  <div className="text-sm font-medium" dangerouslySetInnerHTML={renderHTML(opt.option)} />
                                  <div className="mt-1 text-xs p-1 bg-indigo-50 text-indigo-700 rounded">
                                    <span className="font-medium">Feedback:</span> {opt.feedback}
                                  </div>
                                </div>
                                {q.correctAnswer === opt.option && (
                                  <div className="ml-2 text-green-500">
                                    <Check className="h-4 w-4" />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => handleUnapprove(q)}
                          className="p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
                          title="Unapprove"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeminiQuizGenerator;