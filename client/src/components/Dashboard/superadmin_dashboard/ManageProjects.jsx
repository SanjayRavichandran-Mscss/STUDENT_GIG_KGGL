// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import Swal from "sweetalert2";
// import { SuperAdminMenu } from "./SuperAdminMenu.jsx";
// import { Pencil, Trash2, X, Save, Loader2, ChevronDown, ChevronUp, Check, Clock, Users, Award } from "lucide-react";

// const layoutContainerClass = "flex flex-col lg:flex-row min-h-screen bg-gray-100";
// const sidebarClass = "w-full lg:w-64 flex-shrink-0 bg-white shadow-lg";
// const contentClass = "flex-1 overflow-auto p-4 sm:p-6 lg:p-8";

// export function ManageProjects() {
//   const { spad_id: encodedSpadId } = useParams();
//   const [spadId, setSpadId] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [editingProject, setEditingProject] = useState(null);
//   const [expandedCards, setExpandedCards] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [skills, setSkills] = useState([]);
//   const [formData, setFormData] = useState({
//     project_name: "",
//     description: "",
//     stack: "",
//     expiry_date: "",
//     level_id: "",
//     number_of_students: "",
//     total_amount: "",
//   });

//   const levelMap = [
//     { id: 1, name: "Beginner" },
//     { id: 2, name: "Intermediate" },
//     { id: 3, name: "Advanced" },
//   ];

//   // Decode base64-encoded spad_id
//   useEffect(() => {
//     try {
//       const decodedId = atob(encodedSpadId);
//       setSpadId(decodedId);
//     } catch (error) {
//       console.error("Spad ID decode error:", error);
//       showErrorToast("Invalid ID", "Unable to decode SuperAdmin ID");
//     }
//   }, [encodedSpadId]);

//   // Fetch all skills
//   useEffect(() => {
//     const fetchSkills = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/superadmin/getallskills", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           throw new TypeError("Oops, we didn't get JSON!");
//         }
        
//         const data = await response.json();
//         if (data.status) {
//           setSkills(data.result);
//         } else {
//           showErrorToast("Error", data.msg || "Failed to fetch skills");
//         }
//       } catch (error) {
//         console.error("Fetch skills error:", error);
//         showErrorToast("Error", "Server error while fetching skills");
//       }
//     };
//     fetchSkills();
//   }, []);

//   // Fetch all projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("http://localhost:5000/api/superadmin/getallprojects", {
//           headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           throw new TypeError("Oops, we didn't get JSON!");
//         }
        
//         const data = await response.json();
//         if (data.status) {
//           setProjects(
//             data.result.map((project) => ({
//               ...project,
//               formatted_created_at: formatDate(project.created_at),
//               formatted_expiry_date: formatDate(project.expiry_date),
//               short_description: getShortDescription(project.description),
//               is_expired: new Date(project.expiry_date) < new Date(),
//               level_name: levelMap.find((level) => level.id === project.level_id)?.name || project.level_id,
//             }))
//           );
//         } else {
//           showErrorToast("Error", data.msg || "Failed to fetch projects");
//         }
//       } catch (error) {
//         console.error("Fetch error:", error);
//         showErrorToast("Error", "Server error while fetching projects");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProjects();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const getShortDescription = (description) => {
//     if (!description) return "";
//     const lines = description.split("\n");
//     if (lines[0].length <= 100) return lines[0];
//     return lines[0].substring(0, 100) + "...";
//   };

//   const showErrorToast = (title, text) => {
//     Swal.fire({
//       icon: "error",
//       title,
//       text,
//       toast: true,
//       position: "top-end",
//       timer: 3000,
//       showConfirmButton: false,
//     });
//   };

//   const showSuccessToast = (title, text) => {
//     Swal.fire({
//       icon: "success",
//       title,
//       text,
//       toast: true,
//       position: "top-end",
//       timer: 1500,
//       showConfirmButton: false,
//     });
//   };

//   const toggleCardExpansion = (projectId) => {
//     setExpandedCards((prev) => ({
//       ...prev,
//       [projectId]: !prev[projectId],
//     }));
//   };

//   const startEditing = (project) => {
//     setEditingProject(project.project_id);
//     setFormData({
//       project_name: project.project_name || "",
//       description: project.description || "",
//       stack: project.stack || "",
//       expiry_date: project.expiry_date ? new Date(project.expiry_date).toISOString().slice(0, 16) : "",
//       level_id: project.level_id || "",
//       number_of_students: project.number_of_students || "",
//       total_amount: project.total_amount || "",
//     });
//   };

//   const cancelEditing = () => {
//     setEditingProject(null);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleUpdate = async (projectId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/superadmin/updateproject/${projectId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
//         body: JSON.stringify(formData),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const contentType = response.headers.get("content-type");
//       if (!contentType || !contentType.includes("application/json")) {
//         throw new TypeError("Oops, we didn't get JSON!");
//       }
      
//       const data = await response.json();
//       if (data.status) {
//         setProjects((prev) =>
//           prev.map((project) =>
//             project.project_id === projectId
//               ? {
//                   ...project,
//                   ...formData,
//                   formatted_expiry_date: formatDate(formData.expiry_date),
//                   short_description: getShortDescription(formData.description),
//                   is_expired: new Date(formData.expiry_date) < new Date(),
//                   level_name: levelMap.find((level) => level.id === parseInt(formData.level_id))?.name || formData.level_id,
//                   skill_name: skills.find((skill) => skill.skill_id === parseInt(formData.stack))?.skill_name || formData.stack,
//                 }
//               : project
//           )
//         );
//         setEditingProject(null);
//         showSuccessToast("Success", "Project updated successfully");
//       } else {
//         showErrorToast("Error", data.msg || "Failed to update project");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       showErrorToast("Error", "Server error while updating project");
//     }
//   };

//   const handleDelete = async (projectId) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "This project will be permanently deleted.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#2563eb",
//       cancelButtonColor: "#ef4444",
//       confirmButtonText: "Yes, delete it",
//       customClass: {
//         popup: "rounded-xl shadow-2xl",
//       },
//     });

//     if (result.isConfirmed) {
//       try {
//         const response = await fetch(`http://localhost:5000/api/superadmin/deleteproject/${projectId}`, {
//           method: "DELETE",
//           headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
//         });
        
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
        
//         const contentType = response.headers.get("content-type");
//         if (!contentType || !contentType.includes("application/json")) {
//           throw new TypeError("Oops, we didn't get JSON!");
//         }
        
//         const data = await response.json();
//         if (data.status) {
//           setProjects((prev) => prev.filter((project) => project.project_id !== projectId));
//           showSuccessToast("Deleted", "Project deleted successfully");
//         } else {
//           showErrorToast("Error", data.msg || "Failed to delete project");
//         }
//       } catch (error) {
//         console.error("Delete error:", error);
//         showErrorToast("Error", "Server error while deleting project");
//       }
//     }
//   };

//   const getMinDateTime = () => {
//     const today = new Date();
//     today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
//     return today.toISOString().slice(0, 16);
//   };

//   return (
//     <div className={layoutContainerClass}>
//       <div className={sidebarClass}>
//         <SuperAdminMenu />
//       </div>
//       <div className={contentClass}>
//         <div className="max-w-7xl mx-auto">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-800">Manage Projects</h1>
//               <p className="text-gray-600">View, edit, and manage all projects</p>
//             </div>
//             {spadId && (
//               <div className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
//                 {/* SuperAdmin ID: {spadId} */}
//               </div>
//             )}
//           </div>

//           {loading ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
//             </div>
//           ) : projects.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl shadow-sm">
//               <p className="text-gray-500 text-lg">No projects found.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {projects.map((project) => (
//                 <div
//                   key={project.project_id}
//                   className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
//                     project.is_expired ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
//                   }`}
//                 >
//                   <div className="p-5 border-b border-gray-100 flex justify-between items-start">
//                     <div>
//                       {editingProject === project.project_id ? (
//                         <input
//                           type="text"
//                           name="project_name"
//                           value={formData.project_name}
//                           onChange={handleInputChange}
//                           className="w-full text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                         />
//                       ) : (
//                         <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
//                           {project.project_name}
//                           {project.is_expired && (
//                             <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
//                               Expired
//                             </span>
//                           )}
//                         </h3>
//                       )}
//                       <p className="text-sm text-gray-500 mt-1">Created: {project.formatted_created_at}</p>
//                     </div>
//                     <div className="flex items-center gap-2">
//                       <button
//                         onClick={() => toggleCardExpansion(project.project_id)}
//                         className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
//                       >
//                         {expandedCards[project.project_id] ? (
//                           <ChevronUp className="w-5 h-5" />
//                         ) : (
//                           <ChevronDown className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                   <div className="p-5">
//                     <div className="mb-4">
//                       <div className="flex items-start justify-between gap-2">
//                         {editingProject === project.project_id ? (
//                           <textarea
//                             name="description"
//                             value={formData.description}
//                             onChange={handleInputChange}
//                             className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-sm"
//                             rows="3"
//                             placeholder="Project description"
//                           />
//                         ) : (
//                           <p className="text-gray-600 flex-grow">{project.short_description}</p>
//                         )}
//                       </div>
//                       <div className="grid grid-cols-2 gap-3 mt-4">
//                         <div className="flex items-center">
//                           <Award className="h-4 w-4 text-gray-500 mr-2" />
//                           <div>
//                             <span className="text-xs font-medium text-gray-500">Level:</span>
//                             {editingProject === project.project_id ? (
//                               <select
//                                 name="level_id"
//                                 value={formData.level_id}
//                                 onChange={handleInputChange}
//                                 className="w-full p-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                               >
//                                 {levelMap.map((level) => (
//                                   <option key={level.id} value={level.id}>
//                                     {level.name}
//                                   </option>
//                                 ))}
//                               </select>
//                             ) : (
//                               <span className="text-sm text-gray-600 ml-1">{project.level_name}</span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <Users className="h-4 w-4 text-gray-500 mr-2" />
//                           <div>
//                             <span className="text-xs font-medium text-gray-500">Students:</span>
//                             {editingProject === project.project_id ? (
//                               <input
//                                 type="number"
//                                 name="number_of_students"
//                                 value={formData.number_of_students}
//                                 onChange={handleInputChange}
//                                 className="w-full p-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                               />
//                             ) : (
//                               <span className="text-sm text-gray-600 ml-1">{project.number_of_students}</span>
//                             )}
//                           </div>
//                         </div>
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 text-gray-500 mr-2" />
//                           <div>
//                             <span className="text-xs font-medium text-gray-500">Expires:</span>
//                             {editingProject === project.project_id ? (
//                               <input
//                                 type="datetime-local"
//                                 name="expiry_date"
//                                 value={formData.expiry_date}
//                                 onChange={handleInputChange}
//                                 min={getMinDateTime()}
//                                 className="w-full p-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                               />
//                             ) : (
//                               <span className={`text-sm ml-1 ${project.is_expired ? "text-red-600" : "text-gray-600"}`}>
//                                 {project.formatted_expiry_date}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     {expandedCards[project.project_id] && (
//                       <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs font-medium text-gray-700">Created By:</span>
//                           <span className="text-xs text-gray-600">{project.created_by_name}</span>
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs font-medium text-gray-700">Skill:</span>
//                           {editingProject === project.project_id ? (
//                             <select
//                               name="stack"
//                               value={formData.stack}
//                               onChange={handleInputChange}
//                               className="w-full p-1 text-xs border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                             >
//                               {skills.map((skill) => (
//                                 <option key={skill.skill_id} value={skill.skill_id}>
//                                   {skill.skill_name}
//                                 </option>
//                               ))}
//                             </select>
//                           ) : (
//                             <span className="text-xs text-gray-600">{project.skill_name}</span>
//                           )}
//                         </div>
//                         <div className="flex items-center justify-between">
//                           <span className="text-xs font-medium text-gray-700">Total Amount:</span>
//                           {editingProject === project.project_id ? (
//                             <input
//                               type="number"
//                               name="total_amount"
//                               value={formData.total_amount}
//                               onChange={handleInputChange}
//                               className="w-full p-1 text-xs border-b border-gray-300 focus:outline-none focus:border-blue-500"
//                             />
//                           ) : (
//                             <span className="text-xs text-gray-600">₹{project.total_amount}</span>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                     <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
//                       {editingProject === project.project_id ? (
//                         <>
//                           <button
//                             onClick={cancelEditing}
//                             className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
//                             title="Cancel"
//                           >
//                             <X className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleUpdate(project.project_id)}
//                             className="p-2 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors"
//                             title="Save"
//                           >
//                             <Check className="w-5 h-5" />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => startEditing(project)}
//                             className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
//                             title="Edit"
//                           >
//                             <Pencil className="w-5 h-5" />
//                           </button>
//                           <button
//                             onClick={() => handleDelete(project.project_id)}
//                             className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 className="w-5 h-5" />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ManageProjects;















import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { SuperAdminMenu } from "./SuperAdminMenu.jsx";
import { Pencil, Trash2, X, Save, Loader2, ChevronDown, ChevronUp, Check, Clock, Users, Award } from "lucide-react";

const layoutContainerClass = "flex flex-col lg:flex-row min-h-screen bg-gray-100";
const sidebarClass = "w-full lg:w-64 flex-shrink-0 bg-white shadow-lg";
const contentClass = "flex-1 overflow-auto p-4 sm:p-6 lg:p-8";

export function ManageProjects() {
  const { spad_id: encodedSpadId } = useParams();
  const [spadId, setSpadId] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);
  const [expandedCards, setExpandedCards] = useState({});
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    stack: "",
    expiry_date: "",
    level_id: "",
    number_of_students: "",
    total_amount: "",
    client_name: "", // Added client_name
  });

  const levelMap = [
    { id: 1, name: "Beginner" },
    { id: 2, name: "Intermediate" },
    { id: 3, name: "Advanced" },
  ];

  // Decode base64-encoded spad_id
  useEffect(() => {
    try {
      const decodedId = atob(encodedSpadId);
      setSpadId(decodedId);
    } catch (error) {
      console.error("Spad ID decode error:", error);
      showErrorToast("Invalid ID", "Unable to decode SuperAdmin ID");
    }
  }, [encodedSpadId]);

  // Fetch all skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/superadmin/getallskills", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we didn't get JSON!");
        }
        
        const data = await response.json();
        if (data.status) {
          setSkills(data.result);
        } else {
          showErrorToast("Error", data.msg || "Failed to fetch skills");
        }
      } catch (error) {
        console.error("Fetch skills error:", error);
        showErrorToast("Error", "Server error while fetching skills");
      }
    };
    fetchSkills();
  }, []);

  // Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/superadmin/getallprojects", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we didn't get JSON!");
        }
        
        const data = await response.json();
        if (data.status) {
          setProjects(
            data.result.map((project) => ({
              ...project,
              formatted_created_at: formatDate(project.created_at),
              formatted_expiry_date: formatDate(project.expiry_date),
              short_description: getShortDescription(project.description),
              is_expired: new Date(project.expiry_date) < new Date(),
              level_name: levelMap.find((level) => level.id === project.level_id)?.name || project.level_id,
            }))
          );
        } else {
          showErrorToast("Error", data.msg || "Failed to fetch projects");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        showErrorToast("Error", "Server error while fetching projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getShortDescription = (description) => {
    if (!description) return "";
    const lines = description.split("\n");
    if (lines[0].length <= 100) return lines[0];
    return lines[0].substring(0, 100) + "...";
  };

  const showErrorToast = (title, text) => {
    Swal.fire({
      icon: "error",
      title,
      text,
      toast: true,
      position: "top-end",
      timer: 3000,
      showConfirmButton: false,
    });
  };

  const showSuccessToast = (title, text) => {
    Swal.fire({
      icon: "success",
      title,
      text,
      toast: true,
      position: "top-end",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const toggleCardExpansion = (projectId) => {
    setExpandedCards((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const startEditing = (project) => {
    setEditingProject(project.project_id);
    setFormData({
      project_name: project.project_name || "",
      description: project.description || "",
      stack: project.stack || "",
      expiry_date: project.expiry_date ? new Date(project.expiry_date).toISOString().slice(0, 16) : "",
      level_id: project.level_id || "",
      number_of_students: project.number_of_students || "",
      total_amount: project.total_amount || "",
      client_name: project.client_name || "", // Added client_name
    });
  };

  const cancelEditing = () => {
    setEditingProject(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async (projectId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/superadmin/updateproject/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we didn't get JSON!");
      }
      
      const data = await response.json();
      if (data.status) {
        setProjects((prev) =>
          prev.map((project) =>
            project.project_id === projectId
              ? {
                  ...project,
                  ...formData,
                  formatted_expiry_date: formatDate(formData.expiry_date),
                  short_description: getShortDescription(formData.description),
                  is_expired: new Date(formData.expiry_date) < new Date(),
                  level_name: levelMap.find((level) => level.id === parseInt(formData.level_id))?.name || formData.level_id,
                  skill_name: skills.find((skill) => skill.skill_id === parseInt(formData.stack))?.skill_name || formData.stack,
                }
              : project
          )
        );
        setEditingProject(null);
        showSuccessToast("Success", "Project updated successfully");
      } else {
        showErrorToast("Error", data.msg || "Failed to update project");
      }
    } catch (error) {
      console.error("Update error:", error);
      showErrorToast("Error", "Server error while updating project");
    }
  };

  const handleDelete = async (projectId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it",
      customClass: {
        popup: "rounded-xl shadow-2xl",
      },
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:5000/api/superadmin/deleteproject/${projectId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new TypeError("Oops, we didn't get JSON!");
        }
        
        const data = await response.json();
        if (data.status) {
          setProjects((prev) => prev.filter((project) => project.project_id !== projectId));
          showSuccessToast("Deleted", "Project deleted successfully");
        } else {
          showErrorToast("Error", data.msg || "Failed to delete project");
        }
      } catch (error) {
        console.error("Delete error:", error);
        showErrorToast("Error", "Server error while deleting project");
      }
    }
  };

  const getMinDateTime = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 16);
  };

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <SuperAdminMenu />
      </div>
      <div className={contentClass}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Manage Projects</h1>
              <p className="text-gray-600">View, edit, and manage all projects</p>
            </div>
            {spadId && (
              <div className="text-sm text-gray-600 bg-gray-200 px-3 py-1 rounded-full">
                {/* SuperAdmin ID: {spadId} */}
              </div>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <p className="text-gray-500 text-lg">No projects found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.project_id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                    project.is_expired ? "border-l-4 border-red-500" : "border-l-4 border-green-500"
                  }`}
                >
                  <div className="p-5 border-b border-gray-100 flex justify-between items-start">
                    <div>
                      {editingProject === project.project_id ? (
                        <input
                          type="text"
                          name="project_name"
                          value={formData.project_name}
                          onChange={handleInputChange}
                          className="w-full text-lg font-semibold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500"
                        />
                      ) : (
                        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                          {project.project_name}
                          {project.is_expired && (
                            <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                              Expired
                            </span>
                          )}
                        </h3>
                      )}
                      <p className="text-sm text-gray-500 mt-1">Created: {project.formatted_created_at}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleCardExpansion(project.project_id)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-full transition-colors"
                      >
                        {expandedCards[project.project_id] ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-2">
                        {editingProject === project.project_id ? (
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-150 text-sm"
                            rows="3"
                            placeholder="Project description"
                          />
                        ) : (
                          <p className="text-gray-600 flex-grow">{project.short_description}</p>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <span className="text-xs font-medium text-gray-500">Level:</span>
                            {editingProject === project.project_id ? (
                              <select
                                name="level_id"
                                value={formData.level_id}
                                onChange={handleInputChange}
                                className="w-full p-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
                              >
                                {levelMap.map((level) => (
                                  <option key={level.id} value={level.id}>
                                    {level.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              <span className="text-sm text-gray-600 ml-1">{project.level_name}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <span className="text-xs font-medium text-gray-500">Students:</span>
                            {editingProject === project.project_id ? (
                              <input
                                type="number"
                                name="number_of_students"
                                value={formData.number_of_students}
                                onChange={handleInputChange}
                                className="w-full p-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              <span className="text-sm text-gray-600 ml-1">{project.number_of_students}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-500 mr-2" />
                          <div>
                            <span className="text-xs font-medium text-gray-500">Expires:</span>
                            {editingProject === project.project_id ? (
                              <input
                                type="datetime-local"
                                name="expiry_date"
                                value={formData.expiry_date}
                                onChange={handleInputChange}
                                min={getMinDateTime()}
                                className="w-full p-1 text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
                              />
                            ) : (
                              <span className={`text-sm ml-1 ${project.is_expired ? "text-red-600" : "text-gray-600"}`}>
                                {project.formatted_expiry_date}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {expandedCards[project.project_id] && (
                      <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">Client Name:</span>
                          {editingProject === project.project_id ? (
                            <input
                              type="text"
                              name="client_name"
                              value={formData.client_name}
                              onChange={handleInputChange}
                              className="w-full p-1 text-xs border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">{project.client_name || "N/A"}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">Created By:</span>
                          <span className="text-xs text-gray-600">{project.created_by_name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">Skill:</span>
                          {editingProject === project.project_id ? (
                            <select
                              name="stack"
                              value={formData.stack}
                              onChange={handleInputChange}
                              className="w-full p-1 text-xs border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            >
                              {skills.map((skill) => (
                                <option key={skill.skill_id} value={skill.skill_id}>
                                  {skill.skill_name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <span className="text-xs text-gray-600">{project.skill_name}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700">Total Amount:</span>
                          {editingProject === project.project_id ? (
                            <input
                              type="number"
                              name="total_amount"
                              value={formData.total_amount}
                              onChange={handleInputChange}
                              className="w-full p-1 text-xs border-b border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">₹{project.total_amount}</span>
                          )}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-2">
                      {editingProject === project.project_id ? (
                        <>
                          <button
                            onClick={cancelEditing}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                            title="Cancel"
                          >
                            <X className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleUpdate(project.project_id)}
                            className="p-2 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-full transition-colors"
                            title="Save"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(project)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-full transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.project_id)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageProjects;