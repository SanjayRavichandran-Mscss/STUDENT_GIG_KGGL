import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DoughnutPieChart from "./PieChart.jsx";
import { AdminMenu } from "./AdminMenu.jsx";
import StudentsData from "./StudentData.jsx";
import { Addproject } from "./Addproject.jsx";
import Projects from "./Projects.jsx";
import BitConfirm from "./BitConfirm.jsx";
import AddQuestion from "./AddQuestion.jsx";
import Kgcas from "./Progress.jsx";
import GeminiQuizGenerator from "./GeminiQuizGenerator.jsx";
import TestCreation from "./TestCreation.jsx";
import AssignTest from "./AssignTest.jsx";
import Addskill from "./Addskill.jsx";
import Score from "./Score.jsx";
import AddBulkQuestions from "./AddBulkQuestions.jsx";
import ApprovedProjects from "./ApprovedProjects.jsx";
import ViewQuestions from "./ViewQuestions.jsx";
import NonTechStudentsData from "./NonTechStudentsData.jsx";
import StudentRefer from "./StudentRefer.jsx";
import NoAdminAccess from "../superadmin_dashboard/NoAdminAccess.jsx";
import Ledger from "./Ledger.jsx";

// Add these imports to the existing imports
import ReceivableLedger from "./ReceivableLedger.jsx";
import PayableLedger from "./PayableLedger.jsx";

// Main layout container styles
const layoutContainerClass = "flex flex-col md:flex-row min-h-screen bg-gray-50";
const sidebarClass = "w-full md:w-64 flex-shrink-0";
const contentClass = "flex-1 overflow-auto p-4 md:p-8";

// Mapping of components to their menu names (from AdminAccessControl.jsx)
const componentMenuMap = {
  Dash: "Dashboard",
  Dashstudent: "Student Data",
  NonTechStudents: "Non-Tech Students",
  Scorearea: "Score Area",
  Dashproject: "Add Project",
  DashAllProjects: "All Projects",
  DashBit: "Bit Confirm",
  AddQuizzes: "Add Quizzes",
  AddQuizzesWithAI: "Add Quizzes with AI",
  AssigningQuizz: "Assign Quiz",
  TestCreationComponent: "Test Creation",
  Addskillpage: "Add Skill",
  AssignTestComponent: "Assign Test",
  AddBulkQuestionsComponent: "Add Bulk Questions",
  ApprovedProjectsComponent: "Approved Projects",
  ViewQuestionsComponent: "View Questions",
  StudentReferComponent: "Student Referral",
  LedgerComponent: "Ledger", 
   ReceivableLedgerComponent: "Receivable Ledger",
  PayableLedgerComponent: "Payable Ledger",
};

const usePermissions = (adminId, menuName) => {
  const [hasAccess, setHasAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const spadId = localStorage.getItem("spad_id");
        const accessToken = localStorage.getItem("accessToken");
        console.log("Permissions check:", { adminId, spadId, menuName });

        if (!spadId) {
          throw new Error("Missing spad_id");
        }
        if (!adminId) {
          throw new Error("Missing admin_id");
        }
        if (!accessToken) {
          throw new Error("Missing accessToken");
        }

        // Safely decode adminId
        let decodedAdminId;
        try {
          if (typeof adminId === "string" && /^[A-Za-z0-9+/=]+$/.test(adminId)) {
            decodedAdminId = atob(adminId);
          } else {
            decodedAdminId = adminId;
          }
        } catch (decodeError) {
          console.error("Failed to decode adminId:", decodeError);
          throw new Error("Invalid admin_id format");
        }
        console.log("Decoded adminId:", decodedAdminId);

        const response = await fetch("http://localhost:5000/api/superadmin/getpermissions", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Permissions API failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Permissions API response:", data);

        if (!data.status || !Array.isArray(data.result)) {
          throw new Error("Invalid permissions API response");
        }

        // Find permission for the specific admin_id, spad_id, and menu_name
        const permission = data.result.find(
          (perm) =>
            perm.admin_id === parseInt(decodedAdminId) &&
            perm.spad_id === parseInt(spadId) &&
            perm.menu_name === menuName &&
            perm.is_allow === 1
        );

        console.log("Permission found:", permission);
        setHasAccess(!!permission);
      } catch (err) {
        console.error("Permission error:", err.message);
        setError(err.message);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [adminId, menuName]);

  return { hasAccess, loading, error };
};

function Dash() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.Dash);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function Dashstudent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.Dashstudent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function NonTechStudents() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.NonTechStudents);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <NonTechStudentsData />
      </div>
    </div>
  );
}

function Scorearea() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.Scorearea);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function Dashproject() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.Dashproject);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function DashAllProjects() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.DashAllProjects);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function DashBit() {
  const { id: id } = useParams();
  const { hasAccess, loading, error } = usePermissions(id, componentMenuMap.DashBit);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function AddQuizzes() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.AddQuizzes);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function AddQuizzesWithAI() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.AddQuizzesWithAI);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function AssigningQuizz() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.AssigningQuizz);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <p className="text-gray-600">Assign Quiz functionality to be implemented</p>
      </div>
    </div>
  );
}

function TestCreationComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.TestCreationComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function Addskillpage() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.Addskillpage);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function AssignTestComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.AssignTestComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function AddBulkQuestionsComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.AddBulkQuestionsComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function ApprovedProjectsComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.ApprovedProjectsComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function ViewQuestionsComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.ViewQuestionsComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

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

function StudentReferComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.StudentReferComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

  let decodedAdminId;
  try {
    decodedAdminId = typeof adminId === "string" && /^[A-Za-z0-9+/=]+$/.test(adminId) ? atob(adminId) : adminId;
  } catch (decodeError) {
    console.error("Failed to decode adminId in StudentReferComponent:", decodeError);
    decodedAdminId = adminId;
  }

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <StudentRefer decodedAdminId={decodedAdminId} />
      </div>
    </div>
  );
}




function LedgerComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.LedgerComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <Ledger />
      </div>
    </div>
  );
}






// Remove LedgerComponent and add new components
function ReceivableLedgerComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.ReceivableLedgerComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <ReceivableLedger />
      </div>
    </div>
  );
}

function PayableLedgerComponent() {
  const { id: adminId } = useParams();
  const { hasAccess, loading, error } = usePermissions(adminId, componentMenuMap.PayableLedgerComponent);

  if (loading) {
    return (
      <div className={contentClass}>
        <p className="text-gray-600">Loading permissions...</p>
      </div>
    );
  }

  if (error || !hasAccess) {
    return (
      <div className={layoutContainerClass}>
        <div className={sidebarClass}>
          <AdminMenu />
        </div>
        <NoAdminAccess />
      </div>
    );
  }

  return (
    <div className={layoutContainerClass}>
      <div className={sidebarClass}>
        <AdminMenu />
      </div>
      <div className={contentClass}>
        <PayableLedger />
      </div>
    </div>
  );
}



export { Dash, Dashstudent, NonTechStudents, Scorearea, Dashproject, DashAllProjects, DashBit, AddQuizzes, AddQuizzesWithAI, AssigningQuizz, TestCreationComponent, Addskillpage, AssignTestComponent, AddBulkQuestionsComponent, ApprovedProjectsComponent, ViewQuestionsComponent, StudentReferComponent,LedgerComponent,  ReceivableLedgerComponent,
  PayableLedgerComponent,};