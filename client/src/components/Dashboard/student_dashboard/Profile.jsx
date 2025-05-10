import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
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
    skillNames: []
  });
  const [formData, setFormData] = useState({
    selectedSkill: "",
    skillUrl: "",
    description: "",
    selectedFile: null,
    fileName: ""
  });
  const [errors, setErrors] = useState({
    description: "",
    github: "",
    skill: "",
    url: "",
    general: ""
  });
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // API calls
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, skillsRes, studentSkillsRes] = await Promise.all([
          axios.get(`http://localhost:5000/stu/getdata/${decoded}`),
          axios.get("http://localhost:5000/college/skill"),
          axios.get(`http://localhost:5000/stu/getSkill/${decoded}`)
        ]);

        const imageRes = await axios.get(`http://localhost:5000/stu/getall/${decoded}`);

        setProfile({
          image: imageRes.data.result[0]?.profile_photo || "",
          name: profileRes.data.msg[0]?.name || "",
          github: profileRes.data.msg[0]?.github_link || "",
          skillNames: studentSkillsRes.data.map(e => e.skill_name) || []
        });

        setSkills(skillsRes.data.msg || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrors(prev => ({ ...prev, general: "Failed to load profile data" }));
      }
    };

    fetchData();
  }, [decoded]);

  // Event handlers
  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file?.type === "application/pdf") {
      setFormData(prev => ({
        ...prev,
        selectedFile: file,
        fileName: file.name
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file?.type === "application/pdf") {
      setFormData(prev => ({
        ...prev,
        selectedFile: file,
        fileName: file.name
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validation
    if (name === "description") {
      const words = value.split(/\s+/);
      setErrors(prev => ({
        ...prev,
        description: words.length > 100 ? "Description cannot exceed 100 words" : ""
      }));
    }

    if (name === "github") {
      const isValid = validateGithubUrl(value);
      setErrors(prev => ({
        ...prev,
        github: isValid ? "" : "Please enter a valid GitHub URL"
      }));
    }
  };

  const validateGithubUrl = (url) => {
    const githubRegex = /^(https?:\/\/)?(www\.)?github\.com\/[A-Za-z0-9._%+-]+(\/[A-Za-z0-9._%+-]+)*\/?$/;
    return githubRegex.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    const newErrors = {
      description: formData.description.split(/\s+/).length > 100 
        ? "Description cannot exceed 100 words" : "",
      github: !validateGithubUrl(formData.github) 
        ? "Please enter a valid GitHub URL" : "",
      skill: !formData.selectedSkill ? "Skill is required" : "",
      url: !formData.skillUrl ? "URL is required" : ""
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      setIsLoading(false);
      return;
    }

    // Prepare form data
    const submissionData = new FormData();
    submissionData.append("file2", formData.selectedFile);
    submissionData.append("name", profile.name);
    submissionData.append("git", formData.github);
    submissionData.append("id", decoded);
    submissionData.append("skill", formData.selectedSkill);
    submissionData.append("url", formData.skillUrl);
    submissionData.append("des", formData.description);

    try {
      const res = await axios.post(
        "http://localhost:5000/stu/upload",
        submissionData
      );
      
      if (res.data === "Profile updated successfully") {
        alert("Files uploaded successfully!");
        // Refresh skill names after successful submission
        const skillRes = await axios.get(`http://localhost:5000/stu/getSkill/${decoded}`);
        setProfile(prev => ({
          ...prev,
          skillNames: skillRes.data.map(e => e.skill_name)
        }));
      } else if (res.data === "Skill_already_exists_for_this_student") {
        alert("Skill already exists");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrors(prev => ({
        ...prev,
        general: "An error occurred during the upload. Please try again."
      }));
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Add New Skill Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Skill</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="skillSelect" className="block text-sm font-medium text-gray-700 mb-1">
                    Select your Skill <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="skillSelect"
                    name="selectedSkill"
                    value={formData.selectedSkill}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select your Skill</option>
                    {skills.map((skill) => (
                      <option key={skill.skill_id} value={skill.skill_id}>
                        {skill.skill_name}
                      </option>
                    ))}
                  </select>
                  {errors.skill && (
                    <p className="mt-1 text-sm text-red-600">{errors.skill}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="skillUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Project GitHub URL (or Netlify link) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="skillUrl"
                    type="text"
                    name="skillUrl"
                    value={formData.skillUrl}
                    onChange={handleInputChange}
                    placeholder="Paste project URL"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.url && (
                    <p className="mt-1 text-sm text-red-600">{errors.url}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="4"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Project Description (max 100 words)"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* GitHub Link Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">GitHub Link</h3>
              <div>
                <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                  Paste GitHub URL <span className="text-red-500">*</span>
                </label>
                <input
                  id="github"
                  type="url"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/username"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.github && (
                  <p className="mt-1 text-sm text-red-600">{errors.github}</p>
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
                  <p className="text-gray-600 mb-2">Drag and Drop PDF to Upload</p>
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
                  {formData.fileName && (
                    <p className="mt-3 text-sm text-green-600">{formData.fileName}</p>
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
                      xmlns="http://www.worg/2000/svg"
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













































