// import { Link, useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import logo from "../../Assets/KGGL.png";

// export default function StudentMenu() {
//   const { id } = useParams();
//   let decoded;
//   try {
//     decoded = atob(id);
//   } catch (e) {
//     console.error('Failed to decode student ID:', e);
//     decoded = null;
//   }
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const response = await axios.get("http://localhost:5000/stu/logout", {
//         withCredentials: true,
//       });
//       if (response.data.status) {
//         localStorage.removeItem("accessToken");
//         sessionStorage.removeItem("accessToken");
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//       navigate("/");
//     }
//   };

//   return (
//     <div className="flex flex-col lg:flex-row h-full lg:h-screen bg-gray-100">
//       {/* Mobile Header */}
//       <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b">
//         <div className="flex items-center">
//           <img src={logo} alt="KGGL Logo" className="h-10" />
//         </div>
//         <button
//           className="navbar-toggler p-2 rounded-md"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#sidebarCollapse"
//           aria-controls="sidebarCollapse"
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
//       <nav className="w-full lg:w-64 bg-white border-r border-gray-200 flex-shrink-0">
//         <div className="p-4">
//           {/* Logo */}
//           <div className="hidden lg:block mb-6">
//             <img src={logo} alt="KGGL Logo" className="h-12 mx-auto" />
//           </div>

//           {/* Navigation Links */}
//           <ul className="space-y-2">
//             <li>
//               <Link
//                 to={`/student/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
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
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
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
//                 to={`/assigned-tests/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
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
//                 View Assigned Test
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to={`/skill-based-tests/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
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
//                 View Skill-Based Tests
//               </Link>
//             </li>
//             {/* <li>
//               <Link
//                 to={`/entry-test/${id}`}
//                 className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
//               >
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-5 w-5 mr-3"
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
//                 Attend Entry Test
//               </Link>
//             </li> */}
//           </ul>

//           <div className="border-t border-gray-200 my-4"></div>

//           {/* Logout Button */}
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-3"
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
import axios from "axios";
import logo from "../../Assets/KGGL.png";
import { useState } from "react";

export default function StudentMenu() {
  const { id } = useParams();
  let decoded;
  try {
    decoded = atob(id);
  } catch (e) {
    console.error("Failed to decode student ID:", e);
    decoded = null;
  }
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const response = await axios.get("http://localhost:5000/stu/logout", {
        withCredentials: true,
      });
      if (response.data.status) {
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/");
    }
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
                View Your Tests
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