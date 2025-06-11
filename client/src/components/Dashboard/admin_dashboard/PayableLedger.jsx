// import React, { useState, useEffect, useRef } from 'react';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { Edit, ChevronDown, Eye } from 'lucide-react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';

// const MySwal = withReactContent(Swal);

// const PayableLedger = () => {
//   const { id } = useParams();
//   const [createdBy, setCreatedBy] = useState(null);
//   const [expenseType, setExpenseType] = useState('');
//   const [expenseSubType, setExpenseSubType] = useState('');
//   const [expenseTypes, setExpenseTypes] = useState([]);
//   const [customSubOptions, setCustomSubOptions] = useState([]);
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [transactions, setTransactions] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [formData, setFormData] = useState({
//     projectId: '',
//     clientName: '',
//     totalAmount: '',
//     teamSize: '',
//     students: [],
//     pettyCash: '',
//     pettyCashDescription: '',
//     expenseTypeId: '',
//   });
//   const [editableFields, setEditableFields] = useState({});
//   const [projectStatus, setProjectStatus] = useState({});
//   const [paidProjects, setPaidProjects] = useState({});
//   const dropdownRef = useRef(null);

//   // Decode the Base64-encoded id
//   useEffect(() => {
//     try {
//       if (!id) throw new Error('No ID provided in the URL.');
//       const decodedId = atob(id);
//       const parsedId = parseInt(decodedId, 10);
//       if (isNaN(parsedId)) throw new Error('Decoded ID is not a valid integer.');
//       setCreatedBy(parsedId);
//     } catch (error) {
//       console.error('Error decoding ID:', error.message);
//       MySwal.fire({
//         icon: 'error',
//         title: 'Invalid ID',
//         text: 'The ID in the URL is invalid or not properly encoded.',
//       });
//       setCreatedBy(null);
//     }
//   }, [id]);

//   // Fetch data and calculate project payment status
//   useEffect(() => {
//     if (createdBy === null) return;

//     const fetchData = async () => {
//       try {
//         const [expenseResponse, studentsResponse, projectsResponse, historyResponse, receivableResponse] = await Promise.all([
//           axios.get('https://gig.kggeniuslabs.com/apiapi/admin/expense-types'),
//           axios.get('https://gig.kggeniuslabs.com/apiapi/admin/student-details'),
//           axios.get('https://gig.kggeniuslabs.com/apiapi/admin/getallprojects'),
//           axios.get('https://gig.kggeniuslabs.com/apiapi/admin/payable-ledger-history'),
//           axios.get('https://gig.kggeniuslabs.com/apiapi/admin/receivable-ledger-history'),
//         ]);

//         if (expenseResponse.data.status) setExpenseTypes(expenseResponse.data.result);
//         if (studentsResponse.data.status) setStudents(studentsResponse.data.result);
//         if (projectsResponse.data.length > 0) setProjects(projectsResponse.data);
//         if (historyResponse.data.status) setTransactions(historyResponse.data.result);

//         // Calculate receivable payment status for each project
//         const status = {};
//         projectsResponse.data.forEach((project) => {
//           const totalAmount = parseFloat(project.total_amount);
//           const paidAmount = receivableResponse.data.result
//             .filter((t) => t.project_name === project.project_name)
//             .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
//           status[project.project_id] = {
//             totalAmount: totalAmount.toFixed(2),
//             paidAmount: paidAmount.toFixed(2),
//             isComplete: Math.abs(totalAmount - paidAmount) < 0.01,
//             balanceAmount: (totalAmount - paidAmount).toFixed(2),
//           };
//         });
//         setProjectStatus(status);

//         // Track paid projects in payable ledger
//         const paid = {};
//         historyResponse.data.result.forEach((transaction) => {
//           const project = projectsResponse.data.find((p) => p.project_name === transaction.project_name);
//           if (project) {
//             paid[project.project_id] = {
//               isPaid: true,
//               details: {
//                 projectId: project.project_id,
//                 clientName: transaction.client_name,
//                 totalAmount: parseFloat(project.total_amount).toFixed(2),
//                 teamSize: transaction.team_size,
//                 pettyCash: parseFloat(transaction.petty_cash).toFixed(2),
//                 pettyCashDescription: transaction.pettycash_description || '',
//                 expenseTypeId: transaction.expense_type_id,
//                 students: (typeof transaction.student_details === 'string'
//                   ? JSON.parse(transaction.student_details)
//                   : transaction.student_details
//                 ).map((s) => ({
//                   studentId: s.studentId || '',
//                   name: s.name || '',
//                   defaultAmount: parseFloat(s.amount).toFixed(2),
//                   amount: parseFloat(s.amount).toFixed(2),
//                   amountDescription: s.amountDescription || '',
//                   fromUpiId: s.fromUpiId || '',
//                   toUpiId: s.toUpiId || '',
//                   transactionId: s.transactionId || '',
//                   dateTime: new Date(s.dateTime || new Date()),
//                   transactionScreenshot: null,
//                   transaction_screenshot: s.transaction_screenshot || null,
//                 })),
//               },
//             };
//           }
//         });
//         setPaidProjects(paid);
//       } catch (error) {
//         console.error('Error fetching data:', error.message);
//         MySwal.fire({ icon: 'error', title: 'Fetch Error', text: 'Failed to fetch initial data.' });
//       }
//     };

//     fetchData();

//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//         setIsSubMenuOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [createdBy]);

//   const handleSelectExpenseType = (type, subType = '', id) => {
//     setExpenseType(type);
//     setExpenseSubType(subType);
//     setFormData((prev) => ({ ...prev, expenseTypeId: id }));
//     setIsDropdownOpen(false);
//     setIsSubMenuOpen(false);
//     setIsFormOpen(true);
//   };

//   const handleAddCustomSubOption = () => {
//     MySwal.fire({
//       title: 'Add Custom Operational Expense',
//       input: 'text',
//       inputPlaceholder: 'Enter custom expense type (e.g., Travel)',
//       showCancelButton: true,
//       confirmButtonText: 'Add',
//       cancelButtonText: 'Cancel',
//       customClass: {
//         popup: 'rounded-lg shadow-xl p-6 bg-white max-w-sm',
//         title: 'text-base font-semibold text-gray-900 mb-4',
//         input: 'border-gray-300 rounded-md text-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3',
//         confirmButton: 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm ml-2',
//         cancelButton: 'bg-gray-300 text-gray-500 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 text-sm',
//       },
//       preConfirm: (value) => {
//         if (!value || value.trim() === '') {
//           MySwal.showValidationMessage('Please enter a valid expense type.');
//         } else if (
//           expenseTypes.some((et) => et.subtype === value.trim() && et.type === 'Operational Payment') ||
//           customSubOptions.includes(value.trim())
//         ) {
//           MySwal.showValidationMessage('This expense type already exists.');
//         } else {
//           return value.trim();
//         }
//       },
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         const newSubOption = result.value;
//         try {
//           const response = await axios.post('https://gig.kggeniuslabs.com/apiapi/admin/expense-types', {
//             type: 'Operational Payment',
//             subtype: newSubOption,
//           });
//           if (response.data.status) {
//             setExpenseTypes([...expenseTypes, response.data.result]);
//             setCustomSubOptions([...customSubOptions, newSubOption]);
//             handleSelectExpenseType('Operational Payment', newSubOption, response.data.result.id);
//           }
//         } catch (error) {
//           console.error('Error adding custom sub-type:', error.message);
//           MySwal.fire({ icon: 'error', title: 'Error', text: 'Failed to add custom expense type.' });
//         }
//       } else {
//         resetForm();
//       }
//     });
//   };

//   const resetForm = () => {
//     setExpenseType('');
//     setExpenseSubType('');
//     setIsFormOpen(false);
//     setFormData({
//       projectId: '',
//       clientName: '',
//       totalAmount: '',
//       teamSize: '',
//       students: [],
//       pettyCash: '',
//       pettyCashDescription: '',
//       expenseTypeId: '',
//     });
//     setEditableFields({});
//     setIsDropdownOpen(false);
//     setIsSubMenuOpen(false);
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     if (name === 'projectId') {
//       const selectedProject = projects.find((project) => project.project_id === parseInt(value));
//       const totalAmount = selectedProject ? parseFloat(selectedProject.total_amount).toFixed(2) : '';
//       let newFormData = {
//         projectId: value,
//         totalAmount,
//         clientName: '',
//         teamSize: '',
//         students: [],
//         pettyCash: '',
//         pettyCashDescription: '',
//         expenseTypeId: formData.expenseTypeId,
//       };

//       // If project is already paid, populate form with saved details
//       if (paidProjects[value]?.isPaid) {
//         const savedDetails = paidProjects[value].details;
//         newFormData = {
//           ...newFormData,
//           ...savedDetails,
//           totalAmount,
//         };
//         setExpenseType(
//           expenseTypes.find((et) => et.id === savedDetails.expenseTypeId)?.type || ''
//         );
//         setExpenseSubType(
//           expenseTypes.find((et) => et.id === savedDetails.expenseTypeId)?.subtype || ''
//         );
//         setIsFormOpen(true);
//         MySwal.fire({
//           icon: 'info',
//           title: 'Already Paid',
//           text: 'This project has already been paid and recorded in the payable ledger. Details are displayed below.',
//         });
//       } else {
//         const teamSize = parseInt(newFormData.teamSize) || 0;
//         const studentAmount = totalAmount ? (totalAmount * 0.9) / (teamSize || 1) : 0;
//         const pettyCash = totalAmount ? (totalAmount * 0.1).toFixed(2) : '';
//         newFormData.students = Array.from({ length: teamSize }, () => ({
//           studentId: '',
//           name: '',
//           defaultAmount: studentAmount.toFixed(2),
//           amount: studentAmount.toFixed(2),
//           amountDescription: '',
//           fromUpiId: '',
//           toUpiId: '',
//           transactionId: '',
//           dateTime: new Date(),
//           transactionScreenshot: null,
//         }));
//         newFormData.pettyCash = pettyCash;
//         if (value && !projectStatus[value]?.isComplete) {
//           MySwal.fire({
//             icon: 'warning',
//             title: 'Incomplete Payment',
//             text: 'The full payment for this project has not been received from the client. Please ensure the project is fully paid before proceeding with payable transactions.',
//           });
//         }
//       }

//       setFormData(newFormData);
//       setEditableFields({ pettyCash: false });
//     } else if (name === 'teamSize') {
//       const teamSize = parseInt(value) || 0;
//       const studentAmount = formData.totalAmount ? (formData.totalAmount * 0.9) / (teamSize || 1) : 0;
//       const students = Array.from({ length: teamSize }, () => ({
//         studentId: '',
//         name: '',
//         defaultAmount: studentAmount.toFixed(2),
//         amount: studentAmount.toFixed(2),
//         amountDescription: '',
//         fromUpiId: '',
//         toUpiId: '',
//         transactionId: '',
//         dateTime: new Date(),
//         transactionScreenshot: null,
//       }));
//       setFormData((prev) => ({
//         ...prev,
//         teamSize: value,
//         students,
//         pettyCash: formData.totalAmount ? (formData.totalAmount * 0.1).toFixed(2) : '',
//       }));
//       setEditableFields((prev) => {
//         const newEditableFields = { pettyCash: prev.pettyCash };
//         for (let i = 0; i < teamSize; i++) {
//           newEditableFields[`student-${i}`] = false;
//         }
//         return newEditableFields;
//       });
//     } else if (name === 'pettyCash') {
//       const numericValue = parseFloat(value) || 0;
//       setFormData((prev) => ({
//         ...prev,
//         pettyCash: value,
//         pettyCashDescription: numericValue !== parseFloat((prev.totalAmount * 0.1).toFixed(2)) ? prev.pettyCashDescription : '',
//       }));
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//     }
//   };

//   const handleStudentInputChange = (index, field, value) => {
//     const updatedStudents = [...formData.students];
//     if (field === 'studentId') {
//       const selectedStudent = students.find((s) => s.student_id === parseInt(value));
//       updatedStudents[index] = {
//         ...updatedStudents[index],
//         studentId: value,
//         name: selectedStudent ? selectedStudent.name : '',
//       };
//     } else if (field === 'amount') {
//       updatedStudents[index] = {
//         ...updatedStudents[index],
//         amount: value,
//         amountDescription:
//           value !== updatedStudents[index].defaultAmount ? updatedStudents[index].amountDescription : '',
//       };
//     } else {
//       updatedStudents[index] = { ...updatedStudents[index], [field]: value };
//     }
//     setFormData((prev) => ({ ...prev, students: updatedStudents }));
//   };

//   const handleStudentDateChange = (index, date) => {
//     const updatedStudents = [...formData.students];
//     updatedStudents[index] = { ...updatedStudents[index], dateTime: date };
//     setFormData((prev) => ({ ...prev, students: updatedStudents }));
//   };

//   const handleStudentFileChange = (index, e) => {
//     const file = e.target.files[0];
//     if (file && !['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Invalid File Type',
//         text: 'Please upload a JPEG, PNG, or PDF file.',
//       });
//       return;
//     }
//     if (file && file.size > 5 * 1024 * 1024) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'File Too Large',
//         text: 'File size must be less than 5MB.',
//       });
//       return;
//     }
//     const updatedStudents = [...formData.students];
//     updatedStudents[index] = { ...updatedStudents[index], transactionScreenshot: file };
//     setFormData((prev) => ({ ...prev, students: updatedStudents }));
//   };

//   const toggleEditableField = (field) => {
//     setEditableFields((prev) => ({
//       ...prev,
//       [field]: !prev[field],
//     }));
//   };

//   const validateForm = () => {
//     const { projectId, clientName, totalAmount, teamSize, students, pettyCash, pettyCashDescription, expenseTypeId } = formData;

//     if (paidProjects[projectId]?.isPaid) {
//       MySwal.fire({
//         icon: 'info',
//         title: 'Already Paid',
//         text: 'This project has already been paid and recorded in the payable ledger.',
//       });
//       return false;
//     }

//     if (!projectStatus[projectId]?.isComplete) {
//       MySwal.fire({
//         icon: 'warning',
//         title: 'Incomplete Payment',
//         text: 'The full payment for this project has not been received from the client. Please ensure the project is fully paid before proceeding with payable transactions.',
//       });
//       return false;
//     }

//     if (!projectId || !clientName || !totalAmount || !teamSize || !pettyCash || !expenseTypeId) {
//       MySwal.fire({ icon: 'error', title: 'Missing Fields', text: 'Please fill all required fields, including expense type.' });
//       return false;
//     }

//     const parsedTeamSize = parseInt(teamSize);
//     if (isNaN(parsedTeamSize) || parsedTeamSize <= 0) {
//       MySwal.fire({ icon: 'error', title: 'Invalid Team Size', text: 'Team size must be a positive integer.' });
//       return false;
//     }

//     if (students.length !== parsedTeamSize) {
//       MySwal.fire({ icon: 'error', title: 'Team Size Mismatch', text: 'Number of students must match the team size.' });
//       return false;
//     }

//     for (let i = 0; i < students.length; i++) {
//       const student = students[i];
//       if (
//         !student.studentId ||
//         !student.name ||
//         !student.amount ||
//         !student.fromUpiId ||
//         !student.toUpiId ||
//         !student.transactionId ||
//         !student.dateTime ||
//         !student.transactionScreenshot
//       ) {
//         MySwal.fire({
//           icon: 'error',
//           title: 'Missing Student Fields',
//           text: `Please fill all fields for student ${i + 1}, including transaction screenshot.`,
//         });
//         return false;
//       }
//       const studentAmount = parseFloat(student.amount);
//       if (isNaN(studentAmount) || studentAmount < 0) {
//         MySwal.fire({
//           icon: 'error',
//           title: 'Invalid Amount',
//           text: `Amount for student ${i + 1} must be a non-negative number.`,
//         });
//         return false;
//       }
//       if (student.amount !== student.defaultAmount && !student.amountDescription) {
//         MySwal.fire({
//           icon: 'error',
//           title: 'Missing Description',
//           text: `Please provide a description for the modified amount of student ${i + 1}.`,
//         });
//         return false;
//       }
//     }

//     const parsedPettyCash = parseFloat(pettyCash);
//     const defaultPettyCash = (parseFloat(totalAmount) * 0.1).toFixed(2);
//     if (isNaN(parsedPettyCash) || parsedPettyCash < 0) {
//       MySwal.fire({ icon: 'error', title: 'Invalid Petty Cash', text: 'Petty cash must be a non-negative number.' });
//       return false;
//     }
//     if (pettyCash !== defaultPettyCash && !pettyCashDescription) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Missing Description',
//         text: 'Please provide a description for the modified petty cash amount.',
//       });
//       return false;
//     }

//     const totalStudentAmount = students.reduce((sum, student) => sum + parseFloat(student.amount), 0);
//     const totalDistributed = totalStudentAmount + parsedPettyCash;
//     if (Math.abs(totalDistributed - parseFloat(totalAmount)) > 0.01) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Amount Mismatch',
//         text: `Total distributed amount (Students: ₹${totalStudentAmount.toFixed(2)} + Petty Cash: ₹${parsedPettyCash.toFixed(2)}) must equal the total project amount (₹${parseFloat(totalAmount).toFixed(2)}).`,
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('expense_type_id', formData.expenseTypeId);
//       formDataToSend.append('project_id', formData.projectId);
//       formDataToSend.append('client_name', formData.clientName);
//       formDataToSend.append('team_size', formData.teamSize);

//       // Sanitize student details and ensure no undefined values
//       const sanitizedStudents = formData.students.map((student) => ({
//         studentId: student.studentId || '',
//         name: student.name || '',
//         amount: student.amount || '0',
//         amountDescription: student.amountDescription || '',
//         fromUpiId: student.fromUpiId || '',
//         toUpiId: student.toUpiId || '',
//         transactionId: student.transactionId || '',
//         dateTime: student.dateTime ? student.dateTime.toISOString() : new Date().toISOString(),
//       }));

//       // Log sanitized students for debugging
//       console.log('Sanitized Students:', JSON.stringify(sanitizedStudents, null, 2));
//       formDataToSend.append('student_details', JSON.stringify(sanitizedStudents));

//       formDataToSend.append('petty_cash', formData.pettyCash);
//       if (formData.pettyCashDescription) {
//         formDataToSend.append('pettycash_description', formData.pettyCashDescription);
//       }
//       formDataToSend.append('created_by', String(createdBy));

//       // Append transaction screenshots with field names matching backend expectation
//       formData.students.forEach((student, index) => {
//         if (student.transactionScreenshot instanceof File) {
//           formDataToSend.append(`student_details[${index}][transaction_screenshot]`, student.transactionScreenshot);
//         }
//       });

//       // Log FormData contents for debugging
//       console.log('FormData Contents:');
//       for (const [key, value] of formDataToSend.entries()) {
//         console.log(`${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
//       }

//       const response = await axios.post(
//         'https://gig.kggeniuslabs.com/apiapi/admin/save-payable-ledger',
//         formDataToSend,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

//       if (response.data.status) {
//         MySwal.fire({
//           icon: 'success',
//           title: 'Transaction Added',
//           text: 'Your payable transaction has been successfully recorded!',
//         });

//         const historyResponse = await axios.get('https://gig.kggeniuslabs.com/apiapi/admin/payable-ledger-history');
//         if (historyResponse.data.status) setTransactions(historyResponse.data.result);
//         resetForm();
//       } else {
//         throw new Error(response.data.msg || 'Unknown server error');
//       }
//     } catch (error) {
//       console.error('Error submitting payable ledger:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       const errorMessage = error.response?.data?.msg || error.message || 'Failed to save payable ledger entry. Check console for details.';
//       MySwal.fire({
//         icon: 'error',
//         title: 'Submission Error',
//         text: errorMessage,
//       });
//     }
//   };

//   const showTransactionDetails = (transaction) => {
//     const studentDetails =
//       typeof transaction.student_details === 'string'
//         ? JSON.parse(transaction.student_details)
//         : transaction.student_details;

//     MySwal.fire({
//       title: 'Payable Transaction Details',
//       html: (
//         <div className="text-left space-y-3 text-sm">
//           <div>
//             <strong>Expense Type:</strong>{' '}
//             {transaction.expense_type === 'Operational Payment' && transaction.expense_subtype
//               ? `${transaction.expense_type} - ${transaction.expense_subtype}`
//               : transaction.expense_type}
//           </div>
//           <div>
//             <strong>Project Name:</strong> {transaction.project_name}
//           </div>
//           <div>
//             <strong>Client Name:</strong> {transaction.client_name}
//           </div>
//           <div>
//             <strong>Petty Cash:</strong> ₹{parseFloat(transaction.petty_cash).toFixed(2)}
//           </div>
//           {transaction.pettycash_description && (
//             <div>
//               <strong>Petty Cash Description:</strong> {transaction.pettycash_description}
//             </div>
//           )}
//           <div>
//             <strong>Students:</strong>
//             <ul className="list-disc list-inside mt-1">
//               {studentDetails.map((student, index) => (
//                 <div key={index} className="ml-2 mt-1">
//                   <div>
//                     <strong>Student {index + 1}:</strong> {student.name}
//                   </div>
//                   <div>
//                     <strong>Amount:</strong> ₹{parseFloat(student.amount).toFixed(2)}
//                   </div>
//                   {student.amountDescription && (
//                     <div>
//                       <strong>Description:</strong> {student.amountDescription}
//                     </div>
//                   )}
//                   <div>
//                     <strong>Date & Time:</strong> {new Date(student.dateTime).toLocaleString()}
//                   </div>
//                   <div>
//                     <strong>From UPI ID:</strong> {student.fromUpiId}
//                   </div>
//                   <div>
//                     <strong>To UPI ID:</strong> {student.toUpiId}
//                   </div>
//                   <div>
//                     <strong>Transaction ID:</strong> {student.transactionId}
//                   </div>
//                   <div>
//                     <strong>Transaction Screenshot:</strong>{' '}
//                     {student.transaction_screenshot ? (
//                       <a
//                         href={`https://gig.kggeniuslabs.com/api${student.transaction_screenshot}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-indigo-600 hover:underline"
//                       >
//                         View
//                       </a>
//                     ) : (
//                       'N/A'
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </ul>
//           </div>
//           <div>
//             <strong>Created By:</strong> {transaction.created_by_name}
//           </div>
//           <div>
//             <strong>Created At:</strong> {new Date(transaction.created_at).toLocaleString()}
//           </div>
//         </div>
//       ),
//       showCloseButton: true,
//       confirmButtonText: 'Close',
//       customClass: {
//         popup: 'rounded-lg shadow-xl p-6 bg-white max-w-md',
//         title: 'text-xl font-bold text-gray-900 mb-4',
//         htmlContainer: 'text-gray-700',
//         confirmButton:
//           'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-medium',
//       },
//     });
//   };

//   const viewScreenshot = (screenshotPath) => {
//     MySwal.fire({
//       imageUrl: `https://gig.kggeniuslabs.com/api${screenshotPath}`,
//       imageAlt: 'Transaction Screenshot',
//       showCloseButton: true,
//       confirmButtonText: 'Close',
//       customClass: {
//         popup: 'rounded-lg shadow-xl p-6 bg-white',
//         confirmButton:
//           'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-medium',
//       },
//     });
//   };

//   if (createdBy === null) {
//     return (
//       <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
//         <div className="bg-white p-6 rounded-lg shadow-lg">
//           <h1 className="text-2xl font-bold text-gray-900">Error</h1>
//           <p className="text-sm text-gray-600 mt-3">Invalid user ID in the URL. Please check and try again.</p>
//         </div>
//       </div>
//     );
//   }

//   const isFormDisabled =
//     (formData.projectId && !projectStatus[formData.projectId]?.isComplete) ||
//     (formData.projectId && paidProjects[formData.projectId]?.isPaid);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Payable Ledger</h1>
//           <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</div>
//         </div>

//         {formData.projectId && (
//           <div
//             className={`p-6 rounded-xl shadow-lg mb-8 border ${
//               projectStatus[formData.projectId]?.isComplete ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
//             }`}
//           >
//             <h2
//               className={`text-xl font-semibold mb-4 ${
//                 projectStatus[formData.projectId]?.isComplete ? 'text-green-900' : 'text-red-900'
//               }`}
//             >
//               {projectStatus[formData.projectId]?.isComplete ? 'Payment Complete from Client' : 'Payment Incomplete from Client'}
//             </h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Total Project Amount</label>
//                 <div className="mt-1 p-3 rounded-md bg-white border border-gray-200 text-sm text-gray-700 font-medium">
//                   ₹{projectStatus[formData.projectId]?.totalAmount || '0.00'}
//                 </div>
//               </div>
//               {!projectStatus[formData.projectId]?.isComplete && (
//                 <>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Paid Amount</label>
//                     <div className="mt-1 p-3 rounded-md bg-white border border-gray-200 text-sm text-gray-700 font-medium">
//                       ₹{projectStatus[formData.projectId]?.paidAmount || '0.00'}
//                     </div>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700">Balance Amount</label>
//                     <div className="mt-1 p-3 rounded-md bg-white border border-gray-200 text-sm text-gray-700 font-medium">
//                       ₹{projectStatus[formData.projectId]?.balanceAmount || '0.00'}
//                     </div>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>
//         )}

//         {formData.projectId && paidProjects[formData.projectId]?.isPaid && (
//           <div className="p-6 rounded-xl shadow-lg mb-8 bg-yellow-50 border border-yellow-200">
//             <h2 className="text-xl font-semibold text-yellow-900 mb-4">
//               This project has already been paid and recorded in the payable ledger. Details are displayed below.
//             </h2>
//           </div>
//         )}

//         <div className="flex justify-end mb-6">
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className={`bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-sm flex items-center gap-2 ${
//                 isFormDisabled ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//               disabled={isFormDisabled}
//             >
//               {expenseType
//                 ? expenseType === 'Operational Payment' && expenseSubType
//                   ? `${expenseType} - ${expenseSubType}`
//                   : expenseType
//                 : 'Select Expense Type'}
//               <ChevronDown className={`w-5 h-5 transform ${isDropdownOpen ? 'rotate-180' : ''} transition-transform`} />
//             </button>
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10 border border-gray-200">
//                 <ul className="py-2">
//                   {expenseTypes
//                     .filter((et) => !et.subtype || et.type === 'GIG Payment')
//                     .map((et) => (
//                       <li key={et.id}>
//                         <button
//                           onClick={() => handleSelectExpenseType(et.type, et.subtype, et.id)}
//                           className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-300"
//                         >
//                           {et.type}
//                         </button>
//                       </li>
//                     ))}
//                   <li
//                     className="relative"
//                     onMouseEnter={() => setIsSubMenuOpen(true)}
//                     onMouseLeave={() => setIsSubMenuOpen(false)}
//                   >
//                     <button
//                       onClick={() => setIsSubMenuOpen(!isSubMenuOpen)}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-300 flex items-center justify-between"
//                     >
//                       Operational Payment
//                       <ChevronDown className={`w-4 h-4 transform ${isSubMenuOpen ? 'rotate-180' : ''} transition-transform`} />
//                     </button>
//                     {isSubMenuOpen && (
//                       <ul className="absolute left-full top-0 mt-0 w-56 bg-white rounded-lg shadow-xl border border-gray-200">
//                         {expenseTypes
//                           .filter((et) => et.type === 'Operational Payment' && et.subtype)
//                           .map((et) => (
//                             <li key={et.id}>
//                               <button
//                                 onClick={() => handleSelectExpenseType(et.type, et.subtype, et.id)}
//                                 className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-300"
//                               >
//                                 {et.subtype}
//                               </button>
//                             </li>
//                           ))}
//                         <li>
//                           <button
//                             onClick={handleAddCustomSubOption}
//                             className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition duration-300"
//                           >
//                             Other
//                           </button>
//                         </li>
//                       </ul>
//                     )}
//                   </li>
//                 </ul>
//               </div>
//             )}
//           </div>
//         </div>

//         {isFormOpen && (
//           <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Payable Transaction</h2>
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="flex items-end space-x-4">
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700">Project Name</label>
//                     <select
//                       name="projectId"
//                       value={formData.projectId}
//                       onChange={handleInputChange}
//                       className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                         isFormDisabled
//                           ? 'bg-gray-100 cursor-not-allowed'
//                           : 'focus:border-indigo-500 focus:ring-indigo-500'
//                       }`}
//                       disabled={formData.projectId && paidProjects[formData.projectId]?.isPaid}
//                     >
//                       <option value="">Select Project</option>
//                       {projects.map((project) => (
//                         <option key={project.project_id} value={project.project_id}>
//                           {project.project_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   {formData.totalAmount && (
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium text-gray-700">Total Project Amount (₹)</label>
//                       <div className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 font-medium">
//                         ₹{parseFloat(formData.totalAmount).toFixed(2)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Client Name</label>
//                   <input
//                     type="text"
//                     name="clientName"
//                     value={formData.clientName}
//                     onChange={handleInputChange}
//                     className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                       isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                     }`}
//                     placeholder="Enter client name"
//                     disabled={isFormDisabled}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700">Team Size (Number of Students)</label>
//                   <input
//                     type="number"
//                     name="teamSize"
//                     value={formData.teamSize}
//                     onChange={handleInputChange}
//                     className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                       isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                     }`}
//                     placeholder="Enter number of students"
//                     disabled={isFormDisabled}
//                   />
//                 </div>
//               </div>

//               {formData.students.length > 0 && (
//                 <div className="border-t pt-4">
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Details</h3>
//                   {formData.students.map((student, index) => (
//                     <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50 shadow-sm">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Student {index + 1}</label>
//                           <select
//                             value={student.studentId}
//                             onChange={(e) => handleStudentInputChange(index, 'studentId', e.target.value)}
//                             className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                               isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                             }`}
//                             disabled={isFormDisabled}
//                           >
//                             <option value="">Select Student</option>
//                             {students.map((s) => (
//                               <option key={s.student_id} value={s.student_id}>
//                                 {s.name} ({s.roll_no})
//                               </option>
//                             ))}
//                           </select>
//                         </div>
//                         <div className="flex items-end gap-2">
//                           <div className="flex-1">
//                             <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
//                             <input
//                               type="number"
//                               value={student.amount}
//                               onChange={(e) => handleStudentInputChange(index, 'amount', e.target.value)}
//                               readOnly={!editableFields[`student-${index}`]}
//                               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                                 isFormDisabled || !editableFields[`student-${index}`]
//                                   ? 'bg-gray-100 cursor-not-allowed'
//                                   : 'focus:border-indigo-500 focus:ring-indigo-500'
//                               }`}
//                               placeholder="Enter amount"
//                               disabled={isFormDisabled}
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             onClick={() => toggleEditableField(`student-${index}`)}
//                             className="mt-1 p-2 text-gray-500 hover:text-indigo-600 transition duration-300"
//                             disabled={isFormDisabled}
//                           >
//                             <Edit className="w-5 h-5" />
//                           </button>
//                         </div>
//                         {student.amount !== student.defaultAmount && (
//                           <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-gray-700">Description for Amount</label>
//                             <textarea
//                               value={student.amountDescription}
//                               onChange={(e) => handleStudentInputChange(index, 'amountDescription', e.target.value)}
//                               className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                                 isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                               }`}
//                               placeholder="Reason for modifying the amount"
//                               rows="2"
//                               disabled={isFormDisabled}
//                             />
//                           </div>
//                         )}
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">From UPI ID</label>
//                           <input
//                             type="text"
//                             value={student.fromUpiId}
//                             onChange={(e) => handleStudentInputChange(index, 'fromUpiId', e.target.value)}
//                             className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                               isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                             }`}
//                             placeholder="admin@upi"
//                             disabled={isFormDisabled}
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">To UPI ID</label>
//                           <input
//                             type="text"
//                             value={student.toUpiId}
//                             onChange={(e) => handleStudentInputChange(index, 'toUpiId', e.target.value)}
//                             className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                               isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                             }`}
//                             placeholder="student@upi"
//                             disabled={isFormDisabled}
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Transaction ID/UTL</label>
//                           <input
//                             type="text"
//                             value={student.transactionId}
//                             onChange={(e) => handleStudentInputChange(index, 'transactionId', e.target.value)}
//                             className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                               isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                             }`}
//                             placeholder="Enter transaction ID/UTL"
//                             disabled={isFormDisabled}
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Date & Time</label>
//                           <DatePicker
//                             selected={student.dateTime}
//                             onChange={(date) => handleStudentDateChange(index, date)}
//                             showTimeSelect
//                             dateFormat="Pp"
//                             className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                               isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                             }`}
//                             disabled={isFormDisabled}
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-gray-700">Transaction Screenshot</label>
//                           {paidProjects[formData.projectId]?.isPaid &&
//                           student.transactionScreenshot === null &&
//                           student.transaction_screenshot ? (
//                             <div className="mt-1 text-sm text-gray-600">
//                               <a
//                                 href={`https://gig.kggeniuslabs.com/api${student.transaction_screenshot}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="text-indigo-600 hover:underline"
//                               >
//                                 View Saved Screenshot
//                               </a>
//                             </div>
//                           ) : (
//                             <input
//                               type="file"
//                               onChange={(e) => handleStudentFileChange(index, e)}
//                               className={`mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 ${
//                                 isFormDisabled ? 'cursor-not-allowed opacity-50' : ''
//                               }`}
//                               accept="image/jpeg,image/jpg,image/png,application/pdf"
//                               disabled={isFormDisabled}
//                             />
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               <div className="border-t pt-4">
//                 <h3 className="text-lg font-semibold text-gray-800 mb-4">Petty Cash</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="flex items-end gap-2">
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium text-gray-700">Petty Cash Amount (₹)</label>
//                       <input
//                         type="number"
//                         name="pettyCash"
//                         value={formData.pettyCash}
//                         onChange={handleInputChange}
//                         readOnly={!editableFields.pettyCash}
//                         className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                           isFormDisabled || !editableFields.pettyCash
//                             ? 'bg-gray-100 cursor-not-allowed'
//                             : 'focus:border-indigo-500 focus:ring-indigo-500'
//                         }`}
//                         placeholder="Enter petty cash amount"
//                         disabled={isFormDisabled}
//                       />
//                     </div>
//                     <button
//                       type="button"
//                       onClick={() => toggleEditableField('pettyCash')}
//                       className="mt-1 p-2 text-gray-500 hover:text-indigo-600 transition duration-300"
//                       disabled={isFormDisabled}
//                     >
//                       <Edit className="w-5 h-5" />
//                     </button>
//                   </div>
//                   {formData.pettyCash !== (formData.totalAmount * 0.1).toFixed(2) && (
//                     <div className="md:col-span-2">
//                       <label className="block text-sm font-medium text-gray-700">Description for Petty Cash</label>
//                       <textarea
//                         name="pettyCashDescription"
//                         value={formData.pettyCashDescription}
//                         onChange={handleInputChange}
//                         className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-3 px-4 ${
//                           isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-indigo-500 focus:ring-indigo-500'
//                         }`}
//                         placeholder="Reason for modifying the petty cash amount"
//                         rows="2"
//                         disabled={isFormDisabled}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   type="submit"
//                   className={`bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-sm font-medium ${
//                     isFormDisabled ? 'disabled:bg-gray-400 disabled:cursor-not-allowed' : ''
//                   }`}
//                   disabled={isFormDisabled}
//                 >
//                   Submit Payable
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">Payable History</h2>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-indigo-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Expense Type
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Project
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Client
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Petty Cash
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Students
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Screenshots
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {transactions.map((transaction) => {
//                   const studentDetails =
//                     typeof transaction.student_details === 'string'
//                       ? JSON.parse(transaction.student_details)
//                       : transaction.student_details;
//                   return (
//                     <tr key={transaction.id} className="hover:bg-gray-50 transition duration-200">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         {transaction.expense_type === 'Operational Payment' && transaction.expense_subtype
//                           ? `${transaction.expense_type} - ${transaction.expense_subtype}`
//                           : transaction.expense_type}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.project_name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.client_name}</td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         ₹{parseFloat(transaction.petty_cash).toFixed(2)}
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         <ul className="list-disc list-inside">
//                           {studentDetails.map((student, index) => (
//                             <li key={index}>
//                               {student.name}: ₹{parseFloat(student.amount).toFixed(2)}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-700">
//                         <ul className="list-disc list-inside">
//                           {studentDetails.map((student, index) => (
//                             <li key={index}>
//                               {student.transaction_screenshot ? (
//                                 <button
//                                   onClick={() => viewScreenshot(student.transaction_screenshot)}
//                                   className="text-indigo-600 hover:underline flex items-center gap-2 font-medium"
//                                 >
//                                   <Eye className="w-4 h-4" /> View
//                                 </button>
//                               ) : (
//                                 'N/A'
//                               )}
//                             </li>
//                           ))}
//                         </ul>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                         <button
//                           onClick={() => showTransactionDetails(transaction)}
//                           className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-sm font-medium"
//                         >
//                           View Details
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PayableLedger;







import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { PhotoProvider, PhotoView } from 'react-photo-view';
import 'react-photo-view/dist/react-photo-view.css';
import { 
  Edit, ChevronDown, ChevronUp, Eye, PlusCircle, X, Download, FileText, User, 
  Calendar, Check, AlertTriangle, Wallet, Maximize2, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';
import { debounce } from 'lodash';

const MySwal = withReactContent(Swal);

const formatDateForMySQL = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

const projectColors = [
  'bg-teal-50 border-l-4 border-teal-500',
  'bg-indigo-50 border-l-4 border-indigo-500',
  'bg-emerald-50 border-l-4 border-emerald-500',
  'bg-cyan-50 border-l-4 border-cyan-500',
];

const PayableLedger = () => {
  const { id } = useParams();
  const [createdBy, setCreatedBy] = useState(null);
  const [expenseType, setExpenseType] = useState('');
  const [expenseSubType, setExpenseSubType] = useState('');
  const [expenseTypes, setExpenseTypes] = useState([]);
  const [customSubOptions, setCustomSubOptions] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [students, setStudents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    clientName: '',
    totalAmount: '',
    teamSize: '',
    students: [],
    pettyCash: '',
    pettyCashDescription: '',
    expenseTypeId: '',
  });
  const [editableFields, setEditableFields] = useState({});
  const [modifiedFields, setModifiedFields] = useState({});
  const [projectStatus, setProjectStatus] = useState({});
  const [paidProjects, setPaidProjects] = useState({});
  const [expandedStudents, setExpandedStudents] = useState({});
  const [paymentStatusMessage, setPaymentStatusMessage] = useState(null);

  useEffect(() => {
    try {
      if (!id) throw new Error('No ID provided in the URL.');
      const decodedId = atob(id);
      const parsedId = parseInt(decodedId, 10);
      if (isNaN(parsedId)) throw new Error('Decoded ID is not a valid integer.');
      setCreatedBy(parsedId);
    } catch (error) {
      console.error('Error decoding ID:', error.message);
      MySwal.fire({
        icon: 'error',
        title: 'Invalid ID',
        text: 'The ID in the URL is invalid or not properly encoded.',
      });
    }
  }, [id]);

  const fetchData = useCallback(async () => {
    if (createdBy === null) return;
    try {
      const [expenseResponse, studentsResponse, projectsResponse, historyResponse, receivableResponse] = await Promise.all([
        axios.get('https://gig.kggeniuslabs.com/apiapi/admin/expense-types'),
        axios.get('https://gig.kggeniuslabs.com/apiapi/admin/student-details'),
        axios.get('https://gig.kggeniuslabs.com/apiapi/admin/getallprojects'),
        axios.get('https://gig.kggeniuslabs.com/apiapi/admin/payable-ledger-history'),
        axios.get('https://gig.kggeniuslabs.com/apiapi/admin/receivable-ledger-history'),
      ]);

      if (expenseResponse.data.status) setExpenseTypes(expenseResponse.data.result);
      if (studentsResponse.data.status) setStudents(studentsResponse.data.result);
      if (projectsResponse.data.length > 0) {
        setProjects(projectsResponse.data);
        const lastProject = projectsResponse.data[projectsResponse.data.length - 1];
        handleProjectSelect(lastProject, false);
      }
      if (historyResponse.data.status) setTransactions(historyResponse.data.result);

      const status = {};
      projectsResponse.data.forEach((project) => {
        const totalAmount = parseFloat(project.total_amount);
        const paidAmount = receivableResponse.data.result
          .filter((t) => t.project_name === project.project_name)
          .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
        status[project.project_id] = {
          totalAmount: totalAmount.toFixed(2),
          paidAmount: paidAmount.toFixed(2),
          isComplete: Math.abs(totalAmount - paidAmount) < 0.01,
          balanceAmount: (totalAmount - paidAmount).toFixed(2),
        };
      });
      setProjectStatus(status);

      const paid = {};
      historyResponse.data.result.forEach((transaction) => {
        const project = projectsResponse.data.find((p) => p.project_name === transaction.project_name);
        if (project) {
          paid[project.project_id] = {
            isPaid: true,
            details: {
              projectId: project.project_id,
              projectName: project.project_name,
              clientName: transaction.client_name,
              totalAmount: parseFloat(project.total_amount).toFixed(2),
              teamSize: transaction.team_size,
              pettyCash: parseFloat(transaction.petty_cash).toFixed(2),
              pettyCashDescription: transaction.pettycash_description || '',
              expenseTypeId: transaction.expense_type_id,
              students: (typeof transaction.student_details === 'string'
                ? JSON.parse(transaction.student_details)
                : transaction.student_details
              ).map((s) => ({
                studentId: s.studentId || '',
                name: s.name || '',
                defaultAmount: parseFloat(s.amount).toFixed(2),
                amount: parseFloat(s.amount).toFixed(2),
                amountDescription: s.amountDescription || '',
                fromUpiId: s.fromUpiId || '',
                toUpiId: s.toUpiId || '',
                transactionId: s.transactionId || '',
                dateTime: new Date(s.dateTime || new Date()),
                transactionScreenshot: null,
                transaction_screenshot: s.transaction_screenshot || null,
              })),
            },
          };
        }
      });
      setPaidProjects(paid);
    } catch (error) {
      console.error('Error fetching data:', error.message);
      MySwal.fire({ icon: 'error', title: 'Fetch Error', text: 'Failed to fetch initial data.' });
    }
  }, [createdBy]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const toggleStudentExpansion = useCallback((transactionId, studentId) => {
    setExpandedStudents(prev => ({
      ...prev,
      [`${transactionId}-${studentId}`]: !prev[`${transactionId}-${studentId}`]
    }));
  }, []);

  const handleProjectSelect = useCallback((project, showForm = true) => {
    setSelectedProject(project);
    const status = projectStatus[project.project_id];
    
    setPaymentStatusMessage(null); // Clear message initially

    if (status?.isComplete) {
      if (paidProjects[project.project_id]?.isPaid) {
        setPaymentStatusMessage({
          type: 'info',
          text: 'This project has already been processed in the payable ledger.',
          icon: <Check className="w-5 h-5 text-teal-500" />
        });
      } else {
        setPaymentStatusMessage({
          type: 'success',
          text: 'Project is fully paid and ready for payable processing.',
          icon: <Check className="w-5 h-5 text-emerald-500" />
        });
      }
    } else {
      setPaymentStatusMessage({
        type: 'warning',
        text: `Project payment is incomplete from client. Balance amount: ₹${status?.balanceAmount || 0}. Cannot process payable until full payment is received.`,
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        note: 'Payable transactions can only be processed after receiving full payment from the client.'
      });
    }

    const totalAmount = parseFloat(project.total_amount).toFixed(2);
    let newFormData = {
      projectId: project.project_id,
      projectName: project.project_name,
      clientName: project.client_name,
      totalAmount,
      teamSize: '',
      students: [],
      pettyCash: (totalAmount * 0.1).toFixed(2),
      pettyCashDescription: '',
      expenseTypeId: formData.expenseTypeId,
    };

    if (paidProjects[project.project_id]?.isPaid) {
      const savedDetails = paidProjects[project.project_id].details;
      newFormData = {
        ...newFormData,
        ...savedDetails,
        totalAmount,
      };
      setExpenseType(
        expenseTypes.find((et) => et.id === savedDetails.expenseTypeId)?.type || ''
      );
      setExpenseSubType(
        expenseTypes.find((et) => et.id === savedDetails.expenseTypeId)?.subtype || ''
      );
      setIsFormOpen(showForm);
    }

    setFormData(newFormData);
    setEditableFields({ pettyCash: false });
    setModifiedFields({ pettyCash: false });
    updateProjectSummary(project.project_name);
  }, [projectStatus, paidProjects, formData.expenseTypeId, expenseTypes]);

  const updateProjectSummary = useCallback((projectName = selectedProject?.project_name) => {
    if (!projectName) return;
    
    const project = projects.find(p => p.project_name === projectName);
    if (!project) return;

    const projectTransactions = transactions.filter(t => t.project_name === projectName);
    const paid = projectTransactions.reduce((sum, t) => sum + parseFloat(t.petty_cash) + 
      (typeof t.student_details === 'string' 
        ? JSON.parse(t.student_details).reduce((s, st) => s + parseFloat(st.amount), 0)
        : t.student_details.reduce((s, st) => s + parseFloat(st.amount), 0)), 0);
    
    setTotalPaid(paid);
    setBalanceAmount(parseFloat(project.total_amount) - paid);
  }, [projects, transactions, selectedProject]);

  const handleSelectExpenseType = useCallback((option) => {
    if (option.value === 'add-custom') {
      handleAddCustomSubOption();
      return;
    }
    
    const type = expenseTypes.find(et => et.id === option.value);
    if (type) {
      setExpenseType(type.type);
      setExpenseSubType(type.subtype || '');
      setFormData(prev => ({ ...prev, expenseTypeId: type.id }));
      setIsFormOpen(true);
    }
  }, [expenseTypes]);

  const handleAddCustomSubOption = useCallback(() => {
    MySwal.fire({
      title: 'Add Custom Operational Expense',
      input: 'text',
      inputPlaceholder: 'Enter custom expense type (e.g., Travel)',
      showCancelButton: true,
      confirmButtonText: 'Add',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'rounded-xl shadow-lg p-6 bg-white max-w-sm',
        title: 'text-base font-semibold text-gray-900 mb-4',
        input: 'border-gray-300 rounded-md text-sm focus:border-teal-500 focus:ring-teal-500 py-2 px-3',
        confirmButton: 'bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300 text-sm ml-2',
        cancelButton: 'bg-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-300 transition duration-300 text-sm',
      },
      preConfirm: (value) => {
        if (!value || value.trim() === '') {
          MySwal.showValidationMessage('Please enter a valid expense type.');
        } else if (
          expenseTypes.some((et) => et.subtype === value.trim() && et.type === 'Operational Payment') ||
          customSubOptions.includes(value.trim())
        ) {
          MySwal.showValidationMessage('This expense type already exists.');
        } else {
          return value.trim();
        }
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newSubOption = result.value;
        try {
          const response = await axios.post('https://gig.kggeniuslabs.com/apiapi/admin/expense-types', {
            type: 'Operational Payment',
            subtype: newSubOption,
          });
          if (response.data.status) {
            setExpenseTypes([...expenseTypes, response.data.result]);
            setCustomSubOptions([...customSubOptions, newSubOption]);
            handleSelectExpenseType({ value: response.data.result.id });
          }
        } catch (error) {
          console.error('Error adding custom sub-type:', error.message);
          MySwal.fire({ icon: 'error', title: 'Error', text: 'Failed to add custom expense type.' });
        }
      }
    });
  }, [expenseTypes, customSubOptions, handleSelectExpenseType]);

  const resetForm = useCallback(() => {
    setExpenseType('');
    setExpenseSubType('');
    setIsFormOpen(false);
    setFormData({
      projectId: '',
      projectName: '',
      clientName: '',
      totalAmount: '',
      teamSize: '',
      students: [],
      pettyCash: '',
      pettyCashDescription: '',
      expenseTypeId: '',
    });
    setEditableFields({});
    setModifiedFields({});
    if (projects.length > 0) {
      handleProjectSelect(projects[projects.length - 1], false);
    }
  }, [projects, handleProjectSelect]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'teamSize') {
      const teamSize = parseInt(value) || 0;
      const studentAmount = formData.totalAmount ? (formData.totalAmount * 0.9) / (teamSize || 1) : 0;
      const students = Array.from({ length: teamSize }, () => ({
        studentId: '',
        name: '',
        defaultAmount: studentAmount.toFixed(2),
        amount: studentAmount.toFixed(2),
        amountDescription: '',
        fromUpiId: '',
        toUpiId: '',
        transactionId: '',
        dateTime: new Date(),
        transactionScreenshot: null,
      }));
      setFormData((prev) => ({
        ...prev,
        teamSize: value,
        students,
        pettyCash: formData.totalAmount ? (formData.totalAmount * 0.1).toFixed(2) : '',
      }));
      setEditableFields((prev) => {
        const newEditableFields = { pettyCash: prev.pettyCash };
        for (let i = 0; i < teamSize; i++) {
          newEditableFields[`student-${i}`] = false;
        }
        return newEditableFields;
      });
      setModifiedFields((prev) => {
        const newModifiedFields = { pettyCash: prev.pettyCash };
        for (let i = 0; i < teamSize; i++) {
          newModifiedFields[`student-${i}`] = false;
        }
        return newModifiedFields;
      });
    } else if (name === 'pettyCash') {
      const numericValue = parseFloat(value) || 0;
      const defaultPettyCash = (parseFloat(formData.totalAmount) * 0.1).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        pettyCash: value,
        pettyCashDescription: numericValue !== parseFloat(defaultPettyCash) ? prev.pettyCashDescription : '',
      }));
      setModifiedFields((prev) => ({
        ...prev,
        pettyCash: numericValue !== parseFloat(defaultPettyCash),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }, [formData.totalAmount]);

  const handleStudentInputChange = useCallback((index, field, value) => {
    const updatedStudents = [...formData.students];
    if (field === 'studentId') {
      const selectedStudent = students.find((s) => s.student_id === parseInt(value));
      updatedStudents[index] = {
        ...updatedStudents[index],
        studentId: value,
        name: selectedStudent ? selectedStudent.name : '',
      };
    } else if (field === 'amount') {
      const defaultAmount = updatedStudents[index].defaultAmount;
      updatedStudents[index] = {
        ...updatedStudents[index],
        amount: value,
        amountDescription: value !== defaultAmount ? updatedStudents[index].amountDescription : '',
      };
      setModifiedFields((prev) => ({
        ...prev,
        [`student-${index}`]: value !== defaultAmount,
      }));
    } else {
      updatedStudents[index] = { ...updatedStudents[index], [field]: value };
    }
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  }, [formData.students, students]);

  const handleStudentDateChange = useCallback((index, date) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], dateTime: date };
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  }, [formData.students]);

  const handleStudentFileChange = useCallback((index, e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a JPEG, PNG, or PDF file.',
      });
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      MySwal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 5MB.',
      });
      return;
    }
    const updatedStudents = [...formData.students];
    updatedStudents[index] = { ...updatedStudents[index], transactionScreenshot: file };
    setFormData((prev) => ({ ...prev, students: updatedStudents }));
  }, [formData.students]);

  const toggleEditableField = useCallback((field) => {
    setEditableFields((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  }, []);

  const validateForm = useCallback(() => {
    const { projectId, clientName, totalAmount, teamSize, students, pettyCash, expenseTypeId } = formData;

    if (paidProjects[projectId]?.isPaid) {
      toast.info('This project has already been processed in the payable ledger.', {
        icon: <Check className="w-6 h-6 text-teal-500" />,
      });
      return false;
    }

    if (!projectStatus[projectId]?.isComplete) {
      toast.warning('The full payment for this project has not been received from the client.', {
        icon: <AlertTriangle className="w-6 h-6 text-amber-500" />,
      });
      return false;
    }

    if (!projectId || !clientName || !totalAmount || !teamSize || !pettyCash || !expenseTypeId) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'All required fields must be filled.',
      });
      return false;
    }

    const parsedTeamSize = parseInt(teamSize);
    if (isNaN(parsedTeamSize) || parsedTeamSize <= 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Team size must be a positive integer.',
      });
      return false;
    }

    if (students.length !== parsedTeamSize) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Number of students must match the team size.',
      });
      return false;
    }

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      if (!student.studentId || !student.name || !student.amount || !student.fromUpiId || 
          !student.toUpiId || !student.transactionId || !student.dateTime || !student.transactionScreenshot) {
        MySwal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `All fields for Student ${i + 1} are required.`,
        });
        return false;
      }
      const studentAmount = parseFloat(student.amount);
      if (isNaN(studentAmount) || studentAmount < 0) {
        MySwal.fire({
          icon: 'error',
          title: 'Invalid Input',
          text: `Amount for Student ${i + 1} must be a non-negative number.`,
        });
        return false;
      }
      if (modifiedFields[`student-${i}`] && !student.amountDescription) {
        MySwal.fire({
          icon: 'error',
          title: 'Missing Field',
          text: `Please provide a description for the modified amount of Student ${i + 1}.`,
        });
        return false;
      }
    }

    const parsedPettyCash = parseFloat(pettyCash);
    if (isNaN(parsedPettyCash) || parsedPettyCash < 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: 'Petty cash must be a non-negative number.',
      });
      return false;
    }
    if (modifiedFields.pettyCash && !formData.pettyCashDescription) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Field',
        text: 'Please provide a description for the modified petty cash amount.',
      });
      return false;
    }

    const totalStudentAmount = students.reduce((sum, student) => sum + parseFloat(student.amount), 0);
    const totalDistributed = totalStudentAmount + parsedPettyCash;
    if (Math.abs(totalDistributed - parseFloat(totalAmount)) > 0.01) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Input',
        text: `Total distributed amount (₹${totalDistributed.toFixed(2)}) must equal the total project amount (₹${parseFloat(totalAmount).toFixed(2)}).`,
      });
      return false;
    }

    return true;
  }, [formData, paidProjects, projectStatus, modifiedFields]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('expense_type_id', formData.expenseTypeId);
      formDataToSend.append('project_id', formData.projectId);
      formDataToSend.append('client_name', formData.clientName);
      formDataToSend.append('team_size', formData.teamSize);
      formDataToSend.append('student_details', JSON.stringify(formData.students.map(s => ({
        studentId: s.studentId,
        name: s.name,
        amount: s.amount,
        amountDescription: s.amountDescription,
        fromUpiId: s.fromUpiId,
        toUpiId: s.toUpiId,
        transactionId: s.transactionId,
        dateTime: s.dateTime.toISOString(),
      }))));
      formDataToSend.append('petty_cash', formData.pettyCash);
      if (formData.pettyCashDescription) {
        formDataToSend.append('pettycash_description', formData.pettyCashDescription);
      }
      formDataToSend.append('created_by', String(createdBy));

      formData.students.forEach((student, index) => {
        if (student.transactionScreenshot instanceof File) {
          formDataToSend.append(`student_details[${index}][transaction_screenshot]`, student.transactionScreenshot);
        }
      });

      const response = await axios.post(
        'https://gig.kggeniuslabs.com/apiapi/admin/save-payable-ledger',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status) {
        toast.success('Transaction recorded successfully!', {
          icon: <Check className="w-6 h-6 text-emerald-500" />,
        });
        const historyResponse = await axios.get('https://gig.kggeniuslabs.com/apiapi/admin/payable-ledger-history');
        if (historyResponse.data.status) {
          setTransactions(historyResponse.data.result);
          updateProjectSummary();
        }
        resetForm();
      }
    } catch (error) {
      console.error('Error submitting payable ledger:', error);
      toast.error(error.response?.data?.msg || 'Failed to save transaction.', {
        icon: <X className="w-6 h-6 text-red-500" />,
      });
    }
  }, [formData, createdBy, validateForm, resetForm, updateProjectSummary]);

  const showTransactionDetails = useCallback((transaction) => {
    const studentDetails = typeof transaction.student_details === 'string'
      ? JSON.parse(transaction.student_details)
      : transaction.student_details;

    MySwal.fire({
      title: (
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-teal-600" />
          <span>Transaction Details</span>
        </div>
      ),
      html: (
        <PhotoProvider>
          <div className="text-left space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-teal-50 p-3 rounded-lg">
                <div className="text-xs text-teal-600 font-medium">Expense Type</div>
                <div className="font-semibold">
                  {transaction.expense_type === 'Operational Payment' && transaction.expense_subtype
                    ? `${transaction.expense_type} - ${transaction.expense_subtype}`
                    : transaction.expense_type}
                </div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <div className="text-xs text-teal-600 font-medium">Project</div>
                <div className="font-semibold">{transaction.project_name}</div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <div className="text-xs text-teal-600 font-medium">Client</div>
                <div className="font-semibold">{transaction.client_name}</div>
              </div>
              <div className="bg-teal-50 p-3 rounded-lg">
                <div className="text-xs text-teal-600 font-medium">Petty Cash</div>
                <div className="font-semibold">₹{parseFloat(transaction.petty_cash).toFixed(2)}</div>
              </div>
              {transaction.pettycash_description && (
                <div className="bg-teal-50 p-3 rounded-lg col-span-2">
                  <div className="text-xs text-teal-600 font-medium">Petty Cash Description</div>
                  <div className="font-semibold">{transaction.pettycash_description}</div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h3 className="font-medium text-gray-900">Student Payments</h3>
              <div className="space-y-2">
                {studentDetails.map((student, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div 
                      className="p-3 flex justify-between items-center cursor-pointer hover:bg-teal-50 transition"
                      onClick={() => toggleStudentExpansion(transaction.id, student.studentId)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium">{student.name}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="font-bold">₹{parseFloat(student.amount).toFixed(2)}</div>
                        {expandedStudents[`${transaction.id}-${student.studentId}`] ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedStudents[`${transaction.id}-${student.studentId}`] && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="p-3 border-t border-gray-200 bg-gray-50 space-y-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <div className="text-xs text-gray-500 font-medium">Transaction ID</div>
                                <div className="font-mono text-sm">{student.transactionId}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 font-medium">Date & Time</div>
                                <div className="text-sm">{new Date(student.dateTime).toLocaleString()}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 font-medium">From UPI</div>
                                <div className="font-mono text-sm">{student.fromUpiId}</div>
                              </div>
                              <div>
                                <div className="text-xs text-gray-500 font-medium">To UPI</div>
                                <div className="font-mono text-sm">{student.toUpiId}</div>
                              </div>
                            </div>
                            {student.transaction_screenshot && (
                              <div>
                                <div className="text-xs text-gray-500 font-medium mb-1">Transaction Proof</div>
                                <div className="relative">
                                  <PhotoView src={`https://gig.kggeniuslabs.com/api${student.transaction_screenshot}`}>
                                    <img 
                                      src={`https://gig.kggeniuslabs.com/api${student.transaction_screenshot}`} 
                                      alt="Transaction Screenshot" 
                                      className="rounded-lg border border-gray-200 w-full h-auto max-h-40 object-contain cursor-pointer"
                                    />
                                  </PhotoView>
                                  <div className="absolute bottom-2 right-2 flex gap-2">
                                    <a 
                                      href={`https://gig.kggeniuslabs.com/api${student.transaction_screenshot}`} 
                                      download
                                      className="bg-white/90 p-1.5 rounded-full shadow hover:bg-white transition"
                                    >
                                      <Download className="w-4 h-4 text-teal-600" />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-0.5 text-teal-600" />
              <div>
                <div className="text-sm font-medium text-gray-500">Recorded By</div>
                <div>{transaction.created_by_name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(transaction.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </PhotoProvider>
      ),
      showCloseButton: true,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'rounded-xl shadow-xl p-6 bg-white max-w-2xl',
        title: 'text-xl font-bold text-gray-900 mb-2 flex items-center gap-2',
        htmlContainer: 'text-gray-700',
        confirmButton: 'bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition duration-300 text-sm font-medium',
      },
    });
  }, [expandedStudents, toggleStudentExpansion]);

  const groupedTransactions = useMemo(() => {
    return transactions.reduce((acc, transaction) => {
      const projectName = transaction.project_name;
      if (!acc[projectName]) {
        acc[projectName] = [];
      }
      acc[projectName].push(transaction);
      return acc;
    }, {});
  }, [transactions]);

  const projectColorMap = useMemo(() => {
    const map = {};
    Object.keys(groupedTransactions).forEach((projectName, index) => {
      map[projectName] = projectColors[index % projectColors.length];
    });
    return map;
  }, [groupedTransactions]);

  const expenseTypeOptions = useMemo(() => [
    ...expenseTypes
      .filter(et => !et.subtype || et.type === 'GIG Payment')
      .map(et => ({
        value: et.id,
        label: et.type,
      })),
    {
      label: 'Operational Payment',
      options: [
        ...expenseTypes
          .filter(et => et.type === 'Operational Payment' && et.subtype)
          .map(et => ({
            value: et.id,
            label: et.subtype,
          })),
        {
          value: 'add-custom',
          label: 'Add Custom Type...',
          isCreateOption: true,
        },
      ],
    },
  ], [expenseTypes]);

  const isFormDisabled = useMemo(() => 
    (formData.projectId && !projectStatus[formData.projectId]?.isComplete) || 
    (formData.projectId && paidProjects[formData.projectId]?.isPaid),
  [formData.projectId, projectStatus, paidProjects]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Payment Status Banner */}
        <AnimatePresence>
          {paymentStatusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`rounded-xl p-4 shadow-md ${
                paymentStatusMessage.type === 'success' ? 'bg-emerald-50 border border-emerald-200' :
                paymentStatusMessage.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                'bg-teal-50 border border-teal-200'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{paymentStatusMessage.icon}</div>
                <div className="text-sm">
                  <div className="font-medium">{paymentStatusMessage.text}</div>
                  {paymentStatusMessage.note && (
                    <div className="text-xs mt-1 text-gray-600">{paymentStatusMessage.note}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-teal-600" />
            Payable Ledger
          </h1>
          <Select
            options={expenseTypeOptions}
            onChange={handleSelectExpenseType}
            placeholder="Select Expense Type"
            className="w-full sm:w-64 text-sm"
            isSearchable
            isDisabled={isFormDisabled && !isFormOpen}
            menuPortalTarget={document.body}
            styles={{
              menuPortal: base => ({ ...base, zIndex: 9999 }),
              control: (base) => ({
                ...base,
                minHeight: '44px',
                borderRadius: '0.5rem',
                borderColor: '#e5e7eb',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                '&:hover': {
                  borderColor: '#14b8a6',
                },
              }),
              option: (base, { isFocused, isSelected }) => ({
                ...base,
                backgroundColor: isSelected ? '#14b8a6' : isFocused ? '#e0f2fe' : 'white',
                color: isSelected ? 'white' : '#1f2937',
                '&:active': {
                  backgroundColor: '#14b8a6',
                  color: 'white',
                },
              }),
            }}
          />
        </div>

        {/* Project Summary Card */}
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProject.project_name}</h2>
                  <p className="text-gray-600 text-sm">{selectedProject.client_name}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-teal-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-teal-600 font-medium">Total Amount</div>
                    <div className="text-lg font-bold text-teal-800">₹{parseFloat(selectedProject.total_amount).toFixed(2)}</div>
                  </div>
                  <div className="bg-emerald-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-emerald-600 font-medium">Paid Amount</div>
                    <div className="text-lg font-bold text-emerald-800">₹{totalPaid.toFixed(2)}</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${balanceAmount <= 0 ? 'bg-gray-100' : 'bg-amber-50'}`}>
                    <div className={`text-xs font-medium ${balanceAmount <= 0 ? 'text-gray-600' : 'text-amber-600'}`}>
                      {balanceAmount <= 0 ? 'Status' : 'Balance Amount'}
                    </div>
                    <div className={`text-lg font-bold ${balanceAmount <= 0 ? 'text-gray-800' : 'text-amber-800'}`}>
                      {balanceAmount <= 0 ? 'Completed' : `₹${balanceAmount.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {projects.map(project => (
                  <motion.button
                    key={project.project_id}
                    onClick={() => handleProjectSelect(project)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition shadow-sm ${
                      selectedProject.project_id === project.project_id 
                        ? 'bg-teal-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {project.project_name}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Add Transaction Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-teal-600" />
                    Add Transaction
                    {expenseSubType && (
                      <span className="text-sm font-normal text-gray-500">({expenseType} - {expenseSubType})</span>
                    )}
                    {!expenseSubType && expenseType && (
                      <span className="text-sm font-normal text-gray-500">({expenseType})</span>
                    )}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={resetForm}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
                      <select
                        name="projectId"
                        value={formData.projectId}
                        onChange={(e) => {
                          const project = projects.find(p => p.project_id === parseInt(e.target.value));
                          if (project) handleProjectSelect(project);
                        }}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 text-sm py-3 px-4"
                        required
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project.project_id} value={project.project_id}>
                            {project.project_name} (₹{parseFloat(project.total_amount).toFixed(2)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                          isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                        }`}
                        placeholder="Enter client name"
                        required
                        disabled={isFormDisabled}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
                      <input
                        type="number"
                        name="teamSize"
                        value={formData.teamSize}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                          isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                        }`}
                        placeholder="Enter number of students"
                        required
                        disabled={isFormDisabled}
                        min="1"
                      />
                    </div>

                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Petty Cash (₹)</label>
                        <input
                          type="number"
                          name="pettyCash"
                          value={formData.pettyCash}
                          onChange={handleInputChange}
                          readOnly={!editableFields.pettyCash}
                          className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                            !editableFields.pettyCash || isFormDisabled
                              ? 'bg-gray-100 cursor-not-allowed'
                              : 'focus:border-teal-500 focus:ring-teal-500'
                          }`}
                          placeholder="Enter petty cash amount"
                          required
                          disabled={isFormDisabled}
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {!isFormDisabled && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => toggleEditableField('pettyCash')}
                          className="mb-1 p-2 text-gray-500 hover:text-teal-600"
                        >
                          <Edit className="w-5 h-5" />
                        </motion.button>
                      )}
                    </div>
                    {modifiedFields.pettyCash && (
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Petty Cash Remarks</label>
                        <textarea
                          name="pettyCashDescription"
                          value={formData.pettyCashDescription}
                          onChange={handleInputChange}
                          className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                            isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                          }`}
                          placeholder="Reason for modifying the petty cash amount"
                          rows="3"
                          disabled={isFormDisabled}
                        />
                      </div>
                    )}
                  </div>

                  {formData.students.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Payments</h3>
                      <div className="space-y-4">
                        {formData.students.map((student, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Student {index + 1}</label>
                                <select
                                  value={student.studentId}
                                  onChange={(e) => handleStudentInputChange(index, 'studentId', e.target.value)}
                                  className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                    isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                                  }`}
                                  required
                                  disabled={isFormDisabled}
                                >
                                  <option value="">Select Student</option>
                                  {students.map((s) => (
                                    <option key={s.student_id} value={s.student_id}>
                                      {s.name} ({s.roll_no})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="flex items-end gap-2">
                                <div className="flex-1">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                                  <input
                                    type="number"
                                    value={student.amount}
                                    onChange={(e) => handleStudentInputChange(index, 'amount', e.target.value)}
                                    readOnly={!editableFields[`student-${index}`]}
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      !editableFields[`student-${index}`] || isFormDisabled
                                        ? 'bg-gray-100 cursor-not-allowed'
                                        : 'focus:border-teal-500 focus:ring-teal-500'
                                    }`}
                                    placeholder="Enter amount"
                                    required
                                    disabled={isFormDisabled}
                                    min="0"
                                    step="0.01"
                                  />
                                </div>
                                {!isFormDisabled && (
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    type="button"
                                    onClick={() => toggleEditableField(`student-${index}`)}
                                    className="mb-1 p-2 text-gray-500 hover:text-teal-600"
                                  >
                                    <Edit className="w-5 h-5" />
                                  </motion.button>
                                )}
                              </div>
                              {modifiedFields[`student-${index}`] && (
                                <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount Remarks</label>
                                  <textarea
                                    value={student.amountDescription}
                                    onChange={(e) => handleStudentInputChange(index, 'amountDescription', e.target.value)}
                                    className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                      isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                                    }`}
                                    placeholder="Reason for modifying the amount"
                                    rows="3"
                                    disabled={isFormDisabled}
                                  />
                                </div>
                              )}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">From UPI ID</label>
                                <input
                                  type="text"
                                  value={student.fromUpiId}
                                  onChange={(e) => handleStudentInputChange(index, 'fromUpiId', e.target.value)}
                                  className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                    isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                                  }`}
                                  placeholder="admin@upi"
                                  required
                                  disabled={isFormDisabled}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">To UPI ID</label>
                                <input
                                  type="text"
                                  value={student.toUpiId}
                                  onChange={(e) => handleStudentInputChange(index, 'toUpiId', e.target.value)}
                                  className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                    isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                                  }`}
                                  placeholder="student@upi"
                                  required
                                  disabled={isFormDisabled}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID/UTR</label>
                                <input
                                  type="text"
                                  value={student.transactionId}
                                  onChange={(e) => handleStudentInputChange(index, 'transactionId', e.target.value)}
                                  className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                    isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                                  }`}
                                  placeholder="Enter transaction ID"
                                  required
                                  disabled={isFormDisabled}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                                <DatePicker
                                  selected={student.dateTime}
                                  onChange={(date) => handleStudentDateChange(index, date)}
                                  showTimeSelect
                                  dateFormat="Pp"
                                  className={`w-full rounded-lg border-gray-300 shadow-sm text-sm py-3 px-4 ${
                                    isFormDisabled ? 'bg-gray-100 cursor-not-allowed' : 'focus:border-teal-500 focus:ring-teal-500'
                                  }`}
                                  required
                                  disabled={isFormDisabled}
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Proof</label>
                                <input
                                  type="file"
                                  onChange={(e) => handleStudentFileChange(index, e)}
                                  className={`w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 ${
                                    isFormDisabled ? 'cursor-not-allowed' : ''
                                  }`}
                                  accept="image/*,.pdf"
                                  required
                                  disabled={isFormDisabled}
                                />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {isFormDisabled ? (
                    <div className="bg-teal-50 border border-teal-200 text-teal-800 p-4 rounded-lg">
                      <div className="font-medium">
                        {paidProjects[formData.projectId]?.isPaid
                          ? 'This project has already been processed.'
                          : 'Awaiting full payment from the client.'}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="bg-teal-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-teal-700 flex items-center gap-2"
                      >
                        <PlusCircle className="w-5 h-5" />
                        Record Transaction
                      </motion.button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction History */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          <div className="p-4 sm:p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Transaction History
            </h2>

            {Object.entries(groupedTransactions).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No transactions recorded yet</div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFormOpen(true)}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 flex items-center gap-2 mx-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add First Transaction
                </motion.button>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedTransactions).map(([projectName, projectTransactions]) => (
                  <div key={projectName}>
                    <div className={`${projectColorMap[projectName]} px-4 py-3 rounded-t-lg mb-0`}>
                      <h3 className="font-semibold">{projectName}</h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expense Type</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Petty Cash</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded By</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projectTransactions.map(transaction => {
                            const studentDetails = typeof transaction.student_details === 'string'
                              ? JSON.parse(transaction.student_details)
                              : transaction.student_details;
                            return (
                              <motion.tr 
                                key={transaction.id} 
                                className="hover:bg-gray-50 transition duration-150"
                                whileHover={{ backgroundColor: '#f9fafb' }}
                              >
                                <td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">
                                  {transaction.expense_type === 'Operational Payment' && transaction.expense_subtype
                                    ? `${transaction.expense_type} - ${transaction.expense_subtype}`
                                    : transaction.expense_type}
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                  {transaction.client_name}
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700 font-medium">
                                  ₹{parseFloat(transaction.petty_cash).toFixed(2)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                  <div className="space-y-1">
                                    {studentDetails.map((student, index) => (
                                      <div key={index} className="flex justify-between items-center">
                                        <span>{student.name}</span>
                                        <span className="text-teal-600">₹{parseFloat(student.amount).toFixed(2)}</span>
                                      </div>
                                    ))}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                  <div>{transaction.created_by_name}</div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(transaction.created_at).toLocaleDateString()}
                                  </div>
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                  {new Date(transaction.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 sm:px-6 py-4 text-sm text-gray-700">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => showTransactionDetails(transaction)}
                                    className="text-teal-600 hover:text-teal-800 flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span className="hidden sm:inline">View</span>
                                  </motion.button>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PayableLedger;