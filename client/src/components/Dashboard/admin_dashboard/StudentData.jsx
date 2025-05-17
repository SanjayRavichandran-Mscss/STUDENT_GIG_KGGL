import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/default_profile.jpg";
import { X } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PerfectScrollbar from "react-perfect-scrollbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";


function StudentsData() {
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");


  const [selectedStudent, setSelectedStudent] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();


  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);


  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");


  const [searchQuery, setSearchQuery] = useState("");


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/student-details");
        if (res.data.status && Array.isArray(res.data.result)) {
          setStudentData(res.data.result);
          setFilteredData(res.data.result);


          const uniqueColleges = [...new Set(res.data.result.map((s) => s.college_name).filter(Boolean))];
          const uniqueDepartments = [...new Set(res.data.result.map((s) => s.department).filter(Boolean))];


          const skillSet = new Set();
          res.data.result.forEach((student) => {
            student.skills?.forEach((skill) => {
              if (skill.skill_name) skillSet.add(skill.skill_name);
            });
          });


          setColleges(uniqueColleges);
          setDepartments(uniqueDepartments);
          setSkills(Array.from(skillSet));
        } else {
          setError(res.data.msg || "Failed to fetch student data");
        }
      } catch (err) {
        setError("Error fetching student data. Please try again later.");
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    let filtered = studentData;


    if (selectedCollege) {
      filtered = filtered.filter((s) => s.college_name === selectedCollege);
    }


    if (selectedDepartment) {
      filtered = filtered.filter((s) => s.department === selectedDepartment);
    }


    if (selectedSkill) {
      filtered = filtered.filter((s) =>
        s.skills?.some((skill) => skill.skill_name === selectedSkill)
      );
    }


    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(query) ||
          s.roll_no?.toLowerCase().includes(query)
      );
    }


    setFilteredData(filtered);
  }, [selectedCollege, selectedDepartment, selectedSkill, searchQuery, studentData]);


  const openModal = (student) => {
    setSelectedStudent(student);
  };


  const closeModal = () => {
    setSelectedStudent(null);
  };


  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}


        {/* Search and Filters */}
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <input
            type="text"
            placeholder="Search by Name or Roll Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border rounded w-full md:w-1/3 w-25"
          />
          <select
            className="p-2 border rounded w-25"
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              setSelectedDepartment("");
            }}>
            <option value="">Filter by College</option>
            {colleges.map((college, index) => (
              <option key={index} value={college}>
                {college}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}>
            <option value="">Filter by Department</option>
            {[...new Set(studentData
              .filter((s) => (selectedCollege ? s.college_name === selectedCollege : true))
              .map((s) => s.department)
            )].map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            className="p-2 border rounded"
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
          >
            <option value="">Filter by Skill</option>
            {skills.map((skill, index) => (
              <option key={index} value={skill}>
                {skill}
              </option>
            ))}
          </select>
        </div>


        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <PerfectScrollbar>
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  {["Photo", "Roll Number", "Name", "Department", "College", "Skills"].map((header) => (
                    <th
                      key={header}
                      className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.length > 0 ? (
                  filteredData.map((student) => (
                    <tr key={student.student_id} className="hover:bg-gray-100 cursor-pointer" onClick={() => openModal(student)}>
                      <td className="px-3 py-2">
                        <img
                          src={
                            student.profile_photo
                              ? `http://localhost:5000/images/${student.profile_photo}`
                              : defaultProfile
                          }
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-3 py-2 text-sm">{student.roll_no || "N/A"}</td>
                      <td className="px-3 py-2 text-sm">{student.name || "N/A"}</td>
                      <td className="px-3 py-2 text-sm">{student.department || "N/A"}</td>
                      <td className="px-3 py-2 text-sm">{student.college_name || "N/A"}</td>
                      <td className="px-3 py-2 text-sm">
                        {student.skills?.map((s, i) => (
                          <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs mr-1">
                            {s.skill_name}
                          </span>
                        )) || "No skills"}
                      </td>
                     
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-4 text-gray-500">
                      No student data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </PerfectScrollbar>
        </div>
      </div>


      {/* Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh] relative">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600 hover:text-black">
              <X />
            </button>
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    selectedStudent.profile_photo
                      ? `http://localhost:5000/images/${selectedStudent.profile_photo}`
                      : defaultProfile
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-lg font-semibold">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
              </div>


              <p><strong>Roll No:</strong> {selectedStudent.roll_no}</p>
              <p><strong>College:</strong> {selectedStudent.college_name}</p>
              <p><strong>Department:</strong> {selectedStudent.department}</p>
              <p><strong>Year:</strong> {selectedStudent.year}</p>
<p><strong>GithubLink:</strong> {selectedStudent.year}</p>
              <div className="mt-2">
                <strong>Skills:</strong>
                <div className="flex flex-wrap mt-1 gap-1">
                  {selectedStudent.skills?.map((s, i) => (
                    <span key={i} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                      {s.skill_name}
                    </span>
                  ))}
                </div>
              </div>


              <div className="mt-4">
  <strong>Resume:</strong>
  {selectedStudent.resume_file ? (
    <div className="h-96 border mt-2">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer
          fileUrl={`http://localhost:5000/images/${selectedStudent.resume_file}`}
          plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </div>
  ) : (
    <div className="mt-2 text-gray-500">Not uploaded</div>
  )}
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default StudentsData;


