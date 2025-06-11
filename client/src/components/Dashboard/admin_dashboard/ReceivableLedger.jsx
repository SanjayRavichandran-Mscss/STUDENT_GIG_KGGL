// import React, { useState, useEffect } from 'react';
// import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import { Eye } from 'lucide-react';

// const MySwal = withReactContent(Swal);

// // Utility function to format date to MySQL DATETIME format
// const formatDateForMySQL = (date) => {
//   const pad = (num) => String(num).padStart(2, '0');
//   return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
// };

// // Color palette for different projects
// const projectColors = [
//   'bg-blue-100 text-blue-900',
//   'bg-green-100 text-green-900',
//   'bg-purple-100 text-purple-900',
//   'bg-yellow-100 text-yellow-900',
//   'bg-pink-100 text-pink-900',
// ];

// const ReceivableLedger = () => {
//   const { id } = useParams();
//   const [createdBy, setCreatedBy] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [projects, setProjects] = useState([]);
//   const [selectedTotalAmount, setSelectedTotalAmount] = useState(null);
//   const [balanceAmount, setBalanceAmount] = useState(null);
//   const [formData, setFormData] = useState({
//     projectId: '',
//     projectName: '',
//     clientName: '',
//     paidAmount: '',
//     fromUpiId: '',
//     toUpiId: '',
//     transactionId: '',
//     dateTime: new Date(),
//     transactionScreenshot: null,
//   });

//   const pettyCash = 500.00;

//   // Decode URL ID
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

//   // Fetch projects
//   useEffect(() => {
//     const fetchProjects = async () => {
//       try {
//         const response = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/getallprojects');
//         setProjects(response.data);
//       } catch (error) {
//         console.error('Error fetching projects:', error.message);
//         MySwal.fire({
//           icon: 'error',
//           title: 'Fetch Error',
//           text: 'Failed to fetch projects.',
//         });
//       }
//     };
//     fetchProjects();
//   }, []);

//   // Fetch transaction history
//   useEffect(() => {
//     if (createdBy === null) return;

//     const fetchData = async () => {
//       try {
//         const historyResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/receivable-ledger-history');
//         if (historyResponse.data.status) {
//           setTransactions(historyResponse.data.result);
//           updateBalance();
//         } else {
//           throw new Error(historyResponse.data.msg || 'Failed to fetch transaction history');
//         }
//       } catch (error) {
//         console.error('Error fetching transaction history:', error.message);
//         MySwal.fire({
//           icon: 'error',
//           title: 'Fetch Error',
//           text: 'Failed to fetch transaction history.',
//         });
//       }
//     };

//     fetchData();
//   }, [createdBy, formData.projectName, projects]);

//   // Update balance when project changes
//   const updateBalance = () => {
//     if (formData.projectName) {
//       const selectedProject = projects.find((p) => p.project_name === formData.projectName);
//       if (selectedProject) {
//         setSelectedTotalAmount(selectedProject.total_amount);
//         const totalPaid = transactions
//           .filter((t) => t.project_name === formData.projectName)
//           .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
//         setBalanceAmount(parseFloat(selectedProject.total_amount) - totalPaid);
//       } else {
//         setSelectedTotalAmount(null);
//         setBalanceAmount(null);
//       }
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'projectId' && {
//         projectName: projects.find((p) => p.project_id === parseInt(value))?.project_name || '',
//       }),
//     }));

//     if (name === 'projectId' && value) {
//       const selectedProject = projects.find((p) => p.project_id === parseInt(value));
//       if (selectedProject) {
//         setSelectedTotalAmount(selectedProject.total_amount);
//         const totalPaid = transactions
//           .filter((t) => t.project_name === selectedProject.project_name)
//           .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
//         setBalanceAmount(parseFloat(selectedProject.total_amount) - totalPaid);
//       } else {
//         setSelectedTotalAmount(null);
//         setBalanceAmount(null);
//       }
//     } else if (name === 'projectId' && !value) {
//       setSelectedTotalAmount(null);
//       setBalanceAmount(null);
//       setFormData((prev) => ({ ...prev, projectName: '' }));
//     }
//   };

//   const handleDateChange = (date) => {
//     setFormData((prev) => ({
//       ...prev,
//       dateTime: date,
//     }));
//   };

//   const handleFileChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       transactionScreenshot: e.target.files[0],
//     }));
//   };

//   const validateForm = () => {
//     const { projectId, projectName, clientName, paidAmount, fromUpiId, toUpiId, transactionId, dateTime, transactionScreenshot } = formData;

//     if (!projectId || !projectName || !clientName || !paidAmount || !fromUpiId || !toUpiId || !transactionId || !dateTime || !transactionScreenshot) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Missing Fields',
//         text: 'Please fill all required fields.',
//       });
//       return false;
//     }

//     if (parseFloat(paidAmount) <= 0) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Invalid Amount',
//         text: 'Paid amount must be greater than zero.',
//       });
//       return false;
//     }

//     if (selectedTotalAmount && parseFloat(paidAmount) > parseFloat(selectedTotalAmount)) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Invalid Paid Amount',
//         text: `Paid amount (₹${paidAmount}) cannot exceed the project's total amount (₹${selectedTotalAmount}).`,
//       });
//       return false;
//     }

//     const totalPaid = transactions
//       .filter((t) => t.project_name === projectName)
//       .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
//     if (parseFloat(paidAmount) + totalPaid > parseFloat(selectedTotalAmount)) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Invalid Paid Amount',
//         text: `Paid amount (₹${paidAmount}) plus existing payments (₹${totalPaid}) cannot exceed the project's total amount (₹${selectedTotalAmount}).`,
//       });
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     if (createdBy === null) {
//       MySwal.fire({
//         icon: 'error',
//         title: 'Invalid ID',
//         text: 'Cannot submit the form due to an invalid user ID.',
//       });
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('project_id', formData.projectId);
//       formDataToSend.append('client_name', formData.clientName);
//       formDataToSend.append('paid_amount', formData.paidAmount);
//       formDataToSend.append('from_upi_id', formData.fromUpiId);
//       formDataToSend.append('to_upi_id', formData.toUpiId);
//       formDataToSend.append('transaction_id', formData.transactionId);
//       formDataToSend.append('date_time', formatDateForMySQL(formData.dateTime));
//       formDataToSend.append('transaction_screenshot', formData.transactionScreenshot);
//       formDataToSend.append('created_by', createdBy);

//       const response = await axios.post(
//         'https://gig.kggeniuslabs.com/api/api/admin/save-receivable-ledger',
//         formDataToSend,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );

//       if (response.data.status) {
//         MySwal.fire({
//           icon: 'success',
//           title: 'Transaction Added',
//           text: 'Your receivable transaction has been successfully recorded!',
//         });

//         const historyResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/receivable-ledger-history');
//         if (historyResponse.data.status) {
//           setTransactions(historyResponse.data.result);
//           updateBalance();
//         }

//         setFormData({
//           projectId: '',
//           projectName: '',
//           clientName: '',
//           paidAmount: '',
//           fromUpiId: '',
//           toUpiId: '',
//           transactionId: '',
//           dateTime: new Date(),
//           transactionScreenshot: null,
//         });
//         setSelectedTotalAmount(null);
//         setBalanceAmount(null);
//       } else {
//         throw new Error(response.data.msg || 'Failed to save receivable ledger entry');
//       }
//     } catch (error) {
//       console.error('Error submitting receivable ledger:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//       });
//       MySwal.fire({
//         icon: 'error',
//         title: 'Submission Error',
//         text: error.response?.data?.msg || 'Failed to save receivable ledger entry. Please try again.',
//       });
//     }
//   };

//   const showTransactionDetails = (transaction) => {
//     MySwal.fire({
//       title: 'Receivable Transaction Details',
//       html: (
//         <div className="text-left space-y-3 text-sm">
//           <div><strong>Project Name:</strong> {transaction.project_name}</div>,
//           <div><strong>Client Name:</strong> {transaction.client_name}</div>,
//           <div><strong>Paid Amount:</strong> ₹{parseFloat(transaction.paid_amount).toFixed(2)}</div>,
//           <div><strong>From UPI ID:</strong> {transaction.from_upi_id}</div>,
//           <div><strong>To UPI ID:</strong> {transaction.to_upi_id}</div>,
//           <div><strong>Transaction ID:</strong> {transaction.transaction_id}</div>,
//           <div><strong>Date & Time:</strong> {new Date(transaction.date_time).toLocaleString()}</div>,
//           <div>
//             <strong>Transaction Screenshot:</strong>{' '}
//             {transaction.transaction_screenshot ? (
//               <a href={`https://gig.kggeniuslabs.com/api/${transaction.transaction_screenshot}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
//                 View
//               </a>
//             ) : 'N/A'}
//           </div>,
//           <div><strong>Created By:</strong> {transaction.created_by_name}</div>,
//           <div><strong>Created At:</strong> {new Date(transaction.created_at).toLocaleString()}</div>
//         </div>
//       ),
//       showCloseButton: true,
//       confirmButtonText: 'Close',
//       customClass: {
//         popup: 'rounded-lg shadow-xl p-6 bg-white max-w-md',
//         title: 'text-xl font-bold text-gray-900 mb-4',
//         htmlContainer: 'text-gray-700',
//         confirmButton: 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-medium',
//       },
//     });
//   };

//   const viewScreenshot = (screenshotPath) => {
//     MySwal.fire({
//       imageUrl: `https://gig.kggeniuslabs.com/api/${screenshotPath}`,
//       imageAlt: 'Transaction Screenshot',
//       showCloseButton: true,
//       confirmButtonText: 'Close',
//       customClass: {
//         popup: 'rounded-lg shadow-xl p-6 bg-white',
//         confirmButton: 'bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm font-medium',
//       },
//     });
//   };

//   // Group transactions by project_name
//   const groupedTransactions = transactions.reduce((acc, transaction) => {
//     const projectName = transaction.project_name;
//     if (!acc[projectName]) {
//       acc[projectName] = [];
//     }
//     acc[projectName].push(transaction);
//     return acc;
//   }, {});

//   // Calculate balance amount for a project
//   const calculateBalance = (projectName) => {
//     const project = projects.find((p) => p.project_name === projectName);
//     if (!project) return 'N/A';
//     const totalPaid = transactions
//       .filter((t) => t.project_name === projectName)
//       .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
//     return (parseFloat(project.total_amount) - totalPaid).toFixed(2);
//   };

//   // Calculate total paid amount for a project
//   const calculateTotalPaid = (projectName) => {
//     const totalPaid = transactions
//       .filter((t) => t.project_name === projectName)
//       .reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
//     return totalPaid.toFixed(2);
//   };

//   // Assign colors to projects
//   const projectColorMap = {};
//   Object.keys(groupedTransactions).forEach((projectName, index) => {
//     projectColorMap[projectName] = projectColors[index % projectColors.length];
//   });

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

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto p-6">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Receivable Ledger</h1>
//           <div className="text-sm text-gray-600">Last updated: {new Date().toLocaleString()}</div>
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-lg mb-8 border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Transaction</h2>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="flex flex-col space-y-4">
//                 <div className="flex items-end space-x-4">
//                   <div className="flex-1">
//                     <label className="block text-sm font-medium text-gray-700">Project Name</label>
//                     <select
//                       name="projectId"
//                       value={formData.projectId}
//                       onChange={handleInputChange}
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                     >
//                       <option value="">Select Project</option>
//                       {projects.map((project) => (
//                         <option key={project.project_id} value={project.project_id}>
//                           {project.project_name}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                   {selectedTotalAmount && (
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium text-gray-700">Total Amount</label>
//                       <div className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 font-medium">
//                         ₹{parseFloat(selectedTotalAmount).toFixed(2)}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 {selectedTotalAmount && (
//                   <div className="flex space-x-4">
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium text-gray-700">Balance Amount</label>
//                       <div className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 font-medium">
//                         ₹{balanceAmount !== null ? balanceAmount.toFixed(2) : '0.00'}
//                       </div>
//                     </div>
//                     <div className="flex-1">
//                       <label className="block text-sm font-medium text-gray-700">Petty Cash</label>
//                       <div className="mt-1 block w-full rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700 font-medium">
//                         ₹{pettyCash.toFixed(2)}
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Client Name</label>
//                 <input
//                   type="text"
//                   name="clientName"
//                   value={formData.clientName}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                   placeholder="Enter client name"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Paid Amount (₹)</label>
//                 <input
//                   type="number"
//                   name="paidAmount"
//                   value={formData.paidAmount}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                   placeholder="Enter paid amount"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">From UPI ID</label>
//                 <input
//                   type="text"
//                   name="fromUpiId"
//                   value={formData.fromUpiId}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                   placeholder="client@upi"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">To UPI ID</label>
//                 <input
//                   type="text"
//                   name="toUpiId"
//                   value={formData.toUpiId}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                   placeholder="admin@upi"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Transaction ID/UTL</label>
//                 <input
//                   type="text"
//                   name="transactionId"
//                   value={formData.transactionId}
//                   onChange={handleInputChange}
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                   placeholder="Enter transaction ID/UTL"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Date & Time</label>
//                 <DatePicker
//                   selected={formData.dateTime}
//                   onChange={handleDateChange}
//                   showTimeSelect
//                   dateFormat="Pp"
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-3 px-4"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">Transaction Screenshot</label>
//                 <input
//                   type="file"
//                   onChange={handleFileChange}
//                   className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                   accept="image/jpeg,image/jpg,image/png,application/pdf"
//                 />
//               </div>
//             </div>

//             <div className="flex justify-end">
//               <button
//                 type="submit"
//                 className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-sm font-medium"
//               >
//                 Submit Receivable
//               </button>
//             </div>
//           </form>
//         </div>

//         <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
//           <h2 className="text-xl font-semibold text-gray-900 mb-6">Receivable History</h2>
//           <div className="space-y-8">
//             {Object.entries(groupedTransactions).map(([projectName, projectTransactions], index) => (
//               <div key={projectName}>
//                 <h3 className={`text-lg font-semibold ${projectColorMap[projectName]} px-4 py-3 rounded-md mb-4`}>
//                   {projectName} (Total: ₹{projects.find((p) => p.project_name === projectName)?.total_amount || 'N/A'}, 
//                   Paid: ₹{calculateTotalPaid(projectName)}, 
//                   Balance: ₹{calculateBalance(projectName)})
//                 </h3>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className={`${projectColorMap[projectName]} bg-opacity-50`}>
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Client</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Paid Amount</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Balance Amount</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">From UPI</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">To UPI</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Transaction ID</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Screenshot</th>
//                         <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Action</th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {projectTransactions.map((transaction) => (
//                         <tr key={transaction.id} className={`${projectColorMap[projectName]} bg-opacity-20 hover:bg-opacity-30 transition duration-200`}>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{transaction.client_name}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{parseFloat(transaction.paid_amount).toFixed(2)}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">₹{calculateBalance(transaction.project_name)}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.from_upi_id}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.to_upi_id}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{transaction.transaction_id}</td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {transaction.transaction_screenshot ? (
//                               <button
//                                 onClick={() => viewScreenshot(transaction.transaction_screenshot)}
//                                 className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 font-medium"
//                               >
//                                 <Eye className="w-4 h-4" /> View
//                               </button>
//                             ) : 'N/A'}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
//                             <button
//                               onClick={() => showTransactionDetails(transaction)}
//                               className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 text-sm font-medium"
//                             >
//                               View Details
//                             </button>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReceivableLedger;















import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Eye, PlusCircle, X, Download, FileText, User, Calendar, ArrowUpDown, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MySwal = withReactContent(Swal);

// Utility function to format date to MySQL DATETIME format
const formatDateForMySQL = (date) => {
  const pad = (num) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

// Color palette for different projects - blue-based theme
const projectColors = [
  'bg-blue-50 border-l-4 border-blue-500',
  'bg-blue-100 border-l-4 border-blue-600',
  'bg-blue-200 border-l-4 border-blue-700',
  'bg-blue-300 border-l-4 border-blue-800',
  'bg-blue-400 border-l-4 border-blue-900',
];

const ReceivableLedger = () => {
  const { id } = useParams();
  const [createdBy, setCreatedBy] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [balanceAmount, setBalanceAmount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    clientName: '',
    paidAmount: '',
    fromUpiId: '',
    toUpiId: '',
    transactionId: '',
    dateTime: new Date(),
    transactionScreenshot: null,
  });

  // Decode URL ID
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
      setCreatedBy(null);
    }
  }, [id]);

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/getallprojects');
        setProjects(response.data);
        
        // Set the last project as default selected
        if (response.data.length > 0) {
          const lastProject = response.data[response.data.length - 1];
          handleProjectSelect(lastProject);
        }
      } catch (error) {
        console.error('Error fetching projects:', error.message);
        MySwal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: 'Failed to fetch projects.',
        });
      }
    };
    fetchProjects();
  }, []);

  // Fetch transaction history
  useEffect(() => {
    if (createdBy === null) return;

    const fetchData = async () => {
      try {
        const historyResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/receivable-ledger-history');
        if (historyResponse.data.status) {
          setTransactions(historyResponse.data.result);
          updateProjectSummary();
        } else {
          throw new Error(historyResponse.data.msg || 'Failed to fetch transaction history');
        }
      } catch (error) {
        console.error('Error fetching transaction history:', error.message);
        MySwal.fire({
          icon: 'error',
          title: 'Fetch Error',
          text: 'Failed to fetch transaction history.',
        });
      }
    };

    fetchData();
  }, [createdBy, formData.projectName]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setFormData(prev => ({
      ...prev,
      projectId: project.project_id,
      projectName: project.project_name
    }));
    updateProjectSummary(project.project_name);
  };

  const updateProjectSummary = (projectName = selectedProject?.project_name) => {
    if (!projectName) return;
    
    const project = projects.find(p => p.project_name === projectName);
    if (!project) return;

    const projectTransactions = transactions.filter(t => t.project_name === projectName);
    const paid = projectTransactions.reduce((sum, t) => sum + parseFloat(t.paid_amount), 0);
    
    setTotalPaid(paid);
    setBalanceAmount(parseFloat(project.total_amount) - paid);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'projectId' && {
        projectName: projects.find(p => p.project_id === parseInt(value))?.project_name || '',
      }),
    }));

    if (name === 'projectId' && value) {
      const selected = projects.find(p => p.project_id === parseInt(value));
      if (selected) {
        handleProjectSelect(selected);
      }
    }
  };

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      dateTime: date,
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      transactionScreenshot: e.target.files[0],
    }));
  };

  const validateForm = () => {
    const { projectId, projectName, clientName, paidAmount, fromUpiId, toUpiId, transactionId, dateTime, transactionScreenshot } = formData;

    if (!projectId || !projectName || !clientName || !paidAmount || !fromUpiId || !toUpiId || !transactionId || !dateTime || !transactionScreenshot) {
      MySwal.fire({
        icon: 'error',
        title: 'Missing Fields',
        text: 'Please fill all required fields.',
      });
      return false;
    }

    if (parseFloat(paidAmount) <= 0) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Amount',
        text: 'Paid amount must be greater than zero.',
      });
      return false;
    }

    if (selectedProject && parseFloat(paidAmount) > parseFloat(selectedProject.total_amount)) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Paid Amount',
        text: `Paid amount (₹${paidAmount}) cannot exceed the project's total amount (₹${selectedProject.total_amount}).`,
      });
      return false;
    }

    if (parseFloat(paidAmount) > balanceAmount) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid Paid Amount',
        text: `Paid amount (₹${paidAmount}) cannot exceed the remaining balance (₹${balanceAmount.toFixed(2)}).`,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (createdBy === null) {
      MySwal.fire({
        icon: 'error',
        title: 'Invalid ID',
        text: 'Cannot submit the form due to an invalid user ID.',
      });
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('project_id', formData.projectId);
      formDataToSend.append('client_name', formData.clientName);
      formDataToSend.append('paid_amount', formData.paidAmount);
      formDataToSend.append('from_upi_id', formData.fromUpiId);
      formDataToSend.append('to_upi_id', formData.toUpiId);
      formDataToSend.append('transaction_id', formData.transactionId);
      formDataToSend.append('date_time', formatDateForMySQL(formData.dateTime));
      formDataToSend.append('transaction_screenshot', formData.transactionScreenshot);
      formDataToSend.append('created_by', createdBy);

      const response = await axios.post(
        'https://gig.kggeniuslabs.com/api/api/admin/save-receivable-ledger',
        formDataToSend,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data.status) {
        MySwal.fire({
          icon: 'success',
          title: 'Transaction Added',
          text: 'Your receivable transaction has been successfully recorded!',
        });

        const historyResponse = await axios.get('https://gig.kggeniuslabs.com/api/api/admin/receivable-ledger-history');
        if (historyResponse.data.status) {
          setTransactions(historyResponse.data.result);
          updateProjectSummary();
        }

        setShowForm(false);
      } else {
        throw new Error(response.data.msg || 'Failed to save receivable ledger entry');
      }
    } catch (error) {
      console.error('Error submitting receivable ledger:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      MySwal.fire({
        icon: 'error',
        title: 'Submission Error',
        text: error.response?.data?.msg || 'Failed to save receivable ledger entry. Please try again.',
      });
    }
  };

  const showTransactionDetails = (transaction) => {
    MySwal.fire({
      title: (
        <div className="flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" />
          <span>Transaction Details</span>
        </div>
      ),
      html: (
        <div className="text-left space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-500 font-medium">Project</div>
              <div className="font-semibold">{transaction.project_name}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-500 font-medium">Client</div>
              <div className="font-semibold">{transaction.client_name}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-500 font-medium">Amount</div>
              <div className="font-semibold">₹{parseFloat(transaction.paid_amount).toFixed(2)}</div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-xs text-blue-500 font-medium">Date</div>
              <div className="font-semibold">{new Date(transaction.date_time).toLocaleString()}</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Wallet className="w-5 h-5 mt-0.5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-500">Transaction ID</div>
                <div className="font-mono">{transaction.transaction_id}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <ArrowUpDown className="w-5 h-5 mt-0.5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-500">UPI Transfer</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">From:</span>
                    <span className="font-mono">{transaction.from_upi_id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">To:</span>
                    <span className="font-mono">{transaction.to_upi_id}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 mt-0.5 text-blue-600" />
              <div>
                <div className="text-sm font-medium text-gray-500">Recorded By</div>
                <div>{transaction.created_by_name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(transaction.created_at).toLocaleString()}
                </div>
              </div>
            </div>
            
            {transaction.transaction_screenshot && (
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 mt-0.5 flex items-center justify-center text-blue-600">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Screenshot</div>
                  <div className="mt-2">
                    <img 
                      src={`https://gig.kggeniuslabs.com/api/${transaction.transaction_screenshot}`} 
                      alt="Transaction Screenshot" 
                      className="rounded-lg border border-gray-200 max-w-full h-auto max-h-40"
                    />
                    <div className="mt-2 flex gap-2">
                      <a 
                        href={`https://gig.kggeniuslabs.com/api/${transaction.transaction_screenshot}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Eye className="w-4 h-4" /> View Full
                      </a>
                      <a 
                        href={`https://gig.kggeniuslabs.com/api/${transaction.transaction_screenshot}`} 
                        download
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" /> Download
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ),
      showCloseButton: true,
      confirmButtonText: 'Close',
      customClass: {
        popup: 'rounded-xl shadow-xl p-6 bg-white max-w-2xl',
        title: 'text-xl font-bold text-gray-900 mb-2 flex items-center gap-2',
        htmlContainer: 'text-gray-700',
        confirmButton: 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium',
      },
    });
  };

  // Group transactions by project_name
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const projectName = transaction.project_name;
    if (!acc[projectName]) {
      acc[projectName] = [];
    }
    acc[projectName].push(transaction);
    return acc;
  }, {});

  // Assign colors to projects
  const projectColorMap = {};
  Object.keys(groupedTransactions).forEach((projectName, index) => {
    projectColorMap[projectName] = projectColors[index % projectColors.length];
  });

  if (createdBy === null) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Invalid user ID in the URL. Please check and try again.</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-blue-600" />
            Receivable Ledger
          </h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <PlusCircle className="w-5 h-5" />
            <span className="hidden md:inline">Add Transaction</span>
          </button>
        </div>

        {/* Project Summary Card */}
        {selectedProject && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProject.project_name}</h2>
                  <p className="text-gray-600 text-sm">{selectedProject.client_name}</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-blue-600 font-medium">Total Amount</div>
                    <div className="text-lg font-bold text-blue-800">₹{parseFloat(selectedProject.total_amount).toFixed(2)}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-xs text-green-600 font-medium">Paid Amount</div>
                    <div className="text-lg font-bold text-green-800">₹{totalPaid.toFixed(2)}</div>
                  </div>
                  <div className={`p-3 rounded-lg text-center ${balanceAmount <= 0 ? 'bg-gray-100' : 'bg-amber-50'}`}>
                    <div className={`text-xs font-medium ${balanceAmount <= 0 ? 'text-gray-600' : 'text-amber-600'}`}>
                      {balanceAmount <= 0 ? 'Status' : 'Balance Amount'}
                    </div>
                    <div className={`text-lg font-bold ${balanceAmount <= 0 ? 'text-gray-800' : 'text-amber-800'}`}>
                      {balanceAmount <= 0 ? 'Payment Completed' : `₹${balanceAmount.toFixed(2)}`}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {projects.map(project => (
                  <button
                    key={project.project_id}
                    onClick={() => handleProjectSelect(project)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition ${selectedProject.project_id === project.project_id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    {project.project_name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Transaction Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-blue-600" />
                    Add Receivable Transaction
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-500 hover:text-gray-700 transition duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Project Selection */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Select Project</label>
                      <select
                        name="projectId"
                        value={formData.projectId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
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

                    {/* Client Name and Paid Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        name="clientName"
                        value={formData.clientName}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
                        placeholder="Enter client name"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Paid Amount (₹)</label>
                      <input
                        type="number"
                        name="paidAmount"
                        value={formData.paidAmount}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
                        placeholder="Enter amount"
                        required
                        disabled={balanceAmount <= 0}
                        min="0"
                        step="0.01"
                      />
                    </div>

                    {/* UPI Details */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From UPI ID</label>
                      <input
                        type="text"
                        name="fromUpiId"
                        value={formData.fromUpiId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
                        placeholder="client@upi"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To UPI ID</label>
                      <input
                        type="text"
                        name="toUpiId"
                        value={formData.toUpiId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
                        placeholder="company@upi"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>

                    {/* Transaction ID and Screenshot */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID/UTR</label>
                      <input
                        type="text"
                        name="transactionId"
                        value={formData.transactionId}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
                        placeholder="Enter transaction ID"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Proof</label>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        accept="image/*,.pdf"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>

                    {/* Date and Submit */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                      <DatePicker
                        selected={formData.dateTime}
                        onChange={handleDateChange}
                        showTimeSelect
                        dateFormat="Pp"
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-3 px-4 border"
                        required
                        disabled={balanceAmount <= 0}
                      />
                    </div>
                  </div>

                  {balanceAmount <= 0 ? (
                    <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg">
                      <div className="font-medium">Full payment received for this project.</div>
                      <div className="text-sm mt-1">No further payments can be added.</div>
                    </div>
                  ) : (
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition duration-300 text-sm font-medium flex items-center gap-2"
                      >
                        <PlusCircle className="w-5 h-5" />
                        Record Transaction
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Transaction History
            </h2>

            {Object.entries(groupedTransactions).length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">No transactions recorded yet</div>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300 text-sm font-medium flex items-center gap-2 mx-auto"
                >
                  <PlusCircle className="w-4 h-4" />
                  Add First Transaction
                </button>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From UPI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To UPI</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proof</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recorded By</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {projectTransactions.map(transaction => (
                            <tr key={transaction.id} className="hover:bg-gray-50 transition duration-150">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {transaction.client_name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                                ₹{parseFloat(transaction.paid_amount).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="max-w-xs truncate">{transaction.from_upi_id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="max-w-xs truncate">{transaction.to_upi_id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="max-w-xs truncate font-mono">{transaction.transaction_id}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {new Date(transaction.date_time).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {transaction.transaction_screenshot ? (
                                  <button
                                    onClick={() => showTransactionDetails(transaction)}
                                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                  >
                                    <Eye className="w-4 h-4" />
                                    <span className="hidden md:inline">View</span>
                                  </button>
                                ) : 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div>{transaction.created_by_name}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date(transaction.created_at).toLocaleDateString()}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceivableLedger;