// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { IoFilterOutline, IoClose } from 'react-icons/io5';
// import defaultProfile from "../../Assets/default_profile4.jpg";

// export default function Score() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [filteredRows, setFilteredRows] = useState([]);
//   const [filters, setFilters] = useState({
//     search: '',
//     testName: '',
//     percentageMin: '',
//     percentageMax: '',
//     sortBy: 'attendedAtDesc',
//   });
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [selectedPhoto, setSelectedPhoto] = useState(null);

//   let decodedId;
//   try {
//     decodedId = id ? atob(id) : null;
//   } catch (e) {
//     console.error("Failed to decode student ID:", e);
//     decodedId = null;
//   }

//   useEffect(() => {
//     if (!decodedId) {
//       setError('Invalid user ID. Please log in again.');
//       navigate('/login');
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const response = await axios.get('http://localhost:5000/api/stu/all-students-test-data', {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//             'X-Admin-ID': decodedId,
//           },
//         });
//         if (response.data?.status === 'success' && Array.isArray(response.data.students)) {
//           setData(response.data);
//           setError('');
//         } else {
//           throw new Error('Invalid data format received from API');
//         }
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load students data. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [decodedId, navigate]);

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//         hour: '2-digit',
//         minute: '2-digit',
//         hour12: true,
//         timeZone: 'Asia/Kolkata',
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   useEffect(() => {
//     if (!data || data.status !== 'success' || !Array.isArray(data.students)) {
//       setFilteredRows([]);
//       return;
//     }

//     const tableRows = [];
//     const seenCombinations = new Set();

//     data.students
//       .filter((studentData) => studentData?.testResults?.length > 0)
//       .forEach((studentData) => {
//         if (!studentData?.student) return;

//         const uniqueTestResults = [];
//         const seenTestNames = new Set();

//         (studentData.testResults || []).forEach((result) => {
//           if (!result?.test_name) return;
//           const key = `${studentData.student.name || 'unknown'}-${result.test_name}`;
//           if (!seenTestNames.has(result.test_name)) {
//             seenTestNames.add(result.test_name);
//             seenCombinations.add(result.test_name);
//             uniqueTestResults.push(result);
//           }
//         });

//         const totalScore = uniqueTestResults.reduce((sum, r) => sum + (r.total_score || 0), 0);

//         uniqueTestResults.forEach((result) => {
//           tableRows.push({
//             student: studentData.student,
//             totalScore,
//             skillCount: studentData.skillCount || 0,
//             testResult: result,
//           });
//         });
//       });

//     let filtered = tableRows.filter((row) => {
//       const searchMatch =
//         (row.student?.name?.toLowerCase()?.includes(filters.search.toLowerCase()) || false) ||
//         (row.student?.roll_no?.toLowerCase()?.includes(filters.search.toLowerCase()) || false);
//       const testNameMatch =
//         !filters.testName ||
//         (row.testResult?.test_name?.toLowerCase()?.includes(filters.testName.toLowerCase()) || false);
//       const percentageMinMatch =
//         filters.percentageMin === '' ||
//         (row.testResult?.percentage >= Number(filters.percentageMin) || false);
//       const percentageMaxMatch =
//         filters.percentageMax === '' ||
//         (row.testResult?.percentage <= Number(filters.percentageMax) || false);

//       return searchMatch && testNameMatch && percentageMinMatch && percentageMaxMatch;
//     });

//     filtered.sort((a, b) => {
//       switch (filters.sortBy) {
//         case 'attendedAtDesc':
//           return (new Date(b.testResult?.attended_at || 0) - new Date(a.testResult?.attended_at || 0)) || 0;
//         case 'attendedAtAsc':
//           return (new Date(a.testResult?.attended_at || 0) - new Date(b.testResult?.attended_at || 0)) || 0;
//         case 'totalScoreDesc':
//           return (b.totalScore || 0) - (a.totalScore || 0);
//         case 'totalScoreAsc':
//           return (a.totalScore || 0) - (b.totalScore || 0);
//         case 'studentLevelAsc':
//           return (a.testResult?.student_level || '').localeCompare(b.testResult?.student_level || '');
//         case 'studentLevelDesc':
//           return (b.testResult?.student_level || '').localeCompare(a.testResult?.student_level || '');
//         default:
//           return 0;
//       }
//     });

//     setFilteredRows(filtered);
//   }, [data, filters]);

//   const handleFilterChange = (e) => {
//     const { name, value } = e.target;
//     setFilters((prev) => ({ ...prev, [name]: value }));
//   };

//   const testNames = Array.from(
//     new Set(
//       data?.students?.flatMap((s) => s.testResults?.map((r) => r.test_name) || []).filter(Boolean)
//     )
//   ).sort();

//   const resetFilters = () => {
//     setFilters({
//       search: '',
//       testName: '',
//       percentageMin: '',
//       percentageMax: '',
//       sortBy: 'attendedAtDesc',
//     });
//   };

//   const handlePhotoClick = (photoUrl) => {
//     setSelectedPhoto(photoUrl || defaultProfile);
//   };

//   const closeModal = () => {
//     setSelectedPhoto(null);
//   };

//   const renderSkeleton = () => (
//     <div className="space-y-4">
//       {[...Array(5)].map((_, i) => (
//         <div key={i} className="animate-pulse flex space-x-4 p-4 bg-white rounded-lg shadow">
//           <div className="flex-1 space-y-3">
//             <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//             <div className="space-y-2">
//               <div className="h-3 bg-gray-200 rounded"></div>
//               <div className="h-3 bg-gray-200 rounded w-5/6"></div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
//           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//             Students Test Details
//           </h1>
//           <div className="mt-4 md:mt-0">
//             <button
//               onClick={() => setIsFilterVisible(!isFilterVisible)}
//               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 text-sm font-medium"
//             >
//               {isFilterVisible ? (
//                 <>
//                   <IoClose className="mr-2 h-4 w-4" />
//                   Hide Filters
//                 </>
//               ) : (
//                 <>
//                   <IoFilterOutline className="mr-2 h-4 w-4" />
//                   Show Filters
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {isFilterVisible && (
//           <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Search Students
//                 </label>
//                 <input
//                   type="text"
//                   name="search"
//                   value={filters.search}
//                   onChange={handleFilterChange}
//                   placeholder="Name or roll number"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Test Name
//                 </label>
//                 <select
//                   name="testName"
//                   value={filters.testName}
//                   onChange={handleFilterChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 >
//                   <option value="">All Tests</option>
//                   {testNames.map((name) => (
//                     <option key={name} value={name}>
//                       {name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Percentage Range
//                 </label>
//                 <div className="flex space-x-2">
//                   <input
//                     type="number"
//                     name="percentageMin"
//                     value={filters.percentageMin}
//                     onChange={handleFilterChange}
//                     placeholder="Min %"
//                     min="0"
//                     max="100"
//                     className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   />
//                   <input
//                     type="number"
//                     name="percentageMax"
//                     value={filters.percentageMax}
//                     onChange={handleFilterChange}
//                     placeholder="Max %"
//                     min="0"
//                     max="100"
//                     className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                   />
//                 </div>
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sort By
//                 </label>
//                 <select
//                   name="sortBy"
//                   value={filters.sortBy}
//                   onChange={handleFilterChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
//                 >
//                   <option value="attendedAtDesc">Latest Attended</option>
//                   <option value="attendedAtAsc">Earliest Attended</option>
//                   <option value="totalScoreDesc">Highest Score</option>
//                   <option value="totalScoreAsc">Lowest Score</option>
//                   <option value="studentLevelAsc">Level (A-Z)</option>
//                   <option value="studentLevelDesc">Level (Z-A)</option>
//                 </select>
//               </div>
//             </div>
//             <div className="flex justify-end mt-4 space-x-3">
//               <button
//                 onClick={resetFilters}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Reset Filters
//               </button>
//               <button
//                 onClick={() => setIsFilterVisible(false)}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 Apply Filters
//               </button>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {selectedPhoto && (
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//             onClick={closeModal}
//           >
//             <div className="relative bg-white p-4 rounded-lg max-w-lg w-full">
//               <button
//                 className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
//                 onClick={closeModal}
//               >
//                 <IoClose className="h-6 w-6" />
//               </button>
//               <img
//                 src={selectedPhoto}
//                 alt="Profile"
//                 className="w-full h-auto rounded-lg"
//               />
//             </div>
//           </div>
//         )}

//         {loading ? (
//           renderSkeleton()
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
//             <div className="overflow-x-auto">
//               {filteredRows.length === 0 ? (
//                 <div className="p-8 text-center">
//                   <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.001M15 10h.001M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
//                   <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
//                 </div>
//               ) : (
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Student
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Test Details
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Performance
//                       </th>
//                       <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Results
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredRows.map((row, index) => (
//                       <tr key={`${row.student?.student_id || 'row'}-${row.testResult?.id || index}`} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden cursor-pointer" onClick={() => handlePhotoClick(row.student?.profile_photo ? `http://localhost:5000/resumes/${row.student.profile_photo}` : defaultProfile)}>
//                               <img
//                                 src={row.student?.profile_photo ? `http://localhost:5000/resumes/${row.student.profile_photo}` : defaultProfile}
//                                 alt="Profile"
//                                 className="h-full w-full object-cover"
//                               />
//                             </div>
//                             <div className="ml-4">
//                               <div className="text-sm font-medium text-gray-900 capitalize">
//                                 {row.student?.name || 'Unknown'}
//                               </div>
//                               <div className="text-sm text-gray-500">{row.student?.roll_no || 'N/A'}</div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="text-sm text-gray-900 font-medium">{row.testResult?.test_name || 'N/A'}</div>
//                           <div className="text-sm text-gray-500">{formatDate(row.testResult?.attend_at)}</div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="grid grid-cols-3 gap-4">
//                             <div>
//                               <div className="text-xs text-gray-500">Beg.</div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {row.testResult?.easy_score ?? 'N/A'} / {row.testResult?.easy_attended || 'N/A'}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-xs text-gray-500">Int.</div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {row.testResult?.medium_score ?? 'N/A'} / {row.testResult?.medium_attended || 'N/A'}
//                               </div>
//                             </div>
//                             <div>
//                               <div className="text-xs text-gray-500">Adv.</div>
//                               <div className="text-sm font-medium text-gray-900">
//                                 {row.testResult?.hard_score ?? 'N/A'} / {row.testResult?.hard_attended || 'N/A'}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="flex items-center space-x-4">
//                             <div>
//                               <div className="text-xs text-gray-500">Total</div>
//                               <div className="text-sm font-medium text-blue-600">{row.testResult?.total_score ?? 'N/A'}</div>
//                             </div>
//                             <div>
//                               <div className="text-xs text-gray-500">Percentage</div>
//                               <div className="text-sm font-medium">{row.testResult?.percentage ? `${row.testResult.percentage}%` : 'N/A'}</div>
//                             </div>
//                             <div>
//                               <div className="text-xs text-gray-500">Level</div>
//                               <div
//                                 className={`text-sm font-medium ${
//                                   row.testResult?.student_level === 'Advanced' || row.testResult?.student_level === 'Hard'
//                                     ? 'text-green-600'
//                                     : row.testResult?.student_level === 'Intermediate'
//                                     ? 'text-yellow-600'
//                                     : 'text-red-600'
//                                 }`}
//                               >
//                                 {row.testResult?.student_level || 'N/A'}
//                               </div>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }











import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, X, User, BookOpen, BarChart2, Clock, CheckCircle2, XCircle, 
  ChevronDown, ChevronUp, Eye, ArrowLeft, ArrowRight, Trophy, Award, 
  AlertCircle, HelpCircle, ClipboardCheck, Clock4
} from 'lucide-react';
import defaultProfile from '../../Assets/default_profile4.jpg';

export default function Score() {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [selectedPerformance, setSelectedPerformance] = useState(null);
  const [expandedRow, setExpandedRow] = useState(null);

  let decodedId;
  try {
    decodedId = id ? atob(id) : null;
  } catch (e) {
    console.error('Failed to decode student ID:', e);
    decodedId = null;
  }

  useEffect(() => {
    if (!decodedId) {
      setError('Invalid user ID. Please log in again.');
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/stu/all-students-test-data', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            'X-Admin-ID': decodedId,
          },
        });
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
  }, [decodedId, navigate]);

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

  const formatDuration = (duration) => {
    if (!duration) return 'N/A';
    try {
      const [hours, minutes, seconds] = duration.split(':').map(Number);
      return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${seconds}s`;
    } catch {
      return duration;
    }
  };

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
            uniqueTestResults.push({
              ...result,
              performance: studentData.studentperformance.find(
                (perf) => perf.test_id === result.test_id
              ),
            });
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

    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'attendedAtDesc':
          return new Date(b.testResult?.attend_at || 0) - new Date(a.testResult?.attend_at || 0) || 0;
        case 'attendedAtAsc':
          return new Date(a.testResult?.attend_at || 0) - new Date(b.testResult?.attend_at || 0) || 0;
        case 'totalScoreDesc':
          return (b.totalScore || 0) - (a.totalScore || 0);
        case 'totalScoreAsc':
          return (a.totalScore || 0) - (b.totalScore || 0);
        default:
          return 0;
      }
    });

    setFilteredRows(filtered);
  }, [data, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const testNames = Array.from(
    new Set(data?.students?.flatMap((s) => s.testResults?.map((r) => r.test_name) || []).filter(Boolean))
  ).sort();

  const resetFilters = () => {
    setFilters({
      search: '',
      testName: '',
      percentageMin: '',
      percentageMax: '',
      sortBy: 'attendedAtDesc',
    });
  };

  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl || defaultProfile);
  };

  const closeModal = () => {
    setSelectedPhoto(null);
    setSelectedPerformance(null);
  };

  const handleViewDetails = (performance) => {
    setSelectedPerformance(performance);
  };

  const toggleRowExpand = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const getLevelColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'advanced':
        return 'bg-emerald-100 text-emerald-800';
      case 'intermediate':
        return 'bg-amber-100 text-amber-800';
      case 'beginner':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex space space-x-4 p-4 bg-white rounded-lg shadow">
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

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div className="mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm font-medium"
            >
              {isFilterVisible ? (
                <>
                  <X className="mr-2 h-4 w-4" />
                  Hide Filters
                </>
              ) : (
                <>
                  <Filter className="mr-2 h-4 w-4" />
                  Show Filters
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isFilterVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow-md p-4 mb-6 border border-gray-200 overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search Students</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                      placeholder="Name or roll number"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                  <div className="relative">
                    <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      name="testName"
                      value={filters.testName}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
                    >
                      <option value="">All Tests</option>
                      {testNames.map((name) => (
                        <option key={name} value={name}>{name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Percentage Range</label>
                  <div className="flex space-x-2">
                    <div className="relative w-1/2">
                      <input
                        type="number"
                        name="percentageMin"
                        value={filters.percentageMin}
                        onChange={handleFilterChange}
                        placeholder="Min %"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                    <div className="relative w-1/2">
                      <input
                        type="number"
                        name="percentageMax"
                        value={filters.percentageMax}
                        onChange={handleFilterChange}
                        placeholder="Max %"
                        min="0"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <div className="relative">
                    <BarChart2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <select
                      name="sortBy"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
                    >
                      <option value="attendedAtDesc">Latest Attended</option>
                      <option value="attendedAtAsc">Earliest Attended</option>
                      <option value="totalScoreDesc">Highest Score</option>
                      <option value="totalScoreAsc">Lowest Score</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={resetFilters}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Reset Filters
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsFilterVisible(false)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Apply Filters
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {(selectedPhoto || selectedPerformance) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="relative bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 transition-colors"
                  onClick={closeModal}
                >
                  {/* <X className="h-6 w-6" /> */}
                </button>
                {selectedPhoto && (
                  <div className="flex flex-col items-center">
                    <img 
                      src={selectedPhoto} 
                      alt="Profile" 
                      className="w-48 h-48 rounded-full object-cover shadow-md mb-4"
                    />
                    <button
                      onClick={closeModal}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                )}
                {selectedPerformance && (
                  <div className="space-y-6">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-lg text-white">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                          <h2 className="text-2xl font-bold mb-2">
                            {selectedPerformance.test_details.test_name || 'N/A'}
                          </h2>
                          <p className="text-indigo-100">
                            {/* {selectedPerformance.test_details.test_description || 'No description available'} */}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 grid grid-cols-2 gap-4">
                          {/* <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
                            <Trophy className="h-5 w-5" />
                            <div>
                              <p className="text-xs text-indigo-200">Overall Score</p>
                              <p className="text-sm font-semibold">
                                {selectedPerformance.total_score || 'N/A'} / {selectedPerformance.test_details.total_no_of_questions || 'N/A'}
                              </p>
                            </div>
                          </div> */}
                          <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
                            <Clock4 className="h-5 w-5" />
                            <div>
                              <p className="text-xs text-indigo-200">Completed In</p>
                              <p className="text-sm font-semibold">
                                {formatDuration(selectedPerformance.completed_duration) || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5" />
                            <div>
                              <p className="text-xs text-indigo-200">Test Date</p>
                              <p className="text-sm font-semibold">
                                {formatDate(selectedPerformance.created_at) || 'N/A'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 bg-white/20 p-2 rounded-lg">
                            <User className="h-5 w-5" />
                            <div>
                              <p className="text-xs text-indigo-200">Student</p>
                              <p className="text-sm font-semibold capitalize">
                                {selectedPerformance.student_name || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Questions Section */}
                    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ClipboardCheck className="h-5 w-5 mr-2 text-indigo-500" />
                        Questions Attempted
                        <span className="text-sm font-normal text-gray-500 ml-2">
                          ({selectedPerformance.questions?.length || 0} questions)
                        </span>
                      </h3>
                      {selectedPerformance.questions.length === 0 ? (
                        <div className="text-center py-8">
                          <HelpCircle className="h-12 w-12 text-gray-400 mx-auto" />
                          <p className="mt-2 text-sm text-gray-500">No questions attempted.</p>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {selectedPerformance.questions.map((q, index) => (
                            <div key={q.question_id} className="border-b border-gray-200 pb-4 last:border-0">
                              <div className="flex items-start space-x-2">
                                <span className={`flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-full text-sm font-medium ${
                                  q.student_answer === q.correct_answer 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {index + 1}
                                </span>
                                <div 
                                  className="prose prose-sm max-w-none"
                                  dangerouslySetInnerHTML={{ __html: q.questions }}
                                />
                              </div>
                              <div className="ml-8 mt-3 space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {q.option.map((opt, optIndex) => (
                                    <div
                                      key={optIndex}
                                      className={`p-3 rounded-lg border ${
                                        opt.option === q.correct_answer
                                          ? 'bg-green-50 border-green-200'
                                          : opt.option === q.student_answer && q.student_answer !== q.correct_answer
                                          ? 'bg-red-50 border-red-200'
                                          : 'bg-gray-50 border-gray-200'
                                      }`}
                                    >
                                      <div className="flex items-start">
                                        <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full text-xs font-medium mr-2 mt-0.5 ${
                                          opt.option === q.correct_answer
                                            ? 'bg-green-100 text-green-800'
                                            : opt.option === q.student_answer && q.student_answer !== q.correct_answer
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}>
                                          {String.fromCharCode(97 + optIndex)}
                                        </span>
                                        <div>
                                          <p className="text-sm">{opt.option}</p>
                                          {opt.feedback && (
                                            <p className={`text-xs mt-1 ${
                                              opt.option === q.correct_answer
                                                ? 'text-green-600'
                                                : opt.option === q.student_answer && q.student_answer !== q.correct_answer
                                                ? 'text-red-600'
                                                : 'text-gray-500'
                                            }`}>
                                              {opt.feedback}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  <div className="bg-blue-50 text-blue-800 text-xs px-2 py-1 rounded">
                                    <span className="font-medium">Correct:</span> {q.correct_answer}
                                  </div>
                                  <div className={`${
                                    q.student_answer === q.correct_answer
                                      ? 'bg-green-50 text-green-800'
                                      : 'bg-red-50 text-red-800'
                                  } text-xs px-2 py-1 rounded`}>
                                    <span className="font-medium">Your Answer:</span> {q.student_answer || 'Not answered'}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          renderSkeleton()
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              {filteredRows.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                    <HelpCircle className="h-full w-full" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                </motion.div>
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
                        Performance
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Results
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRows.map((row, index) => (
                      <motion.tr
                        key={`${row.student?.student_id || 'row'}-${row.testResult?.id || index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden cursor-pointer"
                              onClick={() =>
                                handlePhotoClick(
                                  row.student?.profile_photo
                                    ? `http://localhost:5000/resumes/${row.student.profile_photo}`
                                    : defaultProfile
                                )
                              }
                            >
                              <img
                                src={
                                  row.student?.profile_photo
                                    ? `http://localhost:5000/resumes/${row.student.profile_photo}`
                                    : defaultProfile
                                }
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
                          <div className="text-sm text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatDate(row.testResult?.attend_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Beg.</div>
                              <div className="text-sm font-medium">
                                <span className="text-blue-600">{row.testResult?.easy_score ?? '0'}</span>
                                <span className="text-gray-400"> / {row.testResult?.easy_attended || '0'}</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Int.</div>
                              <div className="text-sm font-medium">
                                <span className="text-amber-600">{row.testResult?.medium_score ?? '0'}</span>
                                <span className="text-gray-400"> / {row.testResult?.medium_attended || '0'}</span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Adv.</div>
                              <div className="text-sm font-medium">
                                <span className="text-emerald-600">{row.testResult?.hard_score ?? '0'}</span>
                                <span className="text-gray-400"> / {row.testResult?.hard_attended || '0'}</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div>
                              <div className="text-xs text-gray-500">Total</div>
                              <div className="text-sm font-medium text-indigo-600">
                                {row.testResult?.total_score ?? 'N/A'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500">Percentage</div>
                              <div className="text-sm font-medium">
                                {row.testResult?.percentage ? `${row.testResult.percentage}%` : 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              if (expandedRow === index) {
                                setExpandedRow(null);
                              } else {
                                setExpandedRow(index);
                                if (row.testResult?.performance) {
                                  setSelectedPerformance(row.testResult.performance);
                                }
                              }
                            }}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            {expandedRow === index ? (
                              <>
                                <ChevronUp className="h-4 w-4 mr-1" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </>
                            )}
                          </button>
                        </td>
                      </motion.tr>
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