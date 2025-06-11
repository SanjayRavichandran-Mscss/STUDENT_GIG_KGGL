import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "../../Assets/Group 289210.png";

function ProfileUpdate() {
  const { id } = useParams();
  const decoded = atob(id);
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    roll_no: "",
    name: "",
    email: "",
    password: "",
    mobile_number: "",
    selectedCategory: "", // college_id
    selectedCollege: "", // course_id (degree)
    year: "",
    semester: "",
  });
  const [file, setFile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [semesterOptions, setSemesterOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
// Fetch initial data
useEffect(() => {
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, collegesRes] = await Promise.all([
        axios.get(`https://gig.kggeniuslabs.com/apiapi/stu/getdata/${decoded}`),
        axios.get("https://gig.kggeniuslabs.com/apiapi/college/getcollege"),
      ]);

      const profile = profileRes.data.msg[0];
      setFormData({
        roll_no: profile.roll_no || "",
        name: profile.name || "",
        email: profile.email || "",
        password: profile.password || "",
        mobile_number: profile.mobile_number ? String(profile.mobile_number) : "", // Convert to string
        selectedCategory: profile.college_id || "",
        selectedCollege: profile.degree || "",
        year: profile.year || "",
        semester: profile.semester ? `${profile.semester}${profile.semester === 1 ? "st" : profile.semester === 2 ? "nd" : "th"} Semester` : "",
      });

      setColleges(collegesRes.data.msg || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setApiError("Failed to load profile data.");
      toast.error("Failed to load profile data.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [decoded]);
  // Fetch courses based on selected college
  useEffect(() => {
    if (formData.selectedCategory) {
      axios
        .get(`https://gig.kggeniuslabs.com/apiapi/college/course/${formData.selectedCategory}`)
        .then((res) => {
          setCourses(res.data.result || []);
          if (!res.data.result.some((course) => course.course_id === formData.selectedCollege)) {
            setFormData((prev) => ({ ...prev, selectedCollege: "", year: "", semester: "" }));
            setYears([]);
            setSemesterOptions([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setApiError("Failed to load courses.");
          toast.error("Failed to load courses.", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    } else {
      setCourses([]);
      setFormData((prev) => ({ ...prev, selectedCollege: "", year: "", semester: "" }));
      setYears([]);
      setSemesterOptions([]);
    }
  }, [formData.selectedCategory]);

  // Fetch years based on selected course
  useEffect(() => {
    if (formData.selectedCollege) {
      axios
        .get(`https://gig.kggeniuslabs.com/apiapi/college/years/${formData.selectedCollege}`)
        .then((res) => {
          const yearsCount = res.data.result[0]?.years || 0;
          const yearOptions = [...Array(yearsCount).keys()].map((i) => `${i + 1} Year`);
          setYears(yearOptions);
          if (!yearOptions.includes(formData.year)) {
            setFormData((prev) => ({ ...prev, year: "", semester: "" }));
            setSemesterOptions([]);
          }
        })
        .catch((err) => {
          console.error("Error fetching years:", err);
          setApiError("Failed to load years.");
          toast.error("Failed to load years.", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    } else {
      setYears([]);
      setFormData((prev) => ({ ...prev, year: "", semester: "" }));
      setSemesterOptions([]);
    }
  }, [formData.selectedCollege]);

  // Generate semester options based on year
  useEffect(() => {
    if (formData.year) {
      const yearNumber = parseInt(formData.year.split(" ")[0]);
      const semesters = [];
      const startSemester = (yearNumber - 1) * 2 + 1;
      semesters.push(`${startSemester}${startSemester === 1 ? "st" : "th"} Semester`);
      semesters.push(`${startSemester + 1}${startSemester + 1 === 2 ? "nd" : "th"} Semester`);
      setSemesterOptions(semesters);
      if (!semesters.includes(formData.semester)) {
        setFormData((prev) => ({ ...prev, semester: "" }));
      }
    } else {
      setSemesterOptions([]);
      setFormData((prev) => ({ ...prev, semester: "" }));
    }
  }, [formData.year]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setApiError("");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(selectedFile.type)) {
        toast.error("Please upload a JPG, JPEG, or PNG file.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must not exceed 5MB.", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      setFile(selectedFile);
    }
  };

 // Validate form
const validateForm = () => {
  const newErrors = {};
  if (!formData.roll_no?.trim()) newErrors.roll_no = "Roll No is required.";
  if (!formData.name?.trim()) newErrors.name = "Name is required.";
  if (!formData.email?.trim()) newErrors.email = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format.";
  if (!formData.password) newErrors.password = "Password is required.";
  else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters long.";
  if (!String(formData.mobile_number)?.trim()) newErrors.mobile_number = "Mobile number is required.";
  else if (!/^\d{10}$/.test(String(formData.mobile_number))) newErrors.mobile_number = "Mobile number must be 10 digits.";
  if (!formData.selectedCategory) newErrors.selectedCategory = "College is required.";
  if (!formData.selectedCollege) newErrors.selectedCollege = "Course is required.";
  if (!formData.year) newErrors.year = "Year is required.";
  if (!formData.semester) newErrors.semester = "Semester is required.";
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) {
      toast.error("Please fix the errors in the form.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("roll_no", formData.roll_no);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("mobile_number", formData.mobile_number);
      formDataToSend.append("selectedCategory", formData.selectedCategory);
      formDataToSend.append("selectedCollege", formData.selectedCollege);
      formDataToSend.append("year", formData.year);
      formDataToSend.append("semester", formData.semester);
      formDataToSend.append("id", decoded);
      if (file) formDataToSend.append("file", file);

      const response = await axios.put("https://gig.kggeniuslabs.com/apiapi/stu/update", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.status === "updated") {
        toast.success("Profile updated successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => navigate(`/profile/${btoa(decoded)}`), 1000);
      } else {
        setApiError(response.data.message || "Failed to update profile.");
        toast.error(response.data.message || "Failed to update profile.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      const errorMessage = err.response?.data?.message || "Failed to update profile.";
      setApiError(errorMessage);
      toast.error(errorMessage, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !formData.name) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row mx-5">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Image Section */}
      <div className="w-full lg:w-1/2">
        <img src={img} className="w-full h-full object-cover" alt="Illustration" />
      </div>

      {/* Right Form Section */}
      <div className="lg:w-7/12 p-6 lg:p-10 relative">
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Update Profile</h3>

        {apiError && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Roll No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Roll No <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="roll_no"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.roll_no ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.roll_no}
              onChange={handleChange}
              placeholder="Enter your roll number"
            />
            {errors.roll_no && <p className="mt-1 text-sm text-red-600">{errors.roll_no}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobile_number"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.mobile_number ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="Enter your mobile number"
            />
            {errors.mobile_number && <p className="mt-1 text-sm text-red-600">{errors.mobile_number}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* College */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College <span className="text-red-500">*</span>
            </label>
            <select
              name="selectedCategory"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.selectedCategory ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.selectedCategory}
              onChange={handleChange}
            >
              <option value="">Select College</option>
              {colleges.map((col) => (
                <option key={col.college_id} value={col.college_id}>
                  {col.college_name}
                </option>
              ))}
            </select>
            {errors.selectedCategory && <p className="mt-1 text-sm text-red-600">{errors.selectedCategory}</p>}
          </div>

          {/* Course */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course <span className="text-red-500">*</span>
            </label>
            <select
              name="selectedCollege"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.selectedCollege ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.selectedCollege}
              onChange={handleChange}
              disabled={!formData.selectedCategory}
            >
              <option value="">Select Course</option>
              {courses.map((course) => (
                <option key={course.course_id} value={course.course_id}>
                  {course.course_name}
                </option>
              ))}
            </select>
            {errors.selectedCollege && <p className="mt-1 text-sm text-red-600">{errors.selectedCollege}</p>}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year <span className="text-red-500">*</span>
            </label>
            <select
              name="year"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.year}
              onChange={handleChange}
              disabled={!formData.selectedCollege}
            >
              <option value="">Select Year</option>
              {years.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Semester <span className="text-red-500">*</span>
            </label>
            <select
              name="semester"
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.semester ? "border-red-500" : "border-gray-300"
              }`}
              value={formData.semester}
              onChange={handleChange}
              disabled={!formData.year}
            >
              <option value="">Select Semester</option>
              {semesterOptions.map((sem) => (
                <option key={sem} value={sem}>
                  {sem}
                </option>
              ))}
            </select>
            {errors.semester && <p className="mt-1 text-sm text-red-600">{errors.semester}</p>}
          </div>

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-sm text-gray-600">
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
                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-500">JPG, JPEG, or PNG (Max 5MB)</p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
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
                <span>Updating...</span>
              </div>
            ) : (
              "Update Profile"
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Back to{" "}
          <Link to={`/profile/${btoa(decoded)}`} className="text-blue-600 hover:underline">
            Profile
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ProfileUpdate;