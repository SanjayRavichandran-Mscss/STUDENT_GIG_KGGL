// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import defaultProfile from "../../Assets/default_profile.jpg"; // Adjust path as needed
// import { X } from "lucide-react";
// import { Viewer, Worker } from "@react-pdf-viewer/core";
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import PerfectScrollbar from "react-perfect-scrollbar";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import "react-perfect-scrollbar/dist/css/styles.css";

// function StudentsData() {
//   const [studentData, setStudentData] = useState([]);
//   const [error, setError] = useState("");
//   const [selectedPhoto, setSelectedPhoto] = useState(null);
//   const [selectedPdf, setSelectedPdf] = useState(null);
//   const [pdfError, setPdfError] = useState("");

//   const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/admin/student-details");
//         if (res.data.status && Array.isArray(res.data.result)) {
//           setStudentData(res.data.result);
//         } else {
//           setError(res.data.msg || "Failed to fetch student data");
//         }
//       } catch (err) {
//         setError("Error fetching student data. Please try again later.");
//         console.error("Fetch error:", err);
//       }
//     };
//     fetchData();
//   }, []);

//   const handlePhotoClick = (photoUrl) => {
//     setSelectedPhoto(photoUrl || defaultProfile);
//   };

//   const handleClosePhotoModal = () => {
//     setSelectedPhoto(null);
//   };

//   const handleViewResume = (resumeFile) => {
//     console.log("resume_file:", resumeFile);
//     const pdfUrl = `http://localhost:5000/images/${resumeFile}`;
//     console.log("PDF URL:", pdfUrl);
//     setSelectedPdf(pdfUrl);
//     setPdfError("");
//   };

//   const handleClosePdfModal = () => {
//     setSelectedPdf(null);
//     setPdfError("");
//   };

//   const handlePdfError = (error) => {
//     setPdfError("Failed to load PDF. The file may be missing or inaccessible.");
//     console.error("PDF load error:", error);
//   };

//   return (
//     <div className="bg-gray-50">
//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto p-4">
//         {error && (
//           <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
//             {error}
//           </div>
//         )}
//         <div className="bg-white shadow-lg rounded-lg overflow-hidden">
//           <PerfectScrollbar>
//             <div className="max-h-[calc(100vh-65px)] overflow-y-auto">
//               <table className="w-full table-auto border-collapse">
//                 <thead className="bg-gray-100 sticky top-0 z-10">
//                   <tr>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Photo
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       roll number
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Email
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       College
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Year
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Resume
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Skills
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       GitHub
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Projects
//                     </th>
//                     <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Skill Desc
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {studentData.length > 0 ? (
//                     studentData.map((student) => (
//                       <tr
//                         key={student.student_id || Math.random()}
//                         className="hover:bg-gray-50 transition-colors"
//                       >
//                         <td className="px-3 py-2 whitespace-nowrap">
//                           <img
//                             src={
//                               student.profile_photo
//                                 ? `http://localhost:5000/images/${student.profile_photo}`
//                                 : defaultProfile
//                             }
//                             alt="Profile"
//                             className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
//                             onError={(e) => {
//                               e.target.src = defaultProfile;
//                             }}
//                             onClick={() =>
//                               handlePhotoClick(
//                                 student.profile_photo
//                                   ? `http://localhost:5000/images/${student.profile_photo}`
//                                   : defaultProfile
//                               )
//                             }
//                           />
//                         </td>
//                          <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[120px]">
//                           {student.roll_no || "N/A"}
//                         </td>
//                         <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[120px]">
//                           {student.name || "N/A"}
//                         </td>
//                         <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[150px]">
//                           {student.email || "N/A"}
//                         </td>
//                         <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[120px]">
//                           {student.college_name || "N/A"}
//                         </td>
//                         <td className="px-3 py-2 text-sm text-gray-600">
//                           {student.year || "N/A"}
//                         </td>
//                         <td className="px-3 py-2 text-sm">
//                           {student.resume_file ? (
//                             <button
//                               onClick={() => handleViewResume(student.resume_file)}
//                               className="text-blue-600 hover:underline focus:outline-none"
//                             >
//                               View
//                             </button>
//                           ) : (
//                             "N/A"
//                           )}
//                         </td>
//                         <td className="px-3 py-2 text-sm text-gray-600 max-w-[120px]">
//                           {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
//                             <div className="flex flex-wrap gap-1">
//                               {student.skills.map((skill, index) => (
//                                 <span
//                                   key={index}
//                                   className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
//                                 >
//                                   {skill.skill_name || "N/A"}
//                                 </span>
//                               ))}
//                             </div>
//                           ) : (
//                             "No skills"
//                           )}
//                         </td>
//                         <td className="px-3 py-2 text-sm">
//                           {student.github_link ? (
//                             <a
//                               href={student.github_link}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:underline"
//                             >
//                               GitHub
//                             </a>
//                           ) : (
//                             "N/A"
//                           )}
//                         </td>
//                         <td className="px-3 py-2 text-sm max-w-[120px]">
//                           {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
//                             <div className="space-y-1">
//                               {student.skills
//                                 .filter((skill) => skill.skill_url)
//                                 .map((skill, index) => (
//                                   <a
//                                     key={index}
//                                     href={skill.skill_url}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                     className="text-blue-600 hover:underline block truncate"
//                                   >
//                                     P{index + 1}
//                                   </a>
//                                 ))}
//                             </div>
//                           ) : (
//                             "No projects"
//                           )}
//                         </td>
//                         <td className="px-3 py-2 text-sm text-gray-600 max-w-[150px]">
//                           {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
//                             <div className="space-y-1">
//                               {student.skills
//                                 .filter((skill) => skill.skill_description)
//                                 .map((skill, index) => (
//                                   <p
//                                     key={index}
//                                     className="text-xs truncate"
//                                     title={skill.skill_description}
//                                   >
//                                     {skill.skill_description}
//                                   </p>
//                                 ))}
//                             </div>
//                           ) : (
//                             "No descriptions"
//                           )}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan="10" className="px-3 py-2 text-center text-gray-500">
//                         No student data available
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </PerfectScrollbar>
//         </div>
//       </div>

//       {/* Modal for Enlarged Profile Photo */}
//       {selectedPhoto && (
//         <div
//           className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50"
//           onClick={handleClosePhotoModal}
//         >
//           <div
//             className="relative bg-white rounded-lg shadow-lg p-8 max-w-md w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={handleClosePhotoModal}
//               className="absolute top-3 right-3 p-1 text-gray-700 hover:text-gray-900"
//             >
//               <X size={28} />
//             </button>
//             <img
//               src={selectedPhoto}
//               alt="Enlarged Profile"
//               className="w-80 h-80 rounded-full object-cover mx-auto"
//               onError={(e) => {
//                 e.target.src = defaultProfile;
//               }}
//             />
//           </div>
//         </div>
//       )}

//       {/* Modal for PDF Viewer */}
//       {selectedPdf && (
//         <div
//           className="fixed inset-0 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50"
//           onClick={handleClosePdfModal}
//         >
//           <div
//             className="relative bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <button
//               onClick={handleClosePdfModal}
//               className="absolute top-3 right-3 p-1 text-gray-700 hover:text-gray-900"
//             >
//               <X size={28} />
//             </button>
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Resume Viewer</h2>
//             {pdfError ? (
//               <div className="bg-red-100 text-red-700 p-4 rounded-lg text-center">
//                 {pdfError}
//                 <div className="mt-2">
//                   <a
//                     href={selectedPdf}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 hover:underline"
//                   >
//                     Try opening in a new tab
//                   </a>
//                 </div>
//               </div>
//             ) : (
//               <div className="h-[70vh] border border-gray-200 rounded-lg overflow-auto">
//                 <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
//                   <Viewer
//                     fileUrl={selectedPdf}
//                     plugins={[defaultLayoutPluginInstance]}
//                     onDocumentLoadFail={handlePdfError}
//                     onDocumentLoadError={handlePdfError}
//                   />
//                 </Worker>
//               </div>
//             )}
//             <div className="mt-6 flex justify-center gap-4">
//               <a
//                 href={selectedPdf}
//                 download
//                 className="inline-flex items-center bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 <svg
//                   className="w-5 h-5 mr-2"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                   ></path>
//                 </svg>
//                 Download PDF
//               </a>
//               <button
//                 onClick={handleClosePdfModal}
//                 className="inline-flex items-center bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default StudentsData;














import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/default_profile.jpg"; // Adjust path as needed
import { X } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PerfectScrollbar from "react-perfect-scrollbar";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";

function StudentsData() {
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [pdfError, setPdfError] = useState("");

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
    console.log("resume_file:", resumeFile);
    const pdfUrl = `http://localhost:5000/images/${resumeFile}`;
    console.log("PDF URL:", pdfUrl);
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

  return (
    <div className="bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <PerfectScrollbar>
            <div className="max-h-[calc(100vh-65px)] overflow-y-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Photo
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roll Number
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      College
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skills
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      GitHub
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Projects
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Skill Desc
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {studentData.length > 0 ? (
                    studentData.map((student) => (
                      <tr
                        key={student.student_id || Math.random()}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-3 py-2 whitespace-nowrap">
                          <img
                            src={
                              student.profile_photo
                                ? `http://localhost:5000/images/${student.profile_photo}`
                                : defaultProfile
                            }
                            alt="Profile"
                            className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 cursor-pointer"
                            onError={(e) => {
                              e.target.src = defaultProfile;
                            }}
                            onClick={() =>
                              handlePhotoClick(
                                student.profile_photo
                                  ? `http://localhost:5000/images/${student.profile_photo}`
                                  : defaultProfile
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[120px]">
                          {student.roll_no || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[120px]">
                          {student.name || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[150px]">
                          {student.email || "N/A"}
                        </td>
                        <td className="px-2 py-2 text-sm text-gray-600 truncate max-w-[150px]">
                          {student.department || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 truncate max-w-[120px]">
                          {student.college_name || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600">
                          {student.year || "N/A"}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {student.resume_file ? (
                            <button
                              onClick={() => handleViewResume(student.resume_file)}
                              className="text-blue-600 hover:underline focus:outline-none"
                            >
                              View
                            </button>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 max-w-[120px]">
                          {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {student.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs"
                                >
                                  {skill.skill_name || "N/A"}
                                </span>
                              ))}
                            </div>
                          ) : (
                            "No skills"
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm">
                          {student.github_link ? (
                            <a
                              href={student.github_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              GitHub
                            </a>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm max-w-[120px]">
                          {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
                            <div className="space-y-1">
                              {student.skills
                                .filter((skill) => skill.skill_url)
                                .map((skill, index) => (
                                  <a
                                    key={index}
                                    href={skill.skill_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline block truncate"
                                  >
                                    P{index + 1}
                                  </a>
                                ))}
                            </div>
                          ) : (
                            "No projects"
                          )}
                        </td>
                        <td className="px-3 py-2 text-sm text-gray-600 max-w-[150px]">
                          {student.skills && Array.isArray(student.skills) && student.skills.length > 0 ? (
                            <div className="space-y-1">
                              {student.skills
                                .filter((skill) => skill.skill_description)
                                .map((skill, index) => (
                                  <p
                                    key={index}
                                    className="text-xs truncate"
                                    title={skill.skill_description}
                                  >
                                    {skill.skill_description}
                                  </p>
                                ))}
                            </div>
                          ) : (
                            "No descriptions"
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" className="px-3 py-2 text-center text-gray-500">
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

export default StudentsData;