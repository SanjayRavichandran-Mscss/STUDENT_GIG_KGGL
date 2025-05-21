// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function ApprovedProjects() {
//   const [approvedProjects, setApprovedProjects] = useState([]);
//   const [bitStatuses, setBitStatuses] = useState([]);
//   const [selectedStatuses, setSelectedStatuses] = useState({});
//   const [paymentDetails, setPaymentDetails] = useState({});
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setIsLoading(true);
//         const projectsResponse = await axios.get('http://localhost:5000/api/admin/accepted-bits');
//         setApprovedProjects(
//           projectsResponse.data.result.map((project) => ({
//             ...project,
//             formatted_datetime: formatDate(project.datetime),
//           }))
//         );

//         const statusesResponse = await axios.get('http://localhost:5000/api/admin/bit-statuses');
//         setBitStatuses(statusesResponse.data.result);
//       } catch (err) {
//         console.error('Error fetching data:', err);
//         setError('Failed to load approved projects or statuses. Please try again.');
//         toast.error('Failed to load data.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     });
//   };

//   const handleStatusChange = (bitId, statusId) => {
//     setSelectedStatuses((prev) => ({
//       ...prev,
//       [bitId]: statusId,
//     }));
//   };

//   const handlePaymentInputChange = (bitId, field, value) => {
//     setPaymentDetails((prev) => ({
//       ...prev,
//       [bitId]: {
//         ...prev[bitId],
//         [field]: value,
//       },
//     }));
//   };

//   const handleFileChange = (bitId, event) => {
//     const file = event.target.files[0];
//     console.log('Selected file:', file); // Debug the file object
//     if (file) {
//       setPaymentDetails((prev) => ({
//         ...prev,
//         [bitId]: {
//           ...prev[bitId],
//           transaction_screenshot: file, // Store the file object
//         },
//       }));
//     }
//   };

//   const handleSave = async (bitId, studentId, projectId, email, val) => {
//     const selectedStatusId = selectedStatuses[bitId];
//     let isPaymentDetailsSaved = false;

//     if (val.latest_status_name === 'payment_received' && paymentDetails[bitId]) {
//       const details = paymentDetails[bitId] || {};
//       if (
//         !details.from_account_number ||
//         !details.to_account_number ||
//         !details.transaction_id ||
//         !details.transaction_screenshot
//       ) {
//         toast.error('All payment details, including the screenshot, are required.');
//         return;
//       }

//       try {
//         setIsSubmitting((prev) => ({ ...prev, [bitId]: true }));
//         const formData = new FormData();
//         formData.append('student_id', studentId);
//         formData.append('project_id', projectId);
//         formData.append('from_account_number', details.from_account_number);
//         formData.append('to_account_number', details.to_account_number);
//         formData.append('transaction_id', details.transaction_id);
//         formData.append('transaction_screenshot', details.transaction_screenshot);

//         // Debug FormData contents
//         for (let [key, value] of formData.entries()) {
//           console.log(`${key}:`, value);
//         }

//         const paymentResponse = await axios.post(
//           'http://localhost:5000/api/admin/save-payment-details',
//           formData,
//           {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           }
//         );

//         if (paymentResponse.data.status) {
//           isPaymentDetailsSaved = true;
//           toast.success('Payment details saved successfully');
//         } else {
//           toast.error(paymentResponse.data.msg);
//           return;
//         }
//       } catch (err) {
//         console.error('Error saving payment details:', err);
//         toast.error(err.response?.data?.msg || 'Failed to save payment details. Please try again.');
//         setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
//         return;
//       }
//     }

//     if (selectedStatusId) {
//       try {
//         const statusResponse = await axios.post('http://localhost:5000/api/admin/update-bit-status', {
//           bit_id: bitId,
//           student_id: studentId,
//           project_id: projectId,
//           bit_status_id: selectedStatusId,
//           email,
//         });

//         if (statusResponse.data.status) {
//           toast.success(
//             statusResponse.data.msg === 'declined'
//               ? 'Bid declined successfully'
//               : 'Status updated successfully'
//           );
//           if (selectedStatusId === 2) {
//             setApprovedProjects((prev) => prev.filter((project) => project.bit_id !== bitId));
//           } else {
//             const selectedStatusName =
//               bitStatuses.find((status) => status.bit_status_id === selectedStatusId)
//                 ?.bit_status_name || 'Unknown';
//             setApprovedProjects((prev) =>
//               prev.map((project) =>
//                 project.bit_id === bitId
//                   ? { ...project, latest_status_name: selectedStatusName }
//                   : project
//               )
//             );
//           }
//         } else {
//           toast.error(statusResponse.data.msg);
//         }
//       } catch (err) {
//         console.error('Error updating status:', err);
//         toast.error('Failed to update status. Please try again.');
//         setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
//         return;
//       }
//     } else if (!isPaymentDetailsSaved) {
//       toast.error('Please select a status or provide payment details to save.');
//       setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
//       return;
//     }

//     setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick theme="light" />
//       <h1 className="text-3xl font-bold text-center mb-8">Approved Projects</h1>

//       {approvedProjects.length === 0 ? (
//         <div className="text-center text-gray-600">No approved projects found.</div>
//       ) : (
//         approvedProjects.map((val, ind) => (
//           <div
//             key={ind}
//             className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8"
//           >
//             <div className="p-8">
//               <h2 className="text-2xl font-bold text-gray-800 mb-4">{val.project_name}</h2>

//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700">Student Name</h3>
//                   <p className="text-gray-600">{val.student_name}</p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-700">Roll Number</h3>
//                     <p className="text-gray-600">{val.roll_no}</p>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-medium text-gray-700">Email</h3>
//                     <p className="text-gray-600">{val.email}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="text-lg font-medium text-gray-700">College</h3>
//                     <p className="text-gray-600">{val.college_name}</p>
//                   </div>

//                   <div>
//                     <h3 className="text-lg font-medium text-gray-700">Approval Date</h3>
//                     <p className="text-gray-600">{val.formatted_datetime}</p>
//                   </div>
//                 </div>

//                 <div className="flex flex-col space-y-4">
//                   <div className="flex items-center space-x-4">
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-700">Current Status</h3>
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                           val.latest_status_name === 'accepted' ||
//                           val.latest_status_name === 'inprogress' ||
//                           val.latest_status_name === 'completed' ||
//                           val.latest_status_name === 'client_approved' ||
//                           val.latest_status_name === 'payment_received'
//                             ? 'bg-green-100 text-green-800'
//                             : val.latest_status_name === 'declined'
//                             ? 'bg-red-100 text-red-800'
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}
//                       >
//                         {(val.latest_status_name || 'accepted')
//                           .charAt(0)
//                           .toUpperCase() + (val.latest_status_name || 'accepted').slice(1)}
//                       </span>
//                     </div>
//                     <div>
//                       <h3 className="text-lg font-medium text-gray-700">Update Status</h3>
//                       <select
//                         value={selectedStatuses[val.bit_id] || ''}
//                         onChange={(e) => handleStatusChange(val.bit_id, parseInt(e.target.value))}
//                         className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                       >
//                         <option value="" disabled>
//                           Select a status
//                         </option>
//                         {bitStatuses.map((status) => (
//                           <option key={status.bit_status_id} value={status.bit_status_id}>
//                             {status.bit_status_name.charAt(0).toUpperCase() +
//                               status.bit_status_name.slice(1)}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   {val.latest_status_name === 'payment_received' && (
//                     <div className="space-y-4">
//                       <h3 className="text-lg font-medium text-gray-700">Payment Details</h3>
//                       <div className="grid grid-cols-1 gap-4">
//                         <input
//                           type="text"
//                           placeholder="From Account Number"
//                           value={paymentDetails[val.bit_id]?.from_account_number || ''}
//                           onChange={(e) =>
//                             handlePaymentInputChange(val.bit_id, 'from_account_number', e.target.value)
//                           }
//                           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                         />
//                         <input
//                           type="text"
//                           placeholder="To Account Number"
//                           value={paymentDetails[val.bit_id]?.to_account_number || ''}
//                           onChange={(e) =>
//                             handlePaymentInputChange(val.bit_id, 'to_account_number', e.target.value)
//                           }
//                           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                         />
//                         <input
//                           type="text"
//                           placeholder="Transaction ID"
//                           value={paymentDetails[val.bit_id]?.transaction_id || ''}
//                           onChange={(e) =>
//                             handlePaymentInputChange(val.bit_id, 'transaction_id', e.target.value)
//                           }
//                           className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                         />
//                         <input
//                           type="file"
//                           accept="image/jpeg,image/png"
//                           onChange={(e) => handleFileChange(val.bit_id, e)}
//                           className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
//                         />
//                       </div>
//                     </div>
//                   )}

//                   <div>
//                     <button
//                       onClick={() => handleSave(val.bit_id, val.student_id, val.project_id, val.email, val)}
//                       disabled={isSubmitting[val.bit_id]}
//                       className={`mt-4 px-4 py-2 rounded-md text-white font-medium ${
//                         isSubmitting[val.bit_id]
//                           ? 'bg-gray-400 cursor-not-allowed'
//                           : 'bg-indigo-600 hover:bg-indigo-700'
//                       } transition duration-200`}
//                     >
//                       {isSubmitting[val.bit_id] ? 'Saving...' : 'Save'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }

// export default ApprovedProjects;








import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ApprovedProjects() {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [bitStatuses, setBitStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch approved projects
        const projectsResponse = await axios.get('http://localhost:5000/api/admin/accepted-bits');
        const projects = projectsResponse.data.result.map((project) => ({
          ...project,
          formatted_datetime: formatDate(project.datetime),
        }));
        setApprovedProjects(projects);

        // Fetch bit statuses
        const statusesResponse = await axios.get('http://localhost:5000/api/admin/bit-statuses');
        setBitStatuses(statusesResponse.data.result);

        // Fetch payment status for each project
        const paymentStatusPromises = projects.map((project) =>
          axios.get('http://localhost:5000/api/quiz/check-payment', {
            params: { student_id: project.student_id, project_id: project.project_id },
          })
        );
        const paymentStatusResponses = await Promise.allSettled(paymentStatusPromises);
        const paymentStatusMap = {};
        projects.forEach((project, index) => {
          const response = paymentStatusResponses[index];
          paymentStatusMap[project.bit_id] =
            response.status === 'fulfilled' && response.value.data.status
              ? response.value.data.hasPayment
              : false;
        });
        setPaymentStatus(paymentStatusMap);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load approved projects or statuses. Please try again.');
        toast.error('Failed to load data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleStatusChange = (bitId, statusId) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [bitId]: statusId,
    }));
  };

  const handlePaymentInputChange = (bitId, field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [bitId]: {
        ...prev[bitId],
        [field]: value,
      },
    }));
  };

  const handleFileChange = (bitId, event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file);
    if (file) {
      setPaymentDetails((prev) => ({
        ...prev,
        [bitId]: {
          ...prev[bitId],
          transaction_screenshot: file,
        },
      }));
    }
  };

  const handleSave = async (bitId, studentId, projectId, email, val) => {
    const selectedStatusId = selectedStatuses[bitId];
    let isPaymentDetailsSaved = false;

    if (val.latest_status_name === 'payment_received' && paymentDetails[bitId] && !paymentStatus[bitId]) {
      const details = paymentDetails[bitId] || {};
      if (
        !details.from_account_number ||
        !details.to_account_number ||
        !details.transaction_id ||
        !details.transaction_screenshot
      ) {
        toast.error('All payment details, including the screenshot, are required.');
        return;
      }

      try {
        setIsSubmitting((prev) => ({ ...prev, [bitId]: true }));
        const formData = new FormData();
        formData.append('student_id', studentId);
        formData.append('project_id', projectId);
        formData.append('from_account_number', details.from_account_number);
        formData.append('to_account_number', details.to_account_number);
        formData.append('transaction_id', details.transaction_id);
        formData.append('transaction_screenshot', details.transaction_screenshot);

        for (let [key, value] of formData.entries()) {
          console.log(`${key}:`, value);
        }

        const paymentResponse = await axios.post(
          'http://localhost:5000/api/admin/save-payment-details',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (paymentResponse.data.status) {
          isPaymentDetailsSaved = true;
          toast.success('Payment details saved successfully');
          setPaymentStatus((prev) => ({ ...prev, [bitId]: true }));
        } else {
          toast.error(paymentResponse.data.msg);
          return;
        }
      } catch (err) {
        console.error('Error saving payment details:', err);
        toast.error(err.response?.data?.msg || 'Failed to save payment details. Please try again.');
        setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
        return;
      }
    }

    if (selectedStatusId) {
      try {
        const statusResponse = await axios.post('http://localhost:5000/api/admin/update-bit-status', {
          bit_id: bitId,
          student_id: studentId,
          project_id: projectId,
          bit_status_id: selectedStatusId,
          email,
        });

        if (statusResponse.data.status) {
          toast.success(
            statusResponse.data.msg === 'declined'
              ? 'Bid declined successfully'
              : 'Status updated successfully'
          );
          if (selectedStatusId === 2) {
            setApprovedProjects((prev) => prev.filter((project) => project.bit_id !== bitId));
          } else {
            const selectedStatusName =
              bitStatuses.find((status) => status.bit_status_id === selectedStatusId)
                ?.bit_status_name || 'Unknown';
            setApprovedProjects((prev) =>
              prev.map((project) =>
                project.bit_id === bitId
                  ? { ...project, latest_status_name: selectedStatusName }
                  : project
              )
            );
          }
        } else {
          toast.error(statusResponse.data.msg);
        }
      } catch (err) {
        console.error('Error updating status:', err);
        toast.error('Failed to update status. Please try again.');
        setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
        return;
      }
    } else if (!isPaymentDetailsSaved) {
      toast.error('Please select a status or provide payment details to save.');
      setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
      return;
    }

    setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick theme="light" />
      <h1 className="text-3xl font-bold text-center mb-8">Approved Projects</h1>

      {approvedProjects.length === 0 ? (
        <div className="text-center text-gray-600">No approved projects found.</div>
      ) : (
        approvedProjects.map((val, ind) => (
          <div
            key={ind}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{val.project_name}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Student Name</h3>
                  <p className="text-gray-600">{val.student_name}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Roll Number</h3>
                    <p className="text-gray-600">{val.roll_no}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Email</h3>
                    <p className="text-gray-600">{val.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">College</h3>
                    <p className="text-gray-600">{val.college_name}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Approval Date</h3>
                    <p className="text-gray-600">{val.formatted_datetime}</p>
                  </div>
                </div>

                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Current Status</h3>
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          val.latest_status_name === 'accepted' ||
                          val.latest_status_name === 'inprogress' ||
                          val.latest_status_name === 'completed' ||
                          val.latest_status_name === 'client_approved' ||
                          val.latest_status_name === 'payment_received'
                            ? 'bg-green-100 text-green-800'
                            : val.latest_status_name === 'declined'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {(val.latest_status_name || 'accepted')
                          .charAt(0)
                          .toUpperCase() + (val.latest_status_name || 'accepted').slice(1)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-700">Update Status</h3>
                      <select
                        value={selectedStatuses[val.bit_id] || ''}
                        onChange={(e) => handleStatusChange(val.bit_id, parseInt(e.target.value))}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="" disabled>
                          Select a status
                        </option>
                        {bitStatuses.map((status) => (
                          <option key={status.bit_status_id} value={status.bit_status_id}>
                            {status.bit_status_name.charAt(0).toUpperCase() +
                              status.bit_status_name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {val.latest_status_name === 'payment_received' && !paymentStatus[val.bit_id] && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-gray-700">Payment Details</h3>
                      <div className="grid grid-cols-1 gap-4">
                        <input
                          type="text"
                          placeholder="From Account Number"
                          value={paymentDetails[val.bit_id]?.from_account_number || ''}
                          onChange={(e) =>
                            handlePaymentInputChange(val.bit_id, 'from_account_number', e.target.value)
                          }
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="To Account Number"
                          value={paymentDetails[val.bit_id]?.to_account_number || ''}
                          onChange={(e) =>
                            handlePaymentInputChange(val.bit_id, 'to_account_number', e.target.value)
                          }
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                        <input
                          type="text"
                          placeholder="Transaction ID"
                          value={paymentDetails[val.bit_id]?.transaction_id || ''}
                          onChange={(e) =>
                            handlePaymentInputChange(val.bit_id, 'transaction_id', e.target.value)
                          }
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        />
                        <input
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={(e) => handleFileChange(val.bit_id, e)}
                          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <button
                      onClick={() => handleSave(val.bit_id, val.student_id, val.project_id, val.email, val)}
                      disabled={isSubmitting[val.bit_id]}
                      className={`mt-4 px-4 py-2 rounded-md text-white font-medium ${
                        isSubmitting[val.bit_id]
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      } transition duration-200`}
                    >
                      {isSubmitting[val.bit_id] ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ApprovedProjects;