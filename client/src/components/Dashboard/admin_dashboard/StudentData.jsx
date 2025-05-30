import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/default_profile4.jpg";
import { X, ExternalLink, Maximize2 } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";

function StudentsData() {
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [zoomedProfile, setZoomedProfile] = useState(null);

  // Configure defaultLayoutPlugin for PDF viewer
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: (defaultTabs) => defaultTabs,
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            CurrentPageInput,
            Download,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            Zoom,
            ZoomIn,
            ZoomOut,
          } = slots;
          return (
            <div className="flex items-center justify-between w-full p-2 bg-gray-100">
              <div className="flex items-center gap-2">
                <GoToPreviousPage />
                <CurrentPageInput /> / <NumberOfPages />
                <GoToNextPage />
              </div>
              <div className="flex items-center gap-2">
                <ZoomOut />
                <Zoom />
                <ZoomIn />
                <Download />
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Helper function to clean file paths
  const cleanFilePath = (path) => {
    if (!path) return null;
    // Extract the filename from paths like "public\images\Siva.pdf"
    return path.split(/[\\/]/).pop();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://103.118.158.24/api/api /admin/student-details");
        if (res.data.status && Array.isArray(res.data.result)) {
          // Clean the resume_file and profile_photo paths
          const cleanedData = res.data.result.map((student) => ({
            ...student,
            resume_file: cleanFilePath(student.resume_file),
            profile_photo: cleanFilePath(student.profile_photo),
          }));
          setStudentData(cleanedData);
          setFilteredData(cleanedData);

          const uniqueColleges = [...new Set(cleanedData.map((s) => s.college_name).filter(Boolean))];
          const uniqueDepartments = [...new Set(cleanedData.map((s) => s.department).filter(Boolean))];
          const skillSet = new Set();
          cleanedData.forEach((student) => {
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
    setSelectedStudent({ ...student, selectedSkills: [] });
  };

  const closeModal = () => {
    setSelectedStudent(null);
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  const zoomProfilePhoto = (student) => {
    setZoomedProfile(student);
  };

  const closeZoomedProfile = () => {
    setZoomedProfile(null);
  };

  // Handle image loading errors
  const handleImageError = (e) => {
    e.target.src = defaultProfile;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-6 shadow-md">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center flex-wrap bg-white p-4 rounded-lg shadow-sm">
          <input
            type="text"
            placeholder="Search by Name or Roll Number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-3 border border-gray-300 rounded-lg w-full sm:w-1/3 focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
          />
          <select
            className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            value={selectedCollege}
            onChange={(e) => {
              setSelectedCollege(e.target.value);
              setSelectedDepartment("");
            }}
          >
            <option value="">Filter by College</option>
            {colleges.map((college, index) => (
              <option key={index} value={college}>
                {college}
              </option>
            ))}
          </select>
          <select
            className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Filter by Department</option>
            {[...new Set(studentData
              .filter((s) => (selectedCollege ? s.college_name === selectedCollege : true))
              .map((s) => s.department)
            )].filter(Boolean).map((dept, index) => (
              <option key={index} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            className="p-3 border border-gray-300 rounded-lg w-full sm:w-auto focus:ring-2 focus:ring-blue-600 focus:border-transparent transition duration-200"
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
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <PerfectScrollbar>
            <table className="w-full table-fixed border-collapse">
              <thead className="bg-gray-200 sticky top-0 z-10">
                <tr>
                  <th className="w-16 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Photo</th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Roll Number</th>
                  <th className="w-32 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="w-64 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Department</th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">College</th>
                  <th className="w-24 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Year</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((student) => (
                    <tr
                      key={student.student_id}
                      className="hover:bg-gray-50 cursor-pointer transition duration-150"
                      onClick={() => openModal(student)}
                    >
                      <td className="px-4 py-4">
                        <div className="relative group">
                          <img
                            src={
                              student.profile_photo
                                ? `http://localhost:5000/resumes/${student.profile_photo}`
                                : defaultProfile
                            }
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border border-gray-200"
                            style={{ aspectRatio: "1/1", objectFit: "cover" }}
                            onError={handleImageError}
                            onClick={(e) => {
                              e.stopPropagation();
                              zoomProfilePhoto(student);
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Maximize2
                              className="text-white bg-blue-600 rounded-full p-1 w-5 h-5 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                zoomProfilePhoto(student);
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm truncate">{student.roll_no || "N/A"}</td>
                      <td className="px-4 py-3 text-sm truncate">{student.name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm truncate">{student.department || "N/A"}</td>
                      <td className="px-4 py-3 text-sm truncate">{student.college_name || "N/A"}</td>
                      <td className="px-4 py-3 text-sm truncate">{student.year}</td>
                      <td className="px-4 py-3">
                        {student.skills && student.skills.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {student.skills.map((s, i) => (
                              <span
                                key={i}
                                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium"
                              >
                                {s.skill_name}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">No skills</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-6 text-gray-500">
                      No student data available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </PerfectScrollbar>
        </div>
      </div>

      {/* Student Details Modal */}
      {selectedStudent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-20 backdrop-blur-lg modal-overlay"
          onClick={handleOutsideClick}
        >
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative m-4">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition duration-200"
            >
              <X size={24} />
            </button>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                <div className="relative group">
                  <img
                    src={
                      selectedStudent.profile_photo
                        ? `http://localhost:5000/resumes/${selectedStudent.profile_photo}`
                        : defaultProfile
                    }
                    alt="Profile"
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-blue-600 cursor-pointer"
                    style={{ aspectRatio: "1/1", objectFit: "cover" }}
                    onError={handleImageError}
                    onClick={() => zoomProfilePhoto(selectedStudent)}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Maximize2
                      className="text-white bg-blue-600 rounded-full p-1 w-5 h-5 cursor-pointer"
                      onClick={() => zoomProfilePhoto(selectedStudent)}
                    />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{selectedStudent.name}</h2>
                  <p className="text-sm text-gray-600">{selectedStudent.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <p className="text-sm">
                  <strong className="text-gray-700">Roll No:</strong> {selectedStudent.roll_no || "N/A"}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">Year:</strong> {selectedStudent.year || "N/A"}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">College:</strong> {selectedStudent.college_name || "N/A"}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">Department:</strong> {selectedStudent.department || "N/A"}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">Semester:</strong> {selectedStudent.semester || "N/A"}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">Mobile Number:</strong> {selectedStudent.mobile_number || "N/A"}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">Github Link:</strong>{" "}
                  {selectedStudent.github_link ? (
                    <a
                      href={selectedStudent.github_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedStudent.github_link}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
                <p className="text-sm">
                  <strong className="text-gray-700">Linkedin Link:</strong>{" "}
                  {selectedStudent.linkedin_link ? (
                    <a
                      href={selectedStudent.linkedin_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedStudent.linkedin_link}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>
              </div>

              <div className="mb-6">
                <strong className="text-gray-700">Skills:</strong>
                {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                  <div className="mt-2">
                    <Select
                      isMulti
                      options={selectedStudent.skills.map((skill) => ({
                        value: skill.skill_name,
                        label: skill.skill_name,
                      }))}
                      value={selectedStudent.selectedSkills.map((skillName) => ({
                        value: skillName,
                        label: skillName,
                      }))}
                      onChange={(selectedOptions) => {
                        setSelectedStudent((prev) => ({
                          ...prev,
                          selectedSkills: selectedOptions.map((option) => option.value),
                        }));
                      }}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="Select skills..."
                    />
                    {selectedStudent.selectedSkills.length > 0 ? (
                      <div className="mt-3 space-y-4">
                        {selectedStudent.selectedSkills.map((skillName) => {
                          const skill = selectedStudent.skills.find((s) => s.skill_name === skillName);
                          return (
                            <div
                              key={skillName}
                              className="relative border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                              <button
                                onClick={() =>
                                  setSelectedStudent((prev) => ({
                                    ...prev,
                                    selectedSkills: prev.selectedSkills.filter((s) => s !== skillName),
                                  }))
                                }
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition duration-200"
                              >
                                <X size={16} />
                              </button>
                              <h4 className="text-sm font-semibold text-gray-800 mb-2">{skill.skill_name}</h4>
                              <p className="text-sm">
                                <strong className="text-gray-700">Project Link: </strong>
                                <a
                                  href={skill.skill_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline break-all"
                                >
                                  {skill.skill_url}
                                </a>
                              </p>
                              <p className="text-sm mt-2">
                                <strong className="text-gray-700">Project Description: </strong>
                                {skill.skill_description || "No description available"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="mt-2 text-gray-500 text-sm">Select skills to view details</p>
                    )}
                  </div>
                ) : (
                  <span className="mt-2 text-gray-500 text-sm">No skills listed</span>
                )}
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <strong className="text-gray-700 text-lg">Resume:</strong>
                  {selectedStudent.resume_file && (
                    <a
                      href={`http://localhost:5000/resumes/${selectedStudent.resume_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 transition duration-200"
                      title="Open Resume in New Tab"
                    >
                      <ExternalLink size={20} />
                    </a>
                  )}
                </div>
                {selectedStudent.resume_file ? (
                  <div className="h-[60vh] sm:h-[70vh] border rounded-lg overflow-hidden shadow-sm">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                      <Viewer
                        fileUrl={`http://localhost:5000/resumes/${selectedStudent.resume_file}`}
                        plugins={[defaultLayoutPluginInstance]}
                        initialPage={0}
                      />
                    </Worker>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500">No resume uploaded</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Zoomed Profile Photo Modal */}
      {zoomedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-20 backdrop-blur-lg"
          onClick={closeZoomedProfile}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <button
              onClick={closeZoomedProfile}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition duration-200"
            >
              <X size={24}/>
            </button>
            <div className="flex justify-center items-center h-full">
              <div className="relative">
                <img
                  src={
                    zoomedProfile.profile_photo
                      ? `http://localhost:5000/resumes/${zoomedProfile.profile_photo}`
                      : defaultProfile
                  }
                  alt="Profile Photo"
                  className="max-w-[80vw] max-h-[80vh] rounded-lg object-contain"
                  onError={handleImageError}
                />
                <a
                  href={
                    zoomedProfile.profile_photo
                      ? `http://localhost:5000/resumes/${zoomedProfile.profile_photo}`
                      : defaultProfile
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition duration-200"
                  title="Open in new tab"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={20} className="text-blue-600" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudentsData;