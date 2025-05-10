// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";

// function BitConfirm() {
//   const { id } = useParams();
//   const decoded = atob(id);

//   const [bitInfo, setBitInfo] = useState([]);
//   useEffect(() => {
//     axios.get(`http://localhost:5000/admin/bittedDetail/${decoded}`).then((res) => {
//       setBitInfo(res.data);
//     });
//   }, [id]);

//   const handleClick = (stuid, proid, email) => {  
//     axios
//       .post(`http://localhost:5000/admin/accept/${stuid}/${proid}`, { email })
//       .then((res) => {
//         if (res.data === "updated") {
//           alert("Bitting Accepted");
//         } else {
//           alert("Network is down");
//         }
//       });
//   };

//   return (
//     <div className="p-4">
//       {bitInfo.map((val) => (
//         <div key={val.project_id} className="bg-white shadow-md rounded-lg p-6 mb-4">
//           <h2 className="text-xl font-semibold text-gray-800">{val.student_name}</h2>
//           <p className="text-gray-600">College Name: {val.college_name}</p>
//           <p className="text-gray-600">Bitted Project: {val.project_name}</p>
//           <div className="mt-4 space-x-3">
//             <button
//               onClick={() => handleClick(val.student_id, val.project_id, val.email)}
//               className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
//             >
//               Accept
//             </button>
//             <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400">
//               Decline
//             </button>
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

function BitConfirm() {
  const { id } = useParams();
  const decoded = atob(id);

  const [bitInfo, setBitInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch bitted project details
  useEffect(() => {
    const fetchBitInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/bittedDetail/${decoded}`, {
          withCredentials: true,
        });
        console.log("API response:", response.data); // Debug log
        if (Array.isArray(response.data)) {
          setBitInfo(response.data);
        } else {
          setError("Unexpected response format from server.");
        }
      } catch (err) {
        console.error("Error fetching bitted details:", err);
        setError("Failed to load bitted projects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBitInfo();
  }, [decoded]);

  // Handle Accept button
  const handleAccept = async (stuid, proid, email) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/admin/accept/${stuid}/${proid}`,
        { email },
        { withCredentials: true }
      );
      console.log("Accept response:", response.data); // Debug log
      if (response.data === "updated") {
        alert("Bitting Accepted");
        // Optionally remove the accepted project from the list
        setBitInfo(bitInfo.filter((item) => !(item.student_id === stuid && item.project_id === proid)));
      } else {
        alert("Failed to accept bitting.");
      }
    } catch (err) {
      console.error("Error accepting bitting:", err);
      alert("Error accepting bitting. Please try again.");
    }
  };

  // Handle Decline button
  const handleDecline = async (stuid, proid, email) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/admin/decline/${stuid}/${proid}`,
        { email },
        { withCredentials: true }
      );
      console.log("Decline response:", response.data); // Debug log
      if (response.data === "declined") {
        alert("Bitting Declined");
        // Remove the declined project from the list
        setBitInfo(bitInfo.filter((item) => !(item.student_id === stuid && item.project_id === proid)));
      } else {
        alert("Failed to decline bitting.");
      }
    } catch (err) {
      console.error("Error declining bitting:", err);
      alert("Error declining bitting. Please try again.");
    }
  };

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
        <p className="text-xl text-gray-600">No bitted projects found for this student.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {bitInfo.map((val) => (
        <div key={`${val.student_id}-${val.project_id}`} className="bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{val.student_name}</h2>
          <p className="text-gray-600">College Name: {val.college_name}</p>
          <p className="text-gray-600">Bitted Project: {val.project_name}</p>
          <p className="text-gray-600">Email: {val.email}</p>
          <div className="mt-4 space-x-3">
            <button
              onClick={() => handleAccept(val.student_id, val.project_id, val.email)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Accept
            </button>
            <button
              onClick={() => handleDecline(val.student_id, val.project_id, val.email)}
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Decline
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BitConfirm;