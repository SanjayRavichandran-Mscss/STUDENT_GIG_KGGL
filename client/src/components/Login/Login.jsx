// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import loginimage from "../Assets/Group 289210.png";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// export function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   axios.defaults.withCredentials = true;

//   const handleLogin = async (event) => {
//     event.preventDefault();

//     try {
//       const response = await axios.post("https://gig.kggeniuslabs.com/api/api/stu/login", {
//         email,
//         password,
//       });

//       const { status, message, id, role, name, accessToken } = response.data;
//       console.log("Login response:", { status, message, id, role, name, accessToken });
//       console.log("Token type:", typeof accessToken, "Token value:", accessToken);

//       if (status === "user") {
//         if (!accessToken || typeof accessToken !== "string") {
//           console.error("Invalid or missing accessToken:", accessToken);
//           toast.error("Login failed: Invalid token received from server");
//           return;
//         }

//         localStorage.setItem("accessToken", accessToken);
//         localStorage.setItem("lastLoginTime", Date.now().toString());
//         console.log("Stored token:", localStorage.getItem("accessToken"));
//         console.log("Stored lastLoginTime:", localStorage.getItem("lastLoginTime"));

//         // Fetch technical_status using email
//         let technical_status;
//         try {
//           const techRes = await axios.get(`https://gig.kggeniuslabs.com/api/api/stu/technical-status/${email}`);
//           technical_status = techRes.data.technical_status;
//           sessionStorage.setItem("technical_status", technical_status);
//           console.log("Technical Status:", technical_status);
//         } catch (techErr) {
//           console.error("Error fetching technical_status:", techErr);
//           // toast.error("Failed to fetch technical status");
//           // Default to profile page if technical_status fetch fails
//           technical_status = 1;
//         }

//         toast.success("Logged in successfully!", {
//           position: "top-right",
//           autoClose: 2000,
//         });

//         const encodedId = btoa(id);
//         if (role === 2) {
//           if (technical_status === 0) {
//             // Redirect to InterviewSchedule for non-technical students
//             setTimeout(() => navigate(`/interview-details/${encodedId}`), 500);
//           } else {
//             // Redirect to Profile for technical students
//             setTimeout(() => navigate(`/profile/${encodedId}`), 500);
//           }
//         } else if (role === 1) {
//           setTimeout(() => navigate(`/manager/${encodedId}`), 500);
//         }     
//         else if (role === 3) {
//           setTimeout(() => navigate(`/superadmin/access-control/${encodedId}`), 500);
//         }
        
//         else {
//           toast.error("Unsupported role. Please contact admin.");
//         }
//       } else if (status === "invalid_user") {
//         toast.error(message || "Please check your password");
//       } else if (status === "both_are_invalid") {
//         toast.error(message || "Please check your username");
//       } else if (status === "error") {
//         toast.error(message || "Login failed. Please contact admin.");
//       } else {
//         toast.error("Unexpected response. Please try again.");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col lg:flex-row">
//       <ToastContainer position="top-right" autoClose={2000} />
//       <div className="w-full lg:w-1/2">
//         <img
//           src={loginimage}
//           alt="Login Illustration"
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
//         <div className="w-full max-w-md mx-auto">
//           <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
//           <form onSubmit={handleLogin}>
//             <div className="mb-6">
//               <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
//                 Email Id
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="mb-6">
//               <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
//                 Password
//               </label>
//               <input
//                 type="password"
//                 id="password"
//                 name="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div className="flex justify-end mb-6">
//               <Link to="/forgot" className="text-sm text-blue-600 hover:underline">
//                 Forgot Password?
//               </Link>
//             </div>
//             <div className="mb-4">
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
//               >
//                 Sign In
//               </button>
//             </div>
//           </form>
//           <p className="text-center text-gray-600">
//             Don't have an account?{" "}
//             <Link to="/reg" className="text-red-600 hover:underline font-semibold">
//               Register
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }







import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginimage from "../Assets/Group 289210.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("https://gig.kggeniuslabs.com/api/api/stu/login", {
        email,
        password,
      });

      const { status, message, id, role, name, accessToken } = response.data;
      console.log("Login response:", { status, message, id, role, name, accessToken });
      console.log("Token type:", typeof accessToken, "Token value:", accessToken);

      if (status === "user") {
        if (!accessToken || typeof accessToken !== "string") {
          console.error("Invalid or missing accessToken:", accessToken);
          toast.error("Login failed: Invalid token received from server");
          return;
        }

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("lastLoginTime", Date.now().toString());
        console.log("Stored token:", localStorage.getItem("accessToken"));
        console.log("Stored lastLoginTime:", localStorage.getItem("lastLoginTime"));

        let technical_status = 1; // Default for non-students
        if (role === 2) {
          // Fetch technical_status only for students
          try {
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
              console.error("Invalid email for technical_status fetch:", email);
              technical_status = 1;
            } else {
              const techRes = await axios.get(`https://gig.kggeniuslabs.com/api/api/stu/technical-status/${email}`);
              technical_status = techRes.data.technical_status;
              sessionStorage.setItem("technical_status", technical_status);
              console.log("Technical Status:", technical_status);
            }
          } catch (techErr) {
            console.error("Error fetching technical_status:", techErr);
            technical_status = 1;
          }
        }

        toast.success("Logged in successfully!", {
          position: "top-right",
          autoClose: 2000,
        });

        const encodedId = btoa(id);
        if (role === 2) {
          if (technical_status === 0) {
            setTimeout(() => navigate(`/interview-details/${encodedId}`), 500);
          } else {
            setTimeout(() => navigate(`/profile/${encodedId}`), 500);
          }
        } else if (role === 1) {
          localStorage.setItem("spad_id", "9"); // Hardcode spad_id for admins to match API
          setTimeout(() => navigate(`/dash/${encodedId}`), 500); // Use encoded id
        } else if (role === 3) {
          localStorage.setItem("spad_id", id); // Store decoded spad_id
          setTimeout(() => navigate(`/superadmin/access-control/${encodedId}`), 500);
        } else {
          toast.error("Unsupported role. Please contact admin.");
        }
      } else if (status === "invalid_user") {
        toast.error(message || "Please check your password");
      } else if (status === "both_are_invalid") {
        toast.error(message || "Please check your username");
      } else if (status === "error") {
        toast.error(message || "Login failed. Please contact admin.");
      } else {
        toast.error("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="w-full lg:w-1/2">
        <img
          src={loginimage}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                Email Id
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end mb-6">
              <Link to="/forgot" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>
          <p className="text-center text-gray-600">
            Don't have an account?{" "}
            <Link to="/reg" className="text-red-600 hover:underline font-semibold">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}