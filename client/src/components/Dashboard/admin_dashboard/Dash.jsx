// import React from "react";
// import DoughnutPieChart from "./Barchart.jsx";
// import { AdminMenu } from "./AdminMenu.jsx";
// import MainContent from "./MainContent.jsx";
// import StudentsData from "./StudentData.jsx";
// import { Addproject } from "./Addproject.jsx";
// import Projects from "./Projects.jsx";
// import BitConfirm from "./BitConfirm.jsx";
// import AddQuestion from "./AddQuestion.jsx";
// import QuizzAssign from "./QuizzAssign.jsx";
// import Kgcas from "./Progress.jsx";
// import GeminiQuizGenerator from "../../AIquiz/GeminiQuizGenerator.jsx";

// function Dash() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 flex p-8 space-x-8">
//         <div className="flex-1">
//           <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">College</h1>
//           <div className="flex justify-center">
//             <DoughnutPieChart />
//           </div>
//         </div>
//         <div className="flex-1">
//           <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Skill</h1>
//           <div className="flex justify-center">
//             <Kgcas />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export function Dashprofile() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <MainContent />
//       </div>
//     </div>
//   );
// }

// export function Dashstudent() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <StudentsData />
//       </div>
//     </div>
//   );
// }

// export function Dashproject() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <Addproject />
//       </div>
//     </div>
//   );
// }

// export function DashAllProjects() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <Projects />
//       </div>
//     </div>
//   );
// }

// export function DashBit() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <BitConfirm />
//       </div>
//     </div>
//   );
// }

// export function AddQuizzes() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <AddQuestion />
//       </div>
//     </div>
//   );
// }

// export function AddQuizzesWithAI() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <GeminiQuizGenerator />
//       </div>
//     </div>
//   );
// }

// export function AssigningQuizz() {
//   return (
//     <div className="flex h-screen">
//       <div className="w-1/5">
//         <AdminMenu />
//       </div>
//       <div className="flex-1 p-8">
//         <QuizzAssign />
//       </div>
//     </div>
//   );
// }

// export default Dash;


































import React from "react";
import DoughnutPieChart from "./Barchart.jsx";
import { AdminMenu } from "./AdminMenu.jsx";
import MainContent from "./MainContent.jsx";
import StudentsData from "./StudentData.jsx";
import { Addproject } from "./Addproject.jsx";
import Projects from "./Projects.jsx";
import BitConfirm from "./BitConfirm.jsx";
import AddQuestion from "./AddQuestion.jsx";
import QuizzAssign from "./QuizzAssign.jsx";
import Kgcas from "./Progress.jsx";
import GeminiQuizGenerator from "../../AIquiz/GeminiQuizGenerator.jsx";
import TestCreation from "./TestCreation.jsx";
import AssignTest from "./AssignTest.jsx";

function Dash() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 flex p-8 space-x-8">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">College</h1>
          <div className="flex justify-center">
            <DoughnutPieChart />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Skill</h1>
          <div className="flex justify-center">
            <Kgcas />
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashprofile() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <MainContent />
      </div>
    </div>
  );
}

export function Dashstudent() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <StudentsData />
      </div>
    </div>
  );
}

export function Dashproject() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <Addproject />
      </div>
    </div>
  );
}

export function DashAllProjects() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <Projects />
      </div>
    </div>
  );
}

export function DashBit() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <BitConfirm />
      </div>
    </div>
  );
}

export function AddQuizzes() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <AddQuestion />
      </div>
    </div>
  );
}

export function AddQuizzesWithAI() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <GeminiQuizGenerator />
      </div>
    </div>
  );
}

export function AssigningQuizz() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <QuizzAssign />
      </div>
    </div>
  );
}

export function TestCreationComponent() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <TestCreation />
      </div>
    </div>
  );
}

export function AssignTestComponent() {
  return (
    <div className="flex h-screen">
      <div className="w-1/5">
        <AdminMenu />
      </div>
      <div className="flex-1 p-8">
        <AssignTest />
      </div>
    </div>
  );
}

export default Dash;