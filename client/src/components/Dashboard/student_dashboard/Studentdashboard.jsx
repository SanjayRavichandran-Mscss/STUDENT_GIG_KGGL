// import { useParams } from "react-router-dom";
// import StudentMenu from "./StudentMenu";
// import StudentProject from "./StudentProject";
// import AttendQuiz from "./Quiz/AttendQuiz";
// import Profile from "./Profile";
// import ProjectDetails from "./ProjectDetails";
// import AssignedTest from "./Quiz/AssignedTest";
// import EntryTest from "./Quiz/EntryTest";
// import SkillBasedTest from "./Quiz/SkillBasedTest";
// import AttendSkillTest from "./Quiz/AttendSkillTest";

// export function StudentDashboard() {
//   const params = useParams();
//   console.log("StudentDashboard params:", params); // For debugging

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
//   console.log("StudentQuiz params:", params); // For debugging

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
//   console.log("StudentAssignedTests params:", params); // For debugging

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

// export function StudentEntryTest() {
//   const params = useParams();
//   console.log("StudentEntryTest params:", params); // For debugging

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <EntryTest />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentSkillBasedTests() {
//   const params = useParams();
//   console.log("StudentSkillBasedTests params:", params); // For debugging

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <SkillBasedTest />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentSkillTest() {
//   const params = useParams();
//   console.log("StudentSkillTest params:", params); // For debugging

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <AttendSkillTest />
//         </div>
//       </div>
//     </div>
//   );
// }








import { useParams } from "react-router-dom";
import StudentMenu from "./StudentMenu";
import StudentProject from "./StudentProject";
import AttendTest from "./Quiz/AttendTest";
import Profile from "./Profile";
import ProjectDetails from "./ProjectDetails";
import MyTest from "./Quiz/MyTest";
import EntryTest from "./Quiz/EntryTest";
import { useEffect, useState } from "react";
import UserScoreDetails from "./Quiz/StudentScore";

export function StudentDashboard() {
  const params = useParams();
  const { id } = params;
  const decodedId = atob(id);
  const [credits, setCredits] = useState(0);
  const [name, setName] = useState("");
  console.log("StudentDashboard params:", params); // For debugging

  useEffect(() => {
    const fetchBidCredits = async () => {
      try {
        const response = await fetch(`http://localhost:5000/stu/getBidCredits/${decodedId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bid credits");
        }

        const data = await response.json();
        console.log("Fetched bid credits:", data);
        setCredits(data.bid_credits);
        setName(data.name);
      } catch (error) {
        console.error("Error fetching bid credits:", error);
      }
    };

    fetchBidCredits();
  }, [decodedId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Nav Bar */}
          <div className="">
            <div>
              <p>Student Dashboard</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div>
                <h1 className="text-2xl font-bold">{name}</h1>
              </div>
              <div>
                <p className="text-gray-600">Credits: {credits}</p>
              </div>
            </div>
          </div>

          <div>
            {/* List of available projects */}
          </div>
          <StudentProject credits={credits} />
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
          <AttendTest />
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

export function StudentMyTests() {
  const params = useParams();
  console.log("StudentMyTests params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <MyTest />
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

export function StudentSkillBasedTests() {
  const params = useParams();
  console.log("StudentSkillBasedTests params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <AttendTest />
        </div>
      </div>
    </div>
  );
}

export function StudentScore() {
  const params = useParams();
  console.log("StudentScore params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <UserScoreDetails />
        </div>
      </div>
    </div>
  );
}

export function StudentSkillTest() {
  const params = useParams();
  console.log("StudentSkillTest params:", params); // For debugging

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar - Student Menu */}
        <div className="w-full md:w-64 bg-white shadow-md">
          <StudentMenu />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <AttendTest />
        </div>
      </div>
    </div>
  );
}