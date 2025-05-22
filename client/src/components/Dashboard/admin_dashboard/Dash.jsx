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
import Addskill from "./Addskill.jsx";
import Score from "./Score.jsx";
import AddBulkQuestions from "./AddBulkQuestions.jsx";
import ApprovedProjects from "./ApprovedProjects.jsx";
import TransactionDetails from "./TransactionDetails.jsx"; // Add new import
import ViewQuestions from "./ViewQuestions.jsx";

// Main layout container styles
const layoutContainerClass = "flex flex-col md:flex-row min-h-screen bg-gray-50";
const sidebarClass = "w-full md:w-64 flex-shrink-0"; // Fixed width for sidebar
const contentClass = "flex-1 overflow-auto p-4 md:p-8"; // Added overflow control

function Dash() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">College</h1>
            <div className="flex justify-center">
              <DoughnutPieChart />
            </div>
          </div>
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Skill</h1>
            <div className="flex justify-center">
              <Kgcas />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashprofile() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <MainContent />
      </div>
    </div>
  );
}

export function Dashstudent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <StudentsData />
      </div>
    </div>
  );
}

export function Scorearea() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <Score />
      </div>
    </div>
  );
}

export function Dashproject() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <Addproject />
      </div>
    </div>
  );
}

export function DashAllProjects() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <Projects />
      </div>
    </div>
  );
}

export function DashBit() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <BitConfirm />
      </div>
    </div>
  );
}

export function AddQuizzes() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <AddQuestion />
      </div>
    </div>
  );
}

export function AddQuizzesWithAI() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <GeminiQuizGenerator />
      </div>
    </div>
  );
}

export function AssigningQuizz() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <QuizzAssign />
      </div>
    </div>
  );
}

export function TestCreationComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={`${contentClass} flex flex-col`}>
        <div className="flex-1">
          <TestCreation />
        </div>
      </div>
    </div>
  );
}

export function Addskillpage() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <Addskill />
      </div>
    </div>
  );
}

export function AssignTestComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <AssignTest />
      </div>
    </div>
  );
}

export function AddBulkQuestionsComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <AddBulkQuestions />
      </div>
    </div>
  );
}

export function ApprovedProjectsComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <ApprovedProjects />
      </div>
    </div>
  );
}

export function TransactionDetailsComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <TransactionDetails />
      </div>
    </div>
  );
}


export function ViewQuestionsComponent() {
  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <ViewQuestions />
      </div>
    </div>
  );
}

export default Dash;