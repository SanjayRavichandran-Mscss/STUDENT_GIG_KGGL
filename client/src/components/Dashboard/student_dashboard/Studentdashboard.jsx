// import { useParams } from "react-router-dom";
// import StudentMenu from "./StudentMenu";
// import StudentProject from "./StudentProject";
// import AttendQuiz from "./Quiz/AttendQuiz";
// import Profile from "./Profile";
// import ProjectDetails from "./ProjectDetails";
// import AssignedTest from "./Quiz/AssignedTest";

// export function StudentDashboard() {
//   const params = useParams();
//   console.log(params); // For debugging purposes

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <StudentProject />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentQuiz() {
//   const params = useParams();
//   console.log(params); // For debugging purposes

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <AttendQuiz />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentProfile() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>
//         <div className="flex-1 p-6 bg-gray-100">
//           <Profile />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentProjectDetail() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>
//         <div className="flex-1 p-6">
//           <ProjectDetails />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentAssignedTests() {
//   const params = useParams();
//   console.log(params); // For debugging purposes

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <AssignedTest />
//         </div>
//       </div>
//     </div>
//   );
// }







import { useParams } from "react-router-dom";
import StudentMenu from "./StudentMenu";
import StudentProject from "./StudentProject";
import AttendQuiz from "./Quiz/AttendQuiz";
import Profile from "./Profile";
import ProjectDetails from "./ProjectDetails";
import AssignedTest from "./Quiz/AssignedTest";
import EntryTest from "./Quiz/EntryTest";

export function StudentDashboard() {
  const params = useParams();
  console.log("StudentDashboard params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <StudentProject />
        </div>
      </div>
    </div>
  );
}

export function StudentQuiz() {
  const params = useParams();
  console.log("StudentQuiz params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <AttendQuiz />
        </div>
      </div>
    </div>
  );
}

export function StudentProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>
        <div className="flex-1 p-6 bg-gray-100">
          <Profile />
        </div>
      </div>
    </div>
  );
}

export function StudentProjectDetail() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>
        <div className="flex-1 p-6">
          <ProjectDetails />
        </div>
      </div>
    </div>
  );
}

export function StudentAssignedTests() {
  const params = useParams();
  console.log("StudentAssignedTests params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <AssignedTest />
        </div>
      </div>
    </div>
  );
}

export function StudentEntryTest() {
  const params = useParams();
  console.log("StudentEntryTest params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <EntryTest />
        </div>
      </div>
    </div>
  );
}