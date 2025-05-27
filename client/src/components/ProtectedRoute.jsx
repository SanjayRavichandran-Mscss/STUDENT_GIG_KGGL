// import React, { useEffect, useState } from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import axios from "axios";
// import Swal from "sweetalert2";

// const ProtectedRoute = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(null);

//   useEffect(() => {
//     const validateToken = async () => {
//       try {
//         // Check for token in localStorage or sessionStorage
//         const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
//         if (!token) {
//           throw new Error("No token provided");
//         }

//         // Validate token by making a request to a profile endpoint
//         await axios.get("http://localhost:5000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//           withCredentials: true, // Include cookies for backend validation
//         });

//         setIsAuthenticated(true);
//       } catch (error) {
//         console.error("Token validation error:", error);
//         setIsAuthenticated(false);
//         localStorage.removeItem("accessToken");
//         sessionStorage.removeItem("accessToken");
//         Swal.fire({
//           icon: "error",
//           title: "Session Expired",
//           text: "Please log in again.",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     };

//     validateToken();
//   }, []);

//   if (isAuthenticated === null) {
//     // Show a loading state while validating token
//     return <div>Loading...</div>;
//   }

//   return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
// };

// export default ProtectedRoute;










import { useState, useEffect} from "react";
import { Navigate, useLocation, Outlet, } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const [recentLogin, setRecentLogin] = useState(false);

  useEffect(() => {
    // Check for recent login
    const loginTime = localStorage.getItem("lastLoginTime");
    const currentTime = Date.now();
    const fiveSeconds = 5000; //5 seconds in milliseconds
    if (loginTime && (currentTime - parseInt(loginTime)) < fiveSeconds) {
      setRecentLogin(true);
    } else {
      setRecentLogin(false);
    }

    const checkAuthentication = () => {
      try {
        // Check for token
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        console.log("ProtectedRoute: Token checked:", { token, type: typeof(token), type: token });
        
        if (!token) {
          console.log("ProtectedRoute: No token found");
          setIsAuthenticated(false);
          return;
        }

        // Minimal token check (ensure it’s a string)
        if (typeof token !== "string") {
          console.log("ProtectedRoute: Token is not a string");
          throw new Error("Invalid token format");
        }

        console.log("ProtectedRoute: Token assumed valid");
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication check error:", error);
        setIsAuthenticated(false);
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        
        // Skip SweetAlert for recent logins or public routes
        if (
          !recentLogin &&
          location.pathname !== "/login" &&
          location.pathname !== "/" &&
          location.pathname !== "/reg" &&
          location.pathname !== "/forgot"
        ) {
          console.log("ProtectedRoute: Showing Session Expired alert");
          Swal.fire({
            icon: "error",
            title: "Session Expired",
            text: "Please log in again.",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      }
    };

    checkAuthentication();
  }, [location.pathname]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
