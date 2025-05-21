import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import gifimg from "../../Assets/Animation - 1715065850571.gif";
import dragim from "../../Assets/Group 1.png";
import backgroundimg from "../../Assets/upper.png";

export default function Profile() {
  const { id } = useParams();
  const decoded = atob(id);
  const navigate = useNavigate();
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
    resume: "",
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
        const [profileRes, skillsRes, studentSkillsRes, imageRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/stu/getdata/${decoded}`),
          axios.get("http://localhost:5000/api/college/skill"),
          axios.get(`http://localhost:5000/api/stu/getSkill/${decoded}`),
          axios.get(`http://localhost:5000/api/stu/getall/${decoded}`),
        ]);

        setProfile({
          image: imageRes.data.result[0]?.profile_photo || "",
          name: imageRes.data.result[0]?.name || "",
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
        setErrors((prev) => ({ ...prev, general: "Failed to load profile data. Please try again." }));
        toast.error("Failed to load profile data. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    };

    fetchData();
  }, [decoded]);

  // Validation functions
  const validateGithubUrl = (url) => {
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9._%+-]+(\/[A-Za-z0-9._%+-]+)*\/?$/;
    return githubRegex.test(url);
  };


  const validateVercelUrl = (url) => {
  const vercelRegex = /^https?:\/\/([a-zA-Z0-9-]+)\.vercel\.app(\/.*)?$/;
  return vercelRegex.test(url);
};

const validateNetlifyUrl = (url) => {
  const netlifyRegex = /^https?:\/\/([a-zA-Z0-9-]+)\.netlify\.app(\/.*)?$/;
  return netlifyRegex.test(url);
};


  const validateLinkedInUrl = (url) => {
    const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/in\/[A-Za-z0-9._%+-]+\/?$/;
    return linkedinRegex.test(url);
  };

  const validateCustomSkill = async (skillName) => {
    if (!skillName || skillName.trim() === "") return "Custom skill name is required.";
    if (skillName.length > 50) return "Custom skill name cannot exceed 50 characters.";

    try {
      const response = await axios.get("http://103.118.158.24/api:5000/api/college/skill");
      const existingSkills = response.data.msg || [];
      const skillExists = existingSkills.some(
        (skill) => skill.skill_name.toLowerCase() === skillName.trim().toLowerCase()
      );
      if (skillExists) {
        return `The skill "${skillName}" already exists. Please select it from the dropdown.`;
      }
      return "";
    } catch (error) {
      console.error("Error checking custom skill:", error);
      return "Unable to validate custom skill. Please try again.";
    }
  };

  // Check for duplicate GitHub/LinkedIn links
  const checkDuplicateLinks = async (github, linkedin) => {
    try {
      const response = await axios.post("http://103.118.158.24/api:5000/api/stu/check-links", {
        github_link: github,
        linkedin_link: linkedin,
        student_id: decoded,
      });
      return response.data.duplicates;
    } catch (error) {
      console.error("Error checking duplicate links:", error);
      return { github: false, linkedin: false };
    }
  };

  // File handling
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (!file) {
      setErrors((prev) => ({ ...prev, resume: "Resume is required." }));
      toast.error("Resume is required.", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (file.size > maxSizeInBytes) {
      setErrors((prev) => ({ ...prev, resume: "File size exceeds 5MB limit." }));
      toast.error("File size exceeds 5MB limit.", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (file.type === "application/pdf") {
      setFileData((prev) => ({
        ...prev,
        selectedFile: file,
        fileName: file.name,
      }));
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else {
      setErrors((prev) => ({ ...prev, resume: "Please upload a PDF file." }));
      toast.error("Please upload a PDF file.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const maxSizeInBytes = 5 * 1024 * 1024;

    if (!file) {
      setErrors((prev) => ({ ...prev, resume: "Resume is required." }));
      toast.error("Resume is required.", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (file.size > maxSizeInBytes) {
      setErrors((prev) => ({ ...prev, resume: "File size exceeds 5MB limit." }));
      event.target.value = "";
      toast.error("File size exceeds 5MB limit.", { position: "top-right", autoClose: 3000 });
      return;
    }

    if (file.type === "application/pdf") {
      setFileData((prev) => ({
        ...prev,
        selectedFile: file,
        fileName: file.name,
      }));
      setErrors((prev) => ({ ...prev, resume: "" }));
    } else {
      setErrors((prev) => ({ ...prev, resume: "Please upload a PDF file." }));
      event.target.value = "";
      toast.error("Please upload a PDF file.", { position: "top-right", autoClose: 3000 });
    }
  };

  // Input handling
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFileData((prev) => ({ ...prev, [name]: value }));

    let newErrors = { ...errors };

    if (name === "github") {
      newErrors.github = !value
        ? "GitHub URL is required."
        : !validateGithubUrl(value)
        ? ""
        : "";

      if (!newErrors.github) {
        const duplicates = await checkDuplicateLinks(value, fileData.linkedIn);
        newErrors.github = duplicates.github ? "GitHub URL already exists." : newErrors.github;
        if (newErrors.github) {
          toast.warn("GitHub URL already exists.", { position: "top-right", autoClose: 3000 });
        }
      }
    } else if (name === "linkedIn") {
      newErrors.linkedIn = !value
        ? "LinkedIn URL is required."
        : !validateLinkedInUrl(value)
        ? ""
        : "";

      if (!newErrors.linkedIn) {
        const duplicates = await checkDuplicateLinks(fileData.github, value);
        newErrors.linkedIn = duplicates.linkedin ? "LinkedIn URL already exists." : newErrors.linkedIn;
        if (newErrors.linkedIn) {
          toast.warn("LinkedIn URL already exists.", { position: "top-right", autoClose: 3000 });
        }
      }
    }

    setErrors(newErrors);
  };

  // Skill selection
  const handleSkillChange = (selectedOptions) => {
    const newSelectedSkills = selectedOptions.map((option) => option.value);
    setSelectedSkills(newSelectedSkills);

    const newSkillDetails = {};
    const newSkillErrors = {};
    const newExpandedSkills = {};

    newSelectedSkills.forEach((skillId) => {
      const skill = availableSkills.find((s) => s.skill_id === skillId);
      newSkillDetails[skillId] = skillDetails[skillId] || {
        skillName: skillId === decoded ? "" : skill?.skill_name || "",
        skillUrl: "",
        description: "",
      };
      newSkillErrors[skillId] = { url: "", description: "", skillName: "", general: "" };
      newExpandedSkills[skillId] = expandedSkills[skillId] || false;
    });

    setSkillDetails(newSkillDetails);
    setErrors((prev) => ({ ...prev, skills: newSkillErrors }));
    setExpandedSkills(newExpandedSkills);
  };

  // Skill details change
  const handleSkillDetailChange = async (skillId, e) => {
    const { name, value } = e.target;
    setSkillDetails((prev) => ({
      ...prev,
      [skillId]: {
        ...prev[skillId],
        [name]: value,
      },
    }));

    const newErrors = { ...errors.skills };
    if (!newErrors[skillId]) newErrors[skillId] = { url: "", description: "", skillName: "", general: "" };

    if (name === "description") {
      newErrors[skillId].description =
        value.length < 100
          ? "Description must be at least 100 characters."
          : value.length > 200
          ? "Description cannot exceed 200 characters."
          : "";
      if (newErrors[skillId].description) {
        // toast.error(newErrors[skillId].description, { position: "top-right", autoClose: 3000 });
      }
    }

    if (name === "skillUrl") {
      const isValidGithub = validateGithubUrl(value);
      newErrors[skillId].url = !value
        ? "Project link is required."
        : !isValidGithub
        ? ""
        : fileData.github === value
        ? "Project URL cannot be the same as GitHub profile URL."
        : "";

      if (isValidGithub && value) {
        const otherSkills = selectedSkills.filter((id) => id !== skillId);
        const isDuplicate = otherSkills.some(
          (otherId) => skillDetails[otherId]?.skillUrl === value
        );
        if (isDuplicate) {
          newErrors[skillId].url = "This project URL is already used for another skill.";
        }
      }
      if (newErrors[skillId].url) {
        toast.error(newErrors[skillId].url, { position: "top-right", autoClose: 3000 });
      }
    }

    if (name === "skillName" && skillId === decoded) {
      const customSkillError = await validateCustomSkill(value);
      newErrors[skillId].skillName = customSkillError;
      if (newErrors[skillId].skillName) {
        toast.error(newErrors[skillId].skillName, { position: "top-right", autoClose: 3000 });
      }
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
    if (skillId === decoded) {
      return skillDetails[skillId]?.skillName || "Custom Skill";
    }
    const skill = availableSkills.find((s) => s.skill_id === skillId);
    return skill ? skill.skill_name : "";
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all fields
    const newErrors = {
      github: !fileData.github
        ? "GitHub URL is required."
        : !validateGithubUrl(fileData.github)
        ? "Please enter a valid GitHub URL."
        : "",
      linkedIn: !fileData.linkedIn
        ? "LinkedIn URL is required."
        : !validateLinkedInUrl(fileData.linkedIn)
        ? "Please enter a valid LinkedIn URL."
        : "",
      resume: !fileData.selectedFile ? "Resume is required." : "",
      general: selectedSkills.length === 0 ? "Please select at least one skill." : "",
      skills: {},
    };

    // Check for duplicate links
    const duplicates = await checkDuplicateLinks(fileData.github, fileData.linkedIn);
    if (duplicates.github) {
      newErrors.github = "GitHub URL already exists.";
      toast.warn("GitHub URL already exists.", { position: "top-right", autoClose: 3000 });
    }
    if (duplicates.linkedin) {
      newErrors.linkedIn = "LinkedIn URL already exists.";
      toast.warn("LinkedIn URL already exists.", { position: "top-right", autoClose: 3000 });
    }

    let hasSkillErrors = false;
    selectedSkills.forEach((skillId) => {
      const details = skillDetails[skillId] || { skillUrl: "", description: "", skillName: "" };
      const skillErrors = {
        url: "",
        description: "",
        skillName: "",
        general: "",
      };

      if (!details.skillUrl) {
        skillErrors.url = "Project link is required.";
      } else if (!validateGithubUrl(details.skillUrl)) {
        skillErrors.url = "Please enter a valid GitHub URL.";
      } else if (fileData.github === details.skillUrl) {
        skillErrors.url = "Project URL cannot be the same as GitHub profile URL.";
      } else {
        const otherSkills = selectedSkills.filter((id) => id !== skillId);
        const isDuplicate = otherSkills.some(
          (otherId) => skillDetails[otherId]?.skillUrl === details.skillUrl
        );
        if (isDuplicate) {
          skillErrors.url = "This project URL is already used for another skill.";
        }
      }

      skillErrors.description =
        !details.description
          ? "Description is required."
          : details.description.length < 100
          ? "Description must be at least 100 characters."
          : details.description.length > 200
          ? "Description cannot exceed 200 characters."
          : "";

      if (skillId === decoded) {
        skillErrors.skillName =
          !details.skillName
            ? "Skill name is required."
            : details.skillName.length > 50
            ? "Skill name cannot exceed 50 characters."
            : "";
      }

      newErrors.skills[skillId] = skillErrors;
      if (Object.values(skillErrors).some((err) => err)) {
        hasSkillErrors = true;
      }
    });

    // Validate custom skills
    for (const skillId of selectedSkills) {
      if (skillId === decoded) {
        const customSkillError = await validateCustomSkill(skillDetails[skillId]?.skillName);
        if (customSkillError) {
          newErrors.skills[skillId].skillName = customSkillError;
          hasSkillErrors = true;
        }
      }
    }

    setErrors(newErrors);

    if (
      newErrors.github ||
      newErrors.linkedIn ||
      newErrors.resume ||
      hasSkillErrors ||
      selectedSkills.length === 0
    ) {
      setIsLoading(false);
      toast.error("Please fix the errors before submitting.", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", fileData.selectedFile);
      formData.append("id", decoded);
      formData.append("name", profile.name);
      formData.append("git", fileData.github);
      formData.append("linkedin", fileData.linkedIn);

      const skillsData = selectedSkills.map((skillId) => {
        const details = skillDetails[skillId];
        return {
          skillId: skillId === decoded ? null : skillId,
          skillName: skillId === decoded ? details.skillName : getSkillNameById(skillId),
          projectUrl: details.skillUrl,
          description: details.description,
        };
      });
      formData.append("skills", JSON.stringify(skillsData));

      const response = await axios.post("http://localhost:5000/api/stu/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data === "Profile updated successfully") {
        const skillRes = await axios.get(`http://localhost:5000/api/stu/getSkill/${decoded}`);
        setProfile((prev) => ({
          ...prev,
          skillNames: skillRes.data.map((e) => e.skill_name),
        }));

        setSelectedSkills([]);
        setSkillDetails({});
        setExpandedSkills({});
        setFileData((prev) => ({
          ...prev,
          selectedFile: null,
          fileName: "",
        }));
        setErrors({ github: "", linkedIn: "", resume: "", general: "", skills: {} });

        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate(`/my-tests/${id}`), 1000);
      } else if (response.data.message === "Skill_already_exists") {
        const duplicateSkills = response.data.duplicateSkills || [];
        setErrors((prev) => {
          const newSkillErrors = { ...prev.skills };
          duplicateSkills.forEach((skill) => {
            const skillId = skill.skillId || decoded;
            newSkillErrors[skillId] = {
              ...newSkillErrors[skillId],
              general: `The skill "${skill.skillName}" is already associated with your profile.`,
            };
          });
          return {
            ...prev,
            skills: newSkillErrors,
            general: "Some skills could not be added due to duplicates.",
          };
        });
        toast.warn("Some skills could not be added due to duplicates.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else if (response.data.message === "Duplicate links detected") {
        setErrors((prev) => ({
          ...prev,
          github: response.data.duplicates.github ? "GitHub URL already exists." : prev.github,
          linkedIn: response.data.duplicates.linkedin ? "LinkedIn URL already exists." : prev.linkedIn,
          general: "Some links are already in use by other users.",
        }));
        toast.warn("Some links are already in use by other users.", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          general: response.data.message || "Failed to update profile. Please try again.",
        }));
        toast.error(response.data.message || "Failed to update profile. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "An error occurred during submission. Please try again.",
      }));
      toast.error(error.response?.data?.message || "An error occurred during submission. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
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
      <ToastContainer position="top-right" autoClose={3000} />
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white text-center">
        <h1 className="text-3xl font-bold">KGGL Gig</h1>
      </div>

      {/* Profile Section */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center mb-6">
          <img
            src={profile.image ? `http://103.118.158.24/api/images/${profile.image}` : backgroundimg}
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
                  required
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
                                required
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
                              placeholder="Paste GitHub project URL (e.g., https://github.com/user/repo)"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              required
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
                              minLength="100"
                              maxLength="200"
                              value={skillDetails[skillId]?.description || ""}
                              onChange={(e) => handleSkillDetailChange(skillId, e)}
                              placeholder="Project Description (100-200 characters)"
                              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.skills[skillId]?.description && (
                              <p className="mt-1 text-sm text-red-600">
                                {errors.skills[skillId].description}
                              </p>
                            )}
                          </div>
                          {errors.skills[skillId]?.general && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.skills[skillId].general}
                            </p>
                          )}
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
                  Paste GitHub Profile URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="github"
                  type="url"
                  name="github"
                  value={fileData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                {errors.github && (
                  <p className="mt-1 text-sm text-red-600">{errors.github}</p>
                )}
              </div>
              <div className="mt-4">
                <label htmlFor="linkedIn" className="block text-sm font-medium text-gray-700 mb-1">
                  Paste LinkedIn Profile URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="linkedIn"
                  type="url"
                  name="linkedIn"
                  value={fileData.linkedIn}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
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
                    required
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
                  {errors.resume && (
                    <p className="mt-3 text-sm text-red-600">{errors.resume}</p>
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

























