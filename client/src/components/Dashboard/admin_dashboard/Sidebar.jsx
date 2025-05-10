import React, { useState } from "react";
import arrow from "../Assets/Vector.png";
import quiz from "../Assets/Quiz.png";
import setting from "../Assets/Settings.png";
import people from "../Assets/People.png";
import assignment from "../Assets/Assignments.png";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-gray-100">
      <div className={`w-64 h-screen bg-white transition-all duration-300 ${isOpen ? 'w-64' : 'w-0'}`}>
        <button onClick={toggleSidebar} className="p-4 text-gray-800">
          {isOpen ? "X" : "Open"}
        </button>
        <h3 className="px-5 text-xl font-semibold">Logo</h3>
        <ul className="mt-4">
          <li className="flex items-center p-4 hover:bg-gray-200 text-2xl">
            <img src={arrow} alt="Reports" className="w-6 h-6 mr-3" />
            Reports
          </li>
          <li className="flex items-center p-4 hover:bg-gray-200 text-2xl">
            <img src={assignment} alt="Library" className="w-6 h-6 mr-3" />
            Library
          </li>
          <li className="flex items-center p-4 hover:bg-gray-200 text-2xl">
            <img src={people} alt="People" className="w-6 h-6 mr-3" />
            People
          </li>
          <li className="flex items-center p-4 hover:bg-gray-200 text-2xl">
            <img src={quiz} alt="Activities" className="w-6 h-6 mr-3" />
            Activities
          </li>
        </ul>
        <h3 className="px-5 mt-4 text-xl font-semibold">Support</h3>
        <ul>
          <li className="flex items-center p-4 hover:bg-gray-200 text-2xl">
            <img src={setting} alt="Settings" className="w-6 h-6 mr-3" />
            Settings
          </li>
        </ul>
        <div className="absolute bottom-4 left-5 flex items-center">
          <img src={people} alt="User" className="w-6 h-6 mr-3" />
          <div>
            <h1 className="text-xl font-semibold">Name</h1>
            <p className="text-sm text-gray-600">email</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;