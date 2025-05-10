import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import img from "../../Assets/Group 289210.png";

function ProfileUpdate() {
  const { id } = useParams();
  const decoded = atob(id);
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    degree: "",
    year: "",
    specialization: "",
    college_id: ""
  });
  const [file, setFile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [profileRes, collegesRes] = await Promise.all([
          axios.get(`http://localhost:5000/stu/getdata/${decoded}`),
          axios.get("http://localhost:5000/college/getcollege")
        ]);

        const profile = profileRes.data.msg[0];
        setFormData({
          name: profile.name,
          email: profile.email,
          password: profile.password,
          degree: profile.degree,
          year: profile.year,
          specialization: profile.specialization,
          college_id: profile.college_id
        });

        setColleges(collegesRes.data.msg);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [decoded]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("Name", formData.name);
      formDataToSend.append("Email", formData.email);
      formDataToSend.append("Password", formData.password);
      formDataToSend.append("Degree", formData.degree);
      formDataToSend.append("Year", formData.year);
      formDataToSend.append("Spl", formData.specialization);
      formDataToSend.append("coll", formData.college_id);
      formDataToSend.append("id", decoded);
      if (file) formDataToSend.append("file", file);

      const response = await axios.put("http://localhost:5000/stu/update", formDataToSend);
      
      if (response.data.status) {
        alert("Profile updated successfully");
        navigate(`/profile/${btoa(decoded)}`);
      }
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
        {/* Image Section */}
        <div className="lg:w-1/2 bg-indigo-50 flex items-center justify-center p-8">
          <div className="relative w-full h-full">
            <img
              src={img}
              alt="Profile update"
              className="w-full h-auto max-h-[500px] object-contain transform hover:scale-105 transition-transform duration-500 ease-in-out"
            />
            <div className="absolute bottom-0 left-0 right-0 text-center p-4">
              <h3 className="text-xl font-semibold text-indigo-800">Update Your Profile</h3>
              <p className="text-indigo-600 mt-1">Keep your information fresh and up-to-date</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:w-1/2 p-8 lg:p-10 relative">
          {/* Close Button */}
          {/* <Link
            to="/login"
            className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-all duration-300"
          >
            <FontAwesomeIcon icon={faXmark} size="lg" />
          </Link> */}

          {/* Form Header */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Edit Profile</h2>
            <p className="mt-2 text-gray-500">Update your personal information</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-1">
                  Degree
                </label>
                <input
                  id="degree"
                  type="text"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  id="year"
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization
                </label>
                <input
                  id="specialization"
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="college_id" className="block text-sm font-medium text-gray-700 mb-1">
                  College
                </label>
                <select
                  id="college_id"
                  name="college_id"
                  value={formData.college_id}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200"
                >
                  <option value="">Select College</option>
                  {colleges.map((college) => (
                    <option key={college.college_id} value={college.college_id}>
                      {college.college_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex-1 cursor-pointer">
                  <div className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200">
                    <span className="text-sm text-gray-700">
                      {file ? file.name : "Choose file..."}
                    </span>
                  </div>
                  <input
                    id="file"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
                {file && (
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="p-2 text-red-500 hover:text-red-700 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faXmark} />
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">JPG, JPEG or PNG. Max size 5MB</p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-6 rounded-xl text-white font-medium text-lg shadow-md transition-all duration-300 ${
                  isLoading
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
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
                    <span>Updating Profile...</span>
                  </div>
                ) : (
                  <span className="flex items-center justify-center space-x-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Update Profile</span>
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileUpdate;