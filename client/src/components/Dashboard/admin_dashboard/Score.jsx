import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoFilterOutline, IoClose } from 'react-icons/io5';
import defaultProfile from "../../Assets/default_profile4.jpg";

export default function Score() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredRows, setFilteredRows] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    testName: '',
    percentageMin: '',
    percentageMax: '',
    sortBy: 'attendedAtDesc',
  });
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/stu/all-students-test-data');
        if (response.data?.status === 'success' && Array.isArray(response.data.students)) {
          setData(response.data);
          setError('');
        } else {
          throw new Error('Invalid data format received from API');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load students data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Prepare and filter table rows
  useEffect(() => {
    if (!data || data.status !== 'success' || !Array.isArray(data.students)) {
      setFilteredRows([]);
      return;
    }

    const tableRows = [];
    const seenCombinations = new Set();

    data.students
      .filter((studentData) => studentData?.testResults?.length > 0)
      .forEach((studentData) => {
        if (!studentData?.student) return;

        const uniqueTestResults = [];
        const seenTestNames = new Set();

        (studentData.testResults || []).forEach((result) => {
          if (!result?.test_name) return;
          const key = `${studentData.student.name || 'unknown'}-${result.test_name}`;
          if (!seenTestNames.has(result.test_name)) {
            seenTestNames.add(result.test_name);
            seenCombinations.add(result.test_name);
            uniqueTestResults.push(result);
          }
        });

        const totalScore = uniqueTestResults.reduce((sum, r) => sum + (r.total_score || 0), 0);

        uniqueTestResults.forEach((result) => {
          tableRows.push({
            student: studentData.student,
            totalScore,
            skillCount: studentData.skillCount || 0,
            testResult: result,
          });
        });
      });

    // Apply filters
    let filtered = tableRows.filter((row) => {
      const searchMatch =
        (row.student?.name?.toLowerCase()?.includes(filters.search.toLowerCase()) || false) ||
        (row.student?.roll_no?.toLowerCase()?.includes(filters.search.toLowerCase()) || false);
      const testNameMatch =
        !filters.testName ||
        (row.testResult?.test_name?.toLowerCase()?.includes(filters.testName.toLowerCase()) || false);
      const percentageMinMatch =
        filters.percentageMin === '' ||
        (row.testResult?.percentage >= Number(filters.percentageMin) || false);
      const percentageMaxMatch =
        filters.percentageMax === '' ||
        (row.testResult?.percentage <= Number(filters.percentageMax) || false);

      return searchMatch && testNameMatch && percentageMinMatch && percentageMaxMatch;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'attendedAtDesc':
          return (new Date(b.testResult?.attended_at || 0) - new Date(a.testResult?.attended_at || 0)) || 0;
        case 'attendedAtAsc':
          return (new Date(a.testResult?.attended_at || 0) - new Date(b.testResult?.attended_at || 0)) || 0;
        case 'totalScoreDesc':
          return (b.totalScore || 0) - (a.totalScore || 0);
        case 'totalScoreAsc':
          return (a.totalScore || 0) - (b.totalScore || 0);
        case 'studentLevelAsc':
          return (a.testResult?.student_level || '').localeCompare(b.testResult?.student_level || '');
        case 'studentLevelDesc':
          return (b.testResult?.student_level || '').localeCompare(a.testResult?.student_level || '');
        default:
          return 0;
      }
    });

    setFilteredRows(filtered);
  }, [data, filters]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Get unique test names for dropdown
  const testNames = Array.from(
    new Set(
      data?.students?.flatMap((s) => s.testResults?.map((r) => r.test_name) || []).filter(Boolean)
    )
  ).sort();

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      testName: '',
      percentageMin: '',
      percentageMax: '',
      sortBy: 'attendedAtDesc',
    });
  };

  // Handle profile photo click
  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl || defaultProfile);
  };

  // Close modal
  const closeModal = () => {
    setSelectedPhoto(null);
  };

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4 p-4 bg-white rounded-lg shadow">
          <div className="flex-1 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Students Test Details
          </h1>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
            >
              {isFilterVisible ? (
                <>
                  <IoClose className="mr-2 h-4 w-4" />
                  Hide Filters
                </>
              ) : (
                <>
                  <IoFilterOutline className="mr-2 h-4 w-4" />
                  Show Filters
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filter Controls */}
        {isFilterVisible && (
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Students
                </label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Name or roll number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Test Name
                </label>
                <select
                  name="testName"
                  value={filters.testName}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="">All Tests</option>
                  {testNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentage Range
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="percentageMin"
                    value={filters.percentageMin}
                    onChange={handleFilterChange}
                    placeholder="Min %"
                    min="0"
                    max="100"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                  <input
                    type="number"
                    name="percentageMax"
                    value={filters.percentageMax}
                    onChange={handleFilterChange}
                    placeholder="Max %"
                    min="0"
                    max="100"
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="attendedAtDesc">Latest Attended</option>
                  <option value="attendedAtAsc">Earliest Attended</option>
                  <option value="totalScoreDesc">Highest Score</option>
                  <option value="totalScoreAsc">Lowest Score</option>
                  <option value="studentLevelAsc">Level (A-Z)</option>
                  <option value="studentLevelDesc">Level (Z-A)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-4 space-x-3">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border border-gray-300 Rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Reset Filters
              </button>
              <button
                onClick={() => setIsFilterVisible(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Profile Photo */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div className="relative bg-white p-4 rounded-lg max-w-lg w-full">
              <button
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
                onClick={closeModal}
              >
                <IoClose className="h-6 w-6" />
              </button>
              <img
                src={selectedPhoto}
                alt="Profile"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Data Table */}
        {loading ? (
          renderSkeleton()
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              {filteredRows.length === 0 ? (
                <div className="p-8 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Test Details
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Scores
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Results
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRows.map((row, index) => (
                      <tr key={`${row.student?.student_id || 'row'}-${row.testResult?.id || index}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden cursor-pointer" onClick={() => handlePhotoClick(row.student?.profile_photo || defaultProfile)}>
                              <img
                                src={row.student?.profile_photo || defaultProfile}
                                alt="Profile"
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 capitalize">
                                {row.student?.name || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">{row.student?.roll_no || 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 font-medium">{row.testResult?.test_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{formatDate(row.testResult?.attend_at)}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <div className="text-xs text-gray-500">Beginner</div>
                              <div className="text-sm font-medium">{row.testResult?.easy_score ?? 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Intermediate</div>
                              <div className="text-sm font-medium">{row.testResult?.medium_score ?? 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Advanced</div>
                              <div className="text-sm font-medium">{row.testResult?.hard_score ?? 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="text-xs text-gray-500">Total</div>
                              <div className="text-sm font-medium text-blue-600">{row.testResult?.total_score ?? 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Percentage</div>
                              <div className="text-sm font-medium">{row.testResult?.percentage ? `${row.testResult.percentage}%` : 'N/A'}</div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Level</div>
                              <div
                                className={`text-sm font-medium ${
                                  row.testResult?.student_level === 'Advanced'
                                    ? 'text-green-600'
                                    : row.testResult?.student_level === 'Intermediate'
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {row.testResult?.student_level || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}