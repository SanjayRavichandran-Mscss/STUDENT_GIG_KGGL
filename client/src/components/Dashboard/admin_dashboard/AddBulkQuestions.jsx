// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Swal from "sweetalert2";
// import { Download, Upload } from "lucide-react";
// import * as XLSX from "xlsx";

// function AddBulkQuestions() {
//   const [file, setFile] = useState(null);
//   const [skills, setSkills] = useState([]);
//   const [difficultyLevels, setDifficultyLevels] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Fetch skills and difficulty levels
//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         setIsLoading(true);
//         const [skillsRes, levelsRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/test/skills"),
//           axios.get("http://localhost:5000/api/test/difficulty-levels"),
//         ]);
//         setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
//         setDifficultyLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);
//       } catch (err) {
//         console.error("Error fetching initial data:", err);
//         setError("Failed to load skills and difficulty levels");
//         Swal.fire({
//           title: "Error",
//           text: "Failed to load skills and difficulty levels",
//           icon: "error",
//           confirmButtonColor: "#2563eb",
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchInitialData();
//   }, []);

//   // Handle file selection
//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && (selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || selectedFile.type === "text/csv")) {
//       setFile(selectedFile);
//       setError("");
//     } else {
//       setFile(null);
//       setError("Please upload a valid .xlsx or .csv file");
//     }
//   };

//   // Handle file upload
//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select a file to upload");
//       return;
//     }

//     setIsLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       // Read the file
//       const reader = new FileReader();
//       reader.onload = async (e) => {
//         const data = new Uint8Array(e.target.result);
//         const workbook = XLSX.read(data, { type: "array" });
//         const sheet = workbook.Sheets[workbook.SheetNames[0]];
//         const rows = XLSX.utils.sheet_to_json(sheet);

//         // Validate and map rows to MCQs
//         const mcqs = [];
//         const skillMap = new Map(skills.map((s) => [s.skill_name.toLowerCase(), s.skill_id]));
//         const levelMap = new Map(difficultyLevels.map((l) => [l.level_name.toLowerCase(), l.level_id]));

//         for (const row of rows) {
//           const skill = row.skill?.toString().trim();
//           const difficultyLevel = row.difficulty_level?.toString().trim();
//           const questions = row.questions?.toString().trim();
//           const correctAnswer = row.correct_answer?.toString().trim();

//           // Validate required fields
//           if (!skill || !difficultyLevel || !questions || !correctAnswer || !row.option1 || !row.feedback1 || !row.option2 || !row.feedback2 || !row.option3 || !row.feedback3 || !row.option4 || !row.feedback4) {
//             throw new Error(`Invalid data in row: ${JSON.stringify(row)}. All fields are required.`);
//           }

//           // Map skill and difficulty level to IDs
//           const skillId = skillMap.get(skill.toLowerCase());
//           const levelId = levelMap.get(difficultyLevel.toLowerCase());

//           if (!skillId) {
//             throw new Error(`Skill "${skill}" not found in database.`);
//           }
//           if (!levelId) {
//             throw new Error(`Difficulty level "${difficultyLevel}" not found in database.`);
//           }

//           // Create options array
//           const options = [
//             { option: row.option1.toString().trim(), feedback: row.feedback1.toString().trim() },
//             { option: row.option2.toString().trim(), feedback: row.feedback2.toString().trim() },
//             { option: row.option3.toString().trim(), feedback: row.feedback3.toString().trim() },
//             { option: row.option4.toString().trim(), feedback: row.feedback4.toString().trim() },
//           ];

//           // Validate correct_answer matches an option
//           if (!options.some((opt) => opt.option === correctAnswer)) {
//             throw new Error(`Correct answer "${correctAnswer}" in row does not match any option.`);
//           }

//           mcqs.push({
//             skill_id: skillId,
//             difficulty_level_id: levelId,
//             questions: `<p>${questions}</p>`,
//             option: options,
//             correct_answer: correctAnswer,
//             question_status: 3 // Set question_status to 3 (multiple_question)
//           });
//         }

//         // Send MCQs to the bulk API
//         const response = await axios.post("http://localhost:5000/api/test/bulk-mcq", mcqs);

//         setSuccess(response.data.msg);
//         Swal.fire({
//           title: "Success!",
//           text: response.data.msg,
//           icon: "success",
//           confirmButtonColor: "#2563eb",
//         });

//         // Reset file input
//         setFile(null);
//         document.getElementById("fileInput").value = null;
//       };

//       reader.onerror = () => {
//         throw new Error("Error reading file");
//       };

//       reader.readAsArrayBuffer(file);
//     } catch (error) {
//       console.error("Error uploading questions:", error);
//       const errorMessage = error.message || "Failed to process file";
//       setError(errorMessage);
//       Swal.fire({
//         title: "Error",
//         text: errorMessage,
//         icon: "error",
//         confirmButtonColor: "#2563eb",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle template download from public folder
//   const handleDownloadTemplate = () => {
//     const link = document.createElement("a");
//     link.href = "/MCQ_Template/QuestionTemplate.xlsx";
//     link.download = "QuestionTemplate.xlsx";
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-4">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//           <div className="bg-blue-600 p-4 text-white">
//             <h1 className="text-xl font-bold text-center">Add Bulk Questions</h1>
//           </div>

//           <div className="p-4">
//             {success && (
//               <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
//                 {success}
//               </div>
//             )}

//             {error && (
//               <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
//                 {error}
//               </div>
//             )}

//             <div className="flex flex-col sm:flex-row gap-4 mb-4">
//               <div className="flex-1">
//                 <label className="block text-sm font-medium text-gray-600 mb-1">
//                   Upload Excel/CSV File *
//                 </label>
//                 <div className="flex items-center gap-2">
//                   <input
//                     id="fileInput"
//                     type="file"
//                     accept=".xlsx,.csv"
//                     onChange={handleFileChange}
//                     className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     disabled={isLoading}
//                   />
//                   <button
//                     onClick={handleDownloadTemplate}
//                     className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex-shrink-0"
//                     title="Download Template"
//                     disabled={isLoading}
//                   >
//                     <Download className="h-5 w-5" />
//                   </button>
//                 </div>
//                 <p className="mt-1 text-xs text-gray-500">
//                   Download the template file to ensure proper formatting
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={handleUpload}
//               disabled={isLoading || !file}
//               className={`w-full py-2 px-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm ${
//                 isLoading || !file ? "opacity-70 cursor-not-allowed" : ""
//               }`}
//             >
//               {isLoading ? (
//                 <>
//                   <svg
//                     className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     ></path>
//                   </svg>
//                   Uploading...
//                 </>
//               ) : (
//                 <>
//                   <Upload className="inline mr-2 h-4 w-4" />
//                   Upload Questions
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default AddBulkQuestions;















import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Download, Upload } from "lucide-react";
import * as XLSX from "xlsx";

function AddBulkQuestions() {
  const [file, setFile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [difficultyLevels, setDifficultyLevels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [detailedErrors, setDetailedErrors] = useState([]);

  // Map column names to Excel column letters based on template
  const columnMap = {
    skill: "A",
    difficulty_level: "B",
    questions: "C",
    option1: "D",
    feedback1: "H",
    option2: "E",
    feedback2: "I",
    option3: "F",
    feedback3: "J",
    option4: "G",
    feedback4: "K",
    correct_answer: "L",
  };

  // Fetch skills and difficulty levels
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [skillsRes, levelsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/test/skills"),
          axios.get("http://localhost:5000/api/test/difficulty-levels"),
        ]);
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);
        setDifficultyLevels(Array.isArray(levelsRes.data) ? levelsRes.data : []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load skills and difficulty levels");
        Swal.fire({
          title: "Error",
          text: "Failed to load skills and difficulty levels",
          icon: "error",
          confirmButtonColor: "#2563eb",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (
      selectedFile &&
      (selectedFile.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        selectedFile.type === "text/csv")
    ) {
      setFile(selectedFile);
      setError("");
      setDetailedErrors([]);
    } else {
      setFile(null);
      setError("Please upload a valid .xlsx or .csv file");
      setDetailedErrors([]);
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      setDetailedErrors([]);
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    setDetailedErrors([]);

    try {
      // Read the file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Validate header
          const expectedHeaders = [
            "skill",
            "difficulty_level",
            "questions",
            "option1",
            "option2",
            "option3",
            "option4",
            "feedback1",
            "feedback2",
            "feedback3",
            "feedback4",
            "correct_answer",
          ];
          const headers = rows[0];
          if (
            !headers ||
            headers.length !== expectedHeaders.length ||
            !expectedHeaders.every((h, i) => h === headers[i])
          ) {
            throw new Error(
              "Invalid Excel file format. Please use the provided template with correct headers."
            );
          }

          // Map rows to MCQs (skip header row)
          const mcqs = [];
          const skillMap = new Map(
            skills.map((s) => [s.skill_name.toLowerCase(), s.skill_id])
          );
          const levelMap = new Map(
            difficultyLevels.map((l) => [l.level_name.toLowerCase(), l.level_id])
          );
          const clientErrors = [];

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i];
            if (row.length === 0) continue; // Skip empty rows

            const [
              skill,
              difficulty_level,
              questions,
              option1,
              option2,
              option3,
              option4,
              feedback1,
              feedback2,
              feedback3,
              feedback4,
              correct_answer,
            ] = row.map((val) => (val ? val.toString().trim() : ""));

            const rowNum = i + 1; // Excel row number (data starts at 2)

            // Validate required fields
            const missingFields = [];
            if (!skill) {
              missingFields.push("skill");
              clientErrors.push({
                row: rowNum,
                column: columnMap.skill,
                message: "Skill is required.",
                resolution: "Enter a valid skill name in column A.",
              });
            }
            if (!difficulty_level) {
              missingFields.push("difficulty_level");
              clientErrors.push({
                row: rowNum,
                column: columnMap.difficulty_level,
                message: "Difficulty level is required.",
                resolution: "Enter a valid difficulty level in column B.",
              });
            }
            if (!questions) {
              missingFields.push("questions");
              clientErrors.push({
                row: rowNum,
                column: columnMap.questions,
                message: "Question is required.",
                resolution: "Enter a valid question text in column C.",
              });
            }
            if (!option1) {
              missingFields.push("option1");
              clientErrors.push({
                row: rowNum,
                column: columnMap.option1,
                message: "Option 1 is required.",
                resolution: "Enter a valid option text in column D.",
              });
            }
            if (!feedback1) {
              missingFields.push("feedback1");
              clientErrors.push({
                row: rowNum,
                column: columnMap.feedback1,
                message: "Feedback for option 1 is required.",
                resolution: "Enter feedback for option 1 in column E.",
              });
            }
            if (!option2) {
              missingFields.push("option2");
              clientErrors.push({
                row: rowNum,
                column: columnMap.option2,
                message: "Option 2 is required.",
                resolution: "Enter a valid option text in column F.",
              });
            }
            if (!feedback2) {
              missingFields.push("feedback2");
              clientErrors.push({
                row: rowNum,
                column: columnMap.feedback2,
                message: "Feedback for option 2 is required.",
                resolution: "Enter feedback for option 2 in column G.",
              });
            }
            if (!option3) {
              missingFields.push("option3");
              clientErrors.push({
                row: rowNum,
                column: columnMap.option3,
                message: "Option 3 is required.",
                resolution: "Enter a valid option text in column H.",
              });
            }
            if (!feedback3) {
              missingFields.push("feedback3");
              clientErrors.push({
                row: rowNum,
                column: columnMap.feedback3,
                message: "Feedback for option 3 is required.",
                resolution: "Enter feedback for option 3 in column I.",
              });
            }
            if (!option4) {
              missingFields.push("option4");
              clientErrors.push({
                row: rowNum,
                column: columnMap.option4,
                message: "Option 4 is required.",
                resolution: "Enter a valid option text in column J.",
              });
            }
            if (!feedback4) {
              missingFields.push("feedback4");
              clientErrors.push({
                row: rowNum,
                column: columnMap.feedback4,
                message: "Feedback for option 4 is required.",
                resolution: "Enter feedback for option 4 in column K.",
              });
            }
            if (!correct_answer) {
              missingFields.push("correct_answer");
              clientErrors.push({
                row: rowNum,
                column: columnMap.correct_answer,
                message: "Correct answer is required.",
                resolution: "Enter a valid correct answer in column L.",
              });
            }

            // Map skill and difficulty level to IDs
            const skillId = skill && skillMap.get(skill.toLowerCase());
            const levelId =
              difficulty_level && levelMap.get(difficulty_level.toLowerCase());

            if (!skillId && skill) {
              clientErrors.push({
                row: rowNum,
                column: columnMap.skill,
                message: `Skill "${skill}" not found in database.`,
                resolution:
                  "Ensure the skill name in column A matches an existing skill (e.g., MERN).",
              });
            }
            if (!levelId && difficulty_level) {
              clientErrors.push({
                row: rowNum,
                column: columnMap.difficulty_level,
                message: `Difficulty level "${difficulty_level}" not found in database.`,
                resolution:
                  "Ensure the difficulty level name in column B matches an existing level (e.g., medium).",
              });
            }

            // Create options array
            const options = [
              { option: option1, feedback: feedback1 },
              { option: option2, feedback: feedback2 },
              { option: option3, feedback: feedback3 },
              { option: option4, feedback: feedback4 },
            ];

            // Validate correct answer matches an option
            if (
              correct_answer &&
              !options.some((opt) => opt.option === correct_answer)
            ) {
              clientErrors.push({
                row: rowNum,
                column: columnMap.correct_answer,
                message: `Correct answer "${correct_answer}" does not match any option.`,
                resolution:
                  "Ensure the correct answer in column L exactly matches one of the option texts in columns D, F, H, or J (case-sensitive).",
              });
            }

            // If no errors for this row, add to MCQs
            if (clientErrors.every((err) => err.row !== rowNum)) {
              mcqs.push({
                skill_id: skillId,
                difficulty_level_id: levelId,
                questions: `<p>${questions}</p>`,
                option: options,
                correct_answer,
                question_status: 3, // Set to 3 (multiple_question)
              });
            }
          }

          // If client-side errors exist, display them and stop
          if (clientErrors.length > 0) {
            setError("Validation issues occurred in the Excel file");
            setDetailedErrors(clientErrors);
            Swal.fire({
              title: "Invalid Input",
              text: "Validation errors were found in the Excel file. Please check the details below.",
              icon: "error",
              confirmButtonColor: "#2563eb",
            });
            return;
          }

          // Send MCQs to the backend
          const response = await axios.post(
            "http://localhost:5000/api/test/bulk-mcq",
            mcqs
          );

          setSuccess(response.data.msg);
          Swal.fire({
            title: "Success!",
            text: response.data.msg,
            icon: "success",
            confirmButtonColor: "#2563eb",
          });

          // Clear file input
          setFile(null);
          document.getElementById("fileInput").value = null;
        } catch (err) {
          throw new Error(err.message || "Error processing Excel file");
        }
      };

      reader.onerror = () => {
        throw new Error("Failed to read file");
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("Error uploading questions:", error);
      const errorResponse = error.response?.data;
      let errorMessage = "Failed to process file";
      let detailedErrorList = [];

      if (errorResponse && errorResponse.errors) {
        errorMessage = errorResponse.msg || "Validation errors occurred";
        detailedErrorList = errorResponse.errors;
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setDetailedErrors(detailedErrorList);

      Swal.fire({
        title: "Error",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: "#2563eb",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle template download
  const handleDownloadTemplate = () => {
    const link = document.createElement("a");
    link.href = "/MCQ_Template/QuestionTemplate.xlsx";
    link.download = "QuestionTemplate.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 p-4 text-white">
            <h1 className="text-xl font-bold text-center">Add Bulk Questions</h1>
          </div>

          <div className="p-4">
            {success && (
              <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700 text-sm">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Upload Excel/CSV File *
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="fileInput"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileChange}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleDownloadTemplate}
                    className="p-3 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-all flex-shrink-0"
                    title="Download Template"
                    disabled={isLoading}
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Download the template file to ensure proper formatting
                </p>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={isLoading || !file}
              className={`w-full py-2 px-3 mt-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm ${
                isLoading || !file ? "opacity-70 cursor-not-allowed" : ""
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
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="inline mr-2 h-4 w-4" />
                  Upload Questions
                </>
              )}
            </button>

            {detailedErrors.length > 0 && (
              <div className="mt-6 bg-white rounded-lg shadow-md p-4 border border-red-200">
                <h2 className="text-lg font-semibold text-red-600 mb-3">
                  Excel Validation Issues
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  The following issues were found in the uploaded Excel file.
                  Please correct these errors in the specified rows and columns
                  and re-upload the file.
                </p>
                <ul className="space-y-3">
                  {detailedErrors.map((err, index) => (
                    <li
                      key={index}
                      className="p-3 bg-red-50 rounded-md text-sm text-red-700 border-l-4 border-red-500"
                    >
                      <span className="font-medium">
                        Row {err.row}, Column {err.column}:
                      </span>{" "}
                      {err.message}
                      <br />
                      <span className="text-xs text-red-600">
                        Resolution: {err.resolution}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddBulkQuestions;