import axios from "axios";
import React, { useEffect, useState } from "react";


export function Addproject() {
  const [pname, setPname] = useState("");
  const [pdes, setPdes] = useState("");
  const [skill, setSkill] = useState("");
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [college, setCollege] = useState([]);
 const [level, setLevel] = useState("");
  useEffect(() => {
    setIsLoading(true);
    axios.get("http://localhost:5000/college/skill")
      .then((res) => {
        setCollege(res.data.msg);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, []);


  const handleAddProject = () => {
    if (!pname || !pdes || !skill || !date) {
      alert("Please fill all fields");
      return;
    }


    setIsLoading(true);
    axios
      .post(`http://localhost:5000/admin/addproject`, { pname, pdes, skill, date,level })
      .then((res) => {
        if (res.data.msg === "added") {
          alert("Project Added Successfully!");
          setPname("");
          setPdes("");
          setSkill("");
          setDate("");
          setLevel("");
        } else {
          alert("Failed to add project");
        }
      })
      .catch(() => {
        alert("Network error. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };


  return (
    <div className="container mx-auto py-1 px-4">
      <div className="flex justify-center">
        <div className="w-full max-w-lg">
          <div className="bg-white shadow-lg rounded-lg">
            <div className="bg-blue-600 text-white p-4 rounded-t-lg">
              <h2 className="text-2xl font-semibold text-center">Add New Project</h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <label htmlFor="projectName" className="block text-sm font-medium text-gray-700">
                    Project Name
                  </label>
                  <input
                    type="text"
                    className="mt-1 w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    id="projectName"
                    placeholder="Enter project name"
                    value={pname}
                    onChange={(e) => setPname(e.target.value)}
                  />
                </div>


                <div>
                  <label htmlFor="projectDescription" className="block text-sm font-medium text-gray-700">
                    Project Description
                  </label>
                  <textarea
                    className="mt-1 w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    id="projectDescription"
                    placeholder="Describe your project..."
                    rows="4"
                    value={pdes}
                    onChange={(e) => setPdes(e.target.value)}
                  />
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700">Technology Stack</label>
                  <select
                    name="college"
                    className="mt-1 w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
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


{/* //add level */}
                 <div>
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <select
                    name="college"
                    className="mt-1 w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="">Select Stack</option>
                    {college.map((value) => (
                      <option key={value.level_id} value={value.student_level}>
                        {value.student_level}
                      </option>
                    ))}
                  </select>
                </div>




                <div>
                  <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                  <input
                    type="datetime-local"
                    className="mt-1 w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>


                <div>
                  <button
                    onClick={handleAddProject}
                    className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex justify-center items-center"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l-3 3h-5z" />
                        </svg>
                        Adding...
                      </>
                    ) : "Add Project"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



