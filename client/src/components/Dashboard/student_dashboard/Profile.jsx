// import { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useParams } from "react-router-dom";
// import gifimg from "../../Assets/Animation - 1715065850571.gif";
// import dragim from "../../Assets/Group 1.png";
// import backgroundimg from "../../Assets/upper.png";

// export default function Profile() {
//   const { id } = useParams();
//   const decoded = atob(id);

//   // State management
//   const [profile, setProfile] = useState({
//     image: "",
//     name: "",
//     github: "",
//     skills: [],
//     skillNames: []
//   });
//   const [formData, setFormData] = useState({
//     selectedSkill: "",
//     skillUrl: "",
//     description: "",
//     selectedFile: null,
//     fileName: ""
//   });
//   const [errors, setErrors] = useState({
//     description: "",
//     github: "",
//     skill: "",
//     url: "",
//     general: ""
//   });
//   const [skills, setSkills] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   // API calls
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [profileRes, skillsRes, studentSkillsRes] = await Promise.all([
//           axios.get(`http://localhost:5000/stu/getdata/${decoded}`),
//           axios.get("http://localhost:5000/college/skill"),
//           axios.get(`http://localhost:5000/stu/getSkill/${decoded}`)
//         ]);

//         const imageRes = await axios.get(`http://localhost:5000/stu/getall/${decoded}`);

//         setProfile({
//           image: imageRes.data.result[0]?.profile_photo || "",
//           name: profileRes.data.msg[0]?.name || "",
//           github: profileRes.data.msg[0]?.github_link || "",
//           skillNames: studentSkillsRes.data.map(e => e.skill_name) || []
//         });

//         setSkills(skillsRes.data.msg || []);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setErrors(prev => ({ ...prev, general: "Failed to load profile data" }));
//       }
//     };

//     fetchData();
//   }, [decoded]);

//   // Event handlers
//   const handleDrop = (event) => {
//     event.preventDefault();
//     const file = event.dataTransfer.files[0];
//     if (file?.type === "application/pdf") {
//       setFormData(prev => ({
//         ...prev,
//         selectedFile: file,
//         fileName: file.name
//       }));
//     }
//   };

//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     if (file?.type === "application/pdf") {
//       setFormData(prev => ({
//         ...prev,
//         selectedFile: file,
//         fileName: file.name
//       }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));

//     // Validation
//     if (name === "description") {
//       const words = value.split(/\s+/);
//       setErrors(prev => ({
//         ...prev,
//         description: words.length > 100 ? "Description cannot exceed 100 words" : ""
//       }));
//     }

//     if (name === "github") {
//       const isValid = validateGithubUrl(value);
//       setErrors(prev => ({
//         ...prev,
//         github: isValid ? "" : "Please enter a valid GitHub URL"
//       }));
//     }
//   };

//   const validateGithubUrl = (url) => {
//     const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9._%+-]+(\/[A-Za-z0-9._%+-]+)*\/?$/;
//     return githubRegex.test(url);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);

//     // Validate form
//     const newErrors = {
//       description: formData.description.split(/\s+/).length > 100 
//         ? "Description cannot exceed 100 words" : "",
//       github: !validateGithubUrl(formData.github) 
//         ? "Please enter a valid GitHub URL" : "",
//       skill: !formData.selectedSkill ? "Skill is required" : "",
//       url: !formData.skillUrl ? "URL is required" : ""
//     };

//     setErrors(newErrors);

//     if (Object.values(newErrors).some(error => error)) {
//       setIsLoading(false);
//       return;
//     }

//     // Prepare form data
//     const submissionData = new FormData();
//     submissionData.append("file2", formData.selectedFile);
//     submissionData.append("name", profile.name);
//     submissionData.append("git", formData.github);
//     submissionData.append("id", decoded);
//     submissionData.append("skill", formData.selectedSkill);
//     submissionData.append("url", formData.skillUrl);
//     submissionData.append("des", formData.description);

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/stu/upload",
//         submissionData
//       );
      
//       if (res.data === "Profile updated successfully") {
//         alert("Files uploaded successfully!");
//         // Refresh skill names after successful submission
//         const skillRes = await axios.get(`http://localhost:5000/stu/getSkill/${decoded}`);
//         setProfile(prev => ({
//           ...prev,
//           skillNames: skillRes.data.map(e => e.skill_name)
//         }));
//       } else if (res.data === "Skill_already_exists_for_this_student") {
//         alert("Skill already exists");
//       }
//     } catch (error) {
//       console.error("Error uploading files:", error);
//       setErrors(prev => ({
//         ...prev,
//         general: "An error occurred during the upload. Please try again."
//       }));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
//         <h1 className="text-3xl font-bold">KGGL Gig</h1>
//       </div>

//       {/* Profile Section */}
//       <div className="max-w-6xl mx-auto p-6">
//         <div className="flex items-center mb-6">
//           <img
//             src={profile.image ? `http://localhost:5000/images/${profile.image}` : backgroundimg}
//             className="w-24 h-24 rounded-full border-4 border-white shadow-lg mr-4"
//             alt="Profile"
//           />
//           <div>
//             <h2 className="text-2xl font-semibold text-gray-800 capitalize">{profile.name}</h2>
//             <Link
//               to={`/update/${id}`}
//               className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
//             >
//               Edit Profile
//             </Link>
//           </div>
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Left Column */}
//           <div className="space-y-6">
//             {/* Skills Section */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {profile.skillNames.length > 0 ? (
//                   profile.skillNames.map((skill, index) => (
//                     <span
//                       key={index}
//                       className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
//                     >
//                       {skill}
//                     </span>
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No skills added yet.</p>
//                 )}
//               </div>
//             </div>

//             {/* Add New Skill Section */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Skill</h3>
//               <div className="space-y-4">
//                 <div>
//                   <label htmlFor="skillSelect" className="block text-sm font-medium text-gray-700 mb-1">
//                     Select your Skill <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     id="skillSelect"
//                     name="selectedSkill"
//                     value={formData.selectedSkill}
//                     onChange={handleInputChange}
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   >
//                     <option value="">Select your Skill</option>
//                     {skills.map((skill) => (
//                       <option key={skill.skill_id} value={skill.skill_id}>
//                         {skill.skill_name}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.skill && (
//                     <p className="mt-1 text-sm text-red-600">{errors.skill}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="skillUrl" className="block text-sm font-medium text-gray-700 mb-1">
//                     Project GitHub URL (or Netlify link) <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     id="skillUrl"
//                     type="text"
//                     name="skillUrl"
//                     value={formData.skillUrl}
//                     onChange={handleInputChange}
//                     placeholder="Paste project URL"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.url && (
//                     <p className="mt-1 text-sm text-red-600">{errors.url}</p>
//                   )}
//                 </div>

//                 <div>
//                   <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                     Project Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     id="description"
//                     name="description"
//                     rows="4"
//                     value={formData.description}
//                     onChange={handleInputChange}
//                     placeholder="Project Description (max 100 words)"
//                     className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   />
//                   {errors.description && (
//                     <p className="mt-1 text-sm text-red-600">{errors.description}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             {/* GitHub Link Section */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">GitHub Link</h3>
//               <div>
//                 <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
//                   Paste GitHub URL <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="github"
//                   type="url"
//                   name="github"
//                   value={formData.github}
//                   onChange={handleInputChange}
//                   placeholder="https://github.com/username"
//                   className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 />
//                 {errors.github && (
//                   <p className="mt-1 text-sm text-red-600">{errors.github}</p>
//                 )}
//               </div>
//             </div>

//             {/* Resume Section */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume</h3>
//               <div
//                 className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center"
//                 onDrop={handleDrop}
//                 onDragOver={(e) => e.preventDefault()}
//               >
//                 <div className="flex flex-col items-center">
//                   <img src={dragim} alt="Drop files here" className="mb-3 w-16" />
//                   <p className="text-gray-600 mb-2">Drag and Drop PDF to Upload</p>
//                   <p className="text-gray-500 mb-3">OR</p>
//                   <input
//                     id="resume-upload"
//                     type="file"
//                     accept=".pdf"
//                     onChange={handleFileChange}
//                     className="hidden"
//                   />
//                   <label
//                     htmlFor="resume-upload"
//                     className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 cursor-pointer transition-colors"
//                   >
//                     Browse Files
//                   </label>
//                   {formData.fileName && (
//                     <p className="mt-3 text-sm text-green-600">{formData.fileName}</p>
//                   )}
//                 </div>
//                 <div className="mt-4">
//                   <img src={gifimg} className="w-32 mx-auto" alt="Upload animation" />
//                 </div>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="text-right">
//               <button
//                 onClick={handleSubmit}
//                 disabled={isLoading}
//                 className={`inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ${
//                   isLoading ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {isLoading ? (
//                   <>
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
//                       xmlns="http://www.worg/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       />
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       />
//                     </svg>
//                     Submitting...
//                   </>
//                 ) : (
//                   "Submit"
//                 )}
//               </button>
//               {errors.general && (
//                 <p className="mt-2 text-sm text-red-600">{errors.general}</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


















































import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import gifimg from "../../Assets/Animation - 1715065850571.gif";
import dragim from "../../Assets/Group 1.png";
import backgroundimg from "../../Assets/upper.png";

export default function Profile() {
  const { id } = useParams();
  const decoded = atob(id);

  // State management
  const [profile, setProfile] = useState({
    image: "",
    name: "",
    github: "",
    skills: [],
    skillNames: [],
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillDetails, setSkillDetails] = useState({});
  const [fileData, setFileData] = useState({
    selectedFile: null,
    fileName: "",
    github: "",
    linkedIn: "",
  });

  const [errors, setErrors] = useState({
    github: "",
    linkedIn: "",
    general: "",
    skills: {},
  });
  const [availableSkills, setAvailableSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedSkills, setExpandedSkills] = useState({});

  // API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, studentSkillsRes] = await Promise.all([
          axios.get(`http://localhost:5000/stu/getdata/${decoded}`),
          axios.get("http://localhost:5000/college/skill"),
          axios.get(`http://localhost:5000/stu/getSkill/${decoded}`),
        ]);

        const imageRes = await axios.get(`http://localhost:5000/stu/getall/${decoded}`);

        setProfile({
          image: imageRes.data.result[0]?.profile_photo || "",
          name: profileRes.data.msg[0]?.name || "",
          github: profileRes.data.msg[0]?.github_link || "",
          skillNames: studentSkillsRes.data.map((e) => e.skill_name) || [],
        });

        setFileData((prev) => ({
          ...prev,
          github: profileRes.data.msg[0]?.github_link || "",
          linkedIn: profileRes.data.msg[0]?.linkedin_link || "",
        }));

        setAvailableSkills([
          ...(skillsRes.data.msg || []),
          { skill_id: decoded, skill_name: "Custom Skill" },
        ]);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors((prev) => ({ ...prev, general: "Failed to load profile data" }));
      }
    };

    fetchData();
  }, [decoded]);

  // File handling
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setFileData((prev) => ({
        ...prev,
        selectedFile: file,
        fileName: file.name,
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    if (file?.size > maxSize) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      event.target.value = "";
      return;
    }

    if (file?.type === "application/pdf") {
      setFileData((prev) => ({
        ...prev,
        selectedFile: file,
        fileName: file.name,
      }));
    }
  };

  // URL validation
  const validateGithubUrl = (url) => {
    if (!url) return true;
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9._%+-]+(\/[A-Za-z0-9._%+-]+)*\/?$/;
    return githubRegex.test(url);
  };

  const validateLinkedInUrl = (url) => {
    if (!url) return true;
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9._%+-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFileData((prev) => ({ ...prev, [name]: value }));

    if (name === "github") {
      setErrors((prev) => ({
        ...prev,
        github: validateGithubUrl(value) ? "" : "Please enter a valid GitHub URL",
      }));
    } else if (name === "linkedIn") {
      setErrors((prev) => ({
        ...prev,
        linkedIn: validateLinkedInUrl(value) ? "" : "Please enter a valid LinkedIn URL",
      }));
    }
  };

  // Skill selection
  const handleSkillChange = (selectedOptions) => {
    const newSelectedSkills = selectedOptions.map((option) => option.value);
    setSelectedSkills(newSelectedSkills);

    // Initialize skill details and errors for new skills
    const newSkillDetails = { ...skillDetails };
    const newSkillErrors = { ...errors.skills };
    
    newSelectedSkills.forEach((skillId) => {
      if (!newSkillDetails[skillId]) {
        const skill = availableSkills.find((s) => s.skill_id === skillId);
        newSkillDetails[skillId] = {
          skillName: skillId === decoded ? "" : skill?.skill_name || "",
          skillUrl: "",
          description: "",
        };
      }
      if (!newSkillErrors[skillId]) {
        newSkillErrors[skillId] = { url: "", description: "", skillName: "" };
      }
    });

    // Remove details for deselected skills
    Object.keys(newSkillDetails).forEach((skillId) => {
      if (!newSelectedSkills.includes(skillId)) {
        delete newSkillDetails[skillId];
        delete newSkillErrors[skillId];
      }
    });

    setSkillDetails(newSkillDetails);
    setErrors((prev) => ({ ...prev, skills: newSkillErrors }));
  };

  // Skill details change
  const handleSkillDetailChange = (skillId, e) => {
    const { name, value } = e.target;
    setSkillDetails((prev) => ({
      ...prev,
      [skillId]: {
        ...prev[skillId],
        [name]: value,
      },
    }));

    // Validation
    const newErrors = { ...errors.skills };
    if (!newErrors[skillId]) newErrors[skillId] = { url: "", description: "", skillName: "" };

    if (name === "description") {
      const words = value.split(/\s+/).filter((word) => word.length > 0);
      newErrors[skillId].description =
        words.length > 100 ? "Description cannot exceed 100 words" : "";
    }

    if (name === "skillUrl") {
      const isValid = validateGithubUrl(value);
      newErrors[skillId].url = isValid ? "" : "Please enter a valid GitHub URL";
    }

    if (name === "skillName" && skillId === decoded) {
      newErrors[skillId].skillName =
        value.trim() === "" 
          ? "Skill name is required" 
          : value.length > 50 
            ? "Skill name cannot exceed 50 characters" 
            : "";
    }

    setErrors((prev) => ({ ...prev, skills: newErrors }));
  };

  // Toggle skill accordion
  const toggleSkillAccordion = (skillId) => {
    setExpandedSkills((prev) => ({
      ...prev,
      [skillId]: !prev[skillId],
    }));
  };

  // Get skill name
  const getSkillNameById = (skillId) => {
    if (skillId === decoded) return skillDetails[skillId]?.skillName || "Custom Skill";
    const skill = availableSkills.find((s) => s.skill_id === skillId);
    return skill?.skill_name || "";
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors = {
      github: validateGithubUrl(fileData.github) ? "" : "Please enter a valid GitHub URL",
      linkedIn: validateLinkedInUrl(fileData.linkedIn) ? "" : "Please enter a valid LinkedIn URL",
      general: "",
      skills: {},
    };

    let hasErrors = false;

    // Validate skills
    if (selectedSkills.length === 0) {
      newErrors.general = "Please select at least one skill";
      hasErrors = true;
    } else {
      selectedSkills.forEach((skillId) => {
        const details = skillDetails[skillId] || {};
        const skillErrors = {
          url: details.skillUrl ? "" : "Project link is required",
          description: details.description ? "" : "Description is required",
          skillName: "",
        };

        if (skillId === decoded && !details.skillName?.trim()) {
          skillErrors.skillName = "Skill name is required";
        }

        newErrors.skills[skillId] = skillErrors;

        if (Object.values(skillErrors).some(err => err)) {
          hasErrors = true;
        }
      });
    }

    setErrors(newErrors);

    if (hasErrors) {
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      
      // Append file if exists
      if (fileData.selectedFile) {
        formData.append("file", fileData.selectedFile);
      }

      // Append other fields
      formData.append("id", decoded);
      formData.append("git", fileData.github || "");
      formData.append("linkedin", fileData.linkedIn || "");

      // Prepare skills data
      const skillsData = selectedSkills.map(skillId => {
        const details = skillDetails[skillId];
        return {
          skillId: skillId === decoded ? null : skillId, // null for custom skills
          skillName: skillId === decoded ? details.skillName : undefined,
          projectUrl: details.skillUrl,
          description: details.description
        };
      });

      formData.append("skills", JSON.stringify(skillsData));

      // Make the request
      const response = await axios.post("http://localhost:5000/stu/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === "Profile updated successfully") {
        // Refresh skills
        const skillRes = await axios.get(`http://localhost:5000/stu/getSkill/${decoded}`);
        setProfile(prev => ({
          ...prev,
          skillNames: skillRes.data.map(e => e.skill_name),
        }));

        // Reset form
        setSelectedSkills([]);
        setSkillDetails({});
        setExpandedSkills({});

        alert("Profile updated successfully!");
      } else {
        throw new Error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.message || "An error occurred. Please try again."
      }));
    } finally {
      setIsLoading(false);
    }
  };

  // Options for react-select
  const skillOptions = availableSkills.map((skill) => ({
    value: skill.skill_id,
    label: skill.skill_name,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
        <h1 className="text-3xl font-bold">KGGL Gig</h1>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <img
            src={profile.image ? `http://localhost:5000/images/${profile.image}` : backgroundimg}
            className="w-24 h-24 rounded-full border-4 border-white shadow-lg mr-4"
            alt="Profile"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 capitalize">{profile.name}</h2>
            <Link
              to={`/update/${id}`}
              className="inline-block mt-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skillNames.length > 0 ? (
                  profile.skillNames.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Add Skills Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Skills</h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select your Skills <span className="text-red-500">*</span>
                </label>
                <Select
                  isMulti
                  options={skillOptions}
                  value={skillOptions.filter((option) => selectedSkills.includes(option.value))}
                  onChange={handleSkillChange}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select your skills..."
                />
                {errors.general && (
                  <p className="mt-1 text-sm text-red-600">{errors.general}</p>
                )}
              </div>

              {selectedSkills.length > 0 && (
                <div className="space-y-2">
                  {selectedSkills.map((skillId) => (
                    <div key={skillId} className="border border-gray-200 rounded-lg">
                      <button
                        type="button"
                        onClick={() => toggleSkillAccordion(skillId)}
                        className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <span className="font-medium text-gray-700">
                          {getSkillNameById(skillId)}
                        </span>
                        <svg
                          className={`w-5 h-5 transform transition-transform ${
                            expandedSkills[skillId] ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </button>
                      {expandedSkills[skillId] && (
                        <div className="p-4 bg-white space-y-4">
                          {skillId === decoded && (
                            <div>
                              <label
                                htmlFor={`skillName-${skillId}`}
                                className="block text-sm font-medium text-gray-700 mb-1"
                              >
                                Skill Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                id={`skillName-${skillId}`}
                                type="text"
                                name="skillName"
                                value={skillDetails[skillId]?.skillName || ""}
                                onChange={(e) => handleSkillDetailChange(skillId, e)}
                                placeholder="Enter custom skill name"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              {errors.skills[skillId]?.skillName && (
                                <p className="mt-1 text-sm text-red-600">
                                  {errors.skills[skillId].skillName}
                                </p>
                              )}
                            </div>
                          )}
                          <div>
                            <label
                              htmlFor={`skillUrl-${skillId}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Project Link <span className="text-red-500">*</span>
                            </label>
                            <input
                              id={`skillUrl-${skillId}`}
                              type="text"
                              name="skillUrl"
                              value={skillDetails[skillId]?.skillUrl || ""}
                              onChange={(e) => handleSkillDetailChange(skillId, e)}
                              placeholder="Paste GitHub project URL"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.skills[skillId]?.url && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.skills[skillId].url}
                              </p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor={`description-${skillId}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Project Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              id={`description-${skillId}`}
                              name="description"
                              rows="3"
                              value={skillDetails[skillId]?.description || ""}
                              onChange={(e) => handleSkillDetailChange(skillId, e)}
                              placeholder="Project Description (max 100 words)"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.skills[skillId]?.description && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.skills[skillId].description}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Social Links Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub Profile URL
                </label>
                <input
                  id="github"
                  type="url"
                  name="github"
                  value={fileData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.github && (
                  <p className="mt-1 text-sm text-red-600">{errors.github}</p>
                )}
              </div>
              <div className="mt-4">
                <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 mb-1">
                  LinkedIn Profile URL
                </label>
                <input
                  id="linkedIn"
                  type="url"
                  name="linkedIn"
                  value={fileData.linkedIn}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.linkedIn && (
                  <p className="mt-1 text-sm text-red-600">{errors.linkedIn}</p>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Resume</h3>
              <div
                className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center"
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center">
                  <img src={dragim} alt="Drop files here" className="mb-3 w-16" />
                  <p className="text-gray-600 mb-2">Drag and Drop PDF to Upload (5MB Max)</p>
                  <p className="text-gray-500 mb-3">OR</p>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="resume-upload"
                    className="inline-block bg-yellow-500 text-white px-4 py-2 rounded-full hover:bg-yellow-600 cursor-pointer transition-colors"
                  >
                    Browse Files
                  </label>
                  {fileData.fileName && (
                    <p className="mt-3 text-sm text-green-600">{fileData.fileName}</p>
                  )}
                </div>
                <div className="mt-4">
                  <img src={gifimg} className="w-32 mx-auto" alt="Upload animation" />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-right">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
              {errors.general && (
                <p className="mt-2 text-sm text-red-600">{errors.general}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}