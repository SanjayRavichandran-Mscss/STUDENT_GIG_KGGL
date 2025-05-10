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
//             {/* <li>
//               <Link to={`/quiz/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Add Quizzes
//               </Link>
//             </li> */}
//             <li>
//               <Link to={`/aiquiz/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Add Quizzes [AI]
//               </Link>
//             </li>
//             <li>
//               <Link to={`/assignquiz/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
//                 <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
//                 </svg>
//                 Test Assigning
//               </Link>
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


























import React from "react";
import { Link, useParams } from "react-router-dom";
import logo from "../../Assets/KGGL.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function AdminMenu() {
  const { id } = useParams();
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogout = () => {
    axios.get("http://localhost:5000/stu/logout").then((res) => {
      if (res.data.status) {
        navigate("/");
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-white border-r">
      <nav className="flex-1">
        <div className="p-4">
          <Link to="#" className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="h-12" />
          </Link>
          <ul className="space-y-2">
            <li>
              <Link to={`/dash/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7m-9 2v6h4v-6m-6 0h-4" />
                </svg>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to={`/studata/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
                </svg>
                Students
              </Link>
            </li>
            <li>
              <Link to={`/addproject/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
                </svg>
                Add Project
              </Link>
            </li>
            <li>
              <Link to={`/getprojects/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
                </svg>
                Projects
              </Link>
            </li>
            <li>
              <Link to={`/create-test/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Create Test
              </Link>
            </li>
            <li>
              <Link to={`/aiquiz/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm0 0c2.5 0 4.5-2 4.5-4.5M12 13.5v4.5m-4.5 0h9" />
                </svg>
                Add Quizzes [AI]
              </Link>
            </li>
            <li>
              <Link to={`/assign-test/${id}`} className="flex items-center p-3 text-gray-700 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Assign Test
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-5 border-gray-200" />
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
    </div>
  );
}










































































































