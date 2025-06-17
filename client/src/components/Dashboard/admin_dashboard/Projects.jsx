// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link, useParams } from "react-router-dom";
// import { FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
// import { Maximize2, X } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function Projects() {
//   const { id: encodedAdminId } = useParams();
//   const [notificationCount, setNotificationCount] = useState({});
//   const [projects, setProjects] = useState([]);
//   const [expiredProjects, setExpiredProjects] = useState([]);
//   const [newExpiryDates, setNewExpiryDates] = useState({});
//   const [expandedCards, setExpandedCards] = useState({});
//   const [modalDescription, setModalDescription] = useState(null);

//   useEffect(() => {
//     if (!encodedAdminId) {
//       toast.error("Admin ID is missing. Please log in again.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const [projectsRes, expiredRes, bitsRes] = await Promise.all([
//           axios.get("https://gig.kggeniuslabs.com/api/api/admin/getallprojects"),
//           axios.get("https://gig.kggeniuslabs.com/api/api/admin/getexpiredprojects"),
//           axios.get("https://gig.kggeniuslabs.com/api/api/admin/getbit")
//         ]);

//         const sortedProjects = projectsRes.data
//           .map(project => ({
//             ...project,
//             formatted_expiry_date: formatExpiryDate(project.expiry_date),
//             formatted_created_at: formatExpiryDate(project.created_at),
//             short_description: getShortDescription(project.description)
//           }))
//           .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

//         setProjects(sortedProjects);
//         setExpiredProjects(expiredRes.data.map(project => project.project_id));

//         const countMap = {};
//         bitsRes.data.forEach(item => {
//           countMap[item.project_id] = item.count;
//         });
//         setNotificationCount(countMap);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         toast.error("Failed to load project data", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     };

//     fetchData();
//   }, [encodedAdminId]);

//   const formatExpiryDate = (expiryDate) => {
//     const date = new Date(expiryDate);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });
//   };

//   const getShortDescription = (description) => {
//     if (!description) return "";
//     const lines = description.split('\n');
//     if (lines[0].length <= 100) return lines[0];
//     return lines[0].substring(0, 100) + '...';
//   };

//   const handleExpiryDateChange = (projectId, value) => {
//     setNewExpiryDates(prev => ({
//       ...prev,
//       [projectId]: value,
//     }));
//   };

//   const handleUpdateExpiry = async (projectId) => {
//     const newExpiryDate = newExpiryDates[projectId];
//     if (!newExpiryDate) {
//       toast.warn("Please select a new expiry date and time", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "https://gig.kggeniuslabs.com/api/api/admin/updateprojectexpiry",
//         {
//           project_id: projectId,
//           new_expiry_date: newExpiryDate,
//         }
//       );
      
//       toast.success(response.data.message, {
//         position: "top-right",
//         autoClose: 3000,
//       });
      
//       const [projectsRes, expiredRes] = await Promise.all([
//         axios.get("https://gig.kggeniuslabs.com/api/api/admin/getallprojects"),
//         axios.get("https://gig.kggeniuslabs.com/api/api/admin/getexpiredprojects"),
//       ]);

//       const updatedProjects = projectsRes.data.map(project => ({
//         ...project,
//         formatted_expiry_date: formatExpiryDate(project.expiry_date),
//         formatted_created_at: formatExpiryDate(project.created_at),
//         short_description: getShortDescription(project.description)
//       }));

//       setProjects(updatedProjects);
//       setExpiredProjects(expiredRes.data.map(project => project.project_id));
//       setNewExpiryDates(prev => ({ ...prev, [projectId]: "" }));
//     } catch (err) {
//       console.error("Error updating expiry date:", err);
//       toast.error(err.response?.data?.message || "Failed to update expiry date", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   const toggleCardExpansion = (projectId) => {
//     setExpandedCards(prev => ({
//       ...prev,
//       [projectId]: !prev[projectId],
//     }));
//   };

//   const openDescriptionModal = (description) => {
//     setModalDescription(description);
//   };

//   const closeDescriptionModal = () => {
//     setModalDescription(null);
//   };

//   const getMinDateTime = () => {
//     const today = new Date();
//     today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
//     return today.toISOString().slice(0, 16);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
//             <p className="text-gray-600">Manage and monitor all projects</p>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {projects.map(project => (
//             <div
//               key={project.project_id}
//               className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
//                 expiredProjects.includes(project.project_id) 
//                   ? "border-l-4 border-red-500" 
//                   : "border-l-4 border-green-500"
//               }`}
//             >
//               <div className="p-5 border-b border-gray-100 flex justify-between items-start">
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
//                     {project.project_name}
//                   </h3>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Created: {project.formatted_created_at}
//                   </p>
//                 </div>
                
//                 <div className="flex items-center gap-2">
//                   <Link
//                     to={`/bitconfirm/${encodedAdminId}/${btoa(project.project_id)}`}
//                     className="relative"
//                   >
//                     <div className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
//                       <FaBell className="text-lg" />
//                       {notificationCount[project.project_id] > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
//                           {notificationCount[project.project_id]}
//                         </span>
//                       )}
//                     </div>
//                   </Link>
                  
//                   <button
//                     onClick={() => toggleCardExpansion(project.project_id)}
//                     className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
//                   >
//                     {expandedCards[project.project_id] ? (
//                       <FaChevronUp className="text-lg" />
//                     ) : (
//                       <FaChevronDown className="text-lg" />
//                     )}
//                   </button>
//                 </div>
//               </div>
              
//               <div className="p-5">
//                 <div className="mb-4">
//                   <div className="flex items-start justify-between gap-2">
//                     <p className="text-gray-600 flex-grow">
//                       {project.short_description}
//                     </p>
//                     <button
//                       onClick={() => openDescriptionModal(project.description)}
//                       className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
//                       aria-label="View full description"
//                     >
//                       <Maximize2 className="h-4 w-4" />
//                     </button>
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-3">
//                     <span className="text-sm font-medium text-gray-700">Skill:</span>
//                     <span className="text-sm text-gray-600">{project.skill_name}</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-sm font-medium text-gray-700">Level:</span>
//                     <span className="text-sm text-gray-600">{project.level_name}</span>
//                   </div>
                  
//                   <div className="flex items-center justify-between mt-2">
//                     <span className="text-sm font-medium text-gray-700">Students:</span>
//                     <span className="text-sm text-gray-600">{project.number_of_students}</span>
//                   </div>
//                 </div>
                
//                 <div className="pt-4 border-t border-gray-100">
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-sm font-medium text-gray-700">Expires:</span>
//                     <div className="flex items-center gap-2">
//                       <span className={`text-sm ${
//                         expiredProjects.includes(project.project_id)
//                           ? "text-red-600 font-medium"
//                           : "text-gray-600"
//                       }`}>
//                         {project.formatted_expiry_date}
//                       </span>
//                       {expiredProjects.includes(project.project_id) && (
//                         <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
//                           Expired
//                         </span>
//                       )}
//                     </div>
//                   </div>
                  
//                   {expandedCards[project.project_id] && (
//                     <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-gray-700">Created By:</span>
//                         <span className="text-sm text-gray-600">{project.created_by_name}</span>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-gray-700">Email:</span>
//                         <span className="text-sm text-gray-600 break-all">{project.email || "N/A"}</span>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-gray-700">Mobile:</span>
//                         <span className="text-sm text-gray-600">{project.mobile_number || "N/A"}</span>
//                       </div>
                      
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-gray-700">Bids:</span>
//                         <span className="text-sm text-gray-600">{project.bit_count}</span>
//                       </div>
//                     </div>
//                   )}
                  
//                   {expiredProjects.includes(project.project_id) && (
//                     <div className="mt-4 pt-4 border-t border-gray-100">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Extend expiry date:
//                       </label>
//                       <div className="flex gap-2">
//                         <input
//                           type="datetime-local"
//                           className="flex-grow text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
//                           value={newExpiryDates[project.project_id] || ""}
//                           onChange={(e) => handleExpiryDateChange(project.project_id, e.target.value)}
//                           min={getMinDateTime()}
//                         />
//                         <button
//                           onClick={() => handleUpdateExpiry(project.project_id)}
//                           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
//                         >
//                           Extend
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         {/* Description Modal */}
//         {modalDescription && (
//           <div
//             className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
//             onClick={closeDescriptionModal}
//           >
//             <div
//               className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
//               onClick={(e) => e.stopPropagation()}
//             >
//               <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
//                 <h3 className="text-xl font-semibold text-gray-800">
//                   Project Description
//                 </h3>
//                 <button
//                   onClick={closeDescriptionModal}
//                   className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
//                   aria-label="Close modal"
//                 >
//                   <X className="h-6 w-6" />
//                 </button>
//               </div>
              
//               <div className="p-6">
//                 <div className="prose max-w-none text-gray-700 whitespace-pre-line">
//                   {modalDescription}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={false}
//           closeOnClick
//           rtl={false}
//           pauseOnFocusLoss
//           draggable
//           pauseOnHover
//         />
//       </div>
//     </div>
//   );
// }

// export default Projects;





import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaBell, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Filter, Maximize2, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import "react-toastify/dist/ReactToastify.css";

function Projects() {
  const { id: encodedAdminId } = useParams();
  const [notificationCount, setNotificationCount] = useState({});
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [expiredProjects, setExpiredProjects] = useState([]);
  const [newExpiryDates, setNewExpiryDates] = useState({});
  const [expandedCards, setExpandedCards] = useState({});
  const [modalDescription, setModalDescription] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedStudents, setSelectedStudents] = useState("");

  useEffect(() => {
    if (!encodedAdminId) {
      toast.error("Admin ID is missing. Please log in again.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const fetchData = async () => {
      try {
        const [projectsRes, expiredRes, bitsRes] = await Promise.all([
          axios.get("https://gig.kggeniuslabs.com/api/api/admin/getallprojects"),
          axios.get("https://gig.kggeniuslabs.com/api/api/admin/getexpiredprojects"),
          axios.get("https://gig.kggeniuslabs.com/api/api/admin/getbit"),
        ]);

        const sortedProjects = projectsRes.data
          .map((project) => ({
            ...project,
            short_description: getShortDescription(project.description),
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setProjects(sortedProjects);
        setFilteredProjects(sortedProjects);
        setExpiredProjects(expiredRes.data.map((project) => project.project_id));

        const countMap = {};
        bitsRes.data.forEach((item) => {
          countMap[item.project_id] = item.count;
        });
        setNotificationCount(countMap);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load project data", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, [encodedAdminId]);

  // Filter Logic
  useEffect(() => {
    let filtered = projects;

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.project_name?.toLowerCase().includes(query) ||
          p.created_by_name?.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          (p.mobile_number ? String(p.mobile_number).toLowerCase().includes(query) : false)
      );
    }

    if (selectedSkill) {
      filtered = filtered.filter((p) => p.skill_name === selectedSkill);
    }

    if (selectedLevel) {
      filtered = filtered.filter((p) => p.level_name === selectedLevel);
    }

    if (selectedStudents) {
      filtered = filtered.filter(
        (p) => p.number_of_students === parseInt(selectedStudents)
      );
    }

    setFilteredProjects(filtered);
  }, [searchQuery, selectedSkill, selectedLevel, selectedStudents, projects]);

  const getShortDescription = (description) => {
    if (!description) return "";
    const lines = description.split("\n");
    if (lines[0].length <= 100) return lines[0];
    return lines[0].substring(0, 100) + "...";
  };

  const handleExpiryDateChange = (projectId, value) => {
    setNewExpiryDates((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  const handleUpdateExpiry = async (projectId) => {
    const newExpiryDate = newExpiryDates[projectId];
    if (!newExpiryDate) {
      toast.warn("Please select a new expiry date and time", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post(
        "https://gig.kggeniuslabs.com/api/api/admin/updateprojectexpiry",
        {
          project_id: projectId,
          new_expiry_date: newExpiryDate,
        }
      );

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      const [projectsRes, expiredRes] = await Promise.all([
        axios.get("https://gig.kggeniuslabs.com/api/api/admin/getallprojects"),
        axios.get("https://gig.kggeniuslabs.com/api/api/admin/getexpiredprojects"),
      ]);

      const updatedProjects = projectsRes.data
        .map((project) => ({
          ...project,
          short_description: getShortDescription(project.description),
        }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      setProjects(updatedProjects);
      setFilteredProjects(updatedProjects);
      setExpiredProjects(expiredRes.data.map((project) => project.project_id));
      setNewExpiryDates((prev) => ({ ...prev, [projectId]: "" }));
    } catch (err) {
      console.error("Error updating expiry date:", err);
      toast.error(err.response?.data?.message || "Failed to update expiry date", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const toggleCardExpansion = (projectId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const openDescriptionModal = (description) => {
    setModalDescription(description);
  };

  const closeDescriptionModal = () => {
    setModalDescription(null);
  };

  const getMinDateTime = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 16);
  };

  // Metrics Calculations
  const totalProjects = projects.length;
  const expiredProjectsCount = expiredProjects.length;
  const activeProjectsCount = totalProjects - expiredProjectsCount;
  const noBidsProjectsCount = projects.filter(
    (p) => !notificationCount[p.project_id] || notificationCount[p.project_id] === 0
  ).length;
  const biddedProjectsCount = totalProjects - noBidsProjectsCount;

  // Filter Options
  const skills = [...new Set(projects.map((p) => p.skill_name).filter(Boolean))];
  const levels = [...new Set(projects.map((p) => p.level_name).filter(Boolean))];
  const studentNumbers = [
    ...new Set(projects.map((p) => p.number_of_students).filter(Boolean)),
  ].sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600 text-sm">Manage and monitor all projects</p>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Total Projects</h3>
            <p className="text-2xl font-bold text-blue-700">{totalProjects}</p>
            <p className="text-xs text-gray-500 mt-1">All projects listed</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Expired Projects</h3>
            <p className="text-2xl font-bold text-red-700">{expiredProjectsCount}</p>
            <p className="text-xs text-gray-500 mt-1">Projects past expiry date</p>
          </div>
          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Active Projects</h3>
            <p className="text-2xl font-bold text-teal-700">{activeProjectsCount}</p>
            <p className="text-xs text-gray-500 mt-1">Projects currently active</p>
          </div>
          {/* <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1">No Bids</h3>
            <p className="text-2xl font-bold text-yellow-700">{noBidsProjectsCount}</p>
            <p className="text-xs text-gray-500 mt-1">Projects with no bids</p>
          </div> */}
          {/* <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="text-base font-semibold text-gray-800 mb-1">Bidded Projects</h3>
            <p className="text-2xl font-bold text-green-700">{biddedProjectsCount}</p>
            <p className="text-xs text-gray-500(mt-1">Projects with bids</p>
          </div> */}
        </div>

        {/* Filter Section */}
      <div className="mb-6">
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium mb-4"
  >
    <Filter size={18} />
    {showFilters ? "Hide Filters" : "Show Filters"}
  </button>
  {showFilters && (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Search by project, creator, email, or mobile"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200 text-sm"
        />
        <Select
          options={skills.map((skill) => ({ value: skill, label: skill }))}
          value={selectedSkill ? { value: selectedSkill, label: selectedSkill } : null}
          onChange={(option) => setSelectedSkill(option ? option.value : "")}
          placeholder="Filter by Skill"
          className="w-full sm:w-1/5 text-sm"
          classNamePrefix="select"
          isClearable
        />
        <Select
          options={levels.map((level) => ({ value: level, label: level }))}
          value={selectedLevel ? { value: selectedLevel, label: selectedLevel } : null}
          onChange={(option) => setSelectedLevel(option ? option.value : "")}
          placeholder="Filter by Level"
          className="w-full sm:w-1/5 text-sm"
          classNamePrefix="select"
          isClearable
        />
        <Select
          options={studentNumbers.map((num) => ({ value: num, label: num }))}
          value={selectedStudents ? { value: selectedStudents, label: selectedStudents } : null}
          onChange={(option) => setSelectedStudents(option ? option.value : "")}
          placeholder="Filter by Students"
          className="w-full sm:w-1/5 text-sm"
          classNamePrefix="select"
          isClearable
        />
      </div>
    </div>
  )}
</div>

              {/* Projects Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.project_id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                      expiredProjects.includes(project.project_id)
                        ? "border-l-4 border-red-500"
                        : "border-l-4 border-green-500"
                    }`}
                  >
                    <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                          {project.project_name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/bitconfirm/${encodedAdminId}/${btoa(project.project_id)}`}
                          className="relative"
                        >
                          <div className="p-2 bg-blue-50 rounded-full text-blue-600 hover:bg-blue-100 transition-colors">
                            <FaBell className="text-lg" />
                            {notificationCount[project.project_id] > 0 && (
                              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                                {notificationCount[project.project_id]}
                              </span>
                            )}
                          </div>
                        </Link>
                        <button
                          onClick={() => toggleCardExpansion(project.project_id)}
                          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                        >
                          {expandedCards[project.project_id] ? (
                            <FaChevronUp className="text-lg" />
                          ) : (
                            <FaChevronDown className="text-lg" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="mb-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-gray-600 flex-grow">
                            {project.short_description}
                          </p>
                          <button
                            onClick={() => openDescriptionModal(project.description)}
                            className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors"
                            aria-label="View full description"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-medium text-gray-700">Skill:</span>
                          <span className="text-sm text-gray-600">{project.skill_name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700">Level:</span>
                          <span className="text-sm text-gray-600">{project.level_name}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm font-medium text-gray-700">Students:</span>
                          <span className="text-sm text-gray-600">{project.number_of_students}</span>
                        </div>
                      </div>
                      {expiredProjects.includes(project.project_id) && (
                        <div className="pt-4 border-t border-gray-100">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Extend expiry date:
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="datetime-local"
                              className="flex-grow text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={newExpiryDates[project.project_id] || ""}
                              onChange={(e) => handleExpiryDateChange(project.project_id, e.target.value)}
                              min={getMinDateTime()}
                            />
                            <button
                              onClick={() => handleUpdateExpiry(project.project_id)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              Extend
                            </button>
                          </div>
                        </div>
                      )}
                      {expandedCards[project.project_id] && (
                        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Created By:</span>
                            <span className="text-sm text-gray-600">{project.created_by_name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Email:</span>
                            <span className="text-sm text-gray-600 break-all">{project.email || "N/A"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Mobile:</span>
                            <span className="text-sm text-gray-600">{project.mobile_number || "N/A"}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700">Bids:</span>
                            <span className="text-sm text-gray-600">{project.bit_count}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Description Modal */}
              {modalDescription && (
                <div
                  className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={closeDescriptionModal}
                >
                  <div
                    className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="sticky top-0 bg-white p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-gray-800">Project Description</h3>
                      <button
                        onClick={closeDescriptionModal}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label="Close modal"
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
                        {modalDescription}
                      </div>
                    </div>
                  </div>
                </div>
              )}

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
          </div>
        );
      }

      export default Projects;