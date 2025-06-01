import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const location = useLocation();
  const [recentLogin, setRecentLogin] = useState(false);

  useEffect(() => {
    const loginTime = localStorage.getItem("lastLoginTime");
    const currentTime = Date.now();
    const fiveSeconds = 5000;

    if (loginTime && currentTime - parseInt(loginTime) < fiveSeconds) {
      setRecentLogin(true);
    } else {
      setRecentLogin(false);
    }

    const checkAuthentication = () => {
      try {
        const token = localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken");
        console.log("ProtectedRoute: Token checked:", { token, tokenType: typeof token });

        if (!token) {
          console.log("ProtectedRoute: No token found");
          setIsAuthenticated(false);
          return;
        }

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
