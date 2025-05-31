import React, { useState, useEffect } from "react";
import axios from "axios";
import Switch from "react-switch";
import { ChevronDown, ChevronUp, X, Info, BookOpen, BarChart2, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import CountUp from 'react-countup';
import Swal from 'sweetalert2';

export default function AssignTest() {
  const [tests, setTests] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTests, setExpandedTests] = useState(new Set());
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filterSkill, setFilterSkill] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [skills, setSkills] = useState([]);
  const [levels, setLevels] = useState([]);

  // Fetch tests, available questions, skills, and levels
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [testsResponse, questionsResponse, skillsResponse, levelsResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/test/tests", { withCredentials: true }),
          axios.get("http://localhost:5000/api/test/available-questions", { withCredentials: true }),
          axios.get("http://localhost:5000/api/test/skills", { withCredentials: true }),
          axios.get("http://localhost:5000/api/test/difficulty-levels", { withCredentials: true }),
        ]);
        setTests(Array.isArray(testsResponse.data) ? testsResponse.data : []);
        setAvailableQuestions(Array.isArray(questionsResponse.data) ? questionsResponse.data : []);
        setSkills(Array.isArray(skillsResponse.data) ? skillsResponse.data : []);
        setLevels(Array.isArray(levelsResponse.data) ? levelsResponse.data : []);
      } catch (err) {
        setError("Failed to load data. Please check the server connection.");
        console.error("Fetch error:", err);
        Swal.fire({
          title: 'Error',
          text: 'Failed to load data',
          icon: 'error',
          confirmButtonColor: '#2563eb',
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Toggle test status
  const handleToggleStatus = async (testId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      const response = await axios.post(
        "http://localhost:5000/api/test/toggle-test-status-skill-based",
        { test_id: testId, active_status: newStatus },
        { withCredentials: true }
      );
      setTests((prev) =>
        prev.map((test) =>
          test.test_id === testId ? { ...test, active_status: newStatus ? 1 : 0 } : test
        )
      );
      setSuccess(response.data.msg);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update test status.");
      console.error("Toggle error:", err);
      setTimeout(() => setError(""), 3000);
      Swal.fire({
        title: 'Error',
        text: err.response?.data?.msg || 'Failed to update test status',
        icon: 'error',
        confirmButtonColor: '#2563eb',
      });
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get question availability message
  const getAvailabilityMessage = (test) => {
    const skillQuestions = availableQuestions.find((q) => q.skill_id === test.skill_id);
    if (!skillQuestions) return "No questions available for this skill.";
    const messages = [];
    if (test.easy_level_question > skillQuestions.easy_count) {
      messages.push(`Add ${test.easy_level_question - skillQuestions.easy_count} more easy questions`);
    }
    if (test.medium_level_question > skillQuestions.medium_count) {
      messages.push(`Add ${test.medium_level_question - skillQuestions.medium_count} more medium questions`);
    }
    if (test.hard_level_question > skillQuestions.hard_count) {
      messages.push(`Add ${test.hard_level_question - skillQuestions.hard_count} more hard questions`);
    }
    return messages.length > 0 ? messages.join(", ") : "";
  };

  // Toggle test details view
  const toggleTestDetails = (testId) => {
    setExpandedTests((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(testId)) {
        newSet.delete(testId);
      } else {
        newSet.add(testId);
      }
      return newSet;
    });
  };

  // Filter tests
  const filteredTests = tests.filter((test) => {
    const matchesSkill = filterSkill === 'all' || test.skill_id.toString() === filterSkill;
    const matchesLevel = filterLevel === 'all' || (test.difficulty_level_id ? test.difficulty_level_id.toString() : '') === filterLevel;
    const matchesSearch = searchText
      ? test.test_name.toLowerCase().includes(searchText.toLowerCase()) ||
        test.test_description.toLowerCase().includes(searchText.toLowerCase())
      : true;
    return matchesSkill && matchesLevel && matchesSearch;
  });

  // Calculate stats
  const activeTestsCount = tests.filter(t => t.active_status === 1).length;
  const inactiveTestsCount = tests.filter(t => t.active_status === 0).length;

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Assessment Management</h1>
                <p className="text-blue-100 text-sm sm:text-base mt-1">
                  Manage your test configurations and availability
                </p>
              </div>
              <div className="w-full sm:w-64 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search tests..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500 bg-opacity-20 border border-blue-300 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stats and Filters */}
          <div className="p-4 sm:p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">Total Tests</div>
                <div className="mt-1 text-2xl font-bold text-blue-600">
                  <CountUp end={tests.length} duration={1} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">Active Tests</div>
                <div className="mt-1 text-2xl font-bold text-green-600">
                  <CountUp end={activeTestsCount} duration={1} />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-gray-500 text-sm font-medium">Inactive Tests</div>
                <div className="mt-1 text-2xl font-bold text-red-600">
                  <CountUp end={inactiveTestsCount} duration={1} />
                </div>
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Tests</h2>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                    <select
                      value={filterLevel}
                      onChange={(e) => setFilterLevel(e.target.value)}
                      className="w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                    >
                      <option value="all">All Levels</option>
                      {levels.map((level) => (
                        <option key={level.level_id} value={level.level_id}>
                          {level.level_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tests List */}
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
                <p>{error}</p>
              </div>
            ) : filteredTests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No tests found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchText || filterSkill !== 'all' || filterLevel !== 'all'
                    ? 'Try adjusting your search or filter criteria'
                    : 'No tests available in the database'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTests.map((test) => {
                  const isExpanded = expandedTests.has(test.test_id);
                  const isActive = test.active_status === 1;
                  const availabilityMessage = getAvailabilityMessage(test);

                  return (
                    <div
                      key={test.test_id}
                      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
                        isExpanded ? "ring-2 ring-blue-500" : "hover:shadow-lg"
                      }`}
                    >
                      {/* Card Header */}
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <div className="flex-grow cursor-pointer" onClick={() => toggleTestDetails(test.test_id)}>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">{test.test_name}</h3>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{test.test_description}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch
                              onChange={() => handleToggleStatus(test.test_id, isActive)}
                              checked={isActive}
                              onColor="#3b82f6"
                              offColor="#9ca3af"
                              handleDiameter={20}
                              uncheckedIcon={false}
                              checkedIcon={false}
                              height={24}
                              width={48}
                              className="react-switch"
                            />
                            <button
                              className="text-blue-600 hover:text-blue-800 focus:outline-none"
                              onClick={() => toggleTestDetails(test.test_id)}
                            >
                              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <BookOpen className="mr-1" size={12} /> {test.skill_name}
                          </span>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <BarChart2 className="mr-1" size={12} /> {test.level_name}
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-200 p-5 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-medium text-gray-800">Test Configuration</h4>
                            <button
                              onClick={() => toggleTestDetails(test.test_id)}
                              className="text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-500">Total Questions</p>
                                <p className="text-lg font-semibold text-gray-800">{test.total_no_of_questions}</p>
                              </div>
                              <div className="bg-white p-3 rounded-lg border border-gray-200">
                                <p className="text-sm font-medium text-gray-500">Created</p>
                                <p className="text-sm font-semibold text-gray-800 flex items-center">
                                  <Clock className="mr-1" size={14} /> {formatDate(test.created_at)}
                                </p>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h5 className="font-medium text-gray-700 mb-3 flex items-center">
                                <Info className="mr-2" size={16} /> Question Distribution
                              </h5>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Beginner</span>
                                    <span className="font-medium text-gray-800">
                                      {test.easy_level_question}
                                      {availabilityMessage.includes("easy") && (
                                        <span className="text-red-500 text-xs ml-1">⚠️</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full"
                                      style={{ width: `${(test.easy_level_question / test.total_no_of_questions) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Intermediate</span>
                                    <span className="font-medium text-gray-800">
                                      {test.medium_level_question}
                                      {availabilityMessage.includes("medium") && (
                                        <span className="text-red-500 text-xs ml-1">⚠️</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-yellow-500 h-2 rounded-full"
                                      style={{ width: `${(test.medium_level_question / test.total_no_of_questions) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">Advanced</span>
                                    <span className="font-medium text-gray-800">
                                      {test.hard_level_question}
                                      {availabilityMessage.includes("hard") && (
                                        <span className="text-red-500 text-xs ml-1">⚠️</span>
                                      )}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-red-500 h-2 rounded-full"
                                      style={{ width: `${(test.hard_level_question / test.total_no_of_questions) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <h5 className="font-medium text-gray-700 mb-3">Passing Criteria</h5>
                              <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="p-2 bg-blue-50 rounded">
                                  <p className="text-xs text-blue-600">Beginner</p>
                                  <p className="font-medium text-blue-800">{test.easy_pass_mark}</p>
                                </div>
                                <div className="p-2 bg-yellow-50 rounded">
                                  <p className="text-xs text-yellow-600">Intermediate</p>
                                  <p className="font-medium text-yellow-800">{test.medium_pass_mark}</p>
                                </div>
                                <div className="p-2 bg-red-50 rounded">
                                  <p className="text-xs text-red-600">Advanced</p>
                                  <p className="font-medium text-red-800">{test.hard_pass_mark}</p>
                                </div>
                              </div>
                            </div>
                            {availabilityMessage && (
                              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                                <div className="flex">
                                  <div className="flex-shrink-0">
                                    <Info className="h-5 w-5 text-red-500" />
                                  </div>
                                  <div className="ml-3">
                                    <p className="text-sm text-red-700">{availabilityMessage}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Error and Success Alerts */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-r mt-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}