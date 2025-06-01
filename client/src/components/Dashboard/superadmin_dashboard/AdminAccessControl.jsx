// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";

// // Main layout container styles
// const contentClass = "flex-1 overflow-auto p-4 md:p-8 bg-gray-50 min-h-screen";

// const AdminAccessControl = () => {
//   const { spad_id: encodedSpadId } = useParams();
//   const [admins, setAdmins] = useState([]);
//   const [menus, setMenus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [expandedAdmin, setExpandedAdmin] = useState(null);
//   const [selectedMenus, setSelectedMenus] = useState({});

//   // Decode and validate spad_id
//   let spad_id;
//   try {
//     spad_id = parseInt(atob(encodedSpadId));
//     if (isNaN(spad_id)) {
//       throw new Error("Invalid superadmin ID");
//     }
//   } catch (err) {
//     return (
//       <div className={contentClass}>
//         <p className="text-red-600">Error: Invalid or missing superadmin ID in URL</p>
//       </div>
//     );
//   }

//   useEffect(() => {
//     const fetchAdminsAndPermissions = async () => {
//       try {
//         // Fetch menus
//         const menuResponse = await fetch("http://localhost:5000/api/superadmin/getmenus");
//         if (!menuResponse.ok) {
//           throw new Error(`Menus API failed: ${menuResponse.status} ${menuResponse.statusText}`);
//         }
//         const menuData = await menuResponse.json();
//         if (!menuData.status || !Array.isArray(menuData.result)) {
//           throw new Error("Invalid menus API response");
//         }
//         setMenus(menuData.result);

//         // Fetch admins
//         const adminResponse = await fetch("http://localhost:5000/api/superadmin/getalladmins");
//         if (!adminResponse.ok) {
//           throw new Error(`Admins API failed: ${adminResponse.status} ${adminResponse.statusText}`);
//         }
//         const adminData = await adminResponse.json();
//         if (!adminData.status || !Array.isArray(adminData.result)) {
//           throw new Error("Invalid admin API response");
//         }

//         // Fetch permissions
//         const permissionResponse = await fetch("http://localhost:5000/api/superadmin/getpermissions");
//         if (!permissionResponse.ok) {
//           throw new Error(`Permissions API failed: ${permissionResponse.status} ${permissionResponse.statusText}`);
//         }
//         const permissionData = await permissionResponse.json();
//         if (!permissionData.status || !Array.isArray(permissionData.result)) {
//           throw new Error("Invalid permission API response");
//         }

//         // Initialize selected menus
//         const initialMenus = {};
//         adminData.result.forEach((admin) => {
//           initialMenus[admin.student_id] = permissionData.result
//             .filter((perm) => perm.admin_id === admin.student_id && perm.is_allow === 1)
//             .map((perm) => perm.menu_name);
//         });

//         setAdmins(adminData.result);
//         setSelectedMenus(initialMenus);
//       } catch (err) {
//         setError("Failed to fetch data: " + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchAdminsAndPermissions();
//   }, []);

//   const toggleAccordion = (adminId) => {
//     setExpandedAdmin(expandedAdmin === adminId ? null : adminId);
//   };

//   const handleCheckboxChange = (adminId, menuName) => {
//     setSelectedMenus((prev) => {
//       const adminMenus = prev[adminId] || [];
//       if (adminMenus.includes(menuName)) {
//         return {
//           ...prev,
//           [adminId]: adminMenus.filter((menu) => menu !== menuName),
//         };
//       } else {
//         return {
//           ...prev,
//           [adminId]: [...adminMenus, menuName],
//         };
//       }
//     });
//   };

//   const handleSave = async (adminId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/superadmin/updatepermissions/${spad_id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           permissions: { [adminId]: selectedMenus[adminId] || [] },
//         }),
//       });
//       const data = await response.json();
//       if (data.status) {
//         alert("Permissions saved successfully for admin " + adminId);
//       } else {
//         alert(`Error: ${data.msg}`);
//       }
//     } catch (err) {
//       console.error("Error saving permissions:", err);
//       alert("Failed to save permissions for admin " + adminId);
//     }
//   };

//   const handleSaveAll = async () => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/superadmin/updatepermissions/${spad_id}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           permissions: selectedMenus,
//         }),
//       });
//       const data = await response.json();
//       if (data.status) {
//         alert("All permissions saved successfully");
//       } else {
//         alert(`Error: ${data.msg}`);
//       }
//     } catch (err) {
//       console.error("Error saving all permissions:", err);
//       alert("Failed to save all permissions");
//     }
//   };

//   return (
//     <div className={contentClass}>
//       <h1 className="text-2xl font-semibold text-gray-800 mb-6">Admin Access Control</h1>
//       <button
//         onClick={handleSaveAll}
//         className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 focus:outline-none"
//       >
//         Save All Permissions
//       </button>
//       {loading && <p className="text-gray-600">Loading admins...</p>}
//       {error && <p className="text-red-600">{error}</p>}
//       {!loading && !error && admins.length === 0 && (
//         <p className="text-gray-600">No admins found</p>
//       )}
//       {!loading && !error && menus.length === 0 && (
//         <p className="text-gray-600">No menus found</p>
//       )}
//       {!loading && !error && admins.length > 0 && menus.length > 0 && (
//         <div className="space-y-4">
//           {admins.map((admin) => (
//             <div key={admin.student_id} className="bg-white rounded-lg shadow">
//               <button
//                 className="w-full text-left p-4 flex justify-between items-center focus:outline-none"
//                 onClick={() => toggleAccordion(admin.student_id)}
//               >
//                 <div>
//                   <h2 className="text-lg font-medium text-gray-800">{admin.name}</h2>
//                   <p className="text-sm text-gray-600">{admin.email}</p>
//                 </div>
//                 <span className="text-gray-600">
//                   {expandedAdmin === admin.student_id ? "−" : "+"}
//                 </span>
//               </button>
//               {expandedAdmin === admin.student_id && (
//                 <div className="p-4 border-t border-gray-200">
//                   <h3 className="text-md font-semibold text-gray-700 mb-2">Available Menus:</h3>
//                   <div className="space-y-2">
//                     {menus.map((menu) => (
//                       <label key={menu.menu_id} className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           checked={(selectedMenus[admin.student_id] || []).includes(menu.menu_name)}
//                           onChange={() => handleCheckboxChange(admin.student_id, menu.menu_name)}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                         />
//                         <span className="text-gray-600">{menu.menu_name}</span>
//                       </label>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => handleSave(admin.student_id)}
//                     className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
//                   >
//                     Save
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AdminAccessControl;


































import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Switch } from "@headlessui/react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

const AdminAccessControl = () => {
  const { spad_id: encodedSpadId } = useParams();
  const [admins, setAdmins] = useState([]);
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAdmin, setExpandedAdmin] = useState(null);
  const [selectedMenus, setSelectedMenus] = useState({});

  // Decode and validate spad_id
  let spad_id;
  try {
    spad_id = parseInt(atob(encodedSpadId));
    if (isNaN(spad_id)) {
      throw new Error("Invalid superadmin ID");
    }
  } catch (err) {
    return (
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gradient-to-br from-green-50 to-gray-50 min-h-screen">
        <p className="text-red-600 font-medium">Error: Invalid or missing superadmin ID in URL</p>
      </div>
    );
  }

  useEffect(() => {
    const fetchAdminsAndPermissions = async () => {
      try {
        // Fetch menus
        const menuResponse = await fetch("http://localhost:5000/api/superadmin/getmenus");
        if (!menuResponse.ok) {
          throw new Error(`Menus API failed: ${menuResponse.status} ${menuResponse.statusText}`);
        }
        const menuData = await menuResponse.json();
        if (!menuData.status || !Array.isArray(menuData.result)) {
          throw new Error("Invalid menus API response");
        }
        setMenus(menuData.result);

        // Fetch admins
        const adminResponse = await fetch("http://localhost:5000/api/superadmin/getalladmins");
        if (!adminResponse.ok) {
          throw new Error(`Admins API failed: ${adminResponse.status} ${adminResponse.statusText}`);
        }
        const adminData = await adminResponse.json();
        if (!adminData.status || !Array.isArray(adminData.result)) {
          throw new Error("Invalid admin API response");
        }

        // Fetch permissions
        const permissionResponse = await fetch("http://localhost:5000/api/superadmin/getpermissions");
        if (!permissionResponse.ok) {
          throw new Error(`Permissions API failed: ${permissionResponse.status} ${permissionResponse.statusText}`);
        }
        const permissionData = await permissionResponse.json();
        if (!permissionData.status || !Array.isArray(permissionData.result)) {
          throw new Error("Invalid permission API response");
        }

        // Initialize selected menus
        const initialMenus = {};
        adminData.result.forEach((admin) => {
          initialMenus[admin.student_id] = permissionData.result
            .filter((perm) => perm.admin_id === admin.student_id && perm.is_allow === 1)
            .map((perm) => perm.menu_name);
        });

        setAdmins(adminData.result);
        setSelectedMenus(initialMenus);
      } catch (err) {
        setError("Failed to fetch data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminsAndPermissions();
  }, []);

  const toggleAccordion = (adminId) => {
    setExpandedAdmin(expandedAdmin === adminId ? null : adminId);
  };

  const handleToggleChange = (adminId, menuName) => {
    setSelectedMenus((prev) => {
      const adminMenus = prev[adminId] || [];
      if (adminMenus.includes(menuName)) {
        MySwal.fire({
          title: "Permission Changed",
          text: `Disabled access to ${menuName}`,
          icon: "info",
          timer: 1000,
          showConfirmButton: false,
        });
        return {
          ...prev,
          [adminId]: adminMenus.filter((menu) => menu !== menuName),
        };
      } else {
        MySwal.fire({
          title: "Permission Changed",
          text: `Enabled access to ${menuName}`,
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
        return {
          ...prev,
          [adminId]: [...adminMenus, menuName],
        };
      }
    });
  };

  const handleSave = async (adminId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/superadmin/updatepermissions/${spad_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permissions: { [adminId]: selectedMenus[adminId] || [] },
        }),
      });
      const data = await response.json();
      if (data.status) {
        MySwal.fire({
          title: "Success!",
          // text: `Permissions saved successfully for admin ${adminId}`,
          text: `Permissions saved successfully`,
          icon: "success",
          confirmButtonColor: "#3b82f6",
        });
      } else {
        MySwal.fire({
          title: "Error!",
          text: data.msg,
          icon: "error",
          confirmButtonColor: "#ef4444",
        });
      }
    } catch (err) {
      console.error("Error saving permissions:", err);
      MySwal.fire({
        title: "Error!",
        // text: `Failed to save permissions for admin ${adminId}`,
        text: `Failed to save permissions`,
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  const handleSaveAll = async () => {
    try {
      const result = await MySwal.fire({
        title: "Are you sure?",
        text: "You're about to update all admin permissions",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3b82f6",
        cancelButtonColor: "#ef4444",
        confirmButtonText: "Yes, save all!",
      });

      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:5000/api/superadmin/updatepermissions/${spad_id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            permissions: selectedMenus,
          }),
        });
        const data = await response.json();
        if (data.status) {
          MySwal.fire({
            title: "Success!",
            text: "All permissions saved successfully",
            icon: "success",
            confirmButtonColor: "#3b82f6",
          });
        } else {
          MySwal.fire({
            title: "Error!",
            text: data.msg,
            icon: "error",
            confirmButtonColor: "#ef4444",
          });
        }
      }
    } catch (err) {
      console.error("Error saving all permissions:", err);
      MySwal.fire({
        title: "Error!",
        text: "Failed to save all permissions",
        icon: "error",
        confirmButtonColor: "#ef4444",
      });
    }
  };

  return (
    <div className="flex-1 overflow-auto p-4 md:p-8 bg-gradient-to-br from-green-50 to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Access Control</h1>
            <p className="text-gray-600 mt-1">Manage permissions for your admin team</p>
          </div>
          <button
            onClick={handleSaveAll}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Save All Permissions
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && admins.length === 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">No admins found in the system</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && menus.length === 0 && (
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">No menus available for permission management</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && admins.length > 0 && menus.length > 0 && (
          <div className="space-y-6">
            {admins.map((admin) => (
              <div key={admin.student_id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg">
                <button
                  className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                  onClick={() => toggleAccordion(admin.student_id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 flex items-center justify-center text-white font-bold">
                      {admin.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">{admin.name}</h2>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                      {/* <p className="text-xs text-gray-400 mt-1">Name: {admin.name}</p> */}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 mr-3">
                      {expandedAdmin === admin.student_id ? "Hide Permissions" : "Show Permissions"}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-500 transform transition-transform duration-200 ${
                        expandedAdmin === admin.student_id ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                {expandedAdmin === admin.student_id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h3 className="text-md font-semibold text-gray-700 mb-4 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Menu Access Permissions
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {menus.map((menu) => (
                        <div
                          key={menu.menu_id}
                          className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 transition-colors duration-150"
                        >
                          <span className="text-gray-700 font-medium">{menu.menu_name}</span>
                          <Switch
                            checked={(selectedMenus[admin.student_id] || []).includes(menu.menu_name)}
                            onChange={() => handleToggleChange(admin.student_id, menu.menu_name)}
                            className={`${
                              (selectedMenus[admin.student_id] || []).includes(menu.menu_name)
                                ? "bg-blue-600"
                                : "bg-gray-200"
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                          >
                            <span
                              className={`${
                                (selectedMenus[admin.student_id] || []).includes(menu.menu_name)
                                  ? "translate-x-6"
                                  : "translate-x-1"
                              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                          </Switch>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => handleSave(admin.student_id)}
                        className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2 rounded-lg shadow hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Save Permissions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAccessControl;