// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export function Addproject() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [pname, setPname] = useState("");
//   const [pdes, setPdes] = useState("");
//   const [skill, setSkill] = useState("");
//   const [date, setDate] = useState("");
//   const [numberOfStudents, setNumberOfStudents] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [college, setCollege] = useState([]);
//   const [levels, setLevels] = useState([]);
//   const [selectedLevel, setSelectedLevel] = useState("");
//   const [decodedId, setDecodedId] = useState(null);

//   // Decode the id
//   useEffect(() => {
//     try {
//       const decoded = id ? atob(id) : null;
//       if (!decoded || isNaN(Number(decoded)) || Number(decoded) <= 0) {
//         toast.error("Invalid user ID. Redirecting to login.");
//         setTimeout(() => navigate("/login"), 3000);
//       } else {
//         setDecodedId(Number(decoded));
//       }
//     } catch (e) {
//       console.error("Failed to decode user ID:", e);
//       toast.error("Invalid user ID. Redirecting to login.");
//       setTimeout(() => navigate("/login"), 3000);
//     }
//   }, [id, navigate]);

//   // Fetch skills
//   useEffect(() => {
//     setIsLoading(true);
//     axios
//       .get("https://gig.kggeniuslabs.com/api/api/college/skill")
//       .then((res) => {
//         setCollege(res.data.msg);
//         setIsLoading(false);
//       })
//       .catch(() => {
//         setIsLoading(false);
//         toast.error("Failed to fetch skills.");
//       });
//   }, []);

//   // Fetch difficulty levels
//   useEffect(() => {
//     axios
//       .get("https://gig.kggeniuslabs.com/api/api/test/difficulty-levels")
//       .then((res) => {
//         setLevels(res.data);
//       })
//       .catch(() => {
//         toast.error("Failed to fetch difficulty levels.");
//       });
//   }, []);

//   const handleAddProject = () => {
//     if (!pname || !pdes || !skill || !date || !selectedLevel || !numberOfStudents || !decodedId) {
//       toast.error("Please fill all fields");
//       return;
//     }

//     if (!Number.isInteger(Number(numberOfStudents)) || numberOfStudents <= 0) {
//       toast.error("Number of students must be a positive integer");
//       return;
//     }

//     setIsLoading(true);
//     axios
//       .post(`https://gig.kggeniuslabs.com/api/api/admin/addproject`, {
//         pname,
//         pdes,
//         skill,
//         date,
//         level_id: selectedLevel,
//         number_of_students: numberOfStudents,
//         created_by: decodedId,
//       })
//       .then((res) => {
//         if (res.data.msg === "added") {
//           toast.success("Project Added Successfully!");
//           setPname("");
//           setPdes("");
//           setSkill("");
//           setDate("");
//           setSelectedLevel("");
//           setNumberOfStudents("");
//         } else {
//           toast.error("Failed to add project");
//         }
//       })
//       .catch(() => {
//         toast.error("Network error. Please try again.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="bg-blue-600 p-4 text-white">
//           <h2 className="text-xl font-bold text-center">Add New Project</h2>
//         </div>

//         <div className="p-5 space-y-4">
//           <div>
//             <label htmlFor="projectName" className="block text-xs font-medium text-gray-600 mb-1">
//               Project Name
//             </label>
//             <input
//               type="text"
//               id="projectName"
//               value={pname}
//               onChange={(e) => setPname(e.target.value)}
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter project name"
//             />
//           </div>

//           <div>
//             <label htmlFor="projectDescription" className="block text-xs font-medium text-gray-600 mb-1">
//               Project Description
//             </label>
//             <textarea
//               id="projectDescription"
//               rows="3"
//               value={pdes}
//               onChange={(e) => setPdes(e.target.value)}
//               className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Enter project description"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">Technology Stack</label>
//               <select
//                 value={skill}
//                 onChange={(e) => setSkill(e.target.value)}
//                 className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select Stack</option>
//                 {college.map((value) => (
//                   <option key={value.skill_id} value={value.skill_id}>
//                     {value.skill_name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
//               <select
//                 value={selectedLevel}
//                 onChange={(e) => setSelectedLevel(e.target.value)}
//                 className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="">Select Level</option>
//                 {levels.map((lvl) => (
//                   <option key={lvl.level_id} value={lvl.level_id}>
//                     {lvl.level_name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">Number of Students</label>
//               <input
//                 type="number"
//                 value={numberOfStudents}
//                 onChange={(e) => setNumberOfStudents(e.target.value)}
//                 className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 placeholder="Enter number"
//                 min="1"
//               />
//             </div>

//             <div>
//               <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
//               <input
//                 type="datetime-local"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//           </div>

//           <button
//             onClick={handleAddProject}
//             disabled={isLoading || !decodedId}
//             className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
//               isLoading || !decodedId ? "opacity-70 cursor-not-allowed" : ""
//             }`}
//           >
//             {isLoading ? (
//               <>
//                 <svg
//                   className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                 >
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path
//                     className="opacity-75"
//                     fill="currentColor"
//                     d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                   ></path>
//                 </svg>
//                 Adding...
//               </>
//             ) : "Add Project"}
//           </button>
//         </div>
//       </div>
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
//     </div>
//   );
// }













import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Addproject() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pname, setPname] = useState("");
  const [pdes, setPdes] = useState("");
  const [skill, setSkill] = useState("");
  const [date, setDate] = useState("");
  const [numberOfStudents, setNumberOfStudents] = useState("");
  const [totalAmount, setTotalAmount] = useState(""); // New state for project amount
  const [isLoading, setIsLoading] = useState(false);
  const [college, setCollege] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [decodedId, setDecodedId] = useState(null);

  // Decode the id
  useEffect(() => {
    try {
      const decoded = id ? atob(id) : null;
      if (!decoded || isNaN(Number(decoded)) || Number(decoded) <= 0) {
        toast.error("Invalid user ID. Redirecting to login.");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setDecodedId(Number(decoded));
      }
    } catch (e) {
      console.error("Failed to decode user ID:", e);
      toast.error("Invalid user ID. Redirecting to login.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [id, navigate]);

  // Fetch skills
  useEffect(() => {
    setIsLoading(true);
    axios
      .get("https://gig.kggeniuslabs.com/api/api/college/skill")
      .then((res) => {
        setCollege(res.data.msg);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to fetch skills.");
      });
  }, []);

  // Fetch difficulty levels
  useEffect(() => {
    axios
      .get("https://gig.kggeniuslabs.com/api/api/test/difficulty-levels")
      .then((res) => {
        setLevels(res.data);
      })
      .catch(() => {
        toast.error("Failed to fetch difficulty levels.");
      });
  }, []);

  const handleAddProject = () => {
    if (!pname || !pdes || !skill || !date || !selectedLevel || !numberOfStudents || !totalAmount || !decodedId) {
      toast.error("Please fill all fields");
      return;
    }

    if (!Number.isInteger(Number(numberOfStudents)) || numberOfStudents <= 0) {
      toast.error("Number of students must be a positive integer");
      return;
    }

    if (isNaN(Number(totalAmount)) || Number(totalAmount) <= 0) {
      toast.error("Project amount must be a positive number");
      return;
    }

    setIsLoading(true);
    axios
      .post(`https://gig.kggeniuslabs.com/api/api/admin/addproject`, {
        pname,
        pdes,
        skill,
        date,
        level_id: selectedLevel,
        number_of_students: numberOfStudents,
        total_amount: totalAmount, // Include total_amount
        created_by: decodedId,
      })
      .then((res) => {
        if (res.data.msg === "added") {
          toast.success("Project Added Successfully!");
          setPname("");
          setPdes("");
          setSkill("");
          setDate("");
          setSelectedLevel("");
          setNumberOfStudents("");
          setTotalAmount(""); // Reset total_amount
        } else {
          toast.error(res.data.msg || "Failed to add project");
        }
      })
      .catch(() => {
        toast.error("Network error. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-blue-600 p-4 text-white">
          <h2 className="text-xl font-bold text-center">Add New Project</h2>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label htmlFor="projectName" className="block text-xs font-medium text-gray-600 mb-1">
              Project Name
            </label>
            <input
              type="text"
              id="projectName"
              value={pname}
              onChange={(e) => setPname(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project name"
            />
          </div>

          <div>
            <label htmlFor="projectDescription" className="block text-xs font-medium text-gray-600 mb-1">
              Project Description
            </label>
            <textarea
              id="projectDescription"
              rows="3"
              value={pdes}
              onChange={(e) => setPdes(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter project description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Technology Stack</label>
              <select
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Stack</option>
                {college.map((value) => (
                  <option key={value.skill_id} value={value.skill_id}>
                    {value.skill_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl.level_id} value={lvl.level_id}>
                    {lvl.level_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Number of Students</label>
              <input
                type="number"
                value={numberOfStudents}
                onChange={(e) => setNumberOfStudents(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter number"
                min="1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Project Amount (₹)</label>
              <input
                type="number"
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            onClick={handleAddProject}
            disabled={isLoading || !decodedId}
            className={`w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors ${
              isLoading || !decodedId ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Adding...
              </>
            ) : "Add Project"}
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}