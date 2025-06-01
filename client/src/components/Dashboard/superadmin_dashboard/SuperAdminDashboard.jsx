import React from "react";
import { SuperAdminMenu } from "./SuperAdminMenu.jsx";
import AdminAccessControl from "./AdminAccessControl.jsx";

// Main layout container styles
const layoutContainerClass = "flex flex-col md:flex-row min-h-screen bg-gray-50";
const sidebarClass = "w-full md:w-64 flex-shrink-0"; // Fixed width for sidebar
const contentClass = "flex-1 overflow-auto p-4 md:p-8"; // Added overflow control

export function AdminAccessControlComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <SuperAdminMenu />
      </div>
      <div className={contentClass}>
        <AdminAccessControl />
      </div>
    </div>
  );
}