import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import loginimage from "../Assets/Group 289210.png";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Enable credentials for cookies
  axios.defaults.withCredentials = true;

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/stu/login", {
        email,
        password,
      });

      const { status, msg, id, role, name } = response.data;
      console.log(name);
      

      if (status === "user") {
        if (role === 1) {
          navigate(`/profile/${btoa(id)}`); // Redirect to profile for students
        } else if (role === 2) {
          navigate(`/manager/${btoa(id)}`);
        } else {
          alert("Unsupported role. Please contact admin.");
        }
      } else if (status === "invalid_user") {
        alert(msg || "Please check your password");
      } else if (status === "both_are_invalid") {
        alert(msg || "Please check your username");
      } else if (status === "error") {
        alert(msg || "Login failed. Please contact admin.");
      } else {
        alert("Unexpected response. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side Image */}
      <div className="w-full lg:w-1/2">
        <img
          src={loginimage}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
        <div className="w-full max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">LOGIN</h1>
          <form onSubmit={handleLogin}>
            {/* Email Field */}
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

            {/* Password Field */}
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

            {/* Forgot Password */}
            <div className="flex justify-end mb-6">
              <Link to="/forgot" className="text-sm text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </form>

          {/* Register Link */}
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















