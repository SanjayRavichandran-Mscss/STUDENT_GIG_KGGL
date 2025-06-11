// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function ProjectDetails() {
//   const { id, proid, credits } = useParams();
//   const decoded = atob(id); // Student ID
//   const decodedProject = atob(proid); // Project ID
//   const decodedCredits = atob(credits); // Credits
//   console.log("Decoded Credits:", decodedCredits); // For debugging

//   const [projectDetails, setProjectDetails] = useState([]);
//   const [hasBidded, setHasBidded] = useState(false);
//   const [bitStatus, setBitStatus] = useState(null); // Latest bid status
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchProjectDetails = async () => {
//       try {
//         setIsLoading(true);
//         // Fetch project details
//         const projectResponse = await axios.get(
//           `https://gig.kggeniuslabs.com/apiapi/stu/prodeatil/${decodedProject}`
//         );
//         setProjectDetails(
//           projectResponse.data.map((project) => ({
//             ...project,
//             formatted_expiry_date: formatExpiryDate(project.expiry_date),
//           }))
//         );

//         // Check if student has bidded and get latest bid status
//         const bidResponse = await axios.get(
//           `https://gig.kggeniuslabs.com/apiapi/admin/checkBid/${decoded}/${decodedProject}`
//         );
//         setHasBidded(bidResponse.data.hasBidded);
//         setBitStatus(bidResponse.data.bitStatus); // Store latest bid status
//       } catch (err) {
//         console.error("Error fetching project details or bid status:", err);
//         setError("Failed to load project details or bid status. Please try again.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchProjectDetails();
//   }, [decodedProject, decoded]);

//   const formatExpiryDate = (expiryDate) => {
//     const date = new Date(expiryDate);
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   const handleClick = async (stu_id, pro_id, credits) => {
//     let updatedCredits = credits - 1; // Decrease credits by 1
//     try {
//       setIsSubmitting(true);
//       const response = await axios.post(
//         `https://gig.kggeniuslabs.com/apiapi/admin/bitinfo`,
//         {
//           stu_id,
//           pro_id,
//         }
//       );

//       if (response.data === "bit_added") {
//         toast.success("Request sent successfully");
//         setHasBidded(true);
//         setBitStatus("pending"); // Set status to pending after placing bid
//       }

//       const updateCreditsResponse = await axios.put(
//         `https://gig.kggeniuslabs.com/apiapi/stu/updateBidCredits/${decoded}`,
//         {
//           bid_credits: updatedCredits,
//         }
//       );
//       if (updateCreditsResponse.status === "credits_updated") {
//         toast.success("Bid credits updated successfully");
//       }
//     } catch (err) {
//       console.error("Error submitting bid:", err);
//       toast.error("Failed to submit bid. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
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
//       <ToastContainer position="top-right" autoClose={3000} />
//       <h1 className="text-3xl font-bold text-center mb-8">Project Details</h1>

//       {projectDetails.map((val, ind) => (
//         <div
//           key={ind}
//           className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8"
//         >
//           <div className="p-8">
//             <h2 className="text-2xl font-bold text-gray-800 mb-4">{val.project_name}</h2>

//             <div className="space-y-4">
//               <div>
//                 <h3 className="text-lg font-medium text-gray-700">Description</h3>
//                 <p className="text-gray-600">{val.project_description}</p>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700">Expiry Date</h3>
//                   <p className="text-gray-600">{val.formatted_expiry_date}</p>
//                 </div>

//                 <div>
//                   <h3 className="text-lg font-medium text-gray-700">Required Skill</h3>
//                   <p className="text-gray-600">{val.skill_name}</p>
//                 </div>
//               </div>

//               <div className="pt-4 flex items-center space-x-3">
//                 {hasBidded ? (
//                   <>
//                     <span className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-md text-sm font-medium">
//                       Bid Submitted
//                     </span>
//                     {bitStatus && (
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                           bitStatus === "accepted" || bitStatus === "inprogress" || bitStatus === "completed" || bitStatus === "client_approved" || bitStatus === "payment_received"
//                             ? "bg-green-100 text-green-800"
//                             : bitStatus === "declined"
//                             ? "bg-red-100 text-red-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {bitStatus.charAt(0).toUpperCase() + bitStatus.slice(1)}
//                       </span>
//                     )}
//                   </>
//                 ) : (
//                   <>
//                     {decodedCredits > 0 ? (
//                       <button
//                         onClick={() => handleClick(decoded, val.project_id, decodedCredits)}
//                         disabled={isSubmitting}
//                         className={`px-6 py-2 rounded-md text-white font-medium ${
//                           isSubmitting
//                             ? "bg-gray-400 cursor-not-allowed"
//                             : "bg-indigo-600 hover:bg-indigo-700"
//                         } transition duration-200`}
//                       >
//                         {isSubmitting ? "Submitting..." : "Place Bid"}
//                       </button>
//                     ) : (
//                       <span className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-md text-sm font-medium">
//                         No Bid Credits Available
//                       </span>
//                     )}
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ProjectDetails;



















// ProjectDetails.jsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const MySwal = withReactContent(Swal);

function ProjectDetails() {
  const { id, proid, credits } = useParams();
  const decoded = atob(id); // Student ID
  const decodedProject = atob(proid); // Project ID
  const decodedCredits = atob(credits); // Credits

  const [projectDetails, setProjectDetails] = useState([]);
  const [hasBidded, setHasBidded] = useState(false);
  const [bitStatus, setBitStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "900.00",
    dateTime: new Date(),
    fromUpiId: "",
    toUpiId: "",
    transactionId: "",
    transactionScreenshot: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null); // Reset error state

        // Fetch project details
        const projectResponse = await axios.get(
          `https://gig.kggeniuslabs.com/apiapi/stu/prodeatil/${decodedProject}`
        );
        setProjectDetails(
          projectResponse.data.map((project) => ({
            ...project,
            formatted_expiry_date: formatExpiryDate(project.expiry_date),
          }))
        );

        // Check bid status
        const bidResponse = await axios.get(
          `https://gig.kggeniuslabs.com/apiapi/admin/checkBid/${decoded}/${decodedProject}`
        );
        setHasBidded(bidResponse.data.hasBidded);
        setBitStatus(bidResponse.data.bitStatus);

        // Fetch payment verification details if status is payment_received
        if (bidResponse.data.bitStatus === "payment_received") {
          try {
            const paymentResponse = await axios.get(
              `https://gig.kggeniuslabs.com/apiapi/admin/get-payment-verification/${decoded}/${decodedProject}`
            );
            if (paymentResponse.data.status && paymentResponse.data.data) {
              setPaymentDetails({
                ...paymentResponse.data.data,
                date_time: new Date(paymentResponse.data.data.date_time),
              });
            } else if (paymentResponse.data.status === false) {
              // Handle case where no payment verification is found
              setPaymentDetails(null);
              console.log("No payment verification found:", paymentResponse.data.msg);
            }
          } catch (paymentError) {
            console.error("Error fetching payment verification:", paymentError.response?.data?.msg || paymentError.message);
            // Don't set error state to allow other data to display
            setPaymentDetails(null);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err.response?.data?.msg || err.message);
        setError(err.response?.data?.msg || "Failed to load project or payment details. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [decoded, decodedProject]);

  const formatExpiryDate = (expiryDate) => {
    const date = new Date(expiryDate);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleClick = async (stu_id, pro_id, credits) => {
    let updatedCredits = parseInt(credits) - 1;
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `https://gig.kggeniuslabs.com/apiapi/admin/bitinfo`,
        {
          stu_id,
          pro_id,
        }
      );

      if (response.data === "bit_added") {
        toast.success("Request sent successfully");
        setHasBidded(true);
        setBitStatus("pending");
      }

      const updateCreditsResponse = await axios.put(
        `https://gig.kggeniuslabs.com/apiapi/stu/updateBidCredits/${decoded}`,
        {
          bid_credits: updatedCredits,
        }
      );
      if (updateCreditsResponse.data.status === "credits_updated") {
        toast.success("Bid credits updated successfully");
      }
    } catch (err) {
      console.error("Error submitting bid:", err.response?.data?.msg || err.message);
      toast.error(err.response?.data?.msg || "Failed to submit bid. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setPaymentFormData((prev) => ({ ...prev, dateTime: date }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && !['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'].includes(file.type)) {
      toast.error("Only JPEG, PNG, or PDF files are allowed");
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setPaymentFormData((prev) => ({ ...prev, transactionScreenshot: file }));
  };

  const validatePaymentForm = () => {
    const { amount, dateTime, fromUpiId, toUpiId, transactionId, transactionScreenshot } = paymentFormData;
    if (!amount || !dateTime || !fromUpiId || !toUpiId || !transactionId || !transactionScreenshot) {
      toast.error("All fields are required, including transaction screenshot");
      return false;
    }
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Amount must be a positive number");
      return false;
    }
    if (!Date.parse(dateTime)) {
      toast.error("Invalid date and time");
      return false;
    }
    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!validatePaymentForm()) return;

    MySwal.fire({
      title: "Confirm Submission",
      text: "Are you sure you want to submit the payment details?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Submit",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-lg shadow-xl p-6 bg-white max-w-sm",
        title: "text-base font-semibold text-gray-900 mb-4",
        confirmButton:
          "bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 text-sm ml-2",
        cancelButton:
          "bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 text-sm",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setIsSubmitting(true);
          const formData = new FormData();
          formData.append("student_id", decoded);
          formData.append("project_id", decodedProject);
          formData.append("amount", paymentFormData.amount);
          formData.append("date_time", paymentFormData.dateTime.toISOString());
          formData.append("from_upi_id", paymentFormData.fromUpiId);
          formData.append("to_upi_id", paymentFormData.toUpiId);
          formData.append("transaction_id", paymentFormData.transactionId);
          if (paymentFormData.transactionScreenshot) {
            formData.append("transaction_screenshot", paymentFormData.transactionScreenshot);
          }

          // Log FormData for debugging
          console.log("Payment FormData:");
          for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value);
          }

          const response = await axios.post(
            `https://gig.kggeniuslabs.com/apiapi/admin/save-payment-verification`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          if (response.data.status) {
            toast.success("Payment details submitted successfully");
            setPaymentDetails({
              amount: paymentFormData.amount,
              date_time: paymentFormData.dateTime,
              from_upi_id: paymentFormData.fromUpiId,
              to_upi_id: paymentFormData.toUpiId,
              transaction_id: paymentFormData.transactionId,
              transaction_screenshot: response.data.data?.transaction_screenshot || null,
            });
            setShowPaymentForm(false);
            setPaymentFormData({
              amount: "900.00",
              dateTime: new Date(),
              fromUpiId: "",
              toUpiId: "",
              transactionId: "",
              transactionScreenshot: null,
            });
          } else {
            throw new Error(response.data.msg || "Failed to submit payment details");
          }
        } catch (err) {
          console.error("Error submitting payment details:", err.response?.data?.msg || err.message);
          toast.error(err.response?.data?.msg || "Failed to submit payment details");
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  };

  const togglePaymentForm = () => {
    setShowPaymentForm(!showPaymentForm);
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
          <button
            onClick={() => window.location.reload()}
            className="ml-4 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold text-center mb-8">Project Details</h1>

      {projectDetails.length === 0 ? (
        <div className="text-center text-gray-600">No project details available.</div>
      ) : (
        projectDetails.map((val, ind) => (
          <div
            key={ind}
            className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-8"
          >
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{val.project_name}</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-700">Description</h3>
                  <p className="text-gray-600">{val.project_description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Expiry Date</h3>
                    <p className="text-gray-600">{val.formatted_expiry_date}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-700">Required Skill</h3>
                    <p className="text-gray-600">{val.skill_name}</p>
                  </div>
                </div>

                <div className="pt-4 flex items-center space-x-3">
                  {hasBidded ? (
                    <>
                      <span className="inline-block bg-green-100 text-green-800 px-6 py-2 rounded-md text-sm font-medium">
                        Bid Submitted
                      </span>
                      {bitStatus && (
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            bitStatus === "accepted" ||
                            bitStatus === "inprogress" ||
                            bitStatus === "completed" ||
                            bitStatus === "client_approved" ||
                            bitStatus === "payment_received"
                              ? "bg-green-100 text-green-800"
                              : bitStatus === "declined"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {bitStatus.charAt(0).toUpperCase() + bitStatus.slice(1)}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      {parseInt(decodedCredits) > 0 ? (
                        <button
                          onClick={() => handleClick(decoded, val.project_id, decodedCredits)}
                          disabled={isSubmitting}
                          className={`px-6 py-2 rounded-md text-white font-medium ${
                            isSubmitting
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-indigo-600 hover:bg-indigo-700"
                          } transition duration-200`}
                        >
                          {isSubmitting ? "Submitting..." : "Place Bid"}
                        </button>
                      ) : (
                        <span className="inline-block bg-red-100 text-red-800 px-6 py-2 rounded-md text-sm font-medium">
                          No Bid Credits Available
                        </span>
                      )}
                    </>
                  )}
                </div>

                {/* Payment Details Section */}
                {bitStatus === "payment_received" && (
                  <div className="mt-6">
                    <button
                      onClick={togglePaymentForm}
                      className="bg-indigo-600 text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition duration-200"
                      disabled={paymentDetails || isSubmitting}
                    >
                      {paymentDetails ? "View Payment Details" : "Enter Payment Details"}
                    </button>

                    {showPaymentForm && !paymentDetails && (
                      <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Payment Verification Form
                        </h3>
                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Amount (₹)</label>
                            <input
                              type="number"
                              name="amount"
                              value={paymentFormData.amount}
                              onChange={handlePaymentInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="Enter amount"
                              step="0.01"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                            <DatePicker
                              selected={paymentFormData.dateTime}
                              onChange={handleDateChange}
                              showTimeSelect
                              dateFormat="dd/MM/yyyy, HH:mm:ss"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">From UPI ID</label>
                            <input
                              type="text"
                              name="fromUpiId"
                              value={paymentFormData.fromUpiId}
                              onChange={handlePaymentInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="e.g., user@upi"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">To UPI ID</label>
                            <input
                              type="text"
                              name="toUpiId"
                              value={paymentFormData.toUpiId}
                              onChange={handlePaymentInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="e.g., admin@upi"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">Transaction ID</label>
                            <input
                              type="text"
                              name="transactionId"
                              value={paymentFormData.transactionId}
                              onChange={handlePaymentInputChange}
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm py-2 px-3 focus:border-indigo-500 focus:ring-indigo-500"
                              placeholder="e.g., TXN123456"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Transaction Screenshot
                            </label>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="mt-1 block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                              accept="image/jpeg,image/jpg,image/png,application/pdf"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div className="flex justify-end space-x-3">
                            <button
                              type="button"
                              onClick={togglePaymentForm}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-400 transition duration-200"
                              disabled={isSubmitting}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className={`px-4 py-2 text-white rounded-md text-sm font-medium ${
                                isSubmitting
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-indigo-600 hover:bg-indigo-700"
                              } transition duration-200`}
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? "Submitting..." : "Submit Payment Details"}
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {paymentDetails && (
                      <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-inner">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Submitted Payment Details
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                          <div>
                            <strong>Amount:</strong> ₹{parseFloat(paymentDetails.amount).toFixed(2)}
                          </div>
                          <div>
                            <strong>Date & Time:</strong>{" "}
                            {paymentDetails.date_time.toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                          <div>
                            <strong>From UPI ID:</strong> {paymentDetails.from_upi_id}
                          </div>
                          <div>
                            <strong>To UPI ID:</strong> {paymentDetails.to_upi_id}
                          </div>
                          <div>
                            <strong>Transaction ID:</strong> {paymentDetails.transaction_id}
                          </div>
                          <div>
                            <strong>Transaction Screenshot:</strong>{" "}
                            {paymentDetails.transaction_screenshot ? (
                              <a
                                href={`https://gig.kggeniuslabs.com/api${paymentDetails.transaction_screenshot.replace(/\\/g, '/')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline"
                              >
                                View
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default ProjectDetails;