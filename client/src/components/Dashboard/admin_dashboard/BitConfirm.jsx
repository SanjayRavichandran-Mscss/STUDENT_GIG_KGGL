// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// function BitConfirm() {
//   const { id } = useParams();
//   const decoded = atob(id);

//   const [bitInfo, setBitInfo] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch bitted project details
//   useEffect(() => {
//     const fetchBitInfo = async () => {
//       try {
//         const response = await axios.get(
//           `https://gig.kggeniuslabs.com/api/api/admin/bittedDetail/${decoded}`,
//           {
//             withCredentials: true,
//           }
//         );
//         console.log("API response:", response.data);
//         if (Array.isArray(response.data)) {
//           // Filter out duplicates based on email and project_id
//           const uniqueBitInfo = response.data.reduce((acc, current) => {
//             const isDuplicate = acc.some(
//               (item) =>
//                 item.email === current.email &&
//                 item.project_id === current.project_id
//             );
//             if (!isDuplicate) {
//               acc.push(current);
//             }
//             return acc;
//           }, []);
//           setBitInfo(uniqueBitInfo);
//         } else {
//           setError("Unexpected response format from server.");
//           toast.error("Unexpected response format from server.", {
//             position: "top-right",
//             autoClose: 3000,
//           });
//         }
//       } catch (err) {
//         console.error("Error fetching bitted details:", err);
//         setError("Failed to load bitted projects. Please try again.");
//         toast.error("Failed to load bitted projects. Please try again.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchBitInfo();
//   }, [decoded]);

//   // Handle Accept button
//   const handleAccept = async (stuid, proid, email) => {
//     try {
//       const response = await axios.post(
//         `https://gig.kggeniuslabs.com/api/api/admin/accept/${stuid}/${proid}`,
//         { email },
//         { withCredentials: true }
//       );
//       console.log("Accept response:", response.data);
//       if (response.data === "updated") {
//         toast.success("Bitting Accepted", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setBitInfo((prev) =>
//           prev.map((item) =>
//             item.student_id === stuid && item.project_id === proid
//               ? { ...item, bit_status_id: 1, bit_status_name: "approved" }
//               : item
//           )
//         );
//       } else {
//         toast.error("Failed to accept bitting.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (err) {
//       console.error("Error accepting bitting:", err);
//       toast.error("Error accepting bitting. Please try again.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   // Handle Decline button
//   const handleDecline = async (stuid, proid, email) => {
//     try {
//       const response = await axios.post(
//         `https://gig.kggeniuslabs.com/api/api/admin/decline/${stuid}/${proid}`,
//         { email },
//         { withCredentials: true }
//       );
//       console.log("Decline response:", response.data);
//       if (response.data === "declined") {
//         toast.success("Bitting Declined", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setBitInfo((prev) =>
//           prev.map((item) =>
//             item.student_id === stuid && item.project_id === proid
//               ? { ...item, bit_status_id: 2, bit_status_name: "denied" }
//               : item
//           )
//         );
//       } else {
//         toast.error("Failed to decline bitting.", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//       }
//     } catch (err) {
//       console.error("Error declining bitting:", err);
//       toast.error("Error declining bitting. Please try again.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="p-4">
//         <p className="text-xl text-gray-600">Loading bitted projects...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-4">
//         <p className="text-xl text-red-600">{error}</p>
//       </div>
//     );
//   }

//   if (bitInfo.length === 0) {
//     return (
//       <div className="p-4">
//         <p className="text-xl text-gray-600">
//           No bitted projects found for this project.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <ToastContainer position="top-right" autoClose={3000} />
//       {bitInfo.map((val) => (
//         <div
//           key={val.bit_id} // Changed to use bit_id for uniqueness
//           className="bg-white shadow-md rounded-lg p-6 mb-4"
//         >
//           <h2 className="text-xl font-semibold text-gray-800">
//             {val.student_name}
//           </h2>
//           <p className="text-gray-600">College Name: {val.college_name}</p>
//           <p className="text-gray-600">Bitted Project: {val.project_name}</p>
//           <p className="text-gray-600">Email: {val.email}</p>
//           <div className="mt-4">
//             {val.bit_status_name === "approved" ? (
//               <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
//                 Accepted
//               </span>
//             ) : val.bit_status_name === "denied" ? (
//               <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
//                 Declined
//               </span>
//             ) : (
//               <div className="space-x-3">
//                 <button
//                   onClick={() =>
//                     handleAccept(val.student_id, val.project_id, val.email)
//                   }
//                   className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
//                 >
//                   Approve
//                 </button>
//                 <button
//                   onClick={() =>
//                     handleDecline(val.student_id, val.project_id, val.email)
//                   }
//                   className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
//                 >
//                   Disapprove
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default BitConfirm;











import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function BitConfirm() {
  // Define all hooks at the top
  const [bitInfo, setBitInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [decodeError, setDecodeError] = useState(null);

  const { id, projectId } = useParams();
  let decodedAdminId, decodedProjectId;

  // Decode URL parameters
  try {
    decodedAdminId = atob(id); // e.g., NQ== → 5
    decodedProjectId = atob(projectId); // e.g., NA== → 4
    decodedAdminId = parseInt(decodedAdminId);
    decodedProjectId = parseInt(decodedProjectId);
    if (isNaN(decodedAdminId) || isNaN(decodedProjectId)) {
      throw new Error("Invalid admin or project ID");
    }
  } catch (err) {
    console.error("Error decoding URL parameters:", err);
    setDecodeError("Invalid URL parameters.");
  }

  // Fetch bitted project details
  useEffect(() => {
    if (decodeError || !decodedAdminId || !decodedProjectId) return;

    const fetchBitInfo = async () => {
      try {
        const response = await axios.get(
          `https://gig.kggeniuslabs.com/api/api/admin/bittedDetail/${decodedProjectId}`,
          {
            headers: {
              "Admin-ID": decodedAdminId,
            },
            withCredentials: true,
          }
        );
        console.log("API response:", response.data);
        if (Array.isArray(response.data)) {
          // Filter out duplicates based on email and project_id
          const uniqueBitInfo = response.data.reduce((acc, current) => {
            const isDuplicate = acc.some(
              (item) =>
                item.email === current.email &&
                item.project_id === current.project_id
            );
            if (!isDuplicate) {
              acc.push(current);
            }
            return acc;
          }, []);
          setBitInfo(uniqueBitInfo);
        } else {
          setError("Unexpected response format from server.");
          toast.error("Unexpected response format from server.", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } catch (err) {
        console.error("Error fetching bitted details:", err);
        setError("Failed to load bitted projects. Please try again.");
        toast.error("Failed to load bitted projects. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBitInfo();
  }, [decodedProjectId, decodedAdminId, decodeError]);

  // Handle Accept button
  const handleAccept = async (stuid, proid, email) => {
    try {
      const response = await axios.post(
        `https://gig.kggeniuslabs.com/api/api/admin/accept/${stuid}/${proid}`,
        { email },
        {
          headers: {
            "Admin-ID": decodedAdminId,
          },
          withCredentials: true,
        }
      );
      console.log("Accept response:", response.data);
      if (response.data === "updated") {
        toast.success("Bitting Accepted", {
          position: "top-right",
          autoClose: 3000,
        });
        setBitInfo((prev) =>
          prev.map((item) =>
            item.student_id === stuid && item.project_id === proid
              ? { ...item, bit_status_id: 1, bit_status_name: "approved" }
              : item
          )
        );
      } else {
        toast.error("Failed to accept bitting.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error accepting bitting:", err);
      toast.error("Error accepting bitting. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Handle Decline button
  const handleDecline = async (stuid, proid, email) => {
    try {
      const response = await axios.post(
        `https://gig.kggeniuslabs.com/api/api/admin/decline/${stuid}/${proid}`,
        { email },
        {
          headers: {
            "Admin-ID": decodedAdminId,
          },
          withCredentials: true,
        }
      );
      console.log("Decline response:", response.data);
      if (response.data === "declined") {
        toast.success("Bitting Declined", {
          position: "top-right",
          autoClose: 3000,
        });
        setBitInfo((prev) =>
          prev.map((item) =>
            item.student_id === stuid && item.project_id === proid
              ? { ...item, bit_status_id: 2, bit_status_name: "denied" }
              : item
          )
        );
      } else {
        toast.error("Failed to decline bitting.", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Error declining bitting:", err);
      toast.error("Error declining bitting. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Render decode error
  if (decodeError) {
    toast.error(decodeError, {
      position: "top-right",
      autoClose: 3000,
    });
    return (
      <div className="p-4">
        <p className="text-xl text-red-600">{decodeError}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <p className="text-xl text-gray-600">Loading bitted projects...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  if (bitInfo.length === 0) {
    return (
      <div className="p-4">
        <p className="text-xl text-gray-600">
          No bitted projects found for this project.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ToastContainer position="top-right" autoClose={3000} />
      {bitInfo.map((val) => (
        <div
          key={val.bit_id} // Changed to use bit_id for uniqueness
          className="bg-white shadow-md rounded-lg p-6 mb-4"
        >
          <h2 className="text-xl font-semibold text-gray-800">
            {val.student_name}
          </h2>
          <p className="text-gray-600">College Name: {val.college_name}</p>
          <p className="text-gray-600">Bitted Project: {val.project_name}</p>
          <p className="text-gray-600">Email: {val.email}</p>
          <div className="mt-4">
            {val.bit_status_name === "approved" ? (
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Accepted
              </span>
            ) : val.bit_status_name === "denied" ? (
              <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                Declined
              </span>
            ) : (
              <div className="space-x-3">
                <button
                  onClick={() =>
                    handleAccept(val.student_id, val.project_id, val.email)
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    handleDecline(val.student_id, val.project_id, val.email)
                  }
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
                >
                  Disapprove
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BitConfirm;