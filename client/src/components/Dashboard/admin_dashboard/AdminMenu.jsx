// import React from "react";
// import { Link, useParams } from "react-router-dom";
// import logo from "../../Assets/KGGL.png";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export function AdminMenu() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   axios.defaults.withCredentials = true;
//   const handleLogout = () => {
//     axios.get("http://localhost:5000/stu/logout").then((res) => {
//       if (res.data.status) {
//         navigate("/");
//       }
//     });
//   };

//   return (
//     <div className="flex flex-col h-screen bg-white border-r">
//       <nav className="flex-1">
//         <div className="p-4">
//           <Link to="#" className="flex justify-center mb-8">
//             <img src={logo} alt="Logo" className="h-12" />
//           </Link>
//           <ul className="space-y-2">
//             <li>
//               <Link to={`/dash/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6h4v-6m-6 0h-4" />
//                 </svg>
//                 Dashboard
//               </Link>
//             </li>
//             <li>
//               <Link to={`/studata/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Students
//               </Link>
//             </li>
//             <li>
//               <Link to={`/addproject/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Add Project
//               </Link>
//             </li>
//             <li>
//               <Link to={`/getprojects/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Projects
//               </Link>
//             </li>
//             <li>
//               <Link to={`/create-test/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 Create Test
//               </Link>
//             </li>
//             <li>
//               <Link to={`/addquestion/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//                 Add Questions
//               </Link>
//             </li>
//             <li>
//               <Link to={`/aiquiz/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Add Quizzes [AI]
//               </Link>
//             </li>
//             <li>
//            <Link to={`/assign-test/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//   <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
//   </svg>
//   Assign Test
// </Link>
//             </li>
//           </ul>
//         </div>
//         <hr className="my-5 border-gray-200" />
//         <div className="p-4">
//           <button
//             onClick={handleLogout}
//             className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>
//     </div>
//   );
// }








































import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import logo from "../../Assets/KGGL.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";


export function AdminMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get("http://localhost:5000/stu/logout").then((res) => {
      if (res.data.status) {
        navigate("/");
      }
    });
  };


  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 ">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>
      </div>


      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform border-r ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white  flex flex-col h-screen`}
      >
        <nav className="flex-1">
          <div className="p-4">
            <Link to="#" className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
            <ul className="space-y-1">
              <li>
                <Link
                  to={`/dash/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                  </svg>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to={`/studata/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Students
                </Link>
              </li>
                  <li>
                <Link
                  to={`/addskill`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  Add Skills
                </Link>
              </li>
             
               <li>
                <Link
                  to={`/addproject/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  Add Project
                </Link>
              </li>
              <li>
                <Link
                  to={`/getprojects/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  to={`/create-test/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  Create Test
                </Link>
              </li>
              <li>
                <Link
                  to={`/addquestion/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Add Questions
                </Link>
              </li>
              <li>
                <Link
                  to={`/aiquiz/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                  </svg>
                  Add Quizzes [AI]
                </Link>
              </li>
              <li>
                <Link
                  to={`/assign-test/${id}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-5 h-5 mr-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  Assign Test
                </Link>
              </li>
            </ul>
          </div>
          <hr className="my-4 border-gray-200" />
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}
