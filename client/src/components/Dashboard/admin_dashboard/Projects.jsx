// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { FaBell } from "react-icons/fa";

// function Projects() {
//   const [notificationCount, setNotificationCount] = useState(5);
//   const [projects, setProjects] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:5000/admin/getallprojects").then((res) => {
//       setProjects(
//         res.data.map((project) => ({
//           ...project,
//           formatted_expiry_date: formatExpiryDate(project.expiry_date),
//           formatted_created_at: formatExpiryDate(project.created_at),
//         }))
//       );
//     });
//     fetch("http://localhost:5000/admin/getbit")
//       .then(res => res.json())
//       .then(data => setNotificationCount(data.length));
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
//         <div key={val.project_id} className="bg-white shadow-md rounded-lg p-6 mb-4">
//           <div className="flex justify-between items-center">
//             <h2 className="text-xl font-semibold text-gray-800">{val.project_name}</h2>
//             <Link to={`/bitconfirm/${btoa(val.project_id)}`} className="text-gray-800">
//               <div className="relative">
//                 <FaBell size={24} />
//                 {val.bit_count > 0 && (
//                   <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-1 text-xs">
//                     {val.bit_count}
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

function Projects() {
  const [notificationCount, setNotificationCount] = useState({});
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch all projects
    axios.get("http://localhost:5000/admin/getallprojects").then((res) => {
      setProjects(
        res.data.map((project) => ({
          ...project,
          formatted_expiry_date: formatExpiryDate(project.expiry_date),
          formatted_created_at: formatExpiryDate(project.created_at),
        }))
      );
    });

    // Fetch pending bid counts
    fetch("http://localhost:5000/admin/getbit")
      .then((res) => res.json())
      .then((data) => {
        const countMap = {};
        data.forEach((item) => {
          countMap[item.project_id] = item.count;
        });
        setNotificationCount(countMap);
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
          <p className="text-gray-600">Expiry Date: {val.formatted_expiry_date}</p>
        </div>
      ))}
    </div>
  );
}

export default Projects;