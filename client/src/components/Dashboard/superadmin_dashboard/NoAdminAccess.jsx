import React from "react";

function NoAdminAccess() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-red-600">
          You don't have access to this page, please contact your manager
        </h2>
      </div>
    </div>
  );
}

export default NoAdminAccess;