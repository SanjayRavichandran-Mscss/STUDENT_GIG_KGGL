import { Link, useParams } from "react-router-dom";
import logo from "../../Assets/KGGL.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import { Menu, X } from "lucide-react";

export function SuperAdminMenu() {
  // const { spad_id: paramId } = useParams(); // Changed from id to spad_id for consistency
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Use paramId if available, otherwise fall back to localStorage
  const token = localStorage.getItem("accessToken") || null;
  let spadId = null;

  // Decode token to get spad_id
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      spadId = decoded.user; // Assuming 'user' field is spad_id
    } catch (error) {
      console.error("Token decode error:", error);
    }
  }

  const encodedSpadId = spadId ? btoa(spadId) : null;

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

  // If no token is available, redirect to login
  if (!token) {
    navigate("/login");
    return null;
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 transform border-r ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-white flex flex-col h-screen`}
      >
        <nav className="flex-1">
          <div className="p-4">
            <Link to="#" className="flex justify-center mb-6">
              <img src={logo} alt="Logo" className="h-12" />
            </Link>
            <ul className="space-y-1">
              <li>
                <Link
                  to={`/superadmin/access-control/${encodedSpadId}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M12 11c0 1.104-.896 2-2 2s-2-.896-2-2 2-4 2-4 2 2.896 2 4zm0 0c0 1.104.896 2 2 2s2-.896 2-2-2-4-2-4-2 2.896-2 4zm-6 7v2h12v-2a4 4 0 00-4-4h-4a4 4 0 00-4 4z"
                    />
                  </svg>
                  Admin Access Control
                </Link>
              </li>
              <li>
                <Link
                  to={`/superadmin/manage-projects/${encodedSpadId}`}
                  className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg
                    className="w-5 h-5 mr-3 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Manage Projects
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

export default SuperAdminMenu;