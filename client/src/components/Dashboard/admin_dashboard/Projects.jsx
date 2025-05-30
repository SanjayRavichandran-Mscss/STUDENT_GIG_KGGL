// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FaBell } from "react-icons/fa";

// function Projects() {
//   const [notificationCount, setNotificationCount] = useState({});
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     // Fetch all projects
//     axios.get("http://103.118.158.24/api/api /admin/getallprojects").then((res) => {
//       setProjects(
//         res.data.map((project) => ({
//           ...project,
//           formatted_expiry_date: formatExpiryDate(project.expiry_date),
//           formatted_created_at: formatExpiryDate(project.created_at),
//         }))
//       );
//     });

//     // Fetch pending bid counts (only bids with bit_status_id IS NULL)
//     axios.get("http://103.118.158.24/api/api /admin/getbit").then((res) => {
//       const countMap = {};
//       res.data.forEach((item) => {
//         countMap[item.project_id] = item.count;
//       });
//       setNotificationCount(countMap);
//     }).catch((err) => {
//       console.error("Error fetching pending bid counts:", err);
//     });
//   }, []);

//   const formatExpiryDate = (expiryDate) => {
//     let date = new Date(expiryDate);
//     let hours = date.getHours();
//     let minutes = date.getMinutes();
//     let ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12;
//     minutes = minutes < 10 ? "0" + minutes : minutes;
//     let formattedTime = hours + ":" + minutes + " " + ampm;
//     let options = { year: "numeric", month: "long", day: "numeric" };
//     let formattedDate = date.toLocaleDateString("en-US", options);
//     return formattedDate + " " + formattedTime;
//   };

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-semibold text-gray-600 mb-4">Projects</h1>
//       {projects.map((val) => (
//         <div
//           key={val.project_id}
//           className="bg-white shadow-md rounded-lg p-6 mb-4"
//         >
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">
//               {val.project_name}
//             </h2>
//             <Link
//               to={`/bitconfirm/${btoa(val.project_id)}`}
//               className="text-gray-800"
//             >
//               <div className="relative">
//                 <FaBell size={24} />
//                 {notificationCount[val.project_id] > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                     {notificationCount[val.project_id]}
//                   </span>
//                 )}
//               </div>
//             </Link>
//           </div>
//           <p className="text-gray-600">Description: {val.description}</p>
//           <p className="text-gray-600">Created at: {val.formatted_created_at}</p>
//           <p className="text-gray-600">Expiry Date: {val.formatted_expiry_date}</p>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default Projects;










import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBell } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Projects() {
  const [notificationCount, setNotificationCount] = useState({});
  const [projects, setProjects] = useState([]);
  const [expiredProjects, setExpiredProjects] = useState([]);
  const [newExpiryDates, setNewExpiryDates] = useState({});

  useEffect(() => {
    // Fetch all projects
    axios.get("http://103.118.158.24/api/api /admin/getallprojects").then((res) => {
      setProjects(
        res.data.map((project) => ({
          ...project,
          formatted_expiry_date: formatExpiryDate(project.expiry_date),
          formatted_created_at: formatExpiryDate(project.created_at),
        }))
      );
    }).catch((err) => {
      console.error("Error fetching all projects:", err);
      toast.error("Failed to fetch projects", {
        position: "top-right",
        autoClose: 3000,
      });
    });

    // Fetch expired projects
    axios.get("http://103.118.158.24/api/api /admin/getexpiredprojects").then((res) => {
      setExpiredProjects(
        res.data.map((project) => project.project_id)
      );
    }).catch((err) => {
      console.error("Error fetching expired projects:", err);
      toast.error("Failed to fetch expired projects", {
        position: "top-right",
        autoClose: 3000,
      });
    });

    // Fetch pending bid counts
    axios.get("http://103.118.158.24/api/api /admin/getbit").then((res) => {
      const countMap = {};
      res.data.forEach((item) => {
        countMap[item.project_id] = item.count;
      });
      setNotificationCount(countMap);
    }).catch((err) => {
      console.error("Error fetching pending bid counts:", err);
      toast.error("Failed to fetch pending bid counts", {
        position: "top-right",
        autoClose: 3000,
      });
    });
  }, []);

  const formatExpiryDate = (expiryDate) => {
    let date = new Date(expiryDate);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    let formattedTime = hours + ":" + minutes + " " + ampm;
    let options = { year: "numeric", month: "long", day: "numeric" };
    let formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate + " " + formattedTime;
  };

  const handleExpiryDateChange = (projectId, value) => {
    setNewExpiryDates((prev) => ({
      ...prev,
      [projectId]: value,
    }));
  };

  const handleUpdateExpiry = async (projectId) => {
    const newExpiryDate = newExpiryDates[projectId];
    if (!newExpiryDate) {
      toast.warn("Please select a new expiry date and time", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      const response = await axios.post("http://103.118.158.24/api/api /admin/updateprojectexpiry", {
        project_id: projectId,
        new_expiry_date: newExpiryDate,
      });
      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });
      // Refresh projects and expired projects
      const [allProjectsRes, expiredProjectsRes] = await Promise.all([
        axios.get("http://103.118.158.24/api/api /admin/getallprojects"),
        axios.get("http://103.118.158.24/api/api /admin/getexpiredprojects"),
      ]);
      setProjects(
        allProjectsRes.data.map((project) => ({
          ...project,
          formatted_expiry_date: formatExpiryDate(project.expiry_date),
          formatted_created_at: formatExpiryDate(project.created_at),
        }))
      );
      setExpiredProjects(
        expiredProjectsRes.data.map((project) => project.project_id)
      );
      // Clear the input field
      setNewExpiryDates((prev) => ({
        ...prev,
        [projectId]: "",
      }));
    } catch (err) {
      console.error("Error updating expiry date:", err);
      toast.error(err.response?.data || "Failed to update expiry date", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  // Get today's date in YYYY-MM-DDTHH:MM format for min attribute
  const getMinDateTime = () => {
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    return today.toISOString().slice(0, 16);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-gray-600 mb-4">Projects</h1>
      {projects.map((val) => (
        <div
          key={val.project_id}
          className="bg-white shadow-md rounded-lg p-6 mb-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {val.project_name}
            </h2>
            <Link
              to={`/bitconfirm/${btoa(val.project_id)}`}
              className="text-gray-800"
            >
              <div className="relative">
                <FaBell size={24} />
                {notificationCount[val.project_id] > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                    {notificationCount[val.project_id]}
                  </span>
                )}
              </div>
            </Link>
          </div>
          <p className="text-gray-600">Description: {val.description}</p>
          <p className="text-gray-600">Created at: {val.formatted_created_at}</p>
          <p className="text-gray-600">
            Expiry Date: {val.formatted_expiry_date}
            {expiredProjects.includes(val.project_id) && (
              <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Expired
              </span>
            )}
          </p>
          {expiredProjects.includes(val.project_id) && (
            <div className="mt-4">
              <label htmlFor={`extend-${val.project_id}`} className="text-gray-600">
                Extend Expiry Date:
              </label>
              <input
                type="datetime-local"
                id={`extend-${val.project_id}`}
                className="ml-2 border border-gray-300 rounded p-1"
                value={newExpiryDates[val.project_id] || ""}
                onChange={(e) => handleExpiryDateChange(val.project_id, e.target.value)}
                min={getMinDateTime()}
              />
              <button
                onClick={() => handleUpdateExpiry(val.project_id)}
                className="ml-2 bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          )}
        </div>
      ))}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover />
    </div>
  );
}

export default Projects;