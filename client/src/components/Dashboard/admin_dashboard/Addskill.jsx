import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/default_profile.jpg";
import { X } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PerfectScrollbar from "react-perfect-scrollbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";


function Addskill() {
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfError, setPdfError] = useState("");
  const [showAddSkillModal, setShowAddSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/admin/student-details");
        if (res.data.status && Array.isArray(res.data.result)) {
          setStudentData(res.data.result);
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


  const handlePhotoClick = (photoUrl) => {
    setSelectedPhoto(photoUrl || defaultProfile);
  };


  const handleClosePhotoModal = () => {
    setSelectedPhoto(null);
  };


  const handleViewResume = (resumeFile) => {
    const pdfUrl = `http://localhost:5000/images/${resumeFile}`;
    setSelectedPdf(pdfUrl);
    setPdfError("");
  };


  const handleClosePdfModal = () => {
    setSelectedPdf(null);
    setPdfError("");
  };


  const handlePdfError = (error) => {
    setPdfError("Failed to load PDF. The file may be missing or inaccessible.");
    console.error("PDF load error:", error);
  };


  const openAddSkillModal = (student) => {
    setSelectedStudent(student);
    setShowAddSkillModal(true);
  };


  const handleAddSkill = async () => {
    if (!newSkill.trim()) {
      toast.error("Please enter a skill name");
      return;
    }


    try {
      // Here you would typically make an API call to add the skill
      // For example:
      // await axios.post("http://localhost:5000/admin/add-skill", {
      //   studentId: selectedStudent.student_id,
      //   skill: newSkill
      // });


      // Simulate API call success
      toast.success(`Skill "${newSkill}" added successfully!`);
      setShowAddSkillModal(false);
      setNewSkill("");
     
      // In a real app, you would update the student data after successful API call
      // setStudentData(prevData => ...update the specific student's skills...);
     
    } catch (err) {
      toast.error("Failed to add skill. Please try again.");
      console.error("Add skill error:", err);
    }
  };


  return (
    <div className="bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
     
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="flex justify-end">
            <button
              className="bg-blue-600 text-white p-2 m-2 rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setShowAddSkillModal(true)}
            >
              ADD NEW SKILL
            </button>
          </div>
          <PerfectScrollbar>
            <div className="max-h-[calc(100vh-65px)] overflow-y-auto ">
              <table className="w-100 table-auto border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.NO
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentData.length > 0 ? (
                    studentData.map((student,index) => (
                      <tr
                        key={student.student_id || Math.random()}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                         {index+1}
                           
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-600 truncate max-w-[150px]">
                          {student.skill || "N/A"}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-600 truncate max-w-[150px]">
                          <button
                            className="bg-green-800 text-white font-bold p-2 rounded-md hover:bg-green-500 transition-colors mx-5"
                            onClick={() => openAddSkillModal(student)}
                          >
                            ADD
                          </button>
                          <button
                            className="bg-red-800 text-white font-bold p-2 rounded-md hover:bg-red-400 transition-colors"
                            onClick={() => openAddSkillModal(student)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-3 py-2 text-center text-gray-500">
                        No student data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </PerfectScrollbar>
        </div>
      </div>


      {/* Add Skill Modal */}
      {showAddSkillModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedStudent ? `Add Skill for ${selectedStudent.name}` : "Add New Skill"}
              </h2>
              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setNewSkill("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              <label htmlFor="skill" className="block text-sm font-medium text-gray-700 mb-1">
                Skill Name
              </label>
              <input
                type="text"
                id="skill"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter skill name"
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddSkillModal(false);
                  setNewSkill("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal for Enlarged Profile Photo */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClosePhotoModal}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePhotoModal}
              className="absolute top-3 right-3 p-1 text-gray-700 hover:text-gray-900"
            >
              <X size={28} />
            </button>
            <img
              src={selectedPhoto}
              alt="Enlarged Profile"
              className="w-80 h-80 rounded-full object-cover mx-auto"
              onError={(e) => {
                e.target.src = defaultProfile;
              }}
            />
          </div>
        </div>
      )}


      {/* Modal for PDF Viewer */}
      {selectedPdf && (
        <div
          className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClosePdfModal}
        >
          <div
            className="relative bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleClosePdfModal}
              className="absolute top-3 right-3 p-1 text-gray-700 hover:text-gray-900"
            >
              <X size={28} />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Viewer</h2>
            {pdfError ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
                {pdfError}
                <div className="mt-2">
                  <a
                    href={selectedPdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Try opening in a new tab
                  </a>
                </div>
              </div>
            ) : (
              <div className="h-[70vh] border border-gray-200 rounded-lg overflow-auto">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                  <Viewer
                    fileUrl={selectedPdf}
                    plugins={[defaultLayoutPluginInstance]}
                    onDocumentLoadFail={handlePdfError}
                    onDocumentLoadError={handlePdfError}
                  />
                </Worker>
              </div>
            )}
            <div className="mt-6 flex justify-center gap-4">
              <a
                href={selectedPdf}
                download
                className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  ></path>
                </svg>
                Download PDF
              </a>
              <button
                onClick={handleClosePdfModal}
                className="inline-flex items-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


export default Addskill;
