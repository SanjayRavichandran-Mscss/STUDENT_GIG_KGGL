// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmark } from "@fortawesome/free-solid-svg-icons";
// import img from "../Assets/Group 289210.png";

// export function Registration() {
//   const navigate = useNavigate();

//   // State management
//   const [college, setCollege] = useState([]);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [specializedIn, setSpecializedIn] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [colleges, setColleges] = useState([]);
//   const [selectedCollege, setSelectedCollege] = useState("");
//   const [courses, setCourses] = useState([]);
//   const [year, setYear] = useState("");
//   const [role_id, setRoleId] = useState("");
//   const [errors, setErrors] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState("");

//   // Fetch colleges
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const collegeRes = await axios.get("http://localhost:5000/college/getcollege");
//         setCollege(collegeRes.data.msg || []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setApiError("Failed to load colleges.");
//       }
//     };
//     fetchData();
//   }, []);

//   // Fetch courses based on selected college
//   useEffect(() => {
//     if (selectedCategory) {
//       axios
//         .get(`http://localhost:5000/college/course/${selectedCategory}`)
//         .then((res) => {
//           setColleges(res.data.result || []);
//         })
//         .catch((err) => {
//           console.error("Error fetching courses:", err);
//           setApiError("Failed to load courses.");
//         });
//     } else {
//       setColleges([]);
//       setSelectedCollege("");
//       setCourses([]);
//     }
//   }, [selectedCategory]);

//   // Fetch years based on selected course
//   useEffect(() => {
//     if (selectedCollege) {
//       axios
//         .get(`http://localhost:5000/college/years/${selectedCollege}`)
//         .then((res) => {
//           setCourses(res.data.result[0]?.years || 0);
//         })
//         .catch((err) => {
//           console.error("Error fetching years:", err);
//           setApiError("Failed to load years.");
//         });
//     } else {
//       setCourses([]);
//     }
//   }, [selectedCollege]);

//   const handleCategoryChange = (e) => {
//     setSelectedCategory(e.target.value);
//     setSelectedCollege("");
//     setCourses([]);
//     setYear("");
//   };

//   const handleCollegeChange = (e) => {
//     setSelectedCollege(e.target.value);
//     setYear("");
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!name.trim()) newErrors.name = "Name is required.";
//     if (!email.trim()) newErrors.email = "Email is required.";
//     else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";
//     if (!password) newErrors.password = "Password is required.";
//     else if (password.length < 6) newErrors.password = "Password must be at least 6 characters.";
//     if (!role_id) newErrors.role_id = "Role is required.";
//     if (!selectedCategory) newErrors.selectedCategory = "College is required.";
//     if (!selectedCollege) newErrors.selectedCollege = "Course is required.";
//     if (!year) newErrors.year = "Year is required.";
//     if (!specializedIn.trim()) newErrors.specializedIn = "Specialized In is required.";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setApiError("");
//     if (!validateForm()) return;

//     setIsLoading(true);
//     const payload = {
//       name,
//       email,
//       password,
//       selectedCategory,
//       selectedCollege,
//       year,
//       skill: specializedIn, // Map specializedIn to skill for backend compatibility
//       role_id
//     };

//     try {
//       const res = await axios.post("http://localhost:5000/stu/registration", payload);
//       if (res.data.status === "inserted") {
//         alert("Data registered successfully!");
//         navigate("/");
//       } else if (res.data === "Email already exists") {
//         setApiError("Email ID is already registered.");
//       } else if (res.data.status === "error") {
//         setApiError(res.data.message || "Registration failed.");
//       } else {
//         setApiError("Data registration failed.");
//       }
//     } catch (err) {
//       console.error("Error submitting form:", err);
//       setApiError(err.response?.data?.message || "Something went wrong.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const options = [...Array(courses).keys()].map((i) => i + 1);

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
//       <div className="container max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
//         {/* Left Image Section */}
//         <div className="lg:w-5/12 hidden lg:block">
//           <img src={img} className="w-full h-full object-cover" alt="Illustration" />
//         </div>

//         {/* Right Form Section */}
//         <div className="lg:w-7/12 p-6 lg:p-10 relative">
//           {/* Close Button */}
//           <Link to="/" className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
//             <FontAwesomeIcon icon={faXmark} className="text-2xl" />
//           </Link>

//           <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h3>

//           {apiError && (
//             <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
//               {apiError}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {/* Name */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <input
//                 type="text"
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.name ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="Enter your name"
//               />
//               {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.email ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="Enter your email"
//               />
//               {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input
//                 type="password"
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter your password"
//               />
//               {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
//             </div>

//             {/* Role */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//               <select
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.role_id ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={role_id}
//                 onChange={(e) => setRoleId(e.target.value)}
//               >
//                 <option value="">Select Role</option>
//                 <option value="2">Admin</option>
//                 <option value="1">Student</option>
//               </select>
//               {errors.role_id && <p className="mt-1 text-sm text-red-600">{errors.role_id}</p>}
//             </div>

//             {/* College */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
//               <select
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.selectedCategory ? "border-red-500"

//  : "border-gray-300"
//                 }`}
//                 value={selectedCategory}
//                 onChange={handleCategoryChange}
//               >
//                 <option value="">Select College</option>
//                 {college.map((col) => (
//                   <option key={col.college_id} value={col.college_id}>
//                     {col.college_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.selectedCategory && (
//                 <p className="mt-1 text-sm text-red-600">{errors.selectedCategory}</p>
//               )}
//             </div>

//             {/* Course */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
//               <select
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.selectedCollege ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={selectedCollege}
//                 onChange={handleCollegeChange}
//                 disabled={!selectedCategory}
//               >
//                 <option value="">Select Course</option>
//                 {colleges.map((course) => (
//                   <option key={course.course_id} value={course.course_id}>
//                     {course.course_name}
//                   </option>
//                 ))}
//               </select>
//               {errors.selectedCollege && (
//                 <p className="mt-1 text-sm text-red-600">{errors.selectedCollege}</p>
//               )}
//             </div>

//             {/* Year */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
//               <select
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.year ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={year}
//                 onChange={(e) => setYear(e.target.value)}
//                 disabled={!selectedCollege}
//               >
//                 <option value="">Select Year</option>
//                 {options.map((yr) => (
//                   <option key={yr} value={`${yr} Year`}>
//                     {yr} Year
//                   </option>
//                 ))}
//               </select>
//               {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
//             </div>

//             {/* Specialized In */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Specialized In</label>
//               <input
//                 type="text"
//                 className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                   errors.specializedIn ? "border-red-500" : "border-gray-300"
//                 }`}
//                 value={specializedIn}
//                 onChange={(e) => setSpecializedIn(e.target.value)}
//                 placeholder="Enter your specialization"
//               />
//               {errors.specializedIn && <p className="mt-1 text-sm text-red-600">{errors.specializedIn}</p>}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className={`w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
//                 isLoading ? "opacity-50 cursor-not-allowed" : ""
//               }`}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <svg
//                   className="animate-spin h-5 w-5 mx-auto text-white"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle
//                     className="opacity-25"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="currentColor"
//                     strokeWidth="4"
//                   />
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   />
//                 </svg>
//               ) : (
//                 "Sign Up"
//               )}
//             </button>
//           </form>

//           <p className="mt-4 text-center text-gray-600">
//             Already have an account?{" "}
//             <Link to="/" className="text-blue-600 hover:underline">
//               Sign In
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }










import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import img from "../Assets/Group 289210.png";

export function Registration() {
  const navigate = useNavigate();

  // State management
  const [college, setCollege] = useState([]);
  const [rollNo, setRollNo] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [courses, setCourses] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ level: "", color: "", width: "" });

  // Fetch colleges
  useEffect(() => {
    const fetchData = async () => {
      try {
        const collegeRes = await axios.get("http://localhost:5000/college/getcollege");
        setCollege(collegeRes.data.msg || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setApiError("Failed to load colleges.");
      }
    };
    fetchData();
  }, []);

  // Fetch courses based on selected college
  useEffect(() => {
    if (selectedCategory) {
      axios
        .get(`http://localhost:5000/college/course/${selectedCategory}`)
        .then((res) => {
          setColleges(res.data.result || []);
        })
        .catch((err) => {
          console.error("Error fetching courses:", err);
          setApiError("Failed to load courses.");
        });
    } else {
      setColleges([]);
      setSelectedCollege("");
      setCourses([]);
    }
  }, [selectedCategory]);

  // Fetch years based on selected course
  useEffect(() => {
    if (selectedCollege) {
      axios
        .get(`http://localhost:5000/college/years/${selectedCollege}`)
        .then((res) => {
          setCourses(res.data.result[0]?.years || 0);
        })
        .catch((err) => {
          console.error("Error fetching years:", err);
          setApiError("Failed to load years.");
        });
    } else {
      setCourses([]);
    }
  }, [selectedCollege]);

  // Password strength checker
  useEffect(() => {
    if (password) {
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumber = /\d/.test(password);
      const hasSpecial = /[@$!%*?&]/.test(password);
      const length = password.length;

      // Count character types present
      const charTypes = [hasUpper, hasLower, hasNumber, hasSpecial].filter(Boolean).length;

      if (length < 8) {
        setPasswordStrength({ level: "Weak", color: "bg-red-500", width: "w-1/3" });
      } else if (length >= 8 && charTypes >= 3) {
        setPasswordStrength({ level: "Strong", color: "bg-green-500", width: "w-full" });
      } else {
        setPasswordStrength({ level: "Normal", color: "bg-yellow-500", width: "w-2/3" });
      }
    } else {
      setPasswordStrength({ level: "", color: "", width: "" });
    }
  }, [password]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedCollege("");
    setCourses([]);
    setYear("");
    setSemester("");
  };

  const handleCollegeChange = (e) => {
    setSelectedCollege(e.target.value);
    setYear("");
    setSemester("");
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
    setSemester("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!rollNo.trim()) newErrors.rollNo = "Roll No is required.";
    if (!name.trim()) newErrors.name = "Name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Invalid email format.";
    if (!password) newErrors.password = "Password is required.";
    else if (password.length < 8) newErrors.password = "Password must be at least 8 characters long.";
    if (!mobileNumber.trim()) newErrors.mobileNumber = "Mobile number is required.";
    else if (!/^\d{10}$/.test(mobileNumber)) newErrors.mobileNumber = "Mobile number must be 10 digits.";
    if (!selectedCategory) newErrors.selectedCategory = "College is required.";
    if (!selectedCollege) newErrors.selectedCollege = "Course is required.";
    if (!year) newErrors.year = "Year is required.";
    if (!semester) newErrors.semester = "Semester is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    if (!validateForm()) return;

    setIsLoading(true);
    const payload = {
      roll_no: rollNo,
      name,
      email,
      password,
      mobile_number: mobileNumber,
      selectedCategory,
      selectedCollege,
      year,
      semester,
      role_id: "2",
    };

    try {
      const res = await axios.post("http://localhost:5000/stu/registration", payload);
      if (res.data.status === "inserted") {
        alert("Data registered successfully!");
        navigate("/login");
      } else if (res.data === "Email already exists") {
        setApiError("Email ID is already registered.");
      } else if (res.data === "Roll number already exists") {
        setApiError("Roll number is already registered.");
      } else if (res.data === "Mobile number already exists") {
        setApiError("Mobile number is already registered.");
      } else if (res.data.status === "error") {
        setApiError(res.data.message || "Registration failed.");
      } else {
        setApiError("Data registration failed.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setApiError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate semester options based on year
  const getSemesterOptions = () => {
    if (!year) return [];
    const yearNumber = parseInt(year.split(" ")[0]);
    const semesters = [];
    const startSemester = (yearNumber - 1) * 2 + 1;
    semesters.push(`${startSemester}${startSemester === 1 ? "st" : "th"} Semester`);
    semesters.push(`${startSemester + 1}${startSemester + 1 === 2 ? "nd" : "th"} Semester`);
    return semesters;
  };

  const options = [...Array(courses).keys()].map((i) => i + 1);
  const semesterOptions = getSemesterOptions();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-8 px-4">
      <div className="container max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        {/* Left Image Section */}
        <div className="lg:w-5/12 hidden lg:block">
          <img src={img} className="w-full h-full object-cover" alt="Illustration" />
        </div>

        {/* Right Form Section */}
        <div className="lg:w-7/12 p-6 lg:p-10 relative">
          {/* Close Button */}
          <Link to="/" className="absolute top-4 right-4 text-gray-600 hover:text-gray-800">
            <FontAwesomeIcon icon={faXmark} className="text-2xl" />
          </Link>

          <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">Sign Up</h3>

          {apiError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Roll No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Roll No</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.rollNo ? "border-red-500" : "border-gray-300"
                }`}
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="Enter your roll number"
              />
              {errors.rollNo && <p className="mt-1 text-sm text-red-600">{errors.rollNo}</p>}
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.mobileNumber ? "border-red-500" : "border-gray-300"
                }`}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                placeholder="Enter your mobile number"
              />
              {errors.mobileNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              {passwordStrength.level && (
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${passwordStrength.color} ${passwordStrength.width} transition-all duration-300`}
                    ></div>
                  </div>
                  <p className="mt-1 text-sm text-gray-700">
                    Password Strength: <span className="font-medium">{passwordStrength.level}</span>
                  </p>
                </div>
              )}
            </div>

            {/* College */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
              <select
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.selectedCategory ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                <option value="">Select College</option>
                {college.map((col) => (
                  <option key={col.college_id} value={col.college_id}>
                    {col.college_name}
                  </option>
                ))}
              </select>
              {errors.selectedCategory && (
                <p className="mt-1 text-sm text-red-600">{errors.selectedCategory}</p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
              <select
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.selectedCollege ? "border-red-500" : "border-gray-300"
                }`}
                value={selectedCollege}
                onChange={handleCollegeChange}
                disabled={!selectedCategory}
              >
                <option value="">Select Course</option>
                {colleges.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_name}
                  </option>
                ))}
              </select>
              {errors.selectedCollege && (
                <p className="mt-1 text-sm text-red-600">{errors.selectedCollege}</p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
              <select
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.year ? "border-red-500" : "border-gray-300"
                }`}
                value={year}
                onChange={handleYearChange}
                disabled={!selectedCollege}
              >
                <option value="">Select Year</option>
                {options.map((yr) => (
                  <option key={yr} value={`${yr} Year`}>
                    {yr} Year
                  </option>
                ))}
              </select>
              {errors.year && <p className="mt-1 text-sm text-red-600">{errors.year}</p>}
            </div>

            {/* Semester */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <select
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.semester ? "border-red-500" : "border-gray-300"
                }`}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!year}
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

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto text-white"
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
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}