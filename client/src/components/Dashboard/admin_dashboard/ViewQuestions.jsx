import React, { useState, useEffect } from 'react';
import { Check, Edit, Trash2, X, Save,Filter, Search } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';
import CountUp from 'react-countup';

const ViewQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [skills, setSkills] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch all MCQs, skills, and difficulty levels on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch questions
        const questionsResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/test/mcq');
        setQuestions(Array.isArray(questionsResponse.data) ? questionsResponse.data : []);

        // Fetch skills
        const skillsResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/test/skills');
        setSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : []);

        // Fetch difficulty levels
        const difficultyResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/test/difficulty-levels');
        setDifficultyLevels(Array.isArray(difficultyResponse.data) ? difficultyResponse.data : []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        Swal.fire({
          title: 'Error',
          text: 'Failed to load questions or filters',
          icon: 'error',
          confirmButtonColor: '#2563eb',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle Delete
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This question will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#2563eb',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`https://gig.kggeniuslabs.com/api/api/test/mcq/${id}`);
          setQuestions(questions.filter((q) => q.id !== id));
          Swal.fire({
            title: 'Deleted!',
            text: 'The question has been deleted.',
            icon: 'success',
            confirmButtonColor: '#2563eb',
          });
        } catch (err) {
          console.error('Error deleting question:', err);
          Swal.fire({
            title: 'Error',
            text: 'Failed to delete question',
            icon: 'error',
            confirmButtonColor: '#2563eb',
          });
        }
      }
    });
  };

  // Strip <p> tags for editing
  const stripPTags = (html) => {
    return html.replace(/<\/?p[^>]*>/g, '').trim();
  };

  // Add <p> tags when saving
  const wrapInPTags = (text) => {
    if (!text.startsWith('<p>')) {
      return `<p>${text}</p>`;
    }
    return text;
  };

  // Start editing
  const startEditing = (question) => {
    setEditingId(question.id);
    setEditData({ 
      ...question,
      questions: stripPTags(question.questions) // Remove <p> tags when editing
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingId(null);
    setEditData(null);
  };

  // Handle input changes
  const handleInputChange = (e, field, optionIndex = null) => {
    if (optionIndex !== null) {
      const newOptions = [...editData.option];
      newOptions[optionIndex][field] = e.target.value;
      setEditData({ ...editData, option: newOptions });
    } else {
      setEditData({ ...editData, [field]: e.target.value });
    }
  };

  // Save changes
  const saveChanges = async () => {
    if (!editData.questions || !editData.correct_answer || editData.option.length < 2) {
      Swal.fire({
        title: 'Invalid Input',
        text: 'Please provide a valid question, at least 2 options, and a correct answer.',
        icon: 'warning',
        confirmButtonColor: '#2563eb',
      });
      return;
    }

    try {
      const dataToSave = {
        ...editData,
        questions: wrapInPTags(editData.questions) // Add <p> tags back when saving
      };

      await axios.put(`https://gig.kggeniuslabs.com/api/api/test/mcq/${editData.id}`, {
        skill_id: dataToSave.skill_id,
        difficulty_level_id: dataToSave.difficulty_level_id,
        questions: dataToSave.questions,
        option: dataToSave.option,
        correct_answer: dataToSave.correct_answer,
        question_status: dataToSave.question_status,
      });
      
      setQuestions(questions.map(q => q.id === editData.id ? dataToSave : q));
      setEditingId(null);
      setEditData(null);
      
      Swal.fire({
        title: 'Success!',
        text: 'Question updated successfully.',
        icon: 'success',
        confirmButtonColor: '#2563eb',
      });
    } catch (err) {
      console.error('Error updating question:', err);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update question',
        icon: 'error',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  // Render HTML safely
  const renderHTML = (htmlString) => {
    return { __html: htmlString };
  };

  // Strip HTML tags for search
  const stripHTML = (html) => {
    return html.replace(/<\/?[^>]+(>|$)/g, '').trim();
  };

  // Filter questions
  const filteredQuestions = questions.filter((q) => {
    const matchesStatus = filterStatus === 'all' || q.question_status.toString() === filterStatus;
    const matchesSkill = filterSkill === 'all' || q.skill_id.toString() === filterSkill;
    const matchesDifficulty = filterDifficulty === 'all' || q.difficulty_level_id.toString() === filterDifficulty;
    const matchesSearch = searchText
      ? stripHTML(q.questions).toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesStatus && matchesSkill && matchesDifficulty && matchesSearch;
  });

  // Calculate status counts
  const singleQuestionCount = questions.filter(q => q.question_status === 1).length;
  const aiQuestionCount = questions.filter(q => q.question_status === 2).length;
  const multipleQuestionCount = questions.filter(q => q.question_status === 3).length;

  // Get skill name by ID
  const getSkillName = (skillId) => {
    const skill = skills.find(s => s.skill_id === skillId);
    return skill ? skill.skill_name : 'Unknown Skill';
  };

  // Get difficulty level by ID
  const getDifficultyName = (difficultyId) => {
    const level = difficultyLevels.find(d => d.level_id === difficultyId);
    return level ? level.level_name : 'Unknown Level';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Question Bank</h1>
                <p className="text-blue-100 text-sm sm:text-base mt-1">
                  Manage and filter all your questions in one place
                </p>
              </div>
              
              {/* Search Bar */}
              <div className="w-full sm:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search questions..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500 bg-opacity-20 border border-blue-300 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="p-4 sm:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">Total Questions</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">
                  <CountUp end={questions.length} duration={1} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">Single Upload</div>
                <div className="mt-1 text-2xl font-bold text-green-600">
                  <CountUp end={singleQuestionCount} duration={1} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">AI Generated</div>
                <div className="mt-1 text-2xl font-bold text-purple-600">
                  <CountUp end={aiQuestionCount} duration={1} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">Bulk Upload</div>
                <div className="mt-1 text-2xl font-bold text-indigo-600">
                  <CountUp end={multipleQuestionCount} duration={1} />
                </div>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Questions</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                    <div className="relative">
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      >
                        <option value="all">All Types</option>
                        <option value="1">Single Upload</option>
                        <option value="2">AI Generated</option>
                        <option value="3">Bulk Upload</option>
                      </select>
                    </div>
                  </div>

                  {/* Skill Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                    <div className="relative">
                      <select
                        value={filterSkill}
                        onChange={(e) => setFilterSkill(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      >
                        <option value="all">All Skills</option>
                        {skills.map((skill) => (
                          <option key={skill.skill_id} value={skill.skill_id}>
                            {skill.skill_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <div className="relative">
                      <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                      >
                        <option value="all">All Levels</option>
                        {difficultyLevels.map((level) => (
                          <option key={level.level_id} value={level.level_id}>
                            {level.level_name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                  <p>{error}</p>
                </div>
              ) : filteredQuestions.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No questions found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchText || filterStatus !== 'all' || filterSkill !== 'all' || filterDifficulty !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'No questions available in the database'}
                  </p>
                </div>
              ) : (
                filteredQuestions.map((q, qIndex) => (
                  <div 
                    key={q.id} 
                    className={`p-6 rounded-xl border ${editingId === q.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'} shadow-sm hover:shadow-md transition-all`}
                  >
                    {/* Question Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {qIndex + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {getSkillName(q.skill_id)}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              q.difficulty_level_id === 1 ? 'bg-green-100 text-green-800' :
                              q.difficulty_level_id === 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {getDifficultyName(q.difficulty_level_id)}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              q.question_status === 1 ? 'bg-gray-100 text-gray-800' :
                              q.question_status === 2 ? 'bg-purple-100 text-purple-800' :
                              'bg-indigo-100 text-indigo-800'
                            }`}>
                              {q.question_status === 1 ? 'Single Upload' : 
                               q.question_status === 2 ? 'AI Generated' : 'Bulk Upload'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {editingId === q.id ? (
                          <>
                            <button
                              onClick={saveChanges}
                              className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              title="Save"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                              title="Cancel"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => startEditing(q)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(q.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    {/* Question Content */}
                    <div className="space-y-4 ml-11">
                      {/* Question Text */}
                      {editingId === q.id ? (
                        <textarea
                          value={editData.questions}
                          onChange={(e) => handleInputChange(e, 'questions')}
                          className="w-full p-3 border border-blue-300 rounded-lg bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={3}
                        />
                      ) : (
                        <div
                          className="text-base font-medium p-2 bg-white rounded-md text-gray-800"
                          dangerouslySetInnerHTML={renderHTML(q.questions)}
                        />
                      )}

                      {/* Options */}
                      <div className="space-y-3">
                        {editingId === q.id 
                          ? editData.option.map((opt, optIndex) => (
                              <div key={optIndex} className="space-y-2">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full mr-3 bg-gray-200 text-gray-700 text-xs">
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  <input
                                    type="text"
                                    value={opt.option}
                                    onChange={(e) => handleInputChange(e, 'option', optIndex)}
                                    className="flex-1 p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                  />
                                </div>
                                <div className="ml-9">
                                  <label className="block text-xs text-gray-500 mb-1">Feedback:</label>
                                  <input
                                    type="text"
                                    value={opt.feedback || ''}
                                    onChange={(e) => handleInputChange(e, 'feedback', optIndex)}
                                    className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Feedback for this option"
                                  />
                                </div>
                              </div>
                            ))
                          : q.option.map((opt, optIndex) => (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg flex flex-col ${
                                  q.correct_answer === opt.option
                                    ? 'bg-green-50 border-l-4 border-green-500'
                                    : 'bg-gray-50 border-l-4 border-gray-300'
                                }`}
                              >
                                <div className="flex items-start">
                                  <div
                                    className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 text-xs ${
                                      q.correct_answer === opt.option
                                        ? 'bg-green-200 text-green-700'
                                        : 'bg-gray-200 text-gray-700'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  <div className="flex-1">
                                    <div
                                      className="text-sm font-medium text-gray-800"
                                      dangerouslySetInnerHTML={renderHTML(opt.option)}
                                    />
                                    {opt.feedback && (
                                      <div className="mt-2 text-xs p-2 bg-indigo-50 text-indigo-700 rounded-md">
                                        <span className="font-medium">Feedback:</span> {opt.feedback}
                                      </div>
                                    )}
                                  </div>
                                  {q.correct_answer === opt.option && (
                                    <div className="ml-2 text-green-600">
                                      <Check className="h-5 w-5" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))
                        }

                        {/* Correct Answer Selector (only in edit mode) */}
                        {editingId === q.id && (
                          <div className="mt-4 ml-9">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Correct Answer
                            </label>
                            <select
                              value={editData.correct_answer}
                              onChange={(e) => handleInputChange(e, 'correct_answer')}
                              className="w-full p-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {editData.option.map((opt, index) => (
                                <option key={index} value={opt.option}>
                                  Option {String.fromCharCode(65 + index)}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewQuestions;