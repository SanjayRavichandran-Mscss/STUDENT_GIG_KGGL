import axios from "axios";
import React, { useEffect, useState } from "react";
import defaultProfile from "../../Assets/default_profile4.jpg";
import { X, ExternalLink, Maximize2, Mail, Search, Send } from "lucide-react";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import PerfectScrollbar from "react-perfect-scrollbar";
import Select from "react-select";
import Swal from "sweetalert2";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "react-perfect-scrollbar/dist/css/styles.css";

function NonTechStudentsData() {
  const [studentData, setStudentData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [zoomedProfile, setZoomedProfile] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [skills, setSkills] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [emailCC, setEmailCC] = useState([]); // New state for CC field
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isIndividualEmail, setIsIndividualEmail] = useState(false);
  const [isSending, setIsSending] = useState(false); // New state for loading

  // Configure default layout for PDF viewer
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
            <div className="flex items-center justify-between w-full p-2 bg-gray-100 rounded-t-lg">
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

  // Helper function to clean file paths
  const cleanFilePath = (path) => {
    if (!path) return null;
    return path.split(/[\\/]/).pop();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "https://gig.kggeniuslabs.com/api/api/admin/non-tech-student-details",
          { withCredentials: true }
        );
        if (res.data.status && Array.isArray(res.data.result)) {
          const cleanedData = res.data.result.map((student) => ({
            ...student,
            resume_file: cleanFilePath(student.resume_file),
            profile_photo: cleanFilePath(student.profile_photo),
            skills: student.skills || [],
          }));
          setStudentData(cleanedData);
          setFilteredData(cleanedData);

          const uniqueColleges = [
            ...new Set(cleanedData.map((s) => s.college_name).filter(Boolean)),
          ];
          const uniqueDepartments = [
            ...new Set(cleanedData.map((s) => s.department).filter(Boolean)),
          ];
          const skillSet = new Set();
          cleanedData.forEach((student) => {
            student.skills.forEach((skill) => {
              if (skill?.skill_name) skillSet.add(skill.skill_name);
            });
          });

          setColleges(uniqueColleges);
          setDepartments(uniqueDepartments);
          setSkills(Array.from(skillSet));
        } else {
          setError(res.data.msg || "No non-technical students found");
        }
      } catch (err) {
        setError("Error fetching non-technical students data. Please try again later.");
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
        s.skills.some((skill) => skill.skill_name === selectedSkill)
      );
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (s) =>
          s?.name.toLowerCase()?.includes(query) ||
          s?.roll_no.toLowerCase()?.includes(query)
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

  const handleImageError = (e) => {
    e.target.src = defaultProfile;
  };

  const handleEmailSelection = (selectedOptions) => {
    const emails = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setSelectedEmails(emails);
  };

  const handleCCSelection = (selectedOptions) => {
    const emails = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setEmailCC(emails);
  };

  const openEmailForm = (student = null) => {
    if (student) {
      setSelectedEmails([student.email]);
      setIsIndividualEmail(true);
    } else {
      setSelectedEmails([]);
      setIsIndividualEmail(false);
    }
    setShowEmailForm(true);
  };

  const closeEmailForm = () => {
    setShowEmailForm(false);
    setSelectedEmails([]);
    setEmailCC([]); // Reset CC field
    setEmailSubject("");
    setEmailBody("");
  };

  const sendEmail = async () => {
    if (isIndividualEmail && !selectedEmails.length) {
      Swal.fire({
        icon: "error",
        title: "Missing Recipient",
        text: "Please select a recipient for individual email.",
        confirmButtonColor: "#5b21b6",
      });
      return;
    }
    if (!isIndividualEmail && !selectedEmails.length) {
      Swal.fire({
        icon: "error",
        title: "Missing Recipients",
        text: "Please select at least one recipient for BCC.",
        confirmButtonColor: "#5b21b6",
      });
      return;
    }
    if (!emailSubject.trim() || !emailBody.trim()) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please provide a subject and body.",
        confirmButtonColor: "#5b21b6",
      });
      return;
    }

    setIsSending(true); // Set loading state

    try {
      const payload = {
        to: isIndividualEmail ? selectedEmails[0] : "sanjayravichandran006@gmail.com",
        bcc: isIndividualEmail ? [] : selectedEmails, // Use BCC for bulk emails
        cc: emailCC, // Include CC field
        subject: emailSubject,
        emailBody,
        name: isIndividualEmail
          ? studentData.find((s) => s.email === selectedEmails[0])?.name || "User"
          : selectedEmails.map(
              (email) => studentData.find((s) => s.email === email)?.name || "User"
            ),
      };

      const response = await axios.post(
        "https://gig.kggeniuslabs.com/api/api/admin/interview-schedule-mail",
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Emails sent successfully!",
          confirmButtonColor: "#5b21b6",
        });
        closeEmailForm();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.msg || "Some emails failed to send.",
          confirmButtonColor: "#5b21b6",
        });
      }
    } catch (err) {
      console.error("Email send error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.msg || "Error sending emails. Please try again.",
        confirmButtonColor: "#5b21b6",
      });
    } finally {
      setIsSending(false); // Reset loading state
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#e5e7eb",
      "&:hover": { borderColor: "#7c3aed" },
      boxShadow: "none",
      borderRadius: "0.75rem",
      padding: "0.25rem",
      backgroundColor: "#ffffff",
      fontSize: "0.875rem",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "0.75rem",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#ffffff",
    }),
    option: (provided, state) => ({
      ...provided,
      padding: "0.5rem 1rem",
      backgroundColor: state.isSelected ? "#7c3aed" : state.isFocused ? "#ede9fe" : "#ffffff",
      color: state.isSelected ? "#ffffff" : "#1f2937",
      "&:hover": { backgroundColor: "#ede9fe" },
      fontSize: "0.875rem",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#ddd6fe",
      borderRadius: "0.375rem",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#5b21b6",
      fontSize: "0.875rem",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#5b21b6",
      "&:hover": { backgroundColor: "#5b21b6", color: "#ffffff" },
    }),
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 shadow-sm flex items-center gap-2 animate-fade-in">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        )}

        {/* Header with Compose Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Non-Technical Students</h1>
            <p className="text-sm text-gray-600 mt-1">Manage and communicate with non-technical student profiles</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={() => openEmailForm()}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 sm:px-5 py-2.5 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
            >
              <Mail className="w-5 h-5" />
              <span>Compose Email</span>
            </button>
          </div>
        </div>

        {/* Email Composer */}
        {showEmailForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-8 max-w-3xl mx-auto border border-gray-200 animate-slide-in-right">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-semibold text-gray-900">
                {isIndividualEmail ? "Email Student" : "Email Composer"}
              </h3>
              <button
                onClick={closeEmailForm}
                className="text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              {isIndividualEmail ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">To</label>
                  <Select
                    isMulti={false}
                    options={filteredData.map((student) => ({
                      value: student.email,
                      label: `${student.name} (${student.email})`,
                    }))}
                    value={selectedEmails.map((email) => ({
                      value: email,
                      label: `${
                        studentData.find((s) => s.email === email)?.name || "N/A"
                      } (${email})`,
                    }))}
                    onChange={(option) => setSelectedEmails(option ? [option.value] : [])}
                    placeholder="Select recipient..."
                    styles={customSelectStyles}
                    isDisabled={isIndividualEmail}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">BCC</label>
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={filteredData.map((student) => ({
                      value: student.email,
                      label: `${student.name} (${student.email})`,
                    }))}
                    value={selectedEmails.map((email) => ({
                      value: email,
                      label: `${
                        studentData.find((s) => s.email === email)?.name || "N/A"
                      } (${email})`,
                    }))}
                    onChange={handleEmailSelection}
                    placeholder="Select recipients for BCC..."
                    styles={customSelectStyles}
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">CC (Optional)</label>
                <Select
                  isMulti
                  closeMenuOnSelect={false}
                  options={filteredData.map((student) => ({
                    value: student.email,
                    label: `${student.name} (${student.email})`,
                  }))}
                  value={emailCC.map((email) => ({
                    value: email,
                    label: `${
                      studentData.find((s) => s.email === email)?.name || "N/A"
                    } (${email})`,
                  }))}
                  onChange={handleCCSelection}
                  placeholder="Select recipients for CC..."
                  styles={customSelectStyles}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                <input
                  type="text"
                  placeholder="Enter subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                <textarea
                  placeholder="Write your message..."
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl h-36 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200 resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={sendEmail}
                  disabled={isSending}
                  className={`flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition duration-300 font-medium shadow-sm hover:shadow-md ${
                    isSending ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isSending ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                  {isSending ? "Sending..." : "Send Email"}
                </button>
                <button
                  onClick={closeEmailForm}
                  className="px-4 py-3 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-100 transition duration-200"
                  disabled={isSending}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or roll number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
              />
            </div>
            <select
              value={selectedCollege}
              onChange={(e) => {
                setSelectedCollege(e.target.value);
                setSelectedDepartment("");
              }}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            >
              <option value="">All Colleges</option>
              {colleges.map((college, index) => (
                <option key={index} value={college}>
                  {college}
                </option>
              ))}
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            >
              <option value="">All Departments</option>
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
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-200"
            >
              <option value="">All Skills</option>
              {skills.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Student Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.length > 0 ? (
            filteredData.map((student) => (
              <div
                key={student.student_id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <img
                          src={
                            student.profile_photo
                              ? `https://gig.kggeniuslabs.com/api/resumes/${student.profile_photo}`
                              : defaultProfile
                          }
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-100"
                          onError={handleImageError}
                          onClick={(e) => {
                            e.stopPropagation();
                            zoomProfilePhoto(student);
                          }}
                        />
                        <Maximize2
                          className="absolute top-0 right-0 w-4 h-4 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          onClick={(e) => {
                            e.stopPropagation();
                            zoomProfilePhoto(student);
                          }}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{student.name || "N/A"}</h3>
                        <p className="text-sm text-gray-500">{student.roll_no || "N/A"}</p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openEmailForm(student);
                      }}
                      className="text-purple-600 hover:text-purple-800 p-2 rounded-full hover:bg-purple-50 transition duration-200"
                      title="Email this student"
                    >
                      <Mail className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600"><strong>Department:</strong> {student.department || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>College:</strong> {student.college_name || "N/A"}</p>
                    <p className="text-sm text-gray-600"><strong>Year:</strong> {student.year || "N/A"}</p>
                  </div>
                  <div className="mt-4">
                    {student.skills && student.skills.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {student.skills.map((s, i) => (
                          <span
                            key={i}
                            className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs font-medium"
                          >
                            {s.skill_name}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">No skills listed</span>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(student);
                      }}
                      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              No non-technical student data available.
            </div>
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900 bg-opacity-20 backdrop-blur-sm modal-overlay"
            onClick={handleOutsideClick}
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4 animate-fade-in">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition duration-200"
              >
                <X size={24} />
              </button>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-6">
                    <div className="relative group">
                      <img
                        src={
                          selectedStudent.profile_photo
                            ? `https://gig.kggeniuslabs.com/api/resumes/${selectedStudent.profile_photo}`
                            : defaultProfile
                        }
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                        onError={handleImageError}
                        onClick={() => zoomProfilePhoto(selectedStudent)}
                      />
                      <Maximize2
                        className="absolute top-0 right-0 w-5 h-5 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        onClick={() => zoomProfilePhoto(selectedStudent)}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h2>
                      <p className="text-sm text-gray-500">{selectedStudent.email}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <p className="text-sm text-gray-600"><strong>Roll No:</strong> {selectedStudent.roll_no || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Year:</strong> {selectedStudent.year || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>College:</strong> {selectedStudent.college_name || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Department:</strong> {selectedStudent.department || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Semester:</strong> {selectedStudent.semester || "N/A"}</p>
                  <p className="text-sm text-gray-600"><strong>Mobile:</strong> {selectedStudent.mobile_number || "N/A"}</p>
                  <p className="text-sm text-gray-600">
                    <strong>GitHub:</strong>{" "}
                    {selectedStudent.github_link ? (
                      <a
                        href={selectedStudent.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {selectedStudent.github_link}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>LinkedIn:</strong>{" "}
                    {selectedStudent.linkedin_link ? (
                      <a
                        href={selectedStudent.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:underline"
                      >
                        {selectedStudent.linkedin_link}
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Skills</h3>
                  {selectedStudent.skills && selectedStudent.skills.length > 0 ? (
                    <div>
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
                        placeholder="Select skills..."
                        styles={customSelectStyles}
                      />
                      {selectedStudent.selectedSkills.length > 0 ? (
                        <div className="mt-4 space-y-4">
                          {selectedStudent.selectedSkills.map((skillName) => {
                            const skill = selectedStudent.skills.find((s) => s.skill_name === skillName);
                            return (
                              <div
                                key={skillName}
                                className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative"
                              >
                                <button
                                  onClick={() =>
                                    setSelectedStudent((prev) => ({
                                      ...prev,
                                      selectedSkills: prev.selectedSkills.filter((s) => s !== skillName),
                                    }))
                                  }
                                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                >
                                  <X size={16} />
                                </button>
                                <h4 className="text-sm font-semibold text-gray-900 mb-2">{skill.skill_name}</h4>
                                <p className="text-sm">
                                  <strong>Project Link: </strong>
                                  <a
                                    href={skill.skill_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-purple-600 hover:underline"
                                  >
                                    {skill.skill_url}
                                  </a>
                                </p>
                                <p className="text-sm mt-1">
                                  <strong>Description: </strong>
                                  {skill.skill_description || "N/A"}
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
                    <p className="text-gray-500 text-sm">No skills listed</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">Resume</h3>
                    {selectedStudent.resume_file && (
                      <a
                        href={`https://gig.kggeniuslabs.com/api/resumes/${selectedStudent.resume_file}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-800"
                      >
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                  {selectedStudent.resume_file ? (
                    <div className="h-[60vh] border rounded-xl overflow-hidden shadow-sm">
                      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                          fileUrl={`https://gig.kggeniuslabs.com/api/resumes/${selectedStudent.resume_file}`}
                          plugins={[defaultLayoutPluginInstance]}
                          initialPage={0}
                        />
                      </Worker>
                    </div>
                  ) : (
                    <p className="text-gray-500">No resume uploaded</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zoomed Profile Photo Modal */}
        {zoomedProfile && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-900 bg-opacity-20 backdrop-blur-sm"
            onClick={closeZoomedProfile}
          >
            <div className="relative max-w-4xl max-h-[90vh] p-4">
              <button
                onClick={closeZoomedProfile}
                className="absolute top-4 right-4 text-white hover:text-gray-300"
              >
                <X size={24} />
              </button>
              <div className="flex justify-center items-center h-full">
                <div className="relative">
                  <img
                    src={
                      zoomedProfile.profile_photo
                        ? `https://gig.kggeniuslabs.com/api/resumes/${zoomedProfile.profile_photo}`
                        : defaultProfile
                    }
                    alt="Profile Photo"
                    className="max-w-[80vw] max-h-[80vh] rounded-xl object-contain"
                    onError={handleImageError}
                  />
                  <a
                    href={
                      zoomedProfile.profile_photo
                        ? `https://gig.kggeniuslabs.com/api/resumes/${zoomedProfile.profile_photo}`
                        : defaultProfile
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={20} className="text-purple-600" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tailwind Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default NonTechStudentsData;