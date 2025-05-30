import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';
import { format, parseISO } from 'date-fns';
import { ZoomIn, Download } from 'lucide-react';
import Swal from 'sweetalert2';

// Bind modal to app element
Modal.setAppElement('#root');

function ApprovedProjects() {
  const [approvedProjects, setApprovedProjects] = useState([]);
  const [bitStatuses, setBitStatuses] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [paymentStatus, setPaymentStatus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState({});
  const [expandedProject, setExpandedProject] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch approved projects
        const projectsResponse = await axios.get('http://103.118.158.24/api/api /admin/accepted-bits');
        const projects = projectsResponse.data.result.map((project) => ({
          ...project,
          formatted_datetime: formatDate(project.datetime),
        }));
        setApprovedProjects(projects);

        // Fetch bit statuses
        const statusesResponse = await axios.get('http://103.118.158.24/api/api /admin/bit-statuses');
        setBitStatuses(statusesResponse.data.result);

        // Fetch payment status for each project
        const paymentStatusPromises = projects.map((project) =>
          axios.get(`http://103.118.158.24/api/api /admin/check-payment/${project.student_id}/${project.project_id}`)
        );
        const paymentStatusResponses = await Promise.allSettled(paymentStatusPromises);
        const paymentStatusMap = {};
        projects.forEach((project, index) => {
          const response = paymentStatusResponses[index];
          paymentStatusMap[project.bit_id] =
            response.status === 'fulfilled' && response.value.data.status
              ? response.value.data.payment
              : null;
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

  // Format date to "MMMM d, yyyy, hh:mm:ss a" (e.g., May 21, 2025, 04:15:01 PM)
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'MMMM d, yyyy, hh:mm:ss a');
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString; // Fallback to original string if parsing fails
    }
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
    if (file) {
      setPaymentDetails((prev) => ({
        ...prev,
        [bitId]: {
          ...prev[bitId],
          transaction_screenshot: file,
          fileName: file.name,
        },
      }));
    }
  };

  const toggleExpandProject = (bitId) => {
    setExpandedProject(expandedProject === bitId ? null : bitId);
  };

  const openModal = (imageUrl) => {
    setCurrentImage(`http://localhost:5000/${imageUrl}`);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setCurrentImage('');
  };

  const openImageInNewTab = () => {
    if (currentImage) {
      window.open(currentImage, '_blank');
    }
  };

  const downloadImage = async () => {
    if (currentImage) {
      try {
        const response = await fetch(currentImage);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'transaction-screenshot.jpg'; // Default filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error('Error downloading image:', err);
        toast.error('Failed to download image.');
      }
    }
  };

  const getStatusColor = (statusName) => {
    switch (statusName) {
      case 'accepted':
        return 'bg-blue-100 text-blue-800';
      case 'inprogress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'client_approved':
        return 'bg-indigo-100 text-indigo-800';
      case 'payment_received':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSave = async (bitId, studentId, projectId, email, val) => {
    const selectedStatusId = selectedStatuses[bitId];
    let isPaymentDetailsSaved = false;

    // Confirmation alert for denied (bit_status_id = 2) or payment_received (bit_status_id = 12)
    if (selectedStatusId === 2 || selectedStatusId === 12) {
      const actionText = selectedStatusId === 2 ? 'decline this bid' : 'mark this bid as payment received';
      const confirmColor = selectedStatusId === 2 ? '#dc2626' : '#16a34a'; // Red for denied, green for payment_received
      const result = await Swal.fire({
        title: `Are you sure you want to ${actionText}?`,
        text: `This action will update the status to "${selectedStatusId === 2 ? 'Declined' : 'Payment Received'}".`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: confirmColor,
        cancelButtonColor: '#6b7280', // Neutral gray for cancel
        confirmButtonText: 'Yes, proceed!',
        cancelButtonText: 'Cancel',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-semibold text-gray-800',
          content: 'text-gray-600',
          confirmButton: 'px-4 py-2 text-white font-medium rounded-md',
          cancelButton: 'px-4 py-2 text-white font-medium rounded-md',
        },
      });

      if (!result.isConfirmed) {
        setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
        return;
      }
    }

    if (val.latest_status_name === 'payment_received' && !paymentStatus[bitId]) {
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

        const paymentResponse = await axios.post(
          'http://103.118.158.24/api/api /admin/save-payment-details',
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
          setPaymentStatus((prev) => ({
            ...prev,
            [bitId]: paymentResponse.data.payment,
          }));
        } else {
          toast.error(paymentResponse.data.msg || 'Failed to save payment details');
          setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
          return;
        }
      } catch (err) {
        console.error('Error saving payment details:', err);
        if (err.response?.status === 500) {
          isPaymentDetailsSaved = true;
          toast.success('Payment details saved successfully');
          try {
            const updatedPayment = await axios.get(
              `http://103.118.158.24/api/api /admin/check-payment/${studentId}/${projectId}`
            );
            setPaymentStatus((prev) => ({
              ...prev,
              [bitId]: updatedPayment.data.payment,
            }));
          } catch (fetchErr) {
            console.error('Error fetching updated payment status:', fetchErr);
            toast.error('Payment saved, but failed to refresh status.');
          }
        } else {
          toast.error(err.response?.data?.msg || 'Failed to save payment details. Please try again.');
          setIsSubmitting((prev) => ({ ...prev, [bitId]: false }));
          return;
        }
      }

      setPaymentDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[bitId];
        return newDetails;
      });
    }

    if (selectedStatusId && !paymentStatus[bitId]) {
      try {
        const statusResponse = await axios.post('http://103.118.158.24/api/api /admin/update-bit-status', {
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
          toast.error(statusResponse.data.msg || 'Failed to update status');
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
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="relative max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-blue-800">Transaction Screenshot</h3>
            <div className="flex space-x-2">
              <button
                onClick={openImageInNewTab}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                title="Open in new tab"
              >
                <ZoomIn className="h-6 w-6" />
              </button>
              <button
                onClick={downloadImage}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                title="Download image"
              >
                <Download className="h-6 w-6" />
              </button>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mt-4">
            {currentImage && (
              <img
                src={currentImage}
                alt="Transaction Screenshot"
                className="max-w-full max-h-[80vh] mx-auto"
              />
            )}
          </div>
        </div>
      </Modal>

      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-blue-800">Approved Projects</h1>
            <p className="mt-2 text-sm text-blue-600">
              Manage all approved student projects and track their progress
            </p>
          </div>
        </div>

        {approvedProjects.length === 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <svg
                className="mx-auto h-12 w-12 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-blue-800">No approved projects</h3>
              <p className="mt-1 text-sm text-blue-600">
                There are currently no approved projects to display.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {approvedProjects.map((project) => (
              <div
                key={project.bit_id}
                className="bg-white shadow overflow-hidden rounded-lg border border-blue-100"
              >
                <div className="px-4 py-5 sm:px-6 border-b border-blue-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <h3 className="text-lg leading-6 font-medium text-blue-800">
                        {project.project_name} - {project.student_name}
                      </h3>
                      <span
                        className={`ml-3 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          project.latest_status_name
                        )}`}
                      >
                        {project.latest_status_name
                          ? project.latest_status_name.charAt(0).toUpperCase() +
                            project.latest_status_name.slice(1)
                          : 'Pending'}
                      </span>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <button
                        onClick={() => toggleExpandProject(project.bit_id)}
                        className="inline-flex items-center px-3 py-1 border border-blue-300 shadow-sm text-sm leading-4 font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        {expandedProject === project.bit_id ? 'Hide details' : 'Show details'}
                        <svg
                          className={`ml-2 h-4 w-4 transform ${
                            expandedProject === project.bit_id ? 'rotate-180' : ''
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {expandedProject === project.bit_id && (
                  <div className="border-t border-blue-200 px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium text-blue-600">Student Information</h4>
                        <div className="mt-1 text-sm text-blue-800 space-y-2">
                          <p>
                            <span className="font-medium">Student Name:</span> {project.student_name}
                          </p>
                          <p>
                            <span className="font-medium">Roll No:</span> {project.roll_no}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span> {project.email}
                          </p>
                          <p>
                            <span className="font-medium">College:</span> {project.college_name}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-blue-600">Project Details</h4>
                        <div className="mt-1 text-sm text-blue-800 space-y-2">
                          <p>
                            <span className="font-medium">Approved On:</span>{' '}
                            {project.formatted_datetime}
                          </p>
                          <p>
                            <span className="font-medium">Project Name:</span> {project.project_name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      {project.latest_status_name === 'payment_received' &&
                      !paymentStatus[project.bit_id] ? (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <h4 className="text-sm font-medium text-blue-700 mb-3">
                            Payment Details
                          </h4>
                          <div className="grid grid-cols-1 gap-y-4 gap-x-4 sm:grid-cols-2">
                            <div>
                              <label
                                htmlFor={`from-account-${project.bit_id}`}
                                className="block text-sm font-medium text-blue-600"
                              >
                                From Account Number
                              </label>
                              <input
                                type="text"
                                id={`from-account-${project.bit_id}`}
                                value={paymentDetails[project.bit_id]?.from_account_number || ''}
                                onChange={(e) =>
                                  handlePaymentInputChange(
                                    project.bit_id,
                                    'from_account_number',
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-blue-300 rounded-md p-2 border"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`to-account-${project.bit_id}`}
                                className="block text-sm font-medium text-blue-600"
                              >
                                To Account Number
                              </label>
                              <input
                                type="text"
                                id={`to-account-${project.bit_id}`}
                                value={paymentDetails[project.bit_id]?.to_account_number || ''}
                                onChange={(e) =>
                                  handlePaymentInputChange(
                                    project.bit_id,
                                    'to_account_number',
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-blue-300 rounded-md p-2 border"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`transaction-id-${project.bit_id}`}
                                className="block text-sm font-medium text-blue-600"
                              >
                                Transaction ID
                              </label>
                              <input
                                type="text"
                                id={`transaction-id-${project.bit_id}`}
                                value={paymentDetails[project.bit_id]?.transaction_id || ''}
                                onChange={(e) =>
                                  handlePaymentInputChange(
                                    project.bit_id,
                                    'transaction_id',
                                    e.target.value
                                  )
                                }
                                className="mt-1 block w-full shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 border-blue-300 rounded-md p-2 border"
                              />
                            </div>

                            <div>
                              <label
                                htmlFor={`screenshot-${project.bit_id}`}
                                className="block text-sm font-medium text-blue-600"
                              >
                                Transaction Screenshot
                              </label>
                              <div className="mt-1 flex items-center">
                                <label
                                  htmlFor={`screenshot-${project.bit_id}`}
                                  className="cursor-pointer bg-white py-2 px-3 border border-blue-300 rounded-md shadow-sm text-sm leading-4 font-medium text-blue-700 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  <span>
                                    {paymentDetails[project.bit_id]?.fileName || 'Choose file'}
                                  </span>
                                  <input
                                    id={`screenshot-${project.bit_id}`}
                                    name={`screenshot-${project.bit_id}`}
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(project.bit_id, e)}
                                    className="sr-only"
                                  />
                                </label>
                                {paymentDetails[project.bit_id]?.fileName && (
                                  <span className="ml-2 text-sm text-blue-600 truncate max-w-xs">
                                    {paymentDetails[project.bit_id].fileName}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : paymentStatus[project.bit_id] ? (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <h4 className="text-sm font-medium text-green-700 mb-2">
                            Payment Confirmed
                          </h4>
                          <div className="grid grid-cols-1 gap-y-2 sm:grid-cols-2">
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Transaction ID:</span>{' '}
                              {paymentStatus[project.bit_id].transaction_id}
                            </p>
                            <p className="text-sm text-green-800">
                              <span className="font-medium">From Account:</span>{' '}
                              {paymentStatus[project.bit_id].from_account_number}
                            </p>
                            <p className="text-sm text-green-800">
                              <span className="font-medium">To Account:</span>{' '}
                              {paymentStatus[project.bit_id].to_account_number}
                            </p>
                            <p className="text-sm text-green-800">
                              <span className="font-medium">Date:</span>{' '}
                              {formatDate(paymentStatus[project.bit_id].created_at)}
                            </p>
                            {paymentStatus[project.bit_id].transaction_screenshot && (
                              <div className="col-span-2">
                                <button
                                  onClick={() =>
                                    openModal(paymentStatus[project.bit_id].transaction_screenshot)
                                  }
                                  className="text-sm text-blue-600 hover:text-blue-800 underline focus:outline-none"
                                >
                                  View Transaction Screenshot
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : null}

                      {!paymentStatus[project.bit_id] && (
                        <div className="mt-6">
                          {/* <h4 className="text-sm font-medium text-blue-600 mb-3">
                            Update Project Status
                          </h4> */}
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
                            {project.latest_status_name !== 'payment_received' && (
                              <select
                                value={selectedStatuses[project.bit_id] || ''}
                                onChange={(e) =>
                                  handleStatusChange(project.bit_id, parseInt(e.target.value))
                                }
                                className="block w-full pl-3 pr-10 py-2 text-base border-blue-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md border"
                              >
                                <option value="" disabled>
                                  Select new status
                                </option>
                                {bitStatuses.map((status) => (
                                  <option key={status.bit_status_id} value={status.bit_status_id}>
                                    {status.bit_status_name.charAt(0).toUpperCase() +
                                      status.bit_status_name.slice(1)}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              onClick={() =>
                                handleSave(
                                  project.bit_id,
                                  project.student_id,
                                  project.project_id,
                                  project.email,
                                  project
                                )
                              }
                              disabled={isSubmitting[project.bit_id]}
                              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                                isSubmitting[project.bit_id]
                                  ? 'bg-blue-300'
                                  : 'bg-blue-600 hover:bg-blue-700'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 w-full sm:w-auto`}
                            >
                              {isSubmitting[project.bit_id] ? (
                                <>
                                  <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                  Processing...
                                </>
                              ) : (
                                'Save Changes'
                              )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx global>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          margin-right: -50%;
          transform: translate(-50%, -50%);
          background: white;
          padding: 20px;
          border-radius: 8px;
          outline: none;
          max-width: 90%;
          max-height: 90vh;
          overflow: auto;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
      `}</style>
    </div>
  );
}

export default ApprovedProjects;