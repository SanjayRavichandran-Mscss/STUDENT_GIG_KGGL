// import React from "react";

// function NoAdminAccess() {
//   return (
//     <div className="flex items-center justify-center min-h-[50vh]">
//       <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//         <h2 className="text-xl font-semibold text-red-600">
//           You don't have access to this page, please contact your manager
//         </h2>
//       </div>
//     </div>
//   );
// }

// export default NoAdminAccess;





import React from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

function NoAdminAccess() {
  return (
    <div className="fixed inset-0 bg-gray-100 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-md transform transition-all">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-4 flex items-center justify-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-white" />
        </div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Access Restricted
          </h2>
          <div className="text-red-500 mb-5">
            <ExclamationTriangleIcon className="h-10 w-10 mx-auto" />
          </div>
          <p className="text-gray-600 mb-4">
            You don't have sufficient permissions to access this page.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            Please contact your administrator or manager to request access to
            this resource. We apologize for any inconvenience this may cause.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Return to Previous Page
          </button>
        </div>
        <div className="bg-gray-50 px-6 py-3 text-center">
          <p className="text-xs text-gray-500">
            Need immediate assistance? Contact info@kggeniuslabs.com
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoAdminAccess;