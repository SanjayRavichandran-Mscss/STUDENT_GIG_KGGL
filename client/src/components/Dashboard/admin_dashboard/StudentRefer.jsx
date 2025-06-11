import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, X, ChevronRight, ChevronDown, Search, Filter, Info, Send, BookOpen, Smartphone, Hash } from 'lucide-react';
import Swal from 'sweetalert2';
import axios from 'axios';

export default function StudentRefer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalProject, setModalProject] = useState(null);
  const [emailLoading, setEmailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    skill: 'all',
    difficulty: 'all',
    status: 'all'
  });

  // Decode the id
  let decodedId;
  try {
    decodedId = id ? atob(id) : null;
  } catch (e) {
    console.error('Failed to decode student ID:', e);
    decodedId = null;
  }

  // Validate ID and redirect if invalid
  useEffect(() => {
    if (!decodedId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Invalid user ID. Please log in again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-lg shadow-xl bg-white/95 backdrop-blur-sm',
          title: 'text-xl font-bold text-red-800',
          content: 'text-gray-700',
          confirmButton: 'px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors',
        },
      }).then(() => navigate('/login'));
    }
  }, [decodedId, navigate]);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('https://gig.kggeniuslabs.com/api/api/admin/getallprojects-studentrequired');
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('API error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load projects. Please try again later.',
          confirmButtonColor: '#dc2626',
          customClass: {
            popup: 'rounded-lg shadow-xl bg-white/95 backdrop-blur-sm',
            title: 'text-xl font-bold text-red-800',
            content: 'text-gray-700',
            confirmButton: 'px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors',
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (decodedId) {
      fetchProjects();
    }
  }, [decodedId]);

  // Handle mail icon click
  const handleComposeMail = (project) => {
    setSelectedProject(project);
  };

  // Close email form
  const closeEmailForm = () => {
    setSelectedProject(null);
  };

  // Handle form submission
  const handleSendMail = async (e) => {
    e.preventDefault();
    const to = selectedProject.email;
    const subject = e.target.subject.value;
    const body = e.target.body.value;

    setEmailLoading(true);
    try {
      const response = await axios.post('https://gig.kggeniuslabs.com/api/api/admin/send-referral-mail', {
        to,
        subject,
        body,
      });
      if (response.data.msg === 'email_sent') {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Email sent successfully!',
          confirmButtonColor: '#2563eb',
          customClass: {
            popup: 'rounded-lg shadow-xl bg-white/95 backdrop-blur-sm',
            title: 'text-xl font-bold text-blue-800',
            content: 'text-gray-700',
            confirmButton: 'px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors',
          },
        });
        closeEmailForm();
      } else {
        throw new Error('Unexpected response');
      }
    } catch (error) {
      console.error('Email sending error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to send email. Please try again.',
        confirmButtonColor: '#dc2626',
        customClass: {
          popup: 'rounded-lg shadow-xl bg-white/95 backdrop-blur-sm',
          title: 'text-xl font-bold text-red-800',
          content: 'text-gray-700',
          confirmButton: 'px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-colors',
        },
      });
    } finally {
      setEmailLoading(false);
    }
  };

  // Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true, // Adjust to your preference for 12-hour or 24-hour format
  });
};
  // Truncate description to 4 words
  const truncateDescription = (description) => {
    if (!description) return 'N/A';
    const words = description.split(' ');
    return words.length > 4 ? words.slice(0, 4).join(' ') + '...' : description;
  };

  // Open description modal
  const openDescriptionModal = (project) => {
    setModalProject(project);
  };

  // Close description modal
  const closeDescriptionModal = () => {
    setModalProject(null);
  };

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.project_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = filters.skill === 'all' || project.skill_name === filters.skill;
    const matchesDifficulty = filters.difficulty === 'all' || project.level_name === filters.difficulty;
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && new Date(project.expiry_date) > new Date()) ||
                         (filters.status === 'expired' && new Date(project.expiry_date) <= new Date());
    
    return matchesSearch && matchesSkill && matchesDifficulty && matchesStatus;
  });

  // Get unique skills and difficulty levels for filters
  const uniqueSkills = [...new Set(projects.map(p => p.skill_name))].filter(Boolean);
  const uniqueDifficulties = [...new Set(projects.map(p => p.level_name))].filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
      
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-1">
              Student Required
            </h1>
            <p className="text-gray-600">Manage and refer students to available projects</p>
          </div>
          
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium">Filters</span>
              {showFilters ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <select
                  value={filters.skill}
                  onChange={(e) => setFilters({...filters, skill: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Skills</option>
                  {uniqueSkills.map(skill => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Levels</option>
                  {uniqueDifficulties.map(difficulty => (
                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <BookOpen className="h-10 w-10 mb-2 text-gray-400" />
                        <p className="text-lg font-medium">No projects found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr 
                      key={project.project_id} 
                      className={`hover:bg-gray-50 transition-colors ${
                        new Date(project.expiry_date) <= new Date() ? 'bg-red-50/50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 font-medium">
                            {project.project_id}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{project.project_name}</div>
                            <div className="text-sm text-gray-500 flex items-center">
                              {truncateDescription(project.description)}
                              {project.description && project.description.split(' ').length > 4 && (
                                <button
                                  onClick={() => openDescriptionModal(project)}
                                  className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                                  title="View full description"
                                >
                                  <Info className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                 
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.skill_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          project.level_name === 'Beginner' ? 'bg-green-100 text-green-800' :
                          project.level_name === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          project.level_name === 'Advanced' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {project.level_name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.number_of_students}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{project.created_by_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{project.email || 'N/A'}</span>
                          </div>
                          {project.mobile_number && (
                            <div className="flex items-center gap-1">
                              <Smartphone className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-900">{project.mobile_number}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(project.expiry_date)}
                          {new Date(project.expiry_date) <= new Date() && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>
                    
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleComposeMail(project)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4 focus:outline-none group"
                          title="Send"
                        >
                          <div className="flex items-center gap-1">
                            <div className="p-2 rounded-full bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                              <Send className="h-4 w-4" />
                            </div>
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Email Form Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-slide-in-right">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>

                  </div>
                  <button
                    onClick={closeEmailForm}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSendMail} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <input
                      type="email"
                      name="to"
                      value={selectedProject.email || ''}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 text-sm cursor-not-allowed"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                    <textarea
                      name="body"
                      rows="6"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    ></textarea>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={closeEmailForm}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={emailLoading}
                      className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 inline-flex items-center ${
                        emailLoading ? 'opacity-75 cursor-not-allowed' : ''
                      }`}
                    >
                      {emailLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="-ml-1 mr-2 h-4 w-4" />
                          Send
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Description Modal */}
        {modalProject && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-fade-in">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">{modalProject.project_name}</h3>
                  <button
                    onClick={closeDescriptionModal}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                  {modalProject.description || 'No description available.'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}