// import axios from "axios";
// import React, { useEffect, useState } from "react";

// export function Addproject() {
//   const [pname, setPname] = useState("");
//   const [pdes, setPdes] = useState("");
//   const [skill, setSkill] = useState("");
//   const [date, setDate] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [college, setCollege] = useState([]);
//   const [levels, setLevels] = useState([]);
//   const [selectedLevel, setSelectedLevel] = useState(""); // NEW STATE

//   useEffect(() => {
//     setIsLoading(true);
//     axios.get("http://localhost:5000/api/college/skill")
//       .then((res) => {
//         setCollege(res.data.msg);
//         setIsLoading(false);
//       })
//       .catch(() => {
//         setIsLoading(false);
//       });
//   }, []);

//   useEffect(() => {
//     axios.get("http://localhost:5000/api/quiz/difficulty-levels")
//       .then((res) => {
//         setLevels(res.data); // array of levels
//       })
//       .catch(() => {
//         console.error("Failed to fetch difficulty levels.");
//       });
//   }, []);

//   const handleAddProject = () => {
//     if (!pname || !pdes || !skill || !date || !selectedLevel) {
//       alert("Please fill all fields");
//       return;
//     }

//     setIsLoading(true);
//     axios
//       .post(`http://103.118.158.24/api/admin/addproject`, {
//         pname,
//         pdes,
//         skill,
//         date,
//         level: selectedLevel, // Send selected level ID
//       })
//       .then((res) => {
//         if (res.data.msg === "added") {
//           alert("Project Added Successfully!");
//           setPname("");
//           setPdes("");
//           setSkill("");
//           setDate("");
//           setSelectedLevel(""); // RESET SELECTED LEVEL
//         } else {
//           alert("Failed to add project");
//         }
//       })
//       .catch(() => {
//         alert("Network error. Please try again.");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">


//           <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
//             <h2 className="text-2xl font-semibold text-center">Add Project</h2>
//             <div className="p-6">
//               <div className="space-y-6">

//                 <div>
//                   <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
//                     Project Name
//                   </label>
//                   <input
//                     type="text"
//                     className="mt-1 w-full p-3 border rounded-lg"
//                     id="projectName"
//                     value={pname}
//                     onChange={(e) => setPname(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
//                     Project Description
//                   </label>
//                   <textarea
//                     className="mt-1 w-full p-3 border rounded-lg"
//                     id="projectDescription"
//                     rows="4"
//                     value={pdes}
//                     onChange={(e) => setPdes(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Technology Stack</label>
//                   <select
//                     className="mt-1 w-full p-3 border rounded-lg"
//                     value={skill}
//                     onChange={(e) => setSkill(e.target.value)}
//                   >
//                     <option value="">Select Stack</option>
//                     {college.map((value) => (
//                       <option key={value.skill_id} value={value.skill_id}>
//                         {value.skill_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* LEVEL SELECT */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Level</label>
//                   <select
//                     className="mt-1 w-full p-3 border rounded-lg"
//                     value={selectedLevel}
//                     onChange={(e) => setSelectedLevel(e.target.value)}
//                   >
//                     <option value="">Select Level</option>
//                     {levels.map((lvl) => (
//                       <option key={lvl.level_id} value={lvl.level_id}>
//                         {lvl.level_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
//                   <input
//                     type="datetime-local"
//                     className="mt-1 w-full p-3 border rounded-lg"
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <button
//                     onClick={handleAddProject}
//                     className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//                     disabled={isLoading}
//                   >
//                     {isLoading ? "Adding..." : "Add Project"}
//                   </button>
//                 </div>

//               </div>
//             </div>
//           </div>
//         </div>
    
   
//   );
// }



















import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Addproject() {
  const [pname, setPname] = useState("");
  const [pdes, setPdes] = useState("");
  const [skill, setSkill] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [college, setCollege] = useState([]);
  const [levels, setLevels] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState("");

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:5000/api/college/skill")
      .then((res) => {
        setCollege(res.data.msg);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        toast.error("Failed to fetch skills.");
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/quiz/difficulty-levels")
      .then((res) => {
        setLevels(res.data);
      })
      .catch(() => {
        toast.error("Failed to fetch difficulty levels.");
      });
  }, []);

  const handleAddProject = () => {
    if (!pname || !pdes || !skill || !date || !selectedLevel) {
      toast.error("Please fill all fields");
      return;
    }

    setIsLoading(true);
    axios
      .post(`http://localhost:5000/api/admin/addproject`, {
        pname,
        pdes,
        skill,
        date,
        level_id: selectedLevel, // Send level_id
      })
      .then((res) => {
        if (res.data.msg === "added") {
          toast.success("Project Added Successfully!");
          setPname("");
          setPdes("");
          setSkill("");
          setDate("");
          setSelectedLevel("");
        } else {
          toast.error("Failed to add project");
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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl w-full">
        <h2 className="text-2xl font-semibold text-center">Add Project</h2>
        <div className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                Project Name
              </label>
              <input
                type="text"
                className="mt-1 w-full p-3 border rounded-lg"
                id="projectName"
                value={pname}
                onChange={(e) => setPname(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                Project Description
              </label>
              <textarea
                className="mt-1 w-full p-3 border rounded-lg"
                id="projectDescription"
                rows="4"
                value={pdes}
                onChange={(e) => setPdes(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Technology Stack</label>
              <select
                className="mt-1 w-full p-3 border rounded-lg"
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
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
              <label className="block text-sm font-medium text-gray-700">Level</label>
              <select
                className="mt-1 w-full p-3 border rounded-lg"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
              >
                <option value="">Select Level</option>
                {levels.map((lvl) => (
                  <option key={lvl.level_id} value={lvl.level_id}>
                    {lvl.level_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="datetime-local"
                className="mt-1 w-full p-3 border rounded-lg"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div>
              <button
                onClick={handleAddProject}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Project"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}