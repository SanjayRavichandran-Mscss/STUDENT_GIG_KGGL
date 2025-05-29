// import { Link, useParams, useNavigate } from "react-router-dom";
// import logo from "../../Assets/KGGL.png";
// import { useState } from "react";
// import Swal from "sweetalert2";

// export default function StudentMenu() {
//   const { id } = useParams();
//   let decoded;
//   try {
//     decoded = atob(id);
//   } catch (e) {
//     console.error("Failed to decode student ID:", e);
//     decoded = null;
//   }
//   const navigate = useNavigate();
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out of your account.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#2563eb",
//       cancelButtonColor: "#ef4444",
//       confirmButtonText: "Yes, log out",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         localStorage.removeItem("accessToken");
//         sessionStorage.removeItem("accessToken");
//         Swal.fire({
//           icon: "success",
//           title: "Logged Out",
//           text: "You have been logged out successfully.",
//           timer: 1500,
//           showConfirmButton: false,
//         }).then(() => navigate("/"));
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-white lg:fixed">
//       {/* Mobile Header */}
//       <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
//         <img src={logo} alt="KGGL Logo" className="h-10" />
//         <button
//           onClick={() => setSidebarOpen(!sidebarOpen)}
//           className="p-2 rounded-md"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M4 6h16M4 12h16M4 18h16"
//             />
//           </svg>
//         </button>
//       </div>

//       {/* Sidebar */}
//       <nav
//         className={`${
//           sidebarOpen
//             ? "absolute top-16 left-0 w-full z-50 bg-white border-t shadow-md"
//             : "hidden"
//         } lg:block lg:relative lg:w-64 lg:border-r lg:border-gray-200`}
//       >
//         <div className="p-4">
//           <div className="hidden lg:block mb-6">
//             <img src={logo} alt="KGGL Logo" className="h-12 mx-auto" />
//           </div>

//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to={`/student/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5 mr-3"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//                   />
//                 </svg>
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/profile/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5 mr-3"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                   />
//                 </svg>
//                 Profile
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/my-tests/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5 mr-3"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                   />
//                 </svg>
//                 Test
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/score/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   className="h-5 w-5 mr-3"
//                   xmlns="http://www.w3.org/2000/svg"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                   />
//                 </svg>
//                 View Score
//               </Link>
//             </li>
//           </ul>

//           <div className="border-t border-gray-200 my-4"></div>

//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//           >
//             <svg
//               className="h-5 w-5 mr-3"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             Logout
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// }



































import { Link, useParams, useNavigate } from "react-router-dom";
import logo from "../../Assets/KGGL.png";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

export default function StudentMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  let decoded;
  try {
    decoded = atob(id); // Use this if `id` is base64 encoded
  } catch (e) {
    console.error("Failed to decode student ID:", e);
    decoded = null;
  }

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [technicalStatus, setTechnicalStatus] = useState(null); // Default null

  useEffect(() => {
    const fetchTechnicalStatus = async () => {
      try {
        const storedStatus = sessionStorage.getItem("technical_status");
        if (storedStatus !== null) {
          setTechnicalStatus(Number(storedStatus));
        } else {
          const response = await axios.get(`http://localhost:5000/api/stu/technical-status/${decoded}`);
          const { technical_status } = response.data;
          setTechnicalStatus(technical_status);
          sessionStorage.setItem("technical_status", technical_status);
        }
      } catch (error) {
        console.error("Error fetching technical_status:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to load menu configuration. Please try again.",
        });
      }
    };

    if (decoded) {
      fetchTechnicalStatus();
    }
  }, [decoded]);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, log out",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("technical_status");
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        }).then(() => navigate("/"));
      }
    });
  };

  return (
    <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-white lg:fixed">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
        <img src={logo} alt="KGGL Logo" className="h-10" />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <nav
        className={`${
          sidebarOpen
            ? "absolute top-16 left-0 w-full z-50 bg-white border-t shadow-md"
            : "hidden"
        } lg:block lg:relative lg:w-64 lg:border-r lg:border-gray-200`}
      >
        <div className="p-4">
          <div className="hidden lg:block mb-6">
            <img src={logo} alt="KGGL Logo" className="h-12 mx-auto" />
          </div>

          <ul className="space-y-2">
            {technicalStatus === null ? (
              <p className="text-sm text-gray-400">Loading menu...</p>
            ) : technicalStatus === 1 ? (
              <>
                <li>
                  <Link
                    to={`/student/${id}`}
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/profile/${id}`}
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/my-tests/${id}`}
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    Test
                  </Link>
                </li>
                <li>
                  <Link
                    to={`/score/${id}`}
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg
                      className="h-5 w-5 mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                    View Score
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to={`/interview-details/${id}`}
                  className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg
                    className="h-5 w-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                    />
                  </svg>
                  Interview Details
                </Link>
              </li>
            )}
          </ul>

          <div className="border-t border-gray-200 my-4"></div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <svg
              className="h-5 w-5 mr-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}