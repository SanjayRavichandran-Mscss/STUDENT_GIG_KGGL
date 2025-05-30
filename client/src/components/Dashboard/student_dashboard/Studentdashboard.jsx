// import { useParams } from "react-router-dom";
// import StudentMenu from "./StudentMenu";
// import StudentProject from "./StudentProject";
// import AttendTest from "./StudentTest/AttendTest";
// import Profile from "./Profile";
// import ProjectDetails from "./ProjectDetails";
// import MyTest from "./StudentTest/MyTest";
// import { useEffect, useState } from "react";
// import UserScoreDetails from "./StudentTest/StudentScore";
// import axios from "axios";

// export function StudentDashboard() {
//   const params = useParams();
//   const { id } = params;
//   const decodedId = atob(id);
//   const [credits, setCredits] = useState(0);
//   const [name, setName] = useState("");
//     const [data, setData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const[totalTest, setTotalTest] = useState(0);
//   console.log("StudentDashboard params:", params); // For debugging

//   useEffect(() => {
//     const fetchBidCredits = async () => {
//       try {
//         const response = await fetch(`http://103.118.158.24/api/api /stu/getBidCredits/${decodedId}`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch bid credits");
//         }

//         const data = await response.json();
//         console.log("Fetched bid credits:", data);
//         setCredits(data.bid_credits);
//         setName(data.name);
//       } catch (error) {
//         console.error("Error fetching bid credits:", error);
//       }
//     };

//     fetchBidCredits();
//   }, [decodedId]);


//     useEffect(() => {


//         const fetchData = async () => {
//             try {
//                 setLoading(true);
//                 const response = await axios.get(`http://103.118.158.24/api/api /stu/student-test-data/${decodedId}`);
//                 setData(response.data);
//                 const testsResponse = await axios.get(
//                     `http://103.118.158.24/api/api /test/all-tests/${decodedId}`,
//                     { withCredentials: true }
//                 );

//                 const allTests = testsResponse.data.map((test) => ({
//                     ...test,
//                     type: test.test_type, // Use test_type from API ('assigned' or 'skill')
//                 }));

//                 setTotalTest(allTests.length);

//                 setError(null);

//             } catch (err) {
//                 console.error("Error fetching data:", err);
//                 setError("Failed to load student data. Please try again.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [id]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }


//     if (error) {
//         return (
//             <div className="text-center py-10">
//                 <p className="text-red-600 text-lg">{error}</p>
//             </div>
//         );
//     }


//     if (!data || data.status !== "success") {
//         return (
//             <div className="text-center py-10">
//                 <p className="text-red-600 text-lg">No data available for this student.</p>
//             </div>
//         );
//     }
//     const { student } = data;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           {/* Nav Bar */}
//           <div className="">
//             <div>
//               <p className="text-black font-bold text-xl">Student Dashboard</p>
//             </div>

//             <div className="flex justify-between items-center mt-4">

//               <div className="mb-5 flex items-end">
//                 <p className="text-black-600 ">Credits: {credits}</p>
//               </div>
//             </div>
//               <div className="bg-white rounded-lg shadow-md p-6 mb-6">
//                   <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                       <div>
//                           <p className="text-sm font-medium text-gray-600">Name</p>
//                           <p className="text-lg text-gray-800 capitalize">{student.name}</p>
//                       </div>
//                       <div>
//                           <p className="text-sm font-medium text-gray-600">Roll No</p>
//                           <p className="text-lg text-gray-800">{student.roll_no || "N/A"}</p>
//                       </div>

//                       <div>
//                           <p className="text-sm font-medium text-gray-600">Test Assigned</p>
//                           <p className="text-lg text-gray-800">{totalTest|| "N/A"}</p>
//                       </div>
//                   </div>
//               </div>
//           </div>

//           <div>
//             {/* List of available projects */}
//           </div>
//           <StudentProject credits={credits} />
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
//           <AttendTest />
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

// export function StudentMyTests() {
//   const params = useParams();
//   console.log("StudentMyTests params:", params); // For debugging

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <MyTest />
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
//           {/* <EntryTest /> */}
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
//           <AttendTest />
//         </div>
//       </div>
//     </div>
//   );
// }

// export function StudentScore() {
//   const params = useParams();
//   console.log("StudentScore params:", params); // For debugging

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="flex flex-col md:flex-row">
//         {/* Sidebar - Student Menu */}
//         <div className="w-full md:w-64 bg-white shadow-md">
//           <StudentMenu />
//         </div>

//         {/* Main Content Area */}
//         <div className="flex-1 p-6">
//           <UserScoreDetails />
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
//           <AttendTest />
//         </div>
//       </div>
//     </div>
//   );
// }






































import { useParams } from "react-router-dom";
import StudentMenu from "./StudentMenu";
import StudentProject from "./StudentProject";
import AttendTest from "./StudentTest/AttendTest";
import Profile from "./Profile";
import ProjectDetails from "./ProjectDetails";
import MyTest from "./StudentTest/MyTest";
import { useEffect, useState } from "react";
import UserScoreDetails from "./StudentTest/StudentScore";
import axios from "axios";

export function StudentDashboard() {
  const params = useParams();
  const { id } = params;
  const decodedId = atob(id);
  const [credits, setCredits] = useState(0);
  const [name, setName] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTest, setTotalTest] = useState(0);

  console.log("StudentDashboard params:", params); // For debugging

  useEffect(() => {
    const fetchBidCredits = async () => {
      try {
        const response = await fetch(`http://103.118.158.24/api/api /stu/getBidCredits/${decodedId}`, {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://103.118.158.24/api/api /stu/student-test-data/${decodedId}`);
        setData(response.data);
        const testsResponse = await axios.get(
          `http://103.118.158.24/api/api /test/all-tests/${decodedId}`,
          { withCredentials: true }
        );

        const allTests = testsResponse.data.map((test) => ({
          ...test,
          type: test.test_type, // Use test_type from API ('assigned' or 'skill')
        }));

        setTotalTest(allTests.length);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load student data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  if (!data || data.status !== "success") {
    return (
      <div className="text-center py-10">
        <p className="text-red-600 text-lg">No data available for this student.</p>
      </div>
    );
  }

  const { student } = data;

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
              <p className="text-black font-bold text-xl">Student Dashboard</p>
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="mb-5 flex items-end">
                <p className="text-black-600 ">Credits: {credits}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Name</p>
                  <p className="text-lg text-gray-800 capitalize">{student.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Roll No</p>
                  <p className="text-lg text-gray-800">{student.roll_no || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Test Assigned</p>
                  <p className="text-lg text-gray-800">{totalTest || "N/A"}</p>
                </div>
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
          {/* <EntryTest /> */}
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
